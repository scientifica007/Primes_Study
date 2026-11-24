// Node.js; executed as JavaScript. Relative generating polynomials omit the common unit-group factor.
function audit(){
 const ok=(c,m)=>{if(!c)throw Error(m)},gcd=(a,b)=>b?gcd(b,a%b):a,lcm=(a,b)=>a*b/gcd(a,b),set=a=>[...new Set(a)].sort((a,b)=>a-b),eq=(a,b)=>String(a)===String(b);
 function run(B){
  const h=B.reduce((v,b)=>lcm(v,b[1]),4),g=4*h,S=[],idx=new Map(),sizes=[2,2,4];
  function add(type,k,u,c=0){let i=S.length;idx.set([type,k,u,c].join(),i);S.push({type,k,u,c});return i}
  const get=(type,k,u,c=0)=>idx.get([type,k,u,c].join());
  for(let c=0;c<4;c++)for(let u=0;u<h;u++)add("G",-1,u,c);
  B.forEach(([type,s],k)=>{for(let u=0;u<s;u++)add(type,k,u)});
  sizes.forEach((s,k)=>{for(let c=0;c<s;c++)for(let u=0;u<2;u++)add("A",k,u,c);for(let u=0;u<2;u++)add("B",k,u);for(let c=0;c<s;c++)add("T",k,0,c)});
  const P=[];for(let i=0;i<B.length;i++)for(let j=0;j<B.length;j++)if(i!==j)P.push({i,j,d:B[i][0]==="X"&&B[j][0]==="Y"?gcd(B[i][1],B[j][1]):1,t:add("t",i,j)});
  const pm=new Map(P.map((p,i)=>[[p.i,p.j].join(),i])),z=add("z",-2,0),n=S.length,I=S.map((_,i)=>i),main=x=>["X","Y"].includes(x.type),A=I.filter(i=>["X","Y","A","B"].includes(S[i].type)),K=I.filter(i=>["t","T","z"].includes(S[i].type)),ks=new Set(K);
  function table(m,b){return I.map(i=>I.map(j=>{
   let x=S[i],y=S[j];if(i===z||j===z)return z;
   if(x.type==="G"&&y.type==="G")return get("G",-1,(x.u+y.u)%h,(x.c+y.c)%4);
   if(x.type==="G"){if(y.type==="Y")return get("Y",y.k,(y.u+x.u)%B[y.k][1]);if(y.type==="B")return get("B",y.k,(y.u+x.u)%2);if(y.type==="A"||y.type==="T")return get(y.type,y.k,y.u,(y.c+x.c)%sizes[y.k]);return j}
   if(y.type==="G"){if(x.type==="X")return get("X",x.k,(x.u+y.u)%B[x.k][1]);if(x.type==="A")return get("A",x.k,(x.u+y.u)%2,x.c);return i}
   if(main(x)&&main(y)){if(x.k===y.k)return x.type==="X"?j:i;let p=pm.get([x.k,y.k].join()),{d,t}=P[p];return (m[p]>>((x.u+y.u)%d))&1?t:z}
   if(main(x)&&y.type==="t")return x.k===y.k?j:z;
   if(x.type==="t"&&main(y))return x.u===y.k?i:z;
   if(x.k!==y.k||main(x)||main(y)||x.type==="t"||y.type==="t")return z;
   if(x.type==="A"&&y.type==="A")return get("A",x.k,y.u,x.c);
   if(x.type==="B"&&y.type==="B")return i;
   if(x.type==="A"&&y.type==="B")return (b[x.k]>>((x.u+y.u)%2))&1?get("T",x.k,0,x.c):z;
   if(x.type==="A"&&y.type==="T")return get("T",x.k,0,x.c);
   if(x.type==="T"&&y.type==="B")return i;return z;
  }))}
  const full=P.map(p=>(1<<p.d)-1),spec=[[full,[0,0,3],-1]];
  for(let p=0;p<P.length;p++){let m=full.slice();m[p]=0;spec.push([m,[3,3,0],p]);if(P[p].d>1)for(let b=0;b<P[p].d;b++){m=full.slice();m[p]^=1<<b;spec.push([m,[0,0,3],-1])}}
  const T=spec.map(s=>table(s[0],s[1])),F=T[0];
  function ideals(T){let R=I.map(i=>set(T[i])),L=I.map(i=>set(I.map(j=>T[j][i]))),J=I.map(i=>set(L[i].flatMap(j=>R[j])));return {R,L,J}}
  const {R,L,J}=ideals(F),LC=x=>A.filter(y=>eq(L[x],L[y])),RC=x=>A.filter(y=>eq(R[x],R[y])),fix=new Set();
  for(let k of I)if(J[k].length<n)for(let x of J[k])for(let y of J[k])fix.add(x*n+y);
  const reg=(T,x)=>I.some(y=>T[T[x][y]][x]===x),E=T=>I.filter(t=>!I.some(x=>x!==t&&I.some(y=>y!==t&&T[x][y]===t)));
  let classes=[];for(let x of K)if(!classes.some(C=>C.includes(x)))classes.push(K.filter(y=>eq(J[x],J[y])));
  const nr=classes.filter(C=>!reg(F,C[0])),miss=T=>nr.filter(C=>!I.some(x=>!C.includes(x)&&J[x].includes(C[0])&&I.some(y=>!C.includes(y)&&J[y].includes(C[0])&&C.includes(T[x][y]))));
  const mul=(a,b)=>{let c=Array(a.length+b.length-1).fill(0n);for(let i=0;i<a.length;i++)for(let j=0;j<b.length;j++)c[i+j]+=a[i]*b[j];return c},poly=s=>{let p=[1n];for(let i=0;i<s;i++)p=mul(p,[1n,1n]);return p};
  function stats(T){let h=[1n],o=[1n];for(let s of [...B.map(b=>b[1]),...sizes.flatMap(s=>[2*s,2])]){h=mul(h,[0n,BigInt(s)]);let p=poly(s);p[0]=0n;o=mul(o,p)}const Z=miss(T);for(let C of classes){let p=poly(C.length);if(Z.includes(C)){p[0]=0n;h=mul(h,[0n,BigInt(C.length)])}o=mul(o,p)}let r=o.findIndex(x=>x>0n);return {r,gr:String(o[r]),h:h.map(String)}}
  const st=stats(F);
  for(let b=0;b<T.length;b++){let t=T[b];for(let x of I){ok(t[0][x]===x&&t[x][0]===x,"identity");ok((t[x][x]===x)===(F[x][x]===x)&&reg(t,x)===reg(F,x),"reg/idempotent");for(let y of I){if(x<g||y<g||ks.has(x)||ks.has(y)||fix.has(x*n+y)||!ks.has(F[x][y]))ok(t[x][y]===F[x][y],"fixed");else ok(ks.has(t[x][y]),"quotient");for(let w of I)ok(t[t[x][y]][w]===t[x][t[y][w]],"assoc")}}ok(JSON.stringify(ideals(t))===JSON.stringify({R,L,J}),"ideals");ok(eq(E(t),spec[b][2]<0?[]:[P[spec[b][2]].t]),"E");ok(JSON.stringify(stats(t))===JSON.stringify(st),"stats")}
  const missing=T.map(miss),targets=nr.filter(C=>missing.some(Z=>Z.includes(C))&&missing.some(Z=>!Z.includes(C))),at=(t,c)=>t[Math.floor(c/n)][c%n],U=new Set(A.flatMap(x=>A.map(y=>x*n+y)).filter(c=>targets.some(C=>T.some(t=>C.includes(at(t,c))))));
  const adj=new Map([...U].map(c=>[c,new Set()])),wit=new Map(A.map(x=>[x,I.flatMap(u=>I.filter(v=>u!==x&&v!==x&&F[u][v]===x).map(v=>[u,v]))]));
  function edge(c,d,f){if(c===d)return;ok(U.has(d),"closure");for(let t of T)ok(at(t,c)===f(at(t,d)),"edge");adj.get(c).add(d)}
  for(let c of U){let x=Math.floor(c/n),y=c%n;for(let [u,v] of wit.get(x)){let w=F[v][y];if(ks.has(w))edge(c,v*n+y,z=>F[u][z]);else edge(c,u*n+w,z=>z)}for(let [u,v] of wit.get(y)){let w=F[x][u];if(ks.has(w))edge(c,x*n+u,z=>F[z][v]);else edge(c,w*n+v,z=>z)}for(let v of LC(x))if(v!==x){let u=I.find(u=>F[u][v]===x);edge(c,v*n+y,z=>F[u][z])}for(let v of RC(y))if(v!==y){let u=I.find(u=>F[v][u]===y);edge(c,x*n+v,z=>F[z][u])}}
  const reach=c=>{let S=new Set([c]),q=[c];for(let v of q)for(let w of adj.get(v))if(!S.has(w)){S.add(w);q.push(w)}return S},Rmap=new Map([...U].map(c=>[c,reach(c)])),seen=new Set(),sinks=[];
  for(let c of U)if(!seen.has(c)){let C=[...Rmap.get(c)].filter(d=>Rmap.get(d).has(c));C.forEach(d=>seen.add(d));if(C.every(d=>[...adj.get(d)].every(e=>C.includes(e))))sinks.push(C)}
  const groups={X2:new Set(),X3:new Set(),Y2:new Set(),Y3:new Set()},G=I.slice(0,g),inv=G.map(u=>G.find(v=>F[u][v]===0));
  for(let C of sinks)if(C.length===2||C.length===3){let k=C.length,x=Math.floor(C[0]/n),y=C[0]%n;ok(eq(set(C),set(G.map(u=>F[x][u]*n+F[inv[u]][y]))),"orbit");ok(new Set(C.map(c=>Math.floor(c/n))).size===k&&new Set(C.map(c=>c%n)).size===k,"injective");for(let c of C){groups["X"+k].add(Math.floor(c/n));groups["Y"+k].add(c%n)}}
  let [p,q,r,s]=["X2","Y2","X3","Y3"].map(k=>groups[k].size),a=A.length,N=a*(a-1),bound36=9*N+9*p*q+3*r*s-6*(p+q)*(r+s)-5*(r*(r-1)+s*(s-1)+r*s);
  ok(36*sinks.length<=bound36,"weighted bound");ok(sinks.length===P.reduce((v,p)=>v+p.d,0)+6,"count");
  return {blocks:B.map(b=>b.join("")),tables:T.length,n,a,k:K.length,triples:T.length*n**3,queries:sinks.length,relevant:U.size,hist:sinks.reduce((h,C)=>(h[C.length]=(h[C.length]||0)+1,h),{}),projections:[p,q,r,s],weightedBound:Math.floor(bound36/36),relativeRank:st.r,relativeGr:st.gr};
 }
 return [run([["X",2],["Y",2]]),run([["X",2],["X",2],["Y",2],["Y",2]]),run([["X",2],["X",2],["X",2],["Y",2],["Y",2],["Y",2]]),run([["X",2],["X",3],["Y",2],["Y",3]]),run([["X",3],["Y",3]])];
}
console.log(JSON.stringify(audit(),null,2));
