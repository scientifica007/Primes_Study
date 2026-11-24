from itertools import product, combinations
from collections import Counter
import json

def close(t,seed):
    S=set(seed); todo=list(S); fixed=list(S)
    for x in todo:
        for y in fixed:
            z=t[x][y]
            if z not in S:S.add(z);todo.append(z)
    return S

def info(t):
    n=len(t);X=set(range(n)); full=(1<<n)-1
    C=[sum(1<<x for x in close(t,[i for i in X if m>>i&1])) for m in range(full+1)]
    H=[m for m in range(1,full+1) if C[m]==full and all(C[m^(1<<i)]!=full for i in X if m>>i&1)]
    E=X-{t[a][b] for a in X for b in X if t[a][b] not in (a,b)}
    em=sum(1<<x for x in E)
    d=1 if em in H else 2 if any(a&b==em for a in H for b in H) else 3
    return E,H,d,C

def assoc(t):
    return all(t[t[a][b]][c]==t[a][t[b][c]] for a,b,c in product(range(len(t)),repeat=3))

def semilattices(n):
    pairs=list(combinations(range(n),2))
    for v in product(range(n),repeat=len(pairs)):
        t=[[i if i==j else -1 for j in range(n)] for i in range(n)]
        for (i,j),x in zip(pairs,v):t[i][j]=t[j][i]=x
        if assoc(t):yield t

def clifford(meet,sizes,f):
    n=len(meet); labels=[(i,x) for i in range(n) for x in range(sizes[i])]; loc={x:i for i,x in enumerate(labels)}
    def mul(a,b):
        i,x=a;j,y=b;k=meet[i][j]
        return loc[k, (x*f[i,k])^(y*f[j,k])]
    return [[mul(a,b) for b in labels] for a in labels],labels,loc

def structural(meet,sizes,f,t,labels,loc):
    n=len(meet); above=lambda j,i: j!=i and meet[i][j]==i
    mandatory={i for i in range(n) if not any(meet[j][k]==i for j,k in product(range(n),repeat=2) if above(j,i) and above(k,i))}
    forced={i for i in range(n) if sizes[i]==2 and not any(above(j,i) and sizes[j]==2 and f[j,i] for j in range(n))}
    flex={i for i in mandatory if sizes[i]==2 and i not in forced}
    fixed={loc[i,1] for i in forced}|{loc[i,0] for i in mandatory if sizes[i]==1}
    P=mandatory|forced
    E,H,d,C=info(t)
    assert E==fixed
    assert close(t,[loc[i,sizes[i]-1] for i in P])==set(range(len(t)))
    for i in range(n):
        if sizes[i]==2:assert any(meet[i][j]==i and f[j,i] for j in forced)
    A=fixed|{loc[i,0] for i in flex}; B=fixed|{loc[i,1] for i in flex}
    assert A&B==E and sum(1<<x for x in A) in H and sum(1<<x for x in B) in H
    assert d==(1 if not flex else 2)
    expect={sum(1<<x for x in fixed|{loc[i,z] for i,z in zip(sorted(flex),v)}) for v in product(range(2),repeat=len(flex))}
    assert set(H)==expect
    return d,len(H)

def clifford_census():
    out=[]
    for n in range(1,5):
        total=0; lattices=0; depths=Counter(); bases=0
        for meet in semilattices(n):
            lattices+=1
            for sizes in product((1,2),repeat=n):
                comparable=[(j,i) for j in range(n) for i in range(n) if j!=i and meet[j][i]==i]
                possible=[(j,i) for j,i in comparable if sizes[i]==sizes[j]==2]
                for v in product((0,1),repeat=len(possible)):
                    f={pair:0 for pair in comparable};f.update(zip(possible,v));f.update({(i,i):sizes[i]-1 for i in range(n)})
                    if not all(f[k,i]==f[k,j]*f[j,i] for k,j,i in product(range(n),repeat=3) if (k,j) in f and (j,i) in f):continue
                    t,labels,loc=clifford(meet,sizes,f);assert assoc(t)
                    d,h=structural(meet,sizes,f,t,labels,loc);depths[str(d)]+=1;bases+=h;total+=1
        out.append(dict(layers=n,semilattices=lattices,tables=total,depth_histogram=dict(depths),irredundant_sets=bases))
    return out

def semigroups():
    for n in range(1,4):
        for v in product(range(n),repeat=n*n):
            t=[list(v[i*n:(i+1)*n]) for i in range(n)]
            if assoc(t):yield t
    n=4
    for v in product(range(n),repeat=9):
        t=[list(range(n))]+[[i]+list(v[(i-1)*3:i*3]) for i in range(1,n)]
        if assoc(t):yield t

def translation_census():
    count=jt=ct=eligible=certs=0; depth=Counter()
    for t in semigroups():
        n=len(t);X=set(range(n));count+=1
        J=[]
        for x in X:
            l={x}|{t[a][x] for a in X}
            J.append(l|{t[a][b] for a in l for b in X})
        E,H,d,C=info(t)
        if len({frozenset(j) for j in J})==n:
            jt+=1;assert d==1
        regular={x for x in X if any(t[t[x][y]][x]==x for y in X)}
        condition=all(t[a][b]==t[b][a] for a in X for b in X) and all(sum(j==J[x] for j in J)==1 for x in regular)
        if condition:ct+=1;assert d<=2
        for m in H:
            A={x for x in X if m>>x&1};w={}
            for x in A-E:
                for y in A:
                    if not J[x]<J[y]:continue
                    for right in (True,False):
                        p=t[x][y] if right else t[y][x]
                        if p==x:continue
                        z=p;seen=set()
                        while z not in seen and z!=x:
                            seen.add(z);z=t[z][y] if right else t[y][z]
                        if z==x:w[x]=(y,p);break
                    if x in w:break
            if condition:assert set(w)==A-E
            if set(w)!=A-E:continue
            eligible+=1
            col={}
            def color(x):
                if x not in col:col[x]=1-color(w[x][0]) if x in w and w[x][0] in w else 0
                return col[x]
            for x in w:color(x)
            B=[]
            for c in (0,1):
                s={w[x][1] if x in w and col[x]==c else x for x in A}
                assert sum(1<<x for x in s) in H; B.append(s)
            assert B[0]&B[1]==E;certs+=1;depth[str(d)]+=1
    return dict(semigroup_tables=count,j_trivial_tables=jt,commutative_singleton_regular_tables=ct,eligible_bases=eligible,certificates=certs,depth_histogram=dict(depth))

def report():
    c=clifford_census(); t=translation_census()
    return dict(study='24',clifford=c,clifford_tables=sum(x['tables'] for x in c),translation=t)
if __name__=='__main__':print(json.dumps(report(),indent=2))
