from __future__ import annotations
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from models.jobs import Job


from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import DateTime
from datetime import datetime, timezone
from typing import Optional
from db.database import Base

# User model for a users table in the database, with a foreign key mapping each user to their jobs
class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    email: Mapped[str] = mapped_column(unique=True, index=True)
    name: Mapped[str]
    refresh_token: Mapped[str]
    last_synced_at: Mapped[Optional[datetime]]
    created_at: Mapped[datetime] = mapped_column(default=lambda: datetime.now(timezone.utc))

    jobs: Mapped[list["Job"]] = relationship("Job", back_populates="user")