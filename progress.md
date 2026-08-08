# Progress — 熱血物語：見家長

**This file is the single source of truth for where the work stands.** It is committed to git, so it
travels between machines. Update it after **every** task and commit it with that task's code.

---

## ⚠️ Resume protocol — read this first

**The state lives in git, not on a machine.** If you stop without pushing, the other machine cannot
see your work.

### Before you stop working, on any machine

```bash
npm test          # leave the suite green if you possibly can
git add -A
git commit -m "T<n>: <what>"
git push                   # ← THE STEP THAT MAKES THIS WORK. Do not skip it.
```

If the suite is red when you stop, say so in **Session log** below and commit anyway — a red suite
you documented is recoverable; uncommitted work on a machine you're not sitting at is not.

### When you start working, on any machine

```bash
git pull
npm install                # dependencies may have moved since you were last here
npm test          # confirm you inherited a green suite
```

Then read **Current status** below and continue from the first unchecked task.

### First time on a new machine

```bash
git clone https://github.com/vincent7q/passionatestory.git
cd passionatestory
npm install
npm run dev                # http://localhost:8080
```

Requires **Node ≥ 20**; verified on **20.17.0 and 22.16.0**. `better-sqlite3` is pinned to
`^11.10.0` because 11.x ships a prebuilt binary for Windows and 12.x does not — see the resolved
environment note below before touching that dependency.

**The game cannot be opened via `file://`.** These are real ES modules; they must be served over
HTTP. Always run through the server.

---

## Current status

| | |
|---|---|
| **Date** | 2026-08-08 |
| **Branch** | `phase-11-reveal` — **not yet merged to `main`** |
| **Phase** | ✅ Phases 0-11 complete — next is **Phase 12, polish and ship** |
| **Next task** | **T85** — touch controls |
| **Suite** | 🟢 green — **601 tests** |
| **Blocked on** | Nothing. |

### ⚠️ Read this before running anything — the test command changed

**`node --test test/` runs ZERO tests on Node ≥ 22.** It stops treating a bare directory as a
discovery root, tries to load it as a module, and reports one `ERR_MODULE_NOT_FOUND` — which looks
exactly like a broken checkout rather than a broken command. It cost the first twenty minutes of the
2026-08-08 session.

**Use `npm test`.** It is now `node --test "test/**/*.test.js"`, and both details matter: the
pattern stays **quoted** so no shell collapses `**` and silently drops `test/smoke.test.js`, and it
is a pattern rather than bare `node --test` because Node's default discovery would execute
`test/helpers/` as tests. See `SPEC.md` §12.

This machine runs **Node v22.16.0**; `progress.md` previously recorded v20.17.0. `better-sqlite3`
11.10.0 works fine on 22 — no change needed there.

### ✅ RESOLVED 2026-08-07 — the timer is gone, and the 71 hole closed with it

**Vincent's call: no countdown. It was too stressful.** Arrival is no longer scored at all.
Lateness lands as *dialogue at the table* instead — see `docs/story.md`, *If he is late*.

That change also closed the open design question from Phase 7, without touching any other number.
The full landscape now:

| Player | 力 | 錢 | 禮 | Total | vs 71 |
|---|---|---|---|---|---|
| Masher — hits the downed | 40 | 20 | 0 | **60** | short |
| Violent but never hits the downed | 40 | 20 | 9 | **69** | short *(was 77 — the hole)* |
| Perfect set-pieces, **never helps anyone up** | 40 | 20 | 37 | **97** | clears, not perfect |
| Set-pieces + a single help-up | 40 | 20 | 40 | **100** | — |
| Mercy run, 14 help-ups | 40 | 20 | 40 | **100** | — |

**The property that made it work:** the set-piece awards now total **37**, deliberately short of the
40 cap. A full hidden column is therefore unreachable without helping at least one person up —
nobody can be graded perfect on courtesy alone. That is the thesis of the whole game, stated as
arithmetic, and it is pinned by a test.

Why the timer had to go, in one line: **a player racing a clock does not stop to help anyone up**,
and stopping to help someone up is the entire game.

If a tuning change moves any of this, `test/shared/scoring.masher.test.js` fails —
**retune the constants, never the test.**

### ✅ Resolved — `better-sqlite3` is installed and working

The blocker from Phase 0–7 is gone. The cause was **version**, not toolchain:

- `better-sqlite3@12.x` (what `npm install better-sqlite3` resolves to) publishes **no prebuilt
  binary for Node 20 on win32**. It falls back to compiling, and node-gyp needs Visual Studio.
- **`better-sqlite3@11.10.0` does ship a Node 20 win32 prebuild.** It installs in seconds with no
  compiler at all.

Pinned as `"better-sqlite3": "^11.10.0"`. **Do not bump it to 12.x** without either upgrading Node or
installing the VS Build Tools — the caret deliberately stays inside 11.x.

`package.json` previously declared `"node": ">=22"` while the office machine runs **v20.17.0**.
`engines` is now `">=20"`, which reflects what is actually proved rather than what was assumed.

**Updated 2026-08-08:** the whole suite, Fastify 5 and the native binding are now also verified on
**Node v22.16.0**, so `^11.10.0` is good on both. The only thing Node 22 broke was the *test
command* — see the note under **Current status**.

### 📸 How to look at a specific frame without playing to it

Worked out on 2026-08-08 and worth keeping, because "verified by eye" (`SPEC.md` §12) otherwise
means playing twenty minutes to reach the beat you want to check — and the first attempt at
Phase 11 shipped a beat that read as a crash precisely because nobody had.

The trick is that **a hidden Chrome tab still executes canvas drawing.** It stops compositing and
it stops `requestAnimationFrame`, but `fillRect`, `toDataURL` and `getImageData` all work. So:

1. Freeze the loop: `window.requestAnimationFrame = () => 0`, then wait ~300ms for the frame already
   queued to fire. **Miss that wait and the pending frame repaints over your draw** — which happens
   silently and looks like your code did nothing.
