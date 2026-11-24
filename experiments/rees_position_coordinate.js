'use strict';
function experiment(){
 const ok=(x,m)=>{if(!x)throw Error(m)};
 const close=(seeds,mul)=>{const s=new Set(seeds),q=[...s];for(let j=0;j<q.length;j++)for(const b of seeds){const z=mul(q[j],b);if(!s.has(z)){s.add(z);q.push(z)}}return s};
 let automatonModels=0,subsetChecks=0,automatonStateChecks=0,upperOnlyChecks=0,fullSignatureChecks=0,anchorCriterionChecks=0,periodicChecks=0;
 const ps=[[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]],s3=(a,b)=>ps.findIndex(p=>p.every((v,i)=>v===ps[a][ps[b][i]]));
 let rng=123456789;const rnd=n=>{rng=(Math.imul(rng,1664525)+1013904223)>>>0;return Math.floor(rng/4294967296*n)};
 for(const G of [2,3,6])for(let p=0;p<G;p++)for(const upper of [false,true]){
  const gm=G===6?s3:(a,b)=>(a+b)%G,inv=a=>Array.from({length:G},(_,b)=>b).find(b=>gm(a,b)===0);
  const N=4*G,id=(i,g,l)=>(i*G+g)*2+l,dec=x=>[Math.floor(x/(G*2)),Math.floor(x/2)%G,x%2],P=(l,i)=>l&&i?p:0,e=id(0,0,0);
  const U=upper?[N,N+1]:[],im=x=>x===N?e:x===N+1?id(1,inv(p),1):x;
  const mul=(a,b)=>{if(a>=N&&a===b)return a;const [i,g,l]=dec(im(a)),[j,h,m]=dec(im(b));return id(i,gm(gm(g,P(l,j)),h),m)};
  const V=[...close(U,mul)].filter(x=>x<N);upperOnlyChecks++;
  const D=[...U.map(u=>dec(mul(mul(e,u),e))[1]),...V.map(v=>dec(v)[1])],sig=close([0,p,...D],gm);
  const count=G<6?1<<N:180;
  for(let k=0;k<count;k++){
   const X=Array.from({length:N},(_,i)=>i).filter(i=>G<6?((k>>i)&1):rnd(4)===0);
   const direct=new Set([...close([...U,...X],mul)].filter(x=>x<N));
   const S=[...new Set([...X,...V])],initial=new Set(S),q=[...S];
   for(let j=0;j<q.length;j++)for(const u of U){const z=mul(u,q[j]);if(!initial.has(z)){initial.add(z);q.push(z)}}
   // Column automaton: label multiplication only, row is carried unchanged.
   const found=new Set(initial),states=[...initial];
   for(let j=0;j<states.length;j++){
    const [i,g,l]=dec(states[j]);
    for(const x of [...U,...S]){
     let m,w;if(x>=N){const [,,ll]=dec(im(x));m=ll;w=dec(mul(id(0,0,l),x))[1]}
     else {const [r,h,ll]=dec(x);m=ll;w=gm(P(l,r),h)}
     const z=id(i,gm(g,w),m);if(!found.has(z)){found.add(z);states.push(z)}
    }
   }
   ok(found.size===direct.size&&[...found].every(z=>direct.has(z)),"automaton closure");subsetChecks++;automatonStateChecks+=found.size;
   if(sig.size===G){
    fullSignatureChecks++;const rows=new Set([...direct].map(z=>dec(z)[0])),cols=new Set([...direct].map(z=>dec(z)[2]));
    const anchor=[id(0,0,0),id(1,0,0),id(0,0,1)].every(z=>direct.has(z));
    ok((direct.size===N)===anchor,"anchor criterion");anchorCriterionChecks++;
    if(rows.size===2&&cols.size===2){ok(direct.size===N,"periodic sufficiency");periodicChecks++}
   }
  }automatonModels++;
 }
 // Free group exact words for the position-coupled example.
 const red=w=>{const s=[];for(const a of w){if(s.length&&s.at(-1)===-a)s.pop();else s.push(a)}return s},inv=w=>[...w].reverse().map(x=>-x),cat=(...w)=>red(w.flat()),eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
 const pairs=[];for(let d=0;d<10;d++)for(let i=0;i<=d;i++)pairs.push([i,d-i]);
 const num=new Map(pairs.map((p,i)=>[p.join(","),i]));
 const R=(i,k)=>({type:i,k}),s0={type:-1,k:0},s1={type:-2,k:0},elt=(i,g,l)=>({i,g,l});
 const P=(l,i)=>{if(l.type===-1||i.type<0&&i.type!==-2)return [];if(l.type===-2)return i.type===-2?[1]:i.type>=0?[-(i.type+1)]:[];if(i.type<0)return [];const n=num.get([i.type,l.type].join(","));return n===undefined?[]:[n+2]};
 const mul=(a,b)=>elt(a.i,cat(a.g,P(a.l,b.i),b.g),b.l),e=elt(s0,[],s0),b=elt(s1,[],s1);
 const K=g=>elt(s0,g,s0),ex=(n,shift=0)=>{const [i,j]=pairs[n];return elt(R(i,j+shift),cat([i+1],[-n-1]),R(j,i+shift))};
 const chi=(w,n)=>w.reduce((s,x)=>s+(x===n+1?1:x===-n-1?-1:0),0),F=(a,n)=>chi(a.g,n)-(a.i.type===n?1:0);
 const min=(a,m,side)=>{const lower=r=>r.type<0?r:R(r.type,Math.min(r.k,m));return side===0?elt(lower(a.i),a.g,a.l):elt(a.i,a.g,lower(a.l))};
 let extractionChecks=0,bootstrapChecks=0,transportChecks=0,potentialSeedChecks=0,potentialProductChecks=0,potentialActionChecks=0,negativeObstructions=0,repairChecks=0;
 const anchor=a=>mul(mul(e,a),e);
 ok(eq(anchor(mul(b,b)).g,[1]),"initial positive x0");extractionChecks++;
 for(let n=0;n<pairs.length;n++){
  for(let shift=0;shift<2;shift++){
   const a=ex(n,shift),negative=anchor(mul(b,a));ok(eq(negative.g,[-n-1]),"extract negative");extractionChecks++;
   const zinv=K(inv(a.g)),p=mul(mul(zinv,anchor(mul(a,a))),zinv);
   ok(eq(p.g,[n+2]),"bootstrap positive");bootstrapChecks++;
   for(let j=0;j<pairs.length;j++){ok(F(a,j)===(j===n?-1:0),"seed potential");potentialSeedChecks++}
  }
  const [i,j]=pairs[n],a=ex(n),lift=ex(n,1);ok(JSON.stringify(min(min(lift,j,0),i,1))===JSON.stringify(a),"one-way lift");transportChecks++;
 }
 const repair=[elt(s0,[1],s0),elt(s0,[-1],s0),elt(s1,[1],s1),elt(s1,[-1,-1],s1)];
 ok(JSON.stringify(mul(repair[0],repair[1]))===JSON.stringify(e),"repair e");ok(JSON.stringify(mul(repair[2],repair[3]))===JSON.stringify(b),"repair b");repairChecks+=2;
 const all=[e,b,...pairs.map((_,n)=>ex(n)),...pairs.map((_,n)=>ex(n,1))];
 for(let n=0;n<pairs.length;n++){
  const pool=all.filter(a=>F(a,n)>=0);if(n>0)pool.push(...repair);
  for(let trial=0;trial<180;trial++){
   let a=pool[rnd(pool.length)];for(let k=0;k<6;k++){
    const c=pool[rnd(pool.length)],z=mul(a,c),delta=(c.i.type===n?1:0)+chi(P(a.l,c.i),n);
    ok(delta>=0&&F(z,n)===F(a,n)+F(c,n)+delta&&F(z,n)>=0,"product potential");potentialProductChecks++;
    a=min(z,rnd(12),rnd(2));ok(F(a,n)===F(z,n),"upper action potential");potentialActionChecks++;
   }
   ok(F(a,n)>=0&&F(ex(n),n)<0,"negative obstruction");negativeObstructions++;
  }
 }
 // Finite periodic analogue, two weak types and three heights; free sign
 // obstructions are NOT asserted here.
 let finiteModels=0,finiteClosures=0,finiteAnchorChecks=0,finiteLiftChecks=0;
 for(const order of [2,3]){
  const q=2,k=q*q,G=order**k,RN=2+q*3,N=RN*G*RN,pow=Array.from({length:k},(_,i)=>order**i),mod=x=>(x%order+order)%order,add=(a,b)=>pow.reduce((s,p)=>s+mod(Math.floor(a/p)+Math.floor(b/p))*p,0),neg=a=>pow.reduce((s,p)=>s+mod(-Math.floor(a/p))*p,0);
  const id=(i,g,l)=>(i*G+g)*RN+l,dec=x=>[Math.floor(x/(G*RN)),Math.floor(x/RN)%G,x%RN],type=i=>Math.floor((i-2)/3),depth=i=>(i-2)%3,cell=(i,j)=>2+3*i+j;
  const P=(l,i)=>l===0||i===0?0:l===1?i===1?1:neg(pow[type(i)]):i===1?0:pow[(type(i)*q+type(l)+1)%k];
  const move=(m,i)=>i<2?i:cell(type(i),Math.min(m,depth(i)));
  const mul=(a,b)=>{if(a>=N&&b>=N)return Math.min(a,b);if(a>=N){const [i,g,l]=dec(b);return id(move(a-N,i),g,l)}if(b>=N){const [i,g,l]=dec(a);return id(i,g,move(b-N,l))}const [i,g,l]=dec(a),[j,h,m]=dec(b);return id(i,add(add(g,P(l,j)),h),m)};
  const U=[N,N+1,N+2],e=id(0,0,0),b=id(1,0,1),tail=shift=>Array.from({length:k},(_,n)=>{const i=Math.floor(n/q),j=n%q;return id(cell(i,j+shift),add(pow[i],neg(pow[n])),cell(j,i+shift))});
  const X=tail(0),Y=tail(1);
  for(let n=0;n<k;n++){let i=Math.floor(n/q),j=n%q;ok(mul(mul(N+j,Y[n]),N+i)===X[n],"finite lift");finiteLiftChecks++}
  for(const [max,T] of [[1,X],[2,Y]]){
   const cl=close([e,b,...T,...U],mul),r=Array.from({length:RN},(_,i)=>i).filter(i=>i<2||depth(i)<=max);
   ok(cl.size===r.length*r.length*G+U.length,"finite restricted closure");finiteClosures++;
   for(const i of r){ok(cl.has(id(i,0,0))&&cl.has(id(0,0,i)),"anchor idempotents");finiteAnchorChecks++}
  }finiteModels++;
 }
 return {study:48,automatonModels,subsetChecks,automatonStateChecks,upperOnlyChecks,fullSignatureChecks,anchorCriterionChecks,periodicChecks,extractionChecks,bootstrapChecks,transportChecks,potentialSeedChecks,potentialProductChecks,potentialActionChecks,negativeObstructions,repairChecks,finiteModels,finiteClosures,finiteAnchorChecks,finiteLiftChecks,all_passed:true,scope:"Exact finite automata vs semigroup closure (exhaustive C2/C3, sampled S3), periodic anchor criterion, reduced free words and sampled positive words with position-dependent sign certificates, finite min-action analogues. Infinite generation, irredundance and cofinality are analytical proofs."};
}
console.log(JSON.stringify(experiment(), null, 2));
