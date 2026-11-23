#!/usr/bin/env python3
"""T29-T32: a Green-J-filtered criterion for finite E-empty monoids.

The original definition is E(x) := not exists a,b != x with a*b=x.
We keep all elements (including 0 and the identity) in the domain.

This is a structural reorganization of previous T08 (not a claim to
new algebra), with further sharp obstructions and two-nonunit criteria.

Run:
  python3 experiments/green_structural_monoids.py
  python3 experiments/green_structural_monoids.py --output /tmp/green.json
"""

from __future__ import annotations

import argparse
import json
from itertools import product

from finite_monoids import (
    E as direct_E,
    associative,
    operation_tables_with_identity,
    units as finite_units,
)
from classify_minimal_monoids import external_nongenerables


def mul(table, n, a, b):
    return table[n * a + b]


def identity(table, n):
    found = [e for e in range(n)
             if all(mul(table, n, e, a) == a
                    and mul(table, n, a, e) == a
                    for a in range(n))]
    if len(found) != 1:
        raise ValueError("A finite monoid must have exactly one identity")
    return found[0]


def unit_elements(table, n, e):
    return tuple(a for a in range(n)
                 if any(mul(table, n, a, b) == e
                        and mul(table, n, b, a) == e for b in range(n)))


def principal_ideal(table, n, x):
    return frozenset(mul(table, n, mul(table, n, a, x), b)
                     for a in range(n) for b in range(n))


def structural_audit(table):
    n = len(table) ** 0.5
    if int(n) != n:
        raise ValueError("Not a square multiplication table")
    n = int(n)
    if not associative(table, n):
        raise ValueError("Associativity required")
    e = identity(table, n)
    u = unit_elements(table, n, e)
    nonunits = tuple(x for x in range(n) if x not in u)
    ideals = tuple(principal_ideal(table, n, x) for x in range(n))

    jclasses = {}
    for x in nonunits:
        jclasses.setdefault(ideals[x], []).append(x)
    classes = tuple(tuple(xs) for _, xs in sorted(
        jclasses.items(), key=lambda pair: min(pair[1])))
    maximal = tuple(
        cls for cls in classes
        if not any(ideals[cls[0]] < ideals[other[0]]
                   for other in classes)
    )
    singletons = tuple(cls[0] for cls in maximal if len(cls) == 1)

    witnesses = {}
    orbit_sizes = {}
    reduced = {}
    upper_sizes = {}
    for x in nonunits:
        orbit = {
            mul(table, n, mul(table, n, left, x), right)
            for left in u for right in u
        }
        assert all(ideals[y] == ideals[x] for y in orbit)
        orbit_sizes[x] = len(orbit)
        # J_x <=_J J_y iff MxM subset MyM.
        upper = {y for y in nonunits if ideals[x] <= ideals[y]}
        upper_sizes[x] = len(upper)
        valid = [
            (a, b) for a in sorted(upper) if a != x
            for b in sorted(upper) if b != x
            if mul(table, n, a, b) == x
        ]
        reduced[x] = valid
        # The actions are sufficient unless x fixed by both-sided U.
        if len(orbit) > 1:
            selected = None
            for g in u:
                if mul(table, n, g, x) != x:
                    inverse = next(v for v in u
                                   if mul(table, n, v, g) == e)
                    selected = (g, mul(table, n, inverse, x))
                    break
                if mul(table, n, x, g) != x:
                    inverse = next(v for v in u
                                   if mul(table, n, v, g) == e)
                    selected = (mul(table, n, x, inverse), g)
                    break
            assert selected is not None
            assert all(y != x for y in selected)
            assert mul(table, n, *selected) == x
            witnesses[x] = selected
        elif valid:
            witnesses[x] = valid[0]

    unit_exception = (
        (e,) if len(u) == 1 else
        tuple(x for x in u if x != e) if len(u) == 2 else
        ()
    )
    prediction = tuple(sorted(
        unit_exception +
        tuple(x for x in nonunits if x not in witnesses)
    ))
    exhaustive = tuple(
        x for x in range(n)
        if not any(mul(table, n, a, b) == x
                   for a in range(n) if a != x
                   for b in range(n) if b != x)
    )
    assert prediction == exhaustive, (prediction, exhaustive)
    assert all(x in prediction for x in singletons)
    return {
        "size": n,
        "identity": e,
        "units": list(u),
        "nonunits": list(nonunits),
        "j_classes_of_nonunits": [list(cls) for cls in classes],
        "maximal_nonunit_j_classes": [list(cls) for cls in maximal],
        "maximal_singleton_obstructions": list(singletons),
        "unit_double_orbit_sizes": {str(x): orbit_sizes[x] for x in nonunits},
        "upper_j_filter_sizes": {str(x): upper_sizes[x] for x in nonunits},
        "E_direct": list(exhaustive),
        "E_structural": list(prediction),
        "witnesses_for_nonunits": {str(x): list(witnesses[x])
                                   for x in nonunits if x in witnesses},
    }


