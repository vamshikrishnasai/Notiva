from app.db.database import engine
from sqlalchemy import text

with engine.connect() as c:
    c.execute(text('ALTER TABLE notes ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT FALSE;'))
    c.execute(text('ALTER TABLE notes ADD COLUMN IF NOT EXISTS is_starred BOOLEAN DEFAULT FALSE;'))
    c.execute(text('ALTER TABLE notes ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT FALSE;'))
    c.commit()
