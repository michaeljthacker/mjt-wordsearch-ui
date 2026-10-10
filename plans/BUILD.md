---
size: step-only
---
# BUILD — B3

Add topic Autofill chips to the create form: clicking a topic fetches its static word list, appends a random subset of words to the bottom of the Words field (existing words kept, duplicates dropped, 20-word cap respected), fills an empty Title with the topic name, and fires `track("autofill", { topic })`.
