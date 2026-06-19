/**
 * analytics.js — MJT Analytics wrapper.
 *
 * Loads the hosted helper lazily so a network/CORS failure can never block
 * the host page. All exports are fire-and-forget no-ops if the helper fails
 * to load or throws.
 */

const SITE = "wordsearch.mjt.pub";
const WRITE_KEY = "htb2LQmdYzOtUofWGVt7WjXGLiNf9yfgHMPEDYqPXiE";

let helper = null;
const ready = import("https://analytics.mjt.pub/analytics.js")
  .then((m) => {
    helper = m;
    try {
      m.init({ site: SITE, writeKey: WRITE_KEY });
    } catch {}
  })
  .catch(() => {});

export function pageView() {
  ready.then(() => {
    try {
      helper && helper.pageView();
    } catch {}
  });
}

export function track(action) {
  ready.then(() => {
    try {
      helper && helper.track(action);
    } catch {}
  });
}