2. Build the state you want and call its draw function directly on
   `document.getElementById('screen').getContext('2d')`.
3. `canvas.toDataURL('image/png')` and POST it to a throwaway local sink that writes a file.

Reload to undo all of it — nothing is patched on disk. A ready-made sink is in the session
scratchpad as `shotserver.mjs`; it is about thirty lines and touches no project file.

### ⏳ Outstanding visual verification

**The two that the whole project rested on are confirmed.** Vincent checked them on 2026-08-07:

> **#4 — the stars visibly slow.** ✅
> **#11 — the pause before 禮 lands.** ✅

Those were the only two no test could ever settle: whether the ten-second window has a *readable*
countdown, and whether the reveal has a *felt* beat before the floor goes out. Both work. The
central mechanic is legible and the payoff lands.

The rest of the numbered checklist below is **still unchecked** — mostly art and feel, none of it
load-bearing on the design. Tick them off as they are confirmed and delete this section when it is
empty.

Rendering tasks are verified by looking at them (`SPEC.md` §12), so these remain open:

- ~~**T3 — the canvas renders.**~~ ✅ **VERIFIED 2026-08-08 in Chrome.** The game boots at
  <http://localhost:8080> with **no console errors**, draws the city, Felix and two enemies, and the
  canvas is **480×270 internal upscaled to exactly 960×540 — a clean 2× integer step.** *Resizing*
  through further scale steps is still unchecked.
- ~~**#6 — the HUD matches `docs/1.jpg` / `docs/2.jpg`.**~~ ✅ **VERIFIED 2026-08-08.** 力 green bar
  reading `100/100`, 氣 orange beneath at `0/80`, `Lv.1` far left, 錢 top right with its gold dot —
  and **the clock centred, large, bare, starting at 17:20 with no label.** The joke is on screen.
- ~~**T4/T5 — the loop and the debug overlay.**~~ ✅ **VERIFIED 2026-08-08.** The overlay reads
  `fps 59.9 · worst 17.4ms · steps 1 · ents 3 · PLAYING`. **That is C6 met in Chrome** — Firefox is
  still unchecked, so C6 is half done.

  **Caveat worth knowing before anyone tries to automate this:** Chrome freezes
  `requestAnimationFrame` entirely in a hidden tab, so the loop stalls whenever the window is not
  in front, and a hidden tab does not composite either — screenshots come back as the last painted
  frame. Neither is a bug. Canvas *drawing* still works while hidden, which is the loophole the
  reveal captures below went through.
- **T19/T20** — what the chibi rig actually *looks like*. The pose table and palettes are tested,
  but nobody has yet seen a sprite. Expect the first draw to need art tuning; that is normal and is
  why `POSES` is data rather than code.
- **T21** — depth sorting on screen. The ordering logic is tested, but the walkable strip
  (`STRIP` in `main.js`) is a placeholder until Phase 6 gives each section real values.

- **Phase 3 combat feel.** Every rule is unit-tested, but frame data is a first guess. Expect
  `ATTACKS` in `combat.js` and `AI` in `entities/enemy.js` to want retuning once someone plays it —
  both are data tables for exactly that reason.

