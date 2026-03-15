import os
import chromadb

CHROMA_DIR = os.getenv("CHROMA_DB_DIR", "./chroma_db")
client = chromadb.PersistentClient(path=CHROMA_DIR)
collection = client.get_or_create_collection("notes")

def add_embedding(note_id: str, text: str):
    collection.add(documents=[text], ids=[note_id])

def update_embedding(note_id: str, text: str):
    collection.update(documents=[text], ids=[note_id])

def delete_embedding(note_id: str):
    collection.delete(ids=[note_id])