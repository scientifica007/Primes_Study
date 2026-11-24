"""Study 14: two orthogonal ideals, common C12 units, fixed rank.
Run python3 experiments/fixed_rank_oracle.py.
"""
from itertools import product
import json
from green_metadata_adversary import build as component, fingerprint
from finite_monoids import associative, E

def build(p,q,W,V):
    if p<1 or q<1 or len(W)!=p*q or len(V)!=p*q:
        raise ValueError("matrix size")
    if bool(any(W))==bool(any(V)):
        raise ValueError("exactly one matrix must be nonzero")
    N=2*(p+q)+6
    U=12
    labels=[(0,g,0) for g in range(U)]
    labels += [(1,x,0) for x in range(4,N)]
    labels += [(2,x,c) for x in range(4,N) for c in range(3)]
    labels += [(3,0,0)]
    loc={x:i for i,x in enumerate(labels)}
    T={1:component(p,q,W),2:component(p,q,V)}
    zero=labels[-1]
    def mul(a,b):
        s,x,c=a
        r,y,d=b
        if s==3 or r==3: return zero
        if s==r==0: return (0,(x+y)%12,0)
        if s==0:
            return (r,T[r][(x%4)*N+y],(x+d)%3 if r==2 else 0)
        if r==0:
            return (s,T[s][x*N+y%4],(c+y)%3 if s==2 else 0)
        if s!=r: return zero
        return (s,T[s][x*N+y],(c+d)%3 if s==2 else 0)
    table=tuple(loc[mul(a,b)] for a in labels for b in labels)
    return table,labels

def closure(table, seeds):
    n=int(len(table)**.5)
    S=set(seeds)|{0}
    while True:
        nxt=S|{table[a*n+b] for a in S for b in S}
        if nxt==S:return S
        S=nxt

def check(p,q,complete=True):
    m=p*q
    zero=(0,)*m
    masks=(list(product((0,1),repeat=m))[1:] if complete else
           [tuple(int(i==j) for i in range(m)) for j in range(m)])
    base=None
    count=empty=0
    rank=2*(p+q)+2
    N=2*(p+q)+6
    for w in masks:
        for W,V in ((zero,w),(w,zero)):
            T,L=build(p,q,W,V)
            n=len(L)
            assert n==8*(p+q)+21
            assert associative(T,n)
            f=fingerprint(T)
            if base is None:base=f
            assert base==f
            assert f[4]==tuple(range(12))
            target=L.index((1,N-2,0))
            assert E(T,n)==(() if any(W) else (target,))
            # Necessary disjoint generator blocks, verified independently
            # by checking closure of the complement of each block.
            blocks=[set(range(1,12))]
            seeds=[1]
            for s in (1,2):
                for x in range(4,N-2,2):
                    block={i for i,(r,y,c) in enumerate(L)
                           if r==s and y in (x,x+1)}
                    blocks.append(block)
                    seeds.append(L.index((s,x,0)))
                if not any(W if s==1 else V):
                    block={i for i,(r,y,c) in enumerate(L) if r==s and y==N-2}
                    blocks.append(block)
                    seeds.append(L.index((s,N-2,0)))
            assert len(blocks)==len(seeds)==rank
            assert len(set.union(*blocks))==sum(map(len,blocks))
            for block in blocks:
                assert closure(T,set(range(n))-block).isdisjoint(block)
            assert len(closure(T,seeds))==n
            count+=1
            empty+=bool(any(W))
    return {"p":p,"q":q,"n":8*(p+q)+21,"rank":rank,
            "complete_promise":complete,"tables_verified":count,
            "E_empty_tables":empty,"identical_metadata":True,
            "rank_lower_and_upper_certificates":True}

def report():
    rows=[check(p,q) for p,q in ((1,1),(1,2),(2,1),(2,2),(2,3))]
    rows.append(check(3,3,False))
    return {"study":"T50-T52","rows":rows,
            "total_tables_verified":sum(x["tables_verified"] for x in rows),
            "note":"Labelled tables; complete promise in specified sizes, single-bit nonzero matrices at 3x3."}

if __name__=="__main__":
    print(json.dumps(report(),indent=2))
