# Word Search Generator

A simple, static web app for creating printable word searches and sharing them via a link — no backend required.

## What it does

Users enter a list of words and an optional title, then generate a 15×15 word search puzzle. The puzzle is deterministic (same words + seed = same grid every time), so it can be shared as a compact URL that regenerates the exact puzzle client-side. Includes a clean print layout and a solution-reveal toggle.

## Key features

- **Create** — Enter words (one per line) with an optional title; click Generate
- **Display** — Rendered 15×15 grid with word bank
- **Print** — Clean `@media print` layout, hides UI chrome
- **Share** — Encode puzzle as a URL (`/v1/<code>`) that regenerates client-side
- **Solve** — Visit a shared link to see the puzzle; toggle to reveal the solution

## Tech stack

- HTML / CSS / JavaScript (no frameworks)
- Deterministic generator ported from Python reference implementation
- Client-side routing (hash-based or simple SPA)
- Profanity filter on filler letters

## Getting started

> Setup instructions will be added once the project scaffolding is in place.

## License

See [LICENSE](LICENSE).
