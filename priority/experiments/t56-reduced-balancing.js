// Reproduce exact/modular checks of the original and reduced T56 balancing polynomials.
// Run with Node.js: node priority/experiments/t56-reduced-balancing.js
const PRIME = 1000000007n;
function mul(a,b,N=Infinity,mod=false) {
  const c=Array(Math.min(a.length+b.length-1,N)).fill(0n);
  for(let i=0;i<a.length;i++) for(let j=0;j<b.length && i+j<c.length;j++){
    c[i+j]+=a[i]*b[j]; if(mod)c[i+j]%=PRIME;
  }
  return c;
}
function power(a,k,N,mod){
  let r=[1n];
  while(k){ if(k%2n)r=mul(r,a,N,mod); k/=2n; if(k)a=mul(a,a,N,mod); }
  return r;
}
function choose(n,k){let r=1n;for(let i=1n;i<=k;i++)r=r*(n-i+1n)/i;return r;}
function poly(L,reduced){
  let a=[1n,-2n,1n];
  for(let j=1;j<=L;j++)if(!reduced||j===1||j%2===0)a=mul(a,[2n**BigInt(j),-1n]);
  return a;
}
function calc(L,reduced){
  const a=poly(L,reduced), mod=L>=5;
  let C=0n,D=0n,p=[1n],q=[1n];
  for(let i=0;i<a.length;i++){
    const s=2n**BigInt(i),k=a[i]<0n?-a[i]:a[i];
    C+=k;D+=k*s;
    // R_s(z)/z = sum_j (-1)^j binomial(s+j,j+1) z^j.
    const r=Array.from({length:L+1},(_,j)=>(j%2?-1n:1n)*choose(s+BigInt(j),BigInt(j+1)));
    if(a[i]>0)p=mul(p,power(r,k,L+1,mod),L+1,mod);
    else q=mul(q,power(r,k,L+1,mod),L+1,mod);
  }
  const pass=p.every((x,i)=>mod?(x-q[i])%PRIME===0n:x===q[i]);
  if(!pass)throw new Error("Coefficient mismatch");
  return {C:String(C),D:String(D),d:a.length-1,a:a.map(String),pass,mode:mod?"mod 1000000007":"exact"};
}
for(let L=0;L<=8;L++)console.log(JSON.stringify({L,old:calc(L,false),improved:calc(L,true)}));
