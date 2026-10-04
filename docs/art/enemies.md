# Enemies and crowd

[← art README](README.md) · Style: README §1 · Prompt recipe: README §3

**Every enemy is family, staff or a friend of the family.** They are polite, comic people doing a
job, never menacing (rule A7). Expressions: determined, flustered, apologetic, cheerful.

**Every enemy needs the standard fighter poses** (see [`characters.md`](characters.md)): `idle`,
`walk`, `hurt`, `knocked_down`, **`dazed`** (sitting, rubbing head, stars circling), `get_up`,
**`bow`**, **`wave_leave`**, plus the attacks listed below. Size **32×48** unless noted.

**Colour variants:** the crowd types (office worker, aunt, cousin, kitchen staff, groundskeeper)
need **3 palette variants** each (`__a`, `__b`, `__c`): different hair and clothing colours, the same
design.

**The 林 badge:** where an entry says "林 badge", draw **a small blank circle badge** (gold on
dark, or white on green). The 林 character is added later (rule A4).

---

## Stage 1: City

### `enemy_office_worker` — 上班族 Office worker
- **Look:** a tired but polite salaryman. A white shirt with the sleeves rolled, **a loose tie**, a
  **tiny gold 林 badge tie pin**, dark trousers, black shoes, a **brown briefcase**. Neat short
  hair; variants with glasses, a moustache or a ponytail (a female office worker in a blouse and
  pencil skirt for `__c`).
- **Prompt:** *A polite, tired office worker in a white shirt with rolled sleeves, a loose tie with a
  tiny gold pin, dark trousers and black shoes, swinging a brown leather briefcase, saying "excuse
  me" with an apologetic face.*
- **Attacks:** `briefcase_swing` (a horizontal swing) · `briefcase_combo` (a two-hit swing).

### `enemy_scalper` — 黃牛 Ticket scalper
- **Look:** a wiry, quick man in a **backwards cap**, a loud **Hawaiian-print shirt**, a bum bag
  across his chest, shorts, flip-flops; **holding a fan of tickets**.
- **Prompt:** *A wiry street ticket scalper in a backwards cap, loud Hawaiian-print shirt, a bum bag
  across his chest, shorts and flip-flops, holding a fan of paper tickets, sly but friendly grin.*
- **Attacks:** `ticket_throw` (flicking tickets in a spread) · `retreat` (hopping backwards).

### `enemy_delivery_rider` — 外送員 Delivery rider
- **Look:** a **generic food-delivery rider** (no real company colours): an **orange jacket**, a
  **white helmet with a visor up**, a **big orange square insulated backpack**, jeans, sneakers.
- **Prompt:** *A cheerful food-delivery rider in a plain orange jacket, white open-face helmet, a big
  orange square insulated delivery backpack, jeans and sneakers. No logos.*
- **Attacks:** `bag_dash` (dashing forward shoulder-first with the backpack, speed lines).

---

## Stage 2: Campus at night

### `enemy_basketball_player` — 籃球隊 Basketball player
- **Look:** tall-ish student, **a red jersey with the number 7**, a **white headband**, shorts, high
  socks, basketball shoes, holding a basketball.
- **Prompt:** *A sporty university student in a red basketball jersey with the number 7, white
  headband, shorts, high socks and basketball shoes, holding a basketball, confident grin.*
- **Attacks:** `chest_pass` (throwing a ball straight ahead) · `dunk_leap` (leaping high, ball
  raised overhead).

### `enemy_cheerleader` — 啦啦隊 Cheerleader (spawns in threes)
- **Look:** **modest** cheer uniform: a **long-sleeve top and knee-length pleated skirt in blue and
  white**, white sneakers, **pom-poms**, a high ponytail (variants: a boy in the same colours with
  shorts, and a girl with short hair).
- **Prompt:** *An energetic university cheerleader in a modest blue-and-white long-sleeve top and
  knee-length pleated skirt, white sneakers, holding blue and white pom-poms, high ponytail,
  shouting cheerfully. Family-friendly.*
- **Attacks:** `cheer` (pom-poms up) · `pyramid` (**a three-person human pyramid image**, 48×64:
  two at the bottom, one on top, wobbling) · `pyramid_collapse` (the pyramid toppling sideways,
  cartoon).
