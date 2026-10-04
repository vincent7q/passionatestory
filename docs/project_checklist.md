# Project checklist — 熱血物語:見家長

One page that shows **how far the whole project has got**. It rolls up every step in
[`plan.md`](plan.md) and the phase pages in [`roadmap/`](roadmap/), and organises Phase 10 by the
final storyboard's five stages.

- **Detail lives in the phase pages.** This file only says *done or not*. When a step lands, tick
  it in its phase page **and** here, and update the dashboard counts.
- **Content comes from [`storyboard/`](storyboard/README.md)** (final, 2026-10-04). Where a phase
  page still describes the old three-stage story or the old 禮 scoring, the storyboard wins; see
  [Housekeeping](#housekeeping).

Last updated: **2026-10-04**

Legend: ✅ done · 🔄 in progress · ⬜ not started · ⏸ waiting on a decision

---

## Dashboard

| Phase | | Steps done | Status | Milestone |
|---|---|---|---|---|
| 0A | Storyboard, game bible & registries | 6 / 10 | 🔄 | M0a The game on paper |
| 0B | Project setup | 0 / 7 | ⬜ needs Godot installed | M0b Hello Godot |
| 1 | Core data architecture | 0 / 6 | ⬜ | |
| 2 | CharacterData & SkillData | 0 / 8 | ⬜ | |
| 3 | Combat system | 0 / 13 | ⬜ | M1 Felix punches someone |
| 4 | Skill sequence system | 0 / 8 | ⬜ | M2 Skills are data |
| 5 | Character editor | 0 / 6 | ⬜ | |
| 6 | Skill editor | 0 / 7 | ⬜ | M3 Tools |
| 7 | Enemy & AI data | 0 / 8 | ⬜ | |
| 8 | Level & event system | 0 / 12 | ⬜ | **M4 Vertical slice** |
| 9 | Content validation | 0 / 9 | ⬜ | M5 Safe content |
| 10 | Content production | 0 / 10 blocks | ⬜ | M6 Stage 1 · M7 The whole game |
| **Total** | | **6 / 104** | | |

**Where we are:** Phase 0A, step **A6** (game bible pages) is next. Phase 0B can start in parallel
as soon as Godot is installed. Phase 1 needs both 0A and 0B.

**Code:** none yet. There is no Godot project, no tests and no data in the working tree.

---

## Milestones

- [x] Final storyboard approved (2026-10-04)
- [ ] **M0a** The game on paper — storyboard, bible pages, every id fixed (end of 0A)
- [ ] **M0b** Hello Godot — 1920×1080 project runs, a headless test passes, web build loads (end of 0B)
- [ ] **M1** Felix punches someone — fights an office worker; dazed → help up; 力/錢/時/勇 tracked (end of 3)
- [ ] **M2** Skills are data — Felix's three specials built only from `.tres` (end of 4)
- [ ] **M3** Tools — characters and skills made and tested in the editor (end of 6)
- [ ] **M4** Vertical slice — prologue → short Stage 1 → the Fruit Aunt → evaluation form (end of 8)
- [ ] **M5** Safe content — a validator that blocks broken or spoiler-leaking content (end of 9)
- [ ] **M6** Stage 1 complete, playtested (Phase 10.1)
- [ ] **M7** The whole game — five stages, the dining room, the reveal, all endings, the 1994 bonus (end of 10)

---

## Phase 0A — Storyboard, game bible & registries · [detail](roadmap/phase-00a-storyboard.md)

- [x] **A0** Story revised; option B 「一九九四復仇戰」 approved with the suitcase change
- [x] **A1** Beat index and clock time of each beat
- [x] **A2** Storyboard: title, prologue, Stage 1 (the vertical slice)
- [x] **A3** Storyboard: Stages 2–5 and the dining room
- [x] **A4** Storyboard: reveal, form, endings E0–E3, game over, post-credits, 1994 bonus
- [x] **A5** Clue ledger and setup/payoff ledger; open payoffs resolved
- [ ] **A6** Game bible: character, enemy and location pages; art gaps listed (`docs/game_bible/`)
- [ ] **A7** All 17 registries + asset list; id convention agreed and written into `CLAUDE.md`
- [ ] **A8** Reconcile documents: PRD §1, §11, §12, §14, §15 marked superseded; HUD path → `docs/styles/`
- [ ] **A9** Review together; storyboard, bible and registries become the content spec

Related design work already done:

- [x] Art briefs for every character, enemy, background, prop, effect and UI piece (`docs/art/`)
- [x] Per-tool prompt guides (Gemini, Midjourney, Flux, ComfyUI)
- [x] Earlier drafts archived in `docs/_bak/`

## Phase 0B — Project setup · [detail](roadmap/phase-00b-setup.md)

- [ ] **B1** Install Godot 4 (standard build) + export templates; `godot --version` works; version recorded
- [ ] **B2** `project.godot`, top-level folders, `.gitignore`, `.gitattributes`
- [ ] **B3** Display: 1920×1080 window, 480×270 world at whole-number scale, crisp Chinese UI text
- [ ] **B4** Input map named by intent (move, jump, light, heavy, special, guard, interact, call ally, pause)
- [ ] **B5** GUT installed; one headless smoke test; test commands recorded in `CLAUDE.md`
- [ ] **B6** Web export smoke test; load time and size baseline recorded
- [ ] **B7** Close the phase: `CLAUDE.md` updated; commit

## Phase 1 — Core data architecture · [detail](roadmap/phase-01-core-data.md)

- [ ] **1.1** `ContentData` base + schema page
- [ ] **1.2** `ContentLoader` with error checks and test fixtures
- [ ] **1.3** `ContentDB` autoload; missing ids fail loudly
- [ ] **1.4** `EventBus` autoload
- [ ] **1.5** `strings.csv` + test that 勇 appears in no non-`eval.` string (first C2 guard)
- [ ] **1.6** `docs/schemas/README.md`, one page per data type

## Phase 2 — CharacterData & SkillData · [detail](roadmap/phase-02-character-skill-data.md)

- [ ] **2.1** `StatsData`, `StatScale`
- [ ] **2.2** `AnimationSet`; placeholder sprites for Felix and the office worker
- [ ] **2.3** `HitboxData`, `MovesetData`, `CharacterData`
- [ ] **2.4** `SkillData` (flat)
- [ ] **2.5** `CharacterBase`: 2.5D movement (x, depth y, height z), gravity, facing, jump
- [ ] **2.6** Player controller: input → intents
- [ ] **2.7** `character_felix.tres`, `enemy_office_worker.tres`, test scene
- [ ] **2.8** Debug overlay: body box, depth band, height

## Phase 3 — Combat system · [detail](roadmap/phase-03-combat.md)

- [ ] **3.1** `CombatTuning`; hitbox world-space conversion
- [ ] **3.2** `HitResolver` (x, y and z overlap; once per swing)
- [ ] **3.3** `DamageCalculator`, `HitResult`
- [ ] **3.4** State machine: idle, walk, jump, attack, hurt, hitstop
- [ ] **3.5** Knockdown, airborne, juggling, get-up invincibility
- [ ] **3.6** Guard, parry, stagger
- [ ] **3.7** Light chain with input buffer; heavy finisher
- [ ] **3.8** Grab, grab-strike, throw
- [ ] **3.9** Defeat → dazed with slowing stars → despawn (the ten-second window)
- [ ] **3.10** `Interactable`, `InteractionSystem`, help up (E)
- [ ] **3.11** `ScoringRules`, `RunState`, `ScoreCalculator`, gold popup, coins
- [ ] **3.12** Debug-only score overlay (never ships visible)
- [ ] **3.13** Test arena: Felix vs two office workers

## Phase 4 — Skill sequence system · [detail](roadmap/phase-04-skill-sequences.md)

- [ ] **4.1** `SkillAction`, `SkillContext`, `SkillRunner`
- [ ] **4.2** Actions: PlayAnimation, CreateHitbox, RemoveHitbox, Move, Jump
- [ ] **4.3** Phase 3 attacks rebuilt as timelines; flat fields removed
- [ ] **4.4** `StatusEffectData`, `ApplyStatusEffect`
- [ ] **4.5** `Pool`; SpawnVFX, PlaySFX, CameraShake
- [ ] **4.6** `ProjectileData`, SpawnProjectile
- [ ] **4.7** Felix's specials: 連環拳, 旋風腿, 熱血; how C picks a special decided
- [ ] **4.8** Not enough 氣 → special doesn't start, with a cue

## Phase 5 — Character editor · [detail](roadmap/phase-05-character-editor.md)

- [ ] **5.1** Plugin skeleton, character list
- [ ] **5.2** Preview panel
- [ ] **5.3** Embedded inspector, save on change
- [ ] **5.4** Id pickers (moveset, animation set, AI profile)
- [ ] **5.5** New / Duplicate with id rules
- [ ] **5.6** Validation strip

## Phase 6 — Skill editor · [detail](roadmap/phase-06-skill-editor.md)

- [ ] **6.1** Plugin skeleton; read-only timeline
- [ ] **6.2** Front and floor hitbox views
- [ ] **6.3** Preview sandbox: play / pause / step
- [ ] **6.4** Editing: actions, active windows, hitboxes, fields
- [ ] **6.5** Add / remove actions from a palette
- [ ] **6.6** Result readout, dummy states
- [ ] **6.7** Save round-trip; inline validation

## Phase 7 — Enemy & AI data · [detail](roadmap/phase-07-enemy-ai.md)

- [ ] **7.1** `AIProfile`, `AIBrain`, intents
- [ ] **7.2** Depth approach, preferred range, retreat, stun
- [ ] **7.3** Attack tokens
- [ ] **7.4** `BarkData` and speech bubbles
- [ ] **7.5** Office worker, scalper, delivery rider — as data
- [ ] **7.6** Allies: roster, equip, Q call, side-switching, taught skills
- [ ] **7.7** `BossPhaseData`; the Fruit Aunt's moves
- [ ] **7.8** The showpiece melon: carried prop with HP; both fight outcomes

## Phase 8 — Level & event system → vertical slice · [detail](roadmap/phase-08-level-event.md)

- [ ] **8.1** `LevelData`, sections, `LevelRunner`, parallax
- [ ] **8.2** Camera with section locks; spawn waves
- [ ] **8.3** `PropData`; market stalls; stall-intact tracking
- [ ] **8.4** Rain hazard and cover
- [ ] **8.5** `ItemData` pickups; `WeaponData`
- [ ] **8.6** `EventData` and `EventRunner` (trigger → conditions → actions → completion)
- [ ] **8.7** `DialogueData` and dialogue box
- [ ] **8.8** HUD (力, 錢, clock — no 勇); pause menu with no scoring page
- [ ] **8.9** `GameFlow`: title, look select, prologue, stage, clear, game over, checkpoint
- [ ] **8.10** Evaluation form and its pacing
- [ ] **8.11** `level_stage1_city` slice section with the Fruit Aunt
- [ ] **8.12** Slice playthroughs; 60 FPS profile

## Phase 9 — Content validation · [detail](roadmap/phase-09-validation.md)

- [ ] **9.1** Entry point, `ValidationRule`, output, exit code
- [ ] **9.2** Phase 1 loader checks moved into rules
- [ ] **9.3** Reference, asset, animation rules
- [ ] **9.4** Parameter and required-field rules
- [ ] **9.5** Circular dependency and level reference rules
- [ ] **9.6** Game rules: C1 (masher can't pass), C2 (no 勇 on screen early), C3 (set pieces < 40)
- [ ] **9.7** One broken fixture per rule
- [ ] **9.8** Rules hooked into the editors
- [ ] **9.9** Command in `CLAUDE.md`; pre-commit hook decided

## Phase 10 — Content production · [detail](roadmap/phase-10-content.md)

Organised by the final storyboard. Each block: system work first, then data and art, then the
block's beats checked against the clue and setup/payoff ledgers.

- [ ] **10.1 Stage 1 City** (S1-01 – S1-07) — **M6**
  - [ ] Enemies: `office_worker`, `scalper`, `delivery_rider`
  - [ ] 三叔 KEN points the way; stalls and bills; `status_soaked`
  - [ ] Boss: 二姑 the Fruit Aunt + `prop_showpiece_melon`
  - [ ] Real Stage 1 art
  - [ ] Playtest round 1: window length, help-up cost, 勇 balance, masher band 48–56
- [ ] **10.2 The other two looks**
  - [ ] LUCIAN: Dash Strike, Aerial Barrage, Shadow Clone (`SpawnClone` action)
  - [ ] HILMAN: Power Slam, Earthquake Punch, Berserker
  - [ ] Look select shows last grade per look (save data)
- [ ] **10.3 Stage 2 Campus** (S2-01 – S2-07)
  - [ ] Enemies: `basketball_player`, `cheerleader`, `club_recruiter`, `library_auntie`
  - [ ] Boss: the Lunch Lady (his mother); `item_lunchbox`; `status_too_warm`
- [ ] **10.4 Stage 3 Mountain** (S3-01 – S3-07)
  - [ ] Enemies: `groundskeeper`, `guard_dog`, `estate_security`; 小樂 hazard
  - [ ] Bosses: 二叔 BAN (invulnerable, three cups, `status_heavy`) + the Straw-Hat Uncle (his father)
  - [ ] The bow (E) with a timing window
- [ ] **10.5 Stage 4 Garage** (S4-01 – S4-08)
  - [ ] Enemies: `valet`, `mechanic`, `chauffeur`, the `men_in_black` trio
  - [ ] Boss: the Driver (林媽媽)
  - [ ] **The suitcase choice (S4-07)** → E0; checkpoint before it
- [ ] **10.6 Stage 5 Estate** (S5-01 – S5-05)
  - [ ] Enemies: `catering_staff`, `aunt`, `cousin`, `kitchen_staff`
  - [ ] Mid-boss: Howard; the toddler (can't be attacked; shield moment)
  - [ ] Props: seating chart, soup trolley, vase, 1994 photo
- [ ] **10.7 Dining room — 林建國** (D-01 – D-06)
  - [ ] Ring arena around the table; lazy Susan hazard
  - [ ] Phase 1 「面談」; summons refused by everyone on the roster
  - [ ] Phase 2 「站起來」 (single drum); parry-only attacks; D-06 「手放低!」
- [ ] **10.8 Reveal, form, endings, extras**
  - [ ] Reveal R-01 – R-09, including the form R-07 (first time 勇 is shown)
  - [ ] Endings: E0 「一百萬」 · E1a · E1b 「下週日再來」 · E2 「重考」 · E3 「菜涼了」
  - [ ] Game over G-01 wake up · G-02 carried to dinner
  - [ ] Post-credits PC-01 「第2次」 (harder mode)
  - [ ] Bonus stage 「一九九四」 X-01 – X-06, unlocked by E1a
- [ ] **10.9 Polish**
  - [ ] Difficulty easy / normal / hard — as data
  - [ ] All items and weapons
  - [ ] Real art for everything, through `AnimationSet` only
  - [ ] Music and SFX (cue list in `storyboard/ledgers.md` §4)
  - [ ] Playtest round 2: full runs against PRD §16
- [ ] **10.10 Platform and backend**
  - [ ] Touch controls
  - [ ] Web build size, load time, phone performance
  - [ ] Leaderboard — only if D6 brings it back

---

## Hard criteria — must hold at every phase

| # | Criterion | Guarded by | Status |
|---|---|---|---|
| C1 | A mashing player cannot pass (70); lands around 48–56 | Test from Phase 3; validator Phase 9 | ⬜ no code yet |
| C2 | 勇 never on screen before the form (R-07) | String test Phase 1; validator Phase 9 | ⬜ no code yet |
| C3 | 勇 set pieces total 36 < 40, so a full column needs help-ups | Test Phase 3; validator Phase 9 | ✅ on paper (storyboard) |
| C4 | Clock unlabelled and unscored; pause menu explains nothing | Phase 8 review | ⬜ no code yet |
| C5 | New character / skill / enemy / level needs no core-code change | Each phase's done-when | ⬜ no code yet |
| C6 | Stable 60 FPS | Profiling in Phases 8 and 10 | ⬜ no code yet |

## Open decisions

| # | Question | Needed by | Status |
|---|---|---|---|
| D6 | Leaderboard / backend | Phase 10 | ⏸ proposed: out of scope until Stage 1 is done |
| D7 | Placeholder art until Phase 10, all through `AnimationSet` | Phase 2 | ⏸ proposed |
| — | Does HTML5 delivery survive the Godot move? | Phase 0B (B6) | ⏸ ask |
| Q3 | Can a knocked-down opponent be hit? (proposal: yes, costs 勇) | Phase 3 | ⏸ proposed |
| Q4 | How 氣 refills apart from tea | Phase 3 | ⏸ proposed |
| Q5 | Coins: walk over, or E? (proposal: walk over) | Phase 3 | ⏸ proposed |
| Q6 | Source of music and SFX | Phase 10 | ⏸ open |
| Q7 | Traditional Chinese fonts (pixel HUD + handwriting for the form); licences | Phase 8 | ⏸ open |
| — | How C chooses between three specials | Phase 4 (4.7) | ⏸ open |

## Housekeeping

Things to tidy so the documents agree with the final storyboard:

- [ ] Commit the final storyboard and the `_bak/` archive (currently uncommitted)
- [ ] Phase pages 1, 3, 7, 8, 9, 10: replace old 禮 numbers (37, 71, 18:00), three stages and three
      candidates with the storyboard's values — do it at the start of each phase
- [ ] Phase 10 page: restructure into the five stages above
- [ ] Ids: the phase pages use `boss_fruit_shop_owner`; the storyboard uses `boss_fruit_aunt`. Fix in A7
- [x] `CLAUDE.md`: this checklist added to the documents table
