#!/usr/bin/env python3
"""Complete classification of six-element nongroup monoids with E = empty.

The argument is exhaustive *by the intrinsic unit group and its action
on the ideal of nonunits*. We never enumerate every arbitrary 6x6
binary table, and never exclude any target from the E test.

All monoids of order six satisfying E=empty must have
(|U|, |I|) in {(3,3),(4,2)}. Their unit groups are C3, C4, V4.
For fixed labelled G=U and I, enumerate all group actions
G -> Sym(I) and all associative tables I x I -> I, then test
mixed associativity, classify by isomorphism and by anti-isomorphism.

Usage:
    python3 experiments/classify_minimal_monoids.py
    python3 experiments/classify_minimal_monoids.py --output /tmp/census.json
"""

from __future__ import annotations

import argparse
import json
from collections import Counter, defaultdict
from itertools import permutations, product
from typing import Sequence


GROUPS = (("C3", 3, 3), ("C4", 4, 2), ("V4", 4, 2))


def group_product(name: str, a: int, b: int) -> int:
    if name == "V4":
        return a ^ b  # Klein four group = C2 x C2
    if name in ("C3", "C4"):
        return (a + b) % (3 if name == "C3" else 4)
    raise ValueError("Unsupported group")


def is_associative(table: Sequence[int], n: int) -> bool:
    return all(
        table[table[a * n + b] * n + c]
        == table[a * n + table[b * n + c]]
        for a in range(n) for b in range(n) for c in range(n)
    )


def external_nongenerables(table: Sequence[int], n: int) -> tuple[int, ...]:
    """The owner's exact binary test, including 0 and the identity."""
    return tuple(
        x for x in range(n)
        if not any(table[a * n + b] == x
                   for a in range(n) if a != x
                   for b in range(n) if b != x)
    )


def units(table: Sequence[int], n: int) -> tuple[int, ...]:
    """Global identity is represented by label 0."""
    return tuple(
        i for i in range(n)
        if any(table[i * n + j] == 0 and table[j * n + i] == 0
               for j in range(n))
    )


def is_identity(table: Sequence[int], n: int) -> bool:
    return all(table[i] == i and table[i * n] == i for i in range(n))


def homomorphisms_to_permutations(group: str, m: int, k: int):
    """Every action G -> Sym(I), with e=0 mapping to identity."""
    all_perms = list(permutations(range(k)))
    identity = tuple(range(k))
    result = []
    for tail in product(all_perms, repeat=m - 1):
        images = (identity,) + tail
        if all(
            images[group_product(group, a, b)][i]
            == images[a][images[b][i]]
            for a in range(m) for b in range(m) for i in range(k)
        ):
            result.append(images)
    return result


def ideal_semigroup_tables(k: int):
    for table in product(range(k), repeat=k * k):
        if is_associative(table, k):
            yield table


def assemble_table(
    group: str, m: int, k: int,
    left: Sequence[Sequence[int]],
    right: Sequence[Sequence[int]],
    ideal: Sequence[int],
) -> tuple[int, ...]:
    n = m + k
    tab = [0] * (n * n)
    for a in range(m):
        for b in range(m):
            tab[a * n + b] = group_product(group, a, b)
        for b in range(k):
            tab[a * n + m + b] = m + left[a][b]
            tab[(m + b) * n + a] = m + right[a][b]
    for a in range(k):
        for b in range(k):
            tab[(m + a) * n + m + b] = m + ideal[a * k + b]
    return tuple(tab)


def group_automorphisms(group: str, m: int):
    return tuple(
        p for p in permutations(range(m))
        if p[0] == 0 and all(
            p[group_product(group, a, b)]
            == group_product(group, p[a], p[b])
            for a in range(m) for b in range(m)
        )
    )


def relabel(table: Sequence[int], p: Sequence[int]) -> tuple[int, ...]:
    n = len(p)
    inverse = [0] * n
    for i, dst in enumerate(p):
        inverse[dst] = i
    return tuple(
        p[table[inverse[i] * n + inverse[j]]]
        for i in range(n) for j in range(n)
    )


def transpose(table: Sequence[int], n: int) -> tuple[int, ...]:
    return tuple(table[b * n + a] for a in range(n) for b in range(n))


def canonical(table: Sequence[int], group: str, m: int, k: int) -> tuple[int, ...]:
    """Any monoid isomorphism preserves the units and the identity."""
    return min(
        relabel(table, tuple(pg) + tuple(m + i for i in pi))
        for pg in group_automorphisms(group, m)
        for pi in permutations(range(k))
    )


def canonical_anti(table: Sequence[int], group: str, m: int, k: int):
    """Opposites coalesce when counting up to isomorphism OR anti-isomorphism."""
    return min(
        canonical(table, group, m, k),
        canonical(transpose(table, m + k), group, m, k),
    )


