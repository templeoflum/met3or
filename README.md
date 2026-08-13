# MET∃OR — the routing page

The public page people land on. Not a Linktree: the hero is the live engine
itself — the sweep is playable — and the links sit under it.

This is a **separate repo from the workbench** on purpose. The workbench
(`../met3or`) carries the cipher, the lore, and the ARG payload; this repo is
public because GitHub Pages needs it to be. Nothing in here should reveal
anything you don't want indexed.

```
index.html        the page — layout, the links renderer, the frame sizing
engine.html       byte-identical copy of the workbench engine — NEVER hand-edit
links.js          ← the only file you edit day to day
sync-engine.sh    re-copies engine.html from the workbench and md5-verifies
.nojekyll         tells Pages to serve the files as-is
```

## Adding a link

Open `links.js`, paste the URL between the quotes, save, push:

```js
{ label: "Spotify", handle: "ro3tem.met3or", sign: "0", url: "https://open.spotify.com/artist/…" },
```

**A row with an empty `url` does not render.** So the full list can sit there
from day one and fill in as accounts come up. When every row is empty the page
shows the `HOLDING` line instead of an empty grid.

`sign` tints the row from the canon palette — `+` amber (590nm), `−` blue
(470nm), `0` green (530nm). Purely decorative; pick whatever balances.

Then:

```
git add -A && git commit -m "links: spotify" && git push
```

Pages redeploys in about a minute.

## Publishing it

`gh` is not installed on this machine (`brew install gh` if you want it).
Without it:

1. Make a new **public**, empty repo on github.com named `met3or` — no README,
   no .gitignore, nothing. A repo named `met3or` gives you
   `https://<username>.github.io/met3or/` and leaves your one user-site
   (`<username>.github.io`) free for later.
2. Wire it up and push:

```
git remote add origin https://github.com/<username>/met3or.git
git push -u origin main
```

3. Repo → **Settings → Pages** → Source: **Deploy from a branch**, branch
   `main`, folder `/ (root)`. Save.

Every path in `index.html` is relative, so the page works at
`/met3or/`, at a bare domain, or opened straight off disk — no base-path edit
needed if you move it.

## Custom domain, later

Add a file named `CNAME` containing just the domain (`met3or.com`), push, then
set the DNS at your registrar:

| type | name | value |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | `<username>.github.io` |

Then Settings → Pages → Custom domain, and tick **Enforce HTTPS** once the
certificate provisions.

## Previewing locally

```
python3 -m http.server 8000
# → http://localhost:8000/
```

Double-clicking `index.html` mostly works too, but some browsers block the page
from measuring the engine frame over `file://`, so the engine gets a fixed
height instead of a fitted one. Serve it to see the real thing.

## The engine copy

`engine.html` is a duplicate, kept identical so the workbench stays the single
author of the mark. To pull a newer engine:

```
./sync-engine.sh
```

It copies `../met3or/met3or_engine.html` over `engine.html` and md5-verifies.
Pass a path if the workbench lives elsewhere.

## Social preview

`index.html` points `og:image` at `og.png`. Drop a 1200×630 PNG there and links
to the site will unfurl with artwork — `out/` in the workbench already renders
at comparable sizes.
