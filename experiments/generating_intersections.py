"""Study 16: indexed pair intersections, parity trades (A1)."""
from itertools import product, combinations
from math import gcd
import json
from finite_monoids import associative
from green_metadata_adversary import build as component, fingerprint
from generator_statistics_oracle import closure

def build(p,q,star,W,V):
    if p<1 or q<1 or len(W)!=p*q or len(V)!=p*q or any(b not in (0,1) for b in (*W,*V)):
        raise ValueError("invalid matrices")
    if (star and (any(W) or any(V))) or (not star and (not any(W) or not any(V))):
        raise ValueError("invalid promise")
    N=2*(p+q)+6
    L=[(0,g,c) for g in range(4) for c in range(3)]
    L += [(i,x,0) for i in range(1,4) for x in range(4)]
    L += [(i,x,c) for i,s in [(4,1),(5,3)] for x in range(4,N) for c in range(s)]
    L += [(6,0,0)]
    loc={x:i for i,x in enumerate(L)}
    T={4:component(p,q,W),5:component(p,q,V)}
    def f(i,x):
        return x if i==3 or (i==1 and star) else 0
    def mul(a,b):
        i,x,c=a;j,y,d=b
        if i==6 or j==6:return L[-1]
        if i==j==0:return (0,(x+y)%4,(c+d)%3)
        if not i or not j:
            k=i or j
            if k<=3:return a if i else b
            return (k,T[k][x*N+y],(c+d)%(1 if k==4 else 3))
        if i<=3 and j<=3:
            return (i,x^y,0) if i==j else (3,f(i,x)^f(j,y),0)
        if i==j:return (i,T[i][x*N+y],(c+d)%(1 if i==4 else 3))
        return L[-1]
    return tuple(loc[mul(a,b)] for a in L for b in L),L

def check(p,q):
    m=p*q;N=2*(p+q)+6
    zero=(0,)*m
    masks=list(product((0,1),repeat=m))[1:]
    cases=[(True,zero,zero)]+[(False,w,v) for w,v in product(masks,repeat=2)]
    base=None
    for star,w,v in cases:
        t,L=build(p,q,star,w,v)
        n=len(L)
        assert n==8*(p+q)+33 and associative(t,n)
        f=fingerprint(t)
        local=tuple(t[x*n+y] for x in range(n) for y in range(n) if f[2][x]==f[2][y])
        if base is None:base=(f,local)
        assert base==(f,local) and f[4]==tuple(range(12))
        E=set(range(n))
        for x in range(n):
            for y in range(n):
                z=t[x*n+y]
                if z!=x and z!=y:E.discard(z)
        assert E==({L.index((4,N-2,0))} if star else set())
        blocks=[]
        for i in (4,5):
            for x in range(4,N-2,2):
                blocks.append({k for k,(j,y,c) in enumerate(L) if j==i and y in (x,x+1)})
            if star:blocks.append({k for k,(j,y,c) in enumerate(L) if j==i and y==N-2})
        seeds=[4,13,14,17,18]+[min(b) for b in blocks]
        if not star:
            for x in range(20,24):assert len(closure(t,seeds+[x]))<n
            seeds += [21,22]
        assert len(seeds)==2*(p+q)+7 and len(closure(t,seeds))==n
        for b in blocks:assert closure(t,set(range(n))-b).isdisjoint(b)
        assert t[13*n+16]==(21 if star else 20) # one-query distinction
    return {"p":p,"q":q,"n":n,"tables":len(cases)}

def unit_stats():
    hist={}
    for mask in range(1,1<<12):
        a=[x for x in range(12) if mask>>x&1]
        def gen(b):return gcd(12,*b)==1
        if gen(a) and all(not gen(a[:i]+a[i+1:]) for i in range(len(a))):
            hist[str(len(a))]=hist.get(str(len(a)),0)+1
    assert hist=={"1":4,"2":8}
    return hist

def pair_matrix():
    A=[{1,2},{1,3},{2,3}]
    B=[{0,1},{0,2},{0,3}]
    def mat(H):return [[len(a&b) for b in H] for a in H]
    assert mat(A)==mat(B) and not set.intersection(*A) and set.intersection(*B)=={0}
    return mat(A)

def parity(k):
    if k<2:raise ValueError("k>=2 ensures distinct sets")
    m=k+1;full=(1<<m)-1
    X=[{x for x in range(full+1) if x.bit_count()%2==p} for p in (m%2,1-m%2)]
    H=[[{x for x in Z if x>>i&1} for i in range(m)] for Z in X]
    assert all(len({frozenset(a) for a in A})==m for A in H)
    for J in range(full):
        counts=[sum((x&J)==J for x in Z) for Z in X]
        assert counts[0]==counts[1]==2**(m-J.bit_count()-1)
    assert [len(set.intersection(*A)) for A in H]==[1,0]
    # A1 realization: every tuple except the designated edge returns its first input.
    # For small carriers, check the closure criterion for every seed subset.
    if k<=3:
        for Z,A in zip(X,H):
            pts=sorted(Z)
            for mask in range(1<<len(pts)):
                seeds={x for i,x in enumerate(pts) if mask>>i&1}
                actual=seeds.copy()
                for edge in A:
                    if edge.issubset(seeds):actual.update(Z)
                assert (actual==Z)==any(edge.issubset(seeds) for edge in A)
    return {"k":k,"m":m,"n":len(X[0]),"r":len(H[0][0]),"core":[1,0]}

def report():
    rows=[check(p,q) for p,q in [(1,1),(1,2),(2,1)]]
    return {"study":"T57-T60","rows":rows,"total_tables":sum(r["tables"] for r in rows),
            "unit_irredundant_histogram":unit_stats(),"gadget_matrix":pair_matrix(),
            "parity":[parity(k) for k in range(2,9)],
            "note":"T58 fixed indexed pair intersections; one query on promise. T60 arbitrary arity A1, not monoids."}

if __name__=="__main__":print(json.dumps(report(),indent=2))
