# Word Search Generator

A static, backend-free web app for creating, printing, sharing, and solving word search puzzles — enter words, generate a 15×15 grid, share it with a link, and solve it interactively in the browser.

## What it does

Enter a list of words and an optional title, click **Generate**, and get a 15×15 word search puzzle with a word bank. The generator is deterministic: the same word list always produces the identical grid, powered by a seeded PRNG and a hash derived from the input. Share puzzles via URL, print clean copies, and solve them interactively by clicking cells.

## Current features

- **Create** — Enter words (one per line) with an optional title; click Generate
- **Display** — 15×15 grid of monospaced letter cells with a word bank listing all placed words
- **Print** — Clean print layout via `@media print`; shows only the puzzle title, grid, and word bank on a single page
- **Share** — Copy a share link (`#/v1/<base64>`) that encodes the word list and title; opening it regenerates the identical puzzle
- **Solve** — Click a start cell then an end cell to select a straight line; matching words turn green and are crossed off in the word bank with a progress counter
- **Solution toggle** — "Show Solution" / "Hide Solution" button highlights unfound word placements in yellow; updates automatically as words are found
- **Deterministic output** — Same words always produce the same puzzle (seeded via input hash)
- **Input validation** — Rejects empty lists, words over 15 characters, non-alphabetic input, and banned words with user-facing error messages
- **Profanity filter** — Filler letters are checked so no banned words appear in any row, column, or diagonal

## Tech stack

- HTML / CSS / JavaScript (ES modules, no frameworks or build tools)
- Deterministic generator ported from the Python reference in `archive/`
- Seeded PRNG (Mulberry32) for repeatable grid generation
- Profanity filter using a curated word list

## Getting started

1. Clone the repository
2. Serve the project root with any static file server, e.g.:
   ```bash
   python -m http.server 3000
   ```
3. Open `http://localhost:3000` in a browser

No dependencies to install — the app is plain HTML/CSS/JS.

## Project structure

```
index.html          — Single-page entry point
css/style.css       — Layout, typography, and print stylesheet
js/app.js           — App entry point, form handling, share URL encoding/decoding
js/ui.js            — DOM helpers: renderPuzzle, renderShareButton, showError, clearError
js/generator.js     — Deterministic word search engine (generate, hashWords)
js/solve.js         — Interactive solve mode: cell selection, match checking, solution toggle
```

## License

See [LICENSE](LICENSE).
