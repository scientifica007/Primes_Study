"""Exact Bayes tradeoff check for the complementary-zero-matrix promise.
Run: python3 priority/experiments/t56-expected-cost-audit.py
Each promise case is equiprobable. Every active matrix contains one uniformly
placed 1, independently. There are b active matrices in either case.
The recursion is over counts of queried bits, conditional on no hit.
A hit identifies the case, so stopping immediately is optimal.
The value is unconditional expected query count plus 2*K*error,
where K=(3*m+1)/4. This finite check does not prove the general result.
"""
from fractions import Fraction as F
from functools import lru_cache

for m in range(1, 7):
    for b in (1, 2, 3):
        K = F(3*m+1, 4)

        @lru_cache(None)
        def dp(k):
            a = c = F(1)
            for i, x in enumerate(k):
                if i < b:
                    a *= 1-F(x, m)
                else:
                    c *= 1-F(x, m)
            w = (a+c)/2
            v = K*min(a,c)  # stop and output the more probable case
            if not a or not c:
                return v
            for i in range(2*b):
                if k[i] < m:
                    t = list(k)
                    t[i] += 1
                    v = min(v, w + dp(tuple(t)))
            return v

        val = dp((0,)*(2*b))
        assert val == K, (m, b, val, K)
        print(m, b, str(val), dp.cache_info().currsize)
