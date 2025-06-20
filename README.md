# FeedbackFlow - Employee Feedback System

A comprehensive feedback management system designed for internal team communication between managers and employees. Built with React, TypeScript, and Tailwind CSS for the frontend, and Python FastAPI with SQLite for the backend.

## 🌟 Features

### Core Features (MVP)
- **Role-based Authentication**: Secure JWT-based login system with Manager and Employee roles
- **Structured Feedback Submission**: Managers can provide detailed feedback including strengths, improvements, and sentiment
- **Feedback History & Timeline**: Complete visibility of feedback history for both roles
- **Acknowledgment System**: Employees can acknowledge received feedback
- **Interactive Dashboards**: Role-specific dashboards with analytics and insights
- **Team Management**: Managers can view and manage their team members

### Additional Features
- **Sentiment Analysis**: Visual tracking of feedback sentiment trends
- **Real-time Updates**: Instant feedback status updates
- **Responsive Design**: Optimized for desktop and mobile devices
- **Modern UI/UX**: Clean, professional interface with smooth animations

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Context API** for state management

### Backend
- **FastAPI** (Python) - Modern, fast web framework
- **SQLAlchemy** - SQL toolkit and ORM
- **SQLite** - Lightweight database for development
- **JWT Authentication** - Secure token-based authentication
- **Pydantic** - Data validation using Python type annotations
- **Uvicorn** - ASGI server implementation

### Database Schema
- **Users Table**: User management with roles and team relationships
- **Feedbacks Table**: Structured feedback storage with acknowledgment tracking
- **Relationships**: Proper foreign key constraints and relationships

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- Docker (optional, for containerized backend)

### Frontend Setup
1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Access the application**
   - Open http://localhost:5173 in your browser

### Backend Setup

#### Option 1: Local Development
1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Create data directory**
   ```bash
   mkdir data
   ```

5. **Start the server**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

#### Option 2: Docker (Recommended)
1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Build and run with Docker**
   ```bash
   docker build -t feedback-backend .
   docker run -p 8000:8000 -v $(pwd)/data:/app/data feedback-backend
   ```

   Or using docker-compose:
   ```bash
   docker-compose up --build
   ```

3. **Access the API**
   - API Documentation: http://localhost:8000/docs
   - Health Check: http://localhost:8000/health

### Demo Accounts
The application includes demo accounts for testing:

**Manager Account:**
- Email: `sarah@company.com`
- Password: `demo123`
- Role: Manager with team members

**Employee Account:**
- Email: `alex@company.com`
- Password: `demo123`
- Role: Employee

