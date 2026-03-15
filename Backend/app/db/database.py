from sqlalchemy import create_engine
from sqlalchemy.engine.url import make_url
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from pathlib import Path
from dotenv import load_dotenv

# Load Backend/.env explicitly and override stale shell vars that may have old creds.
ENV_PATH = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(dotenv_path=ENV_PATH, override=True)

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
	raise RuntimeError("Missing DATABASE_URL in Backend/.env")

db_url = make_url(DATABASE_URL)

# Force Render's postgres:// to postgresql:// as required by SQLAlchemy >= 1.4
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Only change host to 127.0.0.1 if it's a web database, not SQLite
if getattr(db_url, "host", None) == "localhost" and not DATABASE_URL.startswith("sqlite"):
    DATABASE_URL = str(db_url.set(host="127.0.0.1"))

engine = create_engine(
    DATABASE_URL, 
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()