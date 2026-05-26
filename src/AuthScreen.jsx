import { useState } from "react";
import {
  auth, db, FIREBASE_CONFIG, ADMIN_EMAIL, CLASSES,
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  doc, setDoc, getDoc, serverTimestamp
} from "./firebase.js";
import { C, Btn, Input, Card } from "./ui.jsx";

// ─── SCREEN: AUTH ─────────────────────────────────────────────────────────────
export default function AuthScreen({ onLogin }) {
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState(""); const [pw, setPw] = useState("");
  const [name, setName] = useState(""); const [cls, setCls] = useState("9");
  const [err, setErr] = useState(""); const [loading, setLoading] = useState(false);

  const isDemo = FIREBASE_CONFIG.apiKey === "YOUR_API_KEY";

  const handleLogin = async () => {
    setErr(""); setLoading(true);
    if (isDemo) {
      setErr("⚙️ Please replace FIREBASE_CONFIG with your real Firebase project credentials at the top of the file.");
      setLoading(false); return;
    }
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pw);
      const snap = await getDoc(doc(db, "students", cred.user.uid));
      if (snap.exists()) onLogin({ uid: cred.user.uid, ...snap.data(), isAdmin: false });
      else if (email === ADMIN_EMAIL) onLogin({ uid: cred.user.uid, isAdmin: true, name: "Admin" });
    } catch (e) {
      setErr(e.message.includes("invalid-credential") ? "Wrong email or password." : e.message);
    }
    setLoading(false);
  };

  const handleSignup = async () => {
    setErr(""); if (!name.trim()) { setErr("Please enter your name."); return; }
    setLoading(true);
    if (isDemo) {
      setErr("⚙️ Please replace FIREBASE_CONFIG with your real Firebase project credentials at the top of the file.");
      setLoading(false); return;
    }
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pw);
      const studentData = {
        name, class: cls, email, streak: 1, lastStreakDate: new Date().toDateString(),
        weakTopics: [], quizHistory: [], totalQuestions: 0, totalQuizzes: 0,
        createdAt: serverTimestamp(), lastActive: serverTimestamp()
      };
      await setDoc(doc(db, "students", cred.user.uid), studentData);
      onLogin({ uid: cred.user.uid, ...studentData, isAdmin: false });
    } catch (e) {
      setErr(e.message.includes("email-already-in-use") ? "Email already registered. Please login." : e.message);
    }
    setLoading(false);
  };

  const demoAdminLogin = () => onLogin({ uid: "demo-admin", isAdmin: true, name: "Demo Admin" });
  const demoStudentLogin = () => onLogin({
    uid: "demo-student", isAdmin: false, name: "Rahul Sharma", class: "10",
    streak: 5, weakTopics: ["Quadratic Equations", "Photosynthesis"],
    quizHistory: [
      { subject: "Maths", score: 3, total: 5, pct: 60, date: new Date().toISOString() },
      { subject: "Science", score: 4, total: 5, pct: 80, date: new Date(Date.now() - 86400000).toISOString() },
      { subject: "English", score: 5, total: 5, pct: 100, date: new Date(Date.now() - 172800000).toISOString() },
    ],
    totalQuestions: 24, totalQuizzes: 3
  });

  return (
    <div style={{
      minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center",
      justifyContent: "center", fontFamily: "'Segoe UI',system-ui,sans-serif", padding: 20
    }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🎓</div>
          <h1 style={{
            margin: 0, fontSize: 28, fontWeight: 800,
            background: `linear-gradient(135deg,${C.accent},${C.purple})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
          }}>Tuition Buddy</h1>
          <p style={{ color: C.muted, fontSize: 13, margin: "6px 0 0" }}>AI-powered coaching for Classes 6–12</p>
        </div>

        {isDemo && (
          <Card style={{ marginBottom: 16, borderColor: "#f59e0b44" }}>
            <p style={{ color: C.gold, fontSize: 13, margin: 0, fontWeight: 600 }}>⚙️ Demo Mode — Firebase not configured</p>
            <p style={{ color: C.muted, fontSize: 12, margin: "6px 0 10px" }}>
              Replace <code style={{ color: C.accent }}>FIREBASE_CONFIG</code> at the top of <code style={{ color: C.accent }}>firebase.js</code> with your Firebase credentials to enable real login & data persistence.
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn onClick={demoStudentLogin} small style={{ flex: 1 }}>👨‍🎓 Demo as Student</Btn>
              <Btn onClick={demoAdminLogin} small variant="secondary" style={{ flex: 1 }}>🛡️ Demo as Admin</Btn>
            </div>
          </Card>
        )}

        <Card>
          {/* Tabs */}
          <div style={{ display: "flex", marginBottom: 20, background: C.bg, borderRadius: 8, padding: 3 }}>
            {["login", "signup", "admin"].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                flex: 1, padding: "7px 0", border: "none", borderRadius: 6, cursor: "pointer",
                fontWeight: 600, fontSize: 13,
                background: tab === t ? `linear-gradient(135deg,${C.accent},${C.accentSoft})` : "transparent",
                color: tab === t ? "#fff" : C.muted, fontFamily: "inherit"
              }}>{t === "login" ? "🔑 Login" : t === "signup" ? "✏️ Sign Up" : "🛡️ Admin"}</button>
            ))}
          </div>

          {tab === "signup" && <Input label="Full Name" value={name} onChange={setName} placeholder="Rahul Sharma" />}
          <Input label="Email" type="email" value={email} onChange={setEmail} placeholder="student@email.com" />
          <Input label="Password" type="password" value={pw} onChange={setPw} placeholder="••••••••" />

          {tab === "signup" && (
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Your Class</label>
              <select value={cls} onChange={e => setCls(e.target.value)} style={{
                width: "100%", background: C.dim, border: `1px solid ${C.border}`, borderRadius: 8,
                color: C.text, padding: "10px 12px", fontSize: 14, fontFamily: "inherit"
              }}>
                {CLASSES.map(c => <option key={c} value={c}>Class {c}</option>)}
              </select>
            </div>
          )}

          {tab === "admin" && (
            <p style={{ fontSize: 12, color: C.muted, margin: "-4px 0 12px" }}>
              Use the admin email & password set in <code style={{ color: C.accent }}>firebase.js</code>.
            </p>
          )}

          {err && (
            <div style={{
              background: "#7c1f1f44", border: "1px solid #ef444444", borderRadius: 8,
              padding: "8px 12px", color: "#fca5a5", fontSize: 13, marginBottom: 12
            }}>{err}</div>
          )}

          <Btn onClick={tab === "signup" ? handleSignup : handleLogin} disabled={loading} style={{ width: "100%" }}>
            {loading ? "Please wait..." : tab === "signup" ? "Create Account →" : "Login →"}
          </Btn>
        </Card>
      </div>
    </div>
  );
}