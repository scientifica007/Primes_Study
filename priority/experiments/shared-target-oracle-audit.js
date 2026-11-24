// Run with Node.js. Finite checks, not a proof of the general theorem.
function audit(){
const s=[1,2,2,4],S=4,b=2;
function run(p,q,word){
const a=[],idx=new Map();function add(type,i,u,c){idx.set([type,i,u,c].join(","),a.length);a.push({type,i,u,c})}function get(type,i,u,c){let k=idx.get([type,i,u,c].join(","));if(k===undefined)throw Error("key");return k}
for(let c=0;c<S;c++)for(let u=0;u<4;u++)add("G",0,u,c);
for(let i=0;i<p;i++)for(let u=0;u<2;u++)for(let c=0;c<S;c++)add("A",i,u,c);
for(let i=0;i<q;i++)for(let u=0;u<2;u++)add("B",i,u,0);
for(let i=0;i<s.length;i++)for(let c=0;c<s[i];c++)add("t",i,0,c);
add("z",0,0,0);
const n=a.length,z=n-1,K=a.map((x,i)=>x.type==="t"||x.type==="z"?i:-1).filter(i=>i>=0),ks=new Set(K),T=Array.from({length:n},()=>new Int32Array(n));
for(let i=0;i<n;i++)for(let j=0;j<n;j++){let x=a[i],y=a[j],v=z;
if(i===z||j===z)v=z;
else if(x.type==="G"&&y.type==="G")v=get("G",0,(x.u+y.u)%4,(x.c+y.c)%S);
else if(x.type==="G"){if(y.type==="A")v=get("A",y.i,y.u,(x.c+y.c)%S);if(y.type==="B")v=get("B",y.i,(x.u+y.u)%2,0);if(y.type==="t")v=get("t",y.i,0,(x.c+y.c)%s[y.i]);}
else if(y.type==="G"){v=x.type==="A"?get("A",x.i,(x.u+y.u)%2,x.c):i;}
else if(x.type==="A"&&y.type==="A")v=get("A",y.i,y.u,x.c);
else if(x.type==="B"&&y.type==="B")v=i;
else if(x.type==="A"&&y.type==="B"){let l=word[2*(x.i*q+y.i)+(x.u+y.u)%2];if(l>=0)v=get("t",l,0,x.c%s[l]);}
else if(x.type==="A"&&y.type==="t")v=get("t",y.i,0,x.c%s[y.i]);
else if(x.type==="t"&&y.type==="B")v=i;
T[i][j]=v;}
let E=Array(n).fill(true),R=[],L=[],J=[],id=[],reg=[],I=Array.from({length:n},(_,i)=>i);
const sort=x=>[...new Set(x)].sort((a,b)=>a-b);
for(let i=0;i<n;i++){if(T[0][i]!==i||T[i][0]!==i)throw Error("identity");R.push(sort(T[i]));L.push(sort(I.map(j=>T[j][i])));J.push(sort(L[i].flatMap(j=>Array.from(T[j]))));id.push(T[i][i]===i);reg.push(I.some(j=>T[T[i][j]][i]===i));for(let j=0;j<n;j++){let v=T[i][j];if(v!==i&&v!==j)E[v]=false;for(let k=0;k<n;k++)if(T[v][k]!==T[i][T[j][k]])throw Error("assoc");}}
const absent=s.map((_,i)=>i).filter(i=>!word.includes(i)),expE=a.map(x=>x.type==="t"&&s[x.i]===1&&absent.includes(x.i));
if(E.some((x,i)=>x!==expE[i]))throw Error("E");
const sig=[R,L,J,id,reg];
for(let U of [...R,...L,...J])if(U.length<n)for(let i of U)for(let j of U)sig.push(T[i][j]);
for(let i=0;i<n;i++)for(let j=0;j<n;j++){if(ks.has(i)||ks.has(j)||a[i].type==="G"||a[j].type==="G")sig.push(T[i][j]);if(!ks.has(i)&&!ks.has(j))sig.push(ks.has(T[i][j])?-1:T[i][j]);}
const blocks=[];
for(let [type,k] of [["A",p],["B",q]])for(let i=0;i<k;i++)blocks.push(I.filter(j=>a[j].type===type&&a[j].i===i));
for(let i of absent)blocks.push(I.filter(j=>a[j].type==="t"&&a[j].i===i));
for(let B of blocks){let set=new Set(B);for(let i of I)if(!set.has(i))for(let j of I)if(!set.has(j)&&set.has(T[i][j]))throw Error("required block");}
let X=[get("G",0,1,0),get("G",0,0,1),...blocks.map(B=>B[0])],cl=new Set(X),queue=[...X];
for(let i=0;i<queue.length;i++)for(let j=0;j<=i;j++)for(let v of [T[queue[i]][queue[j]],T[queue[j]][queue[i]]])if(!cl.has(v)){cl.add(v);queue.push(v)}
if(cl.size!==n)throw Error("generation");
let h=3n*BigInt(S*S)*BigInt(2*S)**BigInt(p)*2n**BigInt(q)*absent.reduce((x,i)=>x*BigInt(s[i]),1n);
return {signature:JSON.stringify(sig),n,rank:X.length,h:String(h)};
}
let out=[];
for(let [p,q] of [[1,1],[1,2],[2,1],[2,2]]){
let m=2*p*q,ref=null,count=0,last;
for(let active of [[0,3],[1,2]]){
function check(w){if(!active.every(x=>w.includes(x)))return;let r=run(p,q,w);if(ref!==null&&r.signature!==ref)throw Error("metadata");ref=r.signature;if(last&&(last.rank!==r.rank||last.h!==r.h))throw Error("counts");last=r;count++;}
if(m<=4){for(let c=0;c<3**m;c++){let w=[],z=c;for(let i=0;i<m;i++){w.push([-1,...active][z%3]);z=Math.floor(z/3)}check(w);}}
else for(let i=0;i<m;i++)for(let j=0;j<m;j++)if(i!==j){let w=Array(m).fill(-1);w[i]=active[0];w[j]=active[1];check(w);}
}
out.push({p,q,m,count,n:last.n,rank:last.rank,h:last.h,exactDeterministic:m-b+1});
}
return out;
}
console.log(JSON.stringify(audit(),null,2));
