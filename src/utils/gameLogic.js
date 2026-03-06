import { CLASSES, CARD_POOL, ENEMY_TEMPLATES } from '../data/constants';

let _uid = 1000;
export function uid() { return ++_uid; }

export function buildAxie(cls, level = 1, position = "back") {
  const c = CLASSES[cls];
  const scale = 1 + (level - 1) * 0.08;
  const cards = CARD_POOL[cls];
  const deck = [...cards, ...cards].map(card => ({ ...card, uid: uid() }));
  return {
    id: uid(), cls, level, position,
    maxHp: Math.round(c.baseHp * scale),
    hp:    Math.round(c.baseHp * scale),
    atk:   Math.round(c.baseAtk * scale),
    def:   Math.round(c.baseDef * scale),
    speed: c.baseSpeed,
    morale: c.baseMorale,
    shield: 0, status: null, stunned: false, atkBuff: 0,
    emoji: c.emoji, color: c.color, role: c.role,
    deck,
    hand: [],
  };
}

export function buildEnemy(templateIdx, stageLevel = 1) {
  const t = ENEMY_TEMPLATES[templateIdx];
  const scale = 1 + (stageLevel - 1) * 0.3;
  const c = CLASSES[t.cls] || CLASSES.beast;
  return {
    id: uid(), name: t.name, emoji: t.emoji, cls: t.cls,
    maxHp: Math.round(t.hp * scale),
    hp:    Math.round(t.hp * scale),
    atk:   Math.round(t.atk * scale),
    def:   Math.round(t.def * scale),
    speed: t.speed, morale: t.morale,
    shield: 0, status: null, stunned: false, atkBuff: 0,
    color: c.color, xp: t.xp,
    isBoss: t.isBoss || false,
    cards: t.cards,
  };
}

export function drawCards(axie, count = 4) {
  const pool = [...axie.deck];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return { ...axie, hand: pool.slice(0, count).map(c => ({ ...c, uid: uid() })) };
}

export function critChance(morale) { return morale / 250; }

export function calcDmg(atk, cardDmg, def, isCrit, comboBonus, atkBuff) {
  const base = Math.max(1, (atk + cardDmg + atkBuff) - Math.floor(def * 0.35));
  const crit = isCrit ? 1.5 : 1;
  const combo = 1 + comboBonus * 0.12;
  const variance = 0.9 + Math.random() * 0.2;
  return Math.round(base * crit * combo * variance);
}

export function applyEffect(target, effect, effectVal) {
  if (!effect) return target;
  if (effect === "stun") return { ...target, stunned: true };
  if (effect === "defUp") return { ...target, def: target.def + effectVal };
  if (effect === "atkUp") return { ...target, atkBuff: (target.atkBuff || 0) + effectVal };
  if (effect === "regen") return { ...target, hp: Math.min(target.maxHp, target.hp + effectVal) };
  const dotTypes = ["bleed", "poison", "chill"];
  if (dotTypes.includes(effect)) return { ...target, status: { type: effect, val: effectVal, turns: 3 } };
  return target;
}

export function tickStatus(unit) {
  if (!unit.status) return { unit, logs: [] };
  const logs = [];
  let u = { ...unit };
  const { type, val, turns } = u.status;
  if (type === "bleed" || type === "poison") {
    u.hp = Math.max(0, u.hp - val);
    logs.push({ text: `${u.emoji} ${type === "bleed" ? "🩸-" : "☠️-"}${val} HP por ${type}`, color: type === "bleed" ? "#ef4444" : "#a855f7" });
  }
  if (type === "chill") logs.push({ text: `${u.emoji} ❄️ Chill activo`, color: "#06b6d4" });
  u.status = turns - 1 <= 0 ? null : { ...u.status, turns: turns - 1 };
  return { unit: u, logs };
}
