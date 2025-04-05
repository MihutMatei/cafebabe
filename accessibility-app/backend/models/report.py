from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from ..core.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

class Report(Base):
    __tablename__ = "reports"
    id = Column(Integer, primary_key=True, index=True)
    description = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    photo_url = Column(String)
    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User")
