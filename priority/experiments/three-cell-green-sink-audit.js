// Node.js; exact finite audit, also executed as JavaScript in the research session.
function audit(){
 const sizes=[1,2,2,4],els=[],index=new Map();
 const add=(k,type,u,c)=>{index.set([k,type,u,c].join(","),els.length);els.push({k,type,u,c})};
 const get=(k,type,u,c)=>index.get([k,type,u,c].join(","));
 const check=(v,m)=>{if(!v)throw Error(m)};
 for(let c=0;c<4;c++)for(let u=0;u<3;u++)add(-1,"G",u,c);
 for(let k=0;k<4;k++){for(let c=0;c<sizes[k];c++)for(let u=0;u<3;u++)add(k,"A",u,c);for(let u=0;u<3;u++)add(k,"B",u,0);for(let c=0;c<sizes[k];c++)add(k,"T",0,c);}
 const zero=els.length;add(-2,"O",0,0);
 const n=els.length,I=els.map((_,i)=>i),A=I.filter(i=>["A","B"].includes(els[i].type)),K=I.filter(i=>["T","O"].includes(els[i].type)),ks=new Set(K);
 const words=[],tables=[];
 function table(m){return I.map(i=>I.map(j=>{
  const x=els[i],y=els[j];if(i===zero||j===zero)return zero;
  if(x.type==="G"&&y.type==="G")return get(-1,"G",(x.u+y.u)%3,(x.c+y.c)%4);
  if(x.type==="G"){if(y.type==="A"||y.type==="T")return get(y.k,y.type,y.u,(y.c+x.c)%sizes[y.k]);return get(y.k,"B",(y.u+x.u)%3,0);}
  if(y.type==="G"){if(x.type==="A")return get(x.k,"A",(x.u+y.u)%3,x.c);return i;}
  if(x.k!==y.k)return zero;
  if(x.type==="A"&&y.type==="A")return get(x.k,"A",y.u,x.c);
  if(x.type==="B"&&y.type==="B")return i;
  if(x.type==="A"&&y.type==="B")return m[x.k]>>( (x.u+y.u)%3)&1?get(x.k,"T",0,x.c):zero;
  if(x.type==="A"&&y.type==="T")return get(x.k,"T",0,x.c);
  if(x.type==="T"&&y.type==="B")return i;
  return zero;
 }))}
 for(let mode=0;mode<2;mode++)for(let x=1;x<8;x++)for(let y=1;y<8;y++){const m=mode?[x,0,0,y]:[0,x,y,0];words.push(m);tables.push(table(m))}
 const F=tables[0],sorted=s=>[...new Set(s)].sort((a,b)=>a-b);
 function ideals(T){const R=I.map(x=>sorted(T[x])),L=I.map(x=>sorted(I.map(y=>T[y][x]))),J=I.map(x=>sorted(L[x].flatMap(y=>R[y])));return {R,L,J}}
 const {R,L,J}=ideals(F),same=(x,y)=>String(x)===String(y),LC=x=>A.filter(y=>same(L[x],L[y])),RC=x=>A.filter(y=>same(R[x],R[y]));
 const fixed=new Set();for(let x of I)if(J[x].length<n)for(let u of J[x])for(let v of J[x])fixed.add(u*n+v);
 const reg=(T,x)=>I.some(y=>T[T[x][y]][x]===x);
 const E=T=>I.filter(t=>!I.some(x=>x!==t&&I.some(y=>y!==t&&T[x][y]===t)));
 for(let b=0;b<tables.length;b++){const T=tables[b];
  for(let x of I){check(T[0][x]===x&&T[x][0]===x,"identity");check((T[x][x]===x)===(F[x][x]===x)&&reg(T,x)===reg(F,x),"regular/idempotent");
  for(let y of I){if(x<12||y<12||ks.has(x)||ks.has(y)||fixed.has(x*n+y)||!ks.has(F[x][y]))check(T[x][y]===F[x][y],"fixed cell");else check(ks.has(T[x][y]),"quotient");for(let z of I)check(T[T[x][y]][z]===T[x][T[y][z]],"assoc");}}
  check(JSON.stringify(ideals(T))===JSON.stringify({R,L,J}),"ideals");
  const expected=words[b][0]===0?[get(0,"T",0,0)]:[];check(same(E(T),expected),"E");
 }
 // Count ordinary and inclusion-minimal group generators independently.
 let gg=Array(13).fill(0n),hh=Array(13).fill(0n);
 function generates(mask){let S=new Set(I.slice(0,12).filter(i=>mask>>i&1));let old=-1;while(old!==S.size){old=S.size;for(let x of [...S])for(let y of [...S])S.add(F[x][y]);}return S.size===12;}
 for(let m=1;m<4096;m++)if(generates(m)){let k=0,min=true;for(let i=0;i<12;i++)if(m>>i&1){k++;if(generates(m^(1<<i)))min=false;}gg[k]++;if(min)hh[k]++;}
 const poly=s=>{let p=[1n];for(let i=0;i<s;i++)p=mul(p,[1n,1n]);return p};
 function mul(a,b){let p=Array(a.length+b.length-1).fill(0n);for(let i=0;i<a.length;i++)for(let j=0;j<b.length;j++)p[i+j]+=a[i]*b[j];return p}
 function stats(m){let g=gg.slice(),h=hh.slice();for(let k=0;k<4;k++)for(let s of [3*sizes[k],3]){let p=poly(s);p[0]=0n;g=mul(g,p);h=mul(h,[0n,BigInt(s)]);}for(let k=0;k<4;k++){let s=sizes[k],p=poly(s);if(!m[k]){p[0]=0n;h=mul(h,[0n,BigInt(s)]);}g=mul(g,p);}g=mul(g,[1n,1n]);let r=g.findIndex(x=>x>0n);return {r,gr:String(g[r]),h:h.map(String)}}
 const st=stats(words[0]);check(words.every(m=>JSON.stringify(stats(m))===JSON.stringify(st)),"statistics");
 const U=new Set(A.flatMap(x=>A.map(y=>x*n+y)).filter(c=>tables.some(T=>els[T[Math.floor(c/n)][c%n]].type==="T")));
 const at=(T,c)=>T[Math.floor(c/n)][c%n],adj=new Map([...U].map(c=>[c,new Map()]));
 function edge(c,d,f){if(c===d)return;check(U.has(d),"closure");for(let T of tables)check(at(T,c)===f(at(T,d)),"dependency");adj.get(c).set(d,f)}
 for(let c of U){let x=Math.floor(c/n),y=c%n;for(let u of I)for(let v of I){if(u!==x&&v!==x&&F[u][v]===x){let w=F[v][y];if(ks.has(w))edge(c,v*n+y,z=>F[u][z]);else edge(c,u*n+w,z=>z);}if(u!==y&&v!==y&&F[u][v]===y){let w=F[x][u];if(ks.has(w))edge(c,x*n+u,z=>F[z][v]);else edge(c,w*n+v,z=>z);}}}
 function sinks(){let reach=c=>{let S=new Set([c]),q=[c];for(let d of q)for(let e of adj.get(d).keys())if(!S.has(e)){S.add(e);q.push(e)}return S};let reachMap=new Map([...U].map(c=>[c,reach(c)])),seen=new Set(),out=[];for(let c of U)if(!seen.has(c)){let C=[...reachMap.get(c)].filter(d=>reachMap.get(d).has(c));for(let d of C)seen.add(d);if(C.every(d=>[...adj.get(d).keys()].every(e=>C.includes(e))))out.push(C);}return out}
 const before=sinks();
 for(let c of U){let x=Math.floor(c/n),y=c%n;
  for(let v of LC(x))if(v!==x){let u=I.find(u=>F[u][v]===x);edge(c,v*n+y,z=>F[u][z]);}
  for(let v of RC(y))if(v!==y){let u=I.find(u=>F[v][u]===y);edge(c,x*n+v,z=>F[z][u]);}
 }
 const after=sinks(),X=A.filter(x=>RC(x).length>1&&LC(x).length===1),Y=A.filter(x=>LC(x).length>1&&RC(x).length===1);
 for(let C of after){check(C.length>=2,"small");if(C.length<=3){let x=Math.floor(C[0]/n),y=C[0]%n;for(let c of C){let u=Math.floor(c/n),v=c%n;check(X.includes(u)&&Y.includes(v)&&same(R[x],R[u])&&same(L[y],L[v]),"orientation");}}}
 check(after.length<=Math.floor((A.length*(A.length-1)+Math.floor(A.length*A.length/4))/4),"bound");
 for(let T of tables){let val=new Map(after.map(C=>[C[0],at(T,C[0])]));while(val.size<U.size){let old=val.size;for(let c of U)if(!val.has(c))for(let [d,f] of adj.get(c))if(val.has(d)){val.set(c,f(val.get(d)));break;}check(old!==val.size,"recovery stalled");}for(let c of U)check(val.get(c)===at(T,c),"recovery");}
 const reps=after.map(C=>C[0]);for(let skip=0;skip<reps.length;skip++){let V=new Map();for(let T of tables){let key=reps.filter((_,i)=>i!==skip).map(c=>at(T,c)).join(","),e=String(E(T));check(!V.has(key)||V.get(key)===e,"omission");V.set(key,e)}}
 // Each singleton triple has an exact independent variation keeping every cell outside it fixed.
 let triples=after.filter(C=>C.length===3);check(triples.length===3,"triple count");for(let C of triples){let c=C[0],x=els[Math.floor(c/n)],y=els[c%n],bit=1<<((x.u+y.u)%3),i=words.findIndex(w=>w[0]===7&&w[3]===1),j=words.findIndex(w=>w[0]===(7^bit)&&w[3]===1);check(i>=0&&j>=0,"pair");for(let u of I)for(let v of I)check((tables[i][u][v]!==tables[j][u][v])===C.includes(u*n+v),"independent triple");}
 const hist=S=>S.reduce((h,C)=>(h[C.length]=(h[C.length]||0)+1,h),{});
 return {tables:tables.length,n,a:A.length,K:K.length,associativityTriples:tables.length*n**3,relevant:U.size,before:hist(before),after:hist(after),r:st.r,gr:st.gr,h:st.h.map((v,i)=>[i,v]).filter(x=>x[1]!=="0"),singleOmissions:reps.length,independentTriples:triples.length};
}
console.log(JSON.stringify(audit(),null,2));
