import { initializeApp } from "firebase/app";
import {
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut, onAuthStateChanged, sendPasswordResetEmail, getIdTokenResult
} from "firebase/auth";
import {
  getFirestore, doc, setDoc, getDoc, updateDoc,
  collection, getDocs, arrayUnion, serverTimestamp
} from "firebase/firestore";

export const FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "tuition-buddy.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "tuition-buddy",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "tuition-buddy.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1234567890:web:abcdef123456"
};

export const app = initializeApp(FIREBASE_CONFIG);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const CLASSES = ["6","7","8","9","10","11","12"];
export const SUBJECTS = ["Mathematics","Science","Physics","Chemistry","Biology","English","Hindi","History","Geography","Computer Science","Economics","Political Science"];
export const CLAUDE_MODEL = "claude-sonnet-4-20250514";

export const SYSTEM_PROMPT = (cls) =>
  `You are "Tuition Buddy" — a friendly, encouraging AI tutor for Indian students in Class ${cls}.
You support Hinglish and English. If the student writes in Hinglish, respond in Hinglish. If English, respond in English.
Tailor your explanations for a Class ${cls} student's knowledge level.
For doubts: explain clearly with examples and step-by-step breakdowns suitable for Class ${cls}.
For homework: guide without giving direct answers — use Socratic questions.
For quizzes: generate exactly 5 MCQ questions formatted as:
Q1. [question]
A) [opt]  B) [opt]  C) [opt]  D) [opt]
Answer: [letter]
Explanation: [brief]
Always end with an encouraging phrase in Hinglish like "Tu kar sakta hai! 🌟" or "Bahut badhiya! 💪"`;


export const callClaude = async (messages, system) => {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: messages.map(m => ({ role: m.role, content: m.content })),
        system: system,
        max_tokens: 1500
      }),
    });

    if (!res.ok) {
      console.warn("AI chat endpoint returned non-OK status:", res.status);
      return "Kuch problem ho gayi. Try again!";
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || "Kuch problem ho gayi. Try again!";
  } catch (err) {
    console.error("AI chat request failed:", err);
    return "Kuch problem ho gayi. Try again!";
  }
};


export const detectWeakTopicsFromChat = async (msgs) => {
  if (msgs.length < 10) return []; // kam messages pe call mat karo
  const history = msgs.slice(-6).map(m => `${m.role}: ${m.content}`).join("\n");
  try {
    await new Promise(r => setTimeout(r, 2000)); // 2 sec delay
    const res = await callClaude(
      [{ role: "user", content: history }],
      `Identify up to 2 topics the student struggled with. Return ONLY a JSON array like ["Topic1","Topic2"]. If none, return []. No other text.`
    );
    const parsed = JSON.parse(res.trim());
    return Array.isArray(parsed) ? parsed.slice(0, 2) : [];
  } catch { return []; }
};

// ─── ADMIN API HELPERS ────────────────────────────────────────────────────────
const getAdminAuthHeaders = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("Admin session not found. Please log in.");
  }
  const token = await user.getIdToken();
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
};

// ─── STUDENT CRUD ─────────────────────────────────────────────────────────────
export const fetchAllStudents = async () => {
  const snap = await getDocs(collection(db, "students"));
  return snap.docs.map(d => ({ uid: d.id, ...d.data() }));
};

export const addStudent = async (name, email, password, cls) => {
  const headers = await getAdminAuthHeaders();
  const res = await fetch("/api/admin/students", {
    method: "POST",
    headers,
    body: JSON.stringify({
      name,
      email,
      password,
      class: cls,
      approved: true
    })
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to add student");
  }
  return data.student;
};

export const approveStudent = async (uid) => {
  const headers = await getAdminAuthHeaders();
  const res = await fetch(`/api/admin/students/${uid}/approve`, {
    method: "PATCH",
    headers
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to approve student");
  }
  return data;
};

export const rejectStudent = async (uid) => {
  const headers = await getAdminAuthHeaders();
  const res = await fetch(`/api/admin/students/${uid}/reject`, {
    method: "DELETE",
    headers
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to reject student");
  }
  return data;
};

export const removeStudent = async (uid) => {
  const headers = await getAdminAuthHeaders();
  const res = await fetch(`/api/admin/students/${uid}`, {
    method: "DELETE",
    headers
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to remove student");
  }
  return data;
};

export const editStudent = async (uid, name, cls) => {
  await updateDoc(doc(db, "students", uid), { name, class: cls });
};

export const resetStudentPassword = async (email) => {
  await sendPasswordResetEmail(auth, email);
};

export const broadcastMessage = async (message) => {
  const snap = await getDocs(collection(db, "students"));
  const promises = snap.docs.map(d =>
    updateDoc(doc(db, "students", d.id), {
      broadcastMessage: message,
      broadcastAt: serverTimestamp()
    })
  );
  await Promise.all(promises);
};

// ─── STUDENT HELPERS ──────────────────────────────────────────────────────────
export const saveQuizResult = async (uid, subject, score, total) => {
  const ref = doc(db, "students", uid);
  await updateDoc(ref, {
    quizHistory: arrayUnion({
      subject, score, total,
      date: new Date().toISOString(),
      pct: Math.round((score / total) * 100)
    }),
    lastActive: serverTimestamp(),
  });
};

export const saveDoubts = async (uid, count) => {
  const ref = doc(db, "students", uid);
  const snap = await getDoc(ref);
  const prev = snap.data()?.totalQuestions || 0;
  await updateDoc(ref, { totalQuestions: prev + count, lastActive: serverTimestamp() });
};

export const saveWeakTopics = async (uid, topics) => {
  if (!topics.length) return;
  const ref = doc(db, "students", uid);
  const snap = await getDoc(ref);
  const prev = snap.data()?.weakTopics || [];
  const merged = [...new Set([...prev, ...topics])].slice(0, 5);
  await updateDoc(ref, { weakTopics: merged });
};

export const updateStreak = async (uid) => {
  const ref = doc(db, "students", uid);
  const snap = await getDoc(ref);
  const data = snap.data() || {};
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  let streak = 1;
  if (data.lastStreakDate === today) streak = data.streak || 1;
  else if (data.lastStreakDate === yesterday) streak = (data.streak || 0) + 1;
  await updateDoc(ref, { streak, lastStreakDate: today });
  return streak;
};

export const verifyAdminSession = async (user) => {
  if (!user || user.uid === "demo-admin" || user.uid === "demo-student") {
    return false;
  }
  try {
    const tokenResult = await getIdTokenResult(user, true);
    if (!tokenResult?.claims?.admin) {
      return false;
    }
    const res = await fetch("/api/admin/verify", {
      headers: {
        Authorization: `Bearer ${tokenResult.token}`,
      },
    });
    if (!res.ok) return false;
    const data = await res.json();
    return data?.authorized === true && data?.admin === true;
  } catch (err) {
    console.warn("verifyAdminSession error:", err);
    return false;
  }
};

export { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail, getIdTokenResult, doc, setDoc, getDoc, updateDoc, serverTimestamp };