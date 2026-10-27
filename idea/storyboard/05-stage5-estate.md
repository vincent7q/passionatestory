# 05 — Stage 5: The estate 「城堡」 and the dining room

[← Stage 4](04-stage4-garage.md) · [index](README.md) · next: [Reveal & endings](06-reveal-endings.md)

| | |
|---|---|
| Level id | `level_stage5_estate` (S5-01 – S5-05) · `level_dining_room` (D-01 – D-06) |
| Clock | 18:40 → **19:00** at the dining-room door (par 20 game-min). **時 is measured at D-01** |
| The family's question | In chaos, who does he protect first? |
| Length | 6 screens of play + mid-boss + final arena |
| Music | `music_stage5` (orchestral rock, big) · mid-boss `music_boss_howard` · final `music_boss_father` |
| Enemies | `enemy_catering_staff`, `enemy_aunt`, `enemy_cousin`, `enemy_kitchen_staff`; hazard `npc_toddler` |
| Mid-boss | `boss_howard` 大表哥 (Stanford) |
| Final boss | `boss_lin_jianguo` 林建國 |
| Breakables that bill | `prop_vase` (bill 60 each) |
| 勇 moments | Help-ups · **shield the toddler (+8)** · **shield 小雨 (+8)** · never hit the toddler (−5 if hit) |
| Clue level | **Blatant** |

### Enemy sheet (stage 5)

| Id | Look | Behaviour | Reason to like him | Defeat line |
|---|---|---|---|---|
| `enemy_catering_staff` | White jacket, silver tray | Ranged: throws dinner rolls in a spread; tray block | "He'll be at the table soon." | 「餐前麵包。」 *Bread before dinner.* |
| `enemy_aunt` | Qipao or cardigan, serving spoon | Medium melee: spoon combo. **Question barks mid-combo** (no effect, just comedy) | "Tall! Good teeth!" | 「下次來家裡吃飯。」 *Come over for dinner sometime.* |
| `enemy_cousin` | Polo shirt, phone in hand | Hit-and-run; takes a **flash photo** (1 s blind) | "Finally, someone my age." | 「加個好友?」 *Add me?* |
| `enemy_kitchen_staff` | Chef whites, wok | Heavy: wok swing; a **flambé** burst (a cartoon flame puff, area denial) | "He'll eat what I cook." | 「火候剛好。」 *Perfectly done.* |
| `npc_toddler` 小表妹 | 3 years old, tiny qipao, pigtails | **Hazard, not an enemy. Cannot be hurt.** Wanders through lanes. **If he is adjacent she hits him for 5 力** and giggles. Hitting her does nothing to her (she laughs) and costs `hit_toddler` −5 | — | — |

---

### S5-01 — The courtyard
Type       gameplay
Clock      18:40
Location   `level_stage5_estate` · section 1 · 2 screens
On screen  A vast floodlit courtyard. A fountain. **Catering vans** with their back doors open.
           **A helipad** with a helicopter under a cover. A **banner** being hoisted on ropes,
           still rolled up. The black van is parked by the front steps, engine ticking, empty. By
           the door stands **an easel with a seating chart**.
Who        `enemy_catering_staff` ×3 · `enemy_cousin` ×2
Gameplay   After the first wave the camera pauses on the easel (the player can read it). The
           chart shows a round table with names: 林建國, 林媽媽, 小雨, 二姑, 二叔, 三叔, 家豪, and
           **{name}**, and two more: **「陳先生 · 陳太太」**.
Dialogue
| id | speaker | zh-TW | en |
|---|---|---|---|
| dlg_s5_01_01 | {name} | 這是……名單?我的名字……還有—— | A list? My name… and— |
| dlg_s5_01_02 | {name} | ——他們連我爸媽都抓了!! | —They've got my parents too!! |

Camera     Free scroll; a held pan to the easel.
Audio      `music_stage5`. After dlg_s5_01_02, the tempo steps up for the rest of the stage
           (`music_stage5_urgent`).
