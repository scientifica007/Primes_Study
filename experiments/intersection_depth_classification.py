"""Study 20: direct local two-generator-set construction and 29-element pair."""
from itertools import product, combinations
from collections import Counter
import json
from generator_statistics_oracle import closure
from finite_monoids import associative
from green_metadata_adversary import fingerprint

def rees_table(P,alpha=None,beta=None):
    b,a=len(P),len(P[0]);n=a*b+(3 if alpha is not None else 2);z=n-1;u=n-2
    def mul(x,y):
        if x==0:return y
        if y==0:return x
        if z in (x,y):return z
        if alpha is not None:
            if x==y==u:return u
            if x==u:
                i,l=divmod(y-1,b);return z if alpha[i]<0 else 1+alpha[i]*b+l
            if y==u:
                i,l=divmod(x-1,b);return z if beta[l]<0 else 1+i*b+beta[l]
        i,l=divmod(x-1,b);j,m=divmod(y-1,b)
        return 1+i*b+m if P[l][j] else z
    return tuple(mul(x,y) for x in range(n) for y in range(n))

def E_direct(t):
    n=round(len(t)**.5)
    return set(range(n))-{t[x*n+y] for x in range(n) for y in range(n) if t[x*n+y] not in (x,y)}

def grid_pair(P,t,U,E):
    b,a=len(P),len(P[0]);n=round(len(t)**.5)
    cell=lambda i,l:1+i*b+l
    edges=[(i,l) for i in range(a) for l in range(b) if P[l][i]]
    def matching(k):
        return next((M for M in combinations(edges,k) if len({i for i,l in M})==len({l for i,l in M})==k),None)
    if a>=3 and b>=3:
        M=matching(3)
        if M:
            A={cell(M[j][0],M[(j+1)%3][1]) for j in range(3)}
            B={cell(M[j][0],M[(j+2)%3][1]) for j in range(3)}
            for i in range(a):
                if i not in {i for i,l in M}:A.add(cell(i,M[0][1]));B.add(cell(i,M[1][1]))
            for l in range(b):
                if l not in {l for i,l in M}:A.add(cell(M[0][0],l));B.add(cell(M[1][0],l))
            return A,B,"matching3"
        i0,l0=next((i,l) for i in range(a) for l in range(b) if all(j==i or m==l for j,m in edges));x=cell(i0,l0)
        I=[i for i in range(a) if i!=i0];L=[l for l in range(b) if l!=l0]
        A={x};B={x}&E
        for r,i in enumerate(I):
            for s,l in enumerate(L):(A if (r+s)%2==0 else B).add(cell(i,l))
        B.update(cell(i,l0) for i in I);B.update(cell(i0,l) for l in L)
        return A,B,"cross_cover"
    if a==b==2:
        (i0,l0),(i1,l1)=matching(2);x,y=cell(i0,l1),cell(i1,l0)
        return {x,y},{cell(i0,l0),cell(i1,l1)}|({x,y}&E),"two_by_two"
    assert a==2 and b>=3
    supp=[{l for l in range(b) if P[l][i]} for i in range(2)]
    if min(map(len,supp))>=2:
        common=supp[0]&supp[1];color={}
        if len(common)>=2:
            x,y=sorted(common)[:2];color[x]=0;color[y]=1
        elif len(common)==1:
            x=next(iter(common));color[x]=0
            for s in supp:color[min(s-common)]=1
        else:
            for s in supp:x,y=sorted(s)[:2];color[x]=0;color[y]=1
        return {cell(color.get(l,0),l) for l in range(b)},{cell(1-color.get(l,0),l) for l in range(b)},"two_rows_balanced"
    i=0 if len(supp[0])==1 else 1;j=1-i;l0=next(iter(supp[i]));x=cell(j,l0);y=cell(i,l0)
    outer=[l for l in range(b) if l!=l0];w=outer[0]
    if x not in E:
        Z=U|set(range(1,a*b+1))
        aa,bb=next((aa,bb) for aa in Z for bb in Z if aa!=x and bb!=x and t[aa*n+bb]==x)
        for z in (aa,bb):
            if 1<=z<=a*b and z!=y:
                r,l=divmod(z-1,b);assert r==j;w=l
    A={x};B={y}|({x}&E)
    for l in outer:
        row=j if l==w else i;B.add(cell(row,l));A.add(cell(1-row,l))
    return A,B,"two_rows_singleton"

