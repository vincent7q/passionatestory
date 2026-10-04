# Phase 6 — Skill editor

[← Phase 5](phase-05-character-editor.md) · [plan](../plan.md) · next: [Phase 7](phase-07-enemy-ai.md)

## Goal

Build and tune a skill's timeline visually, see its hitboxes in 2.5D, and test it against a dummy
— all without running the game. The workflow calls this **the highest-priority custom editor**
(§26.2).

## Why this phase exists

A beat-'em-up lives or dies on frame timing. Tuning startup, active frames and hitbox placement by
editing numbers and relaunching the game is slow; seeing them on a timeline and replaying them
instantly is what makes the tuning in Phase 10 practical.

## Deliverables

```text
tools/skill_editor/plugin.cfg
tools/skill_editor/plugin.gd
tools/skill_editor/skill_editor.tscn
tools/skill_editor/timeline.gd          the timeline widget
tools/skill_editor/hitbox_view.gd       front view + floor view
tools/skill_editor/preview_sandbox.gd   runs SkillRunner on a dummy, in the editor
```

## Design

```text
┌ Skill Editor — skill_rapid_punch 連環拳 ──────────────── 氣 [10]  [Save] ┐
│ Front view (x / height)          │ Floor view (x / depth)                │
│   ┌──────────────┐               │   ┌──────────────┐                    │
│   │ 🧍  ▭hit  🧍dummy│           │   │ ● ▭hit   ● dummy│                 │
│   └──────────────┘               │   └──────────────┘                    │
├──────────────────────────────────┴──────────────────────────────────────┤
│ frame  0    5    10   15   20   25   30   35   40    (0.00 s … 0.67 s)   │
│ phase  [startup][== active ==][== active ==]…[  recovery  ]             │
│ anim   ■ rapid_punch                                                     │
│ hitbox    ▬▬   ▬▬   ▬▬   ▬▬        ▬▬▬                                   │
│ fx                                  ◆ shake 3px                          │
│ cursor          ▲ frame 12                                               │
├──────────────────────────────────────────────────────────────────────────┤
│ [◀ step] [▶ play] [step ▶] [loop]  dummy: [standing ▾] distance [24]    │
│ Result: 5 hits · 44 dmg · knockdown ✓ · last hit frame 25               │
│ Selected action: CreateHitbox  (inspector for its fields)                │
└──────────────────────────────────────────────────────────────────────────┘
```

- **Timeline**: one row per action kind, frames across, seconds shown underneath. Drag an action
  to change its frame; drag a hitbox bar's ends to change when it is active. Startup / active /
  recovery bands are computed from the hitbox actions, never typed.
- **Two views of the hitbox**, because the game is 2.5D: the front view shows width and height
  (does it hit a jumping target?), the floor view shows width and depth (does it hit someone one
  lane over?). Boxes are draggable.
- **Test Skill**: runs the real `SkillRunner` and `HitResolver` on a dummy — standing, guarding,
  airborne, knocked down, or one depth lane away — and reports hits, damage, knockdown. Step frame
  by frame.
- **Save** writes the `.tres`; **saving without changes must leave the file byte-identical**, so
  diffs stay clean.

## Steps

- [ ] **6.1** Plugin skeleton; open a skill; read-only timeline.
- [ ] **6.2** Front and floor hitbox views.
- [ ] **6.3** Preview sandbox: play / pause / step a skill on a sprite and a dummy.
- [ ] **6.4** Editing: move actions, resize active windows, drag hitboxes, edit action fields.
- [ ] **6.5** Add / remove actions from a palette of action types.
- [ ] **6.6** Result readout and dummy states.
- [ ] **6.7** Save round-trip; inline validation.

## Tests

| Test | Checks |
|---|---|
| Round-trip | Open and save without edits → identical file |
| Derived phases | Startup / active / recovery computed correctly from hitbox actions |
| Sandbox = game | The sandbox result matches the same skill run in a headless combat test |

## Done when

A skill's timing and hitbox can be changed and tested **without running the game**, and Felix's
three specials have been retuned using it.

## Risks

| Risk | Mitigation |
|---|---|
| Sandbox behaves differently from the game | It runs the same `SkillRunner` and `HitResolver`, and a test compares them |
| Over-building the editor | Stop at what tuning the slice's skills actually needs |