Additional accounts available in the login interface.

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
    id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    hashed_password VARCHAR NOT NULL,
    role VARCHAR NOT NULL,  -- 'manager' or 'employee'
    manager_id VARCHAR REFERENCES users(id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Feedbacks Table
```sql
CREATE TABLE feedbacks (
    id VARCHAR PRIMARY KEY,
    manager_id VARCHAR NOT NULL REFERENCES users(id),
    employee_id VARCHAR NOT NULL REFERENCES users(id),
    strengths TEXT NOT NULL,
    improvements TEXT NOT NULL,
    sentiment VARCHAR NOT NULL,  -- 'positive', 'neutral', 'negative'
    acknowledged BOOLEAN DEFAULT FALSE,
    acknowledged_at DATETIME NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login (returns JWT token)
- `GET /api/auth/me` - Get current user information

### Users
- `GET /api/users/team` - Get team members (managers only)

### Feedback
- `POST /api/feedback` - Create new feedback (managers only)
- `GET /api/feedback/given` - Get feedback given by manager
- `GET /api/feedback/received` - Get feedback received by employee
- `PUT /api/feedback/{id}` - Update feedback (managers only)
- `PUT /api/feedback/{id}/acknowledge` - Acknowledge feedback (employees only)

### Dashboard
- `GET /api/dashboard/manager` - Get manager dashboard statistics
- `GET /api/dashboard/employee` - Get employee dashboard statistics

## 🎨 Design Decisions

### UI/UX Design
- **Color Scheme**: Professional blue and teal palette (#2563EB primary, #0891B2 secondary)
- **Typography**: Inter font family for excellent readability
- **Layout**: Card-based design with consistent 8px spacing system
- **Animations**: Subtle transitions and micro-interactions for enhanced UX
- **Accessibility**: High contrast ratios and keyboard navigation support

### Architecture Decisions
- **Component Structure**: Organized by feature (Auth, Dashboard, Feedback, etc.)
- **State Management**: Context API for global state, local state for component-specific data
- **Type Safety**: Full TypeScript implementation with strict type checking
- **Error Handling**: Comprehensive error boundaries and user feedback
- **API Design**: RESTful API with proper HTTP status codes and error responses

### Security Considerations
- **JWT Authentication**: Secure token-based authentication with expiration
- **Role-based Access Control**: Strict separation between manager and employee capabilities
- **Data Validation**: Server-side validation using Pydantic models
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **Password Hashing**: Bcrypt for secure password storage

## 🐳 Docker Configuration

### Dockerfile
The backend includes a production-ready Dockerfile with:
- Python 3.11 slim base image
- Proper dependency caching
- Security best practices
- Health checks
- Volume mounting for database persistence

### Docker Compose
Includes a docker-compose.yml for easy development setup with:
- Automatic container restart
- Volume mounting for data persistence
- Environment variable configuration
- Port mapping

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

Key responsive features:
- Adaptive navigation (sidebar collapses on mobile)
- Flexible grid layouts
- Touch-friendly interactions
- Optimized content hierarchy

## 🧪 Testing Strategy

### Backend Testing
- **FastAPI Test Client**: Built-in testing capabilities
- **Database Testing**: In-memory SQLite for tests
- **API Endpoint Testing**: Comprehensive endpoint coverage
- **Authentication Testing**: JWT token validation tests

### Frontend Testing
- **Component Testing**: React Testing Library setup ready
- **Integration Testing**: User flow testing capabilities
- **Type Safety**: TypeScript compile-time error checking

## 🚀 Deployment

### Frontend Deployment
- **Vercel/Netlify**: Static site deployment ready
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### Backend Deployment
- **Docker**: Production-ready containerization
- **Environment Variables**: Configurable via .env file
- **Database**: SQLite for development, PostgreSQL recommended for production
- **Health Checks**: Built-in health check endpoints

## 🔮 Future Enhancements

### Bonus Features (Roadmap)
- [ ] **Email Notifications**: Automated feedback notifications
- [ ] **Peer Feedback**: Anonymous peer-to-peer feedback system
- [ ] **PDF Export**: Export feedback reports as PDF
- [ ] **Advanced Analytics**: Detailed feedback analytics and insights
- [ ] **Feedback Templates**: Pre-defined feedback templates
- [ ] **Mobile App**: React Native mobile application
- [ ] **Integration**: Slack/Teams integration for notifications

### Technical Improvements
- [ ] **PostgreSQL**: Production database migration
- [ ] **Redis**: Caching and session management
- [ ] **WebSocket**: Real-time notifications
- [ ] **Kubernetes**: Container orchestration
- [ ] **CI/CD**: Automated testing and deployment

## 🤖 AI Assistance Acknowledgment

This project was developed with assistance from AI tools for:
- **Code Generation**: Initial boilerplate and structure generation
- **Documentation**: README formatting and technical documentation
- **Best Practices**: Architecture decisions and security implementations
- **Testing Strategies**: Test case suggestions and implementation patterns

All AI-generated code was thoroughly reviewed, tested, and customized to meet the specific requirements of this feedback system. The core business logic, database design, and user experience decisions were made through careful analysis and planning.

## 👥 Development Notes

### Key Implementation Highlights
- **Clean Architecture**: Separation of concerns between frontend and backend
- **Type Safety**: Full TypeScript implementation with proper type definitions
- **Security First**: JWT authentication with proper role-based access control
- **User Experience**: Intuitive interface with clear feedback flows
- **Scalability**: Modular design ready for future enhancements

### Performance Considerations
- **Database Indexing**: Proper indexes on frequently queried columns
- **API Optimization**: Efficient queries with minimal data transfer
- **Frontend Optimization**: Component memoization and lazy loading ready
- **Caching Strategy**: Ready for Redis implementation

## 📄 License

This project was developed as a technical demonstration for a Python developer internship application. It showcases full-stack development capabilities, clean code practices, and modern web development techniques.

---

**Note**: This is a comprehensive feedback management system built to demonstrate technical skills in Python backend development, React frontend development, database design, and system architecture. The focus is on clean, maintainable code and professional development practices.