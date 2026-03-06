import { useState } from "react";
import { TitleScreen } from "./components/TitleScreen";
import { SelectScreen } from "./components/SelectScreen";
import { MapScreen } from "./components/MapScreen";
import { BattleScreen } from "./components/BattleScreen";
import { VictoryScreen, GameOverScreen } from "./components/EndScreens";
import { drawCards } from "./utils/gameLogic";
import { CLASSES } from "./data/constants";

export default function AxieAdventure() {
  const [screen, setScreen] = useState("title");
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [playerTeam, setPlayerTeam] = useState([]);
  const [enemyTeam, setEnemyTeam] = useState([]);
  const [energy, setEnergy] = useState(3);
  const [turn, setTurn] = useState(1);
  const [phase, setPhase] = useState("selection");
  const [selectedPlays, setSelectedPlays] = useState({});
  const [logs, setLogs] = useState([]);
  const [shake, setShake] = useState({});
  const [xpTotal, setXpTotal] = useState(0);
  const [gold, setGold] = useState(0);
  const [currentMap, setCurrentMap] = useState(null);
  const [currentStage, setCurrentStage] = useState(0);
  const [mapProgress, setMapProgress] = useState({});

  const toggleClass = (cls) => {
    setSelectedClasses(prev => {
      const found = prev.find(x => x.cls === cls);
      if (found) return prev.filter(x => x.cls !== cls);
      if (prev.length >= 3) return prev;
      const role = CLASSES[cls].role;
      const hasFront = prev.find(x => x.pos === "front");
      const pos = !hasFront && (role === "tank") ? "front" : "back";
      return [...prev, { cls, pos }];
    });
  };

  const setPosition = (cls, pos) => {
    setSelectedClasses(prev => {
      let u = prev.map(x => x.cls === cls ? { ...x, pos } : x);
      const fronts = u.filter(x => x.pos === "front");
      if (fronts.length > 1) u = u.map(x => x.cls !== cls && x.pos === "front" ? { ...x, pos:"back" } : x);
      return u;
    });
  };

  const startGame = (team) => {
    setPlayerTeam(team);
    setEnergy(3); setTurn(1); setSelectedPlays({});
    setXpTotal(0); setGold(0); setMapProgress({});
    setScreen("map");
  };

  const selectMap = (map, done, eTeam) => {
    setEnemyTeam(eTeam);
    setCurrentMap(map); setCurrentStage(done);
    setEnergy(3); setTurn(1); setPhase("selection"); setSelectedPlays({});
    setPlayerTeam(t => t.map(a => drawCards(a)));
    setLogs([{ text:`📍 ${map.name} — Etapa ${done+1}/${map.stages+1}${done === map.stages?" 👑 JEFE":""}`, color:map.accent }]);
    setScreen("battle");
  };

  if (screen === "title") {
    return <TitleScreen onStart={() => setScreen("select")} />;
  }

  if (screen === "select") {
    return (
      <SelectScreen
        selectedClasses={selectedClasses}
        onToggleClass={toggleClass}
        onSetPosition={setPosition}
        onStart={startGame}
        onBack={() => setScreen("title")}
      />
    );
  }

  if (screen === "map") {
    return (
      <MapScreen
        playerTeam={playerTeam}
        mapProgress={mapProgress}
        xpTotal={xpTotal}
        gold={gold}
        onSelectMap={selectMap}
        onBack={() => { setScreen("select"); setSelectedClasses([]); }}
      />
    );
  }

  if (screen === "battle") {
    return (
      <BattleScreen
        playerTeam={playerTeam} setPlayerTeam={setPlayerTeam}
        enemyTeam={enemyTeam} setEnemyTeam={setEnemyTeam}
        energy={energy} setEnergy={setEnergy}
        turn={turn} setTurn={setTurn}
        phase={phase} setPhase={setPhase}
        selectedPlays={selectedPlays} setSelectedPlays={setSelectedPlays}
        logs={logs} setLogs={setLogs}
        shake={shake} setShake={setShake}
        currentMap={currentMap} currentStage={currentStage}
        xpTotal={xpTotal} setXpTotal={setXpTotal}
        setGold={setGold}
        setMapProgress={setMapProgress}
        onBackToMap={() => setScreen("map")}
        onVictory={() => setScreen("victory")}
        onGameOver={() => setScreen("gameover")}
      />
    );
  }

  if (screen === "victory") {
    return (
      <VictoryScreen
        currentMap={currentMap}
        xpTotal={xpTotal}
        gold={gold}
        playerTeam={playerTeam}
        onContinue={() => setScreen("map")}
      />
    );
  }

  if (screen === "gameover") {
    return (
      <GameOverScreen
        xpTotal={xpTotal}
        gold={gold}
        onRetry={() => { setScreen("select"); setSelectedClasses([]); }}
      />
    );
  }

  return null;
}
