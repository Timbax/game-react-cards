import { AXIE_PARTS } from "../data/gameData";

export function createAxie(type, level = 1) {
  const part = AXIE_PARTS[type];
  return {
    type, level,
    maxHp: 200 + level * 20,
    hp:    200 + level * 20,
    atk:   part.dmg + level * 3,
    def:   part.shield + level * 2,
    speed: 10 + (type === "bird" ? 8 : type === "bug" ? 5 : 2),
    energy: 3,
    maxEnergy: 3,
    status: null,
    statusTurns: 0,
    emoji: part.emoji,
    color: part.color,
    skill: part.skill,
    effect: part.effect,
  };
}

export function createEnemy(template, stageLevel = 1) {
  const scale = 1 + (stageLevel - 1) * 0.25;
  return {
    ...template,
    maxHp: Math.round(template.hp * scale),
    hp:    Math.round(template.hp * scale),
    atk:   Math.round(template.atk * scale),
    def:   Math.round(template.def * scale),
    status: null,
    statusTurns: 0,
  };
}

export function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

export function calcDamage(atk, def) {
  const raw = Math.max(5, atk - Math.floor(def * 0.4));
  const variance = Math.floor(Math.random() * 11) - 5;
  return raw + variance;
}

export function generateStars(count = 30) {
  return [...Array(count)].map((_, i) => ({
    id: i,
    top: Math.random() * 100,
    left: Math.random() * 100,
    width: Math.random() * 3 + 1,
    height: Math.random() * 3 + 1,
    opacity: Math.random() * 0.6 + 0.2,
    animDuration: Math.random() * 3 + 2,
  }));
}

export function generateAxieAnimations() {
  return Object.entries(AXIE_PARTS).map(([type, p]) => ({
    type,
    emoji: p.emoji,
    color: p.color,
    duration: 2 + Math.random(),
  }));
}
