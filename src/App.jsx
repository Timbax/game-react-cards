import { useState, useMemo } from "react";
import { AXIE_PARTS, EFFECTS, ENEMY_TEMPLATES, MAPS } from "./data/gameData";
import { createAxie, createEnemy, calcDamage, generateStars, generateAxieAnimations } from "./utils/gameUtils";
import { HpBar, StatusBadge, BattleLog, AxieCard, ActionButton } from "./components";

export default function AxieAdventure() {
  const [screen, setScreen] = useState("title");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [currentMap, setCurrentMap] = useState(null);
  const [currentStage, setCurrentStage] = useState(0);
  const [player, setPlayer] = useState(null);
  const [playerTeam, setPlayerTeam] = useState([]);
  const [enemy, setEnemy] = useState(null);
  const [logs, setLogs] = useState([]);
  const [phase, setPhase] = useState("player");
  const [playerIdx, setPlayerIdx] = useState(0);
  const [xp, setXp] = useState(0);
  const [gold, setGold] = useState(0);
  const [shake, setShake] = useState(null);
  const [showSkill, setShowSkill] = useState(null);
  const [mapProgress, setMapProgress] = useState({});

  const stars = useMemo(() => generateStars(30), []);
  const axieAnimations = useMemo(() => generateAxieAnimations(), []);

  if (screen === "title") return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
      fontFamily: "'Segoe UI', sans-serif", color: "#f8fafc",
      position: "relative", overflow: "hidden"
    }}>
      {stars.map((s) => (
        <div key={s.id} style={{
          position: "absolute",
          top: `${s.top}%`, left: `${s.left}%`,
          width: s.width, height: s.height,
          background: "#f8fafc", borderRadius: "50%",
          opacity: s.opacity,
          animation: `twinkle ${s.animDuration}s infinite alternate`,
        }} />
      ))}

      <div style={{ textAlign: "center", zIndex: 1 }}>
        <div style={{ fontSize: 80, marginBottom: 8,
          filter: "drop-shadow(0 0 30px #7c3aed)",
          animation: "float 3s ease-in-out infinite"
        }}>🐉</div>
        <h1 style={{
          fontSize: "clamp(2rem, 6vw, 4rem)", fontWeight: 900, margin: 0,
          background: "linear-gradient(90deg, #7c3aed, #06b6d4, #22c55e)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          letterSpacing: 2, textShadow: "none"
        }}>AXIE ADVENTURE</h1>
        <p style={{ color: "#94a3b8", fontSize: 16, marginTop: 8, marginBottom: 40 }}>
          Un RPG de combate por turnos
        </p>

        <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap", marginBottom: 40 }}>
          {axieAnimations.map((a) => (
            <div key={a.type} style={{
              fontSize: 36, filter: `drop-shadow(0 0 8px ${a.color})`,
              animation: `float ${a.duration}s ease-in-out infinite`
            }}>{a.emoji}</div>
          ))}
        </div>

        <button onClick={() => setScreen("select")} style={{
          background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
          color: "#fff", border: "none", borderRadius: 16,
          padding: "16px 48px", fontSize: 18, fontWeight: 700,
          cursor: "pointer", letterSpacing: 1,
          boxShadow: "0 0 30px #7c3aed88",
          transition: "transform 0.1s",
        }}
          onMouseDown={e => e.currentTarget.style.transform = "scale(0.97)"}
          onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
        >⚔️ COMENZAR AVENTURA</button>
      </div>

      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes twinkle { 0%{opacity:0.2} 100%{opacity:0.9} }
      `}</style>
    </div>
  );

  if (screen === "select") {
    const toggle = (type) => {
      setSelectedTypes(prev =>
        prev.includes(type)
          ? prev.filter(t => t !== type)
          : prev.length < 3 ? [...prev, type] : prev
      );
    };

    const startGame = () => {
      if (selectedTypes.length !== 3) return;
      const newTeam = selectedTypes.map(t => createAxie(t, 1));
      setPlayerTeam(newTeam);
      setPlayerIdx(0);
      setPlayer(newTeam[0]);
      setXp(0); setGold(0);
      setMapProgress({});
      setScreen("map");
    };

    return (
      <div style={{
        minHeight: "100vh", background: "#0f172a",
        fontFamily: "'Segoe UI', sans-serif", color: "#f8fafc",
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", padding: 24,
      }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: "#7c3aed" }}>
          ⚔️ Elige tu equipo
        </h2>
        <p style={{ color: "#64748b", marginBottom: 32 }}>Selecciona exactamente 3 Axies</p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center", maxWidth: 700, marginBottom: 32 }}>
          {Object.entries(AXIE_PARTS).map(([type, p]) => {
            const sel = selectedTypes.includes(type);
            return (
              <div key={type} onClick={() => toggle(type)} style={{
                background: sel ? `${p.color}22` : "#1e293b",
                border: `2px solid ${sel ? p.color : "#334155"}`,
                borderRadius: 20, padding: "20px 24px", cursor: "pointer",
                width: 180, transition: "all 0.2s",
                boxShadow: sel ? `0 0 24px ${p.color}55` : "none",
                animation: sel ? "pulse 1.5s infinite" : "none",
              }}>
                <div style={{ fontSize: 48, textAlign: "center" }}>{p.emoji}</div>
                <div style={{ fontWeight: 800, color: p.color, textAlign: "center", marginTop: 8, fontSize: 14, textTransform: "uppercase" }}>{type}</div>
                <div style={{ fontSize: 12, color: "#94a3b8", textAlign: "center", marginTop: 4 }}>
                  ⚔️ {p.dmg} &nbsp; 🛡 {p.shield}
                </div>
                <div style={{ fontSize: 11, color: p.color, textAlign: "center", marginTop: 6 }}>
                  ✨ {p.skill}
                </div>
                <div style={{ fontSize: 10, color: "#64748b", textAlign: "center", marginTop: 2 }}>
                  {EFFECTS[p.effect].label}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginBottom: 24, fontSize: 14, color: "#94a3b8" }}>
          Elegidos: {selectedTypes.map(t => AXIE_PARTS[t].emoji).join(" ")} ({selectedTypes.length}/3)
        </div>

        <button onClick={startGame} disabled={selectedTypes.length !== 3} style={{
          background: selectedTypes.length === 3
            ? "linear-gradient(135deg, #7c3aed, #06b6d4)"
            : "#334155",
          color: "#fff", border: "none", borderRadius: 14,
          padding: "14px 40px", fontSize: 16, fontWeight: 700,
          cursor: selectedTypes.length === 3 ? "pointer" : "not-allowed",
          transition: "all 0.2s",
          boxShadow: selectedTypes.length === 3 ? "0 0 20px #7c3aed66" : "none",
        }}>🚀 ¡Comenzar!</button>

        <style>{`@keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.03)} }`}</style>
      </div>
    );
  }

  if (screen === "map") {
    const aliveAxies = playerTeam.filter(a => a.hp > 0);
    return (
      <div style={{
        minHeight: "100vh", background: "#0f172a",
        fontFamily: "'Segoe UI', sans-serif", color: "#f8fafc",
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: 24, paddingTop: 32,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", width: "100%", maxWidth: 600, marginBottom: 24 }}>
          <div style={{ color: "#64748b", fontSize: 13 }}>
            ⭐ XP: <span style={{ color: "#facc15" }}>{xp}</span>
            &nbsp;&nbsp;💰 Oro: <span style={{ color: "#f59e0b" }}>{gold}</span>
          </div>
          <div style={{ fontSize: 13, color: "#64748b" }}>
            {aliveAxies.map(a => a.emoji).join(" ")} vivos
          </div>
        </div>

        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4, color: "#7c3aed" }}>🗺️ Mapa del Mundo</h2>
        <p style={{ color: "#64748b", fontSize: 13, marginBottom: 32 }}>Elige una región para explorar</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", maxWidth: 500 }}>
          {MAPS.map((map) => {
            const done = mapProgress[map.id] || 0;
            const completed = done >= map.stages + 1;
            return (
              <div key={map.id} onClick={() => {
                if (aliveAxies.length === 0) return;
                setCurrentMap(map);
                setCurrentStage(done);
                const enemies = done === map.stages
                  ? [createEnemy(ENEMY_TEMPLATES[map.bossIdx], done + 1)]
                  : [createEnemy(ENEMY_TEMPLATES[map.enemies[Math.floor(Math.random() * map.enemies.length)]], done + 1)];
                const startEnemy = enemies[0];
                setEnemy(startEnemy);
                const activeIdx = playerTeam.findIndex(a => a.hp > 0);
                setPlayerIdx(activeIdx);
                setPlayer({ ...playerTeam[activeIdx] });
                setLogs([{ text: `📍 ${map.name} — Etapa ${done + 1}/${map.stages + 1}${done === map.stages ? " 👑 JEFE" : ""}`, color: map.accent }]);
                setPhase("player");
                setScreen("battle");
              }} style={{
                background: `linear-gradient(135deg, #1e293b, #0f172a)`,
                border: `2px solid ${completed ? "#22c55e" : done > 0 ? map.accent + "88" : "#334155"}`,
                borderRadius: 20, padding: "20px 24px", cursor: aliveAxies.length > 0 ? "pointer" : "not-allowed",
                transition: "all 0.2s", position: "relative",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <span style={{ fontSize: 40, filter: `drop-shadow(0 0 8px ${map.accent})` }}>{map.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: 16, color: map.accent }}>{map.name}</div>
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{map.story}</div>
                    <div style={{ marginTop: 8 }}>
                      <div style={{ display: "flex", gap: 4 }}>
                        {[...Array(map.stages + 1)].map((_, i) => (
                          <div key={i} style={{
                            width: 12, height: 12, borderRadius: 2,
                            background: i < done ? map.accent : i === done ? map.accent + "55" : "#1e293b",
                            border: `1px solid ${map.accent}55`
                          }} />
                        ))}
                      </div>
                      <div style={{ fontSize: 10, color: "#64748b", marginTop: 4 }}>
                        {done}/{map.stages + 1} etapas {completed ? "✅ Completado" : done === map.stages ? "⚔️ ¡Jefe!" : ""}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button onClick={() => { setScreen("select"); setSelectedTypes([]); }} style={{
          marginTop: 32, background: "transparent", color: "#64748b",
          border: "1px solid #334155", borderRadius: 10, padding: "8px 20px",
          fontSize: 13, cursor: "pointer",
        }}>← Cambiar equipo</button>
      </div>
    );
  }

  if (screen === "battle" && player && enemy) {
    const executeAction = (action) => {
      if (phase !== "player") return;
      let pCopy = { ...player };
      let eCopy = { ...enemy };
      let newLogs = [];

      if (action === "attack") {
        const dmg = calcDamage(pCopy.atk, eCopy.def);
        eCopy.hp = Math.max(0, eCopy.hp - dmg);
        newLogs = [...newLogs, { text: `⚔️ ${pCopy.emoji} ataca! ${dmg} de daño.`, color: "#f59e0b" }];
        setShake("enemy");
        setTimeout(() => setShake(null), 400);
      } else if (action === "skill") {
        if (pCopy.energy < 2) {
          newLogs = [...newLogs, { text: "❌ Energía insuficiente (necesitas 2)", color: "#ef4444" }];
          setLogs(prev => [...prev, ...newLogs]);
          return;
        }
        pCopy.energy -= 2;
        const dmg = Math.round(pCopy.atk * 1.5);
        const shieldBonus = pCopy.def;
        eCopy.hp = Math.max(0, eCopy.hp - dmg);
        eCopy.status = pCopy.effect;
        eCopy.statusTurns = 3;
        pCopy.def += Math.floor(shieldBonus * 0.3);
        setShowSkill(pCopy.skill);
        setTimeout(() => setShowSkill(null), 1200);
        newLogs = [...newLogs, { text: `✨ ${pCopy.skill}! ${dmg} daño + ${EFFECTS[pCopy.effect].label}`, color: pCopy.color }];
        setShake("enemy");
        setTimeout(() => setShake(null), 400);
      } else if (action === "defend") {
        pCopy.def = Math.round(pCopy.def * 1.4);
        pCopy.hp = Math.min(pCopy.maxHp, pCopy.hp + 20);
        pCopy.energy = Math.min(pCopy.maxEnergy, pCopy.energy + 1);
        newLogs = [...newLogs, { text: `🛡️ ${pCopy.emoji} se defiende. DEF+40%, +20 HP, +1 energía`, color: "#64748b" }];
      } else if (action === "switch") {
        const aliveTeam = playerTeam.map((a, i) => i === playerIdx ? pCopy : a);
        const nextIdx = aliveTeam.findIndex((a, i) => a.hp > 0 && i !== playerIdx);
        if (nextIdx === -1) {
          newLogs = [...newLogs, { text: "No hay más Axies disponibles!", color: "#ef4444" }];
          setLogs(prev => [...prev, ...newLogs]);
          return;
        }
        setPlayerTeam(aliveTeam);
        setPlayerIdx(nextIdx);
        setPlayer({ ...aliveTeam[nextIdx] });
        newLogs = [...newLogs, { text: `🔄 ¡Cambio! Entra ${aliveTeam[nextIdx].emoji}`, color: "#06b6d4" }];
        setLogs(prev => [...prev, ...newLogs]);
        setPhase("enemy");
        setTimeout(() => enemyTurn(aliveTeam[nextIdx], eCopy, [], nextIdx, aliveTeam), 800);
        setEnemy(eCopy);
        return;
      }

      if (eCopy.status) {
        const dmg = eCopy.status === "poison" ? 20 : eCopy.status === "bleed" ? 10 : 0;
        if (dmg > 0) { eCopy.hp = Math.max(0, eCopy.hp - dmg); newLogs = [...newLogs, { text: `${EFFECTS[eCopy.status].label} hace ${dmg} daño al enemigo`, color: EFFECTS[eCopy.status].color }]; }
        if (eCopy.status === "regen") { eCopy.hp = Math.min(eCopy.maxHp, eCopy.hp + 15); newLogs = [...newLogs, { text: "💚 Enemigo se regenera 15 HP", color: "#22c55e" }]; }
        eCopy.statusTurns--;
        if (eCopy.statusTurns <= 0) { newLogs = [...newLogs, { text: `${EFFECTS[eCopy.status].label} terminó`, color: "#64748b" }]; eCopy.status = null; }
      }

      pCopy.energy = Math.min(pCopy.maxEnergy, pCopy.energy + 1);

      setLogs(prev => [...prev, ...newLogs]);

      if (eCopy.hp <= 0) {
        setEnemy(eCopy);
        setPlayer(pCopy);
        handleVictory();
        return;
      }

      setEnemy(eCopy);
      setPlayer(pCopy);
      setPhase("enemy");

      if (action === "defend") {
        setTimeout(() => {
          setPlayer(prev => ({ ...prev, def: AXIE_PARTS[prev.type].def + prev.level * 2 }));
        }, 1600);
      }

      setTimeout(() => enemyTurn(pCopy, eCopy, newLogs, playerIdx, playerTeam), 900);
    };

    const enemyTurn = (pCopy, eCopy, _prevLogs, pIdx, pTeam) => {
      let newLogs = [];
      let p = { ...pCopy };
      let e = { ...eCopy };

      if (p.status) {
        const dmg = p.status === "poison" ? 20 : p.status === "bleed" ? 10 : 0;
        if (dmg > 0) { p.hp = Math.max(0, p.hp - dmg); newLogs = [...newLogs, { text: `${EFFECTS[p.status].label} hace ${dmg} daño`, color: EFFECTS[p.status].color }]; }
        if (p.status === "regen") { p.hp = Math.min(p.maxHp, p.hp + 15); newLogs = [...newLogs, { text: "💚 Te regeneras 15 HP", color: "#22c55e" }]; }
        p.statusTurns--;
        if (p.statusTurns <= 0) { p.status = null; }
      }

      const useAbility = Math.random() < 0.3;
      let dmg = calcDamage(e.atk, p.def);
      if (useAbility) {
        dmg = Math.round(dmg * 1.5);
        newLogs = [...newLogs, { text: `${e.emoji} usa ${e.ability}! ${dmg} de daño!`, color: "#ef4444" }];
      } else {
        newLogs = [...newLogs, { text: `${e.emoji} ataca. ${dmg} de daño.`, color: "#ef4444" }];
      }

      p.hp = Math.max(0, p.hp - dmg);
      setShake("player");
      setTimeout(() => setShake(null), 400);

      const updatedTeam = pTeam.map((a, i) => i === pIdx ? p : a);
      setPlayerTeam(updatedTeam);
      setPlayer(p);
      setEnemy(e);
      setLogs(prev => [...prev, ...newLogs]);

      if (p.hp <= 0) {
        const nextAlive = updatedTeam.findIndex((a, i) => a.hp > 0 && i !== pIdx);
        if (nextAlive === -1) {
          const defeatLogs = [...newLogs, { text: "💀 Tu equipo fue derrotado...", color: "#ef4444" }];
          setLogs(prev => [...prev, ...defeatLogs]);
          setTimeout(() => setScreen("gameover"), 1200);
          return;
        }
        newLogs = [...newLogs, { text: `💀 ${p.emoji} cayó! Entra ${updatedTeam[nextAlive].emoji}`, color: "#f97316" }];
        setPlayerIdx(nextAlive);
        setPlayer({ ...updatedTeam[nextAlive] });
        setLogs(prev => [...prev, ...newLogs]);
        setPhase("player");
      } else {
        setPhase("player");
      }
    };

    const handleVictory = () => {
      const earnedXp = enemy.xp;
      const earnedGold = Math.floor(enemy.xp * 0.5);
      setXp(prev => prev + earnedXp);
      setGold(prev => prev + earnedGold);
      setLogs(prev => [...prev,
        { text: `🏆 ¡Victoria! +${earnedXp} XP, +${earnedGold} 💰`, color: "#22c55e" },
      ]);

      const nextStage = currentStage + 1;
      const totalStages = currentMap.stages + 1;
      setMapProgress(prev => ({ ...prev, [currentMap.id]: Math.max(prev[currentMap.id] || 0, nextStage) }));

      setTimeout(() => {
        if (nextStage > currentMap.stages) {
          setScreen("victory");
        } else {
          setCurrentStage(nextStage);
          const isBoss = nextStage === currentMap.stages;
          const enemyTemplate = isBoss ? ENEMY_TEMPLATES[currentMap.bossIdx] : ENEMY_TEMPLATES[currentMap.enemies[Math.floor(Math.random() * currentMap.enemies.length)]];
          const newEnemy = createEnemy(enemyTemplate, nextStage + 1);
          setEnemy(newEnemy);
          setPlayer(prev => ({ ...prev, hp: Math.min(prev.maxHp, prev.hp + 30), energy: prev.maxEnergy, def: AXIE_PARTS[prev.type].def + prev.level * 2 }));
          setLogs([{ text: `⚔️ Etapa ${nextStage + 1}/${totalStages}${isBoss ? " 👑 ¡JEFE!" : ""} — Aparece ${newEnemy.name}!`, color: currentMap.accent }]);
          setPhase("player");
        }
      }, 1800);
    };

    const aliveCount = playerTeam.filter(a => a.hp > 0).length;

    return (
      <div style={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, #0f172a 0%, #1a0a2e 100%)`,
        fontFamily: "'Segoe UI', sans-serif", color: "#f8fafc",
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: "16px", paddingBottom: 32,
      }}>
        <style>{`
          @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-10px)} 75%{transform:translateX(10px)} }
          @keyframes skillFlash { 0%{opacity:0;transform:scale(0.5)} 50%{opacity:1;transform:scale(1.2)} 100%{opacity:0;transform:scale(1)} }
          @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        `}</style>

        {showSkill && (
          <div style={{
            position: "fixed", top: "40%", left: "50%", transform: "translateX(-50%)",
            zIndex: 100, animation: "skillFlash 1.2s forwards",
            fontSize: 28, fontWeight: 900, color: player?.color,
            textShadow: `0 0 20px ${player?.color}`,
            background: "#0f172acc", padding: "12px 24px", borderRadius: 16,
            pointerEvents: "none",
          }}>✨ {showSkill}</div>
        )}

        <div style={{ width: "100%", maxWidth: 560, marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={() => setScreen("map")} style={{
            background: "transparent", color: "#64748b", border: "1px solid #334155",
            borderRadius: 8, padding: "4px 12px", fontSize: 12, cursor: "pointer"
          }}>← Mapa</button>
          <div style={{ fontSize: 12, color: "#64748b" }}>
            {currentMap?.name} — Etapa {currentStage + 1}/{currentMap?.stages + 1}
            {currentStage === currentMap?.stages ? " 👑" : ""}
          </div>
          <div style={{ fontSize: 12, color: "#facc15" }}>⭐ {xp}</div>
        </div>

        <div style={{
          background: "#1e293b", borderRadius: 20, padding: "20px",
          width: "100%", maxWidth: 560, marginBottom: 12,
          border: `2px solid ${enemy.color}55`,
          animation: shake === "enemy" ? "shake 0.4s" : "none",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
            <span style={{ fontSize: 52, filter: `drop-shadow(0 0 12px ${enemy.color})`, animation: "float 2s infinite" }}>
              {enemy.emoji}
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, color: enemy.color, fontSize: 16 }}>{enemy.name}</div>
              <StatusBadge status={enemy.status} />
              <HpBar current={enemy.hp} max={enemy.maxHp} />
              <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
                {enemy.hp}/{enemy.maxHp} HP &nbsp; ⚔️{enemy.atk} 🛡{enemy.def}
              </div>
            </div>
          </div>
        </div>

        <div style={{ width: "100%", maxWidth: 560, marginBottom: 12 }}>
          <BattleLog logs={logs} />
        </div>

        <div style={{
          background: "#1e293b", borderRadius: 20, padding: "16px",
          width: "100%", maxWidth: 560, marginBottom: 12,
          border: `2px solid ${player.color}55`,
          animation: shake === "player" ? "shake 0.4s" : "none",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 44, filter: `drop-shadow(0 0 12px ${player.color})` }}>{player.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 800, color: player.color, fontSize: 14 }}>
                  {player.type.toUpperCase()} Nv.{player.level}
                </span>
                <span style={{ fontSize: 12, color: "#64748b" }}>
                  ⚡ {player.energy}/{player.maxEnergy}
                </span>
              </div>
              <StatusBadge status={player.status} />
              <HpBar current={player.hp} max={player.maxHp} />
              <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
                {player.hp}/{player.maxHp} HP &nbsp; ⚔️{player.atk} 🛡{player.def}
              </div>
            </div>
          </div>
        </div>

        <div style={{ width: "100%", maxWidth: 560, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
          {[
            { id: "attack", label: "⚔️ Atacar", desc: "Ataque básico", color: "#f59e0b", disabled: false },
            { id: "skill",  label: `✨ ${player.skill}`, desc: `Cost: 2⚡ ${EFFECTS[player.effect].label}`, color: player.color, disabled: player.energy < 2 },
            { id: "defend", label: "🛡️ Defender", desc: "DEF+40%, +20HP, +1⚡", color: "#06b6d4", disabled: false },
            { id: "switch", label: "🔄 Cambiar", desc: `${aliveCount - 1} Axie(s) disponibles`, color: "#8b5cf6", disabled: aliveCount <= 1 },
          ].map(btn => (
            <ActionButton
              key={btn.id}
              {...btn}
              onClick={executeAction}
              phase={phase}
            />
          ))}
        </div>

        <div style={{ display: "flex", gap: 8, width: "100%", maxWidth: 560 }}>
          {playerTeam.map((a, i) => (
            <AxieCard key={i} axie={a} isActive={i === playerIdx}
              onClick={() => { if (i !== playerIdx && a.hp > 0 && phase === "player") executeAction("switch"); }}
              disabled={i === playerIdx || a.hp <= 0 || phase !== "player"}
            />
          ))}
        </div>
      </div>
    );
  }

  if (screen === "victory") return (
    <div style={{
      minHeight: "100vh", background: "#0f172a",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", fontFamily: "'Segoe UI', sans-serif",
      color: "#f8fafc", textAlign: "center", padding: 24,
    }}>
      <div style={{ fontSize: 80, animation: "float 2s infinite" }}>🏆</div>
      <h2 style={{ fontSize: 32, fontWeight: 900, color: "#facc15", marginBottom: 8 }}>¡REGIÓN COMPLETADA!</h2>
      <p style={{ color: "#94a3b8", marginBottom: 8 }}>{currentMap?.name}</p>
      <p style={{ color: "#64748b", fontSize: 14, marginBottom: 32 }}>
        ⭐ XP Total: {xp} &nbsp;&nbsp; 💰 Oro: {gold}
      </p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
        {playerTeam.map((a, i) => (
          <div key={i} style={{ fontSize: 36, opacity: a.hp > 0 ? 1 : 0.3 }}>{a.emoji}</div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 32 }}>
        <button onClick={() => setScreen("map")} style={{
          background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
          color: "#fff", border: "none", borderRadius: 14,
          padding: "14px 32px", fontSize: 16, fontWeight: 700, cursor: "pointer",
        }}>🗺️ Continuar</button>
      </div>
      <style>{`@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }`}</style>
    </div>
  );

  if (screen === "gameover") return (
    <div style={{
      minHeight: "100vh", background: "#0f172a",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", fontFamily: "'Segoe UI', sans-serif",
      color: "#f8fafc", textAlign: "center", padding: 24,
    }}>
      <div style={{ fontSize: 80 }}>💀</div>
      <h2 style={{ fontSize: 32, fontWeight: 900, color: "#ef4444", marginBottom: 8 }}>DERROTA</h2>
      <p style={{ color: "#64748b", marginBottom: 8 }}>Tu equipo fue eliminado</p>
      <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 32 }}>
        ⭐ XP acumulado: {xp} &nbsp;&nbsp; 💰 Oro: {gold}
      </p>
      <div style={{ display: "flex", gap: 16 }}>
        <button onClick={() => { setScreen("select"); setSelectedTypes([]); }} style={{
          background: "linear-gradient(135deg, #ef4444, #dc2626)",
          color: "#fff", border: "none", borderRadius: 14,
          padding: "14px 32px", fontSize: 16, fontWeight: 700, cursor: "pointer",
        }}>🔄 Reintentar</button>
      </div>
    </div>
  );

  return null;
}
