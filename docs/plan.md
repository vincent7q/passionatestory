# Development Plan — Godot restart

How `docs/develop_workflow.md` turns into concrete work for 熱血物語:見家長.

This file is the **overview and progress tracker**. Each phase has a detailed page in
`docs/roadmap/` with its design, steps, tests, done-when, risks and open questions.

The workflow's ten phases are kept in its order (§27). Phase 0 is added in front, in two parts:

- **0A — Storyboard & game bible.** The top of the workflow's pipeline (§2, §21: *storyboard →
  game design bible → data*) and the registries §31 asks for before anything is built. Design
  work only; no Godot needed.
- **0B — Project setup.** An empty Godot project, tests, scaling, web export.

0A and 0B can run in parallel; Phase 1 needs both.

---

## Decisions

| # | Question | Decision | Status |
|---|---|---|---|
| D1 | Engine & language | Godot 4 (latest stable, standard build, not .NET) · GDScript | ✅ agreed |
| D2 | Target platform | Develop on desktop; prove the web export early (Phase 0) | ✅ agreed |
| D3 | Content data format | Custom `Resource` classes saved as text `.tres` | ✅ agreed |
| D4 | Resolution & art | **1920×1080 window.** Game world rendered at 480×270 pixel art, scaled exactly 4×. HUD, dialogue and all text drawn at native 1920×1080 | ✅ agreed |
| D5 | Test framework | GUT, run headless | ✅ agreed |
| D6 | Leaderboard / backend | Out of scope until Stage 1 is complete (Phase 10) | ⏳ proposed |
| D7 | Art | Placeholder sprites until Phase 10; everything goes through `AnimationSet` | ⏳ proposed |

What D4 means in practice:

- **Gameplay units are world pixels in the 480×270 space.** Speeds, hitboxes, ranges and level
  lengths are all in world px. One world px = 4 screen px at 1080p.
- Sprites follow the PRD: 32×48 base, chibi, thick outlines (they appear 128×192 on screen).
- The world is scaled by the **largest whole number that fits the window** (4× at 1080p, 8× at
  4K, 2× at 768p, with letterboxing) so pixels stay square. The UI layer scales smoothly.
- Chinese text is never rendered inside the 480×270 world, so it stays readable.

---

## Progress

| Phase | | Detail | Size | Status |
|---|---|---|---|---|
| 0A | Storyboard, game bible & registries | [phase-00a](roadmap/phase-00a-storyboard.md) | M | 🔄 storyboard final (A0–A5); bible & registries next |
| 0B | Project setup | [phase-00b](roadmap/phase-00b-setup.md) | S | ⏳ needs Godot |
| 1 | Core data architecture | [phase-01](roadmap/phase-01-core-data.md) | S | |
| 2 | CharacterData & SkillData | [phase-02](roadmap/phase-02-character-skill-data.md) | M | |
| 3 | Combat system | [phase-03](roadmap/phase-03-combat.md) | L | |
| 4 | Skill sequence system | [phase-04](roadmap/phase-04-skill-sequences.md) | M | |
| 5 | Character editor | [phase-05](roadmap/phase-05-character-editor.md) | M | |
| 6 | Skill editor | [phase-06](roadmap/phase-06-skill-editor.md) | L | |
| 7 | Enemy & AI data | [phase-07](roadmap/phase-07-enemy-ai.md) | L | |
| 8 | Level & event system → **vertical slice** | [phase-08](roadmap/phase-08-level-event.md) | L | |
| 9 | Content validation | [phase-09](roadmap/phase-09-validation.md) | M | |
| 10 | Content production | [phase-10](roadmap/phase-10-content.md) | XL | |

Sizes are relative effort, not time: S is a handful of steps, XL is the rest of the game.

## Milestones

| | Milestone | Reached at end of | What you can see |
|---|---|---|---|
| M0a | The game on paper | Phase 0A | The whole game storyboarded beat by beat; bible pages; every id fixed |
| M0b | Hello Godot | Phase 0B | An empty 1920×1080 project that runs, a passing headless test, a web build that loads |
| M1 | Felix punches someone | Phase 3 | Felix fights an office worker; defeat → dazed → help up; 力/錢/時/勇 tracked |
| M2 | Skills are data | Phase 4 | Felix's three specials, each built only from `.tres` |
| M3 | Tools | Phase 6 | New characters and skills made and tested in the editor |
| M4 | **Vertical slice** | Phase 8 | Prologue → short Stage 1 → fruit shop owner → evaluation form |
| M5 | Safe content | Phase 9 | A validator that blocks broken or spoiler-leaking content |
| M6 | Stage 1 complete | Phase 10 | The full first stage, playtested |
| M7 | The whole game | Phase 10 | All five stages, the dining room, the reveal, the endings, the 1994 bonus |

