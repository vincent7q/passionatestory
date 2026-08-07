# PRD: 熱血物語:見家長 — *Meeting the Parents*

**Narrative authority is `docs/story.md`.** This document covers mechanics, content rosters, and
technical requirements. Where the two disagree about story, story.md wins.

---

## 1. Overview

| | |
|---|---|
| **Title** | 熱血物語:見家長 |
| **Genre** | Side-scrolling beat 'em up with light RPG progression |
| **Platform** | HTML5 browser, desktop + mobile |
| **Display** | 480×270 internal, integer-upscaled to fit (typically 960×540) |
| **Art style** | Modern-retro pixel art. Reference is **River City Girls (2019)**, not the NES original |
| **Rating target** | Family. Cartoon violence only; nobody bleeds, nobody is hurt |
| **Session** | 15–25 minutes |
| **Players** | Single-player |

### 1.1 The structure

The player spends twenty minutes in a desperate rescue and then discovers it was a job interview.

**What the candidate believes:** 林小雨 has been abducted by three men in a black van. He chases them
across the city, up a mountain, and into a fortified estate to get her back.

**What is happening:** every opponent is on the Lin family payroll. The estate is a house. There is
a dinner going cold on the table. The family stages this for every candidate, because 小雨 has
survived three real kidnappings and they need to know who a man is when he believes the stakes are
real.

He is not rescuing her. He is meeting her parents.

### 1.2 The rule everything hangs on

**Every fight can be won by pure violence, and doing so scores badly.** The game measures restraint,
never explains that it is doing so, and reveals the metric only on the evaluation form at the end.

If a mashing player can top the leaderboard, the design has failed.

---

## 2. Narrative Flow

| Beat | Content |
|---|---|
| **Title** | 熱血物語:見家長. A quiet street at dusk. |
| **Prologue** | After class with 小雨. A black van. Three men. He is knocked flat. The van is gone. |
| **Candidate select** | Three portraits and stat bars. *(On replay, each portrait carries its final grade.)* |
| **Stage 1** | 城市「追」 — 17:20. The chase. |
| **Stage 2** | 森林「山路」 — 17:45. The mountain road. |
| **Stage 3** | 城堡「城堡」 — 18:00. The estate. |
| **Dining room** | The door comes down. It is a dinner, mid-meal. He misreads it and attacks. |
| **Final boss** | 奶奶 Cloris, two phases, while the family keeps eating. |
| **The reveal** | Six escalating beats. See §8. |
| **Stinger** | Real kidnappers. He can no longer tell. 「那個是真的。」 |
| **Ending** | Cut fruit. 「你被批准了。下週日再來。」 |
| **Post-credits** | 「第2次」 — visit two. Harder. |

**Game over** is not death. 力 hits zero, he wakes somewhere safe having been carried there, and is
told he can try again. Three attempts per evening.

---

## 3. Playable Characters

All three love her. All three ran the same course tonight, an hour apart. None knows the others
exist.

Stat values are unchanged from the original design.

### FELIX 菲利克斯 — 21, *Balanced*
Sincere to a fault, least perceptive man alive. His instinct is simply to be a good person, which is
a catastrophic combat strategy and an outstanding score on the axis he cannot see.

- 力 100 · 氣 80 · Speed ★★★★☆ · Power ★★★☆☆ · Guard ★★★☆☆
- **連環拳 Rapid Punch** (10 氣) — 5-hit flurry, ends in knockdown
- **旋風腿 Tornado Kick** (20 氣) — spinning kick, hits both sides
- **熱血 Burning Spirit** (30 氣) — +attack for 10s

### LUCIAN 盧西安 — 22, *Speed*
Fast, evasive, allergic to a direct answer. Filmed part of the chase on his phone, which he will
regret.

- 力 80 · 氣 100 · Speed ★★★★★ · Power ★★☆☆☆ · Guard ★★☆☆☆
- **迴避突進 Dash Strike** (10 氣) — lunging punch, closes distance
- **空中連踢 Aerial Barrage** (25 氣) — jump into rapid mid-air kicks
- **分身 Shadow Clone** (40 氣) — two afterimages attack for 5s

