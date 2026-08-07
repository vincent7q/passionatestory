# 熱血物語：見家長 — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan
> task-by-task. **After every single task, update `progress.md` and commit.** That file is the only
> thing that makes this work resumable on another machine.

**Goal:** Ship a browser beat-'em-up whose HUD is secretly a marriage evaluation, with a SQLite
leaderboard, no build step, and a hidden third criterion the player never sees until the end.

**Architecture:** Plain ES modules loaded directly by the browser. One canvas at a fixed 480×270,
CSS-upscaled by integer multiples. Fixed 1/60s timestep. 2.5D coordinates (`x` horizontal, `y`
depth, `z` jump height). All sprites drawn procedurally at boot behind `assets.js`. A single Fastify
process serves the game, the dashboard, and `/api/*`; `shared/` is imported by both the browser and
Node so scoring exists exactly once.

**Tech Stack:** Node ≥22 · Fastify 5 · `@fastify/static` · `better-sqlite3` · `node --test` ·
Canvas 2D · Web Audio. **No bundler, no transpiler, no framework, no game engine.**

**Read first:** `SPEC.md` (contracts and constants) · `docs/story.md` (narrative bible, outranks
everything on story) · `docs/PRD.md` (mechanics and rosters) · `CLAUDE.md` (conventions, spoiler
discipline).

---

## How to work this plan

**Every task follows the same loop.** It is five steps and none of them are optional:

1. Write the failing test.
2. Run it. **Confirm it fails, and fails for the reason you expect.**
3. Write the minimum code to pass.
4. Run it. Confirm it passes. Run the whole suite: `node --test test/`.
5. Update `progress.md`, then commit test + implementation + progress together.

**Tasks marked `[no-test]`** are rendering, audio, or layout work that cannot be meaningfully unit
tested (see `SPEC.md` §12). For those: implement, verify by running the game and looking at it, note
what you checked in `progress.md`, commit. Do not fake a test to make the loop look tidy.

**Commit message convention:** `T<n>: <what>` — e.g. `T12: masher run cannot reach 71`. The task
number makes `progress.md` unambiguous across machines.

**Do not skip ahead.** Phase 6 depends on Phase 4 existing and working. `docs/PRD.md` §17 is
explicit: build stage 1 completely, prove the hidden system end to end on a small surface, then
scale.

---

## Phase 0 — Foundation

Goal: `npm run dev`, open a browser, see a canvas ticking at 60 FPS. Nothing else.

### T1: Dependencies and test skeleton

**Files:**
- Modify: `package.json`
- Create: `test/smoke.test.js`

**Step 1:** Add `better-sqlite3` to dependencies:

```bash
npm install better-sqlite3
```

**Step 2:** Write the smoke test at `test/smoke.test.js`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';

test('test runner works', () => {
  assert.equal(1 + 1, 2);
});
```

**Step 3:** Run `node --test test/` — expect 1 pass.

**Step 4:** Commit.

```bash
git add package.json package-lock.json test/smoke.test.js progress.md
git commit -m "T1: add better-sqlite3, test skeleton"
```

---

### T2: Fastify server serving static files

**Files:**
- Create: `server/index.js`
- Create: `test/server/static.test.js`

**Step 1:** Write the failing test:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildServer } from '../../server/index.js';

test('GET /healthz returns ok', async () => {
  const app = await buildServer({ dbPath: ':memory:' });
  const res = await app.inject({ method: 'GET', url: '/healthz' });
  assert.equal(res.statusCode, 200);
  assert.equal(res.json().status, 'ok');
  await app.close();
});
```

**Step 2:** Run it. Expect failure — module not found.

**Step 3:** Implement `server/index.js`. It must export `buildServer()` for tests **and** start a
listener when run directly:

