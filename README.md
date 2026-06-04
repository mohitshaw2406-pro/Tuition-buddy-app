# 🎓 Tuition Buddy

> **AI-powered personal tutor for Indian students — Class 6 to 12**  
> Hinglish mein samjhao, CBSE/NCERT syllabus follow karo, aur smart practice karo!

---

## ✨ Features

### 💬 AI Chat Tutor
- **Doubt solving** — Koi bhi subject ka doubt poochho, step-by-step explanation milegi
- **Homework Help** — Socratic method se guide karta hai, direct answers nahi deta
- **Hinglish Support** — Hinglish mein poochho, Hinglish mein jawab milega
- **Voice Input** — 🎤 Bol ke question poochho (Chrome supported)
- **Class-aware** — Class 6 se 12 tak — level ke hisaab se explain karta hai

### 🧠 Chapter-wise Quiz
- **AI-generated questions** — Har baar naye, fresh MCQ questions
- **NCERT 2024-25 syllabus** — Current updated syllabus ke chapters automatically fetch hote hain
- **Subject + Chapter select karo** — Full subject test ya specific chapter practice
- **Difficulty levels** — Easy 😊 / Medium 🤔 / Hard 🔥
- **Instant explanation** — Har answer ke baad explanation milti hai
- **Live score tracking** — Quiz ke dauran score dikhta rahta hai

### 📊 Progress Tracking
- **Study Streak** 🔥 — Roz padhne ka record
- **Quiz History** — Saare previous quiz results
- **Weak Topics** — AI automatically identify karta hai kahan aur mehnat chahiye
- **Average Score** — Overall performance ka overview

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React (Vite) |
| AI | Claude API (claude-sonnet-4-20250514) |
| Auth & DB | Firebase (Auth + Firestore) |
| Deployment | Vercel |
| Styling | Pure CSS-in-JS (no external UI library) |

---

## 🚀 Local Setup

### Prerequisites
- Node.js 18+
- Firebase project
- Anthropic API key

### Steps

```bash
# 1. Clone karo
git clone https://github.com/mohitshaw2406-pro/Tuition-buddy-app.git
cd Tuition-buddy-app

# 2. Dependencies install karo
npm install

# 3. Environment variables setup karo
cp .env.example .env
# .env file mein apni keys daalo

# 4. Dev server start karo
npm run dev
```

### Environment Variables

`.env` file mein yeh variables chahiye:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GROQ_API_KEY=your_groq_or_claude_api_key
```

---

## 📁 Project Structure

```
tuition-buddy/
├── src/
│   ├── NewApp.jsx          # Root component — auth routing
│   ├── StudentApp.jsx      # Main student dashboard (chat + quiz + progress)
│   ├── AdminDashboard.jsx  # Admin panel — student management
│   ├── AuthScreen.jsx      # Login / Signup screen
│   ├── firebase.js         # Firebase config + API helpers
│   ├── ui.jsx              # Reusable UI components (Card, Btn, etc.)
│   └── useIsMobile.js      # Mobile detection hook
├── public/
├── index.html
├── vite.config.js
└── package.json
```

---

## 🎯 How It Works

### Quiz Flow
```
Subject Select
      ↓
AI fetches current NCERT 2024-25 chapters
      ↓
Chapter Select (ya Full Subject Test)
      ↓
Settings (questions count + difficulty)
      ↓
AI generates fresh MCQ questions
      ↓
One-by-one quiz with live score
      ↓
Result + weak topic tracking
```

### Supported Classes & Subjects

| Class | Subjects |
|-------|---------|
| 6, 7, 8 | Mathematics, Science, Social Science, English, Hindi, Sanskrit |
| 9, 10 | Mathematics, Science, Social Science, English, Hindi, Sanskrit |
| 11, 12 | Mathematics, Physics, Chemistry, Biology, Accountancy, Business Studies, Economics, English, Hindi |

---

## 👨‍💻 Admin Panel

Admin login se yeh sab manage kar sakte ho:
- Saare registered students ki list
- Har student ka progress — streak, quiz scores, weak topics
- Student accounts delete karna

Admin email `firebase.js` mein set hota hai (`ADMIN_EMAIL` constant).

---

## 🌐 Deployment (Vercel)

```bash
# Build karo
npm run build

# Ya directly GitHub se Vercel connect karo
# Har git push pe auto-deploy ho jayega
```

Vercel pe environment variables zaroor add karna — **Settings → Environment Variables**.

---

## 📱 Mobile Support

Tuition Buddy fully responsive hai:
- Mobile pe sliding sidebar
- Touch-friendly quiz buttons
- Voice input support (Chrome)
- Optimized font sizes aur spacing

---

## 🔮 Coming Soon

- [ ] PDF notes upload + AI summary
- [ ] Leaderboard between students
- [ ] Parent dashboard
- [ ] Offline mode
- [ ] Regional language support (Bengali, Tamil, Telugu)

---

## 🤝 Contributing

Pull requests welcome hain! Koi feature suggest karna ho ya bug mila ho toh issue open karo.

---

## 📄 License

MIT License — freely use karo, modify karo, share karo.

---

<div align="center">
  <strong>Made with ❤️ for Indian students</strong><br/>
  <sub>Padhai ko interesting banao — Tuition Buddy ke saath! 🚀</sub>
</div>
