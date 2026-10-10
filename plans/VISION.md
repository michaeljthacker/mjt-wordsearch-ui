# VISION

## B3 Concept Brief: Autofill Words

SIZE: Preferably tiny tiny: Step only. If that's unreasonable, phase-only is fine. I do NOT think we need a whole milestone.

I want to make a SUPER SIMPLE way to make a quick, automated worsearch. Autofill.

This should not overwrite any existing content. It should do the following:
- If the title is empty, fill it with the topic name
- Add words from the topic name to the word list (not conditional)
- Do not delete existing words; just add to the bottom of the list
- If any words added are duplicates, delete the duplicate word (keep the original)

To do this, we need a handful of topics (I don't necessarily want the ones I drew in the example, but perhaps). Then there needs to be a word list for that topic. The index should be much larger than the number of words added by clicking the button, and the added words should be selected at random. Rather than loading those word lists each time, I propose static word list files for each topic. When the button is clicked, it pings that word list (e.g., `flowers.txt`) and adds a random number of those words to the list.

We should capture this with `mjt-analytics` implementation as an event, `autofill`, with state `topic: <topic>` or whatever.

Nothing else should meaningfully change. The word search generates based on the values in the form fields, whether they are autofill or not. Same with a share link. Etc. etc.