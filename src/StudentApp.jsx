import { useState, useEffect, useRef } from "react";
import {
  SUBJECTS, SYSTEM_PROMPT, callClaude, claudeJSON, detectWeakTopicsFromChat,
  saveQuizResult, saveDoubts, saveWeakTopics, updateStreak
} from "./firebase.js";
import { getChapters, CBSE_CURRICULUM } from "./curriculum.js";
import { C } from "./constants.js";
import { Card, ScoreBar, Badge, Btn } from "./ui.jsx";
import useIsMobile from "./useIsMobile.js";

const SUBJECT_ICONS = {
  Mathematics:"📐", Physics:"⚡", Chemistry:"🧪", Biology:"🔬",
  Science:"🔭", "Social Science":"🌍", English:"📖", Hindi:"✍️",
  Sanskrit:"🕉️", Accountancy:"📊", "Business Studies":"💼", Economics:"📈",
  History:"🏛️", Geography:"🗺️", "Political Science":"⚖️",
  "Computer Science":"💻", "Artificial Intelligence":"🤖",
  Sociology:"👥", Psychology:"🧠", "Legal Studies":"📜", "Physical Education":"🏃",
  default:"📚",
};

const SUBJECT_COLORS = {
  Mathematics:"#6366F1", Physics:"#F97316", Chemistry:"#10B981",
  Biology:"#22C55E", Science:"#10B981", "Social Science":"#F97316",
  English:"#3B82F6", Hindi:"#A855F7", Sanskrit:"#F59E0B",
  Accountancy:"#0EA5E9", "Business Studies":"#F43F5E", Economics:"#16A34A",
  History:"#E11D48", Geography:"#0D9488", "Political Science":"#7C3AED",
  "Computer Science":"#0284C7", "Artificial Intelligence":"#8B5CF6",
  Sociology:"#D97706", Psychology:"#EC4899", "Legal Studies":"#475569", "Physical Education":"#10B981",
  default:"#6366F1",
};

const getColor = (subject) => SUBJECT_COLORS[subject] || SUBJECT_COLORS.default;
const getIcon  = (subject) => SUBJECT_ICONS[subject]  || SUBJECT_ICONS.default;

