# Smart Resume Screener 🎯

> AI-powered recruitment tool that intelligently analyzes resumes and matches them with job descriptions using Google Gemini 2.0


## 🚀 Overview

Smart Resume Screener is an AI-powered recruitment tool that intelligently analyzes resumes and matches them with job descriptions. Built with cutting-edge LLM technology (Google Gemini 2.0), it provides detailed candidate scoring, skill extraction, and hiring recommendations in seconds.

## ✨ Key Features

- 📄 **Batch Resume Processing** - Upload multiple PDF resumes simultaneously
- 🤖 **AI-Powered Analysis** - Semantic matching using Google Gemini 2.0 Flash
- 📊 **Multi-Dimensional Scoring** - Skills, Experience, Education, and Overall fit
- 🎯 **Spider Chart Visualization** - Interactive radar charts for candidate comparison
- 💾 **Persistent Storage** - SQLite database for resume data
- ⚡ **Real-time Processing** - Async architecture for fast batch analysis
- 🎨 **Modern UI** - Beautiful glassmorphic design with 3D animations

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  React 18 + Vite + Tailwind CSS + Framer Motion     │  │
│  │  • Hero Page  • Upload Section  • Results Dashboard  │  │
│  │  • 3D Background (Three.js)  • Spider Charts        │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↕ HTTP/REST
┌─────────────────────────────────────────────────────────────┐
│                        BACKEND API                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              FastAPI (Python 3.9+)                   │  │
│  │  • /batch-upload  • /match  • /resumes  • /delete   │  │
│  └──────────────────────────────────────────────────────┘  │
│                              ↕                               │
│  ┌─────────────────┐    ┌──────────────────────────────┐  │
│  │  PyMuPDF        │    │   Google Gemini 2.0 Flash    │  │
│  │  PDF Extraction │    │   LLM Processing & Matching  │  │
│  └─────────────────┘    └──────────────────────────────┘  │
│                              ↕                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           SQLite Database (SQLAlchemy ORM)           │  │
│  │  Stores: Resumes, Scores, Skills, Analysis Results  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 🧠 LLM Integration

**Model Used:** Google Gemini 2.0 Flash (`gemini-2.0-flash-exp`)

### Prompt Engineering Strategy

Our LLM prompt follows a structured approach for optimal results:

```
SYSTEM ROLE: Expert technical recruiter and talent evaluator

TASK BREAKDOWN:
1. Extract Structured Data (Skills, Experience, Education)
2. Semantic Matching & Scoring (0-10 scale)
3. Gap Analysis (Strengths vs Missing Requirements)
4. Hiring Recommendation

SCORING CRITERIA:
- 9-10: Exceptional match (exceeds requirements)
- 7-8: Strong match (meets most requirements)
- 5-6: Moderate match (shows potential)
- 3-4: Weak match (lacks key qualifications)
- 0-2: Poor match (fundamentally misaligned)

OUTPUT: Strictly valid JSON with candidate data and analysis
```

### Key Prompt Features

- **Semantic Understanding** - Recognizes "React" ≈ "Frontend Frameworks"
- **Multi-Factor Scoring** - Evaluates 4 dimensions independently
- **Justification Requirement** - Forces LLM to explain its reasoning
- **Structured JSON Output** - Ensures consistent, parseable responses
- **Error Handling** - Graceful degradation with default values

### Sample LLM Response

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "skills": ["Python", "React", "AWS", "Machine Learning"],
  "overall_score": 8.3,
  "skills_score": 8.5,
  "experience_score": 8.0,
  "education_score": 7.5,
  "strengths": [
    "Strong Python and ML expertise matching job requirements",
    "Proven cloud architecture experience with AWS"
  ],
  "gaps": [
    "Limited Kubernetes experience mentioned in JD",
    "No direct team leadership experience"
  ],
  "justification": "Candidate shows excellent technical alignment...",
  "recommendation": "Recommended"
}
```

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM for database operations
- **PyMuPDF** - PDF text extraction
- **Google Generative AI** - LLM integration
- **SQLite** - Lightweight persistent storage

### Frontend
- **React 18** - UI library with hooks
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Advanced animations
- **Three.js** (@react-three/fiber) - 3D background effects
- **Recharts** - Spider chart visualizations
- **React Dropzone** - Drag-and-drop file uploads

## 📦 Installation & Setup

### Prerequisites
- Python 3.9+
- Node.js 18+
- Google Gemini API Key

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo "GEMINI_API_KEY=your_api_key_here" > .env

# Initialize database
python reset_database.py

# Run server
uvicorn main:app --reload
```

Backend runs on `http://localhost:8000`

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend runs on `http://localhost:5173`

## 🎯 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check & API info |
| POST | `/batch-upload` | Upload multiple PDF resumes |
| POST | `/match` | Match resumes with job description |
| GET | `/resumes` | List all stored resumes |
| GET | `/resume/{id}` | Get detailed resume data |
| DELETE | `/resumes/{id}` | Delete specific resume |
| DELETE | `/resumes` | Clear all resume data |

## 📊 Database Schema

```sql
CREATE TABLE resumes (
    id INTEGER PRIMARY KEY,
    filename VARCHAR,
    candidate_name VARCHAR,
    email VARCHAR,
    phone VARCHAR,
    
    -- Extracted Data
    skills TEXT,              -- Comma-separated list
    experience TEXT,          -- Work history summary
    education TEXT,           -- Academic background
    raw_text TEXT,            -- Full resume text
    
    -- Match Scores (0-10 scale)
    match_score FLOAT,
    skills_score FLOAT,
    experience_score FLOAT,
    education_score FLOAT,
    
    -- Analysis Results
    justification TEXT,
    job_description TEXT,
    
    -- Metadata
    created_at DATETIME
);
```

## 🎬 Usage Workflow

1. **Upload Resumes** → Drag & drop PDF files
2. **Enter Job Description** → Paste JD text
3. **Click "Analyze"** → AI processes all resumes
4. **View Results** → Ranked candidates with scores
5. **Expand Details** → See spider charts, strengths, gaps
6. **Delete/Clear** → Manage candidate database

## 🎨 UI Features

- **3D Animated Background** - Floating particles using Three.js
- **Glassmorphic Cards** - Modern frosted glass effect
- **Spider Charts** - Multi-dimensional score visualization
- **Smooth Animations** - Framer Motion transitions
- **Responsive Design** - Works on all screen sizes
- **Loading States** - Engaging progress indicators
- **Toast Notifications** - User feedback system

## 🔒 Security & Best Practices

✅ Environment variables for API keys  
✅ CORS middleware configuration  
✅ SQL injection prevention (ORM)  
✅ File type validation (PDF only)  
✅ Error handling & graceful degradation  
✅ Async/await for non-blocking operations  
✅ Database session management  

## 📈 Performance Optimization

- **Async Processing** - Parallel resume analysis
- **ThreadPoolExecutor** - CPU-intensive tasks offloaded
- **Database Indexing** - Fast query performance
- **Lazy Loading** - Load details on demand
- **Optimized Re-renders** - React.memo & useMemo

## 🚀 Future Enhancements

- [ ] Export results to Excel/CSV
- [ ] Email integration for candidate outreach
- [ ] Advanced filters (years of experience, location)
- [ ] Interview scheduling integration
- [ ] Multi-language resume support
- [ ] Resume similarity detection (prevent duplicates)
- [ ] Custom scoring weight configuration


---

⭐ **If you found this project helpful, please star the repository!** ⭐