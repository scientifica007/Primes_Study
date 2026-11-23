"""Tests of explicit individual-token identity, distinct from type and count."""
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "experiments"))
from token_identity import (  # noqa: E402
    Token, TokenRule, TokenState, fire, logical_profile,
    construct_report, exhaustive_projection_check, report,
)


class TokenIdentityTests(unittest.TestCase):
    def test_replacement_new_token_without_type_or_quantity_growth(self):
        state = TokenState((Token(0, "X"),), 1)
        rule = TokenRule(("X",), ("X",))
        fresh = fire(state, rule, (0,), "fresh")
        retained = fire(state, rule, (0,), "retain_matching")
        self.assertEqual(fresh.after.counts(), {"X": 1})
        self.assertEqual(retained.after.counts(), {"X": 1})
        self.assertEqual(fresh.new_ids, (1,))
        self.assertEqual(retained.new_ids, ())
        self.assertEqual(retained.retained_ids, (0,))
        self.assertEqual(logical_profile(state, fresh, "X"), {
            "target_type": "X", "kind_absent_then_present": False,
            "new_individual_of_kind": True, "quantity_grew": False,
            "before_quantity": 1, "after_quantity": 1,
        })

    def test_reproduction_only_from_a_copy(self):
        state = TokenState((Token(0, "X"),), 1)
        rule = TokenRule(("X",), ("X", "X"))
        fresh = fire(state, rule, (0,), "fresh")
        inherited = fire(state, rule, (0,), "retain_matching")
        self.assertEqual(fresh.after.counts(), {"X": 2})
        self.assertEqual(inherited.after.counts(), {"X": 2})
        self.assertEqual(set(fresh.new_ids), {1, 2})
        self.assertEqual(inherited.new_ids, (1,))
        self.assertEqual(inherited.retained_ids, (0,))
        self.assertFalse(logical_profile(state, inherited, "X")["kind_absent_then_present"])
        with self.assertRaises(ValueError):
            fire(TokenState((), 0), rule, (), "fresh")

    def test_type_first_appearance_from_different_type(self):
        state = TokenState((Token(0, "A"),), 1)
        rule = TokenRule(("A",), ("A", "X"))
        step = fire(state, rule, (0,), "retain_matching")
        profile = logical_profile(state, step, "X")
        self.assertTrue(profile["kind_absent_then_present"])
        self.assertTrue(profile["new_individual_of_kind"])
        self.assertTrue(profile["quantity_grew"])
        self.assertEqual(step.retained_ids, (0,))

    def test_existing_X_growth_no_type_first_appearance(self):
        state = TokenState((Token(0, "A"), Token(1, "X")), 2)
        step = fire(state, TokenRule(("A", "X"), ("X", "X")),
                    (0, 1), "retain_matching")
        profile = logical_profile(state, step, "X")
        self.assertEqual(profile["before_quantity"], 1)
        self.assertEqual(profile["after_quantity"], 2)
        self.assertFalse(profile["kind_absent_then_present"])
        self.assertTrue(profile["new_individual_of_kind"])

    def test_two_copies_require_two_different_token_ids(self):
        one = TokenState((Token(0, "X"),), 1)
        two = TokenState((Token(0, "X"), Token(1, "X")), 2)
        rule = TokenRule(("X", "X"), ("X", "X", "X"))
        with self.assertRaises(ValueError):
            fire(one, rule, (0, 0))
        with self.assertRaises(ValueError):
            fire(one, rule, (0,))
        step = fire(two, rule, (0, 1))
        self.assertEqual(step.after.counts(), {"X": 3})

    def test_identity_names_arbitrary_but_count_invariant(self):
        a = TokenState((Token(0, "A"), Token(5, "X")), 6)
        b = TokenState((Token(17, "A"), Token(23, "X")), 24)
        rule = TokenRule(("A", "X"), ("X", "X"))
        for policy in ("fresh", "retain_matching"):
            left = fire(a, rule, (0, 5), policy)
            right = fire(b, rule, (17, 23), policy)
            self.assertEqual(left.after.counts(), right.after.counts())
            self.assertEqual(len(left.new_ids), len(right.new_ids))

    def test_reject_colliding_id_invalid_types_and_unknown_policy(self):
        with self.assertRaises(ValueError):
            TokenState((Token(0, "A"), Token(0, "X")), 1)
        with self.assertRaises(ValueError):
            TokenState((Token(4, "A"),), 4)
        with self.assertRaises(ValueError):
            Token(0, "")
        with self.assertRaises(ValueError):
            fire(TokenState((Token(0, "A"),), 1),
                 TokenRule(("A",), ("X",)), (0,), "undocumented")

    def test_exhaustive_quantities_project_correctly(self):
        result = exhaustive_projection_check()
        self.assertTrue(result["stoichiometric_projection_verified"])
        self.assertTrue(result["unique_ids_verified"])
        self.assertGreater(result["verified_enabled_token_transitions"], 500)
        self.assertGreater(result["witnesses_new_individual_without_quantity_gain"], 0)

    def test_report(self):
        cases = construct_report()["all_examples"]
        self.assertFalse(cases["X_to_X_retain"]["profile"]["new_individual_of_kind"])
        self.assertTrue(cases["X_to_X_fresh"]["profile"]["new_individual_of_kind"])
        self.assertTrue(report()["exhaustive_projection"]
                        ["stoichiometric_projection_verified"])


if __name__ == "__main__":
    unittest.main()
