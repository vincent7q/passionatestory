# SPEC — 熱血物語：見家長

**Engineering specification.** This document pins down contracts, data shapes, module boundaries,
constants, and acceptance criteria — the things you write code *against*.

It does not restate the story or the design rationale:

- **`docs/story.md`** is the narrative bible. It outranks everything here on anything narrative.
- **`docs/PRD.md`** governs mechanics, content rosters, and stage design.
- **`CLAUDE.md`** governs conventions and the spoiler discipline.

Where this document and the PRD disagree on a *number*, this document wins — the PRD describes
intent prosaically, this one is what the code implements. Where they disagree on *design*, the PRD
wins and this document is wrong and should be fixed.

---

## 1. Hard success criteria

These are pass/fail. Everything else is negotiable.

| # | Criterion | How it is verified |
|---|---|---|
| **C1** | **A mashing player cannot beat 71.** | Automated test: `test/shared/scoring.masher.test.js` simulates a maximal-violence run and asserts `grade < 71`. |
| **C2** | **The character 禮 never appears on screen before the evaluation form.** | Automated test greps all player-facing strings; plus manual playthrough. |
| **C3** | Records survive `docker compose down && up`. | Manual: submit a run, recycle the stack, confirm the row. |
| **C4** | A forged `curl` submission is rejected. | Automated test: `test/server/integrity.test.js`. |
| **C5** | Server never trusts a client-sent grade. | Automated test: submit a run with an inflated `grade` field, assert the stored value is the recomputed one. |
| **C6** | Stable 60 FPS in Chrome and Firefox. | Manual, with the debug frame-time overlay. |
| **C7** | No build step. Browser loads ES modules directly from the server. | `npm start` and open the page; no bundler in `package.json`. |

C1 and C2 are the ones that kill the project if they fail.

---

## 2. Repository layout

Exactly as `docs/PRD.md` §15. Files are created as their phase arrives, not up front.

```
SPEC.md  implementation.md  progress.md  CLAUDE.md  README.md
Dockerfile  docker-compose.yml  package.json
docs/           story.md  PRD.md  idea.md  1.jpg  2.jpg  images/*.png
shared/         characters.js  scoring.js  validation.js   ← imported by BOTH sides
game/
  index.html    css/style.css
  js/           main.js  renderer.js  input.js  assets.js  physics.js
                camera.js  combat.js  daze.js  debug.js  net.js  utils.js
    entities/   entity.js  player.js  enemy.js  boss.js  item.js  projectile.js  ally.js
    stages/     stage.js  city.js  forest.js  castle.js
    ui/         hud.js  menu.js  dialog.js  nameEntry.js  evaluation.js  reveal.js
server/         index.js  db.js  routes/  migrations/
dashboard/      index.html  dashboard.js
test/           shared/  server/  game/
```

Three files here are not in `docs/PRD.md` §15 and were added during implementation:

- **`combat.js`** — damage resolution, attack chains, guard/parry, grabs. `physics.js` decides
  whether two things *touched*; this decides what that touch **means**. Putting damage rules in
  `physics.js` would have broken its "collision math only" boundary.
- **`entities/entity.js`** — the factory, pool, and shared state enums.
- **`daze.js`** — the ten-second window: the countdown, the prompt, helping up, and the penalty for
  striking someone who is down. The mechanic everything else serves, so it gets its own file rather
  than being spread across `combat.js` and `enemy.js`.
- **`debug.js`** — the frame-time overlay, which exists from Phase 0 because it is how C6 is verified.

### 2.1 The `shared/` contract — the most important rule in the codebase

`shared/*.js` is loaded **by the browser over HTTP** (`/shared/scoring.js`) **and by Node**
(`import '../shared/scoring.js'`). Therefore:

- **No `node:` imports. No `process`. No `fs`. No `Buffer`. No DOM.** Plain portable ES modules.
- No default exports — named exports only, so both sides import identically.
- Every value in here is data or a pure function. No I/O, no state, no side effects.

Anything that needs Node or the DOM goes in a wrapper on the respective side.

### 2.3 Only `main.js` may import `shared/`

**The disk layout and the served URL layout disagree, and no relative specifier satisfies both.**

`game/js/entities/player.js` is served at `/js/entities/player.js`. From there:

