"""Study 17: local generating families, intersection depths and restricted realization."""
from itertools import product
from math import gcd
import json
from finite_monoids import operation_tables_with_identity, associative
from generator_statistics_oracle import closure

def subsets(mask):
    x=mask
    while True:
        yield x
        if x==0:return
        x=(x-1)&mask

def elems(mask,n):
    return [i for i in range(n) if mask>>i&1]

def maskof(seq):
    return sum(1<<i for i in set(seq))

def depth(H,full):
    core=full
    for x in H:core &= x
    S=set(H);d=1
    while core not in S:
        S={a&b for a in S for b in H};d+=1
    return d,core

def check(n):
    count=qual_count=nr_count=empty=rect=0
    hist={};qh={}
    full=(1<<n)-1
    for t in operation_tables_with_identity(n):
        if not associative(t,n):continue
        count+=1
        C=[maskof(closure(t,elems(s,n))) for s in range(full+1)]
        H=[s for s in range(1,full+1) if C[s]==full and all(C[s^(1<<i)]!=full for i in elems(s,n))]
        J=[maskof(t[t[a*n+x]*n+b] for a in range(n) for b in range(n)) for x in range(n)]
        fam=[0];qual=True;nr=False
        local_depth=[]
        for key in sorted(set(J)):
            block=maskof(i for i in range(n) if J[i]==key)
            U=maskof(i for i in range(n) if J[i]!=key and J[i]&key==key)
            L=[s for s in subsets(block) if C[s|U]&block==block and all(C[(s^(1<<i))|U]&block!=block for i in elems(s,n))]
            fam=[a|b for a in fam for b in L]
            el=elems(block,n)
            regular=any(t[t[x*n+y]*n+x]==x for x in el for y in range(n))
            group=all(t[x*n+y] in el for x in el for y in el) and any(
                all(t[e*n+x]==x and t[x*n+e]==x and any(t[x*n+y]==e and t[y*n+x]==e for y in el) for x in el) for e in el)
            if not regular:
                nr=True
                assert set(L)==({0} if C[U]&block else {1<<x for x in el})
            elif not group:qual=False
            local_depth.append(depth(L,block)[0])
        assert sorted(fam)==sorted(H)
        d,core=depth(H,full)
        assert d==max(local_depth)
        direct=full
        for a in range(n):
            for b in range(n):
                x=t[a*n+b]
                if x!=a and x!=b:direct&=~(1<<x)
        assert direct==core
        hist[str(d)]=hist.get(str(d),0)+1
        if nr:nr_count+=1
        if qual:
            assert d<=3
            qual_count+=1
            qh[str(d)]=qh.get(str(d),0)+1
        if not core:
            empty+=1
            if len(set(J))>1:
                pairs={}
                found=False
                for i,a in enumerate(H):
                    for b in H[i+1:]:
                        key=(a&b,a|b)
                        if key in pairs and set(pairs[key]).isdisjoint({a,b}):found=True
                        pairs[key]=(a,b)
                assert found
                rect+=1
    return {"n":n,"count":count,"group_regular_classes":qual_count,"has_nonregular_class":nr_count,
            "intersection_depth_histogram":hist,"qualified_histogram":qh,"E_empty":empty,
            "E_empty_nongroups_with_rectangle":rect}

def rees(a,b):
    n=a*b+2;z=n-1;full=(1<<n)-1
    count=0;hist={};maxH=0
    for bits in product((0,1),repeat=a*b):
        if not all(any(bits[j*a+i] for i in range(a)) for j in range(b)):continue
        if not all(any(bits[j*a+i] for j in range(b)) for i in range(a)):continue
        def mul(x,y):
            if x==0:return y
            if y==0:return x
            if x==z or y==z:return z
            i,j=divmod(x-1,b);l,m=divmod(y-1,b)
            return 1+i*b+m if bits[j*a+l] else z
        t=tuple(mul(x,y) for x in range(n) for y in range(n))
        assert associative(t,n)
        C={s:maskof(closure(t,elems(s,n))) for s in range(1,full+1,2)}
        H=[s for s in C if C[s]==full and all(C[s^(1<<i)]!=full for i in elems(s,n) if i)]
        d,_=depth(H,full)
        hist[str(d)]=hist.get(str(d),0)+1
        count+=1;maxH=max(maxH,len(H))
    return {"rows":a,"columns":b,"order":n,"regular_support_matrices":count,
            "depth_histogram":hist,"max_irredundant_sets":maxH}

def clutters(n):
    full=(1<<n)-1
    count=cases=max_order=0
    for mask in range(1,1<<full):
        H=[i+1 for i in range(full) if mask>>i&1]
        if any(x!=y and x&y==x for x in H for y in H):continue
        def gen(s):return any(s&x==x for x in H)
        B=[s for s in range(full+1) if not gen(s) and all(s>>i&1 or gen(s|1<<i) for i in range(n))]
        ps=[2,3,5,7,11,13][:len(B)]
        primes=ps+[17]
        N=1
        for p in primes:N*=p
        A=[]
        for i in range(n):
            residues=[int(not(s>>i&1)) for s in B]+[i+1]
            A.append(sum(r*(N//p)*pow(N//p,-1,p) for r,p in zip(residues,primes))%N)
        assert len(set(A))==n
        for s in range(full+1):
            assert (gcd(N,*(A[i] for i in elems(s,n)))==1)==gen(s)
            cases+=1
        count+=1;max_order=max(max_order,N)
    return {"vertices":n,"clutters":count,"seed_subsets_checked":cases,"max_cyclic_order":max_order}

def report():
    return {"study":"T61-T65","monoids":[check(n) for n in range(1,5)],
            "rees":[rees(a,b) for a,b in [(1,2),(2,2),(2,3),(3,3)]],
            "restricted_cyclic_realization":[clutters(n) for n in range(1,5)],
            "note":"Labelled finite monoids and support matrices; restricted CRT realization is not unrestricted."}

if __name__=="__main__":print(json.dumps(report(),indent=2))
