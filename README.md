# MET∃OR — the routing page

## → **https://templeoflum.github.io/met3or/**

The public page people land on. Not a Linktree: the hero is the live engine
itself — the sweep is playable — and the links sit under it.

This is a **separate repo from the workbench** on purpose — the workbench is
private, and this repo is public because GitHub Pages needs it to be. Nothing
lands in here that you don't want indexed.

```
index.html        the page — layout, the links renderer, the frame sizing
engine.html       byte-identical copy of the workbench engine — NEVER hand-edit
links.js          ← the only file you edit day to day
sync-engine.sh    re-copies engine.html from the workbench and md5-verifies
.nojekyll         tells Pages to serve the files as-is
```

## Adding a link

Open `links.js`, paste the URL between the quotes:

```js
{ label: "Spotify", handle: "ro3tem.met3or", sign: "0", url: "https://open.spotify.com/artist/…" },
```

**A row with an empty `url` does not render.** So the full list sits there from
day one and fills in as accounts come up. When every row is empty the page shows
the `HOLDING` line instead of an empty grid.

`sign` tints the row from the canon palette — `+` amber (590nm), `−` blue
(470nm), `0` green (530nm). Decorative; pick whatever balances.

Then push:

```
git add -A && git commit -m "links: spotify" && git push
```

Pages redeploys in under a minute. Check it took:

```
gh api repos/templeoflum/met3or/pages/builds/latest --jq .status   # → "built"
```

## Where it lives

| | |
|---|---|
| repo | [templeoflum/met3or](https://github.com/templeoflum/met3or) · public |
| live | https://templeoflum.github.io/met3or/ |
| source | branch `main`, folder `/` (root) |
| workbench | `templeoflum/met3or-workbench` · **private** · local at `../met3or` |

Every path in `index.html` is relative, so the page works at `/met3or/`, at a
bare domain, or opened straight off disk — no base-path edit if it moves.

## Previewing locally

```
python3 -m http.server 8000
# → http://localhost:8000/
```

Double-clicking `index.html` mostly works, but some browsers block the page from
measuring the engine frame over `file://`, so the engine gets a fixed height
instead of a fitted one. Serve it to see the real thing.

## The engine copy

`engine.html` is a duplicate, kept identical so the workbench stays the single
author of the mark. To pull a newer engine:

```
./sync-engine.sh          # copies ../met3or/met3or_engine.html, md5-verifies
```

Then commit and push as usual. Pass a path if the workbench lives elsewhere.

## Custom domain, later

Add a file named `CNAME` containing just the domain (`met3or.com`), push, then
set DNS at your registrar:

| type | name | value |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | `templeoflum.github.io` |

Then Settings → Pages → Custom domain, and tick **Enforce HTTPS** once the
certificate provisions. The URL drops the `/met3or/` path at that point.

## Social preview

`index.html` points `og:image` at `og.png`. Drop a 1200×630 PNG there and links
to the site unfurl with artwork — `out/` in the workbench already renders at
comparable sizes.
