# 熱血物語:見家長 — Final Storyboard

**Status: FINAL — approved 2026-10-04.** Built from option B 「一九九四復仇戰」 (*The 1994 Rematch*)
with the suitcase change and the group-chat ending.

**Authority.** This storyboard is the content specification for production. On anything about
story, characters, dialogue, stage content, scoring or endings it **outranks `docs/PRD.md`** and the
archived original concept (`docs/_bak/story.md`). The PRD still governs combat feel, player stats and controls where this storyboard
says nothing. If something here contradicts itself, raise it rather than guess.

| File | Contents |
|---|---|
| `README.md` (this file) | Premise, cast, systems the story depends on, beat format, beat index, ending logic, story flags, decisions |
| [`00-title-prologue.md`](00-title-prologue.md) | Title, look select, prologue (16:30 – 17:10) |
| [`01-stage1-city.md`](01-stage1-city.md) | Stage 1 — City 「追」, boss: the Fruit Aunt |
| [`02-stage2-campus.md`](02-stage2-campus.md) | Stage 2 — Campus at night 「校園」, boss: the Lunch Lady |
| [`03-stage3-mountain.md`](03-stage3-mountain.md) | Stage 3 — Mountain road 「山路」, boss: 二叔 + the Straw-Hat Uncle |
| [`04-stage4-garage.md`](04-stage4-garage.md) | Stage 4 — The garage 「司機」, boss: the Driver; **the suitcase choice** |
| [`05-stage5-estate.md`](05-stage5-estate.md) | Stage 5 — The estate 「城堡」 and the dining room, final boss: 林建國 |
| [`06-reveal-endings.md`](06-reveal-endings.md) | The reveal, the form, endings E0–E3, game over, post-credits, the 1994 bonus stage |
| [`ledgers.md`](ledgers.md) | Clue ledger, setup/payoff ledger, draft content ids, music cues, art gaps |

The earlier drafts (`story-v2*`, `story-v3*`, `story-v4*`) are archived in `docs/_bak/storyboard-drafts/`.
Do not build from them.

---

## 1. Premise

### What he believes

His girlfriend 林小雨 is dragged into a black van after class. He is knocked down, his phone breaks,
and he chases the van alone across the city, through his university at night, up a private
mountain, into an underground garage and finally into a mansion. He has to get her back.

### What is actually happening

**The Lin family staged it.** The family is very wealthy. 小雨 has been kidnapped for real three
times (at 7, 11 and 14), and the family paid a lot to keep all three out of the news. So the family
rule is that any man who wants to marry her must prove he can protect her and give her a future.
They prove it by making him believe the danger is real. Every enemy is family or staff, and the
mansion is a house with dinner on the table at **19:00**.

**His own family is in on it too.**

