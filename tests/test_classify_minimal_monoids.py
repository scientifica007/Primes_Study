"""Independent checks for the ten order-six monoid isomorphism classes."""
import sys
import unittest
from itertools import permutations
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "experiments"))
from classify_minimal_monoids import (  # noqa: E402
    GROUPS, canonical, canonical_anti, classify_group,
    external_nongenerables, is_associative, is_identity,
    make_report, transpose, units, three_element_ideal_lemma,
)


def full_isomorphic(a, b, n):
    """Unrestricted isomorphism oracle: test every permutation fixing identity.

    Unlike the census program, this does NOT assume intrinsic unit blocks,
    and uses no group automorphisms or normal-form simplifications.
    """
    for tail in permutations(range(1, n)):
        bij = (0,) + tail
        if all(bij[a[i*n+j]] == b[bij[i]*n+bij[j]]
               for i in range(n) for j in range(n)):
            return True
    return False


def full_anti_isomorphic(a, b, n):
    return full_isomorphic(transpose(a, n), b, n)


class ClassifySixElementMonoidsTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.out = make_report()
        cls.representatives = [
            (row["group"], row["group_order"], record)
            for row in cls.out["unit_group_decomposition"]
            for record in row["representatives"]
        ]

    def test_all_ten_inequivalent_monoids_and_exact_counts(self):
        self.assertEqual(self.out["minimal_order"], 6)
        self.assertEqual(self.out["total_isomorphism_classes"], 10)
        self.assertEqual(self.out["total_anti_isomorphism_classes"], 7)
        self.assertEqual({row["group"]: row["isomorphism_classes"]
                          for row in self.out["unit_group_decomposition"]},
                         {"C3": 4, "C4": 3, "V4": 3})
        self.assertEqual({row["group"]: row["labelled_E_empty_with_group_table_fixed"]
                          for row in self.out["unit_group_decomposition"]},
                         {"C3": 13, "C4": 4, "V4": 12})

    def test_every_representative_is_associative_and_has_E_empty(self):
        self.assertEqual(len(self.representatives), 10)
        for group, m, obj in self.representatives:
            with self.subTest(group=group, mode=obj["unit_action"]):
                flat = tuple(value for row in obj["table"] for value in row)
                self.assertEqual(len(flat), 36)
                self.assertTrue(is_associative(flat, 6))
                self.assertTrue(is_identity(flat, 6))
                self.assertEqual(units(flat, 6), tuple(range(m)))
                self.assertEqual(external_nongenerables(flat, 6), ())
                self.assertEqual(obj["E"], [])
                self.assertEqual(obj["ideal_order"], 6-m)
                self.assertIn(obj["ideal_multiplication"],
                              ("left-zero ideal", "right-zero ideal",
                               "ideal group C2", "ideal group C3"))

    def test_no_two_representatives_isomorphic_unrestricted(self):
        for i, (_, _, a) in enumerate(self.representatives):
            t1 = tuple(value for row in a["table"] for value in row)
            for j in range(i+1, len(self.representatives)):
                t2 = tuple(value for row in self.representatives[j][2]["table"]
                           for value in row)
                with self.subTest(first=i, second=j):
                    self.assertFalse(full_isomorphic(t1, t2, 6))

    def test_seven_classes_modulo_opposite_independently(self):
        distinct = []
        for _, _, row in self.representatives:
            t = tuple(value for x in row["table"] for value in x)
            if not any(full_isomorphic(t, prev, 6)
                       or full_anti_isomorphic(t, prev, 6)
                       for prev in distinct):
                distinct.append(t)
        self.assertEqual(len(distinct), 7)

    def test_three_element_ideal_exhaustion(self):
        lemma = three_element_ideal_lemma()
        self.assertEqual(
            lemma,
            {
                "associative_labelled_semigroups_order3": 113,
                "with_no_E_labelled": 3,
                "isomorphism_classes_with_no_E": 1,
                "unique_class": "C3 group",
            },
        )

    def test_right_left_duals_explicitly(self):
        for g in ("C3","C4","V4"):
            reps = next(row["representatives"]
                        for row in self.out["unit_group_decomposition"]
                        if row["group"] == g)
            left = next(row for row in reps if row["unit_action"] == "left_active")
            right = next(row for row in reps if row["unit_action"] == "right_active")
            tleft = tuple(v for line in left["table"] for v in line)
            tright = tuple(v for line in right["table"] for v in line)
            self.assertTrue(full_anti_isomorphic(tleft, tright, 6))
            self.assertFalse(full_isomorphic(tleft, tright, 6))

    def test_all_exhaustive_group_action_counts(self):
        counts = {
            row["group"]: (
                row["group_actions"],
                row["associative_ideal_tables"],
                row["associative_monoids_with_group_table_fixed"],
            )
            for row in self.out["unit_group_decomposition"]
        }
        self.assertEqual(counts, {
            "C3": (3, 113, 123),
            "C4": (2, 8, 12),
            "V4": (4, 8, 20),
        })

    def test_no_duplicate_group_action_isomorphism_normal_form(self):
        for group,m,k in GROUPS:
            row = classify_group(group,m,k)
            normalforms = [
                canonical(tuple(value for line in obj["table"] for value in line),
                          group,m,k)
                for obj in row["representatives"]
            ]
            self.assertEqual(len(normalforms), len(set(normalforms)))
            self.assertEqual(len({
                canonical_anti(tab,group,m,k) for tab in normalforms
            }), row["anti_isomorphism_classes"])


if __name__ == "__main__":
    unittest.main()
