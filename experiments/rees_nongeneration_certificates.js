'use strict';
function experiment(){
 const ok=(x,m)=>{if(!x)throw Error(m)},close=(seeds,mul)=>{const s=new Set(seeds),q=[...s];for(let j=0;j<q.length;j++)for(const b of seeds){const z=mul(q[j],b);if(!s.has(z)){s.add(z);q.push(z)}}return s};
 let models=0,subsets=0,bases=0,profileChecks=0,productChecks=0,supportChecks=0,emptyProfileNotGenerated=0,cellChecks=0;
 for(const G of [2,3])for(let p=0;p<G;p++){
  const N=4*G,id=(i,g,l)=>(i*G+g)*2+l,dec=x=>[Math.floor(x/(2*G)),Math.floor(x/2)%G,x%2],mul=(a,b)=>{const [i,g,l]=dec(a),[j,h,m]=dec(b);return id(i,(g+h+(l&&j?p:0))%G,m)};
  const elems=Array.from({length:N},(_,i)=>i);
  for(let mask=0;mask<1<<N;mask++){
   const A=elems.filter(i=>mask&(1<<i)),C=close(A,mul);subsets++;
   const K=Array.from({length:2},()=>Array.from({length:2},()=>new Set()));
   for(const z of C){const [i,g,l]=dec(z);K[i][l].add(g)}
   for(const a of C)for(const b of C){const [i,g,l]=dec(a),[j,h,m]=dec(b);ok(K[i][m].has((g+h+(l&&j?p:0))%G),"closed cell");cellChecks++}
   if(C.size!==N)continue;
   const del=A.map(a=>close(A.filter(b=>a!==b),mul));if(del.some(c=>c.size===N))continue;bases++;
   const prof=elems.map(x=>del.reduce((s,c,j)=>s|(c.has(x)?0:1<<j),0));
   for(let j=0;j<A.length;j++){ok(prof[A[j]]===1<<j,"private basis profile");profileChecks++}
   for(const x of elems)for(const y of elems){ok(!(prof[mul(x,y)]&~(prof[x]|prof[y])),"product profile");productChecks++}
   let meet=elems.map(()=>((1<<A.length)-1));
   for(let m=0;m<1<<A.length;m++){
    const D=A.filter((_,j)=>m&(1<<j)),cl=close(D,mul);
    for(const x of cl){meet[x]&=m;ok(!(prof[x]&~m),"support contains profile");supportChecks++}
   }
   for(const x of elems){ok(meet[x]===prof[x],"intersection of supports");profileChecks++;if(!prof[x])emptyProfileNotGenerated++}
  }models++;
 }
 let liftModels=0,homChecks=0,recoveryChecks=0,liftClosureChecks=0,liftDeletionChecks=0,disjointChecks=0;
 const ps=[[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]],s3=(a,b)=>ps.findIndex(p=>p.every((v,i)=>v===ps[a][ps[b][i]]));
 for(const G of [2,3,6])for(let p=0;p<Math.min(G,3);p++){
  const gm=G===6?s3:(a,b)=>(a+b)%G,R=6,N=R*G*R,id=(i,g,l)=>(i*G+g)*R+l,dec=x=>[Math.floor(x/(G*R)),Math.floor(x/R)%G,x%R],typ=i=>Math.floor(i/3),height=i=>i%3,at=(i,h)=>3*typ(i)+h,P=(l,i)=>typ(l)&&typ(i)?p:0,move=(m,i)=>at(i,Math.min(m,height(i)));
  const U=[N,N+1,N+2],mul=(a,b)=>{if(a>=N&&b>=N)return Math.min(a,b);if(a>=N){const [i,g,l]=dec(b);return id(move(a-N,i),g,l)}if(b>=N){const [i,g,l]=dec(a);return id(i,g,move(b-N,l))}const [i,g,l]=dec(a),[j,h,m]=dec(b);return id(i,gm(gm(g,P(l,j)),h),m)};
  const low=i=>at(i,Math.max(0,height(i)-1)),f=x=>{if(x>=N)return N+Math.max(0,x-N-1);const [i,g,l]=dec(x);return id(low(i),g,low(l))},lift=x=>{const [i,g,l]=dec(x);return id(i+1,g,l+1)};
  for(let a=0;a<N+3;a++)for(let b=0;b<N+3;b++){ok(f(mul(a,b))===mul(f(a),f(b)),"decrement homomorphism");homChecks++}
  const old=Array.from({length:N},(_,i)=>i).filter(x=>{const [i,,l]=dec(x);return height(i)<=1&&height(l)<=1});
  let A=old.slice();for(const a of old){const B=A.filter(b=>b!==a);if(close([...U,...B],mul).size===old.length+U.length)A=B}
  const B=A.map(lift);
  ok(B.every(b=>!A.includes(b)),"disjoint");disjointChecks++;
  for(let j=0;j<A.length;j++){const [i,,l]=dec(A[j]);ok(f(B[j])===A[j]&&mul(mul(N+height(i),B[j]),N+height(l))===A[j],"recovery");recoveryChecks++}
  ok(close([...A,...U],mul).size===old.length+U.length,"old closure");ok(close([...B,...U],mul).size===N+U.length,"new closure");liftClosureChecks+=2;
  for(const X of [A,B])for(const a of X){ok(!close([...U,...X.filter(b=>a!==b)],mul).has(a),"irredundance");liftDeletionChecks++}
  liftModels++;
 }
 const perm=(a)=>a.length===0?[[]]:a.flatMap((x,i)=>perm(a.filter((_,j)=>i!==j)).map(p=>[x,...p]));
 const S=perm([0,1,2,3,4]),par=p=>p.reduce((s,x,i)=>s+p.slice(i+1).filter(y=>y<x).length,0)%2;
 const A5=S.filter(p=>!par(p)),index=new Map(A5.map((p,i)=>[p.join(","),i])),mul=(a,b)=>index.get(A5[b].map(i=>A5[a][i]).join(",")),e=index.get("0,1,2,3,4"),s=index.get("1,2,0,3,4"),t=index.get("1,2,3,4,0");
 const full=close([s,t],mul),Cs=close([s],mul),Ct=close([t],mul);
 ok(full.size===60&&Cs.size===3&&Ct.size===5&&!Cs.has(t)&&!Ct.has(s),"A5 private subgroup");
 const inverse=a=>A5.findIndex((_,b)=>mul(a,b)===e),comm=[];
 for(let a=0;a<60;a++)for(let b=0;b<60;b++)comm.push(mul(mul(mul(a,b),inverse(a)),inverse(b)));
 ok(close([...new Set(comm)],mul).size===60,"A5 perfect");
 let modularChecks=0;for(let m=1;m<=100;m++){ok((m-1)%m===(((-1)%m)+m)%m,"finite cyclic image");modularChecks++}
 return {study:49,models,subsets,bases,profileChecks,productChecks,supportChecks,emptyProfileNotGenerated,cellChecks,liftModels,homChecks,recoveryChecks,liftClosureChecks,liftDeletionChecks,disjointChecks,A5Size:full.size,A5SingleSizes:[Cs.size,Ct.size],commutatorPairs:comm.length,modularChecks,all_passed:true,scope:"Exhaustive subsets in 2x2 Rees matrices over C2/C3; exact profile/support and product checks; finite height lift between different truncations; A5 subgroup and commutator computation; modular illustrations. Infinite shift and no finite quotient theorem proved analytically."};
}
console.log(JSON.stringify(experiment(), null, 2));
