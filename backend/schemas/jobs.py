from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from models.enums import JobStatus

# Schema for the information always needed for a job
class JobBase(BaseModel):
    company: str
    role: Optional[str]
    status: Optional[JobStatus]
    portal_url: Optional[str]
    notes: Optional[str]
    user_id: int

class JobUpdate(JobBase):
    pass

class JobCreate(JobBase):
    source_email_id: str

class JobResponse(JobBase):
    id: int
    created_at: datetime
    last_updated: Optional[datetime]

    model_config = {"from_attributes": True}