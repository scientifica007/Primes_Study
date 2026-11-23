# Independent GAP audit for study 08: 10 six-element monoids and 7 opposites.
# This script builds examples from algebraic formulas instead of importing
# Python tables or canonical forms.
# Run: gap -q -b < experiments/verify_minimal_six_with_gap.g

SixGroupProduct := function(group, a, b)
  local m, aa, bb;
  if group = "V4" then
    return (a mod 2 + b mod 2) mod 2
      + 2*((QuoInt(a,2) + QuoInt(b,2)) mod 2);
  fi;
  if group = "C3" then m:=3; else m:=4; fi;
  return (a+b) mod m;
end;

SixTable := function(group, mode)
  local m,k,n,tab,a,b,l,r,imode,phi;
  if group = "C3" then
    m:=3;
    k:=3;
  else
    m:=4;
    k:=2;
  fi;
  n:=m+k;
  tab:=List([1..n],i->List([1..n],j->0));
  for a in [0..m-1] do
    for b in [0..m-1] do
      tab[a+1][b+1]:=SixGroupProduct(group,a,b)+1;
    od;
    phi:=a mod k;
    for b in [0..k-1] do
      if mode = "left" or mode = "both" then
        l:=(phi+b) mod k;
      else
        l:=b;
      fi;
      if mode = "right" or mode = "both" then
        r:=(phi+b) mod k;
      else
        r:=b;
      fi;
      tab[a+1][m+b+1]:=m+l+1;
      tab[m+b+1][a+1]:=m+r+1;
    od;
  od;
  for a in [0..k-1] do
    for b in [0..k-1] do
      if mode = "left" then
        imode:=a;
      elif mode = "right" then
        imode:=b;
      else
        imode:=(a+b) mod k;
      fi;
      tab[m+a+1][m+b+1]:=m+imode+1;
    od;
  od;
  return tab;
end;

SixAssoc := function(tab,n)
  local a,b,c;
  for a in [1..n] do
    for b in [1..n] do
      for c in [1..n] do
        if tab[tab[a][b]][c] <> tab[a][tab[b][c]] then
          return false;
        fi;
      od;
    od;
  od;
  return true;
end;

SixE := function(tab,n)
  local result,x,a,b,found;
  result:=[];
  for x in [1..n] do
    found:=false;
    for a in [1..n] do
      if a <> x then
        for b in [1..n] do
          if b <> x and tab[a][b]=x then
            found:=true;
            break;
          fi;
        od;
      fi;
      if found then break; fi;
    od;
    if not found then Add(result,x); fi;
  od;
  return result;
end;

SixUnits := function(tab,n)
  local answer,a;
  answer:=[];
  for a in [1..n] do
    if ForAny([1..n],b->tab[a][b]=1 and tab[b][a]=1) then
      Add(answer,a);
    fi;
  od;
  return answer;
end;

SixOpposite := function(tab,n)
  return List([1..n],i->List([1..n],j->tab[j][i]));
end;

SixIsomorphic := function(a,b,n)
  local perm,q,i,j,okay;
  for perm in PermutationsList([2..n]) do
    q:=Concatenation([1],perm);
    okay:=true;
    for i in [1..n] do
      for j in [1..n] do
        if q[a[i][j]]<>b[q[i]][q[j]] then
          okay:=false;
          break;
        fi;
      od;
      if not okay then break; fi;
    od;
    if okay then return true; fi;
  od;
  return false;
end;

SixCheckModels := function()
  local groups, modes, output, row, group, mode, tab, previous, anti, item;
  output:=[];
  groups:=["C3","C4","V4"];
  for group in groups do
    if group="C3" then
      modes:=["trivial","left","right","both"];
    else
      modes:=["left","right","both"];
    fi;
    for mode in modes do
      tab:=SixTable(group,mode);
      if not SixAssoc(tab,6) or not IsEmpty(SixE(tab,6)) then
        Error("Invalid GAP six-element representative");
      fi;
      if group="C3" then
        if Length(SixUnits(tab,6)) <> 3 then
          Error("Wrong unit group for C3");
        fi;
      elif Length(SixUnits(tab,6)) <> 4 then
        Error("Wrong unit group of order 4");
      fi;
      for previous in output do
        if SixIsomorphic(tab,previous[3],6) then
          Error("Two alleged distinct classes are isomorphic");
        fi;
      od;
      Add(output,[group,mode,tab]);
    od;
  od;
  if Length(output)<>10 then Error("Expected 10 classes"); fi;
  anti:=[];
  for row in output do
    tab:=row[3];
    if not ForAny(anti,
        prev -> SixIsomorphic(tab,prev,6)
           or SixIsomorphic(SixOpposite(tab,6),prev,6)) then
      Add(anti,tab);
    fi;
  od;
  if Length(anti)<>7 then Error("Expected 7 anti-isomorphism classes"); fi;
  Print("GAP independent study-08 models verified: ",
        Length(output)," pairwise nonisomorphic; ",
        Length(anti)," up to opposites\n");
end;

SixSemigroupsOrder3 := function()
  local code, rem, tab, a,b,count,empty;
  count:=0;
  empty:=0;
  for code in [0..3^9-1] do
    rem:=code;
    tab:=List([1..3],i->List([1..3],j->0));
    for a in [1..3] do
      for b in [1..3] do
        tab[a][b]:=1+rem mod 3;
        rem:=QuoInt(rem,3);
      od;
    od;
    if SixAssoc(tab,3) then
      count:=count+1;
      if IsEmpty(SixE(tab,3)) then empty:=empty+1; fi;
    fi;
  od;
  if count<>113 or empty<>3 then
    Error("Unexpected exhaustive 3-element semigroup count");
  fi;
  Print("GAP independently enumerated 113 labelled associative ",
        "3-element operations, 3 with E empty\n");
end;

SixCheckModels();
SixSemigroupsOrder3();
Print("ALL GAP STUDY-08 CHECKS PASSED\n");
QuitGap(0);
