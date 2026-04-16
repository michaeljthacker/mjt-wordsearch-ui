/**
 * app.js — Application entry point.
 * Wires up the form, orchestrates generate → render flow,
 * and handles share-link encoding/decoding via hash routing.
 */

import { generate } from "./generator.js";
import {
  parseWords,
  showError,
  clearError,
  renderPuzzle,
  clearPuzzle,
  renderShareButton,
} from "./ui.js";
import { initSolve } from "./solve.js";

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

/* --- Share-link encoding / decoding (URL-safe Base64 of JSON) --- */

function encodePayload(title, words) {
  const json = JSON.stringify({ t: title || "", w: words });
  const bytes = new TextEncoder().encode(json);
  const binary = String.fromCodePoint(...bytes);
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function decodePayload(encoded) {
  const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}

function buildShareUrl(title, words) {
  const encoded = encodePayload(title, words);
  return `${location.origin}${location.pathname}#/v1/${encoded}`;
}

/* --- Core generate + render --- */

function generateAndRender(words, title) {
  clearError();
  clearPuzzle();

  if (words.length === 0) {
    showError("Please enter at least one word.");
    return;
  }

  try {
    const seed = hashWords(words);
    const result = generate(words, seed);
    renderPuzzle(result.grid, result.placements, title);
    renderShareButton(buildShareUrl(title, words));

    const table = document.querySelector(".puzzle-grid");
    if (table) {
      initSolve(table, result.placements);
    }
  } catch (err) {
    showError(err.message);
  }
}

/* --- Form handler --- */

const form = document.getElementById("puzzle-form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("puzzle-title").value.trim();
  const raw = document.getElementById("word-input").value;
  const words = parseWords(raw);

  generateAndRender(words, title);
});

/* --- Hash-route handler --- */

function handleHash() {
  const hash = location.hash;
  if (!hash.startsWith("#/v1/")) return;

  const encoded = hash.slice("#/v1/".length);
  if (!encoded) {
    showError("Share link is empty — no puzzle data found.");
    return;
  }

  try {
    const payload = decodePayload(encoded);
    if (!payload || !Array.isArray(payload.w) || payload.w.length === 0) {
      showError("Invalid share link — puzzle data is missing or corrupt.");
      return;
    }
    const title = typeof payload.t === "string" ? payload.t : "";
    const words = payload.w
      .map((w) => String(w).trim().toUpperCase())
      .filter((w) => w.length > 0);
    if (words.length === 0) {
      showError("Invalid share link — no words found in puzzle data.");
      return;
    }

    // Pre-fill form so the user can see/edit the words
    document.getElementById("puzzle-title").value = title;
    document.getElementById("word-input").value = words.join("\n");

    generateAndRender(words, title);
  } catch {
    showError("Could not decode share link — the URL may be damaged or incomplete.");
  }
}

handleHash();
