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
let results=[],rankChecks=0;
for(let L=0;L<=12;L++){
 for(let k=1;k<=64;k++){let M=matrix(k,L),v=witness(M);rankChecks++;
  let rank=reduce(M).piv.length,deleted= k===1?0:reduce(M.map(r=>r.slice(1))).piv.length;assert(Boolean(v)===(rank===deleted),"singleton row space");
  if(v){let b=v.filter(x=>x>0n).reduce((s,x)=>s+x,0n),S=v.reduce((s,x,i)=>x?lcm(s,BigInt(i+1)):s,1n);results.push({L,k,rank,vector:v.map(String),b:String(b),modulus:String(S)});break;}
 }
}
assert(results.length===13,"all thresholds");
let identityChecks=0,ratioChecks=0;
// Enumerate every multiset of at most 5 sizes in 1..12.
function visit(S,start){let b=S.length,p1=S.reduce((s,x)=>s+x,0),sp=S.reduce((s,x)=>s+sopfr(x),0),cor=S.filter(x=>x>=6&&factors(x).length>=2).reduce((s,x)=>s+x-sopfr(x),0);
 assert(p1-sp-cor===S.filter(x=>x===1).length,"sopfr identity");identityChecks++;
 // Compute g_r and g_(r+1) from the polynomial product (1+w)^size-1
 // and an arbitrary 2 additional freely optional elements.
 let lead=1n,next=0n;for(let x of S){let a=BigInt(x),b=a*(a-1n)/2n;next=next*a+lead*b;lead*=a;}next+=2n*lead;
 let D=p1+2;assert(BigInt(2*D-b-p1)*lead===2n*next,"coefficient ratio");ratioChecks++;
 if(S.length<5)for(let x=start;x<=12;x++)visit([...S,x],x);
}visit([],1);
for(let s=2;s<=10000;s++)assert((s-sopfr(s)===0)===(s===4||factors(s).length===1),"zero set");
console.log(JSON.stringify({results,rankChecks,identityChecks,ratioChecks,zeroSetChecks:9999},null,2));