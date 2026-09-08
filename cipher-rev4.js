(function(scope){
const alphabet=['000','00+','0+−','0+0','0++','+−−','+−0','+−+','+0−','+00','+0+','++−','++0','+++'];
const negate=s=>Array.from(s,c=>c==='+'?'−':c==='−'?'+':c).join('');
const table={' ':'000'};alphabet.slice(1).forEach((v,i)=>{table[String.fromCharCode(65+i)]=v;table[String.fromCharCode(78+i)]=negate(v)});
const inverse=Object.fromEntries(Object.entries(table).map(([a,b])=>[b,a]));
const clean=s=>s.toUpperCase().replace(/[^A-Z .]/g,'').trim().replace(/ +/g,' ');
const encode=s=>Array.from(clean(s),c=>c==='.'?'.':table[c]).join(' ').replace(/ \./g,'.');
function physical(text,row){return row%2?Array.from(text).reverse().join(''):text}
function decode(text,mirror=false){
const pools={};[['+†‡⊕﬩','+'],['0OØ⊙∅','0'],['−-–⊖˗','−']].forEach(([p,v])=>Array.from(p,c=>pools[c]=v));
text=text.replace(/\r/g,'').trim();if(/^KEY\s*\//i.test(text)){const lines=text.split('\n');if(!/^KEY\s*\/\s*\+\+\s*$/i.test(lines.shift()))throw Error('Key revision mismatch. Select the matching archived key.');text=lines.join('\n').trim();}if(!text)throw Error('No input.');
const stream=text.split('\n').map((row,i)=>{let s='';row=row.replace(/___/g,'');for(const c of row.normalize('NFD')){if(/\s|\p{M}/u.test(c))continue;if(c==='.'){s+='.';continue;}if(!(c in pools))throw Error('Row '+(i+1)+': invalid sign “'+c+'”.');s+=pools[c];}if(!s.replace(/\./g,'').length||s.replace(/\./g,'').length%3)throw Error('Row '+(i+1)+': incomplete triple.');if(i%2)s=Array.from(s).reverse().join('');return mirror?negate(s):s;}).join('');
let decoded='',pending='';for(const c of stream){if(c==='.'){if(pending.length||!/[A-Z]$/.test(decoded))throw Error('Full stop must follow a complete word.');decoded+='.';}else{pending+=c;if(pending.length===3){decoded+=inverse[pending];pending='';}}}if(pending.length)throw Error('Incomplete triple.');return decoded;
}
scope.CipherV4={encode,decode,physical,clean,negate,revision:4,mark:'++'};
})(globalThis);