```js
import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

export async function buildServer(opts = {}) {
  const app = Fastify({ logger: opts.logger ?? false });

  // The game is the site root.
  await app.register(fastifyStatic, { root: join(ROOT, 'game'), prefix: '/' });
  // shared/ is served so the BROWSER can import the same modules Node does.
  await app.register(fastifyStatic, {
    root: join(ROOT, 'shared'), prefix: '/shared/', decorateReply: false,
  });
  await app.register(fastifyStatic, {
    root: join(ROOT, 'dashboard'), prefix: '/dashboard/', decorateReply: false,
  });

  app.get('/healthz', async () => ({ status: 'ok' }));

  return app;
}

// Only listen when executed directly, never when imported by a test.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const app = await buildServer({ logger: true });
  const port = Number(process.env.PORT ?? 8080);
  await app.listen({ port, host: '0.0.0.0' });
}
```

**Step 4:** Run `node --test test/` — expect pass.

**Step 5:** Commit as `T2: fastify server with static + healthz`.

---

### T3: Canvas page with integer upscaling `[no-test]`

**Files:**
- Create: `game/index.html`, `game/css/style.css`

**`game/index.html`** — the canvas is fixed at 480×270 internally, forever:

```html
<!doctype html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no">
  <title>熱血物語：見家長</title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <div id="frame"><canvas id="screen" width="480" height="270"></canvas></div>
  <script type="module" src="/js/main.js"></script>
</body>
</html>
```

**`game/css/style.css`** — the critical rules:

```css
html, body { margin: 0; height: 100%; background: #000; overflow: hidden; }
#frame { display: grid; place-items: center; height: 100%; }
#screen {
  image-rendering: pixelated;
  transform-origin: center;
}
```

**Step 1:** Implement the integer-scale sizing in JS (it cannot be done in pure CSS). In
`game/js/renderer.js`, export:

```js
export function fitCanvas(canvas) {
  const scale = Math.max(1, Math.floor(
    Math.min(window.innerWidth / canvas.width, window.innerHeight / canvas.height)
  ));
  canvas.style.width  = `${canvas.width  * scale}px`;
  canvas.style.height = `${canvas.height * scale}px`;
  return scale;
}
```

**Never** use a fractional scale to fill the viewport. Letterbox instead. This is what keeps pixels
square.

**Step 2:** Verify by running `npm run dev` and resizing the window — the canvas should jump between
whole multiples and stay crisp.

**Step 3:** Commit as `T3: canvas page, integer upscaling`.

---

### T4: Fixed-timestep game loop

**Files:**
- Create: `game/js/main.js`, `game/js/utils.js`
- Create: `test/game/loop.test.js`

The accumulator is pure and therefore testable. Extract it.

**Step 1:** Write the failing test:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stepCount, STEP_MS, MAX_FRAME_MS } from '../../game/js/utils.js';

test('accumulates whole steps and returns the remainder', () => {
  assert.deepEqual(stepCount(0, STEP_MS * 3), { steps: 3, remainder: 0 });
});

test('holds a partial step in the remainder', () => {
  const r = stepCount(0, STEP_MS * 1.5);
  assert.equal(r.steps, 1);
  assert.ok(Math.abs(r.remainder - STEP_MS * 0.5) < 1e-9);
});

test('clamps a long stall so the loop cannot death-spiral', () => {
  const r = stepCount(0, 10_000);
  assert.equal(r.steps, Math.floor(MAX_FRAME_MS / STEP_MS));
});
```

**Step 2:** Run it. Expect failure.

**Step 3:** Implement in `game/js/utils.js`:

```js
export const STEP_MS = 1000 / 60;
export const MAX_FRAME_MS = 250;

export function stepCount(carry, elapsedMs) {
  const budget = carry + Math.min(elapsedMs, MAX_FRAME_MS);
  const steps = Math.floor(budget / STEP_MS);
  return { steps, remainder: budget - steps * STEP_MS };
}

export const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
export const clamp01 = (v) => clamp(v, 0, 1);
export const lerp = (a, b, t) => a + (b - a) * t;
```

**Step 4:** Wire the loop in `main.js` using `stepCount`. `update()` runs per step; `render()` once
per frame. **Never scale a gameplay value by a variable `dt`.**

**Step 5:** Run tests, commit as `T4: fixed timestep loop`.

---

### T5: Debug frame-time overlay `[no-test]`

Toggle with `` ` ``. Shows FPS, step count, entity count. This is how C6 gets verified later, so
build it now rather than at the end. Commit as `T5: debug overlay`.