def group_product(group, a, b):
    if group == "C3":
        return (a + b) % 3
    if group == "C4":
        return (a + b) % 4
    if group == "V4":
        return a ^ b
    raise ValueError("unknown group")


def unit_with_left_zero_ideal(group="C3", active=False):
    """U plus a 2-element left-zero ideal.

    If active is true use a surjective hom U -> C2 (only C4,V4).
    All right unit actions fix I. The ideal product xy=x.
    """
    m = {"C3": 3, "C4": 4, "V4": 4}[group]
    if active and group == "C3":
        raise ValueError("C3 has no C2 quotient")
    n = m + 2
    table = [0] * (n*n)
    for a in range(n):
        for b in range(n):
            if a < m and b < m:
                out = group_product(group, a, b)
            elif a < m:
                shift = (a % 2) if active else 0
                out = m + ((b-m+shift) % 2)
            elif b < m:
                out = a
            else:
                out = a
            table[n*a+b] = out
    assert associative(tuple(table), n)
    assert identity(tuple(table), n) == 0
    return tuple(table)


def two_nonunit_extension_from_group_quotient(
    group_table: tuple[int, ...], parity: tuple[int, ...],
) -> tuple[int, ...]:
    """Explicit T33 construction for any finite group with quotient C2.

    Group table uses labels 0..m-1 and has identity 0.
    parity[g] in {0,1} is a surjective homomorphism to C2.
    """
    m=len(parity)
    if m < 3 or len(group_table)!=m*m or set(parity)!={0,1} or parity[0]!=0:
        raise ValueError("Expected a group of size >=3 with a surjective C2 map")
    if not associative(group_table,m):
        raise ValueError("Invalid group table")
    if not all(group_table[g]==g and group_table[g*m]==g for g in range(m)):
        raise ValueError("Identity must be labelled 0")
    if not all(any(group_table[g*m+h]==0 and group_table[h*m+g]==0
                   for h in range(m)) for g in range(m)):
        raise ValueError("Not a group")
    if not all(parity[group_table[g*m+h]]==(parity[g]+parity[h])%2
               for g in range(m) for h in range(m)):
        raise ValueError("Map is not a homomorphism to C2")

    n=m+2
    tab=[]
    for a in range(n):
        for b in range(n):
            if a<m and b<m:
                x=group_table[a*m+b]
            elif a<m:
                x=m+((b-m+parity[a])%2)
            elif b<m:
                x=a
            else:
                x=a
            tab.append(x)
    out=tuple(tab)
    assert associative(out,n)
    assert not structural_audit(out)["E_direct"]
    return out


def s3_eight_element_extension() -> tuple[int, ...]:
    """Nonabelian unit group S3, sign map S3 -> C2; eight-element witness."""
    from itertools import permutations
    perms=tuple(permutations(range(3)))
    positions={p:i for i,p in enumerate(perms)}
    table=tuple(
        positions[tuple(p[q[i]] for i in range(3))]
        for p in perms for q in perms
    )
    parity=tuple(
        sum(p[i]>p[j] for i in range(3) for j in range(i+1,3))%2
        for p in perms
    )
    return two_nonunit_extension_from_group_quotient(table,parity)


def group_with_zero():
    n = 4
    return tuple(
        (a+b)%3 if a<3 and b<3 else 3
        for a in range(n) for b in range(n)
    )


def c3_with_trivial_group_ideal_and_zero():
    """C3 units, an ideal C3 on labels 3..5, and an absorbing zero 6."""
    n=7
    table=[]
    for a in range(n):
        for b in range(n):
            if a==6 or b==6:
                out=6
            elif a<3 and b<3:
                out=(a+b)%3
            elif a>=3 and b>=3:
                out=3+(a+b-6)%3
            else:
                out=a if a>=3 else b
            table.append(out)
    assert associative(tuple(table),n)
    return tuple(table)


def c3_with_trivial_group_ideal():
    n=6
    out=[]
    for a in range(n):
        for b in range(n):
            if a<3 and b<3:
                z=(a+b)%3
            elif a>=3 and b>=3:
                z=3+(a+b-6)%3
            else:
                z=a if a>=3 else b
            out.append(z)
    assert associative(tuple(out),n)
    return tuple(out)


def test_exact_two_nonunit_criterion(table):
    out=structural_audit(table)
    assert len(out["nonunits"]) == 2
    n=len(table)**0.5
    n=int(n)
    u=out["units"]
    i=out["nonunits"]
    active=any(mul(table,n,g,x)!=x or mul(table,n,x,g)!=x
               for g in u for x in i)
    predicted=len(u)>=3 and active
    assert predicted == (not out["E_direct"])
    return {"group_order":len(u),
            "action_nontrivial":active,
            "E_empty":not out["E_direct"]}


