import sys
import unittest
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/"experiments"))
from triple_intersection_certificate import report
class TripleIntersectionTests(unittest.TestCase):
    def test_report(self):
        data=report()
        self.assertEqual(data,json.loads((ROOT/"results"/"triple_intersection_study18.json").read_text()))
        self.assertEqual(data["total_tables"],535)
