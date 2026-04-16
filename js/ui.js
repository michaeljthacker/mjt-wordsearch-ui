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

/**
 * Render a "Copy Share Link" button in the puzzle output section.
 * @param {string} url - The share URL to copy to clipboard.
 */
export function renderShareButton(url) {
  const output = document.getElementById("puzzle-output");
  const btn = document.createElement("button");
  btn.className = "btn-share";
  btn.type = "button";
  btn.textContent = "\u{1F4CB} Copy Share Link";
  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(url);
      btn.textContent = "\u2713 Copied!";
      setTimeout(() => {
        btn.textContent = "\u{1F4CB} Copy Share Link";
      }, 2000);
    } catch {
      btn.textContent = "\u26A0 Copy failed";
      setTimeout(() => {
        btn.textContent = "\u{1F4CB} Copy Share Link";
      }, 2000);
    }
  });

  const printBtn = document.createElement("button");
  printBtn.className = "btn-share";
  printBtn.type = "button";
  printBtn.textContent = "\u{1F5A8} Print";
  printBtn.addEventListener("click", () => window.print());

  const wrapper = document.createElement("div");
  wrapper.className = "puzzle-actions";
  wrapper.appendChild(btn);
  wrapper.appendChild(printBtn);
  output.appendChild(wrapper);
}
