import sys
import unittest
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/"experiments"))
from clifford_nonperiodic import report
class NonperiodicCliffordTests(unittest.TestCase):
    def test_report(self):
        r=report()
        self.assertEqual(r,json.loads((ROOT/"results"/"clifford_nonperiodic_study26.json").read_text()))
        self.assertEqual(r["dag_total"],33867)
        self.assertEqual(r["integer_models"],781)
