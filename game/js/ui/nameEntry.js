/**
 * Three arcade initials. No accounts, no personal data — identity in this game
 * is exactly three characters, matching /^[A-Z_]{3}$/.
 */

import { WIDTH } from '../renderer.js';

/** A-Z then underscore, so a blank is a deliberate choice rather than a gap. */
export const ALPHABET = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ_'];
export const SLOTS = 3;

export function createNameEntry(initial = '___') {
  const chars = initial.toUpperCase().slice(0, SLOTS).padEnd(SLOTS, '_').split('');
  return {
    indices: chars.map((c) => Math.max(0, ALPHABET.indexOf(c))),
    slot: 0,
    confirmed: false,
  };
}

export function nameOf(s) {
  return s.indices.map((i) => ALPHABET[i]).join('');
}

/** Cycle the current slot. Wraps in both directions. */
export function cycle(s, delta) {
  const n = ALPHABET.length;
  s.indices[s.slot] = (((s.indices[s.slot] + delta) % n) + n) % n;
  return s;
}

/** Move between slots. Clamps rather than wrapping — wrapping loses the edge. */
export function moveSlot(s, delta) {
  s.slot = Math.min(SLOTS - 1, Math.max(0, s.slot + delta));
  return s;
}

export function confirm(s) {
  s.confirmed = true;
  return s;
}

/** @param {object} intent {up, down, left, right, accept} — edges, not levels. */
export function updateNameEntry(s, intent) {
  if (s.confirmed) return s;
  if (intent.up) cycle(s, 1);
  if (intent.down) cycle(s, -1);
  if (intent.left) moveSlot(s, -1);
  if (intent.right) moveSlot(s, 1);
  if (intent.accept) confirm(s);
  return s;
}

export function drawNameEntry(ctx, s, frame = 0) {
  ctx.fillStyle = '#12101A';
  ctx.fillRect(0, 0, WIDTH, 270);

  ctx.fillStyle = '#F2F2F8';
  ctx.font = '8px monospace';
  ctx.fillText('ENTER YOUR INITIALS', 178, 96);

  ctx.font = '16px monospace';
  for (let i = 0; i < SLOTS; i += 1) {
    const x = 206 + i * 28;
    const active = i === s.slot && !s.confirmed;
    // Blink the active slot so the cursor reads without a label.
    if (active && Math.floor(frame / 20) % 2 === 0) continue;
    ctx.fillStyle = active ? '#F2C75C' : '#F2F2F8';
    ctx.fillText(ALPHABET[s.indices[i]], x, 136);
  }

  ctx.fillStyle = '#8A8A9A';
  ctx.font = '8px monospace';
  ctx.fillText('↑↓ change   ←→ move   E confirm', 158, 168);
}
