# 06 — The reveal, the form, endings, game over, bonus

[← Stage 5](05-stage5-estate.md) · [index](README.md) · [ledgers](ledgers.md)

All cutscenes. The clock is gone from the HUD from R-01 on. Level: `level_dining_room` unless
noted.

**Order:** D-06 → R-01 … R-09 → ending (README §6) → credits → post-credits.
**E0 skips the reveal entirely.** It branches off at S4-07.

---

## The reveal

### R-01 — Nothing happens
On screen  He stands in the wreckage of a dining room, breathing hard, fists still up. **Nobody
           runs. Nobody calls for help.** The family looks at him. Somebody's chopsticks touch a
           bowl. Hold for 3 full seconds.
Variants   `flag_carried_in` (G-02): instead, **he wakes up seated at the table** with a napkin
           tucked into his collar and a blanket over his shoulders. Everyone is looking at him.
           Continue to R-02.
Becomes    `event_r_01_nothing_happens`

### R-02 — 小雨
On screen  小雨 stands up from the table and walks to him.
Dialogue
| id | speaker | zh-TW | en |
|---|---|---|---|
| dlg_r_02_01 | 小雨 | 你來得好慢。 | You took ages. |
| dlg_r_02_02 | 小雨 *(quietly)* | ……但你來了。 | …But you came. |
| dlg_r_02_03 | 小雨 *(if `flag_cloris_shielded`, touching his sleeve)* | ……剛剛那個盤子,很痛吧。 | …That dish must have hurt. |
| dlg_r_02_04 | {name} | 小雨,快走!他們—— | 小雨, run! They're— |
| dlg_r_02_05 | 小雨 | 坐下。 | Sit down. |

Variants   `flag_very_late`: dlg_r_02_02 is replaced by 「……你終於來了。」 *(…You finally came.)*
           `flag_carried_in`: dlg_r_02_01 is 「你是被抬進來的。」 *(You were carried in.)*
Becomes    `event_r_02_cloris`

### R-03 — Everyone bows
On screen  Footsteps behind him. **Everyone he fought tonight files in** through the broken doors
           and lines up along the wall: office workers, scalpers, delivery riders, basketball
           players, the cheer squad (in pyramid formation), club recruiters (still holding flyers),
           the library auntie, groundskeepers, estate security, valets, mechanics, chauffeurs, the
           three men in black, catering staff, aunts, cousins, kitchen staff. They dust themselves
           off and **bow, together.** 二叔 bows holding his tea tray. 三叔 Ken bows in uniform.
           Then 二姑 bows, walks past him, and sits down at the table.
Variants

| Flag | Detail |
|---|---|
| Rostered people | They bow deeper, and several give a small wave |
| `dogs_petted > 0` | A big fluffy dog trots in and sits by his feet |
| `flag_toddler_shielded` | The toddler, in her high chair, points at him and claps |
| melon intact | 二姑, sitting down, almost smiles |
| `flag_melon_broken` | 二姑, sitting down: 「……又來了。」 |

Dialogue
| id | speaker | zh-TW | en |
|---|---|---|---|
| dlg_r_03_01 | 全員 | 辛苦了! | Thank you for your hard work! |
| dlg_r_03_02 | {name} | ……………… | …………… |

Becomes    `event_r_03_everyone_bows`

### R-04 — The lunch lady
On screen  The kitchen door swings open. The **lunch lady** walks out in apron, hairnet and mask,
           holding her phone up, filming. She lowers the phone and **pulls down the mask. His
           mother.**
Dialogue
| id | speaker | zh-TW | en |
|---|---|---|---|
| dlg_r_04_01 | 媽媽 | 兒子!你剛剛那個{signature_move},媽媽都錄起來了!已經傳到家族群組了! | Son! I filmed your {signature_move}! It's already in the family group chat! |
| dlg_r_04_02 | {name} | ……媽?! | …Mom?! |
| dlg_r_04_03 | 媽媽 *(if `flag_hit_mom`)* | 還有,你剛剛打我。 | Also, you hit me. |
| dlg_r_04_04 | 媽媽 *(if `flag_lunchbox_taken`)* | 便當吃了沒? | Did you eat the lunchbox? |

