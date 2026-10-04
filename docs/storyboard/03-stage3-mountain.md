# 03 — Stage 3: Mountain road 「山路」

[← Stage 2](02-stage2-campus.md) · [index](README.md) · next: [Stage 4](04-stage4-garage.md)

| | |
|---|---|
| Level id | `level_stage3_mountain` |
| Clock | 18:00 → 18:25 (par 25 game-min) |
| The family's questions | Does he know when *not* to fight? Does he respect his elders? |
| Length | 6 screens of play + boss arena |
| Music | `music_stage3` (erhu over a rock beat) · boss `music_boss_tea` (gentle, guzheng, ticking clock) |
| Enemies | `enemy_groundskeeper`, `enemy_guard_dog`, `enemy_estate_security`; hazard `npc_xiaole` |
| Boss | `boss_ban` 二叔 + `boss_straw_hat` (**his father**, disguised): tag team |
| Breakables that bill | none (it's their garden; nothing here breaks) |
| 勇 moments | Help-ups. Bowing is required to pass, so it isn't scored |
| Clue level | **Absurd** |

### Enemy sheet (stage 3)

| Id | Look | Behaviour | Reason to like him | Defeat line |
|---|---|---|---|---|
| `enemy_groundskeeper` | Green overalls with **林** on the chest, rake | Medium melee: rake sweep (hits two lanes) | "He walked on the path, not the lawn." | 「草沒踩到,很好。」 *You kept off the grass. Good.* |
| `enemy_guard_dog` | Big fluffy dog, **a smart collar with a 林 tag** | Fast charge. **Press E near a dog when it isn't charging to pet it: it rolls over and stays out of the fight** | It's a dog. It likes everyone | *(rolls over, tail wagging)* |
| `enemy_estate_security` | Black suit, earpiece, **林** pin | **Blocker.** Guards all light attacks. A heavy attack or a throw breaks the guard. **Mash 4+ light attacks into his guard and he counter-shoves** (the first enemy that punishes mashing) | "Steady hands. Good sign." | 「……失禮了。」 *Pardon me.* |
| `npc_xiaole` 小樂 (9) | School uniform, glasses, at a folding desk | **Hazard, not an enemy: cannot be hit (attacks pass through).** Throws erasers, rulers and a compass in arcs without looking up. Leaves when he's done | — | 「我寫完了。」 *Finished.* (packs up and leaves) |

---

### S3-01 — Lower gate
Type       gameplay
Clock      18:00
Location   section 1 · 1 screen
On screen  The bike skids to a stop. An ornate iron gate, a sign 「私人道路 · 3 公里」 (*Private
           road · 3 km*), and behind it a road climbing a forested mountain. **The gate swings open
           on its own.**
Who        `enemy_groundskeeper` ×3
Dialogue
| id | speaker | zh-TW | en |
|---|---|---|---|
| dlg_s3_01_01 | {name} | 整座山……是他們的?! | The whole mountain… is theirs?! |

Clues      A private mountain; the gate opens for him; 林 on every uniform.
Becomes    `event_s3_01_lower_gate`

### S3-02 — The dog run
Type       gameplay
Location   section 2 · 1 screen
Who        `enemy_guard_dog` ×3 · `enemy_groundskeeper` ×1
Gameplay   Dogs charge in turn. A dog can be fought (it sits down dazed like anyone else), or
           **petted** with E during its 1 s pause between charges. A petted dog rolls over and
           follows him to the edge of the screen. `dogs_petted += 1`. Petting is not scored. It's
           just nice, and it's remembered (R-03).
Becomes    `event_s3_02_dog_run`

### S3-03 — Pond path
Type       gameplay
Location   section 3 · 2 screens
On screen  A koi pond with stepping stones. **Garden lanterns switch on one by one ahead of him**,
           as if someone is expecting him.
Who        `enemy_groundskeeper` ×2 · `enemy_estate_security` ×2
Gameplay   Falling into the pond (missed jump) costs 5% 力 and he climbs out soaked
           (`status_soaked`). One scripted moment: a defeated groundskeeper **is helped up by
           another groundskeeper**, who dusts him off before they both attack again.
Clues      Lights coming on ahead; staff helping each other up.
Becomes    `event_s3_03_pond_path`

### S3-04 — Stone steps
Type       gameplay
Location   section 4 · 2 screens (diagonal climb)
Who        `enemy_estate_security` ×3 · `npc_xiaole` (hazard, at the top)
On screen  A long flight of stone steps. At the top, a boy at a folding desk, doing his homework.
Dialogue
| id | speaker | zh-TW | en |
|---|---|---|---|
| dlg_s3_04_01 | 小樂 | *(not looking up)* 我在寫功課。 | I'm doing my homework. |
| dlg_s3_04_02 | 小樂 | 我寫完了。 | Finished. |

Becomes    `event_s3_04_stone_steps`

### S3-05 — The tea table
Type       cutscene
Clock      ~18:15
Location   section 5 · boss arena, 1 screen (a wide stretch of the road with a view over the city)
On screen  In the middle of the road: a folding table with a full tea service and two old men.
           **二叔 BAN**, enormous and beaming, is pouring tea. Across from him is a man in a **straw
           hat and an obviously fake grey beard**, bent over a **Chinese chess (象棋) board**. **It
           is the candidate's father.** He has no idea.
Who        `boss_ban` · `boss_straw_hat`
Dialogue
| id | speaker | zh-TW | en |
|---|---|---|---|
| dlg_s3_05_01 | 二叔 | 來,坐。喝杯茶。 | Come, sit. Have some tea. |
| dlg_s3_05_02 | {name} | 我沒時間喝茶! | I don't have time for tea! |
| dlg_s3_05_03 | 草帽伯伯 | *(not looking up from the board)* 年輕人,急什麼。 | Young man, what's the hurry. |

Camera     Arena locks. The view of the city at dusk behind them.
Audio      `music_boss_tea`.
Becomes    `event_s3_05_tea_table_intro`

### S3-06 — Boss: tea and chess (tag team)
Type       boss
Who        `boss_ban` · `boss_straw_hat`
Gameplay

**Win condition: accept three cups from 二叔, then bow to both of them. Fighting alone cannot
win.**

| Who | Moves / rules |
|---|---|
| **二叔 BAN** | **Invulnerable in practice.** Knock him down and he sits, pours himself another cup and stands up fully restored (the "restore" loop). Every ~10 s he holds out a cup: an **E** glyph over the cup for 5 s. **Accept (E):** 氣 +30% and one stack of `status_heavy` (−10% move and jump speed per stack, 3 max, lasts until Stage 4 starts). **Ignore or attack during the offer:** −10% 力 (you don't refuse an uncle). `tea_cups += 1` per accepted cup |
| **草帽伯伯 Straw-Hat Uncle** | Can be fought. **車 Chariot:** a straight-line charge down a lane. **炮 Cannon:** lobs a chess piece that hops once and lands on him. **將軍! Checkmate:** a grab that pins him to the chessboard for 1.5 s. When his HP runs out he sits dazed like anyone else. He can be helped up (+2, `flag_dad_helped_up`), then he gets up and keeps going at 50% HP |
| **Banter** | Whichever man he isn't fighting comments. Dad's comments are **the exact tips he gave his son as a child**. The first time dlg_s3_06_02 plays, a half-second flashback panel flickers (a small boy, a big hand guiding his fists, the same voice) |
| **The bow** | Once `tea_cups == 3`, an **E** glyph appears between the two men whenever the candidate stands still near the table. E → **he bows**. The fight ends |

Dialogue
| id | speaker | zh-TW | en |
|---|---|---|---|
| dlg_s3_06_01 | 二叔 | 再一杯。 | One more cup. |
| dlg_s3_06_02 | 草帽伯伯 | 手放低。 | Lower your hands. |
| dlg_s3_06_03 | 草帽伯伯 | 腳步太亂。 | Your footwork's a mess. |
| dlg_s3_06_04 | 草帽伯伯 | 將軍! | Checkmate! |
| dlg_s3_06_05 | 二叔 *(after being knocked down)* | *(pours another cup, beaming)* | |
| dlg_s3_06_06 | 草帽伯伯 *(helped up)* | ……嗯。 | …Hm. |

Camera     Locked.
Scoring    Help-ups +2 each (二叔 cannot be "defeated", so cannot be helped up). `hit_downed`
           applies to the Straw-Hat Uncle.
Clues      「手放低」; the flashback flicker; the beard slipping a little more each time he's hit.
Becomes    `event_s3_06_tea_chess_fight` · `boss_ban` · `ai_boss_ban` · `boss_straw_hat` ·
           `ai_boss_straw_hat` · skills `skill_ban_offer_tea`, `skill_dad_chariot`,
           `skill_dad_cannon`, `skill_dad_checkmate` · status `status_heavy`

### S3-07 — The bow, and the way through
Type       cutscene → transition
On screen  He bows to both men. 二叔 laughs, delighted, and moves his chair aside. The Straw-Hat
           Uncle stands up slowly. His beard has slipped halfway off one ear. He looks at the
           candidate for a long moment.
Dialogue
| id | speaker | zh-TW | en |
|---|---|---|---|
| dlg_s3_07_01 | 二叔 | 好孩子。 | Good kid. |
| dlg_s3_07_02 | 草帽伯伯 | *(under his breath)* ……長大了。 | …You've grown up. |
| dlg_s3_07_03 | {name} | *(bowing again, very politely)* 謝謝伯伯! | Thank you, sir! |
| dlg_s3_07_04 | 草帽伯伯 | *(pushing the beard back on, very quietly)* ……謝謝伯伯。 | …"Thank you, sir." |

Exit       The road climbs to the summit. A floodlit ramp leads down into an underground garage.
           At the bottom, the van's brake lights glow. Fade to Stage 4.
Clues      「長大了」; the beard. (Absurd. He keeps running.)
Becomes    `event_s3_07_the_bow` · **setup: 「手放低」 → D-06; Straw-Hat Uncle → R-05**
