from app.routes.notes import create_note
from app.schemas.note_schema import NoteCreate
from app.db.database import SessionLocal

db = SessionLocal()
note = NoteCreate(title="vamshi", content="string")
try:
    create_note(note, db)
    print("Success")
except Exception as e:
    import traceback
    traceback.print_exc()
