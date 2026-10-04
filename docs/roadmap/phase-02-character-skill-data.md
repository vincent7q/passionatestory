# Phase 2 — CharacterData & SkillData

[← Phase 1](phase-01-core-data.md) · [plan](../plan.md) · next: [Phase 3](phase-03-combat.md)

## Goal

One character scene that becomes Felix, an office worker or a boss depending only on which
`CharacterData` it is given. It walks and jumps on the 2.5D floor. No fighting yet.

## Why this phase exists

§3.1–3.2 and §5–7: characters and skills are data; one `CharacterBase` serves every character
type. This phase builds the data types and the shared body. Combat (Phase 3) then has something to
work on.

## Deliverables

```text
systems/character/stats_data.gd        StatsData
systems/character/animation_set.gd     AnimationSet
systems/character/moveset_data.gd      MovesetData
systems/character/character_data.gd    CharacterData
systems/skill/hitbox_data.gd           HitboxData
systems/skill/skill_data.gd            SkillData (flat timing fields for now)
systems/character/character_base.gd    CharacterBase
scenes/characters/character_base.tscn
data/characters/character_felix.tres
data/enemies/enemy_office_worker.tres
data/animation_sets/animset_felix.tres, animset_office_worker.tres
assets/characters/felix/…              placeholder sprite frames
docs/schemas/{stats,animation_set,moveset,character,skill,hitbox}.md
tests/characters/…
```

## Design

### The 2.5D model (PRD §12)

| Axis | Meaning | In Godot |
|---|---|---|
| `x` | Horizontal along the street | `position.x` of the character root |
| `y` | **Depth** — further into the screen is smaller `y` | `position.y` of the character root (the feet on the ground) |
| `z` | Height above the ground while jumping | A separate `height` value; the sprite child is drawn at `-height` |

- The root sits **on the ground**, so the world node's `y_sort_enabled` sorts by depth correctly
  even mid-jump. A shadow stays at the root.
- Gravity changes `height` only. Walking up/down changes `y` within the level's walkable strip.
- All movement happens in `_physics_process` at the fixed 60 Hz tick. Gameplay timing is counted
  **in frames (ticks)**, not seconds, so it is exact and repeatable.

### Data types

**`StatsData`** (embedded in a character):

| Field | Type | Felix (PRD §3) |
|---|---|---|
| `max_power` 力 | int | 100 |
| `max_spirit` 氣 | int | 80 |
| `walk_speed` | float, world px/s | from Speed ★4 |
| `depth_speed` | float, world px/s | ~60% of walk |
| `jump_velocity` | float | tuned |
| `attack_mult` | float | from Power ★3 |
| `guard_mult` | float | from Guard ★3 |
| `weight` | float | Affects knockback taken |

The ★ ratings become numbers through one table (★1–★5 → multiplier) in a `StatScale` resource,
so all three candidates move together when it is tuned.

**`AnimationSet`** (content, shared by palette swaps):

| Field | Type | Meaning |
|---|---|---|
| `sprite_frames` | `SpriteFrames` | The clips |
| `origin` | `Vector2i` | Where the feet are in the frame |
| `shadow_size` | `Vector2i` | Ground shadow |

Required clip names, per PRD §11: `idle walk jump fall light_1 light_2 light_3 heavy hurt
knockdown getup dazed` + one per special. The validator checks they exist (Phase 9).

**`CharacterData`**:

| Field | Type | Notes |
|---|---|---|
| `character_type` | enum PLAYER / ENEMY / BOSS / NPC | §6 |
| `stats` | `StatsData` | embedded |
| `animation_set_id` | StringName | |
| `moveset` | `MovesetData` | which skill fills which input slot |
| `ai_profile_id` | StringName | empty for players; used from Phase 7 |
| `faction` | enum CANDIDATE / LIN | Allies switch faction at runtime, not in data |
| `body` | `HitboxData` | The hurtbox: width, depth band, height |
| `portrait` | Texture2D | HUD / dialogue |
| `coin_drop` | int | 錢 dropped on defeat |
| `can_be_attacked` | bool | False for the toddler (Stage 3) |
| `can_be_grabbed` / `can_be_thrown` | bool | False for the guard dog and kitchen staff |
| `dazes_on_defeat` | bool | The ten-second window applies |
| `can_join` | bool | Switches sides when helped up |
| `teaches_skill_id` | StringName | Technique taught when he joins (§5.3) |

