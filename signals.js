"use strict";
// Live signals only. Each round's transmission is added on its day, never ahead;
// a round with no rows renders nothing.
// Every published row set is the far-world reading. The terminal decodes plain;
// the flip turns the trits over in the box, and the second Decode resolves.
// reel: the round's phone-size video beside the site, empty if none.
const signals = [
  {id: "one", reel: "signals-r1.mp4", rows: [
    "0−0 0+− 00+ +−+ 00− 0−0 +−+ 000 +−0",
    "000 .−−0 ++− 0−− −0+ −−0 ++− +0− 0−0",
    "−0+ 00− −−0 −−0 0+− +0+ −++ −++ 00+.",
    "0−+ 000 .++− −−0 00− 0−+ 000 +−0 000",
    "−++ 00+ 0−− 000 +−0 −++ 00− −−−."
  ]},
  {id: "two", reel: "", rows: []}
];
// The report goes to BIC. Drafts: "file a sighting." · "heard it? file a report
// with the company." · "serial 0006 sighted. report the place and the hour."
const REPORT = {line: "file a sighting.", href: "https://ig.me/m/boustrophedon.instruments"};

const el = (tag, cls, text) => {const e = document.createElement(tag); if (cls) e.className = cls; if (text) e.textContent = text; return e;};

// ── the transmission: reel, then the received rows ─────────────────────
const rounds = document.getElementById("rounds");
signals.filter(s => s.rows.length).forEach(s => {
  const tx = el("figure", "tx");
  if (s.reel) {
    const reel = el("div", "reel"), v = el("video"), snd = el("button", "snd", "♪ off");
    v.src = s.reel; v.muted = true; v.loop = true; v.autoplay = true; v.playsInline = true;
    v.setAttribute("muted", ""); v.setAttribute("playsinline", ""); v.preload = "auto";
    snd.type = "button"; snd.setAttribute("aria-label", "Sound"); snd.setAttribute("aria-pressed", "false");
    const toggle = () => {
      v.muted = !v.muted; v.play().catch(() => {});
      snd.textContent = v.muted ? "♪ off" : "♪ on"; snd.setAttribute("aria-pressed", String(!v.muted));
      reel.classList.toggle("on", !v.muted);
    };
    reel.addEventListener("click", toggle);
    reel.append(v, snd); tx.appendChild(reel);
    v.play().catch(() => {});
  }
  const rx = el("div", "received"), head = el("div", "rx-head"), copy = el("button", "copy", "copy");
  const pre = el("pre", "rows", s.rows.join("\n"));
  copy.type = "button";
  copy.addEventListener("click", async () => {
    const text = s.rows.join("\n");
    let ok = false;
    try {await navigator.clipboard.writeText(text); ok = true;} catch {}
    if (!ok) {
      const r = document.createRange(); r.selectNodeContents(pre);
      const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r);
      try {ok = document.execCommand("copy");} catch {}
    }
    copy.textContent = ok ? "copied" : "hold";
    setTimeout(() => {copy.textContent = "copy";}, 1600);
  });
  head.append(el("span", "", "received"), copy);
  rx.append(head, pre); tx.appendChild(rx);
  rounds.appendChild(tx);
});

// ── the terminal: plain Decode, then the flip ──────────────────────────
const input = document.getElementById("signal"), result = document.getElementById("result");
const flip = document.getElementById("flip"), answer = document.getElementById("answer-form");
const solved = signals.filter(s => s.rows.length).map(s => CipherV4.decode(s.rows.join("\n"), true));
document.getElementById("decode-form").addEventListener("submit", e => {
  e.preventDefault();
  let text;
  try {text = CipherV4.decode(input.value, false); result.classList.remove("error");}
  catch (error) {result.textContent = error.message; result.classList.add("error"); return;}
  result.textContent = text;
  flip.classList.add("shown");
  if (solved.includes(text)) answer.classList.add("shown");
});
input.addEventListener("input", () => {result.textContent = ""; result.classList.remove("error");});

// Each trit turns over in place, left to right through the box: + ↔ −.
const PLUS = "+†‡⊕﬩", MINUS = "−-–⊖˗";
const turn = c => PLUS.includes(c) ? "−" : MINUS.includes(c) ? "+" : c;
let turning = false;
flip.addEventListener("click", () => {
  if (turning) return;
  const chars = Array.from(input.value);
  const at = chars.map((c, i) => turn(c) !== c ? i : -1).filter(i => i >= 0);
  result.textContent = ""; result.classList.remove("error");
  if (!at.length) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {input.value = chars.map(turn).join(""); return;}
  turning = true; input.classList.add("turning");
  const t0 = performance.now(), span = 900;
  let done = 0;
  (function step(now) {
    const upto = Math.min(at.length, Math.ceil((now - t0) / span * at.length));
    for (; done < upto; done++) chars[at[done]] = turn(chars[at[done]]);
    input.value = chars.join("");
    if (done < at.length) requestAnimationFrame(step);
    else {turning = false; input.classList.remove("turning");}
  })(t0);
});

// ── the word: a round word opens its lock (PBKDF2 → AES-GCM) ───────────
const word = document.getElementById("word"), opened = document.getElementById("opened");
const unb64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
async function open(w, lock) {
  const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(w), "PBKDF2", false, ["deriveKey"]);
  const key = await crypto.subtle.deriveKey({name: "PBKDF2", salt: unb64(lock.salt), iterations: 250000, hash: "SHA-256"}, base, {name: "AES-GCM", length: 256}, false, ["decrypt"]);
  return JSON.parse(new TextDecoder().decode(await crypto.subtle.decrypt({name: "AES-GCM", iv: unb64(lock.iv)}, key, unb64(lock.data))));
}
answer.addEventListener("submit", async e => {
  e.preventDefault();
  const w = word.value.toUpperCase().replace(/\s+/g, "");
  opened.textContent = ""; opened.className = "";
  if (!w) return;
  for (const lock of locks) {
    let found;
    try {found = await open(w, lock);} catch {continue;}
    if (found.url) {
      const a = el("a", "set", "the set →");
      a.href = found.url; a.rel = "noopener"; a.target = "_blank";
      opened.appendChild(a);
    } else opened.appendChild(el("span", "set", "set · pending"));
    const report = el("a", "report", "report →");
    report.href = REPORT.href; report.rel = "noopener"; report.target = "_blank";
    opened.append(el("span", "line", REPORT.line), report);
    opened.className = "open";
    return;
  }
  opened.textContent = "no."; opened.className = "no";
});
word.addEventListener("input", () => {opened.textContent = ""; opened.className = "";});
