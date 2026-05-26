// ─── COLORS ───────────────────────────────────────────────────────────────────
export const C = {
  bg: "#0b0c1a", card: "#13142a", border: "#1e2040", accent: "#6366f1",
  accentSoft: "#4f46e5", purple: "#8b5cf6", gold: "#f59e0b",
  green: "#10b981", red: "#ef4444", text: "#e2e8f0", muted: "#64748b",
  dim: "#1e2040", success: "#064e3b", danger: "#7c1f1f"
};

// ─── SHARED UI COMPONENTS ─────────────────────────────────────────────────────
export const Btn = ({ children, onClick, disabled, variant = "primary", style = {}, small = false }) => (
  <button onClick={onClick} disabled={disabled} style={{
    padding: small ? "6px 14px" : "10px 22px",
    background: variant === "primary" ? `linear-gradient(135deg,${C.accent},${C.accentSoft})`
      : variant === "danger" ? C.red : variant === "ghost" ? "transparent" : C.card,
    border: `1px solid ${variant === "ghost" ? C.border : "transparent"}`,
    borderRadius: 10, color: "#fff", fontWeight: 600,
    fontSize: small ? 12 : 14, cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1, fontFamily: "inherit", transition: "all 0.15s", ...style
  }}>{children}</button>
);

export const Input = ({ label, type = "text", value, onChange, placeholder, style = {} }) => (
  <div style={{ marginBottom: 14 }}>
    {label && <label style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>{label}</label>}
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{
        width: "100%", background: C.dim, border: `1px solid ${C.border}`, borderRadius: 8,
        color: C.text, padding: "10px 12px", fontSize: 14, fontFamily: "inherit", outline: "none",
        boxSizing: "border-box", ...style
      }} />
  </div>
);

export const Card = ({ children, style = {} }) => (
  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 20px", ...style }}>
    {children}
  </div>
);

export const Badge = ({ children, color = C.accent }) => (
  <span style={{
    background: color + "22", color, border: `1px solid ${color}44`,
    borderRadius: 99, padding: "2px 10px", fontSize: 11, fontWeight: 600
  }}>{children}</span>
);

export const ScoreBar = ({ pct, color = C.green }) => (
  <div style={{ height: 6, background: C.dim, borderRadius: 99, overflow: "hidden" }}>
    <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 99, transition: "width 0.5s" }} />
  </div>
);