def grid_check(P,alpha=None,beta=None):
    b,a=len(P),len(P[0]);t=rees_table(P,alpha,beta);n=round(len(t)**.5)
    J=set(range(1,a*b+1));U={0} if alpha is None else {0,n-2};E=J&E_direct(t)
    A,B,typ=grid_pair(P,t,U,E)
    assert J<=closure(t,U|A) and J<=closure(t,U|B)
    assert A&B==E
    return typ,len(E)

def maps(n):
    return [a for a in product(range(-1,n),repeat=n) if all(i<0 or a[i]==i for i in a)]

def grid_report():
    rows=[]
    for a,b in [(2,2),(2,3),(2,4),(3,3),(3,4),(4,4)]:
        pure=upper=opt=0;types=Counter();lim=4096 if a*b==16 else 1<<(a*b)
        for mask in range(lim):
            code=(mask*7919)%65536 if a*b==16 else mask
            P=tuple(tuple((code>>(l*a+i))&1 for i in range(a)) for l in range(b))
            if not all(any(row) for row in P) or not all(any(row[i] for row in P) for i in range(a)):continue
            typ,e=grid_check(P);pure+=1;types[typ]+=1
            if (a==2 and b<=3) or (a==b==3 and pure<=30):
                for alpha in maps(a):
                    for beta in maps(b):
                        if not all((0 if beta[l]<0 else P[beta[l]][i])==(0 if alpha[i]<0 else P[l][alpha[i]]) for l in range(b) for i in range(a)):continue
                        t=rees_table(P,alpha,beta);assert associative(t,round(len(t)**.5))
                        _,e2=grid_check(P,alpha,beta);upper+=1;opt+=e2<e
        rows.append(dict(a=a,b=b,pure=pure,upper=upper,types=dict(types),upper_optional_reduction=opt))
    return rows

def clifford(mode):
    sizes=[3,2,4,3,1,3,6,6,1]
    labels=[(i,x) for i,s in enumerate(sizes) for x in range(s)]
    loc={x:i for i,x in enumerate(labels)}
    above=[[],[0],[0,1],[0],[0],[0,3,4],[0],[0,6],[0,1,2,3,4,5,6,7]]
    def meet(i,j):
        if i==j:return i
        if i in above[j]:return j
        if j in above[i]:return i
        return 5 if {i,j}=={3,4} else 8
    def f(i,k,x):
        if i==k:return x
        if i==1 and k==2:return x if mode else 0
        if i==3 and k==5:return 0 if mode else x
        if i==6 and k==7:return (2*x if mode else 3*x)%6
        return 0
    def mul(a,b):
        i,x=a;j,y=b;k=meet(i,j);u,v=f(i,k,x),f(j,k,y)
        return loc[k,u^v if k==2 else (u+v)%sizes[k]]
    t=tuple(mul(a,b) for a in labels for b in labels);n=len(labels)
    assert associative(t,n)
    h=[1];depth=1;cores=set();local=[]
    for i,s in enumerate(sizes):
        J={k for k,(j,x) in enumerate(labels) if j==i}
        U={k for k,(j,x) in enumerate(labels) if j in above[i]}
        sets=[set(c) for k in range(s+1) for c in combinations(sorted(J),k)]
        good=[A for A in sets if J<=closure(t,U|A)]
        H=[A for A in good if not any(B<A for B in good)]
        core=set.intersection(*H);cores.update(core)
        d=next(k for k in (1,2,3) if any(set.intersection(*hs)==core for hs in product(H,repeat=k)))
        depth=max(depth,d)
        counts=[sum(len(A)==k for A in H) for k in range(max(map(len,H))+1)]
        out=[0]*(len(h)+len(counts)-1)
        for j,x in enumerate(h):
            for k,y in enumerate(counts):out[j+k]+=x*y
        h=out;local.append(d)
    E=E_direct(t);assert cores==E
    return t,{"n":n,"rank":next(i for i,v in enumerate(h) if v),"h":h,"E":sorted(E),"depth":depth,"local_depths":local}

def report():
    rows=grid_report()
    a,A=clifford(False);b,B=clifford(True)
    assert fingerprint(a)==fingerprint(b)
    assert A["h"]==B["h"] and A["E"]==B["E"] and (A["depth"],B["depth"])==(3,2)
    return {"study":"T71-T76","grids":rows,"pure_total":sum(x["pure"] for x in rows),
            "upper_total":sum(x["upper"] for x in rows),"pair":[A,B]}
if __name__=="__main__":print(json.dumps(report(),indent=2))
