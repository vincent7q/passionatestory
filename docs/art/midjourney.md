# Midjourney: paste-ready art prompts

[← art README](README.md) · Other tools: [Gemini](gemini.md) · [Flux](Flux.md) · [ComfyUI](ComfyUi.md)

This file is the art briefs ([`README.md`](README.md), [`characters.md`](characters.md),
[`enemies.md`](enemies.md), [`backgrounds.md`](backgrounds.md),
[`props-items-ui.md`](props-items-ui.md)) rewritten as **Midjourney** commands. **The briefs stay
the source of truth.** If a brief changes, change it there first, then update this file.

Written for **Midjourney V7** parameters. If you are on a newer version, check that `--oref`,
`--sref` and `--style raw` still behave the same.

---

## 1. What Midjourney is good for here

| Strong | Weak |
|---|---|
| **Backgrounds and cutscene stills**: atmosphere, light, the colour script by time of day | **The same character across many poses.** It drifts, even with `--oref` |
| **One style across a whole set**: lock it with `--sref` and reuse it everywhere | Following a long list of costume details. Keep prompts short |
| **Extending wide backgrounds** with *pan* or the editor | True pixel grids. The cleanup pass is required |
| Concept exploration (many fast options) | Text of any kind. Chinese never works |

**Use Midjourney first for:** every background in §6, the stills in §7, and early concept
exploration of the characters. Then make the sprites in Gemini, Flux or ComfyUI from the approved
sheets.

---

## 2. Setup

1. Use the **web app** (midjourney.com). Uploading reference images is easy there.
2. **Settings:** turn **Personalization off**. It changes the style unpredictably between images.
3. **Upload the style references** `docs/styles/1.jpg` and `docs/styles/2.jpg`. Copy their image
   URLs. In every command below, **replace `STYLE_REF` with those URLs** (space-separated), or drag
   the images into the *Style reference* slot instead.
   - Once you have a background you love, **reuse its style**: put its URL in `--sref` too.
   - Write down the `--seed` of good results and reuse it for variants.
4. **Character faces:** upload `docs/images/felix.png` (etc.). Use the URL in place of `FACE_REF`
   with `--oref` (omni reference: "this person"). Omni reference uses about 2× GPU time.
5. **After an image is approved:** Upscale (Subtle). Then downscale with nearest-neighbour to the
   final size and clean up per README §2.2. Name files per README §2.4.

### Parameters used in this file

| Parameter | What it does | Value used here |
|---|---|---|
| `--ar` | Aspect ratio | Per asset (§3) |
| `--style raw` | Less "Midjourney beautification", follows the prompt more literally | Sprites, props, UI |
| `--s` (stylize) | How much artistic freedom | 50 (sprites), 100 (sheets), 150 (backgrounds) |
| `--sref` / `--sw` | Style reference image(s) / its weight (0–1000, default 100) | `STYLE_REF`; raise `--sw` to 200–300 if the style drifts |
| `--oref` / `--ow` | Omni reference: keep this person or object / its weight (default 100) | Character's face or approved sheet; 100–300 |
| `--no` | Things to leave out | The "avoid" lists below |
| `--seed` | Repeat a result's noise | Reuse for variants |
| `--tile` | Seamless tiling | The rain overlay |

**Prompt tips:** the first words weigh the most. Keep the subject short and concrete; the suffix
carries the style. Don't use "no X" inside the prompt (it can *add* X); use `--no X`.

---

## 3. Aspect ratios and final sizes

| Asset | `--ar` | Final size |
|---|---|---|
| Character sheet | `3:2` | reference only |
| Standard sprite | `2:3` | 32×48 |
| 二叔 BAN | `6:7` | 48×56 |
| Child / toddler | `2:3` | 24×36 / 16×24 |
| Dog | `4:3` | 32×24 |
| Cheer pyramid | `3:4` | 48×64 |
| HUD portrait / select portrait | `1:1` | 32×32 / 128×128 |
| Background, 1 screen | `16:9` | 480×270 |
| Background, 2 screens | `32:9` (or `16:9` + *Pan →*) | 960×270 |
| Props, items | as given per line | as listed |

---

## 4. Rules (built into the commands)

- **No text, letters, Chinese characters or logos.** Signs and plaques blank. The 林 crest is a
  **blank circle badge**.
- **No blood, wounds or real weapons**; cartoon only. Comic objects (briefcases, slippers, woks)
  are fine.
- **Nobody looks menacing**: polite, comic people at work. **Modest clothing.**
- **Wealth is shown, never written**: no prices, no money symbols.
- **勇 and 禮 must never appear in any image.**
- **No real brands**: generic cars, bikes, delivery bags, police uniforms.

---

## 5. Characters and enemies

### 5.1 The three suffixes

**Sheet suffix (not pixel art).** Use it for the first image of each main character:

```
, character turnaround reference sheet, front view, 3/4 view, back view, three head close-ups with different expressions, chibi proportions 2.5 heads tall, big square head, dot eyes, thick black eyebrows, clean flat colour cartoon, bold dark outlines, plain white background --ar 3:2 --s 100 --no text, labels, letters, logo, watermark, realistic, anime
```

**Sprite suffix.** The in-game pixel sprite:

```
, chibi pixel art game sprite, modern Kunio-kun River City beat 'em up style, 2.5 heads tall, big blocky square head, dot eyes, thick black eyebrows, 1-pixel dark brown outline, flat cel colours, crisp 16-bit pixels, full body, 3/4 side view facing right, plain flat magenta background --ar 2:3 --style raw --s 50 --sref STYLE_REF --no text, letters, logo, watermark, blood, gun, knife, sword, gradient, soft shading, 3d render, realistic, anime, floor shadow
```

**Pose method.** Midjourney can't "edit the pose" of a sprite. Instead:
1. Approve the sheet and the idle sprite.
2. For each pose: **the character's sprite prompt with its pose phrase replaced** by one from the
   pose lists, plus `--oref <approved sprite URL> --ow 200`. Keep the same `--seed`.
