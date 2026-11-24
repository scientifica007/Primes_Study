// Adaptation of Chang (2014), Eq. (10), to separate table learning from E decision.
// All nonidentity triples collapse to 2; anchors force identical labelled ideals.
function audit(){
 const assert=(v,m)=>{if(!v)throw Error(m)},range=n=>Array.from({length:n},(_,i)=>i);
 let tables=0,triples=0,metadataChecks=0,subsetChecks=0;
 const cases=[];
 for(const n of [9,10,11,16]){
  const I=range(n),m=Math.floor(Math.sqrt(n)),V=I.filter(x=>x>m),[a,b,...U]=V,K=I.filter(x=>x>=2&&x<=m);
  const slots=U.flatMap((x,i)=>U.slice(i+1).map(y=>[x,y]));
  const fixed=(x,y)=>x===0?y:y===0?x:x<=m||y<=m||x===y?2:x===b||y===b?3:x===a||y===a?2:null;
  const make=bits=>{let T=I.map(x=>I.map(y=>fixed(x,y)));slots.forEach(([x,y],i)=>T[x][y]=T[y][x]=2+Number((bits>>BigInt(i))&1n));return T;};
  function meta(T){
   const R=I.map(x=>[...new Set(T[x])].sort((a,b)=>a-b));
   const L=I.map(y=>[...new Set(I.map(x=>T[x][y]))].sort((a,b)=>a-b));
   const J=I.map(x=>[...new Set(L[x].flatMap(y=>R[y]))].sort((a,b)=>a-b));
   return JSON.stringify({L,R,J});
  }
  function closure(T,S){const C=new Set(S);let changed=true;while(changed){changed=false;for(const x of C)for(const y of C)if(!C.has(T[x][y])){C.add(T[x][y]);changed=true;}}return C;}
  const base=make(0n),M=meta(base),kset=new Set(K),expected=I.filter(x=>x!==2&&x!==3);
  const total=1n<<BigInt(slots.length),patterns=n<=11?Array.from({length:Number(total)},(_,i)=>BigInt(i)):[0n,total-1n,...slots.map((_,i)=>1n<<BigInt(i))];
  const start=triples;
  for(const bits of patterns){
   const T=make(bits);tables++;
   assert(meta(T)===M,"all ideals");metadataChecks++;
   for(const x of I)for(const y of I){
    assert(T[0][x]===x&&T[x][0]===x&&T[x][y]===T[y][x],"identity and commutativity");
    assert(T[T[x][x]][x]===T[x][x],"aperiodicity");
    if(kset.has(x)||kset.has(y)||base[x][y]===0||!kset.has(base[x][y]))assert(T[x][y]===base[x][y],"K action or quotient");
    // Every principal ideal other than M contains at most one high label.
    if(x===y||x<=m||y<=m)assert(T[x][y]===base[x][y],"proper principal internal tables");
    for(const z of I){assert(T[T[x][y]][z]===T[x][T[y][z]],"associativity");triples++;}
   }
   const E=I.filter(t=>!I.some(x=>x!==t&&I.some(y=>y!==t&&T[x][y]===t)));
   assert(String(E)===String(expected)&&closure(T,E).size===n,"unique minimal generating set");
   // Full subset classification in the smallest order, without using E to infer closure.
   if(n===9)for(let mask=0;mask<(1<<n);mask++){
    const S=I.filter(x=>mask&(1<<x));
    assert((closure(T,S).size===n)===expected.every(x=>S.includes(x)),"all subsets");subsetChecks++;
   }
  }
  for(let i=0;i<slots.length;i++){
   const T=make(1n<<BigInt(i));let dif=[];
   for(let x of I)for(let y of I)if(T[x][y]!==base[x][y])dif.push([x,y]);
   let [x,y]=slots[i];assert(String(dif)===String([[x,y],[y,x]]),"one bit exactly two cells");
  }
  cases.push({n,high:V.length,slots:slots.length,tables:patterns.length,triples:triples-start,rank:n-2,g_r:1,E:n-2});
 }
 return {cases,tables,triples,metadataChecks,subsetChecks};
}
console.log(JSON.stringify(audit(),null,2));