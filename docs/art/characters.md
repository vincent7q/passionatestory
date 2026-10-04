# Characters

[← art README](README.md) · Style: README §1 · Sizes: README §2 · Prompt recipe: README §3

Every entry is: **who** → **identity (must keep)** → **costume & colours** → **Prompt** (paste
after the global character style block) → **Poses** (one image each) → **Variants**.

Hex colours are targets for the cleanup pass. The AI only needs the colour words.

### Poses every fighter needs (referred to as "standard fighter poses")

`idle` (fighting stance, fists up) · `walk` · `run` · `punch` · `kick` · `jump` · `hurt`
(recoiling, eyes squeezed shut) · `knocked_down` (flat on back, cartoon) · `dazed` (**sitting on
the ground, legs out, rubbing head, stars circling**) · `get_up` · `bow` (polite bow from the
waist) · `wave_leave` (walking away, waving)

---

## 1. The candidate: the player (three looks)

**One person, three selectable looks.** All three wear **the pale blue button-up shirt his mother
ironed** (story beat P-01). The looks differ in face, hair, build, trousers and shoes. Faces come
from `docs/images/felix.png`, `lucian.png`, `hilman.png`. **Keep the hair shape, glasses and face
type from the portrait, redrawn in the chunky sprite style.**

Shared colours: shirt base `#A9CBEA`, shirt shadow `#6F93B8`, skin `#F4C7A1` / shadow `#D9A27E`.

### Poses all three looks need

Standard fighter poses, plus:

| Pose | Description |
|---|---|
| `help_up` | Bending forward, offering a hand down to someone sitting |
| `pick_up` | Crouching to pick something up from the ground |
| `drink_tea` | Holding a tiny teacup with both hands, sipping politely |
| `heavy` | After tea: belly slightly round, shoulders slumped, slow and content |
| `soaked` | Dripping wet, hair flat, puddle at the feet, grumpy face |
| `too_warm` | Shirt buttoned and zipped up to the chin, red cheeks, sweat drops |
| `force_fed` | Cheeks stuffed like a hamster, a spoon in his mouth, eyes wide |
| `guard` | Arms crossed in front of the face, braced, shielding someone behind him |
| `carry_suitcase` | Holding a big silver suitcase with **both hands** in front of him, arms straining, leaning back (ending E0) |
| `shocked` | Jaw dropped, eyebrows high (the reveal) |
| `fainted` | Sitting, dizzy, swirly eyes |
| `victory` | One fist in the air |
| `bike_ride` | Riding an orange shared bicycle, pedalling hard |
| `special_1/2/3` | The look's three special moves (below) |

### 1.1 `character_felix` — FELIX 菲利克斯 (Balanced)

- **Identity:** short **black messy spiky hair** with tufts sticking up; **round thin black-rimmed
  glasses** (at sprite size: two small round frames with a bridge, always visible); round face;
  **big open happy smile**; average build.
- **Costume:** pale blue short-sleeve button-up shirt, untucked; **dark grey jeans** `#4A4A55`;
  **white sneakers with a red stripe**.
- **Prompt:** *A cheerful young man, about 21, short black messy spiky hair, round thin black
  glasses, round face, big open happy grin. Wearing a pale blue short-sleeve button-up shirt
  (untucked), dark grey jeans and white sneakers with a red stripe. Average build, fists raised in
  a friendly fighting stance.*
- **Specials:** `special_1` Rapid Punch 連環拳 (a blur of fists in front of him) · `special_2`
  Tornado Kick 旋風腿 (spinning in the air, one leg out, a white swirl) · `special_3` Burning Spirit
  熱血 (standing tall, a **red-orange flame aura**, fists clenched, determined face).

### 1.2 `character_lucian` — LUCIAN 盧西安 (Speed)

- **Identity:** **dark brown-black mop of hair with a jagged fringe** that covers his forehead down
  to the eyebrows; **no glasses**; calm, slightly smug **closed-mouth smile**; slimmer face; faint
  blush on the cheeks; **lean, light build**.
