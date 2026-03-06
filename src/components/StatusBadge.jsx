import { EFFECTS } from "../data/gameData";

export function StatusBadge({ status }) {
  if (!status) return null;
  const e = EFFECTS[status];
  return (
    <span style={{
      fontSize: 10, padding: "2px 6px", borderRadius: 99,
      background: `${e.color}22`, color: e.color, border: `1px solid ${e.color}55`,
      display: "inline-block"
    }}>{e.label}</span>
  );
}
