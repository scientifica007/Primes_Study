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

    def test_historic_27_stable_and_new_T28_to_T211_appended(self):
        expected = {f"T{i:02d}" for i in range(1, 28)}
        registry = re.findall(r"^\| \*\*(T\d{2,})\*\* \|", self.registry, re.M)
        synthesis = re.findall(r"^\| \*\*(T\d\d)\*\* \|", self.synthesis, re.M)
        ranked = [entry["id"] for entry in self.data["all_theorems"]]
        self.assertEqual(set(registry), expected | {f"T{i:02d}" for i in range(28,212)})
        self.assertEqual(set(synthesis), expected)
        self.assertEqual(set(ranked), expected)
        self.assertEqual(len(registry), 211)
        self.assertEqual(len(synthesis), 27)
        self.assertEqual(len(ranked), 27)

    def test_study50_private_replacements(self):
        study = (ROOT / "docs" / "60-experiment-50-private-replacements.md").read_text(encoding="utf-8")
        data = json.loads((ROOT / "results" / "rees_private_replacements_study50.json").read_text(encoding="utf-8"))
        for n in range(208,212):
            self.assertIn(f"T{n}", study)
        self.assertTrue(data["all_passed"])
        self.assertEqual(data["obstructionChecks"], 1128)
        self.assertEqual(data["productPotentialChecks"], 16556)
        self.assertEqual(data["mixChecks"], 4)
        self.assertEqual(data["blockDeletionChecks"], 16)

    def test_study49_nongeneration_certificates(self):
        study = (ROOT / "docs" / "59-experiment-49-non-generation-certificates.md").read_text(encoding="utf-8")
        data = json.loads((ROOT / "results" / "rees_nongeneration_certificates_study49.json").read_text(encoding="utf-8"))
        for n in range(204,208):
            self.assertIn(f"T{n}", study)
        self.assertTrue(data["all_passed"])
        self.assertEqual(data["bases"], 78)
        self.assertEqual(data["productChecks"], 9792)
        self.assertEqual(data["homChecks"], 192096)
        self.assertEqual(data["A5Size"], 60)

    def test_study48_position_coordinate(self):
        study = (ROOT / "docs" / "58-experiment-48-position-coordinate-essentiality.md").read_text(encoding="utf-8")
        data = json.loads((ROOT / "results" / "rees_position_coordinate_study48.json").read_text(encoding="utf-8"))
        for n in range(200,204):
            self.assertIn(f"T{n}", study)
        self.assertTrue(data["all_passed"])
        self.assertEqual(data["subsetChecks"], 27760)
        self.assertEqual(data["anchorCriterionChecks"], 16896)
        self.assertEqual(data["potentialProductChecks"], 59400)
        self.assertEqual(data["bootstrapChecks"], 110)

    def test_study47_positive_essentiality(self):
        study = (ROOT / "docs" / "57-experiment-47-positive-essentiality.md").read_text(encoding="utf-8")
        data = json.loads((ROOT / "results" / "rees_positive_essentiality_study47.json").read_text(encoding="utf-8"))
        for n in range(196,200):
            self.assertIn(f"T{n}", study)
        self.assertTrue(data["all_passed"])
        self.assertEqual(data["liftDeletionChecks"], 40)
        self.assertEqual(data["quotientChoices"], 32)
        self.assertEqual(data["bootstrapStepChecks"], 32)
        self.assertEqual(data["freeBootstrapChecks"], 150)

    def test_study46_countable_local_bases(self):
        study = (ROOT / "docs" / "56-experiment-46-countable-local-bases.md").read_text(encoding="utf-8")
        data = json.loads((ROOT / "results" / "rees_countable_local_bases_study46.json").read_text(encoding="utf-8"))
        for n in range(192,196):
            self.assertIn(f"T{n}", study)
        self.assertTrue(data["all_passed"])
        self.assertEqual(data["privateChecks"], 5376)
        self.assertEqual(data["coreDeletionChecks"], 6336)
        self.assertEqual(data["renormalizationChecks"], 17496)
        self.assertEqual(data["repairMutualChecks"], 72)

    def test_study45_adaptive_recovery(self):
        study = (ROOT / "docs" / "55-experiment-45-adaptive-recovery.md").read_text(encoding="utf-8")
        data = json.loads((ROOT / "results" / "adaptive_recovery_study45.json").read_text(encoding="utf-8"))
        for n in range(188,192):
            self.assertIn(f"T{n}", study)
        self.assertTrue(data["all_passed"])
        self.assertEqual(data["uniformChecks"], 486)
        self.assertEqual(data["frontierChecks"], 18804)
        self.assertEqual(data["trapEquivalence"], 6144)
        self.assertEqual(data["adaptiveDirect"], 55296)

    def test_study44_infinite_block_synchronization(self):
        study = (ROOT / "docs" / "54-experiment-44-infinite-block-synchronization.md").read_text(encoding="utf-8")
        data = json.loads((ROOT / "results" / "rees_infinite_block_synchronization_study44.json").read_text(encoding="utf-8"))
        for n in range(184,188):
            self.assertIn(f"T{n}", study)
        self.assertTrue(data["all_passed"])
        self.assertEqual(data["checkpointGraphs"], 22)
        self.assertEqual(data["colorings"], 90600)
        self.assertEqual(data["finiteDeletionChecks"], 30)
        self.assertEqual(data["freeRecoveryChecks"], 200)

    def test_study43_overlapping_relations(self):
        study = (ROOT / "docs" / "53-experiment-43-overlapping-relations.md").read_text(encoding="utf-8")
        data = json.loads((ROOT / "results" / "rees_overlapping_relations_study43.json").read_text(encoding="utf-8"))
        for n in range(180,184):
            self.assertIn(f"T{n}", study)
        self.assertTrue(data["all_passed"])
        self.assertEqual(data["assignments"], 1166400)
        self.assertEqual(data["partitions"], 22076)
        self.assertEqual(data["wordChecks"], 110)

    def test_study42_balanced_blocks(self):
        study = (ROOT / "docs" / "52-experiment-42-balanced-blocks.md").read_text(encoding="utf-8")
        data = json.loads((ROOT / "results" / "rees_balanced_blocks_study42.json").read_text(encoding="utf-8"))
        for n in range(176,180):
            self.assertIn(f"T{n}", study)
        self.assertTrue(data["all_passed"])
        self.assertEqual(data["freeProductChecks"], 960)
        self.assertEqual(data["internalChoices"], 20)
        self.assertEqual(data["relativeChoices"], 27)
        self.assertEqual(data["freeRelativeChecks"], 400)

    def test_study41_core_encoding(self):
        study = (ROOT / "docs" / "51-experiment-41-core-encoding.md").read_text(encoding="utf-8")
        data = json.loads((ROOT / "results" / "rees_core_encoding_study41.json").read_text(encoding="utf-8"))
        for n in range(172,176):
            self.assertIn(f"T{n}", study)
        self.assertTrue(data["all_passed"])
        self.assertEqual(data["choices"], 24)
        self.assertEqual(data["wordChecks"], 800)
        self.assertEqual(data["obstructionWords"], 21844)

    def test_study40_shared_sources(self):
        study = (ROOT / "docs" / "50-experiment-40-shared-source-necessity.md").read_text(encoding="utf-8")
        data = json.loads((ROOT / "results" / "rees_shared_source_necessity_study40.json").read_text(encoding="utf-8"))
        for n in range(168,172):
            self.assertIn(f"T{n}", study)
        self.assertTrue(data["all_passed"])
        self.assertEqual(data["choices"], 960)
        self.assertEqual(data["tailRecoveries"], 1344)
        self.assertEqual(data["deletions"], 7584)

    def test_study39_distributed_recovery(self):
        study = (ROOT / "docs" / "49-experiment-39-distributed-recovery.md").read_text(encoding="utf-8")
        data = json.loads((ROOT / "results" / "rees_distributed_recovery_study39.json").read_text(encoding="utf-8"))
        for n in range(165,168):
            self.assertIn(f"T{n}", study)
        self.assertTrue(data["all_passed"])
        self.assertEqual(data["choices"], 512)
        self.assertEqual(data["donorRecoveries"], 768)
        self.assertEqual(data["deleteChecks"], 4352)

    def test_study38_source_support(self):
        study = (ROOT / "docs" / "48-experiment-38-source-support-obstruction.md").read_text(encoding="utf-8")
        data = json.loads((ROOT / "results" / "rees_source_support_obstruction_study38.json").read_text(encoding="utf-8"))
        for n in range(162,165):
            self.assertIn(f"T{n}", study)
        self.assertTrue(data["all_passed"])
        self.assertEqual(data["rectangleCases"], 5440)
        self.assertEqual(data["inverseChecks"], 31936)
        self.assertEqual(data["restrictedPairs"], 23490)

    def test_study37_star_flexibility(self):
        study = (ROOT / "docs" / "47-experiment-37-cardinal-star-flexibility.md").read_text(encoding="utf-8")
        data = json.loads((ROOT / "results" / "rees_star_flexibility_study37.json").read_text(encoding="utf-8"))
        for n in range(159,162):
            self.assertIn(f"T{n}", study)
        self.assertTrue(data["all_passed"])
        self.assertEqual(data["models"], 40)
        self.assertEqual(data["configurations"], 1024)
        self.assertEqual(data["properInternal"], 128)

    def test_study36_relative_sources(self):
        study = (ROOT / "docs" / "46-experiment-36-relative-structural-irredundance.md").read_text(encoding="utf-8")
        data = json.loads((ROOT / "results" / "rees_relative_sources_study36.json").read_text(encoding="utf-8"))
        for n in range(156,159):
            self.assertIn(f"T{n}", study)
        self.assertTrue(data["all_passed"])
        self.assertEqual(data["graph_models"], 4096)
        self.assertEqual(data["graph_subset_cases"], 1048576)
        self.assertEqual(data["relative_rees_models"], 24)
        import hashlib
        raw = (ROOT / "docs" / "00-original-formulation.md").read_bytes()
        self.assertEqual(hashlib.sha1(f"blob {len(raw)}\0".encode()+raw).hexdigest(), "77efa7c5687302ebbd020a9c39f7099876eebe90")

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

    def test_clifford_study_theorems_and_saved_counterexample(self):
        study = (ROOT / "docs" / "18-experiment-11-clifford-cross-layer-criterion.md").read_text(
            encoding="utf-8"
        )
        data = json.loads(
            (ROOT / "results" / "clifford_linking_maps_study11.json").read_text(
                encoding="utf-8"
            )
        )
        for n in range(38, 43):
            self.assertIn(f"T{n:02d}", self.registry)
            self.assertIn(f"T{n:02d}", study)
        self.assertTrue(data["identical_principal_factors_and_local_group_tables"])
        self.assertEqual(data["examples"]["A"]["E"], [8])
        self.assertEqual(data["examples"]["B"]["E"], [])
        self.assertEqual(data["exhaustive_cyclic_chain"]["two_layers"]["systems"],24)
        self.assertEqual(data["exhaustive_cyclic_chain"]["three_layers"]["systems"],152)

    def test_layered_oracle_study_ledger(self):
        doc = (ROOT / "docs" / "19-experiment-12-layered-oracle-complexity.md").read_text(encoding="utf-8")
        small = json.loads((ROOT / "results" / "layered_oracle_study12.json").read_text(encoding="utf-8"))
        external = json.loads((ROOT / "results" / "layered_oracle_smallsemi_order6.json").read_text(encoding="utf-8"))
        for k in range(43,47):
            self.assertIn(f"T{k}", self.registry)
            self.assertIn(f"T{k}", doc)
        self.assertEqual(sum(x["monoids"] for x in small["labelled_small_monoids"]),170)
        self.assertEqual(external["monoids"],1373)
        self.assertEqual(external["orbit_and_Green_queries_with_precomputed_metadata"],14123)
        self.assertTrue(external["Green_metadata_cost_not_counted"])
        self.assertTrue(external["all_predictions_match"])

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