---

## Phase 1 — `shared/`

**This is where correctness lives.** Every branch gets a test. These modules are imported by the
browser over HTTP *and* by Node, so: no `node:` imports, no `process`, no DOM, named exports only.

### T6: `shared/characters.js`

**Files:** Create `shared/characters.js`, `test/shared/characters.test.js`

Stats come from `docs/PRD.md` §3. Ids are `felix`, `lucian`, `hilman` — **`vincent` is not a
candidate id.**

**Step 1:** Test that all three exist, ids match `CANDIDATES`, and `vincent` is absent:

```js
test('vincent is not a candidate — he is the final boss', () => {
  assert.equal(CHARACTERS.vincent, undefined);
  assert.deepEqual(Object.keys(CHARACTERS), ['felix', 'lucian', 'hilman']);
});
```

**Step 2–5:** Implement, run, commit as `T6: shared/characters.js`.

---

### T7: `shared/scoring.js` — constants

**Files:** Create `shared/scoring.js`, `test/shared/scoring.test.js`

Export the constants from `SPEC.md` §7: `POWER_MAX`, `MONEY_MAX`, `JUDGMENT_MAX`, `GRADE_MAX`,
`FATHER_SCORE`, and the `JUDGMENT` award table.

**Test:** the three maxima sum to `GRADE_MAX`, and `FATHER_SCORE === 71`.

Commit as `T7: scoring constants`.

---

### T8: `computeMoney`

```js
export function computeMoney(run) {
  const { collected, totalAvailable } = run.money;
  if (totalAvailable <= 0) return 0;
  return Math.round(clamp01(collected / totalAvailable) * MONEY_MAX);
}
```

**Tests:** zero collected → 0 · all collected → 20 · half → 10 · over-collection clamps to 20 ·
`totalAvailable: 0` does not divide by zero.

Commit as `T8: computeMoney`.

---

### T9: `computeJudgment` — the hidden column

The most important function in the codebase. Clamp **last**, after the negatives.

```js
export function computeJudgment(run) {
  const j = run.judgment;
  let total = 0;
  total += j.helpUps * JUDGMENT.HELP_UP;
  total += j.strikesOnDowned * JUDGMENT.STRIKE_DOWNED;      // negative
  if (j.spareFruitStall)     total += JUDGMENT.SPARE_FRUIT_STALL;
  if (j.acceptedAllCups)     total += JUDGMENT.ACCEPT_ALL_CUPS;
  if (j.bowedOnBeat)         total += JUDGMENT.BOW_ON_CORRECT_BEAT;
  if (j.neverStruckDowned)   total += JUDGMENT.NEVER_STRIKE_DOWNED;
  if (j.neverStruckToddler)  total += JUDGMENT.NEVER_STRIKE_TODDLER;
  if (j.marketStallsIntact)  total += JUDGMENT.MARKET_STALLS_INTACT;
  total += punctualityPoints(j.arrivalMsBefore1800);
  return Math.round(clamp(total, 0, JUDGMENT_MAX));
}
```

**Tests:** an empty run → 0 · a violent run clamps at 0, never negative · a perfect run clamps at 40
· awards genuinely over-supply the cap (assert the unclamped sum exceeds 40) · three different
routes each reach 40 (mercy, restraint, set-pieces) · arriving late scores 0 punctuality, never
negative on its own.

Commit as `T9: computeJudgment`.

---

### T10: `computePower`

Three components, worth 20 / 10 / 10. Every target is a named tunable constant, never a literal in
the expression.

