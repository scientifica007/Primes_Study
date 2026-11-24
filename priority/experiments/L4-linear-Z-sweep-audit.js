'use strict';
// P03 v1.14: exact arithmetic audit of the relaxed mass inequalities.
// Synthetic masses are not asserted to be realizable monoids.
const assert = require('node:assert/strict');
let configurations=0, right=0, left=0, fallback=0, degenerate=0;
const thresholds=[132,208,1000];
for(const B of thresholds){
  const B2=B*B;
  for(let X=0;X<=18;X++)for(let Y=0;Y<=18;Y++)for(let R=0;R<=12;R++){
    const m=X+Y+R;
    // W<=R; the high-endpoint charge is increasing in W, so W=R suffices.
    const W=R;
    // All terms are integers after scaling by 360*B^2.
    const H=180*B*((Y+W)*(Y+R)+(X+W)*(X+R))+360*((Y+W)*X+(X+W)*Y);
    const rhs=m*m*(9*B2+100*B+360);
    const raw=40*B2*X*Y;
    assert(Number.isSafeInteger(H)&&Number.isSafeInteger(rhs));
    assert(H<=360*B*m*m,'crude high-sweep bound');
    for(let b=0;b<=Y;b++)for(let C=0;C<=X;C++){
      const d=Y-b,A=X-C;
      let main;
      if(!X||!Y){main=0;degenerate++;}
      else if(X*b>=Y*C){
        if(5*R<=3*X){
          main=36*B2*X*Y-16*B2*X*b+20*B2*R*b+4*B2*C*d+40*B*b*Y;
          assert(main<=36*B2*X*Y+40*B*Y*Y);right++;
        }else{main=raw;fallback++;}
      }else{
        if(5*R<=3*Y){
          main=36*B2*X*Y-16*B2*Y*C+20*B2*R*C+4*B2*A*b+40*B*C*X;
          assert(main<=36*B2*X*Y+40*B*X*X);left++;
        }else{main=raw;fallback++;}
      }
      assert(Number.isSafeInteger(main+H));
      assert(main+H<=rhs,JSON.stringify({B,X,Y,R,b,C,main,H,rhs}));
      configurations++;
    }
  }
}
let targetChargeCases=0;
for(let c8=0;c8<=3;c8++)for(let c9=0;c9<=3;c9++)for(let c10=0;c10<=3;c10++)for(let c11=0;c11<=3;c11++){
  const mass=8*c8+9*c9+10*c10+11*c11;
  const p8=+(c8+c10+c11>0),p9=+(c9+c10+c11>0);
  assert(5*(p8+p9)<=mass);targetChargeCases++;
}
let greenSizeCases=0;
for(let B=10;B<=20;B++)for(let l=1;l<B;l++)for(let r=1;r<B;r++)for(let h=1;h<=Math.min(l,r);h++)if(l%h===0&&r%h===0){
  const N=l*r/h;
  assert(N/l<=B-1&&N/r<=B-1);greenSizeCases++;
}
// B=208, epsilon=1/7500: 1/40+5/(18B)+1/B^2+epsilon*(B-1)/20 < (1-epsilon/2)^2/36.
const B=208n,q=7500n;
const den=360n*B*B*20n*q;
const num=den/40n+5n*den/(18n*B)+den/(B*B)+(B-1n)*den/(20n*q);
const gammaNum=(2n*q-1n)**2n,gammaDen=144n*q*q;
assert(num*gammaDen<gammaNum*den);
assert(36n*gammaNum<gammaDen);
// Confirm improvement of explicit gap by >13,000 relative to v1.13.
const oldQ=100000000n,oldNum=(2n*oldQ-1n)**2n,oldDen=144n*oldQ*oldQ;
assert((gammaDen-36n*gammaNum)*oldDen>13000n*(oldDen-36n*oldNum)*gammaDen);
console.log(JSON.stringify({thresholds,configurations,right,left,fallback,degenerate,targetChargeCases,greenSizeCases,explicitBound:Number(gammaNum)/Number(gammaDen),smallDensityBound:Number(num)/Number(den),status:'PASS'},null,2));
