import enum

# Enum for the status of a job application so that LLM can only choose from these options 
# Ensures consitency and allows for easier filering
class JobStatus(enum.Enum):
    APPLIED = "Applied"
    ASSESSMENT = "Assessment"
    INTERVIEWING = "Interviewing"
    OFFER = "Offer"
    REJECTED = "Rejected"
    WITHDRAWN = "Withdrawn"