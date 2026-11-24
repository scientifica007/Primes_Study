// Independent even/odd order construction audit; exact minimax decision trees on label arrays.
function audit(){
 const ok=(v,m)=>{if(!v)throw Error(m)},range=n=>Array.from({length:n},(_,i)=>i);
 let tables=0,triples=0,pairs=0,metadata=0;const cases=[];
 for(const [p,q,pad] of [[1,2,0],[2,2,0],[2,2,1],[2,3,1]]){
  const S=[],map=new Map(),add=(t,i,c=0,d=0)=>{map.set([t,i,c,d].join(),S.length);S.push({t,i,c,d})},get=(t,i,c=0,d=0)=>map.get([t,i,c,d].join());
  const u=[1,2,2,1,...(pad?[1]:[])],v=[1,2,1,2,...(pad?[1]:[])];
  for(let i=0;i<4;i++)add("G",i);
  for(let i=0;i<p;i++)for(let c=0;c<2;c++)add("A",i,c);
  for(let j=0;j<q;j++)for(let d=0;d<2;d++)add("B",j,0,d);
  const ext=S.length;for(let l=0;l<u.length;l++)for(let c=0;c<u[l];c++)for(let d=0;d<v[l];d++)add("T",l,c,d);
  const z=S.length;add("z",0);const n=S.length,I=range(n),m=p*q,F=[];
  function table(W){return I.map(i=>I.map(j=>{let x=S[i],y=S[j];if(i===z||j===z)return z;
    if(x.t==="G"&&y.t==="G")return(i+j)%4;
    if(x.t==="G"){if(y.t==="A")return get("A",y.i,(y.c+i)%2);if(y.t==="T")return get("T",y.i,(y.c+i)%u[y.i],y.d);return j;}
    if(y.t==="G"){if(x.t==="B")return get("B",x.i,0,(x.d+j)%2);if(x.t==="T")return get("T",x.i,x.c,(x.d+j)%v[x.i]);return i;}
    if(x.t==="A"&&y.t==="A")return get("A",y.i,x.c);
    if(x.t==="B"&&y.t==="B")return get("B",x.i,0,y.d);
    if(x.t==="A"&&y.t==="B"){let l=W[x.i*q+y.i];return l<0?z:get("T",l,x.c%u[l],y.d%v[l]);}
    if(x.t==="A"&&y.t==="T")return get("T",y.i,x.c%u[y.i],y.d);
    if(x.t==="T"&&y.t==="B")return get("T",x.i,x.c,y.d%v[x.i]);return z;
  }))}
  function meta(T){const R=I.map(i=>[...new Set(T[i])].sort((a,b)=>a-b)),L=I.map(i=>[...new Set(I.map(j=>T[j][i]))].sort((a,b)=>a-b)),J=I.map(i=>[...new Set(L[i].flatMap(j=>R[j]))].sort((a,b)=>a-b));return {R,L,J};}
  for(let b=0;b<2;b++){let labels=[2*b,2*b+1];function visit(W){if(W.length===m){if(labels.every(l=>W.includes(l)))F.push({b,W,T:table(W)});return;}for(let l of [-1,...labels])visit([...W,l]);}visit(pad?[4]:[]);}
  const T0=F[0].T,M=meta(T0);let start=triples;
  for(let {b,W,T} of F){tables++;ok(JSON.stringify(meta(T))===JSON.stringify(M),"ideals");metadata++;
   for(let x of I)for(let y of I){let fixed=x<4||y<4||x>=ext||y>=ext||M.J.some(J=>J.length<n&&J.includes(x)&&J.includes(y))||T0[x][y]<ext;
    if(fixed)ok(T[x][y]===T0[x][y],"fixed");else ok(T[x][y]>=ext,"quotient");
    for(let t of I){ok(T[T[x][y]][t]===T[x][T[y][t]],"assoc");triples++;}}
   const E=I.filter(t=>!I.some(x=>x!==t&&I.some(y=>y!==t&&T[x][y]===t)));ok(E.length===b,"verdict");
   const absent=range(u.length).filter(l=>!W.includes(l));ok(absent.length===2&&absent.reduce((a,l)=>a*u[l]*v[l],1)===4,"statistics");
  }
  const memo=new Map();function cost(ids){if(ids.every(i=>F[i].b===F[ids[0]].b))return 0;let k=ids.join(",");if(memo.has(k))return memo.get(k);let best=m+1;for(let i=pad;i<m;i++){let M=new Map();for(let j of ids){let l=F[j].W[i];if(!M.has(l))M.set(l,[]);M.get(l).push(j);}if(M.size>1)best=Math.min(best,1+Math.max(...[...M.values()].map(cost)));}memo.set(k,best);return best;}
  const actual=cost(range(F.length));ok(actual===m-pad-1,"cost");cases.push({p,q,pad,n,tables:F.length,triples:triples-start,cost:actual});
 }
 return {cases,tables,triples,metadata};
}
console.log(JSON.stringify(audit(),null,2));
