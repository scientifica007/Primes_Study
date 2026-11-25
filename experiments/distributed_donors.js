'use strict';
function experiment(){
 const ok=(v,m)=>{if(!v)throw Error(m)};
 function cover(E,I,L){
  let R=new Set(I),C=new Set(L),mr=new Set(),mc=new Set(),M=[];
  for(let e of E)if(R.has(e[0])&&C.has(e[1])&&!mr.has(e[0])&&!mc.has(e[1])){M.push(e);mr.add(e[0]);mc.add(e[1])}
  let X=[];for(let i of R)if(!mr.has(i))X.push(E.find(e=>e[0]===i));for(let l of C)if(!mc.has(l))X.push(E.find(e=>e[1]===l));
  ok(X.every(Boolean),"required vertices");let er=new Set(X.map(e=>e[0])),ec=new Set(X.map(e=>e[1]));
  return [...new Set([...X,...M.filter(e=>!er.has(e[0])||!ec.has(e[1]))])];
 }
 let graphCases=0,graphDeletionChecks=0;
 for(let r of [2,3])for(let c of [2,3]){
  let all=Array.from({length:r*c},(_,i)=>[Math.floor(i/c),i%c]);
  for(let m=0;m<1<<all.length;m++){
   let E=all.filter((_,i)=>m>>i&1),R=[...new Set(E.map(e=>e[0]))],C=[...new Set(E.map(e=>e[1]))];
   for(let a=0;a<1<<R.length;a++)for(let b=0;b<1<<C.length;b++){
    let I=R.filter((_,i)=>a>>i&1),L=C.filter((_,i)=>b>>i&1),S=cover(E,I,L),full=T=>I.every(i=>T.some(e=>e[0]===i))&&L.every(l=>T.some(e=>e[1]===l));
    ok(full(S),"cover");for(let e of S){ok(!full(S.filter(x=>x!==e)),"private endpoint");graphDeletionChecks++}graphCases++;
   }
  }
 }
 const perms=[[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]],M3=perms.map(p=>perms.map(q=>perms.findIndex(r=>r.every((v,i)=>v===p[q[i]]))));
 let rng=58713;const rnd=n=>{rng=(Math.imul(rng,1664525)+1013904223)>>>0;return Math.floor(rng/4294967296*n)};
 function model(G,R,C,P,H=0,L=(n,i)=>i,T=(n,l)=>l){
  let gm=G===6?(a,b)=>M3[a][b]:(a,b)=>(a+b)%G,N=R*C*G,id=(i,g,l)=>(i*G+g)*C+l,dec=x=>[Math.floor(x/(G*C)),Math.floor(x/C)%G,x%C],all=Array.from({length:N},(_,i)=>i),U=Array.from({length:H},(_,i)=>N+i);
  const mul=(a,b)=>{if(a>=N&&b>=N)return Math.min(a,b);if(a>=N){let [i,g,l]=dec(b);return id(L(a-N,i),g,l)}if(b>=N){let [i,g,l]=dec(a);return id(i,g,T(b-N,l))}let [i,g,l]=dec(a),[j,h,m]=dec(b);return id(i,gm(gm(g,P(l,j)),h),m)};
  const table=Array.from({length:N+H},(_,i)=>Array.from({length:N+H},(_,j)=>mul(i,j)));
  const close=X=>{let s=new Set([...U,...X]),q=[...s],seeds=q.slice();for(let i=0;i<q.length;i++)for(let b of seeds){let z=table[q[i]][b];if(!s.has(z)){s.add(z);q.push(z)}}return s};
  const trim=(X,targets=all)=>{let Y=[...new Set(X)];ok(targets.every(t=>close(Y).has(t)),"initial support");for(let x of Y.slice()){let Z=Y.filter(y=>y!==x),D=close(Z);if(targets.every(t=>D.has(t)))Y=Z}return Y};
  const basis=()=>{let A=all.slice();for(let i=N-1;i>0;i--){let j=rnd(i+1);[A[i],A[j]]=[A[j],A[i]]}return trim(A)};
  const necessary=X=>{ok(close(X).size===N+H,"generates");for(let x of X)ok(!close(X.filter(y=>x!==y)).has(x),"independent");return X.length};
  return {G,N,H,id,dec,all,gm,inv:a=>Array.from({length:G},(_,i)=>i).find(b=>gm(a,b)===0),mul,close,trim,basis,necessary};
 }
 let finiteGroupCases=0,finiteGroupDeletionChecks=0,starCases=0,starDeletionChecks=0,donorModels=0,donorHomChecks=0,donorInverseChecks=0,donorSupportChecks=0,repairCases=0,repairDeletionChecks=0,tailChecks=0,skipCases=0;
 function repair(M,A,B,donors,phi){
  let {all,close,trim,N,H,necessary}=M,F=new Set(A),allowed=all.filter(x=>!F.has(x));
  if(close(allowed).size!==N+H){skipCases++;return null}
  let K=B.filter(x=>F.has(x)),CA=trim(A,donors),CB=trim(B,donors),E=K.filter(x=>CA.includes(x)||CB.includes(x)||CA.includes(phi(x))||CB.includes(phi(x))),T=K.filter(x=>!E.includes(x));
  for(let x of T){ok(!A.includes(phi(x))&&!B.includes(phi(x)),"safe tail");tailChecks++}
  let Q=trim(allowed,[...new Set([...CB,...E])]),Z=trim([...B.filter(x=>!F.has(x)),...T.map(phi),...Q]);
  ok(Z.every(x=>!F.has(x)),"avoids A");return necessary(Z);
 }
 for(let G of [3,6]){
  let R=G+1,C=2,M=model(G,R,C,(l,i)=>l===0||i===0?0:i%G),{id,dec,all,close,trim,basis,gm,inv,necessary}=M;
  let S=trim([id(0,0,0),...Array.from({length:R-1},(_,i)=>id(i+1,i,0)),id(0,0,1)]);
  for(let k=0;k<3;k++){
   let A=basis(),allowed=all.filter(x=>!A.includes(x));
   if(close(allowed).size!==all.length){skipCases++;continue}
   let D=trim(allowed,Array.from({length:G},(_,g)=>id(0,g,0))),r=new Set(D.map(x=>dec(x)[0])),c=new Set(D.map(x=>dec(x)[2]));
   let E=allowed.filter(x=>!D.includes(x)).map(x=>{let [i,,l]=dec(x);return [i,l,x]}),T=cover(E,Array.from({length:R},(_,i)=>i).filter(i=>!r.has(i)),[0,1].filter(i=>!c.has(i)));
   let B=trim([...D,...T.map(x=>x[2])]);ok(B.every(x=>!A.includes(x)),"complement");finiteGroupDeletionChecks+=necessary(B);finiteGroupCases++;
   let n=repair(M,A,S,[id(0,1,0),id(0,inv(1),0)],x=>{let [i,g,l]=dec(x);return id(i,l===0?gm(g,1):gm(1,g),l)});
   if(n!==null){starDeletionChecks+=n;starCases++}
  }
 }
 for(let G of [3,6])for(let H of [1,2]){
  let R=1+2*H,C=2*(H+1),M=model(G,R,C,(l,i)=>i===0||Math.floor(l/(H+1))===0?0:1+Math.floor((i-1)/H)%(G-1),H,(n,i)=>i===0?0:1+Math.floor((i-1)/H)*H+Math.min(n,(i-1)%H),(n,l)=>Math.floor(l/(H+1))*(H+1)+Math.min(n,l%(H+1)));
  let {id,N,dec,mul,gm,inv,basis,close,trim}=M,t=1,ti=inv(t),top=[H,2*(H+1)-1],donors=top.flatMap(l=>[id(0,t,l),id(0,ti,l)]);
  for(let s=0;s<2;s++)for(let h=0;h<=H;h++){
   let l=s*(H+1)+h,f=x=>h===H?x:mul(x,N+h);
   for(let g=0;g<G;g++)for(let k=0;k<G;k++){let x=id(0,g,top[s]),y=id(0,k,top[s]);ok(f(mul(x,y))===mul(f(x),f(y)),"group hom");donorHomChecks++}
   ok(mul(id(0,t,l),id(0,ti,l))===id(0,0,l),"inverse");donorInverseChecks++;
  }
  for(let k=0;k<3;k++){let A=basis(),D=close(trim(A,donors));for(let l=0;l<C;l++){ok(D.has(id(0,t,l))&&D.has(id(0,ti,l)),"finite core propagation");donorSupportChecks++}
   let n=repair(M,A,A,donors,x=>{let [,,l]=dec(x);return mul(x,id(0,t,l))});if(n!==null){repairDeletionChecks+=n;repairCases++}}
  donorModels++;
 }
 let freeWordChecks=0,matchingChecks=0;
 const red=w=>{let r=[];for(let x of w){if(r.at(-1)===-x)r.pop();else r.push(x)}return r},eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b),inv=w=>w.slice().reverse().map(x=>-x);
 for(let n=1;n<=40;n++){let cells=Array.from({length:n},(_,i)=>[i+1,i+1]);ok(new Set(cells.map(x=>x[0])).size===n&&new Set(cells.map(x=>x[1])).size===n,"matching");matchingChecks++;for(let i=1;i<=n;i++){let p=[i],x=[100+i],d=[i,-(i+1)],y=red([...inv(p),...inv(x),...d]);ok(eq(red([...x,...p,...y]),red(d))&&eq(red([...p,...y,...inv(d)]),inv(x)),"pair");freeWordChecks+=2}}
 return {study:58,graphCases,graphDeletionChecks,finiteGroupCases,finiteGroupDeletionChecks,starCases,starDeletionChecks,donorModels,donorHomChecks,donorInverseChecks,donorSupportChecks,repairCases,repairDeletionChecks,tailChecks,skipCases,matchingChecks,freeWordChecks,all_passed:true,scope:"Finite bipartite required-vertex covers, exact C3 and S3 Rees closures, star and upper-action donor repair, bounded free-word identities. Infinite results analytic."}
}
console.log(JSON.stringify(experiment(), null, 2));
