import { useState, useEffect, useRef } from "react";
import {
  SUBJECTS, SYSTEM_PROMPT, callClaude, detectWeakTopicsFromChat,
  saveQuizResult, saveDoubts, saveWeakTopics, updateStreak
} from "./firebase.js";
import { C, Btn, Card, ScoreBar } from "./ui.jsx";
import useIsMobile from "./useIsMobile.js";

const SUBJECT_ICONS = {
  Mathematics:"📐", Physics:"⚡", Chemistry:"🧪", Biology:"🔬",
  Science:"🔭", "Social Science":"🌍", English:"📖", Hindi:"✍️",
  Sanskrit:"🕉️", Accountancy:"📊", "Business Studies":"💼", Economics:"📈",
  History:"🏛️", Geography:"🗺️", "Political Science":"⚖️", default:"📚",
};

const SUBJECT_COLORS = {
  Mathematics:"#6366F1", Physics:"#F97316", Chemistry:"#10B981",
  Biology:"#22C55E", Science:"#10B981", "Social Science":"#F97316",
  English:"#3B82F6", Hindi:"#A855F7", Sanskrit:"#F59E0B",
  Accountancy:"#0EA5E9", "Business Studies":"#F43F5E", Economics:"#16A34A",
  default:"#6366F1",
};

const getColor = (subject) => SUBJECT_COLORS[subject] || SUBJECT_COLORS.default;
const getIcon  = (subject) => SUBJECT_ICONS[subject]  || SUBJECT_ICONS.default;

