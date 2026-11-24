import sys
import unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/"experiments"))
from fixed_rank_oracle import build, check, report

class FixedRankTests(unittest.TestCase):
    def test_small_promised_families(self):
        r=report()
        self.assertEqual(r["total_tables_verified"],188)
        for x in r["rows"]:
            self.assertEqual(x["E_empty_tables"]*2,x["tables_verified"])
            self.assertTrue(x["identical_metadata"])
            self.assertTrue(x["rank_lower_and_upper_certificates"])
    def test_invalid_promise(self):
        for w,v in (((0,),(0,)),((1,),(1,))):
            with self.assertRaises(ValueError):
                build(1,1,w,v)

if __name__=="__main__":
    unittest.main()
