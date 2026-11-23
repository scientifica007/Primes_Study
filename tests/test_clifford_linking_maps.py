"""Study 11 independent direct-product oracle and linking-map validation."""
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "experiments"))
from clifford_linking_maps import (  # noqa: E402
    CyclicClifford, chain, diamond_example,
    verify_model, nine_element_pair, group_partition_fingerprint,
    exhaustive_cyclic_chain_verification,
)


def external_oracle(table):
    """Independent brute-force quantifier order and formulation of E."""
    n = round(len(table) ** .5)
    return tuple(x for x in range(n) if all(
        table[n*a+b] != x for a in range(n) for b in range(n)
        if a != x and b != x))


class CliffordLinkingTests(unittest.TestCase):
    def test_nine_element_counterexample_with_identical_local_structures(self):
        a = chain((3,4,2),(0,0))
        b = chain((3,4,2),(0,1))
        ta,tb = a.table(),b.table()
        self.assertNotEqual(ta,tb)
        self.assertEqual(external_oracle(ta),(8,))
        self.assertEqual(external_oracle(tb),())
        self.assertEqual(verify_model(a)["E"],[8])
        self.assertEqual(verify_model(b)["E"],[])
        fa=group_partition_fingerprint(ta)
        fb=group_partition_fingerprint(tb)
        self.assertEqual(fa,fb)
        self.assertEqual(fa["idempotents"],[0,3,7])
        self.assertEqual(fa["J"],[(0,1,2),(3,4,5,6),(7,8)])
        self.assertEqual(fa["local_principal_factor_tables"],
                         fb["local_principal_factor_tables"])

    def test_single_node_boundary_includes_identity(self):
        for order, expected in ((1,(0,)),(2,(1,)),(3,()),(4,())):
            m=chain((order,),())
            self.assertEqual(external_oracle(m.table()),expected)
            self.assertEqual(m.internal_prediction()[0],expected)

    def test_two_layer_C4_to_C2_linking_map_is_decisive(self):
        self.assertEqual(external_oracle(chain((4,2),(0,)).table()),(5,))
        self.assertEqual(external_oracle(chain((4,2),(1,)).table()),())

    def test_diamond_singleton_bottom_emerges_from_incomparable_atoms(self):
        d=diamond_example()
        self.assertEqual(external_oracle(d.table()),(3,4))
        n=len(d.labels())
        self.assertEqual(n,6)
        self.assertEqual(d.table()[3*n+4],5)
        self.assertEqual(d.table()[4*n+3],5)
        self.assertTrue(d.internal_prediction()[1][5]["reason"].startswith("meet_of"))

    def test_exhaustive_two_and_three_layer_homomorphisms(self):
        results=exhaustive_cyclic_chain_verification()
        self.assertEqual([(r["valid_linking_systems_tested"],
                           r["systems_with_E_empty"]) for r in results],
                         [(24,10),(152,50)])
        self.assertEqual(results[0]["E_cardinality_histogram"],{0:10,1:10,2:4})
        self.assertEqual(results[1]["E_cardinality_histogram"],{0:50,1:62,2:32,3:8})

    def test_invalid_morphism_and_semilattice_rejected(self):
        valid=chain((4,2),(1,))
        with self.assertRaises(ValueError):
            CyclicClifford(valid.orders,valid.meet,
                           ((0,0,1),(0,1,0),(1,1,1),(0,1,1)))
        with self.assertRaises(ValueError):
            CyclicClifford((3,2),((0,1),(0,1)),valid.maps)
        with self.assertRaises(ValueError):
            CyclicClifford((3,2),valid.meet,((0,0,1),(0,1,1),(1,1,1)))

    def test_cross_layer_map_single_boolean_bit(self):
        r=nine_element_pair()
        self.assertTrue(
            r["identical_principal_factors_Green_order_idempotent_positions_unit_action"]
        )
        self.assertEqual(r["A_trivial_middle_to_bottom"]["E"],[8])
        self.assertEqual(r["B_surjective_middle_to_bottom"]["E"],[])
        self.assertEqual(r["common_fingerprint"]["idempotents"],[0,3,7])


if __name__ == "__main__":
    unittest.main()
