/**
 * solve.js — Interactive solve mode for the word search puzzle.
 * Click a start cell, then click an end cell to select a straight line.
 * If the letters match a placed word, the cells are highlighted and the
 * word is crossed off in the word bank.
 */

/**
 * Initialize solve mode on a rendered puzzle grid.
 * @param {HTMLTableElement} table - The puzzle grid table element.
 * @param {{ word: string, row: number, col: number, direction: number[] }[]} placements
 */
export function initSolve(table, placements) {
  const foundWords = new Set();
  let startCell = null;
  let showingSolution = false;
  let solutionBtn = null;

  const tbody = table.querySelector("tbody");

  function getCell(row, col) {
    const tr = tbody.rows[row];
    return tr ? tr.cells[col] : null;
  }

  /**
   * Compute cells along a straight line from (r1,c1) to (r2,c2).
   * Returns null if the line is not horizontal, vertical, or 45° diagonal.
   */
  function getLineCells(r1, c1, r2, c2) {
    const dr = Math.sign(r2 - r1);
    const dc = Math.sign(c2 - c1);
    const rowDist = Math.abs(r2 - r1);
    const colDist = Math.abs(c2 - c1);

    // Must be a straight line (horizontal, vertical, or 45° diagonal)
    if (rowDist !== colDist && rowDist !== 0 && colDist !== 0) return null;

    const steps = Math.max(rowDist, colDist);
    if (steps === 0) return null;

    const cells = [];
    for (let i = 0; i <= steps; i++) {
      const cell = getCell(r1 + dr * i, c1 + dc * i);
      if (!cell) return null;
      cells.push(cell);
    }
    return cells;
  }

  function clearSelection() {
    table.querySelectorAll(".puzzle-cell.selected").forEach((c) =>
      c.classList.remove("selected")
    );
    startCell = null;
  }

  function extractWord(cells) {
    return cells.map((c) => c.textContent).join("");
  }

  function checkMatch(word) {
    const reversed = word.split("").reverse().join("");
    for (const p of placements) {
      if (foundWords.has(p.word)) continue;
      if (p.word === word || p.word === reversed) return p;
    }
    return null;
  }

  function markFound(cells, placement) {
    cells.forEach((c) => {
      c.classList.remove("selected");
      c.classList.add("found");
    });
    foundWords.add(placement.word);

    // Cross off in word bank
    const wordBankItems = document.querySelectorAll(".word-bank li");
    for (const li of wordBankItems) {
      if (li.textContent === placement.word) {
        li.classList.add("word-found");
        break;
      }
    }

    updateProgress();
  }

  function updateProgress() {
    const el = document.getElementById("solve-progress");
    if (el) {
      el.textContent = `${foundWords.size} / ${placements.length} found`;
    }
    if (!solutionBtn) return;
    if (foundWords.size === placements.length) {
      if (showingSolution) {
        table.querySelectorAll(".puzzle-cell.solution").forEach((c) =>
          c.classList.remove("solution")
        );
        showingSolution = false;
      }
      solutionBtn.textContent = "All words found!";
      solutionBtn.disabled = true;
    } else if (showingSolution) {
      // Refresh solution highlights for remaining unfound words
      table.querySelectorAll(".puzzle-cell.solution").forEach((c) =>
        c.classList.remove("solution")
      );
      getSolutionCells().forEach((c) => c.classList.add("solution"));
    }
  }

  table.addEventListener("click", (e) => {
    const cell = e.target.closest(".puzzle-cell");
    if (!cell) return;

    const row = parseInt(cell.dataset.row, 10);
    const col = parseInt(cell.dataset.col, 10);

    if (!startCell) {
      clearSelection();
      startCell = cell;
      cell.classList.add("selected");
    } else {
      const startRow = parseInt(startCell.dataset.row, 10);
      const startCol = parseInt(startCell.dataset.col, 10);

      // Clicking the same cell deselects
      if (row === startRow && col === startCol) {
        clearSelection();
        return;
      }

      const lineCells = getLineCells(startRow, startCol, row, col);

      if (!lineCells) {
        clearSelection();
        return;
      }

      // Highlight the full line
      lineCells.forEach((c) => c.classList.add("selected"));

      const word = extractWord(lineCells);
      const match = checkMatch(word);

      if (match) {
        markFound(lineCells, match);
        startCell = null;
      } else {
        // Brief rejection flash then clear
        startCell = null;
        setTimeout(() => clearSelection(), 300);
      }
    }
  });

  // --- Solution toggle ---

  function getSolutionCells() {
    const cells = [];
    for (const p of placements) {
      if (foundWords.has(p.word)) continue;
      const [dr, dc] = p.direction;
      for (let i = 0; i < p.word.length; i++) {
        const cell = getCell(p.row + dr * i, p.col + dc * i);
        if (cell) cells.push(cell);
      }
    }
    return cells;
  }

  solutionBtn = document.createElement("button");
  solutionBtn.className = "btn-share";
  solutionBtn.type = "button";
  solutionBtn.textContent = "Show Solution";
  solutionBtn.addEventListener("click", () => {
    if (foundWords.size === placements.length) return;
    if (showingSolution) {
      table.querySelectorAll(".puzzle-cell.solution").forEach((c) =>
        c.classList.remove("solution")
      );
      showingSolution = false;
      solutionBtn.textContent = "Show Solution";
    } else {
      getSolutionCells().forEach((c) => c.classList.add("solution"));
      showingSolution = true;
      solutionBtn.textContent = "Hide Solution";
    }
  });

  const actionsDiv = document.querySelector(".puzzle-actions");
  if (actionsDiv) {
    actionsDiv.appendChild(solutionBtn);
  }

  updateProgress();
}
