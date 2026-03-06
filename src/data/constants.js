export const CLASSES = {
  plant:   { emoji:"🌿", color:"#22c55e",  baseHp:300, baseAtk:30, baseDef:61, baseSpeed:29, baseMorale:43, role:"tank" },
  beast:   { emoji:"🦁", color:"#f59e0b",  baseHp:180, baseAtk:61, baseDef:43, baseSpeed:35, baseMorale:61, role:"dps" },
  aqua:    { emoji:"🐟", color:"#06b6d4",  baseHp:180, baseAtk:43, baseDef:65, baseSpeed:35, baseMorale:43, role:"support" },
  bird:    { emoji:"🦅", color:"#8b5cf6",  baseHp:156, baseAtk:61, baseDef:39, baseSpeed:61, baseMorale:43, role:"dps" },
  bug:     { emoji:"🐛", color:"#ec4899",  baseHp:180, baseAtk:43, baseDef:39, baseSpeed:35, baseMorale:43, role:"dps" },
  reptile: { emoji:"🦎", color:"#14b8a6",  baseHp:180, baseAtk:30, baseDef:65, baseSpeed:35, baseMorale:39, role:"tank" },
  dawn:    { emoji:"🌅", color:"#fbbf24",  baseHp:156, baseAtk:39, baseDef:43, baseSpeed:35, baseMorale:61, role:"support" },
  dusk:    { emoji:"🌑", color:"#475569",  baseHp:180, baseAtk:35, baseDef:61, baseSpeed:35, baseMorale:43, role:"tank" },
};