`{signature_move}`: FELIX → 旋風腿 (Tornado Kick) · LUCIAN → 空中連擊 (Aerial Barrage) ·
HILMAN → 地震拳 (Earthquake Punch).
Becomes    `event_r_04_lunch_lady_unmasked`

### R-05 — The straw hat
On screen  A man steps out of the kitchen doorway behind her, straw hat in hand. He peels off
           the grey beard. **His father.**
Dialogue
| id | speaker | zh-TW | en |
|---|---|---|---|
| dlg_r_05_01 | 爸爸 | ……腳步還是太亂。 | …Your footwork's still a mess. |
| dlg_r_05_02 | {name} | 爸?!所以剛剛「手放低」是—— | Dad?! So "lower your hands" was— |
| dlg_r_05_03 | 爸爸 *(if `flag_dad_helped_up`)* | ……你還扶我起來。 | …And you helped me up. |

Becomes    `event_r_05_straw_hat_unmasked`

### R-06 — The Driver
On screen  The woman in sunglasses at the table takes them off and folds them. She is calm and
           elegant, and she is **小雨's mother.**
Dialogue
| id | speaker | zh-TW | en |
|---|---|---|---|
| dlg_r_06_01 | 林媽媽 | 車是我開的。 | I drove. |
| dlg_r_06_02 | 林媽媽 | 箱子是我踢下去的。 | And I kicked out the suitcase. |
| dlg_r_06_03 | {name} | ……箱子?! | …The suitcase?! |
| dlg_r_06_04 | 林媽媽 *(smiles)* | 你沒回頭。 | You didn't look back. |
| dlg_r_06_05 | 林媽媽 *(if `flag_driver_helped_up`)* | 也謝謝你扶我。 | And thank you for helping me up. |

Becomes    `event_r_06_driver_unmasked` · **payoff: S4-06, S4-07**

