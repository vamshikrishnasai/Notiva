from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import random
import os

router = APIRouter()

# In-memory mock store for OTPs and user passwords.
# In a real application, this should be in the database.
otp_store = {}
user_store = {}

class ForgotPasswordRequest(BaseModel):
    email: str

class VerifyOTPRequest(BaseModel):
    email: str
    otp: str

class ResetPasswordRequest(BaseModel):
    email: str
    otp: str
    new_password: str

def generate_otp():
    return str(random.randint(100000, 999999))

def send_otp_email(to_email: str, otp: str):
    # Retrieve SMTP credentials from environment variables
    smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", 587))
    smtp_user = os.getenv("SMTP_USER", "")
    smtp_password = os.getenv("SMTP_PASSWORD", "")

    subject = "Reset Your Notiva Password"
    
    # Beautifully formatted HTML Email with Logo
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Notiva Password Reset</title>
        <style>
            body {{ font-family: 'Inter', sans-serif; background-color: #f4f4f5; margin: 0; padding: 40px 0; color: #18181b; }}
            .container {{ max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 32px; box-shadow: 0 4px 24px rgba(0,0,0,0.05); }}
            .logo {{ text-align: center; margin-bottom: 24px; }}
            .logo img {{ width: 64px; height: 64px; border-radius: 12px; }}
            .headline {{ font-size: 22px; font-weight: 700; text-align: center; margin-bottom: 12px; color: #18181b; }}
            .text {{ font-size: 15px; line-height: 1.6; text-align: center; color: #52525b; margin-bottom: 24px; }}
            .otp-box {{ background: #f4f4f5; border: 1px solid #e4e4e7; border-radius: 8px; padding: 16px; text-align: center; font-size: 32px; font-weight: 800; letter-spacing: 4px; color: #6366f1; margin-bottom: 24px; }}
            .footer {{ font-size: 12px; text-align: center; color: #a1a1aa; margin-top: 32px; border-top: 1px solid #e4e4e7; padding-top: 16px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo">
                <img src="https://raw.githubusercontent.com/vamshikrishnasai/Notiva/main/my-app/public/notiva_logo.png" alt="Notiva Logo" />
            </div>
            <div class="headline">Password Reset Request</div>
            <div class="text">
                We received a request to reset your password for your Notiva account. Enter the following One-Time Password (OTP) to proceed:
            </div>
            <div class="otp-box">{otp}</div>
            <div class="text" style="font-size: 13px;">
                If you did not request this, you can safely ignore this email.
            </div>
            <div class="footer">
                &copy; {2026} Notiva. Built for Knowledge Workers.
            </div>
        </div>
    </body>
    </html>
    """
    
    # If SMTP is configured, send the real email!
    if smtp_user and smtp_password:
        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = f"Notiva Support <{smtp_user}>"
            msg["To"] = to_email
            msg.attach(MIMEText(html_content, "html"))

            server = smtplib.SMTP(smtp_server, smtp_port)
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.sendmail(smtp_user, to_email, msg.as_string())
            server.quit()
            print(f"✅ OTP email successfully sent to {to_email}")
        except Exception as e:
            print(f"❌ Failed to send email: {e}")
    else:
        # Fallback mechanism if SMTP isn't setup - writes to disk for developer testing
        print("⚠️ No SMTP credentials found. Writing OTP email to disk for testing...")
        try:
            with open("latest_reset_email.html", "w", encoding="utf-8") as f:
                f.write(html_content)
            print("📄 Wrote email to `latest_reset_email.html`. OTP is:", otp)
        except Exception as e:
            print(f"❌ Failed to write local email file: {e}")

@router.post("/forgot-password")
async def forgot_password(req: ForgotPasswordRequest):
    email = req.email
    if not email:
        raise HTTPException(status_code=400, detail="Email is required")
    
    otp = generate_otp()
    otp_store[email] = otp
    send_otp_email(email, otp)
    
    return {"message": "OTP sent successfully. If not received, please check your local latest_reset_email.html file since SMTP may not be configured."}

@router.post("/verify-otp")
async def verify_otp(req: VerifyOTPRequest):
    email = req.email
    otp = req.otp
    
    if email not in otp_store:
        raise HTTPException(status_code=400, detail="No OTP requested for this email")
        
    if otp_store[email] != otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")
        
    return {"message": "OTP verified successfully"}

@router.post("/reset-password")
async def reset_password(req: ResetPasswordRequest):
    email = req.email
    otp = req.otp
    new_pwd = req.new_password
    
    if email not in otp_store or otp_store[email] != otp:
        raise HTTPException(status_code=400, detail="Invalid session or OTP")
        
    # Mocking password reset
    user_store[email] = new_pwd
    
    # Clear OTP
    otp_store.pop(email, None)
    
    return {"message": "Password reset successfully!"}