- **Costume:** the same pale blue shirt with **sleeves rolled to the elbow**; **black slim
  trousers** `#26262E`; white low sneakers. A forward-leaning, ready-to-dash stance.
- **Prompt:** *A slim, quick young man, about 21, dark brown-black mop hair with a jagged fringe
  over his forehead, no glasses, calm confident closed-mouth smile. Pale blue button-up shirt with
  sleeves rolled up, black slim trousers, white sneakers. Lean build, light on his feet, leaning
  forward ready to dash.*
- **Specials:** Dash Strike (a horizontal blur, speed lines) · Aerial Barrage (in the air, kicking
  down in a flurry) · Shadow Clone (**two translucent blue afterimages** of him beside him).

### 1.3 `character_hilman` — HILMAN 希爾曼 (Power)

- **Identity:** **dark brown hair with a long side-swept fringe**; **rosy pink cheeks**; **big
  toothy grin**; **big, broad, heavy build** (fills the full width of the 32 px canvas: wide
  shoulders, thick arms).
- **Costume:** the same pale blue shirt, **tight across the shoulders** with the top button open;
  **khaki cargo trousers** `#B49A6A`; **brown work boots**.
- **Prompt:** *A big, broad, friendly young man, about 21, dark brown hair with a long side-swept
  fringe, rosy cheeks, a huge toothy grin. Pale blue button-up shirt stretched tight over big
  shoulders, khaki cargo trousers, brown work boots. Heavy powerful build, slow and strong.*
- **Specials:** Power Slam (lifting both fists overhead, about to slam down) · Earthquake Punch
  (punching the ground, **crack lines and dust** spreading) · Berserker (red face, **steam puffing
  from his ears**, cartoon angry).

### 1.4 HUD portraits: `ui_portrait_<look>__{normal,hurt,shocked}`

32×32 head-and-shoulders, the same chunky style, facing right, like the portrait in the reference
HUD (`2.jpg`, top-left). Three expressions each: **normal** (determined), **hurt** (one eye shut,
teeth gritted), **shocked** (mouth open, eyebrows high).

---

## 2. 林小雨 CLORIS — `npc_cloris`

- **Who:** his girlfriend, 21, a university student. **Calm and composed in every scene. She is
  never frightened** (she knows the kidnapping is staged).
- **Identity** (from `docs/images/rain.png`): **dark maroon-brown straight hair** `#5A2124`,
  **shoulder length**, with **wispy centre-parted bangs**; oval face; **gentle closed-mouth smile**;
  faint blush.
- **Costume:** a **cream knit cardigan** `#EDE3CF` over a white blouse; a **navy pleated midi
  skirt** `#2C3A5A`; white canvas shoes. **A small white rabbit hair clip** on the left side of
  her hair (only in the prologue and the good ending).
- **Prompt:** *A calm, gentle young woman, about 21, dark maroon-brown straight shoulder-length
  hair with wispy centre-parted bangs, oval face, soft closed-mouth smile. Cream knit cardigan
  over a white blouse, navy pleated midi skirt, white canvas shoes, a small white rabbit-shaped
  hair clip on the left side of her hair. Composed, quietly confident.*
- **Poses:** `walk` · `led_away` (two hands holding her arms, she calmly looks back over her
  shoulder) · `seated_straight` (at a table, back straight, hands in lap, looking ahead) ·
  `stand` · `smile` · `blush_idiot` (eyes half closed, small blush, mouthing "idiot") ·
  `take_clip` (holding the rabbit clip, smiling) · `disappointed` (eyes down, arms folded — late
  endings only) · `hand_phone` (holding out a phone).
- **Variants:** `__clip` (with the hair clip) and `__no_clip`.

---

## 3. 林建國 VINCENT — `boss_lin_jianguo` (final boss, her father)

- **Who:** 54. Calm, kind, unreadable, never raises his voice. Grew up working a fruit stall:
  **wealthy now, but understated.**
