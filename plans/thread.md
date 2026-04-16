# Thread
<!-- Append-only log. See plans/FORMATS.md for protocol. -->

---
### [PM.ThreadMaintenance — resolved summary] — 2026-04-16

**Build vision (B1):** Product vision drafted, reviewed, approved. Human added interactive solve UI to V1 scope (M2). BUILD.md is final.

**M1 complete (P1 + P2 + P3):**
- P1: Project scaffolding — `index.html`, `css/style.css`, `js/app.js`, `js/ui.js`, `js/generator.js` (stub). All acceptance criteria met.
- P2: Generator engine ported from Python — Mulberry32 PRNG, weighted directions, profanity filter, input validation. Deterministic within JS (not cross-language). All acceptance criteria met.
- P3: Grid renderer (`renderPuzzle`), word bank, `hashWords` seed derivation, full e2e flow. All acceptance criteria met.
- Code review: APPROVED with no required changes. Two ARIA suggestions implemented (removed `role="grid"`, added `aria-label`s). Duplicate-word handling deferred to BACKLOG.

**Standing decisions (in DECISIONS.md):** No automated tests (manual only); profanity filter uses ported 48-word Python list.

**Open items (non-blocking, deferred to BACKLOG):**
- Hash-based routing vs `/v1/<code>` paths — decide before M2
- Soft word-count cap tied to URL-length — document when convenient
- Deduplicate or warn on duplicate words in input