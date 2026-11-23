#!/usr/bin/env python3
"""Enumerate all labelled monoids with fixed identity 0, on 1..4 elements.

No elements are excluded from the user's original no-external-witness test.

python3 experiments/finite_monoids.py --max-size 4
python3 experiments/finite_monoids.py --max-size 4 --output results/monoids_n1_to_n4.json
"""

from __future__ import annotations

import argparse
import json
from collections import Counter
from itertools import product


def operation_tables_with_identity(n: int):
    """Yield all n^((n-1)^2) possible tables with 0 as two-sided identity."""
    if not 1 <= n <= 4:
        raise ValueError("Exhaustive generator supports n in 1..4")
    base = [0] * (n * n)
    for a in range(n):
        base[a] = a
        base[a * n] = a
    unknown = [(a, b) for a in range(1, n) for b in range(1, n)]
    for outputs in product(range(n), repeat=len(unknown)):
        table = base.copy()
        for (a, b), value in zip(unknown, outputs):
            table[n * a + b] = value
        yield tuple(table)


def associative(table: tuple[int, ...], n: int) -> bool:
    return all(
        table[n * table[n * a + b] + c]
        == table[n * a + table[n * b + c]]
        for a in range(n)
        for b in range(n)
        for c in range(n)
    )


def witnesses(table: tuple[int, ...], n: int, x: int):
    return [
        (a, b)
        for a in range(n) if a != x
        for b in range(n) if b != x and table[n * a + b] == x
    ]


def E(table: tuple[int, ...], n: int) -> tuple[int, ...]:
    return tuple(x for x in range(n) if not witnesses(table, n, x))


def units(table: tuple[int, ...], n: int) -> tuple[int, ...]:
    return tuple(
        a for a in range(n)
        if any(table[n * a + b] == 0 and table[n * b + a] == 0
               for b in range(n))
    )


def predicted_E(table: tuple[int, ...], n: int) -> tuple[int, ...]:
    """Structural theorem for finite monoids, independent of witness search.

    A unit is E iff U={e} and it is e, or U={e,u} and it is u.
    A nonunit x is E iff all units fix x on both sides and
    no pair of nonunits different from x multiplies to x.
    """
    U = set(units(table, n))
    I = set(range(n)) - U
    result = set()
    if len(U) == 1:
        result.add(0)
    elif len(U) == 2:
        result.add(next(u for u in U if u != 0))
    for x in I:
        if all(table[n * u + x] == x and table[n * x + u] == x for u in U):
            if not any(
                table[n * a + b] == x
                for a in I if a != x
                for b in I if b != x
            ):
                result.add(x)
    return tuple(sorted(result))


def enumerate_monoids(n: int) -> dict[str, object]:
    if not 1 <= n <= 4:
        raise ValueError("Expected n in 1..4")
    histogram = Counter({r: 0 for r in range(n + 1)})
    by_units = Counter()
    count = 0
    no_E_nongroups = 0
    for table in operation_tables_with_identity(n):
        if not associative(table, n):
            continue
        count += 1
        observed = E(table, n)
        U = units(table, n)
        expected = predicted_E(table, n)
        if observed != expected:
            raise AssertionError((n, table, observed, expected))
        histogram[len(observed)] += 1
        by_units[(len(U), len(observed))] += 1
        if not observed and len(U) < n:
            no_E_nongroups += 1
    return {
        "size": n,
        "candidate_tables": n ** ((n - 1) ** 2),
        "monoids_with_fixed_identity": count,
        "histogram_by_number_of_E_elements": {
            str(r): histogram[r] for r in range(n + 1)
        },
        "histogram_by_units_and_E_elements": {
            f"{u},{e}": number for (u, e), number in sorted(by_units.items())
        },
        "nongroup_monoids_with_no_E_elements": no_E_nongroups,
        "method": "exhaustive enumeration and independent structural cross-check",
    }


def direct_product_C3_B() -> tuple[tuple[int, ...], int]:
    """Six-element associative monoid: (Z/3Z,+) x ({0,1}, multiplication)."""
    elements = [(g, z) for g in range(3) for z in (0, 1)]
    n = len(elements)
    table = tuple(
        elements.index(((g + h) % 3, z * w))
        for g, z in elements for h, w in elements
    )
    assert associative(table, n)
    assert E(table, n) == ()
    # There are exactly three units, with second coordinate equal to 1.
    identity = elements.index((0, 1))
    assert len([
        a for a in range(n)
        if any(table[a * n + b] == identity
               and table[b * n + a] == identity for b in range(n))
    ]) == 3
    return table, identity


def boolean_meet_E(k: int) -> tuple[int, ...]:
    """E in k-bit Boolean algebra under bitwise meet."""
    n = 1 << k
    table = tuple(a & b for a in range(n) for b in range(n))
    return E(table, n)


def make_report(max_size: int = 4) -> dict[str, object]:
    if not 1 <= max_size <= 4:
        raise ValueError("Expected max size in 1..4")
    monoids = [enumerate_monoids(n) for n in range(1, max_size + 1)]
    tab, identity = direct_product_C3_B()
    boolean_cases = []
    for k in range(1, 6):
        observed = boolean_meet_E(k)
        expected = tuple(
            x for x in range(1 << k) if (k - x.bit_count()) <= 1
        )
        assert observed == expected
        boolean_cases.append({
            "k": k, "number_of_elements": 1 << k,
            "E_elements": list(observed), "E_count": len(observed),
        })
    return {
        "definition": "E(x): no a,b distinct from x satisfy F(a,b)=x",
        "identity_is_labelled_zero": True,
        "monoids": monoids,
        "six_element_example": {
            "elements": [[g, z] for g in range(3) for z in (0, 1)],
            "identity_label": identity,
            "multiplication_table": [
                list(tab[6 * a:6 * (a + 1)]) for a in range(6)
            ],
            "E_elements": [],
        },
        "boolean_meet_examples": boolean_cases,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--max-size", type=int, default=4)
    parser.add_argument("--output")
    args = parser.parse_args()
    output = json.dumps(make_report(args.max_size), ensure_ascii=False, indent=2) + "\n"
    if args.output:
        with open(args.output, "w", encoding="utf-8") as handle:
            handle.write(output)
    else:
        print(output, end="")


if __name__ == "__main__":
    main()
