import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { categoryStyle, categoryLabel } from "../utils/categoryStyles";

const ML_SERVICE_URL = "https://sahajpreek19-docusense-ml.hf.space";

const SAMPLE_DOCUMENTS = [
  { id: "sample-1", name: "Employment_Contract.pdf", category: "contract", date: "Jan 15, 2024" },
  { id: "sample-2", name: "Research_Paper.pdf", category: "research_paper", date: "Feb 2, 2024" },
  { id: "sample-3", name: "Invoice_INV-2024.pdf", category: "invoice", date: "Mar 10, 2024" },
];

export default function DemoDashboard() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFileSelected(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setError("");

    try {
      const response = await fetch(`${ML_SERVICE_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      localStorage.setItem("demo_document_name", file.name);
      navigate(`/demo/document/${data.document_id}`);
    } catch (err) {
      setError(err.message || "Upload failed. Is the ML service running on port 5001?");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div className="min-h-screen bg-surface">
      <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
            D
          </div>
          <span className="text-lg font-bold text-gray-900">DocuSense AI</span>
        </Link>

        <div className="flex items-center gap-4">
          <span className="text-xs font-semibold text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full">
            Demo Mode
          </span>
          <Link to="/" className="text-sm text-gray-500 hover:text-indigo-600 transition">
            Exit Demo
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Try DocuSense AI</h1>
            <p className="text-gray-500 text-sm mt-1">
              Upload a real PDF to test AI analysis — no account needed.
            </p>
          </div>

          <div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg px-5 py-2.5 text-sm transition disabled:opacity-60"
            >
              {uploading ? "Uploading..." : "Upload PDF"}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SAMPLE_DOCUMENTS.map((doc) => (
            <div
              key={doc.id}
              title="Sample card — upload a real PDF to analyze it"
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 opacity-80 cursor-not-allowed select-none"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-semibold text-xs">
                  PDF
                </div>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${categoryStyle(doc.category)}`}
                >
                  {categoryLabel(doc.category)}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 truncate mb-1">{doc.name}</h3>
              <p className="text-xs text-gray-500">Uploaded {doc.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
