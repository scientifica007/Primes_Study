'use strict';
function experiment(){
const ok=(x,m)=>{if(!x)throw Error(m)},cyclic=n=>({n,mul:(a,b)=>(a+b)%n}),ps=[[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]],S3={n:6,mul:(a,b)=>ps.findIndex(q=>q.every((v,i)=>v===ps[a][ps[b][i]]))},xor={n:8,mul:(a,b)=>a^b};
let models=0,choices=0,deletions=0,complements=0,anchorChecks=0,sharedSourceRecoveries=0,tailRecoveries=0,properInternal=0,freeWordChecks=0;
for(const [G,H,Y,D] of [[cyclic(4),[0,2],[1],[0]],[S3,[0,1],[2],[0]],[xor,[0,1],[2,4],[0]],[xor,[0,1],[2],[0,4]]]){
 const mul=G.mul,inv=a=>Array.from({length:G.n},(_,b)=>b).find(b=>mul(a,b)===0),t=H[1],r=2+2*H.length;
 for(const extra of [0,2])for(let pat=0;pat<3;pat++){
 const R=r+Y.length+1,L=1+extra+Y.length+1,N=R*G.n*L;
 const id=(i,g,l)=>(i*G.n+g)*L+l,dec=x=>[Math.floor(x/(G.n*L)),Math.floor(x/L)%G.n,x%L];
 const P=(l,i)=>l===0||i===0||l===L-1||i===R-1?0:H[(l*i+pat*(i+l))%H.length];
 const im=u=>id(R-1,D[u-N],L-1);
 const prod=(a,b)=>{if(a>=N&&b>=N)return N+D.indexOf(mul(D[a-N],D[b-N]));const [i,g,l]=dec(a>=N?im(a):a),[j,h,k]=dec(b>=N?im(b):b);return id(i,mul(mul(g,P(l,j)),h),k)};
 const close=seeds=>{const s=new Set(seeds),q=[...s];for(let k=0;k<q.length;k++)for(const b of seeds){const z=prod(q[k],b);if(!s.has(z)){s.add(z);q.push(z)}}return s};
 const mon=seeds=>{const s=new Set([0,...seeds]),q=[...s];for(let k=0;k<q.length;k++)for(const b of seeds){const z=mul(q[k],b);if(!s.has(z)){s.add(z);q.push(z)}}return s};
 const U=D.map((_,i)=>N+i),M=mon([...H,...Y]);ok(mon([...H,...Y,...D]).size===G.n,"group");
 const Q=mask=>{let b=[],bit=0;const flip=()=>Boolean(mask&(1<<bit++));
 if(extra){let v=flip()?t:0;b.push(id(0,v,1),id(1,mul(inv(P(1,1)),inv(v)),0))}
 else {let f=flip();b.push(id(0,f?t:0,0),id(1,f?0:t,0))}
 for(let j=0;j<H.length;j++){let h=H[j],ht=mul(h,t),f=flip();b.push(id(2+2*j,f?ht:h,0),id(3+2*j,f?h:ht,0))}
 if(extra)b.push(id(0,flip()?t:0,2));return b};
 const qmax=(1<<(1+H.length+(extra?1:0)))-1,ymax=(1<<Y.length)-1;
 const tail=mask=>Y.map((y,j)=>id(r+j,mask&(1<<j)?mul(y,t):y,extra+1+j));
 for(let q=0;q<=qmax;q++)for(let y=0;y<=ymax;y++){
 const B=[...Q(q),...tail(y)],other=[...Q(qmax^q),...tail(ymax^y)];
 ok(B.every(a=>!other.includes(a)),"complements");complements++;
 const cq=close(Q(q));ok(cq.has(id(0,0,0)),"anchor");anchorChecks++;
 ok(cq.size===r*H.length*(1+extra),"core rectangle");
 const full=close([...B,...U]);ok(full.size===N+D.length,"relative generation");
 for(const a of B){ok(close([...B.filter(b=>a!==b),...U]).size<full.size,"irredundance");deletions++}
 const inside=close(B);for(let j=0;j<Y.length;j++){for(const h of H){ok(inside.has(id(r+j,h,extra+1+j)),"unit tail supplies source");sharedSourceRecoveries++}
 const a=tail(0)[j],b=tail(y)[j],z=dec(b)[1],k=mul(mul(inv(z),Y[j]),inv(z));
 ok(full.has(id(0,k,0))&&prod(prod(b,id(0,k,0)),b)===a,"tail recovery");tailRecoveries++}
 if(M.size<G.n)properInternal++;
 choices++;
 }
 models++;
 }
}
const red=w=>{const s=[];for(const x of w){if(s.length&&s[s.length-1]===-x)s.pop();else s.push(x)}return s},eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
for(let n=3;n<=102;n++){
 const y=n,t=1,d=2,b=[y,t],yi=red([-y,d,-d]),bi=red([-t,...yi]),k=red([...bi,y,...bi]);
 ok(eq(yi,[-y]),"positive inverse from tail and donor");freeWordChecks++;
 ok(eq(red([...b,...k,...b]),[y]),"two-sided recovery");freeWordChecks++;
}
return {study:40,models,choices,deletions,complements,anchorChecks,sharedSourceRecoveries,tailRecoveries,properInternal,freeWordChecks,all_passed:true,scope:"Finite capacity analogues C4,S3,C2^3, with and without extra missing column sources, three normalized sandwich patterns, and a proper internal monoid case; exact free-word computations for donor-assisted inverse recovery. No exhaustive enumeration of infinite semigroups."}
}
console.log(JSON.stringify(experiment(), null, 2));
