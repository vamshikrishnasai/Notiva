from pydantic import BaseModel, ConfigDict
from typing import Optional

class NoteBase(BaseModel):
    title: str
    content: str
    tags: Optional[str] = None
    type: str = "note"
    is_pinned: Optional[bool] = False
    is_starred: Optional[bool] = False
    is_archived: Optional[bool] = False
    notebook: Optional[str] = "My Notebook"

class NoteCreate(NoteBase):
    pass

class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    tags: Optional[str] = None
    type: Optional[str] = None
    is_pinned: Optional[bool] = None
    is_starred: Optional[bool] = None
    is_archived: Optional[bool] = None
    notebook: Optional[str] = None

class NoteResponse(NoteBase):
    id: int
    summary: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)