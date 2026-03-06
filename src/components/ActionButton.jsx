export function ActionButton({ id, label, desc, color, disabled, onClick, phase }) {
  const isDisabled = disabled || phase !== "player";
  return (
    <button
      disabled={isDisabled}
      onClick={() => onClick(id)}
      style={{
        background: isDisabled ? "#1e293b" : `${color}22`,
        border: `2px solid ${isDisabled ? "#334155" : color + "88"}`,
        borderRadius: 14, padding: "12px", cursor: isDisabled ? "not-allowed" : "pointer",
        color: isDisabled ? "#475569" : "#f8fafc",
        transition: "all 0.15s", textAlign: "left",
      }}
      onMouseDown={e => { if (!isDisabled) e.currentTarget.style.transform = "scale(0.97)"; }}
      onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
    >
      <div style={{ fontWeight: 700, fontSize: 13 }}>{label}</div>
      <div style={{ fontSize: 10, color: isDisabled ? "#475569" : "#94a3b8", marginTop: 2 }}>{desc}</div>
    </button>
  );
}
