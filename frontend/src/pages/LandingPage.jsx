import { useState } from "react";
import { Link } from "react-router-dom";
import UserMenu from "../components/UserMenu";

function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
      <path
        d="M12 16V4m0 0L7 9m5-5l5 5M5 16v2a2 2 0 002 2h10a2 2 0 002-2v-2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
      <path
        d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 20l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SummaryIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
      <path
        d="M4 6h16M4 12h16M4 18h10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EntityIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
      <path
        d="M20.59 13.41L11 3.83A2 2 0 009.59 3.24L4 3a1 1 0 00-1 1l.24 5.59a2 2 0 00.58 1.41l9.59 9.59a2 2 0 002.83 0l4.35-4.35a2 2 0 000-2.83z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="7.5" cy="7.5" r="1.2" fill="currentColor" />
    </svg>
  );
}

function BarChartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
      <path
        d="M4 20V10m6.5 10V4m6.5 16v-7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
      <path
        d="M6 4h8l6 8-6 8H6a2 2 0 01-2-2V6a2 2 0 012-2z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="14" cy="12" r="1.2" fill="currentColor" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
      <path
        d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
      <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 11V8a4 4 0 018 0v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="15.5" r="1.3" fill="currentColor" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
      <path
        d="M5 13l4 4L19 7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BrainIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
      <path
        d="M9 4a3 3 0 00-3 3 3 3 0 00-1.5 5.6A3 3 0 007 18a3 3 0 002-1 3 3 0 002 1 3 3 0 002.5-5.4A3 3 0 0015 7a3 3 0 00-3-3 3 3 0 00-3 0z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9 4v14M15 7v11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
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

const PRIVACY_POINTS = [
  {
    icon: ShieldIcon,
    title: "Data Deletion",
    description:
      "Delete your documents anytime. Files are permanently removed from all our systems instantly.",
  },
  {
    icon: LockIcon,
    title: "No AI Training",
    description: "Your documents are never used to train AI models. Your data belongs to you alone.",
  },
  {
    icon: CheckIcon,
    title: "Security & Compliance",
    description: "All data encrypted in transit and at rest. Industry-standard security practices.",
  },
];

const SECURITY_PROCESS_STEPS = [
  {
    icon: UploadIcon,
    title: "Data Collection",
    description: "PDF uploaded securely over encrypted connection",
  },
  {
    icon: BrainIcon,
    title: "AI/ML Engine",
    description: "Document processed locally, embeddings generated",
  },
  {
    icon: SearchIcon,
    title: "Analysis",
    description: "Content analyzed, insights extracted instantly",
  },
  {
    icon: TrashIcon,
    title: "You're in Control",
    description:
      "Delete documents whenever you choose. Your data, your rules — remove anything anytime with one click.",
  },
];

const FEATURES = [
  {
    icon: UploadIcon,
    title: "PDF Upload",
    description: "Drag and drop any PDF document and let DocuSense AI process it in seconds.",
  },
  {
    icon: ChatIcon,
    title: "AI Chat",
    description: "Ask questions about your document in plain English and get instant, accurate answers.",
  },
  {
    icon: SummaryIcon,
    title: "Auto Summary",
    description: "Get a concise, AI-generated summary of even the longest documents.",
  },
  {
    icon: EntityIcon,
    title: "Entity Extraction",
    description: "Automatically pull out names, dates, organizations, and amounts from any document.",
  },
  {
    icon: BarChartIcon,
    title: "Text Analytics",
    description: "Get instant word count, readability score, reading time, and top keyword frequency analysis for any document.",
  },
  {
    icon: TagIcon,
    title: "Document Classification",
    description: "AI automatically identifies whether your document is a contract, invoice, report, resume, or research paper.",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Upload",
    description: "Upload any PDF document to your secure DocuSense AI workspace.",
  },
  {
    number: "02",
    title: "Analyze",
    description: "Our AI reads, chunks, and embeds your document for deep understanding.",
  },
  {
    number: "03",
    title: "Discover",
    description: "Chat with your document, extract entities, and uncover insights instantly.",
  },
];

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(localStorage.getItem("token")));

  const ctaTarget = isLoggedIn ? "/dashboard" : "/signup";

  return (
    <div className="min-h-screen bg-surface text-gray-900">
      <nav className="sticky top-4 z-20 px-4">
        <div className="max-w-5xl mx-auto bg-white/95 backdrop-blur shadow-sm border border-gray-100 rounded-full px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
              D
            </div>
            <span className="text-lg font-bold">DocuSense AI</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#home" className="hover:text-indigo-600 transition">
              Home
            </a>
            <a href="#features" className="hover:text-indigo-600 transition">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-indigo-600 transition">
              How It Works
            </a>
            <a href="#privacy" className="hover:text-indigo-600 transition">
              Data Privacy
            </a>
          </div>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <UserMenu onLogout={() => setIsLoggedIn(false)} />
            ) : (
              <>
                <Link
                  to="/login"
                  className="border border-indigo-600 text-indigo-600 hover:bg-indigo-50 text-sm font-semibold rounded-full px-5 py-2 transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-full px-5 py-2 transition"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <section id="home" className="max-w-4xl mx-auto px-6 pt-24 pb-20 text-center">
        <span className="inline-block bg-indigo-100 text-indigo-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
          RAG Powered
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6">
          Intelligent Document Analysis
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
          Upload any document and let DocuSense AI summarize, chat, and extract key information
          for you — turning hours of reading into seconds of insight.
        </p>
        <Link
          to={ctaTarget}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-lg rounded-xl px-8 py-3.5 transition shadow-lg shadow-indigo-200"
        >
          Start Analyzing
          <span aria-hidden="true">→</span>
        </Link>
      </section>

      <section id="features" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold mb-3">Everything you need to understand your documents</h2>
          <p className="text-gray-500">A complete toolkit for fast, intelligent document analysis.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <Link
              key={title}
              to={ctaTarget}
              className="block bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 p-6 transition cursor-pointer hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <Icon />
              </div>
              <h3 className="font-semibold text-lg mb-2">{title}</h3>
              <p className="text-sm text-gray-500">{description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="bg-indigo-600">
        <div className="max-w-6xl mx-auto px-6 py-20 text-white">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3">How It Works</h2>
            <p className="text-indigo-200">From upload to insight in three simple steps.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {STEPS.map(({ number, title, description }) => (
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

      <section id="privacy" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold mb-3">Your Privacy, Our Priority</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRIVACY_POINTS.map(({ icon: Icon, title, description }) => (
            <div key={title} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SECURITY_PROCESS_STEPS.map(({ icon: Icon, title, description }) => (
              <div key={title} className="text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-white/10 border border-white/20 flex items-center justify-center mb-4">
                  <Icon />
                </div>
                <h3 className="font-semibold text-lg mb-2">{title}</h3>
                <p className="text-indigo-100 text-sm max-w-xs mx-auto">{description}</p>
              </div>
            ))}
          </div>
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
