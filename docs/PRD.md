# PRD: 熱血物語 - Princess Rescue (HTML5 Browser Game)

## 1. Game Overview

**Game Title**: 熱血物語：公主救援 (River City Ransom: Princess Rescue)  
**Genre**: Side-scrolling Beat 'Em Up / Action RPG  
**Platform**: HTML5 Browser (Desktop + Mobile)  
**Target Resolution**: 960x540 (16:9), pixel-perfect scaling  
**Art Style**: 16-bit retro pixel art, anime-inspired, vibrant colors  
**Inspiration**: Downtown Nekketsu Monogatari (River City Ransom), Scott Pilgrim vs. The World: The Game  
**Session Length**: 15-25 minutes per playthrough  
**Players**: Single-player (1P)

### 1.1 Core Vision
A fast-paced, combo-driven side-scrolling beat-'em-up where players choose one of three distinct heroes to rescue a kidnapped princess across three escalating stages. The game blends classic brawler mechanics with light RPG progression (HP/SP, leveling, simple stats) and a dramatic rescue narrative.

---

## 2. Story & Narrative Flow

### 2.1 Prologue (Opening Cutscene)
**Scene**: After school, near the school gate (City stage backdrop). The Princess (a young girl in a school uniform) is chatting with the Main Character.  
**Event**: Three mysterious black-clad men (Black Men Trio) suddenly appear, grab the Princess, and knock out the Main Character.  
**Transition**: Screen fades to black with text: "She's been taken... I must save her!"  
**Gameplay Start**: Player selects character → Stage 1 begins.

### 2.2 Stage Progression
| Stage | Name | Setting | Enemies | Boss | Narrative Beat |
|-------|------|---------|---------|------|----------------|
| 1 | City (城市) | School neighborhood, streets, shops, alleys | Thugs, Street punks, Delinquents | Black Man #1 (the kidnapper) | "They're hiding in the city outskirts!" |
| 2 | Forest (森林) | Dense woods, river crossing, ancient shrine path | Bandits, Wolves, Forest guardians | Black Man #2 (the enforcer) | "The trail leads into the cursed forest..." |
| 3 | Castle (城堡) | Gothic castle exterior, throne room, dungeon | Elite soldiers, Dark knights, Sorcerers | **Cloris** (Final Boss) | "The Princess is in the castle! Face Cloris!" |

### 2.3 Ending
- **Victory**: Princess is rescued. Brief reunion cutscene. Roll credits with pixel art portraits.
- **Game Over**: Continue screen with countdown. 3 continues allowed.

---

## 3. Playable Characters (主要角色)

Each character has distinct stats, moveset, and playstyle. All characters share the same base control scheme but differ in speed, power, and special moves.

### 3.1 Character Selection Screen
- **Layout**: Three character portraits side-by-side with stats displayed as bar charts.
- **Background**: School classroom with a "CHOOSE YOUR HERO" banner.
- **Selection**: Click/tap to select, then "START" button.

### 3.2 Character Details

#### FELIX (菲利克斯)
- **Archetype**: The Balanced Hero
- **Appearance**: Young boy, brown hair, white karate gi with red belt, sneakers
- **Stats**:
  - HP: ★★★☆☆ (100 base)
  - SP: ★★★★☆ (80 base)
  - Speed: ★★★★☆ (Fast)
  - Power: ★★★☆☆ (Medium)
  - Defense: ★★★☆☆ (Medium)
- **Special Moves** (SP cost):
  - **Rapid Punch** (10 SP): 5-hit flurry combo, knocks down
  - **Tornado Kick** (20 SP): Spinning kick, hits enemies on both sides
  - **Burning Spirit** (30 SP): Temporary attack boost (10 seconds)
- **Playstyle**: Beginner-friendly, versatile, good for learning combos

