# Game Content Creation Pipeline --- Proposal

## 1. Document Purpose

This proposal defines a scalable, AI-ready content creation pipeline for
a Godot-based game.

The game is expected to contain:

-   Multiple playable characters
-   Multiple enemy types and bosses
-   Unique attacks and skills per character
-   Storyboard-driven levels and events
-   Backgrounds, environments, props, NPCs, weapons, VFX and UI
-   A large amount of reusable game content

The primary architectural principle is:

> **Content should be data-driven. Godot should execute game logic,
> while characters, skills, enemies, levels and other content should be
> represented as structured data/resources wherever practical.**

The system must allow new content to be added with minimal or zero
changes to core gameplay code.

------------------------------------------------------------------------

# 2. High-Level Architecture

``` text
                         STORYBOARD
                             |
                             v
                    GAME DESIGN BIBLE
                             |
             +---------------+---------------+
             |               |               |
             v               v               v
       CHARACTER DATA    SKILL DATA      WORLD DATA
             |               |               |
             v               v               v
       Character Art      Animation         Background
       Enemy Art          HitBox            Tile
       NPC Art            VFX               Props
             |               |               |
             +---------------+---------------+
                             |
                             v
                           GODOT
                             |
             +---------------+---------------+
             |               |               |
             v               v               v
        Characters      Combat System      World
             |               |               |
             v               v               v
          Player            Skills          Levels
          Enemies           Damage          Events
          Bosses            Hitboxes        NPCs
                             |
                             v
                           GAME
```

------------------------------------------------------------------------

# 3. Core Design Principles

## 3.1 Data-driven design

Do not hard-code individual characters, enemies or skills into gameplay
systems.

Prefer:

``` text
Character
    -> CharacterData
    -> Stats
    -> AnimationSet
    -> SkillSet
```

instead of:

``` text
PlayerA.gd
PlayerB.gd
PlayerC.gd
```

The same principle applies to enemies, bosses, weapons, items and
levels.

------------------------------------------------------------------------

## 3.2 Composition over duplication

A character should be assembled from reusable components/data.

Example:

``` text
CharacterData
├── Identity
├── Stats
├── AnimationSet
├── SkillSet
├── Equipment
├── AI Configuration
└── Presentation
```

A new character should ideally require:

1.  New art assets
2.  New CharacterData resource
3.  Selection of existing or new skills
4.  Configuration of stats

It should not require rewriting the combat engine.

------------------------------------------------------------------------

## 3.3 Separate content from execution

Content defines **what** something is.

Systems define **how** it behaves.

Example:

``` text
SkillData
    defines:
        damage
        startup
        active time
        recovery
        animation
        hitbox
        effects

CombatSystem
    executes:
        input
        state changes
        hit detection
        damage calculation
        knockback
        effects
```

------------------------------------------------------------------------

# 4. Content Categories

The content pipeline should support the following major categories.

``` text
CONTENT
├── Characters
│   ├── Players
│   ├── Enemies
│   ├── Bosses
│   └── NPCs
│
├── Skills
│   ├── Attacks
│   ├── Combos
│   ├── Special Moves
│   ├── Defensive Moves
│   └── Movement Abilities
│
├── Animation
│   ├── Idle
│   ├── Walk
│   ├── Run
│   ├── Jump
│   ├── Attack
│   ├── Hurt
│   ├── Knockdown
│   ├── GetUp
│   └── Death
│
├── World
│   ├── Levels
│   ├── Backgrounds
│   ├── Tiles
│   ├── Props
│   ├── Interactive Objects
│   └── Environmental Effects
│
├── Items
│   ├── Weapons
│   ├── Consumables
│   ├── Currency
│   └── Collectibles
│
├── VFX
├── SFX
├── Music
├── UI
└── Story / Events
```

------------------------------------------------------------------------

# 5. Character System

## 5.1 CharacterData

Every playable character, enemy and boss should be represented by
structured data.

Suggested fields:

``` text
CharacterData
├── id
├── display_name
├── description
├── character_type
├── sprite / model
├── animation_set
├── stats
├── skill_set
├── equipment
├── ai_profile
├── faction
├── loot_table
└── metadata
```

Example:

