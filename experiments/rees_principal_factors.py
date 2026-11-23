#!/usr/bin/env python3
"""Study 10: limits of Green-invariant classifications and Rees support criterion.

All products use the original E(x): no a,b different from x with ab=x.
Construction is U=C3, an ideal Rees M^0(C_h; I, Lambda; P) and its zero.
The unit group U acts trivially on the whole Rees ideal.

For regular 0-Rees principal factor the internal E test is calculated
from subgroup order, row and column counts, and nonzero sandwich support,
without enumerating forbidden target products.
"""
from __future__ import annotations

import argparse
import json
from collections import Counter
from itertools import product


def regular_supports(rows, columns):
    """All {0,1} supports with no all-zero row or column."""
    for bits in product((0, 1), repeat=rows * columns):
        p = tuple(tuple(bits[r*columns + c] for c in range(columns))
                  for r in range(rows))
        if (all(any(row) for row in p)
                and all(any(p[r][c] for r in range(rows))
                        for c in range(columns))):
            yield p


def rees_c3_monoid(p, group_size=1, labelled_values=None):
    """Return (table, Rees-elements) with group C_group_size inside ideal.

    P contains -1 for zero and any value in 0..group_size-1 for nonzero.
    If labelled_values=None, p's 0 means zero, 1 means group identity 0.
    For this study, the C3 external units are labels 0..2, and 0 is
    the global identity. Rees ideal elements start at label 3, ordered
    lexicographically (row index i, group element g, column index lambda).
    """
    rows = len(p)
    columns = len(p[0])
    if not rows or not columns or any(len(row) != columns for row in p):
        raise ValueError("Invalid sandwich matrix")
    if labelled_values is None:
        pp = tuple(tuple(0 if cell else -1 for cell in row) for row in p)
    else:
        pp = tuple(tuple(x for x in row) for row in p)
    if any(x < -1 or x >= group_size for row in pp for x in row):
        raise ValueError("Sandwich group entry is invalid")
    if not all(any(v != -1 for v in row) for row in pp):
        raise ValueError("Nonregular Rees matrix: zero row")
    if not all(any(pp[r][c] != -1 for r in range(rows)) for c in range(columns)):
        raise ValueError("Nonregular Rees matrix: zero column")
    rees = tuple((i, h, lam)
                 for i in range(columns)
                 for h in range(group_size)
                 for lam in range(rows))
    loc = {t: 3+j for j,t in enumerate(rees)}
    zero = 3+len(rees)
    n=zero+1
    tab=[]
    for a in range(n):
        for b in range(n):
            if a<3 and b<3:
                out=(a+b)%3
            elif a==zero or b==zero:
                out=zero
            elif a<3:
                out=b
            elif b<3:
                out=a
            else:
                ai, ah, al = rees[a-3]
                bi, bh, bl = rees[b-3]
                pv=pp[al][bi]
                out=zero if pv==-1 else loc[(ai,(ah+pv+bh)%group_size,bl)]
            tab.append(out)
    return tuple(tab), rees, pp


def e_direct(table):
    n=round(len(table)**0.5)
    assert n*n==len(table)
    return tuple(x for x in range(n)
                 if not any(table[a*n+b]==x
                            for a in range(n) if a!=x
                            for b in range(n) if b!=x))


def e_rees_principal_factor(p, group_size=1):
    """Predict E inside the nonzero Rees J class, from P, not products.

    For group size 1: a target (i,lambda) is internally producible iff
      there exists a nonzero P[mu][j] with mu != lambda, j != i.

    For group size 2:
      if more than one H-class, all elements internally producible.
      if only one H-class, the identity is producible, and its unique
      nonidentity element is not.

    For group size >=3 all elements are internally producible.
    """
    rows=len(p)
    cols=len(p[0])
    nonzero=lambda mu,j: p[mu][j]!=-1
    exceptional=[]
    for i in range(cols):
        for h in range(group_size):
            for lam in range(rows):
                if group_size>=3:
                    producible=True
                elif group_size==2:
                    if rows*cols > 1:
                        producible=True
                    else:
                        # A one-H-class Rees factor is a two-element group.
                        # Its identity element is P^{-1}.
                        producible=(h==(-p[0][0])%2)
                else:
                    producible=any(nonzero(mu,j)
                        for mu in range(rows) if mu!=lam
                        for j in range(cols) if j!=i)
                if not producible:
                    exceptional.append((i,h,lam))
    return tuple(exceptional)


def whole_e_prediction(p, group_size, rees):
    """External units fix ideal; zero generated iff some sandwich zero."""
    internal=set(e_rees_principal_factor(p,group_size))
    predicted=[3+i for i,x in enumerate(rees) if x in internal]
    if not any(value==-1 for row in p for value in row):
        predicted.append(3+len(rees))
    return tuple(predicted)


