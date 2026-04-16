/**
 * app.js — Application entry point.
 * Wires up the form and orchestrates generate → render flow.
 */

import { generate } from "./generator.js";
import { parseWords, showError, clearError, renderPuzzle, clearPuzzle } from "./ui.js";

/**
 * Derive a deterministic numeric seed from a word list.
 * Same words in same order → same seed → same puzzle.
 */
function hashWords(words) {
  const str = words.join(",");
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return h >>> 0; // unsigned 32-bit
}

const form = document.getElementById("puzzle-form");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  clearError();
  clearPuzzle();

  const title = document.getElementById("puzzle-title").value.trim();
  const raw = document.getElementById("word-input").value;
  const words = parseWords(raw);

  if (words.length === 0) {
    showError("Please enter at least one word.");
    return;
  }

  try {
    const seed = hashWords(words);
    const result = generate(words, seed);
    renderPuzzle(result.grid, result.placements, title);
  } catch (err) {
    showError(err.message);
  }
});
