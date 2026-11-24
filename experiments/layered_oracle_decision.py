#!/usr/bin/env python3
"""Study 12: measured multiplication-oracle queries, not claimed wall-clock speedups.

Algorithms trust that the input is a finite monoid with labels 0..n-1.
The identity and group of units (or generating set) are supplied metadata.
In the orbit audit, Green principal ideals are optional precomputed metadata.
Full tables are used ONLY by the experiment to simulate the oracle, build
metadata and compute an independent reference. No validation costs are hidden
inside claimed oracle counts.
"""
from __future__ import annotations

import argparse
import json
from collections import deque
from pathlib import Path

from finite_monoids import associative, operation_tables_with_identity, E as direct_E
from green_structural_monoids import identity, unit_elements, principal_ideal


class Oracle:
    def __init__(self, table):
        self.table = table
        self.n = round(len(table)**0.5)
        self.calls = 0
        self.trace = []

    def __call__(self, a, b):
        self.calls += 1
        self.trace.append((a,b))
        return self.table[a*self.n+b]


def scan_E(n, mul):
    """One pass, O(n^2) multiplications, not n^3 target-first tests."""
    pending = set(range(n))
    for a in range(n):
        for b in range(n):
            x = mul(a,b)
            if x != a and x != b:
                pending.discard(x)
    return tuple(sorted(pending))


def orbit_data(n, e, units, mul, unit_generators=None):
    """Compute partitions of I under left/right U using given generators.

    Without a supplied generator set use every nonidentity unit.
    Cost <=2 |I| d oracle calls, d number of supplied unit generators.
    Generation as a group suffices: on a finite set a permutation's
    inverse is a positive power. Trust the supplied metadata.
    """
    I = tuple(x for x in range(n) if x not in units)
    gens = tuple(u for u in (units if unit_generators is None else unit_generators) if u != e)

    def partition(left):
        parent = {x:x for x in I}
        def find(x):
            while parent[x] != x:
                parent[x] = parent[parent[x]]
                x = parent[x]
            return x
        for x in I:
            for g in gens:
                y = mul(g,x) if left else mul(x,g)
                a,b = find(x),find(y)
                if a != b:
                    parent[max(a,b)] = min(a,b)
        blocks = {}
        for x in I:
            blocks.setdefault(find(x),[]).append(x)
        return tuple(tuple(v) for v in sorted(blocks.values()))

    return partition(True),partition(False)


def orbit_E(n, e, units, mul, orbits, ideals=None):
    """Exact E from orbit representatives, with optional Green pruning.

    The two orbit partitions (and optional principal ideals) are inputs,
    not computed by secretly querying the full table in this function.
    Every measured query is a product of nonunits. Unit exceptions are exact.
    Green pruning uses the common lower principal-ideal filter for the two
    representatives. No target-specific repetition of multiplication calls.
    """
    left,right = orbits
    fixed = {v[0] for v in left if len(v)==1} & {v[0] for v in right if len(v)==1}
    pending = set(fixed)
    forced = set()
    if ideals is not None:
        # Maximal singleton J-class among the nonunits: T30.
        I = {x for block in left for x in block}
        for x in fixed:
            if not any(x != y and x in ideals[y] for y in I):
                forced.add(x)
        pending.difference_update(forced)

    left_reps = tuple(block[0] for block in left)
    right_reps = tuple(block[0] for block in right)
    counts = {"same_J":0,"comparable_distinct_J":0,"incomparable_J":0,
              "without_Green_metadata":0}
    queried = 0
    for a in left_reps:
        for b in right_reps:
            if not pending:
                break
            possible = pending - {a,b}
            if ideals is not None:
                possible &= ideals[a] & ideals[b]
            if not possible:
                continue
            x = mul(a,b)
            queried += 1
            if ideals is None:
                counts["without_Green_metadata"] += 1
            elif ideals[a]==ideals[b]:
                counts["same_J"] += 1
            elif ideals[a] <= ideals[b] or ideals[b] <= ideals[a]:
                counts["comparable_distinct_J"] += 1
            else:
                counts["incomparable_J"] += 1
            if x in possible:
                pending.remove(x)
        if not pending:
            break

    unit_E = ({e} if len(units)==1 else set(units)-{e}
              if len(units)==2 else set())
    return {
        "E": sorted(unit_E | forced | pending),
        "fixed_nonunit_candidates": len(fixed),
        "forced_by_Green_singletons": sorted(forced),
        "left_orbits":len(left_reps),
        "right_orbits":len(right_reps),
        "orbit_pair_bound":len(left_reps)*len(right_reps),
        "queries":queried,
        "query_channels":counts,
    }


