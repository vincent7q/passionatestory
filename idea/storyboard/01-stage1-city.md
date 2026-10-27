# 01 — Stage 1: City 「追」 *(The Chase)*

[← prologue](00-title-prologue.md) · [index](README.md) · next: [Stage 2](02-stage2-campus.md)

| | |
|---|---|
| Level id | `level_stage1_city` |
| Clock | 17:10 → 17:35 (par 25 game-min) |
| The family's question | Will he chase without wrecking the street or hurting the innocent? |
| Length | 7 screens of play + boss arena |
| Music | `music_stage1` (driving rock) · boss `music_boss_fruit` |
| Enemies | `enemy_office_worker`, `enemy_scalper`, `enemy_delivery_rider` |
| Boss | `boss_fruit_aunt` 二姑 |
| Breakables that bill | `prop_market_stall` (bill 50 coins each), `prop_fruit_crate` (bill 10) |
| 勇 moments | Help-ups (taught in S1-04) · showpiece melon + stall intact (+6) |
| Clue level | **Deniable** |

### Enemy sheet (stage 1)

| Id | Look | Behaviour | Reason to like him | Defeat line |
|---|---|---|---|---|
| `enemy_office_worker` | Shirt, tie, briefcase, 林 tie pin (tiny) | Slow melee: briefcase swing, 2-hit combo. Says 「不好意思」 on swing | "He runs like my son." | 「……辛苦了。」 *Good work.* |
| `enemy_scalper` 黃牛 | Cap, bum bag, fan of tickets | Ranged: throws tickets in a spread, retreats | "Respects a hustler." | 「票還你。」 *Have your ticket back.* |
| `enemy_delivery_rider` 外送員 | Helmet, insulated bag | Hit-and-run: dash attack across a lane with the bag | Delivers his food every week | 「餐點已送達。」 *Order delivered.* |

---

### S1-01 — Market Row
Type       gameplay
Clock      17:10
Location   `level_stage1_city` · section 1 · 2 screens
On screen  Rush-hour market street. Neon signs, stalls with awnings, scooters parked in rows.
           The van's tail-lights turn a corner far ahead.
Who        `enemy_office_worker` ×3 (wave 1) · `enemy_scalper` ×1 (wave 2)
Gameplay   **Tutorial by icons only:** move / attack / jump glyphs fade in over the first enemies,
           with no text. Two `prop_market_stall` are in the lanes. Smashing one bills 50 coins:
           the stall keeper pops up, hands over a bill (`ui_bill_popup`, shows −50) and ducks back
           down.
Dialogue
| id | speaker | zh-TW | en |
|---|---|---|---|
| dlg_s1_01_01 | 上班族 | 不好意思! | Excuse me! |
| dlg_s1_01_02 | 攤販 *(bill)* | 這個……麻煩你。 | This is… for you. |

Camera     Free scroll. Locks per wave.
Audio      `music_stage1`
Scoring    Bills → 錢 −50 per stall; `stalls_broken += 1`.
Clues      「不好意思」 while swinging a briefcase. (Deniable: people are polite.)
Becomes    `event_s1_01_market_row` · section `s1_market_row`

### S1-02 — The junction
Type       cutscene (short) → gameplay
Clock      ~17:15
Location   section 2 · 1 screen
On screen  A big junction, cars everywhere. A traffic police officer in white gloves stands on a
           podium in the middle. **三叔 Ken.** The candidate runs up, out of breath, and before he
           can speak Ken points up the road and blows his whistle. **Every car in every lane stops
           at the same instant.** A clear path opens.
Who        `npc_ken` · then `enemy_delivery_rider` ×2, `enemy_office_worker` ×2
Dialogue
| id | speaker | zh-TW | en |
|---|---|---|---|
| dlg_s1_02_01 | {name} | 警察先生!我女朋友被—— | Officer! My girlfriend was— |
| dlg_s1_02_02 | 三叔 Ken | 我們已經在處理了,你先追。 | We're on it. You keep chasing. |
| dlg_s1_02_03 | {name} | *(to himself)* 連警察都靠我了…… | Even the police are counting on me… |

