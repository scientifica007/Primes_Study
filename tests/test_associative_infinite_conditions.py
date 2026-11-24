import sys
import unittest
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/"experiments"))
from associative_infinite_conditions import report
class AssociativeInfiniteConditionsTests(unittest.TestCase):
    def test_report(self):
        r=report()
        self.assertEqual(r,json.loads((ROOT/"results"/"associative_infinite_study24.json").read_text()))
        self.assertEqual(r["clifford_tables"],2789)
        self.assertEqual(r["translation"]["certificates"],277)
