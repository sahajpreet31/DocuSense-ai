import fitz
from langchain_text_splitters import RecursiveCharacterTextSplitter


def extract_text_from_pdf(pdf_path):
    text = ""
    with fitz.open(pdf_path) as doc:
        for page in doc:
            text += page.get_text()
    return text


def split_text_into_chunks(text, chunk_size=1000, chunk_overlap=200):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
    )
    return splitter.split_text(text)


def process_pdf(pdf_path, chunk_size=1000, chunk_overlap=200):
    text = extract_text_from_pdf(pdf_path)
    return split_text_into_chunks(text, chunk_size=chunk_size, chunk_overlap=chunk_overlap)
