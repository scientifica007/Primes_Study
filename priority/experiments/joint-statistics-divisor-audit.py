# Exact rational audit of the joint-statistics signature and divisor balancing.
# Requires sympy; run with Python 3.
from fractions import Fraction as F
from itertools import product
from math import comb, gcd, lcm
from functools import reduce
from sympy import Matrix, divisors, factorint

def orders(L):
    return [j for j in range(1, L+1) if j == 1 or j % 2 == 0]

def multiply(a, b, L):
    c = [F(0)]*(L+1)
    for i, x in enumerate(a):
        for j, y in enumerate(b[:L+1-i]):
            c[i+j] += x*y
    return c

def power(a, k, L):
    r = [F(1)]+[F(0)]*L
    while k:
        if k & 1:
            r = multiply(r, a, L)
        k >>= 1
        if k:
            a = multiply(a, a, L)
    return r

def normalized(sizes, counts, L):
    r = [F(1)]+[F(0)]*L
    for s, k in zip(sizes, counts):
        a = [F((-1)**j*comb(s+j, j+1), s) for j in range(L+1)]
        r = multiply(r, power(a, k, L), L)
    return tuple(r)

def matrix(S, L):
    ds = [int(x) for x in divisors(S)]
    ps = list(factorint(S))
    rows = [[1]*len(ds)] + [[factorint(s).get(p, 0) for s in ds] for p in ps]
    rows += [[s**j for s in ds] for j in orders(L)]
    return ds, Matrix(rows)

def least_modulus(L):
    for S in range(2, 2**(2+len(orders(L)))+1):
        ds, M = matrix(S, L)
        v = next((v for v in M.nullspace() if v[0] != 0), None)
        if v is None:
            continue
        den = lcm(*(int(x.q) for x in v))
        a = [int(x*den) for x in v]
        sign = 1 if a[0] > 0 else -1
        g = reduce(gcd, a)
        a = [sign*x//g for x in a]
        assert M*Matrix(a) == Matrix.zeros(M.rows, 1) and a[0] > 0
        pos = [max(x,0) for x in a]
        neg = [max(-x,0) for x in a]
        assert normalized(ds,pos,L) == normalized(ds,neg,L)
        return S, ds, a
    raise AssertionError('missing known power-of-two construction')

if __name__ == '__main__':
    for L in range(11):
        S, ds, a = least_modulus(L)
        print('L=', L, 'S=', S, 'old=',2**(2+len(orders(L))), 'relation=',list(zip(ds,a)), 'C=',sum(map(abs,a)), 'D=',sum(s*abs(x) for s,x in zip(ds,a)))
    sizes = [1,2,3,4,6,12]
    prime_support = [2,3]
    total = 0
    for L in range(7):
        fwd, back = {}, {}
        for counts in product(range(3), repeat=len(sizes)):
            b = sum(counts)
            pv = tuple(sum(k*factorint(s).get(p,0) for s,k in zip(sizes,counts)) for p in prime_support)
            moments = tuple(sum(k*s**j for s,k in zip(sizes,counts)) for j in orders(L))
            key = (b,pv,moments)
            series = (b,pv,normalized(sizes,counts,L))
            assert fwd.setdefault(key,series)==series
            assert back.setdefault(series,key)==key
            total += 1
        print('L=', L, 'patterns=',len(list(product(range(3),repeat=6))), 'distinct signatures=', len(fwd))
    assert total==5103
    print('PASS',total,'signature comparisons')
