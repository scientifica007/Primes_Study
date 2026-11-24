# Independent GAP construction (labels 1..n), all 16 matrices for p=q=2.
Build13 := function(bits)
  local n,t,z,layer,mul;
  n:=14; t:=13; z:=14;
  layer:=function(x)
    if x<=4 then return 0;
    elif x<=8 then return 1;
    elif x<=12 then return 2;
    elif x=t then return 3;
    else return 4; fi;
  end;
  mul:=function(x,y)
    local i,j;
    i:=layer(x); j:=layer(y);
    if i=0 and j=0 then return 1+((x+y-2) mod 4); fi;
    if i=0 then
      if j=2 then return 9+2*QuoInt(y-9,2)+((y-9+x-1) mod 2); fi;
      return y;
    fi;
    if j=0 then
      if i=1 then return 5+2*QuoInt(x-5,2)+((x-5+y-1) mod 2); fi;
      return x;
    fi;
    if i=1 and j=1 then return y; fi;
    if i=2 and j=2 then return x; fi;
    if i=1 and j=2 and bits[1+2*QuoInt(x-5,2)+QuoInt(y-9,2)]=1 then return t; fi;
    if (i=1 and j=3) or (i=3 and j=2) then return t; fi;
    return z;
  end;
  return List([1..n],x->List([1..n],y->mul(x,y)));
end;
Check13 := function()
  local base,tab,bits,x,y,n,ex,R,L,J,BR,BL,BJ;
  n:=14; base:=Build13([0,0,0,0]);
  BR:=List([1..n],x->Set(base[x]));
  BL:=List([1..n],x->Set(List(base,row->row[x])));
  BJ:=List([1..n],x->Set(Flat(List(BL[x],y->base[y]))));
  for bits in Tuples([0,1],4) do
    tab:=Build13(bits);
    if not ForAll([1..n],x->ForAll([1..n],y->ForAll([1..n],
       z->tab[tab[x][y]][z]=tab[x][tab[y][z]]))) then Error("associativity"); fi;
    R:=List([1..n],x->Set(tab[x]));
    L:=List([1..n],x->Set(List(tab,row->row[x])));
    J:=List([1..n],x->Set(Flat(List(L[x],y->tab[y]))));
    if R<>BR or L<>BL or J<>BJ then Error("principal ideals"); fi;
    for x in [1..n] do
      for y in [1..n] do
        if (BJ[x]=BJ[y] or x<=4 or y<=4) and tab[x][y]<>base[x][y] then Error("local multiplication or unit action"); fi;
      od;
    od;
    ex:=Filtered([1..n],x->not ForAny([1..n],a->a<>x and ForAny([1..n],b->b<>x and tab[a][b]=x)));
    if (bits=[0,0,0,0] and ex<>[13]) or (bits<>[0,0,0,0] and ex<>[]) then Error("E"); fi;
  od;
  Print("PASS: all 16 binary matrices; same labelled principal ideals and local products; E is OR of bits\n");
end;
Check13();
QuitGap(0);
