# Project Progress — Passionate Story V2 《合格女婿》

The single status tracker for the whole project. `docs/plan.md` holds the
immediate handoff (what to do next and how); `design/game-brief.md` holds scope;
`docs/art/asset-manifest.json` holds art request status.

**Last updated:** 2026-10-29 · **CCGS:** 1.1.3, rigor `minimal` · **Engine:** Godot
(version not selected) · `production/stage.txt` stays `Concept` by design (see §1)

**Status values:** Not started · In progress · Blocked · Complete.
A step is Complete only when its "Done when" evidence exists; link the evidence.
Work the steps in order; do not start a stage before the previous one is Complete
unless the step says it runs in parallel.

## Where we are

Stage 1 (story) is waiting on the user's approval of the fifth draft. Codex applied
T-02…T-05 and regenerated the HTML reading copy; verification is recorded in
`production/qa/evidence/2026-10-29/story-revision-t02-t05.md`.

**Next action:** the user reviews and approves the fifth draft (step 1.3) →
Stage 2: engine setup.

## 1. The CCGS route this project follows

At `rigor: minimal` CCGS uses a 5-step route, not the 7-phase ladder. It is defined
in `.claude/docs/workflow-catalog.yaml` (`paths.minimal`) and read by `/help`:

| CCGS step | Command | CCGS check now | Our stage |
|---|---|---|---|
| Engine setup | `/setup-engine godot` | ABSENT | Stage 2 |
| Game brief | `/brainstorm` (resumes and refines an existing brief) | PRESENT | Stage 3 |
| Stories | `/create-stories` | ABSENT | Stage 3 |
| Build the next story | `/dev-story [story-path]` | per story `Status:` | Stage 4, 6 |
| Close the story | `/story-done [story-path]` | per story `Status:` | Stage 4, 6 |

Check position at any time with `/help`, or
`bash .claude/scripts/artifact-check.sh --path minimal` and
`bash .claude/scripts/story-status.sh`. If `/help` and this file disagree, stop and
tell Claude; fix the file or the artifact, do not ignore it.

**Not used at `minimal`** (they still run on request): concept document, art bible,
systems map, per-system design documents, `/create-epics`, `/sprint-plan`,
`/gate-check`, architecture documents and ADRs, `/test-setup`. The brief replaces the
design documents, and its Build order replaces the sprint plan. Because nothing runs
`/gate-check`, the phase never advances past Concept. That is expected.

**Tests are waived at `minimal`** (`qa.level: minimal`): `/dev-story` writes no test
requirement. The look still needs proof: visual and feel stories must keep screenshots
in `production/qa/evidence/`. `/story-done` asks the user to confirm behaviour and
feel criteria, so the user plays each build before a story can close.

## 2. Steps

### Stage 0 — Foundation (done)

| ID | Step | Owner | Done when | Status |
|---|---|---|---|---|
| 0.1 | Reset repository; preserve story source | Codex | `docs/cleanup-v2.md` | Complete |
| 0.2 | Arrange folders to the CCGS layout; add this tracker | Claude | §4 folder map; change log 2026-10-29 | Complete |

### Stage 1 — Story approved (Concept)

| ID | Step | Owner | Done when | Status |
|---|---|---|---|---|
| 1.1 | Story review T-01…T-09 decided | User + Claude + Codex | Decision log in `design/narrative/story-discussion.md` (T-07 parked to Slice B) | Complete |
| 1.2 | Apply T-02…T-05 to the draft; regenerate HTML copy | Codex | Fifth draft + HTML; [document verification](../production/qa/evidence/2026-10-29/story-revision-t02-t05.md) | Complete |
| 1.3 | User reviews and approves the fifth draft | User | User says "approved" and tells Claude to proceed | In progress |
| 1.4 | Close still-open draft content: sisters' names/relationship, individual scenes, combat ideas, third ending | User + Codex | Marked decided in the discussion file | Not started (does not block Slice A) |

### Stage 2 — Engine setup (CCGS step 1)

