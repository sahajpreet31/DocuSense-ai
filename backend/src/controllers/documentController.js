const Document = require("../models/Document");

const ML_SERVICE_URL = process.env.ML_SERVICE_URL;

async function uploadDocument(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const formData = new FormData();
  formData.append("file", new Blob([req.file.buffer]), req.file.originalname);

  const mlResponse = await fetch(`${ML_SERVICE_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!mlResponse.ok) {
    const details = await mlResponse.json().catch(() => ({}));
    return res.status(502).json({ error: "ML service upload failed", details });
  }

  const mlData = await mlResponse.json();

  const document = await Document.create({
    userId: req.userId,
    filename: mlData.filename,
    originalName: req.file.originalname,
    documentId: mlData.document_id,
    size: req.file.size,
  });

  res.status(201).json({ document });
}

async function getDocuments(req, res) {
  const documents = await Document.find({ userId: req.userId }).sort({ uploadedAt: -1 });
  res.json({ documents });
}

async function getDocument(req, res) {
  const document = await Document.findOne({ _id: req.params.id, userId: req.userId });

  if (!document) {
    return res.status(404).json({ error: "Document not found" });
  }

  res.json({ document });
}

async function deleteDocument(req, res) {
  const document = await Document.findOneAndDelete({ _id: req.params.id, userId: req.userId });

  if (!document) {
    return res.status(404).json({ error: "Document not found" });
  }

  res.json({ message: "Document deleted" });
}

async function chatWithDocument(req, res) {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: "question is required" });
  }

  const document = await Document.findOne({ _id: req.params.id, userId: req.userId });
  if (!document) {
    return res.status(404).json({ error: "Document not found" });
  }

  const mlResponse = await fetch(`${ML_SERVICE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ document_id: document.documentId, question }),
  });

  const mlData = await mlResponse.json();
  if (!mlResponse.ok) {
    return res.status(502).json({ error: "ML service chat failed", details: mlData });
  }

  res.json({ answer: mlData.answer });
}

async function getSummary(req, res) {
  const document = await Document.findOne({ _id: req.params.id, userId: req.userId });
  if (!document) {
    return res.status(404).json({ error: "Document not found" });
  }

  const mlResponse = await fetch(`${ML_SERVICE_URL}/summarize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ document_id: document.documentId }),
  });

  const mlData = await mlResponse.json();
  if (!mlResponse.ok) {
    return res.status(502).json({ error: "ML service summarize failed", details: mlData });
  }

  res.json({ summary: mlData.summary });
}

async function getEntities(req, res) {
  const document = await Document.findOne({ _id: req.params.id, userId: req.userId });
  if (!document) {
    return res.status(404).json({ error: "Document not found" });
  }

  const mlResponse = await fetch(`${ML_SERVICE_URL}/entities`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ document_id: document.documentId }),
  });

  const mlData = await mlResponse.json();
  if (!mlResponse.ok) {
    return res.status(502).json({ error: "ML service entities failed", details: mlData });
  }

  res.json({ entities: mlData.entities });
}

async function getClassification(req, res) {
  const document = await Document.findOne({ _id: req.params.id, userId: req.userId });
  if (!document) {
    return res.status(404).json({ error: "Document not found" });
  }

  const mlResponse = await fetch(`${ML_SERVICE_URL}/classify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ document_id: document.documentId }),
  });

  const mlData = await mlResponse.json();
  if (!mlResponse.ok) {
    return res.status(502).json({ error: "ML service classify failed", details: mlData });
  }

  document.category = mlData.category;
  await document.save();

  res.json({ category: mlData.category, confidence: mlData.confidence });
}

async function getAnalytics(req, res) {
  const document = await Document.findOne({ _id: req.params.id, userId: req.userId });
  if (!document) {
    return res.status(404).json({ error: "Document not found" });
  }

  const mlResponse = await fetch(`${ML_SERVICE_URL}/analytics`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ document_id: document.documentId }),
  });

  const mlData = await mlResponse.json();
  if (!mlResponse.ok) {
    return res.status(502).json({ error: "ML service analytics failed", details: mlData });
  }

  res.json({ analytics: mlData.analytics });
}

module.exports = {
  uploadDocument,
  getDocuments,
  getDocument,
  deleteDocument,
  chatWithDocument,
  getSummary,
  getEntities,
  getClassification,
  getAnalytics,
};