Clues      **Blatant:** a seating chart with his name and his parents' names. He reads it as a
           hostage list and runs faster. (The best misreading in the game.)
Becomes    `event_s5_01_courtyard` · props `prop_seating_chart`, `prop_banner_rolled`

### S5-02 — Ancestral hall, and Howard
Type       gameplay → mid-boss
Location   section 2 · 1 screen + arena
On screen  A long hall of portraits. A grandmother in a painted portrait (外婆) watches over the
           room. Among the framed photos, one is lit by a spotlight: **1994. Two young men sit at
           a round dinner table, each holding a sheet of paper. One is a young 林建國. The other
           sits with his back to the camera.** A young woman stands behind them with a plate of
           fruit.
Who        `enemy_aunt` ×2 · then `boss_howard`
Dialogue
| id | speaker | zh-TW | en |
|---|---|---|---|
| dlg_s5_02_01 | Howard | 你好你好。不好意思,我史丹佛的。 | Hi, hi. Sorry, I went to Stanford. |
| dlg_s5_02_02 | {name} | ……所以呢?! | …So?! |

Mid-boss: **大表哥 HOWARD**

| Move | Effect |
|---|---|
| 「不好意思,我史丹佛的。」 | A taunt that **buffs him** (+20% damage for 5 s). He uses it every 12 s. It can be interrupted by any hit |
| 原文書 Textbook Volley | Throws three thick textbooks in a fan |
| 畢業致詞 Valedictorian Speech | Stands still and gives a speech. **Anyone in front of him in that lane is stunned** (boredom stars) until they leave the lane. Interrupt by hitting him from another lane |

Dialogue (defeat)
| id | speaker | zh-TW | en |
|---|---|---|---|
| dlg_s5_02_03 | Howard *(sitting, rubbing his head)* | 你很不錯。……我史丹佛的。 | You're good. …I went to Stanford. |

Clues      The 1994 photo (pays off at R-07); 外婆's portrait.
Becomes    `event_s5_02_ancestral_hall` · `boss_howard` · `ai_boss_howard` · prop `prop_photo_1994_hall`

### S5-03 — The kitchen, and the toddler
Type       gameplay (scripted moment)
Location   section 3 · 1 screen
On screen  A huge kitchen. Woks roaring, **warming trays**, a tower of steamers. Through the far
           door someone is **tuning a piano**: one note, again and again.
Who        `enemy_kitchen_staff` ×3 · `npc_toddler`
Gameplay   Mid-wave, the toddler toddles in from the pantry door, into the middle lane. A cook
           backs into a **trolley with a huge soup tureen**. It rolls and **tips toward the
           toddler** (a 1.5 s slow-motion telegraph: the tureen tilting, her looking up at it).
           **No prompt.**
           - If he is **between the tureen and the toddler** (any state, guarding or not) when it
             spills: soup splashes him (−5% 力, `status_soaked`) and `flag_toddler_shielded`,
             `brave_toddler_shielded` +8 (pop). She claps.
           - If not: soup splashes her. She is fine (cartoon): dripping, delighted, laughing. No
             penalty and no award.
Dialogue
| id | speaker | zh-TW | en |
|---|---|---|---|
| dlg_s5_03_01 | 小表妹 *(clapping)* | 再一次! | Again! |

Becomes    `event_s5_03_kitchen_toddler` · prop `prop_soup_trolley` · **setup: the shield →
           D-05 (same instinct, higher stakes)**

### S5-04 — The grand corridor: three waves
Type       gameplay (arena)
Location   section 4 · 2 screens, locked in two halves
On screen  A long corridor of carved doors, **vases** on pedestals. Music swells toward the far
           end.
Who        wave 1: `enemy_aunt` ×3 · wave 2: `enemy_cousin` ×2 + `enemy_catering_staff` ×2 ·
           wave 3: everyone left (aunts, cousins, kitchen staff, 4–5 at once)
