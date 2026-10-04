# Gemini: paste-ready art prompts

[← art README](README.md) · Other tools: [Midjourney](midjourney.md) · [Flux](Flux.md) · [ComfyUI](ComfyUi.md)

This file is the art briefs ([`README.md`](README.md), [`characters.md`](characters.md),
[`enemies.md`](enemies.md), [`backgrounds.md`](backgrounds.md),
[`props-items-ui.md`](props-items-ui.md)) rewritten for **Google Gemini's image model**
(Nano Banana / Nano Banana Pro). **The briefs stay the source of truth.** If a brief changes,
change it there first, then update this file.

---

## 1. What Gemini is good for here

| Strong | Weak |
|---|---|
| **Keeping one character consistent**: upload the sheet, then ask for the next pose | **True pixel grids.** It draws images that *look* like pixel art but have soft edges. The cleanup pass is required |
| **Editing**: "the same image, but broken" (prop states), "the same character in other colours" (crowd variants) | Two-screen-wide backgrounds (make two halves) |
| Following long, specific descriptions (costume details, the blank badge rule) | Dense, moody backgrounds. Midjourney is stronger there |
| Using several reference images at once | Chinese text. Never ask for it |

**Use Gemini first for:** character sheets, pose sprites (built from the sheet), prop and item
states, crowd colour variants, HUD portraits and UI frames.

---

## 2. Setup

- **Where:**
  - **Gemini app** (gemini.google.com): ask for an image.
  - **Google AI Studio** (aistudio.google.com): you pick the model, aspect ratio and resolution
    directly. Preferred.
- **Model:** pick the newest image model offered. The **"Pro"** image model is better with
  several reference images and fine detail.