### R-07 — The form
On screen  林建國 takes a folded sheet from his jacket and slides it across the table. At the top,
           in brush calligraphy: **林家 配偶評估表** (*Lin Family Suitor Evaluation*), with the
           candidate's name already written in. The lines **write themselves in one by one**, with
           a brush-stroke SFX each.
           1. **力 POWER** — score / 25
           2. **錢 MONEY** — score / 15, with a handwritten note in the margin: 「這些是我們的錢。」
              *(That's our money.)*
           3. **時 TIME** — score / 20. Note if late: 「菜都涼了。」 / very late: 「我們吃完了。」
           He has a second to feel pleased.
           4. Then a fourth line he has never seen, wider and heavier than the others. **勇
              BRAVE** — score / 40. **This is the first time the character 勇 appears on screen
              in the entire game.**
           5. Total / 100.
           6. Under the total, two lines are **already printed:**

```
              林家 配偶評估表
              候選人:{name}

        力   POWER          21 / 25
        錢   MONEY          11 / 15   「這些是我們的錢。」
        時   TIME           18 / 20
        ────────────────────────────
        勇   BRAVE          30 / 40
        ────────────────────────────
        總分                 80 / 100

        林建國    (1994)     71
        陳志強    (1994)     70
```

Dialogue
| id | speaker | zh-TW | en |
|---|---|---|---|
| dlg_r_07_01 | 林建國 | 力氣跟錢,誰都有。 | Strength and money, anyone has those. |
| dlg_r_07_02 | 林建國 | 我看的是——你敢不敢。 | What I was watching was whether you dared. |

Camera     Top-down on the form, filling the screen. Each line writes in, with a pause before 勇.
UI         The form is drawn at native resolution in the UI layer with a brush font
           (`font_form_brush`). Animation: `ui_form_write_line`.
Becomes    `event_r_07_the_form` · `ui_evaluation_form`

### R-08 — One point
On screen  Silence. Everyone slowly looks at **his father.**
Dialogue
| id | speaker | zh-TW | en |
|---|---|---|---|
| dlg_r_08_01 | 林建國 | 差一分。 | One point. |
| dlg_r_08_02 | 爸爸 | 那是因為西瓜。 | That was the melon. |
| dlg_r_08_03 | 二姑 | 對。 | Yes. |
| dlg_r_08_04 | 爸爸 | 而且那是他家的攤子! | And it was HIS family's stall! |
| dlg_r_08_05 | 林建國 *(sipping tea)* | ……那是巧合。 | …Coincidence. |
| dlg_r_08_06 | {name} | 等一下。你們……一九九四年……? | Wait. You two… in 1994…? |
| dlg_r_08_07 | 林媽媽 | 那天晚上被抓走的,是我。 | That night, the one who got taken was me. |

Variants   If `flag_melon_broken`: insert after dlg_r_08_03 — 二姑:「……你們父子都一樣。」 *(…Like
           father, like son.)*
Becomes    `event_r_08_one_point`

### R-09 — How they met
On screen  His mother puts her hand on his father's arm.
Dialogue
| id | speaker | zh-TW | en |
|---|---|---|---|
| dlg_r_09_01 | 媽媽 | 那天晚上,是我端水果給你爸的。 | That night, I was the one who brought your father the fruit. |
| dlg_r_09_02 | 爸爸 | ……輸了,才遇到你媽。 | …I lost, and that's how I met your mom. |
| dlg_r_09_03 | 小雨 *(taking his hand)* | 所以,今天是復仇戰。 | So tonight was the rematch. |

           The father of the girl he loves and his own father have been rivals for thirty-two years.
           Tonight was the rematch, and he was the one playing it.
Becomes    `event_r_09_how_they_met` → evaluate ending (README §6)

---

## E0 — 一百萬 (One Million)

*The greedy ending.* Triggered at S4-07 by picking up the suitcase. **No reveal plays.** The
player learns the truth the hard way.

### E0-01 — Both hands
Type       cutscene (input locked from the press)
On screen  He crouches and closes the suitcase. He lifts it. It is heavy: **both hands**, arms
           straining, and he cannot raise his fists. He takes two slow steps up the ramp. At the
           top, **the van's tail-lights turn the corner and are gone.** The engine sound fades out.
           He stands there holding the suitcase.
Dialogue
| id | speaker | zh-TW | en |
|---|---|---|---|
| dlg_e0_01_01 | {name} | ……先、先拿去報警……對,報警…… | …I'll, I'll take it to the police… yes, the police… |

Audio      `music_choice` cuts. A music-box version of the main theme (`music_e0_musicbox`).
Becomes    `event_e0_01_both_hands`

### E0-02 — The walk down
On screen  A side-scrolling walk, no control, back down the mountain road. **The garden lanterns
           that switched on ahead of him now switch off behind him, one by one.** A guard dog
           watches him pass and does not move. At the tea table, **二叔 and the Straw-Hat Uncle are
           packing up the tea set.** They stop and watch him walk by. Neither says a word. The
           Straw-Hat Uncle slowly takes off his hat. (The candidate doesn't look at them.)
Becomes    `event_e0_02_walk_down`

### E0-03 — Dinner, 19:00
Location   `level_dining_room`
On screen  The dining room at 19:00. The food is steaming. **The doors don't open.** Everyone
           waits. 林建國 looks at his watch. Then he takes out the form and writes. Close-up:
           - 力, 錢, 時 lines are left blank.
           - In the 錢 line, in brush, overflowing the box: **「1,000,000」**.
           - The 勇 line is left blank.
           - A red seal at the bottom: **「已領取」** (*Collected.*)
Dialogue
| id | speaker | zh-TW | en |
|---|---|---|---|
| dlg_e0_03_01 | 小雨 | ……他選了錢。 | …He chose the money. |
| dlg_e0_03_02 | 二姑 | ……跟他爸一樣? | …Like father, like son? |
| dlg_e0_03_03 | 爸爸 *(from the doorway, beard in hand)* | 我當年至少沒拿錢! | At least I didn't take the money! |
| dlg_e0_03_04 | 林媽媽 | 你當年沒有錢可以拿。 | There wasn't any money for you to take. |
| dlg_e0_03_05 | 林建國 | 開飯吧。 | Let's eat. |

Becomes    `event_e0_03_dinner_without_him`

### E0-04 — Home, 21:30
Location   `level_prologue` · candidate's home
On screen  He kicks his own front door open, beaming, suitcase in both hands.
           **The living room is dark.** A lamp clicks on. On the sofa sit **his mother, still in the
           apron and hairnet**, and **his father, fake beard in his lap.** Neither says anything.
Dialogue
| id | speaker | zh-TW | en |
|---|---|---|---|
| dlg_e0_04_01 | {name} | 媽!爸!我們發財了! | Mom! Dad! We're rich! |
| dlg_e0_04_02 | {name} | ……媽,你為什麼戴髮網? | …Mom, why are you wearing a hairnet? |
| dlg_e0_04_03 | 媽媽 | *(stands up; there is a slipper in her hand)* | |

Becomes    `event_e0_04_home`

### E0-05 — What's in the suitcase
On screen  He puts the suitcase on the coffee table and opens it to prove it. Real money. But on
           top lies **an envelope sealed with 林** that wasn't there before. Inside:
           1. **The evaluation form**, as written at E0-03 (「1,000,000」, the seal 「已領取」).
           2. **A note in 林建國's handwriting.**
           3. Under it, **a second note in 小雨's handwriting.**
Dialogue
| id | speaker | zh-TW | en |
|---|---|---|---|
| dlg_e0_05_01 | (林建國's note) | 錢,你拿到了。 | You got the money. |
| dlg_e0_05_02 | (小雨's note) | 髮夾還我。 | Give me back my hair clip. |

Camera     Close on the notes, then his face as it finally dawns on him. (The candidate "never
           suspects" during the run. This is after the run, and it hits him all at once.)
Becomes    `event_e0_05_suitcase_contents` · **payoff: hair clip (P-05)**

### E0-06 — Removed
On screen  His broken phone buzzes on the table. Through the cracked screen:
           **「媽媽 已將你移出『陳家相親相愛一家人』」**
           *(Mom removed you from "Chen Family, One Big Loving Family")*
           He looks up. His mother raises the slipper. **Cut to black.**
Audio      `sfx_slipper_whoosh` over black. A distant *thwack*.
Becomes    `event_e0_06_removed`

### E0-07 — Credits
On screen  Credits roll over a still of the suitcase on the coffee table, the slipper beside it.
           Title of the ending: **「一百萬」**.

### E0-08 — The next morning (after credits)
On screen  Morning at the Lin estate's front steps. The suitcase is sitting by the door, **closed,
           with a lunchbox on top.** Note: 「趁熱吃。」 林媽媽 opens the door, sees it, and smiles.
           Then the prompt:
Dialogue
| id | speaker | zh-TW | en |
|---|---|---|---|
| dlg_e0_08_01 | UI | 要回到 18:25 嗎? | Go back to 18:25? |

Gameplay   **Yes** → load `checkpoint_s4_choice` (the suitcase on the ramp, same clock, same
           score so far). **No** → title. `endings_seen += E0`.
Becomes    `event_e0_08_next_morning`

---

## E1 — 「下週日再來」 *(Come back next Sunday)*: approved

Two versions by score. Both end the same way.

### E1a — Better than both of us (total ≥ 72)
Dialogue
| id | speaker | zh-TW | en |
|---|---|---|---|
| dlg_e1a_01 | 林建國 | *(quiet for a long moment)* ……你比我們兩個都強。 | …You're better than both of us. |
| dlg_e1a_02 | 爸爸 | *(stands up so fast his chair falls over)* 我兒子!! | That's my son!! |
| dlg_e1a_03 | 二姑 | ……西瓜也還在。 | …And the melon survived. *(only if melon intact)* |

On screen  Thirty-two years of losing by one point, gone in one second. His dad hugs him. His mom
           films it.

### E1b — A draw (total 70–71)
Dialogue
| id | speaker | zh-TW | en |
|---|---|---|---|
| dlg_e1b_01 | 林建國 | *(looks at 陳志強)* ……平手。 | …A draw. |
| dlg_e1b_02 | 林建國 & 爸爸 | *(at the same time)* 下週日再比。 | Rematch next Sunday. |

### E1 — shared ending
On screen
1. 林建國, without looking at him, **slides a plate of cut fruit across the table.** It is the
   highest honour in the game. **If the showpiece melon survived, the fruit is that melon.**
   Otherwise it's apples (二姑's pointed choice).
2. **His mother slides a second plate** next to it.
3. He takes the hair clip out of his pocket and gives it to 小雨.
4. 小雨 hands him **his phone, repaired.** It buzzes:
   **「林小雨 已將你加入『林家相親相愛一家人』」** *(林小雨 added you to "Lin Family, One Big
   Loving Family")*. Then it buzzes **four hundred times**: an avalanche of good-morning stickers
   with lotus flowers and sunsets. The last one is from 外婆's account: 「早安」 *(Good morning)*. It
   is 19:42.
5. Across the table, his mother adds 林媽媽 to the Chen family chat.

Dialogue
| id | speaker | zh-TW | en |
|---|---|---|---|
| dlg_e1_01 | 小雨 *(taking the clip)* | 我故意掉的。 | I dropped it on purpose. |
| dlg_e1_02 | 林建國 | 你被批准了。下週日再來。 | You're approved. Come back next Sunday. |
| dlg_e1_03 | 林建國 *(if `flag_late`)* | ……下次早一點。 | …Come earlier next time. |

Credits    Over a photo the cousin takes: both families around the table, everyone holding up fruit.
Unlock     E1a → `unlock_1994` (title menu: 一九九四). Then post-credits PC-01.
Becomes    `event_e1a_better_than_both`, `event_e1b_draw`, `event_e1_approved`

---

## E2 — 「重考」 *(Retake)*: below 70

Dialogue
| id | speaker | zh-TW | en |
|---|---|---|---|
| dlg_e2_01 | 林建國 | *(looks at the son, then at the father)* 下週日再來。 | Come back next Sunday. |
| dlg_e2_02 | 林建國 *(to 陳志強)* | 你也一起。 | You too. |
| dlg_e2_03 | 爸爸 | …………好。 | ……Fine. |
| dlg_e2_04 | 小雨 | 我會等你。 | I'll wait for you. |

On screen  Over the credits, **a father-and-son training montage**: shadow-boxing in the park at
           dawn, running temple stairs, carrying watermelons (carefully), dad shouting 「手放低!」,
           and mom filming all of it for the family chat.
Then       Post-credits PC-01.
Becomes    `event_e2_retake`

---

## E3 — 「菜涼了」 *(The food's gone cold)*: very late

On screen  The table has been cleared. Both families have been waiting in the living room. The
           reveal has played over a bare table (D-01 variant).
Dialogue
| id | speaker | zh-TW | en |
|---|---|---|---|
| dlg_e3_01 | 小雨 | 我朋友問我為什麼還在等。 | My friends asked me why I was still waiting. |
| dlg_e3_02 | 媽媽 *(quietly, to his father)* | ……跟你一樣。 | …Just like you. |
| dlg_e3_03 | 爸爸 | 我那年沒遲到! | I wasn't late that year! |
| dlg_e3_04 | 二姑 | 你遲到了。 | You were late. |
| dlg_e3_05 | 林建國 | 再說吧。 | We'll see. |

On screen  No fruit plate. 小雨 doesn't take the hair clip back. Credits are quiet.
Then       A prompt: 「再跑一次?」 *(Run it again?)* → new run. No post-credits.
Becomes    `event_e3_cold`

---

## Game over

### G-01 — Waking up
Trigger    力 reaches 0 and `game_overs < ATTEMPTS`
On screen  Fade to white. He wakes somewhere safe, **carried there by someone.** A blanket over
           him, and a note in neat handwriting (**the same handwriting as the lunchbox note**):

| Stage | Where he wakes |
|---|---|
| 1 | A bench under the arcade roof, a towel over his head |
| 2 | The campus nurse's office, an ice pack on his forehead |
| 3 | A garden pavilion, with a cup of warm tea beside him |
| 4 | The back seat of a limousine, seatbelt fastened |
| 5 | A guest bedroom, slippers lined up by the bed |

Dialogue
| id | speaker | zh-TW | en |
|---|---|---|---|
| dlg_g_01_01 | (note) | 休息一下,再去。 | Rest a bit. Then go again. |

Gameplay   Restart at the current section's start. `game_overs += 1`; clock +5 game-minutes;
           力 refilled. The attempt count is shown as small pips on the note (no text).
Becomes    `event_g_01_wake_up`

### G-02 — Carried to dinner
Trigger    力 reaches 0 and `game_overs == ATTEMPTS`
On screen  Fade to white. Through blurred vision: the ceiling of a corridor passing overhead; he is
           being carried by several people. A voice: 「小心頭。」 *(Mind his head.)* Then black.
Gameplay   `flag_carried_in`, `flag_very_late`. Skip the rest of the run, the final boss included.
           Go to R-01 (variant: he wakes at the table).
Becomes    `event_g_02_carried_in`

---

## PC-01 — 「第2次」 *(Visit #2)*: post-credits

After E1a, E1b and E2.
On screen  Next Sunday, 17:00. The same street near campus. He is in the blue shirt again, and his
           mother ironed it again. 小雨 is beside him. A black van pulls up. The door slides open.
           **This time the men in black are joined by his own father, in a black suit and
           sunglasses, giving him a tiny thumbs-up.**
Dialogue
| id | speaker | zh-TW | en |
|---|---|---|---|
| dlg_pc_01_01 | 黑衣人 | 不好意思。 | Sorry about this. |
| dlg_pc_01_02 | {name} | ……又來?! | …Again?! |

Title card **「第2次」**. Unlocks **Visit #2** (hard mode: enemy aggression and damage ×1.3, help-up
window 7 s, clock 12 s per game-minute; tuning in data).
Becomes    `event_pc_01_visit_two`

---

## X — Bonus stage 「一九九四」 *(1994)*

Unlocked by E1a. Started from the title menu. Short: one stage, about 6 minutes.
Level: `level_bonus_1994` (re-uses Stage 1 art with a **CRT filter, a reduced 16-colour palette,
1994 shop signs and props**).

### X-01 — Title
On screen  A VHS tracking wobble. 「一九九四」. A pager beeps (**BB.Call**).
Becomes    `event_x_01_title`

### X-02 — The van, 1994
On screen  A young woman with a 90s perm (**雅芳, now 林媽媽**) is pulled into a boxy black van
           by three men in black with big shoulder pads. A **young man in a denim jacket** watches,
           then runs after it. **This is 陳志強, the candidate's father, age 22.** The player plays
           him: a "young dad" look with Felix's moveset and a different sprite.
Becomes    `event_x_02_van_1994` · `character_young_dad`

### X-03 — Market Row, 1994
Gameplay   Stage 1 sections 1 and 4 remixed with 1994 enemies (perms, pagers, a cassette-player
           "boombox" enemy). Score is tracked but not shown.
Becomes    `event_x_03_market_1994`

### X-04 — The fruit stall, 1994
On screen  The same stall, newer paint. Behind the counter a **teenage 二姑** (15, ponytail)
           guards the showpiece melon with a scowl. Boss fight: teen 二姑, same moves, faster.
Becomes    `event_x_04_fruit_stall_1994` · `boss_fruit_aunt_teen`

### X-05 — History
Variants

| Case | What happens |
|---|---|
| **The melon is smashed** (history) | The fight ends as in 1994. Cut to the 1994 dining room. Young 林建國 holds a form: 71. Young 陳志強 holds his: **70**. A young waitress with a fruit plate stops beside him and smiles: 「吃點水果吧。」 *(Have some fruit.)* Freeze-frame. Then dissolve to the trophy on the shelf in P-01: 「1994 · 第二名」. End. |
| **The melon is spared** (changing history) | Teen 二姑 points up the road and the run continues… then **the screen glitches.** A photo of the candidate and 小雨 together appears in the corner and **starts to fade**, as if neither of them will ever exist (a *Back to the Future* gag). Caption: **「歷史不能改。」** *(History can't be changed.)* The tape **rewinds**, with VHS noise, to the start of X-04. The melon is back on its cushion. |

Dialogue
| id | speaker | zh-TW | en |
|---|---|---|---|
| dlg_x_05_01 | 女服務生 (young mom) | 吃點水果吧。 | Have some fruit. |
| dlg_x_05_02 | UI | 歷史不能改。 | History can't be changed. |

Becomes    `event_x_05_history` · `endings_seen += X`

### X-06 — Back to the title
On screen  The present-day title screen, with one change: on the street, the black van is parked
           and **two old men** are leaning on it, arguing and pointing at each other.
Becomes    `event_x_06_return`