## Dependencies

```text
0A ─┐
    ├─► 1 ─► 2 ─► 3 ─► 4 ─┬─► 5 ─► 6 ─┐
0B ─┘                     │           ├─► 8 ─► 9 ─► 10
                          └─► 7 ──────┘
```

- The storyboard (0A) feeds the build directly: every beat becomes an event in Phase 8, the
  slice's beats define the vertical slice, and Phase 10 is built beat by beat from it.
- 5 (character editor) needs 2; it lists skills, so it is easiest after 4.
- 6 (skill editor) needs 4 — it edits skill sequences.
- 7 (AI) needs 3 and 4 — enemies use the same combat and skills as the player.
- 8 needs 3 and 7. 9 formalises checks that start in Phase 1 and grow every phase.
- If editing in the Godot inspector proves enough for the slice, 5–6 *could* move after 8. That
  would be a deviation from the workflow, so it is only done if decided explicitly.

---

## How a step gets done

Work **one step at a time, in order.** A step is finished when:

1. The code or data exists, and it does what the step says.
2. Headless tests pass (from step B5 onwards).
3. Any new or changed data type is documented in `docs/schemas/` (from Phase 1 onwards).
4. The validator passes (from Phase 9; earlier, the `ContentDB` load checks).
5. The step is ticked in its phase page, and the Progress table above is updated when a phase
   closes.
6. It is committed with a message that names the step (e.g. `Phase 1.2: ContentDB loads by id`).

## Hard success criteria — carried through every phase

> **The final storyboard (`docs/storyboard/`, 2026-10-04) supersedes the story and scoring details in
> the phase pages.** Phases 1, 3, 7, 8, 9 and 10 still quote the old 禮 values (37, 71, 18:00, three
> stages, three candidates). When a phase starts, take its numbers and content from the storyboard
> (README §3 scoring, §6 endings) and update that phase page first.

From PRD §16, the old `SPEC.md` and the story bible. These must never regress:

| # | Criterion | Enforced by |
|---|---|---|
| C1 | **A mashing player cannot pass (70).** A max-violence, zero-restraint run lands around 48–56 | Automated test from Phase 3; validator from Phase 9 (scoring values are data, so a data edit can break it) |
| C2 | **The character 勇 never appears on screen before the evaluation form (R-07)** | String-table scan from Phase 1; validator from Phase 9; playthrough |
| C3 | A full 勇 column needs help-ups (set pieces total 36 < 40) | Test from Phase 3; validator from Phase 9 |
| C4 | The clock is unlabelled and unscored; the pause menu explains nothing | Phase 8 review; playthrough |
| C5 | Adding a character, skill, enemy or level needs no core-code change (§29) | Each phase's done-when |
| C6 | Stable 60 FPS | Profiling in Phase 8 and Phase 10 |

## Open questions (collected)

Answered questions move into the relevant phase page. Owner: you.

| # | Question | Needed by | Proposal |
|---|---|---|---|
| Q1 | How fast does the in-game clock run? | Phase 8 | ✅ Decided in the storyboard (README §3.5): 17:10 → 19:00, 15 real s per game-minute, ≈ 27.5 min of play |
| Q2 | When does "late" become "very late"? | Phase 10 | ✅ Decided: late 19:01–19:09, very late ≥ 19:10 |
| Q3 | Can a knocked-down (lying, not yet defeated) opponent be hit? | Phase 3 | Yes, and it counts as striking a downed opponent (−4). That is the temptation |
| Q4 | How does 氣 refill, apart from tea? | Phase 3 | Slow regen while not attacking, plus on landing hits |
| Q5 | Coins: collected by walking over them, or with E? | Phase 3 | Walk over. E is kept for people and items |
| Q6 | Where do music and SFX come from now that Web Audio synthesis is gone? | Phase 10 | Placeholder SFX from a free library; music decided later |
| Q7 | Which Traditional Chinese font(s)? | Phase 8 | A pixel-style TC font for HUD numbers and names (candidates: Cubic 11, Fusion Pixel — check licences) and a handwriting-style font for 林建國's form |
