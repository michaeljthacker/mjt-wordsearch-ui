"""Word search grid generator for children's liturgy content packets.

Produces a 15×15 letter grid containing all words from a word list,
with directional placement and profanity filtering on filler letters.
Deterministic given the same word list and seed.
"""

import random

GRID_SIZE = 15

# Weighted directions: right and down more likely, diagonals less likely.
_DIRECTIONS: list[tuple[int, int]] = [
    (0, 1), (0, 1), (0, 1),    # right  (3×)
    (1, 0), (1, 0), (1, 0),    # down   (3×)
    (1, 1), (1, 1),             # down-right (2×)
    (1, -1),                    # down-left  (1×)
    (0, -1), (0, -1),           # left   (2×)
    (-1, 0), (-1, 0),           # up     (2×)
    (-1, -1),                   # up-left    (1×)
    (-1, 1),                    # up-right   (1×)
]

_BANNED_WORDS: list[str] = [
    "FUCK", "SHIT", "BITCH", "ASSHOLE", "DICK", "COCK", "PUSSY", "CUNT",
    "NIGGER", "FAGGOT", "BASTARD", "SLUT", "WHORE", "CRAP", "JIZZ", "HOE",
    "PISS", "TITS", "JERK", "WANKER", "DOUCHE", "ASS", "FART", "BLOWJOB",
    "ANUS", "PRICK", "POO", "BUTT", "SCROTUM", "DILDO", "BOOBS", "WEINER",
    "FREAK", "RETARD", "LOSER", "SUCK", "TURD", "DARN", "PEE", "DONG",
    "DAMN", "HELL", "CLIT", "NUT", "RAPE", "SEXY", "PORN", "DRUG",
]

_MAX_GRID_ATTEMPTS = 100
_MAX_PLACE_ATTEMPTS = 200


def _extract_lines(grid: list[list[str]]) -> list[str]:
    """Extract all rows, columns, and diagonals from the grid as strings."""
    size = len(grid)
    lines: list[str] = []

    # Rows
    for row in grid:
        lines.append("".join(row))

    # Columns
    for col in range(size):
        lines.append("".join(grid[row][col] for row in range(size)))

    # Diagonals (top-left to bottom-right)
    for start in range(-(size - 1), size):
        diag = []
        for i in range(size):
            r, c = i, i - start
            if 0 <= r < size and 0 <= c < size:
                diag.append(grid[r][c])
        if diag:
            lines.append("".join(diag))

    # Diagonals (top-right to bottom-left)
    for start in range(0, 2 * size - 1):
        diag = []
        for i in range(size):
            r, c = i, start - i
            if 0 <= r < size and 0 <= c < size:
                diag.append(grid[r][c])
        if diag:
            lines.append("".join(diag))

    return lines


def _contains_banned_word(grid: list[list[str]]) -> bool:
    """Check if the grid contains any banned word in any direction."""
    for line in _extract_lines(grid):
        forward = line
        backward = line[::-1]
        for banned in _BANNED_WORDS:
            if banned in forward or banned in backward:
                return True
    return False


def _place_word(
    grid: list[list[str]],
    word: str,
    rng: random.Random,
) -> tuple[int, int, tuple[int, int]] | None:
    """Try to place a word in the grid. Returns (row, col, direction) or None."""
    size = len(grid)
    for _ in range(_MAX_PLACE_ATTEMPTS):
        dr, dc = rng.choice(_DIRECTIONS)
        row = rng.randint(0, size - 1)
        col = rng.randint(0, size - 1)

        end_row = row + dr * (len(word) - 1)
        end_col = col + dc * (len(word) - 1)

        if not (0 <= end_row < size and 0 <= end_col < size):
            continue

        fits = True
        for i in range(len(word)):
            r = row + dr * i
            c = col + dc * i
            cell = grid[r][c]
            if cell != "" and cell != word[i]:
                fits = False
                break

        if fits:
            for i in range(len(word)):
                r = row + dr * i
                c = col + dc * i
                grid[r][c] = word[i]
            return row, col, (dr, dc)

    return None


def _fill_random_letters(grid: list[list[str]], rng: random.Random) -> None:
    """Fill empty cells with random uppercase letters."""
    alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    for row in range(len(grid)):
        for col in range(len(grid[row])):
            if grid[row][col] == "":
                grid[row][col] = rng.choice(alphabet)


def generate_word_search(
    word_list: list[str],
    seed: int,
) -> dict:
    """Generate a word search grid from a word list.

    Args:
        word_list: List of words to place in the grid (9-12 words, max 15 chars each).
        seed: Integer seed for deterministic generation.

    Returns:
        Dict with ``grid`` (15×15 list of single-character strings) and
        ``placements`` (list of dicts with word, row, col, direction).

    Raises:
        ValueError: If word_list is empty, a word exceeds 15 characters,
            a word is in the banned-word list, or words could not be placed.
    """
    if not word_list:
        raise ValueError("word_list must not be empty")

    normalized = [w.upper().strip() for w in word_list]

    for word in normalized:
        if len(word) > GRID_SIZE:
            raise ValueError(f"Word '{word}' exceeds maximum length of {GRID_SIZE}")
        if not word.isalpha():
            raise ValueError(f"Word '{word}' contains non-alphabetic characters")

    for word in normalized:
        for banned in _BANNED_WORDS:
            if banned == word:
                raise ValueError(f"Word '{word}' is in the banned-words list")

    rng = random.Random(seed)

    # Sort words longest-first for better placement success
    words_sorted = sorted(normalized, key=len, reverse=True)

    for _ in range(_MAX_GRID_ATTEMPTS):
        grid = [["" for _ in range(GRID_SIZE)] for _ in range(GRID_SIZE)]
        placements: list[dict] = []
        all_placed = True

        for word in words_sorted:
            result = _place_word(grid, word, rng)
            if result is None:
                all_placed = False
                break
            row, col, direction = result
            placements.append({
                "word": word,
                "row": row,
                "col": col,
                "direction": list(direction),
            })

        if not all_placed:
            continue

        _fill_random_letters(grid, rng)

        if _contains_banned_word(grid):
            continue

        # Sort placements by original word_list order
        order = {w: i for i, w in enumerate(normalized)}
        placements.sort(key=lambda p: order[p["word"]])

        return {"grid": grid, "placements": placements}

    raise ValueError(
        f"Could not generate a valid grid after {_MAX_GRID_ATTEMPTS} attempts"
    )
