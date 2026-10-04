# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

熱血物語：見家長 (*Meeting the Parents*) — a side-scrolling beat-'em-up in the style of River City
Girls, built around a twist.

**What the player experiences:** his girlfriend 林小雨 CLORIS is dragged into a black van. He chases
it across a city, up a mountain, and into a fortified estate to get her back.

**What is actually happening:** every opponent is on the Lin family payroll. The estate is a house
with dinner going cold on the table. The family stages this for every suitor, because they need to
know who a man is when he believes the stakes are real. He is not rescuing her. He is meeting her
parents.

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
| `docs/story.md` | Narrative bible. **Outranks the PRD on anything story-related.** Read before writing any content. |
| `docs/PRD.md` | Mechanics, rosters, numbers. Read the relevant section before inventing values. |
| `docs/develop_workflow.md` | Engine (Godot), content architecture, project layout, build order. |
| `docs/plan.md`, `docs/roadmap/` | That workflow turned into concrete phases and steps for this game, with progress. |
| `docs/storyboard/`, `docs/game_bible/` | (Phase 0A, once written) Beat-by-beat storyboard, bible pages and registries derived from story.md. They are the content spec; where they disagree with story.md, story.md wins and they get corrected. |
| `docs/styles/1.jpg`, `2.jpg` | HUD layout reference — match them. (The PRD still cites the old path `docs/1.jpg`.) |
| `docs/images/*.png` | Character design references. **Filename is the character id.** |

**Known conflict:** PRD §1 (platform), §11 (procedural assets in `game/js/assets.js`), §12 (vanilla
JS, no engine), §14 (Fastify/SQLite backend) and §15 (file structure) describe the removed web
implementation and are superseded on *technology* by `develop_workflow.md`. The PRD's gameplay,
scoring, and content sections remain authoritative. Whether the leaderboard backend and HTML5
delivery survive the Godot move is undecided — ask rather than assume.

Character reference images: `felix`, `lucian`, `hilman` (the three playable candidates), `rain` →
林小雨 CLORIS, `vincent` → 林建國, her father and the final boss. **`vincent` is not a playable
candidate id.** They are head-and-shoulders portraits only (face, hair, glasses, palette); body
proportions and costume are undefined, and there is no reference yet for 二叔 BAN or the fruit shop
owner.

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

- Nothing on the HUD is disguised. 力 POWER (green bar, doubles as health) and 錢 MONEY (counter)
  *are* two of the three criteria, in plain sight. Do not "improve" this by relabelling anything.
- **The character 禮 must not appear on screen before the evaluation form** — not in the HUD, pause
  menu, tutorial, or tooltip. Restraint awards pop as a bare gold `+3` with a seal icon and no label.
  Internal identifiers may use `li`/`REI`; player-facing strings may not.
- The clock counting to 18:00 is dinner. Never label it. **It is not scored** — it only picks which
  ending he walks into.
- Nothing explains the scoring. The pause menu has no scoring page.

## Scoring invariants

Grade = 力 (0–40) + 錢 (0–20) + 禮 (0–40, clamped) out of 100. Track the three separately.

- 禮 set-pieces total **37**, short of the cap on purpose: a full column needs at least one help-up.
- **"A mashing player cannot beat 71"** (林建國's 1994 score) is the single most important success
  criterion. A masher should land around 56–60. If a change lets mashing reach 71, it is wrong.
- The **ten-second window**: a defeated opponent sits dazed with slowing stars; pressing **E** beside
  them helps them up, records them on the run's roster, and they switch sides. 林建國's summon checks
  that roster. Striking a dazed/downed opponent is the heaviest penalty.
- **E** (context action) is the most important button and nothing ever says so.

## Writing content

The comedy only works if these hold (story.md, *Content rules*). They are not style preferences:

1. No character is ever rude. Hostility is expressed entirely through hospitality.
2. Nobody acknowledges that the fighting is strange.
3. The wealth is shown, never stated.
4. Every enemy has a reason to like you. They fight you anyway.
5. **The candidate never suspects.** Not once, not for a frame. The player may; he may not.
6. Cartoon violence only — nobody bleeds, nobody is hurt, nobody stays down. Keep it playable by kids.

小雨 is the one character allowed to sound disappointed (late endings) — she is not staff.

## Conventions

- Chinese is **Traditional**. Identifiers and code comments in English; player-facing strings carry
  Chinese and English where the PRD gives both (e.g. `城市 / City`).
- Character ids are lowercase: `felix`, `lucian`, `hilman`. Difficulty ids: `easy`, `normal`, `hard`.
