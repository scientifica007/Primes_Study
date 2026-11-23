#!/usr/bin/env python3
"""Study 11: Clifford monoids, cross-J linking maps, and exact E classification.

No modification of the owner's definition: E(x) means there do not exist
TWO factors a,b each different from x whose product is x. 0, 1, units,
and all idempotents are tested.

Finite strong semilattices of cyclic groups provide exhaustive tests.
The mathematical theorem also applies to arbitrary groups.
"""
from __future__ import annotations

import argparse
import json
from collections import Counter
from dataclasses import dataclass
from itertools import product


@dataclass(frozen=True)
class CyclicClifford:
    """Nodes 0..k-1, 0 top; morphisms s->t encoded by multiplier."""
    orders: tuple[int, ...]
    meet: tuple[tuple[int, ...], ...]
    maps: tuple[tuple[int, int, int], ...]

    def __post_init__(self):
        k = len(self.orders)
        if k < 1 or not all(type(n) is int and n >= 1 for n in self.orders):
            raise ValueError("Group orders must be positive")
        if len(self.meet) != k or any(len(row) != k for row in self.meet):
            raise ValueError("Bad semilattice matrix shape")
        if any(self.meet[a][b] not in range(k) for a in range(k) for b in range(k)):
            raise ValueError("Invalid meet result")
        for a in range(k):
            if self.meet[a][a] != a or self.meet[0][a] != a:
                raise ValueError("Need idempotent meet and top 0")
            for b in range(k):
                if self.meet[a][b] != self.meet[b][a]:
                    raise ValueError("Meet must be commutative")
                for c in range(k):
                    if self.meet[self.meet[a][b]][c] != self.meet[a][self.meet[b][c]]:
                        raise ValueError("Meet must be associative")

        coeff = {(s,t):v for s,t,v in self.maps}
        if len(coeff) != len(self.maps):
            raise ValueError("Duplicate connecting-map specification")
        compatible = {(s,t) for s in range(k) for t in range(k)
                      if self.meet[s][t] == t}
        if set(coeff) != compatible:
            raise ValueError("Missing or extraneous linking maps")
        for (s,t),v in coeff.items():
            if not (0 <= v < self.orders[t]):
                raise ValueError("Connecting-map coefficient outside codomain")
            if (s == t and v != 1 % self.orders[t]) or (
                    self.orders[s]*v % self.orders[t] != 0):
                raise ValueError("Not a group homomorphism / identity")
        for s in range(k):
            for u in range(k):
                for t in range(k):
                    if (s,u) in coeff and (u,t) in coeff:
                        if coeff[s,t] != coeff[s,u]*coeff[u,t] % self.orders[t]:
                            raise ValueError("Linking maps do not compose")

    def labels(self):
        return tuple((s,g) for s,n in enumerate(self.orders) for g in range(n))

    def table(self):
        elems=self.labels()
        ids={x:i for i,x in enumerate(elems)}
        c={(s,t):v for s,t,v in self.maps}
        tab=[]
        for s,a in elems:
            for t,b in elems:
                u=self.meet[s][t]
                tab.append(ids[u,(c[s,u]*a+c[t,u]*b)%self.orders[u]])
        return tuple(tab)

    def internal_prediction(self):
        """Exact semilattice/linking criterion; does not inspect products."""
        elems=self.labels()
        c={(s,t):v for s,t,v in self.maps}
        exceptional=[]
        details=[]
        for idx,(s,g) in enumerate(elems):
            n=self.orders[s]
            if n>=3:
                reason="local_group_at_least_three"
                is_E=False
            elif n==2:
                if g==0:
                    reason="square_of_nonidentity_in_local_C2"
                    is_E=False
                else:
                    nontriv=any(
                        t!=s and self.meet[t][s]==s and c[t,s]%2==1
                        for t in range(len(self.orders))
                    )
                    reason=("higher_group_image_hits_nonidentity" if nontriv
                            else "all_higher_images_trivial")
                    is_E=not nontriv
            else:
                meet_witness=any(
                    t!=s and u!=s and self.meet[t][s]==s
                    and self.meet[u][s]==s and self.meet[t][u]==s
                    for t in range(len(self.orders))
                    for u in range(len(self.orders))
                )
                reason=("meet_of_two_strictly_higher_levels" if meet_witness
                        else "no_strict_higher_meet_decomposition")
                is_E=not meet_witness
            if is_E:
                exceptional.append(idx)
            details.append({"label":idx,"component":s,"local_value":g,
                            "E":is_E,"reason":reason})
        return tuple(exceptional),details


def direct_E(tab):
    n=round(len(tab)**0.5)
    if n*n!=len(tab):
        raise ValueError("Non-square table")
    return tuple(x for x in range(n)
                 if not any(tab[a*n+b]==x
                            for a in range(n) if a!=x
                            for b in range(n) if b!=x))


def verify_model(m):
    tab=m.table()
    n=len(m.labels())
    if not all(tab[tab[a*n+b]*n+c]==tab[a*n+tab[b*n+c]]
               for a in range(n) for b in range(n) for c in range(n)):
        raise AssertionError("Nonassociative Clifford construction")
    if not all(tab[a]==a and tab[a*n]==a for a in range(n)):
        raise AssertionError("Missing global identity label 0")
    predicted,details=m.internal_prediction()
    observed=direct_E(tab)
    if predicted!=observed:
        raise AssertionError((m,predicted,observed))
    return {"orders":list(m.orders),"meet":[list(r) for r in m.meet],
            "linking_maps":[list(x) for x in m.maps],
            "elements":[list(x) for x in m.labels()],
            "E":list(observed),"structural_prediction":list(predicted),
            "details":details,"idempotents":[i for i in range(n) if tab[i*n+i]==i],
            "table":[list(tab[i*n:(i+1)*n]) for i in range(n)]}