async function claudeJSON(prompt) {
  const reply = await callClaude(
    [{ role: "user", content: prompt }],
    "You are a CBSE/NCERT curriculum expert. Return only valid raw JSON. No markdown, no backticks, no explanation, no preamble."
  );
  return JSON.parse(reply.replace(/```json|```/g, "").trim());
}

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

  const [quizStep, setQuizStep] = useState("subject"); 
  const [quizSubject, setQuizSubject] = useState(null);
  const [chapters, setChapters] = useState([]);        
  const [chaptersLoading, setChaptersLoading] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState(null); 
  const [quizMode, setQuizMode] = useState("chapter");
  const [numQuestions, setNumQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState("medium");
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizChecked, setQuizChecked] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizError, setQuizError] = useState(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [liveScore, setLiveScore] = useState(0);

  const [mode, setMode] = useState("chat");
  const [quizHistory, setQuizHistory] = useState(user.quizHistory || []);
  const [totalQ, setTotalQ] = useState(user.totalQuestions || 0);
  const [listening, setListening] = useState(false);
  const bottomRef = useRef(null);
  const isDemo = user.uid === "demo-student";

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);
  useEffect(() => { if (!isDemo) updateStreak(user.uid).then(s => setStreak(s)); }, []);

  const getSubjectsForClass = () => {
    const cls = parseInt(user.class);
    if (cls >= 6 && cls <= 8)  return ["Mathematics","Science","Social Science","English","Hindi","Sanskrit"];
    if (cls === 9 || cls === 10) return ["Mathematics","Science","Social Science","English","Hindi","Sanskrit"];
    if (cls === 11 || cls === 12) return ["Mathematics","Physics","Chemistry","Biology","Accountancy","Business Studies","Economics","English","Hindi"];
    return SUBJECTS;
  };
  const classSubjects = getSubjectsForClass();

  const fetchChapters = async (subject) => {
    setChaptersLoading(true);
    setChapters([]);
    setQuizError(null);
    try {
      const result = await claudeJSON(
        `You are a CBSE curriculum expert. List ONLY the chapters present in the LATEST NCERT 2024-25 rationalized textbook for "${subject}" Class ${user.class}.

Important rules:
- Use the REDUCED/RATIONALIZED syllabus (many chapters were removed in 2022-23 and further updated in 2024-25)
- Do NOT include deleted or dropped chapters
- For Class 6, use the NEW NEP 2020 based textbooks (Ganita Prakash for Maths, Curiosity for Science, etc.)
- Return ONLY a JSON array: [{"num":1,"name":"Chapter Name"}, ...]
- Chapter numbers should match actual NCERT book chapter numbers
- No extra text, no explanation`,
      );
      if (Array.isArray(result) && result.length > 0) {
        setChapters(result);
      } else {
        throw new Error("Empty chapters");
      }
    } catch {
      setQuizError("Chapters load nahi hue. Dobara try karo.");
    }
    setChaptersLoading(false);
  };

  const handleSubjectSelect = (subject) => {
    setQuizSubject(subject);
    setSelectedChapter(null);
    setQuizMode("chapter");
    setQuizStep("chapter");
    fetchChapters(subject);
  };

  const handleChapterSelect = (ch) => {
    setSelectedChapter(ch);
    setQuizMode("chapter");
  };

  const handleFullSubject = () => {
    setSelectedChapter(null);
    setQuizMode("full");
  };

  const handleGoToSettings = () => setQuizStep("settings");

  // ── STEP 2: Generate quiz questions via AI ───────────────────────────────────
  const generateQuiz = async () => {
    setQuizLoading(true);
    setQuizError(null);
    setQuizQuestions([]);
    setQuizAnswers({});
    setQuizChecked(false);
    setQuizResult(null);
    setCurrentQIndex(0);
    setAnswered(false);
    setLiveScore(0);

    const topicDesc = quizMode === "full"
      ? `all chapters of ${quizSubject} for Class ${user.class} NCERT 2024-25`
      : `Chapter ${selectedChapter.num}: "${selectedChapter.name}" from ${quizSubject}, Class ${user.class} NCERT 2024-25`;

    try {
      const questions = await claudeJSON(
        `Generate exactly ${numQuestions} MCQ questions for ${topicDesc}.
Difficulty: ${difficulty} (easy=basic recall, medium=concept understanding, hard=application/analysis).
Rules:
- Strictly follow the RATIONALIZED NCERT 2024-25 syllabus only. Do NOT include content from dropped/deleted chapters.
- Each question has exactly 4 options
- For Hindi/Sanskrit subjects, write questions and options in that language
- CBSE board exam style

Return ONLY a raw JSON array:
[{"question":"...","options":["A text","B text","C text","D text"],"correct":0,"explanation":"..."}]
"correct" = 0-indexed position of correct answer. No extra text.`,
        "You are a CBSE exam expert. Return only valid raw JSON. No markdown, no backticks, no preamble."
      );
      if (!Array.isArray(questions) || questions.length === 0) throw new Error("empty");
      setQuizQuestions(questions);
      setQuizStep("quiz");
    } catch {
      setQuizError("Questions generate nahi hue. Dobara try karo!");
    }
    setQuizLoading(false);
  };

  // ── STEP 3: Handle answer selection (one-by-one mode) ───────────────────────
  const handleOptionSelect = (optIdx) => {
    if (answered) return;
    const newAnswers = { ...quizAnswers, [currentQIndex]: optIdx };
    setQuizAnswers(newAnswers);
    setAnswered(true);
    if (optIdx === quizQuestions[currentQIndex].correct) {
      setLiveScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQIndex + 1 >= quizQuestions.length) {
      finishQuiz();
    } else {
      setCurrentQIndex(i => i + 1);
      setAnswered(false);
    }
  };

  const finishQuiz = async () => {
    const total = quizQuestions.length;
    const pct = Math.round((liveScore / total) * 100);
    const result = { score: liveScore, total, pct };
    setQuizResult(result);
    setQuizChecked(true);
    setQuizStep("result");

    const subjectLabel = quizMode === "full"
      ? quizSubject
      : `${quizSubject} Ch.${selectedChapter.num}`;
    const entry = { subject: subjectLabel, score: liveScore, total, pct, date: new Date().toISOString() };
    setQuizHistory(h => [entry, ...h]);

    if (!isDemo) await saveQuizResult(user.uid, subjectLabel, liveScore, total, user.class);
    if (liveScore < Math.ceil(total * 0.6)) {
      const merged = [...new Set([...weakTopics, quizSubject])].slice(0, 5);
      setWeakTopics(merged);
      if (!isDemo) saveWeakTopics(user.uid, [quizSubject]);
    }
    setView("chat");
    setMessages(m => [...m, {
      role: "assistant",
      content: `Quiz result: ${liveScore}/${total} on ${subjectLabel} (${pct}%). ${pct >= 80 ? "Ekdum zabardast! 🔥" : pct >= 60 ? "Achha hua! Thoda aur practice kar 💪" : "Koi baat nahi, practice se sab aata hai! Weak areas pe dhyan do 📖"}`
    }]);
  };

  // ── Reset quiz state ─────────────────────────────────────────────────────────
  const resetQuiz = () => {
    setQuizStep("subject");
    setQuizSubject(null);
    setChapters([]);
    setSelectedChapter(null);
    setQuizQuestions([]);
    setQuizAnswers({});
    setQuizChecked(false);
    setQuizResult(null);
    setQuizError(null);
    setCurrentQIndex(0);
    setAnswered(false);
    setLiveScore(0);
  };

  // ── CHAT SEND ────────────────────────────────────────────────────────────────
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
          <button key={n.id} onClick={() => { setView(n.id); if (n.id === "quiz") resetQuiz(); setSidebarOpen(false); }} style={{
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

  // ════════════════════════════════════════════════════════════════════════════
  // QUIZ VIEW — Chapter-wise flow
  // ════════════════════════════════════════════════════════════════════════════
  const renderQuizView = () => {
    const color = quizSubject ? getColor(quizSubject) : C.accent;
    const icon  = quizSubject ? getIcon(quizSubject) : "🧠";

    // ── Step: Subject selection ──────────────────────────────────────────────
    if (quizStep === "subject") return (
      <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "16px 12px" : "24px 20px" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{ color: C.accent, fontSize: isMobile ? 17 : 20, margin: "0 0 4px", fontWeight: 800 }}>🧠 Quiz</h2>
          <p style={{ color: C.muted, fontSize: 13, margin: "0 0 20px" }}>Class {user.class} — Subject choose karo</p>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr", gap: 10 }}>
            {classSubjects.map(subject => (
              <button key={subject} onClick={() => handleSubjectSelect(subject)} style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                background: C.card, border: `2px solid ${getColor(subject)}44`,
                borderRadius: 14, padding: "16px 10px", cursor: "pointer",
                transition: "all 0.15s", fontFamily: "inherit",
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = getColor(subject)}
              onMouseLeave={e => e.currentTarget.style.borderColor = getColor(subject) + "44"}
              >
                <span style={{ fontSize: 28 }}>{getIcon(subject)}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: getColor(subject), textAlign: "center", lineHeight: 1.3 }}>{subject}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );

    // ── Step: Chapter selection ──────────────────────────────────────────────
    if (quizStep === "chapter") return (
      <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "16px 12px" : "24px 20px" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <button onClick={() => setQuizStep("subject")} style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 8, color: C.muted, padding: "4px 10px", cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>← Back</button>
            <div>
              <h2 style={{ color, fontSize: 17, margin: 0, fontWeight: 800 }}>{icon} {quizSubject}</h2>
              <p style={{ color: C.muted, fontSize: 12, margin: 0 }}>Class {user.class} — Chapter choose karo</p>
            </div>
          </div>

          {/* Error */}
          {quizError && (
            <div style={{ background: "#7f1d1d44", border: "1px solid #ef444444", borderRadius: 10, padding: "12px 16px", color: "#fca5a5", marginBottom: 12, fontSize: 13 }}>
              {quizError}
              <button onClick={() => fetchChapters(quizSubject)} style={{ marginLeft: 12, background: "none", border: "none", color: "#fca5a5", cursor: "pointer", textDecoration: "underline", fontFamily: "inherit", fontSize: 13 }}>Retry</button>
            </div>
          )}

          {/* Full subject option */}
          <button onClick={handleFullSubject} style={{
            display: "flex", alignItems: "center", gap: 12, width: "100%",
            background: quizMode === "full" ? color + "22" : C.card,
            border: `2px solid ${quizMode === "full" ? color : C.border}`,
            borderRadius: 12, padding: "12px 16px", cursor: "pointer", marginBottom: 8,
            fontFamily: "inherit", textAlign: "left",
            boxShadow: quizMode === "full" ? `0 0 0 3px ${color}33` : "none",
          }}>
            <span style={{ fontSize: 22 }}>⚡</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: quizMode === "full" ? color : C.text, fontSize: 14 }}>Full Subject Test</div>
              <div style={{ fontSize: 12, color: C.muted }}>Saare chapters se mixed questions</div>
            </div>
            {quizMode === "full" && <span style={{ color, fontWeight: 800, fontSize: 18 }}>✓</span>}
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "12px 0" }}>
            <div style={{ flex: 1, height: 1, background: C.border }} />
            <span style={{ color: C.muted, fontSize: 12 }}>ya chapter choose karo</span>
            <div style={{ flex: 1, height: 1, background: C.border }} />
          </div>

          {/* Chapters loading */}
          {chaptersLoading && (
            <div style={{ textAlign: "center", padding: "30px 0", color: C.muted }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>⏳</div>
              <div style={{ fontSize: 13 }}>AI se chapters fetch ho rahe hain...</div>
            </div>
          )}

          {/* Chapter list */}
          {!chaptersLoading && chapters.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {chapters.map(ch => {
                const isSelected = selectedChapter?.num === ch.num && quizMode === "chapter";
                return (
                  <button key={ch.num} onClick={() => handleChapterSelect(ch)} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    background: isSelected ? color + "18" : C.card,
                    border: `1.5px solid ${isSelected ? color : C.border}`,
                    borderRadius: 10, padding: "10px 14px", cursor: "pointer",
                    textAlign: "left", fontFamily: "inherit",
                    boxShadow: isSelected ? `0 0 0 2px ${color}33` : "none",
                  }}>
                    <span style={{
                      minWidth: 30, height: 30, borderRadius: 8, display: "flex",
                      alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800,
                      background: isSelected ? color : C.dim, color: isSelected ? "#fff" : C.muted,
                      flexShrink: 0,
                    }}>{ch.num}</span>
                    <span style={{ flex: 1, fontSize: 13, fontWeight: isSelected ? 600 : 400, color: isSelected ? color : C.text, lineHeight: 1.4 }}>{ch.name}</span>
                    {isSelected && <span style={{ color, fontWeight: 800 }}>✓</span>}
                  </button>
                );
              })}
            </div>
          )}

          {/* Sticky start button */}
          {(selectedChapter || quizMode === "full") && (
            <div style={{
              position: "sticky", bottom: 0, marginTop: 16,
              background: C.card + "ee", backdropFilter: "blur(8px)",
              borderTop: `1px solid ${C.border}`, borderRadius: "0 0 12px 12px",
              padding: "12px 0",
            }}>
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 8, textAlign: "center" }}>
                {quizMode === "full" ? `⚡ ${quizSubject} — Full Subject Test` : `📖 Ch.${selectedChapter.num}: ${selectedChapter.name}`}
              </div>
              <button onClick={handleGoToSettings} style={{
                width: "100%", border: "none", borderRadius: 10,
                padding: "12px", color: "#fff", fontSize: 15, fontWeight: 700,
                cursor: "pointer", background: `linear-gradient(135deg, ${color}, ${color}cc)`,
                fontFamily: "inherit",
              }}>🚀 Aage Badho →</button>
            </div>
          )}
        </div>
      </div>
    );

    // ── Step: Settings ───────────────────────────────────────────────────────
    if (quizStep === "settings") return (
      <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "16px 12px" : "24px 20px" }}>
        <div style={{ maxWidth: 500, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <button onClick={() => setQuizStep("chapter")} style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 8, color: C.muted, padding: "4px 10px", cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>← Back</button>
            <div>
              <h2 style={{ color, fontSize: 17, margin: 0, fontWeight: 800 }}>⚙️ Quiz Settings</h2>
              <p style={{ color: C.muted, fontSize: 12, margin: 0 }}>
                {quizMode === "full" ? `${icon} ${quizSubject} — Full Test` : `${icon} ${quizSubject} — Ch.${selectedChapter?.num}: ${selectedChapter?.name}`}
              </p>
            </div>
          </div>

          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "20px" }}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 10 }}>Kitne Questions?</div>
              <div style={{ display: "flex", gap: 8 }}>
                {[5, 10, 15, 20].map(n => (
                  <button key={n} onClick={() => setNumQuestions(n)} style={{
                    flex: 1, padding: "10px 0", border: "none", borderRadius: 8, cursor: "pointer",
                    background: numQuestions === n ? color : C.dim,
                    color: numQuestions === n ? "#fff" : C.muted,
                    fontWeight: 700, fontSize: 15, fontFamily: "inherit",
                  }}>{n}</button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 10 }}>Difficulty</div>
              <div style={{ display: "flex", gap: 8 }}>
                {[{v:"easy",l:"Easy 😊"},{v:"medium",l:"Medium 🤔"},{v:"hard",l:"Hard 🔥"}].map(({v,l}) => (
                  <button key={v} onClick={() => setDifficulty(v)} style={{
                    flex: 1, padding: "10px 4px", border: "none", borderRadius: 8, cursor: "pointer",
                    background: difficulty === v ? color : C.dim,
                    color: difficulty === v ? "#fff" : C.muted,
                    fontWeight: 600, fontSize: 12, fontFamily: "inherit",
                  }}>{l}</button>
                ))}
              </div>
            </div>

            {quizError && (
              <div style={{ background: "#7f1d1d44", border: "1px solid #ef444444", borderRadius: 8, padding: "10px 14px", color: "#fca5a5", marginBottom: 12, fontSize: 13 }}>{quizError}</div>
            )}

            <button onClick={generateQuiz} disabled={quizLoading} style={{
              width: "100%", border: "none", borderRadius: 10, padding: "14px",
              color: "#fff", fontSize: 16, fontWeight: 800, cursor: quizLoading ? "not-allowed" : "pointer",
              background: quizLoading ? C.muted : `linear-gradient(135deg, ${color}, ${color}cc)`,
              fontFamily: "inherit", opacity: quizLoading ? 0.7 : 1,
            }}>
              {quizLoading ? "⏳ Questions ban rahe hain..." : "🚀 Quiz Shuru Karo!"}
            </button>
          </div>
        </div>
      </div>
    );

    // ── Step: Active Quiz (one question at a time) ───────────────────────────
    if (quizStep === "quiz" && quizQuestions.length > 0) {
      const q = quizQuestions[currentQIndex];
      const progress = ((currentQIndex + 1) / quizQuestions.length) * 100;
      const userAnswer = quizAnswers[currentQIndex];

      return (
        <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "16px 12px" : "24px 20px" }}>
          <div style={{ maxWidth: 600, margin: "0 auto" }}>
            {/* Progress bar */}
            <div style={{ height: 6, background: C.dim, borderRadius: 99, overflow: "hidden", marginBottom: 12 }}>
              <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg, ${color}, ${color}cc)`, borderRadius: 99, transition: "width 0.4s ease" }} />
            </div>

            {/* Meta row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ fontSize: 12, color: C.muted, background: C.dim, borderRadius: 6, padding: "3px 8px" }}>
                {icon} {quizSubject}{selectedChapter ? ` · Ch.${selectedChapter.num}` : ""}
              </span>
              <span style={{ fontSize: 13, fontWeight: 700, color: C.muted }}>{currentQIndex + 1} / {quizQuestions.length}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#22C55E" }}>✓ {liveScore}</span>
            </div>

            {/* Question */}
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 16px", marginBottom: 14 }}>
              <div style={{ fontSize: isMobile ? 14 : 15, fontWeight: 600, color: C.text, lineHeight: 1.6 }}>
                Q{currentQIndex + 1}. {q.question}
              </div>
            </div>

            {/* Options */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {q.options.map((opt, idx) => {
                let bg = C.card, border = C.border, txtColor = C.text;
                if (answered) {
                  if (idx === q.correct) { bg = "#052e1644"; border = "#22C55E"; txtColor = "#86efac"; }
                  else if (idx === userAnswer) { bg = "#450a0a44"; border = "#EF4444"; txtColor = "#fca5a5"; }
                }
                return (
                  <button key={idx} onClick={() => handleOptionSelect(idx)} disabled={answered} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    background: bg, border: `1.5px solid ${border}`,
                    borderRadius: 10, padding: "12px 14px",
                    cursor: answered ? "default" : "pointer",
                    textAlign: "left", fontFamily: "inherit", color: txtColor,
                    fontSize: isMobile ? 13 : 14, transition: "all 0.15s",
                  }}>
                    <span style={{
                      minWidth: 28, height: 28, borderRadius: 7, display: "flex",
                      alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12, flexShrink: 0,
                      background: answered && idx === q.correct ? "#22C55E" : answered && idx === userAnswer ? "#EF4444" : C.dim,
                      color: answered && (idx === q.correct || idx === userAnswer) ? "#fff" : C.muted,
                    }}>{["A","B","C","D"][idx]}</span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {answered && q.explanation && (
              <div style={{ marginTop: 12, padding: "12px 14px", background: "#052e1633", border: `1px solid ${userAnswer === q.correct ? "#22C55E44" : "#F59E0B44"}`, borderRadius: 10, fontSize: 13, color: "#86efac", lineHeight: 1.5 }}>
                <strong>{userAnswer === q.correct ? "✅ Sahi!" : "❌ Galat!"}</strong> {q.explanation}
              </div>
            )}

            {/* Next button */}
            {answered && (
              <button onClick={handleNext} style={{
                width: "100%", marginTop: 14, border: "none", borderRadius: 10, padding: "13px",
                color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer",
                background: `linear-gradient(135deg, ${color}, ${color}cc)`, fontFamily: "inherit",
              }}>
                {currentQIndex + 1 >= quizQuestions.length ? "📊 Results Dekho" : "Agla Sawaal →"}
              </button>
            )}
          </div>
        </div>
      );
    }

    // Fallback loading during quiz generation
    if (quizLoading) return (
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
        <div style={{ fontSize: 36 }}>⏳</div>
        <div style={{ color: C.muted, fontSize: 14 }}>AI questions bana raha hai...</div>
      </div>
    );

    return null;
  };

  // ════════════════════════════════════════════════════════════════════════════
  return (
    <div style={{ display: "flex", height: "100vh", background: C.bg, fontFamily: "'Segoe UI',system-ui,sans-serif", color: C.text, overflow: "hidden" }}>

      {isMobile && sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "#000a", zIndex: 40 }} />
      )}

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

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>

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
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {renderQuizView()}
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
