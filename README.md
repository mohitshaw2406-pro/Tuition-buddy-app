# 🎓 Tuition Buddy

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19.2-61dafb.svg?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646cff.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express-5.2-000000.svg?logo=express&logoColor=white)](https://expressjs.com/)
[![Firebase](https://img.shields.io/badge/Firebase-v12-ffca28.svg?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![CBSE Curriculum](https://img.shields.io/badge/Curriculum-CBSE%202026--27-4f46e5.svg)](#-cbse-2026-27-curriculum-registry)

> **Full-Stack AI Tuition Coaching Platform for Indian Students (Classes 6–12)**  
> Personalized bilingual (Hinglish/English) doubt resolution, curriculum-grounded chapter quizzes, multi-session chat history, and comprehensive coaching center administration.

---

## 📌 Overview

**Tuition Buddy** is a modern, full-stack educational web platform designed specifically for the Indian school ecosystem. It addresses the unique linguistic and academic realities faced by students in **Classes 6 through 12** studying under the **CBSE/NCERT** framework:

1. **Linguistic Comfort**: Natural conversational **Hinglish** (Roman Hindi mixed with standard English technical/scientific terminology), eliminating the communication barrier in learning tough concepts.
2. **Pedagogical Alignment**: Strictly bounded to the **CBSE 2026-27 Academic Curriculum**, preventing hallucinations or out-of-syllabus questions.
3. **Coaching Center Governance**: A protected administrative control plane for coaching teachers, tutors, and institute admins to approve student registrations, manage enrollments, track performance, and broadcast announcements.

Repository: [https://github.com/mohitshaw2406-pro/Tuition-buddy-app](https://github.com/mohitshaw2406-pro/Tuition-buddy-app)

---

## 🌟 Key Features

### 1. 💬 AI Chat Tutor (Bilingual & Socratic)
- **Natural Hinglish By Default**: Explains complex scientific formulas, mathematical proofs, and literature in conversational Hinglish while preserving exact academic terms (e.g., *Photosynthesis*, *Velocity*, *Derivatives*). Explicit language overrides ("Answer in English" / "Pure Hindi") are fully honored.
- **Dual Learning Modes**:
  - **Doubt Solver Mode**: Step-by-step breakdowns, intuitive analogies, and encouraging closure.
  - **Homework Helper Mode**: Guides students with leading questions and hints without giving away direct answers.
- **Voice Input Integration**: Hands-free speech-to-text input via the browser Web Speech API.
- **Rich Markdown Formatting**: In-app markdown engine parsing multi-level headings, nested bullet lists (`•`, `◦`), numbered sequences, bold terms, and dividers.
- **Quick Action Prompts**: One-tap query triggers such as *"💡 Example do"*, *"🧠 Aasan bhasha mein samjhao"*, and *"✍️ Practice question do"*.
- **Weak Topic Detection**: AI analyzes chat conversations to identify areas where the student needs reinforcement.

### 2. 🕒 Persistent Chat History
- **Multi-Session Document Storage**: User chat sessions are automatically organized, titled, and persisted in Firestore subcollections (`students/{uid}/chatHistory/{chatId}`).
- **Race-Condition & Sequence Protected**: Background persistence queues (`chatSaveQueueRef`) and generation counters (`chatSessionRef`) ensure zero message loss even if AI replies return faster than document creation.
- **Session Continuity**: Active chat IDs and draft messages persist in browser `sessionStorage`, reconnecting seamlessly across page refreshes.
- **History Drawer**: Dedicated UI to browse previous conversations, check message counts and timestamps, and resume past chats instantly.

### 3. 🧠 Chapter-Wise & Full Subject Quizzes
- **CBSE 2026-27 Aligned**: Covers Classes 6–12 with course variants (e.g., Mathematics *Standard vs. Basic*, Hindi *Core vs. Elective*, Computer Science, Applied Math).
- **Flexible Test Configurations**: Choose between a dedicated chapter test or a comprehensive *Full Subject Test*, with custom question counts (5, 10, 15, 20) and difficulty tiers (*Easy*, *Medium*, *Hard*).
- **Interactive Exam Environment**:
  - Timed test experience with countdown warnings.
  - Instant answer validation with comprehensive bilingual explanations.
  - Live score counter and progress indicators.
- **Post-Quiz Diagnostic Review**: Complete breakdown of each question, review of wrong answers, performance badge scoring, and one-tap *"Discuss in Chat"* to dissect mistakes with the AI tutor.

### 4. 📊 Student Progress & Gamification
- **Daily Study Streak**: Automated streak counter (`streak`) updated upon daily activity.
- **Aggregated Analytics**: Real-time tracking of total questions answered, total quizzes completed, and average scores.
- **Weak Topic Registry**: Dynamic list of struggling topics identified from chat doubts and quiz missteps.

### 5. 👨‍🏫 Coaching Admin Dashboard
- **Admin Verification via Custom Claims**: Enforces cryptographic server-side role validation (`request.auth.token.admin == true`).
- **Student Enrollment & Approval Workflow**:
  - Students signing up are placed in a `pendingApproval` state.
  - Admins can **Approve** or **Reject** prospective students before platform access is granted.
  - Admins can manually create pre-approved student accounts directly.
- **Class-Wise Filtering & Search**: Instant filtering by class (Classes 6–12) and name/email search.
- **Performance Intelligence**: Deep dive into any student's quiz history, score distributions, study streaks, and weak concepts.
- **Class Performance Visualizer**: Distribution bar charts showing average performance and student density across classes.
- **Account Actions**: Edit student details, trigger secure password reset emails, or remove accounts.
- **CSV Data Export**: Export the entire student roster, contact information, streaks, and quiz averages to CSV with one click.
- **Broadcast Announcements**: Send broadcast messages across the coaching batch.
- **Curriculum Browser**: Built-in reference explorer to view textbooks, syllabus codes, and chapter sequences across all supported grades.

---

## 📐 Architecture & Security

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        Tuition Buddy Architecture                      │
└────────────────────────────────────────────────────────────────────────┘

    Client (React 19 + Vite)
       │
       ├── Firebase Client SDK (Auth & Firestore)
       │     ├── Direct Authenticated Reads/Writes
       │     └── Enforced by firestore.rules
       │           ├── Students: read/write own profile & chat subcollection
       │           └── Admins: full read/write access via custom claims
       │
       └── Backend Server Proxy (Express 5 + Firebase Admin SDK)
             │
             ├── POST /api/chat
             │     └── Proxies requests to Groq Cloud (GROQ_API_KEY)
             │         └── Models: openai/gpt-oss-120b -> openai/gpt-oss-20b
             │
             ├── GET /api/admin/verify
             │     └── Verifies Firebase ID Token & admin custom claim
             │
             └── /api/admin/students/*
                   └── Admin-only user creation, approvals, rejections, & deletes
```

### Security Highlights
- **No Client API Keys**: Upstream LLM tokens (`GROQ_API_KEY`) and Firebase Service Account credentials remain strictly on the backend server.
- **Defense-in-Depth Authorization**:
  - The Admin Dashboard cannot be unlocked simply by manipulating client state; all admin endpoints invoke `requireAdmin` middleware verifying `decodedToken.admin === true`.
  - Firestore security rules mirror this check: `request.auth.token.admin == true`.
- **Student Profile Protection**: Students cannot self-approve their accounts (`approved: false` enforced on create) and cannot alter protected identity fields (`approved`, `class`, `email`, `uid`).

---

## 🛠️ Technology Stack

| Layer | Technologies & Libraries |
|:---|:---|
| **Frontend** | React 19, Vite 8, Pure Component-level CSS-in-JS (Zero bloated utility frameworks) |
| **Backend / API** | Node.js (ESM), Express 5, CORS, Dotenv |
| **Authentication** | Firebase Authentication (Email/Password, ID Tokens, Custom Admin Claims) |
| **Database** | Cloud Firestore (Real-time NoSQL, Security Rules v2, Server Timestamps) |
| **Admin Operations** | Firebase Admin SDK 14 (User lifecycle, Claim management, Document orchestration) |
| **LLM Inference** | Groq Cloud API (`openai/gpt-oss-120b`, fallback `openai/gpt-oss-20b`) |
| **Tooling & Linting** | ESLint 10, React Hooks Lint Plugin |

---

## 📚 CBSE 2026-27 Curriculum Registry

The project embeds a comprehensive, typed curriculum registry (`src/curriculum.js`) referencing updated NCERT textbooks:

| Grade Level | Subjects Covered | Prescribed Textbooks & Codes |
|:---|:---|:---|
| **Classes 6–8** | Mathematics, Science, Social Science, English, Hindi, Sanskrit | *Ganita Prakash*, *Curiosity*, *Exploring Society*, *Poorvi*, *Malhar*, *Deepakam* |
| **Classes 9–10** | Mathematics (Standard 041 / Basic 241), Science (086), Social Science (087), English (184), Hindi (Course A 002 / Course B 085), Sanskrit (122), AI (417) | *NCERT Mathematics*, *NCERT Science*, *First Flight*, *Footprints*, *Kshitij*, *Sparsh*, *Shemushi* |
| **Classes 11–12** | Physics (042), Chemistry (043), Biology (044), Mathematics (041), Accountancy (055), Business Studies (054), Economics (030), History (027), Political Science (028), Computer Science (083), AI (843) | Standard NCERT Higher Secondary publications & CBSE Subject Codes |

---

## 📁 Project Directory Structure

```text
tuition-buddy/
├── .env.example              # Environment variables template
├── firestore.rules           # Production Firestore security rules
├── package.json              # Dependencies and run scripts
├── server.js                 # Express 5 backend server (API proxy + admin routes)
├── vite.config.js            # Vite bundler configuration
│
├── api/                      # Serverless functions / deployment adaptors
│
├── public/                   # Static assets, branding, and icons
│
├── scripts/
│   └── set-admin-claim.js    # CLI utility to grant Firebase Admin custom claims
│
└── src/
    ├── main.jsx              # React DOM entry point
    ├── NewApp.jsx            # Master state controller & auth state router
    ├── AuthScreen.jsx        # Login, student registration & pending approval UI
    ├── StudentApp.jsx        # Primary student experience (Chat, Quiz, History, Progress)
    ├── AdminDashboard.jsx    # Coaching institute administration & analytics suite
    ├── curriculum.js         # Complete CBSE 2026-27 curriculum syllabus registry
    ├── firebase.js           # Client Firebase initialization & domain query helpers
    ├── constants.js          # Design system color palettes and typography constants
    ├── ui.jsx                # Reusable UI primitives (Card, Badge, Button, ScoreBar)
    └── useIsMobile.js        # Viewport detection hook for mobile responsiveness
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **bun**
- A **Firebase Project** with Authentication (Email/Password) and Cloud Firestore enabled
- A **Groq API Key** (or compatible OpenAI-compatible LLM endpoint)

### 1. Clone & Install
```bash
git clone https://github.com/mohitshaw2406-pro/Tuition-buddy-app.git
cd Tuition-buddy-app
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Populate the values:
```env
# ── Frontend Firebase Client Keys (Public) ──────────────────────
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef...

# ── Backend Server Secrets (Never expose to client) ─────────────
PORT=3000
GROQ_API_KEY=gsk_...
FIREBASE_PROJECT_ID=your-project-id

# Optional: Raw JSON or base64-encoded Firebase Service Account string
# (If omitted on Google Cloud / Cloud Run, Application Default Credentials will be used)
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
```

### 3. Deploy Firestore Security Rules
Deploy `firestore.rules` using the Firebase CLI:
```bash
firebase deploy --only firestore:rules
```

### 4. Create an Admin Account
1. Register a new user in the app UI or Firebase Console.
2. Grant the user admin privileges using the built-in CLI utility:
```bash
node scripts/set-admin-claim.js user@yourdomain.com
```

### 5. Launch Development Server
```bash
npm run dev
```
The application will be live at `http://localhost:3000`.

---

## 📦 Build & Production

To compile the production frontend:
```bash
npm run build
```

To run lint checks:
```bash
npm run lint
```

To run the complete production server:
```bash
npm start
```

---

## 🗺️ Roadmap & Future Scope

### Implemented & Verified
- [x] Full-stack architecture with Express proxy and React 19 frontend
- [x] Dual-mode bilingual AI tutor (Doubt Solving & Homework Guidance)
- [x] Persistent chat history with multi-session recall & race-condition protection
- [x] CBSE 2026-27 chapter-specific and full-subject quiz generator
- [x] Socratic markdown parsing with nested bullets and mathematical formatting
- [x] Admin approval gatekeeper for student self-registrations
- [x] Coaching institute management panel with CSV exports and batch analytics
- [x] Cryptographic Admin custom claim validation

### Planned Features
- [ ] **Document & Assignment Scanning**: OCR parsing of handwritten notebook photos and school question papers.
- [ ] **Batch Performance Leaderboards**: Opt-in gamified quiz challenges among coaching peers.
- [ ] **Parent Progress Digest**: Automated WhatsApp or SMS weekly attendance and quiz summary reports.
- [ ] **Offline Practice Mode**: PWA caching of downloaded question banks for offline revision.
- [ ] **Regional Language Expansions**: Additional native explanation modes for Bengali, Marathi, Tamil, and Telugu.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">
  <sub>Built with ❤️ for Indian coaching institutes, educators, and students.</sub>
</div>
