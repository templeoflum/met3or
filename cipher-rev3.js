(function(scope){
const alphabet=['000','00+','0+−','0+0','0++','+−−','+−0','+−+','+0−','+00','+0+','++−','++0','+++'];
const negate=s=>Array.from(s,c=>c==='+'?'−':c==='−'?'+':c).join('');
const table={' ':'000'};alphabet.slice(1).forEach((v,i)=>{table[String.fromCharCode(65+i)]=v;table[String.fromCharCode(78+i)]=negate(v)});
const inverse=Object.fromEntries(Object.entries(table).map(([a,b])=>[b,a]));
const clean=s=>s.toUpperCase().replace(/[^A-Z .]/g,'').trim().replace(/ +/g,' ');
const encode=s=>Array.from(clean(s),c=>c==='.'?'.':table[c]).join(' ').replace(/ \./g,'.');
function physical(text,row){return row%2?text.trim().split(/ +/).reverse().join(' '):text.trim()}
function decode(text,mirror=false){
const pools={};[['+†‡⊕﬩','+'],['0OØ⊙∅','0'],['−-–⊖˗','−']].forEach(([p,v])=>Array.from(p,c=>pools[c]=v));
text=text.replace(/\r/g,'').trim();if(/^KEY\s*\//i.test(text)){const lines=text.split('\n');if(!/^KEY\s*\/\s*\+0\s*$/i.test(lines.shift()))throw Error('Key revision mismatch. Select the matching archived key.');text=lines.join('\n').trim();}const rows=text.split('\n');if(!text)throw Error('No input.');
return rows.map((row,i)=>{let s='';for(const c of row.normalize('NFD')){if(/\s|\p{M}/u.test(c))continue;if(c==='.'){s+='.';continue;}if(!(c in pools))throw Error('Row '+(i+1)+': invalid sign “'+c+'”.');s+=pools[c]}
if(!s.length)throw Error('Row '+(i+1)+': no signs.');if(mirror)s=negate(s);
let decoded='',pending='';for(const c of s){if(c==='.'){if(pending.length||!/[A-Z]$/.test(decoded))throw Error('Row '+(i+1)+': full stop must follow a complete word.');decoded+='.';}else{pending+=c;if(pending.length===3){decoded+=inverse[pending];pending='';}}}if(pending.length)throw Error('Row '+(i+1)+': incomplete triple.');return physical(decoded.trim(),i);
}).join(' ');
}
scope.CipherV3={encode,decode,physical,clean,negate,revision:3,mark:'+0'};
})(globalThis);
