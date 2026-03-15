from sqlalchemy import Column, Integer, String, Text, Boolean
from .database import Base

class Note(Base):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    summary = Column(Text)
    tags = Column(String, nullable=True)
    type = Column(String, default="note") # note, article, link, insight
    is_pinned = Column(Boolean, default=False)
    is_starred = Column(Boolean, default=False)
    is_archived = Column(Boolean, default=False)
    notebook = Column(String, default="My Notebook")