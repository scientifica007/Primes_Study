#!/usr/bin/env python3
"""Study the original no-external-witness law under multiplication mod n.

The law tests EVERY residue x, including 0 and 1:
    E(x) iff no a,b distinct from x have a*b == x (mod n).

Usage:
    python3 experiments/multiplication_mod_n.py --max-modulus 100
    python3 experiments/multiplication_mod_n.py --max-modulus 100 --output results/residue_multiplication_n2_to_n100.json
"""

from __future__ import annotations

import argparse
import json
from math import gcd, isqrt


def is_prime(n: int) -> bool:
    if n < 2:
        return False
    return all(n % d for d in range(2, isqrt(n) + 1))


def observed_nongenerable(n: int) -> list[int]:
    """Independent exhaustive operation-table evaluation, O(n^2)."""
    if n < 2:
        raise ValueError("Modulus must be at least 2")
    generated = [False] * n
    for a in range(n):
        for b in range(n):
            x = (a * b) % n
            if a != x and b != x:
                generated[x] = True
    return [x for x in range(n) if not generated[x]]


def predicted_nongenerable(n: int) -> list[int]:
    """Closed classification theorem; independent of the table enumeration."""
    if n < 2:
        raise ValueError("Modulus must be at least 2")
    result: set[int] = set()
    # Zero iff modulus prime.
    if is_prime(n):
        result.add(0)
    # The unique nonzero self-opposite residue when n=2p, p prime.
    if n % 2 == 0 and is_prime(n // 2):
        result.add(n // 2)
    # Units: only when the entire unit group has size 1 or 2.
    units = [x for x in range(n) if gcd(x, n) == 1]
    if len(units) == 1:
        result.add(1)
    elif len(units) == 2:
        result.add(next(u for u in units if u != 1))
    return sorted(result)


def report(max_modulus: int = 100) -> dict[str, object]:
    if not 2 <= max_modulus <= 1000:
        raise ValueError("Maximum modulus must be between 2 and 1000")
    cases: list[dict[str, object]] = []
    for n in range(2, max_modulus + 1):
        observed = observed_nongenerable(n)
        predicted = predicted_nongenerable(n)
        cases.append({
            "n": n,
            "observed": observed,
            "predicted": predicted,
            "equal": observed == predicted,
        })
    return {
        "definition": "E(x): no a,b in Z/nZ, both distinct from x, satisfy a*b=x",
        "range": {"start": 2, "end": max_modulus},
        "cases": cases,
        "all_match": all(case["equal"] for case in cases),
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--max-modulus", type=int, default=100)
    parser.add_argument("--output")
    args = parser.parse_args()
    payload = json.dumps(report(args.max_modulus), ensure_ascii=False, indent=2) + "\n"
    if args.output:
        with open(args.output, "w", encoding="utf-8") as file:
            file.write(payload)
    else:
        print(payload, end="")


if __name__ == "__main__":
    main()
