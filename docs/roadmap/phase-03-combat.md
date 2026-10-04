# Phase 3 — Combat system

[← Phase 2](phase-02-character-skill-data.md) · [plan](../plan.md) · next: [Phase 4](phase-04-skill-sequences.md)

## Goal

Hitting and being hit, in 2.5D, following the Kunio-kun / River City line (PRD §5) — plus the
mechanic the game is built around: **the ten-second window**, and the scoring that watches it.

## Why this phase exists

§3.3: content says *what* an attack is; the combat system decides *how* it plays out. This is the
heart of the runtime, and it is also where the hidden 禮 scoring has to be proven, because the
PRD (§17) wants the scoring and the ten-second window working end to end on a small surface first.

## Deliverables

```text
systems/combat/hit_resolver.gd         HitResolver — who hit whom this tick
systems/combat/damage_calculator.gd    DamageCalculator — pure functions
systems/combat/hit_result.gd           HitResult
systems/combat/combat_tuning.gd        CombatTuning (data: parry window, invincibility, combo timeout…)
systems/character/states/*.gd          character state machine
systems/interaction/interactable.gd    Interactable (component)
systems/interaction/interaction_system.gd   on the player: finds the best E target
systems/run/scoring_rules.gd           ScoringRules (data)
systems/run/score_calculator.gd        ScoreCalculator — pure, ported from the old shared/scoring.js
systems/run/run_state.gd               RunState (autoload)
scenes/objects/coin.tscn               minimal coin pickup
scenes/ui/debug_score_overlay.tscn
data/combat/combat_tuning.tres
data/scoring/scoring_rules.tres
tests/combat/…  tests/scoring/…
```

## Design

### Hits in 2.5D

A hit needs **all three** overlaps (PRD §12):

1. `x` — the attack box and the body box overlap horizontally
2. `y` — their depth bands overlap (someone on a different depth line is missed)
3. `z` — their height ranges overlap (a jump can clear a low sweep)

`HitResolver` runs once per physics tick: collect active attack boxes, test them against body
boxes, and remember who each attack already hit so one swing can't hit the same body twice. It is
**plain code, not Godot physics areas** — with at most ~50 entities on screen a simple loop is
fast enough, and it can be unit-tested headless and run deterministically.

### Damage

`DamageCalculator` (pure functions, fully tested):

```text
damage = skill.damage × attacker.attack_mult × status modifiers × difficulty modifier
if guarding:  × 0.5  (PRD §5)
if parried:   0, and the attacker is staggered
```

`HitResult` carries: damage, knockback, hitstun, hitstop, knocked down?, guarded?, parried?,
**target was downed?**, combo count.

### Character states

```text
IDLE ⇄ WALK ─► JUMP/FALL
  │      │
  ├► ATTACK (running a skill)
  ├► GUARD ── parry on impact ─► (attacker) STAGGER
  │
hit ─► HURT (hitstun) ─► IDLE
hit with knockdown ─► AIRBORNE/KNOCKDOWN ─► GETUP (≈1 s invincible) ─► IDLE
grabbed ─► GRABBED ─► THROWN (becomes a hitbox for others)
power reaches 0 ─► DEFEATED ─► DAZED ─┬─ helped up (E) ─► HELPED_UP ─► (Phase 7: ALLIED)
                                      └─ window ends ─► DESPAWN (walks off screen)
```

- **Chains:** light → light → light, or light → heavy; heavy finishers knock down. The cancel
  window comes from `SkillData.cancel_from_frame`. A short input buffer (≈8 frames) makes chains
  feel responsive.
- **Juggling:** a launch sets upward `height` velocity; light hits on an airborne opponent add a
  small re-launch, so the opponent stays up.
- **Grabs:** walking into a staggered or stunned opponent grabs them; light = strike, heavy =
  throw. A thrown body damages others it hits.
- **Guard / parry:** hold `guard` to halve damage; pressing it within a small window
  (`CombatTuning.parry_window_frames`) **before impact** parries. The PRD says "on the frame of
  impact"; a window of a few frames is how that feels fair.
- **Weapons** are not here — they arrive with items in Phase 8.

### The ten-second window

- A defeated opponent (with `dazes_on_defeat`) sits down; stars orbit and **visibly slow** as time
  runs out. That slowing is the only countdown.
- The window is one tuning value in `ScoringRules` (`daze_window_frames`, 600 = 10 s), because it
  will be tuned after playtests (PRD says it may want to be 8 or 12).
- Pressing E beside them helps them up. Helping takes a short animation that leaves the player
  open (`help_up_frames`) — it should **feel like a real cost** in the moment (PRD §16).
- If the window ends, they stand up, dust themselves off and walk off screen for good. That
  despawn also keeps the on-screen entity count low.

### Context action (E)

`Interactable` is a component any entity can carry: `prompt_icon`, `priority`, `range`,
`is_available()`, `interact(player)`. `InteractionSystem` on the player picks the highest-priority
available one in range and shows **only the E key glyph** above it — never a word explaining why.

Phase 3 needs one: *help up*. Later: accept tea (Phase 10), bow (Phase 7/10), pick up items
(Phase 8).

### "Downed" and the penalty