| Specifier | Resolves in the browser | Resolves on disk (Node) |
|---|---|---|
| `../../shared/characters.js` | `/shared/characters.js` ✅ | `game/shared/characters.js` ❌ |
| `../../../shared/characters.js` | above the document root ❌ | `shared/characters.js` ✅ |

Because `game/` is served at `/` while `shared/` is served at `/shared/`, the two trees sit at
different depths in the two environments. A module that imports `shared/` relatively therefore works
in exactly one of them — and the failure is asymmetric and nasty: every Node test passes while the
game 404s in the browser, or vice versa.

**The rule:**

- **`main.js` alone** imports `shared/`, using the absolute `/shared/…` form. It is the browser-only
  entry point and is never imported by a test.
- **Every other module under `game/js/` takes the data as a parameter.** `createPlayer(def, at)`
  receives a `CHARACTERS` entry; it does not look one up.

This keeps deep modules pure and testable in Node, which is what `SPEC.md` §12 asks for anyway.

### 2.2 Module boundaries that must not leak

| Boundary | Rule |
|---|---|
| `assets.js` | The **only** file that knows how a sprite frame is drawn. Entities and stages ask for a frame by name and never see drawing code. This is the seam where real spritesheets drop in later. |
| `physics.js` | The **only** file that does collision math. No bare AABB checks anywhere else. |
| `shared/scoring.js` | The **only** place a grade is computed. Client and server both call it; neither reimplements it. |
| `renderer.js` | The **only** file that touches `ctx`. UI modules return draw commands or are called with a ctx by the renderer. |

---

## 3. Rendering & simulation contract

### 3.1 Resolution

- One `<canvas>` at a fixed internal **480×270**.
- CSS upscales to the **largest integer multiple** that fits the window (`image-rendering: pixelated`).
- All game code draws in 480×270 space and never reads window size.
- **Integer scaling only.** Fractional scaling to fill the viewport is forbidden — it destroys square
  pixels. Letterbox instead.

### 3.2 Fixed timestep

```
STEP_MS      = 1000 / 60      // 16.666…
MAX_FRAME_MS = 250            // clamp; prevents death-spiral after a tab stall
```

The loop accumulates real elapsed time and runs `update()` in whole `STEP_MS` slices; `render()`
runs once per `requestAnimationFrame`.

**Never scale a gameplay value by a variable `dt`.** Every physics constant is expressed per fixed
step. Determinism keeps server-side replay validation possible later.

### 3.3 The 2.5D coordinate system

Three axes per entity:

| Axis | Meaning | Bounds |
|---|---|---|
| `x` | World horizontal. The camera scrolls along this. | `[0, section.length]` |
| `y` | **Depth** — how far into the screen. Larger `y` = nearer the viewer. | the walkable strip, per stage |
| `z` | Height above the ground. Non-zero only while airborne. | `>= 0` |

- Screen position is `(x - camera.x, y - z)`.
- Entities are **drawn sorted by `y` ascending**, so characters further back render behind.
- **Gravity acts on `z`, never on `y`.**

### 3.4 Hit resolution

Two entities can hit each other only when **both** hold:

1. Their `(x, y)` boxes overlap.
2. Their `z` ranges overlap.

This is what makes an attack miss someone standing on a different depth line. It lives in
`physics.js` and nowhere else:

```js
export function boxesOverlap(a, b)        // (x,y) footprint only
export function zRangesOverlap(a, b)      // vertical
export function canHit(attacker, target)  // both of the above + facing + active frames
```

---

## 4. Entity model

Every entity is a plain object in one flat array, with object pools for particles and projectiles.
Cap ~50 on screen; **the 10-second despawn is load-bearing for that cap.**

```js
{
  id, kind,                      // 'player' | 'enemy' | 'boss' | 'ally' | 'item' | 'projectile' | 'prop'
  x, y, z, vx, vy, vz,
  facing,                        // -1 | 1
  w, h, depth,                   // footprint + height for hit boxes
  power, powerMax,               // 力 doubles as health
  spirit, spiritMax,             // 氣
  state, stateTimer,             // see §5
  animFrame, animTimer,
  team,                          // 'player' | 'house'
  flags: { invulnerable, grabbable, breakable, ... },
}
```

### 4.1 Entity state machine

```
IDLE → CHASE → ATTACK → RECOVER → STUN → DAZED → DESPAWN
                                            ↓
                                          ALLIED
```