### VINCENT 文森特 — 27, *Power*
The adult. Treats the rescue as a professional operation — brings equipment, draws a map, works the
problem.

The only candidate who ever suspected. Wrote *"this feels staged"* in his notebook on the mountain
and talked himself out of it. They searched his bag at the door; the note is in the file.

- 力 140 · 氣 60 · Speed ★★☆☆☆ · Power ★★★★★ · Guard ★★★★☆
- **摔技 Power Slam** (15 氣) — grab and slam, area damage
- **震地拳 Earthquake Punch** (25 氣) — shockwave knocks down everything nearby
- **拚了 Berserker** (50 氣) — invincible, 2× damage, 8s, drains 力

### 3.1 Progression

Level caps at 20. +5 力, +3 氣 per point. Earned from defeating opponents **and from restraint
actions**, which award more. New techniques come from opponents who switch sides (§5.3), not from a
shop.

---

## 4. Controls

| Key | Action |
|---|---|
| ← → | Move |
| ↑ ↓ | Move in depth |
| Space | Jump |
| Z | Light attack |
| X | Heavy attack |
| C | Special (costs 氣) |
| Shift (hold) | Guard — parry on the frame of impact |
| **E** | Context action — help up, accept, bow, pick up |
| Q | Call an ally |
| Enter | Pause |

**E is the most important button in the game and nothing ever says so.** It is context-sensitive and
surfaces a small prompt; it never explains why you'd want to. Players who never press it finish in
the 50s.

**Touch:** left virtual d-pad; right A/B/C plus a large context button. Minimum 60×60px. Auto-face
nearest enemy.

---

## 5. Combat System

Follows the Kunio-kun / River City line.

- **Chains** — light strings into heavy; heavy finishers knock down
- **Juggling** — launch, then keep airborne with light attacks
- **Grabs** — walk into a stunned enemy to grab, then strike or throw them into another
- **Weapons** — light picks up off the ground, heavy throws. Limited uses, then they break
- **Guard and parry** — hold to halve damage; parry on the impact frame staggers the attacker
- **Knockdown** — flash white, fall, get up with ~1s invincibility

### 5.1 The ten-second window

**The mechanic the game is built around.**

A defeated opponent sits down dazed, stars orbiting their head. After **10 seconds** they get up on
their own, dust themselves off, and walk off screen permanently.

During that window, pressing **E** beside them helps them up.

- Stars visibly slow as the timer runs out — that is the countdown
- The window is one tuning constant. 10s is a guess; it may want to be 8 or 12
- **Attacking a dazed or downed opponent is the single heaviest penalty in the game**

The tension is deliberate: breaking off an active fight to help someone up is risky, costs you time
you believe you do not have, and is always correct.

### 5.2 The three criteria — two on screen, one hidden

The family scores a husband on the two things every family scores a husband on, plus one they don't
advertise. **The first two are the HUD.** They are not disguised, renamed, or hidden — they sit in
the corner of the screen for the whole game and nobody wonders why a *rescue* has a power bar and a
money counter, because that is what games look like.

**力 POWER (0–40) — visible.** The green bar. Doubles as health: getting beaten reduces your power,
which is both mechanically ordinary and exactly how the family sees it. Scored on combat performance
— damage, longest combo, section clear speed, boss time, and 力 remaining at the end.

**錢 MONEY (0–20) — visible.** The counter. Scored on total collected.

*Every coin dropped off a man on the Lin payroll. It was always their money. Grandma's note on this
line reads 「這些是我們的錢。」*

**禮 JUDGMENT (0–40, clamped) — never named, never explained, never totalled on screen:**

| Action | 禮 |
|---|---|
| Help a defeated opponent up | +3 each |
| Spare the fruit stall (stage 1 boss) | +8 |
| Accept all three cups from Second Uncle | +8 |
| Bow to Grandma on the correct beat | +6 |
| Never strike a dazed or downed opponent | +5 |
| Never strike the toddler | +4 |
| Reach the estate without destroying the market stalls | +6 |
| **Reach the dining room before 18:00** | up to +8, scaling with margin |
| Strike a downed opponent | **−4 each** |

