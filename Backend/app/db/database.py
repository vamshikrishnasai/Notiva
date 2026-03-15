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
if db_url.host == "localhost":
	DATABASE_URL = str(db_url.set(host="127.0.0.1"))

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()