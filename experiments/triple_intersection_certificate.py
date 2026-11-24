"""Study 18: construct three irredundant generating sets with intersection E."""
from itertools import product
import json
from finite_monoids import operation_tables_with_identity, associative
from generator_statistics_oracle import closure

def certificate(t):
    n=round(len(t)**.5)
    X=set(range(n))
    def mul(a,b):return t[a*n+b]
    R=[frozenset(mul(a,b) for b in X) for a in X]
    L=[frozenset(mul(b,a) for b in X) for a in X]
    J=[frozenset(y for x in L[a] for y in R[x]) for a in X]
    E=X.copy()
    for a in X:
        for b in X:
            x=mul(a,b)
            if x!=a and x!=b:E.discard(x)
    C=[set(),set(),set()];types={}
    for key in dict.fromkeys(J):
        B={a for a in X if J[a]==key}
        U={a for a in X if J[a]>key}
        cells={}
        for a in sorted(B):cells.setdefault((R[a],L[a]),set()).add(a)
        H=list(cells.values())
        groups=[h for h in H if any(mul(x,x)==x for x in h)]
        size=len(H[0])
        assert all(len(h)==size for h in H) if groups else True
        def good(S):return B<=closure(t,U|S)
        if not groups or size==1 and (len({R[a] for a in B})==1 or len({L[a] for a in B})==1):
            typ="trivial_line" if groups else "nonregular"
            base=closure(t,U)
            reach={a:closure(t,U|{a}) for a in B}
            A=set();D=set()
            for a in sorted(B-base):
                eq={b for b in B if b in reach[a] and a in reach[b]}
                if a!=min(eq):continue
                if any(a in reach[b] and b not in reach[a] for b in B-base):continue
                A.add(a);D.add(max(eq))
            opts=[A,D,A]
        elif size==1:
            typ="trivial_grid"
            piv=[min(h) for h in groups]
            a,b=next((a,b) for a in piv for b in piv if R[a]!=R[b] and L[a]!=L[b])
            A={x for x in B if R[x]==R[a] or L[x]==L[a]}
            D={x for x in B if R[x]==R[b] or L[x]==L[b]}
            opts=[A,D,B-((A&D)-E)]
        elif size==2 and len(H)==1:
            typ="group_two"
            a,b=sorted(B)
            allopts=[S for S in [set(),{a},{b},B] if good(S)]
            mins=[S for S in allopts if not any(T<S for T in allopts)]
            opts=[mins[0],mins[-1],mins[0]]
        else:
            typ="nontrivial_two" if size==2 else "nontrivial_large"
            color={x:int(i!=0) for h in H for i,x in enumerate(sorted(h))}
            if size==2:
                assert len(groups)>=2
                for i,h in enumerate(groups[:2]):
                    e=next(x for x in h if mul(x,x)==x)
                    color[next(x for x in h if x!=e)]=i
                    color[e]=1-i
            else:
                K=groups[0];A=K.copy()
                for a in sorted(A):
                    if closure(t,A-{a})==K:A.remove(a)
                if len(A)==1:
                    g=next(iter(A));e=next(x for x in K if mul(x,x)==x)
                    D={next(x for x in K if mul(x,g)==e)}
                    F=A
                else:
                    def trans(g):return {g}|{mul(g,a) for a in A-{g}}
                    g,h=sorted(A)[:2]
                    D,F=trans(g),trans(h)
                Q=[A,D,F]
                assert all(closure(t,S)==K for S in Q)
                for x in K:color[x]=next(i for i,S in enumerate(Q) if x not in S)
            opts=[{x for x in B if color[x]!=i} for i in range(3)]
        assert all(good(S) for S in opts),(typ,n,opts)
        assert set.intersection(*opts)==E&B
        for i in range(3):C[i].update(opts[i])
        types[typ]=types.get(typ,0)+1
    assert all(closure(t,S)==X for S in C)
    for S in C:
        for x in sorted(S):
            if closure(t,S-{x})==X:S.remove(x)
        assert all(closure(t,S-{x})!=X for x in S)
    assert set.intersection(*C)==E
    return types

def report():
    rows=[]
    def run(row,tables):
        count=0;types={}
        for t in tables:
            count+=1
            for k,v in certificate(t).items():types[k]=types.get(k,0)+v
        rows.append({**row,"count":count,"types":types})
    for n in range(1,5):
        run({"family":"all_labelled","n":n},(t for t in operation_tables_with_identity(n) if associative(t,n)))
    for a,b,g in [(1,2,1),(2,2,1),(2,3,1),(3,3,1),(1,2,2),(2,2,2),(2,2,3),(2,2,4)]:
        n=a*b*g+2;z=n-1
        def tables():
            for mask in range(1,1<<(a*b)):
                if not all(any(mask>>(j*a+i)&1 for i in range(a)) for j in range(b)):continue
                if not all(any(mask>>(j*a+i)&1 for j in range(b)) for i in range(a)):continue
                for shift in range(g):
                    def mul(x,y):
                        if not x:return y
                        if not y:return x
                        if x==z or y==z:return z
                        i,k=divmod(x-1,b*g);j,k=divmod(k,g)
                        l,h=divmod(y-1,b*g);m,h=divmod(h,g)
                        return 1+(i*b+m)*g+(k+h+(j*a+l+shift)%g)%g if mask>>(j*a+l)&1 else z
                    t=tuple(mul(x,y) for x in range(n) for y in range(n))
                    assert associative(t,n)
                    yield t
        run({"family":"rees","a":a,"b":b,"g":g,"n":n},tables())
    for d in (2,3):
        labels=list(product(range(d),repeat=d))
        i=labels.index(tuple(range(d)))
        labels[0],labels[i]=labels[i],labels[0]
        loc={a:i for i,a in enumerate(labels)}
        t=tuple(loc[tuple(b[x] for x in a)] for a in labels for b in labels)
        assert associative(t,len(labels))
        run({"family":"full_transformations","degree":d,"n":len(labels)},[t])
    return {"study":"T66-T70","rows":rows,"total_tables":sum(r["count"] for r in rows),
            "note":"Constructed and shrunk three generating sets; exact E cross-check. Labelled tables, not isomorphism classes."}
if __name__=="__main__":print(json.dumps(report(),indent=2))
