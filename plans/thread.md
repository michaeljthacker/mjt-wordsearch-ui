# Thread
<!-- Append-only log. See plans/FORMATS.md for protocol. -->

---
### [PM.ThreadMaintenance — B1 final] — 2026-04-16

**Build B1 complete.** All 3 milestones delivered:
- M1: Core generator & display
- M2: Print, share & solve
- M3: Input hardening, visual polish, deploy to wordsearch.mjt.pub

**Carried forward:** Share URL hash length — revisit encoding in a future build (BACKLOG P1).

---
### [PM.ThreadMaintenance — B2 final] — 2026-06-18

**Build B2 complete** (size: step-only). Wired MJT Analytics into wordsearch.mjt.pub as a consumer integration — no backend changes, no vendoring.

- `js/app.js`, `js/ui.js`, `js/solve.js` each `import` directly from `https://analytics.mjt.pub/analytics.js`.
- `init({ site: "wordsearch.mjt.pub", writeKey: "htb2LQmdYzOtUofWGVt7WjXGLiNf9yfgHMPEDYqPXiE" })` + `pageView()` fire once at app load (covers direct-navigation to share links since the page only loads once).
- `track()` on the five chosen actions: `generate`, `copy_share_link`, `print`, `new_puzzle`, `show_solution`.
- Backend CORS prereq for `https://wordsearch.mjt.pub` was completed by the human via `heroku config:set` before implementation; write key confirmed unchanged from the value above.

**Promoted to DECISIONS.md:** "MJT Analytics: direct hosted import, no local wrapper" — surfaced after a first-pass mistake where I added an unnecessary local wrapper module; the human corrected it and we now have a durable rule against repeating it.

**Carried forward:** Verify in a real browser after the next deploy that `pageView` + all five `track()` actions land in `GET /analytics/report/` for `site=wordsearch.mjt.pub`. (Added to BACKLOG.)

---
### [Human.ApproveBuild — B3] — 2026-10-09

**Approved** (step-only). Implementation parameters:
- Words per click: exactly 10 random words from the topic list, capped by space left under the 20-word limit (empty list fills in 2 clicks).
- Topics: animals, vehicles, countries, space, flowers. Topic names are labels/titles only, not puzzle words. Each list: ~40+ words, alphabetic, ≤15 chars.
- Word lists at `words/<topic>.txt`; fetched on click.
- Chips reuse existing app button styling (not the sketch's handwritten font).
- Title filled with topic name only if empty; append to bottom, keep originals, drop duplicates.
- Analytics: `track("autofill", { topic })` via the direct hosted import.

---
### Staff.QuickImplement — 2026-10-09

Added Autofill chips between Title and Words (`index.html`, `.btn-chip` in `css/style.css`) and an `autofill(topic)` handler in `js/app.js`. Each click sends `track("autofill", { topic })` and fetches `words/<topic>.txt` (45–64 words per topic). It skips words already in the list, shuffles the rest, and appends up to 10, capped by space left under `MAX_WORDS`. An empty Title gets the topic name. When the list is full, it shows "Word list is full" and adds nothing. Appended words are uppercase (same as `parseWords` output).

Validation: `node --check` on app.js passed. A headless Chrome harness against a local static server passed: an empty list reaches 10 words, then 20, and a third click reports full; an existing title and words are kept; added words had no duplicates; Generate still renders. Screenshot reviewed. Word lists checked as `^[a-z]{1,15}$` with no duplicates. Ran against d49f8e2.
Note: local `python -m http.server` on this machine serves `.js` as text/plain (Windows registry MIME issue), which breaks module loading. This doesn't affect GitHub Pages.
