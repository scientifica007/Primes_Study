'use strict';
function experiment(){
 const ok=(v,m)=>{if(!v)throw Error(m)};
 const mod=(a,n)=>(a%n+n)%n;
 // C3 x C3 x C3: H first factor, two inverse pairs in other factors;
 // positive irredundance of inverse pairs is NOT true in finite groups.
 // Finite tests verify decoding/coverage/disjointness, not relative necessity of inverse signs.
 const G=27,mul=(a,b)=>mod(a%3+b%3,3)+3*mod(Math.floor(a/3)%3+Math.floor(b/3)%3,3)+9*mod(Math.floor(a/9)+Math.floor(b/9),3);
 const inv=a=>Array.from({length:G},(_,b)=>b).find(b=>mul(a,b)===0);
 let models=0,choices=0,pairProducts=0,anchorChecks=0,coreChecks=0,recoveryChecks=0,complementChecks=0,wordChecks=0,obstructionWords=0;
 // 3 pairs, use distinct quotient signatures: third pair is not necessary in finite model.
 // Instead use C3 x C3^4 in sparse word checks; closure tests use two pairs coding H via 1 generator.
 const H=[0,1,2],R=4,L=4,N=R*G*L, id=(i,g,l)=>(i*G+g)*L+l,dec=x=>[Math.floor(x/(G*L)),Math.floor(x/L)%G,x%L];
 for(let pat=0;pat<6;pat++){
  const P=(l,i)=>l===1||i===0?0:H[(l*i+pat*(l+i)+pat)%3];
  const prod=(a,b)=>{const [i,g,l]=dec(a),[j,h,k]=dec(b);return id(i,mul(mul(g,P(l,j)),h),k)};
  const close=seeds=>{const s=new Set(seeds),q=[...s];for(let k=0;k<q.length;k++)for(const b of seeds){const z=prod(q[k],b);if(!s.has(z)){s.add(z);q.push(z)}}return s};
  const ys=[3,9],hs=[0,1];
  const B=mask=>ys.flatMap((y,j)=>{let r=2*j,s=r+1,tw=mask&(1<<j)?1:0,h=hs[j];return [id(r,mul(y,tw),r),id(s,mul(mul(mul(inv(P(r,s)),inv(tw)),inv(y)),h),s)]});
  for(let mask=0;mask<4;mask++){
   const X=B(mask),cl=close(X),e=id(0,0,1);
   for(let j=0;j<2;j++){ok(prod(X[2*j],X[2*j+1])===id(2*j,hs[j],2*j+1),"pair code");pairProducts++}
   ok(cl.has(e),"anchor");anchorChecks++;
   for(const h of H){ok(cl.has(id(0,h,1)),"core");coreChecks++}
   ok(cl.size===N,"full closure");
   for(let j=0;j<2;j++){ok(cl.has(id(2*j,ys[j],2*j))&&cl.has(id(2*j+1,inv(ys[j]),2*j+1)),"original pair");recoveryChecks+=2}
   ok(X.every(x=>!B(3^mask).includes(x)),"disjoint");complementChecks++;choices++;
  }models++;
 }
 // Exact noncommuting free-word checks for coding, inverse and original-coordinate recovery.
 const red=w=>{let s=[];for(const a of w){if(s.length&&s[s.length-1]===-a)s.pop();else s.push(a)}return s},neg=w=>[...w].reverse().map(a=>-a),cat=(...ws)=>red(ws.flat()),eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
 for(let n=4;n<=103;n++)for(let bit=0;bit<2;bit++){
  const y=[n],t=bit?[1,2]:[],p=[2,-1,3],h=[1,3,-2],z=cat(y,t),w=cat(neg(p),neg(t),neg(y),h);
  ok(eq(cat(z,p,w),h),"noncommutative code");wordChecks++;
  ok(eq(cat(z,neg(t)),y),"recover y");wordChecks++;
  ok(eq(cat(t,p,w,neg(h)),neg(y)),"recover inverse");wordChecks++;
  const k=cat(neg(z),y,neg(z));ok(eq(cat(z,k,z),y),"transport original");wordChecks++;
 }
 // Exhaustive short words over two obstructed pairs: z_i or z_i^-1 d.
 for(let len=1;len<=7;len++)for(let m=0;m<4**len;m++){
  let x=m,w=[];for(let k=0;k<len;k++){let a=x%4;x=Math.floor(x/4);w.push(...(a<2?[10+a]:[-(8+a),3]))}
  let q=red(w);ok(q.some(a=>Math.abs(a)>=10||Math.abs(a)===3),"nonempty quotient word");obstructionWords++;
 }
 return {study:41,models,choices,pairProducts,anchorChecks,coreChecks,recoveryChecks,complementChecks,wordChecks,obstructionWords,all_passed:true,scope:"Finite C3^3 models verify decoding and coverage, not inverse-pair irredundance (finite positive monoids contain inverses). Free-word checks verify ordered noncommutative identities and bounded obstruction; infinite necessity and global coloring proved analytically."};
}
console.log(JSON.stringify(experiment(), null, 2));