- **Prop:** `prop_cheer_card` (a blank card held up by the top cheerleader; the text "加油 {name}" is
  added later).

### `enemy_club_recruiter` — 社團招生 Club recruiter
- **Look:** an eager student with **a lanyard**, **a clipboard**, **a thick stack of colourful
  flyers**, a hoodie, jeans; huge hopeful smile.
- **Prompt:** *An over-eager university student club recruiter in a hoodie and jeans with a lanyard
  and a clipboard, pushing a thick stack of colourful flyers forward with a huge hopeful smile.*
- **Attacks:** `flyer_grab` (lunging forward to stuff flyers into someone's arms) ·
  `fan_flyers` (dazed variant: sitting and fanning himself with flyers).

### `enemy_library_auntie` — 圖書館阿姨 Library auntie (support, never attacks)
- **Look:** a prim middle-aged woman, **a beige cardigan**, a long skirt, **reading glasses on a
  beaded chain**, her hair in a neat bun, a finger to her lips.
- **Prompt:** *A prim middle-aged librarian in a beige cardigan and long skirt, reading glasses on
  a beaded chain, hair in a neat bun, holding one finger to her lips saying "shh".*
- **Attacks:** `shush` (finger to lips, eyes closed, **a wide pale-blue ripple aura**).

### Bystanders: `npc_student_reader` (library, non-interactive)
- Students sitting at long tables, heads down over books, three variants. Seated only. **Prompt:**
  *A university student sitting at a library table, head down, reading a thick book, absorbed.*

---

## Stage 3: Mountain

### `enemy_groundskeeper` — 園丁 Groundskeeper
- **Look:** **green overalls with a 林 badge** on the chest, a **wide straw hat** (different from
  the dad's: a farmer's conical shape), rubber boots, work gloves, **a bamboo rake**.
- **Prompt:** *A friendly estate groundskeeper in green overalls with a small round badge on the
  chest, a conical straw farmer's hat, rubber boots and work gloves, holding a bamboo rake.*
- **Attacks:** `rake_sweep` (a low sweeping swing).

### `enemy_guard_dog` — 看門狗 Guard dog, 32×24
- **Look:** a **big fluffy cream-coloured dog** (Akita-like), a curled tail, a **smart red collar
  with a round 林 tag**, happy face. Not scary even when charging.
- **Prompt:** *A big fluffy cream-coloured dog like an Akita, curled tail, smart red collar with a
  round tag, happy face, charging playfully. Cute, not scary.*
- **Poses:** `idle` (sitting, tongue out) · `charge` · `pause` (between charges, looking up) ·
  **`belly_up`** (rolled over, tail wagging, petted) · `dazed` (sitting, little stars) · `follow`.

### `enemy_estate_security` — 保全 Estate security
- **Look:** a broad, calm man in **a black suit**, **an earpiece with a curly wire**, a 林 badge pin,
  short hair, hands raised in a guarding stance.
- **Prompt:** *A broad, calm estate security guard in a black suit with an earpiece and a small
  round lapel pin, short hair, both arms raised in a solid blocking stance, polite expression.*
- **Attacks:** `block` (forearms up, a shield-like stance) · `counter_shove` (a two-handed shove).

---

## Stage 4: Garage

### `enemy_valet` — 泊車員 Valet
- **Look:** **a red waistcoat** over a white shirt, a black bow tie, black trousers, **a huge ring
  of car keys**.
- **Prompt:** *A slick young parking valet in a red waistcoat over a white shirt with a black bow
  tie and black trousers, swinging a huge ring of car keys.*
- **Attacks:** `key_whip` (whipping the key ring forward).

### `enemy_mechanic` — 技師 Mechanic
- **Look:** **dark grey overalls with a 林 badge**, a grease smudge on the cheek, a cap worn
  backwards, **a big wrench**.
- **Prompt:** *A sturdy garage mechanic in dark grey overalls with a small round badge, a grease
  smudge on his cheek, a backwards cap, holding a big wrench.*
- **Attacks:** `wrench_overhead` · `ground_slam` (slamming the wrench down, dust).

### `enemy_chauffeur` — 司機 Chauffeur
- **Look:** a **grey chauffeur's uniform with a peaked cap**, white gloves, **a long black
  umbrella**.
- **Prompt:** *A dignified chauffeur in a grey uniform with a peaked cap and white gloves, holding a
  long black umbrella.*
- **Attacks:** `umbrella_shield` (umbrella opened in front like a shield) · `umbrella_poke`.

### `enemy_men_in_black` — 黑衣人 The three men in black (also in the prologue)
- **Look:** three men, **black suits, white shirts, thin black ties, black sunglasses, earpieces**,
  a 林 lapel pin. One tall (`__a`, the leader), one stocky (`__b`), one average (`__c`).
  Professional, apologetic.
- **Prompt:** *A professional man in a black suit, white shirt, thin black tie, black sunglasses and
  an earpiece, a small round lapel pin, apologetic polite expression despite the tough look.*
- **Poses:** standard poses + `grab_arm` (holding someone's arm, gently) · `hold_door` (holding a
  van door open politely) · `gentle_takedown` (lowering someone to the ground with a hand behind
  their head) · `formation` (the three standing in a triangle).
- **Variant `__1994`:** the same in 90s style: **huge shoulder-pad suits**, wide ties, big
  sunglasses, slicked hair.

---

## Stage 5: Estate

### `enemy_catering_staff` — 外燴人員 Catering staff
- **Look:** **a white catering jacket**, black trousers, **a silver serving tray**, neat hair.
- **Prompt:** *A smart catering waiter in a white jacket and black trousers holding a silver serving
  tray, polite smile.*
- **Attacks:** `roll_throw` (throwing dinner rolls in a spread) · `tray_block`.

### `enemy_aunt` — 阿姨 Aunt
- **Look:** chatty middle-aged aunts in their best dinner clothes: `__a` **a purple qipao** with a
  pearl necklace and permed hair; `__b` **a sequinned cardigan** and short curly hair; `__c` **a
  floral dress** and a big hair clip. Each holds **a big serving spoon**.
- **Prompt:** *A chatty, glamorous Taiwanese auntie in her 50s dressed up for a family dinner in a
  purple qipao and pearls, permed hair, holding a big serving spoon, asking nosy questions with a
  delighted face.*
- **Attacks:** `spoon_combo` · `question` (leaning in, one finger raised, nosy).

### `enemy_cousin` — 表親 Cousin
- **Look:** a trendy young cousin, **a polo shirt or a cropped jacket**, sneakers, **a phone in
  hand**; variants male/female.
- **Prompt:** *A trendy young adult cousin in a smart polo shirt and sneakers, holding up a phone to
  take a flash photo, friendly grin.*
- **Attacks:** `flash_photo` (phone up, **a white flash burst**) · `dash`.

### `enemy_kitchen_staff` — 廚師 Kitchen staff
- **Look:** **chef whites, a tall chef's hat**, a red neckerchief, **a big black wok**.
- **Prompt:** *A proud chef in white chef's whites, a tall chef's hat and a red neckerchief, swinging
  a big black wok.*
- **Attacks:** `wok_swing` · `flambe` (tilting the wok, **a big cartoon flame puff**).

---

## 1994 bonus stage extras (`level_bonus_1994`)

The same style with a **90s fashion** twist. Shown under a CRT filter in the game.

| Id | Look | Prompt |
|---|---|---|
| `enemy_office_worker_1994` | Big-shouldered 90s suit, **a pager on the belt**, a huge brick mobile phone | *A 1990s office worker in a big-shouldered suit, wide tie, a pager on his belt and a brick-sized mobile phone in hand.* |
| `enemy_perm_guy_1994` | **A big 90s perm**, an acid-wash denim jacket, high-waisted jeans | *A 1990s street guy with a big curly perm, acid-wash denim jacket and high-waisted jeans, striking a cool pose.* |
| `enemy_boombox_1994` | **Carrying a big boombox** on the shoulder, a tracksuit | *A 1990s youth in a shiny tracksuit carrying a big boombox on his shoulder, music notes floating out.* |