#### LUCIAN (卢西安)
- **Archetype**: The Speedster
- **Appearance**: Young boy, blonde hair, blue tracksuit, running shoes
- **Stats**:
  - HP: ★★☆☆☆ (80 base)
  - SP: ★★★★★ (100 base)
  - Speed: ★★★★★ (Very Fast)
  - Power: ★★☆☆☆ (Low)
  - Defense: ★★☆☆☆ (Low)
- **Special Moves**:
  - **Dash Strike** (10 SP): Quick lunging punch, closes distance
  - **Aerial Barrage** (25 SP): Jump + rapid kicks in mid-air
  - **Shadow Clone** (40 SP): Creates 2 afterimages that attack for 5 seconds
- **Playstyle**: Hit-and-run, aerial combos, requires dodging

#### VINCENT (文森特)
- **Archetype**: The Powerhouse
- **Appearance**: Adult man, muscular, black tank top, cargo pants, bandana
- **Stats**:
  - HP: ★★★★★ (140 base)
  - SP: ★★★☆☆ (60 base)
  - Speed: ★★☆☆☆ (Slow)
  - Power: ★★★★★ (Very High)
  - Defense: ★★★★☆ (High)
- **Special Moves**:
  - **Power Slam** (15 SP): Grab enemy and slam into ground (area damage)
  - **Earthquake Punch** (25 SP): Punches ground, shockwave knocks down all nearby enemies
  - **Berserker Rage** (50 SP): Invincibility + 2x damage for 8 seconds, drains HP slowly
- **Playstyle**: Tank, crowd control, slow but devastating

### 3.3 Shared Mechanics
- **Level Up**: Gain EXP from defeating enemies. Level max: 20.
- **Stat Growth**: Each level increases HP (+5), SP (+3), and minor ATK/DEF boosts.
- **EXP Bar**: Top-left corner, fills horizontally.

---

## 4. Control Scheme

### 4.1 Keyboard (Desktop)
| Key | Action |
|-----|--------|
| ← → | Move left/right |
| ↑ | Jump |
| ↓ | Crouch / Block (hold) |
| Z | Punch / Light Attack |
| X | Kick / Heavy Attack |
| C | Special Move (consumes SP) |
| Space | Interact / Pick up item |
| Enter | Pause |

### 4.2 Touch (Mobile)
- **Left side**: Virtual D-pad (up/down/left/right)
- **Right side**: 
  - A Button (Punch)
  - B Button (Kick)
  - C Button (Special)
- **Auto-targeting**: Character automatically faces nearest enemy

### 4.3 Combat System
- **Combo System**: Light attacks chain into heavy attacks. Example: Z-Z-Z-X = 3 punches + kick finisher
- **Juggling**: Enemies can be hit in mid-air for aerial combos
- **Grab**: Walk into stunned enemy to grab, then Z (punch) or X (throw)
- **Block**: Hold ↓ to reduce damage by 50%, but can be broken by heavy attacks
- **Knockdown**: Enemies flash white when hit, fall down, then get up with brief invincibility
- **SP Regen**: SP regenerates slowly (1 SP per 2 seconds) and from items

---

## 5. Stage Design (Detailed)

### 5.1 Stage 1: City (城市) - "School District Streets"
**Theme**: Urban Japanese school neighborhood, afternoon lighting  
**Background Layers** (parallax scrolling):
- Layer 1 (far): Distant buildings, mountains, clouds (0.2x speed)
- Layer 2 (mid): Trees, utility poles, shop signs (0.5x speed)
- Layer 3 (near): Sidewalk, street lamps, vending machines, benches (1.0x speed)

**Stage Sections** (auto-scrolls right, player cannot go back past screen edge):
1. **School Gate** (0-30%): Tutorial area, 3 basic thugs
2. **Shopping Street** (30-60%): 2 waves of enemies, breakable crates (drop items)
3. **Back Alley** (60-85%): Narrow path, ambush from both sides
4. **Boss Arena** (85-100%): Open plaza with fountain

**Interactables**:
- Crates/barrels: Breakable, drop coins or items
- Vending machines: Kick to drop soda (heal 20 HP)
- Benches: Can be picked up and thrown as weapons

