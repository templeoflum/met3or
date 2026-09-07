(function(scope){
const alphabet=['000','00+','0+−','0+0','0++','+−−','+−0','+−+','+0−','+00','+0+','++−','++0','+++'];
const negate=s=>Array.from(s,c=>c==='+'?'−':c==='−'?'+':c).join('');
const table={' ':'000'};alphabet.slice(1).forEach((v,i)=>{table[String.fromCharCode(65+i)]=v;table[String.fromCharCode(78+i)]=negate(v)});
const inverse=Object.fromEntries(Object.entries(table).map(([a,b])=>[b,a]));
const clean=s=>s.toUpperCase().replace(/[^A-Z ]/g,'').trim().replace(/ +/g,' ');
const encode=s=>Array.from(clean(s),c=>table[c]).join(' ');
function physical(text,row){return row%2?text.trim().split(/ +/).reverse().join(' '):text.trim()}
function decode(text,mirror=false){
const pools={};[['+†‡⊕﬩','+'],['0OØ⊙∅','0'],['−-–⊖˗','−']].forEach(([p,v])=>Array.from(p,c=>pools[c]=v));
text=text.replace(/\r/g,'').trim();if(/^KEY\s*\//i.test(text)){const lines=text.split('\n');if(!/^KEY\s*\/\s*\+−\s*$/i.test(lines.shift()))throw Error('Key revision mismatch. Select the matching archived key.');text=lines.join('\n').trim();}const rows=text.split('\n');if(!text)throw Error('No input.');
return rows.map((row,i)=>{let s='';for(const c of row.normalize('NFD')){if(/\s|\p{M}/u.test(c))continue;if(!(c in pools))throw Error('Row '+(i+1)+': invalid sign “'+c+'”.');s+=pools[c]}
if(!s.length||s.length%3)throw Error('Row '+(i+1)+': incomplete triple.');if(mirror)s=negate(s);
let decoded=s.match(/.{3}/g).map(t=>inverse[t]).join('').trim();return physical(decoded,i);
}).join(' ');
}
scope.CipherV2={encode,decode,physical,clean,negate,revision:2,mark:'+−'};
})(globalThis);
