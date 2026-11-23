"""Study 10 independently tests Rees sandwich support versus Green invariants."""
import sys
import unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/"experiments"))
from rees_principal_factors import (
    rees_c3_monoid, e_direct, green_fingerprint,
    e_rees_principal_factor, whole_e_prediction,
    regular_supports, study,
)


def independent_E(t):
    n=int(len(t)**0.5)
    return {x for x in range(n)
            if all(t[a*n+b]!=x for a in range(n) if a!=x
                   for b in range(n) if b!=x)}


class ReesPrincipalFactorTests(unittest.TestCase):
    def test_two_ten_element_monoids_same_Green_and_regularity_but_different_E(self):
        p=((0,1,1),(1,0,1))
        q=((0,0,1),(1,1,1))
        ta,_,_=rees_c3_monoid(p)
        tb,_,_=rees_c3_monoid(q)
        self.assertEqual(independent_E(ta),set())
        self.assertEqual(independent_E(tb),{8})
        ga,gb=green_fingerprint(ta),green_fingerprint(tb)
        for k in ("R","L","J","H","regular_elements","idempotent_count",
                  "global_unit_group_order","external_unit_actions_on_nonunits"):
            self.assertEqual(ga[k],gb[k],k)
        self.assertEqual(ga["idempotent_count"],6)
        self.assertEqual(ga["J"],((0,1,2),(3,4,5,6,7,8),(9,)))

    def test_support_graph_criterion_with_zero_matrix_cells(self):
        for rows,cols in ((2,2),(2,3),(3,3)):
            for p in regular_supports(rows,cols):
                tab,rees,pp=rees_c3_monoid(p)
                self.assertEqual(
                    tuple(sorted(independent_E(tab))),
                    whole_e_prediction(pp,1,rees),
                )

    def test_h2_and_h3_rees_classification(self):
        for h in (2,3):
            for p in regular_supports(2,2):
                tab,rees,pp=rees_c3_monoid(p,h)
                self.assertEqual(
                    tuple(sorted(independent_E(tab))),
                    whole_e_prediction(pp,h,rees),
                )
                self.assertEqual(e_rees_principal_factor(pp,h),())

    def test_single_H_class_of_two_elements(self):
        tab,rees,p=rees_c3_monoid(((1,),),2)
        self.assertEqual(
            e_rees_principal_factor(p,2),((0,1,0),)
        )
        self.assertEqual(independent_E(tab),{4,5})

    def test_all_nonzero_matrix_gives_zero_element_E(self):
        for p in (((1,1),(1,1)),((1,1,1),(1,1,1))):
            tab,rees,pp=rees_c3_monoid(p)
            z=3+len(rees)
            self.assertIn(z,independent_E(tab))
            self.assertEqual(set(whole_e_prediction(pp,1,rees)),independent_E(tab))

    def test_extensive_support_census(self):
        report=study()
        self.assertEqual(report["example_A"]["E"],[])
        self.assertEqual(report["example_B"]["E"],[8])
        counts={(x["matrix_rows"],x["matrix_columns"],x["local_group_order"]):
                (x["regular_supports_checked"],x["E_count_distribution"])
                for x in report["regular_support_census"]}
        self.assertEqual(counts[(2,2,1)],(7,{"1":5,"2":2}))
        self.assertEqual(counts[(2,3,1)],(25,{"0":12,"1":13}))
        self.assertEqual(counts[(3,3,1)],(265,{"0":246,"1":19}))
        self.assertEqual(counts[(2,2,2)],(7,{"0":6,"1":1}))
        self.assertEqual(counts[(2,2,3)],(7,{"0":6,"1":1}))

    def test_reject_nonregular_support_and_bad_group_cell(self):
        with self.assertRaises(ValueError):
            rees_c3_monoid(((1,0),(0,0)))
        with self.assertRaises(ValueError):
            rees_c3_monoid(((1,),),2,labelled_values=((3,),))


if __name__=="__main__":
    unittest.main()
