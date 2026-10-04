# Phase 8 — Level & event system → vertical slice

[← Phase 7](phase-07-enemy-ai.md) · [plan](../plan.md) · next: [Phase 9](phase-09-validation.md)

## Goal

Levels and story beats made from data, the real HUD, and the evaluation form — ending in **the
vertical slice**: a cut-down Stage 1 playable from the prologue to the evaluation form.

## Why this phase exists

§14–16: a level is layers of data; storyboard beats are events (trigger → conditions → actions →
completion). §28: the slice proves the whole chain — input → character → skill → hitbox → damage
→ reaction → defeat → story event → boss. For this game it must also prove the hidden scoring and
its payoff.

## Deliverables

```text
systems/level/level_data.gd            LevelData
systems/level/level_section_data.gd    LevelSectionData
systems/level/spawn_wave_data.gd       SpawnWaveData
systems/level/parallax_layer_data.gd   ParallaxLayerData
systems/level/prop_data.gd             PropData (capabilities)
systems/level/hazard_data.gd           HazardData
systems/level/level_runner.gd          LevelRunner — builds any level from data
systems/level/camera_rig.gd            follow, lookahead, section bounds
systems/event/event_data.gd            EventData
systems/event/triggers/*.gd  conditions/*.gd  actions/*.gd
systems/event/event_runner.gd
systems/dialogue/dialogue_data.gd      DialogueData
systems/items/item_data.gd             ItemData
systems/items/weapon_data.gd           WeaponData
systems/flow/game_flow.gd              GameFlow (autoload): title → … → evaluation
systems/save/checkpoint.gd             stage-start checkpoint in user://
scenes/ui/hud.tscn  dialogue_box.tscn  pause_menu.tscn  evaluation_form.tscn  title.tscn
data/levels/level_city_slice.tres
data/events/…  data/props/…  data/items/…
```

## Design

### `LevelData`

| Field | Meaning |
|---|---|
| `length` | World px |
| `walk_strip` | Depth range the characters can walk in |
| `clock_start` | In-game time when the stage begins (Stage 1: 17:20) |
| `parallax: Array[ParallaxLayerData]` | Texture + scroll factor (PRD: 0.2×, 0.5×, 1.0×, 1.2×) |
| `sections: Array[LevelSectionData]` | Start/end (% of length), camera lock, waves, hazards, music |
| `props: Array[PropPlacement]` | Prop id + position |
| `pickups: Array[PickupPlacement]` | Item id + position |
| `event_ids` | Events active in this level |
| `boss` | Boss id, arena bounds, intro event |

`LevelRunner` builds **any** level from this — no per-level script (§29 — *add a new level*).
Parallax uses Godot's `Parallax2D` with the factors from data (`layer.x = -camera.x × factor`).

### Sections, waves, camera

A section locks the camera until its waves are cleared; each `SpawnWaveData` lists enemy ids, which
side they enter from, when, and the attack-token count. The camera follows the candidate with
lookahead and smoothing, clamped to the section.

### Props (§15)

`PropData` capability flags: `breakable`, `damageable` (HP), `throwable`, `pickupable`, `blocks`,
`gives_cover`, `drops` (loot), `on_break_event`. Stage 1 needs:

- **Market stalls** — breakable; nothing tells the player not to smash them. All intact on reaching
  the boss = +6 禮 (`RunState` flag).
- **Awnings** — `gives_cover` from the rain.
- The **melon** (Phase 7) uses the same type.

### Hazard: rain (PRD §6.1)

`HazardData`: outside cover, 力 drains 1/sec (applied as a status effect). A 手帕 pickup, or
standing under an awning, stops it.

### Items & weapons (PRD §9)

`ItemData` (effect via `StatusEffectData` or direct 力/氣) — slice: 錢 coin, 點心 snack, 手帕.
`WeaponData` (uses, damage, knockback, thrown behaviour) — picked up with E, light attack swings,
heavy throws, breaks after its uses. Slice: 水果 fruit only; the rest in Phase 10.

### Events (§16)

```text
EventData
├── trigger      LevelStart · EnterArea(x) · WaveCleared · CharacterDefeated(id) · BossDefeated
│                · ItemCollected · Interacted · ClockReached · EventCompleted(id)
├── conditions   FlagSet · FlagNotSet · ClockBefore/After · RosterContains · CandidateIs
├── actions      ShowDialogue · SpawnWave · MoveActor · PlayAnimation · PlayMusic · StopMusic
│                · CameraTo · LockCamera · StartBossFight · SetFlag · AwardLi · Wait
│                · FadeOut/In · EndStage
└── once         fires once per run, or every time
```

Events run in order and can wait on their own actions (dialogue finishing, an actor arriving), so a
scripted scene is just a list of actions — no cutscene code.

