"use strict";
const signals = {"a": ["−+− +0− +−− 000 −+− −++ 00+ 0+0 +−−", "0−0 +−− −++ −+0 +00 −+0 −+− −+0"], "b": ["0++ −0+ −++ 00+ −+− +00 0−+ 00−", "−++ +−− 0+0 0−+ −++ 0++ +−− 0++ 000 00− 0−+ −+−"]};
const alphabet = ["000","00+","0+−","0+0","0++","+−−","+−0","+−+","+0−","+00","+0+","++−","++0","+++"];
const negate = text => Array.from(text, c => c === "+" ? "−" : c === "−" ? "+" : c).join("");
const letters = new Map([["000", " "]]);
alphabet.slice(1).forEach((t,i) => {letters.set(t,String.fromCharCode(65+i)); letters.set(negate(t),String.fromCharCode(78+i));});
const costumes = new Map();
[ ["+†‡⊕﬩","+"], ["0OØ⊙∅","0"], ["−-–⊖˗","−"] ].forEach(([pool,value]) => Array.from(pool).forEach(c => costumes.set(c,value)));
const decode = CipherV2.decode;
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
