'use strict';
function experiment(){
 const ok=(x,m)=>{if(!x)throw Error(m)};
 const elems=Array.from({length:8},(_,i)=>i),sets=Array.from({length:256},(_,m)=>elems.filter(i=>m>>i&1));
 const cl=X=>{let s=new Set([0]);for(let x of X)for(let y of [...s])s.add(x^y);return s};
 const C=sets.map(cl),ind=sets.map(X=>X.every(x=>!cl(X.filter(y=>y!==x)).has(x))),bases=sets.map((X,m)=>m).filter(m=>ind[m]&&C[m].size===8);
 let independentChecks=0,finiteWitnessChecks=0,paletteCases=0,paletteFeasible=0,paletteInfeasible=0,finiteConflictChecks=0;
 for(let m=0;m<256;m++){
  if(!ind[m]){let found=false;for(let x of sets[m])if(cl(sets[m].filter(y=>y!==x)).has(x))found=true;ok(found,"finite dependence")}
  else for(let s=m;;s=(s-1)&m){ok(ind[s],"hereditary independence");independentChecks++;if(!s)break}
  for(let x of elems)if(C[m].has(x)){
   let witness=false;for(let s=m;;s=(s-1)&m){if(ind[s]&&C[s].has(x)){witness=true;break}if(!s)break}
   ok(witness,"finite independent support");finiteWitnessChecks++;
  }
 }
 let rng=54231;const rnd=n=>{rng=(Math.imul(rng,1664525)+1013904223)>>>0;return Math.floor(rng/4294967296*n)};
 const targets=[1,2,4];
 for(let trial=0;trial<700;trial++){
  const W=Array.from({length:2},()=>targets.map(()=>rnd(256)));
  const good=(m,c,L)=>targets.every((a,i)=>!(L>>i&1)||C[m&W[c][i]].has(a));
  const full=bases.some(b=>good(b,0,7)&&bases.some(d=>!(b&d)&&good(d,1,7)));
  let feasible=true;
  for(let L=0;L<8;L++){
   let U=[0,0];for(let c=0;c<2;c++)for(let i=0;i<3;i++)if(L>>i&1)U[c]|=W[c][i];
   const cand=[0,1].map(c=>sets.map((_,m)=>m).filter(m=>ind[m]&&!(m&~U[c])&&good(m,c,L)));
   const exists=cand[0].some(m=>cand[1].some(d=>!(m&d)));
   finiteConflictChecks++;if(!exists)feasible=false;
  }
  ok(full===feasible,"palette finite feasibility");paletteCases++;if(full)paletteFeasible++;else paletteInfeasible++;
 }
 let reesModels=0,reesBases=0,reesClosureChecks=0,reesDeletionChecks=0,escapingWitnessChecks=0,finiteLimitChecks=0,uniformTargetChecks=0;
 for(let d=2;d<=6;d++){
  const G=1<<d,N=4*G,id=(i,g,l)=>(i*G+g)*2+l,dec=x=>[Math.floor(x/(G*2)),Math.floor(x/2)%G,x%2],mul=(a,b)=>{const [i,g]=dec(a),[,h,l]=dec(b);return id(i,g^h,l)};
  const close=X=>{let s=new Set(X),q=[...s];for(let j=0;j<q.length;j++)for(let b of X){let z=mul(q[j],b);if(!s.has(z)){s.add(z);q.push(z)}}return s};
  const base=Array.from({length:d},(_,i)=>id(0,1<<i,0)),c=id(1,0,1),a0=base[0],tail=[...base.slice(1),c],lim=close(tail);
  ok(lim.size===N/2&&!lim.has(a0),"limit missing direction");finiteLimitChecks++;
  for(let i=1;i<d;i++){
   const v=id(0,1^(1<<i),0),B=[v,...tail],swap=x=>{const [r,g,l]=dec(x);return id(1-r,g,1-l)},D=B.map(swap);
   ok(mul(v,base[i])===a0,"two factor witness");escapingWitnessChecks++;
   ok(B.every(x=>!D.includes(x)),"disjoint stage bases");
   for(let X of [B,D]){ok(close(X).size===N,"stage generates");reesClosureChecks++;reesBases++;for(let x of X){ok(!close(X.filter(y=>y!==x)).has(x),"stage independent");reesDeletionChecks++}}
   for(let x=0;x<N;x++){
    const [r,g,l]=dec(x);let word=[];
    if(g&1)word.push(v,base[i]);
    for(let j=1;j<d;j++)if(g>>j&1)word.push(base[j]);
    if(!word.length)word.push(base[1],base[1]);
    if(r)word.unshift(c);if(l)word.push(c);
    ok(word.reduce(mul)===x&&word.length<=d+3,"uniform length per target");uniformTargetChecks++;
   }
  }
  reesModels++;
 }
 let hypergraphModels=0,hypergraphPairChecks=0,hypergraphAntichainChecks=0,finiteAvoidanceChecks=0,threeIntersectionChecks=0,crossFormulaChecks=0;
 const left=n=>new Set(["p",...Array.from({length:n},(_,i)=>"a"+(i+1)),"b"+n]);
 const right=n=>new Set(["q",...Array.from({length:n},(_,i)=>"b"+(i+1)),"a"+(n+1)]);
 const inter=(a,b)=>[...a].filter(x=>b.has(x));
 for(let n=2;n<=30;n++){
  const B=Array.from({length:n},(_,i)=>[left(i+1),right(i+1)]).flat();
  for(let i=0;i<B.length;i++)for(let j=i+1;j<B.length;j++){let I=inter(B[i],B[j]);ok(I.length>0,"pair intersects");ok(I.length<B[i].size&&I.length<B[j].size,"antichain");hypergraphPairChecks++;hypergraphAntichainChecks++}
  for(let i=1;i<=n;i++)for(let j=1;j<=n;j++){let x=inter(left(i),right(j));ok(x.length===1&&x[0]===(i<=j?"b"+i:"a"+(j+1)),"exact cross");crossFormulaChecks++}
  const F=new Set(["p","q",...Array.from({length:n-1},(_,i)=>["a"+(i+1),"b"+(i+1)]).flat()]);
  ok(inter(left(n),right(n)).every(x=>!F.has(x)),"finite avoidance");finiteAvoidanceChecks++;
  ok(inter(left(1),right(1)).every(x=>!left(2).has(x)),"triple intersection");threeIntersectionChecks++;hypergraphModels++;
 }
 return {study:54,independentChecks,finiteWitnessChecks,paletteCases,paletteFeasible,paletteInfeasible,finiteConflictChecks,reesModels,reesBases,reesClosureChecks,reesDeletionChecks,escapingWitnessChecks,finiteLimitChecks,uniformTargetChecks,hypergraphModels,hypergraphPairChecks,hypergraphAntichainChecks,finiteAvoidanceChecks,threeIntersectionChecks,crossFormulaChecks,all_passed:true,scope:"Finite F2^3 linear closure with 700 deterministic palette samples; exact Rees positive closure and explicit words in finite F2 dimensions; finite prefixes of an abstract infinite antichain of bases. Compactness and infinite examples are analytical."};
}
console.log(JSON.stringify(experiment(), null, 2));
