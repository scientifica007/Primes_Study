// Node.js. Exact finite audits of regular localization of nonregular classes, Green-size charges, and composite-only inference.
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
  // Independent quotient-word recovery: all unit multiplications are free.
  const O=I.filter(x=>!ks.has(x)),qprod=(x,y)=>ks.has(T0[x][y])?null:T0[x][y];
  function wordsFor(S){
   const words=new Map(G.map(g=>[g,[g]]));for(const s of S)words.set(s,[s]);
   let change=true;while(change){change=false;for(const [x,w] of words)for(const y of [...G,...S]){
    const v=qprod(x,y);if(v!==null&&!words.has(v)){words.set(v,[...w,y]);change=true;}
   }}return words;
  }
  let S=[];for(const x of A)if(!wordsFor(S).has(x))S.push(x);
  for(const x of [...S])if(wordsFor(S.filter(y=>y!==x)).size===O.length)S=S.filter(y=>y!==x);
  const words=wordsFor(S);assert(words.size===O.length,"quotient words");
  const asked=A.flatMap(x=>S.filter(y=>qprod(x,y)===null&&!fixed.has(x*n+y)).map(y=>x*n+y));
  const querySet=new Set(asked);let checked=0,nontrivial=0;
  for(const T of F)for(const x of I)for(const y of I){
   let v=x;
   if(ks.has(y))v=T0[x][y];else {
    const word=words.get(y);if(word.length>1)nontrivial++;
    for(const s of word){
     if(ks.has(v)||ks.has(s)||v<g||s<g||fixed.has(v*n+s)||qprod(v,s)!==null)v=T0[v][s];
     else{assert(querySet.has(v*n+s),"generator-column only");v=T[v][s];}
    }
   }
   assert(v===T[x][y],"whole-table quotient generator reconstruction");checked++;
  }
  assert(asked.length<=A.length*S.length,"column bound");
  const Ar=A.filter(x=>reg(T0,x)),ar=Ar.length;
  let targets=0,composites=0,stabilizers=0,transfers=0,greenChecks=0,nonregularWitnesses=0,raw=new Set(),local=new Set(),queries=new Set(),plans=[],thresholdChecks=0,reconstructions=0;
  const compPlans=[];
  const key=(x,y)=>LC[x][0]*n+RC[y][0];
  function minIdempotents(P){
   const N=P.filter(x=>x>=g);
   assert(N.length>0,"nonunit stabilizer");
   return N.filter(e=>T0[e][e]===e&&!N.some(v=>strict(e,v)));
  }
  for(let ci=0;ci<Cs.length;ci++){
   let C=Cs[ci];if(!records.some(r=>r.present[ci])||!records.some(r=>!r.present[ci]))continue;
   targets++;if(C.length>=4)composites++;
   for(let c of C){
    const P=I.filter(u=>T0[u][c]===c),Q=I.filter(u=>T0[c][u]===c);
    assert(P.every(u=>!ks.has(u))&&Q.every(u=>!ks.has(u)),"stabilizers outside K");stabilizers+=2;
    for(let S of [P,Q])for(let u of S)for(let v of S)assert(S.includes(T0[u][v]),"stabilizer submonoid");
    const es=minIdempotents(P),fs=minIdempotents(Q);assert(es.length&&fs.length,"minimal idempotents");
    assert(P.filter(u=>u>=g).every(u=>!Q.includes(u)),"no common nonunit");
    for(let e of es)for(let f of fs){
     assert(!J.some((H,i)=>i>=g&&H.includes(e)&&H.includes(f)),"no common proper principal ideal");
     const reps=new Set(),Ip=RC[e],Iq=LC[f];
     assert(Ip.every(u=>Ar.includes(u))&&Iq.every(v=>Ar.includes(v)),"regular rectangles");
     for(let r of records){let T=r.T,has=false;
      for(let d of r.wits[ci]){let x=Math.floor(d/n),y=d%n;if(T[x][y]!==c)continue;
       has=true;if(c===C[0]&&e===es[0]&&f===fs[0]){raw.add(d);if(!Ar.includes(x)||!Ar.includes(y))nonregularWitnesses++;}
       const u=T[e][x],v=T[y][f];
       assert(Ip.includes(u)&&Iq.includes(v)&&T[u][v]===c,"localization transfer");
       transfers++;
       assert(LC[u].length>=LC[c].length&&RC[v].length>=RC[c].length,"one-sided size domination");
       assert(LC[c].length*RC[c].length===C.length*LC[c].filter(z=>RC[c].includes(z)).length,"Green size identity");
      }
      assert(has===r.present[ci],"full first-entry coverage");
      let hit=false;
      for(let u of Ip)for(let v of Iq)if(C.includes(T[u][v])){
       hit=true;
       // A different output in the same class may be used to decide presence, but charge only pairs capable of reporting c.
       if(T[u][v]===c){
        assert(LC[u].length>=LC[c].length&&RC[v].length>=RC[c].length,"localized size domination");
        greenChecks++;reps.add(key(u,v));
        if(c===C[0]&&e===es[0]&&f===fs[0])local.add(u*n+v);
       }
      }
      assert(hit===r.present[ci],"localized existence");
     }
     for(let r of records)assert([...reps].some(d=>C.includes(at(r.T,d)))===r.present[ci],"canonical Green-pair recovery");
     if(c===C[0]&&e===es[0]&&f===fs[0]){
      const plan={ci,reps:[...reps],side:[Ip.length,Iq.length]};
      plans.push(plan);reps.forEach(d=>queries.add(d));
      if(C.length>=4)compPlans.push(plan);
     }
    }
   }
  }
  const compUnion=new Set(compPlans.flatMap(p=>p.reps));
  const omega=s=>{let t=0;for(let p=2;p*p<=s;p++)while(s%p===0){s/=p;t++;}return t+(s>1?1:0)};
  for(let r of records){
   const present=Cs.map((C,i)=>plans.some(p=>p.ci===i)?[...queries].some(d=>C.includes(at(r.T,d))):records[0].present[i]);
   assert(eq(present,r.present),"all ambiguous class status recovery");
   const missing=Cs.filter((_,i)=>!r.present[i]);
   const b=missing.length,O=missing.reduce((s,C)=>s+omega(C.length),0);
   let W=0;for(let i=0;i<Cs.length;i++)if(Cs[i].length>=4){
    const status=compPlans.some(p=>p.ci===i)?[...compUnion].some(d=>Cs[i].includes(at(r.T,d))):records[0].present[i];
    assert(status===r.present[i],"composite status");
    if(!status)W+=Math.max(0,omega(Cs[i].length)-1);
   }
   assert(b-O+W===missing.filter(C=>C.length===1).length,"composite-only singleton count");
   reconstructions++;
  }
  for(let B=2;B<=Math.min(8,ar+1);B++){
   const sm=new Set(),bad=new Set(),good=new Set();
   const X=Ar.filter(x=>RC[x].length>=B&&LC[x].length<B),Y=Ar.filter(y=>LC[y].length>=B&&RC[y].length<B),Z=Ar.filter(z=>LC[z].length<B&&RC[z].length<B);
   for(let p of compPlans)for(let d of p.reps){
    const x=Math.floor(d/n),y=d%n;
    assert(LC[x].length*RC[y].length>=Cs[p.ci].length,"composite product charge");
    if(p.side[0]<B&&p.side[1]<B){sm.add(d);continue;}
    if(LC[x].length>=B||RC[y].length>=B){bad.add(d);continue;}
    assert(X.includes(x)&&(Y.includes(y)||Z.includes(y))||Z.includes(x)&&Y.includes(y),"three-region membership");good.add(d);
   }
   assert(sm.size<=composites*B*B,"small rectangles");
   assert(bad.size*B<=2*ar*ar,"large class error");
   assert(good.size*4<=X.length*Y.length+X.length*Z.length+Z.length*Y.length,"quarter-weight regions");
   assert(12*B*compUnion.size<=B*ar*ar+12*composites*B**3+24*ar*ar,"1/12 bound");
   thresholdChecks++;
  }
  return {name,n,tables:F.length,triples,a:A.length,ar,targets,composites,stabilizers,transfers,greenChecks,nonregularWitnesses,raw:raw.size,local:local.size,queries:queries.size,compositeQueries:compUnion.size,thresholdChecks,reconstructions,quotientGenerators:S.length,columnQueries:asked.length,recoveredCells:checked,nontrivialWords:nontrivial};
 }
 function splitFamily(U,V,p,q,plus,minus,L,exhaustive,lifted=false){
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
  if(lifted)return lift("split direct product C2",F,g,I.slice(ext));
  return check("split "+[U,V,p,q,L].join(","),F,g,I.slice(ext),true,L);
 }
 function hierarchy(k,s,clone=false){
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
  if(clone)return inflate("hierarchy with exterior nonregular clones",F,g,[...T,z],up);
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
 function lift(name,F,g,K){
  const n=F[0].length,I=range(2*n);
  return check(name,F.map(T=>I.map(x=>I.map(y=>2*T[x>>1][y>>1]+((x+y)%2)))),2*g,K.flatMap(x=>[2*x,2*x+1]),true);
 }
 function inflate(name,F,g,K,up){
  const n=F[0].length,I=range(n+up.length),pr=x=>x<n?x:up[x-n];
  const Ts=F.map(T=>I.map(x=>I.map(y=>{
   const w=T[pr(x)][pr(y)];
   if(x>=n&&y<g||y>=n&&x<g)return n+up.indexOf(w);
   return w;
  })));
  return check(name,Ts,g,K,false);
 }
 const results=[splitFamily(2,2,1,2,[1,4],[2,2],0,true),splitFamily(2,2,2,2,[1,4],[2,2],0,true),splitFamily(2,4,2,3,[1,1,4,4,4,4],[2,2,2,2,2,8],1,false),hierarchy(2,2),hierarchy(2,4),hierarchy(3,2),hierarchy(2,1),parity(2),parity(3),splitFamily(2,2,1,2,[1,4],[2,2],0,true,true),hierarchy(2,4,true)];
 const totals={};for(let k of ["tables","triples","targets","composites","stabilizers","transfers","greenChecks","nonregularWitnesses","thresholdChecks","reconstructions","recoveredCells","nontrivialWords"])totals[k]=results.reduce((s,r)=>s+r[k],0);
 assert(totals.nonregularWitnesses>0,"must test nonregular witnesses");
 return {results,totals};
}
console.log(JSON.stringify(audit(),null,2));
