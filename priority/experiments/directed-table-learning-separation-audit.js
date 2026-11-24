// Directed anchored family inspired by Chang; quotient-generator reconstruction.
function audit(){
 const ok=(b,m)=>{if(!b)throw Error(m)},range=n=>Array.from({length:n},(_,i)=>i);
 let totalTables=0,totalTriples=0,totalCells=0,subsetChecks=0,flips=0;const cases=[];
 for(const n of [5,6,7,8,9,12]){
  // 0=e, 1=z, 2=t; 3=a, 4=b; other labels U.
  const I=range(n),V=I.slice(3),U=I.slice(5),K=[1,2],slots=U.flatMap(x=>U.filter(y=>x!==y).map(y=>[x,y]));
  const make=bits=>{const T=I.map(x=>I.map(y=>x===0?y:y===0?x:x<3||y<3||x===y?1:x===4||y===4?2:1));slots.forEach(([x,y],i)=>T[x][y]=1+Number((bits>>BigInt(i))&1n));return T;};
  const base=make(0n);
  const ideals=T=>{let R=I.map(x=>[...new Set(T[x])].sort((a,b)=>a-b)),L=I.map(y=>[...new Set(I.map(x=>T[x][y]))].sort((a,b)=>a-b));return {R,L,J:I.map(x=>[...new Set(L[x].flatMap(y=>R[y]))].sort((a,b)=>a-b))};};
  const M=ideals(base),E=[0,...V],Q=I.filter(x=>!K.includes(x)),quot=x=>K.includes(x)?1:x;
  const N=1n<<BigInt(slots.length),patterns=n<=9?Array.from({length:Number(N)},(_,i)=>BigInt(i)):[0n,N-1n,...slots.map((_,i)=>1n<<BigInt(i))];
  function closure(T,S){const C=new Set(S);let change=true;while(change){change=false;for(let x of C)for(let y of C)if(!C.has(T[x][y])){C.add(T[x][y]);change=true;}}return C;}
  for(const bits of patterns){
   const T=make(bits);totalTables++;ok(JSON.stringify(ideals(T))===JSON.stringify(M),"ideals");
   for(let x of I)for(let y of I){
    ok(T[x][0]===x&&T[0][x]===x,"identity");ok(T[T[x][x]][T[x][x]]===T[T[T[x][x]][T[x][x]]][x],"aperiodic power 4");
    ok(quot(T[x][y])===quot(base[x][y]),"quotient");
    if(K.includes(x)||K.includes(y)||x===0||y===0||M.J.some(J=>J.length<n&&J.includes(x)&&J.includes(y)))ok(T[x][y]===base[x][y],"fixed supplied");
    for(let z of I){ok(T[T[x][y]][z]===T[x][T[y][z]],"assoc");totalTriples++;}
   }
   const actual=I.filter(t=>!I.some(x=>x!==t&&I.some(y=>y!==t&&T[x][y]===t)));
   ok(String(actual)===String(E)&&closure(T,E).size===n,"E and generation");
   if(n<=7)for(let mask=0;mask<2**n;mask++){let S=I.filter(x=>mask&(1<<x));ok((closure(T,S).size===n)===E.every(x=>S.includes(x)),"subset classification");subsetChecks++;}
   // Recover via quotient words. In this family all high labels are quotient generators.
   // Query only unknown products in generator columns; all K actions and nonzero quotient entries fixed.
   const generators=V,words=new Map([[0,[0]],...generators.map(x=>[x,[x]])]);
   function transition(x,s){if(K.includes(x)||K.includes(s)||x===0||s===0||quot(base[x][s])!==1)return base[x][s];ok(generators.includes(s),"queried column");return T[x][s];}
   for(let x of I)for(let y of I){let val;if(K.includes(y))val=base[x][y];else{val=x;for(let s of words.get(y))val=transition(val,s);}ok(val===T[x][y],"reconstruction");totalCells++;}
  }
  for(let j=0;j<slots.length;j++){let T=make(1n<<BigInt(j)),diff=I.flatMap(x=>I.filter(y=>T[x][y]!==base[x][y]).map(y=>[x,y]));ok(JSON.stringify(diff)===JSON.stringify([slots[j]]),"single ordered cell");flips++;}
  cases.push({n,free:slots.length,tables:patterns.length,rank:n-2});
 }
 return {cases,totalTables,totalTriples,totalCells,subsetChecks,flips};
}
console.log(JSON.stringify(audit(),null,2));