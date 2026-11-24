// Node.js. Nonuniform independent slots, full class coverage and transport outside stabilizers.
function audit(){
 const ok=(b,m)=>{if(!b)throw Error(m)},range=n=>Array.from({length:n},(_,i)=>i),sorted=a=>[...new Set(a)].sort((a,b)=>a-b),eq=(a,b)=>String(a)===String(b);
 function run(p,q,exhaustive){
  const g=4,sizes=[1,4,2,2],S=[],ix=new Map(),add=(type,i,c=0,d=0)=>{ix.set([type,i,c,d].join(),S.length);S.push({type,i,c,d});},get=(type,i,c=0,d=0)=>ix.get([type,i,c,d].join());
  for(let u=0;u<g;u++)add("G",u);
  for(let i=0;i<p;i++)for(let d=0;d<2;d++)add("U",i,0,d);
  for(let i=0;i<p;i++)for(let c=0;c<4;c++)for(let d=0;d<2;d++)add("A",i,c,d);
  for(let j=0;j<q;j++)for(let d=0;d<2;d++)add("B",j,0,d);
  const ext=S.length;for(let l=0;l<4;l++)for(let c=0;c<sizes[l];c++)add("T",l,c);const z=S.length;add("z",0);
  const n=S.length,I=range(n),K=I.slice(ext),A=I.slice(g,ext),isA=x=>["A","U"].includes(x.type),t=get("T",0),m=2*p*q;
  const slot=(x,y)=>2*(x.i*q+y.i)+(x.d+y.d)%2;
  function table(W){return I.map(i=>I.map(j=>{let x=S[i],y=S[j];if(i===z||j===z)return z;
   if(x.type==="G"&&y.type==="G")return (i+j)%g;
   if(x.type==="G")return y.type==="B"?get("B",y.i,0,(y.d+i)%2):j;
   if(y.type==="G")return isA(x)?get(x.type,x.i,x.c,(x.d+j)%2):i;
   if(isA(x)&&isA(y))return x.type==="U"&&y.type==="U"?j:get("A",y.i,x.c,y.d);
   if(x.type==="B"&&y.type==="B")return i;
   if(isA(x)&&y.type==="B"){let l=W[slot(x,y)];return l<0||l===0&&x.type==="A"?z:get("T",l,x.c%sizes[l]);}
   if(isA(x)&&y.type==="T")return y.i===0&&x.type==="A"?z:get("T",y.i,x.c%sizes[y.i]);
   if(x.type==="T"&&y.type==="B")return i;return z;
  }))}
  const baseW=Array(m).fill(-1),F=table(baseW),ideals=T=>{let R=I.map(i=>sorted(T[i])),L=I.map(i=>sorted(I.map(j=>T[j][i]))),J=I.map(i=>sorted(L[i].flatMap(j=>R[j])));return {R,L,J}};
  const {R,L,J}=ideals(F),strict=(x,t)=>J[x].length>J[t].length&&J[x].includes(t),sameJ=(x,y)=>eq(J[x],J[y]),classes=sizes.map((s,l)=>range(s).map(c=>get("T",l,c))),fixed=new Set(),reg=(T,x)=>I.some(y=>T[T[x][y]][x]===x),E=T=>I.filter(t=>!I.some(x=>x!==t&&I.some(y=>y!==t&&T[x][y]===t)));
  for(let H of J)if(H.length<n)for(let x of H)for(let y of H)fixed.add(x*n+y);
  const P=A.filter(x=>F[x][t]===t),Q=A.filter(y=>F[t][y]===t),Pset=new Set(P),Qset=new Set(Q),R0=A.filter(x=>!Pset.has(x)&&!Qset.has(x));
  ok(P.every(x=>!Qset.has(x))&&P.length===2*p&&Q.length===2*q&&R0.length===8*p,"stabilizers");
  let tables=0,triples=0,transfers=0,coverage=0,counts=[],allSlots=new Set();
  function check(T,W){
   tables++;ok(JSON.stringify(ideals(T))===JSON.stringify({R,L,J}),"labelled ideals");
   for(let x of I){ok(T[0][x]===x&&T[x][0]===x&&reg(T,x)===reg(F,x)&&(T[x][x]===x)===(F[x][x]===x),"identity/regularity/idempotence");
    for(let y of I){if(x<g||y<g||x>=ext||y>=ext||fixed.has(x*n+y)||F[x][y]<ext)ok(T[x][y]===F[x][y],"fixed metadata");else ok(T[x][y]>=ext,"quotient");
     for(let u of I){ok(T[T[x][y]][u]===T[x][T[y][u]],"associativity");triples++;}}}
   const seen=new Set(W.filter(l=>l>=0));
   ok(eq(E(T),seen.has(0)?[]:[t]),"E");
   for(let l=0;l<4;l++){
    let C=classes[l],hits=A.flatMap(x=>A.filter(y=>strict(x,C[0])&&strict(y,C[0])&&C.includes(T[x][y])).map(y=>[x,y]));
    ok((hits.length>0)===seen.has(l),"class status");
    if(hits.length){ok(eq(sorted(hits.map(([x,y])=>T[x][y])),C),"full direct coverage");coverage++;
     // For each witness and each left/right multiplier staying in C, its translated coordinate is exterior and yields the indicated value.
     for(let [x,y] of hits){let v=T[x][y];ok(C.some(k=>F[x][k]===v)&&C.some(k=>F[k][y]===v),"missing-table ideal action intersection");
      for(let u of I){if(C.includes(F[u][v])){let w=T[u][x];ok(w<ext&&w>=g&&T[w][y]===F[u][v],"left transport avoids K");transfers++;}
       if(C.includes(F[v][u])){let w=T[y][u];ok(w<ext&&w>=g&&T[x][w]===F[v][u],"right transport avoids K");transfers++;}}}
    }
   }
   return classes.filter((_,l)=>!seen.has(l)).map(C=>C.length);
  }
  check(F,baseW);
  for(let j=0;j<m;j++){
   const B=A.flatMap(x=>A.filter(y=>isA(S[x])&&S[y].type==="B"&&slot(S[x],S[y])===j).map(y=>x*n+y));
   ok(B.length===10&&B.every(d=>!allSlots.has(d)),"disjoint slot");B.forEach(d=>allSlots.add(d));
   let w=baseW.slice();w[j]=0;let T=table(w);check(T,w);let small=B.filter(d=>T[Math.floor(d/n)][d%n]===t);
   ok(small.length===2&&small.every(d=>Pset.has(Math.floor(d/n))&&Qset.has(d%n)),"two singleton witnesses");
   for(let l=1;l<4;l++){w=baseW.slice();w[j]=l;let V=table(w);check(V,w);ok(B.every(d=>classes[l].includes(V[Math.floor(d/n)][d%n])),"composite fills all ten");
    const [x,y]=[Math.floor(small[0]/n),small[0]%n],c=V[x][y],v=classes[l][1],u=I.find(u=>F[u][c]===v);
    ok(u!==undefined,"translator");
    for(let d of small){let x=Math.floor(d/n),y=d%n,xx=V[u][x];ok(R0.includes(xx)&&V[xx][y]===v&&B.includes(xx*n+y)&&!small.includes(xx*n+y),"charged outside row");}
   }
  }
  ok(m<=Math.floor(A.length*A.length/16),"barrier");
  const W=[];for(let mode=0;mode<2;mode++){let labels=[2*mode,2*mode+1];if(exhaustive){function rec(a){if(a.length===m){if(labels.every(l=>a.includes(l)))W.push({mode,a});return;}for(let l of [-1,...labels])rec([...a,l]);}rec([]);}else{for(let j=0;j<3;j++){let a=baseW.slice();a[j%m]=labels[0];a[(j+1)%m]=labels[1];W.push({mode,a});}}}
  let r0=1+p+q+3,r=r0+2,h=(2n**BigInt(1+p+q))*(BigInt(2*p)**3n)*4n;
  for(let w of W){let T=table(w.a),Z=check(T,w.a);ok(Z.length===2&&Z.reduce((v,s)=>v*s,1)===4,"rank/product balance");ok((E(T).length===0)===(w.mode===0),"balanced verdict");}
  let exact=null;if(exhaustive){const memo=new Map();function cost(ids){if(ids.every(i=>W[i].mode===W[ids[0]].mode))return 0;let key=ids.join();if(memo.has(key))return memo.get(key);let c=m+1;for(let j=0;j<m;j++){let M=new Map();for(let i of ids){let l=W[i].a[j];if(!M.has(l))M.set(l,[]);M.get(l).push(i);}if(M.size>1)c=Math.min(c,1+Math.max(...[...M.values()].map(cost)));}memo.set(key,c);return c;}exact=cost(range(W.length));ok(exact===m-1,"exact minimax");}
  return {p,q,n,m,a:A.length,slots:m,singletonCells:2,compositeCells:10,baselineAndIsolated:1+4*m,balancedTables:W.length,tables,triples,transfers,coverage,r,h:String(h),exact};
 }
 return [run(1,1,true),run(1,2,true),run(1,3,true),run(2,1,true)];
}
console.log(JSON.stringify(audit(),null,2));
