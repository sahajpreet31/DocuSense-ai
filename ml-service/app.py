import os
import uuid

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.utils import secure_filename

from services.pdf_processor import process_pdf
from services.embeddings import store_chunks
from services.rag_service import (
    answer_question,
    summarize_document,
    flag_risks,
    classify_document,
    RateLimitError,
)
from services.entity_extractor import extract_entities
from services.text_analytics import analyze_document

load_dotenv()

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})


@app.errorhandler(Exception)
def handle_unexpected_error(exc):
    app.logger.exception(exc)
    return jsonify({"error": "Internal server error"}), 500


@app.get("/health")
def health():
    return jsonify({"status": "ok"})


@app.post("/upload")
def upload():
    if "file" not in request.files:
        return jsonify({"error": "No file part in request"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    if not file.filename.lower().endswith(".pdf"):
        return jsonify({"error": "Only PDF files are supported"}), 400

    document_id = str(uuid.uuid4())
    filename = secure_filename(file.filename)
    pdf_path = os.path.join(UPLOAD_DIR, f"{document_id}_{filename}")
    file.save(pdf_path)

    chunks = process_pdf(pdf_path)
    store_chunks(document_id, chunks)

    return jsonify({
        "document_id": document_id,
        "filename": filename,
        "chunks_stored": len(chunks),
    })


@app.post("/chat")
def chat():
    data = request.get_json(silent=True) or {}
    document_id = data.get("document_id")
    question = data.get("question")

    if not document_id or not question:
        return jsonify({"error": "document_id and question are required"}), 400

    try:
        answer = answer_question(document_id, question)
    except RateLimitError as exc:
        return jsonify({"error": str(exc)}), 429
    except RuntimeError as exc:
        return jsonify({"error": str(exc)}), 500

    return jsonify({"document_id": document_id, "question": question, "answer": answer})


@app.post("/summarize")
def summarize():
    data = request.get_json(silent=True) or {}
    document_id = data.get("document_id")

    if not document_id:
        return jsonify({"error": "document_id is required"}), 400

    try:
        summary = summarize_document(document_id)
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 404
    except RateLimitError as exc:
        return jsonify({"error": str(exc)}), 429
    except RuntimeError as exc:
        return jsonify({"error": str(exc)}), 500

    return jsonify({"document_id": document_id, "summary": summary})


@app.post("/classify")
def classify():
    data = request.get_json(silent=True) or {}
    document_id = data.get("document_id")

    if not document_id:
        return jsonify({"error": "document_id is required"}), 400

    try:
        category, confidence = classify_document(document_id)
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 404
    except RateLimitError as exc:
        return jsonify({"error": str(exc)}), 429
    except RuntimeError as exc:
        return jsonify({"error": str(exc)}), 500

    return jsonify({"document_id": document_id, "category": category, "confidence": confidence})


@app.post("/entities")
def entities():
    data = request.get_json(silent=True) or {}
    document_id = data.get("document_id")

    if not document_id:
        return jsonify({"error": "document_id is required"}), 400

    try:
        result = extract_entities(document_id)
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 404
    except RateLimitError as exc:
        return jsonify({"error": str(exc)}), 429
    except RuntimeError as exc:
        return jsonify({"error": str(exc)}), 500

    return jsonify({"document_id": document_id, "entities": result})


@app.post("/risk-flags")
def risk_flags():
    data = request.get_json(silent=True) or {}
    document_id = data.get("document_id")

    if not document_id:
        return jsonify({"error": "document_id is required"}), 400

    try:
        risks = flag_risks(document_id)
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 404
    except RateLimitError as exc:
        return jsonify({"error": str(exc)}), 429
    except RuntimeError as exc:
        return jsonify({"error": str(exc)}), 500

    return jsonify({"document_id": document_id, "risks": risks})


@app.post("/analytics")
def analytics():
    data = request.get_json(silent=True) or {}
    document_id = data.get("document_id")

    if not document_id:
        return jsonify({"error": "document_id is required"}), 400

    try:
        result = analyze_document(document_id)
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 404

    return jsonify({"document_id": document_id, "analytics": result})


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5001))
    app.run(host="0.0.0.0", port=port, debug=True)