- **Identity** (from `docs/images/vincent.png`): **mostly bald on top** with a few thin strands
  sticking up; **dark brown hair on the sides and back**; **rectangular brown-rimmed glasses**;
  **round, chubby face**; a small kind smile; slightly portly build.
- **Costume:** a **charcoal-navy mandarin-collar jacket** `#2B3242` with cloth knot buttons, a white
  shirt underneath, grey trousers, black cloth shoes. Often holds **a pair of chopsticks**.
- **Prompt:** *A calm, kind-looking man of about 54, mostly bald on top with a few thin hair strands
  sticking up, dark brown hair on the sides, rectangular brown-rimmed glasses, round chubby face,
  small gentle smile. Charcoal-navy mandarin-collar jacket with knot buttons over a white shirt,
  grey trousers, black cloth shoes. Holding a pair of chopsticks. Dignified, unhurried, slightly
  portly.*
- **Poses:**

| Pose | Description |
|---|---|
| `seated` | **Sitting at a dining table**, chopsticks raised, calm (phase 1: he fights sitting down) |
| `seated_jab` | Seated, a lightning-fast chopstick poke forward, motion lines |
| `seated_feed` | Seated, holding out a spoonful of food at arm's length, kindly |
| `seated_spin` | Seated, one hand spinning the lazy Susan |
| `seated_summon` | Seated, one hand raised, beckoning |
| `stand_up` | Rising from his chair for the first time, serious |
| `stance` | Standing, feet apart, palms open, a formal martial stance |
| `palm_push` | A slow, wide two-handed push |
| `staggered` | Leaning back, glasses askew |
| `seated_dazed` | Sitting back in his chair, stars circling, rubbing his head, still dignified |
| `slide_paper` | Sliding a sheet of paper across a table |
| `sip_tea` / `watch` | Sipping tea; checking a wristwatch (ending E0) |

- **Variant `__young_1994`:** 22, **a full head of thick black hair** (a comic contrast), big 90s
  glasses, white shirt and black slacks, nervous but determined.

---

## 4. 林媽媽 — `boss_driver` (Stage 4 boss, her mother)

- **Who:** 52, elegant and composed. In 1994 she was the girl who was "kidnapped". Tonight she is
  **"the Driver"**: she says almost nothing.
- **Identity:** **glossy black chin-length bob**, **pearl earrings**, a refined face, a slight
  knowing smile.
- **Costume (Driver):** **black baseball cap**, **large dark sunglasses**, a **long camel trench
  coat** `#B88B5A`, belted, **black leather driving gloves**, black trousers, black ankle boots.
- **Prompt:** *An elegant, composed woman in her early 50s with a glossy black chin-length bob and
  pearl earrings, wearing a black baseball cap, large dark sunglasses, a long belted camel trench
  coat, black leather driving gloves, black trousers and ankle boots. Cool, silent, mysterious, a
  hint of a smile.*
- **Poses:** `idle` (pulling on a glove, finger by finger) · `card_swipe` (a fast horizontal
  slash with a **black credit card**, gold sparkle trail) · `bag_swing` (swinging **two big plain
  shopping bags**, one white and one black, with rope handles, **no logos**) · `key_fob` (clicking
  a car key fob, arm out) · `question` (pointing, asking sharply) · `dazed` · `climb_in`
  (stepping up into a van) · `nod` (a tiny nod over her shoulder).
- **Variants:** `__dinner` (seated at a table in a dark green silk blouse, sunglasses on, the cap on
  the table in front of her) · `__reveal` (sunglasses off and folded in her hand, a warm smile) ·
  `__young_1994` (雅芳, 20, a **big 90s perm**, a white 90s dress with puffed sleeves).

---

## 5. His mother — `npc_mom_home` / `boss_lunch_lady` (Stage 2 boss)

**Very important:** the player must recognise her in the disguise (the joke), so **the same eyes,
eyebrows and body shape appear in both versions**, and **her pink floral blouse peeks out** under
the lunch-lady apron at the collar and sleeves.