def chain(orders,adjacent):
    k=len(orders)
    if len(adjacent)!=k-1:
        raise ValueError("Need adjacent homs for the chain")
    meet=tuple(tuple(max(i,j) for j in range(k)) for i in range(k))
    coeff={(s,s):1%orders[s] for s in range(k)}
    for i,v in enumerate(adjacent):
        coeff[i,i+1]=v
    for length in range(2,k):
        for s in range(k-length):
            t=s+length
            coeff[s,t]=coeff[s,t-1]*coeff[t-1,t]%orders[t]
    maps=tuple(sorted((s,t,v) for (s,t),v in coeff.items()))
    return CyclicClifford(tuple(orders),meet,maps)


def diamond_example():
    meet=((0,1,2,3),(1,1,3,3),(2,3,2,3),(3,3,3,3))
    orders=(3,1,1,1)
    maps=tuple((s,t,1%orders[t] if s==t else 0)
               for s in range(4) for t in range(4) if meet[s][t]==t)
    return CyclicClifford(orders,meet,maps)


def group_partition_fingerprint(tab):
    n=round(len(tab)**0.5)
    def part(fn):
        o={}
        for x in range(n):
            o.setdefault(fn(x),[]).append(x)
        return sorted(tuple(v) for v in o.values())
    R=part(lambda x:frozenset(tab[x*n+y] for y in range(n)))
    L=part(lambda x:frozenset(tab[y*n+x] for y in range(n)))
    Jideals=[frozenset(tab[tab[a*n+x]*n+b]
                       for a in range(n) for b in range(n)) for x in range(n)]
    J=part(lambda x:Jideals[x])
    H=part(lambda x:(frozenset(tab[x*n+y] for y in range(n)),
                    frozenset(tab[y*n+x] for y in range(n))))
    return {"R":R,"L":L,"H":H,"J":J,
            "J_preorder":[[x,y] for x in range(n) for y in range(n)
                          if Jideals[x] <= Jideals[y]],
            "idempotents":[x for x in range(n) if tab[x*n+x]==x],
            "top_C3_action_on_lower":[
                [tab[g*n+x] for g in range(3)] + [tab[x*n+g] for g in range(3)]
                for x in range(3,n)],
            "local_principal_factor_tables":[
                [[tab[a*n+b] for b in component] for a in component]
                for component in ((0,1,2),(3,4,5,6),(7,8))]}


def nine_element_pair():
    a=verify_model(chain((3,4,2),(0,0)))
    b=verify_model(chain((3,4,2),(0,1)))
    if a["E"]!=[8] or b["E"]!=[]:
        raise AssertionError("Nine-element counterexample failed")
    fa=group_partition_fingerprint(tuple(x for row in a["table"] for x in row))
    fb=group_partition_fingerprint(tuple(x for row in b["table"] for x in row))
    if fa!=fb or fa["idempotents"]!=[0,3,7]:
        raise AssertionError("Principal factors, Green relations, idempotents, actions must agree")
    return {"A_trivial_middle_to_bottom":a,"B_surjective_middle_to_bottom":b,
            "identical_principal_factors_Green_order_idempotent_positions_unit_action":True,
            "common_fingerprint":fa,
            "single_bit_that_distinguishes_E":
                "Whether phi_{C4,C2} is nontrivial / has image C2"}


def chain_three_report():
    """Backwards-compatible alias used by the independent test suite."""
    return nine_element_pair()


def exhaustive_cyclic_chain_verification():
    census=[]
    for layers in (2,3):
        count=0
        e_empty=0
        e_hist=Counter()
        with_local_c2=0
        for orders in product(range(1,5),repeat=layers):
            options=[]
            for s in range(layers-1):
                ns,nt=orders[s],orders[s+1]
                options.append([v for v in range(nt) if ns*v % nt == 0])
            for adjacent in product(*options):
                model=chain(orders,adjacent)
                rep=verify_model(model)
                count+=1
                e_hist[len(rep["E"])]+=1
                if not rep["E"]:
                    e_empty+=1
                if 2 in orders:
                    with_local_c2+=1
        census.append({"chain_layers":layers,"group_orders_tested":[1,2,3,4],
                       "valid_linking_systems_tested":count,
                       "systems_with_a_C2_component":with_local_c2,
                       "systems_with_E_empty":e_empty,
                       "E_cardinality_histogram":dict(sorted(e_hist.items())),
                       "structural_criterion_agrees_with_brute_force":True})
    return census


def report():
    pair=nine_element_pair()
    diamond=verify_model(diamond_example())
    if diamond["E"]!=[3,4]:
        raise AssertionError("Diamond meet example failed")
    return {"study":"T38-T42: cross-J bridge and exact Clifford criterion",
            "definition_unchanged":True,"pair_of_nine_element_monoids":pair,
            "diamond_meet_example":diamond,
            "exhaustive_chain_models":exhaustive_cyclic_chain_verification(),
            "source_novelty_unestablished":True}


def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument("--output")
    args=p.parse_args()
    out=json.dumps(report(),ensure_ascii=False,indent=2)+"\n"
    if args.output:
        with open(args.output,"w",encoding="utf-8") as f:
            f.write(out)
    else:
        print(out,end="")


if __name__=="__main__":
    main()