Gameplay   `prop_vase` ×4, bill 60 each.
Dialogue (aunt barks, random during combos)
| id | speaker | zh-TW | en |
|---|---|---|---|
| dlg_s5_04_01 | 阿姨 | 你幾歲? | How old are you? |
| dlg_s5_04_02 | 阿姨 | 哪間大學的? | Which university? |
| dlg_s5_04_03 | 阿姨 | 幾公分? | How tall are you? |
| dlg_s5_04_04 | 阿姨 | 有沒有在運動?有喔,看得出來。 | Do you work out? Oh, you do. I can tell. |

Becomes    `event_s5_04_grand_corridor`

### S5-05 — The door
Type       cutscene
Clock      the clock is read here as `arrival_clock`
On screen  A pair of enormous carved doors. Behind them, **music, glasses clinking, voices.** He
           takes the hair clip out of his pocket, looks at it, puts it back. Then he runs at the
           doors and **kicks them down mid-roll**, braced for the boss.
Scoring    `arrival_clock` is set; `時` computed; `flag_late` / `flag_very_late` set (README §3.2).
Becomes    `event_s5_05_the_door`

---

## The dining room — final boss: 林建國

Level `level_dining_room`, one arena: a round table for eleven in the centre (the fight happens
**around** the table: lanes in front of and behind it), a lazy Susan on top, family seated.

### D-01 — The music stops
Type       cutscene
On screen  The doors land flat. **The music stops dead.** A round table set for **eleven**. The
           whole family turns to look at him: 二姑 (back from her stall), 二叔 (tea tray beside his
           bowl), 三叔 Ken (still in uniform), Howard, aunts, cousins, the toddler in a high chair.
           **小雨** sits very straight, hands in her lap, looking only at him. Beside her, a woman
           in **sunglasses**, with **a cap on the table** in front of her.
           **Three chairs are empty.** A **straw hat** hangs on the coat rack. A **hairnet** is
           folded on one of the empty chairs.
           At the head of the table, **林建國**, in his fifties, a calm face and reading glasses,
           holding chopsticks.
Variants (table state)

| Flag | Table |
|---|---|
| on time | Food steaming. Nobody has eaten a bite; they waited |
| `flag_late` | Steam gone. A few people have started on the cold dishes |
| `flag_very_late` | **The table is cleared.** Someone is washing up in the kitchen. 林建國 sits at a bare table with a cup of tea |
| `flag_carried_in` | Skip to R-01 (see G-02) |

Camera     A slow 360° around the table, ending on 林建國.
Audio      Silence. One clink of a spoon.
Becomes    `event_d_01_music_stops`

### D-02 — 「我等你很久了。」
Type       cutscene
Dialogue
| id | speaker | zh-TW | en |
|---|---|---|---|
| dlg_d_02_01 | 林建國 | *(puts down his chopsticks)* 我等你很久了。 | I've been waiting a long time for you. |
| dlg_d_02_02 | {name} | 放開她! | Let her go! |
| dlg_d_02_03 | 林建國 *(late)* | ……菜都涼了。 | …The food's gone cold. |
| dlg_d_02_04 | 林建國 *(very late)* | 我們吃完了。 | We've finished. |

           A villain's line, a host's line, a father's line. He has already decided which. He
           attacks.
Audio      `music_boss_father` starts on dlg_d_02_02.
Becomes    `event_d_02_waiting`

### D-03 — Phase 1 「面談」 *(The Interview)*
Type       boss
Who        `boss_lin_jianguo` (**seated the whole phase**) · family (non-combat, eating)
Gameplay   He never stands up in this phase. **The family keeps eating** and passes dishes around
           the fight (bowls slide past along the lanes, purely visual). An aunt asks someone to move
           so she can reach the fish.

| Move | Effect |
|---|---|
| 筷子 Chopstick Jab | A lightning poke from his seat; medium range, very fast |
| 「你幾歲?」「有房子嗎?」 *How old are you? Do you own a home?* | Question projectiles in two lanes |
| 「吃飽了嗎?」 *Have you eaten?* | **Unblockable grab: force-feeds him.** Restores 20% 力. Comic, not harmful. The same line as his mother's (S2-06) |
| 轉盤 Lazy Susan | Spins the lazy Susan; dishes fly off along lanes as projectiles |