An opponent is **downed** while in KNOCKDOWN, DEFEATED or DAZED. Hits on a downed opponent
**connect** (so the temptation is real) and emit `downed_opponent_struck` → −4 禮 each. This is
the heaviest penalty in the game. *(Q3 in the plan: confirm that knocked-down-but-not-defeated
counts.)*

### EventBus signals added

`hit_landed(attacker, target, result)` · `character_defeated(target, by)` ·
`downed_opponent_struck(attacker, target)` · `helped_up(player, target)` ·
`despawned(target)` · `coin_spawned(amount)` · `coin_collected(amount)` ·
`li_awarded(rule_id, amount, at_position)`

### Scoring — `ScoringRules`, `RunState`, `ScoreCalculator`

**`ScoringRules`** (one `.tres`; every value here will be tuned):

| Group | Values (PRD §5.2 and the old `shared/scoring.js`) |
|---|---|
| Caps | 力 40 · 錢 20 · 禮 40 · father's score 71 |
| 禮 per action | help up +3 · spare fruit stall +8 · accept all three cups +8 · bow on the beat +6 · never struck downed +5 · never struck toddler +4 · market stalls intact +6 · strike downed −4 · force-fed −30 |
| 力 scoring | damage target 4000 (weight 12) · combo target 12 (weight 8) · 力 remaining (weight 10) · par time 20 min (weight 10) |
| 錢 scoring | collected ÷ total dropped × 20 |
| Window | `daze_window_frames` 600 · `help_up_frames` |
| Difficulty | easy 0.75× · normal 1.00× · hard 1.35× (leaderboard value only) |

**`RunState`** (autoload) records the run, not the score: candidate, difficulty, damage dealt,
longest combo, 力 remaining/max, coins collected and coins dropped, the **禮 ledger** (every award
with its rule, amount, time and place), flags (melon damaged, stalls broken, struck toddler…), the
roster of everyone helped up, and elapsed time. It listens to `EventBus`; combat code never calls
it directly.

**`ScoreCalculator`** is a pure function: `RunState` + `ScoringRules` → `{power, money, li, total}`.
It is ported from the old `shared/scoring.js` (in git history at `c601701`), whose formula already
met C1. 禮 is clamped to `[0, 40]` **last**, after the negatives.

**Popup:** each 禮 award shows a gold `+3` (or whatever the amount) with a small seal icon and **no
label**. Negative awards show nothing at all.

### Coins

Defeated opponents drop `coin_drop` worth of coins; walking over them collects them (Q5). Each
spawn adds to "coins dropped", so 錢 is scored against what was actually available.

## Steps

- [ ] **3.1** `CombatTuning` and `HitboxData` world-space conversion (facing flip).
- [ ] **3.2** `HitResolver` with the three overlaps and once-per-swing memory.
- [ ] **3.3** `DamageCalculator` and `HitResult`.
- [ ] **3.4** Character state machine: idle, walk, jump, attack (flat `SkillData`), hurt, hitstop.
- [ ] **3.5** Knockdown, airborne, juggling, get-up invincibility.
- [ ] **3.6** Guard and parry, stagger.
- [ ] **3.7** Light chain with input buffer; heavy finisher.
- [ ] **3.8** Grab, grab-strike, throw; thrown bodies as hitboxes.
- [ ] **3.9** Defeat → DAZED with slowing stars → despawn.
- [ ] **3.10** `Interactable`, `InteractionSystem`, help up.
- [ ] **3.11** `ScoringRules`, `RunState`, `ScoreCalculator`, the gold popup, coins.
- [ ] **3.12** Debug overlay: 力 / 錢 / 禮 live, plus the 禮 ledger (debug builds only — it must
  never ship visible).
- [ ] **3.13** Test arena: Felix against two office workers who only stand and block, then who
  attack on a timer.

## Tests

| Test | Checks |
|---|---|
| `test_hit_resolver` | Hit on all three overlaps; miss on a different depth; miss over a jump; one hit per swing |
| `test_damage` | Multipliers, guard halves, parry zeroes and staggers |
| `test_daze` | Window length from data; help-up inside the window works, outside does not; despawn at the end |
| `test_downed_penalty` | Striking dazed / knocked-down opponents emits the penalty each time |
| `test_score_calculator` | Ported cases from the old `scoring.js`; 禮 clamps at 0 and 40 |
| **`test_c1_masher`** | **A max-violence, zero-restraint run scores < 71, in the 56–60 band.** If it fails, tune the 力 weights — never the test |
| **`test_c3_kindness`** | Set-pieces alone total 37 < 40: a full 禮 column needs at least one help-up |

## Done when

In the test arena Felix fights two office workers with chains, juggles, grabs, throws and guards;
a defeated worker can be helped up (gold `+3`) or left to walk off; hitting him while he's down
costs 禮; and the debug overlay shows 力 / 錢 / 禮 changing correctly. C1 and C3 tests pass.

## Risks

| Risk | Mitigation |
|---|---|
| Combat feels stiff | Hitstop, input buffer, cancel windows and parry window are all data — tune without code |
| Scoring leaks into combat code | Scoring only listens to `EventBus`; combat never touches `RunState` |
| A data edit breaks C1 | The C1 test runs on the real `scoring_rules.tres`, and the validator repeats it (Phase 9) |

## Open questions

- Q3 (can knocked-down opponents be hit?), Q4 (氣 regeneration), Q5 (coins) from the plan.
