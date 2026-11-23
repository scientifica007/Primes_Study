#!/usr/bin/env python3
"""Exhaustive and analytic experiments for the original relational hypothesis.

No elements, including 0 and 1, are categorically excluded.
The domain S_n={0, ..., n-1} is a set of labels, not integer arithmetic.

Run: python3 experiments/finite_binary_systems.py --max-size 4
"""

from __future__ import annotations

import argparse
from collections import Counter
from itertools import product
from math import comb
import json


def witnesses(table: tuple[int, ...], n: int, x: int) -> list[tuple[int, int]]:
    """Return all ordered pairs (a,b) with a!=x, b!=x, F(a,b)=x."""
    if len(table) != n * n:
        raise ValueError("An operation table must contain n*n cells")
    if not 0 <= x < n:
        raise ValueError("x must be a member of S_n")
    if any(not 0 <= value < n for value in table):
        raise ValueError("All outputs must belong to S_n")
    return [
        (a, b)
        for a in range(n)
        for b in range(n)
        if a != x and b != x and table[a * n + b] == x
    ]


def nongenerable(table: tuple[int, ...], n: int) -> tuple[int, ...]:
    """All elements x without any admissible generating witness."""
    return tuple(x for x in range(n) if not witnesses(table, n, x))


def forced_subset_count(n: int, k: int) -> int:
    """Number of operations for which a fixed k-element subset is nongenerable.

    Each cell (a,b) can output anything except those x in A that differ
    from both a and b. By symmetry, only |A|=k matters.
    """
    if not (1 <= n and 0 <= k <= n):
        raise ValueError("Expected n>=1 and 0<=k<=n")
    allowed_set = set(range(k))
    total = 1
    for a in range(n):
        for b in range(n):
            total *= n - len(allowed_set - {a, b})
    return total


def analytic_histogram(n: int) -> dict[int, int]:
    """Exact count of binary operations with precisely r nongenerable elements.

    Derived by inclusion-exclusion over each prescribed set of r elements.
    """
    if n < 1:
        raise ValueError("n must be at least 1")
    f = [forced_subset_count(n, k) for k in range(n + 1)]
    return {
        r: comb(n, r) * sum(
            (-1) ** j * comb(n - r, j) * f[r + j]
            for j in range(n - r + 1)
        )
        for r in range(n + 1)
    }


def exhaustive_histogram(n: int) -> dict[int, int]:
    """Enumerate all n^(n*n) operation tables; recommended n<=3."""
    if not (1 <= n <= 3):
        raise ValueError("Exhaustive enumeration is deliberately restricted to 1<=n<=3")
    frequencies = Counter({r: 0 for r in range(n + 1)})
    for table in product(range(n), repeat=n * n):
        frequencies[len(nongenerable(table, n))] += 1
    return dict(sorted(frequencies.items()))


def produce_report(max_size: int = 4) -> dict[str, object]:
    if not (1 <= max_size <= 10):
        raise ValueError("Choose a maximum size in 1..10")
    result: dict[str, object] = {
        "hypothesis": "all elements x are tested: no a,b distinct from x yield F(a,b)=x",
        "max_size": max_size,
        "systems": [],
    }
    for n in range(1, max_size + 1):
        analytical = analytic_histogram(n)
        total = n ** (n * n)
        assert sum(analytical.values()) == total
        item: dict[str, object] = {
            "size": n,
            "number_of_all_operations": total,
            "counts_by_number_nongenerable": {str(r): analytical[r] for r in range(n + 1)},
            "method": "exhaustive enumeration + independent analytical formula" if n <= 3 else "analytical formula only",
        }
        if n <= 3:
            enumerated = exhaustive_histogram(n)
            if enumerated != analytical:
                raise AssertionError(f"Mismatch at n={n}: {enumerated} != {analytical}")
            item["verified_by_exhaustive_enumeration"] = True
        else:
            item["verified_by_exhaustive_enumeration"] = False
        result["systems"].append(item)
    return result


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--max-size", type=int, default=4)
    parser.add_argument("--output", help="Write a UTF-8 JSON report to this file")
    arguments = parser.parse_args()
    content = json.dumps(produce_report(arguments.max_size), ensure_ascii=False, indent=2) + "\n"
    if arguments.output:
        with open(arguments.output, "w", encoding="utf-8") as f:
            f.write(content)
    else:
        print(content, end="")


if __name__ == "__main__":
    main()
