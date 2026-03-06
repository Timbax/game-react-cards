export function HpBar({ current, max, height = 8 }) {
  const pct = Math.max(0, Math.min(100, (current / max) * 100));
  const barColor = pct > 60 ? "#22c55e" : pct > 30 ? "#eab308" : "#ef4444";
  return (
    <div style={{ background: "#1e293b", borderRadius: 99, height, overflow: "hidden", width: "100%" }}>
      <div style={{
        height: "100%", width: `${pct}%`,
        background: `linear-gradient(90deg, ${barColor}, ${barColor}cc)`,
        borderRadius: 99,
        transition: "width 0.4s ease",
        boxShadow: `0 0 8px ${barColor}88`,
      }} />
    </div>
  );
}