- `DAZED` is entered at zero 力. Stars orbit; see §6.
- `DAZED → ALLIED` is the branch the whole game is built on.
- `DESPAWN` frees the pool slot.

### 4.2 Player state machine (`main.js` owns one, top level)

```
TITLE → CHARACTER_SELECT → CUTSCENE → PLAYING ⇄ PAUSED → STAGE_CLEAR
                                          ↓
                            NAME_ENTRY → LEADERBOARD  |  GAME_OVER
```

Each state provides `update(dt)` and `render(ctx)`. No state reaches into another's internals.

---

## 5. Controls

| Key | Action | Touch |
|---|---|---|
| ← → | Move | left virtual d-pad |
| ↑ ↓ | Move in depth | left virtual d-pad |
| Space | Jump | button |
| Z | Light attack | A |
| X | Heavy attack | B |
| C | Special (costs 氣) | C |
| Shift (hold) | Guard; **parry** on the frame of impact | hold |
| **E** | Context action — help up, accept, bow, pick up | large context button |
| Q | Call ally | button |
| Enter | Pause | — |

Touch targets minimum 60×60 px. Auto-face nearest enemy on touch.

**E is the most important button in the game and nothing ever says so.** It surfaces a small
contextual prompt and never explains why you would want to press it.

---

## 6. The ten-second window

The mechanic everything else serves.

```js
export const DAZE_WINDOW_MS = 10_000;   // ONE tuning constant. May become 8s or 12s.
```

1. An opponent reduced to zero 力 enters `DAZED` and sits down. Stars orbit their head.
2. The stars **visibly slow** across the window — that is the countdown, and it is the only signal.
3. Pressing **E** within range during the window helps them up → `ALLIED`, permanently on the roster.
4. On expiry they stand, dust themselves off, walk off screen, `DESPAWN`.
5. **Striking a `DAZED` or downed opponent is the single heaviest penalty in the game.**

### 6.1 Roster vs. active ally

- **Roster** — every opponent ever helped up this run. Permanent. This is what the final boss's
  `召集 Summon` checks against.
- **Active ally** — exactly one, callable once per fight with `Q`. Swappable at checkpoints.
  Swapping changes who fights beside you, **never** who is on the roster.
- Each new roster member teaches one technique between stages, permanently.

---

## 7. Scoring — `shared/scoring.js`

Three criteria. Two are the HUD. One is never named on screen.

```js
export const POWER_MAX    = 40;   // 力 — visible (the green bar)
export const MONEY_MAX    = 20;   // 錢 — visible (the counter)
export const JUDGMENT_MAX = 40;   // 禮 — hidden, clamped
export const GRADE_MAX    = 100;

export const FATHER_SCORE = 71;   // 林建國, Normal, 1994. Permanent on the board.
```

### 7.1 Judgment awards

Deliberately over-supplied against the 40 cap, so a mercy run, a restraint run, and a
perfect-set-pieces run each reach full by different routes. **Clamp to `[0, 40]` last.**

```js
export const JUDGMENT = {
  HELP_UP:                +3,   // each
  SPARE_FRUIT_STALL:      +8,   // stage 1 boss, melon undamaged
  ACCEPT_ALL_CUPS:        +8,   // 二叔, all three
  BOW_ON_CORRECT_BEAT:    +6,   // final boss
  NEVER_STRIKE_DOWNED:    +5,   // whole run, conditional
  NEVER_STRIKE_TODDLER:   +4,   // whole run, conditional
  MARKET_STALLS_INTACT:   +6,   // stage 1
  STRIKE_DOWNED:          -4,   // each
  FORCE_FED:             -30,   // each 「吃飽了嗎?」 — he reads it as a heal
};
```

**Arrival is not scored.** `arrivalTier(msBefore1800)` returns `on_time` / `late` / `very_late`,
which chooses the ending (`game/js/ui/ending.js`) and nothing else. A countdown would make the
player race, and a player who races does not stop to help anyone up.

**The set-pieces total 37, short of the 40 cap on purpose.** A full hidden column requires at least
one help-up, so nobody can be graded perfect on courtesy alone.

### 7.2 The run payload

The client submits **the inputs to scoring, never a score.** The server recomputes.

