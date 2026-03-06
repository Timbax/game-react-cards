export function VictoryScreen({ currentMap, xpTotal, gold, playerTeam, onContinue }) {
  return (
    <div style={{ minHeight:"100vh",background:"#0a0f1a",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'Segoe UI',sans-serif",color:"#f8fafc",textAlign:"center",padding:28 }}>
      <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}`}</style>
      <div style={{ fontSize:80,animation:"float 2s infinite" }}>🏆</div>
      <h2 style={{ fontSize:28,fontWeight:900,color:"#facc15",marginBottom:8 }}>¡REGIÓN COMPLETADA!</h2>
      <p style={{ color:"#475569" }}>{currentMap?.name}</p>
      <p style={{ color:"#94a3b8",fontSize:13,marginBottom:28 }}>⭐ {xpTotal} XP &nbsp;&nbsp; 💰 {gold} Oro</p>
      <div style={{ display:"flex",gap:12,marginBottom:28 }}>
        {playerTeam.map(a=><div key={a.id} style={{ fontSize:36,opacity:a.hp>0?1:0.2 }}>{a.emoji}</div>)}
      </div>
      <button onClick={onContinue} style={{ background:"linear-gradient(135deg,#7c3aed,#06b6d4)",color:"#fff",border:"none",borderRadius:14,padding:"13px 36px",fontSize:15,fontWeight:800,cursor:"pointer" }}>🗺️ Continuar</button>
    </div>
  );
}

export function GameOverScreen({ xpTotal, gold, onRetry }) {
  return (
    <div style={{ minHeight:"100vh",background:"#0a0f1a",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'Segoe UI',sans-serif",color:"#f8fafc",textAlign:"center",padding:28 }}>
      <div style={{ fontSize:80 }}>💀</div>
      <h2 style={{ fontSize:28,fontWeight:900,color:"#ef4444",marginBottom:8 }}>DERROTA</h2>
      <p style={{ color:"#475569",marginBottom:4 }}>Tu equipo fue eliminado</p>
      <p style={{ color:"#94a3b8",fontSize:13,marginBottom:28 }}>⭐ {xpTotal} XP &nbsp;&nbsp; 💰 {gold}</p>
      <button onClick={onRetry} style={{ background:"linear-gradient(135deg,#ef4444,#dc2626)",color:"#fff",border:"none",borderRadius:14,padding:"13px 36px",fontSize:15,fontWeight:800,cursor:"pointer" }}>🔄 Reintentar</button>
    </div>
  );
}