Punctuality lives inside 禮 rather than standing alone, because being on time *is* a courtesy — and
it means the clock, the most prominent element on screen, is secretly feeding the hidden column.

Awards deliberately over-supply the 40 cap, so a mercy run, a restraint run, and a
perfect-set-pieces run each reach a full score by different routes. Clamp to `[0, 40]`.

### Grade = 力 + 錢 + 禮, out of 100

**力 and 錢 are worth 60 between them and a determined player maxes both.** A pure masher lands
around 56–60 and cannot reach 71. Beating 林建國 requires the column he cannot see.

> 「力氣跟錢,誰都有。我看的是別的。」
> *(Strength and money — anyone has those. I was looking at something else.)*

**On-screen presentation during play:** a 禮 award pops as a gold **`+3`** with a small seal icon and
*no label*. The character 禮 must not appear in the HUD, the pause menu, a tooltip, or a tutorial.
Its first appearance in the entire game is on the evaluation form.

### 5.3 Switching sides

Help a defeated opponent up and they stop fighting you — and start fighting for you.

The candidate reads this as a classic beat-'em-up beat: show a man respect and he joins you. The
truth is that they are staff who were briefed to respond well to decency, and they were never on a
side.

- **Every opponent you help up is recorded permanently for the run.** This roster is what Grandma's
  summon checks against in §7
- **One** is equipped as an active ally at a time, callable once per fight (Q). Swap at checkpoints;
  this changes who fights beside you, never who is on the roster
- Each new ally teaches a technique between stages, permanently

---

## 6. Stage Design

Shared structure: auto-advancing sections, scripted spawn waves, a mid-section hazard, a boss arena.
Parallax is `layer.x = -camera.x * factor`.

### 6.1 Stage 1 — 城市「追」 / *The Chase*

**17:20. Commercial district, rush hour. Rain from 40%.** The van is pulling away and he is on foot.

**Layers:** tower blocks (0.2×) · shopfronts and signage (0.5×) · pavement, crates, scooters (1.0×) ·
foreground awnings (1.2×)

**Sections:** Market Row (0–30%) → Covered Arcade (30–60%, rain) → Loading Bay (60–85%, ambush both
sides) → Fruit Stall (85–100%)

**Hazard — rain.** Outside cover, 力 bleeds 1/sec. A 手帕 pickup or an awning stops it.

**Environmental 禮 test:** the market stalls are breakable and there are a lot of them. Nothing tells
the player not to smash them. Reaching the boss with the row intact is worth +6.

| Enemy | HP | Behaviour |
|---|---|---|
| 上班族 Office Worker | 30 | Commuter. Swings a briefcase. Slow. Says 「不好意思」 while swinging |
| 代購黃牛 Scalper | 35 | Ranged — throws fruit. Retreats when closed on |
| 外送員 Delivery Rider | 40 | Fast, hit-and-run. *Is the man who delivers the candidate's food every week* |

**Boss — 水果店老闆娘 (Fruit Shop Owner), 300 HP**

**She is not part of the test.** She is a real woman with a real stall and a lunatic is sprinting
through it. He thinks she's with them. She isn't.

- Fights with the melon — overhead swings, a rolling bowl, a two-handed shove
- **The melon has its own 40 HP** and any connecting hit damages it
- Damaging it: instant 力 loss and forfeits +8
- Destroying it: she sits down in the wreckage of her stall. No penalty is stated. The file records it
- Beat her without touching it and she points up the road — the direction the van went

Maximum time pressure, and the correct play is care with a stranger's property. The sharpest 禮 test
in the game, eleven minutes before he knows there is one.

### 6.2 Stage 2 — 森林「山路」 / *The Mountain Road*

**17:45. Dusk.** One private road, three kilometres, up a mountain.

**Layers:** ridgeline and moon (0.2×) · pines (0.4×) · gravel, stone lanterns, koi pond (0.8×) ·
foreground ferns (1.2×)

**Sections:** Lower Gate (0–25%) → Pond Path (25–50%) → Stone Steps (50–75%, vertical) → Tea
Pavilion (75–100%)

**Hazards:** the koi pond (heavy 力 loss) · motion-sensor garden lights that stagger, and which
come on *ahead* of him · a hedge maze where wrong turns cost time, and time is feeding 禮

