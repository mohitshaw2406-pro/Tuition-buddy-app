import { useState, useEffect, useRef } from "react";
import {
  SUBJECTS, SYSTEM_PROMPT, callClaude, detectWeakTopicsFromChat,
  saveQuizResult, saveDoubts, saveWeakTopics, updateStreak
} from "./firebase.js";
import { C, Btn, Card, ScoreBar } from "./ui.jsx";
import useIsMobile from "./useIsMobile.js";

export default function StudentApp({ user, onLogout }) {
  const isMobile = useIsMobile();
  const [view, setView] = useState("chat");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState([{
    role: "assistant",
    content: `Namaste ${user.name}! 👋 Main hoon tera Tuition Buddy!\nTu Class ${user.class} mein hai — toh main tumhare level ke hisaab se help karunga! 📚\nAsk me anything — doubt, homework help, ya quiz lena hai toh bol do! 🌟`
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streak, setStreak] = useState(user.streak || 1);
  const [weakTopics, setWeakTopics] = useState(user.weakTopics || []);
  const [quizSubject, setQuizSubject] = useState("Mathematics");
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizChecked, setQuizChecked] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [mode, setMode] = useState("chat");
  const [quizHistory, setQuizHistory] = useState(user.quizHistory || []);
  const [totalQ, setTotalQ] = useState(user.totalQuestions || 0);
  const [listening, setListening] = useState(false);
  const bottomRef = useRef(null);
  const isDemo = user.uid === "demo-student";

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);
  useEffect(() => { if (!isDemo) updateStreak(user.uid).then(s => setStreak(s)); }, []);

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput("");
    if (isMobile) setSidebarOpen(false);
    const newMsgs = [...messages, { role: "user", content: msg }];
    setMessages(newMsgs);
    setLoading(true);
    try {
      const sys = mode === "homework"
        ? `You are a homework helper. Guide the Class ${user.class} student step by step WITHOUT giving direct answers. Use leading questions. Hinglish/English supported. End with encouragement.`
        : SYSTEM_PROMPT(user.class);
      const reply = await callClaude(newMsgs.map(m => ({ role: m.role, content: m.content })), sys);
      const finalMsgs = [...newMsgs, { role: "assistant", content: reply }];
      setMessages(finalMsgs);
      setTotalQ(prev => prev + 1);
      if (!isDemo) saveDoubts(user.uid, 1);
      if (finalMsgs.length >= 10 && finalMsgs.length % 10 === 0) {
        const topics = await detectWeakTopicsFromChat(finalMsgs);
        if (topics.length) {
          const merged = [...new Set([...weakTopics, ...topics])].slice(0, 5);
          setWeakTopics(merged);
          if (!isDemo) saveWeakTopics(user.uid, topics);
        }
      }
    } catch {
      setMessages(m => [...m, { role: "assistant", content: "Oops! Connection mein problem hai. Try kar! 🙏" }]);
    }
    setLoading(false);
  };

  const startQuiz = async () => {
    setQuizLoading(true); setQuizQuestions([]); setQuizAnswers({}); setQuizChecked(false); setQuizResult(null);
    try {
      const prompt = `Generate exactly 5 MCQ questions on "${quizSubject}" for a Class ${user.class} student.\nFormat strictly like this for each question:\nQ1. [question text here]\nA) [option]  B) [option]  C) [option]  D) [option]\nAnswer: A\nExplanation: [brief explanation]\n\nQ2. [question text here]\nA) [option]  B) [option]  C) [option]  D) [option]\nAnswer: B\nExplanation: [brief explanation]\n\nDo all 5 questions this way. Make questions appropriate for Class ${user.class} level.`;
      const res = await callClaude([{ role: "user", content: prompt }], SYSTEM_PROMPT(user.class));
      const parsed = parseQuiz(res);
      if (parsed.length === 0) throw new Error("Parse failed");
      setQuizQuestions(parsed);
    } catch {
      setQuizQuestions([]);
    }
    setQuizLoading(false);
  };

  const parseQuiz = (text) => {
    const blocks = text.split(/\n(?=Q\d+\.)/).filter(b => b.trim());
    return blocks.slice(0, 5).map((block, i) => {
      const lines = block.trim().split("\n").filter(l => l.trim());
      const question = lines[0]?.replace(/^Q\d+\.\s*/, "").trim() || `Question ${i + 1}`;
      const optLine = lines.find(l => /A\)/i.test(l)) || "";
      const opts = {
        A: optLine.match(/A\)\s*([^B]+?)(?=\s+B\)|$)/i)?.[1]?.trim() || "",
        B: optLine.match(/B\)\s*([^C]+?)(?=\s+C\)|$)/i)?.[1]?.trim() || "",
        C: optLine.match(/C\)\s*([^D]+?)(?=\s+D\)|$)/i)?.[1]?.trim() || "",
        D: optLine.match(/D\)\s*(.+?)$/i)?.[1]?.trim() || "",
      };
      const ansLine = lines.find(l => /Answer:/i.test(l)) || "";
      const answer = ansLine.match(/Answer:\s*([A-D])/i)?.[1]?.toUpperCase() || "A";
      const expLine = lines.find(l => /Explanation:/i.test(l)) || "";
      const explanation = expLine.replace(/Explanation:/i, "").trim();
      return { id: i, question, opts, answer, explanation };
    }).filter(q => q.question && Object.values(q.opts).some(v => v));
  };

  const submitQuiz = async () => {
    let score = 0;
    quizQuestions.forEach(q => { if (quizAnswers[q.id] === q.answer) score++; });
    const result = { score, total: quizQuestions.length, pct: Math.round((score / quizQuestions.length) * 100) };
    setQuizResult(result); setQuizChecked(true);
    const entry = { subject: quizSubject, score, total: quizQuestions.length, pct: result.pct, date: new Date().toISOString() };
    setQuizHistory(h => [entry, ...h]);
    if (!isDemo) await saveQuizResult(user.uid, quizSubject, score, quizQuestions.length, user.class);
    if (score < 3) {
      const merged = [...new Set([...weakTopics, quizSubject])].slice(0, 5);
      setWeakTopics(merged);
      if (!isDemo) saveWeakTopics(user.uid, [quizSubject]);
    }
    setView("chat");
    setMessages(m => [...m, {
      role: "assistant",
      content: `Quiz result: ${score}/${quizQuestions.length} on ${quizSubject} (${result.pct}%). ${result.pct >= 80 ? "Ekdum zabardast! 🔥" : result.pct >= 60 ? "Accha hua! Thoda aur practice kar 💪" : "Koi baat nahi, practice se sab aata hai! Weak areas pe dhyan do 📖"}`
    }]);
  };

  const startVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Voice input: use Chrome browser"); return; }
    const r = new SR(); r.lang = "en-IN"; r.interimResults = false;
    r.onstart = () => setListening(true);
    r.onresult = e => { setInput(e.results[0][0].transcript); setListening(false); };
    r.onerror = () => setListening(false); r.onend = () => setListening(false);
    r.start();
  };

  const avgScore = quizHistory.length ? Math.round(quizHistory.reduce((a, q) => a + q.pct, 0) / quizHistory.length) : 0;
  const navItems = [{ id: "chat", icon: "💬", label: "Chat" }, { id: "quiz", icon: "🧠", label: "Quiz" }, { id: "progress", icon: "📊", label: "Progress" }];
  const quickPrompts = [
    { l: "📐 Maths doubt", m: "Explain quadratic equations with examples for my level" },
    { l: "⚗️ Science", m: "Photosynthesis kya hota hai? Step by step explain karo" },
    { l: "📝 Essay help", m: "Help me write an essay outline on climate change" },
    { l: "🔢 Algebra", m: "How do I solve linear equations? Show me the method" },
  ];

  const SidebarContent = () => (
    <>
      <div style={{ padding: "20px 16px 14px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, background: `linear-gradient(135deg,${C.accent},${C.purple})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>🎓 Tuition Buddy</div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>Class {user.class} • {user.name}</div>
          </div>
          {isMobile && <button onClick={() => setSidebarOpen(false)} style={{ background: "none", border: "none", color: C.muted, fontSize: 22, cursor: "pointer" }}>✕</button>}
        </div>
      </div>

      <div style={{ padding: "12px 10px", flex: 1, overflowY: "auto" }}>
        {navItems.map(n => (
          <button key={n.id} onClick={() => { setView(n.id); setSidebarOpen(false); }} style={{
            display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", marginBottom: 4,
            background: view === n.id ? `linear-gradient(135deg,${C.accent}22,${C.accentSoft || "#4f46e5"}22)` : "transparent",
            border: view === n.id ? `1px solid ${C.accent}44` : "1px solid transparent",
            borderRadius: 10, color: view === n.id ? C.accent : C.muted,
            cursor: "pointer", fontSize: 15, fontWeight: view === n.id ? 700 : 400, fontFamily: "inherit"
          }}><span>{n.icon}</span>{n.label}</button>
        ))}

        {view === "chat" && (
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 6, padding: "0 4px", textTransform: "uppercase", letterSpacing: 1 }}>Chat Mode</div>
            {[{ id: "chat", l: "💬 Ask Doubts" }, { id: "homework", l: "📝 Homework Help" }].map(m => (
              <button key={m.id} onClick={() => { setMode(m.id); setSidebarOpen(false); }} style={{
                display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 12px", marginBottom: 3,
                background: mode === m.id ? C.accent + "33" : "transparent", border: "none", borderRadius: 8,
                color: mode === m.id ? "#fff" : C.muted, cursor: "pointer", fontSize: 14, fontFamily: "inherit"
              }}>{m.l}</button>
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: "0 10px", paddingBottom: 12 }}>
        <div style={{ background: `linear-gradient(135deg,${C.gold}22,${C.gold}11)`, border: `1px solid ${C.gold}33`, borderRadius: 10, padding: "10px 12px", marginBottom: 8 }}>
          <div style={{ fontSize: 11, color: C.gold, textTransform: "uppercase", letterSpacing: 1 }}>Study Streak</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: C.gold }}>🔥 {streak} day{streak !== 1 ? "s" : ""}</div>
        </div>
        {weakTopics.length > 0 && (
          <div style={{ background: `${C.purple}11`, border: `1px solid ${C.purple}33`, borderRadius: 10, padding: "10px 12px", marginBottom: 8 }}>
            <div style={{ fontSize: 11, color: C.purple, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>📊 Focus Areas</div>
            {weakTopics.slice(0, 3).map((t, i) => (
              <div key={i} style={{ fontSize: 12, color: "#c4b5fd", marginBottom: 2, display: "flex", gap: 6, alignItems: "center" }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: [C.gold, C.red, C.purple][i % 3], flexShrink: 0 }} />{t}
              </div>
            ))}
          </div>
        )}
        <button onClick={onLogout} style={{ width: "100%", padding: "9px", background: "transparent", border: `1px solid ${C.border}`, borderRadius: 8, color: C.muted, cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>🚪 Logout</button>
      </div>
    </>
  );

  return (
    <div style={{ display: "flex", height: "100vh", background: C.bg, fontFamily: "'Segoe UI',system-ui,sans-serif", color: C.text, overflow: "hidden" }}>

      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "#000a", zIndex: 40 }} />
      )}

      {/* Sidebar */}
      {!isMobile ? (
        <div style={{ width: 220, background: C.card, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", flexShrink: 0 }}>
          <SidebarContent />
        </div>
      ) : (
        <div style={{
          position: "fixed", top: 0, left: 0, width: 260, height: "100vh",
          background: C.card, borderRight: `1px solid ${C.border}`,
          display: "flex", flexDirection: "column", zIndex: 50,
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.25s ease"
        }}>
          <SidebarContent />
        </div>
      )}

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>

        {/* Mobile top bar */}
        {isMobile && (
          <div style={{ padding: "10px 16px", borderBottom: `1px solid ${C.border}`, background: C.card + "dd", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <button onClick={() => setSidebarOpen(true)} style={{ background: "none", border: "none", color: C.text, fontSize: 22, cursor: "pointer", padding: 0 }}>☰</button>
            <span style={{ fontWeight: 700, fontSize: 15, flex: 1 }}>
              {view === "chat" ? (mode === "homework" ? "📝 Homework Help" : "💬 Ask Doubts") : view === "quiz" ? "🧠 Quiz" : "📊 Progress"}
            </span>
            <span style={{ fontSize: 13, color: C.gold }}>🔥 {streak}d</span>
          </div>
        )}

        {/* ── CHAT VIEW ── */}
        {view === "chat" && (<>
          {!isMobile && (
            <div style={{ padding: "12px 20px", borderBottom: `1px solid ${C.border}`, background: C.card + "aa", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
              <span style={{ fontWeight: 600, fontSize: 15 }}>{mode === "homework" ? "📝 Homework Help" : "💬 Ask Doubts"}</span>
              <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
                {["Maths", "Science", "English"].map(s => (
                  <button key={s} onClick={() => send(`Help me with ${s} for Class ${user.class}`)} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 99, background: C.dim, color: C.muted, border: `1px solid ${C.border}`, cursor: "pointer" }}>📌{s}</button>
                ))}
              </div>
            </div>
          )}

          <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "12px" : "20px" }}>
            <div style={{ maxWidth: 680, margin: "0 auto" }}>
              {messages.length === 1 && (
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 8, marginBottom: 16 }}>
                  {quickPrompts.map((p, i) => (
                    <button key={i} onClick={() => send(p.m)} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, color: "#c4b5fd", padding: "10px 12px", cursor: "pointer", fontSize: 13, textAlign: "left", fontFamily: "inherit" }}>{p.l}</button>
                  ))}
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 12 }}>
                  {m.role === "assistant" && (
                    <div style={{ width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg,${C.accent},${C.purple})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, marginRight: 8, flexShrink: 0, marginTop: 2 }}>🎓</div>
                  )}
                  <div style={{
                    maxWidth: isMobile ? "85%" : "76%", padding: "10px 14px",
                    borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    background: m.role === "user" ? `linear-gradient(135deg,${C.accent},${C.accentSoft || "#4f46e5"})` : C.card,
                    border: m.role === "assistant" ? `1px solid ${C.border}` : "none",
                    fontSize: isMobile ? 13 : 14, lineHeight: 1.65, whiteSpace: "pre-wrap", color: C.text
                  }}>{m.content}</div>
                </div>
              ))}
              {loading && (
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg,${C.accent},${C.purple})`, display: "flex", alignItems: "center", justifyContent: "center" }}>🎓</div>
                  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "16px 16px 16px 4px", padding: "12px 16px", display: "flex", gap: 5 }}>
                    {[0, 1, 2].map(n => <div key={n} style={{ width: 7, height: 7, borderRadius: "50%", background: C.accent, animation: `bounce 1.2s ${n * 0.2}s infinite` }} />)}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          </div>

          <div style={{ padding: isMobile ? "10px 12px" : "12px 20px", borderTop: `1px solid ${C.border}`, background: C.card + "aa", flexShrink: 0 }}>
            <div style={{ maxWidth: 680, margin: "0 auto", display: "flex", gap: 8, alignItems: "flex-end" }}>
              <div style={{ flex: 1, background: C.dim, border: `1px solid ${C.border}`, borderRadius: 12, display: "flex", alignItems: "flex-end" }}>
                <textarea value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey && !isMobile) { e.preventDefault(); send(); } }}
                  placeholder="Koi bhi doubt poochho..."
                  rows={1} style={{ flex: 1, background: "none", border: "none", color: C.text, padding: "10px 12px", fontSize: isMobile ? 15 : 14, resize: "none", outline: "none", fontFamily: "inherit", maxHeight: 100, overflowY: "auto" }} />
                <button onClick={startVoice} style={{ background: listening ? C.accent : "none", border: "none", color: listening ? "#fff" : C.muted, cursor: "pointer", padding: "10px 12px", fontSize: 18, borderRadius: "0 12px 12px 0" }} title="Voice input">🎤</button>
              </div>
              <button onClick={() => send()} disabled={loading || !input.trim()} style={{ height: 44, width: 44, borderRadius: 12, background: `linear-gradient(135deg,${C.accent},${C.accentSoft || "#4f46e5"})`, border: "none", color: "#fff", fontSize: 20, cursor: loading || !input.trim() ? "not-allowed" : "pointer", opacity: loading || !input.trim() ? 0.5 : 1, flexShrink: 0 }}>➤</button>
            </div>
            {!isMobile && <div style={{ textAlign: "center", fontSize: 11, color: C.muted, marginTop: 5 }}>Enter to send • Shift+Enter new line • 🎤 voice</div>}
          </div>
        </>)}

        {/* ── QUIZ VIEW ── */}
        {view === "quiz" && (
          <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "16px 12px" : "24px 20px" }}>
            <div style={{ maxWidth: 640, margin: "0 auto" }}>
              <h2 style={{ color: C.accent, fontSize: isMobile ? 17 : 20, margin: "0 0 16px", fontWeight: 700 }}>🧠 Quiz — Class {user.class}</h2>
              <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
                <select value={quizSubject} onChange={e => setQuizSubject(e.target.value)} style={{ background: C.dim, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, padding: "9px 12px", fontSize: 14, fontFamily: "inherit", cursor: "pointer", flex: isMobile ? 1 : "none" }}>
                  {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                </select>
                <Btn onClick={startQuiz} disabled={quizLoading} style={{ flex: isMobile ? 1 : "none" }}>{quizLoading ? "Generating..." : "▶ Start Quiz"}</Btn>
                {quizQuestions.length > 0 && !quizChecked && <Btn onClick={submitQuiz} style={{ background: C.green, flex: isMobile ? 1 : "none" }}>✓ Submit</Btn>}
              </div>

              {quizResult && (
                <Card style={{ marginBottom: 16, borderColor: quizResult.pct >= 60 ? C.green + "44" : C.red + "44", background: quizResult.pct >= 60 ? C.success : C.danger }}>
                  <div style={{ fontSize: 20, fontWeight: 800 }}>{quizResult.pct >= 80 ? "🔥 Excellent!" : quizResult.pct >= 60 ? "👍 Good Job!" : "💪 Keep Practicing!"}</div>
                  <div style={{ fontSize: 15, marginTop: 4 }}>{quizResult.score}/{quizResult.total} on {quizSubject} ({quizResult.pct}%)</div>
                </Card>
              )}

              {quizLoading && <div style={{ textAlign: "center", color: C.muted, padding: 40 }}>🔄 Generating questions...</div>}

              {quizQuestions.length === 0 && !quizLoading && !quizResult && (
                <div style={{ textAlign: "center", color: C.muted, padding: 40, fontSize: 14 }}>Subject select karo aur Start Quiz dabao! 🎯</div>
              )}

              {quizQuestions.map((q, i) => (
                <Card key={q.id} style={{ marginBottom: 12 }}>
                  <div style={{ fontWeight: 600, marginBottom: 12, fontSize: isMobile ? 14 : 15, lineHeight: 1.5 }}>Q{i + 1}. {q.question}</div>
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 8 }}>
                    {Object.entries(q.opts).map(([k, v]) => {
                      if (!v) return null;
                      const sel = quizAnswers[q.id] === k;
                      const correct = quizChecked && k === q.answer;
                      const wrong = quizChecked && sel && k !== q.answer;
                      return (
                        <button key={k} onClick={() => !quizChecked && setQuizAnswers(a => ({ ...a, [q.id]: k }))} style={{
                          background: correct ? "#064e3b" : wrong ? "#7c1f1f" : sel ? C.accent + "44" : C.bg,
                          border: `1px solid ${correct ? C.green : wrong ? C.red : sel ? C.accent : C.border}`,
                          borderRadius: 8, color: C.text, padding: "10px 12px", cursor: quizChecked ? "default" : "pointer",
                          textAlign: "left", fontSize: 13, fontFamily: "inherit", lineHeight: 1.4
                        }}>
                          <span style={{ fontWeight: 700, color: C.accent, marginRight: 6 }}>{k})</span>{v}
                        </button>
                      );
                    })}
                  </div>
                  {quizChecked && q.explanation && (
                    <div style={{ marginTop: 10, fontSize: 13, color: "#86efac", background: "#05231644", borderRadius: 8, padding: "8px 12px" }}>✅ {q.explanation}</div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ── PROGRESS VIEW ── */}
        {view === "progress" && (
          <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "16px 12px" : "24px 20px" }}>
            <div style={{ maxWidth: 680, margin: "0 auto" }}>
              <h2 style={{ color: C.accent, fontSize: isMobile ? 17 : 20, margin: "0 0 16px", fontWeight: 700 }}>📊 My Progress</h2>

              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: 10, marginBottom: 16 }}>
                {[
                  { label: "Streak", val: `🔥 ${streak}d`, color: C.gold },
                  { label: "Quizzes", val: quizHistory.length, color: C.accent },
                  { label: "Avg Score", val: `${avgScore}%`, color: avgScore >= 70 ? C.green : C.gold },
                  { label: "Questions", val: totalQ, color: C.purple },
                ].map((s, i) => (
                  <Card key={i} style={{ textAlign: "center", padding: "12px 8px" }}>
                    <div style={{ fontSize: 10, color: C.muted, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>{s.label}</div>
                    <div style={{ fontSize: isMobile ? 18 : 22, fontWeight: 800, color: s.color }}>{s.val}</div>
                  </Card>
                ))}
              </div>

              {weakTopics.length > 0 && (
                <Card style={{ marginBottom: 14 }}>
                  <div style={{ fontWeight: 700, marginBottom: 10, fontSize: 14, color: C.purple }}>📌 Focus Topics</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {weakTopics.map((t, i) => (
                      <span key={i} style={{ background: `${[C.gold, C.red, C.purple, C.accent, C.green][i % 5]}22`, color: [C.gold, C.red, C.purple, C.accent, C.green][i % 5], border: `1px solid ${[C.gold, C.red, C.purple, C.accent, C.green][i % 5]}44`, borderRadius: 99, padding: "4px 12px", fontSize: 12, fontWeight: 600 }}>{t}</span>
                    ))}
                  </div>
                </Card>
              )}

              <Card>
                <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 14 }}>📝 Quiz History</div>
                {quizHistory.length === 0
                  ? <div style={{ color: C.muted, fontSize: 14 }}>No quizzes yet. Quiz tab pe jao! 🧠</div>
                  : quizHistory.map((q, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{q.subject}</div>
                        <div style={{ fontSize: 11, color: C.muted }}>{new Date(q.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</div>
                      </div>
                      <div style={{ width: isMobile ? 80 : 120, flexShrink: 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                          <span style={{ fontSize: 11, color: C.muted }}>{q.score}/{q.total}</span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: q.pct >= 70 ? C.green : q.pct >= 50 ? C.gold : C.red }}>{q.pct}%</span>
                        </div>
                        <ScoreBar pct={q.pct} color={q.pct >= 70 ? C.green : q.pct >= 50 ? C.gold : C.red} />
                      </div>
                    </div>
                  ))}
              </Card>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-8px)}}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:${C.bg}}
        ::-webkit-scrollbar-thumb{background:${C.border};border-radius:99px}
        textarea::placeholder{color:${C.muted}}
        select option{background:${C.card}}
        button:hover{opacity:0.88}
      `}</style>
    </div>
  );
}