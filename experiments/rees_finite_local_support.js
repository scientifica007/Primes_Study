// Study 34: finite local support in genuine free groups.
function experiment(){
 const assert=(x,m)=>{if(!x)throw Error(m)},eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
 const red=w=>{let a=[];for(const x of w){if(a.length&&a[a.length-1]===-x)a.pop();else a.push(x)}return a};
 const cat=(...w)=>red(w.flat()),inv=w=>w.slice().reverse().map(x=>-x),pi=w=>red(w.filter(x=>Math.abs(x)!==1));
 let lifts=0,kernelWords=0,normalConjugates=0,fullWords=0,monoidWords=0,associativity=0,obstructionWords=0;
 function kernelFactors(w){let h=[],f=[];for(const x of w){if(Math.abs(x)===1)f.push(cat(h,[x],inv(h)));else h=cat(h,[x])}assert(!h.length,"kernel membership");assert(eq(cat(...f),red(w)),"kernel decomposition");normalConjugates+=f.length;kernelWords++;return f}
 for(const mode of ["Q","M"]){
  const P=(l,i)=>l===i&&i>0?[mode==="Q"?i+1:2*i]:[];
  const upper=g=>[1,0,g,0],local=(i,g,l)=>[0,i,g,l];
  const mul=(a,b)=>{if(a[0]&&b[0])return upper(cat(a[2],b[2]));return local(a[0]?0:a[1],cat(a[2],a[0]||b[0]?[]:P(a[3],b[1]),b[2]),b[0]?0:b[3])};
  const prod=w=>w.reduce(mul),up=g=>{if(mode==="Q"){assert(!pi(g).length,"upper kernel");const f=kernelFactors(g);return f.length?f.map(upper):[upper([1]),upper([-1])]}assert(g.every(x=>Math.abs(x)%2===0),"upper free factor");return g.length?g.map(x=>upper([x])):[upper([2]),upper([-2])]};
  const idup=up([]),t=mode==="Q"?1:2,letter=n=>mode==="Q"?n+1:2*n+1;
  const orig=i=>[(i%2?1:-1)*letter(Math.ceil(i/2))];
  for(const pattern of [0,1,2,3,4,5]){
   const shifted=i=>pattern===0?false:pattern===1?true:((i+pattern)%3!==0);
   const seed=i=>local(i,cat(orig(i),shifted(i)?[t]:[]),i);
   const localLetter=i=>[...idup,seed(i),...idup,...(shifted(i)?up([-t]):[])];
   const e=[...localLetter(1),...localLetter(2)];assert(eq(prod(e),local(0,[],0)),"anchor");
   const anchorLetter=x=>{
    if(mode==="Q"&&Math.abs(x)===1||mode==="M"&&Math.abs(x)%2===0){let w=[...e,...up([x])];assert(eq(prod(w),local(0,[x],0)),"upper letter");return w}
    const n=mode==="Q"?Math.abs(x)-1:(Math.abs(x)-1)/2,i=2*n-(x>0?1:0),w=localLetter(i);
    assert(eq(prod(w),local(0,[x],0)),"local letter");return w;
   };
   const anchorWord=w=>w.length?w.flatMap(anchorLetter):e;
   for(let i=0;i<7;i++)for(let j=0;j<7;j++)for(let n=1;n<=4;n++)for(const s of [-1,1]){
    const a=i?[seed(i)]:idup,b=j?[seed(j)]:idup,ga=prod(a)[2],gb=prod(b)[2],target=cat([s*letter(n),t,-s*letter(n),-t,letter(n+1)]);
    const w=[...a,...anchorWord(cat(inv(ga),target,inv(gb))),...b];
    assert(eq(prod(w),local(i,target,j)),"actual generation");fullWords++;
    if(mode==="Q"){
     const raw=[...idup,seed(2*n-1),seed(2*n),...idup],z=prod(raw),desired=pi(z[2]),correction=cat(inv(z[2]),desired);
     const fixed=[...raw,...up(correction)];assert(eq(prod(fixed),local(0,desired,0)),"quotient lift");lifts++;
    }else monoidWords++;
   }
   const samples=[...idup,...[1,2,3,4].map(seed),upper([t]),upper([-t])];
   for(const a of samples)for(const b of samples)for(const c of samples){assert(eq(mul(mul(a,b),c),mul(a,mul(b,c))),"associativity");associativity++}
  }
 }
 const b=[-2,1,1,2,-1,-1,-2],gens=[[1],[-1],[2],b,[3],[-3]];
 const act=(w,x)=>{for(let i=w.length-1;i>=0;i--){const a=w[i];if(a===1)x*=2;else if(a===-1)x/=2;else if(a===2)x+=1;else if(a===-2)x-=1}return x};
 assert(eq(pi(b),[-2])&&act(b,0)===2,"obstruction generator");
 const visit=(w,k)=>{if(w.length){assert(act(w,0)>=0,"nonnegative orbit");obstructionWords++}if(k)for(const g of gens)visit([...w,...g],k-1)};
 visit([],5);assert(act([-2],0)===-1,"excluded inverse");
 return {mixed_patterns:12,positive_target_words:fullWords,quotient_lift_checks:lifts,normal_kernel_decompositions:kernelWords,normal_conjugate_factors:normalConjugates,non_normal_subgroup_target_words:monoidWords,associativity_checks:associativity,obstruction_words:obstructionWords,scope:"Actual reduced words in countably infinite free groups, two-level Rees extensions; finite samples and bounded affine obstruction."};
}
console.log(JSON.stringify(experiment(), null, 2));
