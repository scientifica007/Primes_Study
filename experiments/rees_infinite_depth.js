// Study 28: finite checks and explicit words in a genuine infinite semigroup.
function experiment(){
  function check(v,msg){if(!v)throw Error(msg)}
  const C=n=>({n,m:(a,b)=>(a+b)%n,e:0});
  const perms=[[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]];
  const S3={n:6,e:0,m:(a,b)=>perms.findIndex(p=>p.every((x,i)=>x===perms[a][perms[b][i]]))};
  function model(G,I,L,P){
    const els=[]; for(let i=0;i<I;i++)for(let g=0;g<G.n;g++)for(let l=0;l<L;l++)els.push([i,g,l]);
    const key=(i,g,l)=>(i*G.n+g)*L+l;
    const mul=(a,b)=>{let [i,g,l]=els[a],[j,h,m]=els[b];return key(i,G.m(G.m(g,P[l][j]),h),m)};
    const inv=g=>Array.from({length:G.n},(_,i)=>i).find(i=>G.m(g,i)===G.e&&G.m(i,g)===G.e);
    const close=A=>{const seen=new Set(A),q=[...seen]; for(let k=0;k<q.length;k++)for(const a of A){let x=mul(q[k],a);if(!seen.has(x)){seen.add(x);q.push(x)}}return seen};
    const full=A=>close(A).size===els.length;
    const minimal=A=>full(A)&&A.every((_,i)=>!full(A.filter((_,j)=>i!==j)));
    return {els,key,mul,inv,full,minimal};
  }
  let matrixCases=0, directWitnessTargets=0, shiftChecks=0, starPairs=0;
  function matrixTest(G,I,L,P){
    let M=model(G,I,L,P),A=[],B=[];
    let first=[0,0],second=I>1?[1,0]:[0,1];
    for(let i=0;i<I;i++)for(let l=0;l<L;l++){
      let id=M.inv(P[l][i]), cell=M.els.map((a,k)=>a[0]===i&&a[2]===l?k:-1).filter(k=>k>=0);
      if(i===first[0]&&l===first[1]){A.push(...cell.filter(k=>M.els[k][1]!==id));B.push(M.key(i,id,l))}
      else if(i===second[0]&&l===second[1]){B.push(...cell.filter(k=>M.els[k][1]!==id));A.push(M.key(i,id,l))}
      else {A.push(cell[0]);B.push(cell[1])}
    }
    check(M.full(A)&&M.full(B)&&A.every(x=>!B.includes(x)),"T113");
    for(let x=0;x<M.els.length;x++){
      check(M.els.some((_,a)=>a!==x&&M.els.some((_,b)=>b!==x&&M.mul(a,b)===x)),"E witness");directWitnessTargets++;
      let [i,g,l]=M.els[x],t=1, f=M.key(0,G.m(M.inv(P[l][0]),t),l),rev=M.key(0,G.m(M.inv(P[l][0]),M.inv(t)),l);
      let y=M.mul(x,f);check(y===M.key(i,G.m(g,t),l)&&y!==x&&M.mul(y,rev)===x,"shift");shiftChecks++;
    }
    matrixCases++;
  }
  for(const n of [2,3])for(let code=0;code<n**4;code++){let x=code,P=Array.from({length:2},()=>Array.from({length:2},()=>{let a=x%n;x=Math.floor(x/n);return a}));matrixTest(C(n),2,2,P)}
  for(let k=0;k<12;k++)matrixTest(S3,2,2,[[k%6,(k+1)%6],[(2*k+3)%6,(5*k+4)%6]]);
  for(const G of [C(2),C(3),S3]){matrixTest(G,3,1,[[1,0,1]]);matrixTest(G,1,3,[[1],[0],[1]])}
  for(const G of [C(2),C(3),S3]){
    const I=G.n+2,L=2,P=Array.from({length:L},()=>Array(I).fill(0)),M=model(G,I,L,P);
    let A=[M.key(0,0,0),M.key(0,1,1)],B=[M.key(0,0,1),M.key(0,1,0)];
    for(let i=1;i<I;i++){A.push(M.key(i,(i-1)%G.n,0));B.push(M.key(i,(i-1)%G.n,1))}
    function trim(X){let Y=[...X];for(const a of X){let Z=Y.filter(x=>x!==a);if(M.full(Z))Y=Z}return Y}
    A=trim(A);B=trim(B);check(M.minimal(A)&&M.minimal(B)&&A.every(a=>!B.includes(a)),"star pair");starPairs++;
  }
  const mulZ=(a,b)=>[a[0],a[1]+b[1],b[2]], eq=(a,b)=>a.every((x,i)=>x===b[i]);
  const Ar=i=>[i,i===0?-1:i===1?1:0,0], Br=i=>[i,i===0?1:i===1?-1:1,i===0?1:0];
  const ac=[0,0,1], bc=Br(0), inA=a=>eq(a,Ar(a[0]))||eq(a,ac), inB=a=>eq(a,Br(a[0]));
  let infiniteWords=0,complementWitnesses=0;
  for(let i=0;i<20;i++){
    check(!inA(Br(i))&&!inB(Ar(i)),"infinite disjoint");
    for(const x of i===0?[Ar(i),ac]:[Ar(i)]){
      let p=0;while(inA([x[0],p,x[2]])||inA([x[0],x[1]-p,x[2]]))p++;
      let a=[x[0],p,x[2]],b=[x[0],x[1]-p,x[2]];
      check(!inA(a)&&!inA(b)&&eq(mulZ(a,b),x),"infinite complement");complementWitnesses++;
    }
    for(let g=-10;g<=10;g++)for(let l=0;l<2;l++)for(let side=0;side<2;side++){
      const first=side?Br(i):Ar(i), last=side?(l?bc:Br(1)):(l?ac:Ar(0)), plus=side?Br(2):Ar(1),minus=side?Br(1):Ar(0);
      let d=g-first[1]-last[1],w=[first,...Array(Math.abs(d)).fill(d>=0?plus:minus),last];
      check(w.every(side?inB:inA)&&eq(w.reduce(mulZ),[i,g,l]),"infinite word");infiniteWords++;
    }
  }
  return {matrix_cases:matrixCases,direct_E_witness_targets:directWitnessTargets,reversible_shift_checks:shiftChecks,finite_star_pairs:starPairs,infinite_Z_words:infiniteWords,infinite_Z_complement_witnesses:complementWitnesses,scope:"Finite cyclic/S3 models and finitely many actual words in N0 x Z x {0,1}; no exhaustive infinite verification."}
}
console.log(JSON.stringify(experiment(), null, 2));
