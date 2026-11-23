"""Study 09: independent finite-monoid Green-J structural criterion tests."""
import json
import sys
import unittest
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/"experiments"))
from green_structural_monoids import (  # noqa: E402
    structural_audit, group_with_zero, unit_with_left_zero_ideal,
    c3_with_trivial_group_ideal, c3_with_trivial_group_ideal_and_zero,
    principal_ideal, make_report, test_exact_two_nonunit_criterion,
)
from finite_monoids import operation_tables_with_identity, associative


def independent_e(table):
    n=round(len(table)**0.5)
    return tuple(x for x in range(n)
                 if not any(table[a*n+b]==x
                            for a in range(n) if a!=x
                            for b in range(n) if b!=x))


class StudyNineTests(unittest.TestCase):
    def test_all_labelled_monoids_upto_order_three(self):
        counts=[]
        for n in range(1,4):
            verified=0
            for tab in operation_tables_with_identity(n):
                if not associative(tab,n):
                    continue
                out=structural_audit(tab)
                self.assertEqual(tuple(out["E_structural"]), independent_e(tab))
                self.assertEqual(tuple(out["E_direct"]), independent_e(tab))
                for x in out["maximal_singleton_obstructions"]:
                    self.assertIn(x,out["E_direct"])
                verified+=1
            counts.append(verified)
        self.assertEqual(counts,[1,2,11])

    def test_group_with_zero_has_maximal_singleton_obstruction(self):
        tab=group_with_zero()
        out=structural_audit(tab)
        self.assertEqual(out["units"],[0,1,2])
        self.assertEqual(out["nonunits"],[3])
        self.assertEqual(out["maximal_singleton_obstructions"],[3])
        self.assertEqual(out["E_direct"],[3])

    def test_maximal_J_class_of_size_two_not_sufficient(self):
        tab=unit_with_left_zero_ideal("C3",False)
        out=structural_audit(tab)
        self.assertEqual(len(out["maximal_nonunit_j_classes"]),1)
        self.assertEqual(len(out["maximal_nonunit_j_classes"][0]),2)
        self.assertEqual(out["E_direct"],[3,4])
        self.assertEqual(out["unit_double_orbit_sizes"],{"3":1,"4":1})
        self.assertFalse(test_exact_two_nonunit_criterion(tab)["E_empty"])

    def test_two_nonunits_nontrivial_action_exact(self):
        for group in ("C4","V4"):
            with self.subTest(group=group):
                tab=unit_with_left_zero_ideal(group,True)
                out=structural_audit(tab)
                self.assertEqual(out["E_direct"],[])
                self.assertEqual(out["unit_double_orbit_sizes"],{"4":2,"5":2})
                self.assertTrue(test_exact_two_nonunit_criterion(tab)["E_empty"])

    def test_trivial_unit_action_can_still_give_E_empty(self):
        out=structural_audit(c3_with_trivial_group_ideal())
        self.assertEqual(out["E_direct"],[])
        self.assertEqual(out["unit_double_orbit_sizes"],
                         {"3":1,"4":1,"5":1})
        self.assertEqual(out["maximal_nonunit_j_classes"],[[3,4,5]])
        self.assertEqual(len(out["witnesses_for_nonunits"]),3)

    def test_top_class_passes_but_lower_zero_fails(self):
        out=structural_audit(c3_with_trivial_group_ideal_and_zero())
        self.assertEqual(out["E_direct"],[6])
        self.assertEqual(out["maximal_nonunit_j_classes"],[[3,4,5]])
        self.assertEqual(len(out["j_classes_of_nonunits"]),2)
        self.assertEqual(out["unit_double_orbit_sizes"]["6"],1)
        self.assertNotIn("6",out["witnesses_for_nonunits"])

    def test_principal_J_ideals_in_7_element_counterexample(self):
        tab=c3_with_trivial_group_ideal_and_zero()
        for a in (3,4,5):
            self.assertEqual(principal_ideal(tab,7,a),frozenset((3,4,5,6)))
        self.assertEqual(principal_ideal(tab,7,6),frozenset((6,)))

    def test_all_ten_class_representatives(self):
        rows=json.loads(
            (ROOT/"results"/"minimal_monoids_order6.json").read_text(encoding="utf-8")
        )["unit_group_decomposition"]
        total=0
        for section in rows:
            for obj in section["representatives"]:
                t=tuple(x for row in obj["table"] for x in row)
                out=structural_audit(t)
                self.assertEqual(out["E_direct"],[])
                self.assertEqual(out["E_structural"],[])
                self.assertFalse(out["maximal_singleton_obstructions"])
                total+=1
        self.assertEqual(total,10)

    def test_nonassociative_table_rejected(self):
        with self.assertRaises(ValueError):
            structural_audit((0,1,2,1,2,2,2,1,1)) # nonassociative, identity 0

    def test_new_report_coverage(self):
        out=make_report()
        self.assertEqual([x["enumerated_monoids"]
                          for x in out["small_monoids_exhaustive"]],
                         [1,2,11,156])
        self.assertEqual(len(out["minimal_six_class_examples"]),10)
        self.assertEqual(len(out["theorems"]),5)


if __name__=="__main__":
    unittest.main()
