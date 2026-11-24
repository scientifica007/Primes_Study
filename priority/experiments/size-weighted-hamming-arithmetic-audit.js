// Exhaustive integer multiset search under a finite cost cap; necessary arithmetic constraints only.
function audit(){
 const range=n=>Array.from({length:n},(_,i)=>i),assert=(b,m)=>{if(!b)throw Error(m)};
 const result=[];
 // Bounded cost implies bounded count and sum; both sides same sum for L>=1.
 for(let L of [1,2,4]){
  const cap=L===1?17:L===2?28:30,js=range(L).map(i=>i+1).filter(j=>j===1||j%2===0);
  let candidates=0,opposites=0,min=Infinity,witness=null;
  function visit(a,cost){
   if(a.length>=2){
    candidates++;
    let sum=a.reduce((s,x)=>s+x,0),P=a.reduce((v,x)=>v*BigInt(x),1n),mom=js.map(j=>a.reduce((s,x)=>s+BigInt(x)**BigInt(j),0n));
    function right(b,left,prod,prev){
     if(b.length===a.length){if(left===0&&prod===1n&&js.every((j,k)=>b.reduce((s,x)=>s+BigInt(x)**BigInt(j),0n)===mom[k])){
      opposites++;if(cost<min){min=cost;witness={left:a.slice(),right:b.slice(),cost};}}return;}
     let r=a.length-b.length;
     for(let s=prev;s*r<=left;s++){if(prod%BigInt(s)===0n)right([...b,s],left-s,prod/BigInt(s),s);}
    }
    right([1],sum-1,P,1);
   }
   for(let s=a.length?a[a.length-1]:2;cost+Math.max(4,s)<=cap;s++)visit([...a,s],cost+Math.max(4,s));
  }
  visit([],0);
  result.push({L,cap,candidates,opposites,min:Number.isFinite(min)?min:null,witness,certifiedLower:Number.isFinite(min)?min:cap+1});
 }
 assert(result[0].min===17,"L=1 expected 17");
 return result;
}
console.log(JSON.stringify(audit(),null,2));
