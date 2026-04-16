# CHANGELOG

## Unreleased

### B1-M1-P3 — Grid display & end-to-end integration
- Built grid renderer (`js/ui.js`): 15×15 HTML table with monospaced letter cells, word bank with flex-wrap layout
- Wired full create → generate → display flow in `js/app.js` with deterministic seed derivation (`hashWords`)
- Added puzzle and word bank styling in `css/style.css`
- Post-review: removed incorrect `role="grid"`, added ARIA labels for accessibility

### B1-M1-P2 — Generator engine (Python port)
- Ported word search generator from Python to JS (`js/generator.js`): seeded PRNG (Mulberry32), weighted directional placement, overlap support, random filler, profanity filter (48-word banned list)
- Generator is deterministic: same word list + seed → identical grid
- Input validation: rejects empty lists, words >15 chars, non-alphabetic input, banned words

### B1-M1-P1 — Project scaffolding & word input UI
- Created `index.html` with word input form (title field, word textarea, Generate button) and output section placeholder
- Added `css/style.css` with centered layout, CSS custom properties, system font stack, and form styling
- Established JS module structure: `js/app.js` (entry point), `js/ui.js` (DOM helpers), `js/generator.js` (stub)

## Released
(none yet)