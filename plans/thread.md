# Thread
<!-- Append-only log. See plans/FORMATS.md for protocol. -->

---
### [Product.ProductVision] — 2025-04-15

**Created:** README.md, plans/BUILD.md, plans/STATUS.md

**Summary:** Drafted the product vision for Build B1 — a static, backend-free word search generator (wordsearch.mjt.pub). Sourced from the archived product vision and reference Python implementation in `archive/`.

**BUILD.md highlights:**
- V1 scope only: create, display, print, share, solve — no backend, no frameworks
- Three milestones: M1 (core generator & display), M2 (print & share), M3 (polish & deploy)
- Generator logic ported from `archive/OLD_CODE_word_search.py`

**Open for review:** Principal.BuildReview is next to validate feasibility and milestone granularity.

---
### [Principal.BuildReview] — 2025-04-15

**Outcome: APPROVED** — BUILD.md is ready for milestone planning.

**Review against criteria:**
- **Purpose:** Clear and specific — backend-free word search generator at wordsearch.mjt.pub.
- **Scope:** Well-defined. In/out boundaries are crisp. No ambiguous items.
- **Success criteria:** All seven criteria are testable and measurable.
- **Milestone breakdown:** Logical three-stage progression (generate → distribute → polish). Each milestone has a clear deliverable boundary.
- **Risks:** Identified and reasonable. No showstoppers.

**REQUIRED changes:** None.

**SUGGESTED improvements (non-blocking):**
1. Clarify the profanity filter strategy (blocklist? library? custom?) — can decide during M1 planning.
2. Share URL routing: scope says hash-based client-side routing but also `/v1/<code>` paths. These need reconciling during M2 planning (hash-based would be `#/v1/<code>`).
3. Consider documenting a soft word-count cap (e.g., ~12 words) tied to the URL-length risk.

**RISKS noted:**
- Routing convention (hash vs. path) needs a decision before M2; no blocker for M1.
- Verify the Python reference grid size matches the 15×15 assumption early in M1.

**Decision:** Proceed to Principal.MilestonePlan for M1.

---
### [Human — Build Feedback] — 2025-04-15

**Scope gap identified:** BUILD.md only includes a passive "solution toggle" (reveal answer overlay). It does not include **interactive solving** — the ability for a user to click/drag to highlight words in the grid, confirm correct finds, and track which words have been found.

Human considers interactive solving a required V1 feature. The current "solve" framing (visit a shared link, flip a toggle) is incomplete.

**Requested change:** Product.ProductVision should update BUILD.md to add interactive solve UI to the in-scope features, add a corresponding success criterion, and assign it to the appropriate milestone. Then route back to Principal.BuildReview for re-review.

---
### [Product.ProductVision — revision] — 2025-04-15

**Trigger:** Human.BuildFeedback requested interactive solve UI be added to V1 scope.

**Changes made:**

1. **BUILD.md — Scope (in scope):** Added "Interactive solve UI: click/drag to highlight words in the grid, confirm correct finds, cross off found words in the word bank, track solve progress." Renamed existing solution toggle to clarify it reveals *remaining* placements.

2. **BUILD.md — Success criteria:** Added two criteria:
   - A user can click/drag across grid letters to select a word; correct selections are confirmed and the word is crossed off the word bank
   - Solve progress is tracked — the user can see which words remain

3. **BUILD.md — Milestones:** M2 renamed from "Print & share" → "Print, share & solve" and now includes interactive solve UI.

4. **README.md — Key features:** Updated Solve bullet to describe click/drag interaction and progress tracking.

**Routing:** Back to Principal.BuildReview for re-review of the expanded scope.

---
### [Principal.BuildReview — re-review] — 2025-04-15

**Outcome: APPROVED** — Revised BUILD.md addresses all human feedback.

**Changes reviewed:**
- Interactive solve UI added to in-scope items — clear description (click/drag, confirm, cross off, track progress)
- Two new success criteria are specific and testable
- M2 expanded to "Print, share & solve" — appropriate grouping since solve UI builds on the grid renderer from M1
- Solution toggle clarified as revealing *remaining* placements — good UX distinction

**Assessment:**
- Scope is still well-bounded — interactive solve is additive, not a restructuring
- M2 is now heavier (print + share + solve) but manageable — these are independent features sharing the same grid UI
- No new technical risks — click/drag selection is standard DOM event handling

**Previous suggestions still open (non-blocking):**
1. Profanity filter strategy — decide during M1 planning
2. Hash-based routing vs `/v1/<code>` paths — decide during M2 planning
3. Soft word-count cap — document when convenient

**Decision:** Approved. Proceed to Principal.MilestonePlan for M1.