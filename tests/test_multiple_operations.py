"""Reproduce the multi-operation first-appearance and enumeration results."""
import random
import sys
import unittest
from itertools import product
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "experiments"))
from multiple_operations import (  # noqa: E402
    closure, evaluate, exact_histogram, exhaustive_histogram, nongenerable,
    expected_joint_nongenerable, report, witnesses,
)


class TestMultipleOperations(unittest.TestCase):
    def test_two_group_operations_cancel_all_E(self):
        xor = (2, (0, 1, 1, 0))
        xnor = (2, (1, 0, 0, 1))
        self.assertEqual(nongenerable([xor], 2), (1,))
        self.assertEqual(nongenerable([xnor], 2), (0,))
        self.assertEqual(nongenerable([xor, xnor], 2), ())
        self.assertEqual(witnesses([xor, xnor], 2, 0), [(0, (1, 1))])
        self.assertEqual(witnesses([xor, xnor], 2, 1), [(1, (0, 0))])

    def test_all_binary_pairs_on_two_elements(self):
        operations = [(2, table) for table in product(range(2), repeat=4)]
        for f in operations:
            for g in operations:
                pair = [f, g]
                joint = nongenerable(pair, 2)
                self.assertEqual(joint, expected_joint_nongenerable(pair, 2))
                for x in (0, 1):
                    closed, _ = closure(pair, 2, [y for y in (0, 1) if y != x])
                    self.assertEqual(x not in closed, x in joint)

    def test_multiple_arity_and_first_appearance(self):
        rng = random.Random(20261123)
        for n in (2, 3):
            for _ in range(250):
                ops = [
                    (1, tuple(rng.randrange(n) for _ in range(n))),
                    (2, tuple(rng.randrange(n) for _ in range(n*n))),
                    (3, tuple(rng.randrange(n) for _ in range(n*n*n))),
                ]
                joint = nongenerable(ops, n)
                self.assertEqual(joint, expected_joint_nongenerable(ops, n))
                for x in range(n):
                    other = tuple(a for a in range(n) if a != x)
                    closed, _ = closure(ops, n, other)
                    self.assertEqual(x not in closed, x in joint)

    def test_term_operation_does_not_change_E(self):
        rng = random.Random(8675309)
        for n in (2, 3):
            for _ in range(125):
                f = (2, tuple(rng.randrange(n) for _ in range(n*n)))
                g = (2, tuple(rng.randrange(n) for _ in range(n*n)))
                # H(a,b)=F(G(a,b), a) is an operation derived by composition.
                derived = (2, tuple(
                    evaluate(f, n, (evaluate(g, n, (a,b)), a))
                    for a in range(n) for b in range(n)
                ))
                self.assertEqual(
                    nongenerable([f,g], n),
                    nongenerable([f,g,derived], n)
                )

    def test_no_elements_excluded_even_on_singleton(self):
        self.assertEqual(nongenerable([], 1), (0,))
        self.assertEqual(nongenerable([(2, (0,))], 1), (0,))
        self.assertEqual(nongenerable([(1, (0,))], 1), (0,))
        self.assertEqual(closure([(2, (0,))], 1, ()), ((), 0))

    def test_exact_histograms(self):
        self.assertEqual(exact_histogram(2,1), {0: 4, 1: 8, 2: 4})
        self.assertEqual(exact_histogram(2,2), {0: 144, 1: 96, 2: 16})
        self.assertEqual(exact_histogram(2,3), {0: 3136, 1: 896, 2: 64})
        self.assertEqual(exact_histogram(3,1), {0: 9683, 1: 8400, 2: 1536, 3: 64})
        self.assertEqual(exact_histogram(3,2), {
            0: 343062089, 1: 43371264, 2: 983040, 3: 4096
        })

    def test_independent_enumeration(self):
        for n, m in [(1, 1), (1, 3), (2, 1), (2, 2), (2, 3), (3, 1)]:
            with self.subTest(n=n, m=m):
                self.assertEqual(exhaustive_histogram(n,m), exact_histogram(n,m))

    def test_multi_operation_distribution_total(self):
        for n in range(1, 5):
            for m in range(1, 4):
                hist = exact_histogram(n,m)
                self.assertEqual(sum(hist.values()), n ** (m*n*n))

    def test_report_metadata(self):
        r = report(4, 3)
        self.assertEqual(len(r["binary_table_families"]), 12)
        self.assertEqual(
            next(row for row in r["binary_table_families"] if
                 row["carrier_size"] == 3 and row["binary_operation_count"] == 2)
            ["count_by_jointly_nongenerable_elements"]["0"], 343062089
        )


if __name__ == "__main__":
    unittest.main()
