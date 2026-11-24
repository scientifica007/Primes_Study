'use strict';
function experiment(){
 const ok=(x,m)=>{if(!x)throw Error(m)};
 const red=w=>{const s=[];for(const x of w){if(s.length&&s[s.length-1]===-x)s.pop();else s.push(x)}return s};
 const inverse=w=>[...w].reverse().map(x=>-x),cat=(...ws)=>red(ws.flat()),eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
 let freeGaugeCases=0,freeProductChecks=0,freePositionChecks=0,internalModels=0,internalChoices=0,internalProducts=0,internalClosures=0,internalDisjoint=0,relativeModels=0,relativeChoices=0,relativeProducts=0,relativeClosures=0,relativeTripleChecks=0,relativeRecoveryChecks=0,donorSubsetChecks=0,freeRelativeChecks=0;
 for(let k=2;k<=9;k++)for(let sample=0;sample<40;sample++){
  const z=Array.from({length:k},(_,i)=>[1+(sample+i)%3,10+i,-(1+(sample+2*i)%3)]);
  const p=Array.from({length:k-1},(_,i)=>[1+(sample+2*i)%3,-(1+(sample+i+1)%3)]);
  const prod=a=>a.reduce((w,v,i)=>i?cat(w,p[i-1],v):v,[]);
  const variants=[0,1].map(parity=>{
   const q=Array.from({length:k-1},(_,i)=>i%2===parity?[1,2]:[]);
   return z.map((v,i)=>cat(i?cat(inverse(p[i-1]),inverse(q[i-1]),p[i-1]):[],v,i<k-1?q[i]:[]));
  });
  for(const v of variants){ok(eq(prod(v),prod(z)),"gauge telescoping");freeProductChecks++}
  for(let i=0;i<k;i++){ok(!eq(z[i],variants[0][i])||!eq(z[i],variants[1][i]),"position changed in one choice");freePositionChecks++}
  let q=[];
  for(let i=0;i<k-1;i++){
   let chosen=[[1],[1,1]].find(v=>!i||!eq(cat(inverse(p[i-1]),inverse(q[i-1]),p[i-1],z[i],v),z[i]));
   ok(chosen,"nontrivial gauge exists");q.push(chosen);
  }
  const v=z.map((w,i)=>cat(i?cat(inverse(p[i-1]),inverse(q[i-1]),p[i-1]):[],w,i<k-1?q[i]:[]));
  ok(eq(prod(v),prod(z)),"fully changed product");freeProductChecks++;
  for(let i=0;i<k;i++){ok(!eq(z[i],v[i]),"fully changed position");freePositionChecks++}
  freeGaugeCases++;
 }
 const mod=(x,n)=>(x%n+n)%n;
 const mul3=(a,b)=>mod(a%3+b%3,3)+3*mod(Math.floor(a/3)%3+Math.floor(b/3)%3,3)+9*mod(Math.floor(a/9)+Math.floor(b/9),3);
 // Repeated quotient signatures deliberately test decoding only, not irredundance.
 for(let pat=0;pat<5;pat++){
  const n=6,G=27,N=n*G*n,id=(i,g,l)=>(i*G+g)*n+l,dec=x=>[Math.floor(x/(G*n)),Math.floor(x/n)%G,x%n];
  const P=(l,i)=>l===2||i===0?0:mod(l*i+pat*(l+i)+pat,3),inv=a=>Array.from({length:G},(_,b)=>b).find(b=>mul3(a,b)===0);
  const prod=(a,b)=>{const [i,g,l]=dec(a),[j,h,k]=dec(b);return id(i,mul3(mul3(g,P(l,j)),h),k)};
  const close=seeds=>{let s=new Set(seeds),q=[...s];for(let i=0;i<q.length;i++)for(const b of seeds){let z=prod(q[i],b);if(!s.has(z)){s.add(z);q.push(z)}}return s};
  const blocks=[0,1].map(j=>{
   const i=3*j,h=j,ys=[3,9,inv(mul3(3,9))],p=[P(i,i+1),P(i+1,i+2)];
   const z=[ys[0],mul3(inv(p[0]),ys[1]),mul3(mul3(inv(p[1]),ys[2]),h)];
   const q=[1,2],w=[mul3(z[0],q[0]),mul3(mul3(inv(q[0]),z[1]),q[1]),mul3(inv(q[1]),z[2])];
   return [z,w].map(a=>a.map((g,r)=>id(i+r,g,i+r)));
  });
  for(let mask=0;mask<4;mask++){
   const X=blocks.flatMap((b,j)=>b[(mask>>j)&1]),alt=blocks.flatMap((b,j)=>b[1-((mask>>j)&1)]);
   ok(X.every(a=>!alt.includes(a)),"triple complement");internalDisjoint++;
   for(let j=0;j<2;j++){ok(X.slice(3*j,3*j+3).reduce(prod)===id(3*j,j,3*j+2),"triple code");internalProducts++}
   const cl=close(X);ok(cl.has(id(0,0,2))&&cl.has(id(0,1,2))&&cl.size===N,"triple core and full closure");internalClosures++;internalChoices++;
  }internalModels++;
 }
 for(let pat=0;pat<3;pat++){
  const G=32,n=6,N=n*G*n,id=(i,g,l)=>(i*G+g)*n+l,dec=x=>[Math.floor(x/(G*n)),Math.floor(x/n)%G,x%n];
  const P=(l,i)=>l>=4||i>=4||i===0?0:(l*i+pat*(l+i))%2;
  const image=u=>{const j=Math.floor((u-N)/2),k=(u-N)%2;return id(4+j,k*(8<<j),4+j)};
  const prod=(a,b)=>{if(a>=N&&b>=N&&Math.floor((a-N)/2)===Math.floor((b-N)/2))return N+2*Math.floor((a-N)/2)+(((a-N)%2)^((b-N)%2));let [i,g,l]=dec(a>=N?image(a):a),[j,h,k]=dec(b>=N?image(b):b);return id(i,g^P(l,j)^h,k)};
  const close=seeds=>{let s=new Set(seeds),q=[...s];for(let k=0;k<q.length;k++)for(const b of seeds){let z=prod(q[k],b);if(!s.has(z)){s.add(z);q.push(z)}}return s};
  const U=[N,N+1,N+2,N+3],blocks=[0,1].map(j=>{let i=2*j,z=2<<j,d=8<<j,h=j,p=P(i,i+1),A=id(i,z,i),B=id(i+1,z^h^d^p,i+1);return [[A,B],[id(i,z^1,i),id(i+1,z^h^d^p^1,i+1)],[A,B]]});
  for(let a=0;a<3;a++)for(let b=0;b<3;b++){
   const X=[...blocks[0][a],...blocks[1][b]],e=id(0,0,4);
   for(let j=0;j<2;j++){const B=X.slice(2*j,2*j+2),v=prod(B[0],B[1]),o=prod(...blocks[j][0]);ok(v===o,"relative invariant");ok(prod(v,N+2*j+1)===id(2*j,j,4+j),"donor code");relativeProducts+=2}
   const cl=close([...X,...U]);ok(cl.has(e)&&cl.has(id(0,1,4))&&cl.size===N+4,"relative mixed full");relativeClosures++;
   for(const old of blocks.flatMap(b=>b[0])){ok(cl.has(old),"original recovery");relativeRecoveryChecks++}
   for(let j=0;j<2;j++)for(const x of blocks[j][0]){ok(!blocks[j][1].includes(x)||!blocks[j][2].includes(x),"triple intersection");relativeTripleChecks++}
   relativeChoices++;
  }
  for(let mask=0;mask<4;mask++){const W=U.filter(u=>mask&(1<<Math.floor((u-N)/2))),X=blocks.flatMap(b=>b[0]),cl=close([...W,...X]);for(let j=0;j<2;j++){ok(cl.has(id(4+j,0,4+j))===Boolean(mask&(1<<j)),"donor row coverage");donorSubsetChecks++}}
  relativeModels++;
 }
 for(let n=10;n<110;n++)for(const flip of [false,true]){
  const z=[n],h=[1,2,-1],d=[n+200],p=[3,-2],q=flip?[2,1]:[],w=cat(inverse(p),inverse(z),h,d);
  const a=cat(z,q),b=cat(inverse(p),inverse(q),p,w);
  ok(eq(cat(a,p,b,inverse(d)),h),"donor decode");freeRelativeChecks++;
  ok(eq(cat(p,b,inverse(d),inverse(h)),cat(inverse(q),inverse(z))),"inverse via donor");freeRelativeChecks++;
 }
 return {study:42,freeGaugeCases,freeProductChecks,freePositionChecks,internalModels,internalChoices,internalProducts,internalClosures,internalDisjoint,relativeModels,relativeChoices,relativeProducts,relativeClosures,relativeTripleChecks,relativeRecoveryChecks,donorSubsetChecks,freeRelativeChecks,all_passed:true,scope:"Exact noncommutative free-word gauge checks; finite C3^3 triples (decoding only), C2^5 two upper groups with all three block choices, and exact donor-assisted free-word computations. No finite test establishes infinite positive irredundance or global coloring."};
}
console.log(JSON.stringify(experiment(), null, 2));
