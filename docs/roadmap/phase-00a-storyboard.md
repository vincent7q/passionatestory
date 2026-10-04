# Phase 0A — Storyboard & game bible

[← plan](../plan.md) · runs before / alongside [Phase 0B](phase-00b-setup.md) · next: [Phase 1](phase-01-core-data.md)

## Goal

Turn `docs/story.md` (now archived in `docs/_bak/`) and `docs/PRD.md` into the top of the workflow's pipeline:

```text
STORYBOARD ─► GAME DESIGN BIBLE ─► REGISTRIES ─► (Phase 1+) data in Godot
```

A beat-by-beat storyboard of the whole game, a game bible page for every character, enemy and
location, and registries with a stable id for every piece of content. **No Godot needed** — this
can start today.

## Why this phase exists

- `develop_workflow.md` §2 and §21 put the storyboard first, and §31 says the registries are
  generated **from the storyboard** and become "the authoritative content specification".
- `story.md` is narrative prose: it says what the story *is*. A storyboard says what the player
  **sees, does and hears, beat by beat**, in order, and what each beat becomes in the game (an
  event, a level section, a boss fight). Phases 7, 8 and 10 build directly from it.
- This game's twist depends on **setups and payoffs** (the melon returns as dessert, the delivery
  rider waves from the file, everyone helped up refuses 林建國's summon) and on **clues that
  escalate** from deniable to blatant. Those only stay consistent if they are planned in one place.

## Authority

`story.md` stays the narrative authority. The storyboard is *derived* from it and cites it; if the
two disagree, story.md wins and the storyboard is corrected. The PRD still governs numbers and
mechanics.

## Deliverables

```text
docs/storyboard/                       ✅ FINAL (2026-10-04)
  README.md                  premise, cast, scoring & systems, beat format, beat index,
                             ending logic, story flags, decisions
  00-title-prologue.md       title, look select, prologue 16:30–17:10
  01-stage1-city.md          城市「追」 17:10 — the Fruit Aunt
  02-stage2-campus.md        校園 17:35 — the Lunch Lady (his mother)
  03-stage3-mountain.md      山路 18:00 — 二叔 + the Straw-Hat Uncle (his father)
  04-stage4-garage.md        司機 18:25 — the Driver (林媽媽); the suitcase choice
  05-stage5-estate.md        城堡 18:40 — Howard; the dining room, 林建國
  06-reveal-endings.md       reveal, the form, endings E0–E3, game over, post-credits,
                             the 1994 bonus stage
  ledgers.md                 clue ledger, setup/payoff ledger, draft ids, music, art gaps
docs/game_bible/
  README.md                  overview; links to storyboard sections rather than copying them
  characters/*.md            §18 template
  enemies/*.md               §19 template
  locations/*.md             §20 template
  registries.md              the 17 registries of §31
  asset_list.md              sprites, animations, VFX, SFX, music — all marked placeholder (D7)
```

> **Superseded below this line:** the beat-format example, draft beat index, ledgers and slice ids
> in *Design* were written for the original three-stage story. The final versions are in
> `docs/storyboard/` (README §4 beat format, §5 beat index; `ledgers.md`). The registries step (A7)
> starts from `ledgers.md` §3.

## Design

### Beat format

Every beat has an id, which becomes its **event id** in Phase 8 (`S1-04` → `event_s1_04_fso_intro`
or similar, fixed in step A6).

```markdown
### S1-04 — The fruit stall
Clock      ~17:38 · City / Fruit Stall (85–100%) · music: boss
On screen  A fruit stall under an awning. 水果店老闆娘 steps out holding a melon.
Who        candidate · 水果店老闆娘 · the melon (40 HP)
Gameplay   Boss fight. Any hit on the melon costs 力 and the +8. Destroying it ends the fight.
Dialogue   fso.intro.1 「……」 / "…"
Camera     locks to the arena
禮         spare the melon +8 · stalls intact +6 (checked here)
Clues      none from her — she was not told
Rules ✓    no 禮 on screen · candidate doesn't suspect · nobody rude · cartoon violence
Becomes    event_fso_intro · level_city section 4 · boss_fruit_shop_owner
Source     story.md "Stage 1"; PRD §6.1
```

### Beat index (draft from story.md — to be confirmed in A1)

