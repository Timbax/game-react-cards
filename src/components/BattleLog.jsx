import { useEffect, useRef } from "react";

export function BattleLog({ logs }) {
  const ref = useRef();
  useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [logs]);
  return (
    <div ref={ref} style={{
      height: 120, overflowY: "auto", background: "#0f172a", borderRadius: 12,
      padding: "8px 12px", fontSize: 12, fontFamily: "monospace",
      border: "1px solid #1e293b", scrollbarWidth: "thin"
    }}>
      {logs.map((l, i) => (
        <div key={i} style={{ color: l.color || "#94a3b8", marginBottom: 2, lineHeight: 1.4 }}>
          {l.text}
        </div>
      ))}
    </div>
  );
}