Camera     Hold on the frozen traffic for one beat.
Audio      Whistle `sfx_whistle`; all engines cut at once.
Clues      Every car stops at once; the police already know.
Becomes    `event_s1_02_junction` · **setup: Ken → R-03 (bows in uniform)**

### S1-03 — Covered arcade, in the rain
Type       gameplay
Clock      ~17:20
Location   section 3 · 2 screens
On screen  It starts to pour. A long covered arcade with gaps in the roof.
Who        `enemy_scalper` ×2 · `enemy_office_worker` ×2 · `enemy_delivery_rider` ×1
Gameplay   **Rain hazard:** outside cover he gets the status `status_soaked` and loses 1% 力
           per second (cartoon dripping). Under the roof he is safe. Enemies are also slowed
           when soaked.
Dialogue
| id | speaker | zh-TW | en |
|---|---|---|---|
| dlg_s1_03_01 | 黃牛 | *(glancing at a slip of paper in his palm, then at him)* ……是他。 | …That's him. |

Camera     Free scroll.
Audio      Rain bed `amb_rain`.
Clues      **A man checks a slip of paper (it is a photo) before engaging.**
Becomes    `event_s1_03_arcade_rain` · status `status_soaked`

### S1-04 — Loading bay ambush: the ten-second window
Type       gameplay (arena)
Clock      ~17:25
Location   section 4 · 1 screen, locked
On screen  A loading bay behind the market. Shutters roll up on both sides at once.
Who        wave 1: `enemy_office_worker` ×2 + `enemy_delivery_rider` ×1 from the left;
           wave 2: `enemy_scalper` ×2 + `enemy_delivery_rider` ×1 from the right
Gameplay   **The help-up mechanic appears here for the first time, without a word of
           explanation.** The first defeated enemy sits down with slow stars and the **E** glyph
           above him. If the player presses E: he gets up, bows slightly and walks off waving
           (`brave_help_up` +2, gold `+2` pop, added to `roster`). If the player hits him instead:
           no pop, `hit_downed`. If the player ignores him: after 10 s he gets up and leaves.
Dialogue
| id | speaker | zh-TW | en |
|---|---|---|---|
| dlg_s1_04_01 | 外送員 *(helped up)* | 謝謝……你人真好。 | Thanks… you're a good guy. |
| dlg_s1_04_02 | 上班族 *(helped up)* | 謝謝。……加油喔。 | Thanks. …Good luck. |

Camera     Locked arena.
Audio      `sfx_daze_stars` (a slowing twinkle that marks the 10 s).
Scoring    +2 per help-up; −3 per `hit_downed`.
Clues      The men he helps up wish him luck.
Becomes    `event_s1_04_loading_bay` · **setup: roster → D-04 summon refusals**

### S1-05 — The fruit stall
Type       cutscene
Clock      ~17:30
Location   section 5 · boss arena, 1 screen
On screen  The street narrows. A fruit stall under a striped awning blocks most of it. On the
           counter, in pride of place, sits **one enormous, perfect melon on a little cushion: the
           showpiece.** Crates of ordinary melons are stacked around it. The candidate charges
           straight at the gap. The owner, a sturdy woman in an apron and arm sleeves, steps out
           holding a melon in each hand. **This is 二姑. Nobody told her about tonight.** As far as
           she knows, a lunatic is about to run through her stall.
Who        `boss_fruit_aunt`
Dialogue
| id | speaker | zh-TW | en |
|---|---|---|---|
| dlg_s1_05_01 | 二姑 | 你要幹嘛?! | What do you think you're doing?! |
| dlg_s1_05_02 | {name} | 讓開!他們往那邊—— | Move! They went that way— |
| dlg_s1_05_03 | 二姑 | 我的西瓜誰都不准碰。 | Nobody touches my melons. |

