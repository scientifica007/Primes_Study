// Run with Node.js. Checks all left/right witness-induced dependencies on explicit finite families.
function audit(){
 function check(name,tables,g,K){
  const n=tables[0].length,I=Array.from({length:n},(_,i)=>i),ks=new Set(K),A=I.filter(i=>i>=g&&!ks.has(i)),a=A.length,F=tables[0],ix=(x,y)=>x*n+y,at=(T,c)=>T[Math.floor(c/n)][c%n];
  const E=tables.map(T=>I.filter(t=>!I.some(x=>x!==t&&I.some(y=>y!==t&&T[x][y]===t))));
  if(E.some(e=>e.some(t=>!ks.has(t))))throw Error("exterior");
  const target=K.filter(t=>E.some(e=>e.includes(t))&&E.some(e=>!e.includes(t)));
  const U=new Set(A.flatMap(x=>A.map(y=>ix(x,y))).filter(c=>target.some(t=>tables.some(T=>at(T,c)===t))));
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
  // All unary functional dependencies across relevant cells, including non-algebraic ones from promise.
  let unarySinks=null;
  if(name==="balanced T54"){let sizes=[];for(let C of sinks){for(let c of C)for(let d of U)if(!C.includes(d)){let map=new Map(),possible=true;for(let T of tables){let key=at(T,d),v=at(T,c);if(map.has(key)&&map.get(key)!==v){possible=false;break;}map.set(key,v)}if(possible)throw Error("unexpected unary dependence");}sizes.push(C.length);}unarySinks=sizes;}
  let hist={};for(let C of sinks)hist[C.length]=(hist[C.length]||0)+1;
  return {name,tables:tables.length,a,targets:target.length,relevant:U.size,queries:sinks.length,sinkSizes:hist,unarySinks};
 }
 function parity(p,q){
  const a=2*p,b=2*q,n=4+a+b+2,t=n-2,z=n-1,A=x=>x>=4&&x<4+a,B=x=>x>=4+a&&x<t;
  let tables=[];for(let m=0;m<2**(2*p*q);m++)tables.push(Array.from({length:n},(_,x)=>Array.from({length:n},(_,y)=>{
    if(x<4&&y<4)return(x+y)%4;if(x<4)return B(y)?4+a+((y-4-a)^(x%2)):y;if(y<4)return A(x)?4+((x-4)^(y%2)):x;
    if(A(x)&&A(y))return y;if(B(x)&&B(y))return x;if(A(x)&&B(y))return (m>>(2*(((x-4)>>1)*q+((y-4-a)>>1))+(x-4+y-4-a)%2))&1?t:z;
    if(A(x)&&y===t||x===t&&B(y))return t;return z;})));
  return check("parity "+p+"x"+q,tables,4,[t,z]);
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
 return [parity(1,1),parity(1,2),parity(2,1),parity(2,2),opposite(),balanced()];
}
console.log(JSON.stringify(audit(),null,2));