```js
{
  candidate:   'felix' | 'lucian' | 'hilman',
  difficulty:  'easy' | 'normal' | 'hard',
  name:        'AAA',                    // /^[A-Z_]{3}$/
  durationMs:  1_234_567,
  completed:   true,
  stageReached: 3,                       // 1 | 2 | 3

  power: {
    damageDealt, longestCombo,
    sectionTimesMs: [ ... ],
    bossTimesMs:    [ ... ],
    powerRemaining, powerMax,
  },
  money:  { collected, totalAvailable },
  judgment: {
    helpUps, strikesOnDowned,
    spareFruitStall, acceptedAllCups, bowedOnBeat,
    neverStruckDowned, neverStruckToddler, marketStallsIntact,
    arrivalMsBefore1800,               // negative if late
  },
}
```

### 7.3 The API

```js
export function computePower(run)     // → 0..40
export function computeMoney(run)     // → 0..20
export function computeJudgment(run)  // → 0..40, clamped
export function computeGrade(run)     // → { power, money, judgment, total }
export function leaderboardValue(grade, difficulty)  // grade × multiplier
```

`computeGrade` is **pure** and is the single source of truth. The client calls it to render the
evaluation form; the server calls it to decide what to store. They must agree exactly.

### 7.4 Difficulty

| Difficulty | Enemy HP | Your damage | Attempts | Leaderboard multiplier |
|---|---|---|---|---|
| `easy` | −30% | +20% | 5 | 0.75× |
| `normal` | baseline | baseline | 3 | 1.00× |
| `hard` | +50% | −20% | 1 | 1.35× |

**Displayed grade** is `力 + 錢 + 禮` out of 100.
**Leaderboard value** is `grade × multiplier` — so a flawless Hard run scores 135.

### 7.5 The C1 formula constraint

力 and 錢 are worth 60 between them and a determined player maxes both. The masher test asserts a
run with maximal violence, zero restraint, and every downed-opponent penalty taken lands in the
**56–60** band and therefore **cannot reach 71**.

If a formula change moves that band, `test/shared/scoring.masher.test.js` fails and the change is
wrong. Tune the constants, not the test.

---

## 8. Spoiler discipline — enforced, not just documented

This is C2 and it is the easiest thing in the project to break by accident.

**Forbidden before the evaluation form**, everywhere in `game/`:

- The character **禮** in any player-facing string, label, tooltip, tutorial, pause entry, or HUD element.
- Any label on the clock. It is a number counting toward 18:00 and nothing else.
- Any scoring explanation. The pause menu is `Resume · Restart Section · Controls · Quit` and nothing more.

**Permitted:** internal identifiers — `judgment`, `li`, `REI` — in code, comments, and this document.

**Restraint award presentation:** a bare gold **`+3`** with a small seal icon and **no label**. Its
first appearance in the entire game is on the evaluation form in `ui/evaluation.js`.

An automated test enforces this: `test/game/spoiler.test.js` scans every file under `game/` for the
literal `禮` outside an allowlist of exactly two files (`ui/evaluation.js`, `ui/reveal.js`).

---

## 9. HUD

Match `docs/1.jpg` and `docs/2.jpg`. Those are River City Girls screenshots; the mapping is:

| Reference | Ours |
|---|---|
| `HP` green segmented bar + `n/max` | **力** — health *and* criterion one |
| `SP` orange segmented bar + `n/max` | **氣** — a resource, not a criterion |
| coin + `1,000` | **錢** — criterion two |
| `DAY1 15:27`, centred, large | **the clock, counting toward 18:00** |
| EXP vertical bar, portrait, `Lv.9` | same, far left |

```
┌──────────────────────────────────────────────────────────────────────┐
│ [EXP] [Portrait]  力  ████████░░ 120/150      17:42        錢 1,000   │
│  ▮       Lv.9      氣 ██████░░░░  60/100                              │
└──────────────────────────────────────────────────────────────────────┘
```

Also: ally portrait + `Q` prompt bottom-left when applicable; orbiting stars and an **E** prompt
above a dazed opponent.

**Damage numbers:** white on hit, yellow and larger on critical, green with `+` on heal.

---

## 10. Assets — procedural, behind one seam

**No asset files exist and none are planned for v1.**

- `game/js/assets.js` builds every frame at boot from a parameterised chibi rig (head / torso / arms
  / legs posed per frame, tinted per character palette), cached to offscreen canvases.
- Audio is synthesised via Web Audio.
- Sprites are **32×48** base, chibi proportions, head ≈ ½ body height.
- Animations: idle 2 · walk 4 · light 3 · heavy 3 · jump 2 · hurt 1 · knockdown 2 · dazed loop 4 ·
  special 4–6.

