from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.db.models import Note
from app.schemas.note_schema import NoteCreate, NoteUpdate, NoteResponse
from app.services.gemini_service import summarize_note
from app.services.embedding_service import add_embedding, update_embedding, delete_embedding
from typing import List, Optional

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=NoteResponse)
def create_note(note: NoteCreate, db: Session = Depends(get_db)):
    # Summarize with Gemini
    summary = summarize_note(note.content)

    # Save note in PostgreSQL
    db_note = Note(
        title=note.title, 
        content=note.content,
        summary=summary,
        tags=note.tags,
        type=note.type,
        notebook=note.notebook
    )
    db.add(db_note)
    db.commit()
    db.refresh(db_note)

    # Create embedding in ChromaDB
    add_embedding(str(db_note.id), db_note.content)

    return db_note

@router.get("/", response_model=List[NoteResponse])
def get_notes(skip: int = 0, limit: int = 100, type: Optional[str] = None, tags: Optional[str] = None, search: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Note)
    if type:
        query = query.filter(Note.type == type)
    if tags:
        # A simple check (for production, we might want to split and use IN or similar)
        query = query.filter(Note.tags.contains(tags))
    if search:
        query = query.filter(Note.title.ilike(f"%{search}%") | Note.content.ilike(f"%{search}%"))
        
    notes = query.offset(skip).limit(limit).all()
    return notes

@router.get("/{note_id}", response_model=NoteResponse)
def get_note(note_id: int, db: Session = Depends(get_db)):
    db_note = db.query(Note).filter(Note.id == note_id).first()
    if not db_note:
        raise HTTPException(status_code=404, detail="Note not found")
    return db_note

@router.put("/{note_id}", response_model=NoteResponse)
def update_note(note_id: int, note: NoteUpdate, db: Session = Depends(get_db)):
    db_note = db.query(Note).filter(Note.id == note_id).first()
    if not db_note:
        raise HTTPException(status_code=404, detail="Note not found")

    update_data = note.model_dump(exclude_unset=True)
    content_updated = False

    if "content" in update_data and update_data["content"] != db_note.content:
        # Re-summarize if content changed
        update_data["summary"] = summarize_note(update_data["content"])
        content_updated = True

    for key, value in update_data.items():
        setattr(db_note, key, value)

    db.add(db_note)
    db.commit()
    db.refresh(db_note)

    # Update embedding in ChromaDB if content changed
    if content_updated:
        update_embedding(str(db_note.id), db_note.content)

    return db_note

@router.delete("/{note_id}")
def delete_note_endpoint(note_id: int, db: Session = Depends(get_db)):
    db_note = db.query(Note).filter(Note.id == note_id).first()
    if not db_note:
        raise HTTPException(status_code=404, detail="Note not found")

    # Delete embedding in ChromaDB
    try:
        delete_embedding(str(note_id))
    except Exception as e:
        print(f"Embedding delete notice or error: {e}")

    # Delete from PostgreSQL
    db.delete(db_note)
    db.commit()

    return {"message": "Knowledge item deleted successfully"}

@router.delete("/notebook/{notebook_name}")
def delete_notebook_endpoint(notebook_name: str, db: Session = Depends(get_db)):
    db_notes = db.query(Note).filter(Note.notebook == notebook_name).all()
    
    # Delete embedding in ChromaDB
    for db_note in db_notes:
        try:
            delete_embedding(str(db_note.id))
        except Exception as e:
            print(f"Embedding delete notice or error: {e}")
            
    # Delete from PostgreSQL
    db.query(Note).filter(Note.notebook == notebook_name).delete()
    db.commit()

    return {"message": f"Notebook {notebook_name} and all its contents deleted successfully"}