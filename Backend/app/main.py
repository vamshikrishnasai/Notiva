from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import notes, query
from app.db.database import Base, engine
from app.db import models  # noqa: F401
from contextlib import asynccontextmanager

# Create tables for local development if they do not exist yet.
Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Auto-Sync SQL Notes to ChromaDB Vector Store on boot 
    # (Fixes Render ephemeral disk wipe issues causing RAG to fail)
    try:
        from app.db.database import SessionLocal
        from app.db.models import Note
        from app.services.embedding_service import sync_all_embeddings
        
        db = SessionLocal()
        all_notes = db.query(Note).all()
        sync_all_embeddings(all_notes)
        db.close()
        print(f"Successfully synchronized {len(all_notes)} notes to ChromaDB.")
    except Exception as e:
        print(f"Failed to sync ChromaDB: {e}")
    yield

app = FastAPI(title="Notiva API", docs_url="/api-docs", redoc_url="/redoc", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(notes.router, prefix="/notes", tags=["Notes"])
app.include_router(query.router, prefix="/query", tags=["Query"])

from fastapi.responses import PlainTextResponse, HTMLResponse
from app.docs_html import HTML_CONTENT

@app.get("/docs", response_class=HTMLResponse, tags=["Documentation"])
def serve_docs():
    return HTML_CONTENT

@app.get("/widget.js", response_class=PlainTextResponse, tags=["Widget"])
def get_widget():
    js_code = """
(function() {
    const btn = document.createElement('button');
    btn.innerText = 'Ask Second Brain';
    btn.style.cssText = 'position:fixed;bottom:20px;right:20px;background:#6366f1;color:white;border:none;padding:12px 24px;border-radius:30px;font-family:sans-serif;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.15);z-index:9999;';
    btn.onclick = () => {
        const q = prompt('Ask a question to my Second Brain:');
        if(!q) return;
        fetch('http://127.0.0.1:8000/query/ask', {
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({question: q})
        }).then(res=>res.json()).then(data=>alert(data.answer)).catch(err=>alert('Error calling Second Brain API.'));
    };
    document.body.appendChild(btn);
})();
    """
    return js_code.strip()

@app.get("/")
def root():
    return {"message": "Second Brain API Running", "docs": "/docs", "widget": "/widget.js"}