### 5.1 Everyday — `npc_mom_home`

- 52, warm and bossy-loving. **Short permed curly dark-brown hair**, a round friendly face,
  **bright arched eyebrows**, slightly plump. A **pink floral blouse** `#E7A0B4` and a grey
  cardigan, beige trousers.
- **Prompt:** *A warm, slightly plump Taiwanese mother in her early 50s with short permed curly
  dark-brown hair and bright arched eyebrows, wearing a pink floral blouse, a grey cardigan and
  beige trousers. Loving but bossy.*
- **Poses:** `ironing` (at an ironing board, ironing a pale blue shirt) · `sofa_dark` (sitting on
  a sofa in the dark, arms folded, **a blue-and-white plastic slipper in one hand**) ·
  `raise_slipper` · `filming` (holding up a phone, delighted).

### 5.2 The Lunch Lady disguise — `boss_lunch_lady`

- **Costume:** a **white cafeteria hairnet cap** covering all her hair; a **light-blue surgical
  mask** (eyes and eyebrows visible, **the same arched eyebrows**); a **white apron** over **the pink
  floral blouse** (visible at the collar and sleeves); **white sleeve covers** (袖套); **blue-and-white
  plastic slippers** (藍白拖, the classic Taiwanese slippers); she holds a **ladle**.
- **Prompt:** *A school cafeteria lunch lady in her early 50s, white hairnet cap covering her hair,
  light-blue surgical mask, bright arched eyebrows, white apron over a pink floral blouse (visible
  at the collar and sleeves), white sleeve covers, blue-and-white plastic slippers, holding a big
  ladle. Stern but caring eyes. Funny, not scary.*
- **Poses:**

| Pose | Description |
|---|---|
| `idle` | Holding a blue-and-white slipper like a weapon, the ladle in the other hand |
| `slipper_throw` | An overhand throw; the slipper leaves her hand |
| `zip_grab` | Reaching forward with both hands, as if zipping someone's jacket up to the chin |
| `feed` | Holding out a spoon: "have you eaten?" |
| `point_question` | One finger pointing, scolding ("did you clean your room?") |
| `full_name` | **Leaning back, mouth wide open, shouting with all her might**, hair-net strands flying, shockwave lines |
| `dazed` | Sitting, stars, rubbing her head |
| `fix_collar` | Reaching up to straighten someone's collar, tender |
| `give_lunchbox` | Holding out a lunchbox with both hands |
| `unmask` | Pulling the mask down to her chin, phone in the other hand, beaming proudly |

- **Variant `__young_1994`** (`npc_mom_young`): 20, a caterer's waitress, **ponytail**, white
  blouse, black vest, holding **a plate of cut fruit**, a shy smile.

---

## 6. His father — `npc_dad_home` / `boss_straw_hat` (Stage 3 boss, tag team)

### 6.1 Everyday — `npc_dad_home`

- 54, quiet, proud, a little stiff. **Short neat black hair greying at the temples**, square jaw,
  calm face, **white athletic tape around his knuckles**. Plain white T-shirt, grey sweatpants,
  slippers. Reads a newspaper.
- **Prompt:** *A quiet, proud Taiwanese father of about 54, short neat black hair greying at the
  temples, square jaw, calm face, white athletic tape wrapped around his knuckles. Plain white
  T-shirt, grey sweatpants, house slippers, holding a newspaper.*
- **Poses:** `newspaper` (behind a newspaper) · `lower_paper` (lowering it to look over the top) ·
  `sofa_dark` (sitting in the dark, a fake grey beard in his lap) · `shout` (cupping his mouth,
  shouting) · `shadow_box` (training montage) · `chair_fall` (jumping up so fast his chair falls,
  arms up: "that's my son!").

### 6.2 The Straw-Hat Uncle disguise — `boss_straw_hat`

- **Costume:** a **wide-brim woven straw sun hat**; an **obviously fake long grey beard** with **a
  visible elastic strap** over the ears (it must look fake: this is the joke); a loose beige linen
  shirt; grey trousers rolled at the ankle; black cloth shoes. Carries a **folded Chinese chess
  (象棋) board**.
