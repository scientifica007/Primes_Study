# Independent brute force: all Smallsemi representatives of orders 1..6.
# No Green relations, Rees representation or proof-derived construction.
if LoadPackage("smallsemi") <> true then
  Print("Could not load Smallsemi\n"); QuitGap(1);
fi;
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
# Independent structural classification versus the exhaustive Depth19.
ClassDepth20 := function(tab)
  local n,X,E,x,a,b,ideals,l,classes,J,e,u,isV,upperNonzero;
  n:=Length(tab); X:=[1..n]; E:=ShallowCopy(X);
  for a in X do for b in X do
    x:=tab[a][b]; if x<>a and x<>b then RemoveSet(E,x); fi;
  od; od;
  if Close19(tab,E)=X then return 1; fi;
  ideals:=[];
  for x in X do
    l:=Union([x],Set(List(X,a->tab[a][x])));
    Add(ideals,Union(l,Set(Concatenation(List(l,a->tab[a])))));
  od;
  classes:=Set(List(X,x->Filtered(X,y->ideals[y]=ideals[x])));
  for J in classes do
    if Length(J)=4 then
      e:=First(J,y->ForAll(J,x->tab[x][y]=x and tab[y][x]=x));
      if e<>fail then
        isV:=ForAll(J,x->tab[x][x]=e and ForAll(J,y->tab[x][y] in J));
        if isV then
          upperNonzero:=false;
          for u in X do
            if ideals[u]<>ideals[e] and IsSubset(ideals[u],ideals[e])
              and tab[u][e] in J and tab[u][e]<>e then upperNonzero:=true; fi;
          od;
          if not upperNonzero then return 3; fi;
        fi;
      fi;
    fi;
  od;
  return 2;
end;
Run20 := function()
  local n,i,S,elts,tab,d,c,hist,total,ids,expected;
  expected:=[[1,0,0],[4,0,0],[17,1,0],[116,9,1],[1100,57,3],[15341,610,22]];
  total:=0;
  for n in [1..6] do
    hist:=[0,0,0];ids:=[];
    for i in [1..NrSmallSemigroups(n)] do
      S:=SmallSemigroup(n,i); elts:=AsList(S);
      tab:=List(elts,a->List(elts,b->Position(elts,a*b)));
      d:=Depth19(tab); c:=ClassDepth20(tab);
      if d=fail or d<>c then
        Print("COUNTEREXAMPLE STUDY20 ",[n,i]," depth=",d," predicted=",c," table=",tab,"\n");QuitGap(1);
      fi;
      hist[d]:=hist[d]+1;if d=3 then Add(ids,i);fi;
    od;
    if hist<>expected[n] then Print("Unexpected histogram ",hist,"\n");QuitGap(1);fi;
    total:=total+Sum(hist);
    Print("STUDY20 order=",n," histogram=",hist," depth3 IDs=",ids,"\n");
  od;
  if total<>17282 then QuitGap(1);fi;
  Print("PASS STUDY20 exact classification ",total," Smallsemi representatives\n");
end;
Run20();
QuitGap(0);