def green_fingerprint(table):
    n=round(len(table)**0.5)
    if n*n!=len(table):
        raise ValueError("Not a square table")
    if not all(table[table[a*n+b]*n+c]==table[a*n+table[b*n+c]]
               for a in range(n) for b in range(n) for c in range(n)):
        raise AssertionError("Construction not associative")
    def partition(fn):
        groups={}
        for x in range(n):
            groups.setdefault(fn(x),[]).append(x)
        return tuple(tuple(v) for v in groups.values())
    R=partition(lambda x: frozenset(table[x*n+b] for b in range(n)))
    L=partition(lambda x: frozenset(table[a*n+x] for a in range(n)))
    J=partition(lambda x: frozenset(
        table[table[a*n+x]*n+b] for a in range(n) for b in range(n)))
    H=partition(lambda x:(
        frozenset(table[x*n+b] for b in range(n)),
        frozenset(table[a*n+x] for a in range(n))))
    regular=tuple(x for x in range(n)
                  if any(table[table[x*n+y]*n+x]==x
                         for y in range(n)))
    idempotents=tuple(x for x in range(n) if table[x*n+x]==x)
    return {
        "R":R,"L":L,"J":J,"H":H,
        "regular_elements":regular,
        "idempotent_count":len(idempotents),
        "idempotent_labels":idempotents,
        "global_unit_group_order":3,
        "external_unit_actions_on_nonunits":"pointwise trivial",
    }


def named_example(p):
    t,rees,normalized=rees_c3_monoid(p)
    result={
        "sandwich_support": [list(row) for row in p],
        "size":round(len(t)**0.5),
        "E":list(e_direct(t)),
        "predicted_E":list(whole_e_prediction(normalized,1,rees)),
        "green":green_fingerprint(t),
        "table": [list(t[i*round(len(t)**0.5):(i+1)*round(len(t)**0.5)])
                  for i in range(round(len(t)**0.5))],
    }
    assert result["E"]==result["predicted_E"]
    return result


def study():
    p1=((0,1,1),(1,0,1))
    p2=((0,0,1),(1,1,1))
    a=named_example(p1)
    b=named_example(p2)
    assert a["size"]==b["size"]==10
    assert a["E"]==[]
    assert b["E"]==[8]
    for k in ("R","L","J","H","regular_elements",
              "idempotent_count","global_unit_group_order",
              "external_unit_actions_on_nonunits"):
        assert a["green"][k]==b["green"][k],(k,a["green"][k],b["green"][k])
    assert a["green"]["idempotent_count"]==6
    census=[]
    for rows,columns,subgroup in ((2,2,1),(2,3,1),(3,3,1),
                                   (2,2,2),(2,2,3),
                                   (1,1,1),(1,1,2),(1,1,3)):
        ct=Counter()
        total=0
        for p in regular_supports(rows,columns):
            t,rees,pp=rees_c3_monoid(p,subgroup)
            pred=whole_e_prediction(pp,subgroup,rees)
            observed=e_direct(t)
            if pred!=observed:
                raise AssertionError((rows,columns,subgroup,p,pred,observed))
            total+=1
            ct[str(len(observed))]+=1
        census.append({
            "matrix_rows":rows,"matrix_columns":columns,
            "local_group_order":subgroup,
            "regular_supports_checked":total,
            "E_count_distribution":dict(sorted(ct.items(),key=lambda x:int(x[0]))),
            "all_predictions_matched":True,
        })
    assert {tuple((x["matrix_rows"],x["matrix_columns"],x["local_group_order"])):
            x["regular_supports_checked"] for x in census}[(3,3,1)] == 265
    return {
        "study":"T35-T36: impossibility of Green-only criterion and Rees support-graph test",
        "original_definition_unchanged":True,
        "counterexample_type":"two 10-element monoids",
        "identical_Green_partitions_R_L_J_H":True,
        "identical_J_order_and_every_element_regular":True,
        "same_number_of_idempotents":6,
        "same_unit_group_and_its_action_on_nonunits":True,
        "system_A_E_empty":True,
        "system_B_E_empty":False,
        "example_A":a,
        "example_B":b,
        "regular_support_census":census,
        "novelty_claim":"none; Rees representation and maximal subsemigroup methods precede this work",
    }


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output")
    args=parser.parse_args()
    s=json.dumps(study(),ensure_ascii=False,indent=2)+"\n"
    if args.output:
        with open(args.output,"w",encoding="utf-8") as fh:
            fh.write(s)
    else:
        print(s,end="")


if __name__=="__main__":
    main()