3. Expect costume drift. Fix small things with **Editor → Vary Region**; for large drift, make the
   poses in Gemini or Flux from the approved sprite instead.

**Standard fighter pose phrases** (every fighter):

```
fighting stance with fists up | walking mid-stride | running hard leaning forward | throwing a straight punch | front kick with the leg extended | jumping with knees tucked | recoiling hurt with eyes squeezed shut | lying flat on the back knocked down, cartoon | sitting on the ground dazed rubbing the head with three yellow stars circling | getting up with one knee down | polite bow from the waist | walking away waving over the shoulder
```

### 5.2 The candidate (one player, three looks, all in his mother's pale blue shirt)

Extra pose phrases for all three looks:

```
bending forward offering a hand to someone sitting | crouching to pick something up | sipping from a tiny teacup with both hands | belly round and slumped after too much tea | dripping wet with flat hair and a puddle | shirt buttoned to the chin, red cheeks, sweating | cheeks stuffed like a hamster with a spoon in the mouth | arms crossed in front of the face shielding someone | straining to hold a big silver suitcase with both hands, leaning back | jaw dropped in shock | sitting dizzy with swirly eyes | one fist raised in victory | riding an orange shared bicycle pedalling hard
```

**`character_felix`**: Felix (Balanced)

```
cheerful young man, short black messy spiky hair, round thin black glasses, round face, big open grin, pale blue short-sleeve button-up shirt untucked, dark grey jeans, white sneakers with a red stripe, average build, character turnaround reference sheet, front view, 3/4 view, back view, three head close-ups with different expressions, chibi proportions 2.5 heads tall, big square head, dot eyes, thick black eyebrows, clean flat colour cartoon, bold dark outlines, plain white background --ar 3:2 --s 100 --oref FACE_REF --ow 100 --no text, labels, letters, logo, watermark, realistic, anime
```
```
cheerful young man with round thin black glasses and black messy spiky hair, big open grin, pale blue short-sleeve shirt untucked, dark grey jeans, white sneakers with a red stripe, fighting stance with fists up, chibi pixel art game sprite, modern Kunio-kun River City beat 'em up style, 2.5 heads tall, big blocky square head, dot eyes, thick black eyebrows, 1-pixel dark brown outline, flat cel colours, crisp 16-bit pixels, full body, 3/4 side view facing right, plain flat magenta background --ar 2:3 --style raw --s 50 --sref STYLE_REF --oref SHEET_URL --ow 150 --no text, letters, logo, watermark, blood, gun, knife, sword, gradient, soft shading, 3d render, realistic, anime, floor shadow
```
Special-move phrases: `a blur of rapid punches, motion lines` · `spinning tornado kick in mid-air, white swirl` · `standing tall, fists clenched, red-orange flame aura`

**`character_lucian`**: Lucian (Speed)

```
slim quick young man, dark brown-black mop hair with a jagged fringe over the forehead, no glasses, calm smug closed-mouth smile, faint blush, pale blue button-up shirt with sleeves rolled to the elbow, black slim trousers, white low sneakers, lean build, character turnaround reference sheet, front view, 3/4 view, back view, three head close-ups with different expressions, chibi proportions 2.5 heads tall, big square head, dot eyes, thick black eyebrows, clean flat colour cartoon, bold dark outlines, plain white background --ar 3:2 --s 100 --oref FACE_REF --ow 100 --no text, labels, letters, logo, watermark, realistic, anime
```
```
slim young man with a jagged dark fringe, calm smug smile, pale blue shirt with rolled sleeves, black slim trousers, white sneakers, leaning forward ready to dash, chibi pixel art game sprite, modern Kunio-kun River City beat 'em up style, 2.5 heads tall, big blocky square head, dot eyes, thick black eyebrows, 1-pixel dark brown outline, flat cel colours, crisp 16-bit pixels, full body, 3/4 side view facing right, plain flat magenta background --ar 2:3 --style raw --s 50 --sref STYLE_REF --oref SHEET_URL --ow 150 --no text, letters, logo, watermark, blood, gun, knife, sword, gradient, soft shading, 3d render, realistic, anime, floor shadow
```
Special-move phrases: `dashing as a horizontal blur with speed lines` · `in mid-air kicking down in a flurry` · `two translucent blue afterimages beside him`

**`character_hilman`**: Hilman (Power)

```
big broad friendly young man, dark brown hair with a long side-swept fringe, rosy pink cheeks, huge toothy grin, pale blue button-up shirt tight across big shoulders with the top button open, khaki cargo trousers, brown work boots, heavy powerful build, character turnaround reference sheet, front view, 3/4 view, back view, three head close-ups with different expressions, chibi proportions 2.5 heads tall, big square head, dot eyes, thick black eyebrows, clean flat colour cartoon, bold dark outlines, plain white background --ar 3:2 --s 100 --oref FACE_REF --ow 100 --no text, labels, letters, logo, watermark, realistic, anime
```
```
big broad young man with a side-swept fringe, rosy cheeks, huge toothy grin, tight pale blue shirt, khaki cargo trousers, brown work boots, wide shoulders and thick arms, fighting stance, chibi pixel art game sprite, modern Kunio-kun River City beat 'em up style, 2.5 heads tall, big blocky square head, dot eyes, thick black eyebrows, 1-pixel dark brown outline, flat cel colours, crisp 16-bit pixels, full body, 3/4 side view facing right, plain flat magenta background --ar 2:3 --style raw --s 50 --sref STYLE_REF --oref SHEET_URL --ow 150 --no text, letters, logo, watermark, blood, gun, knife, sword, gradient, soft shading, 3d render, realistic, anime, floor shadow
```
Special-move phrases: `both fists raised overhead about to slam down` · `punching the ground, crack lines and dust` · `red angry face with steam puffing from his ears, cartoon`

