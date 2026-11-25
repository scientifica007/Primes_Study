// Study 15: exhaustive small graph and ring comparisons.
// Run: node philosophy/tests/15-independent-primality-criteria.js
function check15(){
const out=[];
for(const n of [4,6]){
const edges=[];for(let i=0;i<n;i++)for(let j=i+1;j<n;j++)edges.push([i,j]);
const bit=(i,j)=>1<<edges.findIndex(([a,b])=>a===Math.min(i,j)&&b===Math.max(i,j));
const composites=new Set();
const templates=n===4?[[[0,1],[1,2],[2,3],[3,0]]]:[[[0,1],[1,2],[3,4],[4,5],[0,3],[1,4],[2,5]],[[0,1],[1,2],[2,0],[3,4],[4,5],[5,3],[0,3],[1,4],[2,5]]];
function visit(p){if(p.length===n){for(const e of templates)composites.add(e.reduce((m,[i,j])=>m|bit(p[i],p[j]),0));return;}for(let i=0;i<n;i++)if(!p.includes(i))visit([...p,i]);}visit([]);
const counts={both:0,modularOnly:0,cartesianOnly:0,neither:0};
for(let g=0;g<1<<edges.length;g++){
const adj=Array(n).fill(0);edges.forEach(([i,j],k)=>{if(g>>k&1){adj[i]|=1<<j;adj[j]|=1<<i;}});
let reach=1,prev;do{prev=reach;for(let i=0;i<n;i++)if(reach>>i&1)reach|=adj[i];}while(reach!==prev);
const full=(1<<n)-1;if(reach!==full)continue;
let mp=true;for(let s=1;s<full;s++){if(!(s&(s-1)))continue;let module=true;for(let i=0;i<n;i++)if(!(s>>i&1)){const a=adj[i]&s;if(a&&a!==s){module=false;break;}}if(module){mp=false;break;}}
const cp=!composites.has(g);counts[mp?(cp?"both":"modularOnly"):(cp?"cartesianOnly":"neither")]++;
}
out.push({n,labelledComposite:composites.size,counts});
}
const mat=(a,b)=>{let c=0;for(let i=0;i<2;i++)for(let j=0;j<2;j++){let s=0;for(let k=0;k<2;k++)s^=((a>>(2*i+k))&1)*((b>>(2*k+j))&1);c|=s<<(2*i+j);}return c;};
const dual=(a,b)=>((a&1)*(b&1))|(( ((a&1)*((b>>1)&1))^(((a>>1)&1)*(b&1)) )<<1);
function ring(n,mul,one){let zeroPairs=0,blocked=0,centralIdempotents=[];for(let a=1;a<n;a++)for(let b=1;b<n;b++){if(mul(a,b)===0)zeroPairs++;if(Array.from({length:n},(_,r)=>r).every(r=>mul(mul(a,r),b)===0))blocked++;}for(let a=0;a<n;a++)if(mul(a,a)===a&&Array.from({length:n},(_,r)=>r).every(r=>mul(a,r)===mul(r,a)))centralIdempotents.push(a);return{n,one,zeroPairs,blocked,centralIdempotents};}
const rings={matrix:ring(16,mat,9),dual:ring(4,dual,1),product:ring(4,(a,b)=>a&b,3)};
if(out[0].counts.modularOnly!==0||out[1].counts.neither!==0||rings.matrix.blocked!==0||rings.dual.blocked===0||rings.product.blocked===0)throw Error("countertest failed");
return{graphs:out,rings};
}
console.log(JSON.stringify(check15(),null,2));
