// Exact BigInt checks of the small equal-cardinality multiset uniqueness lemma.
function momentAudit(){
 const results=[];
 for(let L of [0,1,2,4,6,8]){
  const J=Array.from({length:L},(_,i)=>i+1).filter(j=>j===1||j%2===0),d=1+J.length;
  let total=0, collision=null;
  for(let k=1;k<=d+1;k++){
   const seen=new Map();let count=0;
   function visit(A,min,P,mom){
    if(A.length===k){
     let key=[P,...mom].map(String).join(","),old=seen.get(key);count++;
     if(old&&old.join(",")!==A.join(",")){
      if(k<=d)throw Error("small multiset collision");
      if(!collision)collision=[old,A.slice()];
     }else seen.set(key,A.slice());
     return;
    }
    for(let v=min;v<=12;v++)visit([...A,v],v,P*BigInt(v),mom.map((x,i)=>x+BigInt(v)**BigInt(J[i])));
   }
   visit([],1,1n,J.map(()=>0n));if(k<=d)total+=count;
  }
  results.push({L,d,verifiedMultisets:total,firstCollisionAt_d_plus_1_with_sizes_at_most_12:collision});
 }
 return results;
}
console.log(JSON.stringify(momentAudit(),null,2));