Game code asks `assets.js` for a frame by name. It never learns how the frame was made. **Keep all
drawing logic out of entity and stage files** — that seam is how real spritesheets arrive later
without touching game logic.

`docs/images/*.png` are portrait references keyed by filename → character id. Use them for face,
hair, glasses, and palette. Body proportions and costume are still undefined.

---

## 11. Backend

Single Fastify process serves the static game, the dashboard, and `/api/*`. SQLite via
`better-sqlite3` (synchronous — no async ceremony), `PRAGMA journal_mode = WAL` so the dashboard can
read during a write.

**The database file must live on a mounted volume** — `/data/records.db`, `DB_PATH` env var. Inside
the image, every redeploy silently wipes all records. SQLite means **one container only**; never
scale to replicas.

### 11.1 Endpoints

| Method | Path | Behaviour |
|---|---|---|
| `POST` | `/api/runs/start` | Issues a signed token carrying a server timestamp. |
| `POST` | `/api/runs` | Verifies signature, bounds-checks against `shared/validation.js`, **recomputes the grade server-side**, stores, returns rank. |
| `GET` | `/api/leaderboard` | Filterable by `candidate` and `difficulty`. |
| `GET` | `/api/stats` | Completion rate, candidate picks, median grade, **average 禮**. |
| `GET` | `/healthz` | Liveness. |

### 11.2 Schema

```sql
CREATE TABLE runs (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  name              TEXT    NOT NULL,          -- /^[A-Z_]{3}$/
  candidate         TEXT    NOT NULL,          -- felix | lucian | hilman
  difficulty        TEXT    NOT NULL,          -- easy | normal | hard
  power             INTEGER NOT NULL,
  money             INTEGER NOT NULL,
  judgment          INTEGER NOT NULL,
  grade             INTEGER NOT NULL,
  leaderboard_value REAL    NOT NULL,
  duration_ms       INTEGER NOT NULL,
  completed         INTEGER NOT NULL,
  stage_reached     INTEGER NOT NULL,
  run_json          TEXT    NOT NULL,          -- the raw submitted payload, for later replay work
  created_at        TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_runs_board ON runs (candidate, difficulty, leaderboard_value DESC);
```

Seed row, permanent, from the first migration:

```
name='LIN', candidate='—', difficulty='normal', grade=71, created_at='1994-01-01'
```

### 11.3 Integrity, and its honest limit

`POST /api/runs/start` issues a signed token carrying a server timestamp. `POST /api/runs` verifies
the signature, bounds-checks the run, and recomputes `grade`.

**The client has to sign its own submission, so the HMAC key ships in the client bundle** and anyone
reading the JS can forge a signature. The check with real teeth is the token's **wall-clock floor**:
a run claiming fifteen minutes that started thirty seconds ago is rejected, and that cannot be
backdated. This stops `curl` and casual tampering. It does not stop a determined person.

Full prevention needs server-side replay validation, which is deliberately out of scope.
**Do not describe the leaderboard as tamper-proof** — not in the UI, not in the README.

Identity is three arcade initials. No accounts, no personal data.

### 11.4 Bounds — `shared/validation.js`

```js
export const NAME_RE = /^[A-Z_]{3}$/;
export const MIN_RUN_MS = { 1: 90_000, 2: 210_000, 3: 300_000 };  // by stageReached
export const CANDIDATES   = ['felix', 'lucian', 'hilman'];
export const DIFFICULTIES = ['easy', 'normal', 'hard'];

export function validateRun(run)  // → { ok: boolean, errors: string[] }
```

Rejects: bad name, unknown candidate/difficulty, `stageReached` inconsistent with `completed`,
duration below the floor for the claimed stage, any sub-score above its theoretical max, negative
counters, and a `durationMs` that exceeds the elapsed wall-clock since the token was issued.

---

## 12. Testing strategy, and where it honestly stops

`npm test`. Node's built-in runner. No test framework dependency.

**Run it via `npm test`, not by hand.** The script is
`node --test "test/**/*.test.js"`, and both halves of that matter:

- **`node --test test/` silently runs nothing on Node ≥ 22.** It stops treating a bare directory as
  a discovery root and tries to load it as a module, so the suite "fails" with one
  `ERR_MODULE_NOT_FOUND` and zero tests — which reads like a broken checkout rather than a broken
  command. That is what it did on 2026-08-08.