**HUD portraits** `ui_portrait_<look>__{normal,hurt,shocked}`: the sprite prompt with `full body`
replaced by `head-and-shoulders portrait` and the expression `determined` / `one eye shut, teeth
gritted` / `mouth open, eyebrows high`, `--ar 1:1`. Select-screen portraits (`ui_select_portraits__<look>`): the same, larger
detail.

### 5.3 Main cast: subject lines

For each: **subject + sheet suffix** (with `--oref FACE_REF` where a face reference exists), then
**subject + pose phrase + sprite suffix** with `--oref SHEET_URL`.

| Id | Subject (paste before the suffix) | Extra pose phrases |
|---|---|---|
| `npc_cloris` (face: `rain.png`) | `calm gentle young woman, dark maroon-brown straight shoulder-length hair with wispy centre-parted bangs, soft closed-mouth smile, faint blush, cream knit cardigan over a white blouse, navy pleated midi skirt, white canvas shoes, small white rabbit hair clip on the left` | `walking calmly` · `two hands holding her arms, calmly looking back over her shoulder` · `sitting very straight at a table, hands in lap` · `warm smile` · `eyes half closed, small blush, fond` · `holding the rabbit hair clip, smiling` · `eyes down, arms folded, disappointed` · `holding out a phone`. Variant without the clip: add `--no hair clip` |
| `boss_lin_jianguo` (face: `vincent.png`) | `calm kind man about 54, mostly bald on top with a few thin strands, dark brown hair on the sides, rectangular brown-rimmed glasses, round chubby face, gentle smile, charcoal-navy mandarin-collar jacket with knot buttons, white shirt, grey trousers, black cloth shoes, holding chopsticks, slightly portly` | `seated at a dining table, chopsticks raised` · `seated, lightning-fast chopstick poke, motion lines` · `seated, holding out a spoonful of food` · `seated, spinning a glass lazy Susan` · `seated, one hand raised beckoning` · `rising from his chair, serious` · `formal martial stance, palms open` · `slow wide two-handed palm push` · `leaning back, glasses askew` · `seated dazed with stars, still dignified` · `sliding a blank paper across a table` · `sipping tea` · `checking his wristwatch` |
| `boss_lin_jianguo__young_1994` | `nervous determined young man aged 22 in 1994, full head of thick black hair, big 1990s glasses, white shirt, black slacks` | standard |
| `boss_driver` | `elegant composed woman in her early 50s, glossy black chin-length bob, pearl earrings, black baseball cap, large dark sunglasses, long belted camel trench coat, black leather driving gloves, black trousers, black ankle boots, hint of a smile` | `pulling on a glove finger by finger` · `fast horizontal slash with a plain black card, gold sparkle trail` · `swinging two big plain shopping bags, one white one black, rope handles` · `clicking a car key fob, arm out` · `pointing, asking sharply` · `stepping up into a van` · `a tiny nod over her shoulder` |
| `boss_driver__dinner` | the same, `seated at a table in a dark green silk blouse, sunglasses on, black cap on the table` | — |
| `boss_driver__reveal` | the same, `sunglasses off and folded in her hand, warm smile` | — |
| `boss_driver__young_1994` | `young woman aged 20 in 1994, big 1990s perm, white 1990s dress with puffed sleeves` | standard |
| `npc_mom_home` | `warm slightly plump Taiwanese mother in her early 50s, short permed curly dark-brown hair, round friendly face, bright arched eyebrows, pink floral blouse, grey cardigan, beige trousers` | `ironing a pale blue shirt at an ironing board` · `sitting on a sofa in the dark, arms folded, a blue-and-white plastic slipper in hand` · `raising a blue-and-white slipper` · `holding up a phone filming, delighted` |
| `boss_lunch_lady` (`--oref` = **the npc_mom_home sheet**, so the face carries over) | `school cafeteria lunch lady in her early 50s, white hairnet cap covering her hair, light-blue surgical mask, bright arched eyebrows, white apron over a pink floral blouse showing at collar and sleeves, white sleeve covers, blue-and-white plastic slippers, holding a big ladle, stern but caring eyes, funny` | `holding a slipper like a weapon, ladle in the other hand` · `overhand slipper throw` · `reaching forward with both hands as if zipping a jacket to the chin` · `holding out a spoon` · `pointing a finger, scolding` · `leaning back shouting with all her might, hairnet strands flying, shockwave lines` · `reaching up to straighten a collar, tender` · `holding out a lunchbox with both hands` · `mask pulled down to the chin, phone in hand, beaming` |
| `npc_mom_young` | `young waitress aged 20 in 1994, ponytail, white blouse, black vest, holding a plate of cut fruit, shy smile` | — |
| `npc_dad_home` | `quiet proud Taiwanese father about 54, short neat black hair greying at the temples, square jaw, calm face, white athletic tape around his knuckles, plain white T-shirt, grey sweatpants, house slippers` | `hidden behind a newspaper` · `lowering a newspaper to look over it` · `sitting in the dark with a fake grey beard in his lap` · `cupping his mouth, shouting` · `shadow-boxing` · `jumping up so fast his chair falls, both arms up` |
| `boss_straw_hat` (`--oref` = **the npc_dad_home sheet**) | `man disguised as an old hermit, wide-brim woven straw sun hat, obviously fake long grey beard with a visible elastic strap over the ears, loose beige linen shirt, grey trousers rolled at the ankles, black cloth shoes, holding a folded wooden Chinese chess board` | `seated studying a xiangqi board` · `charging with the chess board held like a shield` · `flicking a round chess piece in a high arc` · `lunging with both hands to pin someone` · `fake beard hanging half off one ear` · `hat in one hand, peeling off the fake beard` |
| `boss_straw_hat__black_suit` | the same man, `black suit and sunglasses, tiny thumbs-up` | — |
| `npc_dad_young` (playable in the bonus stage: full player pose set) | `energetic young man aged 22 in 1994, 1990s middle-parted curtain haircut, denim jacket over a white T-shirt, light jeans, white high-top sneakers` | standard + §5.2 list |
| `boss_fruit_aunt` | `sturdy sun-tanned Taiwanese market woman in her late 40s, hair in a bun under a patterned headscarf, towel around her neck, red apron printed with small fruit, colourful floral sleeve covers, white rubber boots, holding a big watermelon in each hand, fierce and proud, comic` | `rolling a watermelon along the ground` · `throwing a spiky durian overhead` · `squeezing someone's arm like testing fruit, unimpressed` · `shoulder charge` · `sitting in a pile of broken fruit, devastated, cartoon` · `pointing up the road` · `arms folded, stern` · `seated in a plain blouse, arms folded, almost smiling` |
| `boss_fruit_aunt_teen` | `scowling girl aged 15 in 1994, high ponytail, oversized 1990s T-shirt, a red fruit-print apron too big for her` | standard |
| `boss_ban` (`--ar 6:7`) | `enormous round jolly Taiwanese uncle, shaved bald head, eyes closed in happy crescents, huge warm smile, small neat goatee, cream linen tang-style jacket with frog buttons, matching trousers, black cloth shoes, seated on a tiny folding stool pouring tea from a small clay teapot` | `holding out a tiny teacup with both hands, beaming` · `knocked onto his bottom, still pouring tea, smiling` · `laughing and stepping aside` · `bowing with a tea tray` · `folding up the tea set, serious` |
| `npc_ken` | `friendly confident traffic police officer in his late 40s, white peaked cap, white short-sleeve uniform shirt, fluorescent yellow-green reflective vest, white gloves, dark navy trousers, whistle, generic uniform, standing on a small round traffic podium directing traffic` | `blowing the whistle, cheeks puffed` · `pointing up the road` · `polite bow` |
| `boss_howard` | `polished young man about 28, slicked side-parted hair, pleased confident smile, pale pink polo shirt, cardinal-red sweater tied over his shoulders, beige chinos, brown loafers, holding a smartphone` | `hand on chest, eyes closed, sparkles` · `throwing three thick textbooks in a fan` · `lecturing from index cards, sleepy zzz aura` · `taking a selfie while bowing` · `holding a phone up for a group photo` |
| `npc_xiaole` | `serious 9-year-old boy, big round glasses, bowl haircut, white school shirt, navy shorts, white socks, sitting at a tiny folding desk doing homework` | `flicking an eraser over his shoulder without looking` · `closing the workbook, satisfied` |
| `npc_toddler` | `chubby cheerful 3-year-old girl, red mini qipao with gold trim, two pigtails with red pom-poms, toddling` | `a determined little punch` · `giggling` · `dripping with soup, delighted, arms up` · `clapping in a wooden high chair` · `pointing` |

