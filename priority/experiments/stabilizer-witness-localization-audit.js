// Node.js; executed in research session. Audits explicit compatible families, not all monoids.
function audit(){
 const ok=(x,m)=>{if(!x)throw Error(m)},range=n=>Array.from({length:n},(_,i)=>i),sorted=a=>[...new Set(a)].sort((a,b)=>a-b),eq=(a,b)=>String(a)===String(b),gcd=(a,b)=>b?gcd(b,a%b):a;
 function check(name,tables,g,K){
  const F=tables[0],n=F.length,I=range(n),ks=new Set(K),A=I.filter(x=>x>=g&&!ks.has(x));
  const reg=(T,x)=>I.some(y=>T[T[x][y]][x]===x),E=T=>I.filter(t=>!I.some(x=>x!==t&&I.some(y=>y!==t&&T[x][y]===t)));
  function ideals(T){let R=I.map(x=>sorted(T[x])),L=I.map(x=>sorted(I.map(y=>T[y][x]))),J=I.map(x=>sorted(L[x].flatMap(y=>R[y])));return {R,L,J}}
  const {R,L,J}=ideals(F),RC=I.map(x=>I.filter(y=>eq(R[x],R[y]))),LC=I.map(x=>I.filter(y=>eq(L[x],L[y]))),JC=I.map(x=>I.filter(y=>eq(J[x],J[y]))),Ar=A.filter(x=>reg(F,x)),a=Ar.length;
  const fixed=new Set();for(let S of [...R,...L,...J])if(S.length<n)for(let x of S)for(let y of S)fixed.add(x*n+y);
  for(let T of tables){ok(JSON.stringify(ideals(T))===JSON.stringify({R,L,J}),name+" ideals");for(let x of I){ok(T[0][x]===x&&T[x][0]===x,"identity");ok(reg(T,x)===reg(F,x)&&(T[x][x]===x)===(F[x][x]===x),"regular/idempotent");for(let y of I){if(x<g||y<g||ks.has(x)||ks.has(y)||fixed.has(x*n+y)||!ks.has(F[x][y]))ok(T[x][y]===F[x][y],"fixed entry");else ok(ks.has(T[x][y]),"quotient");for(let z of I)ok(T[T[x][y]][z]===T[x][T[y][z]],"associativity");}}}
  const Es=tables.map(E),targets=I.filter(t=>Es.some(e=>e.includes(t))&&Es.some(e=>!e.includes(t))),c=targets.length;
  const alpha=new Set(Ar.filter(x=>RC[x].length>=2).map(x=>String(L[x]))).size,beta=new Set(Ar.filter(x=>LC[x].length>=2).map(x=>String(R[x]))).size;
  ok(alpha+beta<=a,"class budget");
  const raw=new Set(),loc=new Set(),reps=new Map(),plans=[];let cx=0,cy=0,c0=0,cl=0,transfers=0;
  for(let t of targets){
   ok(ks.has(t)&&JC[t].length===1&&F[t][t]!==t&&!reg(F,t),"ambiguous class");
   const P=I.filter(x=>F[x][t]===t),Q=I.filter(y=>F[t][y]===t);
   ok(P.every(x=>!ks.has(x))&&Q.every(x=>!ks.has(x)),"K stabilizer");
   for(let x of P)for(let y of P)ok(P.includes(F[x][y]),"P submonoid");
   for(let x of Q)for(let y of Q)ok(Q.includes(F[x][y]),"Q submonoid");
   const pr=x=>sorted(P.map(y=>F[x][y])),ql=y=>sorted(Q.map(x=>F[x][y]));
   let p=P.filter(x=>x>=g).reduce((x,y)=>pr(x).length<=pr(y).length?x:y),q=Q.filter(x=>x>=g).reduce((x,y)=>ql(x).length<=ql(y).length?x:y);
   const Ip=pr(p),Iq=ql(q),e=Ip.find(x=>F[x][x]===x),f=Iq.find(x=>F[x][x]===x);
   ok(e!==undefined&&f!==undefined,"minimal ideals idempotents");
   ok(eq(RC[e],Ip)&&eq(LC[f],Iq),"ambient Green class equality");ok(Ip.every(x=>Ar.includes(x))&&Iq.every(x=>Ar.includes(x)),"regular localized factors");
   if(Ip.length>=2&&Iq.length>=2)cl++;else if(Ip.length>=2)cx++;else if(Iq.length>=2)cy++;else c0++;
   const keys=new Set();
   for(let T of tables){let all=[];for(let x of A)for(let y of A)if(T[x][y]===t){all.push([x,y]);raw.add(x*n+y);ok(P.includes(x)&&Q.includes(y),"stabilizing witness");let u=T[e][x],v=T[y][f];ok(Ip.includes(u)&&Iq.includes(v)&&T[u][v]===t,"localization transfer");transfers++;}
    ok((all.length===0)===Es[tables.indexOf(T)].includes(t),"witness E");ok((all.length>0)===Ip.some(x=>Iq.some(y=>T[x][y]===t)),"localized equivalence");
   }
   for(let x of Ip)for(let y of Iq)if(tables.some(T=>T[x][y]===t)){loc.add(x*n+y);let key=String(L[x])+"|"+String(R[y]);if(!reps.has(key))reps.set(key,[x,y]);keys.add(key);}
   plans.push({t,keys,shape:[Ip.length,Iq.length]});
  }
  for(let b=0;b<tables.length;b++){let T=tables[b],e=Es[0].filter(t=>!targets.includes(t));for(let p of plans)if(![...p.keys].some(k=>{let [x,y]=reps.get(k);return T[x][y]===p.t}))e.push(p.t);ok(eq(sorted(e),Es[b]),"recovered complete E");}
  const refined=alpha*beta+cx*alpha+cy*beta+c0,bound=Math.floor((a+c)**2/4);
  ok(reps.size<=refined&&refined<=bound,"budget");
  return {name,n,tables:tables.length,triples:tables.length*n**3,a:A.length,regular:a,c,alpha,beta,large:cl,leftLarge:cx,rightLarge:cy,bothSingleton:c0,raw:raw.size,localized:loc.size,queries:reps.size,refined,bound,transfers};
 }
 function hierarchy(h,k,clones){
  const g=4,na=2*h,nb=2*k,t=g+na+nb,z=t+1,n=z+1+2*clones,K=[t,z],I=range(n),A=x=>x>=g&&x<g+na,B=x=>x>=g+na&&x<t,clone=x=>x>z,project=x=>clone(x)?g+na-2+((x-z-1)%2):x;
  function base(w,x,y){if(x<g&&y<g)return(x+y)%g;if(x<g)return B(y)?y^(x%2):y;if(y<g)return A(x)?x^(y%2):x;
   if(A(x)&&A(y))return g+2*Math.min((x-g)>>1,(y-g)>>1)+(y-g)%2;
   if(B(x)&&B(y))return g+na+2*Math.min((x-g-na)>>1,(y-g-na)>>1)+(x-g-na)%2;
   if(A(x)&&B(y))return (w>>((x+y)%2))&1?t:z;
   if(A(x)&&y===t||x===t&&B(y))return t;return z;}
  const tables=range(4).map(w=>I.map(x=>I.map(y=>{if(x<g&&clone(y))return y;if(clone(x)&&y<g)return z+1+2*((x-z-1)>>1)+(((x-z-1)%2)^(y%2));return base(w,project(x),project(y));})));
  return check("hierarchy "+h+"x"+k+" clones "+clones,tables,g,K);
 }
 function dense(blocks){
  const g=12,S=range(g).map(i=>({type:"G",i}));blocks.forEach(([type,s],i)=>{for(let u=0;u<s;u++)S.push({type,i,u})});const ext=S.length,lookup=(i,u)=>g+blocks.slice(0,i).reduce((a,b)=>a+b[1],0)+u;
  const pairs=[],mp=new Map();for(let i=0;i<blocks.length;i++)for(let j=0;j<blocks.length;j++)if(i!==j){let d=blocks[i][0]==="X"&&blocks[j][0]==="Y"?gcd(blocks[i][1],blocks[j][1]):1,t=S.length;S.push({type:"t",i,j});mp.set(i+","+j,pairs.length);pairs.push({i,j,d,t});}
  const z=S.length;S.push({type:"z"});const n=S.length,I=range(n),K=I.slice(ext),isB=x=>["X","Y"].includes(x.type);
  const zero=pairs.map(()=>0),full=pairs.map(p=>(1<<p.d)-1),masks=[zero,full];for(let i=0;i<pairs.length;i++)for(let b=0;b<pairs[i].d;b++){let m=zero.slice();m[i]=1<<b;masks.push(m);}
  const tables=masks.map(m=>I.map(i=>I.map(j=>{let x=S[i],y=S[j];if(i===z||j===z)return z;if(x.type==="G"&&y.type==="G")return(i+j)%g;
   if(x.type==="G")return y.type==="Y"?lookup(y.i,(y.u+i)%blocks[y.i][1]):j;if(y.type==="G")return x.type==="X"?lookup(x.i,(x.u+j)%blocks[x.i][1]):i;
   if(isB(x)&&isB(y)){if(x.i===y.i)return x.type==="X"?j:i;let k=mp.get(x.i+","+y.i),p=pairs[k];return (m[k]>>((x.u+y.u)%p.d))&1?p.t:z;}
   if(isB(x)&&y.type==="t")return x.i===y.i?j:z;if(x.type==="t"&&isB(y))return x.j===y.i?i:z;return z;})));
  return check("dense "+blocks.map(b=>b.join("")).join(","),tables,g,K);
 }
 function balanced(){
  const g=4,p=2,q=2,sz=[[1,1],[2,2],[2,1],[2,1]],S=range(g).map(i=>({type:"G",i})),ix=new Map();
  function add(type,i,c,d=0){ix.set([type,i,c,d].join(),S.length);S.push({type,i,c,d});}const get=(type,i,c,d=0)=>ix.get([type,i,c,d].join());
  for(let i=0;i<p;i++)for(let c=0;c<2;c++)add("A",i,c);
  for(let j=0;j<q;j++)for(let d=0;d<2;d++)add("B",j,d);
  const ext=S.length;sz.forEach(([u,v],i)=>{for(let c=0;c<u;c++)for(let d=0;d<v;d++)add("T",i,c,d)});const z=S.length;add("z",0,0);const I=range(S.length),K=I.slice(ext),W=[];
  for(let mode=0;mode<2;mode++){let active=[2*mode,2*mode+1];function rec(a){if(a.length===p*q){if(active.every(l=>a.includes(l)))W.push(a);return;}for(let l of [-1,...active])rec([...a,l]);}rec([]);}
  const tables=W.map(w=>I.map(i=>I.map(j=>{let x=S[i],y=S[j];if(i===z||j===z)return z;if(x.type==="G"&&y.type==="G")return(i+j)%g;
   if(x.type==="G"){if(y.type==="A")return get("A",y.i,(y.c+i)%2);if(y.type==="T")return get("T",y.i,(y.c+i)%sz[y.i][0],y.d);return j;}
   if(y.type==="G"){if(x.type==="B")return get("B",x.i,(x.c+j)%2);if(x.type==="T")return get("T",x.i,x.c,(x.d+j)%sz[x.i][1]);return i;}
   if(x.type==="A"&&y.type==="A")return get("A",y.i,x.c);if(x.type==="B"&&y.type==="B")return get("B",x.i,y.c);
   if(x.type==="A"&&y.type==="B"){let l=w[x.i*q+y.i];return l<0?z:get("T",l,x.c%sz[l][0],y.c%sz[l][1]);}
   if(x.type==="A"&&y.type==="T")return get("T",y.i,x.c%sz[y.i][0],y.d);if(x.type==="T"&&y.type==="B")return get("T",x.i,x.c,y.c%sz[x.i][1]);return z;})));
  return check("balanced L=0 two-sided 2x2",tables,g,K);
 }
 function nonnull(){
  const g=4,A=[4,5],B=[6,7],K=[8,9,10,11,12,13],z=12,twin=13,t=9,e=8,f=11,I=range(14),proj=x=>x===twin?t:x;
  function mr(x,y){x=proj(x);y=proj(y);if(x===z||y===z)return z;let i=(x-8)>>1,l=(x-8)%2,j=(y-8)>>1,m=(y-8)%2;return l===1&&j===0?z:8+2*i+m;}
  const tables=range(4).map(w=>I.map(x=>I.map(y=>{if(x<g&&y<g)return(x+y)%g;if(x<g)return B.includes(y)?6+((y-6)^(x%2)):y;if(y<g)return A.includes(x)?4+((x-4)^(y%2)):x;if(A.includes(x)&&A.includes(y))return y;if(B.includes(x)&&B.includes(y))return x;if(A.includes(x)&&B.includes(y))return (w>>((x-4+y-6)%2))&1?t:twin;if(B.includes(x)&&A.includes(y))return z;if(A.includes(x)&&y===twin||x===twin&&B.includes(y))return twin;return mr(A.includes(x)?e:B.includes(x)?f:x,A.includes(y)?e:B.includes(y)?f:y);})));
  return check("nonnull Rees duplicate",tables,g,K);
 }
 const results=[hierarchy(1,1,0),hierarchy(2,3,0),hierarchy(5,6,2),dense([["X",1],["X",2],["Y",3],["Y",1]]),dense([["X",2],["X",2],["Y",2],["Y",2]]),balanced(),nonnull()];
 return {results,totalTables:results.reduce((v,r)=>v+r.tables,0),totalTriples:results.reduce((v,r)=>v+r.triples,0),totalTransfers:results.reduce((v,r)=>v+r.transfers,0)};
}
console.log(JSON.stringify(audit(),null,2));
