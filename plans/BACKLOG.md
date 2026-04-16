# BACKLOG

## P0 (do next)
- (none)

## P1
- Shrink share URL hashes — revisit encoding to produce shorter URLs (e.g., exploit alpha-only constraint, use a more compact encoding than Base64-of-JSON)
- Deduplicate or warn on duplicate words in input (M1 code review suggestion)
- Win celebration animation when all words found
- Per-word random colors for found highlights (deterministic by word order, no hash storage needed)
- Profanity filter: relax to allow user-entered words even if they match/contain banned words — filter only guards filler letters (M3-P1)

## P2
- Document a soft word-count cap tied to URL-length constraints (share URL length)
- Chunk `String.fromCodePoint(...bytes)` in `encodePayload` to avoid argument-limit risk with very large payloads (aligns with URL-length deferral)