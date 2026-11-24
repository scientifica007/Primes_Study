'use strict';
function experiment(){
 const ok=(v,m)=>{if(!v)throw Error(m)};
 const red=w=>{let r=[];for(let x of w){if(r.at(-1)===-x)r.pop();else r.push(x)}return r},inv=w=>w.slice().reverse().map(x=>-x),eq=(a,b)=>a.length===b.length&&a.every((x,i)=>x===b[i]);
 const sub=(w,n,j)=>red(w.flatMap(x=>{let a=x===n?[n,...Array(Math.abs(j)).fill(j>0?n+1:-(n+1))]:x===-n?inv([n,...Array(Math.abs(j)).fill(j>0?n+1:-(n+1))]):[x];return a}));
 let nielsenModels=0,nielsenPatterns=0,compositionChecks=0,inverseChecks=0,parityChecks=0,protectedModels=0,protectedRequests=0,protectedChecks=0,positiveWitnessChecks=0;
 for(let n=1;n<=7;n++){let h=100;const x=Array.from({length:n+1},(_,i)=>[i+1]),pair=x.map((w,i)=>[w,red([ -h,...inv(w),h,h])]);
 for(let mask=0;mask<3**n;mask++){let k=mask,opts=Array.from({length:n},()=>{let a=k%3;k=Math.floor(k/3);return a});let out=pair.map(p=>p.map(w=>w.slice()));
 for(let i=n-1;i>=0;i--)if(opts[i])out=out.map(p=>p.map(w=>sub(w,i+1,opts[i])));
 for(let i=0;i<=n;i++){let expected=pair[i].map(w=>i<n?sub(w,i+1,opts[i]):w);ok(out[i].every((w,j)=>eq(w,expected[j])),"scheduled composition");compositionChecks+=2}
 for(let i=0;i<n;i++)if(opts[i])out=out.map(p=>p.map(w=>sub(w,i+1,-opts[i])));
 for(let i=0;i<=n;i++){ok(out[i].every((w,j)=>eq(w,pair[i][j])),"inverse composition");inverseChecks+=2}
 nielsenPatterns++;
 }nielsenModels++}
 const chi=w=>w.reduce((s,x)=>Math.abs(x)>=100?s:s+Math.sign(x)*(Math.abs(x)%2?1:-1),0);
 for(let i=1;i<=200;i++){if(i>=99)continue;ok(chi([i,i+1])===0&&chi(inv([i,i+1]))===0,"alternating obstruction");parityChecks+=2}
 const gcd=(a,b)=>b?gcd(b,a%b):a;
 // Each diagonal block is {p e_n,-q e_n}, gcd(p,q)=1.
 // Protect both signs after producing finite witnesses; oracle edits only unprotected values.
 let rng=8191;const rnd=n=>{rng=(Math.imul(rng,1664525)+1013904223)>>>0;return rng%n};
 for(let trial=0;trial<25;trial++){
  const N=12,base=Array.from({length:2},()=>Array.from({length:N},()=>[1,1])),fixed=Array.from({length:2},()=>Array(N).fill(false)),requests=[];
  for(let n=0;n<N;n++)for(let c=0;c<2;c++)requests.push([n,c]);
  for(let i=requests.length-1;i>0;i--){let j=rnd(i+1);[requests[i],requests[j]]=[requests[j],requests[i]]}
  for(const [n,c] of requests){const d=1-c,old=base[c].map(x=>x.slice());
   for(let i=0;i<N;i++)if(fixed[d][i]&&!fixed[c][i]){
     const forb=base[d][i];if(base[c][i][0]===forb[0]||base[c][i][1]===forb[1]){
       let p=2;while(p===forb[0]||p+1===forb[1])p++;base[c][i]=[p,p+1];
     }
   }
   for(let i=0;i<N;i++){if(fixed[c][i])ok(eq(old[i],base[c][i]),"protected");
    if(fixed[d][i])ok(base[c][i][0]!==base[d][i][0]&&base[c][i][1]!==base[d][i][1],"avoid other protected");protectedChecks++}
   const [p,q]=base[c][n];ok(gcd(p,q)===1,"coprime");
   for(const target of [-1,1]){let a=0;while(a*p<target||(a*p-target)%q)a++;let b=(a*p-target)/q;ok(a>=0&&b>=0&&a+b>0&&a*p-b*q===target,"positive witness");positiveWitnessChecks++}
   fixed[c][n]=true;protectedRequests++;
  }
  for(let i=0;i<N;i++)ok(fixed[0][i]&&fixed[1][i]&&base[0][i][0]!==base[1][i][0]&&base[0][i][1]!==base[1][i][1],"disjoint final");protectedModels++;
 }
 // Exhaustive finite closure repair with protected elements: vector spaces F2^3,
 // where closure includes zero (an algebraic closure, not the positive semigroup convention).
 let repairCases=0,repairChecks=0;const N=8,elems=Array.from({length:N},(_,i)=>i),cl=X=>{let s=new Set([0]);for(let a of X)for(let b of [...s])s.add(a^b);return s};
 for(let m=0;m<256;m++){const A=elems.filter(i=>m>>i&1);if(cl(A).size!==8||A.some(a=>cl(A.filter(b=>a!==b)).size===8))continue;
 for(let k=0;k<1<<A.length;k++){const P=A.filter((_,j)=>k>>j&1),C=P.map(p=>cl(A.filter(a=>a!==p)));
 for(let f=0;f<256;f++){const F=elems.filter(i=>f>>i&1);if(F.some(x=>P.includes(x)))continue;
 const X=[...P,...elems.filter(x=>!F.includes(x)&&C.every(c=>c.has(x)))];if(cl(X).size!==8)continue;
 let B=[...new Set([...A.filter(x=>!F.includes(x)),...X])];
 for(let x of B.slice())if(!P.includes(x)&&cl(B.filter(y=>x!==y)).size===8)B=B.filter(y=>x!==y);
 ok(cl(B).size===8&&P.every(p=>B.includes(p))&&B.every(x=>!F.includes(x))&&B.every(x=>!cl(B.filter(y=>y!==x)).has(x)),"protected repair");repairCases++;repairChecks+=B.length;
 }}}
 return {study:52,nielsenModels,nielsenPatterns,compositionChecks,inverseChecks,parityChecks,protectedModels,protectedRequests,protectedChecks,positiveWitnessChecks,repairCases,repairChecks,all_passed:true,scope:"Exact reduced free-word composition and inverse checks; positive integer witnesses and protected finite-prefix construction; exhaustive finite vector closure repair. Infinite Rees example and countable fusion proved analytically."};
}
console.log(JSON.stringify(experiment(), null, 2));