**Clues at this stage should be absurd and unmissable:** every uniform carries a small 林 on the
chest. The dogs wear collars and are well fed. Opponents help each other up.

| Enemy | HP | Behaviour |
|---|---|---|
| 園丁 Groundskeeper | 45 | Hedge shears, wide sweeps. Apologises |
| 看門狗 Guard Dog | 25 | Fast, low, hard to hit. Cannot be thrown. Wearing a collar |
| 表弟 Young Cousin | 35 | Ranged. Throws stationery without looking up from his homework |
| 保全 Estate Security | 80 | Guards, parries, waits. The first enemy that punishes mashing |

**Boss — 二叔 (Second Uncle), 500 HP**

An enormous beaming man sitting in the middle of the road behind a folding table with a full tea
service laid out.

- **He cannot be beaten by fighting.** Reduce him to zero and he pours another cup and stands back
  up, fully restored
- Three times he offers a cup. **E** accepts
- Accepting: restores 氣 fully, adds cumulative **heaviness** — slower movement, shorter jumps,
  longer recovery
- Refusing or ignoring the prompt: −8 力
- After the third cup, at his slowest, **bow (E)**. He steps aside beaming and tells the candidate
  he's a good kid
- Joins automatically and teaches **鐵山靠**, a shoulder charge

This is where the player works it out. A kidnapper does not do this. The candidate takes it as a
bizarre obstacle and keeps running.

### 6.3 Stage 3 — 城堡「城堡」 / *The Castle*

**18:00.** He is certain this is where they are keeping her.

**Layers:** storm sky through clerestory windows (0.1×) · courtyard and helipad (0.3×) · timber
columns, ancestral portraits (0.6×) · furniture (1.0×)

**Sections:** Front Courtyard (0–20%) → Ancestral Hall (20–45%) → Kitchen (45–70%) → Dining Room
(70–100%)

**The clues are now screamed at him:** catering vans in the courtyard. A seating chart on an easel.
Warming trays. Someone tuning a piano. A banner going up that is not a threat. He is looking for a
dungeon.

**Hazards:** a soup tureen that must not be knocked over · the kitchen range · a hallway of framed
portraits that break if you throw someone into them

| Enemy | HP | Behaviour |
|---|---|---|
| 阿姨 Aunt | 60 | Serving spoon. Asks about his grades mid-combo. Relentless, never hostile |
| 廚房阿姨 Kitchen Staff | 120 | Wok. Slow, enormous damage, cannot be grabbed |
| 史丹佛表哥 Stanford Cousin | 70 | Technically excellent. Parries. Mentions Stanford. Twice |
| 小表妹 Toddler | — | **Cannot be attacked.** Hits for 5. Attacking her is a heavy penalty and an audible gasp from the whole room |

**Section 4:** three waves before the dining room — aunts, then cousins, then everyone at once.

---

## 7. The Dining Room & Final Boss

He kicks the door down mid-roll, braced for the boss. The music stops.

A long table, set for eight, mid-meal. Everyone turns to look at him. 小雨 is at the table with a
bowl in front of her, on her phone, not restrained and mildly annoyed that he's late.

A very small ninety-one-year-old woman puts down her chopsticks:

**「我等你很久了。」** *(I have been waiting a long time for you.)*

A villain's line and a host's line. He has already decided which. He attacks.

### 奶奶 CLORIS 克洛麗絲 — 1000 HP (600 / 400)

**Arena:** circular, around the round table. She sits at the centre. The lazy Susan rotates
continuously as a moving hazard. He circles her for the entire fight and cannot leave.

**The family keeps eating.** Dishes are passed around the fight. An aunt asks someone to move so she
can reach the fish. Nobody is alarmed — nobody here is in danger — and the candidate reads their calm
as professional arrogance.

**Phase 1 —「面談」(100%–40%).** She does not stand.

