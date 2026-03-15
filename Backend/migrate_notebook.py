from app.db.database import engine
from sqlalchemy import text

with engine.connect() as c:
    c.execute(text("ALTER TABLE notes ADD COLUMN IF NOT EXISTS notebook VARCHAR DEFAULT 'My Notebook';"))
    c.commit()
