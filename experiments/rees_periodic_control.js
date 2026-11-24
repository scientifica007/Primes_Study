// Study 30: positive-word certificates in actual infinite carriers.
function experiment(){
  const assert=(x,m)=>{if(!x)throw Error(m)};
  const perms=[[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]];
  const sm=(a,b)=>perms.findIndex(p=>p.every((x,i)=>x===perms[a][perms[b][i]]));
  const si=a=>perms.findIndex((_,b)=>sm(a,b)===0);
  const red=w=>{let a=[];for(const x of w){if(a.length&&a[a.length-1]===-x)a.pop();else a.push(x)}return a};
  const wi=w=>w.slice().reverse().map(x=>-x);
  const E=[0,[],0],m=(a,b)=>[sm(a[0],b[0]),red([...a[1],...b[1]]),a[2]^b[2]],inv=a=>[si(a[0]),wi(a[1]),a[2]];
  const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
  let identityChecks=0,shiftChecks=0,anchorWordChecks=0,nonperiodicChecks=0,periodicChecks=0,positiveMultiplications=0,basisWords=0;
  function run(periodic){
    // Group S3 x (free group F2 or trivial group) x direct sum C2.
    // Actual elements in direct sum are represented by finite bit supports.
    const t=periodic?[2,[],1]:[2,[1],1];
    const F=[E,t,inv(t),...(periodic?[]:[[0,[1],0],[0,[-1],0],[0,[2],0],[0,[-2],0]])];
    const P=(l,i)=>!l||!i?E:[(l*3+i*5)%6,periodic?[]:red([1, ...(i%2?[2]:[-1]), ...(l%2?[1]:[-2])]),1<<((l+i)%10)];
    const el=(i,g,l)=>[i,g,l],ke=g=>el(0,g,0);
    const mul=(a,b)=>{positiveMultiplications++;return el(a[0],m(m(a[1],P(a[2],b[0])),b[1]),b[2])};
    const product=w=>w.reduce(mul);
    const anchor=(w,tail=0)=>{
      let seq=w.map(x=>[0,[x],0]);if(tail)seq.push(tail===1?t:inv(t));if(!seq.length)seq=[E];
      assert(seq.every(a=>F.some(b=>eq(a,b))),"anchor seeds");
      const v=product(seq.map(ke));anchorWordChecks++;
      assert(eq(v[1],seq.reduce(m)),"anchor word");
      return v;
    };
    const power=(x,n)=>{let y=x;for(let i=1;i<n;i++)y=mul(y,x);return y};
    const localId=x=>el(x[0],inv(P(x[2],x[0])),x[2]);
    const order=x=>{const e=localId(x);let y=x;for(let n=1;n<=6;n++){if(eq(y,e))return n;y=mul(y,x)}throw Error("torsion order");};
    function localShift(x,sign){
      let p=P(x[2],x[0]),q=red([...wi(x[1][1]),...wi(p[1]),...wi(x[1][1])]);
      let z=product([x,anchor(q),x]);assert(z[1][1].length===0||red([...z[1][1],...p[1]]).length===0,"kernel local coordinate");
      let e=power(z,order(z));assert(eq(e,localId(x)),"local idempotent");identityChecks++;
      let v=product([e,anchor(p[1]),e]),w=product([e,anchor(p[1],sign),e]);
      const n=order(v),vinv=power(v,n===1?1:n-1);
      let y=product([x,vinv,w]);
      const target=el(x[0],m(m(m(x[1],p),sign===1?t:inv(t)),inv(p)),x[2]);
      assert(eq(y,target)&&!eq(y,x),"reversible cell shift");shiftChecks++;
      return y;
    }
    for(let i=0;i<4;i++)for(let l=0;l<4;l++)for(let s=0;s<6;s++)for(let b=0;b<5;b++){
      let x=el(i,[s,periodic?[]:red([1, ...Array(b).fill(-2), -1, ...(s%2?[2]:[])]), (1<<b)^(1<<((i+l+4)%10))],l);
      const y=localShift(x,1);assert(eq(localShift(y,-1),x),"inverse");
      if(periodic)periodicChecks++;else nonperiodicChecks++;
    }
  }
  run(true);run(false);
  // Genuine infinite elementary abelian rectangular group, P=1.
  // A diagonal e_i; B shifts e_i by e_0, plus one off-diagonal donor.
  const a=i=>[i,1<<i,i],b=i=>[i,(1<<i)^1,i],donor=[0,1,1];
  const mul=(x,y)=>[x[0],x[1]^y[1],y[2]];
  const inB=x=>eq(x,donor)||eq(x,b(x[0]));
  for(let i=0;i<10;i++){assert(!inB(a(i)),"disjoint diagonal");assert(b(i)[0]===i&&b(i)[2]===i,"coverage")}
  for(let i=0;i<8;i++)for(let j=0;j<8;j++)for(let v=0;v<256;v++){
    const first=b(i),last=b(j);let d=v^first[1]^last[1],w=[first];
    for(let k=1;k<8;k++)if(d&(1<<k)){w.push(b(k));d^=(1<<k)^1}
    if(d===1)w.push(donor);else assert(d===0,"remaining");
    w.push(last);assert(w.every(inB)&&eq(w.reduce(mul),[i,v,j]),"infinite basis word");basisWords++;
  }
  return {periodic_targets:periodicChecks,nonperiodic_targets:nonperiodicChecks,local_idempotent_certificates:identityChecks,cell_shift_certificates:shiftChecks,anchor_positive_words:anchorWordChecks,positive_multiplications:positiveMultiplications,infinite_elementary_abelian_basis_words:basisWords,scope:"Finite samples of actual infinite groups S3 x direct_sum C2 and S3 x F2 x direct_sum C2; finite-support words, not exhaustive infinite verification."};
}
console.log(JSON.stringify(experiment(), null, 2));
