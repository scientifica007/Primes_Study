"""Audit integrity of the 27-theorem ranking without asserting mathematical novelty."""
import json
import re
import unittest
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class TheoremReviewIntegrityTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.registry = (ROOT / "docs" / "THEOREM_REGISTRY.md").read_text(
            encoding="utf-8"
        )
        cls.synthesis = (ROOT / "docs" / "12-synthesis-27-theorems.md").read_text(
            encoding="utf-8"
        )
        cls.priority = (ROOT / "docs" / "13-priority-T09-literature-review.md").read_text(
            encoding="utf-8"
        )
        cls.references = (ROOT / "docs" / "VERIFIED_REFERENCES.md").read_text(
            encoding="utf-8"
        )
        cls.original = (ROOT / "docs" / "00-original-formulation.md").read_text(
            encoding="utf-8"
        )
        cls.data = json.loads(
            (ROOT / "results" / "theorem_priority_review_2026-11-23.json").read_text(
                encoding="utf-8"
            )
        )

    def test_historic_27_stable_and_new_T28_appended(self):
        expected = {f"T{i:02d}" for i in range(1, 28)}
        registry = re.findall(r"^\| \*\*(T\d\d)\*\* \|", self.registry, re.M)
        synthesis = re.findall(r"^\| \*\*(T\d\d)\*\* \|", self.synthesis, re.M)
        ranked = [entry["id"] for entry in self.data["all_theorems"]]
        self.assertEqual(set(registry), expected | {f"T{i:02d}" for i in range(28,35)})
        self.assertEqual(set(synthesis), expected)
        self.assertEqual(set(ranked), expected)
        self.assertEqual(len(registry), 34)
        self.assertEqual(len(synthesis), 27)
        self.assertEqual(len(ranked), 27)

    def test_new_T28_has_full_study_and_reproducible_census(self):
        import json
        study = (ROOT / "docs" / "14-experiment-08-minimal-six-classification.md").read_text(
            encoding="utf-8"
        )
        data = json.loads(
            (ROOT / "results" / "minimal_monoids_order6.json").read_text(encoding="utf-8")
        )
        self.assertIn("T28", self.registry)
        self.assertIn("T28", study)
        self.assertEqual(data["total_isomorphism_classes"], 10)
        self.assertEqual(data["total_anti_isomorphism_classes"], 7)
        self.assertEqual(sum(len(row["representatives"])
                             for row in data["unit_group_decomposition"]), 10)

    def test_priorities_are_complete_and_consistent(self):
        result = Counter(entry["priority"] for entry in self.data["all_theorems"])
        self.assertEqual(dict(sorted(result.items())), self.data["counts"])
        self.assertEqual(dict(sorted(result.items())), {"A": 2, "B": 4, "C": 7, "D": 14})
        self.assertEqual(self.data["selected_for_next_specialized_literature_review"], "T09")
        self.assertEqual(self.data["secondary_candidate"], "T07")
        self.assertEqual(
            {entry["id"] for entry in self.data["all_theorems"]
             if entry["priority"] == "A"}, {"T07", "T09"},
        )

    def test_precedence_citations_and_status_are_explicit(self):
        for ref in ("R01", "R07", "R08", "R09"):
            self.assertIn(ref, self.references)
        self.assertIn("10.17630/10023-29260", self.references)
        self.assertIn("indispensable", self.priority)
        self.assertIn("Smith", self.priority)
        self.assertIn("لم نبدأ", self.priority)
        self.assertIn("الجدة التاريخية", self.priority)

    def test_owner_original_text_is_still_present(self):
        self.assertTrue(self.data["original_hypothesis_unchanged"])
        self.assertIn("لا يوجد عدد أولي بذاته.", self.original)
        self.assertIn("لا يوجد كائن أولي لذاته", self.original)
        self.assertIn("لا نستبعد 0 أو 1", self.original)


if __name__ == "__main__":
    unittest.main()
