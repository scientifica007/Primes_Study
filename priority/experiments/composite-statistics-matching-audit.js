// Exact finite checks of arithmetic identities and abstract weighted matching certificates.
function audit(){
 const ok=(x,m)=>{if(!x)throw Error(m)},omega=n=>{let k=0;for(let p=2;p*p<=n;p++)while(n%p===0){k++;n/=p;}return k+(n>1?1:0)},sum=a=>a.reduce((s,x)=>s+x,0),range=n=>Array.from({length:n},(_,i)=>i);
 // Check integer size signatures; distinguish labelled classes of equal size.
 const sizes=[1,1,2,2,3,4,6,8,9,12,16,18],indices=range(sizes.length),weights=sizes.map(s=>Math.max(0,omega(s)-1)),total=sum(weights),groups=new Map();let identities=0,zeroTests=0,collisionGroups=0;
 for(let mask=0;mask<2**sizes.length;mask++){
  let Z=indices.filter(i=>mask>>i&1),b=Z.length,P=Z.reduce((p,i)=>p*BigInt(sizes[i]),1n),O=sum(Z.map(i=>omega(sizes[i]))),m1=Z.filter(i=>sizes[i]===1).length,W=sum(Z.map(i=>weights[i])),H=total+b-O,present=total-W;
  ok(m1===b-O+W&&m1===H-present&&present<=H,"identity");identities++;
  if(H===0){ok(m1===0,"zero target");zeroTests++;}
  let key=b+":"+P;if(!groups.has(key))groups.set(key,new Set());groups.get(key).add(m1===0);
 }
 for(let s of groups.values())if(s.size>1)collisionGroups++;
 // Finite exact maximum weight matching, only abstract representative support systems.
 function maxMatch(B,unseen,w){let best=0;function rec(i,seen,s){if(i===B.length){best=Math.max(best,s);return;}rec(i+1,seen,s);for(let k of B[i])if(unseen.has(k)&&!seen.has(k)){seen.add(k);rec(i+1,seen,s+w[k]);seen.delete(k);}}rec(0,new Set(),0);return best;}
 let systems=0,arrays=0,transcripts=0,emptyCert=0,nonemptyCert=0,multiWeightCerts=0;
 function verify(sizes,B){
  systems++;const I=range(sizes.length),w=sizes.map(s=>Math.max(0,omega(s)-1)),total=sum(w);let inputs=[];
  function rec(arr){if(arr.length===B.length){let present=new Set(arr.filter(i=>i>=0)),Z=I.filter(i=>!present.has(i)),b=Z.length,P=Z.reduce((p,i)=>p*BigInt(sizes[i]),1n),O=sum(Z.map(i=>omega(sizes[i])));inputs.push({arr,present,H:total+b-O,key:b+":"+P,empty:Z.every(i=>sizes[i]!==1)});return;}for(let k of [-1,...B[arr.length]])rec([...arr,k]);}
  rec([]);arrays+=inputs.length;
  let grouped=new Map();for(let input of inputs){if(!grouped.has(input.key))grouped.set(input.key,[]);grouped.get(input.key).push(input);}
  for(let group of grouped.values()){
   if(!group.some(i=>i.empty)||!group.some(i=>!i.empty))continue;
   const H=group[0].H;ok(group.every(i=>i.H===H),"signature target");
   for(let mask=0;mask<2**B.length;mask++){
    let remaining=range(B.length).filter(i=>!(mask>>i&1)),blocks=new Map();
    for(let input of group){let obs=input.arr.filter((_,i)=>mask>>i&1),key=obs.join();if(!blocks.has(key))blocks.set(key,{obs,outcomes:new Set()});blocks.get(key).outcomes.add(input.empty);}
    for(let {obs,outcomes} of blocks.values()){let seen=new Set(obs.filter(i=>i>=0)),score=sum([...seen].map(i=>w[i])),unseen=new Set(I.filter(i=>w[i]>0&&!seen.has(i))),upper=maxMatch(remaining.map(i=>B[i]),unseen,w);transcripts++;
     if(score===H){ok(outcomes.size===1&&outcomes.has(true),"false empty");emptyCert++;if(w.filter(x=>x>0).length>1)multiWeightCerts++;}
     if(score+upper<H){ok(outcomes.size===1&&outcomes.has(false),"false nonempty");nonemptyCert++;if(w.filter(x=>x>0).length>1)multiWeightCerts++;}
    }
   }
  }
 }
 // Exhaust all 15^3 nonempty support systems, then a deterministic larger sample.
 for(let code=0;code<15**3;code++){let v=code,B=[];for(let i=0;i<3;i++){let mask=v%15+1;v=Math.floor(v/15);B.push(range(4).filter(j=>mask>>j&1));}verify([1,2,2,4],B);}
 let seed=1234567;for(let k=0;k<128;k++){let B=[];for(let i=0;i<4;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;let mask=1+seed%63;B.push(range(6).filter(j=>mask>>j&1));}verify([1,2,2,4,8,16],B);}
 verify([1,2,2,4,8,16],Array.from({length:4},()=>range(6)));
 return {identities,signatureGroups:groups.size,collisionGroups,zeroTests,supportSystems:systems,arrays,transcripts,emptyCert,nonemptyCert,multiWeightCerts};
}
console.log(JSON.stringify(audit(),null,2));
