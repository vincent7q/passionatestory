# Phase 5 — Character editor

[← Phase 4](phase-04-skill-sequences.md) · [plan](../plan.md) · next: [Phase 6](phase-06-skill-editor.md)

## Goal

Create, edit and preview characters inside the Godot editor without hand-editing `.tres` files —
and see problems with a character before running the game.

## Why this phase exists

§26.1. Godot's inspector can already edit every field, so this editor's value is everything the
inspector can't do: picking skills from a list of real ids, previewing animations, creating a new
character with a correct id and file, and showing validation errors.

## Deliverables

```text
tools/character_editor/plugin.cfg
tools/character_editor/plugin.gd            EditorPlugin
tools/character_editor/character_editor.tscn
tools/character_editor/*.gd                 (@tool scripts)
tools/shared/                               widgets reused by the skill editor
```

**Rule (§24.9):** everything under `tools/` is `@tool` editor code. Runtime code never loads it, and
it is left out of exports.

## Design

```text
┌ Character Editor ──────────────────────────────────────────────────────────┐
│ [Players ▾] [Enemies] [Bosses] [NPCs]     [+ New]  [Duplicate]  [Validate] │
├──────────────┬──────────────────────────────┬──────────────────────────────┤
│ character_   │  Preview                     │  Identity                     │
│  felix       │  ┌────────────────────┐      │   id   character_felix (lock) │
│ character_   │  │   (sprite, 4×)     │      │   name 菲利克斯 / Felix        │
│  lucian      │  │   shadow · boxes   │      │  Stats  力 100  氣 80 …       │
│ …            │  └────────────────────┘      │  Body   w 16  depth 6  h 44   │
│              │  clip [walk ▾] ▶ ⏸ ⇆ step    │  Moveset                      │
│              │  ☐ show body box             │   light  [1][2][3]  heavy [ ] │
│              │                              │   specials [+ from list]      │
│              │                              │  Flags  can_join ☑ …          │
├──────────────┴──────────────────────────────┴──────────────────────────────┤
│ ⚠ animset_felix is missing clip "getup"                                     │
└────────────────────────────────────────────────────────────────────────────┘
```

- **List** of all `CharacterData`, grouped by type, from `ContentLoader`.
- **Preview**: the character's `AnimationSet` at 4×, clip picker, play / pause / step, flip, body
  box overlay.
- **Fields**: the standard inspector embedded for plain fields; custom pickers where an id is
  needed (skills, animation set, AI profile, taught skill) that only offer ids that exist.
- **New / Duplicate**: asks for a name, builds the id with the right prefix, saves to the right
  folder, refuses an id that already exists.
- **Validation strip**: runs the same rule code the Phase 9 validator will use (start with the
  checks that exist already; it grows in Phase 9).

## Steps

- [ ] **5.1** Plugin skeleton: a main-screen tab that lists characters.
- [ ] **5.2** Preview panel with clip controls and the body box.
- [ ] **5.3** Embedded inspector for the selected character; save on change.
- [ ] **5.4** Id pickers for moveset, animation set, AI profile.
- [ ] **5.5** New / Duplicate with id rules.
- [ ] **5.6** Validation strip.

## Tests

Editor UI is mostly checked by hand; the logic underneath (id generation, duplicate refusal, the
validation rules) lives in plain classes that are unit-tested.

## Done when

A new enemy variant (for example a second office worker with a different palette and stats) is
created **from the editor alone**, previewed, and appears in the game.

## Risks

| Risk | Mitigation |
|---|---|
| Editor tooling grows into a project of its own | Each step must save someone real time on the slice's content; stop there |
| Editor code leaks into the game | Everything under `tools/`; exports exclude it |