**Enemies**:
- **Street Thug** (basic): Slow punches, 30 HP
- **Delinquent** (fast): Running tackles, 40 HP
- **Punk** (ranged): Throws bottles, 35 HP

**Boss**: **Black Man #1 - "The Kidnapper"**
- HP: 300
- Pattern: Charges at player, grabs and throws, calls 2 thugs at 50% HP
- Weakness: Vulnerable after missed charge attack (2 second window)
- Music: Intense synth-rock boss theme

**Stage Clear**: Rescue clue found, path to Forest unlocked.

---

### 5.2 Stage 2: Forest (森林) - "Cursed Woods"
**Theme**: Dense forest, mystical atmosphere, dim green/blue lighting  
**Background Layers**:
- Layer 1: Misty mountains, moon (0.2x)
- Layer 2: Tall trees, hanging vines (0.4x)
- Layer 3: Forest floor, rocks, river (0.8x)
- Layer 4: Foreground bushes (1.2x) - creates depth

**Stage Sections**:
1. **Forest Entrance** (0-25%): Wolves and bandits, tutorial for aerial combat
2. **River Crossing** (25-50%): Moving platforms over water, falling = 10 HP damage + respawn
3. **Ancient Shrine Path** (50-75%): Vertical elevation changes, shrine stairs
4. **Boss Clearing** (75-100%): Moonlit circular arena

**Hazards**:
- **Pitfalls**: Bottomless pits/river (instant 10 HP damage, respawn at platform)
- **Falling Logs**: Roll across screen periodically (dodge or jump)
- **Poison Mushrooms**: Touch = 5 HP damage + screen distortion for 3 seconds

**Enemies**:
- **Wolf** (fast): Lunging bites, 25 HP, hard to hit
- **Bandit** (medium): Sword strikes, 50 HP
- **Forest Guardian** (elite): Slow but powerful, throws rocks, 80 HP

**Boss**: **Black Man #2 - "The Enforcer"**
- HP: 500
- Pattern: Dual-wielding batons, spinning attack (invincible during spin), ground slam creates shockwave
- Phase 2 (50% HP): Speed increases, adds fire trail on dash
- Weakness: Spin attack leaves him dizzy for 3 seconds
- Music: Tribal drums + electric guitar

**Stage Clear**: Castle gate key obtained.

---

### 5.3 Stage 3: Castle (城堡) - "Cloris's Dark Fortress"
**Theme**: Gothic medieval castle, dark purple/red lighting, thunderstorm  
**Background Layers**:
- Layer 1: Stormy sky, lightning flashes (0.1x)
- Layer 2: Castle towers, stained glass windows (0.3x)
- Layer 3: Stone walls, torches, banners (0.6x)
- Layer 4: Pillars, throne steps (1.0x)

**Stage Sections**:
1. **Castle Gates** (0-20%): Elite soldiers, siege weapons as background
2. **Grand Hall** (20-45%): Chandeliers (can be knocked down for area damage), carpeted floor
3. **Dungeon** (45-70%): Narrow corridors, prison cells, spike traps on floor
4. **Throne Room** (70-85%): Final enemy gauntlet (3 waves of elite enemies)
5. **Boss Arena** (85-100%): Elevated throne platform, dramatic lighting

**Hazards**:
- **Spike Traps**: Floor spikes trigger on timer (visual warning: red glow)
- **Falling Chandeliers**: Hit to drop, damage all below
- **Fire Torches**: Can be knocked off walls, leave burning ground (DOT)

**Enemies**:
- **Elite Soldier** (strong): Sword combos, shield block, 70 HP
- **Dark Knight** (heavy): Slow, massive damage, 120 HP
- **Sorcerer** (ranged): Fireballs, teleport, 50 HP

