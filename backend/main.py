# backend/main.py
from fastapi import FastAPI, Form, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to restrict origins if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve static files from the "uploads" directory
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# In-memory store for reports
reports = []

@app.get("/")
async def root():
    return {
        "message": "Welcome to the Accessibility Reporting API!",
        "endpoints": {
            "submit_report": "/submit",
            "get_reports": "/reports",
            "uploaded_files": "/uploads/{filename}"
        }
    }

@app.post("/submit")
async def submit_report(
    name: str = Form(...),
    category: str = Form(...),
    description: str = Form(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    image: UploadFile = File(...)
):
    # Ensure the uploads directory exists
    uploads_dir = "uploads"
    os.makedirs(uploads_dir, exist_ok=True)
    
    # Save the uploaded image file
    file_path = os.path.join(uploads_dir, image.filename)
    with open(file_path, "wb") as f:
        content = await image.read()
        f.write(content)
    
    # Create a report dictionary and store it
    report = {
        "name": name,
        "category": category,
        "description": description,
        "latitude": latitude,
        "longitude": longitude,
        "image_saved_to": file_path,
    }
    reports.append(report)
    
    return JSONResponse(content={"message": "Report submitted successfully", "report": report})

# New GET endpoint to retrieve all reports
@app.get("/reports")
async def get_reports():
    return JSONResponse(content={"reports": reports})
