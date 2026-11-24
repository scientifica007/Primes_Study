import sys
import unittest
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/"experiments"))
from generating_family_constraints import report

class GeneratingFamilyConstraintTests(unittest.TestCase):
    def test_report(self):
        data=report()
        self.assertEqual(data,json.loads((ROOT/"results"/"generating_family_constraints_study17.json").read_text()))
        self.assertEqual(sum(x["count"] for x in data["monoids"]),170)
        self.assertEqual(sum(x["regular_support_matrices"] for x in data["rees"]),298)
        self.assertEqual(sum(x["clutters"] for x in data["restricted_cyclic_realization"]),189)
