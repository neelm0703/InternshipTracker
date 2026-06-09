#TODO: Remove these line once we have HTTPS setup for production
import os

from fastapi.responses import RedirectResponse
os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings
from db.database import Base, engine
from routers import auth, jobs
from starlette.middleware.sessions import SessionMiddleware
from models.user import User
from models.jobs import Job


# Basic FastAPI setup with database initialization
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.add_middleware(
    SessionMiddleware,
    secret_key=settings.SECRET_KEY,
    same_site="lax",
    https_only=False,  # Set to True in production when using HTTPS
    max_age=60 * 60 * 24 * 7,  # 7 days in seconds
)


# Including routers defined in routes/ 
app.include_router(auth.router)
app.include_router(jobs.router)

@app.get("/")
def root():
    return RedirectResponse(url="/auth/login")


# Running FastAPI app with Uvicorn if script is run directly
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000)