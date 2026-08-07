# Progress — 熱血物語：見家長

**This file is the single source of truth for where the work stands.** It is committed to git, so it
travels between machines. Update it after **every** task and commit it with that task's code.

---

## ⚠️ Resume protocol — read this first

**The state lives in git, not on a machine.** If you stop without pushing, the other machine cannot
see your work.

### Before you stop working, on any machine

```bash
node --test test/          # leave the suite green if you possibly can
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
node --test test/          # confirm you inherited a green suite
```

Then read **Current status** below and continue from the first unchecked task.

### First time on a new machine

```bash
git clone https://github.com/vincent7q/passionatestory.git
cd passionatestory
npm install
npm run dev                # http://localhost:8080
```

Requires **Node ≥ 22**. `better-sqlite3` compiles a native binding on install — on Windows this
needs the Visual Studio Build Tools; on Linux, `build-essential` and `python3`. If `npm install`
fails there, that is why.

**The game cannot be opened via `file://`.** These are real ES modules; they must be served over
HTTP. Always run through the server.

---

## Current status

| | |
|---|---|
| **Date** | 2026-08-07 |
| **Branch** | `main` |
| **Phase** | ✅ Phases 0-7 complete — next is **Phase 8, backend & leaderboard** |
| **Next task** | **T56** — `db.js` ⚠️ needs `better-sqlite3`, see environment note |
| **Suite** | 🟢 green — **386 tests** |
| **Blocked on** | ⚠️ **T56 needs `better-sqlite3`, which will not install here.** See the environment note below. |

**C1 is satisfied and measured.** With the formula as committed:

| Run | 力 | 錢 | 禮 | Total |
|---|---|---|---|---|
| Masher — maximal violence, zero restraint | 36 | 20 | **0** | **56** |
| 林建國, 1994 | — | — | — | **71** |
| Restraint — helps people up, spares the melon, bows | 29 | 20 | **40** | **89** |

71 sits cleanly between them, so the hidden column is what decides it. If a
tuning change moves that band, `test/shared/scoring.masher.test.js` fails —
**retune `POWER_TUNING`, never the test.**

### ⚠️ Open design question — a player can clear 71 without ever helping anyone up

Phase 7's end-to-end test surfaced this. All four cases are now pinned as tests in
`test/shared/scoring.masher.test.js`:

| Player | 力 | 錢 | 禮 | Total | vs 71 |
|---|---|---|---|---|---|
| Masher — hits the downed, arrives late | 40 | 20 | 0 | **60** | ✅ short |
| Masher — hits the downed, arrives on time | 40 | 20 | 0 | **60** | ✅ short |
| **Violent but never hits the downed, on time** | 40 | 20 | 17 | **77** | ⚠️ **clears it** |
| Perfect set-pieces, never helps anyone up | 40 | 20 | 40 | **100** | by design |

**C1 as specified holds.** A masher tops out at 60, because striking the downed
wipes out even the punctuality he earned — eleven short.

The third row is the question. That player wrecks the fruit stall, flattens the
market row, refuses all three of 二叔 BAN's cups and never bows — but he stops
attacking when someone falls, and he is on time. That earns `NEVER_STRIKE_DOWNED`
(+5), `NEVER_STRIKE_TODDLER` (+4) and punctuality (+8) = 17, which clears 71.

Arguably fine: not hitting a man who is down **is** restraint, and it is the
behaviour the family is measuring. Arguably wrong: he never once helped anyone
up, and 林建國 would not approve that man.

**This is a design call, not a bug.** If it should not clear 71, retune the
whole-run conditionals down (`NEVER_STRIKE_DOWNED` and `NEVER_STRIKE_TODDLER`
are the levers) — the test documents the current numbers so any change is
visible.

### ⚠️ Environment note — `better-sqlite3` will not install on this machine yet

`npm install better-sqlite3` fails here: there is **no prebuilt binary for Node 20 on Windows**, so
it falls back to compiling, and node-gyp cannot find Visual Studio.

```
gyp ERR! find VS  Could not find any Visual Studio installation to use
```

**Deferred deliberately** — it is a Phase 8 dependency (T56) and nothing before then touches it. Do
not let it block Phase 0–7.

**The fix, in order of preference:**

1. **Upgrade to Node 22.** `package.json` already declares `"node": ">=22"` and this machine is on
   **v20.17.0**, so the runtime is out of spec regardless. Node 22 has prebuilds for
   `better-sqlite3` on Windows and the compile is skipped entirely. This is the recommended fix and
   it resolves both problems at once.
2. Install the Visual Studio Build Tools with the "Desktop development with C++" workload.

Everything through Phase 7 runs fine on Node 20 — `node --test`, Fastify 5, and plain ES modules all
work. Only the native binding is affected.