``` yaml
id: character_kenji
display_name: Kenji
character_type: player

stats:
  hp: 100
  strength: 15
  defense: 10
  speed: 12

skills:
  - skill_punch
  - skill_kick
  - skill_uppercut
  - skill_dragon_punch
```

------------------------------------------------------------------------

# 6. Character Types

The same base architecture should support:

``` text
CharacterBase
├── PlayerCharacter
├── EnemyCharacter
├── BossCharacter
└── NPCCharacter
```

The distinction should primarily come from configuration and specialized
systems rather than duplicated implementations.

------------------------------------------------------------------------

# 7. Skill System

## 7.1 Skill as data

A skill should be represented as a reusable data resource.

Suggested fields:

``` text
SkillData
├── id
├── display_name
├── description
├── icon
├── animation
├── damage
├── damage_type
├── startup
├── active_duration
├── recovery
├── cooldown
├── resource_cost
├── range
├── hitbox
├── knockback
├── hitstun
├── movement
├── vfx
├── sfx
├── effects
└── sequence
```

Example:

``` yaml
id: skill_dragon_punch
display_name: Dragon Punch

damage: 35
knockback: 250
startup: 0.18
active_duration: 0.15
recovery: 0.45
resource_cost: 20

animation: dragon_punch

effects:
  - launch_enemy
```

------------------------------------------------------------------------

# 8. Skill Sequence System

Complex skills should be composable from multiple actions.

``` text
Skill
  |
  v
Sequence
  |
  +-- Action 1
  +-- Action 2
  +-- Action 3
  +-- Action 4
```

Example:

``` text
Meteor Kick

1. Jump
2. Move forward
3. Play kick animation
4. Activate hitbox
5. Apply damage
6. Apply knockback
7. Spawn VFX
8. Play SFX
9. Land
```

Another example:

``` text
Triple Punch

1. Punch 1
2. Punch 2
3. Punch 3
```

This approach allows complex abilities without creating a unique script
for every skill.

------------------------------------------------------------------------

# 9. Action Types

The skill system should eventually support reusable actions such as:

``` text
Action
├── PlayAnimation
├── Move
├── Jump
├── Wait
├── CreateHitbox
├── RemoveHitbox
├── ApplyDamage
├── ApplyKnockback
├── ApplyStatusEffect
├── SpawnVFX
├── PlaySFX
├── SpawnProjectile
├── ChangeState
├── CameraShake
└── TriggerEvent
```

This creates a small domain-specific system for building skills.

------------------------------------------------------------------------

# 10. Skill Editor

A dedicated Skill Editor is recommended.

Conceptual interface:

``` text
+--------------------------------------+
| Skill Editor                         |
+--------------------------------------+
| Skill: Dragon Punch                  |
|                                      |
| Damage:       [35]                   |
| Knockback:    [250]                  |
| Startup:      [0.18]                 |
| Active:       [0.15]                 |
| Recovery:     [0.45]                 |
|                                      |
| Animation:    [dragon_punch]         |
|                                      |
| Timeline                             |
| 0.00---0.10---0.20---0.30---0.50     |
|       Startup  Hit          Recovery  |
|                                      |
| [Test Skill]              [Save]      |
+--------------------------------------+
```

The editor should eventually support:

-   Timeline editing
-   Animation selection
-   Hitbox editing
-   Damage configuration
-   Knockback configuration
-   VFX/SFX selection
-   Skill preview
-   Test execution
-   Data validation

------------------------------------------------------------------------

# 11. Animation Pipeline

For a 2D / pixel-art workflow, external art tools can be used to create
sprite sheets.

Recommended conceptual pipeline:

``` text
Aseprite / Krita / Other Art Tool
              |
              v
         Sprite Sheet
              |
              v
            Godot
              |
              v
       AnimatedSprite2D
              |
              v
        AnimationSet
```

Typical animation categories:

``` text
Idle
Walk
Run
Jump
Fall
Attack
SpecialAttack
Hurt
Knockdown
GetUp
Death
```

------------------------------------------------------------------------

# 12. Enemy System

Enemies should use the same base content architecture as player
characters.

Example:

``` text
Enemy_Punk
├── CharacterData
├── Stats
├── AnimationSet
├── SkillSet
└── AIProfile
```

