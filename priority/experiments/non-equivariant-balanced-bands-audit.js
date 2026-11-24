// Non-equivariant rectangular-band construction: surjective coordinate maps,
// trivial unit actions, all row/column coverage, and exact generating polynomials.
function audit(){
 const assert=(b,m)=>{if(!b)throw Error(m)},range=n=>Array.from({length:n},(_,i)=>i),sort=S=>[...new Set(S)].sort((a,b)=>a-b);
 const C=(n,k)=>{if(k<0||k>n)return 0n;let z=1n;for(let i=1;i<=k;i++)z=z*BigInt(n-i+1)/BigInt(i);return z;};
 const conv=(a,b)=>{let c=Array(a.length+b.length-1).fill(0n);a.forEach((x,i)=>b.forEach((y,j)=>c[i+j]+=x*y));return c;};
 const trim=a=>{while(a.length>1&&a.at(-1)===0n)a.pop();return a;};
 const same=(a,b)=>String(trim(a.slice()))===String(trim(b.slice()));
 const lead=a=>a.findIndex(x=>x!==0n);
 const binom=n=>range(n+1).map(k=>C(n,k));
 const coverPolys=(u,v)=>{
  const N=u*v,I=range(N),full=(1<<N)-1,good=mask=>{
   let rows=0,cols=0;for(let i of I)if(mask&(1<<i)){rows|=1<<Math.floor(i/v);cols|=1<<(i%v);}
   return rows===(1<<u)-1&&cols===(1<<v)-1;
  };
  let G=Array(N+1).fill(0n),H=G.slice(),checks=0;
  for(let mask=0;mask<=full;mask++){checks++;if(!good(mask))continue;let S=I.filter(i=>mask&(1<<i));G[S.length]++;if(S.every(i=>!good(mask^(1<<i))))H[S.length]++;}
  const r=Math.max(u,v),lo=Math.min(u,v),surj=range(lo+1).reduce((a,k)=>a+(-1n)**BigInt(k)*C(lo,k)*BigInt(lo-k)**BigInt(r),0n);
  assert(lead(G)===r&&G[r]===surj&&H[r]===surj,"band rank/count");
  return {G,H,checks};
 };
 const tests=[
  {L:1,U:2,V:3,p:2,q:3,delta:0,plus:[1,3,4,4],minus:[2,2,2,6]},
  {L:1,U:2,V:3,p:3,q:3,delta:0,plus:[1,3,4,4],minus:[2,2,2,6]},
  {L:3,U:2,V:4,p:2,q:4,delta:0,plus:[1,3,3,3,4,4,8],minus:[2,2,2,2,6,6,6]},
  {L:3,U:2,V:4,p:2,q:4,delta:1,plus:[1,3,3,3,4,4,8],minus:[2,2,2,2,6,6,6]}
 ];
 let totals={tables:0,triples:0,metadataChecks:0,bandSubsets:0,closureChecks:0,coefficientChecks:0,zeroTranscriptChecks:0},results=[];
 for(const {L,U,V,p,q,delta,plus,minus} of tests){
  const b=plus.length,sizes=[...plus,...minus,...(delta?[1]:[])],S=[],add=(type,c=0,i=0,d=0)=>{S.push({type,c,i,d});return S.length-1},map=new Map(),put=(type,c,i,d=0)=>{let k=add(type,c,i,d);map.set([type,c,i,d].join(),k);return k;},get=(type,c,i,d=0)=>map.get([type,c,i,d].join());
  for(let g=0;g<3;g++)add("G",g);
  const A=range(U).flatMap(c=>range(p).map(i=>put("A",c,i)));
  const B=range(q).flatMap(i=>range(V).map(d=>put("B",d,i)));
  const dims=sizes.map(s=>{for(let u=1;u<=U;u++)if(s%u===0&&s/u<=V)return [u,s/u];throw Error("shape");});
  const layers=dims.map(([u,v],l)=>range(u).flatMap(c=>range(v).map(d=>put("T",c,l,d))));
  const z=add("z"),K=[...layers.flat(),z],ks=new Set(K),n=S.length,I=range(n),m=p*q-delta,free=range(p*q).slice(delta);
  assert(m>=b,"enough free positions");
  const make=W=>I.map(x=>I.map(y=>{
   let X=S[x],Y=S[y];
   if(X.type==="G"&&Y.type==="G")return (x+y)%3;
   if(X.type==="G")return y;if(Y.type==="G")return x;
   if(X.type==="A"&&Y.type==="A")return get("A",X.c,Y.i);
   if(X.type==="B"&&Y.type==="B")return get("B",Y.c,X.i);
   if(X.type==="A"&&Y.type==="B"){let l=W[X.i*q+Y.i];return l<0?z:get("T",X.c%dims[l][0],l,Y.c%dims[l][1]);}
   if(X.type==="A"&&Y.type==="T")return get("T",X.c%dims[Y.i][0],Y.i,Y.d);
   if(X.type==="T"&&Y.type==="B")return get("T",X.c,X.i,Y.c%dims[X.i][1]);
   return z;
  }));
  const modes=[range(b),range(b).map(i=>b+i)],patterns=[];
  for(let mode=0;mode<2;mode++){
   let labels=modes[mode];
   // Opposite cases with sparse active slots, rotations, reversals and dense assignments.
   for(let shift=0;shift<m;shift++){
    let W=Array(p*q).fill(-1);if(delta)W[0]=2*b;
    labels.forEach((l,i)=>W[free[(i+shift)%m]]=l);patterns.push({mode,W});
   }
   let W=Array(p*q).fill(-1);if(delta)W[0]=2*b;free.forEach((k,i)=>W[k]=labels[(m-i)%b]);patterns.push({mode,W});
  }
  const metadata=T=>{
   const R=I.map(x=>sort(T[x])),L=I.map(y=>sort(I.map(x=>T[x][y]))),J=I.map(x=>sort(L[x].flatMap(y=>R[y])));
   const fixed=new Set();for(const v of I)if(J[v].length<n)for(const x of J[v])for(const y of J[v])fixed.add(x*n+y);
   const entries=I.flatMap(x=>I.filter(y=>x<3||y<3||ks.has(x)||ks.has(y)||fixed.has(x*n+y)).map(y=>[x,y,T[x][y]]));
   return JSON.stringify({R,L,J,entries,Q:T.map(row=>row.map(x=>ks.has(x)?z:x)),reg:I.map(x=>I.some(y=>T[T[x][y]][x]===x)),idem:I.map(x=>T[x][x]===x)});
  };
  const aP=coverPolys(U,p),bP=coverPolys(q,V);totals.bandSubsets+=aP.checks+bP.checks;
  // C3 generating subsets: any set containing 1 or 2; two singleton minimal choices.
  const F=conv(conv([0n,2n,3n,1n],aP.G),bP.G),Hfix=conv(conv([0n,2n],aP.H),bP.H);
  const polys=mode=>{
   let G=F.slice(),H=Hfix.slice(),missing=layers.filter((_,i)=>i<2*b&&!modes[mode].includes(i));
   for(const layer of missing){let f=binom(layer.length);f[0]=0n;G=conv(G,f);H=conv(H,[0n,BigInt(layer.length)]);}
   const optional=n-3-A.length-B.length-missing.reduce((a,x)=>a+x.length,0);
   return {G:conv(G,binom(optional)),H};
  };
  const P0=polys(0),P1=polys(1),rk=lead(P0.G);
  assert(rk===lead(P1.G)&&rk===1+Math.max(U,p)+Math.max(q,V)+b,"rank");
  assert(same(P0.H,P1.H),"full minimal enumerator");
  for(let j=0;j<=L;j++){assert(P0.G[rk+j]===P1.G[rk+j],"matching coefficients");totals.coefficientChecks++;}
  const base=metadata(make(patterns[0].W));
  function closure(T,subset){const C=new Set(subset);let change=true;while(change){change=false;for(const x of C)for(const y of C)if(!C.has(T[x][y])){C.add(T[x][y]);change=true;}}return C;}
  for(const {mode,W} of patterns){
   const T=make(W);totals.tables++;
   assert(metadata(T)===base,"identical strong structural data");totals.metadataChecks++;
   for(const x of I)for(const y of I){
    assert(T[0][x]===x&&T[x][0]===x,"identity");
    for(const t of I){assert(T[T[x][y]][t]===T[x][T[y][t]],"associativity");totals.triples++;}
   }
   let missing=layers.filter((_,i)=>i<2*b&&!modes[mode].includes(i));
   let E=I.filter(t=>!I.some(x=>x!==t&&I.some(y=>y!==t&&T[x][y]===t)));
   assert(String(E)===String(missing.filter(l=>l.length===1).flat()),"E");
   const good=SS=>[1,2].some(x=>SS.has(x))&&range(U).every(c=>A.some(x=>S[x].c===c&&SS.has(x)))&&range(p).every(i=>A.some(x=>S[x].i===i&&SS.has(x)))&&range(q).every(i=>B.some(x=>S[x].i===i&&SS.has(x)))&&range(V).every(d=>B.some(x=>S[x].c===d&&SS.has(x)))&&missing.every(l=>l.some(x=>SS.has(x)));
   let choices=[1,...A,...B,...missing.map(l=>l[0])];
   let samples=[choices,I,[],...choices.map(t=>choices.filter(x=>x!==t)),...I.map(t=>I.filter(x=>x!==t))];
   for(let i=0;i<16;i++){let state=(i+1)*7919;let sample=I.filter(x=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state%100<70;});samples.push(sample);}
   for(const SS of samples){assert((closure(T,SS).size===n)===good(new Set(SS)),"generation criterion");totals.closureChecks++;}
   // All elements in each absent layer indispensable only as a block:
   // fixed metadata includes all proper principal products, even when W differs.
  }
  for(let mask=0;mask<2**m;mask++){
   const rest=free.filter((_,i)=>!(mask&(1<<i)));
   if(rest.length>=b)for(let mode=0;mode<2;mode++){let W=Array(p*q).fill(-1);if(delta)W[0]=2*b;modes[mode].forEach((l,i)=>W[rest[i]]=l);assert(free.every((x,i)=>!(mask&(1<<i))||W[x]===-1)&&modes[mode].every(l=>W.includes(l)),"zero-transcript completion");}
   totals.zeroTranscriptChecks++;
  }
  results.push({L,U,V,p,q,delta,n,m,b,dims,rank:rk,coefficients:P0.G.slice(rk,rk+L+1).map(String),tables:patterns.length,promisedCost:m-b+1});
 }
 return {totals,results};
}
console.log(JSON.stringify(audit(),null,2));