Clues      「吃飽了嗎?」 / 「吃飽沒?」, two parents with the same move.
Becomes    `event_d_03_phase1` · `boss_lin_jianguo` · `ai_boss_lin_jianguo` · skills
           `skill_father_chopstick_jab`, `skill_father_questions`, `skill_father_force_feed`,
           `skill_father_lazy_susan`

### D-04 — The summons
Type       boss (mechanic, runs through D-03 and D-05)
Gameplay   Every 20 s he raises a hand: 「來。」 Two family members are called from the
           Stage 5 pool and from **everyone he fought tonight** (the door is open; they're waiting
           in the corridor).
           - Anyone on his `roster` (helped up tonight) **appears in the doorway, shakes their head,
             bows, and leaves.** Each refusal is a small visible victory.
           - Others come in and fight (normal enemy behaviour).
           - When the pool of non-roster people is empty, the summon does nothing and 林建國 nods
             slightly.
Dialogue
| id | speaker | zh-TW | en |
|---|---|---|---|
| dlg_d_04_01 | 林建國 | 來。 | Come. |
| dlg_d_04_02 | (roster member, in the doorway) | 不好意思,我吃飽了。 | Sorry, I've already eaten. |
| dlg_d_04_03 | (roster member, alt) | 他扶過我。 | He helped me up. |

Becomes    `event_d_04_summon` · **payoff: roster**

### D-05 — Phase 2 「站起來」 *(He Stands)*
Type       boss
Trigger    林建國 at 40% HP
On screen  He **stands up from the table for the first time.** The music drops to a single
           drum. **The whole family puts down their chopsticks** and turns to watch. They have all
           seen a man stand up from this table before.
Gameplay

| Move | Effect |
|---|---|
| 站樁 Stance | A formal stance (1 s, a clear telegraph). **This is the bow window: press E while he holds the stance → the candidate bows → 林建國 is staggered** (long punish window). Only a stagger can bring him below 10% |
| 推掌 Palm Push | A wide, slow, unblockable push across a lane |
| 轉盤全速 Lazy Susan, full speed | Dishes fly every 0.5 s |
| **The dish at 小雨** (scripted, once, at ~30% HP) | The lazy Susan flings a heavy serving dish **toward 小雨's seat** (1.5 s slow-motion telegraph). **No prompt.** If he gets between the dish and her: it hits him (−10% 力, knockdown, he loses his punish opening) and `flag_cloris_shielded`, `brave_cloris_shielded` +8 (pop). If not: the dish stops a hand's width from her face, caught by 林媽媽's chopsticks without looking up. No penalty |

Dialogue
| id | speaker | zh-TW | en |
|---|---|---|---|
| dlg_d_05_01 | 林建國 | *(standing)* …… | |
| dlg_d_05_02 | 小雨 *(shielded)* | *(very quietly)* ……笨蛋。 | …Idiot. |

Becomes    `event_d_05_phase2` · `event_d_05_dish_at_cloris`

### D-06 — 「手放低!」
Type       boss finish (scripted)
Trigger    林建國 at 10% HP and staggered
On screen  林建國 recovers from the stagger and raises his guard for the last exchange. The
           candidate raises his fists too, too high. **From the kitchen doorway, a man's voice:**
Dialogue
| id | speaker | zh-TW | en |
|---|---|---|---|
| dlg_d_06_01 | (voice from the kitchen doorway) | 手放低! | Lower your hands! |

Gameplay   The candidate's guard **drops automatically** (the same flashback flicker as S3-06,
           half a second). The next attack the player presses is the finishing blow. It lands in
           slow motion. 林建國 **does not fall**: he sits back down in his own chair, stars circling,
           and rubs his head.
Camera     Slow motion on the hit; then a hold on 林建國, seated.
Audio      `music_boss_father` ends on a single cymbal. **Silence.**
Clues      Whose voice is that? (He doesn't wonder.)
Becomes    `event_d_06_hands_down` · **payoff: S3-06 「手放低」**
