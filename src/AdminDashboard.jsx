import { useState, useEffect } from "react";
import { CLASSES, fetchAllStudents, addStudent, removeStudent, editStudent, resetStudentPassword, broadcastMessage } from "./firebase.js";
import { C, Card, Badge, ScoreBar } from "./ui.jsx";
import useIsMobile from "./useIsMobile.js";

const Btn = ({ children, onClick, disabled, variant = "primary", style = {}, small = false }) => (
  <button onClick={onClick} disabled={disabled} style={{
    padding: small ? "6px 14px" : "10px 22px",
    background: variant === "primary" ? `linear-gradient(135deg,${C.accent},#4f46e5)` : variant === "danger" ? C.red : variant === "success" ? C.green : variant === "ghost" ? "transparent" : C.card,
    border: `1px solid ${variant === "ghost" ? C.border : "transparent"}`,
    borderRadius: 10, color: "#fff", fontWeight: 600, fontSize: small ? 12 : 14,
    cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1, fontFamily: "inherit", transition: "all 0.15s", ...style
  }}>{children}</button>
);

const Modal = ({ title, onClose, children }) => (
  <div style={{ position: "fixed", inset: 0, background: "#000b", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24, width: "100%", maxWidth: 420 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: C.text }}>{title}</h3>
        <button onClick={onClose} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 20 }}>✕</button>
      </div>
      {children}
    </div>
  </div>
);

const Input = ({ label, type = "text", value, onChange, placeholder }) => (
  <div style={{ marginBottom: 14 }}>
    {label && <label style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>{label}</label>}
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ width: "100%", background: C.dim, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, padding: "10px 12px", fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
  </div>
);