- In **1994**, 外婆 (林媽媽's mother) staged the same test for her daughter 雅芳, who is now 林媽媽.
  Two young men ran it:
  - **林建國** scored **71**.
  - **陳志強**, the candidate's father, scored **70**. He lost the point at a fruit stall by
    smashing its melons. The stall belonged to the 林 family. 林建國's teenage sister 二姑 was
    minding it and has never forgotten.
- 林建國 married 雅芳. That same night, a caterer's daughter carried a plate of fruit out to the
  losing candidate. She is now the candidate's mother. That is how his parents met.
- Thirty-two years later the two families' children met at university by chance. When the parents
  worked out who was who, the dads agreed on **a rematch, through the son.** His mom asked to be a
  boss and his dad asked for a seat at the tea table. The two mothers have shared a group chat for
  eight months.

**小雨 knows everything.** He knows nothing, and **he never suspects, not for one frame**, not even
when the lunch lady shouts his full name.

### The family's two questions

> 「如果有一天真的出事了,你敢不敢站在她前面?」 *If something really happens one day, will you
> dare to stand in front of her?*
> 「往後的日子,你能不能給她一個未來?」 *And after that, can you give her a future?*

### Tone

Family comedy for teenagers, with heart. The jokes come from hospitality used as hostility and from
embarrassing parents. Under the jokes, a son finishes something his father lost by one point.

---

## 2. Cast

Ids are drafts until registry step A7 (see [`ledgers.md`](ledgers.md)). Art references live in
`docs/images/`, where **the filename is the character id**. Portraits are head-and-shoulders only.

| Id (draft) | Name | Who | Role | Art ref |
|---|---|---|---|---|
| `character_felix` / `_lucian` / `_hilman` | FELIX 菲利克斯 / LUCIAN 盧西安 / HILMAN 希爾曼 | **The candidate (the player).** One person; the player picks his look and fighting style | Hero | felix, lucian, hilman |
| `npc_cloris` | 林小雨 CLORIS | His girlfriend, 21. Knows everything | Taken in the prologue; at the table | rain |
| `boss_lin_jianguo` | 林建國 VINCENT | Her father, 54. Scored 71 in 1994 | **Final boss** | vincent |
| `boss_driver` | 林媽媽 沈雅芳 *(name placeholder)* | Her mother, 52. The girl taken in 1994 | **Stage 4 boss**, "the Driver" | none |
| `boss_fruit_aunt` | 二姑 | 林建國's sister, 47. Runs the family fruit stall. **Not briefed** | **Stage 1 boss** | none |
| `boss_lunch_lady` | 便當阿姨 = 媽媽 (王美華, placeholder) | **The candidate's mother**, 52, in a mask and hairnet | **Stage 2 boss** | none |
| `boss_ban` | 二叔 BAN | 林建國's brother. The tea uncle | **Stage 3 boss** (invulnerable) | none |
| `boss_straw_hat` | 草帽伯伯 = 爸爸 陳志強 (placeholder) | **The candidate's father**, 54, in a fake beard | **Stage 3 boss** (tag team) | none |
| `npc_ken` | 三叔 KEN | 林建國's brother. Traffic police, real | Points the way (S1) | none |
| `boss_howard` | 大表哥 林家豪 HOWARD | The cousin who went to Stanford | **Stage 5 mid-boss** | none |
| `npc_xiaole` | 小表弟 林小樂 | 9. Doing his homework | Stage 3 hazard | none |
| `npc_toddler` | 小表妹 | 3. Cannot be hurt; hits back | Stage 5 hazard; the shield moment | none |
| `npc_waigong_portrait` | 外婆 | Wrote the rule. Seen only in photos | Portrait in S5-02 | none |
| `enemy_men_in_black` | 黑衣人 ×3 | Lin staff. The van crew | Prologue; Stage 4 elite trio | none |

Ages and names marked *placeholder* can change. **Ids must not change once committed.**

---

## 3. Systems the story depends on

Numbers here are **starting tuning values**. They belong in data (`.tres`), never inline in code.

### 3.1 HUD: what is on screen and what is not

| On screen | Notes |
|---|---|
| Portrait of the chosen look | Top-left |
| **力 POWER**, green bar | Also health. Labelled 力 |
| **氣 SPIRIT** bar | Specials meter. Not scored |
| **錢 MONEY** counter | Coins. Labelled 錢 |
| **The clock** | Counts toward 19:00. **Never labelled, never explained** |
| Bare gold award pop `+2` / `+8` with a small seal icon | **No label, ever** (see 3.3) |

**Never on screen before beat R-07:** the character **勇**, the word "brave", any score breakdown,
any scoring page in pause or options, any tooltip about scoring. Internal identifiers may use
`brave` / `yong`. Player-facing strings may not.

### 3.2 The form: four lines, 100 points

| Line | Max | Shown during play? | How it is computed (at R-07) |
|---|---|---|---|
| **力 POWER** | 25 | Yes, the bar | `round(25 × mean(力% at each stage clear)) − 4 × game_overs`, min 0 |
| **錢 MONEY** | 15 | Yes, the counter | `clamp(round(15 × net_coins / MONEY_FULL), 0, 15)`; `net_coins` = collected − bills. `MONEY_FULL` ≈ 80% of all coins placed in the run |
| **時 TIME** | 20 | Yes, the clock | Clock at D-01: ≤ 19:00 → 20 · 19:01–19:09 → `20 − 2 × minutes_late` · ≥ 19:10 → 0 and **very late** |
| **勇 BRAVE** | 40 | **Never** | Sum of brave events, clamped to 0–40 at the end (3.3) |

**Pass mark: 70** (his father's score). **72 or more** beats both fathers. Ending logic is in §6.

### 3.3 勇: every way to earn or lose it

| Event id | Where | 勇 | Pop? |
|---|---|---|---|
| `brave_help_up` | Any defeated opponent, within the ten-second window | +2 each | yes |
| `brave_melon_spared` | S1 boss ends with the showpiece melon **and** the stall intact | +6 | yes, at S1-07 |
| `brave_walked_past_money` | S4-07: runs past the suitcase | +8 | yes, at the ramp top |
| `brave_toddler_shielded` | S5-03: stands between the tureen and the toddler | +8 | yes |
| `brave_cloris_shielded` | D-05: takes the flying dish meant for 小雨 | +8 | yes |
| `brave_never_hit_downed` | Whole run: zero `hit_downed` | +6 | no (appears only on the form) |
| `hit_downed` | Striking any dazed or downed opponent | −3 each | no pop, ever |
| `hit_toddler` | Striking the toddler (she just laughs) | −5 | no |

The set pieces total **36**, which is under the cap of 40 on purpose: a full column needs at least
two help-ups.

**Invariant C1, a masher cannot pass.** Estimated mashing run (smashes stalls, hits downed
opponents, never helps up, never shields, but runs past the suitcase): 力 ~20 + 錢 ~8 + 時 20 +
勇 ~0–8 ≈ **48–56**, under 70. If any tuning change lets a masher reach 70, the change is wrong.

### 3.4 The ten-second window and E

- A defeated opponent **does not disappear.** They sit down dazed, with stars circling that slow
  down over **10 s** (`HELP_UP_WINDOW = 600` frames). Then they get up and leave, waving.
- Standing beside them shows a bare **E** glyph. Pressing **E** helps them up: `brave_help_up`,
  they are added to the run's **roster**, and they say a thank-you line. **Rostered opponents refuse
  林建國's summon in D-04.**
- **E** is the context button: help up, accept tea, bow, pet a dog, pick up items. **Nothing ever
  says it matters.** It is the most important button in the game.
- **E is a trap exactly once:** the suitcase at S4-07.

### 3.5 The clock

- Starts at **17:10** when the player gains control in S1-01. Dinner is **19:00**.
- Rate: **1 game-minute = 15 real seconds** (`CLOCK_SECONDS_PER_MINUTE = 15`), only while the player
  has control. It **pauses during cutscenes, dialogue and the pause menu.**
- A full run at par takes about 110 game-minutes, which is about 27.5 minutes of play.

| Stage | Nominal window | Par (game-min) |
|---|---|---|
| 1 City | 17:10 – 17:35 | 25 |
| 2 Campus | 17:35 – 18:00 | 25 |
| 3 Mountain | 18:00 – 18:25 | 25 |
| 4 Garage | 18:25 – 18:40 | 15 |
| 5 Estate (to the dining-room door) | 18:40 – 19:00 | 20 |

The windows are guides only. The clock is one continuous clock, and a fast player reaches each
stage early.

### 3.6 Losing: game over and attempts

- When 力 reaches 0 he is never "dead". The screen fades and he **wakes somewhere safe, carried
  there** (G-01, one place per stage). A note in his mother's handwriting says 「休息一下,再去。」
- He restarts at the **start of the current section.** Each game over costs **5 game-minutes**.
- **3 attempts** per run (`ATTEMPTS = 3`). On the fourth knockout he is **carried to the dinner
  table asleep** (G-02). The final boss is skipped and the run counts as very late.

### 3.7 Money and bills

- Defeated opponents drop coins. He collects them by walking over them.
- **Breakable civilian props bill him.** The owner hands over a bill and the amount comes off the
  counter (the counter can't go below 0). Stage 1: market stalls. Stage 2: club booths. Stage 5:
  vases. Luxury cars in Stage 4 **cannot break**: hitting one only sets off its alarm.
- Opponents never "steal" money. Every coin he has came from the Lin family and their friends
  (R-07 note: 「這些是我們的錢。」).

### 3.8 Content rules (every beat is checked against these)

1. **No character is ever rude.** Hostility is expressed through hospitality: tea, food, questions,
   politeness.
2. **Nobody acknowledges that the fighting is strange.**
3. **The wealth is shown big, never said.** A private mountain, a garage of supercars, a suitcase
   of cash. Nobody says "rich" or names a price.
4. **Every opponent has a reason to like him.** They fight him anyway.
5. **The candidate never suspects.** Not once, not for a frame. The player may.
6. **Cartoon violence only.** Nobody bleeds, nobody is hurt, nobody stays down. Defeated people
   see stars, sit down and rub their heads. Playable by kids.

小雨 is the only character allowed to sound disappointed (late and greedy endings). She is not
staff, and she has been waiting.

---

## 4. Beat format

Every beat is one block with these fields. Fields that don't apply are omitted.

```text
### <BEAT-ID> — <title>
Type       cutscene | gameplay | boss | choice | ending
Clock      nominal clock time; "paused" for cutscenes
Location   level id · section · screens (1 screen = 480 world px wide)
On screen  what the player sees
Who        characters / enemy ids present
Gameplay   what the player does; win/lose conditions; numbers
Dialogue   table: string id | speaker | zh-TW | en
Camera     framing, locks, pans
Audio      music cue id · notable SFX
Scoring    勇 / 錢 / 時 / 力 effects; flags set
Clues      what is noticeable (the candidate never notices)
Variants   how the beat changes with flags
Becomes    event id(s) · level section · data objects
```

**Id conventions**

| Thing | Convention | Example |
|---|---|---|
| Beat | `P-03`, `S1-05`, `D-04`, `R-07`, `E0-02`, `X-03` | |
| Story event | `event_<beat lowercase, '-'→'_'>_<slug>` | `event_s1_05_fruit_aunt_intro` |
| Dialogue string | `dlg_<beat lowercase>_<nn>` | `dlg_s1_05_01` |
| Story flag | `flag_<name>` | `flag_took_money` |
| Music cue | `music_<name>` | `music_boss_family` |

Player-facing strings carry **Traditional Chinese and English.** `{name}` means the chosen look's
display name and `{fullname}` the shouted full name (§2, S2-06).

---

## 5. Beat index

| Part | Beats | File |
|---|---|---|
| Title / select | T-01 title · C-01 choose a look | 00 |
| Prologue | P-01 at home · P-02 after class · P-03 the van · P-04 knocked flat · P-05 the hair clip | 00 |
| Stage 1 City | S1-01 Market Row · S1-02 The junction · S1-03 Covered arcade · S1-04 Loading bay · S1-05 Fruit stall intro · S1-06 Fruit Aunt fight · S1-07 Outcome & exit | 01 |
| Stage 2 Campus | S2-01 Back gate · S2-02 Sports field · S2-03 Club street · S2-04 Library · S2-05 Cafeteria intro · S2-06 Lunch Lady fight · S2-07 Outcome & exit | 02 |
| Stage 3 Mountain | S3-01 Lower gate · S3-02 Dog run · S3-03 Pond path · S3-04 Stone steps · S3-05 Tea table intro · S3-06 Tea & chess fight · S3-07 The bow & exit | 03 |
| Stage 4 Garage | S4-01 Ramp down · S4-02 Showroom · S4-03 The three men · S4-04 The Driver intro · S4-05 Driver fight · S4-06 Escape & the suitcase · **S4-07 The choice** · S4-08 Up the ramp | 04 |
| Stage 5 Estate | S5-01 Courtyard · S5-02 Ancestral hall & Howard · S5-03 Kitchen & toddler · S5-04 Grand corridor · S5-05 The door | 05 |
| Dining room | D-01 Music stops · D-02 「我等你很久了」 · D-03 Phase 1 「面談」 · D-04 Summons · D-05 Phase 2 「站起來」 · D-06 「手放低!」 | 05 |
| Reveal | R-01 Nothing happens · R-02 小雨 · R-03 Everyone bows · R-04 The lunch lady · R-05 The straw hat · R-06 The Driver · R-07 The form · R-08 One point · R-09 How they met | 06 |
| Endings | E0 「一百萬」 (E0-01 – E0-08) · E1a / E1b 「下週日再來」 · E2 「重考」 · E3 「菜涼了」 | 06 |
| Other | G-01 wake up · G-02 carried to dinner · PC-01 「第2次」 · X-01 – X-06 bonus stage 「一九九四」 | 06 |

---

## 6. Ending logic

Evaluated after R-09. E0 is decided earlier, at S4-07.

```text
if flag_took_money:            E0  「一百萬」          (fires at S4-07; reveal never plays)
elif flag_very_late:           E3  「菜涼了」
elif total >= 72:              E1a 「你比我們兩個都強」 → unlocks X (1994 bonus)
elif total >= 70:              E1b 「平手」
else:                          E2  「重考」
post-credits PC-01 「第2次」 after E1a, E1b, E2
```

`flag_late` (19:01–19:09) does not change the ending. It changes the table state (D-01) and adds
late lines (see 06).

---

## 7. Story flags and variables

| Id | Type | Set at | Read at |
|---|---|---|---|
| `look` | felix / lucian / hilman | C-01 | All `{name}` strings; R-04 move name |
| `roster` | list of opponent instance ids | Every help-up | D-04 summon refusals; R-03 |
| `flag_melon_broken` | bool | S1-06 | S1-07, R-03, E1 fruit plate, R-08 |
| `stalls_broken` | int | S1 | S1-07 dialogue, 錢 bills |
| `flag_hit_mom` | bool | S2-06, hit while down | R-04 extra line |
| `flag_lunchbox_taken` | bool | S2-07 | E1 (lunchbox on the table) |
| `tea_cups` | 0–3 | S3-06 | S3-07, "heavy" status |
| `flag_dad_helped_up` | bool | S3-06 | R-05 extra line |
| `dogs_petted` | int | S3-02 | R-03 (a dog walks in) |
| `flag_driver_helped_up` | bool | S4-06 | R-06 extra line |
| `flag_took_money` | bool | S4-07 | E0 |
| `flag_toddler_shielded` | bool | S5-03 | R-03 |
| `flag_cloris_shielded` | bool | D-05 | R-02 variant |
| `hit_downed` | int | Anywhere | 勇, R-07 |
| `game_overs` | int | G-01 | 力, G-02 |
| `arrival_clock` | time | D-01 | 時, `flag_late`, `flag_very_late` |
| `flag_carried_in` | bool | G-02 | R-01 variant |
| `unlock_1994` | persistent bool | E1a | Title menu |
| `endings_seen` | persistent set | Each ending | Title gallery |

---

## 8. Decisions taken in this final

These were open in the drafts. Each one is decided here so production can start. Change any of
them by editing this table and the beats it points to.

| # | Decision | Where |
|---|---|---|
| F1 | 勇 is **hidden** until the form. Awards pop as a bare gold number with a seal, no label | §3 |
| F2 | Weights 力 25 · 錢 15 · 時 20 · 勇 40. **Pass mark 70**; 72+ beats both fathers | §3.2, §6 |
| F3 | **The suitcase replaces the offer.** Nobody offers money. It falls out of the fleeing van; taking it ends the run (E0) | S4-06, S4-07 |
| F4 | Dinner 19:00; clock 15 s per game-minute; late 19:01–19:09; very late ≥ 19:10 | §3.5 |
| F5 | 3 attempts; each game over costs 5 game-minutes; a fourth KO means he is carried to dinner (G-02) | §3.6 |
| F6 | 小雨 knows everything | §1 |
| F7 | The 1994 fruit stall was the 林 family's stall. 二姑 is 林建國's sister ("巧合" gag, R-08) | §1, R-08 |
| F8 | The good endings graft in the group chat: he is **added to 「林家相親相愛一家人」**. The greedy ending mirrors it: he is **removed from his own family's chat** | E1, E0 |
| F9 | Not in the final: v3's "Last Question", the old stinger, the "thirty years later" ending, three separate candidates | — |
| F10 | Names are placeholders: 林媽媽 沈雅芳; candidate's father 陳志強; mother 王美華; family name 陳 | §2 |
| F11 | Secret content: the playable bonus stage 「一九九四」, unlocked by E1a | 06 |
| F12 | Post-credits 「第2次」 (Visit #2) unlocks a harder mode | 06 |