| ID | Step | Owner | Done when | Status |
|---|---|---|---|---|
| 2.1 | Locate or install the Godot editor | User | Path to the editor given to Claude. No `godot` was found on PATH or in common folders (2026-10-29) | Not started |
| 2.2 | `/setup-engine godot`. It asks target platform, 2D or 3D, input method, language (GDScript or C#); looks up the current Godot version; then writes `project.godot` (with approval), the engine, specialists, naming and commands blocks in `project.yaml`, the Technology Stack in `CLAUDE.md`, `.claude/docs/technical-preferences.md`, and `docs/engine-reference/godot/` | Claude + user | `artifact-check --path minimal` shows engine-setup PRESENT; `project.godot` exists; `VERSION.md` records the real version | Not started |
| 2.3 | Verify the project opens (headless import if the binary is found) and record the exact run command in `AGENTS.md` and `docs/plan.md` | Claude | Command run and its real output reported; no placeholder command listed as passing | Not started |
| 2.4 | Record the technical frame for art (platform, 2D/3D, view, resolution, scale) in `docs/art/README.md` | Claude + user | Fields filled, not "undecided" | Not started |

### Stage 3 — Brief ready, stories created (CCGS steps 2–3)

`/create-stories` makes **one story per feature in the brief's MVP list, in the
brief's Build order**, plus an `EPIC.md`. It reads nothing else, so the brief must be
complete and in list form first.

| ID | Step | Owner | Done when | Status |
|---|---|---|---|---|
| 3.1 | Decide Slice A basics with the user: view, controls, 3–5 player moves, 家豪's 3–4 attack patterns and their warning signs, win and lose conditions. Claude brings 2–3 options; the user chooses | Claude + user | Decisions written into the brief's MVP list (short bullets) | Not started |
| 3.2 | Resolve scope: the brief's MVP says "one encounter", but the Build order has Slice A and Slice B. Decide whether the MVP list contains both | User | Decision recorded in the brief | Not started |
| 3.3 | `/brainstorm`: refine the brief to the template fields. MVP as a list of at most 7 features, each testable; Out of scope and Core loop as short bullets; add the three recommended one-liners (who it is for, art and audio direction, reference game) | Claude | `design/game-brief.md` matches `.claude/docs/templates/game-brief.md` | Not started |
| 3.4 | User approves the brief | User | User says "approved" | Not started |
| 3.5 | `/create-stories` (no argument) | Claude | `production/epics/<slug>/EPIC.md` (slug from the brief title) and `story-NNN-*.md` exist, `Status: Ready`; user has read them; `artifact-check` shows create-stories PRESENT | Not started |

### Stage 4 — Build Slice A (CCGS steps 4–5, repeat per story)

Slice A is the S1-02 林家豪 boss fight with placeholders. Repeat 4.1–4.4 for each
Slice A story, in order.

| ID | Step | Owner | Done when | Status |
|---|---|---|---|---|
| 4.1 | `/dev-story [story-path]` | Claude | Code under `src/`, scenes in the Godot project; story is `In Progress` (only `/story-done` makes it Complete) | Not started |
| 4.2 | The user plays the build in Godot | User | User can answer each acceptance criterion: yes / no / not tested | Not started |
| 4.3 | Keep screenshots of the visible result | Claude | Files in `production/qa/evidence/` | Not started |
| 4.4 | `/story-done [story-path]` | Claude + user | Story `Status: Complete`; completion notes written; next story named | Not started |
| 4.5 | Slice A complete: start to outcome playable, including the stamp and dialogue beat | Claude + user | All Slice A stories Complete; run command works; screenshot retained | Not started |

### Stage 5 — Art track (Codex, project rule; not a CCGS step)

Per `CLAUDE.md`: build one encounter with placeholders before requesting production art.
Start after step 4.5. Status of each asset lives only in `docs/art/asset-manifest.json`.

| ID | Step | Owner | Done when | Status |
|---|---|---|---|---|
| 5.1 | Propose a visual target using the reference images in `art/source/reference/` | Codex | Proposal shared | Not started |
| 5.2 | User approves one visual target; technical frame locked | User + Codex + Claude | Approval recorded in the manifest | Not started |
| 5.3 | Asset requests for Slice A (IDs, size, pivot, states) | Claude | Entries in the manifest | Not started |
| 5.4 | Produce a small batch | Codex | Technical checks recorded in the manifest | Not started |
| 5.5 | Integrate in Godot; user accepts | Claude + user | In-engine screenshots; manifest status `accepted` | Not started |

### Stage 6 — Build Slice B (final-fight timeline)

| ID | Step | Owner | Done when | Status |
|---|---|---|---|---|
| 6.1 | `/create-stories` again (a return visit adds stories for new brief items and never rewrites existing ones) | Claude | New story files numbered after the existing ones | Not started |
| 6.2 | Confirm the attack-limit rule (T-07); if feel is uncertain, run `/prototype --spike` (optional, about 4 hours, throwaway, in `prototypes/`) | User + Claude | Rule recorded in the discussion file and brief | Not started |
| 6.3 | Repeat 4.1–4.4 for each Slice B story | Claude + user | Fixed 10-second arrivals, 60-second return, survivors carry damage, verified in Godot | Not started |

### Stage 7 — Review and decide expansion

| ID | Step | Owner | Done when | Status |
|---|---|---|---|---|
| 7.1 | `/playtest-report` for both slices | User + Claude | Report in `production/qa/playtests/` | Not started |
| 7.2 | `/scope-check` | Claude | Report of scope against the brief | Not started |
| 7.3 | Decide: add the next stages at `minimal` (more `/create-stories` visits), or raise rigor with `/settings`. Raising rigor makes CCGS require a concept document, art bible, systems map and per-system designs, and the 7-phase ladder applies | User | Decision recorded here | Not started |

## 3. Open items

Every open question is a numbered session in [`discuss/open-questions.md`](../discuss/open-questions.md); discuss one session per chat, record the decision there, then update this file.

| ID | Item | Session | Blocks | Waiting on |
|---|---|---|---|---|
| Draft | Fifth draft approval (1.3) | Q-01 | Stage 2 | User |
| Draft | Sisters' names, individual scenes, combat ideas, third ending (1.4) | Q-02, Q-03 | Not Slice A | User + Codex |
| Godot | Editor not found on this computer (2.1); version, language | Q-04 | Stage 2 | User |
| Form | 2D or 3D, view, platform, input, resolution (2.2, 2.4) | Q-05 | Stage 2 | User + Claude |
| Scope | MVP says one encounter; Build order has two slices (3.2) | Q-06 | Stage 3 | User |
| Slice A | Controls and moves; 家豪's patterns (3.1) | Q-07, Q-08 | Stage 3 | User + Claude |
| T-06 | After losing a life: respawn in place or restart the encounter? Continues or extra lives? Health recovery: full at stage start, or pickups? | Q-09 | Stage 3 (the stories need a lose rule) | User |
| T-07 | Attack-token rule (N = 2–3, 沈雅芳 included; approached enemies react without damage and queue next) | Q-10 | Slice B (6.2) | User + Claude |
| Text | Languages, Chinese font, string table, audio basics | Q-12 | Slice A (font) | User + Claude |
| Art | Style, reference-to-character mapping, real-person likeness, animation method | Q-11 | Stage 5 | User + Codex |
| Process | Commits, HTML regeneration, document language | Q-13 | — | User |

## 4. Folder map (CCGS layout)

| Path | Contents | Status |
|---|---|---|
| `design/game-brief.md` | One-page brief: the plan at `minimal` rigor | Active |
| `design/narrative/` | Story draft, reading copy, discussion, Claude's review | Active (in review) |
| `docs/progress.md`, `docs/plan.md` | Status tracker; immediate handoff | Active |
| `docs/art/` | Art guide and shared asset manifest (Codex) | Active |
| `docs/engine-reference/godot/` | Engine version record | Awaiting setup |
| `docs/architecture/` | Architecture records, created only when needed | Empty |
| `docs/archive/` | Previous project's storyboard and checksums: historical, not canon | Read-only |
| `src/` | Godot code root (CCGS default; `/setup-engine` may revise it) | Empty |
| `assets/` | Runtime assets; agreed art exports go to `assets/art/` | Empty |
| `tests/unit/`, `tests/integration/` | Godot test suites (waived at `minimal`) | Empty |
| `tools/` | Build and pipeline tools | Empty |
| `prototypes/` | Throwaway prototypes, outside the code root | Empty |
| `production/epics/` | CCGS development stories (task cards, not plot) | Empty |
| `production/qa/evidence/`, `production/qa/playtests/` | Screenshots, verification and playtest reports | Evidence started |
| `discuss/` | Open-question sessions (`open-questions.md`); not a CCGS folder, a user collaboration space | Active |
| `art/source/reference/` | User's reference images for character design (inputs, not game art); log in its README | Active (images kept local) |

Not created on purpose: `design/gdd/` (not used at `minimal`), sprint and
milestone folders (not on the minimal path), and the rest of `art/source/` (Codex adds it when art production starts). Empty untracked folders `docs/concept_images/style_1` and
`docs/concept_images/style_2` were left in place for Codex to confirm (move to
`art/source/concepts/` or delete). The empty, never-tracked `images/` folder
was deleted on 2026-10-29 at the user's request.

## 5. Change log

| Date | Change | By |
|---|---|---|
| 2026-10-27 | V2 cleanup; story source recovered | Codex |
| 2026-10-29 | 《合格女婿》 selected; six stages, three endings drafted | User + Codex |
| 2026-10-29 | Story discussion T-01…T-09; decisions recorded in `design/narrative/story-discussion.md` | User + Claude + Codex |
| 2026-10-29 | Folders arranged to CCGS layout: story files moved from `idea/` and `discuss/` to `design/narrative/`; historical storyboard and checksums to `docs/archive/` (all nine SHA-256 verified, unchanged); CCGS folders created; this tracker added | Claude |
| 2026-10-29 | T-01, T-03, T-04, T-06 decided via chat; T-07 parked to Slice B; brief gained tone, fail state and build order | User + Claude |
| 2026-10-29 | T-02…T-05 applied to the fifth story draft; HTML regenerated; 15 sections, 43 scene headings and document links verified. Draft awaits user approval | Codex |
| 2026-10-29 | Steps checked against the CCGS 1.1.3 skills (`setup-engine`, `create-stories`, `dev-story`, `story-done`, `help`, `quick-design`, `prototype`) and the minimal route in the workflow catalog; tracker restructured into stages 0–7 with commands and "done when" evidence. Corrections: the 7-phase table was replaced by the 5-step minimal route; `/quick-design` removed from the route (not a minimal step, may redirect core mechanics to `/design-system`); added brief-refinement, MVP-scope and Godot-install steps | Claude |
| 2026-10-29 | All open questions listed as sessions Q-01…Q-13 in `discuss/open-questions.md` (the folder was recreated); open items linked to sessions | Claude |
| 2026-10-31 | Vincent chose 熱血物語 (Kunio-kun SP) grid pixel art as the wanted style (Q-11 Q1); Codex instruction for 31 front/side, eight-pose character sheets (21 from photos, 10 original story roles for review) written to `discuss/codex-sp-character-sheets.md`; visual target awaits pilot approval | User + Claude |