The **lunch lady and the straw-hat uncle must be recognisable** as his parents: same eyebrows,
eyes and build as the everyday versions. Use the everyday sheet as `--oref` and raise `--ow` to
200–300.

**`npc_waigong_portrait`** (prop, 48×64):

```
dignified painted oil portrait in an ornate gold frame, elderly Taiwanese matriarch around 80, silver hair in a neat bun, dark navy qipao, jade bangle, sitting upright, faint knowing smile, pixel art, flat magenta background around the frame --ar 3:4 --style raw --s 50 --sref STYLE_REF --no text, letters, watermark
```

### 5.4 Enemies (one command each)

Every enemy also needs the standard fighter poses (§5.1). Crowd variants `__b`, `__c`: change the
hair and clothing colours in the subject and keep the `--seed`, or use **Editor → Vary Region**
on the clothes.

```
polite tired office worker, neat short hair, white shirt with rolled sleeves, loose tie with a tiny gold pin, dark trousers, swinging a brown leather briefcase, apologetic face, chibi pixel art game sprite, modern Kunio-kun River City beat 'em up style, 2.5 heads tall, big blocky square head, dot eyes, thick black eyebrows, 1-pixel dark brown outline, flat cel colours, crisp 16-bit pixels, full body, 3/4 side view facing right, plain flat magenta background --ar 2:3 --style raw --s 50 --sref STYLE_REF --no text, letters, logo, watermark, blood, gun, knife, sword, gradient, soft shading, 3d render, realistic, anime, floor shadow
```
```
wiry street ticket scalper, backwards cap, loud Hawaiian-print shirt, bum bag across the chest, shorts, flip-flops, holding a fan of blank tickets, sly friendly grin, chibi pixel art game sprite, modern Kunio-kun River City beat 'em up style, 2.5 heads tall, big blocky square head, dot eyes, thick black eyebrows, 1-pixel dark brown outline, flat cel colours, crisp 16-bit pixels, full body, 3/4 side view facing right, plain flat magenta background --ar 2:3 --style raw --s 50 --sref STYLE_REF --no text, letters, logo, watermark, blood, gun, knife, sword, gradient, soft shading, 3d render, realistic, anime, floor shadow
```
```
cheerful food-delivery rider, plain orange jacket, white open-face helmet, big orange square insulated delivery backpack, jeans, sneakers, chibi pixel art game sprite, modern Kunio-kun River City beat 'em up style, 2.5 heads tall, big blocky square head, dot eyes, thick black eyebrows, 1-pixel dark brown outline, flat cel colours, crisp 16-bit pixels, full body, 3/4 side view facing right, plain flat magenta background --ar 2:3 --style raw --s 50 --sref STYLE_REF --no text, letters, logo, brand, watermark, blood, gun, knife, sword, gradient, soft shading, 3d render, realistic, anime, floor shadow
```

For the rest, use the same pattern: **subject + sprite suffix** (§5.1).

