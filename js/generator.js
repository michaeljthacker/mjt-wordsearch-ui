/**
 * generator.js — Word search puzzle generator module.
 * Ported from archive/OLD_CODE_word_search.py.
 */

const GRID_SIZE = 15;

// Weighted directions: right and down more likely, diagonals less likely.
const DIRECTIONS = [
  [0, 1], [0, 1], [0, 1],       // right  (3×)
  [1, 0], [1, 0], [1, 0],       // down   (3×)
  [1, 1], [1, 1],               // down-right (2×)
  [1, -1],                      // down-left  (1×)
  [0, -1], [0, -1],             // left   (2×)
  [-1, 0], [-1, 0],             // up     (2×)
  [-1, -1],                     // up-left    (1×)
  [-1, 1],                      // up-right   (1×)
];

const BANNED_WORDS = [
  "FUCK", "SHIT", "BITCH", "ASSHOLE", "DICK", "COCK", "PUSSY", "CUNT",
  "NIGGER", "FAGGOT", "BASTARD", "SLUT", "WHORE", "CRAP", "JIZZ", "HOE",
  "PISS", "TITS", "JERK", "WANKER", "DOUCHE", "ASS", "FART", "BLOWJOB",
  "ANUS", "PRICK", "POO", "BUTT", "SCROTUM", "DILDO", "BOOBS", "WEINER",
  "FREAK", "RETARD", "LOSER", "SUCK", "TURD", "DARN", "PEE", "DONG",
  "DAMN", "HELL", "CLIT", "NUT", "RAPE", "SEXY", "PORN", "DRUG",
];

const MAX_GRID_ATTEMPTS = 100;
const MAX_PLACE_ATTEMPTS = 200;
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

/**
 * Mulberry32 seeded PRNG.
 * Returns a function that produces pseudo-random floats in [0, 1).
 */
function mulberry32(seed) {
  let state = seed | 0;
  return function () {
    state = (state + 0x6D2B79F5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function createRng(seed) {
  const next = mulberry32(seed);
  return {
    randint(min, max) {
      return min + Math.floor(next() * (max - min + 1));
    },
    choice(arr) {
      return arr[Math.floor(next() * arr.length)];
    },
  };
}

function extractLines(grid) {
  const size = grid.length;
  const lines = [];

  for (const row of grid) {
    lines.push(row.join(""));
  }

  for (let col = 0; col < size; col++) {
    let s = "";
    for (let row = 0; row < size; row++) {
      s += grid[row][col];
    }
    lines.push(s);
  }

  for (let start = -(size - 1); start < size; start++) {
    let diag = "";
    for (let i = 0; i < size; i++) {
      const r = i;
      const c = i - start;
      if (r >= 0 && r < size && c >= 0 && c < size) {
        diag += grid[r][c];
      }
    }
    if (diag) lines.push(diag);
  }

  for (let start = 0; start < 2 * size - 1; start++) {
    let diag = "";
    for (let i = 0; i < size; i++) {
      const r = i;
      const c = start - i;
      if (r >= 0 && r < size && c >= 0 && c < size) {
        diag += grid[r][c];
      }
    }
    if (diag) lines.push(diag);
  }

  return lines;
}

function containsBannedWord(grid) {
  for (const line of extractLines(grid)) {
    const backward = line.split("").reverse().join("");
    for (const banned of BANNED_WORDS) {
      if (line.includes(banned) || backward.includes(banned)) {
        return true;
      }
    }
  }
  return false;
}

function placeWord(grid, word, rng) {
  const size = grid.length;
  for (let attempt = 0; attempt < MAX_PLACE_ATTEMPTS; attempt++) {
    const [dr, dc] = rng.choice(DIRECTIONS);
    const row = rng.randint(0, size - 1);
    const col = rng.randint(0, size - 1);

    const endRow = row + dr * (word.length - 1);
    const endCol = col + dc * (word.length - 1);

    if (endRow < 0 || endRow >= size || endCol < 0 || endCol >= size) {
      continue;
    }

    let fits = true;
    for (let i = 0; i < word.length; i++) {
      const r = row + dr * i;
      const c = col + dc * i;
      const cell = grid[r][c];
      if (cell !== "" && cell !== word[i]) {
        fits = false;
        break;
      }
    }

    if (fits) {
      for (let i = 0; i < word.length; i++) {
        const r = row + dr * i;
        const c = col + dc * i;
        grid[r][c] = word[i];
      }
      return { row, col, direction: [dr, dc] };
    }
  }
  return null;
}

function fillRandomLetters(grid, rng) {
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c] === "") {
        grid[r][c] = rng.choice(ALPHABET);
      }
    }
  }
}

/**
 * Generate a word search puzzle.
 * @param {string[]} wordList - Array of words to place.
 * @param {number} seed - Numeric seed for deterministic generation.
 * @returns {{ grid: string[][], placements: {word:string, row:number, col:number, direction:number[]}[] }}
 */
export function generate(wordList, seed) {
  if (!wordList || wordList.length === 0) {
    throw new Error("Word list must not be empty.");
  }

  const normalized = wordList.map((w) => w.trim().toUpperCase());

  for (const word of normalized) {
    if (word.length > GRID_SIZE) {
      throw new Error(`Word '${word}' exceeds maximum length of ${GRID_SIZE}.`);
    }
    if (!/^[A-Z]+$/.test(word)) {
      throw new Error(`Word '${word}' contains non-alphabetic characters.`);
    }
  }

  for (const word of normalized) {
    if (BANNED_WORDS.includes(word)) {
      throw new Error(`Word '${word}' is in the banned-words list.`);
    }
  }

  const rng = createRng(seed);

  const wordsSorted = [...normalized].sort((a, b) => b.length - a.length);

  for (let attempt = 0; attempt < MAX_GRID_ATTEMPTS; attempt++) {
    const grid = Array.from({ length: GRID_SIZE }, () =>
      Array.from({ length: GRID_SIZE }, () => "")
    );
    const placements = [];
    let allPlaced = true;

    for (const word of wordsSorted) {
      const result = placeWord(grid, word, rng);
      if (result === null) {
        allPlaced = false;
        break;
      }
      placements.push({
        word,
        row: result.row,
        col: result.col,
        direction: result.direction,
      });
    }

    if (!allPlaced) continue;

    fillRandomLetters(grid, rng);

    if (containsBannedWord(grid)) continue;

    const order = new Map(normalized.map((w, i) => [w, i]));
    placements.sort((a, b) => order.get(a.word) - order.get(b.word));

    return { grid, placements };
  }

  throw new Error(
    `Could not generate a valid grid after ${MAX_GRID_ATTEMPTS} attempts.`
  );
}
