"""Exhaustive verification of the finite-monoid structural study."""
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "experiments"))

from finite_monoids import (  # noqa: E402
    E, associative, boolean_meet_E, direct_product_C3_B,
    cyclic_boolean_E, cyclic_boolean_prediction,
    enumerate_monoids, make_report, operation_tables_with_identity,
    predicted_E, units, witnesses,
)


class TestFiniteMonoids(unittest.TestCase):
    def test_fixed_identity_all_candidate_tables(self):
        for n in range(1, 5):
            self.assertEqual(sum(1 for _ in operation_tables_with_identity(n)),
                             n ** ((n - 1) ** 2))

    def test_all_monoids_classified_up_to_four(self):
        expected = {
            1: (1, [0, 1]),
            2: (2, [0, 1, 1]),
            3: (11, [1, 0, 6, 4]),
            4: (156, [4, 18, 24, 90, 20]),
        }
        for n, (count, distribution) in expected.items():
            with self.subTest(n=n):
                row = enumerate_monoids(n)
                self.assertEqual(row["monoids_with_fixed_identity"], count)
                self.assertEqual(
                    list(row["histogram_by_number_of_E_elements"].values()),
                    distribution
                )
                self.assertEqual(row["nongroup_monoids_with_no_E_elements"], 0)

    def test_units_classification_does_not_require_cancellation(self):
        for n in (2, 3, 4):
            for table in operation_tables_with_identity(n):
                if not associative(table, n):
                    continue
                actual_E = E(table, n)
                U = units(table, n)
                self.assertEqual(actual_E, predicted_E(table, n))
                if len(U) == 1:
                    self.assertIn(0, actual_E)
                if len(U) == 2:
                    self.assertIn(next(x for x in U if x != 0), actual_E)
                    self.assertNotIn(0, actual_E)
                if len(U) >= 3:
                    self.assertFalse(set(actual_E) & set(U))

    def test_six_element_nongroup_no_E(self):
        table, identity = direct_product_C3_B()
        self.assertEqual(identity, 1)
        self.assertTrue(associative(table, 6))
        self.assertEqual(E(table, 6), ())
        self.assertEqual(table[0 * 6 + 0], 0)
        # Non-cancellative: left-multiplication by (0,0) collapses elements
        self.assertEqual(table[0 * 6 + 0], table[0 * 6 + 1])
        self.assertIn((3, 4), witnesses(table, 6, 0))

    def test_boolean_cubes_all_elements_including_zero(self):
        for k in range(1, 6):
            observed = boolean_meet_E(k)
            expected = tuple(x for x in range(1 << k)
                             if k - x.bit_count() <= 1)
            with self.subTest(k=k):
                self.assertEqual(observed, expected)
                self.assertEqual(len(observed), k + 1)

    def test_cyclic_group_boolean_product_transition(self):
        for m in range(1, 6):
            for k in range(0, 4):
                with self.subTest(group_order=m, boolean_rank=k):
                    observed = cyclic_boolean_E(m, k)
                    predicted = cyclic_boolean_prediction(m, k)
                    self.assertEqual(observed, predicted)
                    expected_count = k + 1 if m == 1 else (1 if m == 2 else 0)
                    self.assertEqual(len(observed), expected_count)

    def test_report_contains_reproducible_evidence(self):
        data = make_report(4)
        self.assertEqual(len(data["monoids"]), 4)
        self.assertEqual(data["six_element_example"]["E_elements"], [])
        self.assertEqual(data["boolean_meet_examples"][4]["E_count"], 6)


if __name__ == "__main__":
    unittest.main()