def generator_E(n,e,generators,mul):
    """Given a monoid generating set X, fetch only the right Cayley edges.

    Every b has a chosen predecessor p and final generator g. For each
    row a, reconstruct a*b from (a*p)*g, using already fetched edges.
    This needs <= (n-1)*|X without e| queries, O(n^2+n|X|) time
    with indexed edges, O(n|X|+n) workspace (besides the oracle).
    """
    X = tuple(sorted(set(generators)-{e}))
    edges = {(a,g):(g if a==e else mul(a,g)) for a in range(n) for g in X}
    predecessor = {e:None}
    order = [e]
    for a in order:
        for g in X:
            b = edges[a,g]
            if b not in predecessor:
                predecessor[b]=(a,g)
                order.append(b)
    if len(order)!=n:
        raise ValueError("Supplied set does not generate the monoid")
    pending = set(X)|{e}
    for a in range(n):
        row={e:a}
        for b in order[1:]:
            p,g=predecessor[b]
            x=edges[row[p],g]
            row[b]=x
            if x != a and x != b:
                pending.discard(x)
        if not pending:
            break
    return tuple(sorted(pending))


def hard_family(k,changed=None):
    """Fixed carrier, C3 units and actions; k^2 independent 3x3 blocks.

    Base E={t}; change exactly one block from z to t -> E=empty.
    Every product of three nonunits is z. Associativity in mixed triples
    follows from translations within the A_i orbits and fixed t,z.
    """
    if k<1 or (changed is not None and not all(0<=i<k for i in changed)):
        raise ValueError("Bad block")
    n=3*k+5
    t,z=n-2,n-1
    def m(a,b):
        if a<3 and b<3:
            return (a+b)%3
        if a<3:
            return b if b>=t else 3+3*((b-3)//3)+(b-3+a)%3
        if b<3:
            return a if a>=t else 3+3*((a-3)//3)+(a-3+b)%3
        if a>=t or b>=t:
            return z
        return t if changed==((a-3)//3,(b-3)//3) else z
    return tuple(m(a,b) for a in range(n) for b in range(n))


def audit_table(table, e=None, verify_generator=False):
    n=round(len(table)**0.5)
    if e is None:
        e=identity(table,n)
    U=unit_elements(table,n,e)
    oracles={}
    base=Oracle(table)
    E=scan_E(n,base)
    if E!=direct_E(table,n):
        raise AssertionError("single scan differs from target-first oracle")
    prep=Oracle(table)
    orbits=orbit_data(n,e,U,prep)
    # Metadata for the second variant is supplied by the experimental table,
    # NOT included in its query count. Do not add this to an end-to-end claim.
    ideals=tuple(principal_ideal(table,n,x) for x in range(n))
    for name,data in (("orbit_only",None),("orbit_and_Green",ideals)):
        q=Oracle(table)
        result=orbit_E(n,e,U,q,orbits,data)
        assert q.calls==result["queries"]
        assert tuple(result["E"])==E,(name,table,result,E)
        oracles[name]=result
    if verify_generator:
        # In this fixture we supply all nonidentity elements as generators;
        # smaller explicit generating sets are checked separately in tests.
        q=Oracle(table)
        assert generator_E(n,e,range(n),q)==E
        assert q.calls==(n-1)**2
    return {"size":n,"E":list(E),"unit_count":len(U),
            "baseline_queries":base.calls,"nonunit_pair_bound":(n-len(U))**2,
            "orbit_preprocessing_queries":prep.calls,
            "orbit_only_total_excluding_discovery_of_units":
                prep.calls+oracles["orbit_only"]["queries"],
            **oracles}


def summarize(rows):
    return {
        "monoids":len(rows),
        "baseline_queries":sum(r["baseline_queries"] for r in rows),
        "nonunit_pair_bound_sum":sum(r["nonunit_pair_bound"] for r in rows),
        "orbit_preprocessing_queries":sum(r["orbit_preprocessing_queries"] for r in rows),
        "orbit_only_queries_with_precomputed_metadata":sum(r["orbit_only"]["queries"] for r in rows),
        "orbit_and_Green_queries_with_precomputed_metadata":
            sum(r["orbit_and_Green"]["queries"] for r in rows),
        "orbit_only_total_excluding_discovery_of_units":
            sum(r["orbit_only_total_excluding_discovery_of_units"] for r in rows),
        "Green_metadata_cost_not_counted":True,
        "all_predictions_match":True,
    }


def report():
    census=[]
    for n in range(1,5):
        rows=[audit_table(t,0,True) for t in operation_tables_with_identity(n)
              if associative(t,n)]
        census.append({"size":n,**summarize(rows)})
    assert [r["monoids"] for r in census]==[1,2,11,156]
    hard=[]
    for k in range(1,5):
        base=hard_family(k)
        n=3*k+5
        assert associative(base,n)
        assert direct_E(base,n)==(n-2,)
        for i in range(k):
            for j in range(k):
                t=hard_family(k,(i,j))
                assert associative(t,n)
                assert direct_E(t,n)==()
                changed={(a,b) for a in range(n) for b in range(n)
                         if base[a*n+b]!=t[a*n+b]}
                assert changed=={(3+3*i+r,3+3*j+s)
                                 for r in range(3) for s in range(3)}
                assert unit_elements(t,n,0)==(0,1,2)
                assert all(base[a*n+b]==t[a*n+b] for a in range(n)
                           for b in range(n) if a<3 or b<3)
        sample=audit_table(base,0)
        hard.append({"k":k,"size":n,"independent_blocks":k*k,
                     "base_E":sample["E"],"all_changed_variants_E_empty":True,
                     "orbit_bound":sample["orbit_only"]["orbit_pair_bound"],
                     "base_orbit_queries":sample["orbit_only"]["queries"]})
    return {"study":"T43-T46: orbit and Cayley compression, quadratic oracle lower bound",
            "original_definition_unchanged":True,
            "labelled_small_monoids":census,"hard_family":hard,
            "note":"Counts exclude supplied metadata unless preprocessing is explicitly reported."}


def catalogue_report():
    from tempfile import TemporaryDirectory
    from urllib.request import urlopen
    from match_smallsemi_catalogue import (
        UPSTREAM_URL, EXPECTED_SHA256, catalogue_details, tables_to_flat,
    )
    with TemporaryDirectory() as tmp:
        p=Path(tmp)/"catalogue.json"
        with urlopen(UPSTREAM_URL,timeout=120) as response:
            p.write_bytes(response.read())
        data,_=catalogue_details(p)
    rows=[]
    e_empty=0
    no_queries={"orbit_only":0,"orbit_and_Green":0}
    for rec in data["semigroups"]:
        table=tables_to_flat(rec["table"],1)
        try:
            e=identity(table,6)
        except ValueError:
            continue
        row=audit_table(table,e)
        rows.append(row)
        if not row["E"]:
            e_empty+=1
        for name in no_queries:
            if row[name]["queries"]==0:
                no_queries[name]+=1
    assert len(rows)==1373 and e_empty==9
    return {"source":"Smallsemi 0.7.2 pinned export",
            "sha256":EXPECTED_SHA256,
            "catalogue_semigroups_scanned":len(data["semigroups"]),
            **summarize(rows),"E_empty_including_groups":e_empty,
            "monoids_resolved_without_residual_queries":no_queries,
            "note":"Costs for discovering units or Green metadata are excluded. Counts measure residual oracle calls, not wall-clock speed."}


def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument("--output",type=Path)
    p.add_argument("--catalogue-download",action="store_true")
    args=p.parse_args()
    out=json.dumps(catalogue_report() if args.catalogue_download else report(),indent=2)+"\n"
    if args.output:
        args.output.write_text(out,encoding="utf-8")
    else:
        print(out,end="")


if __name__=="__main__":
    main()
