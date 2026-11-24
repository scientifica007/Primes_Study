"""Study 22: exhaustive finite repair checks and bounded direct-sum quotients.
Infinite claims are proved in the text, not inferred from truncations.
"""
from itertools import product
import json


def subsets(mask):
    s = mask
    while True:
        yield s
        if not s:
            return
        s = (s-1)&mask


def elements(s, n):
    return [i for i in range(n) if s>>i&1]


def repair_census():
    rows = []
    for n in range(1,4):
        allmask = (1<<n)-1
        total = repairs = protected = 0
        for table in product(range(n), repeat=n*n):
            C = []
            for mask in range(allmask+1):
                s = mask
                while True:
                    old = s
                    for x in elements(old,n):
                        for y in elements(old,n):
                            s |= 1<<table[x*n+y]
                    if s == old:
                        break
                C.append(s)
            G = [s for s in range(1,allmask+1) if C[s] == allmask]
            H = [s for s in G if all(C[s^(1<<x)] != allmask for x in elements(s,n))]
            for A in H:
                for B in G:
                    for F in subsets(A & ~B):
                        # Choose finite W from B generating all removed elements.
                        W = next(w for w in sorted(subsets(B),key=lambda x:(x.bit_count(),x)) if C[w]&F == F)
                        # Choose a support D inside the original basis A for W.
                        D = next(d for d in sorted(subsets(A),key=lambda x:(x.bit_count(),x)) if C[d]&W == W)
                        T = (A & ~F) | W
                        P = A & ~(F|D)
                        assert C[T] == allmask and not T&F
                        assert all(C[T^(1<<x)] != allmask for x in elements(P,n))
                        for x in elements(T&~P,n):
                            if C[T^(1<<x)] == allmask:
                                T ^= 1<<x
                        assert T in H and T&P == P and not T&F and not T&~(A|B)
                        repairs += 1
                        protected += P.bit_count()
            total += 1
        rows.append(dict(n=n,tables=total,repair_cases=repairs,protected_element_checks=protected))
    return rows


def quotient_census():
    # Exhaustive finite cyclic-direct-sum truncations, capped at 100000 elements.
    rows = []
    for p,n in [(2,2),(2,3),(2,4),(2,5),(3,2),(3,3),(3,4),(5,2),(5,3)]:
        mod = [p**i for i in range(1,n+1)]
        N = mod[-1]
        # b_i = e_i - p e_(i+1); eliminate the first n-1 coordinates.
        # phi(x) = sum_i x_i p^(n-i) mod p^n.
        sizes = [0]*N
        cases = 0
        for x in product(*(range(m) for m in mod)):
            phi = sum(v*(N//m) for v,m in zip(x,mod))%N
            y=list(x)
            for i in range(n-1):
                a=y[i]
                y[i]=0
                y[i+1]=(y[i+1]+p*a)%mod[i+1]
            assert all(v==0 for v in y[:-1]) and y[-1]==phi
            sizes[phi]+=1
            cases+=1
        assert len(set(sizes))==1 and sizes[0]>0
        # The finite quotient's order and fibres; the infinite direct limit is Prüfer.
        rows.append(dict(p=p,n=n,group_order=cases,quotient_order=N,kernel_order=sizes[0]))
    return rows


def report():
    r=repair_census(); q=quotient_census()
    return dict(study='T83-T87',finite_repair=r,total_tables=sum(x['tables'] for x in r),total_repair_cases=sum(x['repair_cases'] for x in r),quotient_truncations=q,total_quotient_elements=sum(x['group_order'] for x in q),note='Finite checks only. Finite truncations have minimal generating sets; the infinite obstruction requires unbounded order.')

if __name__=='__main__':
    print(json.dumps(report(),indent=2))