| Part | Beats |
|---|---|
| Title | T-01 title, quiet street at dusk |
| Prologue | P-01 after class with 小雨 · P-02 the van, three men · P-03 knocked flat · P-04 the van is gone |
| Select | C-01 three candidates (on replay: last grade on each portrait) |
| Stage 1 | S1-01 Market Row · S1-02 Covered Arcade, rain · S1-03 Loading Bay ambush · S1-04 fruit stall boss · S1-05 she points up the road / sits in the wreckage |
| Stage 2 | S2-01 Lower Gate · S2-02 Pond Path · S2-03 Stone Steps · S2-04 二叔 and the tea table · S2-05 three cups · S2-06 the bow, he steps aside |
| Stage 3 | S3-01 Courtyard (catering vans) · S3-02 Ancestral Hall · S3-03 Kitchen · S3-04 three waves · S3-05 the door |
| Dining room | D-01 the door comes down, music stops · D-02 「我等你很久了。」 · D-03 phase 1 「面談」 · D-04 he stands up · D-05 phase 2 「站起來」 |
| Reveal | R-01 he wins; nothing happens · R-02 「你來得好慢。」 · R-03 everyone files in and bows; the aunt sits down · R-04 the form · R-05 the three lines · R-06 林建國 (1994) 71 · R-07 the file pages |
| Stinger | X-01 real kidnappers · X-02 「那個是真的。」 |
| Endings | E-01 on time · E-02 late · E-03 very late · E-04 cut fruit, 「你被批准了。下週日再來。」 · E-05 post-credits 「第2次」 |
| Game over | G-01 wakes somewhere safe, carried there; attempts left |

### The two ledgers

**Clue ledger** — every clue, where it appears, and how deniable it is. Story.md's escalation must
hold: *Stage 1 deniable → Stage 2 absurd → Stage 3 blatant*, and the candidate notices none of it.
This is what makes the reveal "a surprise, not a cheat" (PRD §16).

| Clue | Beat | Level |
|---|---|---|
| 「不好意思」 while swinging | S1-01 | deniable |
| One glances at something in his hand before engaging | S1-02 | deniable |
| 林 on every uniform | S2-01… | absurd |
| … | | |

**Setup / payoff ledger** — every promise the game makes and where it is paid off.

| Setup | Payoff |
|---|---|
| The melon in S1-04 | Its owner bows and sits down in R-03, still angry about it; it is the fruit in E-04 if it survived |
| Delivery rider in S1 | Waves from the file in R-07; delivers his food every week |
| Everyone helped up (roster) | Refuses 林建國's summon in D-03 |
| 二叔's tea | Files in carrying the tea set in R-03 |
| Hilman's notebook, "this feels staged" | The note is in his file (R-07, Hilman only) |
| Lucian films the chase | (to be decided — story.md says he will regret it) |
| Felix's unsent letter | (to be decided) |
| 林建國 scored 71 in 1994 | R-06, and his late-ending lines in E-02/E-03 |

Open payoffs are flagged so they are either written or cut — never left dangling.

### Game bible pages

Use the workflow's templates (§18–20), filled from story.md and the PRD. **Link to the source
section instead of copying** long passages, so there is one place to change each fact.

| Kind | Pages |
|---|---|
| Characters | felix · lucian · hilman · cloris 林小雨 · lin_jianguo 林建國 · ban 二叔 · fruit_shop_owner 水果店老闆娘 |
| Enemies | office_worker · scalper · delivery_rider · groundskeeper · guard_dog · young_cousin · estate_security · aunt · kitchen_staff · stanford_cousin · toddler · van_men (prologue) · real_kidnappers (stinger) |
| Locations | city · mountain_road · estate · dining_room |

Each character page also records the **art gap**: `docs/images/` has head-and-shoulders portraits
for felix, lucian, hilman, rain (→ 林小雨) and vincent (→ 林建國); body, costume and the 32×48
chibi version are undefined, and 二叔 and the fruit shop owner have no reference at all.

### Registries (§31)

All 17 registries with **ids for the whole game**, so ids are fixed once. Full detail (fields,
numbers) only for the vertical slice; other rows can be one line and get filled in during Phase 10.

1 Character · 2 Enemy · 3 Boss · 4 Skill · 5 Weapon · 6 Item · 7 NPC · 8 Location · 9 Level ·
10 Prop · 11 Story Event (= storyboard beats) · 12 Asset Production · 13 Animation · 14 VFX ·
15 SFX · 16 Godot Data Schemas (filled in Phase 1+, linked here) · 17 Implementation Backlog
(= `docs/plan.md`)