| Move | Effect |
|---|---|
| 拐杖 Walking Stick | 3-hit reaching combo, deceptive range |
| 筷子 Chopsticks | Precise ranged pokes, interrupts combos |
| 「你幾歲?」 | Ranged pressure, 15 damage |
| 「有房子嗎?」 | Screen-wide, guard-breaking, 25 damage |
| 「吃飽了嗎?」 | **Unblockable grab.** Force-feeds him: restores 40 力, removes 30 hidden 禮 |
| 召集 Summon | Every 20s, calls two relatives — **anyone he helped up refuses to come** |

That last row is the payoff for every ten-second decision he made. A candidate with a full roster
fights Phase 1 almost alone.

**Phase 2 —「站起來」(40%–0%).** She stands for the first time. The music drops out entirely. The rest
of the family quietly puts down their chopsticks to watch.

| Move | Effect |
|---|---|
| 掃堂腿 Sweep | Low, fast, must be jumped |
| 連環拐 Cane Rush | Eight-hit advancing chain across the arena |
| 轉盤 Lazy Susan | She spins the table to full speed — the hazard becomes an attack |
| 一句話 One Word | Charges 2s, then one line removing 40 力. Must be parried, not blocked |

**Weakness:** a timed bow (**E**) staggers her 3 seconds and is the only reliable Phase 2 opening.

---

## 8. The Reveal

Spec'd as a scripted sequence. Pacing matters more than content — each beat must land before the
next begins.

| # | Beat |
|---|---|
| 1 | He wins. Nothing happens next. Nobody runs, nobody calls for help. Hold on this. |
| 2 | 小雨 puts her phone down: 「你來得好慢。」 *(You took ages.)* |
| 3 | Everyone he defeated tonight files in behind him, dusts themselves off, lines up, and **bows** — the three from the van, the fruit shop owner, Second Uncle still holding the tea set |
| 4 | Grandma slides a form across the table. His name on it. Mostly already filled in |
| 5 | **Two columns.** He recognises the first. He has never seen the second. It is 禮, and it has all the weight in it |
| 6 | The man beside Grandma is 小雨's father. **71**, in 1994. He has been at this table all evening. He shrugs |
| 7 | Grandma turns the page. The file does not start tonight — it starts the day they met. Photos, dated, annotated. The delivery rider from stage 1 waves |

**File entries shown in beat 7** — two, no more:

> **PHOTO** — a café, two years ago
> 「他先付錢。」 *(He paid first.)*
>
> **PHOTO** — a street, last spring, helping a stranger with a dropped bag
> 「他以為沒人看到。」 *(He thought no one was watching.)*

### 8.1 The evaluation form

The score screen, in Grandma's handwriting. **The first two lines are the HUD he has been staring at
all night.** They animate in first, and they are good. He should have a second to feel pleased.

Then the third line writes itself in, and it is worth more than either.

```
              林家 配偶評估表
              候選人:菲利克斯

        力   POWER          38 / 40
        錢   MONEY          19 / 20   「這些是我們的錢。」
        ──────────────────────────
        禮   JUDGMENT       12 / 40   ← 他沒看到這一欄
        ──────────────────────────
        總分                 69 / 100

        林建國 (1994)        71
```

**Pace it in that order.** 力 and 錢 land as a victory. 禮 lands as the floor going out. The
父親's 71 sits underneath, two points above, and does not need a comment.

Grandma, as it resolves: 「力氣跟錢,誰都有。我看的是別的。」

### 8.2 Stinger

Three men in black kick the door in. Real ones.

He does not move. He has just learned nothing tonight was real and he is not going to be made a fool
of twice.

The family destroys all three in about four seconds without leaving the table. An aunt does it
one-handed while asking whether anyone wants more soup. 小雨 does not look up.

Grandma writes something on the form. **「那個是真的。」** *(That one was real.)*

---

## 9. Items & Weapons

| Item | Effect |
|---|---|
| 錢 Money | Currency. Drops from defeated opponents |
| 茶 Tea | +30 氣, brief heaviness |
| 點心 Snack | +20 力 |
| 熱毛巾 Hot Towel | +50 力. Rare |
| 手帕 Handkerchief | Cancels the stage 1 rain debuff |
| 名片 Business Card | +30% 力 scoring for 30s |
| 好茶葉 Good Tea Leaves | +30% guard for 30s |

**Weapons** — light to pick up, heavy to throw:

