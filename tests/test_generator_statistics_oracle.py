import sys
import unittest
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/"experiments"))
from generator_statistics_oracle import report, build

class GeneratorStatisticsTests(unittest.TestCase):
    def test_report(self):
        r=report()
        self.assertEqual(r,json.loads((ROOT/"results"/"generator_statistics_study15.json").read_text()))
        self.assertEqual(r["total_tables_verified"],70)
        self.assertEqual(sum(x["empty"] for x in r["rows"]),35)
    def test_promise(self):
        with self.assertRaises(ValueError):
            build(1,1,[(0,)]*4)
