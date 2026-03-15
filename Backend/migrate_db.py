from sqlalchemy import text
from app.db.database import engine

with engine.connect() as conn:
    try:
        conn.execute(text("ALTER TABLE notes ADD COLUMN tags VARCHAR(255);"))
        conn.commit()
        print("Column 'tags' added.")
    except Exception as e:
        print("tags column may already exist:", e)
    
    try:
        conn.execute(text("ALTER TABLE notes ADD COLUMN type VARCHAR(50) DEFAULT 'note';"))
        conn.commit()
        print("Column 'type' added.")
    except Exception as e:
        print("type column may already exist:", e)
