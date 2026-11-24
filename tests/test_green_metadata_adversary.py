import sys
import unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/"experiments"))
from green_metadata_adversary import build, fingerprint, verify, report
from finite_monoids import E, associative

class FixedGreenMetadataTests(unittest.TestCase):
    def test_complete_families(self):
        r=report()
        self.assertEqual(r["total_tables_verified"],683)
        for x in r["rows"]:
            self.assertEqual(x["E_empty_tables"],x["tables_verified"]-1)
            self.assertTrue(x["fixed_metadata_verified"])
            self.assertTrue(x["all_blocks_queried_on_base"])
    def test_one_bit_is_four_table_cells(self):
        a=build(2,3,(0,)*6)
        b=build(2,3,(0,0,0,0,1,0))
        self.assertEqual(sum(x!=y for x,y in zip(a,b)),4)
        self.assertEqual(fingerprint(a),fingerprint(b))
        self.assertTrue(associative(a,16))
        self.assertTrue(associative(b,16))
        self.assertEqual(E(a,16),(14,))
        self.assertEqual(E(b,16),())
    def test_input_validation(self):
        with self.assertRaises(ValueError):
            build(0,1,())
        with self.assertRaises(ValueError):
            build(1,1,(2,))

if __name__=="__main__":
    unittest.main()
