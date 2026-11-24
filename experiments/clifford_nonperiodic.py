"""Study 26: deterministic DAG layering and exact integer-group checks.
Infinite results are proved in the study, not inferred from finite samples.
"""
from itertools import combinations, product
from collections import deque, Counter
from math import gcd
import json

def layers(edges, order):
    covered=set();level={};n=0;it=iter(order)
    while len(covered)<len(edges):
        nxt=covered|{v for u in covered for v in edges[u]}
        x=next(it,None)
        if x is not None:nxt.add(x)
        for v in nxt-covered:level[v]=n
        covered=nxt;n+=1
    assert all(level[v]<=level[u]+1 for u in edges for v in edges[u])
    assert all(level[v]<=level[u] for u in edges for v in edges[u] if level[v]%2==level[u]%2)
    return level

def graph_census():
    rows=[]
    for n in range(1,7):
        pairs=list(combinations(range(n),2));checks=0;max_degree=0
        for m in range(1<<len(pairs)):
            edges={i:set() for i in range(n)}
            for k,(u,v) in enumerate(pairs):
                if m>>k&1:edges[u].add(v)
            for order in (list(range(n)),list(reversed(range(n))),list(range(0,n,2))+list(range(1,n,2))):
                L=layers(edges,order)
                longest={}
                for u in reversed(range(n)):
                    longest[u]=max((1+longest[v] for v in edges[u] if L[v]%2==L[u]%2),default=1)
                    assert longest[u]<=sum(l<=L[u] and l%2==L[u]%2 for l in L.values())
                checks+=1
            max_degree=max(max_degree,max(map(len,edges.values())))
        rows.append(dict(vertices=n,graphs=1<<len(pairs),layering_checks=checks,max_outdegree=max_degree))
    return rows

def project(maps,j,i,x):
    for k in range(i,j):x*=maps[k]
    return x

def positive_Z(values):
    vals=list(values);g=0
    for v in vals:g=gcd(g,v)
    return g==1 and any(v>0 for v in vals) and any(v<0 for v in vals)

def generates(maps,A):
    n=len(maps)+1
    return all(any(j==i for j,_ in A) and positive_Z(project(maps,j,i,x) for j,x in A if j>=i) for i in range(n))

def irredundant(maps,A):
    return generates(maps,A) and all(not generates(maps,A-{a}) for a in A)

def inverse_word(maps,A,i,w):
    terms=sorted((j,x,project(maps,j,i,x)) for j,x in A if j>i)
    terms=[t for t in terms if t[2]]
    pred={0:None};todo=deque([0]);target=-w
    while target not in pred:
        if not todo:raise AssertionError('missing inverse')
        z=todo.popleft()
        for j,x,v in terms:
            s=z+v
            if s not in pred:pred[s]=(z,j,x);todo.append(s)
    word=[];z=target
    while z:
        z,j,x=pred[z];word.append((j,x))
    assert word and sum(project(maps,j,i,x) for j,x in word)==target
    return word

def certificates(maps,A):
    n=len(maps)+1;assert irredundant(maps,A)
    W=[abs(maps[i]) if i<n-1 else 0 for i in range(n)]
    trans={};stable=set();words={}
    for i in range(n):
        local={x for j,x in A if j==i}
        if not W[i]:
            assert positive_Z(local);stable.add(i);continue
        j,x=next((j,x) for j,x in sorted(A) if j>i and project(maps,j,i,x))
        w=project(maps,j,i,x);trans[i]=w
        words[i]=inverse_word(maps,A,i,w)
        shifted={x+w for x in local}
        assert local.isdisjoint(shifted)
    edges={i:{j for j,x in words[i] if j in trans} for i in trans}
    L=layers(edges,sorted(edges)) if edges else {}
    B=[]
    for c in range(2):
        b=set()
        for i,x in A:
            if i in stable:continue
            b.add((i,x+trans[i]) if L[i]%2==c else (i,x))
        for i in stable:
            b.update((i,x) for x in ((-1,1) if c==0 else (-2,3)))
        assert irredundant(maps,b)
        recovered=set(stable)|{i for i in trans if L[i]%2!=c}
        for i in reversed(range(n)):
            if i in recovered:continue
            assert all(j in recovered for j,x in words[i]);recovered.add(i)
        assert len(recovered)==n
        B.append(b)
    assert not B[0]&B[1]
    return sum(map(len,edges.values())),max((len(w) for w in words.values()),default=0)

def integer_census():
    rows=[]
    for n in range(1,6):
        models=checked=edges=max_word=0
        for maps in product((-2,-1,0,1,2),repeat=n-1):
            models+=1
            for style in range(4):
                A=set()
                for i in range(n):
                    m=abs(maps[i]) if i<n-1 else 0
                    if not m:vals=((-1,1),(-2,3),(-3,2),(-1,2))[style]
                    elif m==1:vals=(0,1,-2,3)[style:style+1]
                    else:vals=(1,-1,3,-3)[style:style+1]
                    A.update((i,x) for x in vals)
                e,w=certificates(maps,A);edges+=e;max_word=max(max_word,w);checked+=1
        rows.append(dict(layers=n,models=models,bases_checked=checked,dependency_edges=edges,max_inverse_word_length=max_word))
    return rows

def report():
    g=graph_census();z=integer_census()
    return dict(study=26,dag_census=g,dag_total=sum(x['graphs'] for x in g),layering_checks=sum(x['layering_checks'] for x in g),integer_chain_census=z,integer_models=sum(x['models'] for x in z),integer_bases=sum(x['bases_checked'] for x in z),note='Integer local groups are infinite; generation checks use the exact gcd-and-sign criterion, not finite quotients. Finite layer counts only; arbitrary carriers follow from proof.')

if __name__=='__main__':print(json.dumps(report(),indent=2))
