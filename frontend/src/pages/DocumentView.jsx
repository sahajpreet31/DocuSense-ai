import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";
import AnalyticsPanel from "../components/AnalyticsPanel";
import EmptyState from "../components/EmptyState";
import TabBar from "../components/TabBar";
import {
  ChatSkeleton,
  SummarySkeleton,
  EntitiesSkeleton,
  ClassificationSkeleton,
  RiskFlagsSkeleton,
} from "../components/Skeleton";
import { ChatIcon, SummaryIcon, EntityIcon, TagIcon, AlertIcon, BarChartIcon, BotIcon } from "../components/TabIcons";
import { exportSummaryAsPdf } from "../utils/exportSummaryPdf";
import { getCachedTabData, getCachedTabDataSync } from "../utils/tabCache";
import { categoryStyle, categoryLabel } from "../utils/categoryStyles";

const TABS_CONFIG = [
  { name: "Chat", icon: ChatIcon },
  { name: "Summary", icon: SummaryIcon },
  { name: "Entities", icon: EntityIcon },
  { name: "Classification", icon: TagIcon },
  { name: "Risk Flags", icon: AlertIcon },
  { name: "Analytics", icon: BarChartIcon },
];

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

const SEVERITY_STYLES = {
  high: "bg-red-100 text-red-700",
  medium: "bg-orange-100 text-orange-700",
  low: "bg-yellow-100 text-yellow-700",
};

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

