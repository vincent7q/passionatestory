# Phase 4 — Skill sequence system

[← Phase 3](phase-03-combat.md) · [plan](../plan.md) · next: [Phase 5](phase-05-character-editor.md)

## Goal

A skill is a **timeline of reusable actions**, not a script. After this phase every attack in the
game — Felix's punches, his specials, and later every enemy and boss move — is built from the same
small set of actions.

## Why this phase exists

§8–9 of the workflow: complex abilities without a unique script per skill. The Skill Editor
(Phase 6) edits exactly this structure, so its shape is decided here.

## Deliverables

```text
systems/skill/skill_data.gd             SkillData, now holding a timeline
systems/skill/skill_runner.gd           SkillRunner — plays a skill on a character
systems/skill/skill_context.gd          what an action can touch (user, target, world, pools)
systems/skill/actions/skill_action.gd   base class
systems/skill/actions/*.gd              one file per action type
systems/skill/status_effect_data.gd     StatusEffectData (buffs and debuffs)
systems/skill/projectile_data.gd        ProjectileData
systems/core/pool.gd                    object pool (projectiles, hit sparks, popups)
data/skills/…                           Felix's moves, rebuilt as timelines
data/status_effects/status_burning_spirit.tres
docs/schemas/{skill,skill_action,status_effect,projectile}.md
```

## Design

### Timeline, not a list with waits

Each action has a **`frame`** at which it fires. A skill has a total length. Startup / active /
recovery are not typed in by hand — they are *derived* from where the hitbox actions sit, which is
exactly what the Skill Editor's timeline (§10) shows.

```text
skill_rapid_punch 連環拳   (氣 10)
frame  0  PlayAnimation  rapid_punch
frame  4  CreateHitbox   jab   (damage 6, hitstun 12)
frame  6  RemoveHitbox
frame  8  CreateHitbox   jab
…                        (5 hits in total)
frame 24  CreateHitbox   finisher (damage 14, knocks_down)
frame 27  RemoveHitbox
frame 27  CameraShake    3 px
frame 40  end
```

### Skill fields

| Field | Meaning |
|---|---|
| `animation` | Default clip |
| `spirit_cost` | 氣, taken when the skill starts |
| `length_frames` | Total length |
| `actions: Array[SkillAction]` | The timeline |
| `cancel_from_frame` | When chaining into the next input is allowed |
| `interruptible` | Whether being hit stops it (most yes; some boss moves no) |
| `ai_hints` | Range and usage hints for AI (Phase 7) |

### Action types

Built in this phase — only what Felix and the Stage 1 cast need (§9 lists more; they arrive when
a skill needs them):

| Action | What it does |
|---|---|
| `PlayAnimation` | Switch clip |
| `Move` | Move the user by a distance over N frames (dashes, lunges) |
| `Jump` | Launch the user into the air |
| `CreateHitbox` / `RemoveHitbox` | Turn an attack box on/off; carries damage, knockback, hitstun, hitstop, knockdown, **both_sides** (旋風腿) |
| `ApplyStatusEffect` | Put a `StatusEffectData` on the user or the target |
| `SpawnProjectile` | Fire a `ProjectileData` (the scalper's fruit, Phase 7) |
| `SpawnVFX` / `PlaySFX` | Presentation, using pooled objects |
| `CameraShake` | 3–5 px on heavies (PRD §11) |
| `EmitEvent` | Send a named signal to the event system (Phase 8) |

Later, as content needs them: `Grab`, `ChangeState`, `SpawnAlly`, `Heal`, `SetInvincible`.

### Status effects

`StatusEffectData`: duration, stacking rule, and modifiers (attack ×, speed ×, jump ×, recovery
×, guard ×, invincible, 力 drain per second, 力-score bonus). One type serves:

| Effect | Source |
|---|---|
| 熱血 Burning Spirit — attack up 10 s | Felix's special |
| 拚了 Berserker — invincible, 2× damage, drains 力 | Hilman's special (Phase 10) |
| Heaviness — slower, shorter jumps, longer recovery, **stacks** | 二叔's tea (Phase 10) |
| 名片 Business Card, 好茶葉 Good Tea Leaves | Items (Phase 8) |
| Rain soaking | Stage 1 hazard (Phase 8) |

### Pools

Projectiles, hit sparks, damage numbers and the gold popups are pooled from the start (PRD §17:
"retrofitting is painful").

## Steps

- [ ] **4.1** `SkillAction` base, `SkillContext`, `SkillRunner` (plays frame by frame on the
  physics tick; stops cleanly when interrupted — removes its hitboxes, ends its effects).
- [ ] **4.2** Actions: `PlayAnimation`, `CreateHitbox`, `RemoveHitbox`, `Move`, `Jump`.
- [ ] **4.3** Rebuild Phase 3's flat attacks (light ×3, heavy, jump kick) as timelines; delete the
  flat fields from `SkillData`.
- [ ] **4.4** `StatusEffectData` and `ApplyStatusEffect`.
- [ ] **4.5** `Pool`; `SpawnVFX`, `PlaySFX`, `CameraShake`.
- [ ] **4.6** `ProjectileData` and `SpawnProjectile`.
- [ ] **4.7** Felix's specials: 連環拳 (5 hits, knockdown finisher), 旋風腿 (hits both sides),
  熱血 (attack buff 10 s). Decide how C chooses between three specials (direction + C, or a cycle)
  and record it in the PRD.
- [ ] **4.8** Not enough 氣 → the special doesn't start, with a small "empty" cue.

## Tests

| Test | Checks |
|---|---|
| Runner timing | Actions fire on their exact frames; total length respected |
| Interrupt | A hit mid-skill removes its hitboxes and ends it |
| Both sides | 旋風腿 hits targets in front and behind |
| Status | Duration, stacking, modifiers applied and removed |
| Pool | Objects are reused; nothing leaks after 1000 spawns |
| Data-only skill | A skill defined only in a test `.tres` runs and hits |

## Done when

A new skill can be authored **entirely as a `.tres`** and used in game with no code change (§29 —
*add a new skill*), and Felix's three specials work.

## Risks

| Risk | Mitigation |
|---|---|
| Too many action types too early | Only build what a real skill needs right now |
| Interrupted skills leave hitboxes or buffs behind | Runner owns cleanup; covered by a test |
