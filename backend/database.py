from sqlalchemy import create_engine, Column, String, DateTime, Boolean, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.sql import func
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./data/feedback.db")

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, nullable=False)  # 'manager' or 'employee'
    manager_id = Column(String, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    manager = relationship("User", remote_side=[id], back_populates="team_members")
    team_members = relationship("User", back_populates="manager")
    given_feedbacks = relationship("Feedback", foreign_keys="Feedback.manager_id", back_populates="manager")
    received_feedbacks = relationship("Feedback", foreign_keys="Feedback.employee_id", back_populates="employee")

class Feedback(Base):
    __tablename__ = "feedbacks"
    
    id = Column(String, primary_key=True, index=True)
    manager_id = Column(String, ForeignKey("users.id"), nullable=False)
    employee_id = Column(String, ForeignKey("users.id"), nullable=False)
    strengths = Column(Text, nullable=False)
    improvements = Column(Text, nullable=False)
    sentiment = Column(String, nullable=False)  # 'positive', 'neutral', 'negative'
    acknowledged = Column(Boolean, default=False)
    acknowledged_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    manager = relationship("User", foreign_keys=[manager_id], back_populates="given_feedbacks")
    employee = relationship("User", foreign_keys=[employee_id], back_populates="received_feedbacks")

# Create tables
Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()