- **Prompt:** *An old-looking man in a wide-brim woven straw sun hat and an obviously fake long grey
  beard held on with a visible elastic strap, loose beige linen shirt, grey trousers rolled at the
  ankles, black cloth shoes, holding a folded wooden Chinese chess board. Trying hard to look like
  a wise old hermit, badly.*
- **Poses:** `seated_chess` (seated, studying a xiangqi board) · `chariot` (charging forward
  holding the chess board in front like a shield) · `cannon` (flicking a round chess piece in a
  high arc) · `checkmate` (lunging with both hands to pin someone down) · `beard_slip` (**the beard
  hanging half off one ear**) · `dazed` · `unmask` (hat in one hand, peeling the beard off with the
  other).
- **Variants:** `__black_suit` (post-credits: a black suit and sunglasses, giving a tiny thumbs-up)
  · `__young_1994` (`npc_dad_young`, also a playable look in the bonus stage: 22, **a 90s
  middle-parted curtain haircut**, a denim jacket over a white T-shirt, light jeans, white
  high-top sneakers, energetic; it needs the full player pose set).

---

## 7. 二姑 — `boss_fruit_aunt` (Stage 1 boss)

- **Who:** 47, 林建國's sister. Runs the family fruit stall. Tough, proud, quick-tempered, fair.
  **She wasn't told about tonight.**
- **Identity/costume:** sturdy and strong, sun-tanned, hair pinned up in a bun under a **patterned
  headscarf**, a **towel around her neck**, a **red apron** `#C8423A` printed with small fruit,
  **colourful floral sleeve covers**, **white rubber boots**.
- **Prompt:** *A sturdy, sun-tanned Taiwanese market woman in her late 40s, hair in a bun under a
  patterned headscarf, a towel around her neck, a red apron printed with small fruit, colourful
  floral sleeve covers and white rubber boots, holding a big green watermelon in each hand.
  Fierce, proud, protective of her stall, comic.*
- **Poses:** `idle` (a melon in each hand) · `melon_bowl` (rolling a melon along the ground) ·
  `durian_toss` (throwing a spiky durian overhead) · `ripeness_grab` (squeezing someone's arm like
  testing fruit, unimpressed) · `shove` (a shoulder charge) · `sit_wreckage` (sitting in a pile of
  broken fruit, devastated) · `point` (pointing up the road) · `seated_dinner` (a plain blouse, arms
  folded, almost smiling) · `stern` (arms folded: "yes.").
- **Variant `__teen_1994`** (`boss_fruit_aunt_teen`): 15, **a high ponytail**, an oversized 90s
  T-shirt, the same red apron (too big for her), a scowl.

---

## 8. 二叔 BAN — `boss_ban` (Stage 3 boss)

- **Who:** 林建國's brother. **Enormous, round, always beaming.** Cannot be beaten; only offers tea.
- **Identity/costume:** **48×56 sprite.** A huge round body, **a shaved bald head**, **eyes always
  closed in happy crescents**, a wide smile, a small neat goatee. A **cream linen tang-style
  jacket with frog buttons**, matching trousers, black cloth shoes. Usually seated on a small
  folding stool behind a folding table.
- **Prompt:** *An enormous, round, jolly Taiwanese uncle, shaved bald head, eyes closed in happy
  crescents, huge warm smile, small neat goatee, cream linen tang-style jacket with frog buttons,
  matching trousers, black cloth shoes. Seated on a tiny folding stool, pouring tea from a small
  clay teapot. Immovable, hospitable, delighted.*
- **Poses:** `seated_pour` · `offer_cup` (holding out a tiny cup with both hands, beaming) ·
  `knocked_sit_pour` (knocked onto his bottom and immediately pouring another cup, still smiling) ·
  `laugh_step_aside` · `bow_tray` (bowing while holding a tea tray) · `pack_up` (folding the tea
  set, serious for once — ending E0).

