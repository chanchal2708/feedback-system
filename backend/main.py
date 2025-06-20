from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import List
import uuid

from database import get_db, User, Feedback
from models import (
    UserLogin, UserResponse, FeedbackCreate, FeedbackResponse, 
    FeedbackUpdate, Token, DashboardStats, EmployeeDashboardStats
)
from auth import (
    verify_password, create_access_token, get_current_user, 
    get_current_manager, ACCESS_TOKEN_EXPIRE_MINUTES
)
from seed_data import create_seed_data

app = FastAPI(title="Feedback System API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database with seed data
@app.on_event("startup")
async def startup_event():
    create_seed_data()

# Authentication endpoints
@app.post("/api/auth/login", response_model=Token)
async def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_credentials.email).first()
    
    if not user or not verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/auth/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    return current_user

# User endpoints
@app.get("/api/users/team", response_model=List[UserResponse])
async def get_team_members(
    current_user: User = Depends(get_current_manager),
    db: Session = Depends(get_db)
):
    team_members = db.query(User).filter(User.manager_id == current_user.id).all()
    return team_members

# Feedback endpoints
@app.post("/api/feedback", response_model=FeedbackResponse)
async def create_feedback(
    feedback_data: FeedbackCreate,
    current_user: User = Depends(get_current_manager),
    db: Session = Depends(get_db)
):
    # Verify employee belongs to manager's team
    employee = db.query(User).filter(
        User.id == feedback_data.employee_id,
        User.manager_id == current_user.id
    ).first()
    
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found in your team"
        )
    
    feedback = Feedback(
        id=str(uuid.uuid4()),
        manager_id=current_user.id,
        employee_id=feedback_data.employee_id,
        strengths=feedback_data.strengths,
        improvements=feedback_data.improvements,
        sentiment=feedback_data.sentiment
    )
    
    db.add(feedback)
    db.commit()
    db.refresh(feedback)
    
    # Add manager and employee names for response
    feedback.manager_name = current_user.name
    feedback.employee_name = employee.name
    
    return feedback

@app.get("/api/feedback/given", response_model=List[FeedbackResponse])
async def get_given_feedback(
    current_user: User = Depends(get_current_manager),
    db: Session = Depends(get_db)
):
    feedbacks = db.query(Feedback).filter(Feedback.manager_id == current_user.id).all()
    
    # Add names to each feedback
    for feedback in feedbacks:
        feedback.manager_name = current_user.name
        employee = db.query(User).filter(User.id == feedback.employee_id).first()
        feedback.employee_name = employee.name if employee else "Unknown"
    
    return feedbacks

@app.get("/api/feedback/received", response_model=List[FeedbackResponse])
async def get_received_feedback(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    feedbacks = db.query(Feedback).filter(Feedback.employee_id == current_user.id).all()
    
    # Add names to each feedback
    for feedback in feedbacks:
        manager = db.query(User).filter(User.id == feedback.manager_id).first()
        feedback.manager_name = manager.name if manager else "Unknown"
        feedback.employee_name = current_user.name
    
    return feedbacks

@app.put("/api/feedback/{feedback_id}", response_model=FeedbackResponse)
async def update_feedback(
    feedback_id: str,
    feedback_update: FeedbackUpdate,
    current_user: User = Depends(get_current_manager),
    db: Session = Depends(get_db)
):
    feedback = db.query(Feedback).filter(
        Feedback.id == feedback_id,
        Feedback.manager_id == current_user.id
    ).first()
    
    if not feedback:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Feedback not found"
        )
    
    update_data = feedback_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(feedback, field, value)
    
    feedback.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(feedback)
    
    # Add names for response
    feedback.manager_name = current_user.name
    employee = db.query(User).filter(User.id == feedback.employee_id).first()
    feedback.employee_name = employee.name if employee else "Unknown"
    
    return feedback

@app.put("/api/feedback/{feedback_id}/acknowledge")
async def acknowledge_feedback(
    feedback_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    feedback = db.query(Feedback).filter(
        Feedback.id == feedback_id,
        Feedback.employee_id == current_user.id
    ).first()
    
    if not feedback:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Feedback not found"
        )
    
    feedback.acknowledged = True
    feedback.acknowledged_at = datetime.utcnow()
    db.commit()
    
    return {"message": "Feedback acknowledged successfully"}

# Dashboard endpoints
@app.get("/api/dashboard/manager", response_model=DashboardStats)
async def get_manager_dashboard(
    current_user: User = Depends(get_current_manager),
    db: Session = Depends(get_db)
):
    # Get team members count
    team_members = db.query(User).filter(User.manager_id == current_user.id).all()
    
    # Get all feedback given by manager
    feedbacks = db.query(Feedback).filter(Feedback.manager_id == current_user.id).all()
    
    # Calculate stats
    total_feedbacks = len(feedbacks)
    acknowledged_count = len([f for f in feedbacks if f.acknowledged])
    pending_count = total_feedbacks - acknowledged_count
    
    sentiment_counts = {}
    for feedback in feedbacks:
        sentiment_counts[feedback.sentiment] = sentiment_counts.get(feedback.sentiment, 0) + 1
    
    return DashboardStats(
        total_team_members=len(team_members),
        total_feedbacks=total_feedbacks,
        acknowledged_count=acknowledged_count,
        pending_count=pending_count,
        sentiment_counts=sentiment_counts
    )

@app.get("/api/dashboard/employee", response_model=EmployeeDashboardStats)
async def get_employee_dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get all feedback received by employee
    feedbacks = db.query(Feedback).filter(Feedback.employee_id == current_user.id).all()
    
    # Calculate stats
    total_feedbacks = len(feedbacks)
    acknowledged_count = len([f for f in feedbacks if f.acknowledged])
    pending_count = total_feedbacks - acknowledged_count
    
    sentiment_counts = {}
    for feedback in feedbacks:
        sentiment_counts[feedback.sentiment] = sentiment_counts.get(feedback.sentiment, 0) + 1
    
    return EmployeeDashboardStats(
        total_feedbacks=total_feedbacks,
        acknowledged_count=acknowledged_count,
        pending_count=pending_count,
        sentiment_counts=sentiment_counts
    )

@app.get("/")
async def root():
    return {"message": "Feedback System API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)