// Study 13: exhaustive blocker and relabeling checks.
// Run: node philosophy/tests/13-necessity-transfer.js
function check13(){
 const results=[];
 for(let n=1;n<=3;n++){
 const N=1<<n,all=N-1,subset=(a,b)=>(a&b)===a;
 const min=A=>[...new Set(A)].filter(a=>!A.some(b=>b!==a&&subset(b,a))).sort((a,b)=>a-b);
 const blocker=A=>min(Array.from({length:N},(_,x)=>x).filter(x=>A.every(s=>(s&x)!==0)));
 const equal=(a,b)=>a.join(",")===b.join(",");
 let families=0,maps=0,conditions=0;
 for(let mask=1;mask<(1<<N);mask++){
 const F=Array.from({length:N},(_,i)=>i).filter(i=>mask>>i&1),B=blocker(F);
 if(!equal(blocker(B),min(F)))throw Error("double blocker");
 families++;
 for(let code=0;code<n**n;code++){
 let k=code,q=[];for(let i=0;i<n;i++){q.push(k%n);k=Math.floor(k/n);}
 const image=s=>q.reduce((a,j,i)=>a|((s>>i&1)?1<<j:0),0);
 const G=F.map(image),actual=blocker(G),pred=min(B.map(image));
 if(!equal(actual,pred))throw Error("transfer");
 for(let t=0;t<N;t++){
 const pre=q.reduce((a,j,i)=>a|((t>>j&1)?1<<i:0),0);
 if(G.every(s=>(s&t)!==0)!==F.every(s=>(s&pre)!==0))throw Error("preimage");
 conditions++;
 }
 maps++;
 }
 }
 results.push({n,families,maps,conditions});
 }
 return results;
}
console.log(JSON.stringify(check13(), null, 2));
