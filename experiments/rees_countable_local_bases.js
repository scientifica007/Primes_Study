'use strict';
function experiment(){
 const ok=(x,m)=>{if(!x)throw Error(m)};
 let reachModels=0,coverageChecks=0,privateChecks=0,finiteResidualChecks=0,coverConstructions=0,coverDeletionChecks=0,repairModels=0,repairMutualChecks=0,repairClosureChecks=0,repairDeletionChecks=0,coreModels=0,coreChoices=0,coreAnchorChecks=0,coreClosureChecks=0,coreDeletionChecks=0,coreComplementChecks=0,renormalizationChecks=0,freeObstructionChecks=0;
 const n=3,edges=[];for(let i=0;i<n;i++)for(let j=0;j<n;j++)if(i!==j)edges.push([i,j]);
 for(let m=0;m<1<<edges.length;m++){
  const r=Array.from({length:n},(_,i)=>1<<i);edges.forEach(([i,j],k)=>{if(m&(1<<k))r[i]|=1<<j});
  for(let k=0;k<n;k++)for(let i=0;i<n;i++)if(r[i]&(1<<k))r[i]|=r[k];
  const reach=s=>r.reduce((v,t,i)=>s&(1<<i)?v|t:v,0);
  for(let v=0;v<8;v++){
   const V=reach(v),src=[];for(let i=0;i<n;i++)if(!(V&(1<<i))&&!r.some((t,j)=>(t&(1<<i))&&!(r[i]&(1<<j))))src.push(i);
   ok(reach(V|src.reduce((s,i)=>s|(1<<i),0))===7,"finite residual empty");finiteResidualChecks++;
   for(let X=0;X<8;X++){if(reach(V|X)!==7)continue;coverageChecks++;
    for(let i=0;i<n;i++)if(X&(1<<i)){const essential=reach(V|(X^(1<<i)))!==7,only=!Array.from({length:n},(_,j)=>j).some(j=>j!==i&&(X&(1<<j))&&(r[i]&(1<<j))&&(r[j]&(1<<i)));ok(essential===(src.includes(i)&&only),"private source criterion");privateChecks++}
   }
   reachModels++;
  }
 }
 // Finite analogues of allocating independent private sources to residual positions.
 // Residual labels here are deliberately nonprivate (not finite SCC sources).
 for(let rr=0;rr<=5;rr++)for(let cc=0;cc<=5;cc++)for(let rs=0;rs<=4;rs++)for(let cs=0;cs<=4;cs++){
  if(!rs||!cs||rs<cc||cs<rr||(rs-cc)!==(cs-rr))continue;
  const pairs=[];for(let i=0;i<cc;i++)pairs.push([i,cs+i]);for(let j=0;j<rr;j++)pairs.push([rs+j,j]);for(let k=0;k<rs-cc;k++)pairs.push([cc+k,rr+k]);
  const covers=p=>new Set(p.map(x=>x[0])).size===rs+rr&&new Set(p.map(x=>x[1])).size===cs+cc;
  ok(covers(pairs),"reservoir cover");
  for(let j=0;j<pairs.length;j++){const [i,l]=pairs[j],others=pairs.filter((_,k)=>k!==j);ok((i<rs&&others.every(x=>x[0]!==i))||(l<cs&&others.every(x=>x[1]!==l)),"private side");coverDeletionChecks++}
  coverConstructions++;
 }
 // Finite models of the finite-core mutual exchange lemma. G finite here;
 // complement generation is checked explicitly, not inferred from T114.
 for(let g=3;g<=5;g++)for(let pat=0;pat<4;pat++){
  const R=5,L=2,N=R*g*L,mod=x=>(x%g+g)%g,id=(i,z,l)=>(i*g+z)*L+l,dec=x=>[Math.floor(x/(g*L)),Math.floor(x/L)%g,x%L],P=(l,i)=>l===0||i===0?0:mod(i+pat);
  const im=x=>x>=N?id(0,x-N,0):x;
  const mul=(a,b)=>{if(a>=N&&b>=N)return N+mod(a+b-2*N);const [i,z,l]=dec(im(a)),[j,w,k]=dec(im(b));return id(i,mod(z+P(l,j)+w),k)};
  const close=s=>{const c=new Set(s),q=[...c];for(let i=0;i<q.length;i++)for(const b of s){let z=mul(q[i],b);if(!c.has(z)){c.add(z);q.push(z)}}return c};
  const U=Array.from({length:g},(_,i)=>N+i),c=id(1,mod(-P(1,1)),1),A=[c,...Array.from({length:R-2},(_,i)=>id(i+2,(i+pat)%g,0))],B0=[id(1,mod(1-P(1,1)),1)],B=[...B0,...A.slice(1).map(a=>mul(a,N+1))];
  ok(close([...U,...A]).size===N+g&&close([...U,...B]).size===N+g,"relative bases");repairClosureChecks+=2;
  ok(B.every(b=>!A.includes(b))&&close([...U,...B0]).has(c),"finite core replacement");
  for(let i=1;i<A.length;i++){const a=A[i],b=B[i];ok(close([...U,c,a]).has(b)&&close([...U,c,b]).has(a),"mutual singleton closure");repairMutualChecks+=2}
  for(const X of [A,B])for(const a of X){ok(!close([...U,...X.filter(b=>b!==a)]).has(a),"irredundance");repairDeletionChecks++}
  repairModels++;
 }
 // Countable-core construction in finite approximations, with H=C3 and
 // independent C2 coordinates for the group-essential tail.
 for(let k=2;k<=4;k++)for(let pat=0;pat<3;pat++){
  const R=6+k,L=2+k,G=3*(1<<k),N=R*G*L,add=(a,b)=>(a%3+b%3)%3+3*((Math.floor(a/3))^(Math.floor(b/3))),neg=a=>(3-a%3)%3+3*Math.floor(a/3),id=(i,z,l)=>(i*G+z)*L+l,dec=x=>[Math.floor(x/(G*L)),Math.floor(x/L)%G,x%L];
  const P=(l,i)=>l===0&&i>0&&i<6?(i+pat)%3:0;
  const row=(u,i)=>i<6?i:6+Math.min(u,i-6),col=(u,l)=>l<2?l:2+Math.min(u,l-2);
  const mul=(a,b)=>{if(a>=N&&b>=N)return Math.min(a,b);if(a>=N){const [i,z,l]=dec(b);return id(row(a-N,i),z,l)}if(b>=N){const [i,z,l]=dec(a);return id(i,z,col(b-N,l))}const [i,z,l]=dec(a),[j,w,m]=dec(b);return id(i,add(add(z,P(l,j)),w),m)};
  const close=s=>{const c=new Set(s),q=[...c];for(let i=0;i<q.length;i++)for(const b of s){let z=mul(q[i],b);if(!c.has(z)){c.add(z);q.push(z)}}return c};
  const U=Array.from({length:k},(_,i)=>N+i),B=mask=>{
   const v=mask&1?1:0,C=[id(0,v,0),id(1,neg(add(v,P(0,1))),1)];
   for(let j=0;j<2;j++){const h=j+1,w=add(h,1),bit=(mask>>(j+1))&1;C.push(id(2+2*j,bit?w:h,1),id(3+2*j,bit?h:w,1))}
   for(let j=0;j<k;j++)C.push(id(6+j,3*(1<<j)+((mask>>(j+3))&1),2+j));
   return C;
  };
  const all=(1<<(k+3))-1;
  for(let m=0;m<=all;m++){let X=B(m);ok(mul(X[0],X[1])===id(0,0,1),"anchor pair");coreAnchorChecks++;const cl=close([...U,...X]);ok(cl.size===N+k,"full relative closure");coreClosureChecks++;
   ok(X.every(x=>!B(all^m).includes(x)),"complement");coreComplementChecks++;
   for(const x of X){ok(!close([...U,...X.filter(b=>b!==x)]).has(x),"structural/group necessity");coreDeletionChecks++}
   coreChoices++;
  }coreModels++;
 }
 // Noncommutative renormalization identities in S3.
 const ps=[[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]],mul=(a,b)=>ps.findIndex(p=>p.every((v,i)=>v===ps[a][ps[b][i]])),inv=a=>ps.findIndex((_,b)=>mul(a,b)===0);
 for(let t=0;t<6;t++)for(let i=0;i<3;i++)for(let l=0;l<3;l++){
  const p=(l,i)=>(l*2+i*3+t*(l+i+1))%6,A=l=>inv(p(l,i)),B=j=>mul(inv(p(l,j)),p(l,i)),P=(m,j)=>mul(mul(A(m),p(m,j)),B(j)),f=(j,g,m)=>mul(mul(inv(B(j)),g),inv(A(m)));
  for(let j=0;j<3;j++)for(let m=0;m<3;m++){ok(P(m,i)===0&&P(l,j)===0,"normalization");for(let a=0;a<6;a++)for(let b=0;b<6;b++){ok(f(j,mul(mul(a,p(m,i)),b),l)===mul(mul(f(j,a,m),P(m,i)),f(i,b,l)),"coordinate change");renormalizationChecks++}}
 }
 // Free-word exponent witness: if target has unique high row and col, a changed
 // representative must use a twice, whereas a recovered target has exponent one.
 for(let len=1;len<=12;len++)for(let mask=0;mask<1<<len;mask++){
  const occurrences=Array.from({length:len},(_,i)=>(mask>>i)&1);
  if(occurrences[0]!==1||occurrences[len-1]!==1)continue;
  const exp=occurrences.reduce((a,b)=>a+b,0);ok(len===1?exp===1:exp>=2,"positive exponent obstruction");freeObstructionChecks++;
 }
 return {study:46,reachModels,coverageChecks,privateChecks,finiteResidualChecks,coverConstructions,coverDeletionChecks,repairModels,repairMutualChecks,repairClosureChecks,repairDeletionChecks,coreModels,coreChoices,coreAnchorChecks,coreClosureChecks,coreDeletionChecks,coreComplementChecks,renormalizationChecks,freeObstructionChecks,all_passed:true,scope:"Exhaustive reachability on 3 labeled vertices, finite private-reservoir allocations, explicit finite-core repairs in cyclic groups, relative Rees models with min actions and group-essential tail, noncommutative S3 normalization identities, bounded occurrence counts. Infinite source-residual classification and free-group example are analytic; finite graphs have no residual outside V/source reach."};
}
console.log(JSON.stringify(experiment(), null, 2));
