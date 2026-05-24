from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from models.enums import JobStatus

# Schema for the information always needed for a job
class JobBase(BaseModel):
    company: str
    role: Optional[str]
    source_email_id: str
    status: Optional[JobStatus]
    portal_url: Optional[str]
    notes: Optional[str]
    user_id: int

class JobCreate(JobBase):
    pass

class JobResponse(JobBase):
    id: int
    created_at: datetime
    last_updated_at: Optional[datetime]

    model_config = {"from_attributes": True}