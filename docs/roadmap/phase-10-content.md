# Phase 10 — Content production

[← Phase 9](phase-09-validation.md) · [plan](../plan.md)

## Goal

The whole game: three stages, three candidates, the dining room, the reveal, the endings. Mostly
**data and assets**, built on Phases 1–9.

## Rule for this phase

§27: no large-scale content before the data architecture is stable. Each item below lists any
**system work** it needs. System work is done *first* in each block, as its own steps with tests,
and its schemas documented — never written into a level or character as a one-off.

If an item turns out to need a system not listed here, stop and add it as a step before
continuing.

**Each block is built from its storyboard file** (Phase 0A, `docs/storyboard/`): the beats are the
spec, and the clue and setup/payoff ledgers are checked when the block is done.

## Blocks, in order

### 10.1 Stage 1 complete — M6 milestone

PRD §6.1. Market Row (0–30%) → Covered Arcade (30–60%, rain) → Loading Bay (60–85%, ambush from
both sides) → Fruit Stall (85–100%).

- Full waves with all three enemy types; real Stage 1 art (wet neon, grey concrete).
- Weapons: 水果 fruit, 折凳 folding chair, 筷子 chopsticks (data only — `WeaponData` exists).
- **Playtest round 1**: the ten-second window length, help-up cost, 禮 balance, the masher band.
  Tune data only.
- Registries for Stage 1 complete.

### 10.2 The other two candidates

PRD §3. Candidate select with three portraits and stat bars.

| Candidate | Specials | System work |
|---|---|---|
| LUCIAN | 迴避突進 Dash Strike · 空中連踢 Aerial Barrage · 分身 Shadow Clone | **Afterimage clones** that repeat attacks for 5 s → a `SpawnClone` action |
| HILMAN | 摔技 Power Slam · 震地拳 Earthquake Punch · 拚了 Berserker | Area shockwave hitbox; Berserker uses the status effect type from Phase 4 |

On replay, each portrait shows that candidate's last grade (save data).

### 10.3 Stage 2 — 森林「山路」, the mountain road

PRD §6.2. Lower Gate → Pond Path → Stone Steps (vertical) → Tea Pavilion. Dusk palette.

| Content | System work |
|---|---|
| 園丁 Groundskeeper · 看門狗 Guard Dog (low, can't be thrown) · 表弟 Young Cousin (throws stationery) · 保全 Estate Security (guards, parries — punishes mashing) | None — data |
| Koi pond (heavy 力 loss) · motion-sensor lights that stagger and come on **ahead** of him · hedge maze | Hazard types: `water`, `light_trigger`; maze = level sections with wrong-turn branches |
| Clues: 林 on every uniform, collared dogs, opponents helping each other up | Art + barks + an AI "help ally up" behaviour |
| **Boss 二叔 BAN** — can't be beaten by fighting; at 0 HP he pours another cup and is fully restored; three cup offers (E accepts: refills 氣, adds stacking heaviness; refusing: −8 力); after the third, **bow (E)** and he steps aside; joins and teaches 鐵山靠 | Boss rule "restore at 0"; **offer** interactions on a timer; a **bow** context action with a timing window (reused by 林建國) |

### 10.4 Stage 3 — 城堡「城堡」, the estate

PRD §6.3. Front Courtyard → Ancestral Hall → Kitchen → Dining Room door. Warm lamplight, lacquer
red, gold.

| Content | System work |
|---|---|
| 阿姨 Aunt (asks about grades mid-combo) · 廚房阿姨 Kitchen Staff (can't be grabbed) · 史丹佛表哥 Stanford Cousin (parries, mentions Stanford twice) | None — data + barks |
| 小表妹 Toddler — **can't be attacked**, hits for 5; trying to hit her = penalty and a gasp from the whole room | `can_be_attacked = false` + an "attempted strike" signal → −禮, room reaction event |
| Soup tureen (must not be knocked over) · kitchen range · portrait hallway (breaks if someone is thrown into it) | Prop data |
| Clues: catering vans, seating chart, warming trays, piano tuning, a banner | Background art + props |
| Section 4: three waves — aunts, cousins, everyone | Wave data |

### 10.5 The dining room — 林建國

PRD §7. **The largest system block in Phase 10.**

| Content | System work |
|---|---|
| A **circular arena** around a round table; he never leaves his seat in Phase 1; the candidate circles him | Arena shape other than a straight strip: movement and camera on a ring around the table |
| The lazy Susan rotating as a moving hazard; in Phase 2 it becomes an attack | Rotating hazard prop |
| The family keeps eating; dishes passed around the fight; an aunt asks someone to move | Background actor animation, ambient barks |
| Phase 1 moves: 公筷, 筷子, 「你幾歲?」, 「有房子嗎?」(guard-breaking) | Data |
| 「吃飽了嗎?」 — unblockable grab: +40 力, **−30 禮** | Unblockable grab action |
| **Summon** every 20 s: two relatives — **anyone on the roster refuses to come** | Summon action that checks `RunState` roster |
| Phase 2 at 40%: he stands; music drops out to one drum; the family puts down their chopsticks | Boss phase transition event |
| 掃堂腿 sweep · 夾菜 eight-hit chain that fills his bowl · 轉盤 · 一句話 (must be **parried**, not blocked) | Data; "parry-only" flag on a hitbox |
| **Timed bow (E)** staggers him 3 s — the only reliable Phase 2 opening | The bow action from 10.3 |

### 10.6 The reveal, stinger, endings

PRD §8, story.md. Built entirely from events, dialogue and the evaluation form.

- The six reveal beats with their pacing: 「你來得好慢。」; everyone he fought files in and bows
  (needs the run's list of defeated opponents); the fruit shop owner sits down; the form; 林建國
  (1994) — 71; the file pages with the two photos.
- Stinger: real kidnappers, the family wins in four seconds, 「那個是真的。」
- **Arrival tiers** from the clock (Q1, Q2): on time / late / very late, each with its own dinner
  state and lines (story.md, *If he is late*). Not scored.
- Ending: cut fruit — **the melon, if it survived**; 「你被批准了。下週日再來。」
- Post-credits: 「第2次」 — visit two, harder (a difficulty modifier on a second loop).

### 10.7 Polish and the rest of the PRD

- Difficulty: easy / normal / hard (enemy HP, damage, attempts, leaderboard multiplier) — data.
- All items (PRD §9): 茶, 熱毛巾, 名片, 好茶葉; all weapons: 托盤, 大魚, 轉盤.
- Real art for everything (River City Girls reference, 32×48 chibi sprites), replacing
  placeholders through `AnimationSet` only.
- Music and SFX (Q6), including the 林建國 Phase 2 single drum and the 「那個是真的。」 sting.
- **Playtest round 2**: full runs; PRD §16 checks — 15–25 min sessions, candidates feel distinct,
  testers suspect in Stage 2 but can't confirm, the reveal reads as a surprise, helping someone up
  feels like a real cost, 二叔 teaches without a tutorial.

### 10.8 Platform and backend

- Touch controls: left virtual d-pad, right A/B/C plus a large context button, minimum 60×60 px,
  auto-face nearest enemy — mapped onto the Phase 0 input actions.
- Web build: size, load time, phone performance.
- **Leaderboard (D6)**: if it comes back — three-letter names, boards per candidate, the father's
  71 pinned, server-side recomputation of the grade, the run-token time floor. The old Fastify +
  SQLite design is in git history at `c601701` for reference.

## Done when

Every box in PRD §16 is ticked, C1–C6 hold, and the validator is clean.