**Events come from the storyboard (Phase 0A):** each storyboard beat becomes one `EventData`, with
the id fixed in the registries, and its storyboard entry is the spec — what is on screen, who,
the dialogue keys, the camera, the music. The slice builds the prologue and Stage 1 beats (P-01 to
P-04, S1-01 to S1-05).

### Dialogue (PRD §10)

`DialogueData`: lines of `speaker_id` + `text_key` + expression. The box sits at the bottom,
semi-transparent, with the name in a coloured tab, typewriter text, and a blinking arrow when
waiting. The PRD's "120 px" was written for a 960×540 display, so at 1920×1080 it is about 240 px
tall. Like all text, it is drawn in the 1920×1080 UI layer.

### HUD (PRD §10, `docs/styles/1.jpg` & `2.jpg`)

| Where | What |
|---|---|
| Far left | Vertical EXP bar; portrait; `Lv.N` |
| Next to it | 力 green bar with `current/max` (health and criterion one) · 氣 orange bar |
| Centre | The clock, `HH:MM`, counting toward 18:00 — **no label, ever** |
| Right | 錢 with coin icon |
| Bottom-left | Equipped ally portrait + Q prompt |
| Over a dazed opponent | Slowing stars + E glyph |
| Popups | Damage numbers (white / yellow critical / green heal) · gold `+N` with a seal for 禮, **no label** |

Pause menu: **Resume · Restart Section · Controls · Quit**. Nothing else; no scoring page.

### The clock

Starts at the level's `clock_start` and advances at a rate from data (Q1: proposed 1 game-minute
per 30 real seconds). Recorded in `RunState`. **Not scored**; in the full game it decides which
dinner he walks into (Phase 10).

### Game flow

```text
TITLE → CANDIDATE_SELECT → PROLOGUE → STAGE ⇄ PAUSED → STAGE_CLEAR → … → EVALUATION
                                         ↓
                              力 = 0 → WAKE_UP (carried somewhere safe) → retry, attempts − 1
```

The slice has Felix only on the select screen. Checkpoint = stage start, saved in `user://`.

### The evaluation form (PRD §8.1)

Pacing is the point; the scene is a timed sequence:

1. 力 POWER animates in — good.
2. 錢 MONEY animates in — good. The note 「這些是我們的錢。」 beside it.
3. Pause. Then the **third line writes itself in**: 禮 JUDGMENT, worth more than either.
4. The total.
5. Underneath, already printed: **林建國 (1994) — 71.** No comment.

This is the **only** screen whose strings may contain 禮 (`eval.*` keys).

## Steps

- [ ] **8.1** `LevelData`, sections, `LevelRunner`, walk strip, parallax.
- [ ] **8.2** Camera rig with section locks; spawn waves.
- [ ] **8.3** `PropData`, market stalls, awnings; stall-intact tracking.
- [ ] **8.4** Rain hazard and cover.
- [ ] **8.5** `ItemData`, pickups (coin, snack, 手帕); `WeaponData` with fruit.
- [ ] **8.6** `EventData`, triggers, conditions, actions, `EventRunner`.
- [ ] **8.7** `DialogueData` and the dialogue box.
- [ ] **8.8** HUD; the clock; pause menu.
- [ ] **8.9** `GameFlow`: title, candidate select (Felix), prologue, stage, stage clear, game over
  / wake-up, checkpoint.
- [ ] **8.10** Evaluation form with its pacing.
- [ ] **8.11** `level_city_slice`: a short Market Row (stalls), one covered stretch with rain, two
  waves (office workers, then a scalper and a rider), the fruit stall boss.
- [ ] **8.12** Slice playthroughs (below); profile for 60 FPS (C6).

## The slice acceptance test

Play it twice:

| Run | How | Expect |
|---|---|---|
| **Masher** | Hit everything, hit them while down, smash the stalls, smash the melon, never press E | High 力 and 錢, 禮 near 0, total well below 71 |
| **Kind** | Help everyone up, leave the stalls alone, avoid the melon | 禮 clearly higher; allies join; the boss points up the road |

And check, by playing: the character 禮 appears nowhere before the form (C2); the clock has no
label (C4); the pause menu explains nothing.

## Done when

Felix plays **prologue → short Stage 1 → fruit shop owner → evaluation form**, end to end, and the
two runs above give visibly different 禮 with the right reactions. The level, its waves and its
events are all data (§29 — *add a level*, *add a storyboard event*).

## Risks

| Risk | Mitigation |
|---|---|
| Event system turns into a scripting language | Only add a trigger/action when a real beat needs it |
| UI text drawn in the pixel world by mistake | Text only exists in the UI layer; the validator flags labels inside world scenes (Phase 9) |
| Slice takes too long and stalls the project | The slice is deliberately short; full Stage 1 is Phase 10 |

## Open questions

- Q1 clock rate · Q7 fonts (from the plan).
