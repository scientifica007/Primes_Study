"""Automated checks of the residual-ring theorem and the cancellative-group cases."""
import sys
import unittest
from itertools import permutations
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "experiments"))
from multiplication_mod_n import (  # noqa: E402
    is_prime, observed_nongenerable, predicted_nongenerable, report
)


def nongenerable_from_binary_table(elements, operation):
    result = []
    for x in elements:
        if not any(
            operation(a, b) == x
            for a in elements if a != x
            for b in elements if b != x
        ):
            result.append(x)
    return result


class TestResidueMultiplication(unittest.TestCase):
    def test_prime_detection(self):
        self.assertEqual([n for n in range(2, 31) if is_prime(n)],
                         [2, 3, 5, 7, 11, 13, 17, 19, 23, 29])

    def test_exceptional_cases(self):
        expected = {
            2: [0, 1], 3: [0, 2], 4: [2, 3], 5: [0],
            6: [3, 5], 7: [0], 8: [], 9: [],
            10: [5], 11: [0], 12: [], 14: [7],
            20: [], 22: [11],
        }
        for n, answer in expected.items():
            with self.subTest(n=n):
                self.assertEqual(observed_nongenerable(n), answer)

    def test_closed_theorem_against_exhaustive_tables(self):
        for n in range(2, 201):
            with self.subTest(modulus=n):
                self.assertEqual(observed_nongenerable(n),
                                 predicted_nongenerable(n))

    def test_zero_if_and_only_if_modulus_is_prime(self):
        for n in range(2, 201):
            self.assertEqual(0 in observed_nongenerable(n), is_prime(n))

    def test_report(self):
        data = report(100)
        self.assertTrue(data["all_match"])
        self.assertEqual(data["range"], {"start": 2, "end": 100})
        self.assertEqual(len(data["cases"]), 99)

    def test_cyclic_groups_under_addition(self):
        for n in range(1, 101):
            group = list(range(n))
            observed = nongenerable_from_binary_table(
                group, lambda a, b: (a + b) % n
            )
            expected = [0] if n == 1 else ([1] if n == 2 else [])
            with self.subTest(n=n):
                self.assertEqual(observed, expected)

    def test_symmetric_group_s3(self):
        group = list(permutations(range(3)))

        def compose(a, b):
            return tuple(a[b[i]] for i in range(3))

        self.assertEqual(nongenerable_from_binary_table(group, compose), [])

    def test_nonnegative_addition_respects_zero_and_one(self):
        elements = range(101)
        observed = nongenerable_from_binary_table(elements, lambda a, b: a+b)
        self.assertEqual(observed, [0, 1])

    def test_nonnegative_multiplication_respects_zero_and_one(self):
        elements = range(101)
        observed = nongenerable_from_binary_table(elements, lambda a, b: a*b)
        expected = [0, 1] + [p for p in range(2, 101) if is_prime(p)]
        self.assertEqual(observed, expected)


if __name__ == "__main__":
    unittest.main()