| Id | Subject | Attack pose phrases |
|---|---|---|
| `enemy_office_worker__b` / `__c` | `__b`: `with glasses and a moustache, light grey shirt, navy tie`; `__c`: `female office worker in a blouse and pencil skirt, ponytail, brown briefcase` | `horizontal briefcase swing` · `backhand briefcase swing` |
| `enemy_scalper` | (above) | `flicking tickets in a spread` · `hopping backwards` |
| `enemy_delivery_rider` | (above) | `dashing shoulder-first with the backpack, speed lines` |
| `enemy_basketball_player` | `sporty university student, red basketball jersey with the number 7, white headband, shorts, high socks, basketball shoes, holding a basketball, confident grin` | `throwing a chest pass` · `leaping high with the ball overhead` |
| `enemy_cheerleader__a` | `energetic university cheerleader, modest blue-and-white long-sleeve top and knee-length pleated skirt, white sneakers, blue and white pom-poms, high ponytail, family-friendly` | `pom-poms thrown up`. Variants: `__b` a boy in the same colours with shorts; `__c` a girl with short hair |
| `enemy_cheerleader` pyramid (`--ar 3:4`) | `three cheerleaders in a wobbling human pyramid, two at the bottom, one on top` | `the pyramid toppling sideways, cartoon` |
| `enemy_club_recruiter` | `over-eager university club recruiter, hoodie, jeans, lanyard, clipboard, pushing a thick stack of colourful flyers, huge hopeful smile` | `lunging to stuff flyers into someone's arms` · `sitting dazed fanning himself with flyers` |
| `enemy_library_auntie` | `prim middle-aged librarian, beige cardigan, long skirt, reading glasses on a beaded chain, neat bun, finger to her lips` | `shushing with eyes closed, a wide pale-blue ripple aura` |
| `npc_student_reader` | `university student sitting at a library table, head down reading a thick book` | seated only; 3 variants |
| `enemy_groundskeeper__a` | `friendly estate groundskeeper, green overalls with a small blank round badge, conical straw farmer's hat, rubber boots, work gloves, bamboo rake` | `low sweeping rake swing` |
| `enemy_guard_dog` (`--ar 4:3`) | `big fluffy cream-coloured Akita-like dog, curled tail, smart red collar with a round blank tag, happy face, cute` | `sitting with tongue out` · `charging playfully` · `pausing, looking up` · `rolled belly-up, tail wagging` · `sitting dazed with little stars` · `trotting along` |
| `enemy_estate_security` | `broad calm estate security guard, black suit, earpiece with a curly wire, small blank lapel pin, short hair, polite` | `forearms up blocking like a shield` · `two-handed shove` |
| `enemy_valet` | `slick young parking valet, red waistcoat, white shirt, black bow tie, black trousers, swinging a huge ring of car keys` | `whipping the key ring forward` |
| `enemy_mechanic` | `sturdy garage mechanic, dark grey overalls with a small blank badge, grease smudge on the cheek, backwards cap, big wrench` | `wrench raised overhead` · `slamming the wrench down, dust` |
| `enemy_chauffeur` | `dignified chauffeur, grey uniform, peaked cap, white gloves, long black umbrella` | `umbrella opened like a shield` · `poking with the closed umbrella` |
| `enemy_men_in_black__a` | `tall professional man, black suit, white shirt, thin black tie, black sunglasses, earpiece, small blank lapel pin, apologetic polite expression` | `gently holding someone's arm` · `holding a van door open politely` · `gently lowering someone to the ground, hand behind their head`. `__b` stocky, `__c` average build; `formation` (`--ar 3:2`): all three in a triangle |
| `enemy_men_in_black__1994` | `1990s man in black, huge shoulder-pad black suit, wide tie, big sunglasses, slicked hair` | standard |
| `enemy_catering_staff` | `smart catering waiter, white jacket, black trousers, silver serving tray, polite smile` | `throwing dinner rolls in a spread` · `tray held up as a shield` |
| `enemy_aunt__a` | `chatty glamorous Taiwanese auntie in her 50s, purple qipao, pearl necklace, permed hair, big serving spoon, delighted nosy face` | `swinging the serving spoon` · `leaning in with one finger raised, nosy`. `__b` sequinned cardigan, short curly hair; `__c` floral dress, big hair clip |
| `enemy_cousin__a` | `trendy young adult cousin, smart polo shirt, sneakers, holding up a phone for a flash photo, friendly grin` | `phone up with a white flash burst` · `dashing forward`. `__b` young woman in a cropped jacket; `__c` dyed light-brown hair, striped polo |
| `enemy_kitchen_staff__a` | `proud chef, white chef's whites, tall chef's hat, red neckerchief, big black wok` | `wide wok swing` · `tilting the wok, a big round cartoon flame puff` |
| `enemy_office_worker_1994` | `1990s office worker, big-shouldered suit, wide tie, pager on his belt, brick-sized mobile phone` | standard |
| `enemy_perm_guy_1994` | `1990s street guy, big curly perm, acid-wash denim jacket, high-waisted jeans, cool pose` | standard |
| `enemy_boombox_1994` | `1990s youth, shiny tracksuit, big boombox on his shoulder, music notes floating out` | standard |

---

## 6. Backgrounds ★ Midjourney's strength

**Background suffix:**

```
, detailed pixel art background, side-scrolling beat 'em up stage, modern Kunio-kun River City style, side view from slightly above, wide flat empty walkable ground across the lower half, buildings and walls along the back, softly tilt-shift blurred distance, cinematic lighting, soft bloom, crisp pixels, Taiwan --ar 16:9 --s 150 --sref STYLE_REF --no people, person, character, animal, text, letters, signage text, logo, brand, watermark, blood
```

**Layout:** the game's HUD covers the top 13% and the dialogue the bottom 14%. If the walkable
floor comes out too small, add `low horizon, large foreground floor` to the subject.

**Two-screen backgrounds:** use `--ar 32:9`. If the result is weak, make it at `16:9`, then
**Pan →** (or Editor → expand right) with the same prompt.

**Variants** (night, lanterns off, no van): open the image in the **Editor**, *Vary Region* over
the part that changes, and edit the prompt. Or re-run with the same `--seed` and the changed
words.

### Title and prologue

