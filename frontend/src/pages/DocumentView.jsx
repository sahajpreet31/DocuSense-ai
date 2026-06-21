import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";
import AnalyticsPanel from "../components/AnalyticsPanel";
import { exportSummaryAsPdf } from "../utils/exportSummaryPdf";

const TABS = ["Chat", "Summary", "Entities", "Classification", "Analytics"];

const CATEGORY_STYLES = {
  contract: "bg-indigo-100 text-indigo-700",
  invoice: "bg-emerald-100 text-emerald-700",
  report: "bg-blue-100 text-blue-700",
  resume: "bg-purple-100 text-purple-700",
  research_paper: "bg-amber-100 text-amber-700",
};

const ENTITY_STYLES = {
  names: "bg-blue-100 text-blue-700",
  organizations: "bg-purple-100 text-purple-700",
  dates: "bg-amber-100 text-amber-700",
  money: "bg-emerald-100 text-emerald-700",
  locations: "bg-pink-100 text-pink-700",
};

const ENTITY_LABELS = {
  names: "Names",
  organizations: "Organizations",
  dates: "Dates",
  money: "Money",
  locations: "Locations",
};

function categoryStyle(category) {
  return CATEGORY_STYLES[category] || "bg-gray-100 text-gray-600";
}

function formatDate(dateString) {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatBytes(bytes) {
  if (!bytes) return "—";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

function renderInlineMarkdown(text) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, index) =>
    index % 2 === 1 ? <strong key={index}>{part}</strong> : part
  );
}

function renderMarkdown(text) {
  if (!text) return null;

  const blocks = [];
  let currentList = [];

  function flushList() {
    if (currentList.length > 0) {
      blocks.push(
        <ul key={`ul-${blocks.length}`} className="list-disc pl-5 space-y-1">
          {currentList}
        </ul>
      );
      currentList = [];
    }
  }

  text.split("\n").forEach((line, index) => {
    const trimmed = line.trim();
    const bulletMatch = trimmed.match(/^[*-]\s+(.*)/);

    if (bulletMatch) {
      currentList.push(<li key={index}>{renderInlineMarkdown(bulletMatch[1])}</li>);
    } else if (trimmed === "") {
      flushList();
    } else {
      flushList();
      blocks.push(<p key={index}>{renderInlineMarkdown(trimmed)}</p>);
    }
  });

  flushList();
  return blocks;
}

function ChatTab({ documentId, messages, setMessages }) {
  const [question, setQuestion] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function handleSend(e) {
    e.preventDefault();
    if (!question.trim()) return;

    const userMessage = { role: "user", text: question };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setSending(true);
    setError("");

    try {
      const { data } = await api.post(`/api/documents/${documentId}/chat`, {
        question: userMessage.text,
      });
      setMessages((prev) => [...prev, { role: "ai", text: data.answer }]);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to get a response. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex flex-col h-[28rem]">
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {messages.length === 0 ? (
          <p className="text-sm text-gray-400 text-center mt-16">
            Ask a question about this document to get started.
          </p>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                  message.role === "user"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))
        )}
        {sending && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-400 rounded-2xl px-4 py-2.5 text-sm">
              Thinking...
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}

      <form onSubmit={handleSend} className="flex items-center gap-2 mt-4 border-t border-gray-100 pt-4">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question about this document..."
          className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <button
          type="submit"
          disabled={sending}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg px-5 py-2.5 text-sm transition disabled:opacity-60"
        >
          Send
        </button>
      </form>
    </div>
  );
}

function SummaryTab({ documentId, documentName }) {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchSummary() {
      try {
        const { data } = await api.get(`/api/documents/${documentId}/summary`);
        if (isMounted) setSummary(data.summary);
      } catch (err) {
        if (isMounted) setError(err.response?.data?.error || "Failed to load summary");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchSummary();
    return () => {
      isMounted = false;
    };
  }, [documentId]);

  if (loading) return <p className="text-sm text-gray-500">Generating summary...</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;

  return (
    <div>
      <div className="flex justify-end mb-3">
        <button
          onClick={() => exportSummaryAsPdf({ documentName, summary })}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700 border border-indigo-200 hover:bg-indigo-50 rounded-lg px-3 py-1.5 transition"
        >
          Export PDF
        </button>
      </div>
      <div className="text-sm text-gray-700 leading-relaxed space-y-2">{renderMarkdown(summary)}</div>
    </div>
  );
}

