import { useState, useEffect } from "react";
import {
  auth, db, ADMIN_EMAIL,
  onAuthStateChanged, signOut, doc, getDoc
} from "./firebase.js";
import AuthScreen from "./AuthScreen.jsx";
import StudentApp from "./StudentApp.jsx";
import AdminDashboard from "./AdminDashboard.jsx";
import { C } from "./ui.jsx";

// ─── PENDING APPROVAL SCREEN ──────────────────────────────────────────────────
function PendingScreen({ user, onLogout }) {
  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI',system-ui,sans-serif", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 400, textAlign: "center" }}>
        <div style={{ fontSize: 60, marginBottom: 16 }}>⏳</div>
        <h2 style={{ color: C.text, fontWeight: 800, fontSize: 22, margin: "0 0 10px" }}>
          Approval Pending!
        </h2>
        <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, margin: "0 0 8px" }}>
          Namaste <strong style={{ color: C.text }}>{user.name}</strong>! 👋
        </p>
        <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, margin: "0 0 24px" }}>
          Tera account abhi coach ke approval ka wait kar raha hai.<br />
          Approve hone ke baad login kar paoge. <strong style={{ color: C.gold }}>Thoda wait karo! 🙏</strong>
        </p>
        <div style={{ background: `${C.gold}11`, border: `1px solid ${C.gold}33`, borderRadius: 12, padding: "14px 18px", marginBottom: 24 }}>
          <div style={{ fontSize: 12, color: C.gold, fontWeight: 600 }}>📧 Registered Email</div>
          <div style={{ fontSize: 14, color: C.text, marginTop: 4 }}>{user.email}</div>
        </div>
        <button onClick={onLogout} style={{ background: "transparent", border: `1px solid ${C.border}`, borderRadius: 10, color: C.muted, padding: "10px 24px", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
}

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
            if (snap.exists()) {
              const data = snap.data();
              // Pass pendingApproval flag if not approved
              setUser({
                uid: fbUser.uid,
                ...data,
                isAdmin: false,
                pendingApproval: data.approved === false,
              });
            } else if (fbUser.email === ADMIN_EMAIL) {
              setUser({ uid: fbUser.uid, isAdmin: true, name: "Admin" });
            } else {
              setUser(null);
            }
          } catch { setUser(null); }
        } else { setUser(null); }
        setAuthLoading(false);
      });
      return unsubscribe;
    } catch { setAuthLoading(false); }
  }, []);

  const handleLogout = async () => {
    try { await signOut(auth); } catch {}
    setUser(null);
  };

  if (authLoading) return (
    <div style={{ height: "100vh", background: "#0b0c1a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI',system-ui,sans-serif", color: "#6366f1", fontSize: 18 }}>
      🎓 Loading Tuition Buddy...
    </div>
  );

  if (!user) return <AuthScreen onLogin={setUser} />;
  if (user.isAdmin) return <AdminDashboard onLogout={handleLogout} />;
  // ── Show pending screen if not approved ───────────────────────────────────
  if (user.pendingApproval) return <PendingScreen user={user} onLogout={handleLogout} />;
  return <StudentApp user={user} onLogout={handleLogout} />;
}