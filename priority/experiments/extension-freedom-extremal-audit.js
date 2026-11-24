// Finite checks of the two constructions. The general bounds are proved separately.
function audit(){
 const out=[];
 function inspect(T,K,t){
  const n=T.length, idx=Array.from({length:n},(_,i)=>i), ks=new Set(K);
  const E=idx.filter(x=>!idx.some(a=>a!==x&&idx.some(b=>b!==x&&T[a][b]===x)));
  const R=idx.map(a=>[...new Set(T[a])].sort((a,b)=>a-b)), L=idx.map(b=>[...new Set(idx.map(a=>T[a][b]))].sort((a,b)=>a-b));
  const J=idx.map(a=>[...new Set(L[a].flatMap(b=>T[b]))].sort((a,b)=>a-b));
  for(let a of idx)for(let b of idx)for(let c of idx)if(T[T[a][b]][c]!==T[a][T[b][c]])throw Error("associativity");
  let sig=[R,L,J,idx.map(a=>T[a][a]===a),idx.map(a=>idx.some(b=>T[T[a][b]][a]===a))];
  for(let a of idx)for(let b of idx){if(ks.has(a)||ks.has(b))sig.push(T[a][b]);else sig.push(ks.has(T[a][b])?-1:T[a][b]);}
  for(let I of [...R,...L,...J])if(I.length<n)for(let a of I)for(let b of I)sig.push(T[a][b]);
  const rankWitness=E.slice();
  // Only for raw family E itself generates, verified separately.
  return {E,sig:JSON.stringify(sig),R,L};
 }
 for(const [p,q] of [[1,1],[1,2],[2,2],[2,3],[3,3]]){
  let n=p+q+3,t=n-2,z=n-1, A=Array.from({length:p},(_,i)=>i+1),B=Array.from({length:q},(_,i)=>i+p+1);
  let first=null,count=0;
  for(let w=0;w<2**(p*q);w++){
   let T=Array.from({length:n},(_,a)=>Array.from({length:n},(_,b)=>a===0?b:b===0?a:A.includes(a)&&A.includes(b)?b:B.includes(a)&&B.includes(b)?a:A.includes(a)&&B.includes(b)?(w>>(A.indexOf(a)*q+B.indexOf(b)))&1?t:z:A.includes(a)&&b===t||a===t&&B.includes(b)?t:z));
   let r=inspect(T,[t,z],t);
   if(first===null)first=r.sig;
   if(r.sig!==first||r.E.includes(t)!==(w===0))throw Error("membership");
   if(!r.E.includes(0)||!A.concat(B).every(a=>r.E.includes(a)))throw Error("fixed indispensable");
   count++;
  }
  out.push({kind:"membership",p,q,count,exactQueries:p*q});
 }
 for(const [a,k] of [[3,2],[4,2],[4,3],[5,4]]){
  const n=a+k+1, K=Array.from({length:k},(_,i)=>a+1+i),z=K[0],free=a*(a-k);
  let total=k**free,lim=Math.min(total,2000),first=null;
  for(let w=0;w<lim;w++){
    let m=w;
    let T=Array.from({length:n},(_,i)=>Array.from({length:n},(_,j)=>{
      if(i===0)return j;if(j===0)return i;if(i>a||j>a)return z;
      const d=(j-i+a)%a;if(d<k)return K[d];
      const x=K[m%k];m=Math.floor(m/k);return x;
    }));
    const r=inspect(T,K);
    if(first===null)first=r.sig;
    if(r.sig!==first||r.E.join(",")!==Array.from({length:a+1},(_,i)=>i).join(","))throw Error("raw");
    // E generates K by reserved cyclic diagonals.
    if(!K.every(x=>Array.from({length:a},(_,i)=>T[1][i+1]).includes(x)))throw Error("gen");
  }
  out.push({kind:"raw",a,k,free,total,checked:lim});
 }
 return out;
}
console.log(JSON.stringify(audit(),null,2));
