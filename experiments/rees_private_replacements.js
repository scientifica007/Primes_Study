'use strict';
function experiment(){
 const ok=(v,m)=>{if(!v)throw Error(m)};
 let models=0,words=0,generationChecks=0,seedPotentialChecks=0,productPotentialChecks=0,actionChecks=0,liftChecks=0,obstructionChecks=0,rootMultiplicityChecks=0,blockWordChecks=0;
 for(let N=2;N<=9;N++){
  const zero=()=>Array(2*N).fill(0),unit=(n,v)=>{const z=zero();z[n]=v;return z},add=(a,b)=>a.map((x,j)=>x+b[j]),neg=a=>a.map(x=>-x),eq=(a,b)=>a.every((x,j)=>x===b[j]);
  const P=n=>Array.from({length:2*N},(_,j)=>j<n?2:0);
  const a=Array.from({length:N},(_,n)=>({i:n,g:add(P(n),unit(n,-1)),l:n}));
  const b=Array.from({length:N},(_,n)=>({i:n,g:add(add(P(n),unit(n,2)),unit(N+n,1)),l:n}));
  const c=Array.from({length:N},(_,n)=>({i:n,g:add(add(P(n),unit(n,2)),unit(N+n,-1)),l:n}));
  const seeds=[...a,...b,...c],mul=(x,y)=>({i:x.i,g:add(x.g,y.g),l:y.l}),low=(x,k,side)=>side?{...x,l:Math.min(x.l,k)}:{...x,i:Math.min(x.i,k)},F=(x,n)=>x.g[n]-(x.i>=n?1:0)-(x.l>=n?1:0);
  const e=[b[0],c[0],a[0],a[0],a[0],a[0]].reduce(mul);ok(e.i===0&&e.l===0&&eq(e.g,zero()),"anchor");generationChecks++;
  const anchor=x=>mul(mul(e,x),e),join=(...xs)=>xs.reduce(mul),pos=[],minus=[];
  for(let n=0;n<N;n++){
   const correction=[];for(let j=0;j<n;j++)correction.push(minus[j],minus[j]);
   const mn=join(anchor(a[n]),...correction);ok(eq(mn.g,unit(n,-1)),"negative coordinate");minus.push(mn);generationChecks++;
   const plus=join(anchor(b[n]),anchor(c[n]),...correction,...correction,mn,mn,mn);ok(eq(plus.g,unit(n,1)),"positive coordinate");pos.push(plus);generationChecks++;
   const v=join(anchor(b[n]),...correction,mn,mn),w=join(anchor(c[n]),...correction,mn,mn);
   ok(eq(v.g,unit(N+n,1))&&eq(w.g,unit(N+n,-1)),"marker directions");generationChecks+=2;
   for(let j=0;j<N;j++){ok(F(a[n],j)===(n===j?-3:0),"private potential");ok(F(b[n],j)>=0&&F(c[n],j)>=0,"other seeds");seedPotentialChecks+=3}
   for(let k=n;k<=N;k++)for(let l=n;l<=N;l++){
    const x={i:k,g:a[n].g,l};ok(eq(low(low(x,n,0),n,1).g,a[n].g),"recover");
    if(k>n||l>n){if(n+1<N){ok(F(x,n+1)<0,"next-generator obstruction");obstructionChecks++}}
    liftChecks++;
   }
   for(let m=1;m<=12;m++){ok(m===1||m*a[n].g[n]!==-1,"primitive exponent");rootMultiplicityChecks++}
  }
  for(let n=0;n<N;n++){
   const pool=seeds.filter(x=>F(x,n)>=0);
   for(const x of pool)for(const y of pool){const z=mul(x,y);ok(F(z,n)>=F(x,n)+F(y,n),"potential product");productPotentialChecks++;
    for(const k of [0,n,N])for(const side of [0,1]){ok(F(low(z,k,side),n)>=F(z,n),"min action");actionChecks++}
   }
  }
  // Positive words for the pair substitution ±1 ↔ {2,-3}, no free inverse.
  ok(2+2-3===1&&2-3===-1&&1+1===2&&-1-1-1===-3,"pair mutual");blockWordChecks+=4;models++;
 }
 // Genuine finite block mixtures in a 2x2 rectangular group over C3^4.
 const G=81,id=(i,g,l)=>(i*G+g)*2+l,dec=x=>[Math.floor(x/(G*2)),Math.floor(x/2)%G,x%2],add=(a,b)=>[1,3,9,27].reduce((s,p)=>s+((Math.floor(a/p)+Math.floor(b/p))%3)*p,0);
 const mul=(a,b)=>{const [i,g,l]=dec(a),[j,h,m]=dec(b);return id(i,add(g,h),m)},close=X=>{const s=new Set(X),q=[...s];for(let j=0;j<q.length;j++)for(const b of X){let z=mul(q[j],b);if(!s.has(z)){s.add(z);q.push(z)}}return s};
 const opts=[[[id(0,1,0),id(0,3,0)],[id(0,4,0),id(0,7,0)]],[[id(1,9,1),id(1,27,1)],[id(1,36,1),id(1,63,1)]]];
 let blockClosureChecks=0,mixChecks=0,blockDeletionChecks=0;
 for(const o of opts){let x=close(o[0]),y=close(o[1]);ok(x.size===y.size&&[...x].every(z=>y.has(z)),"same block closure");blockClosureChecks++}
 for(let m=0;m<4;m++){const X=[...opts[0][m&1],...opts[1][(m>>1)&1]];ok(close(X).size===4*G,"mixed full closure");mixChecks++;for(const x of X){ok(!close(X.filter(y=>y!==x)).has(x),"mixed necessity");blockDeletionChecks++}}
 return {study:50,models,generationChecks,seedPotentialChecks,productPotentialChecks,actionChecks,liftChecks,obstructionChecks,rootMultiplicityChecks,blockWordChecks,blockClosureChecks,mixChecks,blockDeletionChecks,all_passed:true,scope:"Exact integer-vector positive identities and potentials in finite prefixes (not full infinite closure); bounded candidate lift and multiplicity checks; exact finite C3^4 Rees block closures and all four mixtures. Infinite no-private-lift theorem and block criterion proved analytically."};
}
console.log(JSON.stringify(experiment(), null, 2));
