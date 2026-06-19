# Thread
<!-- Append-only log. See plans/FORMATS.md for protocol. -->

---
### [PM.ThreadMaintenance — B1 final] — 2026-04-16

**Build B1 complete.** All 3 milestones delivered:
- M1: Core generator & display
- M2: Print, share & solve
- M3: Input hardening, visual polish, deploy to wordsearch.mjt.pub

**Carried forward:** Share URL hash length — revisit encoding in a future build (BACKLOG P1).

## Concept brief (seed for Product.ProductVision) — wire this project into MJT Analytics

**Goal:** Add lightweight, self-hosted usage telemetry to *this* project by integrating
the existing **MJT Analytics** layer. This build is a *consumer integration only* — it
adds a few tracking calls to this codebase. It does **not** build or modify any analytics
backend; that already exists at `api.mjt.pub` (the `mjt-pub-api` repo) with a hosted JS
helper published at `https://analytics.mjt.pub/analytics.js`.

**What MJT Analytics is (context, not scope):** a minimal page-view + named-event
telemetry layer — answers "is anyone using this, which pages get traffic, are the actions
I care about firing." No sessions, identity, funnels, or consent machinery. The source of
truth for the public `mjt-analytics` helper API is the hosted script at
`https://analytics.mjt.pub/analytics.js`; read/inspect that file before implementing if 
integration details are unclear, and do not copy, vendor, or hardcode a local version of
the helper since the hosted script may evolve.


**Integration approach (the intended happy path):**
- Import the hosted ES module directly — no vendoring, no build step, no npm install:
  `import { init, pageView, track } from 'https://analytics.mjt.pub/analytics.js';`
  (or `<script type="module">` for a `window.mjtAnalytics` global on classic/inline handlers).
- Call `init({ site: '<stable-site-name-for-this-project>', writeKey: '<current-key>' })`
  once at startup. Pick one stable `site` string (≤64 chars) and never change it. The write
  key as of 2026-06-16 is `htb2LQmdYzOtUofWGVt7WjXGLiNf9yfgHMPEDYqPXiE` (not a secret — it
  ships in client code by design; confirm the current value in the mjt-analytics README).
- Fire `pageView()` on load / route change.
- `track('<action>')` on the handful of events that actually matter for THIS project —
  identify those during planning (e.g. signup, primary CTA, key conversion). Keep it small.
- All calls are fire-and-forget and must never throw into or block this host page — verify
  the helper preserves that property in this app's context.

**External prerequisite — flag as a dependency/blocker, NOT in-scope code here:**
Before any event is accepted, this site must be onboarded on the backend (`mjt-pub-api`),
which is a separate repo and a **config change, not a code deploy**. Both steps are
human-performed ops outside this repo; treat them as a Human-cleared prerequisite to the
verification phase. Until they're done, the browser blocks events (CORS) and/or the backend
rejects them (403).

  1. **Append this site's origin to `CORS_ALLOWED_ORIGINS`.** Append-safe — read the current
     value first and append to it; never overwrite, or you'll drop every other site. On
     Heroku this is a single `config:set`, which restarts the dynos automatically (no
     `git push heroku` / redeploy):

     ```bash
     CURRENT=$(heroku config:get CORS_ALLOWED_ORIGINS --app mjt-pub-api-prod)
     heroku config:set CORS_ALLOWED_ORIGINS="$CURRENT,https://<this-site-origin>" --app mjt-pub-api-prod
     ```

  2. **Get the current write key** to pass in `init({ writeKey })`:

     ```bash
     heroku config:get ANALYTICS_WRITE_KEY --app mjt-pub-api-prod
     ```

**Out of scope:** any backend/`mjt-pub-api` changes; building reporting/dashboards (the
staff-only report endpoint + static viewer already exist); analytics-platform features
(sessions, funnels, attribution, A/B, consent). If this project outgrows MJT Analytics,
the intended response is to migrate to a dedicated platform, not extend it.

**Acceptance / verification:**
- Events from this site appear in the backend (Django admin and/or `GET /analytics/report/`).
- `pageView` fires on load; the chosen `track()` actions fire on their triggers.
- Tracking failures (network, pre-`init()`, serialization) are silently swallowed and never
  surface to the user or break the page.

**Guiding principle:** build the smallest thing that removes blindness. Prefer the simplest
integration that captures the few signals this project actually needs.

For stable-site-name-for-this-project, I was thinking `wordsearch.mjt.pub`. The writeKey has NOT changed from what is listed above. I'd like to log `pageView()` on the main page, which should also include direct navigation to a shared wordsearch via "Copy Share Link". I'd like to log `track('<action>')` on all the key buttons: Generate, Copy Share Link, Print, New Puzzle, and Show Solution. I don't need state, just because that would potentially capture personal things I don't care to see.

As for the external prerequisites, see here:
````
(base) PS C:\Users\Micha\DevSpace\Projects\mjt-wordsearch-ui> heroku config:get ANALYTICS_WRITE_KEY --app mjt-pub-api-prod
htb2LQmdYzOtUofWGVt7WjXGLiNf9yfgHMPEDYqPXiE
(base) PS C:\Users\Micha\DevSpace\Projects\mjt-wordsearch-ui> $CURRENT = heroku config:get CORS_ALLOWED_ORIGINS --app mjt-pub-api-prod; echo $CURRENT
https://homecare.mjt.pub,https://mjt-pub-api-prod-35d1a24a2b7e.herokuapp.com,https://api.mjt.pub,https://michaeljthacker.github.io,https://analytics.mjt.pub,https://childrensliturgy.org,https://www.athousandquestions.com,https://bedtimeserial.com,https://garden.mjt.pub,https://projects.mjt.pub,https://soccer.mjt.pub,https://cooked.mjt.pub,https://colors.mjt.pub
(base) PS C:\Users\Micha\DevSpace\Projects\mjt-wordsearch-ui> heroku config:set CORS_ALLOWED_ORIGINS="$CURRENT,https://wordsearch.mjt.pub" --app mjt-pub-api-prod
Setting CORS_ALLOWED_ORIGINS and restarting ⬢ mjt-pub-api-prod... done, v37
CORS_ALLOWED_ORIGINS: https://homecare.mjt.pub,https://mjt-pub-api-prod-35d1a24a2b7e.herokuapp.com,https://api.mjt.pub,https://michaeljthacker.github.io,https://analytics.mjt.pub,https://childrensliturgy.org,https://www.athousandquestions.com,https://bedtimeserial.com,https://garden.mjt.pub,https://projects.mjt.pub,https://soccer.mjt.pub,https://cooked.mjt.pub,https://colors.mjt.pub,https://wordsearch.mjt.pub
````

As for size, try this as a step-only size, but say if that's infeasible.