---

## 9. 三叔 KEN — `npc_ken` (traffic police)

- **Identity/costume:** a fit man in his late 40s, short hair, friendly confident face. A **generic
  traffic-police look: white peaked cap, white short-sleeve uniform shirt, fluorescent yellow-green
  reflective vest, white gloves, dark navy trousers, black shoes, a whistle.** **No real
  insignia** (plain badges only). Stands on **a small round traffic podium**.
- **Prompt:** *A friendly, confident traffic police officer in his late 40s, white peaked cap, white
  short-sleeve uniform shirt, fluorescent yellow-green reflective vest, white gloves, dark navy
  trousers, a whistle in his mouth, standing on a small round traffic podium, one arm stretched
  out directing traffic. Generic uniform, no real insignia.*
- **Poses:** `direct_traffic` · `whistle` (cheeks puffed) · `point` (pointing up the road) · `bow`.

---

## 10. 大表哥 林家豪 HOWARD — `boss_howard` (Stage 5 mid-boss)

- **Who:** 28, a cousin who went to Stanford and mentions it constantly. Never rude: humble-bragging.
- **Identity/costume:** a **neat slicked side-parted hairstyle**, a confident pleased smile; **a
  pale pink polo shirt**, **a cardinal-red sweater tied over his shoulders** (no logo), beige
  chinos, brown loafers, a smartphone in hand.
- **Prompt:** *A polished, overachieving young man of about 28, slicked side-parted hair, pleased
  confident smile, pale pink polo shirt with a cardinal-red sweater tied over his shoulders (no
  logo), beige chinos, brown loafers, holding a smartphone. Humble-bragging, not mean.*
- **Poses:** `humble_brag` (hand on chest, eyes closed, sparkles) · `textbook_throw` (throwing
  three thick textbooks in a fan) · `speech` (holding index cards, mouth open, lecturing; a "zzz"
  boredom aura) · `dazed` · `selfie` (taking a selfie while bowing) · `group_photo` (holding a
  phone up to take a group photo).

---

## 11. Children

### 11.1 小樂 — `npc_xiaole` (Stage 3 hazard), 24×36

- 9 years old. **Big round glasses**, a bowl cut, a **white school shirt and navy shorts**, white
  socks. Sits at **a small folding desk with a workbook**, never looks up.
- **Prompt:** *A serious 9-year-old boy with big round glasses and a bowl haircut, white school shirt
  and navy shorts, sitting at a tiny folding desk doing homework, flicking an eraser over his
  shoulder without looking up.*
- **Poses:** `homework` · `throw` (flicking stationery without looking) · `pack_up` (closing the
  workbook, satisfied).

### 11.2 小表妹 — `npc_toddler` (Stage 5 hazard), 16×24

- 3 years old. **A red mini qipao with gold trim**, **two pigtails with red pom-pom ties**, chubby
  cheeks. She cannot be hurt; she hits back and giggles.
- **Prompt:** *A chubby, cheerful 3-year-old girl in a red mini qipao with gold trim, two pigtails
  tied with red pom-poms, toddling happily.*
- **Poses:** `toddle` · `tiny_punch` (a determined little punch) · `giggle` · `soup_splashed`
  (dripping with soup, delighted, arms up) · `clap` (in a high chair, clapping) · `point`.

---

## 12. 外婆 — `npc_waigong_portrait` (portrait only)

- A **painted oil portrait in an ornate gold frame**, hanging in the ancestral hall (a prop, about
  48×64). An elderly woman of about 80, **silver hair in a neat bun**, a **jade bangle**, a **dark
  navy qipao**, sitting upright, a faint knowing smile. She wrote the family rule.
- **Prompt (no global block; use the background block):** *A dignified painted oil portrait in an
  ornate gold frame of an elderly Taiwanese matriarch around 80, silver hair in a neat bun, dark
  navy qipao, jade bangle, sitting upright with a faint knowing smile. Pixel art.*
