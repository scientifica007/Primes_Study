# Independent GAP proof checks for study 11 (T38-T42).
# No dependency on Python-generated tables, JSON, or canonical relabelling.
# Run: gap -q -b < experiments/verify_clifford_linking_maps.g

C11Layer := function(x)
  if x<=3 then return 1;
  elif x<=7 then return 2;
  else return 3;
  fi;
end;

C11Value := function(x)
  if x<=3 then return x-1;
  elif x<=7 then return x-4;
  else return x-8;
  fi;
end;

C11Product := function(a,b,bridge)
  local sa,sb,va,vb;
  sa:=C11Layer(a);
  sb:=C11Layer(b);
  va:=C11Value(a);
  vb:=C11Value(b);
  if sa=1 and sb=1 then
    return 1+(va+vb) mod 3;
  elif sa=2 and sb=2 then
    return 4+(va+vb) mod 4;
  elif sa=3 and sb=3 then
    return 8+(va+vb) mod 2;
  elif sa=1 then
    return b;
  elif sb=1 then
    return a;
  elif sa=2 and sb=3 then
    return 8+(bridge*(va mod 2)+vb) mod 2;
  elif sa=3 and sb=2 then
    return 8+(va+bridge*(vb mod 2)) mod 2;
  else
    Error("Unanticipated layer combination");
  fi;
end;

C11Table := function(bridge)
  return List([1..9],a->List([1..9],b->C11Product(a,b,bridge)));
end;

C11Assoc := function(t,n)
  return ForAll([1..n],a->ForAll([1..n],b->ForAll([1..n],c->
     t[t[a][b]][c]=t[a][t[b][c]])));
end;

C11E := function(t,n)
  return Filtered([1..n],x->
    not ForAny([1..n],a-> a<>x and
      ForAny([1..n],b->b<>x and t[a][b]=x)));
end;

C11RightIdeal := function(t,x,n)
  return Set(List([1..n],b->t[x][b]));
end;

C11LeftIdeal := function(t,x,n)
  return Set(List([1..n],a->t[a][x]));
end;

C11JIdeal := function(t,x,n)
  return Set(Flat(List([1..n],a->
    List([1..n],b->t[t[a][x]][b]))));
end;

C11SameGreen := function(a,b,n)
  local i,j;
  for i in [1..n] do
    for j in [1..n] do
      if (C11RightIdeal(a,i,n)=C11RightIdeal(a,j,n))
        <> (C11RightIdeal(b,i,n)=C11RightIdeal(b,j,n)) then
        return false;
      fi;
      if (C11LeftIdeal(a,i,n)=C11LeftIdeal(a,j,n))
        <> (C11LeftIdeal(b,i,n)=C11LeftIdeal(b,j,n)) then
        return false;
      fi;
      if (C11JIdeal(a,i,n)=C11JIdeal(a,j,n))
        <> (C11JIdeal(b,i,n)=C11JIdeal(b,j,n)) then
        return false;
      fi;
      if IsSubset(C11JIdeal(a,j,n),C11JIdeal(a,i,n))
        <> IsSubset(C11JIdeal(b,j,n),C11JIdeal(b,i,n)) then
        return false;
      fi;
    od;
  od;
  return true;
end;

C11Diamond := function()
  local meet,grp,table,a,b,aa,bb,z;
  meet:=[[1,2,3,4],[2,2,4,4],[3,4,3,4],[4,4,4,4]];
  grp:=function(x)
    if x<=3 then return 1; fi;
    return x-2;
  end;
  table:=List([1..6],a->List([1..6],b->0));
  for a in [1..6] do
    for b in [1..6] do
      aa:=grp(a);
      bb:=grp(b);
      z:=meet[aa][bb];
      if z=1 then
        table[a][b]:=1+(a-1+b-1) mod 3;
      else
        table[a][b]:=z+2;
      fi;
    od;
  od;
  if not C11Assoc(table,6) or C11E(table,6)<>[4,5] then
    Error("Diamond meet theorem failed");
  fi;
  if table[4][5]<>6 or table[5][4]<>6 then
    Error("Bottom singleton should be produced by incomparable atoms");
  fi;
  Print("GAP validated diamond meet: E={4,5}, bottom singleton produced\n");
end;

C11Verify := function()
  local A,B,n,i,j,idemA,idemB;
  A:=C11Table(0);
  B:=C11Table(1);
  n:=9;
  if not C11Assoc(A,n) or not C11Assoc(B,n) then
    Error("A Clifford monoid failed associativity");
  fi;
  if not ForAll([1..n],i->A[1][i]=i and A[i][1]=i
     and B[1][i]=i and B[i][1]=i) then
    Error("Not a monoid with global identity 1");
  fi;
  if C11E(A,n)<>[9] or C11E(B,n)<>[] then
    Error("Target E sets differ from theorem");
  fi;
  if not C11SameGreen(A,B,n) then
    Error("Green relations or J order differ between the examples");
  fi;
  idemA:=Filtered([1..n],i->A[i][i]=i);
  idemB:=Filtered([1..n],i->B[i][i]=i);
  if idemA<>[1,4,8] or idemB<>idemA then
    Error("Idempotent positions must be identical");
  fi;
  for i in [1..n] do
    if not ForAny([1..n],j->A[A[i][j]][i]=i)
      or not ForAny([1..n],j->B[B[i][j]][i]=i) then
      Error("All elements must be regular");
    fi;
    for j in [1..n] do
      if C11Layer(i)=C11Layer(j) and A[i][j]<>B[i][j] then
        Error("Local principal-factor multiplication differs");
      fi;
    od;
    if i>3 then
      for j in [1..3] do
        if A[i][j]<>B[i][j] or A[j][i]<>B[j][i] then
          Error("External unit actions differ");
        fi;
      od;
    fi;
  od;
  if Size(MonoidByMultiplicationTable(A))<>9
     or Size(MonoidByMultiplicationTable(B))<>9 then
    Error("GAP refused the nine-element tables");
  fi;
  Print("GAP verified two nine-element Clifford monoids with identical ",
        "Green R/L/H/J, full J order, principal factors, ",
        "idempotent positions, and global unit actions\n");
  Print("GAP direct E(A)=[9], E(B)=[]: ",
        "linking map C4->C2 is the decisive information\n");
  C11Diamond();
end;

C11Verify();
Print("ALL GAP STUDY-11 TESTS PASSED\n");
QuitGap(0);
