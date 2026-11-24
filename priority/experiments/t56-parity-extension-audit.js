// Reproduce the finite parity-extension and extra-metadata audit with Node.js.
function audit(){
  function build(p,q,sizes,words,balanced){
    let x=[], unit=balanced?16:4;
    for(let u=0;u<unit;u++)x.push({type:"G",a:u%4,c:u>>2,k:-1});
    const offsets=[], keys=new Map();
    function add(o){keys.set([o.k,o.type,o.i,o.a,o.c].join(","),x.length);x.push(o)}
    function ix(k,type,i,a,c){return keys.get([k,type,i,a,c].join(","))}
    for(let k=0;k<sizes.length;k++){let s=sizes[k];offsets.push(x.length);for(let type of ["A","B","t","z"])for(let i=0;i<(type==="A"?p:type==="B"?q:1);i++)for(let a=0;a<("AB".includes(type)?2:1);a++)for(let c=0;c<s;c++)add({k,type,i,a,c});}
    let omega=-1;if(balanced){omega=x.length;x.push({type:"O",k:-2});}
    const n=x.length,T=new Int32Array(n*n);
    for(let i=0;i<n;i++)for(let j=0;j<n;j++){
      let a=x[i],b=x[j],v;
      if(i===omega||j===omega)v=omega;
      else if(a.type==="G"&&b.type==="G")v=(a.a+b.a)%4+4*((a.c+b.c)%(unit/4));
      else if(a.type==="G"||b.type==="G"){
        let g=a.type==="G"?a:b,h=a.type==="G"?b:a,s=sizes[h.k],u=h.a;
        if(a.type==="G"&&h.type==="B"||b.type==="G"&&h.type==="A")u^=g.a%2;
        v=ix(h.k,h.type,h.i,u,(h.c+g.c)%s);
      }else if(a.k!==b.k)v=omega;
      else {
        let type="z",id=0,u=0,s=sizes[a.k],pair=a.type+b.type;
        if(pair==="AA"){type="A";id=b.i;u=b.a;}
        else if(pair==="BB"){type="B";id=a.i;u=a.a;}
        else if(pair==="AB"){type=(words[a.k]>>(2*(a.i*q+b.i)+(a.a^b.a)))&1?"t":"z";}
        else if(pair==="At"||pair==="tB")type="t";
        v=ix(a.k,type,id,u,(a.c+b.c)%s);
      }
      if(v===undefined||v<0)throw Error("bad product");
      T[i*n+j]=v;
    }
    return {x,T,n,omega,unit,sizes,p,q,words};
  }
  function check(M){
    let {x,T,n,omega,unit,words,sizes,p,q}=M;
    let E=Array(n).fill(true), left=[],right=[],two=[], idem=[],reg=[],K=x.map((a,i)=>["t","z","O"].includes(a.type)?i:-1).filter(i=>i>=0),Kset=new Set(K);
    for(let a=0;a<n;a++){if(T[a]!==a||T[a*n]!==a)throw Error("identity");idem.push(T[a*n+a]===a);let l=new Set(),r=new Set(),bset=new Set(),regular=false;
      for(let b=0;b<n;b++){l.add(T[b*n+a]);r.add(T[a*n+b]);if(T[T[a*n+b]*n+a]===a)regular=true;let ab=T[a*n+b];if(ab!==a&&ab!==b)E[ab]=false;
        for(let c=0;c<n;c++)if(T[ab*n+c]!==T[a*n+T[b*n+c]])throw Error("assoc");
      }
      for(let b of l)for(let c=0;c<n;c++)bset.add(T[b*n+c]);
      const sort=s=>[...s].sort((a,b)=>a-b);left.push(sort(l));right.push(sort(r));two.push(sort(bset));reg.push(regular);
    }
    for(let a=0;a<n;a++)if(E[a] !== (x[a].type==="t"&&sizes[x[a].k]===1&&words[x[a].k]===0))throw Error("E");
    const sig=[left,right,two,idem,reg];
    // All products in proper principal ideals, plus the ideal and all actions on it.
    for(let I of [...left,...right,...two])if(I.length<n)for(let a of I)for(let b of I)sig.push(T[a*n+b]);
    for(let a=0;a<n;a++)for(let b=0;b<n;b++){
      if(a<unit||b<unit||Kset.has(a)||Kset.has(b))sig.push(T[a*n+b]);
      if(!Kset.has(a)&&!Kset.has(b)){let c=T[a*n+b];sig.push(Kset.has(c)?-1:c);}
    }
    // Required generation blocks; every complement is closed; selected representatives generate.
    let blocks=[];
    for(let k=0;k<sizes.length;k++){for(let type of ["A","B"])for(let i=0;i<(type==="A"?p:q);i++)blocks.push(x.map((a,j)=>a.k===k&&a.type===type&&a.i===i?j:-1).filter(j=>j>=0));if(words[k]===0)blocks.push(x.map((a,j)=>a.k===k&&a.type==="t"?j:-1).filter(j=>j>=0));}
    for(let B of blocks){let S=new Set(B);for(let a=0;a<n;a++)if(!S.has(a))for(let b=0;b<n;b++)if(!S.has(b)&&S.has(T[a*n+b]))throw Error("block");}
    let X=[1,...(unit===16?[4]:[]),...blocks.map(B=>B[0])],S=new Set(X),queue=[...S];
    for(let i=0;i<queue.length;i++)for(let j=0;j<=i;j++)for(let c of [T[queue[i]*n+queue[j]],T[queue[j]*n+queue[i]]])if(!S.has(c)){S.add(c);queue.push(c)}
    if(S.size!==n)throw Error("generation");
    return {sig:JSON.stringify(sig),rank:X.length};
  }
  const report=[];
  for(let [p,q] of [[1,1],[1,2],[2,1],[2,2]]){
    let nbits=2*p*q,ref=null,count=0;
    for(let w=0;w<2**nbits;w++){let M=build(p,q,[1],[w],false),r=check(M);if(ref!==null&&r.sig!==ref)throw Error("base metadata");ref=r.sig;count++;}
    report.push({family:"base",p,q,count,bits:nbits});
    let a=Array.from({length:nbits},(_,i)=>1<<i);if(nbits===2)a=[1,2,3];
    ref=null;count=0;let rank=null;
    for(let mode=0;mode<2;mode++)for(let u of a)for(let v of a){let words=mode===0?[0,u,v,0]:[u,0,0,v];let r=check(build(p,q,[1,2,2,4],words,true));if(ref!==null&&r.sig!==ref)throw Error("balanced metadata");if(rank!==null&&r.rank!==rank)throw Error("rank");ref=r.sig;rank=r.rank;count++;}
    report.push({family:"balanced",p,q,count,bits:nbits,rank});
  }
  return report;
}
console.log(JSON.stringify(audit(),null,2));
