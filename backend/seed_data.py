from sqlalchemy.orm import Session
from database import SessionLocal, User, Feedback
from auth import get_password_hash
import uuid
from datetime import datetime, timedelta

def create_seed_data():
    db = SessionLocal()
    
    # Check if data already exists
    if db.query(User).first():
        print("Seed data already exists")
        db.close()
        return
    
    # Create users
    users_data = [
        {
            "id": "1",
            "name": "Sarah Johnson",
            "email": "sarah@company.com",
            "role": "manager",
            "password": "demo123"
        },
        {
            "id": "2",
            "name": "Alex Chen",
            "email": "alex@company.com",
            "role": "employee",
            "password": "demo123",
            "manager_id": "1"
        },
        {
            "id": "3",
            "name": "Jordan Smith",
            "email": "jordan@company.com",
            "role": "employee",
            "password": "demo123",
            "manager_id": "1"
        },
        {
            "id": "4",
            "name": "Maya Patel",
            "email": "maya@company.com",
            "role": "employee",
            "password": "demo123",
            "manager_id": "1"
        },
        {
            "id": "5",
            "name": "David Wilson",
            "email": "david@company.com",
            "role": "manager",
            "password": "demo123"
        },
        {
            "id": "6",
            "name": "Emma Davis",
            "email": "emma@company.com",
            "role": "employee",
            "password": "demo123",
            "manager_id": "5"
        },
        {
            "id": "7",
            "name": "Ryan Taylor",
            "email": "ryan@company.com",
            "role": "employee",
            "password": "demo123",
            "manager_id": "5"
        }
    ]
    
    # Create users
    for user_data in users_data:
        user = User(
            id=user_data["id"],
            name=user_data["name"],
            email=user_data["email"],
            role=user_data["role"],
            hashed_password=get_password_hash(user_data["password"]),
            manager_id=user_data.get("manager_id")
        )
        db.add(user)
    
    # Create sample feedback
    feedbacks_data = [
        {
            "id": "1",
            "manager_id": "1",
            "employee_id": "2",
            "strengths": "Excellent problem-solving skills and great attention to detail. Alex consistently delivers high-quality code and is always willing to help teammates.",
            "improvements": "Could benefit from more proactive communication during project planning phases. Consider participating more in team meetings.",
            "sentiment": "positive",
            "acknowledged": True,
            "acknowledged_at": datetime.utcnow() - timedelta(days=1)
        },
        {
            "id": "2",
            "manager_id": "1",
            "employee_id": "3",
            "strengths": "Outstanding communication skills and natural leadership qualities. Jordan excels at mentoring junior team members.",
            "improvements": "Focus on time management for project deadlines. Sometimes takes on too many tasks simultaneously.",
            "sentiment": "positive",
            "acknowledged": False
        },
        {
            "id": "3",
            "manager_id": "1",
            "employee_id": "4",
            "strengths": "Creative thinking and innovative approach to problem-solving. Maya brings fresh perspectives to team discussions.",
            "improvements": "Work on code documentation and commenting practices. Also, consider improving testing coverage.",
            "sentiment": "neutral",
            "acknowledged": True,
            "acknowledged_at": datetime.utcnow() - timedelta(days=2)
        },
        {
            "id": "4",
            "manager_id": "5",
            "employee_id": "6",
            "strengths": "Exceptional analytical skills and thorough approach to testing. Emma catches bugs that others miss.",
            "improvements": "Could improve presentation skills for client meetings. Also consider learning new frontend frameworks.",
            "sentiment": "positive",
            "acknowledged": False
        }
    ]
    
    # Create feedback
    for feedback_data in feedbacks_data:
        feedback = Feedback(**feedback_data)
        db.add(feedback)
    
    db.commit()
    db.close()
    print("Seed data created successfully")

if __name__ == "__main__":
    create_seed_data()