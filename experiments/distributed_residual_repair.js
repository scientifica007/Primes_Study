'use strict';
function experiment(){
 const ok=(v,m)=>{if(!v)throw Error(m)};
 let rng=82931;const rnd=n=>{rng=(Math.imul(rng,1664525)+1013904223)>>>0;return Math.floor(rng/4294967296*n)};
 const ps=[[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]],s3=(a,b)=>ps.findIndex(p=>p.every((v,i)=>v===ps[a][ps[b][i]]));
 let models=0,repairCases=0,skipCases=0,nonemptyBad=0,badChecks=0,tailChecks=0,necessityChecks=0,finalChecks=0,exceptionChecks=0,donorIdentities=0;
 for(let G of [3,5,6])for(let upper of [false,true]){
  let R=upper?4:3,N=R*R*G,gm=G===6?s3:(a,b)=>(a+b)%G,inv=a=>Array.from({length:G},(_,b)=>b).find(b=>gm(a,b)===0),P=(l,i)=>(upper?((l>>1)&&(i>>1)?1:0):((l*i)%G)),U=upper?[N,N+1]:[];
  const id=(i,g,l)=>(i*G+g)*R+l,dec=x=>[Math.floor(x/(G*R)),Math.floor(x/R)%G,x%R],move=(m,i)=>2*(i>>1)+Math.min(m,i&1);
  const mul=(a,b)=>{if(a>=N&&b>=N)return Math.min(a,b);if(a>=N){let [i,g,l]=dec(b);return id(move(a-N,i),g,l)}if(b>=N){let [i,g,l]=dec(a);return id(i,g,move(b-N,l))}let [i,g,l]=dec(a),[j,h,m]=dec(b);return id(i,gm(gm(g,P(l,j)),h),m)};
  const close=X=>{let s=new Set([...U,...X]),q=[...s],seeds=q.slice();for(let i=0;i<q.length;i++)for(let b of seeds){let z=mul(q[i],b);if(!s.has(z)){s.add(z);q.push(z)}}return s};
  const all=Array.from({length:N},(_,i)=>i),shuf=()=>{let x=all.slice();for(let i=N-1;i>0;i--){let j=rnd(i+1);[x[i],x[j]]=[x[j],x[i]]}return x};
  const trim=(X,targets)=>{let Y=[...new Set(X)];ok(targets.every(t=>close(Y).has(t)),"initial support");for(let x of Y.slice()){let D=Y.filter(y=>y!==x),C=close(D);if(targets.every(t=>C.has(t)))Y=D}return Y};
  const basis=()=>{let A=[];for(let x of shuf()){A.push(x);if(close(A).size===N+U.length)break}return trim(A,all)};
  const right=(l,t)=>id(0,gm(inv(P(l,0)),t),l),left=(i,t)=>id(i,gm(t,inv(P(0,i))),0);
  for(let trial=0;trial<12;trial++){
   const A=basis(),B=trial%2?basis():A.slice(),F=new Set(A.filter(x=>{let [i,,l]=dec(x);return i===0||l===0})),K=B.filter(x=>F.has(x)),allowed=all.filter(x=>!F.has(x));
   if(close(allowed).size!==N+U.length){skipCases++;continue}
   if(K.length)nonemptyBad++;
   const donors=[right(0,1),right(0,inv(1)),left(0,1),left(0,inv(1))],CA=trim(A,donors),CB=trim(B,donors);
   const psi=b=>{let [i,g,l]=dec(b);return l===0?mul(b,right(l,1)):mul(left(i,1),b)};
   const back=(b,z)=>{let [i,,l]=dec(b);return l===0?mul(z,right(l,inv(1))):mul(left(i,inv(1)),z)};
   const E=K.filter(b=>CA.includes(b)||CB.includes(b)||CA.includes(psi(b))||CB.includes(psi(b)));
   const tail=K.filter(b=>!E.includes(b));
   for(let b of K){ok(psi(b)!==b&&back(b,psi(b))===b,"donor inverse");donorIdentities++;badChecks++}
   ok(new Set(K.map(psi)).size===K.length,"transport injective");
   for(let b of tail){ok(!A.includes(psi(b))&&!B.includes(psi(b)),"safe transport");tailChecks++}
   const Q=trim(allowed,[...new Set([...CB,...E])]),D=new Set([...CB,...E,...trim(B,Q)]);
   let X=[...new Set([...B.filter(b=>!F.has(b)),...tail.map(psi),...Q])];
   ok(close(X).size===N+U.length&&X.every(x=>!F.has(x)),"candidate generates");exceptionChecks+=E.length;
   for(let b of B)if(!D.has(b)){let z=F.has(b)?psi(b):b;ok(X.includes(z)&&!close(X.filter(x=>x!==z)).has(z),"tail essential");necessityChecks++}
   X=trim(X,all);ok(X.every(x=>!F.has(x))&&close(X).size===N+U.length,"final repair");for(let x of X){ok(!close(X.filter(y=>y!==x)).has(x),"final independent");finalChecks++}repairCases++;
  }
  models++;
 }
 let directedModels=0,directedTailChecks=0,directedDeletionChecks=0;
 for(let n of [5,10,20,40]){
  const id=(i,g,l)=>(i*5+g)*2+l,dec=x=>[Math.floor(x/10),Math.floor(x/2)%5,x%2],mul=(x,y)=>{let [i,g]=dec(x),[,h,l]=dec(y);return id(i,(g+h)%5,l)};
  const close=X=>{let s=new Set(X),q=[...s];for(let j=0;j<q.length;j++)for(let y of X){let z=mul(q[j],y);if(!s.has(z)){s.add(z);q.push(z)}}return s};
  const A=Array.from({length:n},(_,i)=>id(i,1,i===0?1:0)),B=A.map((x,i)=>i===0?x:id(i,2,0)),F=new Set(A.slice(1));
  ok(close(A).size===10*n&&close(B).size===10*n&&B.every(x=>!F.has(x)),"directed full repair");
  for(let i=2;i<n;i++){ok(mul(A[i],id(0,1,0))===B[i]&&mul(B[i],id(0,4,0))===A[i],"directed tail donor");directedTailChecks++}
  for(let X of [A,B])for(let x of X){ok(!close(X.filter(y=>y!==x)).has(x),"directed necessary row");directedDeletionChecks++}
  directedModels++;
 }
 const red=w=>{let r=[];for(let x of w){if(r.at(-1)===-x)r.pop();else r.push(x)}return r},inv=w=>w.slice().reverse().map(x=>-x),eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
 let freeTransportChecks=0,crossCoverageChecks=0,crossIntersectionChecks=0,localPairChecks=0;
 for(let n=1;n<=40;n++){
  let A=[["*","e","*"]];
  for(let k=0;k<n;k++){
   let cells=[[`F${k}`,"*"],[`M${k}:0`,`F${k}`],[`M${k}:1`,`M${k}:0`],[`N${k}:0`,`M${k}:1`],[`N${k}:1`,`N${k}:0`],[`N${k}:1`,`N${k}:1`]];
   for(let j=0;j<cells.length;j++)for(let s of ["+","-"])A.push([cells[j][0],s+":"+k+":"+j,cells[j][1]]);
  }
  const fl=i=>i==="*"||i.startsWith("F")?i:i.slice(0,-1)+(i.endsWith("0")?"1":"0"),key=x=>x.join("|");
  const B=new Set(A.map(([i,g,l])=>key([fl(i),g,l]))),C=new Set(A.map(([i,g,l])=>key([i,g,fl(l)])));
  let T=A.filter(x=>B.has(key(x))&&C.has(key(x)));
  ok(T.length===2*n+1&&T.every(x=>x[2]==="*"),"infinite residue prefix in one column");crossIntersectionChecks++;
  ok(new Set(A.map(x=>x[0])).size===5*n+1&&new Set(A.map(x=>x[2])).size===5*n+1,"coverage");crossCoverageChecks++;
  for(let k=0;k<n;k++){
   let x=100+k,p=[1,k%2?2:-2],g=[x],t=[3,4],r=red([...inv(p),...t]),s=red([...inv(p),...inv(t)]);
   let z=red([...g,...p,...r]);ok(eq(z,red([...g,...t]))&&eq(red([...z,...p,...s]),g),"right transport");
   let l=red([...t,...inv(p)]),li=red([...inv(t),...inv(p)]),y=red([...l,...p,...g]);ok(eq(y,red([...t,...g]))&&eq(red([...li,...p,...y]),g),"left transport");freeTransportChecks+=2;
   let plus=[x,x],minus=[-x,-x,-x];ok(eq(red([...plus,...plus,...minus]),[x])&&eq(red([...plus,...minus]),[-x]),"local block pair");localPairChecks+=2;
  }
 }
 let chainCases=0,relativeMinChecks=0,globalFailureChecks=0,complementChecks=0,alternateBasisChecks=0;
 for(let n=2;n<=40;n++){
  const A=Array.from({length:n},(_,i)=>"a"+i),X=A.map((_,i)=>"x"+i),Y=A.map((_,i)=>"y"+i);
  const cl=seed=>{let s=new Set(seed),changed=true;while(changed){changed=false;const add=v=>{if(!s.has(v)){s.add(v);changed=true}};
   for(let i=0;i<n;i++){if(s.has(A[i])){add(X[i]);add(Y[i])}if(s.has(X[i])&&(s.has(Y[i])||(i+1<n&&s.has(A[i+1]))))add(A[i])}}
   return s};
  for(let i=0;i<n-1;i++){let out=A.filter((_,j)=>j!==i);ok(cl([...out,X[i]]).has(A[i])&&!cl(out).has(A[i]),"relative minimum");relativeMinChecks++}
  ok(A.every(a=>cl([...X.slice(0,n-1),A[n-1]]).has(a)),"anchored finite chain");chainCases++;
  ok(A.every(a=>!cl(X).has(a)),"escaping donors");globalFailureChecks++;
  ok(cl([...X,...Y]).size===3*n,"complement");for(let i=0;i<n-1;i++){ok(cl([...X,...Y.filter((_,j)=>j!==i)]).size===3*n,"redundant nonterminal y");complementChecks++}
  for(let c=0;c<2;c++){let B=A.map((a,i)=>i===n-1||i%2===c?a:X[i]);ok(cl(B).size===3*n,"alternate anchored finite basis");for(let b of B){ok(!cl(B.filter(x=>x!==b)).has(b),"alternate necessity");alternateBasisChecks++}}
 }
 return {study:57,models,repairCases,skipCases,nonemptyBad,badChecks,tailChecks,necessityChecks,finalChecks,exceptionChecks,donorIdentities,directedModels,directedTailChecks,directedDeletionChecks,freeTransportChecks,crossCoverageChecks,crossIntersectionChecks,localPairChecks,chainCases,relativeMinChecks,globalFailureChecks,complementChecks,alternateBasisChecks,all_passed:true,scope:"Exact positive Rees closures over C3,C5,S3 (with/without min actions), finite complement verified separately; directed large-row tests over C5; reduced free-word transport identities; finite prefixes of infinite residual placement and abstract dependency-chain counterexample. Infinite results analytic."}
}
console.log(JSON.stringify(experiment(), null, 2));
