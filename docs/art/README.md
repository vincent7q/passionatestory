# Art Direction & Handoff / 美術方向與交接

**Status:** Vincent selected 熱血物語 / Kunio-kun SP grid pixel art as the wanted
direction on 2026-10-31. The four-character pilot and the complete
[vincent2 action/background test](../../discuss/codex-sp-action-test.md) are ready
for review in the local `art/source/reference/characters/SP/preview.html`.
The test includes 14 poses, two props, an original depot background and game-scale
mocks. Review of the pilot **and** this test gates the remaining 27 sheets;
background direction needs separate approval. No reference sheet or production
asset is accepted. The 640×360 base resolution is confirmed independently in
[`docs/confirmed.md`](../confirmed.md) Q-05; runtime sprite and animation contracts
remain provisional.
四張角色試作及十四動作／兩道具／物流站背景測試已完成，待用戶審閱後才開始其餘27張。
640×360 基準解像度已確認；試作不等於正式素材或動畫已獲接納。

## Responsibilities

Claude provides gameplay requirements and owns Godot imports, scenes, animation
integration, and inspection in the running game. Codex proposes visual direction,
generates and prepares artwork, checks exports, and records source information.
The user approves creative direction and final results.

Use `asset-manifest.json` as the single asset request/status list. Both assistants
may update their fields; coordinate edits instead of writing concurrently.

## Lock the Technical Frame First / 先確認技術框架

The current decisions come from `docs/confirmed.md` Q-05/Q-11 and the action-test
handoff. A skill's sample dimensions or historical storyboard does not set them.

| Field / 項目 | Current decision / 現況 |
|---|---|
| Form / 形式 | 2D side-scrolling beat-'em-up with depth lanes; Windows desktop first; keyboard through input actions |
| Base display / 基準畫面 | 640×360; integer ×2 = 1280×720, ×3 = 1920×1080 |
| Character view / 角色視角 | Side facing right; mirror for left |
| Method / 方法 | Frame-by-frame pixel sprite strips; nearest-neighbour pixel rendering; no production cycles yet |
| Study dimensions / 測試尺寸 | Standing adults about 48 px; action cells 96×64, ground anchor (32,60); props 32×32 with baseline y28. Runtime contracts stay provisional |
| Study colour/alpha / 測試色彩與透明度 | Character ≤16 colours, shared outline/skin, binary alpha; background ≤32 colours. The vincent2 action study uses its existing 15-colour palette |
| Still open / 未定 | Final runtime sprite contracts, frame counts/speeds, held-item integration, import settings and budgets; approve at game scale before production batches |

Claude owns engine settings and integration. The image-based mocks verify static
scale/readability only; they are not Godot evidence or gameplay validation.
Claude 負責引擎設定及整合；本次圖片預覽只檢查靜態比例及可讀性，未在 Godot 試玩。

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
