export const AXIE_PARTS = {
  beast: { emoji: "🦁", color: "#f59e0b", skill: "Claw Strike", dmg: 55, shield: 20, effect: "bleed" },
  aqua:  { emoji: "🐟", color: "#06b6d4", skill: "Bubble Burst", dmg: 40, shield: 40, effect: "chill" },
  plant: { emoji: "🌿", color: "#22c55e", skill: "Thorn Whip",  dmg: 35, shield: 55, effect: "regen" },
  bird:  { emoji: "🦅", color: "#8b5cf6", skill: "Talon Dive",  dmg: 65, shield: 15, effect: "speed" },
  bug:   { emoji: "🐛", color: "#ec4899", skill: "Poison Sting",dmg: 45, shield: 30, effect: "poison" },
  reptile:{ emoji:"🦎", color: "#14b8a6", skill: "Scale Guard",  dmg: 30, shield: 60, effect: "armor" },
};

export const EFFECTS = {
  bleed:  { label: "🩸 Sangrado",  desc: "−10 HP/turno", color: "#ef4444" },
  chill:  { label: "❄️ Frío",      desc: "−1 energía", color: "#06b6d4" },
  regen:  { label: "💚 Regen",     desc: "+15 HP/turno", color: "#22c55e" },
  speed:  { label: "⚡ Velocidad", desc: "Ataca 2x",    color: "#facc15" },
  poison: { label: "☠️ Veneno",    desc: "−20 HP/turno", color: "#a855f7" },
  armor:  { label: "🛡️ Armadura",  desc: "+30 escudo",  color: "#64748b" },
};

export const ENEMY_TEMPLATES = [
  { name: "Slime Verdoso",   emoji: "🟢", hp: 120, atk: 25, def: 10, speed: 8,  xp: 40,  color: "#22c55e", type:"slime",  ability:"Baba Ácida" },
  { name: "Cangrejo Marino", emoji: "🦀", hp: 180, atk: 35, def: 25, speed: 5,  xp: 70,  color: "#f97316", type:"crab",   ability:"Pinza Aplastante" },
  { name: "Murciélago",      emoji: "🦇", hp: 90,  atk: 45, def: 8,  speed: 18, xp: 60,  color: "#6366f1", type:"bat",    ability:"Chillido Sónico" },
  { name: "Golem Pétreo",    emoji: "🗿", hp: 300, atk: 40, def: 40, speed: 3,  xp: 120, color: "#78716c", type:"golem",  ability:"Terremoto" },
  { name: "Dragón Joven",    emoji: "🐲", hp: 220, atk: 55, def: 20, speed: 12, xp: 150, color: "#ef4444", type:"dragon", ability:"Aliento de Fuego" },
  { name: "Fantasma Oscuro", emoji: "👻", hp: 140, atk: 50, def: 5,  speed: 20, xp: 100, color: "#7c3aed", type:"ghost",  ability:"Maldición" },
  { name: "Rey Slime",       emoji: "👑", hp: 400, atk: 60, def: 30, speed: 10, xp: 300, color: "#eab308", type:"boss",   ability:"División" },
];

export const MAPS = [
  {
    id: 1, name: "Pradera Esmeralda", emoji: "🌄", bg: "from-green-900 via-green-800 to-emerald-900",
    accent: "#22c55e", stages: 4, enemies: [0,1], bossIdx: 6,
    story: "Un valle sereno esconde peligros... los slimes han invadido la pradera."
  },
  {
    id: 2, name: "Costa Tempestuosa", emoji: "🌊", bg: "from-blue-900 via-cyan-900 to-blue-800",
    accent: "#06b6d4", stages: 5, enemies: [1,2], bossIdx: 4,
    story: "Las olas traen criaturas del abismo. El faro fue apagado."
  },
  {
    id: 3, name: "Cavernas Malditas", emoji: "⛏️", bg: "from-slate-900 via-purple-900 to-slate-800",
    accent: "#8b5cf6", stages: 6, enemies: [3,5], bossIdx: 6,
    story: "Oscuridad total. Solo el eco de tus pasos y el rugido de los golems."
  },
];