export default function StudentApp({ user, onLogout }) {
  const isMobile = useIsMobile();
  const [view, setView] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getWelcomeMessage = () => ({
    role: "assistant",
    content: `Namaste ${user.name}! 👋 Main hoon tera Tuition Buddy!\nTu Class ${user.class} mein hai — toh main tumhare level ke hisaab se help karunga! 📚\nAsk me anything — doubt, homework help, ya quiz lena hai toh bol do! 🌟`
  });

  const chatStorageKey = `tb_chat_msgs_${user?.uid || "anon"}_c${user?.class || "0"}`;

  const [messages, setMessages] = useState(() => {
    try {
      if (typeof window !== "undefined" && window.sessionStorage) {
        const saved = window.sessionStorage.getItem(chatStorageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      }
    } catch (e) {
      console.warn("Failed to load chat messages from sessionStorage:", e);
    }
    return [getWelcomeMessage()];
  });
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatGenIdRef = useRef(0);
  const [streak, setStreak] = useState(user.streak || 1);
  const [weakTopics, setWeakTopics] = useState(user.weakTopics || []);

  const [quizStep, setQuizStep] = useState("subject"); 
  const [quizSubject, setQuizSubject] = useState(null);
  const [quizCourse, setQuizCourse] = useState(null);
  const [chapters, setChapters] = useState([]);        
  const [chaptersLoading, setChaptersLoading] = useState(false);
  const [chapterSearch, setChapterSearch] = useState("");
  const [selectedChapter, setSelectedChapter] = useState(null); 
  const [quizMode, setQuizMode] = useState("chapter");
  const [numQuestions, setNumQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState("medium");
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizError, setQuizError] = useState(null);
  const quizGenIdRef = useRef(0);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [liveScore, setLiveScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimedOut, setIsTimedOut] = useState(false);
  const finishTriggeredRef = useRef(false);
  const isTimedOutRef = useRef(false);

  const [mode, setMode] = useState("chat");
  const [quizHistory, setQuizHistory] = useState(user.quizHistory || []);
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [totalQ, setTotalQ] = useState(user.totalQuestions || 0);
  const [listening, setListening] = useState(false);
  const bottomRef = useRef(null);
  const isDemo = user.uid === "demo-student";

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && window.sessionStorage) {
        window.sessionStorage.setItem(chatStorageKey, JSON.stringify(messages));
      }
    } catch (e) {
      console.warn("Failed to save chat messages to sessionStorage:", e);
    }
  }, [messages, chatStorageKey]);
  useEffect(() => {
    if (!isDemo) {
      updateStreak(user.uid).then(s => setStreak(s));
    }
  }, [isDemo, user.uid]);

  const getSubjectsForClass = () => {
    const classData = CBSE_CURRICULUM[String(user.class)];
    if (!classData) return SUBJECTS;

    return Object.entries(classData)
      .filter(([, yearMap]) => {
        const yearData = yearMap["2026-27"];
        if (!yearData) return false;
        return Object.values(yearData).some(course => Array.isArray(course.chapters) && course.chapters.length > 0);
      })
      .map(([subject]) => subject);
  };
  const classSubjects = getSubjectsForClass();

  const getSubjectVariants = (subject) => {
    if (!subject) return [];
    const classData = CBSE_CURRICULUM[String(user.class)];
    const yearData = classData?.[subject]?.["2026-27"] || {};
    return Object.keys(yearData)
      .filter(k => Array.isArray(yearData[k]?.chapters) && yearData[k].chapters.length > 0)
      .map(k => ({
        key: k,
        label: k === "default" ? "Standard" : k === "standard" ? "Standard" : k === "basic" ? "Basic" : k === "applied" ? "Applied" : k,
        code: yearData[k].code || null,
        book: yearData[k].book || null,
        chaptersCount: yearData[k].chapters.length
      }));
  };

  const fetchChapters = async (subject, course) => {
    setChaptersLoading(true);
    setChapters([]);
    setQuizError(null);
    try {
      const result = getChapters(user.class, subject, course ? { course } : {});
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
    setChapterSearch("");
    setQuizMode("chapter");
    setQuizStep("chapter");
    const variants = getSubjectVariants(subject);
    const initialCourse = variants.length > 0 ? variants[0].key : null;
    setQuizCourse(initialCourse);
    fetchChapters(subject, initialCourse);
  };

  const handleCourseSelect = (courseKey) => {
    if (courseKey === quizCourse) return;
    setQuizCourse(courseKey);
    setSelectedChapter(null);
    setChapterSearch("");
    fetchChapters(quizSubject, courseKey);
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
    quizGenIdRef.current += 1;
    const currentGenId = quizGenIdRef.current;

    setQuizLoading(true);
    setQuizError(null);
    setQuizQuestions([]);
    setQuizAnswers({});
    setCurrentQIndex(0);
    setAnswered(false);
    setLiveScore(0);

    const resolveCurriculumChapter = (cls, sub, course, chObj) => {
      if (!cls || !sub || !chObj) return null;
      const classData = CBSE_CURRICULUM[String(cls)];
      if (!classData) return null;
      const subjectData = classData[sub];
      if (!subjectData) return null;
      const yearData = subjectData["2026-27"];
      if (!yearData) return null;

      let variantEntry = null;
      let resolvedCourse = course || null;
      if (course && yearData[course]) {
        variantEntry = yearData[course];
      } else if (yearData.default) {
        variantEntry = yearData.default;
        resolvedCourse = resolvedCourse || "default";
      } else if (yearData.standard) {
        variantEntry = yearData.standard;
        resolvedCourse = resolvedCourse || "standard";
      } else {
        const keys = Object.keys(yearData);
        if (keys.length > 0) {
          variantEntry = yearData[keys[0]];
          resolvedCourse = resolvedCourse || keys[0];
        }
      }
      if (!variantEntry || !Array.isArray(variantEntry.chapters)) return null;

      const targetNum = typeof chObj === "object" ? chObj.num : Number(chObj);
      const targetName = typeof chObj === "object" && chObj.name ? String(chObj.name).trim().toLowerCase() : null;

      let matched = null;
      if (targetNum !== undefined && targetNum !== null && !isNaN(targetNum)) {
        matched = variantEntry.chapters.find(c => Number(c.num) === Number(targetNum));
      }
      if (!matched && targetName) {
        matched = variantEntry.chapters.find(c => c.name && c.name.trim().toLowerCase() === targetName);
      }
      if (!matched) return null;

      return {
        num: matched.num,
        name: matched.name,
        type: matched.type || "chapter",
        book: matched.book || variantEntry.book || null,
        course: resolvedCourse,
        code: variantEntry.code || null,
        topics: Array.isArray(matched.topics) && matched.topics.length > 0 ? matched.topics : null
      };
    };

    const resolvedChapter = selectedChapter
      ? resolveCurriculumChapter(user.class, quizSubject, quizCourse, selectedChapter)
      : null;

    let curriculumContext = "";
    if (resolvedChapter) {
      const details = [
        `Class: ${user.class}`,
        `Subject: ${quizSubject}`,
        resolvedChapter.course ? `Course/Variant: ${resolvedChapter.course}` : null,
        resolvedChapter.code ? `Course Code: ${resolvedChapter.code}` : null,
        resolvedChapter.book ? `Prescribed Book: ${resolvedChapter.book}` : null,
        `${resolvedChapter.type === "unit" ? "Unit" : "Chapter"} Number: ${resolvedChapter.num}`,
        `${resolvedChapter.type === "unit" ? "Unit" : "Chapter"} Name: "${resolvedChapter.name}"`
      ].filter(Boolean).join("\n- ");

      // Sibling chapter boundaries from the already-loaded chapters for this subject/course
      const siblingChapters = Array.isArray(chapters)
        ? chapters.filter(c => Number(c.num) !== Number(resolvedChapter.num))
        : [];
      const siblingBoundaryText = siblingChapters.length > 0
        ? `\nChapter Boundary: Generate questions ONLY from Chapter ${resolvedChapter.num} ("${resolvedChapter.name}"). Do NOT include questions or concepts that belong to sibling chapters in this course (such as: ${siblingChapters.map(c => `Chapter ${c.num}: "${c.name}"`).join(", ")}).`
        : "";

      const prescribedBookText = resolvedChapter.book
        ? ` and the prescribed NCERT book "${resolvedChapter.book}"`
        : "";

      curriculumContext = `\nCurriculum Chapter Information:\n- ${details}
Syllabus & Source Constraints:
- Strictly stay within the selected CBSE 2026-27 curriculum chapter${prescribedBookText}.
- Prohibit any deleted, rationalised, or out-of-syllabus topics.
- Prohibit any content from other classes, higher-level syllabi, or advanced competitive exams.
- Generate questions strictly from the supplied curriculum chapter information. Do not use topics from other chapters, classes, or course variants.${siblingBoundaryText}`;

      if (resolvedChapter.topics && resolvedChapter.topics.length > 0) {
        const topicsList = resolvedChapter.topics.map(t => `  * ${t}`).join("\n");
        curriculumContext += `\nAllowed Topics for this chapter:\n${topicsList}\nCRITICAL: All questions must be based only on these supplied topics. Do not include questions from any out-of-scope or unlisted topics.`;
      }
    }

    const chapterScope = quizMode === "full"
      ? (chapters.length > 0
          ? `the complete CBSE 2026-27 curriculum for ${quizSubject} (Class ${user.class}) covering the following chapters:\n${chapters.map(c => `- Chapter ${c.num}: "${c.name}"`).join("\n")}`
          : `the complete CBSE 2026-27 curriculum for ${quizSubject} (Class ${user.class})`)
      : (resolvedChapter
          ? `Chapter ${resolvedChapter.num}: "${resolvedChapter.name}" from CBSE 2026-27 ${quizSubject} (Class ${user.class})`
          : `Chapter ${selectedChapter?.num || ""}: "${selectedChapter?.name || ""}" from CBSE 2026-27 ${quizSubject} (Class ${user.class})`);

    try {
      const questions = await claudeJSON(
        `Generate exactly ${numQuestions} MCQ questions based strictly on ${chapterScope}.${curriculumContext}
Difficulty: ${difficulty} (easy=basic recall, medium=concept understanding, hard=application/analysis).
Rules:
- Strictly test topics within the specified chapter scope.
- Each question has exactly 4 options
- Write all questions and options in ENGLISH only, EXCEPT for Hindi and Sanskrit subjects where use Hindi/Sanskrit
- CBSE board exam style

Return ONLY a raw JSON array:
[{"question":"...","options":["A text","B text","C text","D text"],"correct":0,"explanation":"..."}]
"correct" = 0-indexed position of correct answer. No extra text.`,
        "You are a CBSE exam expert. Return only valid raw JSON. No markdown, no backticks, no preamble."
      );
      // Only apply if this generation is still current and has not been cancelled/invalidated
      if (quizGenIdRef.current !== currentGenId) return;

      if (!Array.isArray(questions) || questions.length === 0) throw new Error("empty");

      // Validate each question has valid question, 4 string options, valid correct index, and explanation
      const validQuestions = questions.filter(item => {
        if (!item || typeof item !== "object") return false;
        const qText = item.question || item.q;
        if (typeof qText !== "string" || !qText.trim()) return false;
        if (!Array.isArray(item.options) || item.options.length !== 4) return false;
        const allOptionsStrings = item.options.every(opt => typeof opt === "string" && opt.trim().length > 0);
        if (!allOptionsStrings) return false;
        if (typeof item.correct !== "number" || item.correct < 0 || item.correct > 3) return false;
        if (typeof item.explanation !== "string") return false;
        return true;
      }).map(item => ({
        question: (item.question || item.q).trim(),
        options: item.options.map(opt => String(opt).trim()),
        correct: item.correct,
        explanation: item.explanation.trim()
      }));

      if (validQuestions.length === 0) throw new Error("invalid_questions");

      const secondsPerQuestion = difficulty === "easy" ? 45 : difficulty === "hard" ? 90 : 60;
      const initialTime = validQuestions.length * secondsPerQuestion;
      setTimeLeft(initialTime);
      finishTriggeredRef.current = false;
      isTimedOutRef.current = false;
      setIsTimedOut(false);

      setQuizQuestions(validQuestions);
      setQuizStep("quiz");
    } catch {
      if (quizGenIdRef.current === currentGenId) {
        setQuizError("Questions generate nahi hue. Dobara try karo!");
      }
    } finally {
      if (quizGenIdRef.current === currentGenId) {
        setQuizLoading(false);
      }
    }
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
    if (finishTriggeredRef.current) return;
    finishTriggeredRef.current = true;

    const total = quizQuestions.length;
    const pct = Math.round((liveScore / total) * 100);
    setQuizStep("result");

    const subjectLabel = quizMode === "full"
      ? quizSubject
      : `${quizSubject} Ch.${selectedChapter?.num || ""}`;
    const entry = {
      subject: subjectLabel,
      score: liveScore,
      total,
      pct,
      date: new Date().toISOString(),
      ...(user?.class ? { class: String(user.class) } : {})
    };
    setQuizHistory(h => [entry, ...h]);

    if (!isDemo) await saveQuizResult(user.uid, subjectLabel, liveScore, total, user.class);
    if (liveScore < Math.ceil(total * 0.6)) {
      const merged = [...new Set([...weakTopics, quizSubject])].slice(0, 5);
      setWeakTopics(merged);
      if (!isDemo) saveWeakTopics(user.uid, [quizSubject]);
    }
  };

  const finishQuizRef = useRef(finishQuiz);
  useEffect(() => {
    finishQuizRef.current = finishQuiz;
  });

  // ── Reset quiz state ─────────────────────────────────────────────────────────
  const resetQuiz = () => {
    finishTriggeredRef.current = false;
    isTimedOutRef.current = false;
    setIsTimedOut(false);
    setQuizStep("subject");
    setQuizSubject(null);
    setQuizCourse(null);
    setChapters([]);
    setChapterSearch("");
    setSelectedChapter(null);
    setQuizQuestions([]);
    setQuizAnswers({});
    setQuizError(null);
    setCurrentQIndex(0);
    setAnswered(false);
    setLiveScore(0);
  };

  useEffect(() => {
    if (quizStep !== "quiz") return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          isTimedOutRef.current = true;
          setIsTimedOut(true);
          finishQuizRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStep]);

  // ── CHAT SEND ────────────────────────────────────────────────────────────────
  const send = async (text, isRetry = false) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    if (!isRetry) setInput("");
    if (isMobile) setSidebarOpen(false);

    chatGenIdRef.current += 1;
    const currentChatGenId = chatGenIdRef.current;

    // If retrying, remove the trailing failed assistant error message if present so it replaces cleanly
    let baseMsgs = messages;
    if (isRetry && messages.length > 0 && messages[messages.length - 1].error) {
      baseMsgs = messages.slice(0, -1);
    }

    const newMsgs = isRetry ? baseMsgs : [...baseMsgs, { role: "user", content: msg }];
    setMessages(newMsgs);
    setLoading(true);
    try {
      let contextNote = `Student is in Class ${user.class}.`;
      if (quizSubject) {
        contextNote += ` Current subject focus: ${quizSubject}.`;
      }
      if (selectedChapter) {
        contextNote += ` Current chapter focus: Chapter ${selectedChapter.num} ("${selectedChapter.name}").`;
      }

      const sys = mode === "homework"
        ? `You are a homework helper. Guide the Class ${user.class} student step by step WITHOUT giving direct answers. Use leading questions. Hinglish/English supported. End with encouragement.\n\nContext: ${contextNote}`
        : `${SYSTEM_PROMPT(user.class)}\n\nContext: ${contextNote}\nIf the student asks a question related to this subject/chapter, keep your explanation tailored to it. If they ask a general doubt or a question from a different subject, answer it warmly and helpfully without forcing the chapter context.`;

      const reply = await callClaude(newMsgs.map(m => ({ role: m.role, content: m.content })), sys);

      if (chatGenIdRef.current !== currentChatGenId) return;

      // Check if callClaude returned default fallback error string
      const isKnownErrorReply = typeof reply === "string" && (
        reply.includes("Kuch problem ho gayi") ||
        reply.includes("Oops! Connection mein problem")
      );

      if (isKnownErrorReply) {
        const errorReply = "Abhi server se connect karne mein pareshani ho rahi hai. Kripya apna internet check karein aur thodi der mein dobara try karein! 🙏";
        setMessages([...newMsgs, { role: "assistant", content: errorReply, error: true, retryMsg: msg }]);
      } else {
        const finalMsgs = [...newMsgs, { role: "assistant", content: reply }];
        setMessages(finalMsgs);
        setTotalQ(prev => prev + 1);
        if (!isDemo) saveDoubts(user.uid, 1);
        if (finalMsgs.length >= 10 && finalMsgs.length % 10 === 0) {
          const topics = await detectWeakTopicsFromChat(finalMsgs);
          if (topics.length && chatGenIdRef.current === currentChatGenId) {
            const merged = [...new Set([...weakTopics, ...topics])].slice(0, 5);
            setWeakTopics(merged);
            if (!isDemo) saveWeakTopics(user.uid, topics);
          }
        }
      }
    } catch {
      if (chatGenIdRef.current === currentChatGenId) {
        setMessages([...newMsgs, {
          role: "assistant",
          content: "Oops! Network ya server connection mein dikkat aayi. Kripya thodi der baad dobara try karein! 🙏",
          error: true,
          retryMsg: msg
        }]);
      }
    } finally {
      if (chatGenIdRef.current === currentChatGenId) {
        setLoading(false);
      }
    }
  };

  const handleNewChat = () => {
    if (loading) return;
    if (messages.length > 2) {
      const ok = window.confirm("Nayi chat shuru karni hai? Purane messages clear ho jayenge.");
      if (!ok) return;
    }
    chatGenIdRef.current += 1;
    setMessages([getWelcomeMessage()]);
    setInput("");
    setLoading(false);
    setQuizSubject(null);
    setSelectedChapter(null);
    setQuizCourse(null);
  };

  const copyMessage = async (text, index) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
      }
      setCopiedIndex(index);
      setTimeout(() => {
        setCopiedIndex((prev) => (prev === index ? null : prev));
      }, 2000);
    } catch (e) {
      console.warn("Clipboard copy failed:", e);
    }
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

  const currentClassQuizHistory = quizHistory.filter(q => q.class && String(q.class) === String(user.class));
  const avgScore = currentClassQuizHistory.length ? Math.round(currentClassQuizHistory.reduce((a, q) => a + q.pct, 0) / currentClassQuizHistory.length) : 0;

  const goToChatWithPrompt = (promptText) => {
    setQuizSubject(null);
    setSelectedChapter(null);
    setQuizCourse(null);
    setView("chat");
    send(promptText);
  };

  const navItems = [
    { id: "home", icon: "🏠", label: "Home" },
    { id: "chat", icon: "💬", label: "Chat" },
    { id: "quiz", icon: "🧠", label: "Quiz" },
    { id: "progress", icon: "📊", label: "Progress" }
  ];
  const quickPrompts = [
    { l: "📐 Maths doubt", m: "Explain quadratic equations with examples for my level" },
    { l: "⚗️ Science", m: "Photosynthesis kya hota hai? Step by step explain karo" },
    { l: "📝 Essay help", m: "Help me write an essay outline on climate change" },
    { l: "🔢 Algebra", m: "How do I solve linear equations? Show me the method" },
  ];

  const renderSidebarContent = () => (
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
          <button key={n.id} onClick={() => {
            setView(n.id);
            if (n.id === "quiz") resetQuiz();
            if (n.id === "chat" || n.id === "home") {
              setQuizSubject(null);
              setSelectedChapter(null);
              setQuizCourse(null);
            }
            setSidebarOpen(false);
          }} style={{
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
    if (quizStep === "chapter") {
      const variants = getSubjectVariants(quizSubject);
      const activeVariant = variants.find(v => v.key === quizCourse) || (variants.length > 0 ? variants[0] : null);
      
      // Dynamic context line: e.g. "Class 10 • Mathematics • Standard (041)" or "Class 11 • History • 027"
      const contextParts = [`Class ${user.class}`, quizSubject];
      if (activeVariant) {
        if (variants.length > 1) {
          contextParts.push(activeVariant.code ? `${activeVariant.label} (${activeVariant.code})` : activeVariant.label);
        } else if (activeVariant.code) {
          contextParts.push(activeVariant.code);
        }
      }
      const contextString = contextParts.join(" • ");

      return (
      <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "16px 12px" : "24px 20px" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <button onClick={() => { setQuizStep("subject"); setSelectedChapter(null); setQuizCourse(null); setChapterSearch(""); }} style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 8, color: C.muted, padding: "4px 10px", cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>← Back</button>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 style={{ color, fontSize: 17, margin: 0, fontWeight: 800 }}>{icon} {quizSubject}</h2>
              <p style={{ color: C.muted, fontSize: 12, margin: 0 }}>Class {user.class} — Chapter choose karo</p>
            </div>
          </div>

          {/* Compact Dynamic Context Banner */}
          <div style={{
            background: `${color}14`,
            border: `1px solid ${color}33`,
            borderRadius: 10,
            padding: "8px 12px",
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 8
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: C.text }}>
              <span style={{ color }}>📌</span>
              <span>{contextString}</span>
            </div>
            {activeVariant?.book && (
              <span style={{ fontSize: 11, color: C.muted, background: C.card, padding: "2px 8px", borderRadius: 6, border: `1px solid ${C.border}` }}>
                📖 {activeVariant.book}
              </span>
            )}
          </div>

          {/* Error */}
          {quizError && (
            <div style={{ background: "#7f1d1d44", border: "1px solid #ef444444", borderRadius: 10, padding: "12px 16px", color: "#fca5a5", marginBottom: 12, fontSize: 13 }}>
              {quizError}
              <button onClick={() => fetchChapters(quizSubject, quizCourse)} style={{ marginLeft: 12, background: "none", border: "none", color: "#fca5a5", cursor: "pointer", textDecoration: "underline", fontFamily: "inherit", fontSize: 13 }}>Retry</button>
            </div>
          )}

          {/* Course Variant Selector (rendered only when subject has multiple active variants) */}
          {variants.length > 1 && (
            <div style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              padding: "12px 14px",
              marginBottom: 14
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>
                Course / Syllabus Variant
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {variants.map(v => {
                  const isSel = quizCourse === v.key;
                  return (
                    <button
                      key={v.key}
                      onClick={() => handleCourseSelect(v.key)}
                      style={{
                        padding: "6px 14px",
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: isSel ? 700 : 500,
                        border: `1.5px solid ${isSel ? color : C.border}`,
                        background: isSel ? `${color}22` : C.dim,
                        color: isSel ? color : C.text,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        transition: "all 0.15s ease",
                        boxShadow: isSel ? `0 0 0 2px ${color}33` : "none"
                      }}
                    >
                      <span>{v.label}</span>
                      {v.code && (
                        <span style={{
                          fontSize: 10,
                          padding: "1px 5px",
                          borderRadius: 4,
                          background: isSel ? `${color}44` : C.card,
                          color: isSel ? "#fff" : C.muted
                        }}>
                          {v.code}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Selection guidance / Selected indicator */}
          {!selectedChapter && quizMode !== "full" ? (
            <div style={{
              background: C.dim,
              border: `1px dashed ${C.border}`,
              borderRadius: 10,
              padding: "9px 12px",
              marginBottom: 12,
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 12,
              color: C.muted
            }}>
              <span>💡</span>
              <span>Ek chapter select karo ya Full Subject Test choose karo.</span>
            </div>
          ) : (
            <div style={{
              background: `${color}18`,
              border: `1px solid ${color}44`,
              borderRadius: 10,
              padding: "9px 12px",
              marginBottom: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
              fontSize: 12,
              fontWeight: 600,
              color: color
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                <span>✓ Selected:</span>
                <span style={{ color: C.text }}>
                  {quizMode === "full" ? "⚡ Full Subject Test" : `📖 Ch.${selectedChapter?.num}: ${selectedChapter?.name}`}
                </span>
              </div>
              <span style={{ fontSize: 11, color: C.muted, flexShrink: 0 }}>Neeche 'Aage Badho' dabayein</span>
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
              <div style={{ fontSize: 13 }}>Chapters load ho rahe hain...</div>
            </div>
          )}

          {/* Chapter Search (shown only when chapters.length >= 6) */}
          {!chaptersLoading && chapters.length >= 6 && (
            <div style={{
              position: "relative",
              marginBottom: 10,
              display: "flex",
              alignItems: "center"
            }}>
              <span style={{
                position: "absolute",
                left: 12,
                fontSize: 14,
                color: C.muted,
                pointerEvents: "none"
              }}>
                🔍
              </span>
              <input
                type="text"
                value={chapterSearch}
                onChange={e => setChapterSearch(e.target.value)}
                placeholder="Search chapter name or number..."
                style={{
                  width: "100%",
                  background: C.card,
                  border: `1px solid ${C.border}`,
                  borderRadius: 10,
                  padding: "10px 36px 10px 36px",
                  fontSize: 14,
                  color: C.text,
                  outline: "none",
                  fontFamily: "inherit",
                  boxSizing: "border-box"
                }}
                onFocus={e => e.target.style.borderColor = color}
                onBlur={e => e.target.style.borderColor = C.border}
              />
              {chapterSearch && (
                <button
                  type="button"
                  onClick={() => setChapterSearch("")}
                  style={{
                    position: "absolute",
                    right: 10,
                    background: C.dim,
                    border: "none",
                    borderRadius: "50%",
                    width: 20,
                    height: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: C.muted,
                    fontSize: 11,
                    cursor: "pointer",
                    padding: 0
                  }}
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          )}

          {/* Chapter list / Filtered results */}
          {!chaptersLoading && chapters.length > 0 && (() => {
            const query = chapterSearch.trim().toLowerCase();
            const filteredChapters = query
              ? chapters.filter(ch => String(ch.num).includes(query) || ch.name.toLowerCase().includes(query))
              : chapters;

            if (filteredChapters.length === 0) {
              return (
                <div style={{
                  background: C.card,
                  border: `1px dashed ${C.border}`,
                  borderRadius: 10,
                  padding: "20px 16px",
                  textAlign: "center",
                  margin: "6px 0"
                }}>
                  <div style={{ fontSize: 13, color: C.muted, marginBottom: 10, lineHeight: 1.5 }}>
                    Koi chapter nahi mila &ldquo;<strong>{chapterSearch}</strong>&rdquo; ke liye.
                  </div>
                  <button
                    type="button"
                    onClick={() => setChapterSearch("")}
                    style={{
                      background: C.dim,
                      border: `1px solid ${C.border}`,
                      borderRadius: 8,
                      padding: "6px 14px",
                      color: color,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4
                    }}
                  >
                    <span>✕</span>
                    <span>Clear Search</span>
                  </button>
                </div>
              );
            }

            return (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {filteredChapters.map(ch => {
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
            );
          })()}

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
    }

    // ── Step: Settings ───────────────────────────────────────────────────────
    if (quizStep === "settings") {
      const handleBackFromSettings = () => {
        if (quizLoading) {
          quizGenIdRef.current += 1;
          setQuizLoading(false);
          setQuizError(null);
        }
        setQuizStep("chapter");
      };

      const handleCancelGeneration = () => {
        quizGenIdRef.current += 1;
        setQuizLoading(false);
        setQuizError(null);
      };

      return (
      <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "16px 12px" : "24px 20px" }}>
        <div style={{ maxWidth: 500, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <button onClick={handleBackFromSettings} style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 8, color: C.muted, padding: "4px 10px", cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>← Back</button>
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

            {/* In-flight feedback & Cancel action */}
            {quizLoading && (
              <div style={{ marginTop: 12, textAlign: "center" }}>
                <div style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>
                  Questions ban rahe hain... Yeh kuch seconds le sakta hai. ⏳
                </div>
                <button
                  type="button"
                  onClick={handleCancelGeneration}
                  style={{
                    background: "none",
                    border: `1px solid ${C.border}`,
                    borderRadius: 8,
                    padding: "6px 14px",
                    color: C.muted,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "inherit"
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      );
    }

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
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.muted }}>{currentQIndex + 1} / {quizQuestions.length}</span>
                <span style={{
                  fontSize: 12,
                  fontWeight: 700,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "3px 8px",
                  borderRadius: 6,
                  background: timeLeft <= 30 ? "#ef444422" : C.dim,
                  color: timeLeft <= 30 ? "#ef4444" : C.muted,
                  border: `1px solid ${timeLeft <= 30 ? "#ef444455" : C.border}`,
                  transition: "all 0.2s ease"
                }}>
                  <span>⏱️</span>
                  <span>
                    {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:{String(timeLeft % 60).padStart(2, "0")}
                  </span>
                </span>
              </div>
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

    // ── Step: Result Screen ──────────────────────────────────────────────────
    if (quizStep === "result") {
      const total = quizQuestions.length;
      const pct = total > 0 ? Math.round((liveScore / total) * 100) : 0;
      const celebrationIcon = pct >= 80 ? "🏆" : pct >= 60 ? "💪" : "📖";
      const feedbackText = pct >= 80
        ? "Ekdum zabardast! Bahut badhiya performance! 🔥"
        : pct >= 60
        ? "Achha hua! Thoda aur practice karoge toh full marks pakka! 💪"
        : "Koi baat nahi, practice se sab aata hai! Weak areas pe dhyan do 📖";

      const subjectLabel = quizMode === "full"
        ? quizSubject
        : `${quizSubject} Ch.${selectedChapter?.num || ""}`;
      const chapterDisplay = quizMode === "full"
        ? "⚡ Full Subject Test"
        : `📖 Ch.${selectedChapter?.num}: ${selectedChapter?.name}`;

      const handleDiscussInChat = () => {
        const assistantMsg = `Quiz result: ${liveScore}/${total} on ${subjectLabel} (${pct}%). ${pct >= 80 ? "Ekdum zabardast! 🔥" : pct >= 60 ? "Achha hua! Thoda aur practice kar 💪" : "Koi baat nahi, practice se sab aata hai! Weak areas pe dhyan do 📖"}`;
        resetQuiz();
        setMessages(m => [...m, {
          role: "assistant",
          content: assistantMsg
        }]);
        setView("chat");
      };

      const handleTakeAnotherQuiz = () => {
        resetQuiz();
      };

      const handleGoHome = () => {
        resetQuiz();
        setView("home");
      };

      return (
        <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "20px 14px" : "32px 20px" }}>
          <div style={{ maxWidth: 520, margin: "0 auto" }}>
            <div style={{
              background: C.card,
              border: `1.5px solid ${color}44`,
              borderRadius: 16,
              padding: isMobile ? "24px 16px" : "30px 24px",
              textAlign: "center",
              boxShadow: `0 8px 30px ${color}15`
            }}>
              {/* Badge */}
              <div style={{
                display: "inline-block",
                padding: "4px 12px",
                borderRadius: 20,
                background: `${color}18`,
                color: color,
                fontSize: 12,
                fontWeight: 700,
                marginBottom: 14
              }}>
                {icon} {quizSubject}
              </div>

              {/* Title / Chapter */}
              <h2 style={{ fontSize: isMobile ? 18 : 20, color: C.text, margin: "0 0 6px", fontWeight: 800 }}>
                Quiz Complete!
              </h2>
              <div style={{ fontSize: 13, color: C.muted, marginBottom: isTimedOut ? 14 : 20 }}>
                {chapterDisplay}
              </div>

              {/* Timeout Notice */}
              {isTimedOut && (
                <div style={{
                  background: "#ef44441a",
                  border: "1px solid #ef444444",
                  borderRadius: 12,
                  padding: "10px 14px",
                  margin: "0 auto 16px",
                  maxWidth: 360,
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                  textAlign: "center"
                }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#ef4444" }}>
                    ⏱️ Samay Samapt! (Time&apos;s Up)
                  </div>
                  <div style={{ fontSize: 12, color: C.muted }}>
                    Time khatam hone se pehle {Object.keys(quizAnswers).length} / {total} sawaal answer kiye
                  </div>
                </div>
              )}

              {/* Celebration Icon */}
              <div style={{ fontSize: 52, margin: "10px 0" }}>
                {celebrationIcon}
              </div>

              {/* Score Readout */}
              <div style={{ margin: "12px 0 6px" }}>
                <span style={{ fontSize: isMobile ? 38 : 44, fontWeight: 900, color }}>
                  {liveScore}
                </span>
                <span style={{ fontSize: isMobile ? 22 : 26, fontWeight: 700, color: C.muted }}>
                  {" "}/ {total}
                </span>
              </div>

              <div style={{ fontSize: 15, fontWeight: 700, color: pct >= 60 ? "#22C55E" : "#F59E0B", marginBottom: 16 }}>
                {pct}% Accuracy
              </div>

              {/* Accuracy / Progress Bar */}
              <div style={{ height: 8, background: C.dim, borderRadius: 99, overflow: "hidden", maxWidth: 320, margin: "0 auto 20px" }}>
                <div style={{
                  height: "100%",
                  width: `${pct}%`,
                  background: pct >= 80 ? "linear-gradient(90deg, #22C55E, #10B981)" : pct >= 60 ? "linear-gradient(90deg, #F59E0B, #EAB308)" : "linear-gradient(90deg, #EF4444, #F97316)",
                  borderRadius: 99,
                  transition: "width 0.8s ease"
                }} />
              </div>

              {/* Encouraging Feedback */}
              <p style={{
                fontSize: 14,
                color: C.text,
                lineHeight: 1.5,
                background: C.dim,
                padding: "12px 16px",
                borderRadius: 12,
                margin: "0 0 24px"
              }}>
                {feedbackText}
              </p>

              {/* Three Actions */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <button
                  type="button"
                  onClick={handleDiscussInChat}
                  style={{
                    width: "100%",
                    border: "none",
                    borderRadius: 12,
                    padding: "13px 16px",
                    color: "#fff",
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: "pointer",
                    background: `linear-gradient(135deg, ${color}, ${color}dd)`,
                    fontFamily: "inherit",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8
                  }}
                >
                  <span>💬</span>
                  <span>Chat mein Discuss Karo</span>
                </button>

                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    type="button"
                    onClick={handleTakeAnotherQuiz}
                    style={{
                      flex: 1,
                      border: `1.5px solid ${C.border}`,
                      borderRadius: 12,
                      padding: "12px 14px",
                      background: C.dim,
                      color: C.text,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6
                    }}
                  >
                    <span>🔄</span>
                    <span>Doosra Quiz Do</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleGoHome}
                    style={{
                      flex: 1,
                      border: `1.5px solid ${C.border}`,
                      borderRadius: 12,
                      padding: "12px 14px",
                      background: C.dim,
                      color: C.text,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6
                    }}
                  >
                    <span>🏠</span>
                    <span>Home / Study Hub</span>
                  </button>
                </div>
              </div>
            </div>
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

  // ── HOME / STUDY HUB VIEW ───────────────────────────────────────────────────
  const renderHomeView = () => {
    const lastQuiz = quizHistory.length > 0 ? quizHistory[0] : null;

    const goToChatClean = () => {
      setQuizSubject(null);
      setSelectedChapter(null);
      setQuizCourse(null);
      setView("chat");
    };

    const goToQuizClean = () => {
      resetQuiz();
      setView("quiz");
    };

    return (
      <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "16px 12px" : "24px 20px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>

          {/* 1. Header & Greeting Card */}
          <Card style={{
            background: `linear-gradient(135deg, ${C.card}, ${C.dim})`,
            border: `1px solid ${C.border}`,
            position: "relative",
            overflow: "hidden"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
              <div>
                <h1 style={{ fontSize: isMobile ? 20 : 24, fontWeight: 800, margin: "0 0 6px", color: C.text }}>
                  Namaste, {user.name}! 👋
                </h1>
                <p style={{ margin: 0, fontSize: 13, color: C.muted }}>
                  Class {user.class} • Ready to learn today?
                </p>
              </div>
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: `${C.gold}1a`,
                border: `1px solid ${C.gold}44`,
                borderRadius: 99,
                padding: "6px 14px",
                color: C.gold,
                fontWeight: 700,
                fontSize: 13,
                boxShadow: `0 2px 8px ${C.gold}15`
              }}>
                <span>🔥 {streak} Day Streak</span>
              </div>
            </div>
          </Card>

          {/* 2. Quick Actions Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: 12
          }}>
            {/* Ask a Doubt */}
            <div
              onClick={goToChatClean}
              style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 14,
                padding: "18px 20px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 16,
                transition: "all 0.15s ease",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = C.accent;
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = C.border;
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: `linear-gradient(135deg, ${C.accent}22, ${C.accentSoft || "#4f46e5"}33)`,
                border: `1px solid ${C.accent}44`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                flexShrink: 0
              }}>
                🤖
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: 16, color: C.text, marginBottom: 2 }}>
                  Ask a Doubt
                </div>
                <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.4 }}>
                  Instant CBSE tutor for any question
                </div>
              </div>
              <span style={{ color: C.accent, fontSize: 18, fontWeight: 700 }}>→</span>
            </div>

            {/* Take a Quiz */}
            <div
              onClick={goToQuizClean}
              style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 14,
                padding: "18px 20px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 16,
                transition: "all 0.15s ease",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = C.purple;
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = C.border;
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: `${C.purple}22`,
                border: `1px solid ${C.purple}44`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                flexShrink: 0
              }}>
                🧠
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: 16, color: C.text, marginBottom: 2 }}>
                  Take a Quiz
                </div>
                <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.4 }}>
                  Test concepts & earn streak
                </div>
              </div>
              <span style={{ color: C.purple, fontSize: 18, fontWeight: 700 }}>→</span>
            </div>
          </div>

          {/* 3. Continue Studying Card */}
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: C.text, display: "flex", alignItems: "center", gap: 6 }}>
                <span>📚</span> Continue Studying
              </div>
            </div>

            {lastQuiz ? (
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 12,
                background: C.dim,
                padding: "12px 14px",
                borderRadius: 10,
                border: `1px solid ${C.border}`
              }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 11, color: C.muted, marginBottom: 2, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    Last Practiced
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>
                    {lastQuiz.subject}
                  </div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
                    Previous Score: <strong style={{ color: lastQuiz.pct >= 70 ? C.green : lastQuiz.pct >= 50 ? C.gold : C.red }}>{lastQuiz.score}/{lastQuiz.total} ({lastQuiz.pct}%)</strong>
                  </div>
                </div>
                <Btn
                  small
                  variant="primary"
                  onClick={() => goToChatWithPrompt(`Help me revise ${lastQuiz.subject} for Class ${user.class}`)}
                >
                  Revise Now
                </Btn>
              </div>
            ) : (
              <div>
                <p style={{ margin: "0 0 10px", fontSize: 13, color: C.muted }}>
                  Start your study journey! Choose an active subject to begin:
                </p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {classSubjects.slice(0, 4).map(sub => (
                    <button
                      key={sub}
                      onClick={() => goToChatWithPrompt(`Help me with ${sub} for Class ${user.class}`)}
                      style={{
                        padding: "6px 12px",
                        background: C.dim,
                        border: `1px solid ${getColor(sub)}44`,
                        borderRadius: 8,
                        color: getColor(sub),
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        display: "flex",
                        alignItems: "center",
                        gap: 6
                      }}
                    >
                      <span>{getIcon(sub)}</span>
                      <span>{sub}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* 4. Weak Topics / Revision Card */}
          <Card>
            <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 14, color: C.purple, display: "flex", alignItems: "center", gap: 6 }}>
              <span>🎯</span> Focus Areas & Weak Topics
            </div>

            {weakTopics.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {weakTopics.map((topic, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 10,
                      background: C.dim,
                      padding: "8px 12px",
                      borderRadius: 10,
                      border: `1px solid ${C.border}`
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                      <Badge color={[C.gold, C.red, C.purple, C.accent, C.green][i % 5]}>
                        Focus
                      </Badge>
                      <span style={{ fontSize: 13, fontWeight: 600, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {topic}
                      </span>
                    </div>
                    <Btn
                      small
                      variant="primary"
                      onClick={() => goToChatWithPrompt("Please help me understand and revise: " + topic)}
                      style={{ flexShrink: 0 }}
                    >
                      Revise
                    </Btn>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: 13, color: C.muted, padding: "4px 0", lineHeight: 1.5 }}>
                ✨ All caught up! Solve quizzes or ask doubts to identify areas to focus on.
              </div>
            )}
          </Card>

          {/* 5. Performance Snapshot */}
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: C.text, display: "flex", alignItems: "center", gap: 6 }}>
                <span>📊</span> Performance Snapshot
              </div>
              <button
                onClick={() => setView("progress")}
                style={{
                  background: "none",
                  border: "none",
                  color: C.accent,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  padding: 0
                }}
              >
                View full report →
              </button>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr 1fr 1fr" : "repeat(3, 1fr)",
              gap: 8
            }}>
              <div style={{
                background: C.dim,
                border: `1px solid ${C.border}`,
                borderRadius: 10,
                padding: "12px 8px",
                textAlign: "center"
              }}>
                <div style={{ fontSize: 10, color: C.muted, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Quizzes
                </div>
                <div style={{ fontSize: isMobile ? 18 : 22, fontWeight: 800, color: C.accent }}>
                  {currentClassQuizHistory.length}
                </div>
              </div>

              <div style={{
                background: C.dim,
                border: `1px solid ${C.border}`,
                borderRadius: 10,
                padding: "12px 8px",
                textAlign: "center"
              }}>
                <div style={{ fontSize: 10, color: C.muted, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Avg Score
                </div>
                <div style={{ fontSize: isMobile ? 18 : 22, fontWeight: 800, color: avgScore >= 70 ? C.green : C.gold }}>
                  {avgScore}%
                </div>
              </div>

              <div style={{
                background: C.dim,
                border: `1px solid ${C.border}`,
                borderRadius: 10,
                padding: "12px 8px",
                textAlign: "center"
              }}>
                <div style={{ fontSize: 10, color: C.muted, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Questions
                </div>
                <div style={{ fontSize: isMobile ? 18 : 22, fontWeight: 800, color: C.purple }}>
                  {totalQ}
                </div>
              </div>
            </div>
          </Card>

        </div>
      </div>
    );
  };

  // ════════════════════════════════════════════════════════════════════════════
  return (
    <div style={{ display: "flex", height: "100vh", background: C.bg, fontFamily: "'Segoe UI',system-ui,sans-serif", color: C.text, overflow: "hidden" }}>

      {isMobile && sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "#000a", zIndex: 40 }} />
      )}

      {!isMobile ? (
        <div style={{ width: 220, background: C.card, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", flexShrink: 0 }}>
          {renderSidebarContent()}
        </div>
      ) : (
        <div style={{
          position: "fixed", top: 0, left: 0, width: 260, height: "100vh",
          background: C.card, borderRight: `1px solid ${C.border}`,
          display: "flex", flexDirection: "column", zIndex: 50,
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.25s ease"
        }}>
          {renderSidebarContent()}
        </div>
      )}

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>

        {isMobile && (
          <div style={{ padding: "10px 16px", borderBottom: `1px solid ${C.border}`, background: C.card + "dd", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <button onClick={() => setSidebarOpen(true)} style={{ background: "none", border: "none", color: C.text, fontSize: 22, cursor: "pointer", padding: 0 }}>☰</button>
            <span style={{ fontWeight: 700, fontSize: 15, flex: 1 }}>
              {view === "home" ? "🏠 Study Hub" : view === "chat" ? (mode === "homework" ? "📝 Homework Help" : "💬 Ask Doubts") : view === "quiz" ? "🧠 Quiz" : "📊 Progress"}
            </span>
            <span style={{ fontSize: 13, color: C.gold }}>🔥 {streak}d</span>
          </div>
        )}

        {/* ── HOME VIEW ── */}
        {view === "home" && renderHomeView()}

        {/* ── CHAT VIEW ── */}
        {view === "chat" && (<>
          <div style={{
            padding: isMobile ? "8px 12px" : "10px 20px",
            borderBottom: `1px solid ${C.border}`,
            background: C.card + "bb",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: isMobile ? "wrap" : "nowrap",
            gap: 10,
            flexShrink: 0
          }}>
            {/* 1. PROMINENT CHAT MODE SWITCHER & NEW CHAT BUTTON */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              maxWidth: isMobile ? "100%" : "auto"
            }}>
              <div style={{
                display: "inline-flex",
                background: C.dim,
                padding: 3,
                borderRadius: 10,
                border: `1px solid ${C.border}`
              }}>
                {[
                  { id: "chat", l: "💬 Ask Doubts" },
                  { id: "homework", l: "📝 Homework Help" }
                ].map(m => {
                  const isActive = mode === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setMode(m.id)}
                      style={{
                        border: "none",
                        outline: "none",
                        background: isActive ? `linear-gradient(135deg,${C.accent},${C.accentSoft || "#4f46e5"})` : "transparent",
                        color: isActive ? "#fff" : C.muted,
                        padding: isMobile ? "6px 12px" : "6px 14px",
                        borderRadius: 8,
                        fontSize: isMobile ? 12 : 13,
                        fontWeight: isActive ? 700 : 500,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        transition: "all 0.15s ease",
                        boxShadow: isActive ? "0 2px 6px rgba(0,0,0,0.2)" : "none",
                        whiteSpace: "nowrap"
                      }}
                    >
                      {m.l}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={handleNewChat}
                disabled={loading}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  padding: isMobile ? "6px 10px" : "6px 12px",
                  background: C.dim,
                  border: `1px solid ${C.border}`,
                  borderRadius: 10,
                  color: loading ? C.muted : C.text,
                  fontSize: isMobile ? 12 : 13,
                  fontWeight: 600,
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.6 : 1,
                  fontFamily: "inherit",
                  whiteSpace: "nowrap",
                  transition: "all 0.15s ease"
                }}
                title={loading ? "AI reply generate ho raha hai..." : "Nayi chat shuru karo"}
              >
                <span>✨</span>
                <span>Nayi Chat</span>
              </button>
            </div>

            {/* 2. ACTIVE CHAT CONTEXT CHIP & DYNAMIC SUBJECT QUICK-CHIPS */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              overflowX: "auto",
              maxWidth: isMobile ? "100%" : "65%",
              paddingBottom: isMobile ? 2 : 0
            }}>
              {/* Active Subject / Chapter Context Chip */}
              {(quizSubject || selectedChapter) && (
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "4px 10px",
                  borderRadius: 99,
                  background: `${C.accent}22`,
                  border: `1px solid ${C.accent}55`,
                  color: C.accent,
                  fontSize: 12,
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  flexShrink: 0
                }}>
                  <span>🎯</span>
                  <span>
                    {selectedChapter
                      ? `${quizSubject} · Ch. ${selectedChapter.num} · ${selectedChapter.name}`
                      : quizSubject}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setQuizSubject(null);
                      setSelectedChapter(null);
                      setQuizCourse(null);
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: C.accent,
                      cursor: "pointer",
                      padding: 0,
                      marginLeft: 2,
                      fontSize: 13,
                      fontWeight: 700,
                      lineHeight: 1,
                      display: "flex",
                      alignItems: "center"
                    }}
                    title="Clear focus (return to general doubt)"
                  >
                    ✕
                  </button>
                </div>
              )}

              {classSubjects.slice(0, 4).map(s => (
                <button
                  key={s}
                  onClick={() => send(`Help me with ${s} for Class ${user.class}`)}
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "4px 10px",
                    borderRadius: 99,
                    background: C.dim,
                    color: C.muted,
                    border: `1px solid ${C.border}`,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    transition: "all 0.15s ease",
                    fontFamily: "inherit",
                    flexShrink: 0
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = C.accent;
                    e.currentTarget.style.color = C.text;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = C.border;
                    e.currentTarget.style.color = C.muted;
                  }}
                >
                  <span>📌</span>
                  <span>{s}</span>
                </button>
              ))}
            </div>
          </div>

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
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", width: "100%" }}>
                    {m.role === "assistant" && (
                      <div style={{ width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg,${C.accent},${C.purple})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, marginRight: 8, flexShrink: 0, marginTop: 2 }}>🎓</div>
                    )}
                    <div style={{
                      maxWidth: isMobile ? "85%" : "76%", padding: "10px 14px",
                      borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                      background: m.role === "user" ? `linear-gradient(135deg,${C.accent},${C.accentSoft || "#4f46e5"})` : (m.error ? "#7f1d1d22" : C.card),
                      border: m.error ? "1px solid #ef444455" : (m.role === "assistant" ? `1px solid ${C.border}` : "none"),
                      fontSize: isMobile ? 13 : 14, lineHeight: 1.65, whiteSpace: "pre-wrap", color: m.error ? "#fca5a5" : C.text
                    }}>
                      {m.content}
                    </div>
                  </div>
                  {/* Inline Copy Button for Normal Assistant Messages */}
                  {m.role === "assistant" && !m.error && i > 0 && (
                    <div style={{ marginLeft: 38, marginTop: 4, display: "flex", flexDirection: "column", gap: 6 }}>
                      <div>
                        <button
                          type="button"
                          onClick={() => copyMessage(m.content, i)}
                          style={{
                            background: "none",
                            border: `1px solid ${C.border}`,
                            borderRadius: 6,
                            padding: "3px 8px",
                            color: copiedIndex === i ? "#22C55E" : C.muted,
                            fontSize: 11,
                            fontWeight: 600,
                            cursor: "pointer",
                            fontFamily: "inherit",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            transition: "all 0.15s ease"
                          }}
                          title="Copy message to clipboard"
                        >
                          <span>{copiedIndex === i ? "✓" : "📋"}</span>
                          <span>{copiedIndex === i ? "Copied!" : "Copy"}</span>
                        </button>
                      </div>

                      {/* Follow-up suggestions ONLY on latest normal assistant response */}
                      {i === messages.length - 1 && !loading && (
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          flexWrap: "wrap",
                          marginTop: 2
                        }}>
                          {[
                            { label: "💡 Example do", prompt: "Iska ek simple real-life example dekar samjhao" },
                            { label: "🧠 Aasan bhasha mein", prompt: "Isko aur simple aur aasan bhasha mein samjhao" },
                            { label: "✍️ Practice question", prompt: "Is topic pe ek practice question do taaki main test kar sakoon" }
                          ].map(f => (
                            <button
                              key={f.label}
                              type="button"
                              onClick={() => send(f.prompt)}
                              style={{
                                background: C.dim,
                                border: `1px solid ${C.border}`,
                                borderRadius: 99,
                                padding: "4px 10px",
                                color: C.text,
                                fontSize: 11,
                                fontWeight: 500,
                                cursor: "pointer",
                                fontFamily: "inherit",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 4,
                                transition: "all 0.15s ease",
                                whiteSpace: "nowrap"
                              }}
                              onMouseEnter={e => {
                                e.currentTarget.style.borderColor = C.accent;
                                e.currentTarget.style.color = C.accent;
                              }}
                              onMouseLeave={e => {
                                e.currentTarget.style.borderColor = C.border;
                                e.currentTarget.style.color = C.text;
                              }}
                            >
                              {f.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Inline Retry Button for Failed Assistant Messages */}
                  {m.role === "assistant" && m.error && m.retryMsg && (
                    <div style={{ marginLeft: 38, marginTop: 6 }}>
                      <button
                        type="button"
                        onClick={() => send(m.retryMsg, true)}
                        disabled={loading}
                        style={{
                          background: C.dim,
                          border: `1px solid ${C.border}`,
                          borderRadius: 8,
                          padding: "4px 10px",
                          color: loading ? C.muted : C.accent,
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: loading ? "not-allowed" : "pointer",
                          fontFamily: "inherit",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          opacity: loading ? 0.6 : 1
                        }}
                      >
                        <span>🔄</span>
                        <span>Dobara try karo</span>
                      </button>
                    </div>
                  )}
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
                  { label: "Quizzes", val: currentClassQuizHistory.length, color: C.accent },
                  { label: "Avg Score", val: `${avgScore}%`, color: avgScore >= 70 ? C.green : C.gold },
                  { label: "Questions", val: totalQ, color: C.purple },
                ].map((s, i) => (
                  <Card key={i} style={{ textAlign: "center", padding: "12px 8px" }}>
                    <div style={{ fontSize: 10, color: C.muted, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>{s.label}</div>
                    <div style={{ fontSize: isMobile ? 18 : 22, fontWeight: 800, color: s.color }}>{s.val}</div>
                  </Card>
                ))}
              </div>

              {/* ── SUBJECT MASTERY CARD ── */}
              {(() => {
                // Group currentClassQuizHistory by subject
                const subjectMap = {};
                currentClassQuizHistory.forEach(q => {
                  const s = q.subject || "General";
                  if (!subjectMap[s]) {
                    subjectMap[s] = { totalPct: 0, count: 0, firstIndex: currentClassQuizHistory.indexOf(q) };
                  }
                  subjectMap[s].totalPct += (typeof q.pct === "number" ? q.pct : 0);
                  subjectMap[s].count += 1;
                });

                const subjectList = Object.keys(subjectMap).map(subject => ({
                  subject,
                  count: subjectMap[subject].count,
                  avgPct: Math.round(subjectMap[subject].totalPct / subjectMap[subject].count),
                  firstIndex: subjectMap[subject].firstIndex
                })).sort((a, b) => {
                  if (b.count !== a.count) return b.count - a.count;
                  return a.firstIndex - b.firstIndex;
                });

                return (
                  <Card style={{ marginBottom: 14 }}>
                    <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 14, color: C.accent }}>
                      📚 Subject Mastery
                    </div>
                    {subjectList.length === 0 ? (
                      <div style={{ fontSize: 13, color: C.muted, padding: "4px 0" }}>
                        Abhi tak koi quiz nahi li hai. Pehli quiz lekar apni subject mastery start karo! 🚀
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {subjectList.map(item => {
                          const icon = getIcon(item.subject);
                          const color = item.avgPct >= 70 ? C.green : item.avgPct >= 50 ? C.gold : C.red;
                          return (
                            <div key={item.subject} style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: 12,
                              flexWrap: isMobile ? "wrap" : "nowrap"
                            }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, flex: 1 }}>
                                <div style={{
                                  width: 32,
                                  height: 32,
                                  borderRadius: 8,
                                  background: `${getColor(item.subject)}22`,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: 16,
                                  flexShrink: 0
                                }}>
                                  {icon}
                                </div>
                                <div style={{ minWidth: 0 }}>
                                  <div style={{ fontSize: 13, fontWeight: 700, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {item.subject}
                                  </div>
                                  <div style={{ fontSize: 11, color: C.muted }}>
                                    {item.count} {item.count === 1 ? "quiz" : "quizzes"}
                                  </div>
                                </div>
                              </div>

                              <div style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                width: isMobile ? "100%" : 210,
                                justifyContent: "flex-end"
                              }}>
                                <div style={{ width: isMobile ? "calc(100% - 85px)" : 120 }}>
                                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                                    <span style={{ fontSize: 11, color: C.muted }}>Mastery</span>
                                    <span style={{ fontSize: 12, fontWeight: 700, color }}>{item.avgPct}%</span>
                                  </div>
                                  <ScoreBar pct={item.avgPct} color={color} />
                                </div>

                                <button
                                  type="button"
                                  onClick={() => goToChatWithPrompt(`Mujhe ${item.subject} revise karna hai. Important concepts samjhao aur practice ke liye guide karo.`)}
                                  style={{
                                    background: C.dim,
                                    border: `1px solid ${C.border}`,
                                    borderRadius: 8,
                                    padding: "4px 8px",
                                    color: C.accent,
                                    fontSize: 11,
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    fontFamily: "inherit",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 4,
                                    whiteSpace: "nowrap",
                                    transition: "all 0.15s ease",
                                    flexShrink: 0
                                  }}
                                  onMouseEnter={e => {
                                    e.currentTarget.style.borderColor = C.accent;
                                    e.currentTarget.style.background = `${C.accent}15`;
                                  }}
                                  onMouseLeave={e => {
                                    e.currentTarget.style.borderColor = C.border;
                                    e.currentTarget.style.background = C.dim;
                                  }}
                                >
                                  <span>💬</span>
                                  <span>Revise</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </Card>
                );
              })()}

              {/* ── FOCUS TOPICS CARD ── */}
              <Card style={{ marginBottom: 14 }}>
                <div style={{ fontWeight: 700, marginBottom: 10, fontSize: 14, color: C.purple }}>📌 Focus Topics</div>
                {weakTopics.length > 0 ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {weakTopics.map((t, i) => {
                      const baseColor = [C.gold, C.red, C.purple, C.accent, C.green][i % 5];
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => goToChatWithPrompt("Mujhe " + t + " samajhne mein dikkat ho rahi hai. Kripya iska concept easy language mein samjhao aur ek example do.")}
                          title={`Chat mein revise karo: ${t}`}
                          aria-label={`Chat mein revise karo: ${t}`}
                          style={{
                            background: `${baseColor}22`,
                            color: baseColor,
                            border: `1px solid ${baseColor}44`,
                            borderRadius: 99,
                            padding: "6px 12px",
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: "pointer",
                            fontFamily: "inherit",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            textAlign: "left",
                            wordBreak: "break-word",
                            maxWidth: "100%",
                            transition: "all 0.15s ease"
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.borderColor = baseColor;
                            e.currentTarget.style.background = `${baseColor}33`;
                            e.currentTarget.style.transform = "translateY(-1px)";
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.borderColor = `${baseColor}44`;
                            e.currentTarget.style.background = `${baseColor}22`;
                            e.currentTarget.style.transform = "translateY(0)";
                          }}
                        >
                          <span style={{ overflowWrap: "anywhere" }}>{t}</span>
                          <span style={{ fontSize: 13, opacity: 0.9, flexShrink: 0 }}>💬</span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ fontSize: 13, color: C.muted, padding: "2px 0", lineHeight: 1.5 }}>
                    ✨ Koi weak topic nahi hai! Quizzes aur doubts ke hisaab se yahan focus topics dikhenge.
                  </div>
                )}
              </Card>

              {/* ── QUIZ HISTORY CARD ── */}
              <Card>
                <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 14 }}>
                  📝 Quiz History{currentClassQuizHistory.length > 0 ? ` (${currentClassQuizHistory.length})` : ""}
                </div>
                {currentClassQuizHistory.length === 0
                  ? <div style={{ color: C.muted, fontSize: 14 }}>No quizzes yet. Quiz tab pe jao! 🧠</div>
                  : (
                    <>
                      {(showAllHistory || currentClassQuizHistory.length <= 5 ? currentClassQuizHistory : currentClassQuizHistory.slice(0, 5)).map((q, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{q.subject}</div>
                            <div style={{ fontSize: 11, color: C.muted }}>{new Date(q.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</div>
                          </div>
                          <div style={{ width: isMobile ? 80 : 110, flexShrink: 0 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                              <span style={{ fontSize: 11, color: C.muted }}>{q.score}/{q.total}</span>
                              <span style={{ fontSize: 12, fontWeight: 700, color: q.pct >= 70 ? C.green : q.pct >= 50 ? C.gold : C.red }}>{q.pct}%</span>
                            </div>
                            <ScoreBar pct={q.pct} color={q.pct >= 70 ? C.green : q.pct >= 50 ? C.gold : C.red} />
                          </div>
                          <button
                            type="button"
                            onClick={() => goToChatWithPrompt(
                              `Maine ${q.subject} ki quiz li thi (Score: ${q.score}/${q.total}, ${q.pct}%). Kripya iske key concepts revise karao aur common mistakes samjhao.`
                            )}
                            title={`Chat mein revise karo: ${q.subject}`}
                            aria-label={`Chat mein revise karo: ${q.subject}`}
                            style={{
                              background: C.dim,
                              border: `1px solid ${C.border}`,
                              borderRadius: 8,
                              padding: isMobile ? "4px 6px" : "4px 8px",
                              color: C.accent,
                              fontSize: 11,
                              fontWeight: 600,
                              cursor: "pointer",
                              fontFamily: "inherit",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 3,
                              whiteSpace: "nowrap",
                              flexShrink: 0,
                              transition: "all 0.15s ease"
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.borderColor = C.accent;
                              e.currentTarget.style.background = `${C.accent}15`;
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.borderColor = C.border;
                              e.currentTarget.style.background = C.dim;
                            }}
                          >
                            <span>💬</span>
                            {!isMobile && <span>Revise</span>}
                          </button>
                        </div>
                      ))}

                      {currentClassQuizHistory.length > 5 && (
                        <button
                          type="button"
                          onClick={() => setShowAllHistory(prev => !prev)}
                          style={{
                            width: "100%",
                            marginTop: 4,
                            padding: "8px 12px",
                            background: C.dim,
                            border: `1px solid ${C.border}`,
                            borderRadius: 8,
                            color: C.accent,
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: "pointer",
                            fontFamily: "inherit",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 6,
                            transition: "all 0.15s ease"
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.borderColor = C.accent;
                            e.currentTarget.style.background = `${C.accent}15`;
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.borderColor = C.border;
                            e.currentTarget.style.background = C.dim;
                          }}
                        >
                          <span>{showAllHistory ? "Show recent 5 ▴" : `Show all ${currentClassQuizHistory.length} quizzes ▾`}</span>
                        </button>
                      )}
                    </>
                  )}
              </Card>
            </div>
          </div>
        )}

        {/* ── MOBILE FIXED BOTTOM NAVIGATION ── */}
        {isMobile && !(view === "quiz" && (quizStep === "quiz" || quizStep === "chapter" || quizStep === "settings")) && (
          <nav
            aria-label="Mobile navigation"
            style={{
              flexShrink: 0,
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              background: C.card,
              borderTop: `1px solid ${C.border}`,
              padding: "4px 6px calc(4px + env(safe-area-inset-bottom, 0px))",
              zIndex: 30,
              userSelect: "none"
            }}
          >
            {[
              { id: "home", icon: "🏠", label: "Home" },
              { id: "chat", icon: "💬", label: "Doubt" },
              { id: "quiz", icon: "🧠", label: "Quiz" },
              { id: "progress", icon: "📊", label: "Progress" }
            ].map(tab => {
              const isActive = view === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setView(tab.id);
                    if (tab.id === "quiz") resetQuiz();
                    if (tab.id === "chat" || tab.id === "home") {
                      setQuizSubject(null);
                      setSelectedChapter(null);
                      setQuizCourse(null);
                    }
                    setSidebarOpen(false);
                  }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                    padding: "6px 2px",
                    background: isActive ? `${C.accent}14` : "transparent",
                    border: "none",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    color: isActive ? C.accent : C.muted,
                    transition: "all 0.15s ease",
                    minHeight: 48
                  }}
                >
                  <span style={{ fontSize: 18, lineHeight: 1 }}>{tab.icon}</span>
                  <span style={{
                    fontSize: 11,
                    fontWeight: isActive ? 700 : 500,
                    lineHeight: 1.1,
                    letterSpacing: -0.2
                  }}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </nav>
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
