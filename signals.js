"use strict";
// Live signals only. Each round's transmission is added on its day, never ahead;
// a round with no rows renders nothing.
// The panel is d.o.'s off-book file: each live round is footage clipped into the
// folder with its caption typed out as a transcript; the pocket reader on the desk
// decodes plain, the world switch turns the trits over, and the word goes on the
// slip that is slid under the Standards Room door (a DM to BIC).
// reel: the round's phone-size video beside the site, empty if none.
const signals = [
  {id: "one", label: "signal one", reel: "signals-r1.mp4", rows: [
    "0−0 0+− 00+ +−+ 00− 0−0 +−+ 000 +−0",
    "000 .−−0 ++− 0−− −0+ −−0 ++− +0− 0−0",
    "−0+ 00− −−0 −−0 0+− +0+ −++ −++ 00+.",
    "0−+ 000 .++− −−0 00− 0−+ 000 +−0 000",
    "−++ 00+ 0−− 000 +−0 −++ 00− −−−."
  ]},
  {id: "two", label: "signal two", reel: "", rows: []}
];
const KEY = "KEY / ++";
const DM = "https://ig.me/m/boustrophedon.instruments";

const $ = id => document.getElementById(id);
const el = (tag, cls, text) => {const e = document.createElement(tag); if (cls) e.className = cls; if (text) e.textContent = text; return e;};
const root = document.querySelector(".sig");
const live = signals.filter(s => s.rows.length);
const caption = s => [KEY, ...s.rows].join("\n");
const solved = live.map(s => CipherV4.decode(caption(s), true));
const st = {copied: false, loaded: false, out: "none", open: false, filed: false};
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

function stage() {
  root.classList.toggle("s-copied", st.copied);
  root.classList.toggle("s-loaded", st.loaded);
  root.classList.toggle("s-gib", st.out === "gib");
  root.classList.toggle("s-err", st.out === "err");
  root.classList.toggle("s-solved", st.out === "solved" || st.open);
  root.classList.toggle("s-open", st.open);
  root.classList.toggle("s-filed", st.filed);
  let next;
  if (st.filed) next = null;
  else if (st.open) next = "file";
  else if (st.out === "solved") next = "send";
  else if (!st.loaded) next = st.copied ? "paste" : "copy";
  else if (st.out === "gib") next = "flip";
  else next = "decode";
  root.querySelectorAll(".next").forEach(e => e.classList.remove("next"));
  if (next === "copy") root.querySelectorAll(".copy").forEach(e => e.classList.add("next"));
  else if (next) $(next).classList.add("next");
  root.dataset.next = next || "done";
}

async function toClipboard(text, sel) {
  try {await navigator.clipboard.writeText(text); return true;} catch {}
  if (!sel) return false;
  const r = document.createRange(); r.selectNodeContents(sel);
  const s = getSelection(); s.removeAllRanges(); s.addRange(r);
  try {return document.execCommand("copy");} catch {return false;}
}

// ── the file: per round, the footage and its typed transcript ──────────
const rounds = $("rounds");
live.forEach(s => {
  const folder = el("article", "folder");
  folder.append(el("span", "tab", "0006 — not filed"), el("span", "pencil hand", "mine. leave it. — d.o."), el("h2", "", "Footage"));
  if (s.reel) {
    const fig = el("figure", "footage"), v = el("video"), snd = el("button", "snd");
    v.src = s.reel; v.muted = true; v.loop = true; v.autoplay = true; v.playsInline = true;
    v.setAttribute("muted", ""); v.setAttribute("playsinline", ""); v.preload = "auto";
    snd.type = "button"; snd.setAttribute("aria-label", "Sound"); snd.setAttribute("aria-pressed", "false");
    const toggle = e => {
      e.stopPropagation();
      v.muted = !v.muted; v.play().catch(() => {});
      snd.setAttribute("aria-pressed", String(!v.muted)); snd.dataset.on = String(!v.muted);
    };
    v.addEventListener("click", toggle); snd.addEventListener("click", toggle);
    const lab = el("figcaption", "lab");
    lab.append(el("span", "", "public post"), el("span", "", s.label));
    fig.append(el("span", "clip"), v, snd, lab, el("span", "pencil", "this is it."));
    folder.appendChild(fig);
    v.play().catch(() => {});
  }
  const sheet = el("div", "sheet"), th = el("div", "th"), pre = el("pre", "caption", caption(s));
  th.append(el("span", "", "TRANSCRIPT — caption as posted"), el("span", "", "p. 1"));
  const ring = el("span", "ring"); ring.setAttribute("aria-hidden", "true");
  const row = el("div", "copyrow"), copy = el("button", "copy");
  copy.type = "button";
  copy.addEventListener("click", async () => {
    const ok = await toClipboard(pre.textContent.trim(), pre);
    st.copied = true; stage();
    copy.dataset.state = ok ? "copied" : "hold";
  });
  row.append(copy, el("span", "pencil", "then the reader ↓"));
  const m1 = el("span", "marg m1"); m1.append("the key.", el("br"), "take it too.");
  sheet.append(th, ring, pre, el("span", "pencil m2", "every other row runs backwards. the reader knows."), m1, row);
  folder.appendChild(sheet);
  rounds.appendChild(folder);
});