**Final Boss**: **CLORIS (克洛丽丝)**
- **Title**: "The Dark Empress"
- **Appearance**: Tall woman in black gown, purple hair, glowing red eyes, floating slightly
- **HP**: 1000 (Phase 1: 600, Phase 2: 400)
- **Phase 1** (100%-40% HP):
  - **Dark Orb**: Ranged projectile, homing slightly, 15 damage
  - **Shadow Whip**: Melee range, 3-hit combo, 20 damage per hit
  - **Teleport**: Disappears and reappears behind player
  - **Summon**: Every 20 seconds, summons 2 Dark Knights
- **Phase 2** (40%-0% HP) - **"Desperation Mode"**:
  - Background changes: Red aura, cracks in floor
  - **Meteor Storm**: Rains fire from sky (dodge shadows on ground)
  - **Dark Beam**: Charges for 2 seconds, fires massive laser across screen (must jump or crouch)
  - **Vampire Touch**: Grabs player, drains 30 HP and heals herself 30 HP
  - **Enrage**: Attack speed +50%
- **Weakness**: After Meteor Storm, she is exhausted for 4 seconds (vulnerable, takes 2x damage)
- **Music**: Epic orchestral + metal hybrid, intensifies at Phase 2

**Victory Sequence**:
1. Cloris defeated animation (falls to knees, dissolves into shadows)
2. Princess breaks free from cage in background
3. Runs to Main Character, hug animation
4. Screen fade to white
5. Ending text: "The Princess is safe... for now."
6. Credits roll with pixel art of all characters

---

## 6. Enemy System

### 6.1 Enemy AI Behavior
- **Idle**: Patrol small area, play idle animation
- **Alert**: When player enters 200px range, exclamation mark (!) appears above head
- **Attack**: Move toward player, execute attack pattern
- **Stun**: Flash white for 0.5s when hit, knockback
- **Knockdown**: Fall, get up with 1s invincibility
- **Death**: Flash, disappear with particle effect, drop item/coin

### 6.2 Enemy Spawn System
- **Scripted Spawns**: Fixed positions in each stage section
- **Wave System**: Clear wave → Screen edge flashes → Next wave spawns
- **Ambush**: Enemies drop from above or burst from doors/barrels

---

## 7. Items & Power-ups

| Item | Effect | Visual |
|------|--------|--------|
| Coin | +10 Score / +5 EXP | Small gold coin, spins |
| Soda Can | Heal 20 HP | Blue can with "SODA" label |
| Bento Box | Heal 50 HP | Rice box with fish |
| SP Drink | Restore 30 SP | Green energy drink |
| Power Up | ATK +20% for 30s | Red flaming fist icon |
| Speed Up | Speed +30% for 30s | Blue wing icon |
| Defense Up | DEF +30% for 30s | Yellow shield icon |
| 1-Up | Extra life | Heart icon |

**Weapons** (can be picked up and thrown):
- Baseball Bat: 3 uses, high knockback
- Pipe: 2 uses, piercing hit
- Rock: 1 use, thrown projectile

---

## 8. HUD & UI Design

### 8.1 In-Game HUD (Top of Screen)
**Layout** (inspired by uploaded reference images):




[Top Bar - Black background, 60px height]
┌─────────────────────────────────────────────────────────────┐
│ [P1 Portrait] HP: ████████░░ 120/150  SP: ██████░░░░ 60/100  │  DAY 1  15:27  │  $ 1,000  │
│   [Lv.5]   [Green bar]         [Orange bar]                │
└─────────────────────────────────────────────────────────────┘




**Elements**:
- **Portrait**: Character face icon (left side)
- **HP Bar**: Green, decreases left-to-right, shows current/max
- **SP Bar**: Orange/Yellow, below HP bar
- **Level**: "Lv.X" below portrait
- **EXP Bar**: Thin cyan bar below SP bar
- **Day/Time**: Center-top (cosmetic, advances per stage)
- **Money**: Right side, coin icon + amount

### 8.2 Damage Numbers
- White numbers pop up on hit
- Critical hits = Yellow numbers, larger font
- Healing = Green numbers with "+" prefix

