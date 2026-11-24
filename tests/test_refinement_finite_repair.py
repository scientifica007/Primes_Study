import sys
import unittest
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/"experiments"))
from refinement_finite_repair import report

class FiniteRepairTests(unittest.TestCase):
    def test_report(self):
        r=report()
        self.assertEqual(r,json.loads((ROOT/"results"/"refinement_study22.json").read_text()))
        self.assertEqual(r["total_repair_cases"],255807)
        self.assertEqual(r["total_quotient_elements"],109419)
