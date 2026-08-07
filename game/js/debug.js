import { WIDTH } from './renderer.js';

/**
 * Rolling frame-time tracker. Pure, so it is testable; the overlay that draws
 * it is not. This is how success criterion C6 (stable 60 FPS in Chrome and
 * Firefox) gets verified, so it exists from Phase 0 rather than the end.
 */
export function createFpsTracker(sampleSize = 60) {
  return { samples: [], sampleSize };
}

export function pushFrameTime(tracker, frameMs) {
  tracker.samples.push(frameMs);
  if (tracker.samples.length > tracker.sampleSize) tracker.samples.shift();
  return tracker;
}

export function averageFps(tracker) {
  if (tracker.samples.length === 0) return 0;
  const mean = tracker.samples.reduce((a, b) => a + b, 0) / tracker.samples.length;
  return mean > 0 ? 1000 / mean : 0;
}

/** Worst frame in the window — the number that actually reveals stutter. */
export function worstFrameMs(tracker) {
  return tracker.samples.length ? Math.max(...tracker.samples) : 0;
}

export function drawOverlay(ctx, { tracker, steps, entityCount, state }) {
  const lines = [
    `fps ${averageFps(tracker).toFixed(1)}`,
    `worst ${worstFrameMs(tracker).toFixed(1)}ms`,
    `steps ${steps}`,
    `ents ${entityCount}`,
    `${state}`,
  ];
  ctx.save();
  ctx.globalAlpha = 0.75;
  ctx.fillStyle = '#000';
  ctx.fillRect(WIDTH - 84, 0, 84, lines.length * 9 + 4);
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#7CFC7C';
  ctx.font = '8px monospace';
  lines.forEach((l, i) => ctx.fillText(l, WIDTH - 80, 11 + i * 9));
  ctx.restore();
}
