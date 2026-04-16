# Thread
<!-- Append-only log. See plans/FORMATS.md for protocol. -->

---
### [PM.ThreadMaintenance — M2→M3 transition summary] — 2026-04-16

**M1 closed:** Core generator & display. **M2 closed:** Print, share & solve (4 phases, all approved).

**Active human feedback for M3:** Share URL hashes are too long — revisit encoding before finalizing v1 format (BACKLOG P1).

**Entering M3:** Polish & deploy (final milestone in B1).

---
### Staff.ImplementationExecution — 2026-04-16

**Review Request — P1**

Implemented all P1 acceptance criteria (input validation & edge-case hardening).

**Files changed:** `js/generator.js`, `js/app.js`

**What was implemented:**
- Duplicate word deduplication via `new Set()` in `generateAndRender` before generation
- Profanity filter relaxation: removed pre-generation banned-word check; `containsBannedWord` now tracks placed-word cells vs filler cells and only rejects banned words involving at least one filler cell
- `extractLines` refactored to return `{ text, positions }` to support position-aware profanity scanning
- `encodePayload` chunked into 8192-byte batches to avoid JS argument-limit risk on `String.fromCodePoint`
- 20-word soft cap with user-facing error message before generation

**Acceptance criteria checklist:**
- [x] Duplicate words deduplicated before generation
- [x] User-entered words matching a banned word (e.g., "HELL") accepted
- [x] User-entered words containing a banned substring (e.g., "SHELL") accepted
- [x] Filler-letter profanity scan still blocks accidental banned words
- [x] `encodePayload` chunked to avoid argument-limit risk
- [x] Word list > 20 words shows user-facing error

**Risks/trade-offs:** None identified.

---
### Staff.ImplementationExecution — 2026-04-16

**Review Request — P2**

Implemented all P2 acceptance criteria (visual polish & responsive design).

**Files changed:** `index.html`, `css/style.css`, `js/ui.js`, `js/solve.js`

**What was implemented:**
- Favicon links in `index.html`: ico, apple-touch-icon (180x180), 32x32 PNG, 16x16 PNG, webmanifest
- Open Graph meta tags: `og:title`, `og:description`, `og:url` (pointing to wordsearch.mjt.pub)
- Responsive breakpoint at 480px: cells shrink to 1.6rem, grid container gets `overflow-x: auto` for horizontal scroll, form and buttons scale down
- Hover effect on grid cells (`background: #e2e8f0`), focus-visible outline for keyboard accessibility
- "New Puzzle" button in puzzle-actions row: clears puzzle output, resets form fields, removes hash, focuses word input
- Congratulatory banner (`congrats-banner` class) shown when all words are found — inserted after solve-progress element
- Congrats banner hidden in print media query

**Acceptance criteria checklist:**
- [x] Grid scales gracefully on viewports < 480px (cells shrink, container scrolls horizontally)
- [x] Favicon files linked from `index.html` (ico, apple-touch-icon, webmanifest)
- [x] Open Graph tags set (`og:title`, `og:description`, `og:url`)
- [x] "New Puzzle" button appears after generation and resets view to blank form
- [x] Finding all words displays a visible congratulatory message

**Risks/trade-offs:** None identified.

---
### Staff.ImplementationExecution — 2026-04-16

**Review Request — P3**

Implemented the code-side deployment requirements for P3.

**Files changed:** `CNAME` (new)

**What was implemented:**
- Created `CNAME` file in repo root containing `wordsearch.mjt.pub`
- Verified `og:url` meta tag already points to `https://wordsearch.mjt.pub` (set in P2)

**Human actions still required (not code):**
- Enable GitHub Pages in repo settings → serve from `main` branch
- Configure DNS on domain registrar (CNAME or A record for `wordsearch.mjt.pub`)
- Post-deploy verification: generate puzzle, share link, print preview, solve toggle

**Acceptance criteria checklist:**
- [x] A `CNAME` file exists in the repo root containing `wordsearch.mjt.pub`
- [ ] GitHub Pages is configured to serve from `main` branch *(human action)*
- [ ] The app is reachable at `https://wordsearch.mjt.pub` *(after human completes DNS)*
- [ ] Generating a puzzle, copying a share link, and opening it reproduces the same puzzle *(post-deploy)*
- [ ] Print preview shows the expected clean layout *(post-deploy)*
- [ ] Solve and solution toggle work correctly on the deployed site *(post-deploy)*

**Risks/trade-offs:** Remaining acceptance criteria depend on human actions (GitHub Pages config + DNS). Code-side work is complete.

---
### Principal.CodeReview — 2026-04-16

**Scope:** Full M3 review (P1, P2, P3) — `code_review=every_milestone`, `review_strictness=balanced`.

**Reviewing:** Staff.ImplementationExecution review requests for P1, P2, and P3.

**Verdict: APPROVED** — no required changes.

**P1 — Input validation & edge-case hardening:**
- Deduplication via `new Set(words)` in `generateAndRender` — correct; happens after `parseWords` uppercases, so case-variant duplicates are caught
- Profanity filter relaxation: `containsBannedWord(grid, isPlaced)` correctly distinguishes placed-word cells from filler cells using position-aware line extraction; user-entered banned words pass through, filler-only occurrences are still rejected
- `extractLines` refactor returns `{ text, positions }` — position arrays verified correct for rows, columns, and both diagonal directions
- `encodePayload` chunked at 8192 bytes via `subarray` — safe against JS argument-limit risk
- 20-word cap with clear error message — clean implementation

**P2 — Visual polish & responsive design:**
- Favicon links reference files that all exist in `favicon/` (ico, 32x32, 16x16, apple-touch-icon 180x180, manifest.json) — ✓
- Open Graph tags set correctly (`og:title`, `og:description`, `og:url`)
- Responsive breakpoint at 480px: cells shrink to 1.6rem, grid container scrolls horizontally
- Hover/focus states added; focus-visible uses `var(--color-primary)` — good accessibility
- "New Puzzle" button: clears puzzle + error, resets form, removes hash via `history.replaceState` (avoids hashchange re-trigger), focuses word input
- Congrats banner: uses `textContent` (STANDARDS compliant), duplicate-guarded by `getElementById` check, hidden in print media query

**P3 — Deploy:**
- CNAME contains `wordsearch.mjt.pub` — correct
- Remaining acceptance criteria are human-side (GitHub Pages config, DNS, live verification)

**Standards compliance:**
- Security: all user-facing DOM writes use `textContent`, no `innerHTML` with untrusted content — ✓
- Architecture: plain HTML/CSS/JS with ES modules, no build tools — ✓
- Generator API contract (`generate(wordList, seed)` → `{ grid, placements }`) unchanged — ✓

**SUGGESTED (non-blocking):**
1. The responsive CSS sets `display: block` on `.puzzle-grid` (a `<table>`). This works in practice for enabling `overflow-x: auto`, but wrapping the table in a scrollable `<div>` would be the more robust pattern. Low risk given fixed cell sizes.
2. The congrats banner element persists until `clearPuzzle()` is called. Not a bug — just a note that it isn't independently removable (e.g., if the user manually un-finds a word via browser devtools, the banner stays). Trivial edge case.