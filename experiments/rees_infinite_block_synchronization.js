'use strict';
function experiment(){
 const ok=(x,m)=>{if(!x)throw Error(m)};
 let checkpointGraphs=0,quotientEdges=0,checkpointEdges=0,pathChecks=0,colorings=0,obstructionWitnesses=0,finiteModels=0,finiteChoices=0,finiteClosureChecks=0,finiteDeletionChecks=0,finiteInvariantChecks=0,freeDecodeChecks=0,freeRecoveryChecks=0;
 // Quotient is the complete forward graph; only the spine is recurrent on rays.
 for(let n=3;n<=24;n++){
  const adj=new Map(),block=new Map(),Q=new Set(),add=(v,b,next=[])=>{adj.set(v,next);block.set(v,b)};
  for(let i=0;i<n;i++){add("x"+i,i,i+1<n?["x"+(i+1)]:[]);Q.add("x"+i);add("d"+i,i);
   for(let j=i+1;j<n;j++)add("v"+i+":"+j,i,["d"+j]);
  }
  const full=new Set(),skeleton=new Set();
  for(const [a,ls] of adj)for(const b of ls)full.add(block.get(a)+":"+block.get(b));
  for(const a of Q){const seen=new Set(),q=[...adj.get(a)];for(let k=0;k<q.length;k++){const b=q[k];if(seen.has(b))continue;seen.add(b);if(Q.has(b)){skeleton.add(block.get(a)+":"+block.get(b));continue}q.push(...adj.get(b))}}
  ok(full.size===n*(n-1)/2&&skeleton.size===n-1,"quotient vs spine");
  for(const a of adj.keys()){let p=a,cols=[],steps=0;while(p!==undefined){if(Q.has(p))cols.push(block.get(p)%3);p=adj.get(p)[0];steps++;ok(steps<=n+1,"acyclic")}
   if(cols.length>=3)ok(new Set(cols).size===3,"checkpoint color coverage");pathChecks++;
  }
  quotientEdges+=full.size;checkpointEdges+=skeleton.size;checkpointGraphs++;
 }
 // Finite traces of the obstruction: all k-colorings, explicit monochrome increasing subpaths.
 for(let n=3;n<=10;n++)for(let k=2;k<=3;k++)for(let code=0;code<k**n;code++){
  let x=code,sets=Array.from({length:k},()=>[]);for(let j=0;j<n;j++){sets[x%k].push(j);x=Math.floor(x/k)}
  const s=sets.reduce((a,b)=>a.length>=b.length?a:b);ok(s.length>=Math.ceil(n/k)&&s.every((v,i)=>!i||s[i-1]<v),"monochrome subset");colorings++;obstructionWitnesses++;
 }
 // C3^6 bottom with five private source cells and two upper C3 groups.
 const G=729,R=7,N=R*G*R,pow=[1,3,9,27,81,243],digits=Array.from({length:G},(_,g)=>pow.map(p=>Math.floor(g/p)%3));
 const plus=Array.from({length:G},(_,a)=>Uint16Array.from({length:G},(_,b)=>digits[a].reduce((s,v,i)=>s+((v+digits[b][i])%3)*pow[i],0)));
 const add=(a,b)=>plus[a][b],neg=a=>digits[a].reduce((s,v,i)=>s+((3-v)%3)*pow[i],0);
 const id=(i,g,l)=>(i*G+g)*R+l,dec=x=>[Math.floor(x/(G*R)),Math.floor(x/R)%G,x%R];
 for(let pat=0;pat<3;pat++){
  const P=(l,i)=>l===i&&i>0&&i<5?(i+pat)%3:0;
  const image=u=>{const j=Math.floor((u-N)/3),v=(u-N)%3;return id(5+j,v*pow[4+j],5+j)};
  const prod=(a,b)=>{if(a>=N&&b>=N&&Math.floor((a-N)/3)===Math.floor((b-N)/3))return N+3*Math.floor((a-N)/3)+((a-N)%3+(b-N)%3)%3;
   const [i,g,l]=dec(a>=N?image(a):a),[j,h,k]=dec(b>=N?image(b):b);return id(i,add(add(g,P(l,j)),h),k)};
  const close=seeds=>{const s=new Set(seeds),q=[...s];for(let j=0;j<q.length;j++)for(const b of seeds){let z=prod(q[j],b);if(!s.has(z)){s.add(z);q.push(z)}}return s};
  const U=Array.from({length:6},(_,i)=>N+i);
  const orig=[id(0,3,0)];
  for(let j=0;j<2;j++){const b=pow[2+j],d=pow[4+j],h=j;orig.push(id(1+2*j,b,1+2*j),id(2+2*j,add(add(neg(b),neg(3)),add(h,d)),2+2*j))}
  const alt=orig.map((x,j)=>{const [i,g,l]=dec(x);return id(i,add(g,j===0||j%2===1?1:1),l)}); // a:+t,b:-t+2t,c:-2t all +1 mod3
  for(const X of [orig,alt]){
   ok(X.every((x,j)=>orig[j]===x||!orig.includes(x)),"no cross collision");
   for(let j=0;j<2;j++){const b=prod(prod(X[0],X[1+2*j]),X[2+2*j]);ok(b===id(0,add(j,pow[4+j]),2+2*j),"invariant product");finiteInvariantChecks++;ok(prod(b,N+3*j+2)===id(0,j,5+j),"donor decode");finiteInvariantChecks++}
   const cl=close([...X,...U]);ok(cl.size===N+6&&orig.every(x=>cl.has(x)),"full closure and recovery");finiteClosureChecks++;
   for(const x of X){const [i,,l]=dec(x);const minus=close([...X.filter(y=>x!==y),...U]);ok(!minus.has(id(i,0,l)),"private source necessity");finiteDeletionChecks++}
   finiteChoices++;
  }
  ok(orig.every(x=>!alt.includes(x)),"disjoint");finiteModels++;
 }
 // Exact noncommutative infinite-model identities on 100 representative free words.
 const red=w=>{const s=[];for(const a of w){if(s.length&&s.at(-1)===-a)s.pop();else s.push(a)}return s},inv=w=>[...w].reverse().map(x=>-x),cat=(...ws)=>red(ws.flat()),eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
 for(let n=1;n<=100;n++){
  const t=[1],a=[2],b=[100+n],d=[300+n],h=n===1?[]:[500+n],c=cat(inv(b),inv(a),h,d);
  const A=cat(a,t),B=cat(inv(t),b,t,t),C=cat(inv(t),inv(t),c);
  ok(eq(cat(A,B,C),cat(h,d)),"preserve relation");freeDecodeChecks++;
  ok(eq(cat(A,B,C,inv(d)),h),"decode with donor");freeDecodeChecks++;
  ok(eq(cat(inv(d),inv(h),a,b),inv(c)),"positive inverse expression");freeRecoveryChecks++;
  const ci=cat(inv(d),inv(h),a,b,t,t);
  ok(eq(cat(C,ci,c,ci,C),c),"recover source cell coordinate");freeRecoveryChecks++;
 }
 return {study:44,checkpointGraphs,quotientEdges,checkpointEdges,pathChecks,colorings,obstructionWitnesses,finiteModels,finiteChoices,finiteClosureChecks,finiteDeletionChecks,finiteInvariantChecks,freeDecodeChecks,freeRecoveryChecks,all_passed:true,scope:"Finite checkpoint graph truncations and all 2/3-colorings on 3..10 labels; finite C3^6 Rees models with upper C3 donors and private sources; exact reduced free-word decoding/recovery. Infinite-ray and no-uniform-donor obstructions proved analytically, not inferred from finite tests."};
}
console.log(JSON.stringify(experiment(), null, 2));