Camera     The arena locks. A brief zoom on the showpiece melon (the player should notice it).
Audio      `music_boss_fruit` (comic-heroic, accordion and brass).
Clues      None from her: she really doesn't know.
Becomes    `event_s1_05_fruit_aunt_intro` · prop `prop_showpiece_melon` (40 HP)

### S1-06 — Boss: 二姑, the Fruit Aunt
Type       boss
Location   boss arena · the stall sits at the back-centre of the arena
Who        `boss_fruit_aunt` · `prop_showpiece_melon` · `prop_market_stall` ×2 (her stall, flanking)
Gameplay

| Move | Phase | Effect |
|---|---|---|
| 滾西瓜 Melon Bowling | 1, 2 | Rolls ordinary melons along two lanes; jump or change lane |
| 挑水果 Ripeness Check | 1, 2 | Grab: squeezes his arm like fruit, 「太軟。」 (*too soft*), then a small push |
| 榴槤 Durian Toss | 2 (< 50%) | A high arc onto his position, with a shadow telegraph. A cartoon *bonk* stun |
| 讓開! Shove | 2 | A fast shoulder charge across the arena |

- **The test.** Missed attacks, thrown enemies and his own heavy attacks can hit the counter.
  The showpiece melon has 40 HP. **Nothing tells the player to protect it.**
- If the showpiece melon breaks: the music stops. 二姑 drops her melons and **sits down in the
  wreckage. The fight ends at once.** `flag_melon_broken = true`, bill 200 coins.
- If her own stall props break: bill 50 each; `stalls_broken += 1`.
- At 50% HP, once (a mid-fight bark, no pause): dlg_s1_06_01.

Dialogue
| id | speaker | zh-TW | en |
|---|---|---|---|
| dlg_s1_06_01 | 二姑 | *(squints at him)* ……你長得好像一個人。 | …You look just like someone. |
| dlg_s1_06_02 | 二姑 *(melon breaks)* | …………又來了。 | ……Not again. |

Camera     Locked.
Scoring    Melon broken → 錢 −200, and `brave_melon_spared` is impossible.
Clues      「你長得好像一個人」 (pays off at R-08).
Becomes    `event_s1_06_fruit_aunt_fight` · `boss_fruit_aunt` · `ai_boss_fruit_aunt` · skills
           `skill_fruit_aunt_bowling`, `skill_fruit_aunt_ripeness_grab`, `skill_fruit_aunt_durian`,
           `skill_fruit_aunt_shove`

### S1-07 — Outcome and exit
Type       cutscene (short) → gameplay → transition
Variants

| Case | What happens | Dialogue |
|---|---|---|
| **A. Beaten, melon and stall intact** | She sits dazed (ten-second window applies; she can be helped up). Then she stands, looks at the untouched showpiece melon, looks at him, and **points up the road toward the university.** `brave_melon_spared` +6 (pop). | dlg_s1_07_01, dlg_s1_07_02 |
| **B. Beaten, stall props broken but melon intact** | As A but no +6. She points without a word. | — |
| **C. Melon broken** | She stays sitting. He has to find the way himself (the van's tyre marks glow faintly). | dlg_s1_06_02 already played |

Dialogue
| id | speaker | zh-TW | en |
|---|---|---|---|
| dlg_s1_07_01 | 二姑 *(helped up)* | ……你這孩子。 | …You silly boy. |
| dlg_s1_07_02 | 二姑 | ……你比較乖。往那邊。 | …You're better behaved. That way. |

Exit       He sprints off-screen toward the university gate. Fade to Stage 2.
Clues      「你比較乖」: better behaved *than whom*? (Pays off at R-08.)
Becomes    `event_s1_07_fruit_aunt_outcome` · **setup: the melon → R-03, R-08, E1 fruit plate**
