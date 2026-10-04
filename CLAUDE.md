# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

熱血物語：見家長 (*Meeting the Parents*) — a side-scrolling beat-'em-up in the style of River City
Girls, built around a twist.

**What the player experiences:** his girlfriend 林小雨 CLORIS is dragged into a black van. He chases
it across a city, through his university at night, up a private mountain, into a garage and a
mansion to get her back. Five stages.

**What is actually happening:** every opponent is Lin family or staff, and the mansion is a house
with dinner on the table at 19:00. The family stages this to learn who a man is when he believes the
stakes are real. **His own parents are in on it too:** his father sat the same test in 1994 and lost
to 小雨's father, 71 to 70. He is not rescuing her. He is meeting her parents.

## Current state of the repo — read this first

**There is no code right now.** The previous implementation (vanilla ES modules + Canvas 2D game,
Fastify/SQLite leaderboard server, dashboard, `node --test` suite, Docker deploy) has been removed
from the working tree. It still exists at `HEAD` in git history (`git show HEAD:<path>`) if anything
needs to be consulted or salvaged. Do not restore or commit those deletions without being asked.

The new direction is `docs/develop_workflow.md`: a **Godot**, data-driven content pipeline. That
means there are currently no build, lint, or test commands. Once a Godot project exists, update this
file with how to run it, run tests, and run the data validator.

**`docs/plan.md` is the plan and progress tracker; `docs/roadmap/phase-*.md` holds each phase's
design and steps.** Work one step at a time, in order; check where the Progress table says we are
before starting, and tick steps off as they land.

Agreed decisions (details in `docs/plan.md`): Godot 4 standard build with **GDScript**; content as
custom `Resource` classes in text **`.tres`**; tests with **GUT**, run headless; develop on
desktop, keep the web export working. **Display:** 1920×1080 window; the game world is 480×270
pixel art scaled by a whole number (4× at 1080p), and the HUD, dialogue and all text are drawn
at native resolution in a separate UI layer. Gameplay units are world pixels in the 480×270
space; gameplay timing is in frames at the fixed 60 Hz tick.

### Documents and which one wins

| File | Governs |
|---|---|
| `docs/storyboard/` (`README.md` first) | **FINAL storyboard, approved 2026-10-04.** The content spec: story, cast, every beat, dialogue, scoring, endings, flags. **Outranks the PRD and everything in `docs/_bak/`** on story, content, scoring and endings. Earlier drafts are archived in `docs/_bak/`; don't build from them. |
| `docs/PRD.md` | Combat feel, player stats, controls. Its story, stage and scoring sections are superseded by the storyboard. |
| `docs/_bak/` | Archive only: the original concept (`story.md`) and the storyboard drafts v2–v4. Superseded; never build from it. |
| `docs/develop_workflow.md` | Engine (Godot), content architecture, project layout, build order. |
| `docs/plan.md`, `docs/roadmap/` | That workflow turned into concrete phases and steps for this game, with progress. |
| `docs/project_checklist.md` | One-page rollup of every step and milestone. When a step lands, tick it in its phase page **and** here. |
| `docs/game_bible/` | (Phase 0A, once written) Bible pages and registries derived from the storyboard. |
| `docs/art/` (`README.md` first) | Art briefs for every character, enemy, background, prop, effect and UI piece, written as prompts for AI image tools: style guide, sizes, naming, art rules. |
| `docs/styles/1.jpg`, `2.jpg` | HUD layout reference — match them. (The PRD still cites the old path `docs/1.jpg`.) |
| `docs/images/*.png` | Character design references. **Filename is the character id.** |

**Known conflict:** PRD §1 (platform), §11 (procedural assets in `game/js/assets.js`), §12 (vanilla
JS, no engine), §14 (Fastify/SQLite backend) and §15 (file structure) describe the removed web
implementation and are superseded on *technology* by `develop_workflow.md`. The PRD's gameplay,
scoring, and content sections remain authoritative. Whether the leaderboard backend and HTML5
delivery survive the Godot move is undecided — ask rather than assume.

Character reference images: `felix`, `lucian`, `hilman` (the three playable **looks**: there is one
candidate, the player, who picks a look and fighting style), `rain` → 林小雨 CLORIS, `vincent` →
林建國, her father and the final boss. **`vincent` is not a playable id.** They are head-and-shoulders
portraits only; body and costume are undefined, and every other character has no reference yet (see
`docs/storyboard/ledgers.md` §5).