```
quiet residential street near a Taiwanese university at golden hour, long orange shadows, low apartment buildings with iron window grilles and potted plants, row of parked scooters, streetlights flickering on, orange-pink sky, a plain black van parked at the far end with headlights off, nostalgic, calm, slightly mysterious, detailed pixel art background, side-scrolling beat 'em up stage, modern Kunio-kun River City style, side view from slightly above, wide flat empty walkable ground across the lower half, buildings and walls along the back, softly tilt-shift blurred distance, cinematic lighting, soft bloom, crisp pixels, Taiwan --ar 16:9 --s 150 --sref STYLE_REF --no people, person, character, animal, text, letters, signage text, logo, brand, watermark, blood
```
`bg_title_street`. Variant `__no_van`: Vary Region over the van, remove it.

```
small warm cosy Taiwanese apartment living room in the afternoon, sunlight through lace curtains, worn fabric sofa, low wooden coffee table, TV cabinet, wall clock, rice cooker on a side counter, family photos on the wall, an empty shelf spot behind the sofa, an ironing board in the middle of the room, modest, lived-in, loving, detailed pixel art background, side view from slightly above, wide flat floor across the lower half, cinematic warm lighting, soft bloom, crisp pixels, modern Kunio-kun River City style --ar 16:9 --s 150 --sref STYLE_REF --no people, person, character, text, letters, logo, watermark
```
`bg_home_living_room`. Variant `__night_dark`: the same, `at night with the lights off, only one table lamp's warm pool of light by the sofa, deep blue shadows`.

### All other backgrounds: **subject + background suffix**

Add `--ar 32:9` in place of `--ar 16:9` where it says **2 screens**.

| Id | Screens | Subject |
|---|---|---|
| `bg_stage1_market_row` | 2 | `busy Taiwanese traditional market street at sunset, orange-pink sky, shopfronts under arcades, colourful vertical blank neon signs starting to glow, striped awnings, hanging lamps, plastic stools, crates and baskets, parked scooters, tangled overhead cables, wide paved street, lively, warm, slightly chaotic` |
| `bg_stage1_junction` | 1 | `big Taiwanese city crossroads at sunset, zebra crossings, traffic lights, tall buildings with blank billboards, pedestrian overpass in the distance, empty centre of the junction, cars and scooters stopped in neat rows at the edges` |
| `bg_stage1_arcade_rain` | 2 | `long covered pedestrian arcade in a Taiwanese city in heavy rain, grey-blue light, the arcade roof covering the back half of the street with clear gaps where rain pours through, wet glossy floor tiles reflecting neon, closed metal shutters, rain streaks, puddles, moody but not gloomy` |
| `bg_stage1_loading_bay` | 1 | `loading bay behind a city market at dusk, two big roll-up metal shutters on the left and right walls, stacked crates and pallets, a hand truck, a puddle, flickering fluorescent tubes, orange sky above the walls` |
| `bg_stage1_fruit_stall` | 1 | `narrow Taiwanese street at sunset at the end of a market, a red and white striped fruit-stall awning at the back centre, pyramids of watermelons, crates of mangoes, guavas, pineapples and lychees, hanging scale, hanging lamps, plastic stool, warm orange light, proud and carefully kept` |
| `bg_stage2_back_gate` | 1 | `back gate of a Taiwanese university at blue hour, wide campus road, red-brick buildings with warm lit windows, palm trees, gate with a blank plaque, row of orange shared bicycles at a docking rack, streetlights, deep blue sky`. Variant `__exit`: bike rack in focus |
| `bg_stage2_sports_field` | 2 | `university sports field at night under bright white floodlights, outdoor basketball court with hoops at the back, red running track, bleachers, chain-link fence, deep blue sky, last light of dusk` |
| `bg_stage2_club_street` | 2 | `campus walkway at night lined with student club booths under warm fairy lights, blank banners, guitar cases, board-game boxes, blank posters, balloons, a tree with lights, student festival` |
| `bg_stage2_library` | 1 | `silent university library reading room at night, tall wooden bookshelves along the back wall, long wooden tables with green desk lamps, librarian's desk on one side, big windows with a deep blue night sky, hushed warm lamp light` |
| `bg_stage2_cafeteria` | 1 | `university cafeteria closed for the night, rows of empty tables and plastic chairs, metal serving counters with steam trays, one counter still lit warmly with a big steaming soup pot, blank menu board, the rest dim blue, homely, slightly comic` |
| `bg_transition_bike_road` | 2 | `road leaving the city at dusk, rice fields and small houses on one side, dark green forested mountain ahead, power lines, purple-blue sky with the first stars, simple shapes` |
| `bg_stage3_lower_gate` | 1 | `foot of a private mountain at dusk, ornate wrought-iron gate open between stone pillars, blank stone plaque, smooth private road winding up into lush subtropical forest, ferns, banyan trees, purple-blue sky, warm lamps on the pillars` |
| `bg_stage3_dog_run` | 1 | `manicured lawn beside a private mountain road at dusk, neat wooden fence, a luxurious dog house like a miniature villa, dog bowls, trimmed hedges, garden lamps` |
| `bg_stage3_pond_path` | 2 | `Chinese garden path on a mountainside at dusk, koi pond with stepping stones and orange koi, small arched stone bridge, weeping willows, rocks, rows of paper lanterns, some glowing warmly, some dark, peaceful and expensive`. Variant `__lanterns_off`: `at night, every lantern dark, cold moonlight` |
| `bg_stage3_stone_steps` | 2 | `long flight of stone steps climbing diagonally from lower left to upper right up a forested mountainside at nightfall, stone lanterns on both sides, bamboo groves, mist, small flat landing at the top` (the stairs are the walkable area: drop "wide flat empty walkable ground" from the suffix) |
| `bg_stage3_tea_road` | 1 | `wide bend of a private mountain road at nightfall, breathtaking view of a whole city glittering below under a purple-blue sky, low stone railing, pine trees, soft evening mist, an empty middle of the road`. Variant `__night`: later, darker |
| `bg_stage4_ramp_down` | 1 | `curving concrete ramp down into a luxurious underground garage, sleek white LED strips along the walls, blank level sign, polished grey concrete, cool white-blue light, modern and expensive` |
| `bg_stage4_showroom` | 2 | `luxurious private underground garage lit like a car showroom, glossy polished reflective floor, white LED ceiling panels, a row of generic supercars along the back, a vintage limousine, a motorbike on a rotating display turntable, blank number plates, absurdly rich` |
| `bg_stage4_van_bay` | 1 | `centre bay of a luxurious underground garage, an empty marked parking space in the middle, generic supercars on both sides, concrete pillars, bright white LED light, glossy reflective floor` |
| `bg_stage4_exit_ramp` | 1 | `wide concrete exit ramp climbing up out of a luxurious underground garage seen from the bottom, at the top an opening to the night with warm floodlight spilling in and a corner turning out of sight, LED strips along the walls, empty middle of the ramp, dramatic, quiet, lonely, a feeling of a decision` |
| `bg_stage5_courtyard` | 2 | `floodlit front courtyard of a grand Chinese-modern mansion at night, big marble fountain, catering vans with back doors open, a helicopter under a fitted cover on a helipad, red lacquered main door at the top of wide stone steps, warm golden light from tall windows` |
| `bg_stage5_ancestral_hall` | 1 | `long solemn ancestral hall in a Chinese mansion at night, dark carved wooden panels, red lacquer pillars, altar with incense and candles at the back, rows of small framed family photographs on the walls, one large empty frame space, warm candlelight, gold accents` |
| `bg_stage5_kitchen` | 1 | `huge busy professional kitchen in a mansion, stainless steel counters, roaring wok burners with flames, towers of bamboo steamers, warming trays, hanging ladles, steam everywhere, pantry door on one side, door to a hall with a glimpse of a piano on the other, warm and energetic` |
| `bg_stage5_grand_corridor` | 2 | `long grand mansion corridor at night, polished marble floor, carved wooden doors along the back wall with empty pedestals between them, crystal wall lights, red carpet runner, at the far right end enormous ornately carved double doors with warm light glowing underneath` |
| `bg_dining_room` ★ | 1 | `grand warm Chinese mansion dining room at night, an empty clear floor in the centre for a large round table, chandelier, red and gold decor, carved wooden screens, coat rack by the door, door to the kitchen on one side, broken-open main doors on the other, warm golden light` |
| `bg_estate_front_steps_morning` | 1 | `front steps and red lacquered door of a grand Chinese-modern mansion in soft early morning light, dew, birds, peaceful quiet courtyard` |

