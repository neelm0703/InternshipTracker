from fastapi import APIRouter, Depends, HTTPException
from typing import Optional

from db.database import get_db
from schemas.jobs import JobResponse, JobCreate, JobUpdate
from models.enums import JobStatus
from models.user import User
from models.jobs import Job
from routers.auth import get_current_user
from sqlalchemy.orm import Session
from sqlalchemy import delete
from datetime import datetime, timezone

router = APIRouter(prefix="/jobs", tags=["jobs"])


# CRUD operations for jobs that only give access to current_users jobs


@router.post("/")
def create_job(
    job: JobCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if job.source_email_id:
        existing = db.query(Job).filter(Job.source_email_id == job.source_email_id, Job.user_id == current_user.id).first()
        if existing:
            raise HTTPException(status_code=409, detail="Job from this email already exists")
    
    new_job = Job(
        company=job.company,
        role=job.role,
        status=job.status,
        portal_url=job.portal_url,
        notes=job.notes,
        user_id=current_user.id,
        source_email_id=job.source_email_id
    )

    db.add(new_job)
    db.commit()
    db.refresh(new_job)

    return {"message": f"Job created successfully with id {new_job.id}"}







@router.get("/", response_model=list[JobResponse])
def get_jobs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    status: Optional[JobStatus] = None,
    company: Optional[str] = None,
    role: Optional[str] = None,
):
    query = db.query(Job).filter(Job.user_id == current_user.id)

    if status:
        query = query.filter(Job.status == status)
    if company:
        query = query.filter(Job.company.ilike(f"%{company}%"))
    if role:
        query = query.filter(Job.role.ilike(f"%{role}%"))

    return query.all()









@router.patch("/{job_id}")
def update_job(
    job_id: int,
    updated_fields: JobUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    job = db.query(Job).filter(Job.id == job_id, Job.user_id == current_user.id).first()

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    job.status = updated_fields.status
    job.company = updated_fields.company
    job.role = updated_fields.role
    job.portal_url = updated_fields.portal_url
    job.notes = updated_fields.notes

    job.last_updated = datetime.now(timezone.utc)

    db.commit()
    db.refresh(job)

    return {"message": f"Job {job_id} updated successfully"}









@router.delete("/{job_id}")
def delete_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = db.execute(
        delete(Job).where(Job.id == job_id, Job.user_id == current_user.id)
    )
    db.commit()

    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Job not found")

    return {"message": f"Job {job_id} deleted successfully"}