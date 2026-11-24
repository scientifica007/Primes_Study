import sys
import unittest
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/"experiments"))
from arity_intersection_depth import report
class ArityIntersectionDepthTests(unittest.TestCase):
    def test_report(self):
        actual=report()
        expected=json.loads((ROOT/"results"/"arity_intersection_study21.json").read_text())
        self.assertEqual(actual,expected)
        self.assertEqual(actual["total_tables"],19956)
