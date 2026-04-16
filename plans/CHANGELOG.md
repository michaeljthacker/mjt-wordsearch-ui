# CHANGELOG

## Unreleased

### B1-M2-P4 — Solution toggle (2026-04-16)
- Added "Show Solution" / "Hide Solution" toggle button; highlights unfound placements in yellow, auto-refreshes as words are found
- Button disables with "All words found!" message on completion
- Post-review: fixed rejection flash overlap in solve.js, added `.puzzle-cell.found` print reset in style.css

### B1-M2-P3 — Interactive solve UI (2026-04-16)
- Added click-to-select solve mode: click start cell then end cell to highlight a straight line; valid matches turn green and cross off the word in the bank
- New `js/solve.js` module with line validation, match checking, and progress tracking ("X / Y found")
- Added `.selected`, `.found`, `.word-found`, `.solve-progress` CSS styles; hidden in print

### B1-M2-P2 — Share URL encoding & hash routing (2026-04-16)
- Implemented `#/v1/<base64>` hash routing: encodes word list + title as URL-safe Base64, decodes on page load to regenerate identical puzzle
- Added "Copy Share Link" button with clipboard API feedback; added "Print" button (bonus, not in plan) for discoverability
- Pre-fills form from share links; shows friendly errors for malformed/empty payloads

### B1-M2-P1 — Print stylesheet (2026-04-16)
- Added `@media print` rules to `css/style.css`: hides form, errors, and heading; shows only puzzle title, grid, and word bank
- Compact cell sizing (1.6rem) with black borders and `page-break-inside: avoid` for single-page output

## Released

### B1-M1 — Core generator & display (2026-04-16)
Milestone M1 complete — ported Python word search generator to JavaScript, built the grid renderer, and implemented the create → generate → display flow as a static single-page app.

#### P3 — Grid display & end-to-end integration
- Built grid renderer (`js/ui.js`): 15×15 HTML table with monospaced letter cells, word bank with flex-wrap layout
- Wired full create → generate → display flow in `js/app.js` with deterministic seed derivation (`hashWords`)
- Added puzzle and word bank styling in `css/style.css`
- Post-review: removed incorrect `role="grid"`, added ARIA labels for accessibility

#### P2 — Generator engine (Python port)
- Ported word search generator from Python to JS (`js/generator.js`): seeded PRNG (Mulberry32), weighted directional placement, overlap support, random filler, profanity filter (48-word banned list)
- Generator is deterministic: same word list + seed → identical grid
- Input validation: rejects empty lists, words >15 chars, non-alphabetic input, banned words

#### P1 — Project scaffolding & word input UI
- Created `index.html` with word input form (title field, word textarea, Generate button) and output section placeholder
- Added `css/style.css` with centered layout, CSS custom properties, system font stack, and form styling
- Established JS module structure: `js/app.js` (entry point), `js/ui.js` (DOM helpers), `js/generator.js` (stub)