| Weapon | Uses | Note |
|---|---|---|
| 水果 Fruit | 1 | Thrown projectile |
| 筷子 Chopsticks | 3 | Fast, low damage, pierces |
| 折凳 Folding Chair | 3 | High knockback. The classic |
| 托盤 Serving Tray | 2 | Wide arc, hits multiple |
| 大魚 Large Fish | 4 | Slow, enormous, extremely funny |
| 轉盤 Lazy Susan | 1 | Stage 3 only. Hits the entire table |

---

## 10. HUD & UI

Match `docs/1.jpg` and `docs/2.jpg`. **Nothing here is disguised — this is the evaluation, live, and
it pays off in §8.1.**

```
┌──────────────────────────────────────────────────────────────────────┐
│ [EXP] [Portrait]  力  ████████░░ 120/150      17:42        錢 1,000   │
│  ▮       Lv.9      氣 ██████░░░░  60/100                              │
└──────────────────────────────────────────────────────────────────────┘
```

- Vertical EXP bar far left, portrait beside it, `Lv.N` beneath
- **力** green bar with numeric current/max — this is both health and criterion one
- **氣** orange bar below it — a resource, not a criterion
- Centre: **the clock, counting toward 18:00.** Every player reads it as a rescue timer. It is when
  dinner is served, and it is quietly scoring into 禮
- Right: **錢** with coin icon — criterion two
- Bottom-left when applicable: ally portrait + Q prompt
- Above a dazed opponent: orbiting stars that visibly slow across the 10s window, plus an **E** prompt

**Damage numbers:** white on hit, yellow and larger on critical, green with `+` on heal.
**Restraint awards:** gold `+3` with a small seal icon and **no label**. The character 禮 appears
nowhere before the evaluation form.

**Dialogue box:** bottom, semi-transparent, 120px. Name in a coloured tab at left, typewriter text,
blinking arrow on wait.

**Pause:** Resume · Restart Section · Controls · Quit. **No scoring explanation anywhere.**

---

## 11. Art & Audio

**Reference is River City Girls (2019)** — chunky modern pixel art, thick outlines, saturated colour,
expressive oversized faces. Not NES-authentic.

- Sprites 32×48 base, chibi proportions, head ≈ ½ body height
- Animation: idle 2 · walk 4 · light 3 · heavy 3 · jump 2 · hurt 1 · knockdown 2 · dazed loop 4 ·
  special 4–6
- Palettes: Stage 1 wet neon and grey concrete · Stage 2 deep green, lantern amber, moonlit blue ·
  Stage 3 warm lamplight, lacquer red, gold
- Effects: white star hit sparks · orbiting stars on dazed opponents · gold seal popups · 3–5px
  screen shake on heavies

**No asset files exist.** All sprites are generated procedurally at boot from a parameterised chibi
rig; audio synthesized via Web Audio. Everything sits behind `game/js/assets.js` so real spritesheets
can replace it without touching game logic.

**Music:** title · stage 1 (urgent city funk) · stage 2 (sparse, guqin over drums) · stage 3 (strings,
tense) · boss (driving) · **Grandma phase 2 (everything drops out but a single drum)** · the reveal
(warm, and it should hurt a little) · 「那個是真的。」 (one sting).

---

## 12. Technical Architecture

- **Engine:** none. Vanilla ES modules, Canvas 2D, no build step
- **Loop:** fixed 1/60s timestep with accumulator and clamp; render once per frame. Never scale
  gameplay by variable `dt`
- **Coordinates:** 2.5D — `x` horizontal, `y` depth, `z` jump height. Screen position is
  `(x - camera.x, y - z)`. Draw sorted by `y` ascending. Hits require `(x,y)` AABB overlap **and**
  `z` range overlap
- **Camera:** follows with lookahead, lerped, clamped to section bounds
- **Entities:** flat array, object pools for particles and projectiles, cap ~50 on screen. The 10s
  despawn is load-bearing for this cap
- **AI:** state machines — `IDLE → CHASE → ATTACK → RECOVER → STUN → DAZED → DESPAWN`, with
  `DAZED → ALLIED` as the branch
- **Save:** stage-start checkpoint in localStorage; run records go to the server

