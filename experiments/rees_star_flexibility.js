'use strict';
function experiment(){
 const ok=(v,m)=>{if(!v)throw Error(m)};
 const cyclic=n=>({n,mul:(a,b)=>(a+b)%n});
 const perms=[[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]];
 const S3={n:6,mul:(a,b)=>perms.findIndex(p=>p.every((v,i)=>v===perms[a][perms[b][i]]))};
 let models=0,configurations=0,deleted=0,internalChecks=0,complementChecks=0,properInternal=0,wordChecks=0,sourcePhaseModels=0;
 for(const [name,G,H,Y,D] of [["C2",cyclic(2),[0,1],[],[0]],["C3",cyclic(3),[0,1,2],[],[0]],["C4",cyclic(4),[0,2],[1],[0]],["S3",S3,[0,1],[2],[0]],["C6",cyclic(6),[0,3],[],[0,2,4]]]){
  const mul=G.mul,inv=a=>Array.from({length:G.n},(_,i)=>i).find(b=>mul(a,b)===0),t=H[1],I=2+2*H.length,L=3;
  const mon=(seeds)=>{const a=new Set([0,...seeds]),q=[...a];for(let k=0;k<q.length;k++)for(const s of seeds){const z=mul(q[k],s);if(!a.has(z)){a.add(z);q.push(z)}}return a};
  const M=mon([...H,...Y]);ok(mon([...H,...D,...Y]).size===G.n,"relative coordinates");
  for(const y of Y)ok(mon([...H,...D,...Y.filter(x=>x!==y)]).size<G.n,"tail necessity");
  for(let phase=1;phase<=2;phase++)for(let pattern=0;pattern<4;pattern++){
   // upper group D x C_phase, acting on row phases and by D coordinates
   const R=I*phase,N=R*G.n*L,upper=D.flatMap(d=>Array.from({length:phase},(_,p)=>[d,p]));
   const id=(i,g,l,p=0)=>((i*phase+p)*G.n+g)*L+l;
   const dec=x=>[Math.floor(x/(G.n*L*phase)),Math.floor(x/L)%G.n,x%L,Math.floor(x/(G.n*L))%phase];
   const P=(l,i)=>l===0||i===0?0:H[(l*i+pattern*(i+l))%H.length];
   const prod=(x,y)=>{if(x>=N&&y>=N){let [d,p]=upper[x-N],[e,q]=upper[y-N];return N+upper.findIndex(a=>a[0]===mul(d,e)&&a[1]===(p+q)%phase)}
    if(x>=N){let [d,p]=upper[x-N],[i,g,l,q]=dec(y);return id(i,mul(d,g),l,(p+q)%phase)}
    if(y>=N){let [d]=upper[y-N],[i,g,l,p]=dec(x);return id(i,mul(g,d),l,p)}
    let [i,g,l,p]=dec(x),[j,h,k]=dec(y);return id(i,mul(mul(g,P(l,j)),h),k,p);
   };
   const close=(seeds)=>{const a=new Set(seeds),q=[...a];for(let k=0;k<q.length;k++)for(const s of seeds){const z=prod(q[k],s);if(!a.has(z)){a.add(z);q.push(z)}}return a};
   const U=upper.map((_,i)=>N+i),expected=new Set();for(let i=0;i<I;i++)for(const g of M)for(let l=0;l<L;l++)expected.add(id(i,g,l));
   const blocks=1+H.length+(L-2)+Y.length,all=(1<<blocks)-1,bases=[];
   for(let mask=0;mask<=all;mask++){
    let bit=0;const choose=()=>Boolean(mask&(1<<bit++));const v=choose()?t:0;
    const c=id(0,v,1),r=id(1,mul(inv(P(1,1)),inv(v)),0);ok(prod(c,r)===id(0,0,0),"anchor word");wordChecks++;
    const B=[c,r];
    for(let j=0;j<H.length;j++){let h=H[j],ht=mul(h,t),flip=choose();B.push(id(2+2*j,flip?ht:h,0),id(3+2*j,flip?h:ht,0))}
    for(let l=2;l<L;l++)B.push(id(0,choose()?t:0,l));
    for(const y of Y)B.push(id(0,choose()?mul(y,t):y,0));
    ok(new Set(B).size===B.length,"duplicates");const internal=close(B);
    ok(internal.size===expected.size&&[...internal].every(z=>expected.has(z)),"internal closure");internalChecks++;
    if(M.size<G.n)properInternal++;
    ok(close([...B,...U]).size===N+U.length,"relative generation");
    for(const x of B){ok(close([...B.filter(z=>z!==x),...U]).size<N+U.length,"relative irredundance");deleted++}
    bases.push(B);configurations++;
   }
   for(let mask=0;mask<=all;mask++){ok(bases[mask].every(x=>!bases[all^mask].includes(x)),"complement disjoint");complementChecks++}
   models++;if(phase===2)sourcePhaseModels++;
  }
 }
 // Naive mixing of the two original stars: a column disappears.
 const old0=[[0,1,1],[1,0,0],[2,1,0]],old1=[[0,1,0],[1,0,1],[2,1,1]];
 const bad=[old1[0],...old0.slice(1)];
 ok(new Set(bad.map(x=>x[2])).size===1,"naive mix loses column");
 return {study:37,models,sourcePhaseModels,configurations,deleted,internalChecks,complementChecks,properInternal,wordChecks,naiveMixCounterexample:true,all_passed:true,scope:"Finite capacity analogues; five group/coefficient models C2,C3,C4,S3,C6, four normalized sandwich patterns, two phase sizes; all binary block configurations; no exhaustive enumeration of arbitrary semigroups or infinite cardinals."};
}
console.log(JSON.stringify(experiment(), null, 2));
