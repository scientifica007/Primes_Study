import sys
import unittest
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/"experiments"))
from generating_intersections import report, build, parity

class GeneratingIntersectionTests(unittest.TestCase):
    def test_report(self):
        data=report()
        self.assertEqual(data,json.loads((ROOT/"results"/"generating_intersections_study16.json").read_text()))
        self.assertEqual(data["total_tables"],22)
    def test_invalid(self):
        with self.assertRaises(ValueError):build(1,1,True,(1,),(0,))
        with self.assertRaises(ValueError):parity(1)
