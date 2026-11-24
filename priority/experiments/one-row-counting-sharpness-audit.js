// One-row lower construction for cardinality, not emptiness.
// Full associativity for small cases; deterministic sampled triples at L=4.
function audit(){
 const ok=(x,m)=>{if(!x)throw Error(m)},range=n=>Array.from({length:n},(_,i)=>i);
 const choose=(n,k)=>{if(k<0||k>n)return 0n;let v=1n;for(let i=1;i<=k;i++)v=v*BigInt(n-i+1)/BigInt(i);return v;};
 function conv(a,b){let c=Array(a.length+b.length-1).fill(0n);for(let i=0;i<a.length;i++)for(let j=0;j<b.length;j++)c[i+j]+=a[i]*b[j];return c;}
 const binom=n=>range(n+1).map(k=>choose(n,k));
 function cover(q,V){let g=Array(q*V+1).fill(0n);for(let i=0;i<=q;i++)for(let j=0;j<=V;j++){let c=(-1n)**BigInt(q+V-i-j)*choose(q,i)*choose(V,j);for(let k=0;k<=i*j;k++)g[k]+=c*choose(i*j,k);}return g;}
 let totals={tables:0,exhaustiveTriples:0,sampledTriples:0,metadataChecks:0,coefficientChecks:0,closureChecks:0,zeroTranscriptChecks:0},results=[];
 for(const cfg of [
 {L:0,V:4,p:2,q:4,plus:[1,4],minus:[2,2]},
 {L:1,V:6,p:2,q:6,plus:[1,3,4,4],minus:[2,2,2,6]},
 {L:4,V:9,p:7,q:9,plus:[...Array(5).fill(1),...Array(36).fill(3),...Array(20).fill(8)],minus:[...Array(26).fill(2),...Array(8).fill(4),...Array(18).fill(6),...Array(9).fill(9)]}
 ]){
 const {L,V,p,q,plus,minus}=cfg,b=plus.length,m=p*q,sizes=[...plus,...minus];
 const prod=S=>S.reduce((a,x)=>a*BigInt(x),1n),moment=(S,k)=>S.reduce((a,x)=>a+BigInt(x)**BigInt(k),0n);
 ok(plus.length===minus.length&&prod(plus)===prod(minus),"balance");
 for(let k=1;k<=L;k++)if(k===1||k%2===0)ok(moment(plus,k)===moment(minus,k),"moments");
 const S=[],add=(type,i=0,d=0)=>(S.push({type,i,d}),S.length-1);
 for(let i=0;i<3;i++)add("G",i);
 const A=range(p).map(i=>add("A",i));
 const B=range(q).map(i=>range(V).map(d=>add("B",i,d)));
 const layers=sizes.map((s,i)=>range(s).map(d=>add("T",i,d)));
 const z=add("z"),K=layers.flat().concat(z),ks=new Set(K),n=S.length,I=range(n);
 const make=W=>I.map(x=>Uint16Array.from(I,y=>{
 let X=S[x],Y=S[y];
 if(X.type==="G"&&Y.type==="G")return (x+y)%3;
 if(X.type==="G")return y;if(Y.type==="G")return x;
 if(X.type==="A"&&Y.type==="A")return y;
 if(X.type==="B"&&Y.type==="B")return B[X.i][Y.d];
 if(X.type==="A"&&Y.type==="B"){let l=W[X.i*q+Y.i];return l<0?z:layers[l][Y.d%sizes[l]];}
 if(X.type==="A"&&Y.type==="T")return y;
 if(X.type==="T"&&Y.type==="B")return layers[X.i][Y.d%sizes[X.i]];
 return z;
 }));
 const bG=cover(q,V),F=conv(conv([0n,2n,3n,1n],Array(p).fill(0n).concat(1n)),bG);
 const D=K.length;
 function poly(Z){let g=F.slice(),sum=0;for(let s of Z){let f=binom(s);f[0]=0n;g=conv(g,f);sum+=s;}return conv(g,binom(D-sum));}
 const P=poly(plus),Q=poly(minus),rk=1+p+q+b;
 ok(P.findIndex(x=>x!==0n)===rk&&Q.findIndex(x=>x!==0n)===rk,"rank");
 for(let j=0;j<=L;j++){ok(P[rk+j]===Q[rk+j],"coefficient");totals.coefficientChecks++;}
 const cases=[];
 for(let mode=0;mode<2;mode++){
 let W=Array(m).fill(-1);range(b).forEach(i=>W[i]=i+mode*b);cases.push({T:make(W),mode,W});
 }
 const base=cases[0].T,signature=T=>{
 const R=I.map(x=>[...new Set(T[x])].sort((a,b)=>a-b)), LL=I.map(y=>[...new Set(I.map(x=>T[x][y]))].sort((a,b)=>a-b));
 return JSON.stringify({R,LL});};
 const sig=signature(base);
 for(const {T,mode,W} of cases){
 totals.tables++;
 ok(signature(T)===sig,"principal ideals");totals.metadataChecks++;
 for(let x of I)for(let y of I){
 ok(T[0][x]===x&&T[x][0]===x,"identity");
 const v=T[x][y],w=base[x][y];
 ok((ks.has(v)?z:v)===(ks.has(w)?z:w),"quotient");
 if(S[x].type!=="A"||S[y].type!=="B")ok(v===w,"all non-AB products fixed");
 if(x===y)ok((v===x)===(w===x),"idempotence");
 }
 if(L<4){for(let x of I)for(let y of I){let xy=T[x][y];for(let t of I){ok(T[xy][t]===T[x][T[y][t]],"associativity");totals.exhaustiveTriples++;}}}
 else{let state=12345;function next(){state=(Math.imul(state,1664525)+1013904223)>>>0;return state%n;}for(let k=0;k<1000000;k++){let x=next(),y=next(),t=next();ok(T[T[x][y]][t]===T[x][T[y][t]],"sample associativity");totals.sampledTriples++;}}
 let decomp=new Set();for(let x of I)for(let y of I){let v=T[x][y];if(v!==x&&v!==y)decomp.add(v);}
 const E=I.filter(x=>!decomp.has(x)),absent=layers.filter((_,i)=>mode===0?i>=b:i<b),expected=A.concat(absent.filter(l=>l.length===1).flat());
 ok(String(E)===String(expected),"E count/labels");ok(E.length>0,"emptiness constant");
 const good=SS=>[1,2].some(x=>SS.has(x))&&A.every(x=>SS.has(x))&&B.every(row=>row.some(x=>SS.has(x)))&&range(V).every(d=>B.some(row=>SS.has(row[d])))&&absent.every(l=>l.some(x=>SS.has(x)));
 function closure(SS){let C=new Set(SS),changed=true;while(changed){changed=false;let a=[...C];for(let x of a)for(let y of a)if(!C.has(T[x][y])){C.add(T[x][y]);changed=true;}}return C.size===n;}
 const gen=[1,...A,...B.map((row,i)=>row[i%V]),...absent.map(l=>l[0])];
 const samples=[gen,I,[],...gen.slice(0,Math.min(gen.length,16)).map(t=>gen.filter(x=>x!==t))];
 for(let d=0;d<8;d++){let state=7919*(d+1);samples.push(I.filter(()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state%100<80;}));}
 for(let sample of samples){ok(closure(sample)===good(new Set(sample)),"closure");totals.closureChecks++;}
 if(m<=12)for(let mask=0;mask<2**m;mask++){let rest=range(m).filter(i=>!(mask&(1<<i)));if(rest.length>=b){let w=Array(m).fill(-1);range(b).forEach(i=>w[rest[i]]=i+mode*b);ok(range(m).every(i=>!(mask&(1<<i))||w[i]===-1),"transcript");}totals.zeroTranscriptChecks++;}
 }
 results.push({L,n,V,p,q,b,rank:rk,countPlusAbsent:p+plus.filter(x=>x===1).length,countMinusAbsent:p+minus.filter(x=>x===1).length,commonCoefficients:P.slice(rk,rk+L+1).map(String),promisedCost:m-b+1});
 }
 return {totals,results};
}
console.log(JSON.stringify(audit(),null,2));