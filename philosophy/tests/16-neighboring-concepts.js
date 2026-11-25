// Study 16: enumerate labeled posets, direct tests of prime elements and ideals.
// Run: node philosophy/tests/16-neighboring-concepts.js
function check16(){
 const out=[];
 for(let n=1;n<=5;n++){
 const N=1<<n,U=N-1,sub=(a,b)=>(a&b)===a;
 const pairs=[];for(let i=0;i<n;i++)for(let j=i+1;j<n;j++)pairs.push([i,j]);
 let posets=0,elements=0,homChecks=0;
 const cases={both:0,joinOnly:0,idealOnly:0,neither:0};
 for(let code=0;code<3**pairs.length;code++){
 let k=code;const lower=Array.from({length:n},(_,i)=>1<<i);
 for(const [i,j] of pairs){const v=k%3;k=Math.floor(k/3);if(v===1)lower[j]|=1<<i;if(v===2)lower[i]|=1<<j;}
 if(lower.some(s=>lower.some((t,i)=>(s>>i&1)&&!sub(t,s))))continue;
 posets++;
 const upper=Array.from({length:n},(_,i)=>lower.reduce((m,t,j)=>m|((t>>i&1)?1<<j:0),0));
 const L=Array.from({length:N},(_,s)=>s).filter(s=>lower.every((t,i)=>!(s>>i&1)||sub(t,s)));
 elements+=L.length;
 const primeD=[],primeI=[];
 for(const d of L){
 let j=d!==0,m=d!==U;
 for(const a of L)for(const b of L){
 if(sub(d,a|b)&&!sub(d,a)&&!sub(d,b))j=false;
 if(sub(a&b,d)&&!sub(a,d)&&!sub(b,d))m=false;
 }
 if(j!==lower.includes(d)||m!==upper.some(t=>(U^t)===d))throw Error("characterization");
 if(j)primeD.push(d);if(m)primeI.push(d);
 cases[j?(m?"both":"joinOnly"):(m?"idealOnly":"neither")]++;
 }
 if(primeD.length!==n||primeI.length!==n)throw Error("bijection count");
 for(let i=0;i<n;i++){
 const d=lower[i],m=U^upper[i];
 const missing=L.filter(a=>!sub(d,a));
 if(missing.reduce((v,a)=>v|a,0)!==m)throw Error("maximum missing");
 for(const a of L)for(const b of L){
 const h=x=>Number(sub(d,x)),g=x=>Number(!sub(x,m));
 if(h(a)!==g(a)||h(a|b)!==(h(a)|h(b))||h(a&b)!==(h(a)&h(b)))throw Error("homomorphism");
 homChecks++;
 }
 for(let j=0;j<n;j++)if(sub(d,lower[j])!==sub(m,U^upper[j]))throw Error("order");
 }
 }
 out.push({n,posets,elements,cases,homChecks});
 }
 return out;
}
console.log(JSON.stringify(check16(),null,2));