These flags are how the unusual opponents (toddler, dog, 二叔) become **configuration, not new
scripts**.

**`MovesetData`**: `light_chain: Array[StringName]`, `heavy`, `jump_attack`, `specials:
Array[StringName]` (in order of the C button cycle or directional input — decided in Phase 4),
`grab_strike`, `throw`.

**`HitboxData`** (used for both attacks and bodies): `offset_x` (forward; flips with facing),
`offset_y` (depth), `size_x`, `depth_band` (how thick in `y`), `z_min`, `z_max`.

**`SkillData`** (flat in this phase; Phase 4 turns it into a sequence):

| Field | Type | Meaning |
|---|---|---|
| `animation` | StringName | Clip to play |
| `spirit_cost` | int | 氣 |
| `startup_frames` / `active_frames` / `recovery_frames` | int | Frame data at 60 Hz |
| `hitbox` | `HitboxData` | Where it hits |
| `damage` | int | |
| `knockback` | Vector2 | x push, z launch |
| `hitstun_frames` | int | |
| `hitstop_frames` | int | The tiny freeze on impact that sells a hit |
| `knocks_down` | bool | Heavy finishers |
| `cancel_from_frame` | int | When the next chain input is accepted |

The workflow's example uses seconds (`startup: 0.18`); frames are used here because the game runs
on a fixed 60 Hz tick. The skill editor (Phase 6) shows both.

### `CharacterBase`

```text
CharacterBase (Node2D)          ← position = feet on the ground (x, depth)
├── Shadow (Sprite2D)
├── Visual (Node2D)             ← offset by -height
│   └── Sprite (AnimatedSprite2D)
└── (combat, AI, interaction components are added in Phases 3, 7)
```

`setup(data: CharacterData)` reads everything from data. A player controller (input → intent)
and, later, an AI brain (Phase 7) both drive the same character through the same **intent** calls
(`move(dir)`, `jump()`, `use_slot(slot)`), so players and enemies never have separate movement
code.

## Steps

- [ ] **2.1** `StatsData`, `StatScale`, their schema pages.
- [ ] **2.2** `AnimationSet`; placeholder `SpriteFrames` for Felix and the office worker (coloured
  32×48 blocks with a face direction marker are enough).
- [ ] **2.3** `HitboxData`, `MovesetData`, `CharacterData`.
- [ ] **2.4** `SkillData` (flat).
- [ ] **2.5** `CharacterBase`: ground position, height, gravity, facing, walk in x and depth
  (clamped to a test strip), jump, animation switching.
- [ ] **2.6** Player controller: input actions → intents.
- [ ] **2.7** `character_felix.tres`, `enemy_office_worker.tres` and a test scene with both
  standing on a floor.
- [ ] **2.8** Debug overlay (toggle key): draws each character's body box, depth band and height.

## Tests

| Test | Checks |
|---|---|
| Data round-trip | Each new type saves and loads with no field loss |
| `CharacterBase.setup` | Speed and size come from data; switching data changes them |
| Movement | Depth stays inside the strip; gravity changes only `height`; landing resets it |
| Y-sort | A character with larger `y` draws in front |

## Done when

Felix walks and jumps on the 2.5D floor; giving the same scene the office worker's data changes
speed, size and sprite with **no code change** (§29 — *add a new character*).

## Risks

| Risk | Mitigation |
|---|---|
| Sorting breaks during jumps | Root stays on the ground; only the visual moves up |
| ★ ratings tuned three times over | One `StatScale` table shared by all characters |
