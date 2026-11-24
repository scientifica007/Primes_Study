// Node.js; executed in research session. Exact group/enumerator arithmetic and explicit table audits.
function audit(){
 const ok=(b,m)=>{if(!b)throw Error(m)},gcd=(a,b)=>b?gcd(b,a%b):a,eq=(a,b)=>String(a)===String(b),sorted=a=>[...new Set(a)].sort((a,b)=>a-b);
 const mul=(a,b)=>{let c=Array(a.length+b.length-1).fill(0n);for(let i=0;i<a.length;i++)for(let j=0;j<b.length;j++)c[i+j]+=a[i]*b[j];return c},poly=s=>{let p=[1n];for(let i=0;i<s;i++)p=mul(p,[1n,1n]);return p};
 function run(U,V,p,q,positive,negative,L,exhaustive){
  const sizes=[...positive,...negative],b=positive.length,m=p*q,D=sizes.reduce((a,b)=>a+b,0),g0=U*V/gcd(U,V),g=g0===2?4:g0;
  ok(b===negative.length&&m>=b,"promise dimensions");
  const split=sizes.map(s=>{let u=gcd(U,s),v=s/u;ok(V%v===0,"split");return [u,v]});
  const S=[],idx=new Map(),add=(type,i,c,d=0)=>{let k=S.length;idx.set([type,i,c,d].join(),k);S.push({type,i,c,d});return k},get=(type,i,c,d=0)=>idx.get([type,i,c,d].join());
  for(let x=0;x<g;x++)add("G",0,x);
  for(let i=0;i<p;i++)for(let c=0;c<U;c++)add("A",i,c);
  for(let j=0;j<q;j++)for(let d=0;d<V;d++)add("B",j,d);
  sizes.forEach((s,l)=>{let [u,v]=split[l];for(let c=0;c<u;c++)for(let d=0;d<v;d++)add("T",l,c,d)});
  const z=add("z",0,0),n=S.length,I=S.map((_,i)=>i),K=I.filter(i=>["T","z"].includes(S[i].type)),ks=new Set(K),A=I.filter(i=>S[i].type==="A"),B=I.filter(i=>S[i].type==="B");
  const W=[];
  for(let mode=0;mode<2;mode++){let active=Array.from({length:b},(_,i)=>i+mode*b);
   if(exhaustive){function rec(a){if(a.length===m){if(active.every(l=>a.includes(l)))W.push({mode,a});return;}for(let l of [-1,...active])rec([...a,l])}rec([]);}
   else{for(let j=0;j<3;j++){let a=Array(m).fill(-1);for(let i=0;i<b;i++)a[(i+j)%m]=active[(i+j)%b];W.push({mode,a})}}
  }
  function table(w){return I.map(i=>I.map(j=>{let x=S[i],y=S[j];if(i===z||j===z)return z;
   if(x.type==="G"&&y.type==="G")return get("G",0,(x.c+y.c)%g);
   if(x.type==="G"){if(y.type==="A")return get("A",y.i,(y.c+x.c)%U);if(y.type==="T")return get("T",y.i,(y.c+x.c)%split[y.i][0],y.d);return j;}
   if(y.type==="G"){if(x.type==="B")return get("B",x.i,(x.c+y.c)%V);if(x.type==="T")return get("T",x.i,x.c,(x.d+y.c)%split[x.i][1]);return i;}
   if(x.type==="A"&&y.type==="A")return get("A",y.i,x.c);
   if(x.type==="B"&&y.type==="B")return get("B",x.i,y.c);
   if(x.type==="A"&&y.type==="B"){let l=w[x.i*q+y.i];return l<0?z:get("T",l,x.c%split[l][0],y.c%split[l][1]);}
   if(x.type==="A"&&y.type==="T")return get("T",y.i,x.c%split[y.i][0],y.d);
   if(x.type==="T"&&y.type==="B")return get("T",x.i,x.c,y.c%split[x.i][1]);
   return z;}))}
  const F=table(W[0].a);
  const ideals=T=>{let R=I.map(i=>sorted(T[i])),L=I.map(i=>sorted(I.map(j=>T[j][i]))),J=I.map(i=>sorted(L[i].flatMap(j=>R[j])));return {R,L,J}};
  const {R,L:LL,J}=ideals(F),fixed=new Set();
  for(let x of I)if(J[x].length<n)for(let i of J[x])for(let j of J[x])fixed.add(i*n+j);
  const reg=(T,x)=>I.some(y=>T[T[x][y]][x]===x),E=T=>I.filter(t=>!I.some(x=>x!==t&&I.some(y=>y!==t&&T[x][y]===t)));
  // Exhaustive group subsets, not all subsets of M.
  const gp=Array(g+1).fill(0n),hp=Array(g+1).fill(0n);
  function gen(mask){let d=g;for(let i=0;i<g;i++)if(mask>>i&1)d=gcd(d,i);return mask!==0&&d===1}
  for(let mask=1;mask<2**g;mask++)if(gen(mask)){let k=0,min=true;for(let i=0;i<g;i++)if(mask>>i&1){k++;if(gen(mask^(1<<i)))min=false;}gp[k]++;if(min)hp[k]++;}
  const commonOrd=[...Array(p).fill(U),...Array(q).fill(V)].reduce((f,s)=>{let a=poly(s);a[0]=0n;return mul(f,a)},gp),commonMin=[...Array(p).fill(U),...Array(q).fill(V)].reduce((f,s)=>mul(f,[0n,BigInt(s)]),hp);
  function stats(mode){let o=commonOrd.slice(),h=commonMin.slice();for(let i=0;i<sizes.length;i++){let miss=(i<b)===(mode===1),a=poly(sizes[i]);if(miss){a[0]=0n;h=mul(h,[0n,BigInt(sizes[i])]);}o=mul(o,a);}o=mul(o,[1n,1n]);const r=o.findIndex(v=>v>0n);return {r,h:h.map(String),prefix:o.slice(r,r+L+1).map(String)}}
  const st=stats(0);ok(JSON.stringify(st)===JSON.stringify(stats(1)),"stats");
  const sig=(a)=>({b:a.length,P:String(a.reduce((v,s)=>v*BigInt(s),1n)),moments:Array.from({length:L},(_,i)=>i+1).filter(j=>j===1||j%2===0).map(j=>String(a.reduce((v,s)=>v+BigInt(s)**BigInt(j),0n)))});
  ok(JSON.stringify(sig(positive))===JSON.stringify(sig(negative)),"moments");
  const targets=I.filter(i=>S[i].type==="T"&&sizes[S[i].i]===1);
  const relevant=A.flatMap(x=>B.map(y=>x*n+y)),adj=new Map(relevant.map(c=>[c,new Set()]));
  const wits=new Map([...A,...B].map(x=>[x,I.flatMap(u=>I.filter(v=>u!==x&&v!==x&&F[u][v]===x).map(v=>[u,v]))]));
  function edge(c,d,f){if(c===d)return;ok(adj.has(d),"closure");adj.get(c).add(d);edges.push([c,d,f]);}
  const edges=[];
  for(let c of relevant){let x=Math.floor(c/n),y=c%n;for(let [u,v] of wits.get(x)){let w=F[v][y];if(ks.has(w))edge(c,v*n+y,k=>F[u][k]);else edge(c,u*n+w,k=>k);}for(let [u,v] of wits.get(y)){let w=F[x][u];if(ks.has(w))edge(c,x*n+u,k=>F[k][v]);else edge(c,w*n+v,k=>k);}for(let v of A)if(v!==x&&eq(LL[x],LL[v])){let u=I.find(u=>F[u][v]===x);edge(c,v*n+y,k=>F[u][k]);}for(let v of B)if(v!==y&&eq(R[y],R[v])){let u=I.find(u=>F[v][u]===y);edge(c,x*n+v,k=>F[k][u]);}}
  const at=(T,c)=>T[Math.floor(c/n)][c%n],pos=c=>S[Math.floor(c/n)].i*q+S[c%n].i;
  for(let c of relevant){let seen=new Set([c]),queue=[c];for(let d of queue)for(let e of adj.get(d))if(!seen.has(e)){seen.add(e);queue.push(e);}ok(seen.size===U*V&&[...seen].every(d=>pos(c)===pos(d)),"exact SCC block");}
  for(let {mode,a} of W){let T=table(a);
   for(let x of I){ok(T[0][x]===x&&T[x][0]===x,"identity");ok((T[x][x]===x)===(F[x][x]===x)&&reg(T,x)===reg(F,x),"regular/idempotent");
    for(let y of I){if(x<g||y<g||ks.has(x)||ks.has(y)||fixed.has(x*n+y)||!ks.has(F[x][y]))ok(T[x][y]===F[x][y],"fixed");else ok(ks.has(T[x][y]),"quotient");for(let w of I)ok(T[T[x][y]][w]===T[x][T[y][w]],"associativity");}}
   ok(JSON.stringify(ideals(T))===JSON.stringify({R,L:LL,J}),"ideals");ok(eq(E(T),mode===1?targets:[]),"E");
   for(let [c,d,f] of edges)ok(at(T,c)===f(at(T,d)),"edge map");
   for(let c of relevant){let l=a[pos(c)],v=at(T,c);ok(l<0?v===z:S[v].type==="T"&&S[v].i===l,"query label");}
  }
  let exact=null;
  if(exhaustive){const memo=new Map();function cost(ids){let mode=W[ids[0]].mode;if(ids.every(i=>W[i].mode===mode))return 0;let key=ids.join();if(memo.has(key))return memo.get(key);let v=m+1;for(let j=0;j<m;j++){let groups=new Map();for(let i of ids){let l=W[i].a[j];if(!groups.has(l))groups.set(l,[]);groups.get(l).push(i);}if(groups.size>1)v=Math.min(v,1+Math.max(...[...groups.values()].map(cost)));}memo.set(key,v);return v;}
   exact=cost(W.map((_,i)=>i));ok(exact===m-b+1,"decision tree");}
  return {L,U,V,p,q,n,a:A.length+B.length,K:K.length,layers:sizes.length,b,tables:W.length,triples:W.length*n**3,sinks:m,sinkSize:U*V,rank:st.r,h:st.h.map((v,i)=>[i,v]).filter(x=>x[1]!=="0"),gPrefix:st.prefix,exact};
 }
 return [run(2,2,1,2,[1,4],[2,2],0,true),run(2,2,2,2,[1,4],[2,2],0,true),run(2,2,2,3,[1,4],[2,2],0,true),run(2,4,2,3,[1,1,4,4,4,4],[2,2,2,2,2,8],1,false),run(3,4,8,4,[...Array(6).fill(1),...Array(10).fill(3),...Array(15).fill(4),12],[...Array(21).fill(2),...Array(11).fill(6)],2,false)];
}
console.log(JSON.stringify(audit(),null,2));
