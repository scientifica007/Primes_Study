
// All planning accesses are guarded: only K-factor or nonzero quotient entries.
function directPlan(T,K){
 const n=T.length,I=Array.from({length:n},(_,i)=>i),ks=new Set(K),sort=x=>[...new Set(x)].sort((a,b)=>a-b),eq=(a,b)=>String(a)===String(b);
 const R=I.map(x=>sort(T[x])),L=I.map(y=>sort(I.map(x=>T[x][y]))),J=I.map(x=>sort(L[x].flatMap(y=>R[y]))),LC=I.map(x=>I.filter(y=>eq(L[x],L[y]))),RC=I.map(x=>I.filter(y=>eq(R[x],R[y]))),JC=I.map(x=>I.filter(y=>eq(J[x],J[y])));
 const G=I.filter(x=>R[x].length===n),unit=new Set(G),A=I.filter(x=>!ks.has(x)&&!unit.has(x)),aSet=new Set(A);
 const q= x=>ks.has(x)?-1:x, Q=I.map(x=>I.map(y=>q(T[x][y])));
 const fixed=(x,y)=>{if(ks.has(x)||ks.has(y))return T[x][y];if(Q[x][y]>=0)return Q[x][y];throw Error("unknown cell in preprocessing");};
 const gt=(x,c)=>J[x].length>J[c].length&&J[x].includes(c);
 const regular=x=>ks.has(x)?I.some(u=>fixed(fixed(x,u),x)===x):I.some(u=>Q[x][u]>=0&&Q[Q[x][u]][x]===x);
 const idem=x=>ks.has(x)?fixed(x,x)===x:Q[x][x]===x;
 const ok=(p,m)=>{if(!p)throw Error(m)};
 const sig=x=>JSON.stringify(K.flatMap(k=>[fixed(x,k),fixed(k,x)]));
 let collisions=0,leastChecks=0,edgeChecks=0;
 for(const t of K.filter(regular))for(const z of K)if(t!==z&&sig(t)===sig(z)){ok(!regular(z)&&gt(z,t),"regular representative strictly below twin");collisions++;}
 const plans=[];
 for(const c of K.filter(x=>JC[x][0]===x&&!regular(x))){
  const C=JC[c],above=I.filter(x=>gt(x,c)),pairs=above.flatMap(x=>above.filter(y=>ks.has(x)||ks.has(y)).map(y=>[x,y]));
  let p={C,c,kind:"query",cells:[]};
  if(pairs.some(([x,y])=>C.includes(fixed(x,y))))p.kind="present-known";
  else if(C.some(t=>above.some(x=>R[x].includes(t)&&!C.some(r=>fixed(x,r)===t)||L[x].includes(t)&&!C.some(l=>fixed(l,x)===t))))p.kind="present-ideal";
  else{
   const P=I.filter(u=>fixed(u,c)===c),W=I.filter(v=>fixed(c,v)===c);
   if(P.some(x=>ks.has(x))||W.some(x=>ks.has(x))||!P.some(x=>!unit.has(x))||!W.some(x=>!unit.has(x)))p.kind="missing";
   else{
    const minimal=P=>P.find(e=>aSet.has(e)&&idem(e)&&!P.some(v=>!unit.has(v)&&gt(e,v)));
    const e=minimal(P),f=minimal(W);ok(e!==undefined&&f!==undefined,"minimal idempotents");
    const reps=new Set();
    for(const x of RC[e])if(R[x].includes(c))for(const y of LC[f])if(L[y].includes(c)){
     ok(LC[x].length>=LC[c].length&&RC[y].length>=RC[c].length,"structural size domination");
     ok(aSet.has(x)&&aSet.has(y)&&regular(x)&&regular(y),"exterior regular rectangle");
     reps.add(LC[x][0]*n+RC[y][0]);
    }
    // The minimum J-class of each stabilizer is unique; all its products are known.
    function bottom(P){
      let w=P.reduce((x,y)=>fixed(x,y),0);
      ok(P.every(v=>J[v].includes(w)),"product lies below every stabilizer member");
      let k=w;
      for(let i=0;!idem(k)&&i<=n;i++)k=fixed(k,w);
      ok(idem(k)&&eq(J[k],J[w]),"minimum idempotent");
      leastChecks++;return k;
    }
    const e2=bottom(P),f2=bottom(W);
    ok(eq(J[e2],J[e])&&eq(J[f2],J[f]),"canonical endpoint class");
    // No ideal filter is needed: c belongs to eM and Mf.
    ok(RC[e].every(x=>R[x].includes(c))&&LC[f].every(y=>L[y].includes(c)),"automatic ideal tests");
    const ls=sort(JC[e2].map(x=>LC[x][0])),rs=sort(JC[f2].map(y=>RC[y][0]));
    const edge=ls.flatMap(x=>rs.map(y=>x*n+y)).sort((a,b)=>a-b);
    ok(eq(edge,[...reps].sort((a,b)=>a-b)),"full class-pair rectangle");
    ok(edge.length*LC[e].length*RC[f].length===JC[e].length*JC[f].length,"exact block cardinality");
    edgeChecks++;
    p.cells=edge;p.side=[RC[e].length,LC[f].length];
   }
  }
  plans.push(p);
 }
 return {plans,collisions,leastChecks,edgeChecks};
}
function checkDirect(T,K,expectedPlan){
 const {plans,collisions,leastChecks,edgeChecks}=directPlan(T,K),n=T.length,I=Array.from({length:n},(_,i)=>i);
 if(expectedPlan&&JSON.stringify(plans)!==JSON.stringify(expectedPlan))throw Error("plan varies across common metadata");
 const R=I.map(x=>new Set(T[x])),J=I.map(x=>new Set(I.flatMap(y=>[...R[T[y][x]]])));
 let kinds={},queries=0;
 for(const p of plans){
  const c=p.c,gt=x=>J[x].size>J[c].size&&J[x].has(c);
  const actual=I.some(x=>gt(x)&&I.some(y=>gt(y)&&p.C.includes(T[x][y])));
  const found=p.kind.startsWith("present")||p.kind==="query"&&p.cells.some(d=>p.C.includes(T[Math.floor(d/n)][d%n]));
  if(actual!==found)throw Error("presence mismatch");
  kinds[p.kind]=(kinds[p.kind]||0)+1;queries+=p.cells.length;
 }
 // Independently verify kernel = intersection with unique ambient bottom J-class,
 // for all left/right stabilizers of all labels, using the complete audit table.
 let kernels=0,kerMembers=0;
 for(const c of I)for(const left of [true,false]){
   const P=I.filter(x=>(left?T[x][c]:T[c][x])===c);
   let w=P.reduce((x,y)=>T[x][y],0);
   if(!P.every(x=>J[x].has(w)))throw Error("least ambient J");
   const ambient=P.filter(x=>J[x].size===J[w].size&&J[x].has(w));
   const ker=[...new Set(P.flatMap(x=>P.map(y=>T[T[x][w]][y])))].sort((a,b)=>a-b);
   if(String(ambient)!==String(ker))throw Error("kernel comparison");
   // all principal ideals inside P contain the displayed kernel
   for(const v of P){const ideal=new Set(P.flatMap(x=>P.map(y=>T[T[x][v]][y])));if(!ker.every(x=>ideal.has(x)))throw Error("kernel not least");}
   kernels++;kerMembers+=ker.length;
 }
 return {plans,kinds,queries,collisions,leastChecks,edgeChecks,kernels,kerMembers};
}
function smallAudit(){
 let tables=0,ideals=0,plans=0,collisions=0,queries=0,kinds={},leastChecks=0,edgeChecks=0,kernels=0,kerMembers=0;
 for(let n=2;n<=4;n++){
  const I=Array.from({length:n},(_,i)=>i),slots=I.slice(1).flatMap(x=>I.slice(1).map(y=>[x,y]));
  for(let a=0;a<n**slots.length;a++){
   let T=I.map(x=>I.map(y=>x===0?y:y===0?x:0)),v=a;
   for(const [x,y] of slots){T[x][y]=v%n;v=Math.floor(v/n);}
   let assoc=true;outer:for(const x of I)for(const y of I)for(const z of I)if(T[T[x][y]][z]!==T[x][T[y][z]]){assoc=false;break outer;}
   if(!assoc)continue;tables++;
   for(let mask=1;mask<1<<(n-1);mask++){
    const K=I.slice(1).filter(x=>mask&(1<<(x-1))),ks=new Set(K);
    if(!K.every(k=>I.every(x=>ks.has(T[k][x])&&ks.has(T[x][k]))))continue;
    ideals++;let a=checkDirect(T,K);plans+=a.plans.length;collisions+=a.collisions;queries+=a.queries;leastChecks+=a.leastChecks;edgeChecks+=a.edgeChecks;kernels+=a.kernels;kerMembers+=a.kerMembers;for(const [k,v] of Object.entries(a.kinds))kinds[k]=(kinds[k]||0)+v;
   }
  }
 }
 return {tables,ideals,plans,collisions,queries,kinds,leastChecks,edgeChecks,kernels,kerMembers};
}
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
  const dp=directPlan(T0,K).plans;let directClasses=0,directQueries=0,directKinds={},collisions=0,leastChecks=0,edgeChecks=0,kernels=0,kerMembers=0;
  for(const T of F){const a=checkDirect(T,K,dp);directClasses+=a.plans.length;directQueries+=a.queries;collisions+=a.collisions;leastChecks+=a.leastChecks;edgeChecks+=a.edgeChecks;kernels+=a.kernels;kerMembers+=a.kerMembers;for(const [k,v] of Object.entries(a.kinds))directKinds[k]=(directKinds[k]||0)+v;}
  for(let T of F){assert(JSON.stringify(ideals(T))===JSON.stringify({R,LL,J}),"ideals");for(let x of I){assert(T[0][x]===x&&T[x][0]===x,"identity");assert(reg(T,x)===reg(T0,x)&&(T[x][x]===x)===(T0[x][x]===x),"regular/idempotent");for(let y of I){if(x<g||y<g||ks.has(x)||ks.has(y)||fixed.has(x*n+y)||!ks.has(T0[x][y]))assert(T[x][y]===T0[x][y],"fixed");else assert(ks.has(T[x][y]),"quotient");for(let z of I){assert(T[T[x][y]][z]===T[x][T[y][z]],"assoc");triples++;}}}
   const e=E(T);assert(e.every(t=>ks.has(t)),"exterior E must be empty");
   const present=Cs.map(C=>fullPresent(T,C)),missing=Cs.filter((_,i)=>!present[i]);
   const b=missing.length,P=missing.reduce((p,C)=>p*BigInt(C.length),1n),mom=range(L).map(i=>i+1).filter(j=>j===1||j%2===0).map(j=>String(missing.reduce((p,C)=>p+BigInt(C.length)**BigInt(j),0n)));
   records.push({T,e,present,sig:JSON.stringify([b,String(P),mom]),wits:Cs.map(C=>wit(T,C))});
  }
  if(balanced)assert(records.every(r=>r.sig===records[0].sig),"balanced statistics");
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
  return {name,n,tables:F.length,triples,a:A.length,ar,targets,composites,stabilizers,transfers,greenChecks,nonregularWitnesses,raw:raw.size,local:local.size,queries:queries.size,compositeQueries:compUnion.size,thresholdChecks,reconstructions,directClasses,directQueries,directKinds,collisions,leastChecks,edgeChecks,kernels,kerMembers};
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
 const totals={};for(let k of ["tables","triples","targets","composites","stabilizers","transfers","greenChecks","nonregularWitnesses","thresholdChecks","reconstructions","directClasses","directQueries","collisions","leastChecks","edgeChecks","kernels","kerMembers"])totals[k]=results.reduce((s,r)=>s+r[k],0);
 assert(totals.nonregularWitnesses>0,"must test nonregular witnesses");
 return {results,totals};
}
console.log(JSON.stringify({small:smallAudit(),families:audit()},null,2));
