import { CLASSES } from "../data/constants";
import { buildAxie, drawCards } from "../utils/gameLogic";

export function SelectScreen({
  selectedClasses,
  onToggleClass,
  onSetPosition,
  onStart,
}) {
  const start = () => {
    if (selectedClasses.length !== 3) return;
    const team = selectedClasses.map((s) => {
      const a = buildAxie(s.cls, 1, s.pos);
      a.name = s.cls.toUpperCase();
      return drawCards(a);
    });
    onStart(team);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0f1a",
        fontFamily: "'Segoe UI',sans-serif",
        color: "#f8fafc",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 28,
      }}
    >
      <h2
        style={{
          fontSize: 24,
          fontWeight: 800,
          color: "#7c3aed",
          marginBottom: 4,
        }}
      >
        ⚔️ Arma tu equipo
      </h2>
      <p style={{ color: "#475569", fontSize: 12, marginBottom: 6 }}>
        Elige 3 Monstruos · Asigna 1 Front (tanque) y 2 Back (DPS/Support)
      </p>
      <p style={{ color: "#334155", fontSize: 11, marginBottom: 22 }}>
        Front recibe el daño primero · Back ataca desde detrás
      </p>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          justifyContent: "center",
          maxWidth: 700,
          marginBottom: 24,
        }}
      >
        {Object.entries(CLASSES).map(([cls, c]) => {
          const sel = selectedClasses.find((x) => x.cls === cls);
          return (
            <div
              key={cls}
              style={{
                background: sel ? `${c.color}15` : "#111827",
                border: `2px solid ${sel ? c.color : "#1e293b"}`,
                borderRadius: 16,
                padding: "14px 16px",
                cursor: "pointer",
                width: 145,
                transition: "all 0.2s",
                boxShadow: sel ? `0 0 18px ${c.color}44` : "none",
              }}
            >
              <div onClick={() => onToggleClass(cls)}>
                <div style={{ fontSize: 36, textAlign: "center" }}>
                  {c.emoji}
                </div>
                <div
                  style={{
                    fontWeight: 800,
                    color: c.color,
                    textAlign: "center",
                    fontSize: 12,
                    marginTop: 5,
                  }}
                >
                  {cls.toUpperCase()}
                </div>
                <div
                  style={{ fontSize: 9, color: "#475569", textAlign: "center" }}
                >
                  {c.role.toUpperCase()}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    marginTop: 6,
                    fontSize: 8,
                    color: "#64748b",
                  }}
                >
                  <span>❤️{c.baseHp}</span>
                  <span>⚔️{c.baseAtk}</span>
                  <span>⚡{c.baseSpeed}</span>
                  <span>🎲{c.baseMorale}</span>
                </div>
              </div>
              {sel && (
                <div style={{ marginTop: 7, display: "flex", gap: 4 }}>
                  {["front", "back"].map((p) => (
                    <button
                      key={p}
                      onClick={() => onSetPosition(cls, p)}
                      style={{
                        flex: 1,
                        fontSize: 9,
                        padding: "3px 0",
                        background: sel.pos === p ? c.color : "#0a0f1a",
                        color: sel.pos === p ? "#000" : "#64748b",
                        border: `1px solid ${c.color}44`,
                        borderRadius: 6,
                        cursor: "pointer",
                        fontWeight: 800,
                      }}
                    >
                      {p === "front" ? "⚔️F" : "🎯B"}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ marginBottom: 18, fontSize: 13, color: "#94a3b8" }}>
        {selectedClasses
          .map((s) => `${CLASSES[s.cls].emoji}(${s.pos[0].toUpperCase()})`)
          .join(" → ")}{" "}
        ({selectedClasses.length}/3)
      </div>
      <button
        onClick={start}
        disabled={selectedClasses.length !== 3}
        style={{
          background:
            selectedClasses.length === 3
              ? "linear-gradient(135deg,#7c3aed,#06b6d4)"
              : "#1e293b",
          color: "#fff",
          border: "none",
          borderRadius: 14,
          padding: "13px 42px",
          fontSize: 15,
          fontWeight: 800,
          cursor: selectedClasses.length === 3 ? "pointer" : "not-allowed",
        }}
      >
        🚀 ¡Empezar!
      </button>
    </div>
  );
}
