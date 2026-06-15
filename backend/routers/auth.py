from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Request, Cookie, Response
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import Flow
from jose import jwt, JWTError
from datetime import datetime, timedelta, timezone
from schemas.user import UserResponse
from db.database import get_db
from models.user import User
from core.config import settings



router = APIRouter(prefix="/auth", tags=["auth"])

# Defining the scopes we will request accees for 
SCOPES = [
    "openid",
    "https://www.googleapis.com/auth/userinfo.email", # email address
    "https://www.googleapis.com/auth/userinfo.profile", # profile
    "https://www.googleapis.com/auth/gmail.readonly", # read-only access to Gmails
]


# Function to create and return the flow object for Google OAuth 2.0 authentication needed both 
# when redirecting the user to Google's authorization endpoint and when 
# handling the callback from Google after the user has authorized the application.
def get_flow() -> Flow:
    client_config = {
        "web": {
            "client_id": settings.GOOGLE_CLIENT_ID,
            "client_secret": settings.GOOGLE_CLIENT_SECRET,
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "redirect_uris": [f"{settings.APP_BASE_URL}/auth/oauth2callback"],
        }
    }
    flow =  Flow.from_client_config(
        client_config=client_config,
        scopes=SCOPES,
        redirect_uri=f"{settings.APP_BASE_URL}/auth/oauth2callback",
    )
    return flow


# Function to create a JWT token for the authenticated user. The token will include the user's ID.
# Added an expiration time of 7 days after which they will need to log in again.
# TODO: Implement refresh token functionality for JWT so users can "stay logged in" if they choose that at log in time
def create_jwt(user_id: int) -> str:
    payload = {
        "sub": str(user_id),
        "exp": datetime.now(timezone.utc) + timedelta(days=7)
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")




# Function to read the JWT token from the cookie, decode it, and retrieve the current authenticated user from the database.
def get_current_user(jwt_token: Optional[str] = Cookie(None), db: Session = Depends(get_db)):
    if not jwt_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    try:
        payload = jwt.decode(jwt_token, settings.SECRET_KEY, algorithms=["HS256"])
        user_id = int(payload.get("sub"))
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    return user













# Endpoint to initiate the authentication (login with Google) by redirecting the user to Google's authorization endpoint.
@router.get("/login")
def login(request: Request):
    flow = get_flow()

    auth_url, state = flow.authorization_url(
        access_type='offline',
        include_granted_scopes='true',
        prompt='consent',
    )
    request.session["code_verifier"] = flow.code_verifier
    request.session["state"] = state

    return RedirectResponse(auth_url)



# Endpoint to handle the callback from Google after the user has authorized the application.
# It will exchange the authorization code for an access token and retrieve the user's profile information
@router.get("/oauth2callback")
def oauth2callback(request: Request, db: Session = Depends(get_db), code: Optional[str] = None, error: Optional[str] = None):
    if (error or (not code)):
        # Throw some kind of error response here or redirect to an error page
        pass

    flow = get_flow()
    flow.code_verifier = request.session.get("code_verifier")
    flow.fetch_token(authorization_response=str(request.url))
    creds = flow.credentials

    for scope in SCOPES:
        if scope not in creds.granted_scopes:
            # Throw some error and send back to login page as they didn't grant all the required permissions
            pass
    
    service = build("oauth2", "v2", credentials=creds)
    user_info = service.userinfo().get().execute()
    email = user_info["email"]
    name = user_info["name"]

    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = User(email=email, name=name, refresh_token=creds.refresh_token)
        db.add(user)
        db.commit()
        db.refresh(user)
    
    token = create_jwt(user.id)

    response = RedirectResponse("http://localhost:5173")

    # TODO: Consider changing later for CSRF protection. Can change to using Bearer: <toke> in header
    response.set_cookie(
        key="jwt_token",
        value=token,
        httponly=True,
        secure=False,    # TODO: set to True in production, False now as localhost is http 
        samesite="lax",
        max_age=60 * 60 * 24 * 7  # 7 days in seconds
    )
    return response



@router.get("/me", response_model=UserResponse)
def get_user(current_user: User = Depends(get_current_user)):
    return current_user


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(
        key="jwt_token",
        httponly=True,
        secure=False,    # TODO: set to True in production, False now as localhost is http 
        samesite="lax"
    )