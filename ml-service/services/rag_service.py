import json
import os

from dotenv import load_dotenv
from google import genai
from google.genai.errors import APIError

from services.embeddings import query_chunks, get_all_chunks

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = "gemini-2.5-flash-lite"

SUMMARY_PROMPT = (
    "Summarize this document concisely in bullet points covering the main topics, "
    "key findings, and important details.\n\nDocument:\n{text}"
)

RISK_PROMPT = (
    "Analyze this document and identify potential risks, red flags, or unfavorable terms "
    "(for example: liability issues, unfavorable clauses, missing protections, ambiguous "
    "language, penalty or termination clauses, hidden fees). Respond ONLY with a JSON array, "
    "where each item has the keys \"title\", \"severity\" (one of \"high\", \"medium\", \"low\"), "
    "and \"description\". If no significant risks are found, return an empty array.\n\n"
    "Document:\n{text}"
)

CLASSIFY_PROMPT = (
    "Classify this document into exactly one of the following categories:\n\n"
    "- contract: Legal agreements, NDAs, employment contracts, service agreements, "
    "terms and conditions\n"
    "- invoice: Bills, payment requests, receipts, purchase orders, financial statements\n"
    "- report: Analysis reports, annual reports, progress reports, technical reports, "
    "business reports\n"
    "- resume: Personal CVs showing an individual person's education, work history, "
    "skills and achievements\n"
    "- job_description: Job postings, vacancy listings, role requirements, hiring "
    "announcements\n"
    "- research_paper: Academic papers, scientific studies, literature reviews, thesis, "
    "dissertations\n"
    "- study_material: Lecture notes, course materials, textbooks, study guides, "
    "educational content, syllabus\n"
    "- assignment: Homework, assignments, problem sets, coursework, project submissions\n"
    "- exam_paper: Question papers, past papers, mock tests, practice exams\n"
    "- certificate: Degree certificates, course completion certificates, awards, "
    "transcripts, mark sheets\n"
    "- other: Anything that doesn't fit above categories\n\n"
    "CRITICAL DISTINCTIONS:\n"
    "- study_material = educational content meant for learning (notes, slides, textbooks)\n"
    "- assignment = work submitted by a student for evaluation\n"
    "- exam_paper = questions to be answered in an exam\n"
    "- certificate = official document proving completion or achievement\n"
    "- research_paper = formal academic publication with methodology and findings\n\n"
    "Respond with ONLY the category name, nothing else.\n\nDocument:\n{text}"
)

VALID_CATEGORIES = [
    "contract",
    "invoice",
    "report",
    "resume",
    "job_description",
    "research_paper",
    "study_material",
    "assignment",
    "exam_paper",
    "certificate",
    "other",
]

_client = None


class RateLimitError(Exception):
    pass


def get_client():
    global _client
    if _client is None:
        _client = genai.Client(api_key=GEMINI_API_KEY)
    return _client


def generate_content(prompt, **config_kwargs):
    client = get_client()
    try:
        return client.models.generate_content(model=GEMINI_MODEL, contents=prompt, **config_kwargs)
    except APIError as exc:
        if exc.code == 429:
            raise RateLimitError(
                "AI service is temporarily rate-limited, please try again in 24 hours"
            ) from exc
        raise


def build_prompt(question, context_chunks):
    context = "\n\n".join(context_chunks)
    return (
        "Answer the question using only the context below. "
        "If the answer is not in the context, say you don't know.\n\n"
        f"Context:\n{context}\n\nQuestion: {question}"
    )


def answer_question(document_id, question, top_k=4):
    if not GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY is not set")

    context_chunks = query_chunks(document_id, question, top_k=top_k)
    if not context_chunks:
        return "No relevant content found for this document."

    prompt = build_prompt(question, context_chunks)
    response = generate_content(prompt)

    return response.text


def summarize_document(document_id):
    if not GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY is not set")

    chunks = get_all_chunks(document_id)
    if not chunks:
        raise ValueError("No content found for this document_id")

    prompt = SUMMARY_PROMPT.format(text=" ".join(chunks))
    response = generate_content(prompt)

    return response.text


def flag_risks(document_id):
    if not GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY is not set")

    chunks = get_all_chunks(document_id)
    if not chunks:
        raise ValueError("No content found for this document_id")

    prompt = RISK_PROMPT.format(text=" ".join(chunks))
    response = generate_content(prompt, config={"response_mime_type": "application/json"})

    try:
        risks = json.loads(response.text)
    except (TypeError, ValueError):
        risks = []

    return risks


def classify_document(document_id):
    if not GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY is not set")

    chunks = get_all_chunks(document_id)
    if not chunks:
        raise ValueError("No content found for this document_id")

    prompt = CLASSIFY_PROMPT.format(text=" ".join(chunks))
    response = generate_content(prompt)

    raw = response.text.strip().lower()
    category = next((c for c in VALID_CATEGORIES if c in raw), "other")

    return category, 0.95
