# Art Direction & Handoff

**Status:** no V2 art style, character appearance, production assets, or technical
frame is approved. Do not generate a batch before the first visual target and
its technical constraints are agreed.

## Responsibilities

Claude provides gameplay requirements and owns Godot imports, scenes, animation
integration, and inspection in the running game. Codex proposes visual direction,
generates and prepares artwork, checks exports, and records source information.
The user approves creative direction and final results.

Use `asset-manifest.json` as the single asset request/status list. Both assistants
may update their fields; coordinate edits instead of writing concurrently.

## Lock the Technical Frame First

Before production, record the target platform, 2D/3D presentation, camera/view,
display and world scale, asset dimensions, filtering, palette, transparency,
animation method, and runtime budgets. These are currently undecided. A skill's
sample dimensions or the old storyboard's implementation notes do not set them.

Approve one character/environment study at the intended game scale before
expanding. Related assets should share proportions, viewpoint, palette, lighting,
and detail density.

## Asset Requests

Claude creates a request with a stable ID, role, intended runtime path, required
dimensions, scale, alpha, pivot/anchor, facing, states, frame layout/timing, and
filtering. Mark unknown fields explicitly and resolve them before generation.
Codex adds source/tool information, prompt or edit records, files, and technical
check results. Never rename a requested ID silently.

Once needed, keep editable masters and generation records under `art/source/`;
put only agreed runtime exports under `assets/art/`. Claude owns the Godot import
metadata and integration. No image files or runtime directories are created by
this cleanup.

## Delivery & Acceptance

The status progression is `requested` → `in_progress` → `ready_for_integration`
→ `integrated` → `accepted`; use `revision_required` when a check fails.

- Codex checks file existence, actual dimensions, alpha, framing, alignment,
  seams, animation consistency, and source/provenance before delivery.
- Claude checks native-scale readability, pivots, imports, motion, collision fit,
  and appearance in Godot. Retain evidence in `production/qa/evidence/`.
- The user approves the integrated result. Record that approval in the manifest;
  a successful generation or technical pass alone is not acceptance.

The selected skill is `.agents/skills/create-game-assets/SKILL.md`. Use it for
art guidance, not development planning. Use image-generation tools for image
creation/edits; use ordinary tools for deterministic export and verification
where appropriate under the active tool instructions.
