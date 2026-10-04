# Flux: paste-ready art prompts

[← art README](README.md) · Other tools: [Gemini](gemini.md) · [Midjourney](midjourney.md) · [ComfyUI](ComfyUi.md)

This file is the art briefs ([`README.md`](README.md), [`characters.md`](characters.md),
[`enemies.md`](enemies.md), [`backgrounds.md`](backgrounds.md),
[`props-items-ui.md`](props-items-ui.md)) rewritten for **Black Forest Labs' Flux** models.
**The briefs stay the source of truth.** If a brief changes, change it there first, then update
this file.

Running Flux **locally** (FLUX.2 [dev], FLUX.1 [dev] + LoRAs, Kontext [dev]) is covered in
[`ComfyUi.md`](ComfyUi.md). The prompts below work there too.

---

## 1. What Flux is good for here

| Strong | Weak |
|---|---|
| **Precise prompt following**: long costume descriptions come out right | **True pixel grids.** The cleanup pass is still required |
| **Exact colours**: FLUX.2 follows **hex codes** (`#A9CBEA`), so it can match the briefs' palette | **No negative prompt.** "No X" has to be written as a positive description |
| **Editing** with a reference image (FLUX.2, FLUX.1 Kontext): new pose, broken state, recolour | Prompts are standalone: the style block is pasted every time |
| **Several reference images at once** (FLUX.2): face portrait + style reference + sheet | Less "atmosphere for free" than Midjourney |

**Use Flux for:** sprites and props where colours must match the briefs, state and pose edits,
and anything you want to script through an API later.

---

## 2. Which model, where

| Model | Use it for | Where |
|---|---|---|
| **FLUX.2 [pro] / [flex]** | Main generator: best prompt following, hex colours, several reference images, edits | BFL Playground (playground.bfl.ai), BFL API, fal.ai, Replicate, Krea |
| **FLUX.1 Kontext [pro] / [max]** | Editing one image: "same character, new pose", "same prop, broken" | Same places |
| **FLUX.2 [dev]**, **FLUX.1 [dev]** + pixel-art LoRA, **Kontext [dev]** | Local, free, batchable | ComfyUI ([`ComfyUi.md`](ComfyUi.md)) |

Names and versions change. Use the newest FLUX.2 model your host offers.

**Settings:** the default steps are fine. With [dev] models, guidance **2.5–3.5**. Fix the
**seed** when you like a result, and reuse it for variants.

---

## 3. How to write a Flux prompt

1. **Subject first, style after.** Flux weighs early words more. A prompt here is
   **SUBJECT + STYLE BLOCK** (§4).
2. **No negatives.** Flux has no "avoid" field, and "no text" can sometimes *add* text. Describe
   what *is* there instead: "blank signs", "a plain flat magenta background", "a plain circular
   badge". The style blocks already do this.
3. **Hex colours work** (FLUX.2): "a pale blue shirt (#A9CBEA)". The character entries include
   the brief's colours.