export const CARD_POOL = {
  plant: [
    { id:"p1", name:"Espinas",       emoji:"🌵", dmg:30, shield:30, cost:1, effect:"bleed",  effectVal:10, type:"atk", desc:"Ataque + Sangrado 3t" },
    { id:"p2", name:"Barrera Verde", emoji:"🌿", dmg:0,  shield:80, cost:1, effect:"defUp",  effectVal:20, type:"def", desc:"Gran escudo + DEF+20" },
    { id:"p3", name:"Raíz Viva",     emoji:"🪴", dmg:20, shield:20, cost:1, effect:"regen",  effectVal:25, type:"atk", desc:"Daño + Regen 25HP/t" },
    { id:"p4", name:"Flor Curativa", emoji:"🌸", dmg:0,  shield:40, cost:1, effect:"regen",  effectVal:40, type:"heal",desc:"Escudo + Sana 40HP" },
  ],
  beast: [
    { id:"b1", name:"Zarpazo",       emoji:"🦁", dmg:80, shield:0,  cost:1, effect:"bleed",  effectVal:15, type:"atk", desc:"Alto daño + Sangrado" },
    { id:"b2", name:"Colmillo",      emoji:"🐗", dmg:60, shield:10, cost:1, effect:"atkUp",  effectVal:20, type:"atk", desc:"Daño + ATK+20" },
    { id:"b3", name:"Rugido",        emoji:"📣", dmg:40, shield:20, cost:1, effect:"stun",   effectVal:1,  type:"atk", desc:"Daño + Aturde" },
    { id:"b4", name:"Carga Feroz",   emoji:"💨", dmg:100,shield:0,  cost:2, effect:null,     effectVal:0,  type:"atk", desc:"Gran daño (cost 2)" },
  ],
  aqua: [
    { id:"a1", name:"Burbuja",       emoji:"💧", dmg:40, shield:40, cost:1, effect:"chill",  effectVal:1,  type:"atk", desc:"Daño + Escudo + Chill" },
    { id:"a2", name:"Marea Alta",    emoji:"🌊", dmg:50, shield:0,  cost:1, effect:"defUp",  effectVal:15, type:"atk", desc:"Daño + DEF+15" },
    { id:"a3", name:"Escudo Coral",  emoji:"🪸", dmg:0,  shield:90, cost:1, effect:"regen",  effectVal:15, type:"def", desc:"Escudo masivo + Regen" },
    { id:"a4", name:"Tifón",         emoji:"🌀", dmg:70, shield:30, cost:2, effect:"stun",   effectVal:1,  type:"atk", desc:"Daño+Escudo+Stun (cost2)" },
  ],
  bird: [
    { id:"bd1",name:"Picotazo",      emoji:"🦅", dmg:70, shield:0,  cost:1, effect:"bleed",  effectVal:10, type:"atk", desc:"Rápido + Sangrado" },
    { id:"bd2",name:"Plumaje",       emoji:"🪶", dmg:50, shield:20, cost:1, effect:"atkUp",  effectVal:30, type:"atk", desc:"Daño + ATK+30" },
    { id:"bd3",name:"Viento Afilado",emoji:"💨", dmg:90, shield:0,  cost:1, effect:null,     effectVal:0,  type:"atk", desc:"Daño muy alto" },
    { id:"bd4",name:"Nido Seguro",   emoji:"🪹", dmg:0,  shield:50, cost:0, effect:"regen",  effectVal:20, type:"def", desc:"Escudo + Regen (gratis)" },
  ],
  bug: [
    { id:"g1", name:"Aguijón",       emoji:"🐝", dmg:50, shield:10, cost:1, effect:"poison", effectVal:20, type:"atk", desc:"Veneno 20HP/turno" },
    { id:"g2", name:"Tela Venenosa", emoji:"🕸️", dmg:30, shield:20, cost:1, effect:"poison", effectVal:30, type:"atk", desc:"Veneno intenso" },
    { id:"g3", name:"Pinza Ácida",   emoji:"🦂", dmg:60, shield:0,  cost:1, effect:"bleed",  effectVal:20, type:"atk", desc:"Daño + Sangrado" },
    { id:"g4", name:"Caparazón",     emoji:"🐚", dmg:0,  shield:70, cost:1, effect:"defUp",  effectVal:25, type:"def", desc:"Escudo + DEF+25" },
  ],
  reptile: [
    { id:"r1", name:"Escama",        emoji:"🦎", dmg:30, shield:60, cost:1, effect:"defUp",  effectVal:30, type:"def", desc:"Escudo sólido + DEF" },
    { id:"r2", name:"Cola Pesada",   emoji:"🐊", dmg:60, shield:30, cost:1, effect:"stun",   effectVal:1,  type:"atk", desc:"Daño + Aturde" },
    { id:"r3", name:"Veneno Reptil", emoji:"☠️", dmg:40, shield:20, cost:1, effect:"poison", effectVal:15, type:"atk", desc:"Veneno moderado" },
    { id:"r4", name:"Muda de Piel",  emoji:"🔄", dmg:0,  shield:50, cost:0, effect:"regen",  effectVal:30, type:"def", desc:"Escudo + Regen (gratis)" },
  ],
  dawn: [
    { id:"dw1",name:"Luz Solar",     emoji:"☀️", dmg:50, shield:20, cost:1, effect:"atkUp",  effectVal:25, type:"atk", desc:"Daño + ATK Up" },
    { id:"dw2",name:"Bendición",     emoji:"✨", dmg:0,  shield:30, cost:1, effect:"regen",  effectVal:35, type:"heal",desc:"Sana + Escudo" },
    { id:"dw3",name:"Golpe Sagrado", emoji:"💫", dmg:70, shield:10, cost:1, effect:"stun",   effectVal:1,  type:"atk", desc:"Daño + Stun" },
    { id:"dw4",name:"Halo",          emoji:"🌟", dmg:40, shield:40, cost:2, effect:"defUp",  effectVal:40, type:"def", desc:"Escudo masivo (cost2)" },
  ],
  dusk: [
    { id:"dk1",name:"Sombra",        emoji:"🌑", dmg:50, shield:30, cost:1, effect:"bleed",  effectVal:10, type:"atk", desc:"Daño oscuro + Sangrado" },
    { id:"dk2",name:"Vacío",         emoji:"🕳️", dmg:70, shield:0,  cost:1, effect:"chill",  effectVal:1,  type:"atk", desc:"Daño + Chill" },
    { id:"dk3",name:"Barrera Oscura",emoji:"🛡️", dmg:0,  shield:80, cost:1, effect:"defUp",  effectVal:20, type:"def", desc:"Gran escudo oscuro" },
    { id:"dk4",name:"Abismo",        emoji:"🌀", dmg:90, shield:0,  cost:2, effect:"stun",   effectVal:1,  type:"atk", desc:"Daño masivo+Stun (cost2)" },
  ],
};

