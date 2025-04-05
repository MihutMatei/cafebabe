import sendgrid
from sendgrid.helpers.mail import Mail

SENDGRID_API_KEY = "your_sendgrid_api_key"

def send_email(to_email: str, subject: str, content: str):
    sg = sendgrid.SendGridAPIClient(api_key=SENDGRID_API_KEY)
    email = Mail(from_email="noreply@example.com", to_emails=to_email, subject=subject, plain_text_content=content)
    sg.send(email)