**Id convention (proposed):** `<type>_<name>`, lowercase snake_case, English; file =
`<id>.tres` in its type's folder; ids never change once committed. Prefixes: `character_`,
`enemy_`, `boss_`, `npc_`, `skill_`, `weapon_`, `item_`, `prop_`, `level_`, `event_`, `animset_`,
`ai_`, `status_`, `anim_`, `vfx_`, `sfx_`, `music_`.

Draft ids for the vertical slice (to be confirmed in A7):

| Prefix | Folder | Slice entries |
|---|---|---|
| `character_` | `data/characters/` | `character_felix` |
| `enemy_` | `data/enemies/` | `enemy_office_worker`, `enemy_scalper`, `enemy_delivery_rider` |
| `boss_` | `data/bosses/` | `boss_fruit_shop_owner` |
| `skill_` | `data/skills/` | `skill_felix_light_1..3`, `skill_felix_heavy`, `skill_felix_jump_kick`, `skill_rapid_punch` 連環拳, `skill_tornado_kick` 旋風腿, `skill_burning_spirit` 熱血, `skill_office_briefcase_swing`, `skill_fso_melon_overhead`, `skill_fso_melon_roll`, `skill_fso_shove` |
| `animset_` | `data/animation_sets/` | `animset_felix`, `animset_office_worker`, `animset_fruit_shop_owner` |
| `ai_` | `data/ai/` | `ai_slow_melee`, `ai_ranged_retreat`, `ai_hit_and_run`, `ai_boss_fruit_shop_owner` |
| `prop_` | `data/props/` | `prop_market_stall`, `prop_awning`, `prop_melon` |
| `item_` | `data/items/` | `item_coin`, `item_snack` 點心, `item_handkerchief` 手帕 |
| `level_` | `data/levels/` | `level_city_slice` |
| `event_` | `data/events/` | one per storyboard beat in the prologue and Stage 1 |
| `status_` | `data/status_effects/` | `status_burning_spirit`, `status_soaked` |

`docs/images/*.png` filenames (`felix`, `rain`, `vincent`…) are art references, not content ids.

## Steps

- [x] **A0** *(done 2026-10-04: option B 「一九九四復仇戰」 approved, with the suitcase change; final storyboard in `docs/storyboard/`)* Revise the story: `docs/storyboard/story-v2.en.md` and `story-v2.zh-TW.md` (same
  sections and beat ids). Review rounds until approved; the approved version replaces
  `docs/story.md`, and its beat list supersedes the draft index above.
- [x] **A1** Beat index: confirm the list above (add, cut, reorder) and the clock time of each
  beat.
- [x] **A2** Storyboard **prologue + Stage 1** in full detail — this is the vertical slice.
- [x] **A3** Storyboard Stage 2, Stage 3 and the dining room.
- [x] **A4** Storyboard the reveal, the evaluation form, stinger, the three arrival endings,
  ending and post-credits.
- [x] **A5** Clue ledger and setup/payoff ledger; resolve or cut every open payoff.
- [ ] **A6** Game bible: character, enemy and location pages; art gaps listed.
- [ ] **A7** Registries (all 17) and the asset list; id convention agreed and written into
  `CLAUDE.md`.
- [ ] **A8** Reconcile the documents: PRD §1, §11, §12, §14, §15 marked superseded by the Godot
  restart; HUD reference path → `docs/styles/`; story.md's reference to the deleted
  `docs/idea.md` removed; PRD §12's reference to a `shared/` contract removed.
- [ ] **A9** Review together; then the storyboard, bible and registries are the content
  specification for Phases 1–10.

## Every beat is checked against

- The six content rules (story.md): nobody rude · nobody acknowledges the fighting is strange ·
  wealth shown, never stated · every enemy has a reason to like him · **the candidate never
  suspects** · cartoon violence only.
- **C2:** nothing on screen names 禮 before R-04.
- **C4:** the clock is never labelled or explained.

## Done when

- Every beat from title to post-credits has a storyboard entry with its source and what it becomes
  in the game.
- Both ledgers are complete, with no open payoffs.
- Every character, enemy and location has a bible page.
- All 17 registries exist; every id the vertical slice needs is final.

## Open questions

- **Visual panels:** a text storyboard is enough to build from and easy to keep in step with the
  code. If you want sketched panels (hand-drawn, or generated), they go in
  `docs/storyboard/panels/` named by beat id, and the text stays the source of truth.
- Payoffs story.md leaves open: Lucian's phone footage, Felix's letter.
