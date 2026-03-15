import asyncio
from app.db.database import SessionLocal, Base, engine
from app.db.models import Note
from app.routes.notes import create_note
from app.schemas.note_schema import NoteCreate
from app.services.embedding_service import collection
from app.routes.query import ask_question, QueryRequest

Base.metadata.create_all(bind=engine)

def db_test():
    db = SessionLocal()
    try:
        # Create a note directly via function
        new_note = NoteCreate(title="Database Setup", content="Postgres is used for metadata, Chroma for vectors.", type="note", notebook="Tech")
        db_note = create_note(new_note, db)
        print("Created note:", db_note.id)
        
        # Test collection count
        print("Chroma count:", collection.count())
        
        # Ask question
        req = QueryRequest(question="What is used for metadata vs vectors?")
        ans = ask_question(req)
        print("Answer:", ans)
    except Exception as e:
        print("Error:", e)
    finally:
        db.close()

if __name__ == "__main__":
    db_test()
