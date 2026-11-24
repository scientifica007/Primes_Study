// Exact BigInt interval certificate on the entire nonnegative simplex; not a numerical sample.
function certify(){
 const N=65536n,num=59n,den=250n,stack=[[[0n,0n,0n,0n],[N,N,N,N]]],max=(a,b)=>a>b?a:b,min=(a,b)=>a<b?a:b,sum=a=>a.reduce((s,x)=>s+x,0n);
 const c={nodes:0,split:0,local:0,graph:0,outside:0,minWidth:Number(N)};
 while(stack.length){
  const [l,u]=stack.pop();c.nodes++;
  if(sum(l)>N){c.outside++;continue;}
  const a=min(N,sum(u));
  if(den*5n*a*a<=num*16n*N*N){c.graph++;continue;}
  const F=(6n*N-l[3])**2n-max(0n,12n*max(l[0],l[1])+6n*l[2]+5n*l[3]-6n*N)**2n-36n*l[2]*l[2]-8n*max(0n,9n*l[0]*l[1]-a*a);
  if(den*F<=num*144n*N*N){c.local++;continue;}
  let j=0;for(let i=1;i<4;i++)if(u[i]-l[i]>u[j]-l[j])j=i;
  if(u[j]-l[j]<=1n)throw Error("unresolved exact box");
  let m=(u[j]+l[j])/2n,uu=u.slice(),ll=l.slice();uu[j]=m;ll[j]=m;c.split++;c.minWidth=Math.min(c.minWidth,Number(m-l[j]));
  stack.push([ll,u],[l,uu]);
 }
 if(c.nodes!==2*c.split+1||c.nodes!==c.split+c.local+c.graph+c.outside)throw Error("coverage");
 return c;
}
console.log(JSON.stringify(certify(),null,2));
