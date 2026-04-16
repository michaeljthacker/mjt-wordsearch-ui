# MILESTONE — B1-M1

## Goal
Port the Python word search generator to JavaScript, build the grid renderer, and implement the create → generate → display flow as a static single-page app.

## Phases

### P1 — Project scaffolding & word input UI
**What:** Create the project file structure (index.html, CSS, JS modules) and build the word input form. The page should have a textarea for entering words (one per line), an optional title field, and a "Generate" button. Basic page layout and styling should be in place.
**Acceptance:**
- [ ] `index.html` loads in a browser with no errors in the console
- [ ] A textarea, an optional title input, and a "Generate" button are visible
- [ ] CSS provides a clean, centered layout with readable typography
- [ ] JS module structure is established (separate files for generator, UI, and app entry point)

### P2 — Generator engine (Python port)
**What:** Port the word search generator from `archive/OLD_CODE_word_search.py` to a JavaScript module. This includes a seeded PRNG, the 15×15 grid creation, weighted directional placement, word placement with overlap support, random filler letters, and profanity-filtered output. The module must be deterministic: the same word list + seed must always produce the identical grid.
**Acceptance:**
- [ ] `generate(wordList, seed)` returns `{ grid, placements }` matching the Python contract
- [ ] Seeded PRNG produces repeatable sequences (same seed → same output across calls)
- [ ] Words are placed with weighted direction probabilities matching the Python reference
- [ ] Filler letters are random uppercase A–Z; no banned words appear in any row, column, or diagonal (forward or backward)
- [ ] Words exceeding 15 characters, empty lists, non-alphabetic input, and banned words are rejected with clear errors
- [ ] Manual verification: generate a puzzle, inspect grid correctness, and confirm determinism (same input → same grid)

### P3 — Grid display & end-to-end integration
**What:** Build the grid renderer (15×15 HTML grid of letter cells) and the word bank (list of placed words). Wire the full create → generate → display flow: user enters words, clicks "Generate", the generator runs, and the grid + word bank appear on the page. The title (if provided) displays above the grid.
**Acceptance:**
- [ ] The grid renders as a 15×15 matrix of evenly spaced, monospaced letter cells
- [ ] The word bank displays all placed words in a readable list
- [ ] Clicking "Generate" with valid input produces and displays a puzzle with no page reload
- [ ] The optional title appears above the grid when provided
- [ ] Entering the same words twice (without changing them) produces the same grid
- [ ] Invalid input (empty list, word too long) shows a user-facing error message instead of silently failing
- [ ] Manual end-to-end test: enter 5+ words → click Generate → grid and word bank appear correctly

## Notes / Dependencies
- The Python reference implementation is in `archive/OLD_CODE_word_search.py` — use it as the algorithmic source of truth for P2
- JavaScript has no built-in seeded PRNG; implement a simple deterministic PRNG (e.g., mulberry32) as part of P2
- No build tools or frameworks — plain HTML/CSS/JS with ES modules
- The seed for generation can be derived from the word list (e.g., a simple hash) so the same input always produces the same puzzle
- P1 output is prerequisite for P3; P2 is logically independent of P1 but P3 depends on both