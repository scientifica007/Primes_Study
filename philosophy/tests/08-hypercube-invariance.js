// Study 08: exhaustive check of prime-implicant count invariance.
// Run: node philosophy/tests/08-hypercube-invariance.js
function check(){
 const results=[];
 for(let n=1;n<=3;n++){
 const N=2**n,U=(1<<N)-1;
 const cubes=[];
 for(let fixed=0;fixed<N;fixed++)for(let val=0;val<N;val++)if((val&fixed)===val){let c=0;for(let x=0;x<N;x++)if((x&fixed)===val)c|=1<<x;cubes.push(c);}
 const counts=Array.from({length:U+1},(_,f)=>{const sub=cubes.filter(c=>(c&f)===c);return sub.filter(c=>!sub.some(d=>c!==d&&(c&d)===c)).length;});
 const edges=[];for(let x=0;x<N;x++)for(let i=0;i<n;i++)if(x<(x^(1<<i)))edges.push([x,x^(1<<i)]);
 const perm=[],used=Array(N).fill(false);let total=0,good=0,edgesGood=0,comparison=0;
 function visit(){if(perm.length===N){total++;const adjacency=edges.every(([x,y])=>{let d=perm[x]^perm[y];return d!==0&&(d&(d-1))===0;});
 if(adjacency)edgesGood++;
 let preserves=true;for(let f=0;f<=U;f++){let g=0;for(let x=0;x<N;x++)if(f&(1<<x))g|=1<<perm[x];comparison++;if(counts[f]!==counts[g]){preserves=false;break;}}
 if(preserves)good++;if(preserves!==adjacency)throw Error("equivalence failed");return;}
 for(let x=0;x<N;x++)if(!used[x]){used[x]=true;perm.push(x);visit();perm.pop();used[x]=false;}}
 visit();results.push({n,total,good,edgesGood,comparison});
 }
 return results;
}
console.log(JSON.stringify(check(), null, 2));
