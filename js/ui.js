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

/**
 * Render the puzzle grid, word bank, and optional title into the output section.
 * @param {string[][]} grid - 15×15 array of single-character strings.
 * @param {{ word: string }[]} placements - Placed word objects.
 * @param {string} title - Optional puzzle title.
 */
export function renderPuzzle(grid, placements, title) {
  const output = document.getElementById("puzzle-output");
  output.innerHTML = "";
  output.hidden = false;

  if (title) {
    const h2 = document.createElement("h2");
    h2.className = "puzzle-title";
    h2.textContent = title;
    output.appendChild(h2);
  }

  // Grid
  const table = document.createElement("table");
  table.className = "puzzle-grid";
  table.setAttribute("aria-label", "Word search puzzle grid");
  const tbody = document.createElement("tbody");
  for (const row of grid) {
    const tr = document.createElement("tr");
    for (const letter of row) {
      const td = document.createElement("td");
      td.className = "puzzle-cell";
      td.textContent = letter;
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);
  output.appendChild(table);

  // Word bank
  const section = document.createElement("div");
  section.className = "word-bank";
  section.setAttribute("aria-label", "Words to find in the puzzle");
  const heading = document.createElement("h3");
  heading.textContent = "Words to Find";
  section.appendChild(heading);
  const list = document.createElement("ul");
  for (const p of placements) {
    const li = document.createElement("li");
    li.textContent = p.word;
    list.appendChild(li);
  }
  section.appendChild(list);
  output.appendChild(section);
}

/**
 * Hide and clear the puzzle output section.
 */
export function clearPuzzle() {
  const output = document.getElementById("puzzle-output");
  output.innerHTML = "";
  output.hidden = true;
}
