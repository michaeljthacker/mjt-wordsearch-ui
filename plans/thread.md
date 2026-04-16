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

---
### [Staff.ImplementationExecution] — 2026-04-15

**Review Request — P1 (Project scaffolding & word input UI)**

**What was implemented:**
Created the project file structure and word input form for the word search generator SPA.

**Key files changed:**
- `index.html` — main page with form (title input, word textarea, Generate button) and output section placeholder
- `css/style.css` — clean centered layout, readable typography, CSS custom properties, form and error styling
- `js/app.js` — entry point; wires form submit, parses input, calls generator, handles errors
- `js/ui.js` — DOM helpers: `parseWords()`, `showError()`, `clearError()`
- `js/generator.js` — stub module exporting `generate()` (throws "not yet implemented"; full impl in P2)

**Acceptance criteria checklist:**
- [x] `index.html` loads in a browser with no errors in the console (all imports resolve; no syntax errors)
- [x] A textarea, an optional title input, and a "Generate" button are visible
- [x] CSS provides a clean, centered layout with readable typography (max-width container, system font stack, monospace textarea)
- [x] JS module structure is established (separate files for generator, UI, and app entry point)

**Notes:**
- The generator stub throws on invocation — clicking Generate with words shows "Generator not yet implemented (coming in P2)" as an error message. This is expected; P2 fills in the real logic.
- No test infrastructure yet; P1 acceptance doesn't require automated tests. P2 adds tests for the generator.

---
### [Staff.DraftQuestions] — 2026-04-15

**Context:** Preparing to implement P2 — Generator engine (Python port). The Python reference (`archive/OLD_CODE_word_search.py`) is clear and self-contained (~210 lines). The algorithm, API contract, and deterministic behavior are well-specified in MILESTONE.md. Two areas need decisions before implementation.

**Q-001: Test infrastructure and runner**
Blocking: Yes
P2 acceptance requires ≥5 automated tests. The project currently has no test infrastructure — no `package.json`, no test framework, no testing standards in STANDARDS.md. The generator module uses ES module `export` syntax, which affects how tests can import it.

Proposed approach: Use Node.js built-in test runner (`node --test`) with `node:assert`. Create a `package.json` with `"type": "module"` to enable ES module imports in test files. Test files live in a `tests/` directory. This adds no external dependencies and aligns with the "no build tools or frameworks" constraint (which applies to the app, not test tooling).

Alternative: `.mjs` test file extensions (no package.json needed) — but this is less conventional and package.json will likely be needed eventually anyway.

Please confirm or specify a preferred approach.

**Q-002: Profanity filter — port Python list as-is?**
Blocking: No
The Python reference has a hardcoded `_BANNED_WORDS` list (~48 words). The MILESTONE says to match the Python reference. The Principal flagged "profanity filter strategy" as needing a decision during M1 planning (see BuildReview thread entry).

Plan: Port the exact Python banned-words array to JavaScript. The filter checks all grid lines (rows, columns, diagonals — forward and backward) after filler placement, identical to the Python behavior. No external library, no expanded list.

If there's a preference for a different/expanded list or a library-based approach, flag it now; otherwise the Python list is the default.