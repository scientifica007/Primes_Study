// Study 09: arithmetic representation of monotone Boolean functions and graph-module closure.
// Run: node philosophy/tests/09-arithmetic-encoding.js
function check09(){
 const isSubset=(a,b)=>(a&b)===a;
 const pop=x=>{let k=0;while(x){x&=x-1;k++}return k;};
 function encode(n,f){const full=(1<<n)-1;const falseSets=[];for(let s=0;s<=full;s++)if(!f(s)&&Array.from({length:n},(_,i)=>i).every(i=>(s>>i&1)||f(s|(1<<i))))falseSets.push(s);
 const primes=[];for(let x=2;primes.length<falseSets.length;x++)if(primes.every(p=>x%p!==0))primes.push(x);
 // The above incremental test enumerates primes (all earlier primes are in the list).
 const P=primes.reduce((p,q)=>p*BigInt(q),1n);const a=Array.from({length:n},(_,i)=>primes.reduce((v,q,j)=>falseSets[j]>>i&1?v:v*BigInt(q),1n));
 for(let s=0;s<=full;s++){let product=1n;for(let i=0;i<n;i++)if(s>>i&1)product*=a[i];if((product%P===0n)!==Boolean(f(s)))throw Error("encoding mismatch");}
 return falseSets;}
 const bool=[];for(let n=1;n<=4;n++){const full=(1<<n)-1;let count=0,rows=0,orCount=0;for(let t=0;t<2**(full+1);t++){const f=s=>(t>>>s)&1;if(f(0)||!f(full))continue;let mono=true;for(let s=0;s<=full;s++)for(let i=0;i<n;i++)if(f(s)>f(s|(1<<i)))mono=false;if(!mono)continue;const fs=encode(n,f);const minimalTrue=Array.from({length:full+1},(_,s)=>s).filter(s=>f(s)&&Array.from({length:n},(_,i)=>i).every(i=>!(s>>i&1)||!f(s^(1<<i))));if((fs.length===1)!==minimalTrue.every(s=>pop(s)===1))throw Error("prime link mismatch");if(fs.length===1)orCount++;count++;rows+=full+1;}bool.push({n,functions:count,rows,primeTargets:orCount});}
 const graphs=[];for(let n of [4,5]){const full=(1<<n)-1,edges=[];for(let i=0;i<n;i++)for(let j=i+1;j<n;j++)edges.push([i,j]);let prime=0,rows=0;for(let g=0;g<2**edges.length;g++){const adj=Array(n).fill(0);edges.forEach(([i,j],k)=>{if(g>>k&1){adj[i]|=1<<j;adj[j]|=1<<i;}});const module=s=>adj.every((a,w)=>(s>>w&1)||((a&s)===0)||((a&s)===s));const f=s=>{for(let m=0;m<full;m++)if(isSubset(s,m)&&module(m))return 0;return 1;};const fs=encode(n,f);const direct=Array.from({length:full-1},(_,i)=>i+1).every(s=>pop(s)<2||!module(s));const criterion=fs.length===n&&fs.every(s=>pop(s)===1);if(direct!==criterion)throw Error("graph mismatch");if(direct)prime++;rows+=full+1;}graphs.push({n,graphs:2**edges.length,prime,rows});}return {bool,graphs};
}
console.log(JSON.stringify(check09(), null, 2));