### 8.3 Dialogue Box
- **Style**: Black semi-transparent box at bottom, 120px height
- **Name**: Left side in colored box (e.g., "三上" in blue)
- **Text**: Typewriter effect, white font
- **Arrow**: Blinking arrow at bottom-right when waiting for input

### 8.4 Pause Menu
- Resume
- Restart Stage
- Controls Help
- Quit to Title

---

## 9. Art & Audio Direction

### 9.1 Art Style
- **Resolution**: Game rendered at 480x270 (pixel-perfect), upscaled 2x to 960x540
- **Color Palette**: Vibrant, high contrast, inspired by 90s arcade games
  - City: Warm oranges, blues, concrete grays
  - Forest: Deep greens, dark blues, moonlight whites
  - Castle: Dark purples, blood reds, gold accents
- **Character Sprites**: 
  - Size: 32x48 pixels base (chibi proportions, large heads)
  - Animation frames: Idle (2), Walk (4), Punch (3), Kick (3), Jump (2), Hurt (1), Knockdown (2), Special (4-6)
- **Effects**: 
  - Hit sparks: White/yellow star bursts
  - Special moves: Semi-transparent colored aura (blue for Felix, yellow for Lucian, red for Vincent)
  - Screen shake: 3-5px offset on heavy hits

### 9.2 Audio
**Music Style**: Chiptune + FM synthesis rock (like Sega Genesis/Mega Drive sound)
- **Title Screen**: Upbeat, heroic theme
- **City Stage**: Funky bass + drum, city pop vibe
- **Forest Stage**: Mysterious, flute + drums, tension building
- **Castle Stage**: Dark, pipe organ + heavy metal guitar
- **Boss Battle**: Fast tempo, intense drums, synth leads
- **Final Boss (Cloris)**: Two-phase track, transitions at 40% HP
- **Victory**: Triumphant 5-second jingle
- **Game Over**: Sad descending notes

**SFX**:
- Punch/Kick: Crunchy impact sounds
- Special moves: Whoosh + explosion
- Enemy hit: Grunt + slap
- Item pickup: Bright chime
- Boss death: Long explosion
- UI click: 8-bit blip

---

## 10. Technical Architecture

### 10.1 Tech Stack
- **Engine**: Pure HTML5 Canvas API (no external game engines for simplicity)
- **Language**: JavaScript (ES6+), single file or modular
- **Renderer**: 2D Canvas with pixel-art scaling (nearest-neighbor)
- **Audio**: Web Audio API or HTML5 Audio elements
- **Input**: KeyboardEvent + TouchEvent
- **Storage**: localStorage for high scores and settings

