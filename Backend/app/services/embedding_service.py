import os
import chromadb

CHROMA_DIR = os.getenv("CHROMA_DB_DIR", "./chroma_db")
client = chromadb.PersistentClient(path=CHROMA_DIR)
collection = client.get_or_create_collection("notes")

def _get_safe_text(text: str) -> str:
    return text if text and text.strip() else "Empty Document"

def add_embedding(note_id: str, text: str):
    collection.upsert(documents=[_get_safe_text(text)], ids=[note_id])

def update_embedding(note_id: str, text: str):
    collection.upsert(documents=[_get_safe_text(text)], ids=[note_id])

def delete_embedding(note_id: str):
    try:
        collection.delete(ids=[note_id])
    except Exception:
        pass

def sync_all_embeddings(notes):
    ids = []
    documents = []
    for note in notes:
        ids.append(str(note.id))
        documents.append(_get_safe_text(note.content))
    if ids:
        collection.upsert(documents=documents, ids=ids)