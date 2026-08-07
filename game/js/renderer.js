// The only file that touches ctx. See SPEC.md §2.2.

/**
 * Internal resolution. All game code draws in this space and never reads
 * window size. Do not change these.
 */
export const WIDTH = 480;
export const HEIGHT = 270;

/**
 * Largest integer multiple of the internal resolution that fits the viewport.
 *
 * Integer-only. Fractional scaling would fill the viewport but destroy square
 * pixels, which is the whole look. Letterbox instead.
 */
export function computeScale(viewportW, viewportH, canvasW = WIDTH, canvasH = HEIGHT) {
  return Math.max(1, Math.floor(Math.min(viewportW / canvasW, viewportH / canvasH)));
}

/** Apply the integer scale to a canvas element via CSS. Browser-only. */
export function fitCanvas(canvas) {
  const scale = computeScale(window.innerWidth, window.innerHeight, canvas.width, canvas.height);
  canvas.style.width = `${canvas.width * scale}px`;
  canvas.style.height = `${canvas.height * scale}px`;
  return scale;
}

/** A 2D context with smoothing off — pixel art must never be interpolated. */
export function getContext(canvas) {
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  return ctx;
}

export function clear(ctx, colour = '#000') {
  ctx.fillStyle = colour;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
}

/**
 * Draw entities back-to-front.
 *
 * y is DEPTH, not height: larger y is nearer the viewer, so ascending y means
 * characters further back render first and are overlapped by those in front.
 * Screen position is (x - camera.x, y - z).
 */
export function drawSorted(ctx, entities, camera, drawEntity) {
  const ordered = [...entities].sort((a, b) => a.y - b.y);
  for (const e of ordered) drawEntity(ctx, e, Math.round(e.x - camera.x), Math.round(e.y - e.z));
}
