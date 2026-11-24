
const groupedStats={instances:0,eligible:0,groups:0,vertices:0,queries:0,cycles:0,internal:0,internalUp:0,exits:0,discarded:0,multipleClasses:0};
function groupedCheck(T,K,plans){
 const n=T.length,I=Array.from({length:n},(_,i)=>i),ks=new Set(K),sort=a=>[...new Set(a)].sort((x,y)=>x-y),eq=(a,b)=>String(a)===String(b),ok=(b,m)=>{if(!b)throw Error(m)};
 const R=I.map(x=>sort(T[x])),L=I.map(y=>sort(I.map(x=>T[x][y]))),J=I.map(x=>sort(L[x].flatMap(y=>R[y]))),LC=I.map(x=>I.filter(y=>eq(L[x],L[y]))),RC=I.map(x=>I.filter(y=>eq(R[x],R[y]))),JC=I.map(x=>I.filter(y=>eq(J[x],J[y])));
 const G=I.filter(x=>R[x].length===n),gs=new Set(G),Q=T.map(row=>Array.from(row,v=>ks.has(v)?-1:v));
 groupedStats.instances++;let disp=new Set();for(let x of I)for(let y of I)if(Q[x][y]>=0&&Q[x][y]!==x&&Q[x][y]!==y)disp.add(Q[x][y]);
 if(I.some(x=>!ks.has(x)&&!disp.has(x)))return;groupedStats.eligible++;
 const gt=(x,y)=>J[x].length>J[y].length&&J[x].includes(y);
 // Enlarge source union to all qualifying right-zero classes. The opposite
 // orientation is tested by transposition in the inherited test harness.
 const X=I.filter(x=>!ks.has(x)&&!gs.has(x)&&LC[x].length===1&&JC[x].length>=2&&Q[x][x]===x);
 const xs=new Set(X),byJ=new Map();
 for(const p of plans)if(p.kind==="query"&&p.cells.length){
  const x=Math.floor(p.cells[0]/n),y=p.cells[0]%n;
  if(!xs.has(x))continue;const key=JC[y][0];
  if(!byJ.has(key))byJ.set(key,[]);byJ.get(key).push(p.C);
 }
 const factor=new Map();
 for(const x of X){
  const candidates=[...G,...I.filter(t=>!gs.has(t)&&!ks.has(t)&&gt(t,x))];
  for(const t of candidates){let a=JC[x].find(a=>a!==x&&Q[a][t]===x);if(a!==undefined){factor.set(x,[a,t]);break;}}
  ok(factor.has(x),"factor");
 }
 for(const [j,targets] of byJ){
  const Y=sort(JC[j].map(y=>RC[y][0])),V=X.flatMap(x=>Y.map(y=>x*n+y)),vs=new Set(V),dep=new Map(),exit=new Map(),dead=new Set(),h=new Set(),at=d=>T[Math.floor(d/n)][d%n];
  for(const x of X)for(const y of Y){
   let v=x*n+y,[a,t]=factor.get(x),ty=Q[t][y];
   if(ty!==-1&&eq(J[ty],J[y]))dep.set(v,a*n+RC[ty][0]);
   else if(ty!==-1)dead.add(v);
   else if(xs.has(t)){dep.set(v,t*n+y);groupedStats.internalUp++;}
   else{exit.set(v,LC[t][0]*n+y);h.add(LC[t][0]);}
  }
  for(const [v,w] of dep){ok(v!==w&&vs.has(w),"internal edge");for(const C of targets)if(C.includes(at(v)))ok(C.includes(at(w)),"forward propagation");}
  for(const [v,w] of exit)for(const C of targets)if(C.includes(at(v)))ok(C.includes(at(w)),"exit propagation");
  for(const v of dead)ok(targets.every(C=>!C.includes(at(v))),"discard");
  const cycles=[],done=new Set();
  for(const v of V){let cur=v,path=[],pos=new Map();while(dep.has(cur)&&!done.has(cur)&&!pos.has(cur)){pos.set(cur,path.length);path.push(cur);cur=dep.get(cur);}if(pos.has(cur)){let c=path.slice(pos.get(cur));ok(c.length>=2,"cycle length");cycles.push(c[0]);}path.forEach(w=>done.add(w));}
  const E=sort([...exit.values()]),query=sort([...cycles,...E]);
  for(const C of targets){ok(V.some(v=>C.includes(at(v)))===query.some(v=>C.includes(at(v))),"group presence");}
  ok(2*query.length<=V.length+E.length,"group bound");ok(E.length<=h.size*Y.length,"exit L-class bound");
  groupedStats.groups++;groupedStats.vertices+=V.length;groupedStats.queries+=query.length;groupedStats.cycles+=cycles.length;groupedStats.internal+=dep.size;groupedStats.exits+=E.length;groupedStats.discarded+=dead.size;if(new Set(X.map(x=>JC[x][0])).size>1)groupedStats.multipleClasses++;
 }
}
// H is a right-zero band mapping onto A. Units swap twins in H but fix A.
// Enlarge the source union to A and H, so A-to-H exits are internal.
function upperTwinSpecial(){
 const G=4,p=4,q=2,V=9,S=[],add=(type,i=0,d=0)=>(S.push({type,i,d}),S.length-1);
 for(let k=0;k<G;k++)add("G",k);
 const A=Array.from({length:p},(_,i)=>add("A",i)),H=Array.from({length:p},(_,i)=>[add("H",i,0),add("H",i,1)]);
 const B=Array.from({length:q},(_,j)=>Array.from({length:V},(_,d)=>add("B",j,d)));
 const sizes=[8,9],layers=sizes.map((s,k)=>Array.from({length:s},(_,d)=>add("T",k,d))),z=add("z"),K=layers.flat().concat(z),I=Array.from({length:S.length},(_,i)=>i),out=[];
 for(let w=-1;w<2;w++){
  const T=I.map(x=>I.map(y=>{let X=S[x],Y=S[y];if(X.type==="G"&&Y.type==="G")return(x+y)%G;
   if(X.type==="G")return y;if(Y.type==="G")return X.type==="H"?H[X.i][X.d^(y%2)]:x;
   if(X.type==="H"&&Y.type==="H")return y;
   if((X.type==="H"||X.type==="A")&&Y.type==="A")return y;
   if(X.type==="A"&&Y.type==="H")return A[Y.i];
   if(X.type==="B"&&Y.type==="B")return B[X.i][Y.d];
   if((X.type==="A"||X.type==="H")&&Y.type==="B")return w>=0&&X.i===0&&Y.i===0?layers[w][Y.d%sizes[w]]:z;
   if((X.type==="A"||X.type==="H")&&Y.type==="T")return y;
   if(X.type==="T"&&Y.type==="B")return layers[X.i][Y.d%sizes[X.i]];
   return z;
  }));
  for(let x of I)for(let y of I)for(let t of I)if(T[T[x][y]][t]!==T[x][T[y][t]])throw Error("twin associativity");
  const before={...groupedStats};groupedCheck(T,K,directPlan(T,K).plans);
  if(groupedStats.internalUp===before.internalUp||groupedStats.multipleClasses===before.multipleClasses)throw Error("need internal higher-class transitions");
  out.push({n:I.length,w,vertices:groupedStats.vertices-before.vertices,queries:groupedStats.queries-before.queries,internalUp:groupedStats.internalUp-before.internalUp,exits:groupedStats.exits-before.exits});
 }return out;
}
function numericalAudit(){
 // Exact inequalities after scaling by 180 and 720 respectively.
 // x,y are whole side masses; a,c are disjoint left masses, b,d disjoint right masses.
 let checks=0;
 for(let x=0;x<=12;x++)for(let y=0;y<=12;y++)for(let a=0;a<=x;a++)for(let c=0;c<=x-a;c++)for(let d=0;d<=y;d++)for(let b=0;b<=y-d;b++){
  let base=18*(x*y-a*b-c*d)+Math.min(20*a,10*x)*b+Math.min(20*d,10*y)*c;
  if(base>19*x*y)throw Error("19/180");
  for(let r=0;r<=3;r++){
   let v=18*(x*y-a*b-c*d)+Math.min(20*a,10*(x+r))*b+Math.min(20*d,10*(y+r))*c;
   if(v>19*x*y+10*r*(x+y))throw Error("residual mass");
   let n=x+y+r;
   // v/180 <= 5 n^2 /189.
   if(189*v>900*n*n)throw Error("5/189");
   checks++;
  }
 }
 // B=4096, eps=2^-31: error terms exactly 1/2048 + 1/2048 + 1/(18*4096).
 const B=4096n,epsDen=2n**31n;
 const den=189n*epsDen*16n*18n*B;
 const lhs=5n*(den/189n)+2n*(den/B)+B*B*(den/(16n*epsDen))+den/(18n*B);
 if(36n*lhs>=den)throw Error("strict numerical margin");
 return {checks,smallIdealUpper:Number(lhs)/Number(den),comparison:1/36};
}

