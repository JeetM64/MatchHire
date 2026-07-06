# MatchHire - Complete Project Overview

## 🎯 Project Purpose

**MatchHire** is an AI-powered interview preparation and matching platform that helps candidates analyze their qualifications against job requirements and provides personalized interview guidance using Google Gemini AI.

---

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        MATCHHIRE PLATFORM                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────┐          ┌──────────────────────┐   │
│  │    FRONTEND (React)  │◄────────►│   BACKEND (Node.js)  │   │
│  │      Vite + MUI      │ Axios    │   Express.js         │   │
│  └──────────────────────┘          └──────────────────────┘   │
│          ▲                                    ▲                 │
│          │                                    │                 │
│          │ HTTP/REST                         │                 │
│          │                                    ├─────────────┐   │
│          │                                    ▼             ▼   │
│          │                          ┌──────────────┐  ┌────────┴──┐
│          │                          │  MongoDB     │  │ Google   │
│          │                          │  (Database)  │  │ Gemini   │
│          │                          └──────────────┘  │ AI API   │
│          │                                            └──────────┘
│          │
│          └─────────► Browser (Localhost:5173)
│
└─────────────────────────────────────────────────────────────────┘
```

---

## 🏢 Backend Architecture

### Technology Stack
- **Framework**: Express.js v5.2.1
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (jsonwebtoken)
- **AI Integration**: Google Gemini AI v2.10
- **File Processing**: pdf-parse v2.4.5
- **Validation**: Zod v4.4.3
- **Password Hashing**: bcryptjs v3.0.3
- **File Upload**: Multer v2.2.0
- **Development**: Nodemon v3.1.14

### Project Structure

```
backend/
├── src/
│   ├── app.js                          ← Express app setup
│   ├── config/
│   │   └── db.js                       ← MongoDB connection
│   ├── controllers/
│   │   ├── auth.contollers.js          ← Auth logic
│   │   └── interview.controller.js     ← Interview report generation
│   ├── middleware/
│   │   ├── auth.middleware.js          ← JWT verification
│   │   └── file.middleware.js          ← File upload handling
│   ├── models/
│   │   ├── user.model.js               ← User schema
│   │   ├── interviewReport.model.js    ← Interview data schema
│   │   └── blacklist.model.js          ← Token blacklist schema
│   ├── router/
│   │   ├── auth.router.js              ← Auth endpoints
│   │   └── interview.routes.js         ← Interview endpoints
│   └── services/
│       ├── ai.service.js               ← Gemini AI integration
│       └── temp.js                     ← Test data
├── server.js                            ← Entry point
├── package.json
├── .env                                 ← Environment variables
└── node_modules/
```

---

## 🔐 **Backend Features by Component**

### 1️⃣ **Authentication System**

#### `auth.controllers.js`
**registerUser()**
- Validates input (username, email, password)
- Checks for duplicate username/email
- Hashes password with bcryptjs (salt: 10)
- Creates user in MongoDB
- Generates JWT token (expires in 1 day)
- Sets HTTP-only cookie
- Returns user data + token

**loginUser()**
- Validates email and password
- Finds user by email
- Compares passwords with bcrypt
- Generates new JWT token
- Sets HTTP-only cookie
- Returns user data + token

**logoutUser()**
- Adds token to blacklist
- Clears authentication cookie
- Returns success message

**getMeController()**
- Retrieves current user profile
- Requires valid JWT token
- Returns user information

#### `auth.middleware.js`
- Extracts JWT from cookies or Authorization header
- Verifies token signature using JWT_SECRET
- Checks if token is blacklisted
- Attaches user info to request
- Returns 401 if token invalid/expired

---

### 2️⃣ **Interview Report System**

#### `interview.controller.js` - createInterviewReport()
**Input:**
- Resume file (PDF/DOC/DOCX) - uploaded by user
- Job description (text)
- Self description (text)

**Process:**
1. Validates resume file is present
2. Parses PDF content using pdf-parse
3. Extracts text from resume buffer
4. Sends to AI service with prompt engineering
5. Receives structured interview analysis
6. Saves complete report to MongoDB
7. Returns success response

---

### 3️⃣ **AI Integration (Gemini AI)**

#### `ai.service.js` - generateInterviewReport()
**Input Schema (Zod):**
```javascript
{
  matchScore: number (0-100),
  technicalQuestions: [
    {
      question: string,
      intention: string,
      answer: string
    }
  ],
  behavioralQuestions: [
    {
      question: string,
      intention: string,
      answer: string
    }
  ],
  skillGaps: [
    {
      skills: string,
      severity: "low" | "medium" | "high"
    }
  ],
  preparationPlan: [
    {
      day: string,
      focus: string,
      tasks: [string]
    }
  ]
}
```

**AI Analysis Includes:**
- Resume-to-Job-Description match score
- Technical interview questions tailored to role
- Behavioral interview questions
- Identified skill gaps with severity levels
- Day-by-day preparation plan
- Tip and strategies for success

---

### 4️⃣ **Data Models**

#### User Model
```javascript
{
  username: String (unique, required, trimmed),
  email: String (unique, required, lowercase, trimmed),
  password: String (hashed, required),
  createdAt: Date,
  updatedAt: Date
}
```

#### Interview Report Model
```javascript
{
  user: ObjectId (ref: User),
  resume: String,
  jobDescription: String,
  selfDescription: String,
  matchScore: Number,
  technicalQuestions: [TechnicalQuestionSchema],
  behavioralQuestions: [BehavioralQuestionSchema],
  skillGaps: [SkillGapSchema],
  preparationPlan: [PreparationPlanSchema],
  createdAt: Date,
  updatedAt: Date
}
```

#### Token Blacklist Model
```javascript
{
  token: String (unique),
  createdAt: Date,
  expiresAt: Date
}
```

---

### 5️⃣ **API Routes**

#### Authentication Routes
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ No | Register new user |
| POST | `/api/auth/login` | ❌ No | Login user |
| GET | `/api/auth/logout` | ✅ Yes | Logout user |
| GET | `/api/auth/get-me` | ✅ Yes | Get profile |

#### Interview Routes
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/interview` | ✅ Yes | Create interview report |
| GET | `/api/interview` | ✅ Yes | List user interviews (optional) |
| GET | `/api/interview/:id` | ✅ Yes | Get specific interview (optional) |