## Architecture direction (from `develop_workflow.md`)

The governing rule: **content is data, Godot executes logic.** Characters, enemies, bosses, skills,
AI profiles, levels, props and story events are structured data resources; adding one should not
require touching combat/skill/damage systems.

- One `CharacterBase` for players, enemies, bosses and NPCs — differentiated by `CharacterData`
  (stats, animation set, skill set, AI profile), never per-character scripts like `Felix.gd`.
- Skills are `SkillData` composed as **sequences of reusable actions** (PlayAnimation, CreateHitbox,
  ApplyDamage, ApplyKnockback, SpawnVFX, …), not one script per skill.
- Story beats are events: trigger → conditions → actions → completion.
- Every content object needs a stable `id`, a documented schema, explicit dependencies, and
  validation. **Never silently rename an id.** Keep editor tooling out of runtime code.
- Suggested layout: `assets/ data/ scenes/ systems/ tools/ tests/ docs/` (§25).
- Build order (§27): data architecture → CharacterData/SkillData → combat → skill sequences →
  editors → enemy/AI data → level/event system → validator → content production. Don't start bulk
  content before the data architecture is stable.

The PRD adds one sequencing rule that still applies: **build stage 1 end to end before stage 2** —
the hidden scoring, the ten-second window, side-switching and the evaluation screen must be proven
on a small surface first. Tuning constants (stats, 禮 awards, the despawn window, difficulty
multipliers) belong in data, never inline.

Engine-independent mechanics worth carrying over from the PRD (§12): the world is **2.5D** — `x`
horizontal, `y` depth, `z` jump height. Draw order is by `y`. A hit needs overlap on `(x, y)` *and*
on `z`. Gravity acts on `z`, never `y`.

## Spoiler discipline — the most breakable thing in this project

The twist lives or dies on what the interface reveals.

- Nothing on the HUD is disguised. 力 POWER (green bar, doubles as health), 錢 MONEY (counter) and
  the clock *are* three of the four criteria, in plain sight. Do not relabel anything.
- **The character 勇 (BRAVE) must not appear on screen before the evaluation form (beat R-07)**:
  not in the HUD, pause menu, tutorial or tooltip. Awards pop as a bare gold `+2`/`+8` with a seal
  icon and no label. Internal identifiers may use `brave`/`yong`; player-facing strings may not.
- The clock counting to 19:00 is dinner. Never label it or explain it.
- Nothing explains the scoring. The pause menu has no scoring page.
- **The candidate never recognises his disguised parents** (the Lunch Lady, the Straw-Hat Uncle) or
  suspects anything, until the reveal.

## Scoring invariants

Full spec: `docs/storyboard/README.md` §3. Form = 力 (0–25) + 錢 (0–15) + 時 (0–20) + 勇 (0–40,
clamped) out of 100. **Pass mark 70; 72+ beats both fathers.** Track the four separately.

- 勇 set pieces total **36**, short of the cap on purpose: a full column needs help-ups.
- **"A mashing player cannot pass (70)"** is the single most important success criterion. A masher
  should land around 48–56. If a change lets mashing reach 70, it is wrong.
- The **ten-second window**: a defeated opponent sits dazed with slowing stars; pressing **E** beside
  them helps them up and records them on the run's roster. Rostered people refuse 林建國's summon.
  Striking a dazed or downed opponent costs 勇.
- **E** (context action) is the most important button and nothing ever says so. It is a trap exactly
  once: the money suitcase at S4-07 (picking it up ends the run in ending E0).

## Writing content

The comedy only works if these hold (storyboard README §3.8). They are not style preferences:

1. No character is ever rude. Hostility is expressed entirely through hospitality.
2. Nobody acknowledges that the fighting is strange.
3. The wealth is shown big (private mountain, supercars, a suitcase of cash), never said.
4. Every enemy has a reason to like you. They fight you anyway.
5. **The candidate never suspects.** Not once, not for a frame. The player may; he may not.
6. Cartoon violence only — nobody bleeds, nobody is hurt, nobody stays down. Keep it playable by kids.

小雨 is the one character allowed to sound disappointed (late endings) — she is not staff.

## Conventions

- Chinese is **Traditional**. Identifiers and code comments in English; player-facing strings carry
  Chinese and English where the PRD gives both (e.g. `城市 / City`).
- Character ids are lowercase: `felix`, `lucian`, `hilman`. Difficulty ids: `easy`, `normal`, `hard`.
