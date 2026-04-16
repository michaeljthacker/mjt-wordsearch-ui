/**
 * app.js — Application entry point.
 * Wires up the form and orchestrates generate → render flow.
 */

import { generate } from "./generator.js";
import { parseWords, showError, clearError } from "./ui.js";

const form = document.getElementById("puzzle-form");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  clearError();

  const title = document.getElementById("puzzle-title").value.trim();
  const raw = document.getElementById("word-input").value;
  const words = parseWords(raw);

  if (words.length === 0) {
    showError("Please enter at least one word.");
    return;
  }

  // Generator integration happens in P3; for now surface a placeholder message.
  try {
    const result = generate(words, 0);
    // P3 will render result.grid and result.placements here.
    console.log("Generated puzzle:", result);
  } catch (err) {
    showError(err.message);
  }
});