### ⏳ Outstanding visual verification

Rendering tasks are verified by looking at them (`SPEC.md` §12). The Chrome extension was not
connected during the session that wrote T3–T5, so **the following has been proved by test and HTTP
response but not yet seen on screen:**

- **T3** — the canvas actually rendering, and staying crisp while the window resizes through
  integer scale steps.
- **T4/T5** — the loop holding 60 FPS with the debug overlay (backtick toggles it).
- **T19/T20** — what the chibi rig actually *looks like*. The pose table and palettes are tested,
  but nobody has yet seen a sprite. Expect the first draw to need art tuning; that is normal and is
  why `POSES` is data rather than code.
- **T21** — depth sorting on screen. The ordering logic is tested, but the walkable strip
  (`STRIP` in `main.js`) is a placeholder until Phase 6 gives each section real values.

- **Phase 3 combat feel.** Every rule is unit-tested, but frame data is a first guess. Expect
  `ATTACKS` in `combat.js` and `AI` in `entities/enemy.js` to want retuning once someone plays it —
  both are data tables for exactly that reason.

- **Phase 4 — the star deceleration.** The maths is tested (monotonic, and ≥2× slower by the end),
  but whether that reads *as a countdown* to a player who is told nothing is a judgement only a
  human can make. **This is the single most important thing to eyeball in the whole project.** If
  the slowing is not legible, the ten-second window has no signal and the game's central mechanic is
  invisible.

- **Phase 5 — HUD layout.** The formatting is tested (clock never reads 17:65, a 1-力 sliver never
  rounds to an empty bar), but whether it *matches* `docs/1.jpg` / `docs/2.jpg` is a comparison only
  an eye can make.

- **Phase 6 — stage pacing.** Section lengths, wave sizes and `gateWidth` are first guesses. Whether
  the chase *feels* like a chase, and whether the market row presents a real temptation to smash,
  can only be judged by playing it.

- **Phase 7 — the pacing of the reveal.** The beat order and dwell times are tested, and the reveal
  is deliberately unskippable before the third line lands. But whether the pause on a good 力 and 錢
  actually *feels* like a moment of being pleased, before the floor goes out, is the other judgement
  only a human can make. It and the star deceleration are the two things this whole project rests on.

What *is* proved: 386 unit tests; every file passes `node --check`; `test/game/undefined-refs.test.js`
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
4. **The stars visibly slow** over the ten seconds, and a bare `E` prompt appears when you stand
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
11. **Beat the boss and watch the form.** 力 and 錢 write in first and should land as a win; there
    is a real pause; then 禮 arrives with 「他沒看到這一欄」 beside it, and 林建國 (1994) — 71
    underneath. Mashing must not fast-forward past the pause.
12. Name entry accepts three initials and returns to rest.

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
- [ ] T56 — `db.js`, WAL, `DB_PATH`
- [ ] T57 — migrations
- [ ] T58 — seed `LIN` 71
- [ ] T59 — `POST /api/runs/start`
- [ ] T60 — `POST /api/runs`, recompute server-side
- [ ] **T61 — ⚠️ C4 + C5 integrity tests**
- [ ] T62 — `GET /api/leaderboard`
- [ ] T63 — `GET /api/stats`
- [ ] T64 — `net.js` → tag `v0.2-leaderboard`

### Phase 9 — Stage 2 森林「山路」
- [ ] T65 — `stages/forest.js`
- [ ] T66 — enemy roster
- [ ] T67 — hazards
- [ ] T68 — the clues
- [ ] T69 — 二叔, unbeatable by fighting
- [ ] T70 — the three cups, then bow

### Phase 10 — Stage 3 城堡 + final boss
- [ ] T71 — `stages/castle.js`
- [ ] T72 — enemy roster
- [ ] T73 — the toddler (cannot be attacked)
- [ ] T74 — blatant clues
- [ ] T75 — dining room arena, lazy Susan
- [ ] T76 — 林建國 Phase 1「面談」
- [ ] T77 — 召集 Summon vs. the roster
- [ ] T78 — Phase 2「站起來」

### Phase 11 — The reveal
- [ ] T79 — `ui/reveal.js` beats 1–7
- [ ] T80 — the bow line-up
- [ ] T81 — the form, then 71
- [ ] T82 — the file, two photos
- [ ] T83 — the stinger
- [ ] T84 — the ending → tag `v0.9-content-complete`

### Phase 12 — Polish and ship
- [ ] T85 — touch controls
- [ ] T86 — audio
- [ ] T87 — dashboard
- [ ] T88 — Docker, **DB on a mounted volume**
- [ ] T89 — ⚠️ C3 records survive a recycle
- [ ] T90 — C6 60 FPS in Chrome and Firefox
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