Example configuration:

``` yaml
id: enemy_street_punk

stats:
  hp: 60
  attack: 8
  defense: 3

ai_profile:
  aggression: 0.8
  preferred_range: 80
  attack_frequency: 0.6

skills:
  - skill_punch
  - skill_kick
```

Possible enemy hierarchy:

``` text
EnemyBase
├── BasicEnemy
├── EliteEnemy
├── HeavyEnemy
├── RangedEnemy
├── SpecialEnemy
└── BossEnemy
```

------------------------------------------------------------------------

# 13. AI Configuration

AI behaviour should be data-driven where possible.

Suggested AI parameters:

``` text
AIProfile
├── aggression
├── preferred_range
├── movement_speed
├── reaction_time
├── attack_frequency
├── target_priority
├── retreat_threshold
├── group_behavior
├── combo_probability
└── special_attack_probability
```

This allows designers to create different enemies without writing a new
AI script for every enemy.

------------------------------------------------------------------------

# 14. World / Level System

A level should be composed of multiple layers.

``` text
Level
├── Background
├── TileMap
├── Collision
├── Decoration
├── Props
├── Interactive Objects
├── NPCs
├── Enemy Encounters
├── Story Events
├── Pickups
└── Boss Encounter
```

Example:

``` text
Chapter 01
└── Downtown
    ├── Scene 01 - School Gate
    ├── Scene 02 - Street
    ├── Scene 03 - Shopping Area
    ├── Scene 04 - Alley
    └── Scene 05 - Boss Fight
```

------------------------------------------------------------------------

# 15. Object / Prop System

Reusable world objects should be data-driven.

Examples:

``` text
Trash Can
Wooden Box
Street Lamp
Bench
Car
Bicycle
Door
Sign
Vending Machine
```

Objects may support capabilities such as:

``` text
breakable
pushable
pickupable
throwable
interactive
damageable
spawn_loot
trigger_event
```

Example:

``` text
Trash Can
    |
    +-- Player hits object
    |
    +-- Break
    |
    +-- Spawn item
    |
    +-- Play VFX
    |
    +-- Play SFX
```

------------------------------------------------------------------------

# 16. Story / Event System

Storyboard content should become structured game events.

Example:

``` text
Story Event
├── Trigger
├── Conditions
├── Actions
└── Completion
```

Possible triggers:

``` text
Player enters area
Enemy defeated
Boss defeated
Item collected
NPC interacted
Timer reached
Previous event completed
```

Possible actions:

``` text
Spawn enemy
Remove enemy
Show dialogue
Move NPC
Start encounter
Play animation
Play music
Change camera
Open door
Start boss fight
Complete objective
```

This allows storyboard sequences to be implemented without hard-coding
every scene.

------------------------------------------------------------------------

# 17. Game Bible

Before producing large amounts of content, maintain a central Game
Bible.

Recommended structure:

``` text
GAME BIBLE
├── Game Overview
├── Core Gameplay
├── Story
├── Characters
├── Enemies
├── Bosses
├── Skills
├── Items
├── Weapons
├── Locations
├── Levels
├── NPCs
├── UI
├── Audio
├── VFX
└── Technical Rules
```

------------------------------------------------------------------------

# 18. Character Bible Template

``` text
CHARACTER

ID:
Name:
Role:
Personality:
Faction:

Stats:
HP:
Strength:
Defense:
Speed:

Weapon:

Skills:
01:
02:
03:
04:

Animations:
Idle:
Walk:
Run:
Jump:
Attack:
Hurt:
Knockdown:
GetUp:
Death:

Visual References:
Front:
Side:
Back:
Color Palette:
```

------------------------------------------------------------------------

# 19. Enemy Bible Template

``` text
ENEMY

ID:
Name:
Role:
Difficulty:

Stats:
HP:
Attack:
Defense:
Speed:

AI Profile:

Skills:

Movement:

Loot:

Animations:

Visual References:
```

------------------------------------------------------------------------

# 20. Location Bible Template

``` text
LOCATION

ID:
Name:
Chapter:
Purpose:

Scenes:
01:
02:
03:
04:
05:

Background:
Tile Set:
Props:

NPCs:

Enemy Encounters:

Story Events:

Boss:

Music:

Special Environmental Mechanics:
```

