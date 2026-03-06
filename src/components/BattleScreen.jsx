import { useState, useRef, useEffect } from 'react';
import { UnitCard, CardBtn, BattleLog } from './UiComponents';
import { critChance, calcDmg, applyEffect, tickStatus, drawCards, buildEnemy } from '../utils/gameLogic';

export function BattleScreen({
  playerTeam, setPlayerTeam,
  enemyTeam, setEnemyTeam,
  energy, setEnergy,
  turn, setTurn,
  phase, setPhase,
  selectedPlays, setSelectedPlays,
  logs, setLogs,
  shake, setShake,
  currentMap, currentStage,
  xpTotal, setXpTotal,
  setGold,
  setMapProgress,
  onBackToMap,
  onVictory,
  onGameOver,
}) {
  const [resolving, setResolving] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState(null);
  const logRef = useRef(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [logs]);

  const selectTarget = (enemyId) => {
    if (phase !== "selection" || resolving) return;
    setSelectedTarget(prev => prev === enemyId ? null : enemyId);
  };

  const playedClsMap = {};
  Object.entries(selectedPlays).forEach(([aid]) => {
    const axie = playerTeam.find(a => String(a.id) === aid);
    if (!axie) return;
    if (!playedClsMap[axie.cls]) playedClsMap[axie.cls] = new Set();
    playedClsMap[axie.cls].add(aid);
  });
  const chainBonusShield = Object.values(playedClsMap).filter(s => s.size >= 2).length * 25;

  const axieCardCount = {};
  Object.entries(selectedPlays).forEach(([aid]) => { axieCardCount[aid] = (axieCardCount[aid]||0)+1; });

  const totalCost = Object.values(selectedPlays).reduce((s,c) => s+(c.cost||0), 0);
  const canReady = !resolving && phase==="selection";

  const selectCard = (axie, card) => {
    if (phase !== "selection" || resolving) return;
    const aid = String(axie.id);
    setSelectedPlays(prev => {
      if (prev[aid]?.uid === card.uid) { const n={...prev}; delete n[aid]; return n; }
      const next = { ...prev, [aid]: card };
      if (Object.values(next).reduce((s,c)=>s+(c.cost||0),0) > energy) return prev;
      return next;
    });
  };

  const resolveRound = async () => {
    if (resolving) return;
    setResolving(true);
    setPhase("resolving");

    let pTeam = playerTeam.map(a => ({ ...a, shield:0, stunned:false, atkBuff:0 }));
    let eTeam = enemyTeam.map(a => ({ ...a, shield:0 }));
    const allLogs = [{ text:`━━━ Turno ${turn} ━━━`, color:"#1e293b" }];

    const actions = [];
    pTeam.forEach(axie => {
      const aid = String(axie.id);
      const card = selectedPlays[aid];
      if (card && axie.hp > 0) {
        actions.push({ side:"player", axieId:axie.id, card, comboBonus:(axieCardCount[aid]||1)-1 });
      }
    });
    eTeam.forEach((enemy, ei) => {
      if (enemy.hp <= 0) return;
      const card = enemy.cards[(turn + ei) % enemy.cards.length];
      actions.push({ side:"enemy", axieId:enemy.id, card, comboBonus:0 });
    });

    const getSpeed = act => {
      const u = act.side==="player" ? pTeam.find(a=>a.id===act.axieId) : eTeam.find(a=>a.id===act.axieId);
      return u?.speed || 0;
    };
    actions.sort((a,b) => getSpeed(b)-getSpeed(a));

    const trigShake = (id) => {
      setShake(p=>({...p,[id]:true}));
      setTimeout(() => setShake(p=>{const n={...p};delete n[id];return n;}), 350);
    };

    for (const action of actions) {
      await new Promise(r => setTimeout(r, 480));
      const isPlayer = action.side === "player";
      const attacker = isPlayer ? pTeam.find(a=>a.id===action.axieId) : eTeam.find(a=>a.id===action.axieId);
      if (!attacker || attacker.hp<=0) continue;

      if (attacker.stunned) {
        allLogs.push({ text:`💫 ${attacker.emoji} está aturdido, pierde turno`, color:"#64748b" });
        setLogs(p=>[...p.slice(-60),...allLogs.splice(0)]);
        continue;
      }

      const opposingTeam = isPlayer ? eTeam : pTeam;
      let target;
      if (isPlayer && selectedTarget) {
        target = opposingTeam.find(a => a.id === selectedTarget && a.hp > 0);
      }
      if (!target) {
        target = opposingTeam.find(a => a.position === "front" && a.hp > 0)
          || opposingTeam.find(a => a.hp > 0);
      }
      if (!target) continue;

      const { card, comboBonus } = action;
      const isCrit = Math.random() < critChance(attacker.morale);
      const dmg = card.dmg > 0 ? calcDmg(attacker.atk, card.dmg, target.def, isCrit, comboBonus, attacker.atkBuff||0) : 0;

      const attackerArr = isPlayer ? pTeam : eTeam;
      const atIdx = attackerArr.findIndex(a=>a.id===attacker.id);
      const shieldGain = card.shield + (isPlayer ? chainBonusShield : 0);
      attackerArr[atIdx] = { ...attackerArr[atIdx], shield: attackerArr[atIdx].shield + shieldGain };

      if (card.type==="heal" || card.type==="def") {
        attackerArr[atIdx] = applyEffect(attackerArr[atIdx], card.effect, card.effectVal);
      }

      const targetArr = isPlayer ? eTeam : pTeam;
      const tIdx = targetArr.findIndex(a=>a.id===target.id);
      let tgt = { ...targetArr[tIdx] };
      let actualDmg = dmg;
      if (tgt.shield > 0 && dmg > 0) {
        const absorbed = Math.min(tgt.shield, actualDmg);
        tgt.shield -= absorbed; actualDmg -= absorbed;
        if (absorbed > 0) allLogs.push({ text:`🛡️ Escudo absorbe ${absorbed}`, color:"#60a5fa" });
      }
      tgt.hp = Math.max(0, tgt.hp - actualDmg);

      if (card.type==="atk" && card.effect && tgt.hp >= 0) tgt = applyEffect(tgt, card.effect, card.effectVal);

      targetArr[tIdx] = tgt;
      if (dmg > 0) trigShake(target.id);

      const comboTxt = comboBonus > 0 ? ` 🔥COMBO×${comboBonus+1}` : "";
      const chainTxt = isPlayer && chainBonusShield > 0 && shieldGain > 0 ? ` 🔗Chain+${chainBonusShield}🛡` : "";
      const critTxt = isCrit ? " 💥CRIT!" : "";
      allLogs.push({
        text:`${attacker.emoji} → ${card.emoji}${card.name}${critTxt}${comboTxt}${chainTxt} [${dmg>0?`-${actualDmg}HP`:""}${shieldGain>0?` +${shieldGain}🛡`:""}]`,
        color: isPlayer ? "#f59e0b" : "#ef4444"
      });

      if (isPlayer) { eTeam=[...targetArr]; } else { pTeam=[...targetArr]; }
      if (isPlayer) { pTeam[atIdx]={...attackerArr[atIdx]}; } else { eTeam[atIdx]={...attackerArr[atIdx]}; }
      setPlayerTeam([...pTeam]); setEnemyTeam([...eTeam]);
      setLogs(p=>[...p.slice(-60),...allLogs.splice(0)]);

      const pAlive = pTeam.filter(a=>a.hp>0);
      const eAlive = eTeam.filter(a=>a.hp>0);
      if (!pAlive.length || !eAlive.length) break;
    }

    if (allLogs.length) setLogs(p=>[...p.slice(-60),...allLogs]);

    await new Promise(r=>setTimeout(r,300));
    const sLogs=[];
    pTeam=pTeam.map(a=>{if(a.hp<=0)return a;const r=tickStatus(a);r.logs.forEach(l=>sLogs.push(l));return r.unit;});
    eTeam=eTeam.map(a=>{if(a.hp<=0)return a;const r=tickStatus(a);r.logs.forEach(l=>sLogs.push(l));return r.unit;});
    if(sLogs.length) setLogs(p=>[...p.slice(-60),...sLogs]);
    setPlayerTeam([...pTeam]); setEnemyTeam([...eTeam]);

    const finalP=pTeam.filter(a=>a.hp>0);
    const finalE=eTeam.filter(a=>a.hp>0);

    if (!finalE.length) {
      const earned=eTeam.reduce((s,e)=>s+(e.xp||50),0);
      const eg=Math.floor(earned*0.6);
      setXpTotal(p=>p+earned); setGold(p=>p+eg);
      setLogs(p=>[...p,{text:`🏆 ¡Victoria! +${earned}XP +${eg}💰`,color:"#22c55e"}]);
      const ns=currentStage+1;
      setMapProgress(p=>({...p,[currentMap.id]:Math.max(p[currentMap.id]||0,ns)}));
      setTimeout(()=>{
        if(ns>currentMap.stages){ onVictory(); return; }
        setTurn(1);
        const isBoss=ns===currentMap.stages;
        const eI=isBoss?currentMap.bossIdx:currentMap.enemies[Math.floor(Math.random()*currentMap.enemies.length)];
        const ne=buildEnemy(eI,ns+1);
        const newET=isBoss
          ?[{...ne,position:"front"}]
          :[
              {...ne,position:"front"},
              {...buildEnemy(currentMap.enemies[Math.floor(Math.random()*currentMap.enemies.length)],ns+1),position:"middle"},
              {...buildEnemy(currentMap.enemies[0],ns+1),position:"back"}
            ];
        setEnemyTeam(newET);
        setPlayerTeam(t=>t.map(a=>drawCards({...a,hp:Math.min(a.maxHp,a.hp+Math.round(a.maxHp*0.2)),shield:0,stunned:false})));
        setEnergy(3); setSelectedPlays({}); setSelectedTarget(null); setPhase("selection"); setResolving(false);
        setLogs([{text:`⚔️ Etapa ${ns+1}/${currentMap.stages+1}${isBoss?" 👑 JEFE":""}`,color:currentMap.accent}]);
      },2000);
      return;
    }

    if (!finalP.length) {
      setLogs(p=>[...p,{text:"💀 Tu equipo fue derrotado...",color:"#ef4444"}]);
      setTimeout(()=>onGameOver(),1500);
      return;
    }

    await new Promise(r=>setTimeout(r,350));
    const newE=Math.min(9,energy+2);
    setEnergy(newE); setTurn(t=>t+1); setSelectedPlays({});
    setSelectedTarget(null);
    setPlayerTeam(t=>t.map(a=>drawCards({...a,shield:0,stunned:false})));
    setEnemyTeam(t=>t.map(a=>({...a,shield:0})));
    setPhase("selection"); setResolving(false);
    setLogs(p=>[...p,{text:`🔄 Turno ${turn+1} — Energía: ${newE} (+2)`,color:"#06b6d4"}]);
  };

  return (
    <div style={{ minHeight:"100vh",background:"linear-gradient(180deg,#0a0f1a 0%,#060b12 100%)",fontFamily:"'Segoe UI',sans-serif",color:"#f8fafc",display:"flex",flexDirection:"column",alignItems:"center",padding:"12px 10px 28px" }}>
      <div style={{ width:"100%",maxWidth:640,display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10 }}>
        <button onClick={onBackToMap} style={{ background:"transparent",color:"#475569",border:"1px solid #1e293b",borderRadius:8,padding:"4px 12px",fontSize:11,cursor:"pointer" }}>← Mapa</button>
        <div style={{ fontSize:11,color:"#475569" }}>{currentMap?.name} · E{currentStage+1}/{currentMap?.stages+1}{currentStage===currentMap?.stages?" 👑":""}</div>
        <div style={{ fontSize:11,color:"#facc15" }}>⭐{xpTotal}</div>
      </div>

      <div style={{ width:"100%",maxWidth:640,marginBottom:10 }}>
        <div style={{ fontSize:9,color:"#334155",marginBottom:5,textAlign:"center",letterSpacing:2,textTransform:"uppercase" }}>Equipo Enemigo {phase==="selection"&&"← Clickea para seleccionar"}</div>
        <div style={{ display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap" }}>
          {enemyTeam.map(e => {
            const isAlive = e.hp > 0;
            const isSelected = selectedTarget === e.id;
            return (
              <div 
                key={e.id} 
                onClick={() => isAlive && selectTarget(e.id)}
                style={{
                  cursor: isAlive && phase === "selection" ? "pointer" : "default",
                  transform: isSelected ? "scale(1.05)" : "scale(1)",
                  transition: "transform 0.15s",
                }}
              >
                <UnitCard axie={e} shaking={!!shake[e.id]} selectable={isSelected} />
                {isSelected && <div style={{ textAlign:"center",fontSize:9,color:"#f59e0b",marginTop:2 }}>🎯 Objetivo</div>}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ width:"100%",maxWidth:640,marginBottom:10 }}><BattleLog logs={logs} /></div>

      <div style={{ width:"100%",maxWidth:640,marginBottom:10 }}>
        <div style={{ fontSize:9,color:"#334155",marginBottom:5,textAlign:"center",letterSpacing:2,textTransform:"uppercase" }}>Tu Equipo</div>
        <div style={{ display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap" }}>
          {playerTeam.map(a=><UnitCard key={a.id} axie={a} shaking={!!shake[a.id]} />)}
        </div>
      </div>

      <div style={{ width:"100%",maxWidth:640,display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8,padding:"0 2px",flexWrap:"wrap",gap:4 }}>
        <span style={{ fontSize:11,color:"#64748b" }}>
          ⚡ <span style={{ color:"#06b6d4",fontWeight:700 }}>{energy-totalCost}</span>/{energy} restante &nbsp;·&nbsp; Costo: <span style={{ color:totalCost>energy?"#ef4444":"#f59e0b" }}>{totalCost}</span>
        </span>
        {chainBonusShield>0 && <span style={{ fontSize:10,color:"#7c3aed",fontWeight:700 }}>🔗 Chain +{chainBonusShield}🛡</span>}
        <span style={{ fontSize:11,color:"#475569" }}>Turno {turn}</span>
      </div>

      <div style={{ width:"100%",maxWidth:640,display:"flex",flexDirection:"column",gap:8,marginBottom:10 }}>
        {playerTeam.map(axie => {
          if (axie.hp<=0) return null;
          const aid=String(axie.id);
          const selCard=selectedPlays[aid];
          const remainEnergy=energy-totalCost+(selCard?.cost||0);
          return (
            <div key={axie.id} style={{ background:"#0d1420",borderRadius:12,padding:"9px 11px",border:`1px solid ${axie.color}22` }}>
              <div style={{ display:"flex",alignItems:"center",gap:7,marginBottom:7 }}>
                <span style={{ fontSize:16 }}>{axie.emoji}</span>
                <span style={{ fontSize:10,color:axie.color,fontWeight:700 }}>{axie.name}</span>
                <span style={{ fontSize:8,color:"#334155" }}>{axie.position==="front"?"⚔️Front":"🎯Back"}</span>
                <span style={{ fontSize:8,color:"#475569" }}>⚡{axie.speed} ❤️{Math.max(0,axie.hp)}</span>
                {selCard && <span style={{ fontSize:8,color:"#22c55e",marginLeft:"auto" }}>✓ {selCard.name}</span>}
              </div>
              <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
                {(axie.hand||[]).map(card=>(
                  <CardBtn key={card.uid} card={card}
                    selected={selCard?.uid===card.uid}
                    onSelect={()=>selectCard(axie,card)}
                    disabled={phase!=="selection"||resolving||(card.cost>remainEnergy&&selCard?.uid!==card.uid)}
                    comboCount={selCard?.uid===card.uid?(axieCardCount[aid]||1):1}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <button onClick={resolveRound} disabled={!canReady||resolving} style={{
        width:"100%",maxWidth:640,
        background:!resolving&&Object.keys(selectedPlays).length>0?"linear-gradient(135deg,#7c3aed,#06b6d4)":"#111827",
        color:"#fff",border:"none",borderRadius:14,padding:"14px",
        fontSize:15,fontWeight:800,cursor:canReady&&!resolving?"pointer":"not-allowed",
        letterSpacing:1,transition:"all 0.2s",
        boxShadow:canReady&&!resolving&&Object.keys(selectedPlays).length>0?"0 0 20px #7c3aed55":"none",
      }}>
        {resolving?"⚔️ Resolviendo...":Object.keys(selectedPlays).length===0?"Selecciona cartas para tus Monstruos...":
          `⚔️ ¡LISTO! — ${Object.keys(selectedPlays).length} carta(s) seleccionada(s)`}
      </button>
      <p style={{ color:"#1e293b",fontSize:10,marginTop:8,textAlign:"center" }}>
        💡 Puedes pasar el turno sin cartas si pulsas ¡LISTO! con 0 seleccionadas (recuperas +2 energía)
      </p>
    </div>
  );
}
