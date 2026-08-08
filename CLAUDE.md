# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

熱血物語：見家長 — a browser beat-'em-up in the style of River City Girls, built around a twist.

**What the player experiences:** his girlfriend 林小雨 CLORIS is dragged into a black van. He chases
it across a city, up a mountain, and into a fortified estate to get her back.

**What is actually happening:** every opponent is on the Lin family payroll. The estate is a house
with dinner going cold on the table. 小雨 has survived three real kidnappings, so the family stages
one for every suitor — because anyone can be polite at dinner, and they need to know who a man is
when he believes the stakes are real. He is not rescuing her. He is meeting her parents.

**Read `docs/story.md` before writing anything.** It is the story bible and outranks `docs/PRD.md` on
anything narrative. The PRD governs mechanics; read the relevant section before inventing values.

`docs/1.jpg` and `docs/2.jpg` are reference screenshots defining the HUD layout — match them.

`docs/images/*.png` are character design references; **the filename is the character id**
(`felix`, `lucian`, `hilman`, `rain` → 林小雨 CLORIS, `vincent` → 林建國, her father). They are
head-and-shoulders portraits only — use them for face, hair, glasses, and palette. Body
proportions and costume are still undefined, and there is no reference yet for 二叔 or the
fruit shop owner.

### Spoiler discipline — the most breakable thing in this project

The twist lives or dies on what the interface reveals, and it is very easy to leak by accident.

Nothing on the HUD is disguised or renamed — **it is the evaluation, live, in plain sight.** 力 and
錢 are two of the three criteria and they sit on screen for the whole game. The trick is that nobody
wonders why a *rescue* has a power bar and a money counter, because that is what games look like. Do
not "improve" this by relabelling anything.

- **The character 禮 must not appear anywhere before the evaluation form** — not in the HUD, the
  pause menu, a tutorial, or a tooltip. Restraint awards pop as a bare gold `+3` with a seal icon and
  no label. Internal identifiers may use `li`/`REI`; player-facing strings may not.
- **The clock counting toward 18:00 is dinner, not a rescue timer.** Never label it. It is **not
  scored** — it decides which ending he walks into, and nothing else.
- Nothing in the game explains the scoring. The pause menu has no scoring page.

### Scoring

Three criteria, two visible, and `shared/scoring.js` must track them separately:

- **力 POWER (0–40) — visible.** The green bar, which doubles as health. Combat performance plus 力
  remaining at the end.
- **錢 MONEY (0–20) — visible.** The counter. Total collected.
- **禮 JUDGMENT (0–40, clamped) — hidden.** Restraint: helping defeated opponents up, sparing a
  bystander's fruit stall, accepting 二叔 BAN's tea, bowing, and never hitting someone who is down.
  **The set-pieces total 37, short of the cap on purpose** — a full column needs at least one
  help-up, so nobody is graded perfect on courtesy alone. Arrival time is **not** scored; it picks
  the ending.

力 and 錢 are worth 60 between them and a determined player maxes both — **they are the criteria that
don't decide it.** A masher lands around 56–60 and cannot reach 71, the score 小雨's father 林建國 got
when he sat the same test in 1994. It sits permanently on the leaderboard, and he is the final boss.

**"A mashing player cannot beat 71" is a hard success criterion.** If it fails, the design fails.

Help a defeated opponent up within the **10-second window** (stars orbit their head and visibly slow)
and they switch sides — permanently on your roster, one equipped as an active ally, each teaching a
technique. 林建國's Phase 1 summon checks that roster: anyone you helped refuses to fight you.

Also superseded from the PRD's original draft: it planned **localStorage** for high scores. Replaced
by the SQLite backend below.

### Writing content for this game

The comedy only works if these hold. They are not stylistic preferences:

1. No character is ever rude. Hostility is expressed entirely through hospitality.
2. Nobody acknowledges that the fighting is strange — not the family, not the staff, not the candidate.
3. The wealth is shown, never stated. No character says the family is rich.
4. Every enemy has a reason to like you. They fight you anyway.
5. **The candidate never suspects.** Not once, not for a frame. The player may; he may not.
6. Cartoon violence only — nobody bleeds, nobody is hurt, nobody stays down. Defeated opponents see
   stars, sit down, and rub their head. Keep it playable by kids.

## Commands

```bash
npm install
npm run dev          # Fastify on :8080 with --watch, serves game + dashboard + API
npm start            # same, no watch
npm test             # unit + API integration tests
```

Open <http://localhost:8080> to play, <http://localhost:8080/dashboard> for the leaderboard.

```bash
node --test test/shared/scoring.test.js       # single file
node --test --test-name-pattern="time bonus"  # single test by name
```

Docker (the deploy target is Ubuntu 22.04):

```bash
docker compose up --build -d
docker compose down && docker compose up -d   # records MUST survive this
```

## Architecture

### No build step — keep it that way

Plain ES modules loaded directly by the browser. No bundler, no transpiler, no framework, no game
engine (PRD §10.1). The server serves source files as-is. Don't add Vite/webpack/TypeScript without
raising it first — the zero-tooling property is deliberate and worth protecting.

