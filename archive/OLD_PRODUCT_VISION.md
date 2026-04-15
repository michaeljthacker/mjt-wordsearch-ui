Here’s a clean, grounded restatement of the project with clear scope at each version.

---

# Project: Word Search Generator (wordsearch.mjt.pub)

A **simple, static web app** that lets users:

* create printable word searches
* share them via a link
* solve pre-made puzzles instantly

No backend required for early versions.

---

# Core Philosophy

* **Static-first** (HTML/CSS/JS only)
* **Deterministic generation** (seed + words → same puzzle every time)
* **Share via encoding, not storage**
* **Small, shippable increments**
* **Avoid complexity until proven necessary**

---

# V1 — Core Generator + Sharing

## Goal

Ship a fully functional word search generator that is:

* usable
* printable
* shareable
* backend-free

## Features

### 1. Create a puzzle

* textarea input (one word per line)
* optional title
* “Generate” button

### 2. Generate puzzle

* 15×15 grid
* deterministic based on:

  * normalized words
  * seed
* uses ported Python logic (placement, retries, banned-word filtering) 

### 3. Display puzzle

* grid
* word bank
* title (optional)

### 4. Print

* clean print layout (`@media print`)
* hides UI
* high-contrast grid + words

### 5. Share

* generate link:
  `/v1/<code>`

* `<code>` encodes:

  * seed
  * word list
  * optional title

### 6. Shared route

* visiting `/v1/<code>`:

  * decodes payload
  * regenerates puzzle client-side
  * renders puzzle
  * includes print + “show solution”

### 7. Solution view

* toggle to reveal word placements

---

## Tooling

* **HTML**: single page (index.html)
* **CSS**: simple styles + print styles
* **JavaScript**:

  * generator logic (ported from Python)
  * share encoding/decoding
  * DOM rendering
  * routing (simple SPA or hash-based)

No frameworks required.

---

## Business Requirement

> A user can create a printable puzzle and share it via a link that reproduces the exact same puzzle without any backend.

---

# V1.1 — “Solve One Now” (Curated Library)

## Goal

Make the app immediately useful even without user input.

## Features

### 1. Curated puzzles

* define a small library of puzzles (e.g., 10–50)
* each defined by:

  * words
  * seed
  * optional title

### 2. Pre-generated share links

* encode each puzzle into `/v1/<code>`

### 3. UI additions

Add section:

**“Solve one right now”**

* buttons or cards:

  * Random Puzzle
  * Easy Puzzle
  * Animal Puzzle
  * Nature Puzzle
  * etc.

Each button:
→ links directly to a `/v1/<code>`

### 4. Random option

* randomly selects from curated list of links

---

## Important Design Choice

Do NOT encode:

* “theme=animals”

Instead encode:

* actual selected words

This keeps shared puzzles stable forever.

---

## Business Requirement

> A user can visit the site and immediately get a high-quality puzzle without entering any words.

---

# V2a — Expanded Sharing (Still No Backend)

## Goal

Make sharing more robust and flexible while staying fully client-side.

## Features

### 1. Improved encoding

* cleaner payload format
* optional compression if needed
* still URL-safe

### 2. Versioning

* continue using `/v1/...`
* introduce `/v2/...` only if needed

### 3. Slightly richer payload (optional)

* title improvements
* minor display settings (if desired)

### 4. Better UX

* copy link feedback
* error handling for bad links
* nicer shared page layout

---

## Still NOT included

* backend
* persistence
* accounts

---

## Business Requirement

> Sharing is reliable, stable, and slightly more polished, still without any server-side dependency.

---

# V2b — Optional “Random Generation” (Still Client-Side)

## Goal

Introduce dynamic puzzle creation without relying on prebuilt examples.

## Features

### Option A (simplest)

* internal word bank (JSON file)
* categories optional
* “Random Puzzle” selects words at runtime

### Option B (even simpler)

* single large pool of safe words
* random selection → puzzle

### Important

Even here:

* share link encodes actual words + seed
* NOT just “theme=random”

---

## Business Requirement

> The app can generate new puzzles dynamically without needing curated prebuilt links.

---

# V3 — Backend (Only If Needed)

## Goal

Introduce persistence and richer product features.

## Features (only if justified)

### 1. Stored puzzles

* database of puzzles
* short URLs like:
  `/p/abc123`

### 2. Metadata

* author
* title
* descriptions

### 3. Library / gallery

* browse puzzles
* featured puzzles

### 4. User features

* accounts (optional)
* saved puzzles

### 5. Moderation / control

* remove inappropriate content
* manage public content

---

## When to build this

Only if you want:

* public content discovery
* persistent objects
* analytics
* user-generated ecosystem

---

## Business Requirement

> Puzzles become stored objects with identity, not just reconstructable data.

---

# Summary of Evolution

| Version | Focus             | Backend?       | Key Value           |
| ------- | ----------------- | -------------- | ------------------- |
| V1      | Generator + share | No             | Core utility works  |
| V1.1    | Instant puzzles   | No             | Immediate usability |
| V2a     | Better sharing    | No             | More robust UX      |
| V2b     | Dynamic random    | No             | Infinite generation |
| V3      | Persistence       | Yes (optional) | Platform features   |

---

# Final framing

This project is:

> A **static, deterministic puzzle generator** that evolves into a **lightweight content tool**, and only later (if needed) into a **content platform**.

And the key early win is:

> **Useful, printable, shareable puzzles with zero backend.**
