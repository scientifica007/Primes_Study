// Node.js. Explicit families: first-entry sets, exact SCCs, translation injections and pairwise Hamming distances.
function audit(){
 const assert=(v,m)=>{if(!v)throw Error(m)},range=n=>Array.from({length:n},(_,i)=>i),sorted=x=>[...new Set(x)].sort((a,b)=>a-b),eq=(x,y)=>String(x)===String(y);
 const gcd=(a,b)=>b?gcd(b,a%b):a;
 function check(name,F,g,K,balanced,L=0){
  const n=F[0].length,I=range(n),G=I.slice(0,g),ks=new Set(K),A=I.filter(i=>i>=g&&!ks.has(i)),as=new Set(A),T0=F[0];
  const inv=G.map(u=>G.find(v=>T0[u][v]===0));
  const ideals=T=>{const R=I.map(x=>sorted(T[x])),LL=I.map(y=>sorted(I.map(x=>T[x][y]))),J=I.map(x=>sorted(LL[x].flatMap(y=>R[y])));return {R,LL,J}};
  const {R,LL,J}=ideals(T0),LC=I.map(x=>I.filter(y=>eq(LL[x],LL[y]))),RC=I.map(x=>I.filter(y=>eq(R[x],R[y]))),JC=I.map(x=>I.filter(y=>eq(J[x],J[y])));
  const reg=(T,x)=>I.some(y=>T[T[x][y]][x]===x),strict=(x,c)=>J[x].length>J[c].length&&J[x].includes(c);
  const fixed=new Set();for(let x of I)if(J[x].length<n)for(let u of J[x])for(let v of J[x])fixed.add(u*n+v);
  const E=T=>I.filter(t=>!I.some(x=>x!==t&&I.some(y=>y!==t&&T[x][y]===t)));
  const Cs=K.filter(x=>JC[x][0]===x&&!reg(T0,x)).map(x=>JC[x]);
  const at=(T,d)=>T[Math.floor(d/n)][d%n];
  const wit=(T,C)=>A.flatMap(x=>A.filter(y=>strict(x,C[0])&&strict(y,C[0])&&C.includes(T[x][y])).map(y=>x*n+y));
  const fullPresent=(T,C)=>I.some(x=>strict(x,C[0])&&I.some(y=>strict(y,C[0])&&C.includes(T[x][y])));
  const records=[];let triples=0;
  for(let T of F){assert(JSON.stringify(ideals(T))===JSON.stringify({R,LL,J}),"ideals");for(let x of I){assert(T[0][x]===x&&T[x][0]===x,"identity");assert(reg(T,x)===reg(T0,x)&&(T[x][x]===x)===(T0[x][x]===x),"regular/idempotent");for(let y of I){if(x<g||y<g||ks.has(x)||ks.has(y)||fixed.has(x*n+y)||!ks.has(T0[x][y]))assert(T[x][y]===T0[x][y],"fixed");else assert(ks.has(T[x][y]),"quotient");for(let z of I){assert(T[T[x][y]][z]===T[x][T[y][z]],"assoc");triples++;}}}
   const e=E(T);assert(e.every(t=>ks.has(t)),"exterior E must be empty");
   const present=Cs.map(C=>fullPresent(T,C)),missing=Cs.filter((_,i)=>!present[i]);
   const b=missing.length,P=missing.reduce((p,C)=>p*BigInt(C.length),1n),mom=range(L).map(i=>i+1).filter(j=>j===1||j%2===0).map(j=>String(missing.reduce((p,C)=>p+BigInt(C.length)**BigInt(j),0n)));
   records.push({T,e,present,sig:JSON.stringify([b,String(P),mom]),wits:Cs.map(C=>wit(T,C))});
  }
  if(balanced)assert(records.every(r=>r.sig===records[0].sig),"balanced statistics");
  const nonself=new Map(A.map(x=>[x,I.flatMap(u=>I.filter(v=>u!==x&&v!==x&&T0[u][v]===x).map(v=>[u,v]))]));
  let classSets=0,smallSinks=0,nonSingletonSmallSinks=0,translationBlocks=0,minNonSingleton=Infinity,minSingleton=Infinity,maxSmallBound=0;
  const hist={};
  for(let ci=0;ci<Cs.length;ci++){
   const C=Cs[ci];if(!records.some(r=>!r.present[ci]))continue;
   for(let r of records){if(!r.present[ci])continue;let D=r.wits[ci],ds=new Set(D);assert(D.length>=2,"at least two first-entry cells");if(C.length>1){assert(D.length>=4,"non-singleton four cells");minNonSingleton=Math.min(minNonSingleton,D.length);}else minSingleton=Math.min(minSingleton,D.length);classSets++;
    const adj=new Map(D.map(d=>[d,new Set()]));
    const edge=(d,p)=>{assert(ds.has(p),"closure");if(d!==p)adj.get(d).add(p)};
    for(let d of D){let x=Math.floor(d/n),y=d%n;for(let [u,v] of nonself.get(x)){let w=r.T[v][y];edge(d,ks.has(w)?v*n+y:u*n+w);}for(let [u,v] of nonself.get(y)){let w=r.T[x][u];edge(d,ks.has(w)?x*n+u:w*n+v);}for(let u of LC[x])edge(d,u*n+y);for(let v of RC[y])edge(d,x*n+v);}
    const reach=d=>{let S=new Set([d]),queue=[d];for(let u of queue)for(let v of adj.get(u))if(!S.has(v)){S.add(v);queue.push(v);}return S;};
    let visited=new Set();
    for(let d of D){if(visited.has(d))continue;let Q=reach(d),S=[...Q].filter(p=>reach(p).has(d));S.forEach(p=>visited.add(p));if(!S.every(p=>[...adj.get(p)].every(q=>S.includes(q))))continue;
     hist[S.length]=(hist[S.length]||0)+1;
     if(S.length!==2&&S.length!==3)continue;smallSinks++;
     const k=S.length,x=Math.floor(d/n),y=d%n,t=at(r.T,d),xs=sorted(S.map(p=>Math.floor(p/n))),ys=sorted(S.map(p=>p%n));
     assert(xs.length===k&&ys.length===k&&xs.every(x=>!ys.includes(x)),"small-sink injectivity and orientation");
     assert(eq(sorted(G.map(u=>r.T[x][u]*n+r.T[inv[u]][y])),sorted(S)),"balanced orbit");
     assert(S.every(p=>at(r.T,p)===t),"constant output");
     assert(G.every(u=>r.T[u][t]===t&&r.T[t][u]===t),"two-sided unit-fixed output");
     if(C.length>1)nonSingletonSmallSinks++;
     for(let side of ["left","right"]){
      const cls=side==="left"?LC[t]:RC[t],used=new Set();
      for(let v of cls){
       const p=I.find(p=>(side==="left"?r.T[p][t]:r.T[t][p])===v);assert(p!==undefined,"multiplier");
       for(let d0 of S){let a=Math.floor(d0/n),b=d0%n,w=side==="left"?r.T[p][a]:r.T[b][p],d1;
        if(ks.has(w))d1=side==="left"?p*n+a:b*n+p;else d1=side==="left"?w*n+b:a*n+w;
        assert(ds.has(d1)&&!used.has(d1),"disjoint translated blocks");used.add(d1);translationBlocks++;
       }
      }
      assert(used.size===k*cls.length&&D.length>=used.size,"one-sided expansion");maxSmallBound=Math.max(maxSmallBound,used.size);
     }
    }
   }
  }
  let opposite=0,minDistance=Infinity,distHist={},sameSignatureOpposite=0;
  for(let i=0;i<records.length;i++)for(let j=i+1;j<records.length;j++){let r=records[i],s=records[j];if((r.e.length===0)===(s.e.length===0))continue;opposite++;let d=0;for(let x of A)for(let y of A)if(r.T[x][y]!==s.T[x][y])d++;
   minDistance=Math.min(minDistance,d);distHist[d]=(distHist[d]||0)+1;
   if(r.sig===s.sig){sameSignatureOpposite++;let count=Cs.filter((C,k)=>(r.e.length===0?!r.present[k]&&s.present[k]:!s.present[k]&&r.present[k])).length;
    assert(d>=4*count,"weighted class distance");assert(d>=4*(2+range(L).map(i=>i+1).filter(j=>j===1||j%2===0).length),"moment distance");
   }
  }
  return {name,n,tables:F.length,triples,classSets,smallSinks,nonSingletonSmallSinks,translationChecks:translationBlocks,sinkHistogram:hist,minNonSingleton:Number.isFinite(minNonSingleton)?minNonSingleton:null,minSingleton:Number.isFinite(minSingleton)?minSingleton:null,maxSmallBound,opposite,sameSignatureOpposite,minDistance:Number.isFinite(minDistance)?minDistance:null,distHist};
 }
 function splitFamily(U,V,p,q,plus,minus,L,exhaustive){
  let sizes=[...plus,...minus],b=plus.length,m=p*q,g=U*V/gcd(U,V);if(g===2)g=4;
  const S=[],map=new Map(),add=(type,i,c,d=0)=>{map.set([type,i,c,d].join(),S.length);S.push({type,i,c,d})},get=(type,i,c,d=0)=>map.get([type,i,c,d].join());
  const split=sizes.map(s=>[gcd(s,U),s/gcd(s,U)]);for(let c=0;c<g;c++)add("G",0,c);
  for(let i=0;i<p;i++)for(let c=0;c<U;c++)add("A",i,c);
  for(let j=0;j<q;j++)for(let d=0;d<V;d++)add("B",j,d);
  let ext=S.length;split.forEach(([u,v],i)=>{for(let c=0;c<u;c++)for(let d=0;d<v;d++)add("T",i,c,d)});let z=S.length;add("z",0,0);const I=range(S.length),W=[];
  for(let mode=0;mode<2;mode++){let labels=range(b).map(i=>i+mode*b);if(exhaustive){function rec(a){if(a.length===m){if(labels.every(l=>a.includes(l)))W.push(a);return;}for(let l of [-1,...labels])rec([...a,l]);}rec([]);}else{for(let j=0;j<2;j++){let a=Array(m).fill(-1);for(let i=0;i<b;i++)a[(i+j)%m]=labels[i];W.push(a)}}}
  const F=W.map(w=>I.map(i=>I.map(j=>{let x=S[i],y=S[j];if(i===z||j===z)return z;if(x.type==="G"&&y.type==="G")return (i+j)%g;
   if(x.type==="G"){if(y.type==="A")return get("A",y.i,(y.c+i)%U);if(y.type==="T")return get("T",y.i,(y.c+i)%split[y.i][0],y.d);return j;}
   if(y.type==="G"){if(x.type==="B")return get("B",x.i,(x.c+j)%V);if(x.type==="T")return get("T",x.i,x.c,(x.d+j)%split[x.i][1]);return i;}
   if(x.type==="A"&&y.type==="A")return get("A",y.i,x.c);if(x.type==="B"&&y.type==="B")return get("B",x.i,y.c);
   if(x.type==="A"&&y.type==="B"){let l=w[x.i*q+y.i];return l<0?z:get("T",l,x.c%split[l][0],y.c%split[l][1]);}
   if(x.type==="A"&&y.type==="T")return get("T",y.i,x.c%split[y.i][0],y.d);if(x.type==="T"&&y.type==="B")return get("T",x.i,x.c,y.c%split[x.i][1]);return z;
  })));
  return check("split "+[U,V,p,q,L].join(","),F,g,I.slice(ext),true,L);
 }
 function hierarchy(k,s){
  const g=k===2?4:k,S=[],add=(type,c,d=0)=>S.push({type,c,d})-1;for(let i=0;i<g;i++)add("G",i);
  let up=range(k).map(i=>add("U",i)),lo=range(s).map(c=>range(k).map(d=>add("A",c,d))),B=range(k).map(i=>add("B",i)),T=range(s).map(c=>add("T",c)),z=add("z",0),I=range(S.length);
  const isA=x=>["U","A"].includes(x.type),row=x=>x.type==="U"?0:x.c,col=x=>x.type==="U"?x.c:x.d;
  const F=range(2**k).map(w=>I.map(i=>I.map(j=>{let x=S[i],y=S[j];if(i===z||j===z)return z;if(x.type==="G"&&y.type==="G")return(i+j)%g;
   if(x.type==="G")return y.type==="B"?B[(y.c+i)%k]:j;
   if(y.type==="G")return x.type==="U"?up[(x.c+j)%k]:x.type==="A"?lo[x.c][(x.d+j)%k]:i;
   if(isA(x)&&isA(y))return x.type==="U"&&y.type==="U"?j:lo[row(x)][col(y)];
   if(x.type==="B"&&y.type==="B")return i;
   if(isA(x)&&y.type==="B")return (w>>((col(x)+y.c)%k))&1?T[row(x)]:z;
   if(isA(x)&&y.type==="T")return T[row(x)];
   if(x.type==="T"&&y.type==="B")return i;return z;
  })));
  return check("hierarchy k="+k+" s="+s,F,g,[...T,z],false);
 }
 function parity(k){
  const g=k===2?4:k,A=range(k).map(i=>g+i),B=range(k).map(i=>g+k+i),t=g+2*k,z=t+1,I=range(z+1);
  const F=range(2**k).map(w=>I.map(x=>I.map(y=>{
   if(x===z||y===z)return z;
   if(x<g&&y<g)return(x+y)%g;
   if(x<g)return B.includes(y)?g+k+(y-g-k+x)%k:y;
   if(y<g)return A.includes(x)?g+(x-g+y)%k:x;
   if(A.includes(x)&&A.includes(y))return y;
   if(B.includes(x)&&B.includes(y))return x;
   if(A.includes(x)&&B.includes(y))return(w>>((x-g+y-g-k)%k))&1?t:z;
   if(A.includes(x)&&y===t||x===t&&B.includes(y))return t;return z;
  })));
  return check("plain parity "+k,F,g,[t,z],false);
 }
 const results=[splitFamily(2,2,1,2,[1,4],[2,2],0,true),splitFamily(2,2,2,2,[1,4],[2,2],0,true),splitFamily(2,4,2,3,[1,1,4,4,4,4],[2,2,2,2,2,8],1,false),hierarchy(2,2),hierarchy(2,4),hierarchy(3,2),hierarchy(2,1),parity(2),parity(3)];
 assert(results[7].minSingleton===2&&results[7].minDistance===2&&results[8].minSingleton===3,"sharp singleton");
 assert(results[0].minDistance===8&&results[1].minDistance===8,"sharp distance");
 assert(results.slice(3,6).every(r=>r.nonSingletonSmallSinks>0),"nonsingleton small sink counterexample");
 return {results,totalTables:results.reduce((s,r)=>s+r.tables,0),totalTriples:results.reduce((s,r)=>s+r.triples,0),totalClassSets:results.reduce((s,r)=>s+r.classSets,0),totalSmallSinks:results.reduce((s,r)=>s+r.smallSinks,0),totalNonSingletonSmallSinks:results.reduce((s,r)=>s+r.nonSingletonSmallSinks,0),totalTranslationChecks:results.reduce((s,r)=>s+r.translationChecks,0),totalOpposite:results.reduce((s,r)=>s+r.opposite,0),totalSameSignatureOpposite:results.reduce((s,r)=>s+r.sameSignatureOpposite,0)};
}
console.log(JSON.stringify(audit(),null,2));
