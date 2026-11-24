// Finite audit of the dependency algorithm on explicitly enumerated promise families.
function audit(){
 function check(name, tables, g, K){
   const n=tables[0].length, ids=Array.from({length:n},(_,i)=>i), ks=new Set(K), A=ids.filter(i=>i>=g&&!ks.has(i));
   const ref=tables[0], index=(i,j)=>i*n+j, ij=k=>[Math.floor(k/n),k%n];
   const get=(T,c)=>T[Math.floor(c/n)][c%n];
   const E=tables.map(T=>ids.filter(t=>!ids.some(x=>x!==t&&ids.some(y=>y!==t&&T[x][y]===t))));
   const known=new Set(), cand=new Map();
   for(let x of ids)for(let y of ids){const c=index(x,y),values=new Set(tables.map(T=>T[x][y])); if(values.size===1)known.add(c);else cand.set(c,values);}
   // Verify all tables are associative and common extension data, and all outside K membership is known.
   const sig=T=>{const S=new Set(K), R=ids.map(i=>[...new Set(T[i])].sort((a,b)=>a-b)),L=ids.map(j=>[...new Set(ids.map(i=>T[i][j]))].sort((a,b)=>a-b)),J=ids.map(i=>[...new Set(L[i].flatMap(j=>T[j]))].sort((a,b)=>a-b));let s=[R,L,J];for(let x of ids)for(let y of ids){if(x<g||y<g||S.has(x)||S.has(y))s.push(T[x][y]);else s.push(S.has(T[x][y])?-1:T[x][y]);}for(let I of [...R,...L,...J])if(I.length<n)for(let x of I)for(let y of I)s.push(T[x][y]);return JSON.stringify(s);};
   let ss=sig(ref);for(let T of tables){if(sig(T)!==ss)throw Error("metadata "+name);for(let x of ids)for(let y of ids)for(let z of ids)if(T[T[x][y]][z]!==T[x][T[y][z]])throw Error("associativity "+name);}
   if(E[0].some(t=>!ks.has(t))){
     if(!E.every(e=>e.some(t=>!ks.has(t))))throw Error("fixed exterior");return {name,tables:tables.length,n,decision:"known nonempty",queries:0};
   }
   if(E.some(e=>e.some(t=>!ks.has(t))))throw Error("exterior");
   const targets=K.filter(t=>E.some(e=>e.includes(t))&&E.some(e=>!e.includes(t)));
   const U=new Set([...cand].filter(([c,v])=>targets.some(t=>v.has(t))).map(([c])=>c));
   const dep=new Map();
   for(let c of U){let [x,y]=ij(c), pair;
    for(let u of ids)for(let v of ids)if(u!==x&&v!==x&&ref[u][v]===x&&known.has(index(u,v)))pair??=[u,v];
    if(!pair)throw Error("no witness "+name);
    let [u,v]=pair,w=ref[v][y],alt,f;
    if(ks.has(w)){alt=index(v,y);f=z=>ref[u][z];}else{if(!known.has(index(v,y)))throw Error("quotient");alt=index(u,w);f=z=>z;}
    if(alt===c||!U.has(alt))throw Error("bad edge "+name);
    for(let T of tables)if(get(T,c)!==f(get(T,alt)))throw Error("relation");
    dep.set(c,{alt,f});
   }
   const roots=new Set(),visited=new Set();
   for(let c of U){let path=new Set(),x=c;while(!visited.has(x)&&!path.has(x)){path.add(x);x=dep.get(x).alt;}if(path.has(x))roots.add(x);for(let t of path)visited.add(t);}
   if(roots.size>Math.floor(U.size/2))throw Error("bound");
   for(let T of tables){const vals=new Map([...roots].map(c=>[c,get(T,c)]));while(vals.size<U.size){let prev=vals.size;for(let c of U)if(!vals.has(c)&&vals.has(dep.get(c).alt))vals.set(c,dep.get(c).f(vals.get(dep.get(c).alt)));if(vals.size===prev)throw Error("recovery");}for(let [c,v] of vals)if(v!==get(T,c))throw Error("incorrect recovery");}
   return {name,tables:tables.length,n,a:A.length,targets:targets.length,relevantCells:U.size,queries:roots.size,halfBound:Math.floor(U.size/2)};
 }
 function parity(p,q){
   const A=2*p,B=2*q,n=4+A+B+2,t=n-2,z=n-1, ia=x=>x>=4&&x<4+A, ib=x=>x>=4+A&&x<t;
   const tables=[];for(let m=0;m<2**(2*p*q);m++)tables.push(Array.from({length:n},(_,x)=>Array.from({length:n},(_,y)=>{
     if(x<4&&y<4)return (x+y)%4;
     if(x<4)return ib(y)?4+A+((y-4-A)^ (x%2)):y;
     if(y<4)return ia(x)?4+((x-4)^(y%2)):x;
     if(ia(x)&&ia(y))return y;if(ib(x)&&ib(y))return x;
     if(ia(x)&&ib(y)){let i=(x-4)>>1,j=(y-4-A)>>1,d=(x-4+y-4-A)%2;return ((m>>(2*(i*q+j)+d))&1)?t:z;}
     if(ia(x)&&y===t||x===t&&ib(y))return t;return z;
   })));
   return check("parity "+p+"x"+q,tables,4,[t,z]);
 }
 function opposite(){
   const n=14,g=3,t=11,u=12,z=13,typ=x=>x<3?"G":x<7?"A":x<11?"B":x===t?"t":x===u?"u":"z",row=x=>((x-3)%4)>>1,col=x=>(x-3)%2;
   let tables=[];for(let m=0;m<256;m++)tables.push(Array.from({length:n},(_,x)=>Array.from({length:n},(_,y)=>{
     let X=typ(x),Y=typ(y);if(X==="G"&&Y==="G")return (x+y)%3;if(X==="G")return y;if(Y==="G")return x;
     if(X===Y&&(X==="A"||X==="B"))return (X==="A"?3:7)+2*row(x)+col(y);
     if(X==="A"&&Y==="B")return (m>>(2*col(x)+row(y)))&1?t:z;
     if(X==="B"&&Y==="A")return (m>>(4+2*col(x)+row(y)))&1?u:z;
     if(X==="A"&&Y==="t"||X==="t"&&Y==="B")return t;
     if(X==="B"&&Y==="u"||X==="u"&&Y==="A")return u;return z;
   })));
   return check("opposite rectangles",tables,g,[t,u,z]);
 }
 return [parity(1,1),parity(1,2),parity(2,1),parity(2,2),opposite()];
}
console.log(JSON.stringify(audit(),null,2));
