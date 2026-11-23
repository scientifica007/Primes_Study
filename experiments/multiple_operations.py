#!/usr/bin/env python3
"""Study the no-external-generation law across multiple operations.

All elements, including 0 and 1, are tested without exclusions. All
fundamental operations here have *positive* arity; the meaning of
zero-input operations/constants is kept as a separately marked extension.

Run:
  python3 experiments/multiple_operations.py --max-size 4 --max-operations 3
  python3 experiments/multiple_operations.py --max-size 4 --max-operations 3 --output results/multiple_binary_operations_n1_to_n4_m1_to_m3.json
"""
from __future__ import annotations

import argparse
import json
from itertools import product
from math import comb
from typing import Sequence

Operation = tuple[int, tuple[int, ...]]


def table_index(args: Sequence[int], n: int) -> int:
    index = 0
    for arg in args:
        index = n * index + arg
    return index


def evaluate(op: Operation, n: int, args: Sequence[int]) -> int:
    arity, table = op
    if arity < 1 or len(args) != arity or len(table) != n ** arity:
        raise ValueError("Expected positive arity and a complete operation table")
    if any(not 0 <= v < n for v in args):
        raise ValueError("Input outside carrier")
    value = table[table_index(args, n)]
    if not 0 <= value < n:
        raise ValueError("Output outside carrier")
    return value


def witnesses(operations: Sequence[Operation], n: int, x: int):
    """(operation_index, input_tuple) witnesses with every input != x."""
    result = []
    for i, (arity, table) in enumerate(operations):
        if arity < 1 or len(table) != n ** arity:
            raise ValueError("Only positive-arity, total operations are supported")
        for args in product((a for a in range(n) if a != x), repeat=arity):
            if evaluate((arity, table), n, args) == x:
                result.append((i, args))
    return result


def nongenerable(operations: Sequence[Operation], n: int) -> tuple[int, ...]:
    if n < 1:
        raise ValueError("Carrier must be nonempty")
    return tuple(x for x in range(n) if not witnesses(operations, n, x))


def closure(operations: Sequence[Operation], n: int, seeds: Sequence[int]):
    """Close seeds under all positive-arity fundamental operations.

    Returns (closed_set, passes_until_stable). Intermediates may be reused.
    """
    members = set(seeds)
    if any(not 0 <= x < n for x in members):
        raise ValueError("Initial input outside the carrier")
    rounds = 0
    while True:
        new = set(members)
        for arity, table in operations:
            if arity < 1 or len(table) != n ** arity:
                raise ValueError("Expected a total operation of positive arity")
            for args in product(sorted(members), repeat=arity):
                new.add(evaluate((arity, table), n, args))
        if new == members:
            return tuple(sorted(new)), rounds
        members = new
        rounds += 1


def expected_joint_nongenerable(operations: Sequence[Operation], n: int):
    """Intersection identity E_{F1,...,Fm} = intersection of E_{Fi}."""
    intersection = set(range(n))
    for op in operations:
        intersection.intersection_update(nongenerable([op], n))
    return tuple(sorted(intersection))


def fixed_subset_count(n: int, k: int) -> int:
    """One binary table preserving E(x) for a fixed k-subset."""
    if not 1 <= n or not 0 <= k <= n:
        raise ValueError("Expected n>=1 and 0<=k<=n")
    return (
        (n - k) ** ((n - k) ** 2)
        * (n - k + 1) ** (k * (2 * (n - k) + 1))
        * (n - k + 2) ** (k * (k - 1))
    )


def exact_histogram(n: int, m: int) -> dict[int, int]:
    """Count ordered m-tuples of independent binary operation tables by |E|."""
    if not 1 <= n or not 1 <= m:
        raise ValueError("Expected n>=1, m>=1")
    F = [fixed_subset_count(n, k) for k in range(n + 1)]
    hist = {
        r: comb(n, r) * sum(
            (-1) ** j * comb(n-r, j) * F[r+j] ** m
            for j in range(n-r+1)
        )
        for r in range(n+1)
    }
    assert all(v >= 0 for v in hist.values())
    assert sum(hist.values()) == n ** (m*n*n)
    return hist


def exhaustive_histogram(n: int, m: int) -> dict[int, int]:
    """Brute-force all operation families for n^(m*n*n) <= 20,000."""
    size = n ** (m*n*n)
    if not 1 <= n or not 1 <= m or size > 20000:
        raise ValueError("Exhaustive enumeration limited to <= 20,000 families")
    histogram = {r: 0 for r in range(n+1)}
    for flattened in product(range(n), repeat=m*n*n):
        ops = [
            (2, flattened[j*n*n:(j+1)*n*n])
            for j in range(m)
        ]
        histogram[len(nongenerable(ops, n))] += 1
    return histogram


def report(max_size: int = 4, max_operations: int = 3):
    if not 1 <= max_size <= 6 or not 1 <= max_operations <= 6:
        raise ValueError("Expected sizes 1..6 and operation counts 1..6")
    rows = []
    for n in range(1, max_size+1):
        for m in range(1, max_operations+1):
            hist = exact_histogram(n, m)
            total = n ** (m*n*n)
            brute = total <= 20000
            if brute and exhaustive_histogram(n, m) != hist:
                raise AssertionError(f"Analytic/exhaustive mismatch: {n=}, {m=}")
            rows.append({
                "carrier_size": n,
                "binary_operation_count": m,
                "ordered_families": total,
                "count_by_jointly_nongenerable_elements": {
                    str(k): hist[k] for k in range(n+1)
                },
                "fraction_with_no_jointly_nongenerable_elements":
                    f"{hist[0]}/{total}",
                "independent_exhaustive_census": brute,
            })
    return {
        "model": "positive-arity operations; original law without exclusions",
        "binary_table_families": rows,
        "theorem": "E(F_1,...,F_m) = intersection_i E(F_i); also invariant under term composition",
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--max-size", type=int, default=4)
    parser.add_argument("--max-operations", type=int, default=3)
    parser.add_argument("--output")
    args = parser.parse_args()
    result = json.dumps(report(args.max_size, args.max_operations),
                        ensure_ascii=False, indent=2) + "\n"
    if args.output:
        with open(args.output, "w", encoding="utf-8") as out:
            out.write(result)
    else:
        print(result, end="")


if __name__ == "__main__":
    main()