- ~~**Phase 4 — the star deceleration.**~~ ✅ **VERIFIED 2026-08-07 (checklist #4).** The stars
  visibly slow. The ten-second window has a readable signal, so the game's central mechanic is
  legible without a single word of explanation. **Do not retune `STAR_SPEED_START` /
  `STAR_SPEED_END` without re-checking this by eye** — the test only proves the curve is monotonic,
  not that a human can read it.

- **Phase 5 — HUD layout.** The formatting is tested (clock never reads 17:65, a 1-力 sliver never
  rounds to an empty bar), but whether it *matches* `docs/1.jpg` / `docs/2.jpg` is a comparison only
  an eye can make.

- **Phase 6 — stage pacing.** Section lengths, wave sizes and `gateWidth` are first guesses. Whether
  the chase *feels* like a chase, and whether the market row presents a real temptation to smash,
  can only be judged by playing it.

- ~~**Phase 7 — the pacing of the reveal.**~~ ✅ **VERIFIED 2026-08-07 (checklist #11).** The pause
  before 禮 lands. He gets his moment of being pleased about 力 and 錢, and then the floor goes out.
  **`DWELL[PLEASED]` in `ui/evaluation.js` is now load-bearing and confirmed by eye** — shortening it
  is the easiest way to throw away twenty minutes of setup.

**Phase 8 needs no visual verification** — the backend was exercised against a real running server
over HTTP, not only via `inject`. Confirmed by hand: `/healthz`, the seeded board, a signed
submission accepted and ranked, a token-less `curl` rejected, `/api/stats`, and **C3 — a record
surviving a full process restart on a `DB_PATH` volume, with the seed not duplicated.**

What *is* proved: 415 unit tests; every file passes `node --check`; `test/game/undefined-refs.test.js`
confirms `main.js` imports everything it references **and defines every constant it uses**;
`test/game/vertical-slice.test.js` drives a whole stage-1 run through the real modules end to end;
and every module serves 200 from a running server.

**Next person: open <http://localhost:8080>.** Arrows move, ↑↓ change depth, Space jumps, Z light,
X heavy, Shift guards, **E helps up**, Q calls an ally, backtick toggles the debug overlay. Stage 1
now runs properly: four sections, gated waves, rain, breakable stalls, and the boss. Worth confirming
specifically:

1. Felix draws, and walking "into" the screen changes his draw order against the enemies.
2. An attack **misses** an enemy standing on a different depth line — that is the 2.5D system.
3. A defeated enemy sits down with stars orbiting rather than vanishing.
4. ✅ **The stars visibly slow** over the ten seconds, and a bare `E` prompt appears when you stand
   next to them. It must not explain itself.
5. Pressing E pops a bare gold **`+3`** with a seal dot and **no label**, and the enemy gets up on
   your side.
6. The HUD reads like `docs/1.jpg` / `docs/2.jpg`: 力 green bar with `n/max`, 氣 orange beneath,
   `Lv.N` and the EXP sliver far left, 錢 top right — and **the clock centred, large, and bare.**
   It starts at 17:20 and must never carry a label.
7. The four parallax layers separate convincingly — towers barely move, awnings overhead race past.
8. The camera **pins** while a wave is alive and releases when it is cleared. Without that the
   player outruns every fight and the restraint decisions never arise.
9. 力 bleeds in the covered arcade when out from under an awning, and stops under one.
10. Market stalls break when hit, with **no warning and no penalty message** — that silence is the
    point.
11. ✅ **Beat the boss and watch the form.** 力 and 錢 write in first and should land as a win; there
    is a real pause; then 禮 arrives with 「他沒看到這一欄」 beside it, and 林建國 (1994) — 71
    underneath. Mashing must not fast-forward past the pause.
12. Name entry accepts three initials and returns to rest.
13. **Stage 2 loads after stage 1** — the palette changes to dusk, the parallax becomes ridgeline
    and pines, and the ferns overhead race past in the foreground.
14. **二叔 BAN cannot be beaten by fighting.** Knock him to zero and he pours another cup and gets
    straight back up. E accepts a cup; after three, E bows and he steps aside. This is the beat
    where the player is supposed to work it out — watch whether it lands.
15. ~~**The reveal, end to end.**~~ ✅ **VERIFIED 2026-08-08 — every beat seen and one real bug
    fixed.** All eleven beats were captured as PNGs and looked at. The evaluation form matches
    `docs/PRD.md` §8.1 line for line: 力 38/40, 錢 19/20 with 「這些是我們的錢。」, 禮 12/40 with
    ← 他沒看到這一欄, 總分 69/100, and **林建國 (1994) — 71** underneath. He is two short.
    **C2 confirmed by eye:** at the pleased pause only 力 and 錢 are on the page — no divider, no
    third line.
16. ~~**The `WIN` silence.**~~ ✅ **FIXED 2026-08-08 — it was broken, and only looking found it.**
    It rendered as three dots on black. Indistinguishable from the game having hung.

    **The mistake was reading "nothing happens" as "nothing is drawn".** The stillness is in the
    *action*: he is standing in the wreckage breathing hard while eight people calmly eat, and
    nobody looks up. That image is the joke, and a black screen cannot tell it. The whole reveal had
    the same fault — every beat was text in a void.

    `drawRoom()` now paints the dining room and every room beat draws it first, which also makes the
    sequence read as one continuous moment instead of a slideshow of captions. **Do not "simplify"
    a beat back to bare text** — three tests in `reveal.test.js` will fail, and they were verified
    by sabotage.

Then delete this section.

---

## The two things that must not break

Check these whenever you touch scoring or UI. They are pass/fail for the whole project.

- **C1 — a mashing player cannot beat 71.** Guarded by `test/shared/scoring.masher.test.js` (T12).
  If it fails, **tune the scoring constants, never the test.**
- **C2 — 禮 never appears on screen before the evaluation form.** Guarded by
  `test/game/spoiler.test.js` (T41). If it fails, you leaked the twist.

---

## Task checklist

Tick a box only when its test passes **and** the change is committed. Full task detail is in
`implementation.md`.

### Phase 0 — Foundation
- [x] T1 — test skeleton *(`better-sqlite3` deferred to T56 — see environment note)*
- [x] T2 — Fastify server, static serving, `/healthz`
- [x] T3 — canvas page, integer upscaling *(scale math tested; visual check pending — see below)*
- [x] T4 — fixed-timestep loop
- [x] T5 — debug frame-time overlay *(fps math tested; overlay visual pending)*

### Phase 1 — `shared/` ← where correctness lives
- [x] T6 — `shared/characters.js`
- [x] T7 — scoring constants
- [x] T8 — `computeMoney`
- [x] T9 — `computeJudgment` (the hidden column)
- [x] T10 — `computePower`
- [x] T11 — `computeGrade`, `leaderboardValue`
- [x] **T12 — ⚠️ C1 masher test** — masher 56, restraint 89
- [x] T13 — `shared/validation.js`

### Phase 2 — Engine core
- [x] T14 — `input.js`
- [x] T15 — footprint overlap
- [x] T16 — `canHit` (z overlap + facing + active frames)
- [x] T17 — integration; gravity on `z` only, never `y`
- [x] T18 — `camera.js`
- [x] T19 — chibi rig *(contract tested; pixels pending visual)*
- [x] T20 — animation frames *(pose table tested)*
- [x] T21 — y-sorted renderer *(draw order tested)*

### Phase 3 — Entities & combat
- [x] T22 — entity factory + pool
- [x] T23 — player movement
- [x] T24 — attack chains
- [x] T25 — enemy AI state machine
- [x] T26 — damage, knockback, knockdown
- [x] T27 — guard and parry
- [x] T28 — grabs and throws
- [x] T29 — weapons
- [x] T30 — items and 錢

### Phase 4 — The ten-second window ⚠️ the heart of the game
- [x] T31 — `DAZED` state, star timer
- [x] T32 — the **E** prompt
- [x] T33 — help-up → `ALLIED`
- [x] T34 — roster tracking
- [x] T35 — active ally, `Q`
- [x] T36 — strike-on-downed penalty

### Phase 5 — HUD
- [x] T37 — 力 / 氣 bars *(fill math tested)*
- [x] T38 — the clock, never labelled *(formatting tested)*
- [x] T39 — 錢 counter *(formatting tested)*
- [x] T40 — damage numbers, bare gold `+3` *(styles tested)*
- [x] **T41 — ⚠️ C2 spoiler test** — brought forward from Phase 5

### Phase 6 — Stage 1 城市「追」
- [x] T42 — `stages/stage.js` base
- [x] T43 — parallax
- [x] T44 — `stages/city.js` sections
- [x] T45 — enemy roster
- [x] T46 — rain hazard
- [x] T47 — breakable market stalls
- [x] T48 — boss 水果店老闆娘
- [x] T49 — the melon (40 HP)
- [x] T50 — stage clear

### Phase 7 — Evaluation form, end to end
- [x] T51 — run accumulator
- [x] T52 — `ui/evaluation.js`
- [x] T53 — the pacing
- [x] T54 — name entry
- [x] T55 — vertical slice → tagged `v0.1-vertical-slice`

### Phase 8 — Backend
- [x] T56 — `db.js`, WAL, `DB_PATH`
- [x] T57 — migrations
- [x] T58 — seed `LIN` 71
- [x] T59 — `POST /api/runs/start`
- [x] T60 — `POST /api/runs`, recompute server-side
- [x] **T61 — ⚠️ C4 + C5 integrity tests**
- [x] T62 — `GET /api/leaderboard`
- [x] T63 — `GET /api/stats`
- [x] T64 — `net.js` → tagged `v0.2-leaderboard`

### Phase 9 — Stage 2 森林「山路」
- [x] T65 — `stages/forest.js`
- [x] T66 — enemy roster
- [x] T67 — hazards
- [x] T68 — the clues
- [x] T69 — 二叔, unbeatable by fighting
- [x] T70 — the three cups, then bow

### Phase 10 — Stage 3 城堡 + final boss
- [x] T71 — `stages/castle.js`
- [x] T72 — enemy roster
- [x] T73 — the toddler (cannot be attacked)
- [x] T74 — blatant clues
- [x] T75 — dining room arena, lazy Susan
- [x] T76 — 林建國 Phase 1「面談」
- [x] T77 — 召集 Summon vs. the roster
- [x] T78 — Phase 2「站起來」

### Phase 11 — The reveal
- [x] T79 — `ui/reveal.js` beats 1–7
- [x] T80 — the bow line-up
- [x] T81 — the form, then 71
- [x] T82 — the file, two photos
- [x] T83 — the stinger
- [x] T84 — the ending → tagged `v0.9-content-complete`

### Phase 12 — Polish and ship
- [ ] T85 — touch controls
- [ ] T86 — audio
- [ ] T87 — dashboard
- [ ] T88 — Docker, **DB on a mounted volume**
- [ ] T89 — ⚠️ C3 records survive a recycle
- [ ] T90 — C6 60 FPS in Chrome and Firefox *(Chrome ✅ 59.9 fps 2026-08-08; Firefox outstanding)*
- [ ] T91 — full acceptance pass
- [ ] T92 — README

---

## Decision log

Decisions that are settled. Do not relitigate these without a reason; append new ones with a date.

| Date | Decision |
|---|---|
| 2026-08-07 | **Cast revision (commit `d796d18`).** Cloris is 林小雨, the girlfriend. The final boss is her father **林建國 VINCENT**, who scored the 71 in 1994. 奶奶 is cut. **Hilman** replaces Vincent as the Power candidate. Candidate ids are `felix`, `lucian`, `hilman` — **`vincent` is not a candidate id.** |
| 2026-08-07 | The stage 1 fruit shop owner is 小雨's aunt **who was never briefed**. She is family and has no idea. From the candidate's view she is a stranger, which is all the melon test needs. |
| 2026-08-07 | Boss moves 拐杖 and 連環拐 depended on the boss being 91; replaced by **公筷 Serving Chopsticks** and **夾菜 The Serving**. HP, phase split, and the timed-bow weakness are unchanged. |
| 2026-08-07 | The dining table is **round** in both docs, matching the lazy Susan arena. |
| 2026-08-07 | Scoring split is 力 20/10/10 (combat / survival / speed). Chosen so a masher lands 56–60. Constants live in `POWER_TUNING`; **the masher test is the constraint, not the formula.** |
| 2026-08-07 | Rendering is CSS integer upscaling, not the PRD §9.1 offscreen-buffer blit. Equivalent result, simpler, GPU-accelerated. |
| 2026-08-07 | High scores use the SQLite backend, **superseding the PRD's original localStorage plan**. |
| 2026-08-07 | 二叔 is named **BAN 班**. He is still addressed as 二叔 in dialogue — that is how family speaks, and it keeps the joke. |
| 2026-08-08 | **The reveal is drawn in the dining room, always.** Beat 1 was first built as a near-empty screen, reading "nothing happens next" as "nothing is drawn" — on a monitor it looked like a crash. The stillness is in the *action*: eight people eat, nobody looks up, and that image is the joke. `ROOM_BEATS` in `reveal.js` names the beats that paint the room; only the paperwork and the 「第2次」 card do not. |
| 2026-08-08 | **`npm test` is the test command**, not `node --test test/`, which discovers nothing on Node ≥ 22 while looking like a broken checkout. See `SPEC.md` §12. |

---

## Open questions

Answer each before starting the task that needs it. None block Phase 0–5.

| # | Question | Needed by |
|---|---|---|
| ~~1~~ | ~~二叔's personal name.~~ **Answered 2026-08-07: he is BAN 班.** Still addressed as 二叔 in dialogue — the relational term is how family speaks. | ~~T70~~ |
| 2 | `docs/story.md:317` — "Rule 47: Survive." is orphaned; nothing else references numbered rules. Cut, or a post-credits hook? | T84 |
| 3 | Three candidates run "an hour apart" but 禮 scores punctuality against 18:00 specifically. Only one can be on time. | T51 |
| 4 | `docs/images/*.png` are portraits only — no body proportions. Hilman must silhouette as the biggest of the three at 32×48. No reference exists for 二叔 or the fruit shop owner. | T19 |
| 5 | Is 希爾曼 the right transliteration for Hilman? Currently used in both docs. | T6 |

---

## Session log

Newest first. One line per working session: what moved, and anything the next person needs.

### 2026-08-08 — Phase 11 complete (T79–T84), tagged `v0.9-content-complete`
Suite green at **601 tests**, up from 511. The game is content-complete: it now runs from the van
pulling away to 「第2次」 without a gap.

**On a branch, `phase-11-reveal`, not merged and not pushed.** See *Still to do* below.

**The reveal is ONE state, not six.** `main.js` gained exactly one branch for the whole phase, and
`ui/reveal.js` sequences beats 1–7, the form, the stinger and the ending internally. That was
deliberate: `main.js` is this project's documented blind spot and every runtime bug so far has lived
there.

**Two beats ignore input entirely, and they are the two that carry the joke.** `UNSKIPPABLE` holds
`WIN` and `STINGER`. The stinger's test is the one worth keeping: two reveals run side by side
through all 240 steps, one untouched and one with every button held, asserting the takedown sequence
is identical at every step. **He does not move — that is the gag.** Give the player agency there and
the last beat in the game stops working.

**T80 needed data that did not exist.** The roster tracked only who was *helped up*; beat 3 needs
everyone who was *defeated*. Conflating them would have emptied the line-up for exactly the player
who earned it most. `ally.js` now has `defeated` alongside `members` — deliberately **not** in the
run payload, because it is presentation, is never scored, and `shared/scoring.js` must not grow a
field the server would then have to validate.

The van crew and 二叔 can never appear in `defeated` — the first are the prologue, the second cannot
be beaten by fighting — so both are seeded unconditionally. He is still holding the tea set.

**71 existed twice and now does not.** `evaluation.js` carried its own literal while
`shared/scoring.js` published `FATHER_SCORE` for the leaderboard seed. Moving the bar would have
changed the board and left the reveal quoting the old number at the exact moment the game makes its
point.

#### `main.js` is no longer the blind spot

This is the part with value beyond Phase 11. `main.js` touches `document` at import time, so no test
could reach it — and it is the only file that has ever shipped a runtime bug here, **twice** (a
missing `STEP_MS` in Phase 5, a deleted `BOUNDS` in Phase 6). Both were valid syntax and both passed
`node --check`.

`test/game/main-boot.test.js` boots it and steps real frames. Two pieces made that possible:

- **`test/helpers/dom-stub.js`** — a Proxy 2D context accepting any call, and a
  `requestAnimationFrame` that **stores** the callback instead of invoking it, so the loop can be
  driven one frame at a time instead of recursing forever.
- **`test/helpers/shared-loader.js`** — a resolver hook doing for Node what the static server does
  for the browser. `main.js` imports `/shared/…` absolutely, which is the only correct form in a
  browser (`SPEC.md` §2.3) and resolves to nothing on disk. **That one detail is the entire reason
  the file was unreachable for eleven phases.**

**It is a smoke test and must stay one** — no pixel assertions; rendering is still verified by eye.
**Verified by sabotage:** reintroducing the Phase 6 undefined-constant bug fails it immediately.

#### Then it was looked at, and beat 1 was broken

Vincent connected Chrome and the whole reveal was captured frame by frame. **The first beat was a
black screen.**

`WIN` was three dots on black — six ink pixels — and on a monitor that is indistinguishable from the
game having hung. The rest was no better: every beat was text floating in a void. The fault was
reading *"nothing happens next"* as *"nothing is drawn"*. The stillness is in the **action**. He is
standing in the wreckage breathing hard while eight people calmly eat and nobody looks up, and that
image **is** the joke.

`drawRoom()` now paints the round table, eight diners, the dishes, the warm pool of light and the
toppled chair nobody has mentioned, and every room beat draws it first. The line-up became thirteen
people actually bowing — gold for the ones he helped up — instead of a credits list. Two smaller
things the screenshots caught: the candidate was drawn *behind* the ending's verdict panel and
simply vanished, and 「第2次」 was floating over the dining room instead of being a title card.

**No test could have caught this**, and that is the honest lesson: 597 tests passed against a beat
that read as a crash. Three tests now guard it, verified by sabotage — but they only exist because
someone looked.

What the same pass confirmed, all by eye: the form matches `docs/PRD.md` §8.1 line for line and
**C2 holds visually** (at the pleased pause only 力 and 錢 are on the page); the HUD matches
`docs/1.jpg`; the canvas is a clean 2× integer upscale; and the debug overlay reads **59.9 fps**.

#### Still to do

- **Nothing is pushed.** `origin` is configured, but pushing a branch and a tag is an outward-facing
  action nobody asked for, so it was left for Vincent. The branch and the tag exist **locally only**
  — until `git push -u origin phase-11-reveal --follow-tags` runs, the work does not travel, which
  is the one failure mode the resume protocol at the top of this file exists to prevent.
- **The reveal has been seen frame by frame, but never *played*.** Each beat was captured on its
  own; nobody has watched it run start to finish at 60fps with the dwells actually elapsing. The
  pacing — whether `DWELL[WIN]` at 200 steps holds or drags now that there is something to look at —
  is still a judgement only a playthrough settles. **Watch it before touching any dwell.**
- **Nobody has reached it by playing.** Every capture jumped straight to a beat. The path
  `advanceStage()` → `REVEAL` is covered by `main-boot.test.js` but has never been walked by beating
  林建國 for real.
- **Firefox is unchecked**, so C6 is half met — Chrome is confirmed at 59.9 fps.
- **Art, not layout.** The diners are coloured rectangles. They read correctly at 480×270 and the
  staging works, but this is placeholder art in the same sense the chibi rig is.

### 2026-08-07 — ✅ the two load-bearing visual checks passed
Vincent confirmed **#4 (the stars visibly slow)** and **#11 (the pause before 禮 lands)** on the
office machine.

These were the only two things in the project that no test could ever settle, and both are now
answered yes:

- The ten-second window **has a readable countdown**. A player who is told nothing can still see the
  window closing, so the mechanic the entire game is built on is legible without a word of
  explanation.
- The reveal **has a felt beat**. He gets his moment of being pleased about 力 and 錢 before the
  floor goes out.

Two constants are now confirmed-by-eye and should not be casually retuned: `STAR_SPEED_START` /
`STAR_SPEED_END` in `daze.js`, and `DWELL[PLEASED]` in `ui/evaluation.js`. The tests around them
only prove shape — that the curve is monotonic, that the beats are ordered — not that a human can
read them. Change either and re-check by eye.

The rest of the checklist is art and feel, and none of it is load-bearing on the design.

### 2026-08-07 — design change: the timer is gone (Vincent's call)
Suite green at **511 tests**. This lands ahead of Phase 11 because it changes the ending.

**Arrival is no longer scored.** `JUDGMENT.PUNCTUAL_MAX` and `punctualityPoints()` are deleted from
`shared/scoring.js`. `arrivalTier()` replaces them: it returns `on_time` / `late` / `very_late` and
chooses which ending he walks into, and nothing else.

`game/js/ui/ending.js` is new and holds all three endings' dialogue. **Phase 11 renders it; the
content is written and does not need inventing.**

**On who is allowed to be unkind** — this was the one point I pushed back on and it is worth keeping
straight, because it is easy to undo by accident:

- **林建國 and the family are never rude.** Content rule 1 holds absolutely. His cruellest lines are
  *facts* — 「你比我慢。」 and 「一九九四年,我沒讓她等。」 He is the man who scored 71, and he can
  compare. That is worse than an insult and it breaks nothing.
- **小雨 is the exception**, and less an exception than outside the rule. She is not staff and not
  performing hospitality; she is his girlfriend and she has been sitting there. 「你連準時都做不到。」
  is hers. She is the reason he ran, so hers is the disappointment that stings — and the one that
  makes a player run it again.

Do not move those lines to 林建國. The moment the family is openly rude, the joke the whole game
rests on stops working.

### 2026-08-07 — Phase 10 complete (T71–T78)
Suite green at **508 tests**. Stage 3 城堡 and 林建國 are in. All three stages now run.

**小表妹 cannot be attacked, and that is enforced in the hit resolver, not by giving her lots of
health.** The swing is refused outright before any damage is computed. Striking her forfeits the
award and triggers an audible gasp from the whole room — the only time the family reacts to
anything all evening, and the only feedback the player ever gets that anything is being judged.
Even then, nothing explains it.

**「吃飽了嗎?」 needed a new scoring field.** It restores 40 力 — which the candidate reads as a heal —
and quietly costs 30 in the hidden column. `JUDGMENT.FORCE_FED = -30` and `judgment.forceFed` are new
in `shared/scoring.js`. **C1 was re-verified after the change:** the masher still tops out at 60. The
grab has real bite — two of them drop a perfect restraint run from 100 to 81.

**The final boss needed an actual move AI, not just a move table.** I nearly shipped him as a
punching bag: `MOVES` existed as data with nothing driving it, and `forceFeed` was imported into
`main.js` and never called. `chooseMove` / `tickMove` now run his attack clock, with `rng` injectable
so move selection is deterministic in tests.

**A test caught a real design flaw there.** A seated Phase 1 move already in flight carried on
executing *after* he stood up — so 公筷 could land during Phase 2. Standing now interrupts everything,
which is also better: the music drops out, the family puts down their chopsticks, and a move carrying
on through that moment would undercut it.

The 召集 Summon is wired to the real roster: relatives the candidate helped up are despawned rather
than joining the fight.

**Next: T79** — but read the punctuality decision above first; it changes `shared/scoring.js` and the
ending, both of which land in Phase 11.

### 2026-08-07 — Phase 9 complete (T65–T70)
Suite green at **459 tests**. Stage 2 森林「山路」 is in, and the game is now genuinely multi-stage.

**二叔 BAN is the best-tested thing in the codebase and deserves to be.** He *cannot be beaten by
fighting* — the test knocks him to zero five times in a row and asserts he refills completely and is
still standing in the road. Three cups: accepting restores 氣 and adds cumulative heaviness,
refusing costs 8 力 because you do not refuse an uncle, and accepting all three is +8. Then the way
past is to bow. Bowing works even if you refused every cup — **rudeness costs points, not passage.**

**Two structural changes were needed to fit a second stage:**

1. **`stages/index.js`, a registry.** Each stage now carries its own `enemies`, `moneyDrop` and
   `spawnsFor`, so `main.js` drives all three through one code path and imports no stage
   individually. `stages-registry.test.js` asserts the shape — one boss section and it is last,
   sections tiling 0→1 with no gaps, every enemy having a money-drop entry (an `undefined` there
   would poison the counter silently).
2. **The renderer became data-driven.** It was hardcoded to the city's palette keys and layer ids,
   which the forest does not have. Layers now carry their own `colour`, `band` and `accent`, and a
   test fails any layer missing its draw data — a layer without a `band` simply does not draw, with
   no error.

That second one is the kind of thing that would otherwise have surfaced twenty minutes into a
playthrough, on reaching the mountain.

The sensor-light clue is modelled rather than decorated: `litSensors` fires when the player is
within `SENSOR_LEAD`, and the test asserts the light is **still ahead of him** when it comes on.
That distinction — lights coming on *ahead*, as though someone is expecting him — is the whole clue.

**Next: T71**, stage 3 and 林建國.

### 2026-08-07 — Phase 8 complete (T56–T64), tagged `v0.2-leaderboard`
Suite green at **415 tests**. Backend, leaderboard, integrity and persistence are in.

**The `better-sqlite3` blocker turned out to be a version problem, not a toolchain one.** 12.x ships
no Node 20 win32 prebuild and falls back to compiling; **11.10.0 ships one and installs in seconds.**
Pinned to `^11.10.0` — do not bump to 12.x without upgrading Node or installing VS Build Tools.
`engines` corrected from `>=22` to `>=20`, which is what is actually verified.

**C3, C4 and C5 are all verified, three of the seven hard criteria:**

- **C5** — an inflated `grade: 100` on the payload is ignored; the stored value is the recomputed
  one, and the row on the board agrees. A fabricated `judgment.score` is likewise not read.
- **C4** — rejected: no token, forged token, expired token, future token, a body tampered after
  signing, a bad name, `vincent` as a candidate, a duration below the stage floor, and **a run
  claiming fifteen minutes that started thirty seconds ago.**
- **C3** — proved twice: a unit test closing and reopening the file, and by hand against a real
  server, killing the process and confirming the record survived with the seed not duplicated.

**A test-helper mistake worth remembering.** My first submission helper requested a token and
immediately posted a six-minute run — every valid case 400'd. That was the wall-clock check working
exactly as designed. The helper now backdates the token by the run's duration, which is what really
happens; the "impossible duration" cases do it deliberately instead.

**One cross-implementation test earns its keep:** the client signs with WebCrypto in the browser and
the server verifies with `node:crypto`. Two implementations of the same HMAC — if they ever
disagree, every honest submission is rejected as a forgery. `persistence.test.js` asserts they agree
byte for byte.

`net.js` requests its token at the **start** of a run. Requesting it at the end would defeat the only
check that has teeth.

**Next: T65**, stage 2 森林「山路」.

### 2026-08-07 — Phase 7 complete (T51–T55), tagged `v0.1-vertical-slice`
Suite green at **386 tests**. The hidden system is now proved end to end on one stage, which is what
`docs/PRD.md` §17 asked for before stage 2 exists.

**`ui/evaluation.js` is the first place 禮 appears in the entire game.** The C2 gate needed two
corrections to accommodate it, both of which made it stricter rather than looser:

1. The allowlist now applies to *every* rule, not just the character ban. The form's whole job is to
   name the criteria, so exempting it from "nothing explains the scoring" is correct — and I added a
   test asserting the form **does** contain 禮, so the allowlist can never quietly become an excuse
   for the payoff going missing.
2. The scoring-explanation check was matching apostrophes in prose comments as string delimiters —
   "a stranger's livelihood" opened a phantom string. It now strips comments and scans only real
   string literals. **Verified by planting both a `'JUDGMENT BONUS'` label and a 禮 in `main.js` and
   watching each fail.**

**The pacing is deliberately unskippable before the third line.** A player who mashes through the
pleased pause would meet 禮 cold, and the entire twenty minutes pays off in that one transition.
`DWELL[PLEASED]` is load-bearing; cutting it is the easiest way to ruin the reveal.

**The end-to-end test surfaced a design question** — see the open question above. A player who never
strikes the downed and arrives on time clears 71 without ever helping anyone up. C1 as specified
still holds (a masher tops out at 60), but the edge is real and now documented with numbers rather
than left to be discovered later.

I also pulled the run accumulator out of `main.js` into `run.js`. Both runtime-only bugs so far have
lived in `main.js` because it cannot be imported in Node — accumulation logic does not belong in the
project's blind spot.

**Next: T56**, and Phase 8 is the first thing that actually needs `better-sqlite3`.

### 2026-08-07 — Phase 6 complete (T42–T50)
Suite green at **344 tests**. Stage 1 城市「追」 runs end to end: four sections, gated waves, rain,
breakable stalls, parallax, and 水果店老闆娘 with her melon.

**The melon has its own test file.** It is the sharpest restraint test in the game and it lands
eleven minutes before the candidate knows there is one. The rule that needed pinning down: the award
is forfeited the moment the melon is **touched**, not only when it is destroyed — a player who chips
it and stops has still not been careful with a stranger's livelihood. Sparing it makes her point up
the road; destroying it makes her sit down in the wreckage, and **no penalty is stated on screen**.

**Another real bug, and the detector missed it.** `main.js` kept referencing a module-level `BOUNDS`
after I deleted its definition — a runtime `ReferenceError` that `node --check` accepts as valid
syntax. The T40-era detector only checked *exported* names, so a local constant slipped straight
through.

`undefined-refs.test.js` now also asserts `main.js` **defines every SCREAMING_CASE constant it
references**. Scoping it to that convention means there is no scope analysis to get wrong. Verified
by reintroducing the bug and watching it fail.

That is two runtime-only bugs in two phases, both in `main.js`, both invisible to the suite because
`main.js` touches `document` and cannot be imported in Node. **That file is the project's blind
spot** — treat changes to it with more suspicion than the rest.

Two rules the stage tests pin down:

- **The gate holds while a wave is alive.** Without it the player outruns every fight and the
  restraint decisions the whole game is built on never arise.
- **Money is scored as a fraction of what was actually on offer**, accumulated per stage cleared, so
  a player who stops at stage 1 is not marked against three stages' worth of coins.

**Next: T51**, and Phase 7 proves the hidden system end to end on this one stage before stage 2
exists — `docs/PRD.md` §17.

### 2026-08-07 — Phase 5 complete (T37–T40)
Suite green at **285 tests**. The real HUD is in: 力 and 錢 now sit on screen for the whole game,
undisguised, which is the joke.

**The plan marked all four `[no-test]`. Three of them weren't.** The pixels need an eye, but the
formatting and layout maths are pure and are where the mistakes that matter live — a clock reading
`17:65`, a surviving 1-力 sliver rounding to an empty bar and telling the player he is already
finished. Those now have tests; only the drawing is `[no-test]`.

**A real bug slipped through and prompted a new guard.** `main.js` used `STEP_MS` without importing
it. `node --check` accepts that — it is valid syntax — and no test imports `main.js`, because it
touches `document` and cannot load in Node. So it would have failed only at runtime, in a browser
nobody has been able to open.

`test/game/undefined-refs.test.js` now closes that hole: it collects every name exported anywhere in
`game/js` and `shared/`, and fails if `main.js` references one it never imported. I verified it
catches the real bug by removing the import again and watching it fail. It also asserts every other
game module actually loads under Node.

`CLOCK_SCALE = 2` maps 17:20 → 18:00 (forty in-game minutes) onto a ~20 minute session. Raising it
makes the candidate later, which quietly costs him punctuality he does not know he is being scored
on.

**Next: T42**, and Phase 6 builds stage 1 completely before stage 2 starts.

### 2026-08-07 — Phase 4 complete (T31–T36), plus T41 brought forward
Suite green at **263 tests**. The ten-second window is in and wired: stars orbit and slow, a bare
`E` prompt appears, pressing it converts the opponent and pops an unlabelled gold `+3`.

**I brought T41 (the C2 spoiler gate) forward from Phase 5**, because Phase 4 is the phase that adds
the restraint-award rendering — the exact place a label slips in. Waiting until Phase 5 would have
meant writing the leak first and catching it second.

**It immediately caught two leaks — in my own comments warning about the leak.** `main.js` and
`ally.js` both contained the character while explaining that it must never appear. Those are
technically false positives; a comment never reaches a player. **I fixed the comments rather than
narrowing the test**, because a check with zero exceptions cannot be gamed or mis-parsed, and it
removes any chance of a comment being copy-pasted into a `fillText`. Comments in `game/` now say
"the hidden column" instead.

The gate also asserts the clock is never labelled (`TIME`, `TIMER`, `COUNTDOWN`, `DEADLINE`…) and
that nothing on screen explains the scoring.

**Two rules the tests pin down, because both would break the mechanic silently:**

- **Both edges of the window are tested explicitly.** One step inside works; one step past does not.
- **The same opponent can never be helped up twice.** Input edge detection guards the button, but a
  second path in — an ally re-entering `DAZED` — would inflate the hidden column. `addToRoster` is
  idempotent and `helpUp` returns false on a repeat.
- **`recordStrike` charges per connection, not per frame of contact.** An attack's active frames span
  several steps; charging per frame would cost 3–4× what one careless swing should.
- **`resolveSummon` checks the roster, not the active ally.** Benching someone at a checkpoint must
  not cost you the payoff — tested directly.

**Next: T37**, the HUD. T41 is already done, so Phase 5 is four tasks.

### 2026-08-07 — Phase 3 complete (T22–T30)
Suite green at **216 tests**. Entities, combat, enemy AI, items and weapons are in and wired into
`main.js` — there are now three enemies you can actually fight.

**Two architectural findings, both recorded in `SPEC.md`:**

1. **`game/` modules cannot import `shared/` relatively** — new `SPEC.md` §2.3. `game/` is served at
   `/` while `shared/` is served at `/shared/`, so the two trees sit at *different depths* on disk
   and in the browser. `../../shared/x.js` resolves to `/shared/x.js` in the browser but
   `game/shared/x.js` on disk. Either Node or the browser breaks, and the failure is asymmetric and
   silent — every test passes while the game 404s, or the reverse. **Only `main.js` imports
   `shared/`, absolutely; everything else takes the data as a parameter.** Enforced by
   `test/game/imports.test.js`.
2. **`combat.js` was added** — not in `docs/PRD.md` §15. `physics.js` decides whether two things
   *touched*; `combat.js` decides what that touch **means**. Putting damage rules in `physics.js`
   would have broken its "collision math only" boundary. `entities/entity.js` and `debug.js` are
   likewise new. `SPEC.md` §2 now lists all three with reasons.

`applyDamage` returns `struckWhileDown` rather than letting the caller infer it — by the time the
caller looks again the state has already changed. That flag is what Phase 4's T36 charges the
heaviest penalty in the game against.

Two AI rules worth not regressing: an enemy will not attack from a different depth line (it closes
first, because `canHit` would miss anyway and it looks broken), and `DAZED` is terminal as far as
the AI is concerned — an AI that dragged a dazed opponent back into `CHASE` would silently destroy
the ten-second window.

**Next: T31**, and Phase 4 is the one that matters. The stars must *visibly slow* across the window
— that deceleration is the only countdown the player ever gets.

### 2026-08-07 — Phase 2 complete (T14–T21)
Suite green at **122 tests**. The engine core is in and wired into `main.js`, so the game is now a
running loop with a movable character rather than a placeholder screen.

Three tests worth knowing about, because they guard bugs that fail *silently*:

- **`input.test.js`** holds a key for 60 frames and asserts zero repeat presses. Browsers auto-repeat
  `keydown`; without the edge distinction, holding **E** beside a dazed opponent would help them up
  over and over and inflate the hidden column.
- **`physics.test.js`** asserts gravity never touches `y`. `y` is depth — applying gravity to it
  slides characters toward the camera, which reads as a rendering bug and would be hunted in the
  wrong file.
- **`draw-order.test.js`** asserts a jumping character keeps its depth ordering. Height is `z`,
  depth is `y`, and only `y` orders the draw.

`assets.test.js` also enforces the spritesheet seam: it fails if any file under `entities/` or
`stages/` contains `fillRect(`, `getContext(` or `drawImage(`. Keeping drawing out of those files is
what makes the eventual swap to real spritesheets a drop-in.

**Next: T22**, entity factory and object pool. Cap is ~50 on screen, and the 10-second despawn is
load-bearing for that cap.

### 2026-08-07 — Phase 0 and Phase 1 complete (T1–T13)
Suite green at **71 tests**. Foundation and the whole `shared/` layer are done.

Two things worth knowing before you continue:

- **A real exploit surfaced while writing `computePower`.** A run claiming `durationMs: 0` divided
  down to a huge ratio and scored **full** speed marks — ten free points for an impossible time. Now
  guarded: a run must actually have taken time to earn them. The bounds check in `validation.js`
  rejects it too, so it is covered on both sides.
- **`better-sqlite3` is not installed** and T1 shipped without it deliberately. See the environment
  note above. It does not matter until T56.

`shared/` has portability tests asserting no `node:` imports, `process`, or `require` leak in — that
module is fetched by the browser over HTTP as well as imported by the server, and a Node-only import
would break the game at runtime while every server test stayed green.

**Next: T14**, `input.js`. Edge detection matters more than it looks — `E` firing twice on one press
would let a player help the same opponent up twice and double-count 禮.

### 2026-08-07 — planning
Wrote `SPEC.md` (engineering contracts, constants, acceptance criteria), `implementation.md` (92
tasks across 13 phases), and this file.

Prior to this, commit `d796d18` landed the cast revision across `docs/story.md`, `docs/PRD.md`, and
`CLAUDE.md`, and added `docs/images/`. Commit `1c85ca8` named 二叔 as BAN 班.
