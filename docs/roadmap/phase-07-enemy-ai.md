# Phase 7 — Enemy & AI data

[← Phase 6](phase-06-skill-editor.md) · [plan](../plan.md) · next: [Phase 8](phase-08-level-event.md)

## Goal

Enemies that behave differently because of their **data**, not separate scripts; opponents who
switch sides when helped up; and the Stage 1 boss, the fruit shop owner, with her melon.

## Why this phase exists

§12–13: enemies use the same character architecture as players, and AI behaviour is configured
through an `AIProfile`. §5.3 of the PRD — helping someone up turns them into an ally — is also AI
work, so it lands here.

## Deliverables

```text
systems/ai/ai_profile.gd            AIProfile (data)
systems/ai/ai_brain.gd              AIBrain — drives a CharacterBase through intents
systems/ai/attack_tokens.gd         limits how many attack at once
systems/ai/bark_data.gd             BarkData — lines spoken while fighting
systems/ai/boss_phase_data.gd       BossPhaseData
systems/ally/ally_controller.gd     ally behaviour and the Q call
data/ai/ai_slow_melee.tres, ai_ranged_retreat.tres, ai_hit_and_run.tres, ai_boss_fruit_shop_owner.tres
data/enemies/enemy_office_worker.tres, enemy_scalper.tres, enemy_delivery_rider.tres
data/bosses/boss_fruit_shop_owner.tres
data/props/prop_melon.tres
data/skills/…                       the enemies' and boss's moves
```

## Design

### `AIProfile` (§13)

| Field | Meaning |
|---|---|
| `aggression` 0–1 | How readily it closes in and attacks |
| `preferred_range` | World px it tries to keep from its target |
| `depth_approach` | Straight in, or line up on the target's depth lane first |
| `reaction_frames` | Delay before responding |
| `attack_frequency` | Chance per decision to attack when in range |
| `combo_probability` | Chance to continue a chain |
| `special_probability` | Chance to use a special |
| `guard_probability` | Chance to guard an incoming attack (Estate Security relies on this) |
| `retreat_threshold` | 力 fraction at which it backs off |
| `hit_and_run` | Attack once then retreat (Delivery Rider) |
| `keeps_away` | Retreats when closed on (Scalper) |
| `bark_id` | Which `BarkData` it uses |

### AI state machine (PRD §12)

```text
IDLE ─► CHASE ─► ATTACK ─► RECOVER ─► CHASE …
          ▲                   │
          └──── STUN ◄── hit ─┘
power 0 ─► DAZED ─┬─ helped up ─► ALLIED
                  └─ timeout ──► DESPAWN
```

`AIBrain` only produces **intents** (`move`, `jump`, `use_slot`, `guard`) — the same calls the
player controller makes — so enemies use exactly the same movement and combat code as the player.

### Group behaviour — attack tokens

Classic beat-'em-ups stop crowds from attacking all at once. An encounter has a small pool of
**attack tokens** (e.g. 2); an enemy must hold one to attack, and others circle and wait. Token
count is level data, so a wave can be made harder without new code.

### Barks — the clues (story.md, *Layer one*)

`BarkData`: lines keyed by moment — `on_attack`, `on_hit`, `on_defeat`, `on_helped_up` — with a
chance each. This is where 「不好意思」 while swinging comes from. Every line is checked against the
six content rules (PRD §17).

### Switching sides (PRD §5.3)

- Helped-up opponents with `can_join` are added to the **roster** in `RunState`, permanently for the
  run. The roster is what 林建國's summon checks in Phase 10.
- **One** roster member is the equipped ally. **Q** calls them in once per fight: they run in from
  the screen edge, fight on the candidate's side (faction switched at runtime) for a set time, then
  leave.
- Swapping the equipped ally happens at checkpoints (Phase 8).
- Between stages, each new roster member with `teaches_skill_id` teaches that technique
  permanently.

### Stage 1 enemies (PRD §6.1) — differences are data only

| Enemy | HP | AI | Moves | Notes |
|---|---|---|---|---|
| 上班族 Office Worker | 30 | `ai_slow_melee` | Briefcase swing | Barks 「不好意思」 while swinging |
| 代購黃牛 Scalper | 35 | `ai_ranged_retreat` | Throws fruit (projectile) | Retreats when closed on |
| 外送員 Delivery Rider | 40 | `ai_hit_and_run` | Fast dash strike | The man who delivers the candidate's food every week |

### Boss — 水果店老闆娘, the fruit shop owner (PRD §6.1)

`CharacterData` (type BOSS, 300 HP) + `BossPhaseData` list (HP threshold, move weights, AI
overrides). Moves: overhead melon swing, rolling bowl (ground projectile), two-handed shove.

**The melon** is a separate entity (`prop_melon`, 40 HP) that she carries. It has its own body box,
so any of the candidate's hits that overlap it damage it:

| What happens | Result |
|---|---|
| Melon takes any damage | Instant 力 loss for the candidate; **+8 for sparing the stall is lost** (flag in `RunState`) |
| Melon destroyed | She sits down in the wreckage; the fight ends. No penalty is shown; the file records it |
| She is beaten with the melon untouched | She points up the road (event, Phase 8); +8 禮 |

**The old build shipped this boss with no behaviour at all**, and she also slid off the map. Her
done-when below is explicit for that reason.

## Steps

- [ ] **7.1** `AIProfile`, `AIBrain` (idle, chase, attack, recover), intents.
- [ ] **7.2** Depth approach, preferred range, retreat; stun.
- [ ] **7.3** Attack tokens.
- [ ] **7.4** `BarkData` and speech bubbles (world-anchored, drawn in the UI layer for crisp text).
- [ ] **7.5** Office worker, scalper (needs `SpawnProjectile`), delivery rider — as data.
- [ ] **7.6** Allies: roster, equip, Q call, faction switch, leave; taught skills.
- [ ] **7.7** `BossPhaseData`; the fruit shop owner's three moves.
- [ ] **7.8** The melon: carried prop with its own HP, damage rules, the two endings of the fight.

## Tests

| Test | Checks |
|---|---|
| AI decisions | Given a profile and a situation, the brain chooses the expected intent (seeded random) |
| Tokens | Never more attackers than tokens |
| Ally | Helped-up opponent joins the roster; Q calls the equipped one once per fight; ally damages enemies, not the player |
| Melon | Damaging it loses the +8 and costs 力; destroying it ends the fight; untouched win awards +8 |
| Boss stays in the arena | She never leaves the arena bounds in a 5-minute headless simulation |

## Done when

The three Stage 1 enemies and the fruit shop owner behave distinctly **through configuration
alone** (§29 — *add a new enemy*); a helped-up worker can be called in with Q; and the fruit shop
owner actively fights, stays in her arena, and the melon rules work.

## Risks

| Risk | Mitigation |
|---|---|
| Bosses need one-off code | Allowed only as small, named boss behaviours selected by data; anything reusable goes into actions |
| AI too hard to read and tune | Debug overlay shows each enemy's state, target and token |
