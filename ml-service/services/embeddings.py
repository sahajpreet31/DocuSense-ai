import os

import chromadb
from sentence_transformers import SentenceTransformer

CHROMA_PERSIST_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "chroma_db")

_model = None
_client = None


def get_embedding_model():
    global _model
    if _model is None:
        _model = SentenceTransformer("all-MiniLM-L6-v2")
    return _model


def get_chroma_client():
    global _client
    if _client is None:
        _client = chromadb.PersistentClient(path=CHROMA_PERSIST_DIR)
    return _client


def get_or_create_collection(document_id):
    client = get_chroma_client()
    return client.get_or_create_collection(name=document_id)


def store_chunks(document_id, chunks):
    model = get_embedding_model()
    collection = get_or_create_collection(document_id)

    embeddings = model.encode(chunks).tolist()
    ids = [f"{document_id}_{i}" for i in range(len(chunks))]

    collection.add(ids=ids, embeddings=embeddings, documents=chunks)


def get_all_chunks(document_id):
    collection = get_or_create_collection(document_id)
    results = collection.get()
    return results.get("documents", [])


def query_chunks(document_id, question, top_k=4):
    model = get_embedding_model()
    collection = get_or_create_collection(document_id)

    query_embedding = model.encode([question]).tolist()
    results = collection.query(query_embeddings=query_embedding, n_results=top_k)

    return results.get("documents", [[]])[0]


def delete_chunks(document_id):
    client = get_chroma_client()
    try:
        client.delete_collection(name=document_id)
    except Exception:
        pass
