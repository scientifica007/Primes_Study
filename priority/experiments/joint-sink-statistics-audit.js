// Run with Node.js. Checks all left/right witness-induced dependencies on explicit finite families.
function audit(){
 function check(name,tables,g,K){
  const n=tables[0].length,I=Array.from({length:n},(_,i)=>i),ks=new Set(K),A=I.filter(i=>i>=g&&!ks.has(i)),a=A.length,F=tables[0],ix=(x,y)=>x*n+y,at=(T,c)=>T[Math.floor(c/n)][c%n];
  const E=tables.map(T=>I.filter(t=>!I.some(x=>x!==t&&I.some(y=>y!==t&&T[x][y]===t))));
  if(E.some(e=>e.some(t=>!ks.has(t))))throw Error("exterior");
  const J=I.map(x=>[...new Set(I.flatMap(y=>I.map(z=>F[F[y][x]][z])))].sort((a,b)=>a-b));
  const classes=[];for(let x of K)if(!classes.some(C=>C.includes(x)))classes.push(K.filter(y=>String(J[x])===String(J[y])));
  const nonregular=classes.filter(C=>!I.some(y=>F[F[C[0]][y]][C[0]]===C[0]));
  const missing=tables.map(T=>nonregular.filter(C=>!I.some(x=>!C.includes(x)&&J[x].includes(C[0])&&I.some(y=>!C.includes(y)&&J[y].includes(C[0])&&C.includes(T[x][y])))));
  const target=nonregular.filter(C=>missing.some(Z=>Z.includes(C))&&missing.some(Z=>!Z.includes(C)));
  const U=new Set(A.flatMap(x=>A.map(y=>ix(x,y))).filter(c=>target.some(C=>tables.some(T=>C.includes(at(T,c))))));
  const adj=new Map([...U].map(c=>[c,new Map()]));const wit=new Map(A.map(x=>[x,I.flatMap(u=>I.filter(v=>u!==x&&v!==x&&F[u][v]===x).map(v=>[u,v]))]));
  function add(c,d,f){
    if(c===d||!U.has(d))throw Error("bad edge "+name);
    for(let T of tables)if(at(T,c)!==f(at(T,d)))throw Error("wrong dependency "+name);
    adj.get(c).set(d,f);
  }
  for(let c of U){let x=Math.floor(c/n),y=c%n;
    if(!wit.get(x).length||!wit.get(y).length)throw Error("missing witness");
    for(let [u,v] of wit.get(x)){let w=F[v][y];if(ks.has(w))add(c,ix(v,y),z=>F[u][z]);else add(c,ix(u,w),z=>z);}
    for(let [r,s] of wit.get(y)){let w=F[x][r];if(ks.has(w))add(c,ix(x,r),z=>F[z][s]);else add(c,ix(w,s),z=>z);}
  }
  const reach=c=>{let seen=new Set([c]),q=[c];for(let i=0;i<q.length;i++)for(let d of adj.get(q[i]).keys())if(!seen.has(d)){seen.add(d);q.push(d)}return seen};
  const reachMap=new Map([...U].map(c=>[c,reach(c)])), seen=new Set(),sinks=[];
  for(let c of U)if(!seen.has(c)){let C=[...reachMap.get(c)].filter(d=>reachMap.get(d).has(c));for(let d of C)seen.add(d);let S=new Set(C);if(C.every(d=>[...adj.get(d).keys()].every(v=>S.has(v))))sinks.push(C);}
  const X=new Set(),Y=new Set();let s2=0;for(let C of sinks){if(C.length<2)throw Error("singleton");if(C.length===2){s2++;for(let c of C){X.add(Math.floor(c/n));Y.add(c%n)}if(Math.floor(C[0]/n)===Math.floor(C[1]/n)||C[0]%n===C[1]%n)throw Error("shared coordinate");}}
  if([...X].some(x=>Y.has(x))||s2>Math.floor(a*a/8)||sinks.length>Math.floor((U.size+Math.floor(a*a/8))/3))throw Error("upper bound");
  for(let T of tables){let val=new Map(sinks.map(C=>[C[0],at(T,C[0])]));while(val.size<U.size){let old=val.size;for(let c of U)if(!val.has(c))for(let [d,f] of adj.get(c))if(val.has(d)){val.set(c,f(val.get(d)));break}if(old===val.size)throw Error("stalled");}for(let [c,v] of val)if(at(T,c)!==v)throw Error("recovery");}
  // Reverse-cell charging lemma. A reverse in U lies in an SCC of size at least four.
  const sinkOf=new Map();for(let C of sinks)for(let c of C)sinkOf.set(c,C);
  let revInside=0,revLargeSink=0;
  for(let C of sinks)if(C.length===2)for(let c of C){
    let x=Math.floor(c/n),y=c%n,d=ix(y,x);
    if(U.has(d)){revInside++;const size=[...reachMap.get(d)].filter(e=>reachMap.get(e).has(d)).length;
      if(size<4)throw Error("reverse SCC "+name);if(sinkOf.has(d)){revLargeSink++;if(sinkOf.get(d).length<4)throw Error("reverse sink");}}
  }
  if(sinks.length>Math.floor((a*(a-1)+Math.floor(a*a/16))/3))throw Error("reverse-charged bound");
  // Extended block charging: all relevant cells in X×X, Y×Y, Y×X cannot be in a sink of size <4.
  let charged=0;
  for(let c of U){let x=Math.floor(c/n),y=c%n;
    if((X.has(x)&&X.has(y))||(Y.has(x)&&Y.has(y))||(Y.has(x)&&X.has(y))){
      charged++;if(sinkOf.has(c)&&sinkOf.get(c).length<4)throw Error("extended charging "+name);
    }
  }
  if(sinks.length>Math.floor(a*(a-1)/3))throw Error("one-third upper bound");
  // All unary functional dependencies across relevant cells, including non-algebraic ones from promise.
  let unarySinks=null;
  if(false){let sizes=[];for(let C of sinks){for(let c of C)for(let d of U)if(!C.includes(d)){let map=new Map(),possible=true;for(let T of tables){let key=at(T,d),v=at(T,c);if(map.has(key)&&map.get(key)!==v){possible=false;break;}map.set(key,v)}if(possible)throw Error("unexpected unary dependence");}sizes.push(C.length);}unarySinks=sizes;}
  let hist={};for(let C of sinks)hist[C.length]=(hist[C.length]||0)+1;
  const reps=sinks.map(C=>C[0]), present=tables.map(T=>new Set(reps.map(c=>target.findIndex(C=>C.includes(at(T,c)))).filter(i=>i>=0)));
  for(let i=0;i<tables.length;i++)for(let j=0;j<target.length;j++)if(present[i].has(j)===missing[i].includes(target[j]))throw Error("representative coverage");
  const b=missing[0].length,P=missing[0].reduce((v,C)=>v*BigInt(C.length),1n);
  if(!missing.every(Z=>Z.length===b&&Z.reduce((v,C)=>v*BigInt(C.length),1n)===P))throw Error("rank and product");
  for(let skip=0;skip<reps.length;skip++){let verdict=new Map();for(let i=0;i<tables.length;i++){let key=reps.filter((_,j)=>j!==skip).map(c=>at(tables[i],c)).join(","),count=missing[i].filter(C=>C.length===1).length;if(verdict.has(key)&&verdict.get(key)!==count)throw Error("one omission");verdict.set(key,count);}}
  let best=reps.length,bestMask=0;
  for(let mask=0;mask<(1<<reps.length);mask++){let cost=reps.filter((_,i)=>mask>>i&1).length;if(cost>=best)continue;let V=new Map(),ok=true;for(let i=0;i<tables.length;i++){let key=reps.filter((_,j)=>mask>>j&1).map(c=>at(tables[i],c)).join(","),count=missing[i].filter(C=>C.length===1).length;if(V.has(key)&&V.get(key)!==count){ok=false;break;}V.set(key,count);}if(ok){best=cost;bestMask=mask;}}
  return {name,tables:tables.length,a,targets:target.map(C=>C.length),relevant:U.size,queries:reps.length,sinkSizes:hist,allSingleOmissionsPASS:true,bestNonadaptiveSubsetOfRepresentatives:best,bestMask};

 }
 function parity(p,q){
  const a=2*p,b=2*q,n=4+a+b+2,t=n-2,z=n-1,A=x=>x>=4&&x<4+a,B=x=>x>=4+a&&x<t;
  let tables=[];for(let m=0;m<2**(2*p*q);m++)tables.push(Array.from({length:n},(_,x)=>Array.from({length:n},(_,y)=>{
    if(x<4&&y<4)return(x+y)%4;if(x<4)return B(y)?4+a+((y-4-a)^(x%2)):y;if(y<4)return A(x)?4+((x-4)^(y%2)):x;
    if(A(x)&&A(y))return y;if(B(x)&&B(y))return x;if(A(x)&&B(y))return (m>>(2*(((x-4)>>1)*q+((y-4-a)>>1))+(x-4+y-4-a)%2))&1?t:z;
    if(A(x)&&y===t||x===t&&B(y))return t;return z;})));
  return check("parity "+p+"x"+q,tables,4,[t,z]);
 }
 function bidirectional(p,q){
   const a=2*p,b=2*q,n=4+a+b+3,t=n-3,u=n-2,z=n-1,A=x=>x>=4&&x<4+a,B=x=>x>=4+a&&x<t;
   const tables=[];for(let m=0;m<2**(2*p*q);m++)for(let reverse=0;reverse<2;reverse++)tables.push(Array.from({length:n},(_,x)=>Array.from({length:n},(_,y)=>{
     if(x<4&&y<4)return(x+y)%4;if(x<4)return B(y)?4+a+((y-4-a)^(x%2)):y;if(y<4)return A(x)?4+((x-4)^(y%2)):x;
     if(A(x)&&A(y))return y;if(B(x)&&B(y))return x;
     if(A(x)&&B(y))return (m>>(2*(((x-4)>>1)*q+((y-4-a)>>1))+(x-4+y-4-a)%2))&1?t:z;
     if(B(x)&&A(y))return reverse?u:z;
     if(A(x)&&y===t||x===t&&B(y))return t;
     if(B(x)&&y===u||x===u&&A(y))return u;return z;
   })));
   for(let T of tables)for(let x=0;x<n;x++)for(let y=0;y<n;y++)for(let w=0;w<n;w++)if(T[T[x][y]][w]!==T[x][T[y][w]])throw Error("bidirectional assoc");
   return check("bidirectional "+p+"x"+q,tables,4,[t,u,z]);
 }
 function opposite(){
  let tables=[];const n=14,t=11,u=12,z=13,typ=x=>x<3?"G":x<7?"A":x<11?"B":x===t?"t":x===u?"u":"z",row=x=>((x-3)%4)>>1,col=x=>(x-3)%2;
  for(let m=0;m<256;m++)tables.push(Array.from({length:n},(_,x)=>Array.from({length:n},(_,y)=>{let X=typ(x),Y=typ(y);if(X==="G"&&Y==="G")return(x+y)%3;if(X==="G")return y;if(Y==="G")return x;if(X===Y&&(X==="A"||X==="B"))return(X==="A"?3:7)+2*row(x)+col(y);if(X==="A"&&Y==="B")return(m>>(2*col(x)+row(y)))&1?t:z;if(X==="B"&&Y==="A")return(m>>(4+2*col(x)+row(y)))&1?u:z;if(X==="A"&&Y==="t"||X==="t"&&Y==="B")return t;if(X==="B"&&Y==="u"||X==="u"&&Y==="A")return u;return z;})));
  return check("opposite",tables,3,[t,u,z]);
 }
 function balanced(){
  const sizes=[1,2,2,4],els=[],map=new Map();
  for(let i=0;i<16;i++)els.push({type:"G",u:i%4,c:i>>2,k:-1});
  function add(k,type,u,c){map.set([k,type,u,c].join(","),els.length);els.push({k,type,u,c})}
  const get=(k,type,u,c)=>map.get([k,type,u,c].join(","));
  for(let k=0;k<4;k++)for(let type of ["A","B","t","z"])for(let u=0;u<(type==="A"||type==="B"?2:1);u++)for(let c=0;c<sizes[k];c++)add(k,type,u,c);
  const omega=els.length;els.push({type:"O",k:-2});const n=els.length,K=els.map((e,i)=>["t","z","O"].includes(e.type)?i:-1).filter(i=>i>=0);
  const tables=[];
  for(let mode=0;mode<2;mode++)for(let a=1;a<=3;a++)for(let b=1;b<=3;b++){let words=mode?[a,0,0,b]:[0,a,b,0];
    tables.push(Array.from({length:n},(_,i)=>Array.from({length:n},(_,j)=>{let x=els[i],y=els[j];if(i===omega||j===omega)return omega;if(x.type==="G"&&y.type==="G")return(x.u+y.u)%4+4*((x.c+y.c)%4);
    if(x.type==="G"||y.type==="G"){let g=x.type==="G"?x:y,h=x.type==="G"?y:x,v=h.u;if(x.type==="G"&&h.type==="B"||y.type==="G"&&h.type==="A")v^=g.u%2;return get(h.k,h.type,v,(h.c+g.c)%sizes[h.k]);}
    if(x.k!==y.k)return omega;let pair=x.type+y.type,type="z",u=0;
    if(pair==="AA"){type="A";u=y.u;}else if(pair==="BB"){type="B";u=x.u;}else if(pair==="AB"){type=(words[x.k]>>(x.u^y.u))&1?"t":"z";}else if(pair==="At"||pair==="tB")type="t";
    return get(x.k,type,u,(x.c+y.c)%sizes[x.k]);})));
  }
  return check("balanced T54",tables,16,K);
 }
 function multiblock(){
  const n=25,g=4,A=Array.from({length:8},(_,i)=>i+4),K=Array.from({length:13},(_,i)=>i+12),z=24;
  const block=x=>(x-4)>>1, parity=x=>(x-4)%2;
  let targets=new Map(),bit=new Map(),bits=0;
  for(let i=0;i<4;i++)for(let j=0;j<4;j++)if(i!==j){targets.set(i*4+j,12+targets.size);bit.set(i*4+j,bits);bits+=i<2&&j>=2?2:1;}
  const ts=[0,2**bits-1,...Array.from({length:bits},(_,i)=>2**i),...Array.from({length:bits},(_,i)=>2**bits-1-2**i)];
  const tables=ts.map(m=>Array.from({length:n},(_,x)=>Array.from({length:n},(_,y)=>{
    if(x===z||y===z)return z;
    if(x<4&&y<4)return(x+y)%4;
    if(x<4)return A.includes(y)&&block(y)>=2?y^(x%2):y;
    if(y<4)return A.includes(x)&&block(x)<2?x^(y%2):x;
    if(A.includes(x)&&A.includes(y)){let i=block(x),j=block(y);if(i===j)return i<2?y:x;let k=bit.get(i*4+j)+(i<2&&j>=2?(parity(x)^parity(y)):0);return (m>>k)&1?targets.get(i*4+j):z;}
    if(A.includes(x)&&K.includes(y)){let i=block(x);return [...targets].some(([k,v])=>v===y&&Math.floor(k/4)===i)?y:z;}
    if(K.includes(x)&&A.includes(y)){let j=block(y);return [...targets].some(([k,v])=>v===x&&k%4===j)?x:z;}
    return z;
  })));
  for(let T of tables)for(let x=0;x<n;x++)for(let y=0;y<n;y++)for(let w=0;w<n;w++)if(T[T[x][y]][w]!==T[x][T[y][w]])throw Error("multiblock associativity");
  return check("four blocks",tables,g,K);
 }
 return [balanced()];
}
console.log(JSON.stringify(audit(),null,2));
