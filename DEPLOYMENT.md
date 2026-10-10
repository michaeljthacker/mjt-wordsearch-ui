# DEPLOYMENT

## Standing deploy
- **Host:** GitHub Pages, serving the `main` branch root. Custom domain `wordsearch.mjt.pub` via `CNAME`; the human manages DNS.
- **Build:** none. This is a static HTML/CSS/JS site, so pushing to `main` deploys it.
- **Env vars / secrets:** none. The MJT Analytics write key is public by design and lives in `js/app.js`.
- **Local check before shipping:** `python -m http.server 3000` → `http://localhost:3000`. See the README's Windows note if modules fail with a `text/plain` MIME error.
- **Rollback:** revert the release merge on `main` and push. Pages redeploys the previous state.

## Current release — v1.1.0 (B3)
1. Test locally (see above): click several Autofill chips, then Generate.
2. Open a PR `feat/autofill` → `main` and merge it.
3. Tag the merged commit on `main`: `git tag v1.1.0 <merge-sha> && git push origin v1.1.0`
4. Wait for the Pages deploy, then smoke test on https://wordsearch.mjt.pub:
   - All 10 Autofill chips add 10 words, and an empty Title gets the topic name.
   - Clicking two topics on an empty list fills it to 20 words, and a third click shows "Word list is full".
   - Generate and Copy Share Link still work on an autofilled list.
   - DevTools console shows no manifest icon 404s.
   - `GET /analytics/report/` for `site=wordsearch.mjt.pub` shows `autofill` events with `topic`, along with `pageView` and the five B2 events. This closes the BACKLOG P0 item.
5. Rollback: revert the merge commit on `main` and push. No data or migrations are involved.
