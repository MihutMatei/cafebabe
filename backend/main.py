# backend/main.py
from fastapi import FastAPI, Form, UploadFile, File
from fastapi.responses import JSONResponse
import os

app = FastAPI()

# In-memory store for reports
reports = []

@app.get("/")
async def root():
    return {"message": "Welcome to the Accessibility Reporting API!"}

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
