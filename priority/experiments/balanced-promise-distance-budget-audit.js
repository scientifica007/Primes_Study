// Checks the two-label balanced promise on independent 2x2 rectangles.
// One label-position change means four multiplication-cell changes.
function audit(){
 const ok=(b,m)=>{if(!b)throw Error(m)};
 let arrays=0,distances=0,missChecks=0,closestChecks=0;
 const cases=[];
 for(let m=2;m<=6;m++){
  const F=[[],[]];
  for(let b=0;b<2;b++){
   const L=[-1,2*b,2*b+1];
   function walk(W){if(W.length===m){if(W.includes(L[1])&&W.includes(L[2]))F[b].push(W);return;}for(const l of L)walk([...W,l]);}
   walk([]);
  }
  arrays+=F[0].length+F[1].length;
  for(let b=0;b<2;b++)for(const W of F[b]){
   const k=W.filter(x=>x!==-1).length;let best=Infinity;
   for(const Z of F[1-b]){
    const d=4*W.filter((x,i)=>x!==Z[i]).length;
    ok(d>=4*k,"opposite distance lower");best=Math.min(best,d);distances++;
   }
   ok(best===4*k,"exact distance");closestChecks++;
  }
  // Enumerate samples by bit mask and supports by bit mask; check exact miss probability.
  function pop(x){let s=0;while(x){s+=x&1;x>>=1;}return s;}
  const masks=Array.from({length:2**m},(_,i)=>i);
  for(const support of masks.filter(s=>pop(s)>=2))for(let q=0;q<=m;q++){
   const S=masks.filter(s=>pop(s)===q);
   const missed=S.filter(s=>(s&support)===0).length,k=pop(support);
   function C(n,r){if(r<0||r>n)return 0;let z=1;for(let i=1;i<=r;i++)z=z*(n-i+1)/i;return Math.round(z);}
   ok(missed===C(m-k,q),"miss count");
   ok(missed*C(m,2)<=S.length*C(m-q,2),"worst miss at two");missChecks++;
  }
  cases.push({m,arrays:F[0].length+F[1].length,minimumCellDistance:8});
 }
 return {cases,arrays,distances,closestChecks,missChecks};
}
console.log(JSON.stringify(audit(),null,2));