Separate props go into the empty spaces later: the stalls, booths, vases, van, tea table, the
dining table, the banner and the easel. **Don't ask Midjourney for them inside the background.**

---

## 7. Cutscene stills (characters allowed)

Use the background suffix **but delete `person, character` from `--no`**, and use
`--oref <the candidate's approved sheet>` so he stays on-model.

> **Open question:** the briefs don't say whether stills showing the candidate need one version
> per look (felix / lucian / hilman). Check before producing them.

| Id | Subject |
|---|---|
| `still_g01_arcade_bench` | `a young man in a pale blue shirt asleep on a bench under a covered arcade, a towel over his head, heavy rain outside, a folded note beside him` |
| `still_g01_nurse_office` | `a young man in a pale blue shirt asleep on a school nurse's office bed, an ice pack on his forehead, a folded note on the side table` |
| `still_g01_pavilion` | `a young man asleep in a garden pavilion under a blanket, a cup of steaming tea beside him, glowing paper lanterns` |
| `still_g01_limo` | `a young man asleep on the back seat of a limousine, seatbelt fastened, a folded note on his chest` |
| `still_g01_guest_room` | `a young man asleep in a luxurious guest bed, house slippers lined up neatly by the bed` |
| `still_g02_carried` | `first-person blurry view looking up at a mansion corridor ceiling with crystal lights passing overhead, hands at the edges of the view, being carried` |
| `still_e0_suitcase_table` | `a silver aluminium suitcase on a small coffee table in a dark living room, a blue-and-white plastic slipper beside it` |
| `still_e1_family_photo` | `two families together around a round dining table, everyone holding up a piece of fruit, laughing, chibi characters` |
| `still_e2_montage_park` | `a park at dawn, a father and son shadow-boxing side by side, a mother filming them on her phone, chibi characters` |
| `still_e2_montage_stairs` | `a father and son running up long temple stairs at dawn, chibi characters` |
| `still_e2_montage_melons` | `a father and son carefully carrying watermelons in their arms, chibi characters` |
| `bg_1994_market` | the `bg_stage1_market_row` subject + `in 1994, older blank shop signs, CRT TVs in a shop window, older scooters, a public phone booth, faded VHS colours` (`--sref` the finished Stage 1 image) |
| `bg_1994_fruit_stall` | the `bg_stage1_fruit_stall` subject + `in 1994, newer paint, brighter awning` |
| `still_1994_dining` | `1994 dining room scene like an old photo, two young men at a round table each holding a blank sheet of paper, a young waitress with a fruit plate behind them, slightly faded, warm` |

---

## 8. Props and items

**Prop suffix** (replace `X:Y`):

```
, pixel art game prop, single object centred, side view from slightly above, 1-pixel dark outline, flat cel colours, crisp pixels, cartoon, plain flat magenta background --ar X:Y --style raw --s 50 --sref STYLE_REF --no text, letters, numbers, logo, brand, watermark, shadow, people
```

States (`__broken`, `__open`, …): open the approved image in the **Editor**, *Vary Region* over
the object, and type the state's subject. It keeps the size and angle.