Because these are real ES modules, the game **cannot** be opened via `file://`. Always run through
the server.

### `shared/` is imported by both the browser and Node

`shared/scoring.js`, `characters.js`, and `validation.js` are loaded by the game over HTTP
(`/shared/…`) *and* by the server via relative import. This means:

- **No Node-only APIs in `shared/`** — no `node:` imports, no `process`, no `fs`. Plain portable JS.
- Scoring and validation logic exists exactly once. The server recomputes `final_score` from a
  submitted run using the same module the client used. Never trust a client-sent `final_score`.

### The 2.5D coordinate system

This is the thing to understand before touching entity or collision code. Beat-'em-ups are not
platformers. Every entity has **three** position axes:

| Axis | Meaning |
|---|---|
| `x` | World horizontal. Camera scrolls along this. |
| `y` | **Depth** — how far "into" the screen. Larger `y` = closer to the viewer. Bounded by the walkable strip. |
| `z` | Height above the ground. Only non-zero while jumping. Gravity acts on `z`, never on `y`. |

Screen position is `(x - camera.x, y - z)`. Entities are **drawn sorted by `y` ascending**, so
characters further back render behind those in front.

Two entities can only hit each other when their `(x, y)` boxes overlap *and* their `z` ranges
overlap — that's what makes attacks miss someone standing on a different depth line. `physics.js`
handles this; use its helpers rather than writing bare AABB checks.

### Rendering

One canvas at a fixed internal **480×270**, upscaled by CSS to the largest integer multiple that
fits the window, with `image-rendering: pixelated`. All game code draws in 480×270 space and never
thinks about window size. Integer-only scaling is what keeps pixels square — don't switch to
fractional scaling to fill the viewport.

(The PRD §9.1 describes an offscreen-buffer blit to reach the same result. CSS upscaling is
equivalent, simpler, and GPU-accelerated.)

### Fixed timestep

The loop accumulates real time and steps simulation at a fixed 1/60s, with a clamp to prevent
death-spiralling after a tab stall. Rendering happens once per frame. **Never scale gameplay values
by a variable `dt`** — physics constants assume the fixed step, and determinism keeps the door open
for server-side replay validation later.

### Sprites are drawn in code

None of the PNG/MP3 assets the PRD lists (§10.4) exist. `game/js/assets.js` builds every frame
procedurally from a parameterized chibi rig (head/torso/arms/legs posed per frame, tinted per
character palette), cached to offscreen canvases at boot. Audio is synthesized via Web Audio.

Game code only ever asks `assets.js` for a frame — it never knows how that frame was made. That
interface is the seam where real spritesheets drop in later, so keep drawing logic out of entity
and stage files.

### State machine

`main.js` owns one state machine; each state provides `update()` and `render()`:

```
TITLE → CHARACTER_SELECT → CUTSCENE → PLAYING ⇄ PAUSED → STAGE_CLEAR
                                         ↓
                          NAME_ENTRY → LEADERBOARD  |  GAME_OVER
```

Enemy and boss AI are their own smaller machines: `IDLE → CHASE → ATTACK → RECOVER → STUN`.

## Backend

Single Fastify process serves the static game, the dashboard, and `/api/*`. SQLite via
`better-sqlite3` (synchronous — no async ceremony needed), opened with `PRAGMA journal_mode = WAL`
so the dashboard can read during a write.

**The database file must live on a mounted volume** (`/data/records.db`, `DB_PATH` env var). Inside
the image, every redeploy silently wipes all records. This is the deployment mistake that actually
hurts. Related: SQLite means **one container only** — never scale to replicas.

### Score integrity, and its honest limit

`POST /api/runs/start` issues a signed token carrying a server timestamp. `POST /api/runs` then
verifies the signature, checks the run against bounds in `shared/validation.js` (minimum possible
duration, theoretical max score, valid stage/completion combination, `/^[A-Z_]{3}$/` name), and
recomputes `final_score` server-side.

The client has to sign its own submission, so **the HMAC key ships in the client bundle** and anyone
reading the JS can forge a signature. The check with real teeth is the run token's wall-clock floor:
a run claiming 15 minutes that started 30 seconds ago is rejected, and that can't be backdated. This
stops `curl` and casual tampering. It does not stop a determined person — full prevention needs
server-side replay validation, which is deliberately out of scope. Don't describe the leaderboard as
tamper-proof.

## Conventions

- Identifiers and code comments in English; player-facing strings carry both Chinese and English
  where the PRD gives both (e.g. `城市 / City`).
- Character ids are lowercase: `felix`, `lucian`, `hilman` — the three candidates. Note `vincent` is
  **not** a candidate id: 林建國 VINCENT is 小雨's father and the final boss. Difficulty: `easy`,
  `normal`, `hard`.
- Tuning constants (character stats, scoring weights, enemy HP) belong in `shared/` or a stage's
  data file — never inline in behaviour code, since they get playtested and revised.
