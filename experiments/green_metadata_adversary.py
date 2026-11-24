#!/usr/bin/env python3
"""Study 13: exact quadratic oracle obstruction with fixed Green metadata."""
from itertools import product
import json
from pathlib import Path
from finite_monoids import associative, E
from green_structural_monoids import unit_elements
from layered_oracle_decision import Oracle, orbit_data, orbit_E

def build(p,q,bits):
    """C4, right-zero A (2p), left-zero B (2q), t, absorbing z."""
    if p<1 or q<1 or len(bits)!=p*q or any(b not in (0,1) for b in bits):
        raise ValueError("invalid bit matrix")
    a0,b0=4,4+2*p
    t,z=b0+2*q,b0+2*q+1
    n=z+1
    def layer(x):
        return 0 if x<a0 else 1 if x<b0 else 2 if x<t else 3 if x==t else 4
    def mul(x,y):
        i,j=layer(x),layer(y)
        if i==0 and j==0: return (x+y)%4
        if i==0:
            return b0+((y-b0)^ (x%2)) if j==2 else y
        if j==0:
            return a0+((x-a0)^ (y%2)) if i==1 else x
        if i==j==1: return y
        if i==j==2: return x
        if i==1 and j==2:
            return t if bits[((x-a0)//2)*q+(y-b0)//2] else z
        if (i,j) in ((1,3),(3,2)): return t
        return z
    return tuple(mul(x,y) for x in range(n) for y in range(n))

def fingerprint(tab):
    n=round(len(tab)**.5)
    R=tuple(frozenset(tab[x*n+y] for y in range(n)) for x in range(n))
    L=tuple(frozenset(tab[y*n+x] for y in range(n)) for x in range(n))
    J=tuple(frozenset(tab[a*n+b] for a in L[x] for b in range(n)) for x in range(n))
    # J classes, and principal factor multiplication, including lower products
    # replaced by a formal zero -1 (also fine for the minimal class).
    classes=tuple(tuple(y for y in range(n) if J[y]==J[x]) for x in range(n))
    blocks=tuple(sorted(set(classes)))
    factors=tuple((block,tuple(tab[a*n+b] if tab[a*n+b] in block else -1
                               for a in block for b in block)) for block in blocks)
    U=unit_elements(tab,n,0)
    return (R,L,J,factors,U,
            tuple((tab[g*n+x],tab[x*n+g]) for g in U for x in range(n)),
            tuple(x for x in range(n) if tab[x*n+x]==x),
            tuple(x for x in range(n) if any(tab[tab[x*n+y]*n+x]==x for y in range(n))))

def verify(p,q,complete=True):
    k=p*q
    base=build(p,q,(0,)*k)
    n=2*(p+q)+6
    t,z=n-2,n-1
    f=fingerprint(base)
    G=set(range(4)); A=set(range(4,4+2*p)); B=set(range(4+2*p,t))
    for x in range(n):
        if x in G: r=l=j=set(range(n))
        elif x in A: r=A|{t,z}; l={x,z}; j=A|{t,z}
        elif x in B: r={x,z}; l=B|{t,z}; j=B|{t,z}
        elif x==t: r=l=j={t,z}
        else: r=l=j={z}
        assert f[0][x]==r and f[1][x]==l and f[2][x]==j
    assert f[4]==(0,1,2,3)
    assert f[6]==tuple([0]+list(range(4,t))+[z])
    assert f[7]==tuple(x for x in range(n) if x!=t)
    masks=product((0,1),repeat=k) if complete else [
        (0,)*k,*[tuple(int(i==j) for i in range(k)) for j in range(k)]]
    count=empty=0
    for bits in masks:
        tab=build(p,q,bits)
        assert associative(tab,n)
        assert fingerprint(tab)==f
        assert E(tab,n)==(() if any(bits) else (t,))
        changed={(a,b) for a in range(n) for b in range(n) if tab[a*n+b]!=base[a*n+b]}
        expected={(4+2*i+r,4+2*p+2*j+s)
                  for i in range(p) for j in range(q) if bits[i*q+j]
                  for r in range(2) for s in range(2)}
        assert changed==expected
        count+=1
        empty+=bool(any(bits))
    # Reuse Study 12 algorithm with supplied metadata; trace confirms all
    # independent blocks are visited in the base case.
    prep=Oracle(base)
    orbits=orbit_data(n,0,f[4],prep,unit_generators=(1,))
    o=Oracle(base)
    out=orbit_E(n,0,f[4],o,orbits,f[2])
    assert out["E"]==[t]
    touched={((a-4)//2,(b-4-2*p)//2) for a,b in o.trace if a in A and b in B}
    assert len(touched)==k
    return {"p":p,"q":q,"n":n,"independent_bits":k,
            "complete_enumeration":complete,"tables_verified":count,
            "E_empty_tables":empty,"base_E":[t],
            "fixed_metadata_verified":True,
            "all_blocks_queried_on_base":True,
            "orbit_Green_queries_on_base":o.calls}

def report():
    rows=[verify(p,q) for p,q in ((1,1),(1,2),(2,1),(2,2),(2,3),(3,2),(3,3))]
    rows.append(verify(4,4,False))
    return {"study":"T47-T49","rows":rows,
            "total_tables_verified":sum(x["tables_verified"] for x in rows),
            "note":"Labelled tables, not isomorphism classes. Exact oracle lower bound on the promised family is p*q."}

if __name__=="__main__":
    print(json.dumps(report(),indent=2))