def ideal_type(tab: Sequence[int], m: int, k: int) -> str:
    n = m + k
    if all(tab[(m + a) * n + m + b] == m + a
           for a in range(k) for b in range(k)):
        return "left-zero ideal"
    if all(tab[(m + a) * n + m + b] == m + b
           for a in range(k) for b in range(k)):
        return "right-zero ideal"
    # In all remaining E-empty classes the ideal is a subgroup C_k.
    for e in range(k):
        if all(
            tab[(m + e) * n + m + a] == m + a
            and tab[(m + a) * n + m + e] == m + a
            for a in range(k)
        ) and all(
            any(tab[(m + a) * n + m + b] == m + e
                and tab[(m + b) * n + m + a] == m + e
                for b in range(k))
            for a in range(k)
        ):
            return f"ideal group C{k}"
    return "other"


def describe(tab: Sequence[int], group: str, m: int, k: int):
    n = m + k
    left = any(
        tab[g * n + m + i] != m + i
        for g in range(m) for i in range(k)
    )
    right = any(
        tab[(m + i) * n + g] != m + i
        for g in range(m) for i in range(k)
    )
    if left and right:
        code = "both_active"
    elif left:
        code = "left_active"
    elif right:
        code = "right_active"
    else:
        code = "both_trivial"
    return {
        "unit_group": group,
        "unit_order": m,
        "ideal_order": k,
        "unit_action": code,
        "ideal_multiplication": ideal_type(tab, m, k),
        "global_identity_label": 0,
        "E": list(external_nongenerables(tab, n)),
        "table": [list(tab[i * n:(i + 1) * n]) for i in range(n)],
    }


def classify_group(group: str, m: int, k: int) -> dict:
    acts = homomorphisms_to_permutations(group, m, k)
    ideals = tuple(ideal_semigroup_tables(k))
    all_associative = 0
    passed = 0
    classes = defaultdict(list)
    for left, right in product(acts, repeat=2):
        for ideal in ideals:
            tab = assemble_table(group, m, k, left, right, ideal)
            if not is_associative(tab, m + k):
                continue
            all_associative += 1
            assert is_identity(tab, m + k)
            assert units(tab, m + k) == tuple(range(m))
            if external_nongenerables(tab, m + k):
                continue
            passed += 1
            classes[canonical(tab, group, m, k)].append(tab)

    descriptions = [
        describe(tab, group, m, k)
        for tab in sorted(classes)
    ]
    descriptions.sort(key=lambda row: row["unit_action"])
    anti = {
        canonical_anti(tab, group, m, k)
        for tab in classes
    }
    return {
        "group": group,
        "group_order": m,
        "ideal_size": k,
        "group_actions": len(acts),
        "associative_ideal_tables": len(ideals),
        "associative_monoids_with_group_table_fixed": all_associative,
        "labelled_E_empty_with_group_table_fixed": passed,
        "isomorphism_classes": len(classes),
        "anti_isomorphism_classes": len(anti),
        "representatives": descriptions,
    }


def three_element_ideal_lemma() -> dict:
    """Independent semigroup census, without units or action assumptions."""
    k = 3
    all_assoc = tuple(ideal_semigroup_tables(k))
    e_empty = [
        table for table in all_assoc
        if not external_nongenerables(table, k)
    ]
    all_perms = tuple(permutations(range(k)))
    canonical_representatives = {
        min(relabel(tab, perm) for perm in all_perms)
        for tab in e_empty
    }
    assert len(all_assoc) == 113
    assert len(e_empty) == 3
    assert len(canonical_representatives) == 1
    return {
        "associative_labelled_semigroups_order3": len(all_assoc),
        "with_no_E_labelled": len(e_empty),
        "isomorphism_classes_with_no_E": len(canonical_representatives),
        "unique_class": "C3 group",
    }


def make_report() -> dict:
    rows = [classify_group(*g) for g in GROUPS]
    expected_iso = {"C3": 4, "C4": 3, "V4": 3}
    expected_anti = {"C3": 3, "C4": 2, "V4": 2}
    expected_homs = {"C3": 3, "C4": 2, "V4": 4}
    expected_associative = {"C3": 123, "C4": 12, "V4": 20}
    expected_labelled = {"C3": 13, "C4": 4, "V4": 12}
    for row in rows:
        g = row["group"]
        assert row["isomorphism_classes"] == expected_iso[g]
        assert row["anti_isomorphism_classes"] == expected_anti[g]
        assert row["group_actions"] == expected_homs[g]
        assert row["associative_monoids_with_group_table_fixed"] == expected_associative[g]
        assert row["labelled_E_empty_with_group_table_fixed"] == expected_labelled[g]
        assert len({
            item["unit_action"] for item in row["representatives"]
        }) == row["isomorphism_classes"]
    return {
        "subject": "minimal nongroup monoids with no externally nongenerable elements",
        "original_definition_unchanged": True,
        "scope": "six-element monoids; all isomorphism classes, NOT all 6x6 binary tables",
        "minimal_order": 6,
        "total_isomorphism_classes": sum(row["isomorphism_classes"] for row in rows),
        "total_anti_isomorphism_classes": sum(row["anti_isomorphism_classes"] for row in rows),
        "order3_semigroup_lemma": three_element_ideal_lemma(),
        "unit_group_decomposition": rows,
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output")
    args = parser.parse_args()
    payload = json.dumps(make_report(), indent=2, ensure_ascii=False) + "\n"
    if args.output:
        with open(args.output, "w", encoding="utf-8") as f:
            f.write(payload)
    else:
        print(payload, end="")


if __name__ == "__main__":
    main()
