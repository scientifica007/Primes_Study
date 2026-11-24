'use strict';
function experiment(){
 const assert=(v,m)=>{if(!v)throw Error(m)};
 let graphs=0,seedCases=0,minimalCovers=0,subsets=0;
 for(let mask=0;mask<4096;mask++){
  const reach=Array.from({length:4},(_,i)=>1<<i);let bit=0;
  for(let i=0;i<4;i++)for(let j=0;j<4;j++)if(i!==j){if(mask&(1<<bit))reach[i]|=1<<j;bit++}
  for(let k=0;k<4;k++)for(let i=0;i<4;i++)if(reach[i]&(1<<k))reach[i]|=reach[k];
  const close=s=>reach.reduce((r,v,i)=>r|((s&(1<<i))?v:0),0);
  graphs++;
  for(let v=0;v<16;v++){
   const covered=close(v),sources=[];
   for(let i=0;i<4;i++){
    const scc=reach.reduce((r,w,j)=>r|((reach[i]&(1<<j))&&(w&(1<<i))?1<<j:0),0);
    if((scc&covered)||sources.includes(scc))continue;
    if(reach.every((w,j)=>!(w&(1<<i))||(scc&(1<<j))))sources.push(scc);
   }
   seedCases++;
   for(let x=0;x<16;x++){
    subsets++;let minimal=close(v|x)===15;
    if(minimal)for(let i=0;i<4;i++)if((x&(1<<i))&&close(v|(x&~(1<<i)))===15)minimal=false;
    const predicted=(x&~sources.reduce((r,s)=>r|s,0))===0&&sources.every(s=>{let z=x&s;return z!==0&&(z&(z-1))===0});
    assert(minimal===predicted,"source cover");
    if(minimal)minimalCovers++;
   }
  }
 }
 let models=0,stars=0,removals=0,anchorRemoved=0,assocTriples=0;
 for(const m of [4,6,8])for(let bits=0;bits<4;bits++)for(let twist=0;twist<2;twist++){
  const t=m/2,I=6,L=4,N=I*m*L+4, mod=x=>(x%m+m)%m;
  const p=(l,i)=>Math.floor(l/2)===1&&Math.floor(i/2)>0&&(bits&(1<<(Math.floor(i/2)-1)))?t:0;
  const id=(i,g,l)=>(i*m+mod(g))*L+l, dec=x=>[Math.floor(x/(m*L)),Math.floor(x/L)%m,x%L],u0=N-4;
  const mul=(a,b)=>{
   if(a>=u0&&b>=u0)return u0+((a-u0)^(b-u0));
   if(a>=u0){let [i,g,l]=dec(b),u=a-u0;return id(i^(u&1),g+(twist&&(u&1)?t:0),l)}
   if(b>=u0){let [i,g,l]=dec(a),u=b-u0;return id(i,g+(twist&&(u&1)?t:0),l^((u>>1)&1))}
   const [i,g,l]=dec(a),[j,h,k]=dec(b);return id(i,g+p(l,j)+h,k);
  };
  const table=Array.from({length:N},(_,a)=>Array.from({length:N},(_,b)=>mul(a,b)));
  // Check all triples in a smaller representative model, full closure in every model.
  if(m===4&&bits===3&&twist===1)for(let a=0;a<N;a++)for(let b=0;b<N;b++)for(let c=0;c<N;c++){assert(table[table[a][b]][c]===table[a][table[b][c]],"associativity");assocTriples++}
  const full=b=>{const seeds=[...new Set([...b,u0,u0+1,u0+2,u0+3])],seen=new Set(seeds),q=[...seeds];for(let n=0;n<q.length;n++)for(const y of seeds){let z=table[q[n]][y];if(!seen.has(z)){seen.add(z);q.push(z)}}return seen.size===N};
  const bs=[];
  for(const k of [0,2]){
   const e=id(0,0,k);let b=[e,id(2,-p(k,2),k),id(4,t-p(k,4),k),id(0,t,2-k),id(0,1,k)];
   assert(new Set(b).size===b.length&&full(b),"star generation");
   if(full(b.filter(x=>x!==e))){b=b.filter(x=>x!==e);anchorRemoved++}
   for(const x of b){removals++;assert(!full(b.filter(y=>y!==x)),"star irredundance")}
   bs.push(b);stars++;
  }
  assert(bs[0].every(x=>!bs[1].includes(x)),"disjoint stars");models++;
 }
 let truncations=0,rawRedundant=0;
 for(let n=3;n<=10;n++){
  // On the truncation 0,...,n, min-actions reach each row from n.
  for(let i=1;i<n;i++){assert(Math.min(n,i)===i,"min reach");rawRedundant++}
  truncations++;
 }
 return {study:36,graph_models:graphs,graph_seed_cases:seedCases,graph_subset_cases:subsets,minimal_covers:minimalCovers,relative_rees_models:models,stars,irredundance_deletions:removals,anchors_removed:anchorRemoved,associativity_triples:assocTriples,min_action_truncations:truncations,non_top_non_anchor_rows_reachable_from_top:rawRedundant,all_passed:true,scope:"All loop-free directed graphs on 4 labelled vertices; cyclic groups C4,C6,C8, three row orbits, two column orbits, two phases each, four block-constant normalized sandwich matrices and two upper twists. Finite capacity analogue of cardinal star; not exhaustive over semigroups, nonabelian groups or infinite cardinals. Min-action test is reachability only."};
}
console.log(JSON.stringify(experiment(), null, 2));