- **Watermark:** check the corners of the first image. If your plan adds a visible mark, generate
  in AI Studio or through the API. (An invisible SynthID mark is always there; it doesn't matter.)
- **Reference images to have ready:**
  - Style: `docs/styles/1.jpg`, `docs/styles/2.jpg`
  - Faces: `docs/images/felix.png`, `lucian.png`, `hilman.png`, `rain.png` (林小雨),
    `vincent.png` (林建國)
- **One chat per character** (or per stage of backgrounds). Long chats drift. When the style
  slips, start a new chat and paste the opener again.

---

## 3. Workflow

1. Start a chat, attach the references and paste the right **opener** (§4).
2. **Characters:** `SHEET` → approve → `SPRITE` (the idle key sprite) → approve → one `POSE` per
   message → `VARIANT` for colour variants.
3. **Backgrounds:** one `BG` per message. Variants ("the same room at night") with `VARIANT`.
4. Download. Then do the cleanup from README §2.2: nearest-neighbour downscale to the final size
   (§5), reduce the palette, fix the outline (Aseprite or Pixelorama).
5. Name the files per README §2.4 (`character_felix__punch.png`) and check README §5 before
   accepting an image.

**Tip:** for crowd colour variants (`__b`, `__c`), **recolour the finished `__a` images** with
`VARIANT` instead of generating new ones. It keeps the poses identical.

---

## 4. Openers (paste once at the start of a chat)

### 4.1 Characters and enemies

Attach `docs/styles/1.jpg`, `docs/styles/2.jpg`, and the character's face reference if there is
one.

```
You are making art for a 2D pixel-art beat-'em-up game. Follow these rules for every image in this chat.

STYLE: pixel art in the style of the modern Kunio-kun / River City (熱血物語) games, like the attached style references. Chibi proportions, about 2.5 heads tall: a big blocky, slightly square head, a short compact body, short thick limbs, big mitten-like fists and big shoes. Very simple faces: small black dot eyes, thick black eyebrows that carry the expression, a tiny nose or none, a short line mouth (an open D shape when shouting). A solid 1-pixel very dark brown-black outline around the whole figure and between major shapes. Flat cel colours, one shadow tone per colour, no gradients, no soft shading, no texture noise, no anti-aliasing: every pixel a crisp square block, like a 32×48-pixel sprite enlarged 16 times. Saturated NES/SNES-like colours. Bold, readable, comic poses. Family-friendly, 16-bit retro.

FRAMING: one character, full body, 3/4 side view facing right, feet on the bottom edge, on a plain flat solid magenta (#FF00FF) background with no floor and no shadow. Portrait 2:3 unless I say otherwise.

ALWAYS: the same costume, colours and face in every image of the same character. Cartoon violence only: nobody bleeds or is hurt; defeated people sit with stars circling their heads. Everyone looks friendly, polite and comic, never menacing. Modest clothing for everyone.

NEVER: text, letters, Chinese characters or numbers (unless I ask for one), logos, brand names, real police insignia, blood, wounds, real weapons, guns, knives, extra limbs or fingers, cropped feet, realistic proportions, anime style, 3D render, painterly shading.

"Blank badge" means a small plain circle badge with nothing inside it.

KEYWORDS I will use:
SHEET <id>: <description> = a character reference sheet. This one is NOT pixel art: clean flat-colour cartoon art in the same chibi proportions and face style, clean dark outlines, plain white background, landscape 3:2. Show a front view, a 3/4 side view facing right, a back view, and three head close-ups (neutral, shouting, surprised). No labels or text.
SPRITE <id> = the pixel-art game sprite of the character from the approved sheet, idle fighting stance (fists up, knees slightly bent), framed as above.
POSE <name>: <description> = the same character as the last approved sprite, with identical face, hair, costume, colours, size and pixel scale. Only the pose changes.
VARIANT <name>: <change> = the same image again. Change only what I name; keep everything else identical.

Reply with just the image. Wait for my first request.
```

### 4.2 Backgrounds and cutscene stills

Attach `docs/styles/2.jpg` (and the character sheets for stills that show characters).

```
You are making background art for a 2D side-scrolling pixel-art beat-'em-up game. Follow these rules for every image in this chat.

STYLE: detailed pixel art like the attached reference: rich fine detail (roof tiles, window frames, signs, cracks, plants, overhead cables), crisp square pixels, no anti-aliasing on edges. Much more detailed than the chunky characters. Cinematic lighting with gentle bloom, warm practical lights (shop signs, lanterns) and cool shadows. The far background (sky, distant city) is softly blurred like a tilt-shift depth of field and lower in contrast; the floor and the back wall are sharp. Set in Taiwan (Taipei-like): arcades, scooters, vertical shop signs, iron window grilles, rooftop water tanks.

CAMERA AND LAYOUT: side-on, looking slightly down (about 25–30 degrees). Landscape 16:9. The top 13% of the image is sky or roof edge only. The back wall (buildings, shopfronts, fences, windows) fills roughly 13–45% from the top. From about 45% to 86% from the top is a wide, flat, walkable ground strip that recedes into depth, kept clear of big objects; small decorations only along its back edge. The bottom 14% is just floor edge or kerb.

NEVER: people, characters or animals (unless I ask), readable text, letters, Chinese characters, numbers, logos, brand names, number-plate text, price tags, money symbols, blood, real weapons. All signs, banners, plaques, posters and boards are blank. Wealth is shown by objects, never written.

KEYWORDS I will use:
BG <id>: <description> = one background in this style.
STILL <id>: <description> = a full-screen cutscene illustration in the same pixel style; characters may appear and must match the attached sheets.
VARIANT <name>: <change> = the same image again. Change only what I name; keep the composition identical.

Reply with just the image. Wait for my first request.
```

### 4.3 Props, items and effects

Attach `docs/styles/2.jpg`.

```
You are making prop and effect sprites for a 2D pixel-art beat-'em-up game, in the style of the modern Kunio-kun / River City (熱血物語) games like the attached reference. Follow these rules for every image in this chat.

STYLE: pixel art, crisp square pixels, no anti-aliasing, a solid 1-pixel dark brown-black outline, flat cel colours with one shadow tone, no gradients. Cartoon and family-friendly: nothing gory, nothing dangerous-looking.

FRAMING: one object, centred, seen from the side and slightly from above (about 25–30 degrees), filling most of the frame, on a plain flat solid magenta (#FF00FF) background with no shadow.

NEVER: text, letters, Chinese characters, numbers, logos, brand names, real currency, blood. Paper, plaques, labels and screens are blank.

KEYWORDS I will use:
PROP <id> (<ratio>): <description> = one prop.
VARIANT <state>: <change> = the same prop again in a new state. Same size, angle, colours and position; change only what I name.
VFX <id>: <description> = a horizontal strip of animation frames, left to right, evenly spaced, on magenta, unless I say otherwise.

Reply with just the image. Wait for my first request.
```

### 4.4 UI

Attach `docs/styles/1.jpg`, `docs/styles/2.jpg`.

```
You are making UI art for a pixel-art beat-'em-up game. The UI is shown at full 1920×1080 resolution but must look pixel-styled to match the attached references: chunky pixel frames, flat colours, crisp hard edges, no gradients.

NEVER put any text, letters, numbers or Chinese characters in the image. All labels and numbers are added later by the game. Draw only frames, bars, icons, paper and space for text.

KEYWORD: UI <id> (<ratio>): <description>.

Reply with just the image. Wait for my first request.
```

---

## 5. Sizes

Ask for the ratio; downscale (nearest-neighbour) to the final size during cleanup.

| Asset | Ask for | Final size |
|---|---|---|
| Character sheet | 3:2 | any (reference only) |
| Standard sprite | 2:3 | 32×48 |
| 二叔 BAN | 4:5, then pad to 48:56 | 48×56 |
| Child (小樂) / toddler | 2:3 | 24×36 / 16×24 |
| Dog | 4:3 | 32×24 |
| Cheer pyramid | 3:4 | 48×64 |
| HUD portrait | 1:1 | 32×32 |
| Select-screen portrait | 1:1 | 128×128 |
| Background, 1 screen | 16:9 | 480×270 |
| Background, 2 screens | two 16:9 halves (§7 intro) | 960×270 |
| Props, items | the ratio given per item | as listed |
| UI | as listed | native |

---

## 6. Characters

### 6.0 Standard fighter poses

Every fighter (the player's looks, the bosses and all enemies) needs these. Send one line per
message after the `SPRITE` is approved.

```
POSE idle: fighting stance, fists up, knees slightly bent
POSE walk: mid-stride, walking to the right
POSE run: running hard, leaning forward
POSE punch: a straight punch forward, the fist fully extended
POSE kick: a front kick forward, the leg extended
POSE jump: in the air, knees tucked
POSE hurt: recoiling backwards, eyes squeezed shut
POSE knocked_down: lying flat on the back, cartoon, arms out
POSE dazed: sitting on the ground, legs out, rubbing the head, three small yellow stars circling above the head
POSE get_up: pushing up from the ground, one knee down
POSE bow: a polite bow from the waist
POSE wave_leave: walking away, waving over the shoulder
```

### 6.1 The candidate (the player): three looks

**One person, three looks.** All three wear **the pale blue button-up shirt his mother ironed**.
Attach the look's face portrait to the `SHEET` request: **keep the hair shape, glasses and face
type, redrawn in the chibi style.**

Poses for all three looks: the standard fighter poses (§6.0), plus:

```
POSE help_up: bending forward, offering a hand down to someone sitting on the ground
POSE pick_up: crouching to pick something up from the ground
POSE drink_tea: holding a tiny teacup with both hands, sipping politely
POSE heavy: after drinking a lot of tea, belly slightly round, shoulders slumped, slow and content
POSE soaked: dripping wet, hair flat, a puddle at the feet, grumpy face
POSE too_warm: shirt buttoned and zipped up to the chin, red cheeks, sweat drops
POSE force_fed: cheeks stuffed like a hamster, a spoon in the mouth, eyes wide
POSE guard: arms crossed in front of the face, braced, shielding someone behind
POSE carry_suitcase: holding a big silver suitcase with both hands in front, arms straining, leaning back
POSE shocked: jaw dropped, eyebrows high
POSE fainted: sitting, dizzy, swirly eyes
POSE victory: one fist in the air
POSE bike_ride: riding an orange shared bicycle (no logo), pedalling hard
```

#### `character_felix`: FELIX (Balanced). Attach `docs/images/felix.png`

```
SHEET character_felix: A cheerful young man, about 21, short black messy spiky hair with tufts sticking up, round thin black-rimmed glasses (two small round frames with a bridge, always visible), round face, big open happy grin, average build. Pale blue short-sleeve button-up shirt worn untucked, dark grey jeans, white sneakers with a red stripe. Keep the hair shape, glasses and face type from the attached portrait.
```
```
SPRITE character_felix
```
Specials:
```
POSE special_1: Rapid Punch, a blur of many fists punching in front of him, motion lines
POSE special_2: Tornado Kick, spinning in the air with one leg out, a white swirl around him
POSE special_3: Burning Spirit, standing tall, fists clenched, determined face, a red-orange flame aura around his body
```

#### `character_lucian`: LUCIAN (Speed). Attach `docs/images/lucian.png`

```
SHEET character_lucian: A slim, quick young man, about 21, a dark brown-black mop of hair with a jagged fringe covering his forehead down to the eyebrows, no glasses, a calm, slightly smug closed-mouth smile, a slimmer face, faint blush on the cheeks. Pale blue button-up shirt with the sleeves rolled to the elbow, black slim trousers, white low sneakers. Lean, light build. Keep the hair shape and face type from the attached portrait.
```
```
SPRITE character_lucian: idle stance leaning forward, light on his feet, ready to dash
```
Specials:
```
POSE special_1: Dash Strike, dashing forward as a horizontal blur with speed lines
POSE special_2: Aerial Barrage, in the air, kicking downwards in a flurry of kicks
POSE special_3: Shadow Clone, standing in a stance with two translucent blue afterimages of himself beside him
```

#### `character_hilman`: HILMAN (Power). Attach `docs/images/hilman.png`

```
SHEET character_hilman: A big, broad, friendly young man, about 21, dark brown hair with a long side-swept fringe, rosy pink cheeks, a huge toothy grin. Big, broad, heavy build: wide shoulders, thick arms, fills the full width of the sprite. Pale blue button-up shirt stretched tight across the shoulders with the top button open, khaki cargo trousers, brown work boots. Keep the hair shape and face type from the attached portrait.
```
```
SPRITE character_hilman
```
Specials:
```
POSE special_1: Power Slam, lifting both fists high overhead, about to slam down
POSE special_2: Earthquake Punch, punching the ground, crack lines and dust spreading from the fist
POSE special_3: Berserker, red face, steam puffing from his ears, cartoon angry
```

#### HUD and select-screen portraits

In each look's chat, after the sprite is approved:

```
VARIANT ui_portrait_<look>__normal: a 1:1 head-and-shoulders portrait of the same character in the same pixel style, facing right, determined expression, on magenta
VARIANT ui_portrait_<look>__hurt: the same portrait, one eye shut, teeth gritted
VARIANT ui_portrait_<look>__shocked: the same portrait, mouth open, eyebrows high
VARIANT ui_select_portraits__<look>: the same portrait, bigger and more detailed (for a 128×128 select screen), confident smile
```

### 6.2 林小雨 CLORIS: `npc_cloris`. Attach `docs/images/rain.png`

She is **calm and composed in every scene, never frightened.**

```
SHEET npc_cloris: A calm, gentle young woman, about 21, dark maroon-brown straight shoulder-length hair with wispy centre-parted bangs, oval face, a soft closed-mouth smile, faint blush. A cream knit cardigan over a white blouse, a navy pleated midi skirt, white canvas shoes, a small white rabbit-shaped hair clip on the left side of her hair. Composed, quietly confident. Keep the hair and face from the attached portrait.
```
```
SPRITE npc_cloris: standing calmly, hands together in front
```
```
POSE walk: walking calmly to the right
POSE led_away: two hands (from off-frame) holding her arms; she calmly looks back over her shoulder
POSE seated_straight: sitting at a table, back straight, hands in her lap, looking ahead
POSE stand: standing, relaxed
POSE smile: a warm smile
POSE blush_idiot: eyes half closed, a small blush, mouthing a word fondly
POSE take_clip: holding the white rabbit hair clip in her hand, smiling
POSE disappointed: eyes down, arms folded
POSE hand_phone: holding out a phone
VARIANT __no_clip: the same image without the rabbit hair clip
```

### 6.3 林建國 VINCENT: `boss_lin_jianguo` (final boss, her father). Attach `docs/images/vincent.png`

```
SHEET boss_lin_jianguo: A calm, kind-looking man of about 54, mostly bald on top with a few thin hair strands sticking up, dark brown hair on the sides and back, rectangular brown-rimmed glasses, a round chubby face, a small gentle smile, slightly portly. A charcoal-navy mandarin-collar jacket with cloth knot buttons over a white shirt, grey trousers, black cloth shoes, holding a pair of chopsticks. Dignified, unhurried, wealthy but understated. Keep the hair, glasses and face from the attached portrait.
```
```
SPRITE boss_lin_jianguo: sitting at a dining table (draw only a plain chair and the table edge), chopsticks raised, calm
```
```
POSE seated_jab: seated, a lightning-fast chopstick poke forward, motion lines
POSE seated_feed: seated, holding out a spoonful of food at arm's length, kindly
POSE seated_spin: seated, one hand spinning a round glass lazy Susan
POSE seated_summon: seated, one hand raised, beckoning
POSE stand_up: rising from his chair for the first time, serious
POSE stance: standing, feet apart, palms open, a formal martial-arts stance
POSE palm_push: a slow, wide two-handed palm push forward
POSE staggered: leaning back, glasses askew
POSE seated_dazed: sitting back in his chair, stars circling, rubbing his head, still dignified
POSE slide_paper: sliding a blank sheet of paper across a table
POSE sip_tea: sipping tea from a small cup
POSE watch: checking his wristwatch
```
Standard fighter poses (§6.0) for the standing phase.

```
SPRITE boss_lin_jianguo__young_1994: the same man aged 22 in 1994, a full head of thick black hair, big 1990s glasses, white shirt and black slacks, nervous but determined
```

### 6.4 林媽媽: `boss_driver` (Stage 4 boss, her mother)

She is "the Driver" and says almost nothing.

```
SHEET boss_driver: An elegant, composed woman in her early 50s with a glossy black chin-length bob and pearl earrings, wearing a black baseball cap, large dark sunglasses, a long belted camel trench coat, black leather driving gloves, black trousers and black ankle boots. Cool, silent, mysterious, a hint of a smile.
```
```
SPRITE boss_driver: pulling on a driving glove finger by finger
```
```
POSE card_swipe: a fast horizontal slash with a plain black card, a gold sparkle trail
POSE bag_swing: swinging two big plain shopping bags, one white and one black, with rope handles, no logos
POSE key_fob: clicking a car key fob, arm stretched out
POSE question: pointing, asking sharply
POSE climb_in: stepping up into a van
POSE nod: a tiny nod over her shoulder
```
Plus the standard fighter poses (§6.0).

```
VARIANT __dinner: seated at a table in a dark green silk blouse, sunglasses still on, the black cap lying on the table in front of her
VARIANT __reveal: sunglasses off and folded in her hand, a warm smile
SPRITE boss_driver__young_1994: the same woman aged 20 in 1994 (雅芳), a big 1990s perm, a white 1990s dress with puffed sleeves
```

### 6.5 His mother: `npc_mom_home` and `boss_lunch_lady` (Stage 2 boss)

**The player must recognise her in the disguise.** Generate both in **one chat**, everyday first,
so the eyes, eyebrows and body shape carry over. **Her pink floral blouse shows** at the collar
and sleeves under the apron.

```
SHEET npc_mom_home: A warm, slightly plump Taiwanese mother in her early 50s, short permed curly dark-brown hair, a round friendly face, bright arched eyebrows. A pink floral blouse, a grey cardigan, beige trousers. Loving but bossy.
```
```
SPRITE npc_mom_home
POSE ironing: at an ironing board, ironing a pale blue shirt
POSE sofa_dark: sitting on a sofa in the dark, arms folded, a blue-and-white plastic slipper in one hand
POSE raise_slipper: raising a blue-and-white plastic slipper
POSE filming: holding up a phone, delighted
```
```
SHEET boss_lunch_lady: THE SAME WOMAN as npc_mom_home (same eyes, same arched eyebrows, same body shape) disguised as a school cafeteria lunch lady: a white hairnet cap covering all her hair, a light-blue surgical mask (eyes and eyebrows visible), a white apron over her pink floral blouse (visible at the collar and sleeves), white sleeve covers, blue-and-white plastic slippers, holding a big ladle. Stern but caring eyes. Funny, not scary.
```
```
SPRITE boss_lunch_lady: holding a blue-and-white slipper like a weapon, the ladle in the other hand
```
```
POSE slipper_throw: an overhand throw, the slipper leaving her hand
POSE zip_grab: reaching forward with both hands as if zipping someone's jacket up to the chin
POSE feed: holding out a spoon, caring
POSE point_question: one finger pointing, scolding
POSE full_name: leaning back, mouth wide open, shouting with all her might, hairnet strands flying, shockwave lines
POSE fix_collar: reaching up to straighten someone's collar, tender
POSE give_lunchbox: holding out a lunchbox with both hands
POSE unmask: pulling the mask down to her chin, a phone in the other hand, beaming proudly
```
Plus the standard fighter poses (§6.0).

```
SPRITE npc_mom_young: the same woman aged 20 in 1994, a caterer's waitress, a ponytail, white blouse, black vest, holding a plate of cut fruit, a shy smile
```

### 6.6 His father: `npc_dad_home` and `boss_straw_hat` (Stage 3 boss)

The fake beard **must look fake**. That is the joke.

```
SHEET npc_dad_home: A quiet, proud Taiwanese father of about 54, short neat black hair greying at the temples, a square jaw, a calm face, white athletic tape wrapped around his knuckles. Plain white T-shirt, grey sweatpants, house slippers, holding a newspaper.
```
```
SPRITE npc_dad_home
POSE newspaper: hidden behind an open newspaper (blank columns)
POSE lower_paper: lowering the newspaper to look over the top
POSE sofa_dark: sitting in the dark, a fake grey beard in his lap
POSE shout: cupping his mouth, shouting
POSE shadow_box: shadow-boxing, training
POSE chair_fall: jumping up so fast his chair falls over, both arms up, proud and excited
```
```
SHEET boss_straw_hat: THE SAME MAN as npc_dad_home (same face shape and build) disguised as an old hermit: a wide-brim woven straw sun hat, an obviously fake long grey beard held on with a visible elastic strap over the ears, a loose beige linen shirt, grey trousers rolled at the ankles, black cloth shoes, holding a folded wooden Chinese chess (xiangqi) board. Trying hard to look like a wise old hermit, badly.
```
```
SPRITE boss_straw_hat
POSE seated_chess: seated, studying a xiangqi board
POSE chariot: charging forward holding the chess board in front like a shield
POSE cannon: flicking a round chess piece in a high arc
POSE checkmate: lunging with both hands to pin someone down
POSE beard_slip: the fake beard hanging half off one ear
POSE unmask: the hat in one hand, peeling the fake beard off with the other
```
Plus the standard fighter poses (§6.0).

```
VARIANT __black_suit: the same man in a black suit and sunglasses, giving a tiny thumbs-up
SPRITE npc_dad_young: the same man aged 22 in 1994, a 1990s middle-parted curtain haircut, a denim jacket over a white T-shirt, light jeans, white high-top sneakers, energetic
```
`npc_dad_young` is also playable in the bonus stage. It needs the **full player pose set**
(§6.0 + §6.1 list).

### 6.7 二姑: `boss_fruit_aunt` (Stage 1 boss)

```
SHEET boss_fruit_aunt: A sturdy, sun-tanned Taiwanese market woman in her late 40s, hair in a bun under a patterned headscarf, a towel around her neck, a red apron printed with small fruit, colourful floral sleeve covers and white rubber boots. Strong and sturdy. Fierce, proud, protective of her stall, comic.
```
```
SPRITE boss_fruit_aunt: holding a big green watermelon in each hand
```
```
POSE melon_bowl: rolling a watermelon along the ground like a bowling ball
POSE durian_toss: throwing a spiky durian overhead
POSE ripeness_grab: squeezing someone's arm like testing fruit, unimpressed
POSE shove: a shoulder charge
POSE sit_wreckage: sitting in a pile of broken fruit, devastated (cartoon)
POSE point: pointing up the road
POSE stern: arms folded, stern
VARIANT seated_dinner: seated, in a plain blouse instead of the apron, arms folded, almost smiling
```
Plus the standard fighter poses (§6.0).

```
SPRITE boss_fruit_aunt_teen: the same woman aged 15 in 1994, a high ponytail, an oversized 1990s T-shirt, the same red apron (too big for her), a scowl
```

### 6.8 二叔 BAN: `boss_ban` (Stage 3 boss) · 48×56, ask 4:5

```
SHEET boss_ban: An enormous, round, jolly Taiwanese uncle, a shaved bald head, eyes always closed in happy crescents, a huge warm smile, a small neat goatee. A cream linen tang-style jacket with frog buttons, matching trousers, black cloth shoes. Immovable, hospitable, delighted.
```
```
SPRITE boss_ban: 4:5 frame, seated on a tiny folding stool behind a small folding table, pouring tea from a small clay teapot
```
```
POSE offer_cup: holding out a tiny teacup with both hands, beaming
POSE knocked_sit_pour: knocked onto his bottom and immediately pouring another cup, still smiling
POSE laugh_step_aside: laughing and stepping aside
POSE bow_tray: bowing while holding a tea tray
POSE pack_up: folding up the tea set, serious for once
```

### 6.9 三叔 KEN: `npc_ken` (traffic police)

```
SPRITE npc_ken: A friendly, confident traffic police officer in his late 40s, short hair, a white peaked cap, a white short-sleeve uniform shirt, a fluorescent yellow-green reflective vest, white gloves, dark navy trousers, black shoes, a whistle. Generic uniform: plain badges only, no real insignia. Standing on a small round white-and-blue traffic podium, one arm stretched out directing traffic.
```
```
POSE whistle: blowing the whistle, cheeks puffed
POSE point: pointing up the road
POSE bow: a polite bow
```

### 6.10 大表哥 林家豪 HOWARD: `boss_howard` (Stage 5 mid-boss)

Never rude, just humble-bragging.

```
SHEET boss_howard: A polished, overachieving young man of about 28, neat slicked side-parted hair, a pleased confident smile, a pale pink polo shirt with a cardinal-red sweater tied over his shoulders (no logo), beige chinos, brown loafers, holding a smartphone. Humble-bragging, not mean.
```
```
SPRITE boss_howard
POSE humble_brag: hand on chest, eyes closed, sparkles around him
POSE textbook_throw: throwing three thick textbooks in a fan
POSE speech: holding index cards, mouth open, lecturing, a sleepy "zzz" aura around him (draw the z shapes, no other text)
POSE selfie: taking a selfie while bowing
POSE group_photo: holding a phone up to take a group photo
```
Plus the standard fighter poses (§6.0).

### 6.11 Children

```
SPRITE npc_xiaole: A serious 9-year-old boy, big round glasses, a bowl haircut, a white school shirt, navy shorts, white socks, sitting at a tiny folding desk with a workbook, never looking up. Smaller than an adult (24×36 sprite).
POSE throw: flicking an eraser over his shoulder without looking up
POSE pack_up: closing the workbook, satisfied
```
```
SPRITE npc_toddler: A chubby, cheerful 3-year-old girl in a red mini qipao with gold trim, two pigtails tied with red pom-poms, chubby cheeks, toddling happily. Very small (16×24 sprite).
POSE tiny_punch: a determined little punch
POSE giggle: giggling, eyes closed
POSE soup_splashed: dripping with soup, delighted, arms up (cartoon)
POSE clap: sitting in a wooden high chair, clapping
POSE point: pointing
```

### 6.12 外婆 portrait: `npc_waigong_portrait` (a prop, about 48×64)

Use the **background** chat (§4.2):

```
BG npc_waigong_portrait (3:4, not a scene, just the framed painting on magenta): A dignified painted oil portrait in an ornate gold frame of an elderly Taiwanese matriarch around 80, silver hair in a neat bun, a dark navy qipao, a jade bangle, sitting upright with a faint knowing smile. Pixel art.
```

---

## 7. Enemies and crowd

New chat with opener §4.1 (style references only). Every enemy needs **the standard fighter
poses** (§6.0) plus its attacks. Sizes 32×48 unless noted. Expressions are **determined,
flustered, apologetic or cheerful, never menacing.**

**Crowd colour variants:** office worker, aunt, cousin, kitchen staff and groundskeeper need
`__a`, `__b`, `__c`. Finish `__a`, then recolour each image with `VARIANT`.

### Stage 1: City

```
SPRITE enemy_office_worker__a: A polite, tired salaryman with neat short hair, a white shirt with rolled sleeves, a loose tie with a tiny gold blank tie pin, dark trousers, black shoes, swinging a brown leather briefcase, an apologetic "excuse me" face.
POSE briefcase_swing: a horizontal briefcase swing
POSE briefcase_combo: the second swing of a two-hit briefcase combo, backhand
VARIANT __b: the same man with glasses and a moustache, a light grey shirt and a navy tie
VARIANT __c: a female office worker in a blouse and pencil skirt with a ponytail, same briefcase
```
```
SPRITE enemy_scalper: A wiry street ticket scalper in a backwards cap, a loud Hawaiian-print shirt, a bum bag across his chest, shorts and flip-flops, holding a fan of blank paper tickets, a sly but friendly grin.
POSE ticket_throw: flicking tickets forward in a spread
POSE retreat: hopping backwards
```
```
SPRITE enemy_delivery_rider: A cheerful food-delivery rider in a plain orange jacket, a white open-face helmet with the visor up, a big orange square insulated delivery backpack, jeans and sneakers. No logos.
POSE bag_dash: dashing forward shoulder-first with the backpack, speed lines
```

### Stage 2: Campus at night

```
SPRITE enemy_basketball_player: A sporty university student in a red basketball jersey with the number 7, a white headband, shorts, high socks and basketball shoes, holding a basketball, a confident grin.
POSE chest_pass: throwing the ball straight ahead
POSE dunk_leap: leaping high, the ball raised overhead
```
```
SPRITE enemy_cheerleader__a: An energetic university cheerleader in a modest blue-and-white long-sleeve top and knee-length pleated skirt, white sneakers, holding blue and white pom-poms, a high ponytail, shouting cheerfully. Family-friendly.
POSE cheer: pom-poms thrown up high
VARIANT __b: a boy cheerleader in the same blue-and-white colours, long-sleeve top and shorts
VARIANT __c: a girl cheerleader with short hair, same uniform
```
```
POSE pyramid (3:4, 48×64): three cheerleaders in a human pyramid, two at the bottom and one on top, wobbling
POSE pyramid_collapse (3:4): the three-person pyramid toppling sideways, cartoon
```
```
SPRITE enemy_club_recruiter: An over-eager university club recruiter in a hoodie and jeans with a lanyard and a clipboard, pushing a thick stack of colourful flyers forward, a huge hopeful smile.
POSE flyer_grab: lunging forward to stuff flyers into someone's arms
POSE fan_flyers: sitting dazed, fanning himself with flyers, stars circling
```
```
SPRITE enemy_library_auntie: A prim middle-aged librarian in a beige cardigan and a long skirt, reading glasses on a beaded chain, hair in a neat bun, holding one finger to her lips to say "shh".
POSE shush: finger to lips, eyes closed, a wide pale-blue ripple aura around her
```
```
SPRITE npc_student_reader__a: A university student sitting at a library table, head down, reading a thick book, absorbed. Seated only.
VARIANT __b: a different student (different hair and clothes), same pose
VARIANT __c: a third student, glasses, same pose
```

### Stage 3: Mountain

```
SPRITE enemy_groundskeeper__a: A friendly estate groundskeeper in green overalls with a small blank badge on the chest, a conical straw farmer's hat, rubber boots and work gloves, holding a bamboo rake.
POSE rake_sweep: a low sweeping swing of the rake
VARIANT __b: older, with a grey moustache and a white towel round his neck
VARIANT __c: a younger woman groundskeeper, same overalls and hat
```
```
SPRITE enemy_guard_dog (4:3, 32×24): A big fluffy cream-coloured dog like an Akita, a curled tail, a smart red collar with a round blank tag, a happy face. Cute, not scary.
POSE idle: sitting, tongue out
POSE charge: charging playfully
POSE pause: between charges, looking up
POSE belly_up: rolled over on its back, tail wagging
POSE dazed: sitting, little stars circling
POSE follow: trotting happily alongside
```
```
SPRITE enemy_estate_security: A broad, calm estate security guard in a black suit with an earpiece with a curly wire and a small blank lapel pin, short hair, both arms raised in a solid blocking stance, polite expression.
POSE block: forearms up like a shield
POSE counter_shove: a two-handed shove
```

### Stage 4: Garage

```
SPRITE enemy_valet: A slick young parking valet in a red waistcoat over a white shirt with a black bow tie and black trousers, swinging a huge ring of car keys.
POSE key_whip: whipping the key ring forward
```
```
SPRITE enemy_mechanic: A sturdy garage mechanic in dark grey overalls with a small blank badge, a grease smudge on his cheek, a backwards cap, holding a big wrench.
POSE wrench_overhead: raising the wrench overhead
POSE ground_slam: slamming the wrench into the ground, dust puffs
```
```
SPRITE enemy_chauffeur: A dignified chauffeur in a grey uniform with a peaked cap and white gloves, holding a long black umbrella.
POSE umbrella_shield: the umbrella opened in front like a shield
POSE umbrella_poke: a poke forward with the closed umbrella
```
```
SPRITE enemy_men_in_black__a: A tall professional man in a black suit, white shirt, thin black tie, black sunglasses and an earpiece, a small blank lapel pin, an apologetic polite expression despite the tough look.
VARIANT __b: the same outfit on a stocky man
VARIANT __c: the same outfit on an average-build man
POSE grab_arm: holding someone's arm, gently
POSE hold_door: holding a van door open, politely
POSE gentle_takedown: lowering someone to the ground, a hand protecting the back of their head
VARIANT formation (3:2): all three (tall, stocky, average) standing in a triangle formation
VARIANT __1994: the same man in 1990s style: a huge shoulder-pad suit, a wide tie, big sunglasses, slicked hair
```

### Stage 5: Estate

```
SPRITE enemy_catering_staff: A smart catering waiter in a white catering jacket and black trousers, neat hair, holding a silver serving tray, a polite smile.
POSE roll_throw: throwing dinner rolls in a spread
POSE tray_block: holding the tray up as a shield
```
```
SPRITE enemy_aunt__a: A chatty, glamorous Taiwanese auntie in her 50s dressed up for a family dinner in a purple qipao and a pearl necklace, permed hair, holding a big serving spoon, asking a nosy question with a delighted face.
POSE spoon_combo: swinging the serving spoon
POSE question: leaning in, one finger raised, nosy
VARIANT __b: a sequinned cardigan and short curly hair instead, same spoon
VARIANT __c: a floral dress and a big hair clip instead, same spoon
```
```
SPRITE enemy_cousin__a: A trendy young adult cousin in a smart polo shirt and sneakers, holding up a phone to take a flash photo, a friendly grin.
POSE flash_photo: phone up, a white camera-flash burst
POSE dash: dashing forward
VARIANT __b: a young woman cousin in a cropped jacket, same phone
VARIANT __c: a cousin with dyed light-brown hair and a striped polo
```
```
SPRITE enemy_kitchen_staff__a: A proud chef in white chef's whites, a tall chef's hat and a red neckerchief, swinging a big black wok.
POSE wok_swing: a wide wok swing
POSE flambe: tilting the wok, a big round cartoon flame puff rising from it
VARIANT __b: a younger chef with glasses
VARIANT __c: a woman chef with her hair tucked under the hat
```

### 1994 bonus stage extras

```
SPRITE enemy_office_worker_1994: A 1990s office worker in a big-shouldered suit, a wide tie, a pager on his belt and a brick-sized mobile phone in hand.
SPRITE enemy_perm_guy_1994: A 1990s street guy with a big curly perm, an acid-wash denim jacket and high-waisted jeans, striking a cool pose.
SPRITE enemy_boombox_1994: A 1990s youth in a shiny tracksuit carrying a big boombox on his shoulder, little music notes floating out.
```

---

## 8. Backgrounds

New chat with opener §4.2. **Two-screen backgrounds:** ask for the left half, then:
`VARIANT right_half: the scene continues seamlessly to the right; the left edge of the new image must continue exactly from the right edge of the previous image. Same light, same horizon, same floor line.`
Expect to fix the seam in an editor (Midjourney's *pan* does this better).

Leave space for breakable props (stalls, booths, vases) and big props (the van, the tea table):
they are separate images (§10).

### Title and prologue

```
BG bg_title_street: A quiet residential street near a Taiwanese university at golden hour (17:00), long orange shadows, low apartment buildings with iron window grilles and potted plants on balconies, a row of parked scooters, streetlights just flickering on, an orange-pink sky. At the far end of the street, a plain black van is parked with its headlights off. Nostalgic, calm, slightly mysterious.
VARIANT __no_van: remove the van; nothing else changes
```
```
BG bg_home_living_room: A small, warm, cosy Taiwanese apartment living room in the afternoon (16:30), sunlight through a window with lace curtains, a worn fabric sofa, a low wooden coffee table, a TV cabinet, a wall clock, a rice cooker on a side counter, family photos on the wall, and on a shelf behind the sofa an empty spot where a small trophy will stand. An ironing board in the middle of the room. Modest, lived-in, loving.
VARIANT __night_dark: the same room at night with the lights off, only a single table lamp's warm pool of light by the sofa, everything else in deep blue shadow
```

### Stage 1: City (17:10–17:35, sunset)

```
BG bg_stage1_market_row (2 screens, left half first): A busy Taiwanese traditional market street at sunset, orange-pink sky, the back lined with shopfronts under arcades, colourful vertical neon signs (blank) starting to glow, striped awnings, hanging lamps, plastic stools, crates and baskets along the shop edges, rows of parked scooters, overhead tangles of cables. A wide paved street in front with room for two market stalls. Lively, warm, slightly chaotic.
```
```
BG bg_stage1_junction: A big Taiwanese city crossroads at sunset, zebra crossings, traffic lights, tall buildings with blank billboards, a pedestrian overpass in the background, a clear space in the middle of the junction for a small traffic podium. Cars and scooters stopped in neat rows at the back edge and the sides only.
```
```
BG bg_stage1_arcade_rain (2 screens, left half first): A long covered pedestrian arcade (騎樓) in a Taiwanese city during heavy rain, grey-blue light, the arcade roof covering the back half of the street with clear gaps at about one third and two thirds of the image where rain pours through, wet glossy floor tiles reflecting neon shop lights, closed metal shutters, a few blank shop signs, rain streaks and puddles. Covered dry zones and open rainy gaps must be easy to tell apart. Moody but not gloomy.
```
```
BG bg_stage1_loading_bay: A loading bay behind a city market at dusk, two big roll-up metal shutters (one on the left wall, one on the right), stacked crates and pallets, a hand truck, a puddle, fluorescent tube lights flickering on, orange sky above the walls.
```
```
BG bg_stage1_fruit_stall: A narrow Taiwanese street at sunset, the end of a market, a fruit stall's red and white striped awning at the back-centre (the counter itself is left empty), pyramids of watermelons, crates of mangoes, guavas, pineapples and lychees, a hanging scale, hanging lamps, a small plastic stool. Warm orange light. Proud and carefully kept.
```

### Stage 2: Campus at night (17:35–18:00, blue hour)

```
BG bg_stage2_back_gate: The back gate of a Taiwanese university at blue hour, a wide campus road, red-brick buildings with warm lit windows, palm trees, a gate with a blank name plaque, a row of orange shared bicycles (no logos) at a docking rack near the gate, streetlights, a deep blue sky.
VARIANT __exit: the same scene framed so the bike rack is in focus at the front
```
```
BG bg_stage2_sports_field (2 screens, left half first): A university sports field at night under bright white floodlights, an outdoor basketball court with hoops at the back, a red running track, bleachers, a chain-link fence, a deep blue sky with the last light of dusk. Energetic school-sports feel.
```
```
BG bg_stage2_club_street (2 screens, left half first): A campus walkway at night lined with student club booths under strings of warm fairy lights along the back, blank hand-made banners, guitar cases, board-game boxes, blank posters, balloons, a tree with lights. The front of the walkway is clear (four booths will be added). Fun, busy, student-festival feel.
```
```
BG bg_stage2_library: A silent university library reading room at night, tall wooden bookshelves along the back wall, long wooden reading tables with green desk lamps, a librarian's front desk on one side, big windows showing a deep blue night sky. Hushed, warm lamp light.
```
```
BG bg_stage2_cafeteria: A university cafeteria closed for the night, rows of empty tables and plastic chairs, metal serving counters with steam trays along the back, one counter still lit with a warm light and a big steaming soup pot, a blank menu board, the rest dim blue. Homely, slightly comic.
```
```
BG bg_transition_bike_road (2 screens, left half first): A road leaving the city at dusk, rice fields and small houses on one side, a dark green forested mountain rising ahead, power lines, a purple-blue sky with the first stars. Simple shapes, made for scrolling past fast.
```

### Stage 3: Mountain road (18:00–18:25, dusk to night)

The whole mountain belongs to the family: manicured, expensive, quiet. Warm paper lanterns
against a purple-blue evening.

```
BG bg_stage3_lower_gate: The foot of a private mountain at dusk, an ornate wrought-iron gate standing open between stone pillars, a blank stone sign plaque, a smooth private road winding up into lush subtropical forest, ferns and banyan trees, a purple-blue sky, warm lamps on the pillars.
```
```
BG bg_stage3_dog_run: A manicured lawn beside a private mountain road at dusk, a neat wooden fence, a luxurious little dog house shaped like a miniature villa, dog bowls, trimmed hedges, garden lamps.
```
```
BG bg_stage3_pond_path (2 screens, left half first): A Chinese garden path on a mountainside at dusk, a koi pond with stepping stones and orange koi, a small arched stone bridge, weeping willows, rocks, rows of paper lanterns along the path, some glowing warmly and some still dark. Peaceful and expensive.
VARIANT __lanterns_off: the same path later at night, every lantern dark, cold moonlight
```
```
BG bg_stage3_stone_steps (2 screens, left half first): A long flight of stone steps climbing a forested mountainside at nightfall, diagonally from lower left to upper right, stone lanterns on both sides, bamboo groves, mist, a small flat landing at the top. The staircase itself is the walkable area.
```
```
BG bg_stage3_tea_road: A wide bend of a private mountain road at nightfall with a breathtaking view: below, a whole city glittering with lights under a purple-blue sky; a low stone railing along the edge; pine trees; a soft evening mist. A calm, grand, slightly funny emptiness in the middle of the road.
VARIANT __night: later and darker
```

### Stage 4: The garage (18:25–18:40, cold LED)

Wealth shown big: a supercar showroom under the mountain. Glossy, cool, white-blue LED.

```
BG bg_stage4_ramp_down: A curving concrete ramp leading down into a luxurious underground garage, sleek white LED light strips along the walls, a blank level sign, polished grey concrete, cool white-blue light. Modern and expensive.
```
```
BG bg_stage4_showroom (2 screens, left half first): A luxurious private underground garage lit like a car showroom, a glossy polished floor reflecting everything, white LED ceiling panels, a row of parked supercars along the back, a vintage luxury limousine, a motorbike on a rotating display turntable. No brand logos; number plates blank. Cool, gleaming, absurdly rich.
```
```
BG bg_stage4_van_bay: The centre bay of a luxurious underground garage, an empty marked parking space in the middle, supercars parked on both sides, concrete pillars, bright white LED lights, a glossy reflective floor.
```
```
BG bg_stage4_exit_ramp: A wide concrete exit ramp climbing up and out of a luxurious underground garage, seen from the bottom; at the top, an opening to the night with warm floodlight spilling in and a corner turning out of sight; LED strips along the walls; the middle of the ramp empty. A dramatic, quiet, lonely composition that feels like a decision.
```

### Stage 5: The estate (18:40–19:00, night outside, gold inside)

A grand Chinese-modern mansion: courtyard layout, red lacquer, carved wood, marble, gold, but
tasteful.

```
BG bg_stage5_courtyard (2 screens, left half first): The floodlit front courtyard of a grand Chinese-modern mansion at night, a big marble fountain, catering vans (no logos) with their back doors open, a helipad with a helicopter under a fitted cover, a red lacquered main door at the top of wide stone steps, warm golden light from tall windows, an empty space between two pillars (a banner will hang there), an empty spot by the door (an easel will stand there).
```
```
BG bg_stage5_ancestral_hall: A long, solemn ancestral hall in a Chinese mansion at night, dark carved wooden panels, red lacquer pillars, an altar with incense and candles at the back, rows of framed family photographs and painted portraits on the walls (faces small and simple), warm candlelight and gold accents. Leave one large empty frame space on the wall.
```
```
BG bg_stage5_kitchen: A huge, busy professional kitchen in a mansion, stainless steel counters, roaring gas wok burners with flames, towers of bamboo steamers, warming trays, hanging ladles, steam everywhere, a pantry door on one side and a door to the hall on the other with a glimpse of a piano through it. Warm, steamy, energetic.
```
```
BG bg_stage5_grand_corridor (2 screens, left half first): A long, grand mansion corridor at night, a polished marble floor, carved wooden doors along the back wall with empty pedestals between them, crystal wall lights, a red carpet runner, and at the far right end a pair of enormous ornately carved double doors with warm light glowing underneath.
```
```
BG bg_dining_room: A grand, warm Chinese mansion dining room at night, an empty clear space in the centre of the floor for a large round table, a chandelier, red and gold decor, carved wooden screens, a coat rack by the door, a door to the kitchen on one side, the broken-open main doors on the other. Warm golden light.
```
The dining room's `__hot` / `__cold` / `__cleared` states are on the table prop (§10). If you also
want the room light to change:
`VARIANT __cleared: the room dimmer and quieter, warm light spilling from the kitchen door`.

```
BG bg_estate_front_steps_morning: The front steps and red lacquered door of a grand Chinese-modern mansion in soft early-morning light, dew, birds, a peaceful quiet courtyard.
```

---

## 9. Cutscene stills (480×270, characters allowed)

Use the background chat with `STILL`. **Attach the sheets** of everyone who appears. The
candidate wears the pale blue shirt.

> **Open question:** the briefs don't say whether stills showing the candidate need one version
> per look (felix / lucian / hilman). Check before producing them.

```
STILL still_g01_arcade_bench: the candidate asleep on a bench under a covered arcade, a towel over his head, heavy rain outside, a folded note beside him
STILL still_g01_nurse_office: the candidate asleep on a school nurse's office bed, an ice pack on his forehead, a folded note on the side table
STILL still_g01_pavilion: the candidate asleep in a garden pavilion with a blanket over him, a cup of warm steaming tea beside him, glowing paper lanterns
STILL still_g01_limo: the candidate asleep on the back seat of a limousine, seatbelt fastened, a folded note on his chest
STILL still_g01_guest_room: the candidate asleep in a luxurious guest bed, house slippers lined up neatly by the bed
STILL still_g02_carried: a first-person blurry view looking up at a mansion corridor ceiling with crystal lights passing overhead, hands visible at the edges as if being carried
STILL still_e0_suitcase_table: a silver aluminium suitcase on a small coffee table in a dark living room, a blue-and-white plastic slipper beside it
STILL still_e1_family_photo: two families together around a round dining table, everyone holding up a piece of fruit, laughing (attach every family sheet)
STILL still_e2_montage_park: a park at dawn, a father and son shadow-boxing side by side, a mother filming them with her phone
STILL still_e2_montage_stairs: a father and son running up long temple stairs at dawn
STILL still_e2_montage_melons: a father and son carefully carrying watermelons in their arms
STILL still_1994_dining: a 1994 dining-room scene like an old photo: two young men at a round table each holding a blank sheet of paper, a young waitress with a plate of cut fruit behind them. Slightly faded, warm
```

1994 remakes (attach the finished Stage 1 image and ask for the edit):

```
VARIANT bg_1994_market: bg_stage1_market_row remade as 1994: older blank shop signs, CRT TVs in a shop window, older scooters, a public phone booth, faded colours like a VHS tape
VARIANT bg_1994_fruit_stall: bg_stage1_fruit_stall in 1994: the same stall with newer paint and a brighter awning
```

---

## 10. Props

New chat with opener §4.3. Final sizes in game pixels; ask for the ratio shown.

```
PROP prop_trophy_1994 (3:4): a small, slightly dusty gold trophy cup on a wooden base with a blank plaque
PROP prop_ironing_board (16:9): an ironing board with an iron and a neatly pressed pale blue button-up shirt laid on it
PROP prop_newspaper (4:3): a folded newspaper with blank columns
PROP prop_market_stall (5:4): a Taiwanese street market stall, a wooden table with a small striped awning, baskets of vegetables and snacks
VARIANT __broken: the same stall collapsed comically, the awning hanging, produce scattered, nothing dangerous
PROP prop_fruit_crate (4:3): a wooden crate of oranges
VARIANT __broken: the crate split open, oranges rolling out
PROP prop_showpiece_melon (5:4): one enormous, perfect, glossy green-striped watermelon sitting proudly on a small red silk cushion on a wooden counter, a tiny ribbon on its stem
VARIANT __cracked: a crack across the melon
VARIANT __broken: the melon split open, red flesh and seeds, the cushion askew, cartoon, not gory
PROP prop_melon (5:4): an ordinary green-striped watermelon
VARIANT __roll: the same melon tilted, with small motion lines, rolling
PROP prop_durian (1:1): a spiky green durian, cartoon
PROP prop_traffic_podium (3:2): a small round white-and-blue traffic police podium
PROP prop_club_booth (5:4): a student club booth, a folding table with a blank cloth banner, flyers and a guitar case
VARIANT __broken: the table folded in on itself, flyers everywhere
PROP prop_cheer_card (3:2): a blank white card held up at the top edge by two small hands
PROP prop_shared_bike (16:9): an orange city shared bicycle with a front basket, generic, no logo
PROP prop_folding_desk (3:2): a tiny folding desk with an open workbook (blank pages), pencils and an eraser
PROP prop_tea_table (2:1): a folding table with a full gongfu tea service: a small clay teapot, a tea tray, tiny cups, a kettle on a small burner, a tiny golden tea tin
PROP prop_xiangqi_board (3:2): a wooden Chinese chess board with round red and black pieces mid-game (the pieces show simple marks, not characters)
PROP prop_xiangqi_piece (1:1): a single round wooden chess piece with a simple red mark
PROP prop_teacup (1:1): a tiny white porcelain teacup with steam
PROP prop_van (2:1): a plain black minivan with tinted windows, side view, no logos, a blank number plate
VARIANT __door_open: the sliding side door open
VARIANT __rear_open: the rear door swinging open
VARIANT __reverse: white reversing lights on
PROP prop_photo_1994_visor (4:3): a small faded photograph of three young people in 1990s clothes outside a garage; one face is covered by a parking ticket
PROP prop_supercar__a (21:9): a sleek generic red supercar, side view, no brand logos, blank number plate
VARIANT __b: white
VARIANT __c: black
VARIANT __alarm: the same car with flashing hazard lights and the doors popped open
PROP prop_money_suitcase (4:3): a shiny silver aluminium suitcase, closed
VARIANT __open: the lid open, neatly packed with stacks of generic banknotes (not real currency, no numbers)
VARIANT __burst: lying open on the ground, stacks spilled, a few notes fluttering in the air
PROP prop_seating_chart (4:5): an easel holding a blank board with a round-table diagram and blank name cards around it
PROP prop_banner_rolled (21:9): a long red banner rolled up, hanging from ropes
VARIANT __open: the banner unrolled, red with a gold border, blank
PROP prop_photo_1994_hall (5:4): a framed, spotlit old photograph: two young men in 1990s shirts at a round dinner table, each holding a blank sheet of paper, one with his back to the camera; a young woman behind them holding a fruit plate
PROP prop_soup_trolley (4:3): a kitchen trolley with a huge white porcelain soup tureen
VARIANT __tipping: the trolley tilting, soup sloshing
VARIANT __spilled: the tureen on its side, a cartoon soup puddle
PROP prop_vase (2:3): a tall blue-and-white porcelain vase on a carved wooden pedestal
VARIANT __broken: cartoon shards and the empty pedestal
PROP prop_dining_table__hot (21:9): a large round banquet table for eleven, white tablecloth, a glass lazy Susan in the centre, many Chinese dishes (fish, soup, dumplings, greens, a roast duck) steaming, bowls and chopsticks at each seat
VARIANT __cold: no steam, half-eaten
VARIANT __cleared: a bare white tablecloth with one teacup
PROP prop_chair_dining (2:3): a carved wooden dining chair
VARIANT __hairnet: the same chair with a white hairnet folded on the seat
PROP prop_coat_rack (2:5): a wooden coat rack
VARIANT __straw_hat: a wide straw sun hat hanging on it
PROP prop_cap_on_table (4:3): a black baseball cap lying on a white tablecloth
PROP prop_lazy_susan_dish (3:2): a flying porcelain serving dish with food, motion lines
PROP prop_high_chair (2:3): a small wooden child's high chair
```

Final sizes: trophy 12×16 · ironing board 40×24 · newspaper 16×12 · market stall 48×40 ·
fruit crate 16×12 · showpiece melon 20×16 · melon 12×10 · durian 10×10 · traffic podium 24×16 ·
club booth 48×40 · cheer card 16×10 · shared bike 40×24 · folding desk 24×16 · tea table 48×24 ·
xiangqi board 24×16 · xiangqi piece 6×6 · teacup 6×6 · van 96×48 · photo (visor) 16×12 ·
supercar 80×32 · money suitcase 32×24 · seating chart 32×40 · banner 96×16 · photo (hall) 24×20 ·
soup trolley 32×24 · vase 16×24 · dining table 160×64 · dining chair 16×24 · coat rack 16×40 ·
cap 8×6 · lazy Susan dish 12×8 · high chair 16×24.

Text added later (not by Gemini): the trophy plaque "1994 · 第二名", the cheer card "加油 {name}",
the 林 number plate on the van, the seating-chart names.

---

## 11. Items

```
PROP item_coin (1:1): a shiny gold coin (no symbols)
VFX item_coin__spin: 4 frames of the same gold coin spinning
PROP item_hair_clip (1:1): a small white rabbit-shaped hair clip
VARIANT item_hair_clip__closeup: the same hair clip drawn large and detailed for a close-up cutscene
PROP item_lunchbox (5:4): a round stainless-steel lunchbox with the lid off, braised pork over rice, a fried egg and greens, a folded note on top
VARIANT __closed: the same lunchbox with the lid on
PROP item_envelope_lin (4:3): a cream envelope sealed with a red wax-style seal (the seal blank)
PROP item_note (1:1): a small handwritten note on lined paper (blank lines)
PROP item_phone_cracked (2:3): a smartphone with a badly cracked screen, the screen glowing
VARIANT __repaired: the same phone, screen fixed
PROP item_fruit_plate__melon (3:2): a white plate of neatly cut watermelon slices
VARIANT __apples: apple slices instead
PROP item_bill (4:5): a small blank paper receipt
```

Final sizes: coin 8×8 · hair clip 8×8 (close-up 64×64) · lunchbox 12×10 · envelope 16×12 ·
note 12×12 · phone 10×16 · fruit plate 16×10 · bill 10×12.

---

## 12. Effects (VFX)

Props chat (§4.3). 3–6 frames each, left to right.

```
VFX vfx_hit_spark: 4 frames, a white-yellow comic star-shaped impact burst growing and fading
VFX vfx_daze_stars: 6 frames, three small yellow stars circling in a flat ellipse, slowing down
VFX vfx_dust_puff: 4 frames, a small grey cloud puff appearing and fading
VFX vfx_sweat_drop: 3 frames, a single blue sweat drop sliding down
VFX vfx_speed_lines: 3 frames, horizontal white speed lines
VFX vfx_slipper: 4 frames, a blue-and-white plastic slipper spinning in flight, with motion arcs
VFX vfx_full_name_ring: 5 frames, a big white-yellow shockwave ring expanding, comic
VFX vfx_shush_aura: 4 frames, a pale blue ripple circle expanding
VFX vfx_flash_photo: 3 frames, a white camera-flash burst
VFX vfx_flambe: 5 frames, a big round orange cartoon flame puff rising and fading
VFX vfx_card_sparkle: 4 frames, a gold sparkle trail in a horizontal arc
VFX vfx_tea_steam: 5 frames, soft white steam curls rising
VFX vfx_soup_splash: 4 frames, a cartoon soup splash of orange-brown droplets
VFX vfx_burning_spirit: 4 frames, a red-orange flame aura around an empty body outline
VFX vfx_shadow_clone: 3 frames, translucent blue afterimage silhouettes of a running figure
VFX vfx_ground_crack: 4 frames, ground crack lines and small debris spreading
VFX vfx_question_text: 3 frames, an empty white speech-bubble shape flying forward
VFX vfx_money_flutter: 5 frames, generic banknotes (no numbers) fluttering down
```
```
VFX vfx_rain_overlay (16:9, single image, not a strip): diagonal rain streaks on a plain black background, evenly spread so it can tile (key out the black in the engine)
VFX vfx_crt_filter (16:9, single image): a reference of a CRT scanline and VHS look over a plain grey test pattern, faded colours
```

---

## 13. UI

New chat with opener §4.4.

```
UI ui_hud_frame (16:9, top band only): a black HUD band across the top of the screen in the style of the reference: a square portrait frame on the left, two empty segmented bars beside it (one green, one orange), a small coin-counter slot, a clock slot in the centre. No labels or numbers
UI ui_bar_power (8:1): a green segmented health bar, chunky pixel frame, full and empty states side by side
UI ui_bar_spirit (8:1): an orange segmented bar in the same style
UI ui_icon_coin (1:1): a small gold coin icon
UI ui_award_seal (1:1): a small red square seal-stamp icon with an abstract swirl mark inside. It must NOT contain any Chinese character or letter
UI ui_e_glyph (1:1): a keyboard key-cap glyph showing the letter E, white key with a dark outline
UI ui_bill_popup (3:4): a small blank paper receipt with a torn bottom edge
UI ui_dialogue_box (16:9, bottom band only): a black dialogue band across the bottom of the screen with a small tab for the speaker's name, like the reference
UI ui_evaluation_form (3:4): a sheet of cream rice paper with a thin red border, brush-painted lines and boxes, all blank: a title area at the top, four rows, a total row and two more rows below. No text at all
UI ui_red_seal_stamp (1:1): a red circular ink stamp, blank inside
UI ui_group_chat (9:16): a phone screen frame showing a group chat: blank notification banners and a few generic cartoon greeting stickers (lotus flowers, a sunrise, a teacup), no text anywhere
```

The `ui_e_glyph` is the one place a letter is allowed. Check `ui_award_seal` and
`ui_evaluation_form` carefully: **no 勇 or 禮, and no Chinese at all.**

**`ui_title_logo` (熱血物語:見家長): don't use Gemini for the letters.** Make the logo in a design
tool. Gemini can help with the flame motif only:
`UI flame_motif (16:9): a hot-blooded red-and-yellow pixel flame burst with a black outline, empty in the middle (letters will be placed there).`
