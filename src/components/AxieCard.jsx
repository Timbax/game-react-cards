import { HpBar } from "./HpBar";
import { StatusBadge } from "./StatusBadge";

export function AxieCard({ axie, isActive, onClick, disabled }) {
  return (
    <div onClick={!disabled ? onClick : undefined} style={{
      background: isActive ? `${axie.color}22` : "#0f172a",
      border: `2px solid ${isActive ? axie.color : "#1e293b"}`,
      borderRadius: 16, padding: "12px", cursor: disabled ? "default" : "pointer",
      transition: "all 0.2s", flex: 1, minWidth: 100,
      boxShadow: isActive ? `0 0 20px ${axie.color}44` : "none",
      opacity: axie.hp <= 0 ? 0.4 : 1,
    }}>
      <div style={{ fontSize: 32, textAlign: "center" }}>{axie.emoji}</div>
      <div style={{ fontSize: 11, fontWeight: 700, color: axie.color, textAlign: "center", marginTop: 4 }}>
        Nv.{axie.level}
      </div>
      <HpBar current={axie.hp} max={axie.maxHp} />
      <div style={{ fontSize: 10, color: "#64748b", textAlign: "center", marginTop: 2 }}>
        {axie.hp}/{axie.maxHp}
      </div>
      <StatusBadge status={axie.status} />
    </div>
  );
}
