# Word Search Generator

A static, backend-free web app for creating, printing, sharing, and solving word search puzzles — enter words, generate a 15×15 grid, share it with a link, and solve it interactively in the browser.

**Live at [wordsearch.mjt.pub](https://wordsearch.mjt.pub)**

## What it does

Enter a list of words and an optional title, click **Generate**, and get a 15×15 word search puzzle with a word bank. The generator is deterministic: the same word list always produces the identical grid, powered by a seeded PRNG and a hash derived from the input. Share puzzles via URL, print clean copies, and solve them interactively by clicking cells.

## Current features

- **Create** — Enter up to 20 words (one per line) with an optional title; duplicates are automatically removed
- **Display** — 15×15 grid of monospaced letter cells with a word bank listing all placed words
- **Print** — Clean print layout via `@media print`; shows only the puzzle title, grid, and word bank on a single page
- **Share** — Copy a share link (`#/v1/<base64>`) that encodes the word list and title; opening it regenerates the identical puzzle
- **Solve** — Click a start cell then an end cell to select a straight line; matching words turn green and are crossed off in the word bank with a progress counter
- **Solution toggle** — "Show Solution" / "Hide Solution" button highlights unfound word placements in yellow; updates automatically as words are found
- **Congratulations** — Finding all words displays a congratulatory banner
- **New Puzzle** — Reset button clears the puzzle and returns to the blank form
- **Responsive** — Mobile-friendly layout; grid scrolls horizontally on viewports under 480px
- **Deterministic output** — Same words always produce the same puzzle (seeded via input hash)
- **Input validation** — Rejects empty lists, words over 15 characters, non-alphabetic input, and lists exceeding 20 words; deduplicates entries automatically
- **Profanity filter** — Filler letters are scanned so no banned words appear accidentally in any row, column, or diagonal; user-entered words are always accepted even if they match a banned word

## Tech stack

- HTML / CSS / JavaScript (ES modules, no frameworks or build tools)
- Deterministic generator ported from the Python reference in `archive/`
- Seeded PRNG (Mulberry32) for repeatable grid generation
- Profanity filter using a curated word list

## Getting started

The app is live at [wordsearch.mjt.pub](https://wordsearch.mjt.pub). To run locally:

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
favicon/            — Favicon assets (ico, apple-touch-icon, PNGs, webmanifest)
CNAME               — GitHub Pages custom domain (wordsearch.mjt.pub)
```

## License

See [LICENSE](LICENSE).
