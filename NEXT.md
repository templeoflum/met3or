# Where this was left — 2026-09-01

Both repos clean and pushed. Nothing is stranded on the laptop.

| | |
|---|---|
| live | https://templeoflum.github.io/met3or/ |
| studies | https://templeoflum.github.io/met3or/studies/ |
| this repo | `templeoflum/met3or` · public |
| workbench | `templeoflum/met3or-workbench` · private · `../met3or` |

## 2026-09-01

- Spinor in the frame's box while the engine loads (mobile was dark for a while).
- Sound arms on release events (`pointerup`/`touchend`/`keydown`) and only once
  the engine takes it — a tap during load no longer spends it. iPhone silent
  switch mutes Web Audio; left alone on purpose.
- Engine resynced (pupils only at the seam; `col` — the wow — joins `__WST`).
- Stillness: leave the seam, return with sound on, stay for the wow → `thank`
  (youtu.be/vnaiD0YSrGc) appears under the icons. Once per visit, not persisted.

## The state

The routing page is the engine, playable, opening at the seam (m 0.5, θ 0), with
a sound toggle centred above the mark and six socials as icon-only links. It does
its job and it's finished unless we replace it — see the open decision below.

Five studies, one mechanism each, no chrome on any of them:

| | | |
|---|---|---|
| S-01 | dwell | legibility as a function of stillness; hold 2.5 s for the bloom |
| S-02 | carriage | balanced ternary, revealing the **negated** reading — the word from the far world |
| S-03 | boustrophedon | the furrow turns, the letterforms don't; a read-head walks the true order |
| S-04 | phosphor | conventional easing vs the engine's decay (half-life .12 s) + f₀ breath |
| S-05 | sweep | the real engine driven along a datum whose ticks are the social icons |

## Open decisions

1. **S-05 should probably become the front page.** It routes people *and* the mark
   does the work. Replacing `index.html` with it is the proposed next move.
2. **S-04's physics adopted globally** — phosphor easing and the f₀ breath as the
   house style, applied everywhere rather than demoed in one page.
3. **S-03 granularity** — currently 6 words per furrow; may want tuning.

S-06 (register) and S-07 (anomaly) were cut: framing rather than mechanism.

## Things that will bite

- **The workbench pipeline needs `.venv/bin/python3`** — system `python3` has no PIL.
- **After any engine change, run `./sync-engine.sh`** here. It copies the engine
  from the workbench, md5-verifies, and stamps the content hash into the iframe
  `src`. Skip it and Pages' 10-minute cache hides the change — it looks exactly
  like a failed deploy.
- Check a deploy landed: `gh api repos/templeoflum/met3or/pages/builds/latest --jq .status`
- **No explanatory chrome on a surface.** No headers, footers or status narration.
  Navigation is glyphs, not words.
