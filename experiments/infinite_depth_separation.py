"""Study 23: finite truncation and group-translation checks."""
from itertools import combinations
import json

def table(n):
    X=list(range(2*n-1))
    b=lambda i:0 if i==1 else n+i-2
    t=[[min(x,y) for y in X] for x in X]
    def setpair(x,y,z): t[x][y]=t[y][x]=z
    for i in range(2,n+1):
        setpair(b(i),b(i),b(i-1))
        setpair(b(i-1),b(i),i-1)
        setpair(b(i-1),i-1,b(i))
    return t

def intersection(T,full):
    for x in T:full&=x
    return full

def cover_census(n):
    t=table(n); N=len(t); full=(1<<N)-1
    supports=[1<<i for i in range(n)]+[(1<<i)-1 for i in range(2,n+1)]
    bits=[1<<i for i in range(N)]
    cl=[0]*(full+1); union=[0]*(full+1)
    for m in range(full+1):
        if m:
            bit=m&-m;i=bit.bit_length()-1
            union[m]=union[m^bit]|supports[i]
        desired=sum(bits[i] for i,s in enumerate(supports) if s&~union[m]==0)
        s=m
        while True:
            old=s; elems=[i for i in range(N) if s&bits[i]]
            for i in elems:
                for j in elems:s|=bits[t[i][j]]
            if old==s:break
        assert s==desired
        cl[m]=s
    gens=[m for m in range(full+1) if cl[m]==full]
    H=[m for m in gens if all(cl[m^bit]!=full for bit in bits if bit&m)]
    expected=[(1<<n)-1]+[(1<<(n+i-2))|sum(1<<j for j in range(i,n)) for i in range(2,n+1)]
    assert set(H)==set(expected)
    E=full
    for a in range(N):
        for b in range(N):
            if t[a][b] not in (a,b):E&=~bits[t[a][b]]
    assert intersection(H,full)==E
    depth=next(k for k in range(1,len(H)+1) if any(intersection(T,full)==E for T in combinations(H,k)))
    assert depth==(1 if n==1 else 2)
    if n>=2: assert all(h&bits[n-1] for h in H if h!=expected[-1])
    assert len(gens)==(4**n-1)//3
    return dict(n=n,carrier=N,seed_subsets=full+1,generating_sets=len(gens),irredundant_sets=len(H),depth=depth)

def group_check(t, bases, name):
    n=len(t);X=set(range(n));e=0
    def closure(A):
        S=set(A)
        while True:
            old=set(S)
            for a in old:
                for b in A:S.add(t[a][b])
            if old==S:return S
    inv=[next(b for b in X if t[a][b]==e and t[b][a]==e) for a in X]
    checks=0
    for A in bases:
        A=set(A)
        assert len(A)>=4 and closure(A)==X and all(closure(A-{a})!=X for a in A)
        C=X-A
        for a in A:
            b,c=next((b,c) for b,c in combinations(sorted(A-{a}),2) if t[b][c]!=e)
            p=t[b][c];q=t[inv[p]][a]
            assert p in C and q in C and t[p][q]==a
        u=min(A); B0=set()
        for a in {u,inv[u]}:
            if a in C:B0.add(a)
            else:
                b,c=next((b,c) for b,c in combinations(sorted(A-{a}),2) if t[b][c]!=e)
                p=t[b][c];B0.update((p,t[inv[p]][a]))
        assert {u,inv[u]}<=closure(B0)
        D=next(set(s) for k in range(len(A)+1) for s in combinations(sorted(A),k) if B0<=closure(set(s)))
        B=B0|{t[u][a] for a in A-{u}}
        assert B.isdisjoint(A) and closure(B)==X
        protected={t[u][a] for a in A-D-{u}}
        assert all(closure(B-{b})!=X for b in protected)
        for b in sorted(B-protected):
            if closure(B-{b})==X:B.remove(b)
        assert B.isdisjoint(A) and closure(B)==X and all(closure(B-{b})!=X for b in B)
        checks+=1
    return dict(group=name,order=n,bases_checked=checks)

def report():
    rows=[cover_census(n) for n in range(1,9)]
    X=range(16);t=[[a^b for b in X] for a in X]
    def rank4(A):
        S={0}
        for a in A:S|={s^a for s in S}
        return len(S)==16
    g=[group_check(t,(A for A in combinations(range(1,16),4) if rank4(A)),"C2^4")]
    def mul(a,b):
        i,j=a//8,(a//4)%2;k,l=b//8,(b//4)%2
        return ((i+(-1 if j else 1)*k)%4)*8+((j+l)%2)*4+((a%4)^(b%4))
    t=[[mul(a,b) for b in range(32)] for a in range(32)]
    g.append(group_check(t,[{8,4,1,2},{24,12,1,2},{8,5,1,2}],"D8 x C2^2"))
    return dict(study="23",prefix_truncations=rows,total_seed_subsets=sum(r['seed_subsets'] for r in rows),group_checks=g, note="Finite checks only; unbounded irredundant depth is proved for the infinite carrier.")
if __name__=='__main__':print(json.dumps(report(),indent=2))
