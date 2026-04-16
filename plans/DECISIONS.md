# DECISIONS
<!-- See plans/FORMATS.md for expected structure. -->

## Standing decisions
- **No automated tests for V1.** Manual validation only. This is a lightweight side project; test infrastructure is out of scope. (2026-04-15)
- **Profanity filter: port Python list as-is.** Copy the ~48-word `_BANNED_WORDS` array from the Python reference. No external library. (2026-04-15)
- **Hash-based routing for share links.** Use `#/v1/<base64>` format because the app is a static site with no server-side routing. Payload is URL-safe Base64 of `{ t, w }` JSON. (2026-04-16)

## Deprecated decisions
- (none)