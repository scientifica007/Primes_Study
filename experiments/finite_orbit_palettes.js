'use strict';
function experiment(){
 const ok=(x,m)=>{if(!x)throw Error(m)};
 const ps=[[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]];
 const s3=(a,b)=>ps.findIndex(p=>p.every((v,i)=>v===ps[a][ps[b][i]]));
 let rng=83291;const rnd=n=>{rng=(Math.imul(rng,1664525)+1013904223)>>>0;return Math.floor(rng/4294967296*n)};
 let models=0,bases=0,orbitChecks=0,tripleChecks=0,closureChecks=0,deletionChecks=0,substitutionChecks=0,paletteChecks=0;
 for(const G of [2,3,6])for(const upper of [false,true]){
  const gm=G===6?s3:(a,b)=>(a+b)%G,R=upper?8:4,N=R*R*G;
  const id=(i,g,l)=>(i*G+g)*R+l,dec=x=>[Math.floor(x/(G*R)),Math.floor(x/R)%G,x%R];
  const type=i=>Math.floor(i/(upper?4:2)),height=i=>upper?(i>>1)&1:0;
  const move=(m,i)=>upper?4*type(i)+2*Math.min(m,height(i))+(i&1):i;
  const P=(l,i)=>type(l)&&type(i)?1:0,U=upper?[N,N+1]:[];
  const mul=(a,b)=>{if(a>=N&&b>=N)return Math.min(a,b);if(a>=N){const [i,g,l]=dec(b);return id(move(a-N,i),g,l)}if(b>=N){const [i,g,l]=dec(a);return id(i,g,move(b-N,l))}const [i,g,l]=dec(a),[j,h,m]=dec(b);return id(i,gm(gm(g,P(l,j)),h),m)};
  const close=X=>{let seeds=[...new Set([...U,...X])],s=new Set(seeds),q=[...s];for(let j=0;j<q.length;j++)for(let b of seeds){let z=mul(q[j],b);if(!s.has(z)){s.add(z);q.push(z)}}return s};
  const f=(x,k)=>{if(x>=N)return x;const [i,g,l]=dec(x);return id(i^(k&1),g,l^((k>>1)&1))};
  for(let x=0;x<N+U.length;x++)for(let y=0;y<N+U.length;y++)for(let k of [1,2]){
   ok(f(mul(x,y),k)===mul(f(x,k),f(y,k)),"twin automorphism");
  }
  for(let trial=0;trial<4;trial++){
   let order=Array.from({length:N},(_,i)=>i);for(let i=N-1;i>0;i--){let j=rnd(i+1);[order[i],order[j]]=[order[j],order[i]]}
   let A=[];for(let x of order){A.push(x);if(close(A).size===N+U.length)break}
   for(let x of A.slice())if(close(A.filter(y=>y!==x)).size===N+U.length)A=A.filter(y=>y!==x);
   const S=new Set(A);
   for(let x=0;x<N;x++){if(f(x,1)<x||f(x,2)<x)continue;ok([0,1,2,3].filter(k=>S.has(f(x,k))).length<=2,"three corners impossible");orbitChecks++}
   let B=A.map(x=>f(x,1)),C=A.map(x=>f(x,2));
   ok(!A.some(x=>B.includes(x)&&C.includes(x)),"triple intersection");tripleChecks++;
   for(let X of [A,B,C]){ok(close(X).size===N+U.length,"generation");closureChecks++;for(let x of X){ok(!close(X.filter(y=>y!==x)).has(x),"necessity");deletionChecks++}}
   for(let target of order.slice(0,Math.min(5,N))){
    let W=new Set();
    for(let k=0;k<4;k++){let t=f(target,k),D=A.slice();for(let x of D.slice())if(close(D.filter(y=>y!==x)).has(t))D=D.filter(y=>y!==x);
     ok(close(D).has(t),"target support");for(let x of D)for(let j=0;j<4;j++)W.add(f(x,j));
    }
    for(let k=0;k<4;k++){ok(close(A.map(x=>f(x,k)).filter(x=>W.has(x))).has(target),"orbit palette");paletteChecks++}
   }
   for(let x of order.slice(0,Math.min(10,N))){let [i,g,l]=dec(x),b=f(x,2),c=f(x,1),power=b;let k=1;while(power!==id(i,Array.from({length:G},(_,z)=>z).find(z=>gm(P(l,i),z)===0),l^1)){power=mul(power,b);k++;ok(k<=G,"local idempotent power")}
    ok(mul(power,c)===x,"corner recovery with finite local order");substitutionChecks++;
   }
   bases++;
  }
  models++;
 }
 const allow=(mask,a,b)=>{for(let i=0;i<4;i++)if((mask>>i&1)&&(mask>>(i^(a|(b<<1)))&1))return false;return true};
 const masks=Array.from({length:16},(_,i)=>i).filter(i=>[0,1,2,3].filter(k=>i>>k&1).length<=2);
 function clauses(mask,r,c){let out=[];for(let a=0;a<2;a++)for(let b=0;b<2;b++)if(!allow(mask,a,b))out.push([[r,1-a],[c,1-b]]);return out}
 const sat=(n,cs)=>{let E=Array.from({length:2*n},()=>[]),lit=x=>2*x[0]+x[1];for(let [u,v] of cs){let a=lit(u),b=lit(v);E[a^1].push(b);E[b^1].push(a)}
  const reach=a=>{let s=new Set([a]),q=[a];for(let i=0;i<q.length;i++)for(let b of E[q[i]])if(!s.has(b)){s.add(b);q.push(b)}return s};
  for(let i=0;i<n;i++)if(reach(2*i).has(2*i+1)&&reach(2*i+1).has(2*i))return false;return true};
 let booleanCases=0,booleanAssignments=0,booleanUnsat=0,booleanSat=0;
 for(let trial=0;trial<1500;trial++){
  let constraints=Array.from({length:1+rnd(14)},()=>[masks[rnd(masks.length)],rnd(3),3+rnd(3)]),cs=constraints.flatMap(([m,r,c])=>clauses(m,r,c)),exists=false;
  for(let v=0;v<64;v++){let direct=constraints.every(([m,r,c])=>allow(m,v>>r&1,v>>c&1));let formula=cs.every(cl=>cl.some(([i,b])=>(v>>i&1)===b));ok(direct===formula,"Boolean equivalence");if(direct)exists=true;booleanAssignments++}
  ok(exists===sat(6,cs),"2SAT criterion");if(exists)booleanSat++;else booleanUnsat++;booleanCases++;
 }
 const A=[[0,1,2],[0,1,3],[2,2,0],[3,2,0],[0,3,1],[1,3,0]];
 for(let n=0;n<3;n++){let j=4+2*n;A.push([j,-n-1,j],[j+1,-n-1,j+1])}
 const key=x=>x.join(","),S=new Set(A.map(key));
 const flip=(x,m)=>[x[0]^((m>>(x[0]>>1))&1),x[1],x[2]^((m>>(5+(x[2]>>1)))&1)];
 let motifAssignments=0,motifPrivateChecks=0,motifWordChecks=0;
 for(let x of A){ok(A.filter(y=>y[0]===x[0]).length===1||A.filter(y=>y[2]===x[2]).length===1,"private position");motifPrivateChecks++}
 for(let m=0;m<1024;m++){ok(A.some(x=>S.has(key(flip(x,m)))),"no twin-flip disjoint image");motifAssignments++}
 const R=new Set(A.map(x=>key([x[0]^1,x[1],x[2]]))),C=new Set(A.map(x=>key([x[0],x[1],x[2]^1])));ok(!A.some(x=>R.has(key(x))&&C.has(key(x))),"motif triple");
 const red=w=>{let s=[];for(let x of w){if(s.at(-1)===-x)s.pop();else s.push(x)}return s};
 for(let i=0;i<10;i++)for(let l=0;l<10;l++)for(let w of [[1,2,-3],[2,-1,3,2],[],[3,3,-2]]){
  let a=A.find(x=>x[0]===i),b=A.find(x=>x[2]===l),middle=[-a[1],...w,-b[1]],word=[a,...middle.map(g=>A.find(x=>x[1]===g)),b];
  ok(word.every(Boolean)&&word[0][0]===i&&word.at(-1)[2]===l&&JSON.stringify(red(word.map(x=>x[1])))===JSON.stringify(red(w)),"positive word reconstruction");motifWordChecks++;
 }
 return {study:55,models,bases,orbitChecks,tripleChecks,closureChecks,deletionChecks,substitutionChecks,paletteChecks,booleanCases,booleanAssignments,booleanSat,booleanUnsat,motifAssignments,motifPrivateChecks,motifWordChecks,all_passed:true,scope:"Exact finite Rees closure, upper min actions, twin automorphisms, finite orbit palettes and Boolean constraints; reduced free-word identities for a restricted-symmetry obstruction. General infinite results proved analytically."};
}
console.log(JSON.stringify(experiment(), null, 2));