See `CLAUDE.md` for the `shared/` contract and rendering details.

---

## 13. Difficulty & Scoring

| Difficulty | Enemy HP | Your damage | Attempts | Multiplier |
|---|---|---|---|---|
| Easy | −30% | +20% | 5 | 0.75× |
| Normal | baseline | baseline | 3 | 1.00× |
| Hard | +50% | −20% | 1 | 1.35× |

**Displayed grade** is 力 + 錢 + 禮 out of 100, presented as §8.1.

**Leaderboard value** is `grade × difficulty multiplier`, so a flawless Hard run scores 135 and
Grandma has to start a second form.

林建國's **71** was scored on Normal in 1994 and sits permanently on the board.

---

## 14. Backend & Leaderboard

Single Node/Fastify process serves game, dashboard, and `/api/*`. SQLite via `better-sqlite3`, WAL
mode, file on a mounted volume. One container — never replicate.

- `POST /api/runs/start` — issues a signed token carrying a server timestamp
- `POST /api/runs` — verifies, bounds-checks, **recomputes the grade server-side**, returns rank
- `GET /api/leaderboard` — filterable by difficulty and candidate
- `GET /api/stats` — completion rate, candidate picks, median grade, **average 禮**
- `GET /healthz`

**Three boards, one per candidate.** Candidate filters, difficulty multiplies.

Identity is three arcade initials, `/^[A-Z_]{3}$/`. No accounts, no personal data.

**Integrity:** the client must sign its own submission, so the key ships in the client bundle and a
determined person can forge one. The check with teeth is the run token's wall-clock floor — a run
claiming fifteen minutes that started thirty seconds ago is rejected, and that cannot be backdated.
Do not describe the leaderboard as tamper-proof.

**Watch average 禮 across all runs.** If it trends toward zero, the central premise isn't landing and
the restraint rewards need raising or better signposting.

---

## 15. File Structure

```
CLAUDE.md  README.md  Dockerfile  docker-compose.yml  package.json
docs/         story.md, PRD.md, idea.md, 1.jpg, 2.jpg
shared/       characters.js, scoring.js, validation.js   ← imported by BOTH sides
game/
  index.html  css/style.css
  js/  main.js renderer.js input.js assets.js physics.js camera.js net.js utils.js
       entities/  player.js enemy.js boss.js item.js projectile.js ally.js
       stages/    stage.js city.js forest.js castle.js
       ui/        hud.js menu.js dialog.js nameEntry.js evaluation.js reveal.js
server/       index.js db.js routes/ migrations/
dashboard/    index.html dashboard.js
test/
```

---

## 16. Success Criteria

- [ ] Stable 60 FPS in Chrome and Firefox
- [ ] Full playthrough in 15–25 minutes
- [ ] All three candidates play distinctly
- [ ] **A mashing player cannot beat 71.** The single most important criterion
- [ ] **The character 禮 does not appear on screen before the evaluation form.** Verify by playthrough
- [ ] Playtesters suspect something is wrong during stage 2 — but cannot confirm it
- [ ] The reveal reads as a surprise, not a cheat: testers who are told the twist can point to clues
      they saw and dismissed
- [ ] Helping someone up feels like a real cost in the moment
- [ ] Second Uncle teaches the restraint lesson without a text tutorial
- [ ] Records survive `docker compose down && up`
- [ ] A forged `curl` submission is rejected
- [ ] Touch controls playable on a phone
- [ ] Nothing in the game would be inappropriate for a child

---

## 17. Implementation Notes

- **Build stage 1 completely before starting stage 2.** The hidden 禮 system, the ten-second window,
  side-switching, and the evaluation screen all need proving end to end on a small surface first.
- Tuning constants — 力 values, 禮 awards, the despawn window, difficulty multipliers — belong in
  `shared/` or stage data, never inline. All will be revised after playtesting.
- Boss AI: state machines, `IDLE → CHASE → ATTACK → RECOVER → STUN`.
- Object-pool particles and projectiles from the start; retrofitting is painful.
- Write every line of enemy dialogue against the six content rules in `docs/story.md`. The candidate
  never suspects — not once, not for a frame.