- **The pattern stays quoted** so no shell expands it. Unquoted, a `sh` without `globstar` collapses
  `**` to `*` and quietly drops `test/smoke.test.js`; the deploy target is Ubuntu, so this is not
  hypothetical.
- **It is a pattern rather than bare `node --test`** because Node's default discovery treats *every*
  `.js` file under `test/` as a test file, including `test/helpers/`. Helpers are imported by tests;
  they should never be executed as one.

| Layer | Approach | Coverage expectation |
|---|---|---|
| `shared/` | Pure unit tests. Every branch. | **Complete.** This is where correctness lives. |
| `server/` | Integration via `fastify.inject()` against a temp-file SQLite DB. | **Complete** for every endpoint and every rejection path. |
| Game logic that is pure | Physics math, state transitions, AI decisions, timers extracted into functions that take state and return state. Tested in Node with no canvas. | **High.** |
| `main.js` | Booted under a stub DOM (`test/helpers/dom-stub.js`) and stepped through real frames. | **Smoke only** — it loads, the loop turns over, every state renders. Never pixels. |
| Rendering, input, audio | **Not unit tested.** Verified by playing it. | None — and say so rather than faking it. |

The discipline this implies: **push game logic out of the render path into pure functions.** A
collision resolver that takes two boxes and returns a boolean is testable; one that reads
`ctx.canvas.width` is not. Structure for the former.

### 12.1 `main.js`, and why it gets a stub browser

`main.js` was for a long time the one module no test could reach: it touches `document` at import
time, so importing it in Node threw. It is also the only file in the project that has ever shipped a
runtime bug — **twice**, a missing `STEP_MS` import in Phase 5 and a deleted `BOUNDS` constant in
Phase 6. Both were valid syntax, both passed `node --check`, and both would have surfaced only in a
browser.

`test/game/main-boot.test.js` closes that by actually running it, and two things make that possible:

- **`test/helpers/dom-stub.js`** — a Proxy-backed 2D context that accepts any call, plus the handful
  of globals boot needs. `requestAnimationFrame` **stores** the callback instead of invoking it, so a
  test drives the loop one frame at a time rather than recursing forever.
- **`test/helpers/shared-loader.js`** — a resolver hook doing for Node what the static server does
  for the browser. `main.js` imports `/shared/…` absolutely, which is the only form that works in the
  browser (§2.3) and resolves to nothing on disk. That single detail is the whole reason the file was
  unreachable.

**It is a smoke test and must stay one.** It asserts nothing about what anything looked like —
rendering is verified by eye, and that has not changed. What it proves is that the module graph
resolves, every name it references exists at runtime, the fixed timestep steps, and no state throws
while drawing. Verified by sabotage: reintroducing the Phase 6 bug class fails it immediately.

---

## 13. Conventions

- Identifiers and code comments in **English**.
- Player-facing strings carry **both Chinese and English** where the PRD gives both (`城市 / City`).
- Chinese is **Traditional**.
- Character ids are lowercase: `felix`, `lucian`, `hilman`. Difficulty: `easy`, `normal`, `hard`.
  **`vincent` is not a candidate id** — 林建國 VINCENT is 小雨's father and the final boss.
- Tuning constants — character stats, scoring weights, enemy HP, the daze window — live in `shared/`
  or a stage's data file. **Never inline in behaviour code**; they get playtested and revised.
- No default exports in `shared/`.

---

## 14. Content rules that constrain code

From `CLAUDE.md`. They are not stylistic preferences — dialogue, item names, and UI copy all have to
hold them:

1. No character is ever rude. Hostility is expressed entirely through hospitality.
2. Nobody acknowledges that the fighting is strange.
3. The wealth is shown, never stated.
4. Every enemy has a reason to like you. They fight you anyway.
5. **The candidate never suspects.** The player may; he may not.
6. **Cartoon violence only.** Nobody bleeds, nobody is hurt, nobody stays down. Defeated opponents
   see stars, sit down, and rub their head. Keep it playable by kids.

---

## 15. Out of scope for v1

Named explicitly so they don't creep in:

- Server-side replay validation.
- Real spritesheets or audio files.
- Accounts, sessions, or any personal data.
- Multiplayer or co-op.
- Any build step, bundler, transpiler, or framework.
- More than one container.
