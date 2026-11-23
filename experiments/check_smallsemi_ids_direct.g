# Direct GAP Smallsemi 0.7.2 certification for Study T28.
#
# Requires GAP plus GAP package Smallsemi 0.7.2, which ships official
# order-six catalogued semigroup IDs. The independent Python check scans
# a hash-pinned published export; this GAP check reads Smallsemi itself.
#
#   gap -q -b < experiments/check_smallsemi_ids_direct.g
#
# Composes representatives independently from C3/C4/V4 group multiplication,
# group-to-ideal translations and left-zero/right-zero/cyclic ideal products.

if LoadPackage("smallsemi") <> true then
  Error("GAP Smallsemi package is not available");
fi;

if PackageInfo("smallsemi")[1].Version <> "0.7.2" then
  Error("This certificate is pinned to Smallsemi 0.7.2");
fi;

S28Group := function(name, a, b)
  if name = "C3" then
    return (a+b) mod 3;
  elif name = "C4" then
    return (a+b) mod 4;
  elif name = "V4" then
    return ((a mod 2 + b mod 2) mod 2)
      + 2*((QuoInt(a,2) + QuoInt(b,2)) mod 2);
  fi;
  Error("Unknown group");
end;

S28Table := function(group, mode)
  local m,k,t,a,b,p,left,right,i;
  if group="C3" then
    m:=3;
  else
    m:=4;
  fi;
  k:=6-m;
  t:=List([1..6], x -> List([1..6],y->0));
  for a in [0..m-1] do
    for b in [0..m-1] do
      t[a+1][b+1]:=S28Group(group,a,b)+1;
    od;
    p:=a mod k;
    for b in [0..k-1] do
      if mode="left" or mode="both" then
        left:=(p+b) mod k;
      else
        left:=b;
      fi;
      if mode="right" or mode="both" then
        right:=(p+b) mod k;
      else
        right:=b;
      fi;
      t[a+1][m+b+1]:=m+left+1;
      t[m+b+1][a+1]:=m+right+1;
    od;
  od;
  for a in [0..k-1] do
    for b in [0..k-1] do
      if mode="left" then
        i:=a;
      elif mode="right" then
        i:=b;
      else
        i:=(a+b) mod k;
      fi;
      t[m+a+1][m+b+1]:=m+i+1;
    od;
  od;
  return t;
end;

S28Cases := [
  ["C3","both",15958],
  ["C3","trivial",15957],
  ["C3","left",15903],
  ["C3","right",15903],
  ["C4","both",9407],
  ["C4","left",9504],
  ["C4","right",9504],
  ["V4","both",3170],
  ["V4","left",4333],
  ["V4","right",4333]
];

S28Count := 0;
for S28Case in S28Cases do
  S28Tab:=S28Table(S28Case[1],S28Case[2]);
  S28Semigroup:=SemigroupByMultiplicationTable(S28Tab);
  S28Got:=IdSmallSemigroup(S28Semigroup);
  if S28Got <> [6,S28Case[3]] then
    Print("ERROR: ",S28Case[1]," ",S28Case[2]," expected [6,",
          S28Case[3],"] but GAP returned ",S28Got,"\n");
    QuitGap(1);
  fi;
  Print("GAP Smallsemi verified ",S28Case[1]," ",S28Case[2],
        " => ",S28Got,"\n");
  S28Count:=S28Count+1;
od;

if S28Count <> 10 then
  Error("Did not check all ten representatives");
fi;
Print("PASS: Smallsemi 0.7.2 IdSmallSemigroup matched all ten monoids to seven IDs\n");
QuitGap(0);
