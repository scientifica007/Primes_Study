'use strict';
function experiment(){
 const ok=(v,m)=>{if(!v)throw Error(m)};
 // C2 * Z: "a" is an involution; integers are nonzero powers of b.
 const red=w=>{const s=[];for(const x of w){if(x==="a"){if(s.at(-1)==="a")s.pop();else s.push(x)}else if(x!==0){if(typeof s.at(-1)==="number"){let y=s.pop()+x;if(y)s.push(y)}else s.push(x)}}return s};
 const id=(i,g,l)=>({i,g,l}),mul=(a,b)=>id(a.i,red([...a.g,...b.g]),b.l),key=x=>JSON.stringify(x),eq=(a,b)=>key(a)===key(b);
 const p=id(1,[1],0),q=id(0,[-1],1),a=id(0,["a"],0),e=id(0,[],0),alt=id(0,["a",1],0);
 const product=xs=>xs.reduce(mul);
 let freeWordChecks=0,intersectionChecks=0,freeRecoveryChecks=0;
 const closureWords=(seeds,depth)=>{let level=seeds.slice(),s=new Map(level.map(x=>[key(x),x]));for(let k=1;k<depth;k++){level=level.flatMap(x=>seeds.map(y=>mul(x,y)));for(const x of level)s.set(key(x),x)}return [...s.values()]};
 const Cp=closureWords([q,a],9),Cq=closureWords([p,a],9);
 for(const x of Cp){ok(x.i===0&&x.g.every(t=>t==="a"||t<0),"negative normal forms");freeWordChecks++}
 for(const x of Cq){ok(x.l===0&&x.g.every(t=>t==="a"||t>0),"positive normal forms");freeWordChecks++}
 const qs=new Set(Cq.map(key)),common=Cp.filter(x=>qs.has(key(x)));ok(common.length===2&&common.some(x=>eq(x,a))&&common.some(x=>eq(x,e)),"intersection prefix");intersectionChecks+=common.length;
 const witnesses=[[ [q,p],e ],[[e,p,e],id(0,[1],0)],[[e,q,e],id(0,[-1],0)],[[alt,e,q,e],a],[[a,e,p,e],alt]];
 for(const [xs,t] of witnesses){ok(eq(product(xs),t),"free recovery");freeRecoveryChecks++}
 // Local group identities with arbitrary sandwich entries, over S3 x Z.
 const ps=[[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]];
 const sm=(a,b)=>ps.findIndex(p=>p.every((v,i)=>v===ps[a][ps[b][i]])),si=a=>ps.findIndex((_,b)=>sm(a,b)===0);
 const gm=(a,b)=>[sm(a[0],b[0]),a[1]+b[1]],gi=a=>[si(a[0]),-a[1]];
 const mat=(l,i)=>[(l*2+i*3)%6,l-i],rm=(a,b)=>id(a.i,gm(gm(a.g,mat(a.l,b.i)),b.g),b.l);
 let reservoirCases=0,reservoirIdentityChecks=0,reservoirInjectionChecks=0,reservoirAvoidanceChecks=0,nonzeroPowerChecks=0,complementChecks=0;
 for(let i=0;i<3;i++)for(let l=0;l<3;l++)for(let j=0;j<3;j++)for(let h=0;h<6;h++){
  const x=id(i,[h,2-i+l],l),P=mat(l,j),E=id(j,gi(P),l),leftSet=new Set(),rightSet=new Set();
  for(let t=-5;t<=5;t++){
   const z=[(t+60)%6,t],b=id(j,gm(gi(P),z),l),c=id(j,gm(gi(P),gi(z)),l);
   ok(eq(rm(b,c),E)&&eq(rm(c,b),E)&&eq(rm(rm(x,b),c),x),"same-column factorization");reservoirIdentityChecks+=3;
   const b1=rm(x,b);leftSet.add(key(b1));rightSet.add(key(c));
  }
  ok(leftSet.size===11&&rightSet.size===11,"injective parameterizations");reservoirInjectionChecks+=2;
  const F=new Set([...leftSet].slice(0,5));let valid=0;
  for(let t=-5;t<=5;t++){const z=[(t+60)%6,t],b=id(j,gm(gi(P),z),l),c=id(j,gm(gi(P),gi(z)),l);if(!F.has(key(rm(x,b)))&&!F.has(key(c)))valid++}
  ok(valid>=1,"finite forbidden set");reservoirAvoidanceChecks++;reservoirCases++;
 }
 // Finite-by-Z obstruction: exact positive word from each nonzero direction.
 const mult=(x,y)=>id(x.i,gm(x.g,y.g),y.l);
 const power=(x,n)=>{let y=x;for(let i=1;i<n;i++)y=mult(y,x);return y};
 const plus=id(0,[0,1],0),minus=id(0,[0,-1],0);
 for(let h=0;h<6;h++)for(let k=-12;k<=12;k++)if(k!==0)for(let i=0;i<2;i++)for(let l=0;l<2;l++){
  let d=1,z=h;while(z!==0){z=sm(z,h);d++}
  const m=Math.max(1,Math.ceil(3/(d*Math.abs(k)))),n=d*m,L=n*Math.abs(k),x=id(i,[h,k],l),opp=k>0?minus:plus,t=k>0?plus:minus;
  const word=mult(mult(opp,power(x,n)),power(opp,L-2));
  ok(eq(word,t),"positive protected-sign obstruction");nonzeroPowerChecks++;
 }
 for(let h=0;h<6;h++)for(let k=-9;k<=9;k++)for(let i=0;i<2;i++)for(let l=0;l<2;l++){let x=id(i,[h,k],l),N=20;let y=id(i,[h,N],0),z=id(0,[0,k-N],l);ok(y.g[1]!==0&&z.g[1]!==0&&eq(mult(y,z),x),"complement generates");complementChecks++}
 // Finite algebraic closure of F2^3 (zero is in the closure of the empty set).
 const el=Array.from({length:8},(_,i)=>i),cl=X=>{let s=new Set([0]);for(const x of X)for(const y of [...s])s.add(x^y);return s},sets=Array.from({length:256},(_,m)=>el.filter(i=>m>>i&1)),bases=sets.filter(X=>cl(X).size===8&&X.every(x=>!cl(X.filter(y=>y!==x)).has(x)));
 let flexibleCases=0,flexibleChecks=0,strictFailures=0;
 const contains=(S,X)=>X.every(x=>S.has(x));
 for(const B of bases)for(const B2 of bases){
  const common=B.filter(x=>B2.includes(x));
  for(let m=0;m<1<<common.length;m++){
   const K=common.filter((_,i)=>m>>i&1),F=B.filter(x=>!B2.includes(x)),Qs=K.map(p=>cl(B2.filter(x=>x!==p))),Cs=K.map(p=>cl(B.filter(x=>x!==p)));
   const X=[...K,...el.filter(x=>!F.includes(x)&&Qs.every(Q=>Q.has(x)))];
   ok(contains(new Set(X),B2)&&cl(X).size===8,"flexible certificate");
   let C=[...new Set([...B.filter(x=>!F.includes(x)&&(K.includes(x)||Qs.every(Q=>Q.has(x)))),...X])];
   for(const x of C.slice())if(!K.includes(x)&&cl(C.filter(y=>y!==x)).size===8)C=C.filter(y=>y!==x);
   ok(cl(C).size===8&&K.every(x=>C.includes(x))&&C.every(x=>!F.includes(x))&&C.every(x=>!cl(C.filter(y=>y!==x)).has(x)),"flexible repair");
   const X0=[...K,...el.filter(x=>!F.includes(x)&&Cs.every(Q=>Q.has(x)))];if(cl(X0).size!==8)strictFailures++;
   flexibleCases++;flexibleChecks+=C.length;
  }
 }
 return {study:53,freeWordChecks,intersectionChecks,freeRecoveryChecks,reservoirCases,reservoirIdentityChecks,reservoirInjectionChecks,reservoirAvoidanceChecks,nonzeroPowerChecks,complementChecks,flexibleCases,flexibleChecks,strictFailures,all_passed:true,scope:"Bounded exact free-product normal forms; exact noncommutative Rees local-group identities over S3 x Z; positive words forcing redundancy of protected signs and factorization avoiding a finite set; exhaustive finite F2^3 algebraic-closure flexible repair examples. Infinite claims proved analytically, not by truncation."};
}
console.log(JSON.stringify(experiment(), null, 2));
