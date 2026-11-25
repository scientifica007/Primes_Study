'use strict';
function experiment(){
 const ok=(v,m)=>{if(!v)throw Error(m)};
 const ps=[[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]],s3=(a,b)=>ps.findIndex(p=>p.every((v,i)=>v===ps[a][ps[b][i]]));
 let rng=37291;const rnd=n=>{rng=(Math.imul(rng,1664525)+1013904223)>>>0;return Math.floor(rng/4294967296*n)};
 let models=0,bases=0,automorphismChecks=0,starChecks=0,rowPrivateChecks=0,columnPrivateChecks=0,sourceChecks=0,tripleChecks=0,repairCases=0,nonemptyRepairs=0,repairDeletionChecks=0,repairChanges=0;
 for(const G of [2,3,6])for(const upper of [false,true]){
  const gm=G===6?s3:(a,b)=>(a+b)%G,H=upper?2:1,positions=[];
  for(let t=0;t<3;t++)for(let h=0;h<H;h++)for(let b=0;b<=t;b++)positions.push([t,h,b]);
  const R=positions.length,N=R*R*G,idx=(t,h,b)=>positions.findIndex(p=>p[0]===t&&p[1]===h&&p[2]===b);
  const move=(m,i)=>{let [t,h,b]=positions[i];return idx(t,Math.min(m,h),b)},cycle=i=>{let [t,h,b]=positions[i];return idx(t,h,(b+1)%(t+1))};
  const same=(i,j)=>positions[i][0]===positions[j][0]&&positions[i][1]===positions[j][1];
  const P=(l,i)=>positions[l][0]===positions[i][0]&&positions[i][0]!==0?1:0,U=upper?[N,N+1]:[];
  const id=(i,g,l)=>(i*G+g)*R+l,dec=x=>[Math.floor(x/(G*R)),Math.floor(x/R)%G,x%R];
  const mul=(a,b)=>{if(a>=N&&b>=N)return Math.min(a,b);if(a>=N){let [i,g,l]=dec(b);return id(move(a-N,i),g,l)}if(b>=N){let [i,g,l]=dec(a);return id(i,g,move(b-N,l))}let [i,g,l]=dec(a),[j,h,m]=dec(b);return id(i,gm(gm(g,P(l,j)),h),m)};
  const f=(x,c)=>{if(x>=N)return x;let [i,g,l]=dec(x);return id(c===1?cycle(i):i,g,c===2?cycle(l):l)};
  const close=X=>{let seeds=[...new Set([...U,...X])],s=new Set(seeds),q=[...s];for(let k=0;k<q.length;k++)for(let b of seeds){let z=mul(q[k],b);if(!s.has(z)){s.add(z);q.push(z)}}return s};
  for(let x=0;x<N+U.length;x++)for(let y=0;y<N+U.length;y++)for(let c of [1,2]){ok(f(mul(x,y),c)===mul(f(x,c),f(y,c)),"partial symmetry");automorphismChecks++}
  for(let trial=0;trial<3;trial++){
   let order=Array.from({length:N},(_,i)=>i);for(let j=N-1;j>0;j--){let k=rnd(j+1);[order[j],order[k]]=[order[k],order[j]]}
   let A=[];for(let x of order){A.push(x);if(close(A).size===N+U.length)break}
   for(let x of A.slice())if(close(A.filter(y=>x!==y)).size===N+U.length)A=A.filter(y=>x!==y);
   let B=A.map(x=>f(x,1)),C=A.map(x=>f(x,2)),F=A.filter(x=>B.includes(x)&&C.includes(x)),fixed=0,sourceCount=positions.filter(p=>p[1]===H-1).length;
   for(let a of A){let [i,g,l]=dec(a),rn=A.some(x=>{let [j,h,m]=dec(x);return x!==a&&same(i,j)&&g===h&&l===m}),cn=A.some(x=>{let [j,h,m]=dec(x);return x!==a&&i===j&&g===h&&same(l,m)});ok(!(rn&&cn),"star");starChecks++;
    let D=close(A.filter(x=>x!==a)),rows=new Set(),cols=new Set();for(let x of D)if(x<N){let [j,,m]=dec(x);rows.add(j);cols.add(m)}
    if(rn){ok(!rows.has(i),"private row");rowPrivateChecks++;ok(positions[i][1]===H-1,"source row");sourceChecks++}
    if(cn){ok(!cols.has(l),"private column");columnPrivateChecks++;ok(positions[l][1]===H-1,"source column");sourceChecks++}
    if(cycle(i)===i&&cycle(l)===l)fixed++;
   }
   for(let x of F){let [i,,l]=dec(x);ok(cycle(i)===i||cycle(l)===l,"residual location")}
   ok(F.length<=fixed+2*sourceCount,"residual bound");tripleChecks++;
   let forbidden=new Set(A.filter(x=>C.includes(x))),allowed=order.filter(x=>!forbidden.has(x));
   if(close(allowed).size===N+U.length){
    let D=B.filter(x=>!forbidden.has(x));for(let x of allowed){if(close(D).size===N+U.length)break;if(!D.includes(x))D.push(x)}
    for(let x of D.slice())if(close(D.filter(y=>x!==y)).size===N+U.length)D=D.filter(y=>x!==y);
    ok(close(D).size===N+U.length&&!D.some(x=>forbidden.has(x)),"repair");
    for(let x of D){ok(!close(D.filter(y=>x!==y)).has(x),"repair necessity");repairDeletionChecks++}
    repairCases++;if(F.length)nonemptyRepairs++;repairChanges+=B.filter(x=>!D.includes(x)).length+D.filter(x=>!B.includes(x)).length;
   }
   bases++;
  }
  models++;
 }
 let masks=0,starForests=0,derangementChecks=0;
 for(let r of [2,3])for(let c of [2,3])for(let m=0;m<1<<(r*c);m++){
  const edges=Array.from({length:r*c},(_,i)=>i).filter(i=>m>>i&1),row=x=>Math.floor(x/c),col=x=>x%c;
  const valid=edges.every(x=>!(edges.some(y=>x!==y&&row(x)===row(y))&&edges.some(y=>x!==y&&col(x)===col(y))));
  let stars=true,visited=new Set();
  for(let x of edges){if(visited.has(x))continue;let q=[x];visited.add(x);for(let j=0;j<q.length;j++)for(let y of edges)if(!visited.has(y)&&(row(q[j])===row(y)||col(q[j])===col(y))){visited.add(y);q.push(y)}if(new Set(q.map(row)).size>1&&new Set(q.map(col)).size>1)stars=false}
  ok(valid===stars,"star forest equivalence");masks++;
  if(valid){starForests++;let R=new Set(edges.map(x=>((row(x)+1)%r)*c+col(x))),C=new Set(edges.map(x=>row(x)*c+(col(x)+1)%c));ok(!edges.some(x=>R.has(x)&&C.has(x)),"cyclic triple");derangementChecks++}
 }
 let targetedPrivateChecks=0,targetedRecoveryChecks=0;
 for(let swap of [false,true]){
  const a=[0,1,0],b=swap?[0,1,1]:[1,1,0],d=[0,0,0],mul=(x,y)=>[x[0],x[1]^y[1],y[2]],key=x=>x.join(",");
  const close=X=>{let q=X.slice(),s=new Set(q.map(key));for(let j=0;j<q.length;j++)for(let z of X){let y=mul(q[j],z);if(!s.has(key(y))){s.add(key(y));q.push(y)}}return q};
  ok(close([a,b]).length===4,"targeted full basis");
  for(let x of [a,b]){let D=close([x===a?b:a]);ok(D.every(y=>y[swap?2:0]!==x[swap?2:0]),"targeted private source");targetedPrivateChecks++}
  const word=swap?[b,b,b,d]:[d,b,b,b];ok(key(word.reduce(mul))===key(a),"coordinate donor removes private necessity");targetedRecoveryChecks++;
 }
 let crossChecks=0,partialOverlapChecks=0;
 for(let n=1;n<=30;n++){const A=[["*","e","*"]],rowflip=i=>i.startsWith("M")?i.slice(0,-1)+(i.endsWith("0")?"1":"0"):i;
  for(let k=0;k<n;k++)for(let t=0;t<3;t++){let i=t===0?`F${k}`:`M${k}:${t-1}`,l=t===1?`F${k}`:`M${k}:${t===0?0:1}`;for(let s of ["+","-"])A.push([i,s+":"+k+":"+t,l])}
  const key=x=>x.join("|"),B=new Set(A.map(([i,g,l])=>key([rowflip(i),g,l]))),C=new Set(A.map(([i,g,l])=>key([i,g,rowflip(l)])));
  ok(new Set(A.map(x=>x[0])).size===3*n+1&&new Set(A.map(x=>x[2])).size===3*n+1,"coverage");crossChecks++;
  ok(A.filter(x=>B.has(key(x))).length===2*n+1&&A.filter(x=>C.has(key(x))).length===2*n+1&&A.filter(x=>B.has(key(x))&&C.has(key(x))).length===1,"partial overlap");partialOverlapChecks++;
 }
 return {study:56,models,bases,automorphismChecks,starChecks,rowPrivateChecks,columnPrivateChecks,sourceChecks,tripleChecks,repairCases,nonemptyRepairs,repairDeletionChecks,repairChanges,masks,starForests,derangementChecks,targetedPrivateChecks,targetedRecoveryChecks,crossChecks,partialOverlapChecks,all_passed:true,scope:"Finite positive Rees closure with mixed blocks of sizes 1,2,3, nontrivial P, C2/C3/S3 and optional min actions; all small occupation masks; targeted private row/column and donor examples; finite prefixes of infinite cross-placement construction. Infinite source argument and finite repair proved analytically."};
}
console.log(JSON.stringify(experiment(), null, 2));