---

### 6️⃣ **Middleware**

#### Auth Middleware
- Location: `middleware/auth.middleware.js`
- Applied to: All protected routes
- Validates JWT tokens
- Checks blacklist
- Extracts user info

#### File Upload Middleware
- Location: `middleware/file.middleware.js`
- Handles multipart form data
- Validates file types
- Stores in memory for processing

---

## 🎨 Frontend Architecture

### Technology Stack
- **Framework**: React v19.2.7
- **Build Tool**: Vite v8.1.0
- **Routing**: React Router v7.18.0
- **UI Library**: Material-UI v9.2.0
- **HTTP Client**: Axios v1.18.1
- **Styling**: Emotion + SASS
- **Icons**: MUI Icons v9.2.0

### Project Structure

```
frontend/
├── src/
│   ├── config/
│   │   └── axiosConfig.js              ← API configuration
│   ├── components/
│   │   └── ProtectedRoute.jsx           ← Auth route wrapper
│   ├── pages/
│   │   ├── Dashboard.jsx                ← Main user hub
│   │   ├── Interview.jsx                ← Interview form
│   │   └── InterviewReport.jsx          ← Report display
│   ├── features/
│   │   ├── auth/
│   │   │   ├── auth.context.jsx         ← Auth state
│   │   │   ├── services/
│   │   │   │   └── authAPI.js           ← Auth API calls
│   │   │   └── pages/
│   │   │       ├── Login.jsx
│   │   │       └── Register.jsx
│   │   └── ai/
│   │       └── services/
│   │           └── interviewAPI.js      ← Interview API calls
│   ├── theme/
│   │   └── theme.js                     ← MUI theme config
│   ├── App.jsx                          ← Root component
│   ├── app.routes.jsx                   ← Route definitions
│   ├── main.jsx                         ← Entry point
│   └── index.css
├── public/
├── .env                                 ← Environment variables
├── vite.config.js
└── package.json
```

---

## 🎯 **Frontend Features by Component**

### 1️⃣ **Authentication Context** (auth.context.jsx)

**State:**
```javascript
{
  user: Object | null,
  loading: Boolean,
  error: String | null,
  isAuthenticated: Boolean
}
```

**Methods:**
- `login(email, password)` - Authenticate user
- `register(name, email, password)` - Create account
- `logout()` - Sign out user
- `getMe()` - Fetch current user

**Features:**
- Persists login with localStorage
- Auto-logout on 401 response
- Global auth state management

---

### 2️⃣ **Protected Routes** (ProtectedRoute.jsx)

**Functionality:**
- Checks if user is authenticated
- Shows loading spinner while checking
- Redirects unauthenticated users to login
- Wraps protected pages

---

### 3️⃣ **Pages**

#### Login Page (`/login`)
**UI Components:**
- Email input field
- Password input with visibility toggle
- "Sign In" button
- Error alert display
- Link to register page
- Beautiful gradient background

**Functionality:**
- Form validation
- API call to backend
- Auto-redirect to dashboard on success
- Error message display

