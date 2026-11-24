// Study 31: finite criterion checks and genuine infinite positive words.
function experiment(){
 const assert=(x,m)=>{if(!x)throw Error(m)},range=n=>Array.from({length:n},(_,i)=>i);
 let models=0,subsets=0,criteria=0,shifts=0,words=0,obstruction=0;
 for(const n of [2,3])for(const p of range(n))for(const mode of p===0?[0,1,2]:[0]){
  const U=mode===0?[]:mode===1?[-1]:range(n).map(g=>-1-g);
  const J=range(4*n),row=x=>Math.floor(x/(2*n)),col=x=>x%2,g=x=>Math.floor(x/2)%n,key=(i,v,l)=>i*2*n+2*v+l;
  const P=(l,i)=>l&&i?p:0;
  const flip=u=>n===2&&mode===2?(-u-1)%2:0;
  const mul=(a,b)=>{
   if(a<0&&b<0)return mode===1?-1:-1-((-a-1-b-1)%n);
   if(a<0)return key(mode===1?0:(row(b)+flip(a))%2,(g(b)+(mode===2?-a-1:0))%n,col(b));
   if(b<0)return key(row(a),(g(a)+(mode===2?-b-1:0))%n,mode===1?0:(col(a)+flip(b))%2);
   return key(row(a),(g(a)+P(col(a),row(b))+g(b))%n,col(b));
  };
  const close=X=>{let seed=[...new Set([...U,...X])],q=[...seed],S=new Set(q);for(let i=0;i<q.length;i++)for(const b of seed){let z=mul(q[i],b);if(!S.has(z)){S.add(z);q.push(z)}}return S};
  // test L=<P>, plus optional enlarged L=G.
  const Ls=p===0?[[0],range(n)]:[range(n)];
  models++;
  for(let mask=0;mask<2**J.length;mask++){
   const X=J.filter((_,i)=>mask&(1<<i)),Z=close(X);subsets++;
   for(const L of Ls){
    const F=L.map(v=>key(0,v,0));if(!F.every(x=>Z.has(x)))continue;
    let R=new Set(X.map(row)),C=new Set(X.map(col));
    if(mode===1&&X.length){R.add(0);C.add(0)}
    if(mode===2&&n===2&&X.length){R.add(0);R.add(1);C.add(0);C.add(1)}
    const M=new Set([...L,...X.map(g),...(mode===2?range(n):[0])]),q=[...M];for(let i=0;i<q.length;i++)for(const v of [...M]){const z=(q[i]+v)%n;if(!M.has(z)){M.add(z);q.push(z)}}
    assert((R.size===2&&C.size===2&&M.size===n)===J.every(x=>Z.has(x)),"criterion");criteria++;
    if(L.length===n&&F.every(x=>X.includes(x))){
     const Y=X.map(x=>F.includes(x)?x:key(row(x),(g(x)+1)%n,col(x))),Yc=close(Y);
     assert(J.every(x=>Z.has(x))===J.every(x=>Yc.has(x)),"shift");shifts++;
    }
   }
  }
 }
 for(const abelian of [true,false]){
  const red=w=>{if(abelian){let c=new Map;for(const x of w)c.set(Math.abs(x),(c.get(Math.abs(x))||0)+Math.sign(x));return [...c].sort((a,b)=>a[0]-b[0]).flatMap(([k,v])=>Array(Math.abs(v)).fill(Math.sign(v)*k))}let q=[];for(const x of w){if(q.length&&q[q.length-1]===-x)q.pop();else q.push(x)}return q};
  const inv=w=>w.slice().reverse().map(x=>-x),eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
  const P=(l,i)=>l===0||i===0||(i===1&&l===1)?[]:Array(Math.abs((l+2*i)%5-2)).fill(Math.sign((l+2*i)%5-2));
  const mul=(x,y)=>[x[0],red([...x[1],...P(x[2],y[0]),...y[1]]),y[2]];
  const seed=(side,i)=>{let v=(Math.floor(i/2)+1)*(i%2?-1:1);return [i,side===0?[v]:i<2?[-v]:red([v,1]),i]};
  for(const side of [0,1]){
   const a=seed(side,0),b=seed(side,1),e=[a,b,b,a];assert(eq(e.reduce(mul),[0,[],0]),"anchor identity");
   const letter=x=>{let i=2*(Math.abs(x)-1)+(x<0?1:0);if(side===1&&i<2)i=1-i;let w=[...e,seed(side,i),...e];if(side===1&&i>=2)w.push(...e,seed(side,0),...e);assert(eq(w.reduce(mul),[0,[x],0]),"anchor letter");return w};
   for(let i=0;i<12;i++)for(let j=0;j<12;j++)for(let k=1;k<=6;k++)for(const s of [-1,1]){
    const target=red([s*k,1,-2,-s*k,3]),x=seed(side,i),y=seed(side,j),middle=red([...inv(x[1]),...target,...inv(y[1])]);
    const w=[x,...(middle.length?middle.flatMap(letter):e),y];assert(eq(w.reduce(mul),[i,target,j]),"infinite word");words++;
   }
  }
  for(let i=0;i<12;i++)assert(!eq(seed(0,i),seed(1,i)),"disjoint");
 }
 const F=[[0,[0,0,0],0],[1,[0,0,0],1]],X=range(3).map(i=>[2+i,range(3).map(j=>i===j?1:0),2+i]);
 const mul=(a,b)=>[a[0],a[1].map((x,i)=>x+b[1][i]),b[2]],eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
 const walk=(w,n)=>{if(w.length){let y=w.reduce(mul);for(let i=0;i<3;i++)if(eq(y,X[i]))assert(w.length===1&&eq(w[0],X[i]),"obstruction");obstruction++}if(n)for(const x of [...F,...X])walk([...w,x],n-1)};walk([],5);
 return {finite_models:models,subsets_examined:subsets,conditional_criterion_checks:criteria,shift_invariance_checks:shifts,actual_infinite_positive_words:words,independent_block_words:obstruction,scope:"Finite cyclic fixtures and upper actions; genuine infinite free abelian and free groups with finite-rank nonconstant sandwich; bounded obstruction words. No exhaustive infinite validation."};
}
console.log(JSON.stringify(experiment(), null, 2));
