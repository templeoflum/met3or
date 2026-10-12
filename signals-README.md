# Signals page

`signals.html` · live at https://templeoflum.github.io/met3or/signals.html

```
signals.html        the page
signals.js          the rounds (rows per signal) and the decoder wiring
signals-locks.js    the sealed set link, one lock per round word — generated, never hand-edit
signals-set-link.mjs  seals the link under a word (Node 18+)
signals.css         the look
```

Decoding always negates: every published caption is the far-world reading.

## Adding round 2 or 3 — on its day, not before

1. In `signals.js`, paste the caption rows into that round's entry, one string
   per row, exactly as the caption shows them. Round 2's entry is already there
   with `rows: []` (its button shows, loads nothing). For round 3 add a line
   `{id: "three", label: "Signal three", audio: "", rows: [ … ]}`; set `audio`
   if the round has a file.
2. Seal the set link under that round's word:

   ```
   node signals-set-link.mjs WORD "https://the-set-link"
   ```

   Case and spaces in the word don't matter. Without the real link yet, use
   `""` for a placeholder (a solver sees `set · pending`).
3. Check locally (`python3 -m http.server 8000`, open `/signals.html`): load,
   decode, type the word.
4. Push only the named files — never `git add -A` here:

   ```
   git add signals.js signals-locks.js && git commit -m "signals: round 2" && git push
   ```

## Setting the real set link

Once per round word already published:

```
node signals-set-link.mjs WORD "https://the-set-link"
```

It replaces the lock that word opens (the script says `replaced lock N`); a
word no lock opens adds a new lock (`sealed`). Then commit `signals-locks.js`
and push as above.

## What stays out of the repo

No round word and no link is written here in plain text. Never commit a file
that holds one (the local `signals-proof.md` does: it stays untracked).
Before pushing: `git grep -i -n WORD` should print nothing.
