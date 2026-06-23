import { Link } from "react-router-dom";

function ShieldIcon({ className = "w-6 h-6" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 12l2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
      <path
        d="M5 7h14M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m1 0v12a2 2 0 01-2 2H9a2 2 0 01-2-2V7h10z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function NoAiIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
      <rect x="8" y="8" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M9 4v2M15 4v2M9 18v2M15 18v2M4 9h2M4 15h2M18 9h2M18 15h2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="10.5" stroke="currentColor" strokeWidth="1.6" />
      <line x1="5" y1="19" x2="19" y2="5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
      <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 11V8a4 4 0 018 0v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="15.5" r="1.3" fill="currentColor" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 flex-shrink-0">
      <path
        d="M5 13l4 4L19 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 flex-shrink-0">
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const DATA_PRINCIPLES = [
  {
    icon: TrashIcon,
    title: "Data Deletion",
    description:
      "Documents are permanently deleted from all our systems when you delete them. No traces left.",
  },
  {
    icon: NoAiIcon,
    title: "No AI Training",
    description: "Your documents are never used to train AI models. Your data is yours alone.",
  },
  {
    icon: LockIcon,
    title: "Security & Compliance",
    description:
      "All data is encrypted in transit and at rest. We follow industry security standards.",
  },
];

const PROCESS_STEPS = [
  {
    number: "01",
    title: "Upload",
    description: "Your PDF is sent over an encrypted connection to our secure servers.",
  },
  {
    number: "02",
    title: "Process",
    description: "The document is parsed and split into text chunks for analysis.",
  },
  {
    number: "03",
    title: "Analyze",
    description: "AI reads the content to answer questions, summarize, and extract insights.",
  },
  {
    number: "04",
    title: "Auto-Delete",
    description: "Once you delete a document, its content is purged from every system we use.",
  },
];

const STORED_TEMPORARILY = [
  "Document text chunks, kept only to power chat, summary, and analysis features",
  "Your account info (name, email) for login and session management",
  "Chat history for a document, so you can revisit a conversation",
];

const NEVER_RETAINED = [
  "Original file content, once you delete a document",
  "Any data used to train or fine-tune AI models",
  "Document data shared with third parties for marketing or analytics",
];

export default function DataPrivacy() {
  return (
    <div className="min-h-screen bg-surface text-gray-900">
      <nav className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
              D
            </div>
            <span className="text-lg font-bold">DocuSense AI</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <Link to="/" className="hover:text-indigo-600 transition">
              Home
            </Link>
            <Link to="/#features" className="hover:text-indigo-600 transition">
              Features
            </Link>
            <Link to="/#how-it-works" className="hover:text-indigo-600 transition">
              How It Works
            </Link>
            <span className="text-indigo-600">Data Privacy</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/demo"
              className="border border-indigo-600 text-indigo-600 hover:bg-indigo-50 text-sm font-semibold rounded-lg px-5 py-2.5 transition"
            >
              Try Demo
            </Link>
            <Link
              to="/signup"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg px-5 py-2.5 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <section className="bg-indigo-600 text-white">
        <div className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-white/10 border border-white/20 flex items-center justify-center mb-6">
            <ShieldIcon className="w-8 h-8" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-5">
            Your Privacy is Our Priority
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl mx-auto">
            We built DocuSense AI so you can analyze sensitive documents with confidence. Here's
            exactly how we handle, store, and protect your data.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold mb-3">How We Handle Your Data</h2>
          <p className="text-gray-500">Three commitments we never compromise on.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {DATA_PRINCIPLES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <Icon />
              </div>
              <h3 className="font-semibold text-lg mb-2">{title}</h3>
              <p className="text-sm text-gray-500">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-indigo-600">
        <div className="max-w-6xl mx-auto px-6 py-20 text-white">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3">Our Data Security Process</h2>
            <p className="text-indigo-200">What happens to your document, from upload to deletion.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {PROCESS_STEPS.map(({ number, title, description }) => (
              <div key={number} className="text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xl font-bold mb-5">
                  {number}
                </div>
                <h3 className="font-semibold text-xl mb-2">{title}</h3>
                <p className="text-indigo-100 text-sm max-w-xs mx-auto">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold mb-3">Data Storage</h2>
          <p className="text-gray-500">What we keep while you use DocuSense AI, and what we don't.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-lg mb-4 text-gray-900">Stored Temporarily</h3>
            <ul className="space-y-3">
              {STORED_TEMPORARILY.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600">
                  <span className="text-indigo-600 mt-0.5">
                    <CheckIcon />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-lg mb-4 text-gray-900">Never Retained</h3>
            <ul className="space-y-3">
              {NEVER_RETAINED.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600">
                  <span className="text-red-500 mt-0.5">
                    <XIcon />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="bg-indigo-600 rounded-3xl px-8 py-14 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to analyze your documents securely?</h2>
          <p className="text-indigo-100 mb-8 max-w-xl mx-auto">
            Join DocuSense AI and experience AI-powered document analysis without compromising
            your privacy.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 bg-white text-indigo-600 hover:bg-indigo-50 font-semibold text-lg rounded-xl px-8 py-3.5 transition shadow-lg"
          >
            Get Started
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <footer className="bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
              D
            </div>
            <span className="font-semibold text-gray-700">DocuSense AI</span>
          </div>
          <p>© {new Date().getFullYear()} DocuSense AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
