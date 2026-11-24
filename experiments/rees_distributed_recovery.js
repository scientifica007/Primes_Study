'use strict';
function experiment(){
 const ok=(x,m)=>{if(!x)throw Error(m)};
 const cyclic=n=>({n,mul:(a,b)=>(a+b)%n});
 const perms=[[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]];
 const S3={n:6,mul:(a,b)=>perms.findIndex(p=>p.every((v,i)=>v===perms[a][perms[b][i]]))};
 const xor={n:8,mul:(a,b)=>a^b};
 let models=0,choices=0,deleteChecks=0,disjointChecks=0,donorRecoveries=0,coreRecoveries=0,donorSubsetChecks=0,freeWordChecks=0;
 for(const [G,H,Y] of [[cyclic(4),[0,2],[1]],[S3,[0,1],[2]],[xor,[0,1],[2,4]]]){
  const mul=G.mul,inv=a=>Array.from({length:G.n},(_,i)=>i).find(i=>mul(a,i)===0),t=H[1],I=2+2*H.length,L=3,R=I+Y.length,C=L+Y.length,N=R*G.n*C;
  for(let pat=0;pat<4;pat++){
   const P=(l,i)=>l===0||i===0||l>=L||i>=I?0:H[(l*i+pat*(i+l))%H.length];
   const id=(i,g,l)=>(i*G.n+g)*C+l,dec=x=>[Math.floor(x/(G.n*C)),Math.floor(x/C)%G.n,x%C];
   const image=u=>id(I+u-N,0,L+u-N);
   const prod=(a,b)=>{if(a===b&&a>=N)return a;const [i,g,l]=dec(a>=N?image(a):a),[j,h,k]=dec(b>=N?image(b):b);return id(i,mul(mul(g,P(l,j)),h),k)};
   const close=seeds=>{const a=new Set(seeds),q=[...a];for(let k=0;k<q.length;k++)for(const s of seeds){let z=prod(q[k],s);if(!a.has(z)){a.add(z);q.push(z)}}return a};
   const U=Y.map((_,j)=>N+j);
   const core=mask=>{
    const v=mask&1?t:0,B=[id(0,v,1),id(1,mul(inv(P(1,1)),inv(v)),0)];let bit=1;
    for(let j=0;j<H.length;j++){let h=H[j],ht=mul(h,t),f=mask&(1<<bit++);B.push(id(2+2*j,f?ht:h,0),id(3+2*j,f?h:ht,0))}
    B.push(id(0,mask&(1<<bit)?t:0,2));return B;
   };
   const oldCore=core(0),oldTail=Y.map((y,j)=>id(I+j,y,L+j)),all=(1<<(H.length+2))-1;
   for(let cm=0;cm<=all;cm++)for(let ym=0;ym<(1<<Y.length);ym++){
    const B=[...core(cm),...Y.map((y,j)=>id(I+j,ym&(1<<j)?mul(y,t):y,L+j))];
    const Bc=[...core(all^cm),...Y.map((y,j)=>id(I+j,ym&(1<<j)?y:mul(y,t),L+j))];
    ok(B.every(x=>!Bc.includes(x)),"complement");disjointChecks++;
    const cl=close([...B,...U]);ok(cl.size===N+U.length,"relative full");
    for(const x of B){ok(close([...B.filter(y=>y!==x),...U]).size<cl.size,"necessity");deleteChecks++}
    const intern=close(B);for(const c of oldCore){ok(intern.has(c),"core recover");coreRecoveries++}
    for(let j=0;j<Y.length;j++){ok(close([...B,U[j]]).has(oldTail[j]),"individual donor");donorRecoveries++}
    choices++;
   }
   for(let m=0;m<(1<<U.length);m++){
    const W=U.filter((_,j)=>m&(1<<j)),sources=Array.from({length:I},(_,i)=>id(i,0,0)).concat(Array.from({length:L},(_,l)=>id(0,0,l)));
    const cl=close([...W,...sources]);
    for(let j=0;j<Y.length;j++){ok(cl.has(id(I+j,0,L+j))===Boolean(m&(1<<j)),"coverage");donorSubsetChecks++}
   }
   models++;
  }
 }
 // Actual free-word computations for positive recovery with one donor.
 const reduce=w=>{const s=[];for(const x of w){if(s.length&&s[s.length-1]===-x)s.pop();else s.push(x)}return s};
 const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
 const p=(a,b)=>[a[0],reduce([...a[1],...b[1]]),b[2]]; // all used cross coefficients are 1
 const e=[0,[],0],tInv=[0,[-1],0];
 for(let n=1;n<=100;n++){
  const y=n+2,b=[n,[y,1],n],u=[n,[],n],a=[n,[y],n];
  const k=p(p(p(e,b),e),tInv);
  ok(eq(k,[0,[y],0]),"free word anchor");freeWordChecks++;
  ok(eq(p(p(u,k),u),a),"free word transported");freeWordChecks++;
 }
 return {study:39,models,choices,deleteChecks,disjointChecks,donorRecoveries,coreRecoveries,donorSubsetChecks,freeWordChecks,all_passed:true,scope:"Finite Rees models C4,S3,C2^3; all core and tail bit choices; distinct external idempotent donors; bounded exact reduced-free-word recovery on normalized cells. The exponent obstruction is proved analytically, not by enumerating infinite words."};
}
console.log(JSON.stringify(experiment(), null, 2));