------------------------------------------------------------------------

# 21. Recommended Tool Architecture

The complete content pipeline should conceptually be:

``` text
                 STORYBOARD
                     |
                     v
              GAME DESIGN BIBLE
                     |
       +-------------+-------------+
       |             |             |
       v             v             v
   Characters      Skills        Locations
       |             |             |
       v             v             v
   Art Tools      Data Tools     Map Tools
       |             |             |
       +-------------+-------------+
                     |
                     v
                   GODOT
                     |
       +-------------+-------------+
       |             |             |
       v             v             v
   Characters      Combat        World
       |             |             |
       v             v             v
     Player        Skills        Levels
     Enemies       Damage        Events
     Bosses        Hitboxes      NPCs
                     |
                     v
                   GAME
```

------------------------------------------------------------------------

# 22. Recommended Development Tools

For a 2D / pixel-art-oriented workflow:

## Art

Potential tools:

-   Aseprite
-   Krita
-   Photoshop
-   Clip Studio Paint

## Engine

-   Godot

## Data

Prefer structured Godot Resources and/or machine-readable formats such
as:

-   `.tres`
-   `.res`
-   JSON
-   YAML
-   CSV where appropriate

The exact format should be chosen based on whether the data needs to be
edited directly in Godot, externally, or by AI tools.

------------------------------------------------------------------------

# 23. AI-Ready Requirements

This project should be designed so that AI coding agents can understand
and modify it safely.

Every content object should have:

``` text
Stable ID
Human-readable name
Clear schema
Explicit dependencies
Predictable file location
Validation rules
Minimal implicit behaviour
```

Example:

``` yaml
id: skill_dragon_punch
type: skill
display_name: Dragon Punch

dependencies:
  animation: anim_dragon_punch
  vfx: vfx_uppercut
  sfx: sfx_punch_heavy

parameters:
  damage: 35
  startup: 0.18
  active: 0.15
  recovery: 0.45
  knockback: 250
```

AI should never need to infer what a field means from arbitrary code.

------------------------------------------------------------------------

# 24. AI Development Rules

AI-generated code should follow these rules:

1.  Do not duplicate existing gameplay systems.
2.  Search for an existing reusable component before creating a new one.
3.  Prefer modifying data over modifying core logic.
4.  Keep IDs stable.
5.  Do not silently rename content IDs.
6.  Do not introduce circular dependencies.
7.  Keep content definitions separate from runtime systems.
8.  Add validation when introducing new data fields.
9.  Keep editor tooling separate from runtime gameplay code.
10. Preserve backwards compatibility where practical.
11. Document new schemas.
12. Add test cases for important gameplay systems.

------------------------------------------------------------------------

# 25. Suggested Project Structure

``` text
project/
│
├── assets/
│   ├── characters/
│   ├── enemies/
│   ├── bosses/
│   ├── npcs/
│   ├── animations/
│   ├── backgrounds/
│   ├── tiles/
│   ├── props/
│   ├── vfx/
│   ├── sfx/
│   ├── music/
│   └── ui/
│
├── data/
│   ├── characters/
│   ├── enemies/
│   ├── bosses/
│   ├── skills/
│   ├── items/
│   ├── weapons/
│   ├── ai/
│   ├── levels/
│   ├── events/
│   └── loot/
│
├── scenes/
│   ├── characters/
│   ├── enemies/
│   ├── bosses/
│   ├── levels/
│   ├── objects/
│   └── ui/
│
├── systems/
│   ├── combat/
│   ├── character/
│   ├── skill/
│   ├── ai/
│   ├── inventory/
│   ├── event/
│   ├── save/
│   └── audio/
│
├── tools/
│   ├── character_editor/
│   ├── skill_editor/
│   ├── level_editor/
│   └── validators/
│
├── tests/
│   ├── combat/
│   ├── skills/
│   ├── characters/
│   └── data/
│
└── docs/
    ├── game_bible/
    ├── architecture/
    ├── schemas/
    └── ai/
```

------------------------------------------------------------------------

# 26. Core Editors

The project should eventually contain five major internal tools.

## 26.1 Character Editor

Purpose:

