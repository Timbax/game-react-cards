import { MAPS } from '../data/constants';
import { buildEnemy } from '../utils/gameLogic';

export function MapScreen({ playerTeam, mapProgress, xpTotal, gold, onSelectMap, onBack }) {
  const aliveCount = playerTeam.filter(a => a.hp > 0).length;

  return (
    <div style={{ minHeight:"100vh",background:"#0a0f1a",fontFamily:"'Segoe UI',sans-serif",color:"#f8fafc",display:"flex",flexDirection:"column",alignItems:"center",padding:28 }}>
      <div style={{ width:"100%",maxWidth:540,display:"flex",justifyContent:"space-between",marginBottom:18,fontSize:12 }}>
        <span style={{ color:"#64748b" }}>⭐ <span style={{ color:"#facc15" }}>{xpTotal}</span> XP &nbsp; 💰 <span style={{ color:"#f59e0b" }}>{gold}</span></span>
        <span>{playerTeam.map(a=>`${a.emoji}${a.hp>0?"":" 💀"}`).join(" ")}</span>
      </div>
      <h2 style={{ fontSize:22,fontWeight:800,color:"#7c3aed",marginBottom:4 }}>🗺️ Mapa del Mundo</h2>
      <p style={{ color:"#475569",fontSize:12,marginBottom:26 }}>Elige una región para explorar</p>
      <div style={{ display:"flex",flexDirection:"column",gap:13,width:"100%",maxWidth:500 }}>
        {MAPS.map(map => {
          const done = mapProgress[map.id] || 0;
          const total = map.stages + 1;
          const completed = done >= total;
          return (
            <div key={map.id} onClick={() => {
              if (!aliveCount) return;
              const isBoss = done === map.stages;
              const eIdx = isBoss ? map.bossIdx : map.enemies[Math.floor(Math.random()*map.enemies.length)];
              const ne = buildEnemy(eIdx, done+1);
              const eTeam = isBoss
                ? [{ ...ne, position:"front" }]
                : [
                    { ...ne, position:"front" },
                    { ...buildEnemy(map.enemies[Math.floor(Math.random()*map.enemies.length)],done+1), position:"middle" },
                    { ...buildEnemy(map.enemies[0],done+1), position:"back" }
                  ];
              onSelectMap(map, done, eTeam);
            }} style={{ background:"#111827",border:`2px solid ${completed?"#22c55e55":done>0?map.accent+"44":"#1e293b"}`,borderRadius:16,padding:"16px 20px",cursor:aliveCount?"pointer":"not-allowed",transition:"all 0.2s" }}>
              <div style={{ display:"flex",alignItems:"center",gap:12 }}>
                <span style={{ fontSize:36,filter:`drop-shadow(0 0 10px ${map.accent})` }}>{map.emoji}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:800,color:map.accent,fontSize:14 }}>{map.name}</div>
                  <div style={{ fontSize:11,color:"#475569",marginTop:2 }}>{map.story}</div>
                  <div style={{ display:"flex",gap:3,marginTop:6 }}>
                    {[...Array(total)].map((_,i) => <div key={i} style={{ width:13,height:7,borderRadius:2,background:i<done?map.accent:i===done?map.accent+"33":"#0f172a",border:`1px solid ${map.accent}33` }} />)}
                  </div>
                  <div style={{ fontSize:9,color:"#475569",marginTop:2 }}>{done}/{total}{completed?" ✅":done===map.stages?" ⚔️ ¡Jefe!":""}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <button onClick={onBack} style={{ marginTop:26,background:"transparent",color:"#475569",border:"1px solid #1e293b",borderRadius:8,padding:"6px 16px",fontSize:11,cursor:"pointer" }}>← Cambiar equipo</button>
    </div>
  );
}
