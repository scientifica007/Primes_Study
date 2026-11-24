// Study 27. Independent deterministic checks. Node.js, no dependencies.
function audit27(){
 const range=n=>Array.from({length:n},(_,i)=>i), assert=(v,msg)=>{if(!v)throw Error(msg)};
 function layers(edges,order){let l=Array(edges.length).fill(-1),p=0,n=0,done=0;while(done<l.length){let add=new Set();for(let u=0;u<l.length;u++)if(l[u]>=0)for(let v of edges[u])if(l[v]<0)add.add(v);if(p<order.length&&l[order[p]]<0)add.add(order[p]);p++;for(let v of add){l[v]=n;done++;}n++;}return l;}
 let graphs=0,graphChecks=0;
 for(let n=1;n<=5;n++){let pairs=[];for(let i=0;i<n;i++)for(let j=i+1;j<n;j++)pairs.push([i,j]);for(let mask=0;mask<2**pairs.length;mask++){let edges=range(n).map(()=>[]);pairs.forEach(([u,v],k)=>{if(mask>>k&1)edges[u].push(v)});graphs++;for(let order of [range(n),range(n).reverse(),range(n).filter(i=>!(i%2)).concat(range(n).filter(i=>i%2))]){let l=layers(edges,order);for(let k of [2,3,4]){for(let u=0;u<n;u++)for(let v of edges[u])assert(l[v]<=l[u]+1,"level");for(let c=0;c<k;c++)for(let u=0;u<n;u++)if(l[u]%k!==c){let bound=l[u]+((c-l[u]%k+k)%k)-1;let todo=[u],seen=new Set(todo);for(let v of todo)for(let w of edges[v])if(l[w]%k!==c&&!seen.has(w)){assert(l[w]<=bound,"avoiding colour");seen.add(w);todo.push(w);}}graphChecks++;}}}}
 const assoc=t=>t.every((r,a)=>r.every((ab,b)=>t[b].every((bc,c)=>t[ab][c]===t[a][bc])));
 const wordMap=(t,seed)=>{let words=new Map(seed.map(x=>[x,[x]])),q=[...words.keys()];for(let x of q)for(let y of seed){let z=t[x][y];if(!words.has(z)){words.set(z,words.get(x).concat(y));q.push(z);}}return words;};
 let tables=0,bases=0,certificates=0,depEdges=0,classes=0,nontrivialRepairs=0;
 function auditTable(t){if(!assoc(t))return;tables++;let n=t.length,X=range(n),full=(1<<n)-1,from=m=>X.filter(x=>m>>x&1),mask=a=>[...a].reduce((s,x)=>s|1<<x,0);
 let C=range(full+1).map(m=>mask(wordMap(t,from(m)).keys()));
 let H=range(full+1).filter(m=>C[m]===full&&from(m).every(x=>C[m^(1<<x)]!==full));
 let E=full;for(let a of X)for(let b of X)if(t[a][b]!==a&&t[a][b]!==b)E&=~(1<<t[a][b]);
 let ideals=X.map(x=>{let a=new Set([x,...X.map(y=>t[y][x])]);return mask([...a,...[...a].flatMap(z=>X.map(y=>t[z][y]))]);});
 let ids=[...new Set(ideals)],J=ids.map(id=>mask(X.filter(x=>ideals[x]===id))),U=ids.map(id=>mask(X.filter(x=>ideals[x]!==id&&(ideals[x]&id)===id))),cls=X.map(x=>ids.indexOf(ideals[x]));
 for(let A of H){bases++;classes+=J.length;let aw=wordMap(t,from(A)),opts=[],edges=ids.map(()=>new Set());
 for(let i=0;i<J.length;i++){let a=A&J[i],col=new Map();assert((C[U[i]|a]&J[i])===J[i],"local gen");for(let x of from(a&~E)){let pair;for(let u of X)for(let v of X)if(!pair&&u!==x&&v!==x&&t[u][v]===x)pair=[u,v];assert(pair&&pair.every(y=>(J[i]|U[i])>>y&1),"witness");assert(pair.filter(y=>a>>y&1).length<=1,"one internal");let forbid=new Set(pair.filter(y=>col.has(y)).map(y=>col.get(y)));col.set(x,forbid.has(0)?1:0);}
 let b=[];for(let c=0;c<2;c++){let deleted=mask([...col.keys()].filter(x=>col.get(x)===c));let s=J[i]&~deleted;assert((C[U[i]|s]&J[i])===J[i],"complement");for(let x of from(s))if((C[U[i]|(s^(1<<x))]&J[i])===J[i])s^=1<<x;
 assert((C[U[i]|s]&J[i])===J[i]&&from(s).every(x=>(C[U[i]|(s^(1<<x))]&J[i])!==J[i]),"local min");
 if(s!==a)nontrivialRepairs++;b.push(s);let w=wordMap(t,from(U[i]|s));for(let x of from(a&~s))for(let y of w.get(x))if(U[i]>>y&1)for(let z of aw.get(y)){assert((U[i]>>z&1)!==0,"strict higher");edges[i].add(cls[z]);}
 }
 assert((a&b[0]&b[1])===(E&J[i]),"local core");opts.push([a,...b]);}
 depEdges+=edges.reduce((s,x)=>s+x.size,0);let es=edges.map(s=>[...s]);
 for(let order of [range(J.length),range(J.length).reverse(),range(J.length).filter(i=>!(i%2)).concat(range(J.length).filter(i=>i%2))]){let l=layers(es,order),B=[];for(let k=0;k<3;k++){let m=0;for(let i=0;i<J.length;i++){let c=l[i]%3;let o=k===c?0:k<c?k+1:k;m|=opts[i][o];}assert(H.includes(m),"global certificate");B.push(m);}assert((B[0]&B[1]&B[2])===E,"global core");certificates++;}
 }}
 for(let n=1;n<=3;n++)for(let code=0;code<n**(n*n);code++){let k=code,t=range(n).map(()=>range(n).map(()=>{let v=k%n;k=Math.floor(k/n);return v;}));auditTable(t);}
 for(let code=0;code<4**9;code++){let k=code,t=[[0,1,2,3],...[1,2,3].map(i=>[i,...range(3).map(()=>{let v=k%4;k=Math.floor(k/4);return v;})])];auditTable(t);}
 const meet=(a,b)=>a[0]<b[0]?a.slice(0,2):a[0]>b[0]?b.slice(0,2):[a[0],a[1]===b[1]?a[1]:0];
 const mul=(a,b)=>[...meet(a,b),a[2]^b[2],a[3]];
 const row=i=>{let r=0;while(i%2===0){r++;i/=2;}return r;};
 const seed=(kind,i,t)=>[i,t,kind===0?+(t===1):kind===1?+(t===2):+(t===0),row(i)];
 let infiniteWords=0,witnesses=0;
 for(let i=1;i<=20;i++)for(let t=0;t<3;t++)for(let g=0;g<2;g++)for(let r=0;r<8;r++){
 let target=[i,t,g,r];for(let scenario of [0,1,2,3,4]){let kind=Math.min(scenario,2),excluded=scenario===3?new Set(range(10).map(j=>j+1)):scenario===4?new Set([3,17,100]):new Set();let hi=2**r*(2*i+1);let word=[seed(kind,hi,1)];if(t===0)word.push(seed(kind,i,1),seed(kind,i,2));else word.push(seed(kind,i,t));let value=word.reduce(mul);if(value[2]!==g){let j=i+1;while(excluded.has(j))j++;word.push(seed(kind,j,kind===0?1:kind===1?2:0));value=word.reduce(mul);}
 assert(word.every(x=>kind!==2||x[1]!==0||!excluded.has(x[0])),"excluded");assert(value.join()===target.join(),"infinite generation word");infiniteWords++;}
 let a=[i+1,1,1,r],b=[i,t,g^1,0];assert(a.join()!==target.join()&&b.join()!==target.join()&&mul(a,b).join()===target.join(),"infinite E witness");witnesses++;
 }
 return {graphs,graphChecks,tables,bases,classes,nontrivialRepairs,depEdges,certificates,infiniteWords,witnesses};
}
console.log(JSON.stringify(audit27(),null,2));