const stats={checkedTables:0,eligibleTables:0,blocks:0,vertices:0,queries:0,cycles:0,exits:0,dead:0,internal:0,unitOnlyBlocks:0,exitBlocks:0};
function localCheck(T,K,plans) {
 groupedCheck(T,K,plans);
 const n=T.length,I=Array.from({length:n},(_,i)=>i),ks=new Set(K),sort=a=>[...new Set(a)].sort((x,y)=>x-y),eq=(a,b)=>String(a)===String(b),ok=(b,m)=>{if(!b)throw Error(m)};
 const R=I.map(x=>sort(T[x])),L=I.map(y=>sort(I.map(x=>T[x][y]))),J=I.map(x=>sort(L[x].flatMap(y=>R[y]))),LC=I.map(x=>I.filter(y=>eq(L[x],L[y]))),RC=I.map(x=>I.filter(y=>eq(R[x],R[y]))),JC=I.map(x=>I.filter(y=>eq(J[x],J[y])));
 const G=I.filter(x=>R[x].length===n),gs=new Set(G),Q=T.map(row=>Array.from(row,v=>ks.has(v)?-1:v));
 const decomp=new Set();for(let x of I)for(let y of I)if(Q[x][y]>=0&&Q[x][y]!==x&&Q[x][y]!==y)decomp.add(Q[x][y]);
 stats.checkedTables++;if(I.some(x=>!ks.has(x)&&!decomp.has(x)))return;stats.eligibleTables++;
 const byBlock=new Map();
 for(const p of plans)if(p.kind==="query"&&p.cells.length){
  let x=Math.floor(p.cells[0]/n),y=p.cells[0]%n;
  if(LC[x].length!==1||JC[x].length<2)continue;
  let key=JC[x][0]*n+JC[y][0];
  if(!byBlock.has(key))byBlock.set(key,{x,y,cells:p.cells,targets:[]});
  let b=byBlock.get(key);ok(eq(b.cells,p.cells),"common block");b.targets.push(p.C);
 }
 for(const b of byBlock.values()){
  const X=JC[b.x],Y=sort(JC[b.y].map(y=>RC[y][0])),V=new Set(b.cells),A=new Map(),outside=new Set(),dep=new Map(),exit=new Map(),dead=new Set();
  ok(V.size===X.length*Y.length,"full block");
  const gt=(t,x)=>J[t].length>J[x].length&&J[t].includes(x);
  for(const x of X){
   let pair=null;
   for(const t of [...G,...I.filter(t=>!gs.has(t)&&!ks.has(t)&&gt(t,x))]){
    const a=X.find(a=>a!==x&&Q[a][t]===x);
    if(a!==undefined){pair=[a,t];break;}
   }
   ok(pair!==null,"nonself right-zero factorization");
   A.set(x,pair);if(!gs.has(pair[1]))outside.add(LC[pair[1]][0]);
   for(const y of Y){let v=x*n+y,ty=Q[pair[1]][y];
    if(ty===-1){exit.set(v,LC[pair[1]][0]*n+RC[y][0]);}
    else if(eq(J[ty],J[y])){let w=pair[0]*n+RC[ty][0];ok(w!==v&&V.has(w),"internal edge");dep.set(v,w);ok(eq(J[T[x][y]],J[T[pair[0]][RC[ty][0]]]),"internal product class");}
    else{dead.add(v);ok(b.targets.every(C=>!C.includes(T[x][y])),"dead target exclusion");}
   }
  }
  const cycles=[],done=new Set();
  for(const v of V){let cur=v,path=[],pos=new Map();while(dep.has(cur)&&!done.has(cur)&&!pos.has(cur)){pos.set(cur,path.length);path.push(cur);cur=dep.get(cur);}
   if(pos.has(cur)){let cycle=path.slice(pos.get(cur));ok(cycle.length>=2,"cycle length");cycles.push(cycle[0]);}
   path.forEach(w=>done.add(w));
  }
  const exits=sort([...exit.values()]),query=sort([...cycles,...exits]),at=d=>T[Math.floor(d/n)][d%n];
  for(const C of b.targets){
   let actual=b.cells.some(d=>C.includes(at(d))),found=query.some(d=>C.includes(at(d)));
   ok(actual===found,"local presence");
   for(const [v,w] of exit)if(C.includes(at(v)))ok(C.includes(at(w)),"exit detects target");
  }
  ok(2*query.length<=V.size+exits.length,"local bound");ok(exits.length<=outside.size*Y.length,"exit bound");
  stats.blocks++;stats.vertices+=V.size;stats.queries+=query.length;stats.cycles+=cycles.length;stats.exits+=exits.length;stats.dead+=dead.size;stats.internal+=dep.size;if(!outside.size)stats.unitOnlyBlocks++;if(exits.length)stats.exitBlocks++;
 }
}
function weightedAudit(){
 let seed=49302;const rand=k=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed%k;},gcd=(a,b)=>b?gcd(b,a%b):a;
 let tests=0,double=0;
 for(let test=0;test<20000;test++){
  const vertices=Array.from({length:3+rand(8)},(_,i)=>{let l=1+rand(19),r=1+rand(19),group=rand(3);return {l,r,group,N:1+rand(group===2?l*r:100)};});
  const edges=[];for(let i=0;i<vertices.length;i++)for(let j=0;j<vertices.length;j++){let a=vertices[i],b=vertices[j],d=a.l*b.r;if(d>=8&&((a.group===0&&b.group!==0)||(a.group===2&&b.group===1))&&rand(2)){let w=Math.min(d,1+rand(10));edges.push({i,j,d,w});}}
  let denom=1n;for(let e of edges){let d=BigInt(e.d);denom=denom/gcd(denom,d)*d;}
  let left=edges.reduce((s,e)=>s+BigInt(e.w)*BigInt(vertices[e.i].N)*BigInt(vertices[e.j].N)*(denom/BigInt(e.d)),0n);
  let mass=BigInt(vertices.reduce((s,v)=>s+v.N,0)+8*edges.length);
  if(4n*left>mass*mass*denom)throw Error("weighted graph inequality");
  for(let z=0;z<vertices.length;z++)if(vertices[z].group===2&&edges.some(e=>e.j===z)&&edges.some(e=>e.i===z))double++;
  tests++;
 }return {tests,doubleIncidences:double};
}
// Two families with 8 and 9 as possible targets in the same 1x9 block.
// (i) unit pairing; (ii) all units trivial, extra upper band generating A.
function special(mode){
 const nA=4,q=2,V=9,G=mode==="unit"?4:3,S=[],add=(type,i=0,d=0)=>(S.push({type,i,d}),S.length-1);
 for(let k=0;k<G;k++)add("G",k);
 const A=Array.from({length:nA},(_,i)=>add("A",i)),B=Array.from({length:q},(_,j)=>Array.from({length:V},(_,d)=>add("B",j,d)));
 const H=mode==="upper"?Array.from({length:2},(_,r)=>Array.from({length:nA},(_,i)=>add("H",i,r))):[];
 const sizes=[8,9],layers=sizes.map((s,k)=>Array.from({length:s},(_,d)=>add("T",k,d))),z=add("z"),K=layers.flat().concat(z),n=S.length,I=Array.from({length:n},(_,i)=>i);
 const patterns=[Array(nA*q).fill(-1)];
 for(let l=0;l<2;l++){let W=Array(nA*q).fill(-1);W[0]=l;if(mode==="unit")W[q]=l;patterns.push(W);}
 let base=null,out=[];
 for(const W of patterns){
  let T=I.map(x=>I.map(y=>{let X=S[x],Y=S[y];if(X.type==="G"&&Y.type==="G")return(x+y)%G;
   if(X.type==="G")return y;if(Y.type==="G")return mode==="unit"&&X.type==="A"?A[X.i^(y%2)]:x;
   if(X.type==="H"&&Y.type==="H")return H[X.d][Y.i];
   if(X.type==="H"&&Y.type==="A"||X.type==="A"&&Y.type==="A")return y;
   if(X.type==="A"&&Y.type==="H")return A[Y.i];
   if(X.type==="B"&&Y.type==="B")return B[X.i][Y.d];
   if((X.type==="A"||X.type==="H")&&Y.type==="B"){let l=W[X.i*q+Y.i];return l<0?z:layers[l][Y.d%sizes[l]];}
   if((X.type==="A"||X.type==="H")&&Y.type==="T")return y;
   if(X.type==="T"&&Y.type==="B")return layers[X.i][Y.d%sizes[X.i]];
   return z;
  }));
  for(let x of I)for(let y of I)for(let t of I)if(T[T[x][y]][t]!==T[x][T[y][t]])throw Error("special assoc");
  const sig=JSON.stringify({R:I.map(x=>[...new Set(T[x])].sort((a,b)=>a-b)),L:I.map(y=>[...new Set(I.map(x=>T[x][y]))].sort((a,b)=>a-b)),Q:T.map(row=>row.map(x=>K.includes(x)?z:x))});if(base===null)base=sig;else if(sig!==base)throw Error("special metadata");
  const plans=directPlan(T,K).plans;
  const bb=plans.filter(p=>p.C.length===8||p.C.length===9);
  if(bb.length!==2||bb.some(p=>p.kind!=="query")||String(bb[0].cells)!==String(bb[1].cells))throw Error("common bad block");
  const before={...stats};localCheck(T,K,plans);if(stats.eligibleTables===before.eligibleTables||stats.blocks===before.blocks)throw Error("special no E exterior / block");
  out.push({mode,n,block:bb[0].cells.length,queries:stats.queries-before.queries,exits:stats.exits-before.exits,cycles:stats.cycles-before.cycles});
 }
 return out;
}

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
 let collisions=0;
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
    p.cells=[...reps].sort((a,b)=>a-b);p.side=[RC[e].length,LC[f].length];
   }
  }
  plans.push(p);
 }
 return {plans,collisions};
}
function checkDirect(T,K,expectedPlan){
 const {plans,collisions}=directPlan(T,K),n=T.length,I=Array.from({length:n},(_,i)=>i);
 localCheck(T,K,plans);const D=T.map((row,x)=>T.map(r=>r[x]));localCheck(D,K,directPlan(D,K).plans);
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
 return {plans,kinds,queries,collisions};
}
function smallAudit(){
 let tables=0,ideals=0,plans=0,collisions=0,queries=0,kinds={};
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
    ideals++;let a=checkDirect(T,K);plans+=a.plans.length;collisions+=a.collisions;queries+=a.queries;for(const [k,v] of Object.entries(a.kinds))kinds[k]=(kinds[k]||0)+v;
   }
  }
 }
 return {tables,ideals,plans,collisions,queries,kinds};
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
  const dp=directPlan(T0,K).plans;let directClasses=0,directQueries=0,directKinds={},collisions=0;
  for(const T of F){const a=checkDirect(T,K,dp);directClasses+=a.plans.length;directQueries+=a.queries;collisions+=a.collisions;for(const [k,v] of Object.entries(a.kinds))directKinds[k]=(directKinds[k]||0)+v;}
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
  return {name,n,tables:F.length,triples,a:A.length,ar,targets,composites,stabilizers,transfers,greenChecks,nonregularWitnesses,raw:raw.size,local:local.size,queries:queries.size,compositeQueries:compUnion.size,thresholdChecks,reconstructions,directClasses,directQueries,directKinds,collisions};
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
 const totals={};for(let k of ["tables","triples","targets","composites","stabilizers","transfers","greenChecks","nonregularWitnesses","thresholdChecks","reconstructions","directClasses","directQueries","collisions"])totals[k]=results.reduce((s,r)=>s+r[k],0);
 assert(totals.nonregularWitnesses>0,"must test nonregular witnesses");
 return {results,totals};
}
console.log(JSON.stringify({small:smallAudit(),families:audit().totals,special:[...special("unit"),...special("upper")],upperTwin:upperTwinSpecial(),groupedStats,numerical:numericalAudit()},null,2));