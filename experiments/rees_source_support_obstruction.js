'use strict';
function experiment(){
 const ok=(b,m)=>{if(!b)throw Error(m)};
 const cyclic=n=>({n,mul:(a,b)=>(a+b)%n});
 const perms=[[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]];
 const s3={n:6,mul:(a,b)=>perms.findIndex(p=>p.every((v,i)=>v===perms[a][perms[b][i]]))};
 let models=0,closedDonorCases=0,rectangleCases=0,properMonoidCases=0,inverseChecks=0,crossUpperProducts=0,assocTriples=0,reachCases=0,restrictedPairs=0,restrictedClosureCases=0;
 for(const [G,H] of [[cyclic(3),[0]],[cyclic(4),[0,2]],[cyclic(6),[0,3]],[s3,[0,1]]]){
  const mul=G.mul,inv=a=>Array.from({length:G.n},(_,b)=>b).find(b=>mul(a,b)===0),N=3*G.n*3;
  const id=(i,g,l)=>(i*G.n+g)*3+l,dec=x=>[Math.floor(x/(G.n*3)),Math.floor(x/3)%G.n,x%3];
  const mon=seeds=>{let a=new Set([0,...seeds]),q=[...a];for(let k=0;k<q.length;k++)for(const s of seeds){let z=mul(q[k],s);if(!a.has(z)){a.add(z);q.push(z)}}return a};
  for(let pat=0;pat<4;pat++){
   const P=(l,i)=>l===0||i===0?0:H[(l*i+pat*(l+i))%H.length];
   const jm=(a,b)=>{let [i,g,l]=dec(a),[j,h,k]=dec(b);return id(i,mul(mul(g,P(l,j)),h),k)};
   const e=id(0,0,0),A=(q,g)=>id(q+1,mul(inv(P(q+1,q+1)),g),q+1);
   const image=u=>A(Math.floor((u-N)/G.n),(u-N)%G.n);
   const prod=(a,b)=>{if(a>=N&&b>=N&&Math.floor((a-N)/G.n)===Math.floor((b-N)/G.n))return N+Math.floor((a-N)/G.n)*G.n+mul((a-N)%G.n,(b-N)%G.n);return jm(a<N?a:image(a),b<N?b:image(b))};
   const close=seeds=>{const a=new Set(seeds),q=[...a];for(let k=0;k<q.length;k++)for(const s of seeds){let z=prod(q[k],s);if(!a.has(z)){a.add(z);q.push(z)}}return a};
   const subsets=[];for(let mask=0;mask<(1<<G.n);mask++){const xs=Array.from({length:G.n},(_,i)=>i).filter(i=>mask&(1<<i));if(xs.every(x=>xs.includes(inv(x))))subsets.push(xs)}
   const X=H.map(h=>id(0,h,0)); // all rows/columns of X have unit coordinate representatives
   for(const a of subsets)for(const b of subsets){
    const W=[...a.map(g=>N+g),...b.map(g=>N+G.n+g)],V=[...close(W)].filter(x=>x<N);
    const h=u=>dec(prod(prod(e,u),e))[1],M=mon([...H,...W.map(h),...V.map(x=>dec(x)[1])]);
    for(const u of W){let ui=N+Math.floor((u-N)/G.n)*G.n+inv((u-N)%G.n),f=prod(u,ui);let q=P(dec(prod(e,u))[2],dec(prod(ui,e))[0]),hf=h(f);ok(mul(mul(q,h(ui)),inv(hf))===inv(h(u)),"positive inverse formula");ok(M.has(inv(h(u))),"inverse availability");inverseChecks++}
    for(const v of V){ok(M.has(inv(dec(v)[1])),"V coordinate unit");crossUpperProducts++}
    const rows=new Set([0,...a.length?[1]:[],...b.length?[2]:[]]),cols=new Set(rows),expected=new Set();for(const i of rows)for(const g of M)for(const l of cols)expected.add(id(i,g,l));
    const actual=[...close([...W,...X])].filter(x=>x<N);ok(actual.length===expected.size&&actual.every(x=>expected.has(x)),"rectangle");rectangleCases++;if(M.size<G.n)properMonoidCases++;
    closedDonorCases++;
   }
   if(G===s3&&pat===1){for(let a=0;a<N+2*G.n;a++)for(let b=0;b<N+2*G.n;b++)for(let c=0;c<N+2*G.n;c++){ok(prod(prod(a,b),c)===prod(a,prod(b,c)),"associativity");assocTriples++}}
   models++;
  }
 }
 // Finite truncations of the row-preservation obstruction. Top restriction is imposed artificially.
 for(let n=3;n<=7;n++)for(let layers=2;layers<=4;layers++){
  const f=i=>i===0?0:1,pts=[];for(let k=0;k<layers;k++)for(let i=1;i<n;i++)for(let l=0;l<3;l++)pts.push([k,i,l]);
  const p=(a,b)=>[Math.min(a[0],b[0]),a[0]>b[0]?f(a[1]):a[1],b[0]>a[0]?0:b[2]];
  for(const a of pts)for(const b of pts){ok(p(a,b)[1]!==0,"row invariant");restrictedPairs++}
  const seeds=[];for(let k=0;k<layers;k++)for(let i=2;i<n;i++)for(let l=1;l<3;l++)seeds.push([k,i,l]);
  const key=x=>x.join(","),seen=new Map(seeds.map(x=>[key(x),x])),q=[...seen.values()];for(let z=0;z<q.length;z++)for(const s of seeds){let x=p(q[z],s);if(!seen.has(key(x))){seen.set(key(x),x);q.push(x)}}
  ok(q.every(x=>x[1]!==0),"restricted closure");restrictedClosureCases++;for(let k=0;k<layers-1;k++){ok(seen.has(key([k,1,0])),"finite donor covers row1,col0");reachCases++}
 }
 return {study:38,models,closedDonorCases,rectangleCases,properMonoidCases,inverseChecks,crossUpperProducts,assocTriples,restrictedPairs,restrictedClosureCases,reachCases,all_passed:true,scope:"Finite Rees ideal with two incomparable upper groups mapping into distinct local cells; all inversion-closed donor subsets for C3,C4,C6,S3 and four sandwich patterns. Truncated row-map example checks the invariant only; the imposed top restriction is not the source condition of a finite chain. No exhaustive test of infinite groups."};
}
console.log(JSON.stringify(experiment(), null, 2));
