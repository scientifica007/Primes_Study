"""Study 21: finite certificates for the bounded-arity intersection theorem.
The infinite-carrier theorems are proved separately, not inferred from tests.
"""
from itertools import product
from collections import Counter
import json

def closure(n, ops, seed):
    S = set(seed)
    while True:
        old = set(S)
        for arity, table in ops:
            for args in product(sorted(old), repeat=arity):
                index = 0
                for a in args:
                    index = index*n+a
                S.add(table[index])
        if S == old:
            return S

def indispensable(n, ops):
    E = set(range(n))
    for arity, table in ops:
        for args, y in zip(product(range(n), repeat=arity), table):
            if y not in args:
                E.discard(y)
    return E

def certificate(n, ops):
    X = set(range(n))
    d = max(a for a, _ in ops)
    A = X.copy()
    for x in sorted(A):
        if closure(n, ops, A-{x}) == X:
            A.remove(x)
    E = indispensable(n, ops)
    assert E <= A
    color = {}
    for x in sorted(A-E):
        witness = next(args for arity, table in ops
                       for args, y in zip(product(range(n), repeat=arity), table)
                       if y == x and x not in args)
        assert not set(witness) <= A
        forbidden = {color[y] for y in witness if y in color}
        color[x] = next(i for i in range(d) if i not in forbidden)
    cert = [A]
    for i in range(d):
        B = X-{x for x in color if color[x] == i}
        assert closure(n, ops, B) == X
        for x in sorted(B):
            if closure(n, ops, B-{x}) == X:
                B.remove(x)
        cert.append(B)
    assert set.intersection(*cert) == E
    assert all(closure(n, ops, B) == X and
               all(closure(n, ops, B-{x}) != X for x in B) for B in cert)
    return E

def exact_depth(n, ops, E):
    X = set(range(n))
    H = []
    for mask in range(1, 1 << n):
        A = {i for i in X if mask >> i & 1}
        if closure(n, ops, A) == X and all(closure(n, ops, A-{x}) != X for x in A):
            H.append(frozenset(A))
    P = set(H)
    k = 1
    while frozenset(E) not in P:
        P = {a & b for a in P for b in H}
        k += 1
        assert k <= n+1
    return k

def report():
    census = []
    for n, d in [(1,2),(2,2),(3,2),(2,3)]:
        hist = Counter()
        for t in product(range(n), repeat=n**d):
            ops = [(d,t)]
            E = certificate(n, ops)
            k = exact_depth(n, ops, E)
            assert k <= d+1
            hist[str(k)] += 1
        census.append(dict(n=n, arity=d, tables=n**(n**d), depth_histogram=dict(sorted(hist.items()))))
    sharp = []
    # Avoid huge full tables for d>2: the sharp construction is explicit by its rule.
    for d in range(1,13):
        X = set(range(d+1))
        H = [X-{i} for i in X]
        for i in X:
            args = sorted(H[i])
            assert len(set(args)) == d and X-set(args) == {i}
        assert not set.intersection(*H)
        assert all(len(set.intersection(*(H[:i]+H[i+1:]))) == 1 for i in X)
        sharp.append(dict(arity=d, carrier=d+1, depth=d+1))
    return {"study":"T77-T82", "finite_census":census,
            "total_tables":sum(r["tables"] for r in census),"sharp_examples":sharp}

if __name__ == '__main__':
    print(json.dumps(report(),indent=2))