function EntitiesTab({ documentId }) {
  const [entities, setEntities] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchEntities() {
      try {
        const { data } = await api.get(`/api/documents/${documentId}/entities`);
        if (isMounted) setEntities(data.entities);
      } catch (err) {
        if (isMounted) setError(err.response?.data?.error || "Failed to load entities");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchEntities();
    return () => {
      isMounted = false;
    };
  }, [documentId]);

  if (loading) return <p className="text-sm text-gray-500">Extracting entities...</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;

  const groups = Object.keys(ENTITY_LABELS).filter((key) => entities?.[key]?.length);

  if (groups.length === 0) {
    return <p className="text-sm text-gray-400">No entities found in this document.</p>;
  }

  return (
    <div className="space-y-5">
      {groups.map((key) => (
        <div key={key}>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            {ENTITY_LABELS[key]}
          </h4>
          <div className="flex flex-wrap gap-2">
            {entities[key].map((value, index) => (
              <span
                key={index}
                className={`text-xs font-medium px-3 py-1 rounded-full ${ENTITY_STYLES[key]}`}
              >
                {value}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ClassificationTab({ documentId }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchClassification() {
      try {
        const { data } = await api.get(`/api/documents/${documentId}/classify`);
        if (isMounted) setResult(data);
      } catch (err) {
        if (isMounted) setError(err.response?.data?.error || "Failed to classify document");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchClassification();
    return () => {
      isMounted = false;
    };
  }, [documentId]);

  if (loading) return <p className="text-sm text-gray-500">Classifying document...</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;

  const confidencePercent = Math.round((result?.confidence || 0) * 100);

  return (
    <div>
      <span
        className={`inline-block text-sm font-semibold px-4 py-1.5 rounded-full mb-5 ${categoryStyle(
          result?.category
        )}`}
      >
        {result?.category?.replace("_", " ")}
      </span>

      <div>
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
          <span>Confidence</span>
          <span>{confidencePercent}%</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-600 rounded-full"
            style={{ width: `${confidencePercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default function DocumentView() {
  const { id } = useParams();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("Chat");
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    let isMounted = true;

    async function fetchDocument() {
      try {
        const { data } = await api.get(`/api/documents/${id}`);
        if (isMounted) setDoc(data.document);
      } catch (err) {
        if (isMounted) setError(err.response?.data?.error || "Failed to load document");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchDocument();
    return () => {
      isMounted = false;
    };
  }, [id]);

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">
        {loading ? (
          <p className="text-sm text-gray-500">Loading document...</p>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-semibold text-sm mb-4">
                PDF
              </div>
              <h2 className="text-lg font-bold text-gray-900 break-words mb-4">
                {doc.originalName}
              </h2>

              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Category</dt>
                  <dd>
                    {doc.category ? (
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${categoryStyle(
                          doc.category
                        )}`}
                      >
                        {doc.category.replace("_", " ")}
                      </span>
                    ) : (
                      <span className="text-gray-400">Uncategorized</span>
                    )}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Uploaded</dt>
                  <dd className="text-gray-700">{formatDate(doc.uploadedAt)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Size</dt>
                  <dd className="text-gray-700">{formatBytes(doc.size)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Document ID</dt>
                  <dd className="text-gray-700 truncate max-w-[140px]" title={doc.documentId}>
                    {doc.documentId}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex gap-2 border-b border-gray-100 mb-6">
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2.5 text-sm font-medium border-b-2 transition ${
                      activeTab === tab
                        ? "border-indigo-600 text-indigo-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {activeTab === "Chat" && (
                <ChatTab documentId={id} messages={chatMessages} setMessages={setChatMessages} />
              )}
              {activeTab === "Summary" && (
                <SummaryTab documentId={id} documentName={doc.originalName} />
              )}
              {activeTab === "Entities" && <EntitiesTab documentId={id} />}
              {activeTab === "Classification" && <ClassificationTab documentId={id} />}
              {activeTab === "Analytics" && (
                <AnalyticsPanel
                  fetchAnalytics={() =>
                    api.get(`/api/documents/${id}/analytics`).then((r) => r.data.analytics)
                  }
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
