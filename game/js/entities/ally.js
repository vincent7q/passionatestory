/**
 * The roster: everyone the candidate helped up.
 *
 * The candidate reads this as a classic beat-'em-up beat — show a man respect
 * and he joins you. The truth is that they are staff who were briefed to
 * respond well to decency, and they were never on a side.
 *
 * Two distinct things, and conflating them breaks the payoff:
 *
 *   ROSTER — everyone ever helped up this run. PERMANENT. This is what
 *            林建國's 召集 Summon checks against in the final fight: anyone you
 *            helped refuses to come and fight you.
 *   ACTIVE — exactly one, callable once per fight with Q. Swappable at
 *            checkpoints. Swapping changes who fights beside you, NEVER who is
 *            on the roster.
 */

import { State, Team } from './entity.js';

/** Techniques taught by each opponent type, between stages, permanently. */
export const TECHNIQUES = {
  office_worker: { id: 'briefcase_swing', name: { en: 'Briefcase Swing', zh: '公事包揮擊' } },
  scalper: { id: 'fruit_toss', name: { en: 'Fruit Toss', zh: '丟水果' } },
  delivery_rider: { id: 'drive_by', name: { en: 'Drive-By', zh: '外送衝刺' } },
  groundskeeper: { id: 'hedge_sweep', name: { en: 'Hedge Sweep', zh: '修剪掃擊' } },
  estate_security: { id: 'parry_stance', name: { en: 'Parry Stance', zh: '格擋架式' } },
  second_uncle: { id: 'iron_mountain', name: { en: 'Iron Mountain Lean', zh: '鐵山靠' } },
};

export function createRoster() {
  return { members: [], activeId: null, calledThisFight: false };
}

/**
 * Record someone as helped up. Permanent for the run, and idempotent — the
 * same opponent must never count twice, or the hidden column inflates.
 */
export function addToRoster(roster, entity) {
  if (roster.members.some((m) => m.id === entity.id)) return false;

  roster.members.push({
    id: entity.id,
    enemyType: entity.enemyType ?? 'office_worker',
    charId: entity.charId,
    technique: TECHNIQUES[entity.enemyType]?.id ?? null,
  });

  // The first person you help becomes your active ally automatically; after
  // that it is a deliberate choice at a checkpoint.
  if (roster.activeId === null) roster.activeId = entity.id;
  return true;
}

export function isOnRoster(roster, entityId) {
  return roster.members.some((m) => m.id === entityId);
}

export function rosterSize(roster) {
  return roster.members.length;
}

export function getActive(roster) {
  return roster.members.find((m) => m.id === roster.activeId) ?? null;
}

/** Swap the active ally. Never touches the roster itself. */
export function setActive(roster, entityId) {
  if (!isOnRoster(roster, entityId)) return false;
  roster.activeId = entityId;
  return true;
}

/** Techniques learned, in the order they were taught. */
export function techniques(roster) {
  return roster.members.map((m) => m.technique).filter(Boolean);
}

// ── Calling an ally ──────────────────────────────────────────────────────────

export function canCallAlly(roster) {
  return roster.activeId !== null && !roster.calledThisFight;
}

export function callAlly(roster) {
  if (!canCallAlly(roster)) return null;
  roster.calledThisFight = true;
  return getActive(roster);
}

/** Reset at the start of each fight — one call per fight, not per run. */
export function resetFight(roster) {
  roster.calledThisFight = false;
  return roster;
}

// ── The payoff ───────────────────────────────────────────────────────────────

/**
 * 召集 Summon. Every 20s the final boss calls two relatives — and ANYONE THE
 * CANDIDATE HELPED UP REFUSES TO COME.
 *
 * This is the payoff for every ten-second decision made across the whole run.
 * A candidate with a full roster fights Phase 1 almost alone.
 *
 * @param roster     the run's roster
 * @param candidates entities the boss would like to summon
 * @returns {{summoned: object[], refused: object[]}}
 */
export function resolveSummon(roster, candidates) {
  const summoned = [];
  const refused = [];
  for (const c of candidates) {
    (isOnRoster(roster, c.id) ? refused : summoned).push(c);
  }
  return { summoned, refused };
}

/** Flip a dazed opponent to your side. Presentation and team only. */
export function convertToAlly(entity) {
  entity.state = State.ALLIED;
  entity.team = Team.PLAYER;
  entity.power = Math.max(1, Math.round(entity.powerMax * 0.5));
  entity.dazeSteps = 0;
  return entity;
}