```js
export const POWER_TUNING = {
  DAMAGE_TARGET: 4000, COMBO_TARGET: 12, PAR_TIME_MS: 20 * 60 * 1000,
};

export function computePower(run) {
  const p = run.power;
  const combat   = clamp01(p.damageDealt / POWER_TUNING.DAMAGE_TARGET) * 12
                 + clamp01(p.longestCombo / POWER_TUNING.COMBO_TARGET) * 8;
  const survival = clamp01(p.powerRemaining / p.powerMax) * 10;
  const speed    = clamp01(POWER_TUNING.PAR_TIME_MS / Math.max(1, run.durationMs)) * 10;
  return Math.round(clamp(combat + survival + speed, 0, POWER_MAX));
}
```

**Tests:** a null run → 0 · a maximal run → 40 · each component contributes independently ·
`powerMax: 0` does not divide by zero.

Commit as `T10: computePower`.

---

### T11: `computeGrade` and `leaderboardValue`

```js
export function computeGrade(run) {
  const power = computePower(run), money = computeMoney(run), judgment = computeJudgment(run);
  return { power, money, judgment, total: power + money + judgment };
}
export const DIFFICULTY_MULTIPLIER = { easy: 0.75, normal: 1.0, hard: 1.35 };
export function leaderboardValue(grade, difficulty) {
  return grade * (DIFFICULTY_MULTIPLIER[difficulty] ?? 1.0);
}
```

**Tests:** total never exceeds 100 · a flawless hard run yields 135 · an unknown difficulty falls
back to 1.0 rather than `NaN`.

Commit as `T11: computeGrade, leaderboardValue`.

---

### T12: **The masher test — hard criterion C1** ⚠️

**Files:** Create `test/shared/scoring.masher.test.js`

This test is the design. If it fails, tune the constants — **never the test.**

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeGrade, FATHER_SCORE } from '../../shared/scoring.js';

// Maximal violence, zero restraint: every fight won by mashing, nobody helped up,
// downed opponents struck, the fruit stall wrecked, the market flattened.
const masherRun = {
  candidate: 'felix', difficulty: 'normal', durationMs: 16 * 60 * 1000,
  completed: true, stageReached: 3,
  power: { damageDealt: 99_999, longestCombo: 40, powerRemaining: 90, powerMax: 150,
           sectionTimesMs: [], bossTimesMs: [] },
  money: { collected: 100, totalAvailable: 100 },     // he picked up every coin
  judgment: {
    helpUps: 0, strikesOnDowned: 25,
    spareFruitStall: false, acceptedAllCups: false, bowedOnBeat: false,
    neverStruckDowned: false, neverStruckToddler: false, marketStallsIntact: false,
    arrivalMsBefore1800: -60_000,                     // late, because he stopped to fight
  },
};

test('C1: a mashing player cannot beat 71', () => {
  const g = computeGrade(masherRun);
  assert.equal(g.judgment, 0, 'restraint column must floor at zero, not go negative');
  assert.ok(g.total < FATHER_SCORE,
    `masher scored ${g.total}, which beats ${FATHER_SCORE}. The design has failed.`);
});

test('C1: a masher still lands in the intended 56-60 band', () => {
  const { total } = computeGrade(masherRun);
  assert.ok(total >= 50 && total <= 62, `expected 50-62, got ${total}`);
});