#### Register Page (`/register`)
**UI Components:**
- Full name input
- Email input
- Password input with visibility toggle
- Password confirmation
- "Create Account" button
- Link to login page

**Functionality:**
- Email validation (regex)
- Password strength check (min 6 chars)
- Password matching validation
- API call to backend
- Auto-login after registration

#### Dashboard (`/dashboard`)
**UI Components:**
- AppBar with navigation
- User greeting with name
- Sidebar drawer menu
- Interview list (cards)
- "Create New Interview" button
- Empty state when no interviews
- Loading spinner

**Functionality:**
- Displays user profile
- Lists all user's interviews
- Navigation menu
- Logout button
- "Create Interview" quick action

#### Interview Creation (`/interview/create`)
**Multi-Step Form:**
1. **Step 1 - Resume Upload**
   - Drag & drop zone
   - File upload input
   - Supported formats: PDF, DOC, DOCX

2. **Step 2 - Job Description**
   - Large text area
   - Paste job posting

3. **Step 3 - Self Description**
   - Large text area
   - Your experience & interest

4. **Step 4 - Review**
   - Show resume filename
   - Show truncated job description
   - Show truncated self description
   - Submit button

**Features:**
- Progress indicator (Stepper)
- Form validation on each step
- Back/Next navigation
- Loading state during submission
- Error handling with alerts

#### Interview Report (`/interview/:id`)
**Display Sections:**
1. **Header**
   - Job title
   - Company name
   - Overall score (circular indicator with color)
   - Date created

2. **Overall Feedback**
   - Text analysis from AI

3. **Technical Analysis**
   - Coding skills (0-10)
   - Problem solving (0-10)
   - Communication (0-10)
   - Experience level (0-10)
   - Progress bars for each

4. **Strengths**
   - Bulleted list with checkmarks
   - Green styling

5. **Areas for Improvement**
   - Bulleted list with warning icons
   - Amber styling

6. **Recommended Next Steps**
   - Numbered list
   - 1-5 action items
   - Numbered badges

7. **Action Buttons**
   - Download report
   - Share report
   - Back to dashboard
   - Create another interview

---

### 4️⃣ **API Integration**

#### Axios Configuration (axiosConfig.js)
**Features:**
- Base URL: `http://localhost:3000/api`
- Automatic token injection
- Request interceptor: Adds JWT to headers
- Response interceptor: Handles 401 errors
- Credentials enabled
- CORS support

#### Auth API Service (authAPI.js)
```javascript
{
  register(data): POST /auth/register,
  login(data): POST /auth/login,
  logout(): GET /auth/logout,
  getMe(): GET /auth/get-me
}
```

#### Interview API Service (interviewAPI.js)
```javascript
{
  createInterviewReport(data): POST /interview,
  getInterviewReports(): GET /interview,
  getInterviewReport(id): GET /interview/:id
}
```

---

### 5️⃣ **UI Theme** (theme.js)

**Color Palette:**
- Primary Blue: `#2563eb`
- Secondary Green: `#10b981`
- Success: `#10b981`
- Error: `#ef4444`
- Warning: `#f59e0b`
- Background: `#f9fafb`

**Typography:**
- Font Family: Roboto
- H1-H6 with custom sizing
- Body1, Body2 variants

**Components:**
- Button: Custom styling, no ripple
- Card: Hover effect with shadow
- TextField: Focused border highlight
- All components: 8px border radius

---

## 🔄 Data Flow

### User Registration Flow
```
1. User enters name, email, password
   ↓
2. Frontend validates input
   ↓
3. POST /api/auth/register
   ↓
4. Backend validates fields
   ↓
5. Check for existing user
   ↓
6. Hash password
   ↓
7. Create user in MongoDB
   ↓
8. Generate JWT token
   ↓
9. Return token + user data
   ↓
10. Frontend stores token in localStorage
    ↓
11. Auto-login user
    ↓
12. Redirect to dashboard
```

### Interview Creation Flow
```
1. User uploads resume (PDF/DOC/DOCX)
   ↓
2. User pastes job description
   ↓
3. User writes self description
   ↓
4. User reviews information
   ↓
5. Submit multipart form data
   ↓
6. POST /api/interview with file + text
   ↓
7. Backend parses PDF
   ↓
8. Send to Gemini AI with structured prompt
   ↓
9. Gemini returns analysis (match score, questions, gaps, plan)
   ↓
10. Save to MongoDB
    ↓
11. Return report data
    ↓
12. Frontend displays results
    ↓
13. User sees interview analysis
```

---

## 🔐 Security Features

