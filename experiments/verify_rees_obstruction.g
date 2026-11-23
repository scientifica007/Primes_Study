# Study 10: independently build and audit two Rees 0-matrix extensions.
# Run: gap -q -b < experiments/verify_rees_obstruction.g
# GAP labels 1..10; corresponding Python labels 0..9.
# External units are cyclic group C3 (labels 1,2,3).
# Rees J class has 6 elements (labels 4..9); zero has label 10.

T35Build := function(P)
  local n,t,a,b,i,lambda,j,mu,output;
  n:=10;
  t:=List([1..n],x->List([1..n],y->0));
  for a in [1..n] do
    for b in [1..n] do
      if a<=3 and b<=3 then
        output:=1+((a-1+b-1) mod 3);
      elif a=10 or b=10 then
        output:=10;
      elif a<=3 then
        output:=b;
      elif b<=3 then
        output:=a;
      else
        # J elements index i*2 + lambda (both zero-based)
        i:=QuoInt(a-4,2)+1;
        lambda:=((a-4) mod 2)+1;
        j:=QuoInt(b-4,2)+1;
        mu:=((b-4) mod 2)+1;
        if P[lambda][j]=0 then
          output:=10;
        else
          output:=4+2*(i-1)+(mu-1);
        fi;
      fi;
      t[a][b]:=output;
    od;
  od;
  return t;
end;

T35Assoc := function(t,n)
  local a,b,c;
  for a in [1..n] do
    for b in [1..n] do
      for c in [1..n] do
        if t[t[a][b]][c]<>t[a][t[b][c]] then
          return false;
        fi;
      od;
    od;
  od;
  return true;
end;

T35E := function(t,n)
  local answer,x,a,b,found;
  answer:=[];
  for x in [1..n] do
    found:=false;
    for a in [1..n] do
      if a<>x then
        for b in [1..n] do
          if b<>x and t[a][b]=x then
            found:=true;
          fi;
        od;
      fi;
    od;
    if not found then Add(answer,x); fi;
  od;
  return answer;
end;

T35RightIdeal := function(t,x,n)
  return Set(List([1..n],y->t[x][y]));
end;
T35LeftIdeal := function(t,x,n)
  return Set(List([1..n],y->t[y][x]));
end;
T35TwoSidedIdeal := function(t,x,n)
  local a,b;
  return Set(Flat(List([1..n],a->
    List([1..n],b->t[t[a][x]][b]))));
end;

T35Check := function()
  local A,B,i,j,n,ia,ib,ea,eb,idemA,idemB,regA,regB,t,cn;
  A:=T35Build([[0,1,1],[1,0,1]]);
  B:=T35Build([[0,0,1],[1,1,1]]);
  n:=10;
  if not T35Assoc(A,n) or not T35Assoc(B,n) then
    Error("Not an associative Rees extension");
  fi;
  if T35E(A,n)<>[] or T35E(B,n)<>[9] then
    Error("The counterexample should give E(A)=[] and E(B)=[9]");
  fi;
  for i in [1..n] do
    if not ForAny([1..n],j->A[A[i][j]][i]=i) then
      Error("First monoid is not regular");
    fi;
    if not ForAny([1..n],j->B[B[i][j]][i]=i) then
      Error("Second monoid is not regular");
    fi;
    for j in [1..n] do
      if (T35RightIdeal(A,i,n)=T35RightIdeal(A,j,n))
        <> (T35RightIdeal(B,i,n)=T35RightIdeal(B,j,n)) then
        Error("Green R partitions differ");
      fi;
      if (T35LeftIdeal(A,i,n)=T35LeftIdeal(A,j,n))
        <> (T35LeftIdeal(B,i,n)=T35LeftIdeal(B,j,n)) then
        Error("Green L partitions differ");
      fi;
      if (T35TwoSidedIdeal(A,i,n)=T35TwoSidedIdeal(A,j,n))
        <> (T35TwoSidedIdeal(B,i,n)=T35TwoSidedIdeal(B,j,n)) then
        Error("Green J partitions differ");
      fi;
    od;
    for j in [1..3] do
      if A[i][j]<>B[i][j] or A[j][i]<>B[j][i] then
        Error("Unit group actions do not coincide");
      fi;
    od;
  od;
  idemA:=Filtered([1..n],i->A[i][i]=i);
  idemB:=Filtered([1..n],i->B[i][i]=i);
  if Length(idemA)<>6 or Length(idemB)<>6 then
    Error("Expected exactly six idempotents in both monoids");
  fi;
  if Size(MonoidByMultiplicationTable(A))<>10
     or Size(MonoidByMultiplicationTable(B))<>10 then
    Error("GAP refused the multiplication table");
  fi;
  Print("GAP verified two 10-element monoids with identical Green ",
        "R/L/H/J partitions, regularity, unit actions and six idempotents\n");
  Print("GAP independently confirmed E(A)=[], E(B)=[9] (one-based)\n");
end;

T35Check();
Print("ALL GAP STUDY-10 REES OBSTRUCTION CHECKS PASSED\n");
QuitGap(0);
