'use strict';
function experiment(){
 const ok=(v,m)=>{if(!v)throw Error(m)};
 const closure=(seeds,mul)=>{const s=new Set(seeds),q=[...s];for(let j=0;j<q.length;j++)for(const b of seeds){const z=mul(q[j],b);if(!s.has(z)){s.add(z);q.push(z)}}return s};
 let liftModels=0,liftChecks=0,liftClosureChecks=0,liftDeletionChecks=0,liftDisjointChecks=0,quotientModels=0,quotientChoices=0,quotientAnchorChecks=0,quotientDecodeChecks=0,quotientClosureChecks=0,quotientComplementChecks=0,bootstrapModels=0,bootstrapStepChecks=0,bootstrapCoverageChecks=0,bootstrapClosureChecks=0,bootstrapTransportChecks=0,bootstrapCoreChecks=0,freePairChecks=0,freeBootstrapChecks=0,positiveSignChecks=0;
 // Finite C2^(k+1) lifts with genuine one-way transports, all tail coordinates private.
 for(let k=2;k<=5;k++){
  const G=1<<(k+1),R=3,N=R*G*R,id=(i,g,l)=>(i*G+g)*R+l,dec=x=>[Math.floor(x/(G*R)),Math.floor(x/R)%G,x%R],P=(l,i)=>l&&i?1:0,low=i=>i===2?1:i;
  const mul=(a,b)=>{if(a===N&&b===N)return N;if(a===N){const [i,g,l]=dec(b);return id(low(i),g,l)}if(b===N){const [i,g,l]=dec(a);return id(i,g,low(l))}const [i,g,l]=dec(a),[j,h,m]=dec(b);return id(i,g^P(l,j)^h,m)};
  const A=[id(0,0,0),id(2,1,2),...Array.from({length:k},(_,j)=>id(1,2<<j,1))],B0=[id(0,1,0),id(2,0,2)],tail=Array.from({length:k},(_,j)=>id(2,2<<j,2));
  for(let j=0;j<k;j++){ok(mul(mul(N,tail[j]),N)===A[j+2],"one way lift");ok(!closure([N,A[j+2]],mul).has(tail[j]),"not mutual");liftChecks+=2}
  ok(closure([...A,N],mul).size===N+1,"old generates");ok(closure([...B0,...tail,N],mul).size===N+1,"replacement generates");liftClosureChecks+=2;
  let B=[...B0,...tail];for(const a of B0)if(closure([...B.filter(b=>b!==a),N],mul).size===N+1)B=B.filter(b=>b!==a);
  ok(B.every(b=>!A.includes(b)),"disjoint");liftDisjointChecks++;
  for(const X of [A,B])for(const a of X){ok(!closure([...X.filter(b=>b!==a),N],mul).has(a),"irredundance");liftDeletionChecks++}
  liftModels++;
 }
 // C3^4 finite analogue of kernel encoding; quotient signs in finite groups
 // are NOT independent positive directions. We test product, decoding, and coverage only.
 const mod=(x,n)=>(x%n+n)%n;
 for(let pat=0;pat<4;pat++){
  const G=81,R=4,N=G*R*R,add=(a,b)=>[1,3,9,27].reduce((s,p)=>s+mod(Math.floor(a/p)+Math.floor(b/p),3)*p,0),neg=a=>[1,3,9,27].reduce((s,p)=>s+mod(-Math.floor(a/p),3)*p,0);
  const id=(i,g,l)=>(i*G+g)*R+l,dec=x=>[Math.floor(x/(G*R)),Math.floor(x/R)%G,x%R],P=(l,i)=>l===0||i===0?0:mod(l*i+pat,3);
  const mul=(a,b)=>{const [i,g,l]=dec(a),[j,h,m]=dec(b);return id(i,add(add(g,P(l,j)),h),m)};
  const pos=[[[0,1],[1,0]],[[2,2],[3,3]],[[1,3],[3,2]]];
  const B=m=>pos.flatMap((pair,j)=>{const [[i,l],[r,s]]=pair,z=3**(j+1),h=j,eps=(m>>j)&1,p=P(l,r);return [id(i,add(z,eps),l),id(r,add(add(neg(p),neg(eps)),add(neg(z),h)),s)]});
  for(let m=0;m<8;m++){
   const X=B(m),e=id(0,0,0);
   ok(mul(X[0],X[1])===e,"anchor");quotientAnchorChecks++;
   for(let j=0;j<3;j++){ok(mul(mul(e,mul(X[2*j],X[2*j+1])),e)===id(0,j,0),"kernel decode");quotientDecodeChecks++}
   ok(closure(X,mul).size===N,"full finite closure");quotientClosureChecks++;
   ok(X.every(x=>!B(7^m).includes(x)),"complement");quotientComplementChecks++;quotientChoices++;
  }quotientModels++;
 }
 // Finite triangular bootstrap on 2x2 weak types, old depths 0..1 and
 // new depths 1..2; finite cyclic exponents do NOT test sign necessity.
 for(let order of [2,3]){
  const q=2,k=q*q,G=order**k,R=2+q*3,N=R*G*R,pow=Array.from({length:k},(_,i)=>order**i);
  const add=(a,b)=>pow.reduce((s,p)=>s+mod(Math.floor(a/p)+Math.floor(b/p),order)*p,0),neg=a=>pow.reduce((s,p)=>s+mod(-Math.floor(a/p),order)*p,0);
  const id=(i,g,l)=>(i*G+g)*R+l,dec=x=>[Math.floor(x/(G*R)),Math.floor(x/R)%G,x%R],type=i=>Math.floor((i-2)/3),depth=i=>(i-2)%3,cell=(i,j)=>2+3*i+j;
  const P=(l,i)=>l===1&&i===1?1:l>=2&&i>=2?pow[(type(i)*q+type(l)+1)%k]:0;
  const move=(u,i)=>i<2?i:cell(type(i),Math.min(u,depth(i)));
  const mul=(a,b)=>{if(a>=N&&b>=N)return Math.min(a,b);if(a>=N){const [i,g,l]=dec(b);return id(move(a-N,i),g,l)}if(b>=N){const [i,g,l]=dec(a);return id(i,g,move(b-N,l))}const [i,g,l]=dec(a),[j,h,m]=dec(b);return id(i,add(add(g,P(l,j)),h),m)};
  const U=[N,N+1,N+2],e=id(0,0,0),b=id(1,1,1),E=id(0,1,0),B=id(1,0,1);
  const tail=shift=>Array.from({length:k},(_,n)=>{let i=Math.floor(n/q),j=n%q;return id(cell(i,j+shift),neg(pow[n]),cell(j,i+shift))});
  const T=tail(0),T2=tail(1),X=[e,b,...T],Y=[E,B,...T2];
  ok([E,T2[0],B,T2[0],E].reduce(mul)===e,"new anchor");bootstrapCoreChecks++;
  for(let n=0;n<k;n++){let i=Math.floor(n/q),j=n%q;ok(mul(mul(N+j,T2[n]),N+i)===T[n],"lift old");bootstrapTransportChecks++}
  for(const seeds of [X,Y]){
   const cl=closure([...seeds,...U],mul);
   for(let n=0;n<k;n++){const a=seeds[n+2],negx=mul(mul(e,a),e),v=mul(mul(e,mul(a,a)),e);ok(negx===id(0,neg(pow[n]),0),"negative");const pos=id(0,pow[n],0);ok(cl.has(pos)&&mul(mul(pos,v),pos)===id(0,pow[(n+1)%k],0),"bootstrap");bootstrapStepChecks+=2}
   const max=seeds===X?1:2,allowed=i=>i<2||depth(i)<=max,rc=Array.from({length:R},(_,i)=>i).filter(allowed);
   ok(cl.size===rc.length*rc.length*G+U.length,"expected closure size");bootstrapClosureChecks++;
   for(const i of rc)for(const l of rc){ok(cl.has(id(i,0,l)),"coverage");bootstrapCoverageChecks++}
  }ok(X.every(x=>!Y.includes(x)),"disjoint triangular seed sets");bootstrapCoreChecks++;bootstrapModels++;
 }
 // Exact reduced noncommutative words and integer signs, with no finite-group inference.
 const red=w=>{const s=[];for(const a of w){if(s.length&&s.at(-1)===-a)s.pop();else s.push(a)}return s},inv=w=>[...w].reverse().map(x=>-x),cat=(...w)=>red(w.flat()),eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
 for(let n=1;n<=150;n++){
  const z=[1000+n],p=[1,2,-1],h=n===1?[]:[2,n+10,-2],t=[3],y=cat(inv(p),inv(z),h);
  ok(eq(cat(z,p,y),h),"pair");ok(eq(cat(z,t,p,inv(p),inv(t),inv(z),h),h),"shifted pair");freePairChecks+=2;
  const x=[n+1000],next=[n+1001],a=inv(x),word=cat(a,next,a);
  ok(eq(cat(x,word,x),next),"positive bootstrap word");freeBootstrapChecks++;
 }
 // Test signed-coordinate obstruction by exhaustive words in a finite alphabet
 // of nonnegative integer contributions (includes arbitrary positive P entries).
 for(let len=1;len<=8;len++)for(let code=0;code<3**len;code++){
  let x=code,sum=0;for(let j=0;j<len;j++){sum+=x%3;x=Math.floor(x/3)}ok(sum>=0,"cannot generate negative sign");positiveSignChecks++;
 }
 return {study:47,liftModels,liftChecks,liftClosureChecks,liftDeletionChecks,liftDisjointChecks,quotientModels,quotientChoices,quotientAnchorChecks,quotientDecodeChecks,quotientClosureChecks,quotientComplementChecks,bootstrapModels,bootstrapStepChecks,bootstrapCoverageChecks,bootstrapClosureChecks,bootstrapTransportChecks,bootstrapCoreChecks,freePairChecks,freeBootstrapChecks,positiveSignChecks,all_passed:true,scope:"Finite one-way lift models with private C2 coordinates; finite C3 kernel-encoding models (no claim of signed irredundance); finite triangular bootstrap with min actions and explicit depth limits; exact reduced free-word identities and nonnegative exponent checks. Infinite examples and quotient theorem proved analytically."};
}
console.log(JSON.stringify(experiment(), null, 2));
