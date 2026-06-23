import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

const CATEGORY_STYLES = {
  contract: "bg-indigo-100 text-indigo-700",
  invoice: "bg-emerald-100 text-emerald-700",
  report: "bg-blue-100 text-blue-700",
  resume: "bg-purple-100 text-purple-700",
  research_paper: "bg-amber-100 text-amber-700",
};

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
      <path
        d="M5 7h14M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-9 0l1 13a1 1 0 001 1h8a1 1 0 001-1l1-13"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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

export default function Dashboard() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  async function fetchDocuments() {
    try {
      const { data } = await api.get("/api/documents");
      setDocuments(data.documents || []);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load documents");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDocuments();
  }, []);

  async function handleFileSelected(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setError("");

    try {
      await api.post("/api/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await fetchDocuments();
    } catch (err) {
      setError(err.response?.data?.error || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleDelete(e, docId) {
    e.stopPropagation();

    if (!window.confirm("Are you sure you want to delete this document? This cannot be undone.")) {
      return;
    }

    setDeletingId(docId);
    setError("");

    try {
      await api.delete(`/api/documents/${docId}`);
      setDocuments((prev) => prev.filter((doc) => doc._id !== docId));
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete document. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Your Documents</h1>
            <p className="text-gray-500 text-sm mt-1">Upload and analyze your documents with AI</p>
          </div>

          <div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg px-5 py-2.5 text-sm transition disabled:opacity-60"
            >
              {uploading ? "Uploading..." : "+ Upload New Document"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={handleFileSelected}
              className="hidden"
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-gray-500 text-sm">Loading documents...</p>
        ) : documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center bg-white rounded-2xl shadow-sm border border-gray-100 py-20">
            <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mb-4 text-2xl">
              📄
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No documents yet</h3>
            <p className="text-gray-500 text-sm mb-6">
              Upload your first PDF to get started with AI analysis
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg px-5 py-2.5 text-sm transition"
            >
              Upload Document
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {documents.map((doc) => (
              <div
                key={doc._id}
                className="relative group bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 transition"
              >
                <button
                  onClick={(e) => handleDelete(e, doc._id)}
                  disabled={deletingId === doc._id}
                  title="Delete document"
                  className="absolute top-3 right-3 w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition opacity-0 group-hover:opacity-100 disabled:opacity-60"
                >
                  <TrashIcon />
                </button>

                <button
                  onClick={() => navigate(`/documents/${doc._id}`)}
                  className="w-full text-left p-5"
                >
                  <div className="flex items-start justify-between mb-3 pr-8">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-semibold text-xs">
                      PDF
                    </div>
                    {doc.category && (
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${categoryStyle(
                          doc.category
                        )}`}
                      >
                        {doc.category.replace("_", " ")}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 truncate mb-1">{doc.originalName}</h3>
                  <p className="text-xs text-gray-500">Uploaded {formatDate(doc.uploadedAt)}</p>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
