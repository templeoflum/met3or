// Seals the set link under a round word: node signals-set-link.mjs WORD URL
// An existing lock that WORD opens is replaced; otherwise a new lock is added.
// An empty URL ("") seals the placeholder.
import {readFileSync, writeFileSync} from "node:fs";
import {webcrypto as crypto} from "node:crypto";
const [word, url] = process.argv.slice(2);
if (!word || url === undefined) {console.error('usage: node signals-set-link.mjs WORD URL   (URL "" = placeholder)'); process.exit(1);}
const file = new URL("signals-locks.js", import.meta.url);
const ITER = 250000, enc = new TextEncoder();
const b64 = b => Buffer.from(b).toString("base64"), unb64 = s => Buffer.from(s, "base64");
const norm = w => w.toUpperCase().replace(/\s+/g, "");
async function key(w, salt) {
  const base = await crypto.subtle.importKey("raw", enc.encode(norm(w)), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey({name: "PBKDF2", salt, iterations: ITER, hash: "SHA-256"}, base, {name: "AES-GCM", length: 256}, false, ["encrypt", "decrypt"]);
}
const src = readFileSync(file, "utf8");
const locks = JSON.parse(src.slice(src.indexOf("["), src.lastIndexOf("]") + 1));
let at = locks.length;
for (const [i, l] of locks.entries()) {
  try {await crypto.subtle.decrypt({name: "AES-GCM", iv: unb64(l.iv)}, await key(word, unb64(l.salt)), unb64(l.data)); at = i; break;} catch {}
}
const replaced = at < locks.length;
const salt = crypto.getRandomValues(new Uint8Array(16)), iv = crypto.getRandomValues(new Uint8Array(12));
const data = await crypto.subtle.encrypt({name: "AES-GCM", iv}, await key(word, salt), enc.encode(JSON.stringify({url})));
locks[at] = {salt: b64(salt), iv: b64(iv), data: b64(data)};
writeFileSync(file, '"use strict";\nconst locks = ' + JSON.stringify(locks, null, 1) + ";\n");
console.log((replaced ? "replaced" : "sealed") + " lock " + (at + 1) + " of " + locks.length + (url ? "" : " (placeholder)"));
