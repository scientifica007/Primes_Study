"""Reproducibility checks, no third-party dependencies."""
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "experiments"))
from finite_binary_systems import (  # noqa: E402
    analytic_histogram, exhaustive_histogram, forced_subset_count,
    nongenerable, produce_report, witnesses,
)


class TestRelationalNongenerability(unittest.TestCase):
    def test_one_element_is_nongenerable(self):
        self.assertEqual(nongenerable((0,), 1), (0,))
        self.assertEqual(witnesses((0,), 1, 0), [])

    def test_zero_and_one_are_not_excluded(self):
        # In S={0,1}, left projection F(a,b)=a conserves its inputs.
        self.assertEqual(nongenerable((0, 0, 1, 1), 2), (0, 1))
        # Opposite diagonal outputs generate both elements externally.
        self.assertEqual(nongenerable((1, 0, 0, 0), 2), ())

    def test_repetition_of_input_is_allowed(self):
        # F(1,1)=0 produces x=0 from two equal inputs, each !=0.
        self.assertEqual(witnesses((0, 0, 0, 0), 2, 0), [(1, 1)])

    def test_hand_verified_histograms(self):
        expected = {
            1: {0: 0, 1: 1},
            2: {0: 4, 1: 8, 2: 4},
            3: {0: 9683, 1: 8400, 2: 1536, 3: 64},
            4: {0: 3094232576, 1: 1113009152, 2: 86244864, 3: 1476608, 4: 4096},
        }
        for n, histogram in expected.items():
            with self.subTest(n=n):
                self.assertEqual(analytic_histogram(n), histogram)
                self.assertEqual(sum(histogram.values()), n ** (n * n))

    def test_all_nongenerable_iff_conservative_exhaustive_up_to_3(self):
        from itertools import product
        for n in (1, 2, 3):
            for table in product(range(n), repeat=n * n):
                all_nongenerable = len(nongenerable(table, n)) == n
                conservative = all(
                    table[a * n + b] in (a, b)
                    for a in range(n) for b in range(n)
                )
                self.assertEqual(all_nongenerable, conservative)

    def test_analytic_matches_exhaustive(self):
        for n in (1, 2, 3):
            with self.subTest(n=n):
                self.assertEqual(exhaustive_histogram(n), analytic_histogram(n))

    def test_forced_subset_all_elements(self):
        for n in range(1, 7):
            self.assertEqual(forced_subset_count(n, n), 2 ** (n * (n - 1)))

    def test_report_notes_which_rows_are_exhaustive(self):
        report = produce_report(4)
        self.assertEqual(len(report["systems"]), 4)
        self.assertFalse(report["systems"][3]["verified_by_exhaustive_enumeration"])


if __name__ == "__main__":
    unittest.main()
