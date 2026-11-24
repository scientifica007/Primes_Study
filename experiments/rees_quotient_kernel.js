// Study 32: quotient saturation checks and infinite-rank positive words.
function experiment(){
 const assert=(v,m)=>{if(!v)throw Error(m)},range=n=>Array.from({length:n},(_,i)=>i);
 const ps=[[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]];
 const sm=(a,b)=>ps.findIndex(p=>p.every((x,i)=>x===ps[a][ps[b][i]]));
 const parity=a=>{let n=0;for(let i=0;i<3;i++)for(let j=i+1;j<3;j++)if(ps[a][i]>ps[a][j])n++;return n%2};
 let fixtures=0,homomorphismPairs=0,subsets=0,saturationChecks=0,shiftChecks=0,noncentralChecks=0,positiveWords=0,matrixWords=0,obstructionWords=0;
 let seed=314159265;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed};
 for(const type of ["C4","S3"])for(const p of range(type==="C4"?4:6))for(const upper of [false,true]){
  const n=type==="C4"?4:6,gm=type==="C4"?(a,b)=>(a+b)%4:sm,pi=type==="C4"?a=>a%2:parity;
  const N=range(n).filter(g=>pi(g)===0),t=N[1],P=(l,i)=>l&&i?p:0;
  const U=upper?[-1,-2]:[],J=range(4*n),key=(i,g,l)=>i*n*2+g*2+l,row=x=>Math.floor(x/(2*n)),col=x=>x%2,g=x=>Math.floor(x/2)%n;
  // Upper C2 maps to the anchor group: identity or a transposition/order-two element.
  const h=u=>u===-1?0:type==="C4"?2:1;
  const mul=(a,b)=>{
   if(a<0&&b<0)return a===b?-1:-2;
   if(a<0)return key(0,gm(h(a),g(b)),col(b));
   if(b<0)return key(row(a),gm(g(a),h(b)),0);
   return key(row(a),gm(gm(g(a),P(col(a),row(b))),g(b)),col(b));
  };
  const q=x=>x<0?x:row(x)*4+pi(g(x))*2+col(x),qr=x=>Math.floor(x/4),qg=x=>Math.floor(x/2)%2,qc=x=>x%2,qkey=(i,v,l)=>4*i+2*v+l;
  const qm=(a,b)=>{
   if(a<0&&b<0)return a===b?-1:-2;
   if(a<0)return qkey(0,(pi(h(a))+qg(b))%2,qc(b));
   if(b<0)return qkey(qr(a),(qg(a)+pi(h(b)))%2,0);
   return qkey(qr(a),(qg(a)+pi(P(qc(a),qr(b)))+qg(b))%2,qc(b));
  };
  for(const a of [...U,...J])for(const b of [...U,...J]){assert(q(mul(a,b))===qm(q(a),q(b)),"homomorphism");homomorphismPairs++}
  const close=(X,op)=>{let a=[...new Set([...U,...X])],s=new Set(a),v=[...a];for(let i=0;i<v.length;i++)for(const b of a){const z=op(v[i],b);if(!s.has(z)){s.add(z);v.push(z)}}return s};
  const F=N.map(v=>key(0,v,0));
  for(let iter=0;iter<800;iter++){
   let X=J.filter(()=>random()%17<5);if(iter%2===0)X=[...new Set([...X,...F])];
   const C=close(X,mul),Q=close(X.map(q),qm),full=J.every(x=>C.has(x)),qfull=range(8).every(x=>Q.has(x));subsets++;
   if(F.every(x=>C.has(x))){assert(full===qfull,"kernel saturation");saturationChecks++}
   if(F.every(x=>X.includes(x))){
    const Y=X.map(x=>F.includes(x)?x:key(row(x),gm(g(x),t),col(x))),D=close(Y,mul);
    assert(full===J.every(x=>D.has(x)),"shift invariant");shiftChecks++;if(type==="S3")noncentralChecks++;
   }
  }
  fixtures++;
 }
 // Exact finite-support arithmetic in free abelian group on t, e_n, f_n.
 const v=(name,k=1)=>k?[[name,k]]:[],sum=(...xs)=>{let m=new Map;for(const x of xs)for(const [s,k] of x)m.set(s,(m.get(s)||0)+k);return [...m].filter(x=>x[1]!==0).sort((a,b)=>a[0]<b[0]?-1:a[0]>b[0]?1:0)},neg=x=>x.map(([s,k])=>[s,-k]),eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
 const P=(l,i)=>i===l&&i>0?v("e"+Math.ceil(i/2),i%2?1:-1):[];
 const mul=(a,b)=>[a[0],sum(a[1],P(a[2],b[0]),b[1]),b[2]],prod=w=>w.reduce(mul),K=g=>[0,g,0],R=(side,i)=>[i,side?v("t"):[],i];
 const T=(side,k)=>K(v("t",k)),F=(side,n,s)=>K(sum(v("f"+n,s),side?v("t"):[]));
 const anchor=(side)=>{
  if(!side)return [T(0,1),T(0,-1)];
  return [T(1,-2),R(1,1),R(1,2),R(1,1),R(1,2),T(1,-2)];
 };
 const letter=(side,name,k)=>{
  let w=[],s=Math.sign(k);
  for(let z=0;z<Math.abs(k);z++){
   const e=anchor(side);
   if(name==="t"){if(!side)w.push(T(0,s));else if(s===1)w.push(...e,R(1,1),...e);else w.push(T(1,-2),...e,R(1,1),...e)}
   else if(name[0]==="f"){w.push(F(side,Number(name.slice(1)),s));if(side)w.push(...letter(side,"t",-1))}
   else {const i=2*Number(name.slice(1))-(s===1?1:0);w.push(...e,R(side,i),R(side,i),...e);if(side)w.push(...letter(side,"t",-2));matrixWords++}
  }
  assert(eq(prod(w),K(v(name,k))),"positive coordinate certificate");return w;
 };
 const member=(side,x)=>{
  if(x[0]===x[2]&&x[0]>0)return eq(x,R(side,x[0]));
  if(x[0]!==0||x[2]!==0)return false;
  if(!side)return x[1].length===1&&Math.abs(x[1][0][1])===1&&(x[1][0][0]==="t"||x[1][0][0][0]==="f");
  if(eq(x,T(1,-2)))return true;
  return x[1].length===2&&x[1].some(([n,k])=>n==="t"&&k===1)&&x[1].some(([n,k])=>n[0]==="f"&&Math.abs(k)===1);
 };
 for(const side of [0,1]){
  assert(eq(prod(anchor(side)),K([])),"anchor identity");
  for(let i=0;i<9;i++)for(let j=0;j<9;j++)for(let n=1;n<=5;n++)for(const s of [-1,1]){
   const target=sum(v("e"+n,s),v("f"+(n+1),-s),v("t",2*s)),a=i?R(side,i):side?T(1,-2):T(0,1),b=j?R(side,j):side?T(1,-2):T(0,1);
   const mid=sum(target,neg(a[1]),neg(b[1])),w=[a,...(mid.length?mid.flatMap(([name,k])=>letter(side,name,k)):anchor(side)),b];
   assert(w.every(x=>member(side,x))&&eq(prod(w),[i,target,j]),"infinite rank word");positiveWords++;
  }
 }
 // Positive-only sandwich matrix: no negative coefficient can occur.
 const Q=(l,i)=>i===l&&i>0?v("e"+i):[],mu=(a,b)=>[a[0],sum(a[1],Q(a[2],b[0]),b[1]),b[2]],X=range(5).map(i=>[i,[],i]);
 const walk=(w,n)=>{if(w.length){assert(w.reduce(mu)[1].every(x=>x[1]>0),"positive obstruction");obstructionWords++}if(n)for(const x of X)walk([...w,x],n-1)};walk([],5);
 return {finite_fixtures:fixtures,homomorphism_pairs:homomorphismPairs,subsets_examined:subsets,kernel_saturation_checks:saturationChecks,shift_invariance_checks:shiftChecks,noncentral_normal_kernel_checks:noncentralChecks,infinite_rank_positive_words:positiveWords,matrix_extraction_words:matrixWords,positive_only_obstruction_words:obstructionWords,scope:"Finite C4/S3 fixtures and upper actions; actual finite-support words in infinite-rank free abelian group. Not exhaustive infinite validation."};
}
console.log(JSON.stringify(experiment(), null, 2));
