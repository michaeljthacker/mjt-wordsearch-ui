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
