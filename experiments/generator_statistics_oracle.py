"""Study 15: fixed irredundant generator statistics; matched initial counts."""
from itertools import product
from math import comb
import json
from finite_monoids import associative
from green_metadata_adversary import build as component, fingerprint

SIZES = (1,2,2,4)

def build(p,q,matrices):
    if p<1 or q<1 or len(matrices)!=4 or any(len(w)!=p*q or any(b not in (0,1) for b in w) for w in matrices):
        raise ValueError("invalid matrices")
    if {i for i,w in enumerate(matrices) if not any(w)} not in ({0,3},{1,2}):
        raise ValueError("invalid promise")
    N=2*(p+q)+6
    labels=[(0,g,h) for g in range(4) for h in range(4)]
    labels += [(i,x,c) for i,s in enumerate(SIZES,1) for x in range(4,N) for c in range(s)]
    labels += [(5,0,0)]
    loc={x:i for i,x in enumerate(labels)}
    tables=[component(p,q,w) for w in matrices]
    def mul(a,b):
        i,x,c=a
        j,y,d=b
        if i==5 or j==5 or (i and j and i!=j):
            return labels[-1]
        if i==j==0:
            return (0,(x+y)%4,(c+d)%4)
        k=i or j
        return (k,tables[k-1][x*N+y],(c+d)%SIZES[k-1])
    return tuple(loc[mul(a,b)] for a in labels for b in labels), labels

def closure(t,seeds):
    n=round(len(t)**.5)
    seeds=tuple(seeds)
    seen=set(seeds)
    todo=list(seen)
    for x in todo:
        for y in seeds:
            z=t[x*n+y]
            if z not in seen:
                seen.add(z);todo.append(z)
    return seen

def unit_check():
    def add(x,y):
        return (((x//4+y//4)%4)*4+(x%4+y%4)%4)
    t=tuple(add(x,y) for x in range(16) for y in range(16))
    pairs=0
    for mask in range(1,1<<16):
        seeds=[i for i in range(16) if mask>>i&1]
        actual=len(closure(t,seeds))==16
        images={(i//4%2,i%2) for i in seeds}-{(0,0)}
        assert actual==(len(images)>=2)
        if actual and len(seeds)==2:pairs+=1
    assert pairs==48
    return {"nonempty_subsets":65535,"irredundant_pairs":pairs}

def check(p,q,full):
    m=p*q
    N=2*(p+q)+6
    masks=list(product((0,1),repeat=m))[1:] if full else [tuple(int(i==j) for i in range(m)) for j in range(m)]
    zero=(0,)*m
    baseline=None
    total=empty=0
    for a,b in product(masks,repeat=2):
        for ws in ((zero,a,b,zero),(a,zero,zero,b)):
            t,L=build(p,q,ws)
            n=len(L)
            assert n==18*(p+q)+35 and associative(t,n)
            f=fingerprint(t)
            local=tuple(t[x*n+y] for x in range(n) for y in range(n) if f[2][x]==f[2][y])
            if baseline is None:baseline=(f,local)
            assert baseline==(f,local) and f[4]==tuple(range(16))
            E=set(range(n))
            for x in range(n):
                for y in range(n):
                    z=t[x*n+y]
                    if z!=x and z!=y:E.discard(z)
            assert E==({L.index((1,N-2,0))} if not any(ws[0]) else set())
            # Required disjoint blocks, and an explicit generating set.
            blocks=[]
            for i in range(1,5):
                for x in range(4,N-2,2):
                    blocks.append({k for k,(j,y,c) in enumerate(L) if j==i and y in (x,x+1)})
                if not any(ws[i-1]):
                    blocks.append({k for k,(j,y,c) in enumerate(L) if j==i and y==N-2})
            assert len(set.union(*blocks))==sum(map(len,blocks))
            seeds=[1,4]+[min(block) for block in blocks]
            assert len(seeds)==4*(p+q)+4 and len(closure(t,seeds))==n
            for block in blocks:
                assert closure(t,set(range(n))-block).isdisjoint(block)
            count=48
            for block in blocks:count*=len(block)
            assert count==192*256**(p+q)
            total+=1;empty+=not E
    return {"p":p,"q":q,"n":n,"full":full,"tables":total,"empty":empty,
            "rank":4*(p+q)+4,"irredundant_count":str(192*256**(p+q))}

def mul(a,b,L):
    c=[0]*(L+1)
    for i,x in enumerate(a):
        for j,y in enumerate(b):
            if i+j<=L:c[i+j]+=x*y
    return c

def power(a,e,L):
    r=[1]
    while e:
        if e%2:r=mul(r,a,L)
        a=mul(a,a,L);e//=2
    return r

def moments(L):
    a=[1]
    for root in [1,1]+[2**j for j in range(1,L+1)]:
        b=[0]*(len(a)+1)
        for i,x in enumerate(a):
            b[i]-=root*x;b[i+1]+=x
        a=b
    if a[0]<0:a=[-x for x in a]
    k=[0,0];logs=[0,0];sums=[0,0];polys=[[1],[1]]
    for i,x in enumerate(a):
        side=int(x<0);e=abs(x);s=2**i
        k[side]+=e;logs[side]+=i*e;sums[side]+=s*e
        polys[side]=mul(polys[side],power([comb(s,j+1) if j+1<=s else 0 for j in range(L+1)],e,L),L)
    for side in range(2):
        polys[side]=mul(polys[side],power([1,1],sums[1-side],L),L)
    assert k[0]==k[1] and logs[0]==logs[1] and polys[0]==polys[1]
    for j in range(1,L+1):assert sum(x*2**(i*j) for i,x in enumerate(a))==0
    return {"L":L,"coefficients":[str(x) for x in a],"zero_components_each":k[0],
            "sum_sizes":sums,"matched_coefficients":L+1}

def report():
    units=unit_check()
    rows=[check(p,q,full) for p,q,full in [(1,1,True),(1,2,True),(2,1,True),(2,2,False)]]
    return {"study":"T53-T56","units":units,"rows":rows,
            "total_tables_verified":sum(x["tables"] for x in rows),
            "matched_initial_generating_coefficients":[moments(i) for i in range(5)],
            "note":"Labelled tables for T54; single-bit nonzero matrices at 2x2. T56 checks truncated polynomial identities, not full tables."}

if __name__=="__main__":
    print(json.dumps(report(),indent=2))
