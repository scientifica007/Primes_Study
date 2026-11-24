import sys
import unittest
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/"experiments"))
from intersection_depth_classification import report
class DepthClassificationTests(unittest.TestCase):
    def test_report(self):
        r=report()
        expected=json.loads((ROOT/"results"/"intersection_depth_study20.json").read_text())["constructive_checks"]
        self.assertEqual(r,expected)
        self.assertEqual((r["pure_total"],r["upper_total"]),(5060,622))
        self.assertEqual(r["pair"][0]["h"][-2:],[96,96])