### 10.2 Game Loop Structure
```javascript
// Target: 60 FPS
function gameLoop() {
  update(); // Input, physics, AI, collision
  render(); // Draw layers, entities, HUD
  requestAnimationFrame(gameLoop);
}



10.3 Core Systems
State Machine: TITLE → CHARACTER_SELECT → CUTSCENE → PLAYING → PAUSED → STAGE_CLEAR → GAME_OVER → ENDING
Entity Component System: Position, Velocity, Sprite, Health, AI components
Collision Detection: AABB (Axis-Aligned Bounding Box) for simplicity
Camera: Follows player with slight lookahead (based on facing direction), smooth lerp
Particle System: For hit effects, dust, explosions
Save System: Auto-save at stage start, continue from last stage
10.4 Asset Requirements
Images (PNG with transparency):
spritesheet_player_felix.png (all animations)
spritesheet_player_lucian.png
spritesheet_player_vincent.png
spritesheet_princess.png
spritesheet_enemies.png (all generic enemies)
spritesheet_boss_blackman1.png
spritesheet_boss_blackman2.png
spritesheet_boss_cloris.png
tileset_city.png
tileset_forest.png
tileset_castle.png
ui_hud.png (portraits, bars, icons)
items.png (pickups, weapons)
effects.png (hit sparks, auras)
Audio:
bgm_title.mp3
bgm_city.mp3
bgm_forest.mp3
bgm_castle.mp3
bgm_boss.mp3
bgm_finalboss.mp3
sfx_punch.mp3, sfx_kick.mp3, etc.
11. Progression & Difficulty
11.1 Difficulty Settings
Easy: Enemy HP -30%, Player damage +20%, 5 continues
Normal: Standard stats, 3 continues
Hard: Enemy HP +50%, Player damage -20%, 1 continue, enemies more aggressive
11.2 Scoring System
Enemy defeated: Base points × combo multiplier
Combo Multiplier:
2x (2-5 hits)
3x (6-10 hits)
4x (11-20 hits)
5x (21+ hits)
No-damage bonus: +1000 per stage section
Time bonus: Remaining time converted to points at stage clear
High Score Table: Top 5 scores saved in localStorage


12. File Structure
river-city-princess-rescue/
├── index.html              # Main entry, canvas setup, UI overlay
├── css/
│   └── style.css           # Fullscreen canvas, UI positioning
├── js/
│   ├── main.js             # Game loop, state machine
│   ├── input.js            # Keyboard/touch handler
│   ├── assets.js           # Image/audio loader
│   ├── renderer.js         # Canvas drawing, camera, layers
│   ├── physics.js          # Collision, movement
│   ├── entities/
│   │   ├── player.js       # Player class, movesets
│   │   ├── enemy.js        # Base enemy class
│   │   ├── boss.js         # Boss classes (extends enemy)
│   │   ├── item.js         # Pickups, weapons
│   │   └── projectile.js   # Fireballs, rocks, etc.
│   ├── stages/
│   │   ├── stage.js        # Base stage class
│   │   ├── city.js         # Stage 1 data
│   │   ├── forest.js       # Stage 2 data
│   │   └── castle.js       # Stage 3 data
│   ├── ui/
│   │   ├── hud.js          # In-game HUD
│   │   ├── menu.js         # Title, pause, game over screens
│   │   └── dialog.js       # Dialogue box system
│   └── utils.js            # Math helpers, vectors, particles
├── assets/
│   ├── images/
│   │   └── [all png files]
│   └── audio/
│       └── [all mp3 files]
└── README.md               # Build/run instructions



14. Success Criteria
[ ] Game runs at stable 60 FPS in Chrome/Firefox/Safari
[ ] All 3 characters feel distinct and balanced
[ ] 3 stages are visually distinct and mechanically interesting
[ ] Final boss Cloris provides satisfying challenge
[ ] Story is clear without text-heavy exposition
[ ] Mobile touch controls are responsive
[ ] Complete playthrough possible in 15-25 minutes


15. Notes for AI Implementation
Pixel Art: Use simple geometric shapes and limited color palettes if procedural generation is needed. Chibi proportions = head 1/2 of body height.
Animation: If sprite sheets are unavailable, use colored rectangles with tweening for prototyping.
Parallax: Simple offset calculation based on camera position: layer.x = camera.x * parallaxFactor
Boss AI: Use state machines (IDLE → CHASE → ATTACK → RECOVER → STUN)
Performance: Object pooling for particles and projectiles. Max 50 entities on screen.
Mobile: Virtual buttons should be 60x60px minimum. Support fullscreen via touch.
Accessibility: Include screen shake toggle and sound volume controls.



---

This PRD provides a complete blueprint for generating your 熱血物語-inspired princess rescue game. It covers everything from the pixel-art aesthetic (matching your reference screenshots) to the three-stage progression, character selection, combat mechanics, and the climactic battle against Cloris.

**Key highlights for the AI developer:**
- **Side-scrolling beat-'em-up** with combo system and special moves
- **3 distinct heroes** (Balanced/Speed/Power archetypes)
- **3 stages** with unique enemies, hazards, and bosses
- **Final boss Cloris** with two-phase battle and dramatic mechanics
- **Retro pixel-art HUD** matching the reference style (HP/SP bars, day/time, money)
- **Progressive difficulty** from street thugs to dark knights

You can copy this PRD.md and provide it to any AI coding assistant to generate the complete HTML5 game!