"""Study 06 reproducibility and rigorous counterexample checks."""
import random
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "experiments"))
from inhibited_reactions import (  # noqa: E402
    Reaction, all_reactions, example_inhibition,
    example_restoration_by_consumption, example_spontaneous_two_entities,
    make_report, one_rule_monotonicity_census, powerset, shortest_production,
)


class TestInhibitedReactions(unittest.TestCase):
    def test_inhibitor_disables_even_though_inputs_remain(self):
        case = example_inhibition()
        self.assertTrue(case["without_inhibitor"]["reachable"])
        self.assertEqual(case["without_inhibitor"]["minimal_steps"], 1)
        self.assertFalse(case["with_inhibitor"]["reachable"])

    def test_removing_inhibitor_restores_production_only_if_consumed(self):
        case = example_restoration_by_consumption()
        self.assertFalse(case["nonconsuming"]["reachable"])
        self.assertTrue(case["consuming"]["reachable"])
        self.assertEqual(case["consuming"]["minimal_steps"], 2)
        self.assertEqual(case["consuming"]["trace"], [
            {"reaction_index": 1, "before": [0, 1], "after": [0]},
            {"reaction_index": 0, "before": [0], "after": [2]},
        ])

    def test_spontaneous_reactions_reduce_minimal_universe_to_two(self):
        case = example_spontaneous_two_entities()
        self.assertTrue(case["from_empty_stock"]["reachable"])
        self.assertFalse(case["from_added_inhibitor"]["reachable"])

    def test_exhaustive_positive_reactant_minimality(self):
        for consuming in (False, True):
            for n, total_reactions, failures in (
                (1, 2, 0), (2, 20, 0), (3, 152, 48)
            ):
                with self.subTest(consuming=consuming, n=n):
                    row = one_rule_monotonicity_census(n, consuming, True)
                    self.assertEqual(row["reaction_count"], total_reactions)
                    self.assertEqual(
                        row["comparison_counts"]["monotonicity_failures"],
                        failures)
                    self.assertEqual(
                        row["comparison_counts"]["positive_only_failures"], 0)

    def test_full_three_element_census_proven_totals(self):
        row = one_rule_monotonicity_census(3, False, True)
        self.assertEqual(row["comparison_counts"], {
            "all_comparisons": 2280,
            "positive_only_comparisons": 840,
            "inhibited_comparisons": 1440,
            "monotonicity_failures": 48,
            "positive_only_failures": 0,
            "inhibited_failures": 48,
        })

    def test_two_entities_with_spontaneous_reactants(self):
        row = one_rule_monotonicity_census(2, False, False)
        self.assertEqual(row["reaction_count"], 36)
        self.assertEqual(row["comparison_counts"]["monotonicity_failures"], 8)
        self.assertEqual(row["comparison_counts"]["positive_only_failures"], 0)

    def test_monotonicity_inhibitor_free_even_with_consumption(self):
        # Two arbitrary, non-cancelling reactions, randomized with fixed seed.
        rng = random.Random(20261123)
        U = frozenset(range(4))
        reactions = tuple(
            r for r in all_reactions(U)
            if not r.inhibitors
        )
        for consuming in (False, True):
            for _ in range(150):
                family = (rng.choice(reactions), rng.choice(reactions))
                x = rng.choice(tuple(sorted(U)))
                stocks = powerset(U - {x})
                for B in stocks:
                    for C in stocks:
                        if not B <= C:
                            continue
                        if shortest_production(U, family, B, x, consuming)["reachable"]:
                            self.assertTrue(
                                shortest_production(
                                    U, family, C, x, consuming)["reachable"],
                                msg=(family, x, B, C, consuming))

    def test_pure_inhibitor_cannot_create_target_by_being_added(self):
        # i=1 is never a reactant or product in either reaction.
        rng = random.Random(92)
        U = frozenset({0, 1, 2, 3})
        inert_inhibitor = 1
        choices = [
            r for r in all_reactions(U)
            if inert_inhibitor not in r.reactants
            and inert_inhibitor not in r.products
        ]
        for consuming in (False, True):
            for _ in range(300):
                family = (rng.choice(choices), rng.choice(choices))
                seed = frozenset(rng.choice(((), (0,), (3,), (0,3))))
                smaller = seed
                larger = seed | {inert_inhibitor}
                target = 2
                if shortest_production(
                    U, family, larger, target, consuming)["reachable"]:
                    self.assertTrue(shortest_production(
                        U, family, smaller, target, consuming)["reachable"])

    def test_no_exclusion_for_zero_and_one(self):
        U = frozenset((0, 1, 2))
        # Target 0 and 1 are ordinary entities in the chosen finite universe.
        r0 = Reaction(frozenset({1}), frozenset({2}), frozenset({0}))
        r1 = Reaction(frozenset({0}), frozenset({2}), frozenset({1}))
        self.assertTrue(shortest_production(
            U, (r0,), frozenset({1}), 0)["reachable"])
        self.assertTrue(shortest_production(
            U, (r1,), frozenset({0}), 1)["reachable"])

    def test_invalid_reaction_is_rejected(self):
        with self.assertRaises(ValueError):
            Reaction(frozenset({0}), frozenset({0}), frozenset({2}))
        with self.assertRaises(ValueError):
            shortest_production(
                frozenset({0, 1}), (Reaction(
                    frozenset({0}), frozenset(), frozenset({2})),),
                frozenset({0}), 1)

    def test_report_summaries(self):
        report = make_report()
        self.assertTrue(report["original_law_unchanged"])
        self.assertEqual(
            len(report["exhaustive_single_reaction_census_nonempty_reactants"]),
            6)
        self.assertEqual(
            report["two_entity_census_with_empty_reactants"]
            ["comparison_counts"]["monotonicity_failures"], 8)


if __name__ == "__main__":
    unittest.main()
