import { CLASSES } from "../data/constants";

export function TitleScreen({ onStart }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(ellipse at 50% 0%,#1e1b4b 0%,#0a0f1a 70%)",
        fontFamily: "'Segoe UI',sans-serif",
        color: "#f8fafc",
        overflow: "hidden",
        padding: 24,
      }}
    >
      <style>{`
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        @keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}
        @keyframes glow{0%,100%{box-shadow:0 0 20px #7c3aed66}50%{box-shadow:0 0 40px #7c3aedaa}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
      `}</style>
      <div
        style={{
          fontSize: 88,
          animation: "float 3s ease-in-out infinite",
          filter: "drop-shadow(0 0 40px #7c3aed)",
        }}
      >
        🐉
      </div>
      <h1
        style={{
          fontSize: "clamp(2rem,7vw,4rem)",
          fontWeight: 900,
          margin: "12px 0 4px",
          background: "linear-gradient(90deg,#7c3aed,#06b6d4,#22c55e,#f59e0b)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        MONSTER ADVENTURE
      </h1>
      <p
        style={{
          color: "#475569",
          fontSize: 13,
          marginBottom: 16,
          letterSpacing: 3,
          textTransform: "uppercase",
        }}
      >
        Sistema de Cartas · Formación · Combos
      </p>
      <div
        style={{
          display: "flex",
          gap: 16,
          marginBottom: 44,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {Object.entries(CLASSES).map(([k, c], i) => (
          <span
            key={k}
            style={{
              fontSize: 30,
              filter: `drop-shadow(0 0 8px ${c.color})`,
              animation: `float ${2 + (i % 3) * 0.5}s ease-in-out infinite`,
            }}
          >
            {c.emoji}
          </span>
        ))}
      </div>
      <button
        onClick={onStart}
        style={{
          background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
          color: "#fff",
          border: "none",
          borderRadius: 18,
          padding: "18px 52px",
          fontSize: 18,
          fontWeight: 800,
          cursor: "pointer",
          letterSpacing: 1,
          animation: "glow 2s infinite",
        }}
      >
        ⚔️ COMENZAR
      </button>
      <p
        style={{
          color: "#334155",
          fontSize: 11,
          marginTop: 32,
          maxWidth: 400,
          textAlign: "center",
          lineHeight: 1.6,
        }}
      >
        Selecciona cartas para cada monstruo · El más rápido actúa primero ·
        Combos aumentan daño · Chains aumentan escudo
      </p>
    </div>
  );
}
