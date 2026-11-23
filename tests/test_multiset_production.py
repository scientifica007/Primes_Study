"""Study 07: independent checks of species-level and quantity-level claims."""
import random
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "experiments"))
from multiset_production import (  # noqa: E402
    Reaction, all_reactions, exact_counts, brute_counts, conservation_check,
    shortest_threshold, examples, report,
)


class MultisetResearchTests(unittest.TestCase):
    def test_analytic_census_matches_every_table(self):
        expected = {
            (1, 3): (16, 3, 0, 3, 3, 6),
            (2, 2): (81, 18, 12, 6, 9, 27),
            (2, 3): (256, 48, 36, 12, 48, 96),
            (3, 2): (729, 162, 144, 18, 81, 243),
        }
        for (n, k), values in expected.items():
            with self.subTest(n=n, k=k):
                analytic = exact_counts(n, k)
                brute = brute_counts(n, k)
                self.assertEqual(analytic, brute)
                self.assertEqual(
                    tuple(analytic[field] for field in (
                        "number_of_all_reactions",
                        "type_external_including_spontaneous",
                        "type_external_with_nonempty_input",
                        "type_external_with_empty_input",
                        "self_dependent_net_growth",
                        "all_net_growth",
                    )),
                    values,
                )

    def test_no_type_appearance_without_external_reaction_exhaustive(self):
        # Verify that any path from X=0 stays X=0 when no reaction
        # satisfies pre[X]=0 and post[X]>0. We use 2 species,
        # coefficient bound 0..2 and initial A in 0..2, X=0.
        all_r = tuple(all_reactions(2, 2))
        x_inert = [r for r in all_r if not r.type_external(1)]
        rng = random.Random(20261123)
        for _ in range(400):
            network = tuple(rng.choice(x_inert) for _ in range(3))
            for a in (0, 1, 2):
                # Restrict to 12 total tokens to obtain a finite
                # checked region. A positive claim would be invalid
                # regardless of this bound.
                output = shortest_threshold(
                    (a, 0), network, 1, 1, max_total=12)
                self.assertNotIn(output["status"], ("reachable", "already_present"))

    def test_autocatalysis_needs_seed_and_count_threshold(self):
        r = Reaction((0, 1), (0, 2))
        self.assertFalse(r.type_external(1))
        self.assertTrue(r.self_dependent_gain(1))
        self.assertEqual(
            shortest_threshold((0, 0), (r,), 1, 1)["status"],
            "unreachable_exhaustive",
        )
        self.assertEqual(
            shortest_threshold((0, 1), (r,), 1, 4)["minimal_steps"], 3
        )

    def test_two_copy_activation(self):
        r = Reaction((0, 2), (0, 3))
        self.assertEqual(
            shortest_threshold((0, 1), (r,), 1, 2)["status"],
            "unreachable_exhaustive",
        )
        self.assertEqual(
            shortest_threshold((0, 2), (r,), 1, 4)["minimal_steps"], 2
        )

    def test_finite_conservation_prevents_unbounded_gain(self):
        reaction = Reaction((1, 1), (0, 2))
        self.assertEqual(reaction.delta(), (-1, 1))
        self.assertTrue(conservation_check((reaction,), (1, 1)))
        self.assertFalse(conservation_check((Reaction((0, 1), (0, 2)),), (1, 1)))
        self.assertEqual(shortest_threshold(
            (2, 1), (reaction,), 1, 3, mass_weights=(1, 1)
        )["status"], "reachable")
        self.assertEqual(shortest_threshold(
            (2, 1), (reaction,), 1, 4, mass_weights=(1, 1)
        )["status"], "unreachable_exhaustive")
        with self.assertRaises(ValueError):
            shortest_threshold(
                (2, 1), (reaction,), 1, 3, mass_weights=(2, 1))

    def test_rule_exists_but_reactant_unreachable(self):
        r = Reaction((1, 1, 0), (0, 0, 1))
        self.assertTrue(r.type_external(2, nonempty_inputs=True))
        self.assertEqual(shortest_threshold(
            (1, 0, 0), (r,), 2, 1)["status"], "unreachable_exhaustive")
        self.assertEqual(shortest_threshold(
            (1, 1, 0), (r,), 2, 1)["status"], "reachable")

    def test_unknown_cutoff_is_not_a_proof_of_unreachability(self):
        # A -> 2A can grow forever without making X, so bounded
        # exploration is not proof that X can never be produced.
        r = Reaction((1, 0), (2, 0))
        out = shortest_threshold((1, 0), (r,), 1, 1, max_total=4)
        self.assertEqual(out["status"], "unknown_cutoff")

    def test_nonnegativity_and_arities(self):
        with self.assertRaises(ValueError):
            Reaction((), ())
        with self.assertRaises(ValueError):
            Reaction((1, 0), (1,))
        with self.assertRaises(ValueError):
            Reaction((-1,), (1,))
        with self.assertRaises(ValueError):
            Reaction((1,), (0,)).fire((0,))

    def test_output_report(self):
        value = report()
        self.assertTrue(value["extension_not_a_redefinition"])
        self.assertEqual(len(value["counting_experiments"]), 4)
        self.assertEqual(value["specific_reaction_examples"]
                         ["conserved_conversion_A_plus_X_to_2X"]
                         ["from_A2_X1_reach_X4"]["status"], "unreachable_exhaustive")


if __name__ == "__main__":
    unittest.main()
