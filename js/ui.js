/**
 * ui.js — DOM interaction helpers for the word search app.
 */

/**
 * Parse the word textarea into a cleaned array of uppercase words.
 * @param {string} raw - Raw textarea value.
 * @returns {string[]}
 */
export function parseWords(raw) {
  return raw
    .split("\n")
    .map((w) => w.trim().toUpperCase())
    .filter((w) => w.length > 0);
}

/**
 * Show an error message below the form.
 * @param {string} message
 */
export function showError(message) {
  const el = document.getElementById("error-message");
  el.textContent = message;
  el.hidden = false;
}

/**
 * Hide the error message.
 */
export function clearError() {
  const el = document.getElementById("error-message");
  el.textContent = "";
  el.hidden = true;
}
