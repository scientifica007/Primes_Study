'use strict';
function experiment(){
 const ok=(x,m)=>{if(!x)throw Error(m)},perms=[[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]];
 const mul=(a,b)=>perms.findIndex(p=>p.every((v,i)=>v===perms[a][perms[b][i]])),inv=a=>perms.findIndex((_,b)=>mul(a,b)===0);
 let graphModels=0,assignments=0,solutions=0,wordChecks=0,componentCountChecks=0,partitions=0,balancedSelections=0,rankChecks=0,finiteSupportChecks=0;
 const wordsList=[[[0,1,2],[0,2,1]],[[0,1,0,1],[0,2,1]],[[0,1,2,0,1],[2,0,2]],[[0,1],[1,2],[2,0]],[[0,1,2],[0,2,2],[0,1,1]]];
 for(let pat=0;pat<5;pat++)for(const words of wordsList){
  const P=(a,b)=>(a*2+b*3+pat*(a+b+1))%6,z=[2,4,5],adj=Array.from({length:6},()=>[]),pins=new Set();
  for(const w of words){pins.add(2*w[0]);pins.add(2*w.at(-1)+1);for(let j=0;j<w.length-1;j++){let a=w[j],b=w[j+1],p=P(a,b);adj[2*a+1].push([2*b,p]);adj[2*b].push([2*a+1,inv(p)])}}
  const transport=(x,p)=>mul(mul(inv(p),x),p);
  const seen=new Set();let predicted=1;
  for(let root=0;root<6;root++)if(!seen.has(root)){
    let count=0;for(let v=0;v<6;v++){let vals=new Map([[root,v]]),q=[root],valid=true;for(let j=0;j<q.length;j++){let a=q[j];if(pins.has(a)&&vals.get(a)!==0)valid=false;for(const [b,p] of adj[a]){let t=transport(vals.get(a),p);if(vals.has(b)){if(vals.get(b)!==t)valid=false}else{vals.set(b,t);q.push(b)}}}if(valid)count++;for(const a of q)seen.add(a)}predicted*=count;
  }
  let count=0;
  const product=(w,v)=>w.reduce((g,a,i)=>i?mul(mul(g,P(w[i-1],a)),v[a]):v[a],0);
  for(let code=0;code<6**6;code++){let x=code,vals=Array.from({length:6},()=>{let v=x%6;x=Math.floor(x/6);return v});assignments++;
   if([...pins].some(a=>vals[a]!==0)||adj.some((ls,a)=>ls.some(([b,p])=>transport(vals[a],p)!==vals[b])))continue;
   count++;solutions++;const zz=z.map((v,a)=>mul(mul(inv(vals[2*a]),v),vals[2*a+1]));
   for(const w of words){ok(product(w,z)===product(w,zz),"word invariant");wordChecks++}
  }
  ok(count===predicted,"root transport count");componentCountChecks++;graphModels++;
 }
 // All partitions of a, b_j,c_j for n=2..4. Enumerate bounded selections
 // of nonsingleton blocks, checking the rank obstruction in quotient.
 function* parts(n,blocks=[],i=0){if(i===n){yield blocks.map(b=>[...b]);return}for(const b of blocks){b.push(i);yield* parts(n,blocks,i+1);b.pop()}blocks.push([i]);yield* parts(n,blocks,i+1);blocks.pop()}
 for(let n=2;n<=4;n++)for(const partition of parts(1+2*n)){
  partitions++;let b0=partition.find(b=>b.includes(0)),pivot=b0.length===1?-1:Math.floor((b0.find(v=>v!==0)-1)/2),B=partition.filter(b=>b.length>=2);
  const limit=3**B.length;
  for(let mask=1;mask<limit;mask++){
   let x=mask,cnt=Array(1+2*n).fill(0);for(const block of B){let m=x%3;x=Math.floor(x/3);for(const a of block)cnt[a]+=m}
   let pos=cnt[0],neg=0,balanced=true;for(let j=0;j<n;j++){let b=cnt[1+2*j],c=cnt[2+2*j];neg+=c;if(b!==c)balanced=false}
   if(!balanced||pos!==neg)continue;
   balancedSelections++;
   for(let j=0;j<n;j++)if(j!==pivot){ok(cnt[2+2*j]===0,"only pivot h");rankChecks++}
  }
 }
 // Finite support obstruction for common pivot, exact integer equations.
 for(let n=2;n<=8;n++)for(let da=-3;da<=3;da++)for(let s=0;s<n;s++){
  // one untouched pair (outside support); preservation there forces da=0.
  let db=Array(n).fill(0),dc=Array(n).fill(0);
  for(let j=0;j<n;j++)if(j!==s){db[j]=j+1;dc[j]=-da-db[j]}
  const preserved=db.every((v,j)=>da+v+dc[j]===0);
  ok(preserved===(da===0),"untouched pair forces pivot");finiteSupportChecks++;
 }
 return {study:43,graphModels,assignments,solutions,wordChecks,componentCountChecks,partitions,balancedSelections,rankChecks,finiteSupportChecks,all_passed:true,scope:"Exhaustive S3 port assignments for 25 labeled word systems (including repeated letters); exact enumeration of partitions of 5,7,9 generators with block multiplicities 0..2; finite integer checks of the untouched-pair obstruction. Infinite proofs are analytical. No exhaustive general semigroup claim."};
}
console.log(JSON.stringify(experiment(), null, 2));
