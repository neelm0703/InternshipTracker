from __future__ import annotations
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from models.user import User


from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import Enum as SAEnum
from models.enums import JobStatus
from db.database import Base

# Job model for a jobs table in the database, with a foreign key mapping each job to the corresponding user
class Job(Base):
    __tablename__ = "jobs"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    company: Mapped[str]
    role: Mapped[str]
    status: Mapped[Optional[JobStatus]] = mapped_column(SAEnum(JobStatus), nullable=True)
    portal_url: Mapped[Optional[str]]
    notes: Mapped[Optional[str]]
    last_updated: Mapped[Optional[datetime]]
    source_email_id: Mapped[Optional[str]] = mapped_column(unique=True, nullable=True)
    created_at: Mapped[datetime] = mapped_column(default=lambda: datetime.now(timezone.utc))

    user: Mapped["User"] = relationship("User", back_populates="jobs")