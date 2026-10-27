# V2 Cleanup Record — 2026-10-27

## Recovery Point

- Active branch: `V2`.
- Clean pre-cleanup commit: `f02d10ba1972983518f86d2cb033a2a6bc7c4124`.
- Verified complete Git bundle:
  `.scratch/v2-cleanup-2026-10-27/before-cleanup.bundle` (local, ignored).
- Old ignored dependencies moved to
  `.scratch/v2-cleanup-2026-10-27/legacy-node_modules/`.
- Inherited multi-engine API snapshots moved to
  `.scratch/v2-cleanup-2026-10-27/legacy-engine-reference/`.

The bundle preserves Git history and refs; it does not include ignored files.
The two moved directories preserve those local files separately. No commit,
push, branch deletion, or history rewrite was performed.

## Story Preservation

The active checkout had no storyboard. Nine source files were recovered
byte-for-byte from `de0100e62f1f1c971aa6b8e0a7eae90aab714d83` into
`idea/storyboard/`. `idea/storyboard-source.json` records paths and checksums.
They are historical references; old technical choices and approvals are not
V2 requirements. Old portraits and production art were not restored.

## Active Tree Changes

- Replaced inherited root README, assistant instructions, contribution guide,
  issue templates, and PR template with project-specific guidance.
- Removed upstream maintainer ownership/funding files and framework release,
  security-policy, migration, workflow-tour, and empty registry scaffolding.
- Removed the empty source stub and inherited API snapshots; added a truthful
  unconfigured Godot reference. No runtime architecture was carried forward.
- Retained the existing CCGS toolkit and its MIT notice; selected `minimal`
  rigor, `collaborative` automation, and Godot as the engine.
- Added shared CCGS hook configuration without new tool permission grants.
- Installed only the selected art-production skill with pinned provenance,
  Apache-2.0 license, and NOTICE. No second development workflow was installed.
- Added a brief, one development plan, one art guide, and an empty asset manifest.

## Handoff

Claude's next task is initial Godot setup and review of the proposed encounter.
Godot version, language, platforms, renderer, resolution, test framework, art
style, and detailed game mechanics remain unselected. This cleanup did not
build the game or generate artwork.

## Verification

74 checks passed, including byte-for-byte storyboard recovery and checksums,
active document links and Claude imports, JSON parsing, the selected skill's
licenses, effective CCGS configuration, and Git whitespace validation. The six
configured hook scripts passed Bash syntax checks and ran successfully with
representative startup or non-target tool events. This is a hook smoke check,
not an end-to-end Claude session or proof of every validation policy.

The local report is
`.scratch/v2-cleanup-2026-10-27/verification.json`. Git Bash verification required
execution outside the sandbox because Windows denied signal-pipe creation
inside it. No gameplay tests were run because there is no game project yet.
