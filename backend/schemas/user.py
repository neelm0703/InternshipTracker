from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from schemas.jobs import JobResponse

# Schema for the information always needed for a user
class UserBase(BaseModel):
    email: str
    name: str

# Schema with additional information needed when creating a new user
class UserCreate(UserBase):
    refresh_token: str

# Schema for the information returned when fetching a user and their details
class UserResponse(UserBase):
    id: int
    last_synced_at: Optional[datetime]

    model_config = {"from_attributes": True}

# Schema for the information returned when fetching a user and their jobs
class UserResponseWithJobs(UserResponse):
    jobs: list[JobResponse] = []
