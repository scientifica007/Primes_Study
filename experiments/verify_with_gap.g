# Independent GAP verification, not a translation of the Python test runner.
# Run: gap -q -b < experiments/verify_with_gap.g
# Uses GAP's algebra library for a six-element example and an independent
# multiplication-table exhaustive census of all labelled monoids up to size 4.

AuditE := function(tab, n)
  local x,a,b,found,answer;
  answer := [];
  for x in [1..n] do
    found := false;
    for a in [1..n] do
      if a <> x then
        for b in [1..n] do
          if b <> x and tab[a][b] = x then
            found := true;
            break;
          fi;
        od;
      fi;
      if found then break; fi;
    od;
    if not found then Add(answer,x); fi;
  od;
  return answer;
end;

AuditAssoc := function(tab,n)
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

AuditIdentityTable := function(n,encoding)
  local tab,rest,a,b;
  tab := List([1..n], i -> List([1..n], j -> 0));
  rest := encoding;
  for a in [1..n] do
    for b in [1..n] do
      if a = 1 then
        tab[a][b] := b;
      elif b = 1 then
        tab[a][b] := a;
      else
        tab[a][b] := 1 + rest mod n;
        rest := QuoInt(rest,n);
      fi;
    od;
  od;
  return tab;
end;

AuditCensus := function(n,expectedCount,expectedHist)
  local enc,total,tab,amount,dist,es;
  total := n^((n-1)^2);
  amount := 0;
  dist := List([1..n+1], i -> 0);
  for enc in [0..total-1] do
    tab := AuditIdentityTable(n,enc);
    if AuditAssoc(tab,n) then
      amount := amount + 1;
      es := AuditE(tab,n);
      dist[Length(es)+1] := dist[Length(es)+1] + 1;
    fi;
  od;
  if amount <> expectedCount or dist <> expectedHist then
    Print("GAP monoid census mismatch at n=",n,": got ",amount," hist=",dist,"\n");
    QuitGap(1);
  fi;
  Print("GAP verified monoids n=",n," count=",amount," E histogram=",dist,"\n");
end;

AuditResidues := function(limit)
  local n,unitResidues,observed,predicted,x,a,b,found;
  for n in [2..limit] do
    observed := [];
    for x in [0..n-1] do
      found := false;
      for a in [0..n-1] do
        if a <> x then
          for b in [0..n-1] do
            if b <> x and (a*b) mod n = x then
              found := true;
              break;
            fi;
          od;
        fi;
        if found then break; fi;
      od;
      if not found then Add(observed,x); fi;
    od;
    predicted := [];
    if IsPrimeInt(n) then Add(predicted,0); fi;
    if n mod 2 = 0 and IsPrimeInt(n/2) then Add(predicted,n/2); fi;
    unitResidues := Filtered([0..n-1], x -> GcdInt(x,n) = 1);
    if Length(unitResidues) = 1 then
      Add(predicted,1);
    elif Length(unitResidues) = 2 then
      Add(predicted,First(unitResidues, x -> x <> 1));
    fi;
    Sort(predicted);
    if observed <> predicted then
      Print("GAP modular classification mismatch n=",n,
        " observed=",observed," predicted=",predicted,"\n");
      QuitGap(1);
    fi;
  od;
  Print("GAP independently verified multiplication mod n for 2 <= n <= ",limit,"\n");
end;

AuditSixElementExample := function()
  local elements,g,z,tab,i,j,left,right,prod,idx,m;
  elements := [];
  for g in [0..2] do
    for z in [0..1] do
      Add(elements,[g,z]);
    od;
  od;
  tab := [];
  for i in [1..6] do
    Add(tab,[]);
    for j in [1..6] do
      left := elements[i];
      right := elements[j];
      prod := [ (left[1]+right[1]) mod 3, left[2]*right[2] ];
      idx := Position(elements,prod);
      Add(tab[i],idx);
    od;
  od;
  m := MonoidByMultiplicationTable(tab);
  if m = fail or Size(m) <> 6 or AuditE(tab,6) <> [] then
    Print("GAP six-element C3 x {0,1} independent check failed\n");
    QuitGap(1);
  fi;
  Print("GAP MonoidByMultiplicationTable verified the six-element example, E empty\n");
end;

AuditCensus(1,1,[0,1]);
AuditCensus(2,2,[0,1,1]);
AuditCensus(3,11,[1,0,6,4]);
AuditCensus(4,156,[4,18,24,90,20]);
AuditSixElementExample();
AuditResidues(100);
Print("ALL INDEPENDENT GAP CHECKS PASSED\n");
QuitGap(0);
