# Independent brute force: all Smallsemi representatives of orders 1..6.
# No Green relations, Rees representation or proof-derived construction.
if LoadPackage("smallsemi") <> true then
  Print("Could not load Smallsemi\n"); QuitGap(1);
fi;
SetInfoLevel(InfoSmallSemi,0);
Close19 := function(tab,X)
  local A,old,a,b;
  A:=Set(X);
  repeat
    old:=ShallowCopy(A);
    for a in old do for b in old do AddSet(A,tab[a][b]); od; od;
  until A=old;
  return A;
end;
Depth19 := function(tab)
  local n,X,subs,A,E,x,a,b,found,H,P,core,i,j,k,D,B19;
  n:=Length(tab); X:=[1..n]; E:=[];
  for x in X do
    found:=false;
    for a in X do for b in X do
      if a<>x and b<>x and tab[a][b]=x then found:=true; fi;
    od; od;
    if not found then Add(E,x); fi;
  od;
  H:=[];
  # Combinations returns subsets; the empty subset never generates nonempty X.
  for A in Combinations(X) do
    if Close19(tab,A)=X and ForAll(A,x->Close19(tab,Difference(A,[x]))<>X) then
      Add(H,A);
    fi;
  od;
  if Length(H)=0 then Error("No generating sets"); fi;
  core:=ShallowCopy(X);
  for A in H do core:=Intersection(core,A); od;
  if core<>E then Error("Indispensable set mismatch"); fi;
  if E in H then return 1; fi;
  P:=[];
  for i in [1..Length(H)] do
    for j in [i..Length(H)] do
      D:=Intersection(H[i],H[j]);
      if D=E then return 2; fi;
      AddSet(P,D);
    od;
  od;
  for A in P do
    for B19 in H do
      if Intersection(A,B19)=E then return 3; fi;
    od;
  od;
  return fail;
end;
Run19 := function()
  local n,i,S,elts,tab,d,hist,total,expected,amount;
  expected:=[1,4,18,126,1160,15973];
  total:=0;
  for n in [1..6] do
    amount:=NrSmallSemigroups(n);
    if amount<>expected[n] then Print("Unexpected catalogue count\n"); QuitGap(1); fi;
    hist:=[0,0,0];
    for i in [1..amount] do
      S:=SmallSemigroup(n,i);
      elts:=AsList(S);
      tab:=List(elts,a->List(elts,b->Position(elts,a*b)));
      d:=Depth19(tab);
      if d=fail then
        Print("COUNTEREXAMPLE at Smallsemi ",[n,i]," table=",tab,"\n");
        QuitGap(1);
      fi;
      hist[d]:=hist[d]+1;
    od;
    total:=total+amount;
    Print("STUDY19 order=",n," count=",amount," depth1_2_3=",hist,"\n");
  od;
  if total<>17282 then QuitGap(1); fi;
  Print("PASS STUDY19 all ",total," Smallsemi representatives\n");
end;
Run19();
QuitGap(0);
