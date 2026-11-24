# NumPy audit of composite shared-target modulus S=12, L=2.
import numpy as np
from math import prod
S=12
sizes=[1]*6+[2]*21+[3]*10+[4]*15+[6]*11+[12]
positive=[i for i,s in enumerate(sizes) if s in (1,3,4,12)]
negative=[i for i,s in enumerate(sizes) if s in (2,6)]
assert len(positive)==len(negative)==32
assert prod(sizes[i] for i in positive)==prod(sizes[i] for i in negative)
assert all(sum(sizes[i]**j for i in positive)==sum(sizes[i]**j for i in negative) for j in (1,2))
p=q=4
els=[('G',0,u,c) for c in range(S) for u in range(4)]
els += [('A',i,u,c) for i in range(p) for u in range(2) for c in range(S)]
els += [('B',j,v,0) for j in range(q) for v in range(2)]
els += [('t',i,0,c) for i,s in enumerate(sizes) for c in range(s)]
els += [('z',0,0,0)]
idx={x:i for i,x in enumerate(els)}; n=len(els); z=n-1; G=4*S
K=np.array([i for i,x in enumerate(els) if x[0] in ('t','z')]); outside=np.array([i for i,x in enumerate(els) if x[0] not in ('t','z')]); I=np.arange(n)

def build(labels):
    def f(x,y):
        X,i,u,c=x;Y,j,v,d=y
        if X=='z' or Y=='z':return z
        if X==Y=='G':return idx[('G',0,(u+v)%4,(c+d)%S)]
        if X=='G':
            if Y=='A':return idx[('A',j,v,(c+d)%S)]
            if Y=='B':return idx[('B',j,(u+v)%2,0)]
            if Y=='t':return idx[('t',j,0,(c+d)%sizes[j])]
        if Y=='G':return idx[('A',i,(u+v)%2,c)] if X=='A' else idx[x]
        if X==Y=='A':return idx[('A',j,v,c)]
        if X==Y=='B':return idx[x]
        if X=='A' and Y=='B':
            l=labels[2*(i*q+j)+(u+v)%2];return idx[('t',l,0,c%sizes[l])]
        if X=='A' and Y=='t':return idx[('t',j,0,c%sizes[j])]
        if X=='t' and Y=='B':return idx[x]
        return z
    return np.array([[f(x,y) for y in els] for x in els],dtype=np.int32)

def check(T,absent):
    assert np.array_equal(T[0],I) and np.array_equal(T[:,0],I)
    for i in I:assert np.array_equal(T[T[i],:],T[i,T])
    E=set(I)
    for i in I:E.difference_update(int(T[i,j]) for j in I if T[i,j]!=i and T[i,j]!=j)
    assert E=={idx[('t',l,0,0)] for l in absent if sizes[l]==1}
    R=[tuple(np.unique(T[i])) for i in I];L=[tuple(np.unique(T[:,i])) for i in I];J=[tuple(np.unique(T[list(L[i]),:])) for i in I]
    reg=tuple(bool(np.any(T[T[i],i]==i)) for i in I);idem=tuple(T.diagonal()==I)
    blocks=[{idx[('A',i,u,c)] for u in range(2) for c in range(S)} for i in range(p)]+[{idx[('B',j,v,0)] for v in range(2)} for j in range(q)]+[{idx[('t',l,0,c)] for c in range(sizes[l])} for l in absent]
    for B in blocks:
        C=sorted(set(I)-B);assert not np.isin(T[np.ix_(C,C)],list(B)).any()
    X={idx[('G',0,1,0)],idx[('G',0,0,1)]}|{min(B) for B in blocks}
    cl=set(X)
    while True:
        nxt=cl|set(np.unique(T[np.ix_(sorted(cl),sorted(cl))]))
        if nxt==cl:break
        cl=nxt
    assert len(cl)==n and len(X)==2+p+q+len(absent)
    return R,L,J,reg,idem,E
T1,T2=build(positive),build(negative)
a,b=check(T1,negative),check(T2,positive)
assert a[:5]==b[:5]
assert np.array_equal(T1[K,:],T2[K,:]) and np.array_equal(T1[:,K],T2[:,K])
assert np.array_equal(T1[:G,:],T2[:G,:]) and np.array_equal(T1[:,:G],T2[:,:G])
assert np.array_equal(np.where(np.isin(T1[np.ix_(outside,outside)],K),-1,T1[np.ix_(outside,outside)]),np.where(np.isin(T2[np.ix_(outside,outside)],K),-1,T2[np.ix_(outside,outside)]))
for C in a[0]+a[1]+a[2]:
    if len(C)<n:assert np.array_equal(T1[np.ix_(C,C)],T2[np.ix_(C,C)])
print('PASS composite S=12; n=',n,'rank=',2+p+q+32,'E sizes=',len(a[-1]),len(b[-1]),'triples=',2*n**3)
