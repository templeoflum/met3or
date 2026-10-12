"use strict";
// Live signals only. Each round's rows are added on its day, never ahead;
// a round with no rows keeps its button but loads nothing.
// Every published caption is the far-world reading, so decoding always negates.
// audio: a file link for the round, empty until it exists.
const signals = [
  {id: "one", label: "Signal one", audio: "", rows: [
    "0−0 0+− 00+ +−+ 00− 0−0 +−+ 000 +−0",
    "000 .−−0 ++− 0−− −0+ −−0 ++− +0− 0−0",
    "−0+ 00− −−0 −−0 0+− +0+ −++ −++ 00+.",
    "0−+ 000 .++− −−0 00− 0−+ 000 +−0 000",
    "−++ 00+ 0−− 000 +−0 −++ 00− −−−."
  ]},
  {id: "two", label: "Signal two", audio: "", rows: []}
];
const input = document.getElementById("signal"), result = document.getElementById("result");
const list = document.getElementById("signal-list");
signals.forEach(s => {
  const button = document.createElement("button");
  button.type = "button"; button.textContent = "Load " + s.label.toLowerCase();
  if (!s.rows.length) button.className = "waiting";
  button.addEventListener("click", () => {
    result.classList.remove("error");
    if (!s.rows.length) {result.textContent = s.label + " · no signal yet."; return;}
    input.value = s.rows.join("\n"); result.textContent = s.label + " loaded.";
  });
  list.appendChild(button);
  if (s.audio) {
    const a = document.createElement("a");
    a.className = "audio"; a.href = s.audio; a.textContent = s.label + " · audio";
    list.appendChild(a);
  }
});
document.getElementById("decode-form").addEventListener("submit", e => {
  e.preventDefault();
  try {result.textContent = CipherV4.decode(input.value, true); result.classList.remove("error");}
  catch(error) {result.textContent = error.message; result.classList.add("error");}
});
input.addEventListener("input", () => {result.textContent = "";});

// Answer: a round word opens its lock (PBKDF2 → AES-GCM); the lock holds the set link.
const word = document.getElementById("word"), opened = document.getElementById("opened");
const unb64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
async function open(w, lock) {
  const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(w), "PBKDF2", false, ["deriveKey"]);
  const key = await crypto.subtle.deriveKey({name: "PBKDF2", salt: unb64(lock.salt), iterations: 250000, hash: "SHA-256"}, base, {name: "AES-GCM", length: 256}, false, ["decrypt"]);
  return JSON.parse(new TextDecoder().decode(await crypto.subtle.decrypt({name: "AES-GCM", iv: unb64(lock.iv)}, key, unb64(lock.data))));
}
document.getElementById("answer-form").addEventListener("submit", async e => {
  e.preventDefault();
  const w = word.value.toUpperCase().replace(/\s+/g, "");
  opened.textContent = ""; opened.className = "";
  if (!w) return;
  for (const lock of locks) {
    let found;
    try {found = await open(w, lock);} catch {continue;}
    if (found.url) {
      const a = document.createElement("a");
      a.href = found.url; a.rel = "noopener"; a.target = "_blank"; a.textContent = "the set →";
      opened.appendChild(a);
    } else opened.textContent = "set · pending";
    opened.className = "open";
    return;
  }
  opened.textContent = "no."; opened.className = "no";
});
word.addEventListener("input", () => {opened.textContent = ""; opened.className = "";});
