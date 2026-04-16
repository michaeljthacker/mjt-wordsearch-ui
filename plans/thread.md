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