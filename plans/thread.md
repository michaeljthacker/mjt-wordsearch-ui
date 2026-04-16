# Thread
<!-- Append-only log. See plans/FORMATS.md for protocol. -->

---
### [PM.ThreadMaintenance — M1→M2 transition summary] — 2026-04-16

**M1 closed (2026-04-16):** Core generator & display complete. Project scaffolding, JS generator engine (Mulberry32 PRNG, profanity filter, deterministic output), grid renderer, word bank, and full e2e flow all delivered and approved.

**Entering M2:** Print, share & solve. Key prerequisite: resolve hash-based routing vs `/v1/<code>` paths (BACKLOG P0) during M2 planning.

**Carry-forward from BACKLOG:** duplicate-word handling (P1), URL-length cap documentation (P2).

---
### Staff.ImplementationExecution — 2026-04-16

**Review Request — P1 (Print stylesheet)**

**Implemented:** Added `@media print` block at the end of `css/style.css` with rules to produce a clean printed puzzle.

**Key files changed:**
- `css/style.css` — appended ~50-line `@media print` section

**What the print rules do:**
- Hide `.puzzle-form`, `.error-message`, and `h1` (form, errors, site heading)
- Reset `.container` to full-width with no padding
- Compact `.puzzle-cell` sizing (1.6rem) with black borders for legibility
- `page-break-inside: avoid` on `.puzzle-grid` and `.word-bank` to keep them on one page
- Strip decorative borders/backgrounds from word bank list items

**Acceptance criteria checklist:**
- [x] Browser print preview shows only the puzzle title, grid, and word bank — form and buttons are hidden
- [x] Grid table fits on a single printed page without clipping or overflow
- [x] Printed grid cells are legible (monospace, sufficient size) and grid lines are visible

**Risks / trade-offs:**
- Very large grids (if grid size is ever increased beyond 15×15) may need tighter cell sizing — not a concern at current 15×15.

---
### Staff.ImplementationExecution — 2026-04-16

**Review Request — P2 (Share URL encoding & hash routing)**

**Implemented:** Hash-based share links using `#/v1/<base64>` encoding. On generate, a "Copy Share Link" button appears. On page load with a hash route, the payload is decoded and the puzzle is regenerated deterministically.

**Key files changed:**
- `js/app.js` — added `encodePayload`, `decodePayload`, `buildShareUrl`, `handleHash`; refactored generate flow into `generateAndRender`
- `js/ui.js` — added `renderShareButton` export (clipboard copy with feedback)
- `css/style.css` — added `.btn-share` styles; added `.btn-share` to print-hide list

**Encoding scheme:**
- Payload: `JSON.stringify({ t: title, w: words })` → UTF-8 bytes → URL-safe Base64 (`+/` → `-_`, strip `=`)
- URL format: `<origin><pathname>#/v1/<encoded>`
- Decoding reverses the process; form is pre-filled from the share link

**Acceptance criteria checklist:**
- [x] After generating a puzzle, a "Copy Share Link" button is visible in the puzzle output section
- [x] Clicking the button copies a URL of the form `<origin>/#/v1/<base64>` to the clipboard
- [x] Opening that URL in a new browser tab decodes the payload, regenerates the identical puzzle, and renders it automatically
- [x] If the hash payload is malformed or missing, a user-friendly error is displayed instead of a blank page
- [x] The input form is still accessible when arriving via a share link (user can create a new puzzle)

**Risks / trade-offs:**
- Very long word lists will produce long URLs; no truncation or length cap enforced (BACKLOG P2 deferred to M3)
- `navigator.clipboard.writeText` requires a secure context (HTTPS or localhost); falls back to "Copy failed" text on error

---
### Staff.ImplementationExecution — 2026-04-16

**Review Request — P3 (Interactive solve UI)**

**Implemented:** Click-to-select solve mode. Users click a start cell then an end cell to highlight a straight line. If the letters match a placed word, cells turn green and the word is crossed off in the bank. A progress counter tracks found words.

**Key files changed:**
- `js/solve.js` — new module: `initSolve(table, placements)` handles click events, line validation, match checking, found-state management, and progress updates
- `js/ui.js` — added `data-row`/`data-col` attributes to grid cells; added `#solve-progress` div after grid
- `js/app.js` — imported `initSolve`; called after `renderPuzzle` with the grid table and placements
- `css/style.css` — added `.selected` (blue), `.found` (green), `.word-found` (strikethrough), `.solve-progress` styles; hid `.solve-progress` in print

**Interaction model:**
- First click selects start cell (blue highlight)
- Second click computes straight line to end cell; only H/V/diagonal lines are valid
- Match → cells turn green, word crossed off, progress updates
- No match → blue highlight flashes 300ms then clears
- Clicking same cell twice deselects

**Acceptance criteria checklist:**
- [x] Clicking a start cell and an end cell selects all cells along the straight line between them
- [x] Only valid straight lines are selectable (horizontal, vertical, or diagonal — matching the 8 directions)
- [x] A correct selection highlights the cells with a persistent "found" style and crosses off the word in the word bank
- [x] An incorrect selection (letters don't match any remaining word) is visually rejected (selection clears, no highlight persists)
- [x] A progress indicator shows how many words have been found out of the total (e.g., "3 / 8 found")
- [x] All found-word state is visual only (no persistence across page reload required)

**New BACKLOG items from human feedback:**
- P1: Win celebration animation when all words found
- P1: Per-word random colors for found highlights (deterministic order, no hash storage needed)
- P1: Profanity filter substring matching — BANNED_WORDS should block words containing banned substrings (e.g., BUTTER blocked by BUTT, RAPES blocked by RAPE)