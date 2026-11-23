"""Tests for snapshot-local E, dynamic availability and triggered reachability."""
import sys
import unittest
from itertools import product
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "experiments"))
from dynamic_systems import (  # noqa: E402
    Snapshot, DynamicGraph, ReactiveMachine, example_switching,
    example_carrier_change, example_reactive, two_element_transition_census,
    report,
)


class TestDynamicRelationalStudy(unittest.TestCase):
    def test_no_element_is_excluded(self):
        snap = Snapshot("projection", (0, 1), (0, 0, 1, 1))
        self.assertEqual(snap.E(), (0, 1))
        self.assertEqual(snap.witnesses(0), ())
        self.assertEqual(snap.witnesses(1), ())
        one = Snapshot("single", (0,), (0,))
        self.assertEqual(one.E(), (0,))

    def test_snapshot_flips_without_changing_carrier(self):
        graph = example_switching()
        self.assertEqual(graph.snapshots["dormant"].E(), (0, 1))
        self.assertEqual(graph.snapshots["active"].E(), (1,))
        self.assertEqual(graph.snapshots["restored"].E(), (0, 1))
        p = graph.profile("dormant", 0)
        self.assertEqual(list(p["local_status"].values()),
                         ["nongenerable", "generable", "nongenerable"])
        self.assertFalse(p["persistent_nongenerability"])
        self.assertTrue(p["present_in_every_state"])

    def test_carrier_expansion_and_contraction_with_fixed_rule(self):
        graph = example_carrier_change()
        self.assertEqual(graph.snapshots["small"].E(), (0, 2))
        self.assertEqual(graph.snapshots["large"].E(), (0, 1))
        self.assertEqual(graph.snapshots["small_again"].E(), (0, 2))
        self.assertEqual(graph.snapshots["large"].apply(0, 1), 2)
        self.assertEqual(graph.profile("small", 2)["local_status"], {
            "small": "nongenerable",
            "large": "generable",
            "small_again": "nongenerable",
        })

    def test_absent_is_not_automatically_E(self):
        p = example_carrier_change().profile("small", 1)
        self.assertIsNone(p["persistent_nongenerability"])
        self.assertEqual(p["local_status"]["small"], "absent/undefined")
        self.assertEqual(p["local_status"]["large"], "nongenerable")

    def test_reactive_machine_from_x_free_stock(self):
        machine = example_reactive(trigger_requires_target=False)
        result = machine.shortest_construction("dormant", (1,), 0)
        self.assertTrue(result["constructible"])
        self.assertEqual(len(result["steps"]), 2)
        self.assertEqual(
            [(p["inputs"], p["output"], p["after"]) for p in result["steps"]],
            [([1, 1], 1, "active"), ([1, 1], 0, "dormant")]
        )
        self.assertIn("active", machine.reachable_states_ignoring_stock("dormant"))

    def test_same_snapshots_but_x_dependent_activation_blocks_target(self):
        machine = example_reactive(trigger_requires_target=True)
        result = machine.shortest_construction("dormant", (1,), 0)
        self.assertFalse(result["constructible"])
        self.assertEqual(result["reachable_control_states_with_restricted_stock"],
                         ["dormant"])
        self.assertEqual(machine.reachable_states_ignoring_stock("dormant"),
                         ("active", "dormant"))

    def test_fixed_table_reduces_to_original_law(self):
        for table in product(range(2), repeat=4):
            snap = Snapshot("static", (0, 1), table)
            machine = ReactiveMachine({"static": snap}, {})
            for x in (0, 1):
                with self.subTest(table=table, x=x):
                    construction = machine.shortest_construction(
                        "static", tuple(y for y in (0, 1) if y != x), x)
                    self.assertEqual(
                        construction["constructible"], x not in snap.E()
                    )

    def test_persistent_E_prevents_production_under_triggered_changes(self):
        all_tables = list(product(range(2), repeat=4))
        for first in all_tables:
            for second in all_tables:
                a = Snapshot("a", (0, 1), first)
                b = Snapshot("b", (0, 1), second)
                machine = ReactiveMachine(
                    {"a": a, "b": b},
                    {("a", 1, 1): "b", ("b", 1, 1): "a"})
                for x in set(a.E()).intersection(b.E()):
                    stock = (1 - x,)
                    result = machine.shortest_construction("a", stock, x)
                    self.assertFalse(result["constructible"])

    def test_exhaustive_all_two_element_operation_pairs(self):
        census = two_element_transition_census()
        self.assertEqual(census["ordered_operation_pairs"], 256)
        self.assertEqual(census["relation_between_E_sets"], {
            "equal": 64, "incomparable": 32,
            "strict_gain": 80, "strict_loss": 80
        })
        self.assertEqual(census["one_fixed_target_0_transition_counts"], {
            "0->0": 64, "0->1": 64, "1->0": 64, "1->1": 64
        })

    def test_input_validation(self):
        with self.assertRaises(ValueError):
            Snapshot("broken", (0, 1), (0, 1))
        with self.assertRaises(ValueError):
            Snapshot("broken", (0, 1), (0, 1, 1, 2))
        with self.assertRaises(ValueError):
            Snapshot("x", (0, 1), (0, 0, 1, 1)).witnesses(2)

    def test_report(self):
        data = report()
        self.assertFalse(data["reactive_activation_requires_target"]
                         ["construct_from_other_element"]["constructible"])
        self.assertTrue(data["reactive_activation_without_target"]
                        ["construct_from_other_element"]["constructible"])


if __name__ == "__main__":
    unittest.main()