const BarChart = ({ data }) => {
  const max = Math.max(...data.map(d => d.val), 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 90, padding: "0 4px" }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
          <span style={{ fontSize: 10, color: C.muted }}>{d.val}</span>
          <div style={{ width: "100%", height: Math.max((d.val / max) * 72, 4), background: d.color || C.accent, borderRadius: "4px 4px 0 0" }} />
          <span style={{ fontSize: 10, color: C.muted, whiteSpace: "nowrap" }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
};

const sc = (pct) => pct >= 70 ? C.green : pct >= 50 ? C.gold : C.red;

const exportCSV = (students) => {
  const rows = [
    ["Name", "Class", "Email", "Streak", "Quizzes", "Questions", "Avg Score", "Weak Topics"],
    ...students.map(s => {
      const avg = s.quizHistory?.length ? Math.round(s.quizHistory.reduce((a, q) => a + q.pct, 0) / s.quizHistory.length) : 0;
      return [s.name, s.class, s.email || "", s.streak || 0, s.totalQuizzes || 0, s.totalQuestions || 0, avg + "%", (s.weakTopics || []).join("; ")];
    })
  ];
  const csv = rows.map(r => r.map(c => `"${c}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = "students.csv"; a.click();
  URL.revokeObjectURL(url);
};

export default function AdminDashboard({ onLogout }) {
  const isMobile = useIsMobile();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [classFilter, setClassFilter] = useState("All");
  const [view, setView] = useState("overview");
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(null);
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(null);

  const [addName, setAddName] = useState(""); const [addEmail, setAddEmail] = useState("");
  const [addPassword, setAddPassword] = useState(""); const [addClass, setAddClass] = useState("9");
  const [addLoading, setAddLoading] = useState(false); const [addError, setAddError] = useState("");
  const [editName, setEditName] = useState(""); const [editClass, setEditClass] = useState("");
  const [broadcastMsg, setBroadcastMsg] = useState(""); const [broadcastLoading, setBroadcastLoading] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  useEffect(() => { loadStudents(); }, []);

  const loadStudents = async () => {
    setLoading(true);
    try { const data = await fetchAllStudents(); setStudents(data); }
    catch (e) { showToast("❌ " + e.message); }
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!addName.trim() || !addEmail.trim() || !addPassword.trim()) { setAddError("Sab fields fill karo."); return; }
    if (addPassword.length < 6) { setAddError("Password min 6 characters."); return; }
    setAddLoading(true); setAddError("");
    try {
      const s = await addStudent(addName, addEmail, addPassword, addClass);
      setStudents(p => [...p, s]);
      setShowAdd(false); setAddName(""); setAddEmail(""); setAddPassword(""); setAddClass("9");
      showToast("✅ Student add ho gaya!");
    } catch (e) { setAddError(e.message.includes("email-already-in-use") ? "Email already registered." : e.message); }
    setAddLoading(false);
  };

  const handleEdit = async () => {
    if (!editName.trim()) return;
    try {
      await editStudent(showEdit.uid, editName, editClass);
      setStudents(p => p.map(s => s.uid === showEdit.uid ? { ...s, name: editName, class: editClass } : s));
      if (selected?.uid === showEdit.uid) setSelected(s => ({ ...s, name: editName, class: editClass }));
      setShowEdit(null); showToast("✅ Updated!");
    } catch (e) { showToast("❌ " + e.message); }
  };

  const handleDelete = async (uid) => {
    try {
      await removeStudent(uid);
      setStudents(p => p.filter(s => s.uid !== uid));
      if (selected?.uid === uid) { setSelected(null); setView("students"); }
      setShowConfirmDelete(null); showToast("🗑️ Removed!");
    } catch (e) { showToast("❌ " + e.message); }
  };

  const handleReset = async (email) => {
    try { await resetStudentPassword(email); showToast("📧 Reset email sent!"); }
    catch (e) { showToast("❌ " + e.message); }
  };

  const handleBroadcast = async () => {
    if (!broadcastMsg.trim()) return;
    setBroadcastLoading(true);
    try { await broadcastMessage(broadcastMsg); setShowBroadcast(false); setBroadcastMsg(""); showToast("📢 Sent to all!"); }
    catch (e) { showToast("❌ " + e.message); }
    setBroadcastLoading(false);
  };

  const filtered = students.filter(s =>
    (classFilter === "All" || s.class === classFilter) &&
    (s.name?.toLowerCase().includes(search.toLowerCase()) || s.class?.includes(search))
  );

  const classSummary = CLASSES.map(c => {
    const ss = students.filter(s => s.class === c);
    const allQ = ss.flatMap(s => s.quizHistory || []);
    const avg = allQ.length ? Math.round(allQ.reduce((a, q) => a + q.pct, 0) / allQ.length) : 0;
    return { class: c, count: ss.length, avg, quizzes: allQ.length, active: ss.filter(s => (s.streak || 0) > 0).length };
  }).filter(c => c.count > 0);

  const totalStudents = students.length;
  const totalQuizzes = students.reduce((a, s) => a + (s.totalQuizzes || 0), 0);
  const totalQuestions = students.reduce((a, s) => a + (s.totalQuestions || 0), 0);
  const inactive = students.filter(s => (s.streak || 0) < 2);
  const allQ = students.flatMap(s => s.quizHistory || []);
  const globalAvg = allQ.length ? Math.round(allQ.reduce((a, q) => a + q.pct, 0) / allQ.length) : 0;

  const openStudent = (s) => { setSelected(s); setView("student"); if (isMobile) setSidebarOpen(false); };

  const navItems = [
    { id: "overview", icon: "📊", label: "Overview" },
    { id: "students", icon: "👨‍🎓", label: "Students" },
    { id: "leaderboard", icon: "🏆", label: "Leaderboard" },
  ];

  const SidebarContent = () => (
    <>
      <div style={{ padding: "18px 16px 12px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, background: `linear-gradient(135deg,${C.accent},${C.purple})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>🛡️ Admin Panel</div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>Tuition Buddy</div>
          </div>
          {isMobile && <button onClick={() => setSidebarOpen(false)} style={{ background: "none", border: "none", color: C.muted, fontSize: 22, cursor: "pointer" }}>✕</button>}
        </div>
      </div>
      <div style={{ padding: "12px 10px", flex: 1, overflowY: "auto" }}>
        {navItems.map(n => (
          <button key={n.id} onClick={() => { setView(n.id); setSelected(null); setSidebarOpen(false); }} style={{
            display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", marginBottom: 4,
            background: (view === n.id || (view === "student" && n.id === "students")) ? `${C.accent}22` : "transparent",
            border: (view === n.id || (view === "student" && n.id === "students")) ? `1px solid ${C.accent}44` : "1px solid transparent",
            borderRadius: 10, color: (view === n.id || (view === "student" && n.id === "students")) ? C.accent : C.muted,
            cursor: "pointer", fontSize: 14, fontWeight: 700, fontFamily: "inherit"
          }}><span>{n.icon}</span>{n.label}</button>
        ))}
        <div style={{ marginTop: 14, borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
          <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, paddingLeft: 4 }}>Quick Actions</div>
          <button onClick={() => { setShowAdd(true); setSidebarOpen(false); }} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 12px", marginBottom: 6, background: `${C.green}22`, border: `1px solid ${C.green}33`, borderRadius: 8, color: C.green, cursor: "pointer", fontSize: 13, fontFamily: "inherit", fontWeight: 600 }}>➕ Add Student</button>
          <button onClick={() => { setShowBroadcast(true); setSidebarOpen(false); }} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 12px", marginBottom: 6, background: `${C.accent}22`, border: `1px solid ${C.accent}33`, borderRadius: 8, color: C.accent, cursor: "pointer", fontSize: 13, fontFamily: "inherit", fontWeight: 600 }}>📢 Broadcast</button>
          <button onClick={() => exportCSV(students)} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 12px", background: `${C.purple}22`, border: `1px solid ${C.purple}33`, borderRadius: 8, color: C.purple, cursor: "pointer", fontSize: 13, fontFamily: "inherit", fontWeight: 600 }}>📤 Export CSV</button>
        </div>
      </div>
      <div style={{ padding: 10 }}>
        <button onClick={onLogout} style={{ width: "100%", padding: "8px", background: "transparent", border: `1px solid ${C.border}`, borderRadius: 8, color: C.muted, cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}>🚪 Logout</button>
      </div>
    </>
  );

  return (
    <div style={{ display: "flex", height: "100vh", background: C.bg, fontFamily: "'Segoe UI',system-ui,sans-serif", color: C.text, overflow: "hidden" }}>

      {isMobile && sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "#000a", zIndex: 40 }} />}

      {/* Sidebar */}
      {!isMobile ? (
        <div style={{ width: 210, background: C.card, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", flexShrink: 0 }}>
          <SidebarContent />
        </div>
      ) : (
        <div style={{ position: "fixed", top: 0, left: 0, width: 260, height: "100vh", background: C.card, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", zIndex: 50, transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)", transition: "transform 0.25s ease" }}>
          <SidebarContent />
        </div>
      )}

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Mobile top bar */}
        {isMobile && (
          <div style={{ padding: "10px 16px", borderBottom: `1px solid ${C.border}`, background: C.card + "dd", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <button onClick={() => setSidebarOpen(true)} style={{ background: "none", border: "none", color: C.text, fontSize: 22, cursor: "pointer", padding: 0 }}>☰</button>
            <span style={{ fontWeight: 700, fontSize: 15, flex: 1 }}>🛡️ Admin Panel</span>
            <button onClick={() => setShowAdd(true)} style={{ background: `${C.green}22`, border: `1px solid ${C.green}44`, borderRadius: 8, color: C.green, padding: "6px 12px", fontSize: 12, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>➕ Add</button>
          </div>
        )}

        <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "16px 12px" : "24px" }}>

          {loading && <div style={{ textAlign: "center", color: C.muted, padding: 60 }}>🔄 Loading...</div>}

          {/* OVERVIEW */}
          {!loading && view === "overview" && (<>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
              <h2 style={{ margin: 0, fontSize: isMobile ? 17 : 20, fontWeight: 800, color: C.accent }}>📊 Overview</h2>
              <div style={{ fontSize: 12, color: C.muted, background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "5px 10px" }}>🟢 {totalStudents} enrolled</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(5,1fr)", gap: 10, marginBottom: 20 }}>
              {[
                { label: "Students", val: totalStudents, icon: "👨‍🎓", color: C.accent },
                { label: "Quizzes", val: totalQuizzes, icon: "🧠", color: C.purple },
                { label: "Questions", val: totalQuestions, icon: "💬", color: C.green },
                { label: "Inactive", val: inactive.length, icon: "⚠️", color: C.red },
                { label: "Global Avg", val: `${globalAvg}%`, icon: "📈", color: sc(globalAvg) },
              ].map((s, i) => (
                <Card key={i} style={{ textAlign: "center", padding: "12px 8px" }}>
                  <div style={{ fontSize: 20 }}>{s.icon}</div>
                  <div style={{ fontSize: isMobile ? 18 : 22, fontWeight: 800, color: s.color, margin: "4px 0" }}>{s.val}</div>
                  <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: 1 }}>{s.label}</div>
                </Card>
              ))}
            </div>

            {!isMobile && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
                <Card>
                  <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>📚 Students per Class</div>
                  <BarChart data={classSummary.map(c => ({ label: `Cl.${c.class}`, val: c.count, color: C.accent }))} />
                </Card>
                <Card>
                  <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>🧠 Quizzes per Class</div>
                  <BarChart data={classSummary.map(c => ({ label: `Cl.${c.class}`, val: c.quizzes, color: C.purple }))} />
                </Card>
              </div>
            )}

            <Card style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 14 }}>📚 Class-wise Performance</div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                      {["Class", "Students", "Quizzes", "Avg Score", ""].map((h, i) => (
                        <th key={i} style={{ padding: "7px 10px", textAlign: i > 0 && i < 4 ? "center" : "left", color: C.muted, fontSize: 11, fontWeight: 600 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {classSummary.map(c => (
                      <tr key={c.class} style={{ borderBottom: `1px solid ${C.border}22` }}>
                        <td style={{ padding: "9px 10px", fontWeight: 700 }}>Class {c.class}</td>
                        <td style={{ padding: "9px 10px", textAlign: "center" }}>{c.count}</td>
                        <td style={{ padding: "9px 10px", textAlign: "center" }}>{c.quizzes}</td>
                        <td style={{ padding: "9px 10px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <div style={{ flex: 1, height: 5, background: C.dim, borderRadius: 99, overflow: "hidden" }}>
                              <div style={{ height: "100%", width: `${c.avg}%`, background: sc(c.avg), borderRadius: 99 }} />
                            </div>
                            <span style={{ fontSize: 11, fontWeight: 700, color: sc(c.avg), minWidth: 28 }}>{c.avg}%</span>
                          </div>
                        </td>
                        <td style={{ padding: "9px 10px" }}>
                          <button onClick={() => { setClassFilter(c.class); setView("students"); }} style={{ fontSize: 11, padding: "3px 8px", borderRadius: 99, background: `${C.accent}22`, color: C.accent, border: `1px solid ${C.accent}44`, cursor: "pointer" }}>View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {inactive.length > 0 && (
              <Card style={{ borderColor: `${C.red}33` }}>
                <div style={{ fontWeight: 700, marginBottom: 10, fontSize: 14, color: C.red }}>⚠️ Inactive ({inactive.length})</div>
                {inactive.slice(0, 5).map(s => (
                  <div key={s.uid} onClick={() => openStudent(s)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: `1px solid ${C.border}22`, cursor: "pointer" }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: `${C.red}22`, display: "flex", alignItems: "center", justifyContent: "center", color: C.red, fontWeight: 700, flexShrink: 0 }}>{s.name?.[0]}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{s.name} <Badge color={C.muted}>Class {s.class}</Badge></div>
                      <div style={{ fontSize: 11, color: C.muted }}>Streak: {s.streak || 0}d</div>
                    </div>
                    <button onClick={e => { e.stopPropagation(); handleReset(s.email); }} style={{ fontSize: 11, padding: "4px 8px", borderRadius: 7, background: `${C.accent}22`, color: C.accent, border: `1px solid ${C.accent}44`, cursor: "pointer", flexShrink: 0 }}>📧</button>
                  </div>
                ))}
              </Card>
            )}
          </>)}

          {/* STUDENTS */}
          {!loading && view === "students" && !selected && (<>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
              <h2 style={{ margin: 0, fontSize: isMobile ? 17 : 20, fontWeight: 800, color: C.accent }}>👨‍🎓 Students ({filtered.length})</h2>
              {!isMobile && <Btn onClick={() => setShowAdd(true)} small>➕ Add Student</Btn>}
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search..." style={{ background: C.dim, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, padding: "8px 12px", fontSize: 13, fontFamily: "inherit", outline: "none", flex: 1, minWidth: 120 }} />
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                {["All", ...CLASSES].map(c => (
                  <button key={c} onClick={() => setClassFilter(c)} style={{ padding: "6px 10px", borderRadius: 99, background: classFilter === c ? C.accent : C.dim, color: classFilter === c ? "#fff" : C.muted, border: `1px solid ${classFilter === c ? C.accent : C.border}`, cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}>
                    {c === "All" ? "All" : "Cl." + c}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill,minmax(270px,1fr))", gap: 12 }}>
              {filtered.map(s => {
                const avg = s.quizHistory?.length ? Math.round(s.quizHistory.reduce((a, q) => a + q.pct, 0) / s.quizHistory.length) : 0;
                return (
                  <Card key={s.uid} style={{ cursor: "pointer" }} onClick={() => openStudent(s)}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg,${C.accent},${C.purple})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800, flexShrink: 0 }}>{s.name?.[0]}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</div>
                        <div style={{ fontSize: 11, color: C.muted }}>Class {s.class} • 🔥{s.streak || 0}d</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 17, fontWeight: 800, color: sc(avg) }}>{avg}%</div>
                      </div>
                    </div>
                    <ScoreBar pct={avg} color={sc(avg)} />
                    <div style={{ display: "flex", gap: 6, marginTop: 10 }} onClick={e => e.stopPropagation()}>
                      <button onClick={() => { setShowEdit(s); setEditName(s.name); setEditClass(s.class); }} style={{ flex: 1, padding: "5px 0", fontSize: 11, borderRadius: 7, background: `${C.accent}22`, color: C.accent, border: `1px solid ${C.accent}44`, cursor: "pointer" }}>✏️ Edit</button>
                      <button onClick={() => handleReset(s.email)} style={{ flex: 1, padding: "5px 0", fontSize: 11, borderRadius: 7, background: `${C.gold}22`, color: C.gold, border: `1px solid ${C.gold}44`, cursor: "pointer" }}>🔑 Reset</button>
                      <button onClick={() => setShowConfirmDelete(s)} style={{ flex: 1, padding: "5px 0", fontSize: 11, borderRadius: 7, background: `${C.red}22`, color: C.red, border: `1px solid ${C.red}44`, cursor: "pointer" }}>🗑️</button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </>)}

          {/* STUDENT DETAIL */}
          {!loading && view === "student" && selected && (() => {
            const s = selected;
            const avg = s.quizHistory?.length ? Math.round(s.quizHistory.reduce((a, q) => a + q.pct, 0) / s.quizHistory.length) : 0;
            const subjectPerf = {};
            (s.quizHistory || []).forEach(q => {
              if (!subjectPerf[q.subject]) subjectPerf[q.subject] = { scores: [], total: 0 };
              subjectPerf[q.subject].scores.push(q.pct); subjectPerf[q.subject].total++;
            });
            return (
              <div>
                <button onClick={() => { setView("students"); setSelected(null); }} style={{ background: "none", border: "none", color: C.accent, cursor: "pointer", fontSize: 14, marginBottom: 14, fontFamily: "inherit", padding: 0 }}>← Back</button>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: `linear-gradient(135deg,${C.accent},${C.purple})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, flexShrink: 0 }}>{s.name?.[0]}</div>
                  <div style={{ flex: 1 }}>
                    <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>{s.name}</h2>
                    <div style={{ color: C.muted, fontSize: 12 }}>Class {s.class} • {s.email}</div>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <Btn small onClick={() => { setShowEdit(s); setEditName(s.name); setEditClass(s.class); }}>✏️</Btn>
                    <Btn small variant="ghost" style={{ border: `1px solid ${C.gold}`, color: C.gold }} onClick={() => handleReset(s.email)}>🔑</Btn>
                    <Btn small variant="danger" onClick={() => setShowConfirmDelete(s)}>🗑️</Btn>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: 10, marginBottom: 16 }}>
                  {[
                    { label: "Streak", val: `🔥 ${s.streak || 0}d`, color: C.gold },
                    { label: "Avg", val: `${avg}%`, color: sc(avg) },
                    { label: "Quizzes", val: s.totalQuizzes || 0, color: C.accent },
                    { label: "Questions", val: s.totalQuestions || 0, color: C.purple },
                  ].map((m, i) => (
                    <Card key={i} style={{ textAlign: "center", padding: "10px 6px" }}>
                      <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", marginBottom: 4 }}>{m.label}</div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: m.color }}>{m.val}</div>
                    </Card>
                  ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12, marginBottom: 12 }}>
                  <Card>
                    <div style={{ fontWeight: 700, marginBottom: 10, fontSize: 13 }}>📊 Subject Performance</div>
                    {!Object.keys(subjectPerf).length ? <div style={{ color: C.muted, fontSize: 13 }}>No quizzes yet</div>
                      : Object.entries(subjectPerf).map(([subj, data]) => {
                        const a = Math.round(data.scores.reduce((x, y) => x + y, 0) / data.scores.length);
                        return <div key={subj} style={{ marginBottom: 8 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                            <span style={{ fontSize: 12 }}>{subj}</span>
                            <span style={{ fontSize: 11, fontWeight: 700, color: sc(a) }}>{a}%</span>
                          </div>
                          <ScoreBar pct={a} color={sc(a)} />
                        </div>;
                      })}
                  </Card>
                  <Card>
                    <div style={{ fontWeight: 700, marginBottom: 10, fontSize: 13 }}>📌 Weak Topics</div>
                    {!s.weakTopics?.length ? <div style={{ color: C.green, fontSize: 13 }}>✅ None!</div>
                      : s.weakTopics.map((t, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                          <div style={{ width: 7, height: 7, borderRadius: "50%", background: [C.red, C.gold, C.purple, C.accent, C.green][i % 5] }} />
                          <span style={{ fontSize: 13 }}>{t}</span>
                        </div>
                      ))}
                  </Card>
                </div>
                <Card>
                  <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 13 }}>📝 Quiz History</div>
                  {!s.quizHistory?.length ? <div style={{ color: C.muted, fontSize: 13 }}>No attempts yet</div>
                    : s.quizHistory.map((q, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 7, background: `${sc(q.pct)}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: sc(q.pct), flexShrink: 0 }}>{q.pct}%</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{q.subject}</div>
                          <div style={{ fontSize: 11, color: C.muted }}>{q.score}/{q.total} • {new Date(q.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</div>
                        </div>
                        <div style={{ width: 70, flexShrink: 0 }}><ScoreBar pct={q.pct} color={sc(q.pct)} /></div>
                      </div>
                    ))}
                </Card>
              </div>
            );
          })()}

          {/* LEADERBOARD */}
          {!loading && view === "leaderboard" && (
            <div>
              <h2 style={{ color: C.accent, fontSize: isMobile ? 17 : 20, margin: "0 0 16px", fontWeight: 800 }}>🏆 Leaderboard</h2>
              {CLASSES.filter(c => students.some(s => s.class === c)).map(cls => {
                const cs = students.filter(s => s.class === cls)
                  .map(s => ({ ...s, avg: s.quizHistory?.length ? Math.round(s.quizHistory.reduce((a, q) => a + q.pct, 0) / s.quizHistory.length) : 0 }))
                  .sort((a, b) => b.avg - a.avg || (b.streak || 0) - (a.streak || 0));
                return (
                  <Card key={cls} style={{ marginBottom: 14 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10, display: "flex", justifyContent: "space-between" }}>
                      <span>📚 Class {cls}</span>
                      <Badge color={C.muted}>{cs.length}</Badge>
                    </div>
                    {cs.map((s, i) => (
                      <div key={s.uid} onClick={() => openStudent(s)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: `1px solid ${C.border}22`, cursor: "pointer" }}>
                        <div style={{ width: 26, height: 26, borderRadius: "50%", background: i === 0 ? C.gold + "33" : i === 1 ? "#c0c0c022" : i === 2 ? "#cd7f3222" : C.dim, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: i === 0 ? C.gold : i === 1 ? "#c0c0c0" : i === 2 ? "#cd7f32" : C.muted, flexShrink: 0 }}>
                          {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{s.name}</div>
                          <div style={{ fontSize: 11, color: C.muted }}>🔥{s.streak || 0}d • {s.totalQuizzes || 0} quizzes</div>
                        </div>
                        <div style={{ fontSize: 16, fontWeight: 800, color: sc(s.avg) }}>{s.avg}%</div>
                      </div>
                    ))}
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* MODALS */}
      {showAdd && (
        <Modal title="➕ Add Student" onClose={() => { setShowAdd(false); setAddError(""); }}>
          <Input label="Full Name" value={addName} onChange={setAddName} placeholder="Rahul Sharma" />
          <Input label="Email" type="email" value={addEmail} onChange={setAddEmail} placeholder="student@email.com" />
          <Input label="Password" type="password" value={addPassword} onChange={setAddPassword} placeholder="Min 6 characters" />
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Class</label>
            <select value={addClass} onChange={e => setAddClass(e.target.value)} style={{ width: "100%", background: C.dim, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, padding: "10px 12px", fontSize: 14, fontFamily: "inherit" }}>
              {CLASSES.map(c => <option key={c} value={c}>Class {c}</option>)}
            </select>
          </div>
          {addError && <div style={{ background: `${C.red}22`, border: `1px solid ${C.red}44`, borderRadius: 8, padding: "8px 12px", color: "#fca5a5", fontSize: 13, marginBottom: 12 }}>{addError}</div>}
          <div style={{ display: "flex", gap: 8 }}>
            <Btn onClick={handleAdd} disabled={addLoading} style={{ flex: 1 }}>{addLoading ? "Adding..." : "➕ Add"}</Btn>
            <Btn onClick={() => { setShowAdd(false); setAddError(""); }} variant="ghost" style={{ flex: 1, border: `1px solid ${C.border}` }}>Cancel</Btn>
          </div>
        </Modal>
      )}

      {showEdit && (
        <Modal title="✏️ Edit Student" onClose={() => setShowEdit(null)}>
          <Input label="Name" value={editName} onChange={setEditName} />
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Class</label>
            <select value={editClass} onChange={e => setEditClass(e.target.value)} style={{ width: "100%", background: C.dim, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, padding: "10px 12px", fontSize: 14, fontFamily: "inherit" }}>
              {CLASSES.map(c => <option key={c} value={c}>Class {c}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn onClick={handleEdit} style={{ flex: 1 }}>✅ Save</Btn>
            <Btn onClick={() => setShowEdit(null)} variant="ghost" style={{ flex: 1, border: `1px solid ${C.border}` }}>Cancel</Btn>
          </div>
        </Modal>
      )}

      {showConfirmDelete && (
        <Modal title="🗑️ Remove Student?" onClose={() => setShowConfirmDelete(null)}>
          <p style={{ color: C.muted, fontSize: 14, marginBottom: 18 }}><strong style={{ color: C.text }}>{showConfirmDelete.name}</strong> ka saara data delete ho jayega!</p>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn onClick={() => handleDelete(showConfirmDelete.uid)} variant="danger" style={{ flex: 1 }}>🗑️ Remove</Btn>
            <Btn onClick={() => setShowConfirmDelete(null)} variant="ghost" style={{ flex: 1, border: `1px solid ${C.border}` }}>Cancel</Btn>
          </div>
        </Modal>
      )}

      {showBroadcast && (
        <Modal title="📢 Broadcast Message" onClose={() => setShowBroadcast(false)}>
          <p style={{ color: C.muted, fontSize: 13, marginBottom: 10 }}>Sare <strong style={{ color: C.text }}>{totalStudents} students</strong> ko message jayega.</p>
          <div style={{ marginBottom: 14 }}>
            <textarea value={broadcastMsg} onChange={e => setBroadcastMsg(e.target.value)} placeholder="Kal test hai! 📚" rows={3}
              style={{ width: "100%", background: C.dim, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, padding: "10px 12px", fontSize: 14, fontFamily: "inherit", outline: "none", resize: "vertical", boxSizing: "border-box" }} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn onClick={handleBroadcast} disabled={broadcastLoading || !broadcastMsg.trim()} style={{ flex: 1 }}>{broadcastLoading ? "Sending..." : "📢 Send"}</Btn>
            <Btn onClick={() => setShowBroadcast(false)} variant="ghost" style={{ flex: 1, border: `1px solid ${C.border}` }}>Cancel</Btn>
          </div>
        </Modal>
      )}

      {toast && (
        <div style={{ position: "fixed", bottom: 20, right: 20, background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 18px", fontSize: 13, fontWeight: 600, color: C.text, zIndex: 200, boxShadow: "0 8px 32px #0008" }}>
          {toast}
        </div>
      )}

      <style>{`button:hover{opacity:0.88} ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-track{background:${C.bg}} ::-webkit-scrollbar-thumb{background:${C.border};border-radius:99px}`}</style>
    </div>
  );
}