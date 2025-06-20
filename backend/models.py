from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# User Models
class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str

class UserCreate(UserBase):
    password: str
    manager_id: Optional[str] = None

class UserResponse(UserBase):
    id: str
    manager_id: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Feedback Models
class FeedbackBase(BaseModel):
    strengths: str
    improvements: str
    sentiment: str

class FeedbackCreate(FeedbackBase):
    employee_id: str

class FeedbackUpdate(BaseModel):
    strengths: Optional[str] = None
    improvements: Optional[str] = None
    sentiment: Optional[str] = None

class FeedbackResponse(FeedbackBase):
    id: str
    manager_id: str
    employee_id: str
    acknowledged: bool
    acknowledged_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    manager_name: str
    employee_name: str
    
    class Config:
        from_attributes = True

# Dashboard Models
class DashboardStats(BaseModel):
    total_team_members: int
    total_feedbacks: int
    acknowledged_count: int
    pending_count: int
    sentiment_counts: dict

class EmployeeDashboardStats(BaseModel):
    total_feedbacks: int
    acknowledged_count: int
    pending_count: int
    sentiment_counts: dict

# Token Models
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None