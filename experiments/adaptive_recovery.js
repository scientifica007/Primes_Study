'use strict';
function experiment(){
 const ok=(x,m)=>{if(!x)throw Error(m)};
 let state=123456789;const rand=n=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return Math.floor((state/4294967296)*n)};
 let models=0,mixes=0,closureChecks=0,deletionChecks=0,cylinderChecks=0,uniformChecks=0,distinctWitnesses=0;
 // Four-element group, three private rows, one upper group mapped to fourth row.
 const N=16,prod=(a,b)=>a>=N&&b>=N?N+((a-N)^(b-N)):((a>=N?3:Math.floor(a/4))*4+((a>=N?a-N:a%4)^(b>=N?b-N:b%4)));
 const U=[16,17,18,19];
 const close=seeds=>{const w=new Map(seeds.map(s=>[s,[s]])),q=[...w.keys()];for(let j=0;j<q.length;j++)for(const b of seeds){let z=prod(q[j],b);if(!w.has(z)){w.set(z,[...w.get(q[j]),b]);q.push(z)}}return w};
 const configs=Array.from({length:27},(_,m)=>[m%3,Math.floor(m/3)%3,Math.floor(m/9)%3]);
 for(let pat=0;pat<6;pat++){
  const options=Array.from({length:3},(_,i)=>Array.from({length:3},(_,j)=>4*i+((i+pat+j)%4)));
  const originals=options.map(o=>o[0]),witnesses=originals.map(()=>[]);
  for(const conf of configs){
   const X=conf.map((j,i)=>options[i][j]),cl=close([...X,...U]);ok(cl.size===20,"relative closure");closureChecks++;
   for(const a of X){ok(!close([...X.filter(x=>x!==a),...U]).has(a),"private row");deletionChecks++}
   for(let a=0;a<3;a++){const word=cl.get(originals[a]),used=word.filter(x=>x<N).map(x=>Math.floor(x/4)),cyl=[...new Set(used)].map(i=>[i,conf[i]]);
    const donors=[...new Set(word.filter(x=>x>=N))];witnesses[a].push({word,cyl,donors});}
   mixes++;
  }
  for(let a=0;a<3;a++){
   const available=new Set(configs.map((_,i)=>i)),chosen=[];
   while(available.size){let idx=[...available][0],w=witnesses[a][idx];chosen.push(w);
    for(const k of [...available])if(w.cyl.every(([i,j])=>configs[k][i]===j))available.delete(k);
   }
   distinctWitnesses+=chosen.length;
   const union=[...new Set(chosen.flatMap(w=>w.donors))];
   for(const conf of configs){
    const X=conf.map((j,i)=>options[i][j]);const w=chosen.find(w=>w.cyl.every(([i,j])=>conf[i]===j));
    ok(w&&w.word.every(x=>X.includes(x)||U.includes(x))&&w.word.reduce(prod)===originals[a],"cylinder witness");cylinderChecks++;
    ok(close([...X,...union]).has(originals[a]),"uniform union");uniformChecks++;
   }
  }
  models++;
 }
 let graphModels=0,requirements=0,frontierChecks=0,newColored=0,forbiddenDepthChecks=0;
 for(let trial=0;trial<60;trial++){
  const n=12+trial%7,size=2+trial%4,V=n*size,block=v=>Math.floor(v/size),adj=Array.from({length:V},(_,v)=>{
   let i=block(v),z=[];if(i<n-1)for(let j=0;j<1+rand(4);j++)z.push((i+1+rand(n-i-1))*size+rand(size));return [...new Set(z)];
  });
  const colors=Array(n).fill(-1);for(let i=0;i<3;i++)colors[rand(n)]=rand(3);
  const req=Array.from({length:V*3},(_,i)=>[Math.floor(i/3),i%3]);
  for(let i=req.length-1;i>0;i--){let j=rand(i+1);[req[i],req[j]]=[req[j],req[i]]}
  for(const [root,c] of req){
   const F=new Set(colors.map((v,i)=>v>=0&&v!==c?i:-1).filter(i=>i>=0));
   const stack=[[root,0]],seen=new Set();
   while(stack.length){const [v,d]=stack.pop();ok(d<=F.size,"strict finite forbidden depth");forbiddenDepthChecks++;
    if(seen.has(v))continue;seen.add(v);let b=block(v);
    if(colors[b]===c)continue;
    if(colors[b]===-1){colors[b]=c;newColored++;continue}
    ok(F.has(b),"precolored only");for(const w of adj[v])stack.push([w,d+1]);
   }
   const check=new Map();for(let v=V-1;v>=0;v--)check.set(v,colors[block(v)]===c||(colors[block(v)]>=0&&adj[v].every(w=>check.get(w))));
   ok(check.get(root),"frontier cuts all branches or terminal");frontierChecks++;requirements++;
  }
  // Previous certificates persist under extension: no already colored block changes.
  for(const [root,c] of req){const check=new Map();for(let v=V-1;v>=0;v--)check.set(v,colors[block(v)]===c||(colors[block(v)]>=0&&adj[v].every(w=>check.get(w))));ok(check.get(root),"persisting frontier");frontierChecks++}
  graphModels++;
 }
 let ruleModels=0,seedSets=0,trapSubsets=0,trapEquivalence=0,rankChecks=0,completeRecoveries=0,incompleteRecoveries=0;
 for(let t=0;t<48;t++){
  const n=7,full=(1<<n)-1;
  const rules=Array.from({length:n},(_,a)=>Array.from({length:rand(4)},()=>{let m=0;for(let j=0;j<rand(4);j++){let b=rand(n);if(t%2===0&&b<=a)continue;m|=1<<b}return m}));
  for(let seed=0;seed<=full;seed++){
   let cur=seed,rank=Array.from({length:n},(_,a)=>seed&(1<<a)?0:-1);
   for(let k=1;;k++){let next=cur;for(let a=0;a<n;a++)if(rules[a].some(d=>(d&cur)===d)){next|=1<<a;if(rank[a]<0)rank[a]=k}
    if(next===cur)break;cur=next;
   }
   let union=0;
   for(let m=1;m<=full;m++)if(!(m&seed)){trapSubsets++;let trap=true;for(let a=0;a<n;a++)if((m&(1<<a))&&rules[a].some(d=>!(d&m)))trap=false;if(trap)union|=m}
   ok(union===(full^cur),"trap union equals complement");trapEquivalence++;if(cur===full)completeRecoveries++;else incompleteRecoveries++;
   for(let a=0;a<n;a++)if(rank[a]>0){ok(rules[a].some(d=>Array.from({length:n},(_,b)=>b).every(b=>!(d&(1<<b))||(rank[b]>=0&&rank[b]<rank[a]))),"rank decreases");rankChecks++}
   seedSets++;
  }ruleModels++;
 }
 let adaptiveCases=0,adaptiveDirect=0,badDefaultTraces=0;
 // Finite prefixes of the all-subsets obstruction plus alternate singleton witnesses
 // in the canonical chain; no claim that a fixed selector of the new rules is impossible.
 const n=12,full=(1<<n)-1;
 for(let m=1;m<=full;m++){
  let X=Array.from({length:n},(_,i)=>i).filter(i=>m&(1<<i));
  if(X.length>=3&&new Set(X.map(i=>i%3)).size===1)badDefaultTraces++;
  for(const i of X)if(i+3<n){for(let c=0;c<3;c++){
   let j=Array.from({length:n-i-1},(_,a)=>i+1+a).find(j=>j%3===c);
   ok(j!==undefined&&j>i&&j%3===c,"adaptive next donor");adaptiveDirect++;
  }adaptiveCases++}
 }
 return {study:45,models,mixes,closureChecks,deletionChecks,cylinderChecks,uniformChecks,distinctWitnesses,graphModels,requirements,frontierChecks,newColored,forbiddenDepthChecks,ruleModels,seedSets,trapSubsets,trapEquivalence,rankChecks,completeRecoveries,incompleteRecoveries,adaptiveCases,adaptiveDirect,badDefaultTraces,all_passed:true,scope:"Finite relative Rees models with exhaustive mixtures, positive-word cylinders and uniform donor unions; finite directed block graphs for frontier-extension mechanics (certificates must reach the target color or a precolored terminal, never an uncolored block); exhaustive seed/trap subsets in 48 small rule systems; finite traces of alternative witnesses. Compactness, countable coloring, reaping threshold and infinite recovery are proved analytically, not by finite tests."};
}
console.log(JSON.stringify(experiment(), null, 2));
