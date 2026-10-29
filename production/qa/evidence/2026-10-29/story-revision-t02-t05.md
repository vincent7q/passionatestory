# T-02–T-05 story revision verification

Date: 2026-10-29. Owner: Codex. Story draft: fifth revision, awaiting user review.

## Applied decisions

- T-02: overview; S1-03–04; S2-01, S2-03–04; S3-01, S3-03–04; S4-03–04; V-01; foreshadowing and review notes. Safety and family testing are confirmed at S3-01; S4-03 establishes active escalation by 小雨; V-01 confronts her participation before the staged rescue. V-04 retains the commercial-service reveal.
- T-03: S4-01–04 and S5-02–04. Shorter replies and active refusals in stage 4; the father answers for his complicity and demonstrates its cost in stage 5.
- T-04: S6-02 explicitly states 「這個家，我說了算」.
- T-05: S3-03 frames the uncle's accounting dispute; S6-03A leaves the aunt and uncle outside combat. The five-person reinforcement roster and timing remain as specified.

## Verification

Command: python tools/narrative/render_story.py --check — passed.

An additional document inspection compared every reader section with rendered Markdown, matched all scene headings, checked unique IDs, fragment links, local links and ARIA references, checked the final-fight timeline, and compared protected blocks with hashes captured before editing. Results:

    {
      "sections_matching_markdown": 15,
      "scene_headings_matching": 43,
      "duplicate_html_ids": [],
      "broken_fragment_links": [],
      "protected_blocks_unchanged": [
        "s1_02",
        "endings",
        "history",
        "styles",
        "scripts"
      ],
      "final_fight_timeline_rows_verified": 7,
      "markdown_sha256": "d64f9544a5b607740366d2c9f8074b9cd54d1b6f63c6ac6de17e8631546bad20",
      "html_sha256": "78c64a228517809f2258b54045f52bab2839c7b6bbc9ad40dd9ab673751b05b8"
    }

This verifies document content and structure. No browser screenshot, Godot inspection, gameplay test, balance validation or user approval is claimed.