-   Create characters
-   Configure stats
-   Assign animations
-   Assign skills
-   Configure equipment
-   Configure AI
-   Preview character

------------------------------------------------------------------------

## 26.2 Skill Editor

Purpose:

-   Create skills
-   Configure timing
-   Configure hitboxes
-   Configure damage
-   Configure movement
-   Configure VFX/SFX
-   Build multi-action sequences
-   Preview and test skills

This should be the highest-priority custom editor.

------------------------------------------------------------------------

## 26.3 Animation Library

Purpose:

-   Register animations
-   Preview animations
-   Map animation IDs to assets
-   Validate missing animations

------------------------------------------------------------------------

## 26.4 Level Editor / Level Data

Purpose:

-   Configure level sections
-   Place encounters
-   Place NPCs
-   Place props
-   Configure triggers
-   Configure story events
-   Configure boss encounters

------------------------------------------------------------------------

## 26.5 Data Validator

The validator should detect:

``` text
Missing asset
Missing skill
Missing animation
Duplicate ID
Invalid reference
Invalid parameter
Missing required field
Circular dependency
Broken level reference
```

The validator is especially important for AI-assisted development.

------------------------------------------------------------------------

# 27. Development Priority

Recommended implementation order:

``` text
PHASE 1
Core data architecture
        |
        v
PHASE 2
CharacterData
SkillData
        |
        v
PHASE 3
Combat System
        |
        v
PHASE 4
Skill Sequence System
        |
        v
PHASE 5
Character Editor
        |
        v
PHASE 6
Skill Editor
        |
        v
PHASE 7
Enemy + AI Data
        |
        v
PHASE 8
Level / Event System
        |
        v
PHASE 9
Content Validation
        |
        v
PHASE 10
Large-scale content production
```

Do not begin large-scale content production before the underlying data
architecture is stable.

------------------------------------------------------------------------

# 28. MVP Recommendation

The first vertical slice should contain only:

``` text
1 Player
1 Basic Enemy
1 Boss
3-4 Skills
1 Small Level
1 Interactive Object
1 Story Event
1 Boss Encounter
```

The goal is to prove:

``` text
Input
  -> Character
  -> Skill
  -> Hitbox
  -> Damage
  -> Enemy reaction
  -> VFX/SFX
  -> Defeat
  -> Story Event
  -> Boss
```

Once this pipeline works, content can scale horizontally.

------------------------------------------------------------------------

# 29. Success Criteria

The architecture should be considered successful when a developer can:

### Add a new character

Without modifying:

``` text
CombatSystem
SkillSystem
DamageSystem
```

### Add a new skill

Without creating a unique combat script.

### Add a new enemy

By configuring:

``` text
CharacterData
Stats
SkillSet
AIProfile
```

### Add a new level

Without changing core gameplay code.

### Add a storyboard event

By composing existing event actions.

------------------------------------------------------------------------

# 30. Final Recommendation

The most important architectural decision is:

> **Build the game as a reusable content platform rather than a
> collection of individually scripted characters and levels.**

The intended relationship is:

``` text
DATA
 ↓
EDITOR
 ↓
GODOT RUNTIME
 ↓
GAMEPLAY
```

The highest-priority systems are:

1.  CharacterData
2.  SkillData
3.  Skill Sequence System
4.  Combat System
5.  Character Editor
6.  Skill Editor
7.  Enemy/AI configuration
8.  Level/Event system
9.  Content validator

The ultimate goal is that adding content becomes primarily a **data and
asset production task**, not a programming task.

For AI-assisted development, the system should expose explicit schemas,
stable IDs, predictable directories, reusable components and automated
validation so an AI agent can safely inspect, create and modify content
without reverse-engineering the entire project.

------------------------------------------------------------------------

# 31. Next Step

The next design input should be the existing storyboard.

From the storyboard, generate:

``` text
01. Character Registry
02. Enemy Registry
03. Boss Registry
04. Skill Registry
05. Weapon Registry
06. Item Registry
07. NPC Registry
08. Location Registry
09. Level Registry
10. Prop Registry
11. Story Event Registry
12. Asset Production List
13. Animation List
14. VFX List
15. SFX List
16. Godot Data Schemas
17. Implementation Backlog
```

These registries should become the authoritative content specification
for the project.
