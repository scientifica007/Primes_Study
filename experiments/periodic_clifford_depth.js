// Study 25: deterministic independent finite checks. Node.js, no dependencies.
function audit25(){
 const range=n=>Array.from({length:n},(_,i)=>i);
 const group=(name,n,mul)=>({name,n,t:range(n).map(a=>range(n).map(b=>mul(a,b)))});
 const cyclic=n=>group("C"+n,n,(a,b)=>(a+b)%n);
 const perms=[[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]];
 const S3=group("S3",6,(a,b)=>perms.findIndex(p=>p.every((v,i)=>v===perms[a][perms[b][i]])));
 const D8=group("D8",8,(a,b)=>((a>>1)+(a&1?-1:1)*(b>>1)+4)%4*2+((a^b)&1));
 const Q8=group("Q8",8,(a,b)=>{let i=a>>1,j=b>>1,neg=(a^b)&1;if(!i)return j*2+neg;if(!j)return i*2+neg;if(i===j)return neg^1;let cyc=(i===1&&j===2)||(i===2&&j===3)||(i===3&&j===1);return (6-i-j)*2+(neg^(cyc?0:1));});
 const V4=group("V4",4,(a,b)=>a^b);
 const G=[cyclic(1),cyclic(2),cyclic(3),cyclic(4),V4,cyclic(5),cyclic(6),group("C2^3",8,(a,b)=>a^b),S3,D8,Q8,group("C3^2",9,(a,b)=>(a+b)%3+3*((Math.floor(a/3)+Math.floor(b/3))%3))];
 const close=(t,seed)=>{let q=[...new Set(seed)],s=new Set(q),fixed=q.slice();for(let k=0;k<q.length;k++)for(const y of fixed){let z=t[q[k]][y];if(!s.has(z)){s.add(z);q.push(z);}}return s;};
 const gens=g=>{let A=range(g.n);for(const x of A.slice())if(close(g.t,A.filter(y=>y!==x)).size===g.n)A=A.filter(y=>y!==x);return A;};
 const isAssoc=t=>t.every((row,a)=>row.every((ab,b)=>t[b].every((bc,c)=>t[ab][c]===t[a][bc])));
 for(const g of G){if(!isAssoc(g.t)||!range(g.n).every(x=>g.t[0][x]===x&&g.t[x][0]===x&&range(g.n).some(y=>g.t[x][y]===0&&g.t[y][x]===0)))throw Error(g.name);}
 const homs=new Map();
 for(const g of G)for(const h of G){
  let b=gens(g).filter(x=>x!==0),list=[];
  for(let m=0;m<h.n**b.length;m++){
   let z=m,f=Array(g.n).fill(-1);f[0]=0;let ys=b.map(()=>{let y=z%h.n;z=Math.floor(z/h.n);return y;});
   let q=[0],ok=true;for(let k=0;k<q.length&&ok;k++)for(let j=0;j<b.length;j++){let x=g.t[q[k]][b[j]],y=h.t[f[q[k]]][ys[j]];if(f[x]===-1){f[x]=y;q.push(x);}else if(f[x]!==y){ok=false;break;}}
   if(ok&&q.length===g.n&&g.t.every((r,a)=>r.every((x,b)=>f[x]===h.t[f[a]][f[b]])))list.push(f);
  }homs.set(g.name+"/"+h.name,list);
 }
 const stats={models:0,by_shape:{},histogram:{"1":0,"2":0,"3":0},exhaustive_models:0,seed_subsets:0,bases_checked:0,translated_classes:0,dependent_edges:0,nonnormal_image_models:0,unsupported_klein_models:0};
 const groupBases=new Map();
 for(const g of G){let H=[];for(let m=1;m<1<<g.n;m++){let A=range(g.n).filter(i=>m>>i&1);if(close(g.t,A).size===g.n&&A.every(x=>close(g.t,A.filter(y=>y!==x)).size!==g.n))H.push(A);}groupBases.set(g.name,H);}
 const localCert=(g,k)=>{const H=groupBases.get(g.name);const E=range(g.n).filter(x=>H.every(a=>a.includes(x)));if(E.length===H[0].length)return Array.from({length:k},()=>H[0]);for(const a of H)for(const b of H)if(a.filter(x=>b.includes(x)).length===E.length)return k===2?[a,b]:[a,b,a];if(k!==3)throw Error("local pair");for(const a of H)for(const b of H)for(const c of H)if(a.filter(x=>b.includes(x)&&c.includes(x)).length===E.length)return [a,b,c];throw Error("local triple");};
 function model(groups,meet,f,shape){
  const L=groups.length,I=range(L),label=I.flatMap(i=>range(groups[i].n).map(x=>[i,x])),off=I.map(i=>groups.slice(0,i).reduce((s,g)=>s+g.n,0)),n=label.length,X=range(n);
  const above=(j,i)=>j!==i&&meet[i][j]===i;
  const t=label.map(([i,x])=>label.map(([j,y])=>{let k=meet[i][j];return off[k]+groups[k].t[f[i][k][x]][f[j][k][y]];}));
  if(!isAssoc(t))throw Error("assoc "+shape);
  const E=new Set(X);for(let a of X)for(let b of X)if(t[a][b]!==a&&t[a][b]!==b)E.delete(t[a][b]);
  const M=I.map(i=>!I.some(j=>above(j,i)&&I.some(k=>above(k,i)&&meet[j][k]===i)));
  const W=I.map(i=>close(groups[i].t,[0,...I.filter(j=>above(j,i)).flatMap(j=>f[j][i])]));
  const ep=new Set(I.flatMap(i=>groups[i].n===1&&M[i]?[off[i]]:groups[i].n===2&&W[i].size===1?[off[i]+1]:[]));
  if(E.size!==ep.size||[...E].some(x=>!ep.has(x)))throw Error("E");
  const unsupported=I.some(i=>groups[i].name==="V4"&&W[i].size===1);
  const d=close(t,[...E]).size===n?1:unsupported?3:2;
  let nonnormal=I.some(i=>{let g=groups[i], inv=range(g.n).map(a=>g.t[a].indexOf(0));return range(g.n).some(a=>[...W[i]].some(w=>!W[i].has(g.t[g.t[a][w]][inv[a]])));});
  stats.models++;stats.by_shape[shape]=(stats.by_shape[shape]||0)+1;stats.histogram[d]++;if(unsupported)stats.unsupported_klein_models++;if(nonnormal)stats.nonnormal_image_models++;
  let H=[];
  if(n<=9){
   const all=(1<<n)-1,C=Array(1<<n).fill(0);for(let m=1;m<=all;m++){let a=X.filter(x=>m>>x&1);C[m]=[...close(t,a)].reduce((s,x)=>s|(1<<x),0);}
   let masks=X.length?range(all+1).filter(m=>C[m]===all&&X.every(x=>!(m>>x&1)||C[m^(1<<x)]!==all)):[];
   H=masks.map(m=>X.filter(x=>m>>x&1));const em=[...E].reduce((s,x)=>s|(1<<x),0);
   let exact=masks.includes(em)?1:masks.some(a=>masks.some(b=>(a&b)===em))?2:3;if(exact!==d)throw Error("depth");
   stats.exhaustive_models++;stats.seed_subsets+=all+1;
  }else{
   for(let order of [X,X.slice().reverse(),X.slice(1).concat(0)]){let a=X.slice();for(const x of order)if(close(t,a.filter(y=>y!==x)).size===n)a=a.filter(y=>y!==x);if(!H.some(b=>b.join()===a.join()))H.push(a);}
  }
  for(const A of H){
   if(close(t,A).size!==n||A.some(x=>close(t,A.filter(y=>y!==x)).size===n))throw Error("bad base");
   let parts=I.map(i=>A.filter(x=>label[x][0]===i).map(x=>label[x][1]));
   for(const i of I){
    const a=parts[i],w=[...W[i]],g=groups[i];
    if(W[i].size===g.n){if(a.length!==(M[i]?1:0))throw Error("local shape");}
    else if(close(g.t,w.concat(a)).size!==g.n||a.some(x=>close(g.t,w.concat(a.filter(y=>x!==y))).size===g.n))throw Error("relative shape");
   }
   if(d===1){if(A.length!==E.size||A.some(x=>!E.has(x)))throw Error("unique");stats.bases_checked++;continue;}
   const dep=new Map();
   for(const i of I)if(W[i].size>1&&parts[i].length){
    let u=A.find(x=>{let [j,v]=label[x];return above(j,i)&&f[j][i][v]!==0;});if(u===undefined)throw Error("donor");let [j,v]=label[u];dep.set(i,{j,w:f[j][i][v]});stats.translated_classes++;
   }
   const color=new Map();function col(i){if(!color.has(i)){let j=dep.get(i).j;color.set(i,dep.has(j)?1-col(j):0);}return color.get(i);}
   for(const i of dep.keys()){col(i);if(dep.has(dep.get(i).j))stats.dependent_edges++;}
   let B=range(d).map(()=>[]);
   for(const i of I){
    let a=parts[i],g=groups[i];
    if(dep.has(i)){
     let w=dep.get(i).w,z=a.map(x=>g.t[w][x]);if(z.some(x=>a.includes(x)))throw Error("translation not disjoint");
     for(let k=0;k<d;k++)B[k].push(...(k===color.get(i)?z:a).map(x=>off[i]+x));
    }else if(W[i].size===1&&g.n>1){
     let C=localCert(g,d);for(let k=0;k<d;k++)B[k].push(...C[k].map(x=>off[i]+x));
    }else for(let k=0;k<d;k++)B[k].push(...a.map(x=>off[i]+x));
   }
   for(const b of B){if(close(t,b).size!==n||b.some(x=>close(t,b.filter(y=>y!==x)).size===n))throw Error("certificate "+shape);}
   let core=B[0].filter(x=>B.every(b=>b.includes(x)));if(core.length!==E.size||core.some(x=>!E.has(x)))throw Error("core");stats.bases_checked++;
  }
 }
 function chain(groups,maps){const L=groups.length,f=range(L).map(()=>[]);for(let j=0;j<L;j++){f[j][j]=range(groups[j].n);for(let i=j-1;i>=0;i--)f[j][i]=f[j][i+1].map(x=>maps[i][x]);}model(groups,range(L).map(i=>range(L).map(j=>Math.min(i,j))),f,"chain"+L);}
 for(const g of G)chain([g],[]);
 for(const g of G)for(const h of G)for(const f of homs.get(h.name+"/"+g.name))chain([g,h],[f]);
 const small=G.slice(0,5);for(const g of small)for(const h of small)for(const k of small)for(const f of homs.get(h.name+"/"+g.name))for(const q of homs.get(k.name+"/"+h.name))chain([g,h,k],[f,q]);
 for(const g of G.slice(0,9))for(let mask=0;mask<16;mask++){
  let a=mask&1,b=(mask>>1)&1,c=(mask>>2)&1,d=(mask>>3)&1;if(a*c!==b*d)continue;
  const f=range(4).map(i=>{let x=[];x[i]=range(g.n);return x;});let fm=z=>range(g.n).map(x=>z?x:0);f[1][0]=fm(a);f[2][0]=fm(b);f[3][1]=fm(c);f[3][2]=fm(d);f[3][0]=fm(a*c);
  model([g,g,g,g],[[0,0,0,0],[0,1,0,1],[0,0,2,2],[0,1,2,3]],f,"diamond");
 }
 return stats;
}
console.log(JSON.stringify(audit25(),null,2));
