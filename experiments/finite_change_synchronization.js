'use strict';
function experiment(){
 const ok=(v,m)=>{if(!v)throw Error(m)};
 const rank=(cols,n,p)=>{const a=cols.map(c=>c.slice());let k=0;for(let j=0;j<n;j++){let i=a.findIndex((r,t)=>t>=k&&r[j]!==0);if(i<0)continue;[a[i],a[k]]=[a[k],a[i]];let inv=1;while((inv*a[k][j])%p!==1)inv++;a[k]=a[k].map(x=>x*inv%p);for(let t=k+1;t<a.length;t++){let m=a[t][j];a[t]=a[t].map((x,l)=>(x-m*a[k][l]+p*p)%p)}k++}return k};
 let chainModels=0,chainMasks=0,chainRanks=0,parityChecks=0,cycleModels=0,cycleMasks=0,minorChecks=0,cycleDeletionChecks=0,finiteReesMixes=0,finiteReesDeletions=0,requests=0,certificates=0,extensions=0,certificateChecks=0;
 for(let n=2;n<=9;n++){let e=i=>Array.from({length:n+1},(_,j)=>i===j?1:0);
  for(let m=0;m<1<<n;m++){const cols=Array.from({length:n},(_,i)=>e(i).map((x,j)=>x^((m>>i&1)&&j===i+1?1:0)));
   ok(rank(cols,n+1,2)===n,"finite chain independent");ok(rank([...cols,e(n)],n+1,2)===n+1,"sentinel finite change basis");chainRanks+=2;
   if(m===(1<<n)-1){ok(cols.every(c=>c.reduce((a,b)=>a^b,0)===0),"even parity");for(let i=0;i<n;i++){ok(rank([...cols,e(i)],n+1,2)===n+1,"unit outside span");parityChecks++}}
   chainMasks++;
  }chainModels++;
 }
 for(let n=2;n<=8;n+=2){const e=i=>Array.from({length:n},(_,j)=>i===j?1:0);
  for(let m=0;m<1<<n;m++){
   const cols=Array.from({length:n},(_,i)=>e(i).map((x,j)=>(x+((m>>i&1)&&j===(i^1)?(i%2?2:1):0))%3));
   const F=Array.from({length:n},(_,i)=>i).filter(i=>m>>i&1),minor=F.map(i=>F.map(j=>cols[i][j]));
   ok(rank(minor,F.length,3)===F.length,"principal minor");minorChecks++;
   ok(rank(cols,n,3)===n,"cycle mix basis");cycleMasks++;
   for(let i=0;i<n;i++){ok(rank(cols.filter((_,j)=>i!==j),n,3)===n-1,"deletion");cycleDeletionChecks++}
  }cycleModels++;
 }
 // Exact positive-word closure in finite rectangular groups for paired cycles.
 for(let n of [2,4]){
  const G=3**n,N=n*n*G,pow=Array.from({length:n},(_,i)=>3**i),add=(a,b)=>pow.reduce((s,p)=>s+((Math.floor(a/p)+Math.floor(b/p))%3)*p,0);
  const id=(i,g,l)=>(i*G+g)*n+l,dec=x=>[Math.floor(x/(G*n)),Math.floor(x/n)%G,x%n],mul=(a,b)=>{const [i,g,l]=dec(a),[j,h,m]=dec(b);return id(i,add(g,h),m)};
  const close=X=>{const s=new Set(X),q=[...s];for(let i=0;i<q.length;i++)for(const b of X){let z=mul(q[i],b);if(!s.has(z)){s.add(z);q.push(z)}}return s};
  for(let m=0;m<1<<n;m++){const X=Array.from({length:n},(_,i)=>id(i,pow[i]+((m>>i&1)?(i%2?2:1)*pow[i^1]:0),i));ok(close(X).size===N,"Rees mixture generates");finiteReesMixes++;for(const x of X){ok(!close(X.filter(y=>y!==x)).has(x),"Rees deletion");finiteReesDeletions++}}
 }
 // Fusion on infinite chain represented by finite maps, not an artificial terminal.
 // k=3 options 0,1,2, shifted by 1 or 2. For a request (target,c), use
 // finite assignment already fixed and extend using original option for c
 // at the first unassigned block reached. Record the finite telescope.
 let state=918273;const rnd=n=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return Math.floor(state/4294967296*n)};
 const perms=[[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]];
 for(let trial=0;trial<30;trial++){
  let assigned=new Map(),saved=[];
  for(let i=0;i<8;i++){let n=rnd(60);assigned.set(n,perms[rnd(6)])}
  let req=Array.from({length:180},(_,i)=>[Math.floor(i/3),i%3]);
  for(let i=req.length-1;i>0;i--){let j=rnd(i+1);[req[i],req[j]]=[req[j],req[i]]}
  for(const [n,c] of req){let i=n,word=[];for(;;){if(!assigned.has(i)){assigned.set(i,perms.find(p=>p[c]===0));extensions++}let opt=assigned.get(i)[c];word.push([i,opt]);if(!opt)break;i+=opt;ok(word.length<=assigned.size+1,"finite stop")}
   saved.push({n,c,word});requests++;
  }
  for(const {n,c,word} of saved){const sum=new Set();const flip=i=>sum.has(i)?sum.delete(i):sum.add(i);
   for(const [i,opt] of word){ok(assigned.get(i)[c]===opt,"permanent assignment");flip(i);if(opt)flip(i+opt);certificateChecks++}
   ok(sum.size===1&&sum.has(n),"finite telescope");certificates++;
  }
  for(const p of assigned.values())ok(new Set(p).size===3,"permutation");
 }
 return {study:51,chainModels,chainMasks,chainRanks,parityChecks,cycleModels,cycleMasks,minorChecks,cycleDeletionChecks,finiteReesMixes,finiteReesDeletions,requests,certificates,extensions,certificateChecks,all_passed:true,scope:"Finite vector rank and principal-minor checks; exact positive-word Rees closure for paired cycles over F3; finite partial assignments on the natural-number chain with finite telescoping witnesses, without a fixed terminal. Infinite generation/failure, countable-piece decomposition and global Green assembly are analytic."};
}
console.log(JSON.stringify(experiment(), null, 2));
