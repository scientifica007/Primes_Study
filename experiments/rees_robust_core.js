// Study 33: robust local core and actual infinite-chain positive words.
function experiment(){
 const assert=(v,m)=>{if(!v)throw Error(m)},range=n=>Array.from({length:n},(_,i)=>i),uniq=a=>[...new Set(a)];
 let randomState=33771;const rnd=()=>{randomState=(Math.imul(randomState,1664525)+1013904223)>>>0;return randomState};
 const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){let j=rnd()%(i+1);[a[i],a[j]]=[a[j],a[i]]}return a};
 const perms=[[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]],sm=(a,b)=>perms.findIndex(p=>p.every((x,i)=>x===perms[a][perms[b][i]]));
 const parity=a=>{let s=0;for(let i=0;i<3;i++)for(let j=i+1;j<3;j++)s^=+(perms[a][i]>perms[a][j]);return s};
 let fixtures=0,bases=0,skips=0,tailMembers=0,mixChecks=0,coreSearches=0,certificates=0,frozenCount=0,nonemptyFrozen=0,variableCore=0,chainWords=0,chainAssociativity=0,finiteDonorObstructions=0;
 for(const type of ["C4","C6","S3"])for(const upper of [false,true])for(const nrows of [3,4]){
  const n=type==="C4"?4:6,L=nrows,gm=type==="S3"?sm:(a,b)=>(a+b)%n,pi=type==="S3"?parity:type==="C4"?a=>a%2:a=>a%2;
  const N=range(n).filter(x=>pi(x)===0),t=N[1],P=range(L).map(l=>range(nrows).map(i=>i&&l?rnd()%n:0)),U=upper?[-1,-2]:[];
  const J=range(nrows*n*L),key=(i,g,l)=>i*n*L+g*L+l,row=x=>Math.floor(x/(n*L)),col=x=>x%L,g=x=>Math.floor(x/L)%n,h=u=>u===-1?0:type==="S3"?1:n/2;
  const mul=(a,b)=>{if(a<0&&b<0)return a===b?-1:-2;if(a<0)return key(0,gm(h(a),g(b)),col(b));if(b<0)return key(row(a),gm(g(a),h(b)),0);return key(row(a),gm(gm(g(a),P[col(a)][row(b)]),g(b)),col(b))};
  const close=X=>{const s=uniq([...U,...X]),q=[...s],words=new Map(s.map(x=>[x,[x]]));for(let i=0;i<q.length;i++)for(const a of s){let z=mul(q[i],a);if(!words.has(z)){words.set(z,[...words.get(q[i]),a]);q.push(z)}}return words};
  const full=X=>{let z=close(X);return J.every(x=>z.has(x))};
  const trim=(X,test)=>{X=[...X];for(const a of [...X]){const Y=X.filter(x=>x!==a);if(test(Y))X=Y}return X};
  const support=(targets,X)=>{let z=close(X);assert(targets.every(a=>z.has(a)),"support");return uniq(targets.flatMap(a=>z.get(a))).filter(a=>a>=0)};
  const F=N.map(v=>key(0,v,0)),phi=a=>key(row(a),gm(g(a),t),col(a));fixtures++;
  for(let trial=0;trial<16;trial++){
   const A=trim(shuffle(J),full),comp=J.filter(x=>!A.includes(x));if(!full(comp)){skips++;continue}
   const C=support(F,A),K0=uniq([...C,...A.filter(a=>!C.includes(a)&&C.includes(phi(a)))]),B0=support(uniq([...K0,...F]),comp),D=uniq([...K0,...support(B0,A)]);
   const T=A.filter(a=>!D.includes(a)),R=uniq([...B0,...D.filter(a=>!K0.includes(a)).map(phi)]);
   if(T.length>10){skips++;continue}
   assert(R.every(x=>!A.includes(x)),"R outside A");assert(T.every(a=>!A.includes(phi(a))&&!R.includes(a)&&!R.includes(phi(a))),"tail separation");
   const choice=(a,mask)=>mask&(1<<T.indexOf(a))?phi(a):a,masks=range(2**T.length),rep=mask=>T.map(a=>choice(a,mask));
   for(const mask of masks){assert(full([...R,...rep(mask)]),"mixed generation");for(const a of T)assert(!full([...R,...rep(mask).filter(x=>x!==choice(a,mask))]),"tail necessary");mixChecks++}
   function robust(allowed){
    let core=[...R],find=C=>{for(const m of allowed){coreSearches++;if(full([...C,...rep(m)]))return m}return -1};
    let initial=find(core);assert(initial>=0,"initial");
    for(const x of [...core]){const c=core.filter(y=>y!==x),w=find(c);if(w>=0){core=c;initial=w}}
    const witness=find(core);assert(witness>=0,"witness");
    const used=support(R,[...core,...rep(witness)]),frozen=T.filter(a=>used.includes(choice(a,witness)));
    for(const m of allowed.filter(m=>frozen.every(a=>choice(a,m)===choice(a,witness)))){
     const H=uniq([...core,...rep(m)]);assert(full(H)&&H.every(x=>!full(H.filter(y=>y!==x))),"robust basis");certificates++;
    }
    return {core,witness,frozen};
   }
   const z1=robust(masks),allowed=masks.filter(m=>z1.frozen.every(a=>choice(a,m)===phi(a))),z2=robust(allowed),W=uniq([...z1.frozen,...z2.frozen]);
   const m1=masks.filter(m=>z1.frozen.every(a=>choice(a,m)===choice(a,z1.witness))&&W.filter(a=>!z1.frozen.includes(a)).every(a=>choice(a,m)===phi(a)));
   const m2=allowed.filter(m=>z2.frozen.every(a=>choice(a,m)===choice(a,z2.witness)));
   for(const m of m1)for(const k of m2){const H=uniq([...z1.core,...rep(m)]),H2=uniq([...z2.core,...rep(k)]);assert(A.filter(x=>H.includes(x)&&H2.includes(x)).every(a=>T.includes(a)&&!W.includes(a)),"core intersection");}
   if(z1.core.length!==z2.core.length)variableCore++;if(W.length)nonemptyFrozen++;frozenCount+=W.length;tailMembers+=T.length;bases++;
  }
 }
 // Genuine infinite strong semilattice of rectangular groups over Z^(N).
 // element [level,row, finite-support vector, col]; maps down collapse row/col to 0.
 const v=(n,s)=>s?[[n,s]]:[],add=(...xs)=>{let m=new Map;for(const x of xs)for(const [n,s] of x)m.set(n,(m.get(n)||0)+s);return [...m].filter(z=>z[1]).sort((a,b)=>a[0]-b[0])},neg=x=>x.map(([n,s])=>[n,-s]),eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
 const mul=(a,b)=>{let l=Math.min(a[0],b[0]);return [l,a[0]===l?a[1]:0,add(a[2],b[2]),b[0]===l?b[3]:0]};
 const sgn=l=>l%2? -1:1,seed=(side,l,n)=>[l,n,v(n,sgn(l)*(side?-1:1)),n];
 const wordFor=(side,l,i,g,j)=>{
  let x=seed(side,i===0?l+1:l,i||1),y=seed(side,j===0?l+1:l,j||1),mid=seed(side,l,1);
  const target=add(g,neg(x[2]),neg(y[2]),neg(mid[2])),w=[x,mid];
  for(const [n,s] of target){let lev=l+1;if(sgn(lev)*(side?-1:1)!==Math.sign(s))lev++;for(let k=0;k<Math.abs(s);k++)w.push(seed(side,lev,n))}
  w.push(y);return w;
 };
 for(const side of [0,1])for(let l=0;l<8;l++)for(let i=0;i<5;i++)for(let j=0;j<5;j++)for(let k=1;k<=5;k++)for(const s of [-1,1]){
  const g=add(v(k,s),v(k+1,-2*s)),w=wordFor(side,l,i,g,j);
  assert(eq(w.reduce(mul),[l,i,g,j]),"chain positive word");chainWords++;
 }
 for(let k=0;k<300;k++){let a=seed(0,rnd()%7,1+rnd()%5),b=seed(0,rnd()%7,1+rnd()%5),c=seed(1,rnd()%7,1+rnd()%5);assert(eq(mul(mul(a,b),c),mul(a,mul(b,c))),"chain associative");chainAssociativity++}
 // Finite-support obstruction: select a new coordinate outside any sampled finite donor set and kernel generator t=e1.
 for(let l=0;l<12;l++)for(let k=1;k<=30;k++){let W=range(k).map(i=>seed(i%2,l+1+i%3,1+(rnd()%50))),n=1+Math.max(1,...W.flatMap(x=>x[2].map(z=>z[0])));assert(W.every(x=>!x[2].some(z=>z[0]===n))&&n!==1,"fresh direction");finiteDonorObstructions++}
 return {finite_fixtures:fixtures,relative_bases_checked:bases,skipped_fixtures_or_large_tails:skips,tail_members:tailMembers,mixed_template_checks:mixChecks,core_searches:coreSearches,robust_basis_checks:certificates,frozen_tail_members:frozenCount,bases_with_nonempty_freeze:nonemptyFrozen,examples_different_core_sizes:variableCore,infinite_chain_positive_words:chainWords,infinite_chain_associativity_samples:chainAssociativity,finite_donor_fresh_direction_checks:finiteDonorObstructions,scope:"Sampled finite Rees fixtures; actual positive words in an infinite strong semilattice of rectangular groups; no exhaustive infinite verification."};
}
console.log(JSON.stringify(experiment(), null, 2));
