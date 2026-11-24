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

const M=matrix(9,4),v=witness(M),rank=reduce(M).piv.length;
assert(rank===8&&v[0]===5n,"rank and normalized singleton");
const choices=[];
for(let k=2;k<=9;k++){let A=M.map(row=>row.filter((_,i)=>i!==k-1));let w=witness(A);choices.push({size:k,determinesSingleton:w===null});assert((w===null)===(v[k-1]!==0n),"one coordinate criterion");}
console.log(JSON.stringify({rank,vector:v.map(String),choices},null,2));