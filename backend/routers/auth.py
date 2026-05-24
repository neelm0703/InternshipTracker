from fastapi import APIRouter
from fastapi.responses import RedirectResponse
from google_auth_oauthlib.flow import Flow
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
            "redirect_uris": [f"{settings.APP_BASE_URL}/auth/oauth/callback"],
        }
    }
    flow =  Flow.from_client_config(
        client_config=client_config,
        scopes=SCOPES,
        redirect_uri=f"{settings.APP_BASE_URL}/auth/oauth/callback",
    )
    return flow



# Endpoint to initiate the authentication (login with Google) by redirecting the user to Google's authorization endpoint.
@router.get("/login")
def login():
    flow = get_flow()

    auth_url, state = flow.authorization_url(
        access_type='offline',
        include_granted_scopes='true',
        prompt='consent',
    )
    return RedirectResponse(auth_url)
