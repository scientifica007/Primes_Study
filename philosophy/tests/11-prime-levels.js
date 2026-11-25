// Study 11: exhaustive Boolean backbone, prime theory, and prime implicant checks.
// Run: node philosophy/tests/11-prime-levels.js
function check11(){
 const out=[];
 for(let n=1;n<=3;n++){
 const N=1<<n, L=2*n, terms=[];
 for(let fixed=0;fixed<N;fixed++)for(let val=0;val<N;val++)if((val&fixed)===val){let cube=0,lit=0;for(let x=0;x<N;x++)if((x&fixed)===val)cube|=1<<x;for(let i=0;i<n;i++)if(fixed>>i&1)lit|=1<<(2*i+((val>>i)&1));terms.push({cube,lit});}
 let functions=0,primeTheories=0,piCases=0,fullTerms=0,essential=0;
 const U=(1<<N)-1;
 for(let f=1;f<=U;f++){
 functions++;
 const imp=terms.filter(t=>(t.cube&f)===t.cube);
 const pi=imp.filter(t=>!imp.some(s=>s.cube!==t.cube&&(t.cube&s.cube)===t.cube));
 let backbone=(1<<L)-1;
 for(let x=0;x<N;x++)if(f>>x&1){let lit=0;for(let i=0;i<n;i++)lit|=1<<(2*i+((x>>i)&1));backbone&=lit;}
 const piIntersection=pi.reduce((a,t)=>a&t.lit,(1<<L)-1);
 if(piIntersection!==backbone)throw Error("backbone mismatch");
 // Test disjunction property on p or not p and on all Boolean formulas represented as truth sets.
 let prime=true;
 for(let a=0;a<=U;a++)for(let b=0;b<=U;b++)if((f&(a|b))===f&&(f&a)!==f&&(f&b)!==f){prime=false;break;}
 const singleton=x=>x!==0&&(x&(x-1))===0;
 if(prime!==singleton(f)||prime!==(pi.length===1&&singleton(pi[0].cube)))throw Error("theory mismatch");
 if(prime)primeTheories++;
 for(const t of pi){piCases++;const others=pi.filter(s=>s!==t).reduce((a,s)=>a|s.cube,0);const ess=(t.cube&~others)!==0;const full=singleton(t.cube);if(ess)essential++;if(full)fullTerms++;if(full&&!ess)throw Error("complete term not essential");}
 }
 out.push({n,functions,primeTheories,piCases,fullTerms,essential});
 }return out;
}
console.log(JSON.stringify(check11(), null, 2));