| Id | `--ar` | Subject | States |
|---|---|---|---|
| `prop_trophy_1994` | 3:4 | `small slightly dusty gold trophy cup on a wooden base with a blank plaque` | — |
| `prop_ironing_board` | 16:9 | `ironing board with an iron and a neatly pressed pale blue button-up shirt on it` | — |
| `prop_newspaper` | 4:3 | `folded newspaper with blank columns` | — |
| `prop_market_stall` | 5:4 | `Taiwanese street market stall, wooden table with a small striped awning, baskets of vegetables and snacks` | `__broken`: `collapsed comically, awning hanging, produce scattered` |
| `prop_fruit_crate` | 4:3 | `wooden crate of oranges` | `__broken`: `split crate, oranges rolling` |
| `prop_showpiece_melon` ★ | 5:4 | `one enormous perfect glossy green-striped watermelon proudly on a small red silk cushion on a wooden counter, tiny ribbon on its stem` | `__cracked`: `a crack across it`; `__broken`: `split open, red flesh and seeds, cushion askew, cartoon` |
| `prop_melon` | 5:4 | `ordinary green-striped watermelon` | `__roll` |
| `prop_durian` | 1:1 | `spiky green durian, cartoon` | — |
| `prop_traffic_podium` | 3:2 | `small round white-and-blue traffic police podium` | — |
| `prop_club_booth` | 5:4 | `student club booth, folding table with a blank cloth banner, flyers, a guitar case` | `__broken`: `table folded in on itself, flyers everywhere` |
| `prop_cheer_card` | 3:2 | `blank white card held up` | — |
| `prop_shared_bike` | 16:9 | `generic orange city shared bicycle with a front basket` | — |
| `prop_folding_desk` | 3:2 | `tiny folding desk with an open blank workbook, pencils, an eraser` | — |
| `prop_tea_table` ★ | 2:1 | `folding table with a full gongfu tea service, small clay teapot, tea tray, tiny cups, kettle on a small burner, tiny golden tea tin` | — |
| `prop_xiangqi_board` | 3:2 | `wooden Chinese chess board with round red and black pieces mid-game` | — |
| `prop_xiangqi_piece` | 1:1 | `single round wooden chess piece` | — |
| `prop_teacup` | 1:1 | `tiny white porcelain teacup with steam` | — |
| `prop_van` ★ | 2:1 | `plain black minivan with tinted windows, side view, blank number plate` | `__door_open` sliding side door open · `__rear_open` · `__reverse` white reversing lights |
| `prop_photo_1994_visor` | 4:3 | `small faded photograph of three young people in 1990s clothes outside a garage, one face covered by a parking ticket` | — |
| `prop_supercar` | 21:9 | `sleek generic red supercar, side view, blank number plate` | `__b` white · `__c` black · `__alarm` hazard lights flashing, doors popped open |
| `prop_money_suitcase` ★ | 4:3 | `shiny silver aluminium suitcase, closed` | `__open` neatly packed stacks of generic banknotes · `__burst` lying open, stacks spilled, notes fluttering |
| `prop_seating_chart` | 4:5 | `easel holding a blank board with a round-table diagram and blank name cards` | — |
| `prop_banner_rolled` | 21:9 | `long red banner rolled up hanging from ropes` | `__open` unrolled, red with a gold border, blank |
| `prop_photo_1994_hall` | 5:4 | `framed spotlit old photograph, two young men in 1990s shirts at a round dinner table holding blank papers, one with his back turned, a young woman behind with a fruit plate` | — |
| `prop_soup_trolley` | 4:3 | `kitchen trolley with a huge white porcelain soup tureen` | `__tipping` · `__spilled` cartoon soup puddle |
| `prop_vase` | 2:3 | `tall blue-and-white porcelain vase on a carved wooden pedestal` | `__broken` cartoon shards, empty pedestal |
| `prop_dining_table` ★ | 21:9 | `large round banquet table for eleven, white tablecloth, glass lazy Susan, Chinese dishes, fish, soup, dumplings, greens, roast duck, steaming, bowls and chopsticks` | `__cold` no steam, half-eaten · `__cleared` bare tablecloth, one teacup |
| `prop_chair_dining` | 2:3 | `carved wooden dining chair` | `__hairnet` white hairnet folded on the seat |
| `prop_coat_rack` | 2:5 | `wooden coat rack` | `__straw_hat` wide straw sun hat hanging on it |
| `prop_cap_on_table` | 4:3 | `black baseball cap lying on a white tablecloth` | — |
| `prop_lazy_susan_dish` | 3:2 | `flying porcelain serving dish with food, motion lines` | — |
| `prop_high_chair` | 2:3 | `small wooden child's high chair` | — |
| `item_coin` | 1:1 | `shiny gold coin` | spin frames: Gemini or Flux are better |
| `item_hair_clip` ★ | 1:1 | `small white rabbit-shaped hair clip` | `__closeup`: the same with `--s 100`, more detail |
| `item_lunchbox` | 5:4 | `round stainless-steel lunchbox, lid off, braised pork over rice, fried egg, greens, folded note on top` | `__closed` |
| `item_envelope_lin` | 4:3 | `cream envelope with a blank red wax seal` | — |
| `item_note` | 1:1 | `small note on lined paper, blank lines` | — |
| `item_phone_cracked` | 2:3 | `smartphone with a badly cracked glowing screen` | `__repaired` |
| `item_fruit_plate` | 3:2 | `white plate of neatly cut watermelon slices` | `__apples` |
| `item_bill` | 4:5 | `small blank paper receipt` | — |

Final sizes are in [`props-items-ui.md`](props-items-ui.md).

---

## 9. Effects and UI

Midjourney is **weak at animation strips and UI**. Use Gemini (§12–13 there) or Flux. Two
exceptions work well here:

```
diagonal heavy rain streaks on a pure black background, evenly spread, pixel art --ar 16:9 --tile --style raw --s 0 --no text, letters, people
```
`vfx_rain_overlay` (key out the black in the engine; `--tile` makes it seamless).

```
CRT television scanlines and VHS tape look over a plain grey test card, faded colours, 1994 --ar 16:9 --style raw --no text, letters, logo
```
`vfx_crt_filter` (a reference image for the engine's shader).

**`ui_title_logo`: make it by hand.** Midjourney will get 熱血物語:見家長 wrong. Never
generate `ui_award_seal` or `ui_evaluation_form` here; they must contain no characters at all.
