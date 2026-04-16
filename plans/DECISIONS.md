# DECISIONS
<!-- See plans/FORMATS.md for expected structure. -->

## Standing decisions
- **No automated tests for V1.** Manual validation only. This is a lightweight side project; test infrastructure is out of scope. (2026-04-15)
- **Profanity filter: position-aware, user input always allowed.** Originally ported Python banned-word list as-is. Relaxed in M3-P1: `containsBannedWord` uses position-aware cell tracking — user-entered words (even if they match/contain a banned word) always pass; filter only blocks banned words involving filler cells. (2026-04-16)
- **Hash-based routing for share links.** Use `#/v1/<base64>` format because the app is a static site with no server-side routing. Payload is URL-safe Base64 of `{ t, w }` JSON. (2026-04-16)
- **20-word soft cap.** Word lists exceeding 20 words are rejected with a user-facing error before generation. Keeps grid quality reasonable and share URLs manageable. (2026-04-16)
- **Deploy to wordsearch.mjt.pub via GitHub Pages.** CNAME file in repo root; serve from `main` branch. Human handles DNS. (2026-04-16)

## Deprecated decisions
- (none)