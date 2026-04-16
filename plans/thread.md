# Thread
<!-- Append-only log. See plans/FORMATS.md for protocol. -->

---
### [PM.ThreadMaintenance — resolved summary] — 2026-04-15

**Build vision & review (B1):** Product vision drafted, reviewed, and approved. Human requested interactive solve UI be added to V1 scope (M2). Revision made and re-approved. BUILD.md is final.

**P2 Q&A resolved:** (1) No automated tests — manual validation only (human directive). (2) Profanity filter: port Python 48-word banned list as-is. Both promoted to DECISIONS.md.

**Open suggestions (non-blocking, deferred):**
- Hash-based routing vs `/v1/<code>` paths — decide before M2
- Soft word-count cap tied to URL-length — document when convenient

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

---
### [Staff.ImplementationExecution] — 2026-04-15

**Review Request — P2 (Generator engine — Python port)**

**What was implemented:**
Ported the full word search generator from `archive/OLD_CODE_word_search.py` to `js/generator.js`. The stub was replaced with a complete ES module implementing all generator logic.

**Key components:**
- **Seeded PRNG:** Mulberry32 algorithm — `createRng(seed)` returns `{ randint, choice }` matching the Python `random.Random` API surface used by the reference
- **Weighted directions:** 15-element `DIRECTIONS` array matching Python's frequency weights (right 3×, down 3×, down-right 2×, etc.)
- **Word placement:** `placeWord()` — tries up to 200 random positions/directions per word, supports letter overlap, checks bounds
- **Filler letters:** `fillRandomLetters()` — fills empty cells with random uppercase A–Z
- **Profanity filter:** `containsBannedWord()` — extracts all rows, columns, and diagonals (forward + backward), checks against the 48-word banned list ported directly from Python
- **Validation:** Rejects empty lists, words >15 chars, non-alphabetic input, and banned words with clear error messages
- **Grid attempts:** Up to 100 full-grid retries if placement fails or profanity is detected

**Key file changed:**
- `js/generator.js` — complete rewrite (stub → ~210 lines of generator logic)

**Acceptance criteria checklist:**
- [x] `generate(wordList, seed)` returns `{ grid, placements }` matching the Python contract
- [x] Seeded PRNG produces repeatable sequences (same seed → same output across calls) — verified: `Deterministic: true`
- [x] Words are placed with weighted direction probabilities matching the Python reference
- [x] Filler letters are random uppercase A–Z; banned-word scan covers rows, columns, diagonals (forward + backward)
- [x] Words exceeding 15 characters, empty lists, non-alphabetic input, and banned words are rejected with clear errors
- [x] Manual verification: generated puzzle with 8 words, inspected 15×15 grid, confirmed all words present, confirmed determinism

**Manual verification results:**
Input: `['JESUS','CROSS','BIBLE','PRAYER','FAITH','HOPE','LOVE','GRACE']`, seed `42`
- Grid: 15×15 ✓, all 8 words placed ✓, deterministic regeneration ✓
- Error cases tested: empty list ✓, word too long ✓, non-alpha ✓, banned word ✓

**Notes:**
- The PRNG is *not* identical to Python's `random.Random` (Mersenne Twister) — same inputs will produce *different* grids than the Python version. This is expected: the contract is determinism within JS, not cross-language bit-compatibility.
- No automated tests per decision A-001.

---
### [Staff.ImplementationExecution] — 2026-04-16

**Review Request — P3 (Grid display & end-to-end integration)**

**What was implemented:**
Built the grid renderer, word bank, and wired the full create → generate → display flow. Added deterministic seed derivation from the word list so identical input always produces the same puzzle.

**Key files changed:**
- `js/ui.js` — added `renderPuzzle(grid, placements, title)` (builds HTML table + word bank) and `clearPuzzle()`
- `js/app.js` — added `hashWords()` for deterministic seed derivation; replaced `console.log` placeholder with `renderPuzzle()` call; imports updated
- `css/style.css` — added styles for `.puzzle-grid`, `.puzzle-cell`, `.puzzle-title`, `.word-bank` (monospaced grid, flex-wrap word list)

**Acceptance criteria checklist:**
- [x] The grid renders as a 15×15 matrix of evenly spaced, monospaced letter cells
- [x] The word bank displays all placed words in a readable list
- [x] Clicking "Generate" with valid input produces and displays a puzzle with no page reload
- [x] The optional title appears above the grid when provided
- [x] Entering the same words twice (without changing them) produces the same grid
- [x] Invalid input (empty list, word too long) shows a user-facing error message instead of silently failing
- [x] Manual end-to-end test: enter 5+ words → click Generate → grid and word bank appear correctly

**Manual verification results (browser):**
- 8 words entered (JESUS, CROSS, BIBLE, PRAYER, FAITH, HOPE, LOVE, GRACE) → 15×15 grid rendered ✓
- Title displayed above grid when provided ✓
- Re-generate with same words → identical grid (determinism) ✓
- Empty input → error message ✓
- Word >15 chars → error message ✓
- No console errors ✓