function formatTime(timestamp) {
  if (!timestamp) return "";
  return new Date(timestamp).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
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

    const userMessage = { role: "user", text: question, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setSending(true);
    setError("");

    try {
      const { data } = await api.post(`/api/documents/${documentId}/chat`, {
        question: userMessage.text,
      });
      setMessages((prev) => [...prev, { role: "ai", text: data.answer, timestamp: Date.now() }]);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to get a response. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex flex-col h-[28rem]">
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.length === 0 ? (
          <EmptyState
            icon={ChatIcon}
            title="Start a conversation"
            description="Ask a question about this document to get started."
          />
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-end gap-2 animate-fadeIn ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "ai" && (
                <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0">
                  <BotIcon className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[75%] flex flex-col ${
                  message.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`px-4 py-2.5 text-sm ${
                    message.role === "user"
                      ? "bg-indigo-600 text-white rounded-2xl rounded-br-md"
                      : "bg-white text-gray-800 shadow-sm border border-gray-100 rounded-2xl rounded-bl-md"
                  }`}
                >
                  {message.text}
                </div>
                <span className="text-[11px] text-gray-400 mt-1 px-1">
                  {formatTime(message.timestamp)}
                </span>
              </div>
            </div>
          ))
        )}
        {sending && (
          <div className="flex items-end gap-2 justify-start animate-fadeIn">
            <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0">
              <BotIcon className="w-4 h-4" />
            </div>
            <div className="bg-white shadow-sm border border-gray-100 text-gray-400 rounded-2xl rounded-bl-md px-4 py-2.5 text-sm">
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

function SummaryTab({ documentId, documentName, cache }) {
  const [summary, setSummary] = useState(() => getCachedTabDataSync(cache, documentId, "summary"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    setLoading(true);
    setError("");
    try {
      const result = await getCachedTabData(cache, documentId, "summary", () =>
        api.get(`/api/documents/${documentId}/summary`).then((r) => r.data.summary)
      );
      setSummary(result);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load summary");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <SummarySkeleton />;

  if (error) {
    return (
      <div>
        <p className="text-sm text-red-600 mb-3">{error}</p>
        <button
          onClick={handleGenerate}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          Try again
        </button>
      </div>
    );
  }

  if (summary === undefined) {
    return (
      <EmptyState
        icon={SummaryIcon}
        title="No summary yet"
        description="Generate an AI-written summary covering this document's key points."
        actionLabel="Generate Summary"
        onAction={handleGenerate}
      />
    );
  }

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

function EntitiesTab({ documentId, cache }) {
  const [entities, setEntities] = useState(() => getCachedTabDataSync(cache, documentId, "entities"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    setLoading(true);
    setError("");
    try {
      const result = await getCachedTabData(cache, documentId, "entities", () =>
        api.get(`/api/documents/${documentId}/entities`).then((r) => r.data.entities)
      );
      setEntities(result);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load entities");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <EntitiesSkeleton />;

  if (error) {
    return (
      <div>
        <p className="text-sm text-red-600 mb-3">{error}</p>
        <button
          onClick={handleGenerate}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          Try again
        </button>
      </div>
    );
  }

  if (entities === undefined) {
    return (
      <EmptyState
        icon={EntityIcon}
        title="No entities yet"
        description="Extract names, organizations, dates, money, and locations from this document."
        actionLabel="Extract Entities"
        onAction={handleGenerate}
      />
    );
  }

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

function ClassificationTab({ documentId, cache }) {
  const [result, setResult] = useState(() =>
    getCachedTabDataSync(cache, documentId, "classification")
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    setLoading(true);
    setError("");
    try {
      const data = await getCachedTabData(cache, documentId, "classification", () =>
        api.get(`/api/documents/${documentId}/classify`).then((r) => r.data)
      );
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to classify document");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <ClassificationSkeleton />;

  if (error) {
    return (
      <div>
        <p className="text-sm text-red-600 mb-3">{error}</p>
        <button
          onClick={handleGenerate}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          Try again
        </button>
      </div>
    );
  }

  if (result === undefined) {
    return (
      <EmptyState
        icon={TagIcon}
        title="Not classified yet"
        description="Let AI identify whether this document is a contract, invoice, report, resume, or research paper."
        actionLabel="Classify Document"
        onAction={handleGenerate}
      />
    );
  }

  const confidencePercent = Math.round((result?.confidence || 0) * 100);

  return (
    <div>
      <span
        className={`inline-block text-sm font-semibold px-4 py-1.5 rounded-full mb-5 ${categoryStyle(
          result?.category
        )}`}
      >
        {categoryLabel(result?.category)}
      </span>

      <div>
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
          <span>Confidence</span>
          <span>{confidencePercent}%</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-600 rounded-full transition-all duration-500"
            style={{ width: `${confidencePercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function RiskFlagsTab({ documentId, cache }) {
  const [risks, setRisks] = useState(() => getCachedTabDataSync(cache, documentId, "risk-flags"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    setLoading(true);
    setError("");
    try {
      const result = await getCachedTabData(cache, documentId, "risk-flags", () =>
        api.get(`/api/documents/${documentId}/risk-flags`).then((r) => r.data.risks || [])
      );
      setRisks(result);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load risk flags");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <RiskFlagsSkeleton />;

  if (error) {
    return (
      <div>
        <p className="text-sm text-red-600 mb-3">{error}</p>
        <button
          onClick={handleGenerate}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          Try again
        </button>
      </div>
    );
  }

  if (risks === undefined) {
    return (
      <EmptyState
        icon={AlertIcon}
        title="No risk scan yet"
        description="Scan this document for potentially risky clauses or terms."
        actionLabel="Scan for Risks"
        onAction={handleGenerate}
      />
    );
  }

  if (risks.length === 0) {
    return <p className="text-sm text-gray-400">No risk flags detected.</p>;
  }

  return (
    <div className="space-y-3">
      {risks.map((risk, index) => (
        <div key={index} className="border border-gray-100 rounded-xl p-4">
          <div className="flex items-center justify-between mb-1.5">
            <h4 className="font-semibold text-gray-900 text-sm">{risk.title}</h4>
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                SEVERITY_STYLES[risk.severity] || "bg-gray-100 text-gray-600"
              }`}
            >
              {risk.severity}
            </span>
          </div>
          <p className="text-sm text-gray-600">{risk.description}</p>
        </div>
      ))}
    </div>
  );
}

function AnalyticsTab({ documentId, cache }) {
  const [started, setStarted] = useState(
    () => getCachedTabDataSync(cache, documentId, "analytics") !== undefined
  );

  if (!started) {
    return (
      <EmptyState
        icon={BarChartIcon}
        title="No analytics yet"
        description="Generate word count, readability, and keyword analytics for this document."
        actionLabel="Generate Analytics"
        onAction={() => setStarted(true)}
      />
    );
  }

  return (
    <AnalyticsPanel
      fetchAnalytics={() =>
        getCachedTabData(cache, documentId, "analytics", () =>
          api.get(`/api/documents/${documentId}/analytics`).then((r) => r.data.analytics)
        )
      }
    />
  );
}

export default function DocumentView() {
  const { id } = useParams();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("Chat");
  const [chatMessages, setChatMessages] = useState([]);
  const cache = useRef({});

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

  useEffect(() => {
    setChatMessages([]);
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
                        {categoryLabel(doc.category)}
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
              <TabBar tabs={TABS_CONFIG} activeTab={activeTab} onChange={setActiveTab} />

              <div key={activeTab} className="animate-fadeIn">
                {activeTab === "Chat" && (
                  <ChatTab documentId={id} messages={chatMessages} setMessages={setChatMessages} />
                )}
                {activeTab === "Summary" && (
                  <SummaryTab key={id} documentId={id} documentName={doc.originalName} cache={cache} />
                )}
                {activeTab === "Entities" && (
                  <EntitiesTab key={id} documentId={id} cache={cache} />
                )}
                {activeTab === "Classification" && (
                  <ClassificationTab key={id} documentId={id} cache={cache} />
                )}
                {activeTab === "Risk Flags" && (
                  <RiskFlagsTab key={id} documentId={id} cache={cache} />
                )}
                {activeTab === "Analytics" && (
                  <AnalyticsTab key={id} documentId={id} cache={cache} />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