// ── the reader: paste lands in its memory ──────────────────────────────
const tape = $("tape"), out = $("out");
let printing = 0;
const setOut = t => {printing++; out.textContent = t;};
function loaded() {st.loaded = !!tape.value.trim(); st.out = "none"; setOut(""); stage();}
tape.addEventListener("input", loaded);
const paste = $("paste");
paste.addEventListener("click", async () => {
  let text = "";
  try {text = await navigator.clipboard.readText();} catch {}
  if (text) {tape.value = text.trim(); paste.dataset.state = ""; loaded();}
  else {tape.focus(); paste.dataset.state = "hold";}
});

// ── read: always the plain reading of what is in memory ────────────────
function print(text) {
  const id = ++printing, cps = 45;
  out.textContent = "";
  if (reduce) {out.textContent = text; return;}
  const t0 = performance.now();
  (function step(now) {
    if (id !== printing) return;
    const upto = Math.min(text.length, Math.floor((now - t0) / 1000 * cps) + 1);
    out.textContent = text.slice(0, upto);
    if (upto < text.length) requestAnimationFrame(step);
  })(t0);
}
$("decode").addEventListener("click", () => {
  if (!tape.value.trim()) {tape.focus(); return;}
  let text;
  try {text = CipherV4.decode(tape.value, false);}
  catch (e) {st.out = "err"; stage(); setOut(e.message); return;}
  st.out = solved.includes(text) ? "solved" : "gib"; stage();
  print(text);
});

// ── the world switch: each trit turns over in place, + ↔ −; the key stays ─
const PLUS = "+†‡⊕﬩", MINUS = "−-–⊖˗";
const turn = c => PLUS.includes(c) ? "−" : MINUS.includes(c) ? "+" : c;
const flip = $("flip"), ia = root.querySelector(".i-a"), ib = root.querySelector(".i-b");
const world = () => {const b = root.classList.contains("world-b"); ia.classList.toggle("on", !b); ib.classList.toggle("on", b); flip.setAttribute("aria-pressed", String(b));};
let turning = false;
flip.addEventListener("click", () => {
  if (turning) return;
  const chars = Array.from(tape.value);
  const key = /^\s*KEY\s*\//i.test(tape.value) ? chars.indexOf("\n") : -1;
  const at = chars.map((c, i) => i > key && turn(c) !== c ? i : -1).filter(i => i >= 0);
  root.classList.toggle("world-b"); world();
  st.out = "none"; setOut(""); stage();
  if (!at.length) return;
  if (reduce) {at.forEach(i => chars[i] = turn(chars[i])); tape.value = chars.join(""); return;}
  turning = true; root.classList.add("turning");
  const t0 = performance.now(), span = 1000;
  let done = 0;
  (function step(now) {
    const upto = Math.min(at.length, Math.ceil((now - t0) / span * at.length));
    for (; done < upto; done++) chars[at[done]] = turn(chars[at[done]]);
    tape.value = chars.join("");
    if (done < at.length) requestAnimationFrame(step);
    else {turning = false; root.classList.remove("turning");}
  })(t0);
});
world();

// ── the slip: a round word opens its lock (PBKDF2 → AES-GCM) ───────────
const unb64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
async function open(w, lock) {
  const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(w), "PBKDF2", false, ["deriveKey"]);
  const key = await crypto.subtle.deriveKey({name: "PBKDF2", salt: unb64(lock.salt), iterations: 250000, hash: "SHA-256"}, base, {name: "AES-GCM", length: 256}, false, ["decrypt"]);
  return JSON.parse(new TextDecoder().decode(await crypto.subtle.decrypt({name: "AES-GCM", iv: unb64(lock.iv)}, key, unb64(lock.data))));
}
const form = $("word-form"), word = $("word"), said = $("said");
form.addEventListener("submit", async e => {
  e.preventDefault();
  const w = word.value.toUpperCase().replace(/\s+/g, "");
  said.textContent = ""; said.className = "";
  if (!w) {word.focus(); return;}
  root.classList.add("checking");
  for (const lock of locks) {
    let found;
    try {found = await open(w, lock);} catch {continue;}
    root.classList.remove("checking");
    st.open = true;
    root.querySelectorAll(".note-word").forEach(e => e.textContent = w);
    const set = $("setlink");
    if (found.url) {set.href = found.url; set.textContent = "and the set →";}
    else {set.removeAttribute("href"); set.textContent = "the set · pending";}
    stage();
    return;
  }
  root.classList.remove("checking");
  said.textContent = "no."; said.className = "no";
});
word.addEventListener("input", () => {said.textContent = ""; said.className = "";});

// ── under the door: the note is copied, the DM to the company opens ────
const file = $("file"), note = $("note");
file.href = DM; file.target = "_blank"; file.rel = "noopener";
file.addEventListener("click", () => {
  toClipboard(note.textContent.replace(/\s+/g, " ").trim(), note);
  st.filed = true; stage();
});

stage();
