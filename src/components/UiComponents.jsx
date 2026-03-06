export function HpBar({ current, max, shield = 0 }) {
  const pct = Math.max(0, Math.min(100, (current / max) * 100));
  const shPct = Math.min(25, (shield / max) * 100);
  const col = pct > 60 ? "#22c55e" : pct > 30 ? "#eab308" : "#ef4444";
  return (
    <div style={{ position:"relative", background:"#0f172a", borderRadius:99, height:7, overflow:"hidden", width:"100%" }}>
      <div style={{ position:"absolute", left:0, top:0, height:"100%", width:`${pct}%`, background:col, borderRadius:99, transition:"width 0.3s" }} />
      {shield > 0 && <div style={{ position:"absolute", right:0, top:0, height:"100%", width:`${shPct}%`, background:"#60a5fa66", borderRadius:99 }} />}
    </div>
  );
}

export function Tags({ status, stunned }) {
  if (stunned) return <span style={{ fontSize:9,padding:"1px 5px",borderRadius:99,background:"#64748b22",color:"#94a3b8",border:"1px solid #64748b44" }}>💫Aturdido</span>;
  if (!status) return null;
  const C={bleed:"#ef4444",poison:"#a855f7",chill:"#06b6d4"};
  const L={bleed:"🩸Sangrado",poison:"☠️Veneno",chill:"❄️Chill"};
  return <span style={{ fontSize:9,padding:"1px 5px",borderRadius:99,background:`${C[status.type]}22`,color:C[status.type],border:`1px solid ${C[status.type]}44` }}>{L[status.type]} {status.turns}t</span>;
}

export function UnitCard({ axie, shaking=false, selectable=false }) {
  const dead = axie.hp <= 0;
  return (
    <div style={{
      background: "#111827",
      border: `3px solid ${selectable ? "#f59e0b" : axie.color + "55"}`,
      borderRadius:14, padding:"10px 12px", minWidth:100, textAlign:"center",
      opacity: dead ? 0.25 : 1,
      boxShadow: selectable ? "0 0 15px #f59e0b66" : "none",
      animation: shaking ? "shake 0.35s" : "none",
      transition: "opacity 0.3s, border-color 0.2s, box-shadow 0.2s",
    }}>
      <div style={{ fontSize:28, filter:`drop-shadow(0 0 6px ${axie.color})` }}>{axie.emoji}</div>
      <div style={{ fontSize:9,color:axie.color,fontWeight:700,marginTop:2 }}>{axie.name||axie.cls?.toUpperCase()}</div>
      <div style={{ fontSize:8,color:"#475569",marginBottom:4 }}>{axie.position==="front"?"⚔️Front":axie.position==="middle"?"⚔️Mid":"🎯Back"}</div>
      <HpBar current={axie.hp} max={axie.maxHp} shield={axie.shield} />
      <div style={{ fontSize:8,color:"#64748b",marginTop:2 }}>{Math.max(0,axie.hp)}/{axie.maxHp}</div>
      {axie.shield > 0 && <div style={{ fontSize:8,color:"#60a5fa" }}>🛡{axie.shield}</div>}
      <div style={{ marginTop:3 }}><Tags status={axie.status} stunned={axie.stunned} /></div>
    </div>
  );
}

export function CardBtn({ card, selected, onSelect, disabled, comboCount }) {
  const typeColor = card.type === "atk" ? "#ef4444" : card.type === "def" ? "#60a5fa" : "#22c55e";
  return (
    <div onClick={!disabled ? onSelect : undefined} style={{
      background: selected ? `${typeColor}18` : "#0a0f1a",
      border: `2px solid ${selected ? typeColor : "#1e293b"}`,
      borderRadius:10, padding:"7px 8px", cursor:disabled?"not-allowed":"pointer",
      minWidth:76, textAlign:"center", position:"relative",
      boxShadow: selected ? `0 0 10px ${typeColor}44` : "none",
      opacity: disabled ? 0.4 : 1, transition:"all 0.15s",
    }}>
      <div style={{ fontSize:18 }}>{card.emoji}</div>
      <div style={{ fontSize:8,fontWeight:700,color:typeColor,marginTop:2,lineHeight:1.2 }}>{card.name}</div>
      <div style={{ display:"flex",justifyContent:"center",gap:3,marginTop:2 }}>
        {card.dmg>0 && <span style={{ fontSize:7,color:"#f59e0b" }}>⚔️{card.dmg}</span>}
        {card.shield>0 && <span style={{ fontSize:7,color:"#60a5fa" }}>🛡{card.shield}</span>}
      </div>
      <div style={{ fontSize:7,color:"#475569",marginTop:1 }}>💠{card.cost}</div>
      {comboCount > 1 && selected && <div style={{ position:"absolute",top:-5,right:-5,background:"#f59e0b",color:"#000",borderRadius:99,fontSize:7,padding:"1px 4px",fontWeight:900 }}>×{comboCount}</div>}
    </div>
  );
}

export function BattleLog({ logs }) {
  return (
    <div style={{ height:100,overflowY:"auto",background:"#060b12",borderRadius:10,padding:"6px 10px",fontSize:11,fontFamily:"monospace",border:"1px solid #1e293b",scrollbarWidth:"thin" }}>
      {logs.map((l,i) => <div key={i} style={{ color:l.color||"#94a3b8",marginBottom:1,lineHeight:1.4 }}>{l.text}</div>)}
    </div>
  );
}
