import { useState, useEffect } from "react";
import {
  auth, db, ADMIN_EMAIL,
  onAuthStateChanged, signOut, doc, getDoc
} from "./firebase.js";
import AuthScreen from "./AuthScreen.jsx";
import StudentApp from "./StudentApp.jsx";
import AdminDashboard from "./AdminDashboard.jsx";

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        if (fbUser) {
          try {
            const snap = await getDoc(doc(db, "students", fbUser.uid));
            if (snap.exists()) setUser({ uid: fbUser.uid, ...snap.data(), isAdmin: false });
            else if (fbUser.email === ADMIN_EMAIL) setUser({ uid: fbUser.uid, isAdmin: true, name: "Admin" });
            else setUser(null);
          } catch { setUser(null); }
        } else { setUser(null); }
        setAuthLoading(false);
      });
      return unsubscribe;
    } catch {
      setAuthLoading(false);
    }
  }, []);

  const handleLogout = async () => {
    try { await signOut(auth); } catch {}
    setUser(null);
  };

  if (authLoading) return (
    <div style={{
      height: "100vh", background: "#0b0c1a", display: "flex",
      alignItems: "center", justifyContent: "center",
      fontFamily: "'Segoe UI',system-ui,sans-serif", color: "#6366f1", fontSize: 18
    }}>
      🎓 Loading Tuition Buddy...
    </div>
  );

  if (!user) return <AuthScreen onLogin={setUser} />;
  if (user.isAdmin) return <AdminDashboard onLogout={handleLogout} />;
  return <StudentApp user={user} onLogout={handleLogout} />;
}