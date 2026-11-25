// Study 14: finite countertests and modular bijectivity.
// Run: node philosophy/tests/14-primality-necessity-countertests.js
function check14(){
 const V=[2,3,4,5,7,8],pairs=[];
 for(const a of V)for(const b of V)if(a*b===12)pairs.push([a,b]);
 const numPrime=n=>n>1&&Array.from({length:n-2},(_,i)=>i+2).every(d=>n%d!==0);
 const arithmetic=V.map(x=>({x,prime:numPrime(x),necessary:pairs.every(p=>p.includes(x))}));
 if(pairs.length!==2||new Set(arithmetic.map(x=>`${x.prime}/${x.necessary}`)).size!==4)throw Error("arithmetic");
 // p,q,r,s are bits 0,1,2,3; literal encoded by ±(index+1).
 const C=[[-1,-4,2],[-1,4,2],[-2,3],[-1,3],[-1,-4,3]];
 const A=Array.from({length:16},(_,x)=>x);
 const holds=(c,x)=>c.some(l=>Boolean(x&(1<<(Math.abs(l)-1)))===(l>0));
 const target=x=>holds([-1,2],x)&&holds([-2,3],x);
 const models=A.filter(target),entailed=c=>models.every(x=>holds(c,x));
 const success=[];
 for(let m=0;m<32;m++)if(A.every(x=>target(x)===C.every((c,i)=>!(m&(1<<i))||holds(c,x))))success.push(m);
 const clauses=C.map((c,i)=>({rule:i+1,prime:entailed(c)&&c.every((_,j)=>!entailed(c.filter((_,k)=>j!==k))),necessary:success.every(m=>Boolean(m&(1<<i)))}));
 if(success.join(",")!=="7,15,23,31"||new Set(clauses.map(x=>`${x.prime}/${x.necessary}`)).size!==4)throw Error("clauses");
 // Compare reversible multiplication with primality for each modulus.
 const modulo=[];
 for(let m=2;m<=100;m++){
 let reversible=true;for(let a=1;a<m;a++)if(new Set(Array.from({length:m},(_,x)=>a*x%m)).size!==m)reversible=false;
 if(reversible!==numPrime(m))throw Error("modulo");
 modulo.push({m,prime:reversible});
 }
 return {arithmetic,pairs,models,success,clauses,moduliChecked:modulo.length};
}
console.log(JSON.stringify(check14(),null,2));
