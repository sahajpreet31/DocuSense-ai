# DocuSense AI 🧠📄

[![Live Demo](https://img.shields.io/badge/Live-Demo-6366f1?style=for-the-badge)](https://docusenseai-beta.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/sahajpreet31/DocuSense-ai)

> An intelligent document analysis platform — upload any PDF and instantly chat with it, extract insights, summarize content, and uncover risks using RAG + Gemini AI.

---

## ✨ Features

- 💬 **AI Document Chat** — Natural language Q&A over your PDF using RAG pipeline
- 📝 **Auto Summarization** — Instant bullet-point summaries
- 🏷️ **Entity Extraction** — Names, dates, organizations, amounts
- 📊 **Document Classification** — 11 categories (Contract, Resume, JD, Research Paper, Study Material, and more)
- ⚠️ **Risk Flagging** — Detects unusual clauses and red flags with severity levels
- 📈 **Text Analytics** — Readability score, word count, keyword frequency chart
- 📥 **Export as PDF** — Download your document summary
- 🔐 **Secure Auth** — JWT + bcrypt with full user account management

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React.js, Vite, Tailwind CSS, Recharts |
| Backend | Node.js, Express.js, MongoDB, JWT |
| ML Service | Python, Flask, LangChain, Gemini API, ChromaDB |
| Deployment | Vercel + Render + Hugging Face Spaces |

---

## 🏗️ Architecture

```
React Frontend (Vercel)
        ↓
Node.js Backend (Render) → MongoDB Atlas
        ↓
Python/Flask ML Service (Hugging Face Spaces)
  └── LangChain + Gemini API + ChromaDB
```

---

## 🚀 Live Demo

**[https://docusenseai-beta.vercel.app](https://docusenseai-beta.vercel.app)**

---

Made with ❤️ by [Sahajpreet Kaur](https://github.com/sahajpreet31)
