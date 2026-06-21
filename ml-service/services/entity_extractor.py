import json

from services.embeddings import get_all_chunks
from services.rag_service import generate_content, GEMINI_API_KEY

ENTITY_KEYS = ["names", "organizations", "dates", "money", "locations"]

ENTITY_PROMPT = (
    "Extract entities from this document and respond ONLY with a JSON object with these exact "
    "keys: \"names\" (person names), \"organizations\" (company or organization names), "
    "\"dates\", \"money\" (monetary amounts), \"locations\" (places). Each key must map to an "
    "array of strings found in the document. If none are found for a key, use an empty array.\n\n"
    "Document:\n{text}"
)


def extract_entities(document_id):
    if not GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY is not set")

    chunks = get_all_chunks(document_id)
    if not chunks:
        raise ValueError("No content found for this document_id")

    prompt = ENTITY_PROMPT.format(text=" ".join(chunks))
    response = generate_content(prompt, config={"response_mime_type": "application/json"})

    try:
        entities = json.loads(response.text)
    except (TypeError, ValueError):
        entities = {}

    return {key: entities.get(key, []) for key in ENTITY_KEYS}