export const ENEMY_TEMPLATES = [
  { name:"Slime",           emoji:"🟢", cls:"plant",   hp:220, atk:28, def:20, speed:29, morale:35, xp:50,
    cards:[{name:"Baba",emoji:"🟢",dmg:35,shield:20,cost:1,effect:"bleed",effectVal:8,type:"atk"},{name:"División",emoji:"✂️",dmg:20,shield:30,cost:1,effect:null,effectVal:0,type:"def"}] },
  { name:"Cangrejo",        emoji:"🦀", cls:"reptile", hp:300, atk:42, def:40, speed:22, morale:38, xp:80,
    cards:[{name:"Pinza",emoji:"🦀",dmg:55,shield:25,cost:1,effect:"stun",effectVal:1,type:"atk"},{name:"Caparazón",emoji:"🐚",dmg:0,shield:70,cost:1,effect:"defUp",effectVal:20,type:"def"}] },
  { name:"Murciélago",      emoji:"🦇", cls:"bird",    hp:170, atk:55, def:18, speed:61, morale:43, xp:70,
    cards:[{name:"Chillido",emoji:"📣",dmg:45,shield:0,cost:1,effect:"stun",effectVal:1,type:"atk"},{name:"Vuelo",emoji:"🦇",dmg:65,shield:0,cost:1,effect:"bleed",effectVal:12,type:"atk"}] },
  { name:"Golem",           emoji:"🗿", cls:"dusk",    hp:500, atk:50, def:55, speed:18, morale:35, xp:150,
    cards:[{name:"Puño",emoji:"👊",dmg:70,shield:40,cost:1,effect:null,effectVal:0,type:"atk"},{name:"Tierra",emoji:"🌍",dmg:40,shield:80,cost:1,effect:"defUp",effectVal:30,type:"def"}] },
  { name:"Dragón",          emoji:"🐲", cls:"beast",   hp:380, atk:68, def:35, speed:39, morale:55, xp:180,
    cards:[{name:"Fuego",emoji:"🔥",dmg:90,shield:0,cost:1,effect:"bleed",effectVal:20,type:"atk"},{name:"Garra",emoji:"🐲",dmg:70,shield:20,cost:1,effect:"atkUp",effectVal:20,type:"atk"}] },
  { name:"Fantasma",        emoji:"👻", cls:"dawn",    hp:250, atk:60, def:15, speed:55, morale:50, xp:120,
    cards:[{name:"Maldición",emoji:"😈",dmg:55,shield:0,cost:1,effect:"poison",effectVal:20,type:"atk"},{name:"Posesión",emoji:"👻",dmg:40,shield:10,cost:1,effect:"bleed",effectVal:15,type:"atk"}] },
  { name:"Rey Slime",       emoji:"👑", cls:"plant",   hp:700, atk:70, def:50, speed:35, morale:60, xp:400, isBoss:true,
    cards:[{name:"División",emoji:"✂️",dmg:80,shield:40,cost:1,effect:"bleed",effectVal:20,type:"atk"},{name:"Absorción",emoji:"🌀",dmg:50,shield:60,cost:1,effect:"regen",effectVal:30,type:"def"}] },
  { name:"Hidra Marina",    emoji:"🐙", cls:"aqua",    hp:600, atk:65, def:45, speed:42, morale:50, xp:350, isBoss:true,
    cards:[{name:"Tentáculo",emoji:"🐙",dmg:75,shield:30,cost:1,effect:"stun",effectVal:1,type:"atk"},{name:"Tinta",emoji:"🖤",dmg:50,shield:50,cost:1,effect:"poison",effectVal:25,type:"def"}] },
  { name:"Dragón Ancestral",emoji:"🔱", cls:"beast",   hp:800, atk:85, def:40, speed:45, morale:70, xp:500, isBoss:true,
    cards:[{name:"Tornado",emoji:"🌪️",dmg:100,shield:20,cost:1,effect:"bleed",effectVal:25,type:"atk"},{name:"Escama",emoji:"⚜️",dmg:60,shield:60,cost:1,effect:"atkUp",effectVal:30,type:"atk"}] },
];

export const MAPS = [
  { id:1, name:"Pradera Esmeralda", emoji:"🌄", accent:"#22c55e", stages:3, enemies:[0,1], bossIdx:6,
    story:"Los slimes corrompen los campos. ¡Defiende la pradera!" },
  { id:2, name:"Costa Tempestuosa", emoji:"🌊", accent:"#06b6d4", stages:4, enemies:[1,2], bossIdx:7,
    story:"Criaturas del abismo emergieron. El faro está apagado." },
  { id:3, name:"Cavernas Malditas", emoji:"⛏️", accent:"#8b5cf6", stages:5, enemies:[3,5], bossIdx:8,
    story:"En las profundidades duerme algo muy antiguo..." },
];
