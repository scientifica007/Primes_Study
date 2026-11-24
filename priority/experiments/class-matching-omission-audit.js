// Node.js; abstract finite support-system verification of sufficient matching certificates.
function auditMatching(){
 const ok=(x,m)=>{if(!x)throw Error(m)};
 // A pattern is a set of present labels, and support[i] is the set that query i can report.
 function canMatch(labels,omit,support){let used=new Map();function add(l,seen){for(let i of omit)if(support[i].includes(l)&&!seen.has(i)){seen.add(i);if(!used.has(i)||add(used.get(i),seen)){used.set(i,l);return true;}}return false;}return labels.every(l=>add(l,new Set()));}
 function sufficient(omit,support,patterns){for(let a of patterns)for(let b of patterns)if(a.e!==b.e){let x=a.p.filter(l=>!b.p.includes(l)),y=b.p.filter(l=>!a.p.includes(l));if(canMatch(x,omit,support)&&canMatch(y,omit,support))return false;}return true;}
 function best(support,patterns){let n=support.length,max=-1,O=[];for(let m=0;m<2**n;m++){let o=Array.from({length:n},(_,i)=>i).filter(i=>m>>i&1);if(o.length>max&&sufficient(o,support,patterns)){max=o.length;O=o}}return {queries:n-max,omitted:O};}
 let trials=0;
 // Exhaustive support systems: 3 labels, 3 reps, all nonempty subsets of labels.
 for(let code=0;code<7**3;code++){let d=code,support=[];for(let i=0;i<3;i++){let m=d%7+1;d=Math.floor(d/7);support.push([0,1,2].filter(j=>m>>j&1));}
  let inputs=[];function rec(a){if(a.length===3){let p=[...new Set(a.filter(l=>l>=0))].sort();if(p.length===2)inputs.push({a,p,e:p.includes(0)});return;}for(let l of [-1,...support[a.length]])rec([...a,l]);}rec([]);
  let patterns=[...new Map(inputs.map(v=>[v.p.join(),v])).values()];for(let m=0;m<8;m++){let o=[0,1,2].filter(i=>m>>i&1);if(!sufficient(o,support,patterns))continue;let seen=new Map();for(let v of inputs){let key=v.a.filter((_,i)=>!o.includes(i)).join();ok(!seen.has(key)||seen.get(key)===v.e,"false certificate");seen.set(key,v.e)}trials++;}}
 const shared=best(Array.from({length:6},()=>[0,1,2,3]),[{p:[0,1],e:true},{p:[2,3],e:false}]);ok(shared.queries===5,"shared");
 // Abstract dense example: main targets 0..3, auxiliary size2 labels 4,5, size4 label 6.
 const denseSupport=[[0],[0],[1],[1],[2],[2],[3],[3],[4],[4],[5],[5],[6],[6]];
 const densePatterns=[{p:[0,1,2,3,6],e:true},...[0,1,2,3].map(i=>({p:[0,1,2,3,4,5].filter(j=>j!==i),e:false}))];
 const dense=best(denseSupport,densePatterns);ok(dense.queries===2,"dense");
 return {supportSystems:343,verifiedCertificates:trials,shared,dense};
}
console.log(JSON.stringify(auditMatching(),null,2));
