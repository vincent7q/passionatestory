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
| **Phase** | Phase 0 — Foundation |
| **Next task** | **T2** — Fastify server, static serving, `/healthz` |
| **Suite** | 🟢 green — 1 test |
| **Blocked on** | Nothing. See the environment note below; it does not bite until T56. |

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
- [ ] T2 — Fastify server, static serving, `/healthz`
- [ ] T3 — canvas page, integer upscaling `[no-test]`
- [ ] T4 — fixed-timestep loop
- [ ] T5 — debug frame-time overlay `[no-test]`

### Phase 1 — `shared/` ← where correctness lives
- [ ] T6 — `shared/characters.js`
- [ ] T7 — scoring constants
- [ ] T8 — `computeMoney`
- [ ] T9 — `computeJudgment` (the hidden column)
- [ ] T10 — `computePower`
- [ ] T11 — `computeGrade`, `leaderboardValue`
- [ ] **T12 — ⚠️ C1 masher test**
- [ ] T13 — `shared/validation.js`

### Phase 2 — Engine core
- [ ] T14 — `input.js`
- [ ] T15 — footprint overlap
- [ ] T16 — `canHit` (z overlap + facing + active frames)
- [ ] T17 — integration; gravity on `z` only, never `y`
- [ ] T18 — `camera.js`
- [ ] T19 — chibi rig `[no-test]`
- [ ] T20 — animation frames `[no-test]`
- [ ] T21 — y-sorted renderer `[no-test]`

### Phase 3 — Entities & combat
- [ ] T22 — entity factory + pool
- [ ] T23 — player movement
- [ ] T24 — attack chains
- [ ] T25 — enemy AI state machine
- [ ] T26 — damage, knockback, knockdown
- [ ] T27 — guard and parry
- [ ] T28 — grabs and throws
- [ ] T29 — weapons
- [ ] T30 — items and 錢

### Phase 4 — The ten-second window ⚠️ the heart of the game
- [ ] T31 — `DAZED` state, star timer
- [ ] T32 — the **E** prompt
- [ ] T33 — help-up → `ALLIED`
- [ ] T34 — roster tracking
- [ ] T35 — active ally, `Q`
- [ ] T36 — strike-on-downed penalty

### Phase 5 — HUD
- [ ] T37 — 力 / 氣 bars `[no-test]`
- [ ] T38 — the clock (never labelled) `[no-test]`
- [ ] T39 — 錢 counter `[no-test]`
- [ ] T40 — damage numbers, bare gold `+3` `[no-test]`
- [ ] **T41 — ⚠️ C2 spoiler test**

### Phase 6 — Stage 1 城市「追」
- [ ] T42 — `stages/stage.js` base
- [ ] T43 — parallax
- [ ] T44 — `stages/city.js` sections
- [ ] T45 — enemy roster
- [ ] T46 — rain hazard
- [ ] T47 — breakable market stalls
- [ ] T48 — boss 水果店老闆娘
- [ ] T49 — the melon (40 HP)
- [ ] T50 — stage clear

### Phase 7 — Evaluation form, end to end
- [ ] T51 — run accumulator
- [ ] T52 — `ui/evaluation.js`
- [ ] T53 — the pacing
- [ ] T54 — name entry
- [ ] T55 — vertical slice → tag `v0.1-vertical-slice`

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

### 2026-08-07 — planning
Wrote `SPEC.md` (engineering contracts, constants, acceptance criteria), `implementation.md` (92
tasks across 13 phases), and this file. No code yet. **Next: T1.**

Prior to this, commit `d796d18` landed the cast revision across `docs/story.md`, `docs/PRD.md`, and
`CLAUDE.md`, and added `docs/images/`.
