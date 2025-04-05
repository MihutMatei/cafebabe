from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..core.database import SessionLocal
from ..models.report import Report

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/reports/")
def create_report(description: str, latitude: float, longitude: float, db: Session = Depends(get_db)):
    report = Report(description=description, latitude=latitude, longitude=longitude)
    db.add(report)
    db.commit()
    db.refresh(report)
    return report

@router.get("/reports/")
def read_reports(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return db.query(Report).offset(skip).limit(limit).all()
