// Exact integer row reduction and singleton-coordinate certificates.
const assert=(b,m)=>{if(!b)throw Error(m)},abs=x=>x<0n?-x:x;
function gcd(a,b){a=abs(a);b=abs(b);while(b)[a,b]=[b,a%b];return a;}
const lcm=(a,b)=>a/gcd(a,b)*b;
function factors(n){let F=[];for(let p=2;p<=n;p++)while(n%p===0){F.push(p);n/=p;}return F;}
function sopfr(n){return factors(n).reduce((a,b)=>a+b,0);}
function matrix(k,L){const S=Array.from({length:k},(_,i)=>i+1),ps=S.filter(x=>x>1&&factors(x).length===1),J=S.slice(0,0);for(let j=1;j<=L;j++)if(j===1||j%2===0)J.push(j);
 return [[...S.map(()=>1n)],...ps.map(p=>S.map(x=>BigInt(factors(x).filter(y=>y===p).length))),...J.map(j=>S.map(x=>BigInt(x)**BigInt(j)))];}
function reduce(M){let A=M.map(r=>r.slice()),piv=[],i=0;
 for(let j=0;j<A[0].length&&i<A.length;j++){
  let t=A.findIndex((r,k)=>k>=i&&r[j]!==0n);if(t<0)continue;[A[i],A[t]]=[A[t],A[i]];piv.push(j);
  for(let u=0;u<A.length;u++)if(u!==i&&A[u][j]!==0n){
   let a=A[i][j],b=A[u][j];A[u]=A[u].map((v,k)=>a*v-b*A[i][k]);let g=A[u].reduce(gcd,0n);if(g)A[u]=A[u].map(v=>v/g);
  }i++;
 }return {A,piv};}
function witness(M){const {A,piv}=reduce(M),k=M[0].length;for(let f=0;f<k;f++)if(!piv.includes(f)){
 let v=Array(k).fill(0n),D=piv.reduce((d,p,i)=>lcm(d,abs(A[i][p])),1n);v[f]=D;
 piv.forEach((p,i)=>v[p]=-A[i][f]*D/A[i][p]);
 if(v[0]){let g=v.reduce(gcd,0n)*(v[0]<0n?-1n:1n);v=v.map(x=>x/g);assert(M.every(row=>row.reduce((s,a,i)=>s+a*v[i],0n)===0n),"kernel");return v;}
 }return null;}

const results=[];let checks=0;
for(let L=0;L<=12;L++){
 let found=null;
 for(let area=4;area<=100&&!found;area++)for(let U=2;U*U<=area&&!found;U++){
  if(area%U)continue;let V=area/U;
  const S=[...new Set(Array.from({length:U},(_,i)=>Array.from({length:V},(_,j)=>(i+1)*(j+1))).flat())].sort((a,b)=>a-b);
  const M=matrix(area,L).map(row=>S.map(s=>row[s-1]));
  const v=witness(M);checks++;
  const rank=reduce(M).piv.length,deleted=reduce(M.map(r=>r.slice(1))).piv.length;assert(Boolean(v)===(rank===deleted),"rank equivalence");
  if(v)found={L,area,U,V,support:S.map((s,i)=>[s,String(v[i])]).filter(x=>x[1]!=="0"),b:String(v.filter(x=>x>0n).reduce((a,b)=>a+b,0n))};
 }
 assert(found,"area limit");results.push(found);
}
console.log(JSON.stringify({checks,results},null,2));