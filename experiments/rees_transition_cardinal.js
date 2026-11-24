// Study 35: transition cycles, disjoint stars and actual free group words.
function experiment(){
 const assert=(v,m)=>{if(!v)throw Error(m)},range=n=>Array.from({length:n},(_,i)=>i),eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
 let models=0,subsets=0,cycleChecks=0,shortLoopChecks=0,finiteStarChecks=0,privateChecks=0,infiniteWords=0,anchorChecks=0;
 const perms=[[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]],sm=(a,b)=>perms.findIndex(p=>p.every((x,i)=>x===perms[a][perms[b][i]]));
 for(const n of [2,3])for(const p of range(n)){
  const J=range(4*n),i=a=>Math.floor(a/(2*n)),g=a=>Math.floor(a/2)%n,l=a=>a%2,P=(a,b)=>a&&b?p:0,key=(a,b,c)=>2*n*a+2*b+c;
  const mul=(a,b)=>key(i(a),(g(a)+P(l(a),i(b))+g(b))%n,l(b));
  const close=X=>{const q=[...X],s=new Set(q);for(let j=0;j<q.length;j++)for(const b of X){const z=mul(q[j],b);if(!s.has(z)){s.add(z);q.push(z)}}return s};
  const w=(a,b)=>(P(l(a),i(b))+g(b))%n;
  for(let mask=1;mask<2**J.length;mask++){
   const X=J.filter((_,j)=>mask&(1<<j)),o=X[0],s=new Set([0]),q=[[o,0]],seen=new Set([o*n]);
   for(let j=0;j<q.length;j++)for(const b of X){const z=(q[j][1]+w(q[j][0],b))%n,k=b*n+z;if(!seen.has(k)){seen.add(k);q.push([b,z]);if(b===o)s.add(z)}}
   const cover=new Set(X.map(i)).size===2&&new Set(X.map(l)).size===2;
   assert((cover&&s.size===n)===(close(X).size===J.length),"cycle criterion");cycleChecks++;
   const d=a=>a===o?0:w(o,a),back=a=>a===o?0:w(a,o);
   const short=new Set([0]);for(const a of X){short.add((d(a)+back(a))%n);for(const b of X)short.add((d(a)+w(a,b)+back(b))%n)}
   const z=[0],zz=new Set(z);for(let j=0;j<z.length;j++)for(const v of short){const t=(z[j]+v)%n;if(!zz.has(t)){zz.add(t);z.push(t)}}
   assert(s.size===zz.size&&[...s].every(x=>zz.has(x)),"short group loops");shortLoopChecks++;subsets++;
  }
  models++;
 }
 // Finite star fixture: H proper subgroup, including nonnormal H in S3.
 for(const mode of ["C2xC2","S3"]){
  const n=mode==="S3"?6:4,gm=mode==="S3"?sm:(a,b)=>a^b,H=[0,1],Y=mode==="S3"?[2]:[2],inv=a=>range(n).find(b=>gm(a,b)===0);
  for(let mask=0;mask<8;mask++){
   const nr=4,nl=2,key=(i,g,l)=>2*n*i+2*g+l,row=a=>Math.floor(a/(2*n)),g=a=>Math.floor(a/2)%n,col=a=>a%2,J=range(nr*nl*n),P=(l,i)=>l&&i?((mask>>(i-1))&1):0;
   const mul=(a,b)=>key(row(a),gm(gm(g(a),P(col(a),row(b))),g(b)),col(b));
   const full=X=>{let q=[...X],s=new Set(q);for(let j=0;j<q.length;j++)for(const b of X){const z=mul(q[j],b);if(!s.has(z)){s.add(z);q.push(z)}}return s.size===J.length};
   const make=k=>{let e=key(0,0,k),B=[e,...range(nr-1).map(j=>{let i=j+1;return key(i,gm(inv(P(k,i)),H[j%2]),k)}),key(0,1,1-k),...Y.map(y=>key(0,y,k))];assert(full(B),"star generation");if(full(B.filter(a=>a!==e)))B=B.filter(a=>a!==e);for(const a of B){assert(!full(B.filter(b=>a!==b)),"star private");privateChecks++}return B};
   const A=make(0),B=make(1);assert(A.every(a=>!B.includes(a)),"disjoint stars");finiteStarChecks++;
  }
 }
 // Genuine free group, matrix of infinite rank, support via t,x_n; remaining y_n.
 const red=w=>{let r=[];for(const x of w){if(r.length&&r[r.length-1]===-x)r.pop();else r.push(x)}return r},cat=(...ws)=>red(ws.flat()),inv=w=>w.slice().reverse().map(x=>-x);
 const P=(l,i)=>l===i&&i>0?[2*i]:[],mul=(a,b)=>[a[0],cat(a[1],P(a[2],b[0]),b[1]),b[2]],prod=w=>w.reduce(mul);
 const h=i=>i===1?[1]:i===2?[-1]:[(i%2?1:-1)*2*Math.ceil((i-2)/2)];
 const rowFor=x=>Math.abs(x)===1?(x>0?1:2):2+Math.abs(x)-(x>0?1:0);
 const hLetter=x=>{let i=rowFor(x);assert(eq(h(i),[x]),"encoding");return i};
 for(const k of [0,1]){
  const e=[0,[],k],r=i=>[i,cat(inv(P(k,i)),h(i)),k],c=l=>[0,[k===0||l===0?1:0].filter(Boolean),l],y=x=>[0,[x],k];
  const letter=x=>{if(Math.abs(x)>1&&Math.abs(x)%2===1)return [y(x)];const w=[e,r(hLetter(x)),e];assert(eq(prod(w),[0,[x],k]),"anchor letter");anchorChecks++;return w};
  const anchor=w=>w.length?w.flatMap(letter):[e];
  for(let i=0;i<7;i++)for(let l=0;l<7;l++)for(let n=1;n<6;n++)for(const sign of [-1,1]){
   const a=i?r(i):e,b=l===k?e:c(l),target=cat([2*n,sign*(2*n+1),-2*n,1,-(2*n+3)]),word=[a,...anchor(cat(inv(a[1]),target,inv(b[1]))),b];
   assert(eq(prod(word),[i,target,l]),"infinite word");infiniteWords++;
  }
 }
 return {finite_cycle_models:models,nonempty_subsets:subsets,cycle_criterion_checks:cycleChecks,short_cycle_group_checks:shortLoopChecks,finite_disjoint_star_pairs:finiteStarChecks,irredundance_deletions:privateChecks,free_group_positive_words:infiniteWords,anchor_letter_checks:anchorChecks,scope:"Finite cyclic exhaustive fixtures, finite proper-subgroup star fixtures, exact words in a countably generated free group with infinite-rank sandwich; no exhaustive infinite validation."};
}
console.log(JSON.stringify(experiment(), null, 2));
