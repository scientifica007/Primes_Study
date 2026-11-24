import sys
import unittest
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/"experiments"))
from infinite_depth_separation import report
class InfiniteDepthSeparationTests(unittest.TestCase):
    def test_report(self):
        r=report()
        self.assertEqual(r,json.loads((ROOT/"results"/"infinite_depth_study23.json").read_text()))
        self.assertEqual(r["total_seed_subsets"],43690)
        self.assertEqual(sum(x["bases_checked"] for x in r["group_checks"]),843)
