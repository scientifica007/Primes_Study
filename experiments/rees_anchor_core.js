// Study 29: reproducible finite checks and explicit infinite-system words.
function experiment(){
  const assert=(v,m)=>{if(!v)throw Error(m)};
  const unique=a=>[...new Set(a)];
  const range=n=>Array.from({length:n},(_,i)=>i);
  let models=0,subsets=0,bases=0,anchorPairs=0,coreChecks=0,coreTriples=0,coreSkipped=0,bandTriples=0,bandPrivate=0,oneDimBases=0,oneDimTriples=0,words=0;
  function model(I,L,n,rf,cf,upperGroup,shift){
    const J=[],U=upperGroup?[0,1]:[0],off=U.length;
    for(let i=0;i<I;i++)for(let g=0;g<n;g++)for(let l=0;l<L;l++)J.push(off+(i*n+g)*L+l);
    const row=x=>Math.floor((x-off)/(n*L)),col=x=>(x-off)%L,group=x=>Math.floor((x-off)/L)%n,key=(i,g,l)=>off+(i*n+g)*L+l;
    const mul=(a,b)=>{
      if(a<off&&b<off)return upperGroup?(a+b)%2:0;
      if(a<off){return key(!upperGroup||a?rf[row(b)]:row(b),(group(b)+(upperGroup?a*shift:0))%n,col(b))}
      if(b<off){return key(row(a),(group(a)+(upperGroup?b*shift:0))%n,!upperGroup||b?cf[col(a)]:col(a))}
      return key(row(a),(group(a)+group(b))%n,col(b))
    };
    const close=X=>{let seed=unique([...U,...X]),q=[...seed],seen=new Set(q);for(let t=0;t<q.length;t++)for(const a of seed){let x=mul(q[t],a);if(!seen.has(x)){seen.add(x);q.push(x)}}return seen};
    const full=X=>close(X).size===J.length+off;
    const minimal=X=>full(X)&&X.every((a,i)=>!full(X.filter((_,j)=>i!==j)));
    const trim=X=>{let B=unique(X);for(const a of [...B])if(full(B.filter(x=>x!==a)))B=B.filter(x=>x!==a);return B};
    return {J,U,row,col,group,key,mul,close,full,minimal,trim,rf,cf,off,I,L,n};
  }
  function verify(M,A){
    const {J,U,row,col,group,key,close,full,minimal,trim,I,L,n}=M;
    bases++;
    const E=J.filter(x=>!full(J.filter(y=>y!==x)));
    function cert(B,C){assert(minimal(B)&&minimal(C),"minimal");assert(A.filter(x=>B.includes(x)&&C.includes(x)).join(",")===E.join(","),"triple intersection")}
    if(n>1){
      let K=range(n).map(g=>key(0,g,0)),C=[...A];
      for(const a of [...C])if(K.every(k=>close(C.filter(x=>x!==a)).has(k)))C=C.filter(x=>x!==a);
      for(const a of A.filter(x=>!C.includes(x))){
        assert(A.filter(x=>row(x)===row(a)&&col(x)===col(a)).length===1,"unique tail cell");coreChecks++;
      }
      const B=trim([...C,...A.filter(x=>!C.includes(x)).map(x=>key(row(x),(group(x)+1)%n,col(x)))]);
      assert(minimal(B)&&A.filter(x=>B.includes(x)).every(x=>C.includes(x)),"anchor swap");
      if(full(J.filter(x=>!C.includes(x)))){let D=trim(J.filter(x=>!C.includes(x)));cert(B,D);coreTriples++}else coreSkipped++;
    }else if(I>1&&L>1){
      const reach=(x,y,f)=>{const seen=new Set();while(!seen.has(x)){if(x===y)return true;seen.add(x);x=f[x]}return false};
      const R=A.filter(a=>!A.some(b=>b!==a&&reach(row(b),row(a),M.rf))),C=A.filter(a=>!R.includes(a));
      assert(C.every(a=>!A.some(b=>b!==a&&reach(col(b),col(a),M.cf))),"private endpoint");
      const rewire=(X,coordinate,other,make,dim)=>{
        if(!X.length)return [];
        let labels=unique(X.map(other));
        if(labels.length>=2)return X.map(a=>make(coordinate(a),labels[(labels.indexOf(other(a))+1)%labels.length]));
        let pivot=X[0],alt=range(dim).find(i=>i!==labels[0]);
        return [pivot,...X.slice(1).map(a=>make(coordinate(a),alt))];
      };
      const raw=unique([...rewire(R,row,col,(i,l)=>key(i,0,l),L),...rewire(C,col,row,(l,i)=>key(i,0,l),I)]);
      assert(A.every(a=>raw.some(b=>row(a)===row(b))&&raw.some(b=>col(a)===col(b))),"coverage");
      const K=A.filter(a=>raw.includes(a));
      assert(K.length<=2&&unique(K.map(row)).length===K.length&&unique(K.map(col)).length===K.length,"diagonal exception");
      const removable=raw.filter(a=>full(raw.filter(b=>b!==a)));
      assert(removable.length<=2,"finite exception count");
      bandPrivate+=raw.length-removable.length;
      const B=trim(raw),D=trim(J.filter(a=>!K.includes(a)));cert(B,D);bandTriples++;
    }else if(I>1||L>1){
      const axis=I>1?row:col,f=I>1?M.rf:M.cf,dim=I>1?I:L,make=i=>I>1?key(i,0,0):key(0,0,i);
      const reach=(x,y)=>{const seen=new Set();while(!seen.has(x)){if(x===y)return true;seen.add(x);x=f[x]}return false};
      const B=A.map(a=>{let i=axis(a),j=range(dim).find(j=>j!==i&&reach(i,j)&&reach(j,i));return j===undefined?a:make(j)});
      cert(B,B);oneDimBases++;oneDimTriples++;
    }
  }
  function run(M){
    models++;
    for(let mask=0;mask<2**M.J.length;mask++){
      const A=M.J.filter((_,i)=>mask&(1<<i));subsets++;
      if(M.minimal(A))verify(M,A);
    }
  }
  for(const [I,L] of [[2,2],[3,2],[2,3],[1,3],[3,1],[3,3]]){
    let idI=range(I),idL=range(L),flipI=idI.map(i=>i===0&&I>1?1:i===1?0:i),flipL=idL.map(i=>i===0&&L>1?1:i===1?0:i);
    const constI=idI.map(()=>0),constL=idL.map(()=>0);
    for(const [rf,cf,grp] of [[idI,idL,true],[flipI,flipL,true],[constI,idL,false],[idI,constL,false],[constI,constL,false]]){
      run(model(I,L,1,rf,cf,grp,0));
      if(I*L<=6)run(model(I,L,2,rf,cf,grp,grp?1:0));
    }
  }
  const perms=[[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]];
  const m=(a,b)=>perms.findIndex(p=>p.every((x,i)=>x===perms[a][perms[b][i]]));
  const inv=a=>range(6).find(b=>m(a,b)===0&&m(b,a)===0);
  for(let p=0;p<6;p++){
    const P=[[p,(p+1)%6],[(p+2)%6,(p+3)%6]];
    const mul=(a,b)=>[a[0],m(m(a[1],P[a[2]][b[0]]),b[1]),b[2]];
    for(let i=0;i<2;i++)for(let l=0;l<2;l++)for(let g=0;g<6;g++)for(let h=0;h<6;h++){
      let x=[i,g,l],y=[i,h,l],k=[0,m(m(inv(m(g,P[l][0])),h),inv(m(P[0][i],g))),0];
      assert(mul(mul(x,k),x).join()===y.join(),"sandwich identity");anchorPairs++;
    }
  }
  const up=u=>[u],a=(i,p,g,j,q)=>[i,p,g,j,q],eq=(x,y)=>x.join()===y.join();
  const mul=(x,y)=>x.length===1?(y.length===1?up(x[0]^y[0]):a(y[0],x[0]^y[1],y[2],y[3],y[4])):y.length===1?a(x[0],x[1],x[2],x[3],x[4]^y[0]):a(x[0],x[1],x[2]^y[2],y[3],y[4]);
  const seed=(side,n)=>a(n,side===2&&n===0?1:0,side===1||n===0?1:0,n,0);
  for(let side=0;side<3;side++)for(let i=0;i<8;i++)for(let j=0;j<8;j++)for(let p=0;p<2;p++)for(let q=0;q<2;q++)for(let g=0;g<2;g++){
    const x=seed(side,i),y=seed(side,j),z=seed(side,0),d=g^x[2]^y[2];
    let w=[up(p^x[1]),x,...(d?[z]:[]),y,up(q^y[4])];
    assert(eq(w.reduce(mul),a(i,p,g,j,q)),"infinite words");words++;
  }
  return {models,subsets,relative_bases:bases,noncommutative_anchor_identities:anchorPairs,unique_tail_checks:coreChecks,finite_core_triples:coreTriples,finite_core_complement_not_generating:coreSkipped,band_triples:bandTriples,band_private_checks:bandPrivate,one_dimensional_band_triples:oneDimTriples,infinite_two_layer_words:words,scope:"Finite test models with upper C2 or singleton idempotent; explicit words in genuine infinite C2 rectangular group extension. Not exhaustive infinite validation."}
}
console.log(JSON.stringify(experiment(), null, 2));