test('C1: a restraint player CAN beat 71', () => {
  const restraint = structuredClone(masherRun);
  restraint.power.damageDealt = 3000;
  restraint.power.longestCombo = 6;
  restraint.judgment = {
    helpUps: 8, strikesOnDowned: 0,
    spareFruitStall: true, acceptedAllCups: true, bowedOnBeat: true,
    neverStruckDowned: true, neverStruckToddler: true, marketStallsIntact: true,
    arrivalMsBefore1800: 120_000,
  };
  assert.ok(computeGrade(restraint).total > FATHER_SCORE);
});
```

Commit as `T12: C1 masher cannot beat 71`.

---

### T13: `shared/validation.js`

Implement `NAME_RE`, `MIN_RUN_MS`, `CANDIDATES`, `DIFFICULTIES`, `validateRun(run)` per `SPEC.md`
§11.4.

**Tests, one per rejection path:** lowercase name · 2-char name · 4-char name · `___` accepted ·
unknown candidate · `vincent` as candidate is rejected · unknown difficulty · `completed: true` with
`stageReached: 1` · duration below the floor for the claimed stage · a sub-score above its
theoretical max · negative counters · a valid run passes with `errors: []`.

Commit as `T13: shared/validation.js`.

---

## Phase 2 — Engine core

### T14: `input.js` — keyboard state `[partial test]`

Key-down/key-up into a state object; `justPressed` edge detection. The **edge detection is pure and
must be tested** — `E` firing twice on one press would let a player help someone up twice.

Commit as `T14: input.js`.

### T15: `physics.js` — footprint overlap

```js
export function boxesOverlap(a, b) { /* (x,y) footprints only, ignores z */ }
```

**Tests:** clear overlap · clear separation · edge-touching is not overlap · **same `x` but
different `y` does not overlap** (this is the depth rule that makes attacks miss).

Commit as `T15: physics footprint overlap`.

### T16: `physics.js` — `zRangesOverlap` and `canHit`

`canHit(attacker, target)` = footprint overlap **and** z overlap **and** correct facing **and**
attacker is in active frames. **Test that a grounded attack misses a jumping target.**

Commit as `T16: physics canHit`.

### T17: `physics.js` — integration

Gravity on `z` only. `y` is clamped to the walkable strip and **never** affected by gravity.
**Test explicitly that gravity does not alter `y`** — it is the easiest bug to write here.

Commit as `T17: physics integration`.

### T18: `camera.js`

Lookahead, lerp, clamp to section bounds. Pure function `nextCamera(cam, target, bounds)` — testable.

Commit as `T18: camera`.

### T19–T20: `assets.js` — the chibi rig `[no-test]`

Parameterised rig: head / torso / arms / legs posed per frame, tinted per character palette, cached
to offscreen canvases at boot. 32×48 base, head ≈ ½ body height. Palettes from `docs/images/*.png`.

Animations: idle 2 · walk 4 · light 3 · heavy 3 · jump 2 · hurt 1 · knockdown 2 · dazed loop 4 ·
special 4–6.

**The interface is the point:** `getFrame(charId, animName, frameIndex)` returns a canvas. Nothing
outside this file knows how it was drawn.

Commit as `T19: chibi rig` and `T20: animation frames`.

### T21: `renderer.js` — y-sorted draw `[no-test]`

Draw entities sorted by `y` **ascending** so characters further back render behind. Screen position
is `(x - camera.x, y - z)`.

Commit as `T21: y-sorted renderer`.

---

## Phase 3 — Entities & combat

| Task | Deliverable | Notes |
|---|---|---|
| **T22** | Entity factory + object pool | Cap ~50. Pool particles and projectiles. |
| **T23** | `player.js` — movement in x/y, jump on z | Test the movement resolver purely. |
| **T24** | Attack chains | Light strings into heavy; heavy finishers knock down. |
| **T25** | `enemy.js` + AI `IDLE→CHASE→ATTACK→RECOVER→STUN` | Test transitions as a pure reducer. |
| **T26** | Damage, knockback, knockdown | Flash white, fall, ~1s invincibility on rise. |
| **T27** | Guard and parry | Hold halves damage; parry on the impact frame staggers. |
| **T28** | Grabs and throws | Walk into a stunned enemy; throw into another. |
| **T29** | Weapons | Light picks up, heavy throws, limited uses then break. |
| **T30** | `item.js` — pickups and 錢 | Items per `docs/PRD.md` §9. |

Each is the full five-step loop. Commit per task.

---

## Phase 4 — The ten-second window ⚠️

**The mechanic the game is built around.** Everything before this was scaffolding.

### T31: `DAZED` state and the star timer

`DAZE_WINDOW_MS = 10_000`, exported from `shared/` as **one tuning constant** (it may become 8 or
12). Stars orbit the head and **visibly slow** as the timer runs out — that deceleration is the only
countdown the player ever gets.

**Test the timer as a pure function:** `dazeProgress(elapsed)` → 0..1, and the orbit speed curve
derived from it.

### T32: The **E** prompt

Appears above a dazed opponent in range. Contextual, small, and it **never explains why you would
want to press it.**

### T33: Help-up → `ALLIED`

Pressing **E** in range within the window flips `DAZED → ALLIED`. Outside the window, nothing
happens. **Test both edges** — at 9,999 ms it works, at 10,001 ms it does not.

### T34: Roster tracking

Every opponent helped up is recorded permanently for the run. **Test that a roster entry survives
the ally being swapped out** — this is what the final boss's summon checks.

### T35: Active ally and `Q`

Exactly one active, callable once per fight. Swap at checkpoints. **Test that swapping never mutates
the roster.**

### T36: The strike-on-downed penalty

Striking a `DAZED` or downed opponent is the single heaviest penalty in the game. Increment
`judgment.strikesOnDowned` and clear `neverStruckDowned`. **Test that it fires once per strike, not
once per frame of contact** — the highest-value bug in this phase.

Commit each task separately.

---

## Phase 5 — HUD

### T37 / T38 / T39: Bars, clock, counter `[no-test]`

Match `docs/1.jpg` / `docs/2.jpg` and `SPEC.md` §9. One commit each.

- **T37 — the bars.** 力 green segmented + numeric `n/max`, 氣 orange below it, EXP vertical bar far
  left, portrait, `Lv.N` beneath.
- **T38 — the clock.** Centred, large, counting toward 18:00. **It is never labelled.** It is a
  number, and every player will read it as a rescue timer. It is dinner.
- **T39 — the 錢 counter.** Top right, coin icon, thousands separator.

### T40: Damage numbers and the restraint award `[no-test]`

White on hit · yellow and larger on critical · green with `+` on heal.

**The restraint award is a bare gold `+3` with a small seal icon and NO LABEL.** This is the single
easiest place in the project to leak the twist.

### T41: **The spoiler test — hard criterion C2** ⚠️

**Files:** Create `test/game/spoiler.test.js`

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

// The ONLY two files permitted to contain 禮. Its first appearance in the entire
// game is the evaluation form.
const ALLOWED = new Set(['game/js/ui/evaluation.js', 'game/js/ui/reveal.js']);

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(js|html|css)$/.test(e)) out.push(p);
  }
  return out;
}

test('C2: 禮 never appears outside the evaluation form', () => {
  const offenders = walk('game')
    .filter((p) => readFileSync(p, 'utf8').includes('禮'))
    .map((p) => p.replaceAll('\\', '/'))
    .filter((p) => !ALLOWED.has(p));
  assert.deepEqual(offenders, [], `禮 leaked into: ${offenders.join(', ')}`);
});
```

This is a blunt instrument and that is deliberate. If it fails, you leaked the twist.

Commit as `T41: C2 spoiler discipline test`.

---

## Phase 6 — Stage 1, complete

`docs/PRD.md` §17: **build stage 1 completely before starting stage 2.**

| Task | Deliverable |
|---|---|
| **T42** | `stages/stage.js` — sections, spawn waves, boss arena, auto-advance |
| **T43** | Parallax: `layer.x = -camera.x * factor` |
| **T44** | `stages/city.js` — Market Row → Covered Arcade → Loading Bay → Fruit Stall |
| **T45** | Enemies: 上班族 30 · 代購黃牛 35 · 外送員 40 (PRD §6.1) |
| **T46** | Rain hazard — outside cover 力 bleeds 1/sec; 手帕 or an awning stops it |
| **T47** | Breakable market stalls. **Nothing tells the player not to smash them.** Intact = +6 |
| **T48** | Boss 水果店老闆娘 — 小雨's aunt, 300 HP |
| **T49** | **The melon: its own 40 HP.** Any connecting hit damages it. Sparing it = +8 |
| **T50** | Stage clear → next-stage transition |

**T49 is the sharpest 禮 test in the game.** Beat her without touching the melon and she points up
the road. Destroy it and she sits down in the wreckage — **no penalty is stated on screen.** The file
records it.

Commit per task.

---

## Phase 7 — The evaluation form, end to end

Do this **now**, not at the end. `docs/PRD.md` §17 wants the hidden system proved end to end on a
small surface before scaling to three stages.

| Task | Deliverable |
|---|---|
| **T51** | Run accumulator — collect the `SPEC.md` §7.2 payload during play |
| **T52** | `ui/evaluation.js` — the form, in 林建國's handwriting |
| **T53** | Pacing: 力 and 錢 animate in first and **land as a victory**; then 禮 writes itself in |
| **T54** | `ui/nameEntry.js` — three arcade initials, `/^[A-Z_]{3}$/` |
| **T55** | Vertical slice check: title → select → stage 1 → boss → evaluation → name entry |

**T53 is a pacing task, not a layout task.** He should have a second to feel pleased about 力 and 錢
before the third line takes the floor out. `林建國 (1994) — 71` sits underneath, two points above,
and needs no comment.

Commit per task. **After T55, tag it:** `git tag v0.1-vertical-slice`.

---

## Phase 8 — Backend and leaderboard

| Task | Deliverable |
|---|---|
| **T56** | `server/db.js` — `better-sqlite3`, **`PRAGMA journal_mode = WAL`**, `DB_PATH` env var |
| **T57** | `server/migrations/001_runs.sql` — schema per `SPEC.md` §11.2 |
| **T58** | Seed `LIN`, grade 71, `1994-01-01`, permanent |
| **T59** | `POST /api/runs/start` — signed token carrying a server timestamp |
| **T60** | `POST /api/runs` — verify, bounds-check, **recompute the grade server-side**, return rank |
| **T61** | ⚠️ Integrity tests — **C4** and **C5** |
| **T62** | `GET /api/leaderboard` — filter by candidate and difficulty |
| **T63** | `GET /api/stats` — completion rate, picks, median grade, **average 禮** |
| **T64** | `game/js/net.js` — client submission |

**T61 must include, at minimum:**

```js
test('C4: a forged submission with no token is rejected', ...);
test('C4: a run claiming 15 minutes that started 30s ago is rejected', ...);
test('C5: a client-sent grade is ignored and recomputed', async () => {
  // submit with grade: 100 on a run that actually scores ~57
  // assert the STORED grade is the recomputed one, not 100
});
```

C5 is the one that matters. **The server never trusts a client-sent grade.**

Note honestly in the README: the HMAC key ships in the client bundle, so a determined person can
forge a signature. The check with teeth is the token's wall-clock floor. **Do not call the
leaderboard tamper-proof.**

Commit per task. After T64: `git tag v0.2-leaderboard`.

---

## Phase 9 — Stage 2 森林「山路」

| Task | Deliverable |
|---|---|
| **T65** | `stages/forest.js` — Lower Gate → Pond Path → Stone Steps → Tea Pavilion |
| **T66** | Enemies: 園丁 45 · 看門狗 25 (cannot be thrown) · 表弟 35 · 保全 80 |
| **T67** | Hazards: koi pond · motion-sensor lights that come on **ahead** of him · hedge maze |
| **T68** | Clues: a small 林 on every uniform · collars on the dogs · opponents helping each other up |
| **T69** | Boss 二叔 — **cannot be beaten by fighting.** Zero him and he pours another cup and stands back up, fully restored |
| **T70** | The three cups: accept (+氣, cumulative heaviness) · refuse (−8 力) · then **bow** |

**T69–T70 is where the player works it out.** A kidnapper does not do this. Accepting all three is
+8; the way past is to bow. He steps aside beaming and tells the candidate he's a good kid, then
joins and teaches 鐵山靠.

Commit per task.

---

## Phase 10 — Stage 3 and the final boss

| Task | Deliverable |
|---|---|
| **T71** | `stages/castle.js` — Front Courtyard → Ancestral Hall → Kitchen → Dining Room |
| **T72** | Enemies: 阿姨 60 · 廚房阿姨 120 · 史丹佛表哥 70 |
| **T73** | 小表妹 Toddler — **cannot be attacked**, hits for 5, striking her is a heavy penalty and an audible gasp from the whole room |
| **T74** | Blatant clues: catering vans, a seating chart on an easel, warming trays, a piano being tuned |
| **T75** | Dining room arena — round table, lazy Susan rotating as a continuous hazard |
| **T76** | 林建國 VINCENT Phase 1「面談」— seated, 公筷, 筷子, 「你幾歲?」, 「有房子嗎?」, 「吃飽了嗎?」 |
| **T77** | **召集 Summon** — every 20s calls two relatives; **anyone he helped up refuses to come** |
| **T78** | Phase 2「站起來」— 掃堂腿, 夾菜, 轉盤, 一句話; timed **bow** staggers 3s |

**T77 is the payoff for every ten-second decision the player made.** A candidate with a full roster
fights Phase 1 almost alone. It reads the roster from T34 — verify that path end to end.

**The family keeps eating throughout.** Dishes pass around the fight. Nobody is alarmed.

Commit per task.

---

## Phase 11 — The reveal

Scripted sequence. **Pacing matters more than content — each beat must land before the next begins.**

| Task | Deliverable |
|---|---|
| **T79** | `ui/reveal.js` — beats 1–7 per `docs/PRD.md` §8 |
| **T80** | The bow line-up, then the fruit shop owner sits down at the table, still angry about the melon |
| **T81** | The form, then `林建國 (1994) — 71` underneath |
| **T82** | Beat 7 — the file starts the day they met. Two photos, dated, annotated. The delivery rider waves |
| **T83** | Stinger — real kidnappers, four seconds, 「那個是真的。」 |
| **T84** | Ending — cut fruit (the melon, if it survived), 「你被批准了。下週日再來。」, then 「第2次」 |

Commit per task. After T84: `git tag v0.9-content-complete`.

---

## Phase 12 — Polish and ship

| Task | Deliverable |
|---|---|
| **T85** | Touch controls — d-pad + A/B/C + large context button, min 60×60px, auto-face nearest |
| **T86** | Audio — Web Audio synthesis; music cues per `docs/PRD.md` §11 |
| **T87** | `dashboard/` — leaderboard view, three boards, one per candidate |
| **T88** | `Dockerfile` + `docker-compose.yml` — **DB on a mounted volume, one container, never replicate** |
| **T89** | ⚠️ **C3**: submit a run, `docker compose down && up`, confirm the row survived |
| **T90** | **C6**: 60 FPS verified in Chrome and Firefox with the T5 overlay |
| **T91** | Full acceptance pass against `docs/PRD.md` §16 and `SPEC.md` §1 |
| **T92** | README update — how to run, and the honest note about leaderboard integrity |

**T88 is the deployment mistake that actually hurts.** If the database file lives inside the image,
every redeploy silently wipes all records.

---

## Open questions — answer before the phase that needs them

None of these block Phase 0–5. Flag them in `progress.md` when you reach them.

1. **T45/T66/T72 — enemy dialogue.** Every line must hold the six content rules in `SPEC.md` §14.
   Nobody is ever rude; hostility is expressed entirely through hospitality.
2. ~~**T70 — 二叔 has no personal name.**~~ **Answered: he is BAN 班.** Still addressed as 二叔 in
   dialogue — the relational term is how family actually speaks.
3. **T84 — Rule 47.** `docs/story.md:317` says "Rule 47: Survive." Nothing else references numbered
   rules. Orphan, or a hook for the post-credits?
4. **T51 — punctuality vs. three candidates.** Three candidates run "an hour apart" but 禮 scores
   against 18:00 specifically. Fine for a single playthrough; it will bite when writing per-candidate
   variant lines.
5. **T19 — body proportions.** `docs/images/*.png` are portraits only. Hilman must silhouette as the
   biggest of the three at 32×48. No reference exists yet for 二叔 or the fruit shop owner.
