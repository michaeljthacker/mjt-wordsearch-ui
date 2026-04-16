# MILESTONE — B1-M3

## Goal
Harden input handling, polish the visual design and UX, and deploy the finished app to wordsearch.mjt.pub.

## Phases

### P1 — Input validation & edge-case hardening
**What:** Address known input-handling gaps from the backlog: detect and deduplicate duplicate words with a user-visible warning, relax the profanity filter so user-entered words are always allowed (even if they match or contain a banned word — intentional input trumps the filter; the filter only prevents accidental profanity in filler letters), guard `encodePayload` against argument-limit risk for large payloads, and add a soft word-count cap with a clear error message.
**Acceptance:**
- [x] Entering duplicate words deduplicates them silently (or warns) before generation — no duplicate entries reach the generator
- [x] User-entered words that exactly match a banned word (e.g., "HELL") are accepted without error
- [x] User-entered words containing a banned substring (e.g., "SHELL" containing "HELL") are accepted without error
- [x] Filler-letter profanity scan continues to block accidental banned words in rows, columns, and diagonals
- [x] `encodePayload` chunks the `String.fromCodePoint` call so it does not exceed the JS argument limit for large word lists
- [x] A word list exceeding 20 words shows a user-facing error before generation

### P2 — Visual polish & responsive design
**What:** Add mobile-friendly responsive breakpoints, integrate the human-supplied favicon (from `favicon/` directory), add Open Graph meta tags for link previews, and small UX improvements: a "New Puzzle" button to reset the form, subtle hover/focus refinements on grid cells, and a congratulatory message when all words are found.
**Acceptance:**
- [x] Grid scales gracefully on viewports < 480px (cells shrink or container scrolls horizontally) without layout breakage
- [x] Favicon files in `favicon/` are linked from `index.html` (ico, apple-touch-icon, webmanifest); renders in browser tabs
- [x] `<meta>` Open Graph tags (`og:title`, `og:description`, `og:url`) are set in `index.html`
- [x] A "New Puzzle" button appears after generation and resets the view to the blank form
- [x] Finding all words displays a visible congratulatory message (e.g., banner or styled text)

### P3 — Deploy to production
**What:** Deploy the static site to wordsearch.mjt.pub via GitHub Pages serving from the `main` branch. Add a `CNAME` file to the repo root. Human will configure DNS on the domain registrar. Verify all features work on the live URL.
**Acceptance:**
- [x] A `CNAME` file exists in the repo root containing `wordsearch.mjt.pub`
- [x] GitHub Pages is configured to serve from `main` branch
- [x] The app is reachable at `https://wordsearch.mjt.pub` (after human completes DNS)
- [x] Generating a puzzle, copying a share link, and opening it in a new browser tab reproduces the same puzzle
- [x] Print preview shows the expected clean layout
- [x] Solve and solution toggle work correctly on the deployed site

## Notes / Dependencies
- P1 profanity filter relaxation: intentional user input always allowed; filter only guards filler letters
- P2 favicon: human is preparing the assets; place in `favicon/` directory (ico, apple-touch-icon, webmanifest, android-chrome PNGs)
- P3 deploy: human handles DNS config on registrar; CNAME file + GitHub Pages `main` branch on our side
- Shorter share URLs (BACKLOG P1) deferred — not blocking for V1 deploy