def exhaustive_small_census():
    report=[]
    for n in range(1,5):
        total=0
        no_e=0
        has_max_singleton=0
        has_max_two=0
        for table in operation_tables_with_identity(n):
            if not associative(table,n):
                continue
            total+=1
            obs=structural_audit(table)
            if not obs["E_direct"]:
                no_e+=1
            if obs["maximal_singleton_obstructions"]:
                has_max_singleton+=1
            if any(len(cls)==2 for cls in obs["maximal_nonunit_j_classes"]):
                has_max_two+=1
            if len(obs["nonunits"])==2:
                test_exact_two_nonunit_criterion(table)
        report.append({
            "size":n,
            "enumerated_monoids":total,
            "E_empty":no_e,
            "at_least_one_maximal_nonunit_J_singleton":has_max_singleton,
            "at_least_one_maximal_nonunit_J_pair":has_max_two,
            "structural_predictions_match_direct":True,
        })
    assert [r["enumerated_monoids"] for r in report] == [1,2,11,156]
    return report


def make_report():
    examples = {
        "C3_adjoined_zero_top_singleton": structural_audit(group_with_zero()),
        "C3_with_trivial_units_on_left_zero_ideal2": structural_audit(
            unit_with_left_zero_ideal("C3", False)),
        "C4_with_nontrivial_unit_action_on_left_zero_ideal2": structural_audit(
            unit_with_left_zero_ideal("C4", True)),
        "V4_with_nontrivial_unit_action_on_left_zero_ideal2": structural_audit(
            unit_with_left_zero_ideal("V4", True)),
        "S3_with_sign_quotient_and_two_nonunits": structural_audit(
            s3_eight_element_extension()),
        "C3_with_trivial_units_on_ideal_group3": structural_audit(
            c3_with_trivial_group_ideal()),
        "C3_ideal_group3_and_lower_zero": structural_audit(
            c3_with_trivial_group_ideal_and_zero()),
    }
    assert examples["C3_adjoined_zero_top_singleton"]["E_direct"] == [3]
    assert examples["C3_with_trivial_units_on_left_zero_ideal2"]["E_direct"] == [3,4]
    assert examples["C4_with_nontrivial_unit_action_on_left_zero_ideal2"]["E_direct"] == []
    assert examples["V4_with_nontrivial_unit_action_on_left_zero_ideal2"]["E_direct"] == []
    assert examples["S3_with_sign_quotient_and_two_nonunits"]["E_direct"] == []
    assert examples["C3_with_trivial_units_on_ideal_group3"]["E_direct"] == []
    assert examples["C3_ideal_group3_and_lower_zero"]["E_direct"] == [6]
    for name in ("C3_with_trivial_units_on_left_zero_ideal2",
                 "C4_with_nontrivial_unit_action_on_left_zero_ideal2",
                 "V4_with_nontrivial_unit_action_on_left_zero_ideal2"):
        t = (unit_with_left_zero_ideal("C3",False)
             if name.startswith("C3") else
             unit_with_left_zero_ideal("C4",True)
             if name.startswith("C4") else
             unit_with_left_zero_ideal("V4",True))
        test_exact_two_nonunit_criterion(t)
    old = json.loads((
        __import__("pathlib").Path(__file__).resolve().parents[1]
        / "results" / "minimal_monoids_order6.json"
    ).read_text(encoding="utf-8"))
    representatives=[]
    for section in old["unit_group_decomposition"]:
        for entry in section["representatives"]:
            tab=tuple(v for row in entry["table"] for v in row)
            r=structural_audit(tab)
            assert r["E_direct"] == []
            representatives.append({
                "unit_group":entry["unit_group"],
                "unit_action":entry["unit_action"],
                "size_of_maximal_nonunit_J_classes":
                    [len(cls) for cls in r["maximal_nonunit_j_classes"]],
                "has_nontrivial_unit_orbit":any(
                    size>1 for size in r["unit_double_orbit_sizes"].values()
                ),
                "E_matches":True,
            })
    return {
        "research_date":"2026-11-23",
        "original_E_definition_unchanged":True,
        "classification_scope":"finite monoids; Green J order and units",
        "theorems":{
            "T29":"For every x in I: nontrivial UxU orbit OR x in ((weak-upper-J-filter with x removed)^2); plus |U|>=3",
            "T30":"A maximal singleton J-class of nonunits forces E(x)",
            "T31":"At maximal nonunit J-class of size 2, E-empty on the class iff the unit action is nontrivial",
            "T32":"For precisely two nonunits, E(M) empty iff |U|>=3 and the action on the two nonunits is nontrivial",
            "T33":"For a finite given group G, a G-unit monoid with precisely two nonunits and E empty exists iff |G|>=3 and G has an index-2 subgroup",
            "T34":"For every group G with |G|>=3 and any monoid S, E(G x S) is empty",
        },
        "small_monoids_exhaustive":exhaustive_small_census(),
        "minimal_six_class_examples":representatives,
        "counterexamples_and_constructions":examples,
    }


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output")
    args=parser.parse_args()
    data=json.dumps(make_report(),indent=2,ensure_ascii=False)+"\n"
    if args.output:
        with open(args.output,"w",encoding="utf-8") as f:
            f.write(data)
    else:
        print(data,end="")


if __name__=="__main__":
    main()
