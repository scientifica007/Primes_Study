// Exhaustive subset audit of a nonnull ideal with regular/nonregular interchangeable elements.
function audit(){
const G=[0,1,2,3],A=[4,5],B=[6,7],R=[8,9,10,11],z=12,twin=13,t=9,e=8,f=11,n=14,K=[...R,z,twin],I=Array.from({length:n},(_,i)=>i),ks=new Set(K);
const proj=x=>x===twin?t:x;
function multR(x,y){x=proj(x);y=proj(y);if(x===z||y===z)return z;let i=(x-8)>>1,l=(x-8)%2,j=(y-8)>>1,m=(y-8)%2;return l===1&&j===0?z:8+2*i+m}
function build(w){return I.map(x=>I.map(y=>{
if(x<4&&y<4)return(x+y)%4;
if(x<4)return B.includes(y)?6+((y-6)^(x%2)):y;
if(y<4)return A.includes(x)?4+((x-4)^(y%2)):x;
if(A.includes(x)&&A.includes(y))return y;
if(B.includes(x)&&B.includes(y))return x;
if(A.includes(x)&&B.includes(y))return w>>( (x-4+y-6)%2)&1?t:twin;
if(B.includes(x)&&A.includes(y))return z;
if(A.includes(x)&&y===twin||x===twin&&B.includes(y))return twin;
return multR(A.includes(x)?e:B.includes(x)?f:x,A.includes(y)?e:B.includes(y)?f:y);
}));}
function closure(T,X){let S=new Set(X),q=[...S];for(let i=0;i<q.length;i++)for(let j=0;j<=i;j++)for(let x of [T[q[i]][q[j]],T[q[j]][q[i]]])if(!S.has(x)){S.add(x);q.push(x)}return S;}
const sorted=S=>[...new Set(S)].sort((a,b)=>a-b);
let data=[],ref=null,localRef=null;for(let w=0;w<4;w++){
let T=build(w);for(let x of I){if(T[0][x]!==x||T[x][0]!==x)throw Error("identity");for(let y of I)for(let k of I)if(T[T[x][y]][k]!==T[x][T[y][k]])throw Error("assoc "+[w,x,y,k])}
let L=I.map(y=>sorted(I.map(x=>T[x][y]))),RR=I.map(x=>sorted(T[x])),J=I.map(x=>sorted(L[x].flatMap(y=>T[y]))),reg=I.map(x=>I.some(y=>T[T[x][y]][x]===x)),id=I.map(x=>T[x][x]===x);
let sig=[L,RR,J,reg,id];for(let x of I)for(let y of I){if(ks.has(x)||ks.has(y)||x<4||y<4)sig.push(T[x][y]);if(!ks.has(x)&&!ks.has(y))sig.push(ks.has(T[x][y])?-1:T[x][y]);}
for(let S of [...L,...RR,...J])if(S.length<n)for(let x of S)for(let y of S)sig.push(T[x][y]);
sig=JSON.stringify(sig);if(ref&&ref!==sig)throw Error("metadata");ref=sig;
let classes=[];for(let x of I)if(!classes.some(C=>C.includes(x)))classes.push(I.filter(y=>String(J[x])===String(J[y])));
let local=[],missing=[],fixedG=[1],fixedH=[1];function mul(a,b){let c=Array(a.length+b.length-1).fill(0);for(let i=0;i<a.length;i++)for(let j=0;j<b.length;j++)c[i+j]+=a[i]*b[j];return c}
let tau=I.map(x=>JSON.stringify([K.map(y=>T[x][y]),K.map(y=>T[y][x])]));
for(let C of classes){let x=C[0],U=I.filter(y=>J[x].every(z=>J[y].includes(z))&&J[y].length>J[x].length),hits=[],g=Array(C.length+1).fill(0),h=Array(C.length+1).fill(0);
for(let m=0;m<2**C.length;m++){let X=C.filter((_,i)=>m>>i&1),cl=closure(T,[...U,...X]),good=C.every(t=>cl.has(t));if(ks.has(x)&&reg[x]){let sigs=new Set([...cl].map(z=>tau[z]));let imageGood=C.every(t=>sigs.has(tau[t]));if(imageGood!==good)throw Error("image criterion")}
if(good){hits.push(m);g[X.length]++;}}
for(let m of hits)if(!hits.some(k=>k!==m&&(k&m)===k))h[C.filter((_,i)=>m>>i&1).length]++;
if(reg[x]||!ks.has(x)){local.push([C,hits]);fixedG=mul(fixedG,g);fixedH=mul(fixedH,h)}else if(!hits.includes(0))missing.push(C.length);
}
if(localRef&&localRef!==JSON.stringify(local))throw Error("local family");localRef=JSON.stringify(local);
let allG=Array(n+1).fill(0),allH=Array(n+1).fill(0),gen=new Uint8Array(2**n);
for(let m=0;m<gen.length;m++){let X=I.filter(x=>m>>x&1);if(closure(T,X).size===n){gen[m]=1;allG[X.length]++;}}
for(let m=0;m<gen.length;m++)if(gen[m]){let X=I.filter(x=>m>>x&1);if(X.every(x=>!gen[m^(1<<x)]))allH[X.length]++}
let gg=fixedG,hh=fixedH;
for(let C of classes)if(ks.has(C[0])&&!reg[C[0]]){let U=I.filter(y=>J[C[0]].every(z=>J[y].includes(z))&&J[y].length>J[C[0]].length),b= C.some(t=>closure(T,U).has(t)),v=[1];for(let k=0;k<C.length;k++)v=mul(v,[1,1]);if(!b)v[0]=0;gg=mul(gg,v);hh=mul(hh,b?[1]:[0,C.length]);}
for(let i=0;i<=n;i++)if(allG[i]!== (gg[i]||0)||allH[i]!== (hh[i]||0))throw Error("enumerator");
let CJ=classes.find(C=>C.includes(t)),U=I.filter(y=>J[t].every(z=>J[y].includes(z))&&J[y].length>J[t].length);
let E=I.filter(t=>!I.some(x=>x!==t&&I.some(y=>y!==t&&T[x][y]===t)));
data.push({w,E,missing,regularFromAbove:CJ.filter(x=>closure(T,U).has(x)),regularLocal:local.find(([C])=>C.includes(t)),rank:allG.findIndex(x=>x>0),g:allG,h:allH});
}
return {n,tables:4,subsetsPerTable:2**n,data};
}
console.log(JSON.stringify(audit(),null,2));
