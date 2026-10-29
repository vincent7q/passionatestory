# Game Brief: Passionate Story V2

**Status:** the user selected **《合格女婿》** on 2026-10-29 and requested a full
story draft with six stages and three endings. The latest user revision sets
stage 4 to three sisters (three bosses), stage 5 to father 林建國, and stage 6
to mother 沈雅芳 as the true final boss: eight family bosses across six stages.
The full draft is awaiting review in `discuss/codex_idea.html` (editable source:
`discuss/codex_idea.md`). The sisters are provisionally written as 小雨's three
older sisters; their names, individual scenes, combat concepts, and the proposed
third ending remain open for review. Godot and the Claude/Codex responsibilities
remain confirmed.

**One-sentence pitch:** A sincere young man completes his girlfriend's family's
six tests, discovers that their approval entails endless demands, and must
choose what to do with the life he has proved capable of living.

**Player fantasy:** A capable hero in a family action satire who gradually
recognizes an unequal relationship and gains the confidence to choose for
himself. The selected story begins with a staged rescue.

**Story structure:** Six family-member tests followed by three player-selectable
endings after successful completion. The user's two endings are marriage with
continued unequal responsibility, or leaving and eventually finding reciprocal
love. The draft's third ending proposes joining the family's testing business;
its content remains open for review. The former parents' rematch is not a
requirement of this selected direction.

**Confirmed parental characterization:** 沈雅芳 is greedy, domineering, and
habitually berates and humiliates her husband in front of others. She controls
the testing system and its business. 林建國 has long lived under her pressure
and understands the miserable future 陳以安 may face if he marries 林小雨.
Stage 5 explores his sympathy, fear, and continued complicity; stage 6 confronts
the mother. Concrete scenes and outcomes remain draft material for user review.

**Confirmed final fight:** 沈雅芳 has two health bars. When the first reaches
zero (t=0), she refuses defeat and withdraws to the table to eat and recover.
Reinforcements enter one at a time: 林雅婷 at 10s, 林婉晴 at 20s, 林可欣 at
30s, 林建國 at 40s, and 林家豪 at 50s. They have reduced reinforcement health.
At 60s she returns with her second bar alongside any survivors, creating up to
six opponents against one. Timings use active combat time and pause together.
Early defeats do not accelerate the next arrival or her return. The summon
occurs once; defeated reinforcements stay out and surviving ones retain damage.
The draft ends combat when her second bar reaches zero. Exact health, damage,
and attack concurrency await prototype validation; the 10s interval and 60s
return are user-specified timings.

**Core loop (proposal):** Enter a short encounter, move and fight, make a
characterful interaction, and reach a story beat with a clear outcome.

**MVP (proposal):** One playable character, one encounter, one opponent, and one
story interaction. Begin with placeholders; then prove one consistent character
and background inside Godot. This is a workflow trial, not a complete stage.
The six-stage story request does not authorize immediate production of the
whole campaign. Review the story before moving to the next development stage.

**Out of scope for the first slice:** The full six-stage campaign, online leaderboard,
backend, character roster, full scoring system, content editors, and bulk art.

**Art direction:** Unselected. Do not inherit old portraits, pixel dimensions,
HUD layouts, palettes, or animation requirements. Decide them using an approved
visual target and Godot integration constraints.

**Target platform / controls / engine version:** To be decided during setup.

**Success measure:** The encounter runs, can be played from start to outcome,
and the user approves both its feel and its representative art in context.

**Source:** `discuss/codex_idea.md` records the selected direction and the current
draft, with previous proposals retained for comparison. `idea/README.md`
explains the recovered historical storyboard and its limits.
