const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  documentId: { type: String, required: true },
  category: { type: String, default: null },
  uploadedAt: { type: Date, default: Date.now },
  size: { type: Number, required: true },
});

module.exports = mongoose.model("Document", documentSchema);