### Authentication
✅ Password hashing (bcryptjs)
✅ JWT tokens (1-day expiry)
✅ HTTP-only cookies
✅ Token blacklist for logout
✅ Protected routes

### API Security
✅ CORS enabled
✅ SameSite cookie policy
✅ Input validation (Zod)
✅ File upload validation
✅ Secure headers

### Environment Variables
✅ `.env` file for secrets
✅ JWT_SECRET
✅ MONGO_URI
✅ GOOGLE_GENAI_API_KEY

---

## 📱 Responsive Design

**Breakpoints:**
- Mobile: 0px - 600px (100% width)
- Tablet: 600px - 960px (2 columns)
- Desktop: 960px+ (3+ columns)

**Features:**
- Flex-based layouts
- Mobile-first CSS
- Touch-friendly buttons
- Responsive typography
- Stack on mobile

---

## 🚀 Deployment Architecture

### Development Setup
```
localhost:5173 (Frontend - Vite)
        ↓ (Axios)
localhost:3000 (Backend - Express)
        ↓ (Mongoose)
MongoDB (Local: mongodb://localhost:27017)
```

### Build Commands

**Frontend:**
```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview build
```

**Backend:**
```bash
npm run dev      # Nodemon auto-reload
```

---

## 📊 Feature Comparison

| Feature | Status | Component |
|---------|--------|-----------|
| User Registration | ✅ Complete | auth.controller.js |
| User Login | ✅ Complete | auth.controller.js |
| User Logout | ✅ Complete | auth.controller.js |
| JWT Authentication | ✅ Complete | auth.middleware.js |
| Resume Upload | ✅ Complete | interview.controller.js |
| Resume Parsing | ✅ Complete | ai.service.js |
| AI Analysis | ✅ Complete | ai.service.js |
| Interview Report | ✅ Complete | interviewReport.model.js |
| Dashboard | ✅ Complete | Dashboard.jsx |
| Login UI | ✅ Complete | Login.jsx |
| Register UI | ✅ Complete | Register.jsx |
| Interview Form | ✅ Complete | Interview.jsx |
| Report Display | ✅ Complete | InterviewReport.jsx |
| Protected Routes | ✅ Complete | ProtectedRoute.jsx |

---

## 🎓 Learning Path for New Developers

1. **Start with Backend**
   - Understand Express.js structure
   - Review `src/app.js` for middleware setup
   - Check `src/router/` for API routes
   - Study `src/controllers/` for business logic
   - Review `src/services/ai.service.js` for AI integration

2. **Study Database**
   - Review models in `src/models/`
   - Understand Mongoose schemas
   - See how data is structured

3. **Understand Frontend**
   - Start with routing: `app.routes.jsx`
   - Review auth context: `features/auth/auth.context.jsx`
   - Check API calls: `features/*/services/`
   - Study pages: `pages/`

4. **Run Locally**
   - Start backend: `npm run dev` in backend/
   - Start frontend: `npm run dev` in frontend/
   - Test flow: Register → Login → Create Interview → View Report

---

## 🔧 Configuration Files

### Backend (.env)
```
MONGO_URI=mongodb://localhost:27017/gen_ai
JWT_SECRET=<your-secret-key>
GOOGLE_GENAI_API_KEY=<your-api-key>
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000/api
```

---

## 📈 Scalability Considerations

**Current State:**
- Single MongoDB instance
- Local file storage (could be S3)
- Synchronous AI processing

**Future Improvements:**
- Database indexing on user_id, createdAt
- Caching for frequently accessed reports
- Async job queue for AI processing
- Rate limiting on API endpoints
- CDN for frontend static assets
- Database replication
- Load balancing

---

## 🐛 Error Handling

### Backend
- Express error middleware
- Zod validation errors
- MongoDB connection errors
- JWT verification errors
- File upload errors

### Frontend
- Axios interceptors
- Form validation errors
- Auth state errors
- API response errors
- Loading states

---

## ✅ Ready Features

✅ Full authentication system (register, login, logout)
✅ JWT-based session management
✅ Resume PDF parsing
✅ AI-powered interview analysis using Gemini
✅ Professional Material-UI frontend
✅ Responsive design
✅ Protected routes
✅ Multi-step interview form
✅ Interview report with detailed analysis
✅ User dashboard
✅ MongoDB integration
✅ API endpoints with validation
✅ Token blacklist for logout

---

## 🎯 Summary

**MatchHire** is a full-stack application that leverages:
- **React** for modern, responsive UI
- **Express.js** for robust API backend
- **MongoDB** for data persistence
- **Google Gemini AI** for intelligent interview analysis
- **Material-UI** for professional design

The application guides users through a seamless workflow from registration to receiving personalized interview preparation strategies powered by AI analysis of their resume against job descriptions.

