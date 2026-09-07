"use strict";
const signals = {"a": ["−+− +0− +−− 000 −+− −++ 00+ 0+0 +−− 000", "0+− −+− 0+− 00+ 0+− ++− −−+ 0−0"], "b": ["0++ −0+ −++ 00+ −+− +00 0−+ 00− 000", "++0 −−+ ++0 ++− +−0 0+0 −−+ ++− 000 −+− +−0 −00"]};
const alphabet = ["000","00+","0+−","0+0","0++","+−−","+−0","+−+","+0−","+00","+0+","++−","++0","+++"];
const negate = text => Array.from(text, c => c === "+" ? "−" : c === "−" ? "+" : c).join("");
const letters = new Map([["000", " "]]);
alphabet.slice(1).forEach((t,i) => {letters.set(t,String.fromCharCode(65+i)); letters.set(negate(t),String.fromCharCode(78+i));});
const costumes = new Map();
[ ["+†‡⊕﬩","+"], ["0OØ⊙∅","0"], ["−-–⊖˗","−"] ].forEach(([pool,value]) => Array.from(pool).forEach(c => costumes.set(c,value)));
function decode(text, mirror = false) {
  const rows = text.replace(/\r/g, "").trim().split("\n");
  if(!text.trim()) throw new Error("No input. Enter signs or select a stored signal.");
  return rows.map((row,i) => {
    let normalized = "";
    for(const c of row.normalize("NFD")) {
      if(/\s|\p{M}/u.test(c)) continue;
      if(!costumes.has(c)) throw new Error("Row " + (i+1) + ": invalid sign “" + c + "”. Refer to the equivalent-sign table.");
      normalized += costumes.get(c);
    }
    if(!normalized.length || normalized.length % 3) throw new Error("Row " + (i+1) + ": incomplete triple. Each row requires a multiple of three signs.");
    if(i % 2) normalized = Array.from(normalized).reverse().join("");
    if(mirror) normalized = negate(normalized);
    return normalized.match(/.{3}/g).map(t => letters.get(t)).join("");
  }).join("");
}
const input = document.getElementById("signal"), result = document.getElementById("result");
["a","b"].forEach(key => document.getElementById("load-"+key).addEventListener("click", () => {
  input.value = signals[key].join("\n"); result.textContent = "Signal " + key.toUpperCase() + " loaded.";
  result.classList.remove("error"); input.focus();
}));
document.getElementById("decode-form").addEventListener("submit", e => {
  e.preventDefault();
  try {result.textContent = decode(input.value, document.getElementById("mirror").checked); result.classList.remove("error");}
  catch(error) {result.textContent = error.message; result.classList.add("error");}
});
input.addEventListener("input", () => {result.textContent = "";});
document.getElementById("mirror").addEventListener("change", () => {result.textContent = "";});
document.getElementById("answers").addEventListener("toggle", e => {
  const content = document.getElementById("answer-content");
  content.replaceChildren();
  if(!e.target.open) return;
  ["a","b"].forEach(key => {
    const p = document.createElement("p"); p.className = "answer";
    p.textContent = "Signal " + key.toUpperCase() + "\n" + decode(signals[key].join("\n")) + "\nConjugate: " + decode(signals[key].join("\n"), true);
    content.appendChild(p);
  });
});