4. **References** (FLUX.2): attach up to several images and name them in the prompt ("the face
   from image 1, the style of image 2").
5. **Optional JSON prompt** (FLUX.2 accepts structured prompts). Good for scripting:

```json
{
  "subject": "A cheerful young man, about 21, short black messy spiky hair, round thin black glasses, big open grin",
  "outfit": "pale blue (#A9CBEA) short-sleeve button-up shirt untucked, dark grey (#4A4A55) jeans, white sneakers with a red stripe",
  "pose": "fighting stance, fists up, knees slightly bent",
  "style": "chibi pixel-art game sprite, modern Kunio-kun / River City style, 2.5 heads tall, 1-pixel #1A1018 outline, flat cel colours, crisp square pixels",
  "framing": "full body, 3/4 side view facing right, feet on the bottom edge",
  "background": "plain flat solid magenta #FF00FF"
}
```

---

## 4. Style blocks (paste after the subject)

Keep these in a text file next to you. Most hosts don't store templates. If you'd rather not paste
by hand, a small script can join them; see §12.

**STYLE-SPRITE** (characters, enemies)

```
Pixel-art game sprite in the style of the modern Kunio-kun / River City (熱血物語) beat-'em-up games. Chibi proportions, about 2.5 heads tall: a big blocky, slightly square head, a short compact body, short thick limbs, big mitten-like fists and big shoes. A very simple face: small black dot eyes, thick black eyebrows, a short line mouth. A solid 1-pixel very dark brown-black (#1A1018) outline. Flat cel colours, each with one darker shadow tone, crisp square pixels with hard edges, like a 32×48-pixel sprite enlarged. Saturated 16-bit colours. One character, full body, 3/4 side view facing right, feet on the bottom edge, alone on a plain flat solid magenta (#FF00FF) background. Clean surfaces: plain clothing with blank badges. A friendly, comic, family-friendly look.
```

**STYLE-SHEET** (character reference sheets; not pixel art)

```
A character reference sheet in clean flat-colour cartoon style, chibi proportions about 2.5 heads tall with a big square head, small dot eyes and thick black eyebrows, bold clean dark outlines, flat colours with one shadow tone. Laid out on a plain white background: a front view, a 3/4 side view facing right and a back view of the full body, plus three head close-ups showing a neutral, a shouting and a surprised expression. The sheet contains only the drawings.
```

**STYLE-BG** (backgrounds)

```
Detailed pixel-art background for a side-scrolling beat-'em-up game, in the style of the modern Kunio-kun / River City (熱血物語) games. Seen from the side and slightly above (about 25–30 degrees). The top eighth is sky or roof edge; the back wall of buildings fills the upper-middle band; a wide, flat, empty walkable ground strip fills the lower half and recedes into depth, with small details only along its back edge; the bottom edge is a kerb or floor edge. Rich fine pixel detail, crisp square pixels, hard edges. The far distance is softly blurred like a tilt-shift photo; the floor and back wall are sharp. Cinematic lighting with gentle bloom. Set in Taiwan. An empty scene: every sign, banner, plaque and board is blank, and no people are present.
```

**STYLE-PROP** (props, items, effects)

```
Pixel-art game prop in the style of the modern Kunio-kun / River City (熱血物語) games: a single object centred, seen from the side and slightly above, a 1-pixel very dark brown-black (#1A1018) outline, flat cel colours with one shadow tone, crisp square pixels, cartoon and harmless. Alone on a plain flat solid magenta (#FF00FF) background. Any paper, label or plaque on it is blank.
```

**STYLE-UI** (UI pieces)

```
Game UI art, pixel-styled to match a retro 16-bit beat-'em-up HUD: chunky pixel frames, flat colours, crisp hard edges. Purely graphic: frames, bars, icons and empty spaces where the game will write its labels later.
```

---

## 5. Edit templates (FLUX.2 or Kontext, with the approved image attached)

**New pose:**
```
Change only the pose: <POSE>. Keep the same character exactly: the same face, hair, outfit, colours, outline, proportions and pixel scale, the same 3/4 view facing right, the same plain magenta background.
```

**Recolour (crowd variants `__b`, `__c`):**
```
Recolour only the clothes and hair: <NEW COLOURS / CHANGES>. Keep the pose, body, face, outline and pixel style exactly the same, on the same magenta background.
```

**State change (props):**
```
Show the same object in a new state: <STATE>. Keep the same size, position, camera angle, colours and pixel style, on the same magenta background.
```

**Background variant:**
```
Change only <WHAT>: <CHANGE>. Keep the composition, camera, buildings and floor exactly the same.
```

---

## 6. Sizes (multiples of 16)

Generate at these sizes, then downscale with nearest-neighbour by the factor shown (README §2.2).

| Asset | Generate | ÷ | Final |
|---|---|---|---|
| Character sheet | 1536×1024 | — | reference |
| Standard sprite | 768×1152 | 24 | 32×48 |
| 二叔 BAN | 768×896 | 16 | 48×56 |
| Child (小樂) | 768×1152 | 32 | 24×36 |
| Toddler | 768×1152 | 48 | 16×24 |
| Dog | 1024×768 | 32 | 32×24 |
| Cheer pyramid | 768×1024 | 16 | 48×64 |
| HUD portrait / select portrait | 1024×1024 | 32 / 8 | 32×32 / 128×128 |
| Background, 1 screen | 1920×1088 → crop to 1920×1080 | 4 | 480×270 |
| Background, 2 screens | 2880×816 → crop to 2880×810 | 3 | 960×270 |
| Props | about 32× the final size, rounded to 16 | 32 | as listed |

---

## 7. Characters

### 7.0 Pose lists

**Standard fighter poses** (every fighter). Use each with the "New pose" edit (§5):

```
idle: fighting stance, fists up, knees slightly bent
walk: mid-stride, walking to the right
run: running hard, leaning forward
punch: a straight punch forward, the fist fully extended
kick: a front kick forward, the leg extended
jump: in the air, knees tucked
hurt: recoiling backwards, eyes squeezed shut
knocked_down: lying flat on the back, cartoon, arms out
dazed: sitting on the ground, legs out, rubbing the head, three small yellow stars circling above the head
get_up: pushing up from the ground, one knee down
bow: a polite bow from the waist
wave_leave: walking away, waving over the shoulder
```

**Extra poses for the player's three looks:**

```
help_up: bending forward, offering a hand down to someone sitting on the ground
pick_up: crouching to pick something up from the ground
drink_tea: holding a tiny teacup with both hands, sipping politely
heavy: belly slightly round from too much tea, shoulders slumped, slow and content
soaked: dripping wet, hair flat, a puddle at the feet, grumpy face
too_warm: shirt buttoned and zipped up to the chin, red cheeks, sweat drops
force_fed: cheeks stuffed like a hamster, a spoon in the mouth, eyes wide
guard: arms crossed in front of the face, braced, shielding someone behind
carry_suitcase: holding a big silver suitcase with both hands in front, arms straining, leaning back
shocked: jaw dropped, eyebrows high
fainted: sitting, dizzy, swirly eyes
victory: one fist in the air
bike_ride: riding an orange shared bicycle with a plain frame, pedalling hard
```

### 7.1 The candidate: three looks

All three wear **the pale blue shirt his mother ironed**. Attach the face portrait as reference
image 1: "the face, hair shape and glasses of the person in image 1, redrawn in chibi style".
Shared colours: shirt `#A9CBEA` (shadow `#6F93B8`), skin `#F4C7A1` (shadow `#D9A27E`).

**`character_felix`** (Balanced). Reference: `docs/images/felix.png`

```
A cheerful young man, about 21, with the face, hair and glasses of the person in image 1: short black messy spiky hair with tufts sticking up, round thin black-rimmed glasses always visible, a round face, a big open happy grin, average build. A pale blue (#A9CBEA) short-sleeve button-up shirt worn untucked, dark grey (#4A4A55) jeans, white sneakers with a red stripe. Skin #F4C7A1.
```
Prompt = subject + **STYLE-SHEET** for `__sheet`; subject + `Pose: fighting stance, fists up.` + **STYLE-SPRITE** for `__idle`.
Specials (pose edits): `special_1` a blur of rapid fists punching forward with motion lines ·
`special_2` spinning in mid-air with one leg out, a white swirl around him · `special_3` standing
tall, fists clenched, determined, a red-orange flame aura around his body.

**`character_lucian`** (Speed). Reference: `docs/images/lucian.png`

```
A slim, quick young man, about 21, with the face and hair of the person in image 1: a dark brown-black mop of hair with a jagged fringe covering the forehead down to the eyebrows, no glasses, a calm, slightly smug closed-mouth smile, a slimmer face, a faint blush. Lean, light build. A pale blue (#A9CBEA) button-up shirt with the sleeves rolled to the elbow, black slim (#26262E) trousers, white low sneakers. Skin #F4C7A1.
```
Idle pose: `leaning forward, light on his feet, ready to dash.` Specials: dashing forward as a
horizontal blur with speed lines · in mid-air kicking downwards in a flurry · in a stance with two
translucent blue afterimages of himself beside him.

**`character_hilman`** (Power). Reference: `docs/images/hilman.png`

```
A big, broad, friendly young man, about 21, with the face and hair of the person in image 1: dark brown hair with a long side-swept fringe, rosy pink cheeks, a huge toothy grin. A heavy, powerful build with wide shoulders and thick arms that fill the full width of the frame. A pale blue (#A9CBEA) button-up shirt stretched tight across the shoulders with the top button open, khaki (#B49A6A) cargo trousers, brown work boots. Skin #F4C7A1.
```
Specials: both fists lifted high overhead about to slam down · punching the ground with crack
lines and dust spreading · a red face with steam puffing from his ears, cartoon angry.

**Portraits:** `ui_portrait_<look>__normal` / `__hurt` / `__shocked`. Edit the approved sprite:
`A 1:1 head-and-shoulders portrait of the same character in the same pixel style, facing right, <determined | one eye shut, teeth gritted | mouth open, eyebrows high>, on magenta.`
`ui_select_portraits__<look>`: the same at 1024×1024, more detail, confident smile.

### 7.2 Main cast

For each: subject + **STYLE-SHEET** → approve → subject + idle pose + **STYLE-SPRITE** → the pose
edits (§5).

**`npc_cloris`** 林小雨. Reference: `docs/images/rain.png`. **Calm in every scene, never
frightened.**
```
A calm, gentle young woman, about 21, with the face and hair of the person in image 1: dark maroon-brown (#5A2124) straight shoulder-length hair with wispy centre-parted bangs, an oval face, a soft closed-mouth smile, a faint blush. A cream (#EDE3CF) knit cardigan over a white blouse, a navy (#2C3A5A) pleated midi skirt, white canvas shoes, a small white rabbit-shaped hair clip on the left side of her hair. Composed and quietly confident.
```
Poses: `walk` walking calmly · `led_away` two hands from off-frame holding her arms, she calmly
looks back over her shoulder · `seated_straight` sitting at a table, back straight, hands in her
lap · `stand` · `smile` · `blush_idiot` eyes half closed, a small blush, a fond look ·
`take_clip` holding the rabbit hair clip, smiling · `disappointed` eyes down, arms folded ·
`hand_phone` holding out a phone. Variant `__no_clip`: the same without the hair clip.

**`boss_lin_jianguo`** 林建國, the final boss. Reference: `docs/images/vincent.png`
```
A calm, kind-looking man of about 54 with the face of the person in image 1: mostly bald on top with a few thin strands sticking up, dark brown hair on the sides and back, rectangular brown-rimmed glasses, a round chubby face, a small gentle smile, slightly portly. A charcoal-navy (#2B3242) mandarin-collar jacket with cloth knot buttons over a white shirt, grey trousers, black cloth shoes, a pair of chopsticks in his hand. Dignified, unhurried, wealthy but understated.
```
Idle pose: `seated at a dining table on a plain chair, chopsticks raised, calm`. Poses:
`seated_jab` a lightning-fast chopstick poke with motion lines · `seated_feed` holding out a
spoonful of food at arm's length · `seated_spin` spinning a glass lazy Susan · `seated_summon`
one hand raised, beckoning · `stand_up` rising from the chair, serious · `stance` feet apart, palms
open, a formal martial stance · `palm_push` a slow wide two-handed push · `staggered` leaning
back, glasses askew · `seated_dazed` sitting back, stars circling, rubbing his head, still
dignified · `slide_paper` sliding a blank sheet across a table · `sip_tea` · `watch` checking his
wristwatch. Plus the standard poses.
`__young_1994`: `the same man aged 22 in 1994, a full head of thick black hair, big 1990s glasses, a white shirt, black slacks, nervous but determined.`

**`boss_driver`** 林媽媽, "the Driver"
```
An elegant, composed woman in her early 50s with a glossy black chin-length bob and pearl earrings, wearing a black baseball cap, large dark sunglasses, a long belted camel (#B88B5A) trench coat, black leather driving gloves, black trousers and black ankle boots. Cool, silent, mysterious, a hint of a smile.
```
Idle: `pulling on a glove finger by finger`. Poses: `card_swipe` a fast horizontal slash with a
plain black card, a gold sparkle trail · `bag_swing` swinging two big plain shopping bags, one
white, one black, rope handles · `key_fob` clicking a car key fob, arm out · `question` pointing,
asking sharply · `climb_in` stepping up into a van · `nod` a tiny nod over her shoulder. Plus the
standard poses.
Variants: `__dinner` seated at a table in a dark green silk blouse, sunglasses on, the black cap
on the table · `__reveal` sunglasses off and folded in her hand, a warm smile · `__young_1994`
the same woman aged 20 in 1994, a big 1990s perm, a white 1990s dress with puffed sleeves.

**`npc_mom_home`** → **`boss_lunch_lady`**. **Make the lunch lady by editing the approved
`npc_mom_home` sheet** so the eyes, eyebrows and build carry over.
```
A warm, slightly plump Taiwanese mother in her early 50s, short permed curly dark-brown hair, a round friendly face, bright arched eyebrows. A pink floral (#E7A0B4) blouse, a grey cardigan, beige trousers. Loving but bossy.
```
Poses: `ironing` at an ironing board, ironing a pale blue shirt · `sofa_dark` sitting on a sofa
in the dark, arms folded, a blue-and-white plastic slipper in one hand · `raise_slipper` ·
`filming` holding up a phone, delighted.

Edit to the disguise:
```
Dress the same woman, keeping her exact eyes, arched eyebrows and body shape, as a school cafeteria lunch lady: a white hairnet cap covering all her hair, a light-blue surgical mask over her nose and mouth, a white apron worn over her pink floral (#E7A0B4) blouse, which stays visible at the collar and sleeves, white sleeve covers, blue-and-white plastic slippers, a big ladle in her hand. Stern but caring eyes. Funny, not scary.
```
`boss_lunch_lady` poses: `idle` holding a blue-and-white slipper like a weapon, the ladle in the
other hand · `slipper_throw` an overhand throw · `zip_grab` reaching forward with both hands as if
zipping someone's jacket to the chin · `feed` holding out a spoon · `point_question` one finger
pointing, scolding · `full_name` leaning back, mouth wide open, shouting with all her might,
hairnet strands flying, shockwave lines · `fix_collar` reaching up to straighten a collar, tender ·
`give_lunchbox` holding out a lunchbox with both hands · `unmask` the mask pulled down to her chin,
a phone in the other hand, beaming. Plus the standard poses.
`npc_mom_young`: `the same woman aged 20 in 1994, a caterer's waitress with a ponytail, a white blouse and black vest, holding a plate of cut fruit, a shy smile.`

**`npc_dad_home`** → **`boss_straw_hat`** (edit the approved dad sheet the same way)
```
A quiet, proud Taiwanese father of about 54, short neat black hair greying at the temples, a square jaw, a calm face, white athletic tape wrapped around his knuckles. A plain white T-shirt, grey sweatpants, house slippers, a newspaper in his hand.
```
Poses: `newspaper` hidden behind an open newspaper with blank columns · `lower_paper` lowering it
to look over the top · `sofa_dark` sitting in the dark, a fake grey beard in his lap · `shout`
cupping his mouth · `shadow_box` · `chair_fall` jumping up so fast his chair falls, both arms up.

Edit to the disguise:
```
Dress the same man, keeping his face shape and build, as a would-be old hermit: a wide-brim woven straw sun hat, an obviously fake long grey beard held on by a visible elastic strap over his ears, a loose beige linen shirt, grey trousers rolled at the ankles, black cloth shoes, a folded wooden Chinese chess board under his arm. Trying hard to look wise, badly.
```
`boss_straw_hat` poses: `seated_chess` seated, studying a xiangqi board · `chariot` charging
with the board held like a shield · `cannon` flicking a round chess piece in a high arc ·
`checkmate` lunging with both hands to pin someone down · `beard_slip` the fake beard hanging
half off one ear · `unmask` hat in one hand, peeling the beard off with the other. Plus the
standard poses.
Variants: `__black_suit` a black suit and sunglasses, a tiny thumbs-up · `npc_dad_young` the same
man aged 22 in 1994, a middle-parted curtain haircut, a denim jacket over a white T-shirt, light
jeans, white high-top sneakers, energetic (**playable: the full player pose set**).

**`boss_fruit_aunt`** 二姑
```
A sturdy, sun-tanned Taiwanese market woman in her late 40s, hair in a bun under a patterned headscarf, a towel around her neck, a red (#C8423A) apron printed with small fruit, colourful floral sleeve covers, white rubber boots, a big green watermelon in each hand. Fierce, proud, protective of her stall, comic.
```
Poses: `melon_bowl` rolling a watermelon along the ground · `durian_toss` throwing a spiky durian
overhead · `ripeness_grab` squeezing someone's arm like testing fruit, unimpressed · `shove` a
shoulder charge · `sit_wreckage` sitting in a pile of broken fruit, devastated, cartoon · `point`
pointing up the road · `stern` arms folded · `seated_dinner` seated in a plain blouse, arms folded,
almost smiling. Plus the standard poses.
`boss_fruit_aunt_teen`: `the same woman aged 15 in 1994, a high ponytail, an oversized 1990s T-shirt, the same red apron, too big for her, a scowl.`

**`boss_ban`** 二叔 (768×896)
```
An enormous, round, jolly Taiwanese uncle, a shaved bald head, eyes always closed in happy crescents, a huge warm smile, a small neat goatee. A cream linen tang-style jacket with frog buttons, matching trousers, black cloth shoes. Seated on a tiny folding stool behind a small folding table, pouring tea from a small clay teapot. Immovable, hospitable, delighted.
```
Poses: `offer_cup` holding out a tiny cup with both hands, beaming · `knocked_sit_pour` knocked
onto his bottom, already pouring another cup, smiling · `laugh_step_aside` · `bow_tray` bowing
with a tea tray · `pack_up` folding the tea set, serious for once.

**`npc_ken`** 三叔
```
A friendly, confident traffic police officer in his late 40s, short hair, a white peaked cap, a white short-sleeve uniform shirt with plain unmarked badges, a fluorescent yellow-green reflective vest, white gloves, dark navy trousers, black shoes, a whistle, standing on a small round white-and-blue traffic podium with one arm stretched out directing traffic.
```
Poses: `whistle` cheeks puffed · `point` up the road · `bow`.

**`boss_howard`** 大表哥 林家豪
```
A polished, overachieving young man of about 28, neat slicked side-parted hair, a pleased confident smile, a plain pale pink polo shirt with a plain cardinal-red sweater tied over his shoulders, beige chinos, brown loafers, a smartphone in hand. Humble-bragging, never mean.
```
Poses: `humble_brag` hand on chest, eyes closed, sparkles · `textbook_throw` throwing three thick
textbooks in a fan · `speech` lecturing from index cards, a sleepy "zzz" aura · `selfie` taking a
selfie while bowing · `group_photo` holding a phone up for a group photo. Plus the standard poses.

**`npc_xiaole`** (child)
```
A serious 9-year-old boy with big round glasses and a bowl haircut, a white school shirt, navy shorts, white socks, sitting at a tiny folding desk doing homework in a workbook, never looking up. Child-sized: smaller than an adult.
```
Poses: `throw` flicking an eraser over his shoulder without looking · `pack_up` closing the
workbook, satisfied.

**`npc_toddler`**
```
A chubby, cheerful 3-year-old girl in a red mini qipao with gold trim, two pigtails tied with red pom-poms, chubby cheeks, toddling happily. Very small.
```
Poses: `tiny_punch` · `giggle` · `soup_splashed` dripping with soup, delighted, arms up ·
`clap` clapping in a wooden high chair · `point`.

**`npc_waigong_portrait`** (768×1024 → 48×64; use **STYLE-PROP**)
```
A dignified painted oil portrait in an ornate gold frame: an elderly Taiwanese matriarch around 80, silver hair in a neat bun, a dark navy qipao, a jade bangle, sitting upright with a faint knowing smile.
```

---

## 8. Enemies

Prompt = subject + **STYLE-SPRITE**. Every enemy also needs the standard fighter poses (§7.0) via
pose edits. Crowd variants `__b`, `__c`: the "Recolour" edit (§5) on each finished `__a` image.

| Id | Subject | Attack poses |
|---|---|---|
| `enemy_office_worker` | `A polite, tired salaryman with neat short hair, a white shirt with rolled sleeves, a loose tie with a tiny plain gold pin, dark trousers, black shoes, swinging a brown leather briefcase, an apologetic face.` | `briefcase_swing` a horizontal swing · `briefcase_combo` the backhand second swing. `__b` glasses, a moustache, a light grey shirt, a navy tie · `__c` a woman in a blouse and pencil skirt with a ponytail |
| `enemy_scalper` | `A wiry street ticket scalper in a backwards cap, a loud Hawaiian-print shirt, a bum bag across his chest, shorts and flip-flops, holding a fan of blank paper tickets, a sly but friendly grin.` | `ticket_throw` flicking tickets in a spread · `retreat` hopping backwards |
| `enemy_delivery_rider` | `A cheerful food-delivery rider in a plain orange jacket, a white open-face helmet with the visor up, a big plain orange square insulated backpack, jeans and sneakers.` | `bag_dash` dashing shoulder-first with the backpack, speed lines |
| `enemy_basketball_player` | `A sporty university student in a red basketball jersey with a white number 7, a white headband, shorts, high socks and basketball shoes, holding a basketball, a confident grin.` | `chest_pass` · `dunk_leap` leaping high, the ball overhead |
| `enemy_cheerleader` | `An energetic university cheerleader in a modest blue-and-white long-sleeve top and knee-length pleated skirt, white sneakers, blue and white pom-poms, a high ponytail, cheering. Family-friendly.` | `cheer` pom-poms up. `__b` a boy in the same colours with shorts · `__c` a girl with short hair |
| `enemy_cheerleader__pyramid` (768×1024) | `Three cheerleaders in a wobbling human pyramid, two at the bottom and one on top, modest blue-and-white uniforms.` | `pyramid_collapse` the pyramid toppling sideways, cartoon |
| `enemy_club_recruiter` | `An over-eager university club recruiter in a hoodie and jeans with a lanyard and a clipboard, pushing a thick stack of colourful flyers forward with a huge hopeful smile.` | `flyer_grab` lunging to stuff flyers into someone's arms · `fan_flyers` sitting dazed, fanning himself with flyers |
| `enemy_library_auntie` | `A prim middle-aged librarian in a beige cardigan and a long skirt, reading glasses on a beaded chain, hair in a neat bun, one finger to her lips.` | `shush` eyes closed, a wide pale-blue ripple aura |
| `npc_student_reader` | `A university student sitting at a library table, head down, reading a thick book, absorbed.` | seated only; 3 recolours |
| `enemy_groundskeeper` | `A friendly estate groundskeeper in green overalls with a small plain round badge on the chest, a conical straw farmer's hat, rubber boots and work gloves, holding a bamboo rake.` | `rake_sweep` a low sweeping swing |
| `enemy_guard_dog` (1024×768) | `A big fluffy cream-coloured dog like an Akita, a curled tail, a smart red collar with a plain round tag, a happy face. Cute, never scary.` | `idle` sitting, tongue out · `charge` · `pause` looking up · `belly_up` rolled over, tail wagging · `dazed` little stars · `follow` trotting |
| `enemy_estate_security` | `A broad, calm estate security guard in a black suit with an earpiece on a curly wire and a small plain lapel pin, short hair, both forearms raised in a solid blocking stance, polite expression.` | `block` · `counter_shove` a two-handed shove |
| `enemy_valet` | `A slick young parking valet in a red waistcoat over a white shirt, a black bow tie, black trousers, swinging a huge ring of car keys.` | `key_whip` |
| `enemy_mechanic` | `A sturdy garage mechanic in dark grey overalls with a small plain badge, a grease smudge on his cheek, a backwards cap, holding a big wrench.` | `wrench_overhead` · `ground_slam` slamming the wrench down, dust |
| `enemy_chauffeur` | `A dignified chauffeur in a grey uniform with a peaked cap and white gloves, holding a long black umbrella.` | `umbrella_shield` the umbrella opened in front · `umbrella_poke` |
| `enemy_men_in_black` | `A tall professional man in a black suit, white shirt, thin black tie, black sunglasses and an earpiece, a small plain lapel pin, an apologetic, polite expression despite the tough look.` | `grab_arm` gently holding someone's arm · `hold_door` holding a van door open · `gentle_takedown` lowering someone to the ground, a hand behind their head. `__b` stocky · `__c` average build · `formation` all three in a triangle (1536×1024) · `__1994` huge shoulder-pad suit, wide tie, big sunglasses, slicked hair |
| `enemy_catering_staff` | `A smart catering waiter in a white jacket and black trousers with neat hair, holding a silver serving tray, a polite smile.` | `roll_throw` throwing dinner rolls in a spread · `tray_block` |
| `enemy_aunt` | `A chatty, glamorous Taiwanese auntie in her 50s dressed up for a family dinner in a purple qipao and a pearl necklace, permed hair, holding a big serving spoon, asking a nosy question with a delighted face.` | `spoon_combo` · `question` leaning in, one finger raised. `__b` a sequinned cardigan, short curly hair · `__c` a floral dress, a big hair clip |
| `enemy_cousin` | `A trendy young adult cousin in a smart polo shirt and sneakers, holding up a phone to take a flash photo, a friendly grin.` | `flash_photo` a white flash burst · `dash`. `__b` a young woman in a cropped jacket · `__c` dyed light-brown hair, a striped polo |
| `enemy_kitchen_staff` | `A proud chef in white chef's whites, a tall chef's hat and a red neckerchief, swinging a big black wok.` | `wok_swing` · `flambe` tilting the wok, a big round cartoon flame puff |
| `enemy_office_worker_1994` | `A 1990s office worker in a big-shouldered suit and a wide tie, a pager on his belt and a brick-sized mobile phone in his hand.` | standard |
| `enemy_perm_guy_1994` | `A 1990s street guy with a big curly perm, an acid-wash denim jacket and high-waisted jeans, striking a cool pose.` | standard |
| `enemy_boombox_1994` | `A 1990s youth in a shiny tracksuit carrying a big boombox on his shoulder, little music notes floating out.` | standard |

---

## 9. Backgrounds

Prompt = subject + **STYLE-BG**. Sizes in §6. Leave the walkable floor clear: stalls, booths,
vases, the van, the tea table and the dining table are **separate props** (§10).

| Id | Size | Subject |
|---|---|---|
| `bg_title_street` | 1 | `A quiet residential street near a Taiwanese university at golden hour, long orange shadows, low apartment buildings with iron window grilles and potted plants on the balconies, a row of parked scooters, streetlights just flickering on, an orange-pink sky. At the far end of the street, a plain black van with its headlights off. Nostalgic, calm, slightly mysterious.` Variant `__no_van`: remove the van |
| `bg_home_living_room` | 1 | `A small, warm, cosy Taiwanese apartment living room at 4:30 in the afternoon, sunlight through lace curtains, a worn fabric sofa, a low wooden coffee table, a TV cabinet, a wall clock, a rice cooker on a side counter, family photos on the wall, an empty spot on the shelf behind the sofa, an ironing board in the middle of the room. Modest, lived-in, loving.` Variant `__night_dark`: night, lights off, one table lamp's warm pool of light by the sofa, deep blue shadows |
| `bg_stage1_market_row` | 2 | `A busy Taiwanese traditional market street at sunset under an orange-pink sky, shopfronts under arcades along the back, colourful vertical neon signs with blank faces starting to glow, striped awnings, hanging lamps, plastic stools, crates and baskets along the shop edges, rows of parked scooters, tangles of overhead cables, a wide paved street in front. Lively, warm, slightly chaotic.` |
| `bg_stage1_junction` | 1 | `A big Taiwanese city crossroads at sunset, zebra crossings, traffic lights, tall buildings with blank billboards, a pedestrian overpass in the distance, an empty centre of the junction, cars and scooters stopped in neat rows along the back edge and sides.` |
| `bg_stage1_arcade_rain` | 2 | `A long covered pedestrian arcade (騎樓) in a Taiwanese city during heavy rain, grey-blue light, the arcade roof covering the back half of the street with two clear gaps, at one third and two thirds of the width, where rain pours through, wet glossy floor tiles reflecting neon shop lights, closed metal shutters, blank shop signs, rain streaks and puddles. Dry covered zones and rainy gaps are easy to tell apart. Moody but not gloomy.` |
| `bg_stage1_loading_bay` | 1 | `A loading bay behind a city market at dusk, two big roll-up metal shutters, one on the left wall and one on the right, stacked crates and pallets, a hand truck, a puddle, fluorescent tubes flickering on, an orange sky above the walls.` |
| `bg_stage1_fruit_stall` | 1 | `A narrow Taiwanese street at sunset at the end of a market, a red and white striped fruit-stall awning at the back centre over an empty counter space, pyramids of watermelons, crates of mangoes, guavas, pineapples and lychees, a hanging scale, hanging lamps, a small plastic stool. Warm orange light. Proud and carefully kept.` |
| `bg_stage2_back_gate` | 1 | `The back gate of a Taiwanese university at blue hour, a wide campus road, red-brick buildings with warm lit windows, palm trees, a gate with a blank name plaque, a row of plain orange shared bicycles at a docking rack near the gate, streetlights, a deep blue sky.` Variant `__exit`: the bike rack in focus |
| `bg_stage2_sports_field` | 2 | `A university sports field at night under bright white floodlights, an outdoor basketball court with hoops at the back, a red running track, bleachers, a chain-link fence, a deep blue sky with the last light of dusk.` |
| `bg_stage2_club_street` | 2 | `A campus walkway at night lined at the back with student club booths under strings of warm fairy lights, blank hand-made banners, guitar cases, board-game boxes, blank posters, balloons, a tree with lights, the front of the walkway clear. A fun student-festival feel.` |
| `bg_stage2_library` | 1 | `A silent university library reading room at night, tall wooden bookshelves along the back wall, long wooden reading tables with green desk lamps, a librarian's front desk on one side, big windows showing a deep blue night sky. Hushed, warm lamp light.` |
| `bg_stage2_cafeteria` | 1 | `A university cafeteria closed for the night, rows of empty tables and plastic chairs, metal serving counters with steam trays along the back, one counter still lit warmly with a big steaming soup pot, a blank menu board, the rest dim blue. Homely, slightly comic.` |
| `bg_transition_bike_road` | 2 | `A road leaving the city at dusk, rice fields and small houses on one side, a dark green forested mountain rising ahead, power lines, a purple-blue sky with the first stars. Simple shapes made for fast scrolling.` |
| `bg_stage3_lower_gate` | 1 | `The foot of a private mountain at dusk, an ornate wrought-iron gate standing open between stone pillars with warm lamps, a blank stone plaque, a smooth private road winding up into lush subtropical forest with ferns and banyan trees, a purple-blue sky.` |
| `bg_stage3_dog_run` | 1 | `A manicured lawn beside a private mountain road at dusk, a neat wooden fence, a luxurious dog house shaped like a miniature villa, dog bowls, trimmed hedges, garden lamps.` |
| `bg_stage3_pond_path` | 2 | `A Chinese garden path on a mountainside at dusk, a koi pond with stepping stones and orange koi, a small arched stone bridge, weeping willows, rocks, rows of paper lanterns along the path, some glowing warmly and some still dark. Peaceful and expensive.` Variant `__lanterns_off`: night, every lantern dark, cold moonlight |
| `bg_stage3_stone_steps` | 2 | `A long flight of stone steps climbing a forested mountainside diagonally from lower left to upper right at nightfall, stone lanterns on both sides, bamboo groves, mist, a small flat landing at the top. The staircase is the walkable area.` |
| `bg_stage3_tea_road` | 1 | `A wide bend of a private mountain road at nightfall with a breathtaking view of a whole city glittering below under a purple-blue sky, a low stone railing along the edge, pine trees, a soft evening mist, the middle of the road calm and empty.` Variant `__night`: later, darker |
| `bg_stage4_ramp_down` | 1 | `A curving concrete ramp leading down into a luxurious underground garage, sleek white LED strips along the walls, a blank level sign, polished grey concrete, cool white-blue light. Modern and expensive.` |
| `bg_stage4_showroom` | 2 | `A luxurious private underground garage lit like a car showroom, a glossy polished floor reflecting everything, white LED ceiling panels, a row of sleek generic unbadged supercars along the back, a vintage limousine, a motorbike on a rotating display turntable, blank number plates. Cool, gleaming, absurdly rich.` |
| `bg_stage4_van_bay` | 1 | `The centre bay of a luxurious underground garage, an empty marked parking space in the middle, generic unbadged supercars on both sides, concrete pillars, bright white LED light, a glossy reflective floor.` |
| `bg_stage4_exit_ramp` | 1 | `A wide concrete exit ramp climbing up and out of a luxurious underground garage, seen from the bottom; at the top an opening to the night with warm floodlight spilling in and a corner turning out of sight; LED strips along the walls; the middle of the ramp empty. Dramatic, quiet and lonely, like a decision.` |
| `bg_stage5_courtyard` | 2 | `The floodlit front courtyard of a grand Chinese-modern mansion at night, a big marble fountain, plain catering vans with their back doors open, a helicopter under a fitted cover on a helipad, a red lacquered main door at the top of wide stone steps, warm golden light from tall windows, an empty space between two pillars and an empty spot beside the door.` |
| `bg_stage5_ancestral_hall` | 1 | `A long, solemn ancestral hall in a Chinese mansion at night, dark carved wooden panels, red lacquer pillars, an altar with incense and candles at the back, rows of small framed family photographs on the walls and one large empty frame space, warm candlelight and gold accents.` |
| `bg_stage5_kitchen` | 1 | `A huge, busy professional kitchen in a mansion, stainless steel counters, roaring wok burners with flames, towers of bamboo steamers, warming trays, hanging ladles, steam everywhere, a pantry door on one side and a door to the hall on the other with a glimpse of a piano. Warm, steamy, energetic.` |
| `bg_stage5_grand_corridor` | 2 | `A long, grand mansion corridor at night, a polished marble floor, carved wooden doors along the back wall with empty pedestals between them, crystal wall lights, a red carpet runner, and at the far right end a pair of enormous ornately carved double doors with warm light glowing underneath.` |
| `bg_dining_room` ★ | 1 | `A grand, warm Chinese mansion dining room at night, a clear empty floor in the centre for a large round table, a chandelier, red and gold decor, carved wooden screens, a coat rack by the door, a door to the kitchen on one side, the broken-open main doors on the other. Warm golden light.` |
| `bg_estate_front_steps_morning` | 1 | `The front steps and red lacquered door of a grand Chinese-modern mansion in soft early-morning light, dew, birds, a peaceful quiet courtyard.` |

### Cutscene stills (480×270, characters allowed)

Prompt = subject + **STYLE-BG**, but **delete the sentence "An empty scene … no people are
present"** and replace it with `Every sign and paper is blank.` Attach the character sheets as
references ("the man from image 1").

> **Open question:** the briefs don't say whether stills showing the candidate need one version
> per look (felix / lucian / hilman). Check before producing them.

| Id | Subject |
|---|---|
| `still_g01_arcade_bench` | `The young man from image 1, in his pale blue shirt, asleep on a bench under a covered arcade, a towel over his head, heavy rain outside, a folded note beside him.` |
| `still_g01_nurse_office` | `The young man from image 1 asleep on a school nurse's office bed, an ice pack on his forehead, a folded note on the side table.` |
| `still_g01_pavilion` | `The young man from image 1 asleep in a garden pavilion under a blanket, a cup of steaming tea beside him, glowing paper lanterns.` |
| `still_g01_limo` | `The young man from image 1 asleep on the back seat of a limousine, seatbelt fastened, a folded note on his chest.` |
| `still_g01_guest_room` | `The young man from image 1 asleep in a luxurious guest bed, house slippers lined up neatly by the bed.` |
| `still_g02_carried` | `A first-person, blurry view looking up at a mansion corridor ceiling, crystal lights passing overhead, hands at the edges of the view as if being carried.` |
| `still_e0_suitcase_table` | `A silver aluminium suitcase on a small coffee table in a dark living room, a blue-and-white plastic slipper beside it.` |
| `still_e1_family_photo` | `Two families together around a round dining table, everyone holding up a piece of fruit, laughing.` (attach the sheets) |
| `still_e2_montage_park` | `A park at dawn: a father and son shadow-boxing side by side; a mother filming them on her phone.` |
| `still_e2_montage_stairs` | `A father and son running up long temple stairs at dawn.` |
| `still_e2_montage_melons` | `A father and son carefully carrying watermelons in their arms.` |
| `bg_1994_market` | Edit the finished `bg_stage1_market_row`: `Make it 1994: older blank shop signs, CRT TVs in a shop window, older scooters, a public phone booth, faded VHS colours.` |
| `bg_1994_fruit_stall` | Edit the finished `bg_stage1_fruit_stall`: `Make it 1994: the same stall with newer paint and a brighter awning.` |
| `still_1994_dining` | `A 1994 dining-room scene like an old photo: two young men at a round table each holding a blank sheet of paper, a young waitress with a fruit plate behind them. Slightly faded, warm.` |

---

## 10. Props

Prompt = subject + **STYLE-PROP**. States: the "State change" edit (§5) on the approved image.

| Id | Final | Subject | States |
|---|---|---|---|
| `prop_trophy_1994` | 12×16 | `A small, slightly dusty gold trophy cup on a wooden base with a blank plaque.` | — |
| `prop_ironing_board` | 40×24 | `An ironing board with an iron and a neatly pressed pale blue (#A9CBEA) button-up shirt laid on it.` | — |
| `prop_newspaper` | 16×12 | `A folded newspaper with blank grey columns.` | — |
| `prop_market_stall` | 48×40 | `A Taiwanese street market stall: a wooden table with a small striped awning, baskets of vegetables and snacks.` | `__broken` collapsed comically, the awning hanging, produce scattered, harmless |
| `prop_fruit_crate` | 16×12 | `A wooden crate of oranges.` | `__broken` the crate split, oranges rolling |
| `prop_showpiece_melon` ★ | 20×16 | `One enormous, perfect, glossy green-striped watermelon sitting proudly on a small red silk cushion on a wooden counter, a tiny ribbon on its stem.` | `__cracked` a crack across it · `__broken` split open, red flesh and seeds, the cushion askew, cartoon |
| `prop_melon` | 12×10 | `An ordinary green-striped watermelon.` | `__roll` tilted, with motion lines |
| `prop_durian` | 10×10 | `A spiky green durian, cartoon.` | — |
| `prop_traffic_podium` | 24×16 | `A small round white-and-blue traffic police podium.` | — |
| `prop_club_booth` | 48×40 | `A student club booth: a folding table with a blank cloth banner, flyers and a guitar case.` | `__broken` the table folded in on itself, flyers everywhere |
| `prop_cheer_card` | 16×10 | `A blank white card held up by two small hands at its top edge.` | — |
| `prop_shared_bike` | 40×24 | `A plain orange city shared bicycle with a front basket, side view.` | — |
| `prop_folding_desk` | 24×16 | `A tiny folding desk with an open workbook with blank pages, pencils and an eraser.` | — |
| `prop_tea_table` ★ | 48×24 | `A folding table with a full gongfu tea service: a small clay teapot, a tea tray, tiny cups, a kettle on a small burner, a tiny golden tea tin.` | — |
| `prop_xiangqi_board` | 24×16 | `A wooden Chinese chess board with round red and black pieces mid-game, each piece marked with a simple dot.` | — |
| `prop_xiangqi_piece` | 6×6 | `A single round wooden chess piece with a red rim.` | — |
| `prop_teacup` | 6×6 | `A tiny white porcelain teacup with a curl of steam.` | — |
| `prop_van` ★ | 96×48 | `A plain black minivan with tinted windows, side view, a blank white number plate.` | `__door_open` sliding side door open · `__rear_open` rear door swinging open · `__reverse` white reversing lights on |
| `prop_photo_1994_visor` | 16×12 | `A small faded photograph of three young people in 1990s clothes outside a garage; one face is covered by a parking ticket.` | — |
| `prop_supercar` | 80×32 | `A sleek, generic, unbadged red supercar, side view, a blank number plate.` | `__b` white · `__c` black · `__alarm` hazard lights flashing, doors popped open |
| `prop_money_suitcase` ★ | 32×24 | `A shiny silver aluminium suitcase, closed.` | `__open` the lid open, neatly packed with stacks of plain generic banknotes · `__burst` lying open on the ground, stacks spilled, a few notes fluttering |
| `prop_seating_chart` | 32×40 | `An easel holding a blank board with a round-table diagram and blank name cards around it.` | — |
| `prop_banner_rolled` | 96×16 | `A long red banner rolled up, hanging from ropes.` | `__open` unrolled, red with a gold border, blank |
| `prop_photo_1994_hall` | 24×20 | `A framed, spotlit old photograph: two young men in 1990s shirts at a round dinner table, each holding a blank sheet of paper, one with his back to the camera; a young woman behind them holding a fruit plate.` | — |
| `prop_soup_trolley` | 32×24 | `A kitchen trolley with a huge white porcelain soup tureen.` | `__tipping` tilting, soup sloshing · `__spilled` the tureen on its side, a cartoon soup puddle |
| `prop_vase` | 16×24 | `A tall blue-and-white porcelain vase on a carved wooden pedestal.` | `__broken` cartoon shards and the empty pedestal |
| `prop_dining_table` ★ | 160×64 | `A large round banquet table for eleven with a white tablecloth, a glass lazy Susan in the centre, many steaming Chinese dishes (fish, soup, dumplings, greens, a roast duck), bowls and chopsticks at each seat.` | `__cold` no steam, half-eaten · `__cleared` a bare white tablecloth, one teacup |
| `prop_chair_dining` | 16×24 | `A carved wooden dining chair.` | `__hairnet` a white hairnet folded on the seat |
| `prop_coat_rack` | 16×40 | `A wooden coat rack.` | `__straw_hat` a wide straw sun hat hanging on it |
| `prop_cap_on_table` | 8×6 | `A black baseball cap lying on a white tablecloth.` | — |
| `prop_lazy_susan_dish` | 12×8 | `A flying porcelain serving dish with food, motion lines.` | — |
| `prop_high_chair` | 16×24 | `A small wooden child's high chair.` | — |

---

## 11. Items, effects, UI

### Items (subject + **STYLE-PROP**)

| Id | Final | Subject |
|---|---|---|
| `item_coin` | 8×8 | `A shiny plain gold coin.` For `__1`–`__4`: `four frames of the same coin spinning, in a horizontal strip, evenly spaced.` |
| `item_hair_clip` ★ | 8×8 (+ `__closeup` 64×64) | `A small white rabbit-shaped hair clip.` |
| `item_lunchbox` | 12×10 | `A round stainless-steel lunchbox with the lid off: braised pork over rice, a fried egg and greens, a folded note on top.` `__closed` with the lid on |
| `item_envelope_lin` | 16×12 | `A cream envelope sealed with a plain red wax-style seal.` |
| `item_note` | 12×12 | `A small note on lined paper with blank lines.` |
| `item_phone_cracked` | 10×16 | `A smartphone with a badly cracked, glowing screen.` `__repaired` the screen whole |
| `item_fruit_plate` | 16×10 | `A white plate of neatly cut watermelon slices.` `__apples` apple slices |
| `item_bill` | 10×12 | `A small blank paper receipt.` |

### Effects (subject + **STYLE-PROP**; strips are horizontal, evenly spaced)

```
vfx_hit_spark: Four frames in a horizontal strip of a white-yellow comic star-shaped impact burst growing and fading.
vfx_daze_stars: Six frames in a horizontal strip of three small yellow stars circling in a flat ellipse, slowing down.
vfx_dust_puff: Four frames in a horizontal strip of a small grey cloud puff appearing and fading.
vfx_sweat_drop: Three frames of a single blue sweat drop sliding down.
vfx_speed_lines: Three frames of horizontal white speed lines.
vfx_slipper: Four frames of a blue-and-white plastic slipper spinning in flight, with motion arcs.
vfx_full_name_ring: Five frames of a big white-yellow shockwave ring expanding, comic.
vfx_shush_aura: Four frames of a pale blue ripple circle expanding.
vfx_flash_photo: Three frames of a white camera-flash burst.
vfx_flambe: Five frames of a big round orange cartoon flame puff rising and fading.
vfx_card_sparkle: Four frames of a gold sparkle trail in a horizontal arc.
vfx_tea_steam: Five frames of soft white steam curls rising.
vfx_soup_splash: Four frames of a cartoon soup splash of orange-brown droplets.
vfx_burning_spirit: Four frames of a red-orange flame aura around an empty body outline.
vfx_shadow_clone: Three frames of translucent blue afterimage silhouettes of a running figure.
vfx_ground_crack: Four frames of ground crack lines and small debris spreading.
vfx_question_text: Three frames of an empty white speech-bubble shape flying forward.
vfx_money_flutter: Five frames of plain generic banknotes fluttering down.
```
`vfx_rain_overlay` (1920×1088): `Diagonal heavy rain streaks evenly spread across a plain black background, pixel art, made to tile.`
`vfx_crt_filter` (1920×1088): `A reference image of a CRT scanline and VHS tape look over a plain grey test card, faded colours.`

### UI (subject + **STYLE-UI**)

| Id | Size | Subject |
|---|---|---|
| `ui_hud_frame` | 1920×1088, crop the top 144 px | `A black HUD band across the top 13% of a plain grey screen: a square portrait frame on the left, two empty segmented bars beside it, one green and one orange, a small coin-counter slot, an empty clock slot in the centre.` |
| `ui_bar_power` | 1024×128 | `A green segmented health bar in a chunky pixel frame.` |
| `ui_bar_spirit` | 1024×128 | `An orange segmented bar in a chunky pixel frame.` |
| `ui_icon_coin` | 512×512 | `A small gold coin icon.` |
| `ui_award_seal` ★ | 512×512 | `A small red square seal-stamp icon with an abstract swirl pattern inside, purely decorative.` **Check: no Chinese character, no letter.** |
| `ui_e_glyph` | 512×512 | `A keyboard key-cap glyph showing the capital letter E, a white key with a dark outline.` (the one allowed letter) |
| `ui_bill_popup` | 768×1024 | `A small blank paper receipt with a torn bottom edge.` |
| `ui_dialogue_box` | 1920×1088, crop the bottom 152 px | `A black dialogue band across the bottom 14% of a plain grey screen, with a small empty tab for the speaker's name.` |
| `ui_evaluation_form` ★ | 1536×2048 | `A sheet of cream rice paper with a thin red border and brush-painted lines and boxes, all empty: a title area at the top, four rows, a total row and two more rows below.` **Check: completely blank.** |
| `ui_red_seal_stamp` | 512×512 | `A red circular ink stamp, empty inside.` |
| `ui_group_chat` | 1088×1920 | `A phone screen frame showing a group chat with blank notification banners and a few generic cartoon greeting stickers: lotus flowers, a sunrise, a teacup.` |

**`ui_title_logo` (熱血物語:見家長): make it by hand.** Flux draws Chinese better than most
models, but a logo must be exact. **Never let any model draw 勇 or 禮.**

---

## 12. Scripting (optional)

Flux runs well from an API (BFL, fal.ai, Replicate). A script can read each asset's id and
subject, add the right style block, generate, save as `<id>.png`, downscale by the factor in §6
and reduce the palette. That replaces most of the copy-pasting and the first cleanup steps. Ask
Claude to write it once you've picked a host and have an API key.
