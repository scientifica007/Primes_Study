#!/usr/bin/env python3
"""Dynamic relational nongenerability: snapshots, triggers and stock reachability.

The original test is applied in EACH snapshot without exclusions:
    E_c(x) iff not exists a,b in S_c\\{x} with F_c(a,b)=x.

The dynamic constructions below are declared experimental extensions, NOT
revisions of the owner's original definition.

Run: python3 experiments/dynamic_systems.py
     python3 experiments/dynamic_systems.py --output results/dynamic_systems.json
"""

from __future__ import annotations

import argparse
import json
from collections import Counter, deque
from dataclasses import dataclass
from itertools import product


@dataclass(frozen=True)
class Snapshot:
    name: str
    carrier: tuple[int, ...]
    table: tuple[int, ...]

    def __post_init__(self):
        if not self.carrier or len(set(self.carrier)) != len(self.carrier):
            raise ValueError("Carrier must be nonempty, without repetitions")
        if len(self.table) != len(self.carrier) ** 2:
            raise ValueError("Every binary table needs |S| squared outputs")
        if not set(self.table).issubset(self.carrier):
            raise ValueError("Binary operation must be total within its carrier")

    def apply(self, a: int, b: int) -> int:
        if a not in self.carrier or b not in self.carrier:
            raise ValueError("Inputs must belong to the current carrier")
        n = len(self.carrier)
        return self.table[n * self.carrier.index(a) + self.carrier.index(b)]

    def witnesses(self, x: int) -> tuple[tuple[int, int], ...]:
        if x not in self.carrier:
            raise ValueError("No local E-status for a nonexistent element")
        return tuple(
            (a, b)
            for a in self.carrier if a != x
            for b in self.carrier if b != x and self.apply(a, b) == x
        )

    def E(self) -> tuple[int, ...]:
        return tuple(x for x in self.carrier if not self.witnesses(x))


@dataclass
class DynamicGraph:
    snapshots: dict[str, Snapshot]
    arrows: dict[str, tuple[str, ...]]

    def __post_init__(self):
        if any(name != snapshot.name for name, snapshot in self.snapshots.items()):
            raise ValueError("Snapshot name/key mismatch")
        if set(self.arrows) - set(self.snapshots):
            raise ValueError("Unknown source snapshot")
        if any(target not in self.snapshots
               for children in self.arrows.values() for target in children):
            raise ValueError("Unknown destination snapshot")

    def reachable(self, start: str) -> tuple[str, ...]:
        if start not in self.snapshots:
            raise ValueError("Unknown initial snapshot")
        queue = deque([start])
        seen = {start}
        order = []
        while queue:
            current = queue.popleft()
            order.append(current)
            for nxt in self.arrows.get(current, ()):
                if nxt not in seen:
                    seen.add(nxt)
                    queue.append(nxt)
        return tuple(order)

    def profile(self, start: str, x: int) -> dict:
        nodes = self.reachable(start)
        statuses = {}
        for name in nodes:
            snapshot = self.snapshots[name]
            if x not in snapshot.carrier:
                statuses[name] = "absent/undefined"
            elif x in snapshot.E():
                statuses[name] = "nongenerable"
            else:
                statuses[name] = "generable"
        present_everywhere = all(status != "absent/undefined"
                                 for status in statuses.values())
        return {
            "element": x,
            "start": start,
            "reachable_states": list(nodes),
            "local_status": statuses,
            "present_in_every_state": present_everywhere,
            "persistent_nongenerability": (
                all(s == "nongenerable" for s in statuses.values())
                if present_everywhere else None
            ),
            "ever_has_external_witness": any(
                s == "generable" for s in statuses.values()
            ),
            "note": "Reachability here is graph-level, ignoring ingredient access.",
        }


@dataclass
class ReactiveMachine:
    """Total binary operations, with input-triggered changes of operation.

    The same carrier S is available as the universe in every control state.
    A stock B subset S represents which elements are physically at hand.
    Inputs are reused (not consumed). Output is added to B.
    """

    snapshots: dict[str, Snapshot]
    triggers: dict[tuple[str, int, int], str]

    def __post_init__(self):
        universes = [set(s.carrier) for s in self.snapshots.values()]
        if not universes or any(s != universes[0] for s in universes):
            raise ValueError("ReactiveMachine requires the same carrier in every state")
        for (state, a, b), dest in self.triggers.items():
            if state not in self.snapshots or dest not in self.snapshots:
                raise ValueError("Unknown control state")
            if a not in universes[0] or b not in universes[0]:
                raise ValueError("Trigger inputs are outside carrier")

    def step(self, state: str, a: int, b: int) -> tuple[str, int]:
        if state not in self.snapshots:
            raise ValueError("Unknown state")
        output = self.snapshots[state].apply(a, b)
        next_state = self.triggers.get((state, a, b), state)
        return next_state, output

    def reachable_states_ignoring_stock(self, start: str) -> tuple[str, ...]:
        if start not in self.snapshots:
            raise ValueError("Unknown state")
        visited = {start}
        q = deque([start])
        while q:
            state = q.popleft()
            universe = self.snapshots[state].carrier
            for a, b in product(universe, repeat=2):
                nxt, _ = self.step(state, a, b)
                if nxt not in visited:
                    visited.add(nxt)
                    q.append(nxt)
        return tuple(sorted(visited))

    def shortest_construction(
        self, initial_state: str, seeds: tuple[int, ...], x: int
    ) -> dict:
        """BFS on (control state, current stock), not on control alone."""
        if initial_state not in self.snapshots:
            raise ValueError("Unknown initial state")
        universe = set(self.snapshots[initial_state].carrier)
        if x not in universe or not set(seeds).issubset(universe):
            raise ValueError("Target and seed elements must lie in S")
        start = (initial_state, frozenset(seeds))
        if x in seeds:
            return {"constructible": True, "steps": [], "reason": "already in seeds"}
        q = deque([(start, ())])
        visited = {start}
        while q:
            (state, stock), path = q.popleft()
            for a, b in product(sorted(stock), repeat=2):
                nxt, output = self.step(state, a, b)
                new_path = path + ({
                    "before": state,
                    "inputs": [a, b],
                    "output": output,
                    "after": nxt,
                },)
                if output == x:
                    return {"constructible": True, "steps": list(new_path)}
                next_stock = stock | {output}
                next_config = (nxt, next_stock)
                if next_config not in visited:
                    visited.add(next_config)
                    q.append((next_config, new_path))
        return {
            "constructible": False,
            "steps": [],
            "reachable_control_states_with_restricted_stock":
                sorted({state for state, stock in visited}),
            "explored_stock_control_configurations": len(visited),
        }


def example_switching() -> DynamicGraph:
    projection = (0, 0, 1, 1)
    xor = (0, 1, 1, 0)
    return DynamicGraph({
        "dormant": Snapshot("dormant", (0, 1), projection),
        "active": Snapshot("active", (0, 1), xor),
        "restored": Snapshot("restored", (0, 1), projection),
    }, {"dormant": ("active",), "active": ("restored",)})


def example_carrier_change() -> DynamicGraph:
    # A single globally fixed operation: left projection except F(0,1)=2.
    # S0={0,2} is closed under that operation.
    return DynamicGraph({
        "small": Snapshot("small", (0, 2), (0, 0, 2, 2)),
        "large": Snapshot("large", (0, 1, 2), (0, 2, 0, 1, 1, 1, 2, 2, 2)),
        "small_again": Snapshot("small_again", (0, 2), (0, 0, 2, 2)),
    }, {"small": ("large",), "large": ("small_again",)})


def example_reactive(trigger_requires_target: bool) -> ReactiveMachine:
    projection = Snapshot("dormant", (0, 1), (0, 0, 1, 1))
    xor = Snapshot("active", (0, 1), (0, 1, 1, 0))
    # In one machine (1,1) activates; in the other (0,0) activates.
    # These machines have IDENTICAL operation tables and control-state graph.
    activation = (0, 0) if trigger_requires_target else (1, 1)
    return ReactiveMachine(
        {"dormant": projection, "active": xor},
        {("dormant", *activation): "active",
         ("active", 1, 1): "dormant"},
    )


def two_element_transition_census() -> dict:
    """All ordered pairs of total binary operations on a fixed 2-element set."""
    tables = tuple(product(range(2), repeat=4))
    classes = Counter()
    target_status = Counter()
    for left in tables:
        e_left = set(Snapshot("left", (0, 1), left).E())
        for right in tables:
            e_right = set(Snapshot("right", (0, 1), right).E())
            if e_left == e_right:
                classes["equal"] += 1
            elif e_left > e_right:
                classes["strict_loss"] += 1
            elif e_left < e_right:
                classes["strict_gain"] += 1
            else:
                classes["incomparable"] += 1
            target_status[f"{int(0 in e_left)}->{int(0 in e_right)}"] += 1
    return {
        "ordered_operation_pairs": len(tables) ** 2,
        "relation_between_E_sets": dict(sorted(classes.items())),
        "one_fixed_target_0_transition_counts": dict(sorted(target_status.items())),
    }


def report() -> dict:
    switching = example_switching()
    carrier = example_carrier_change()
    easy = example_reactive(trigger_requires_target=False)
    blocked = example_reactive(trigger_requires_target=True)
    return {
        "model": "snapshot-local original law, with explicitly separate dynamics",
        "switching": switching.profile("dormant", 0),
        "carrier_expansion_and_contraction": carrier.profile("small", 2),
        "target_absent_is_undefined": carrier.profile("small", 1),
        "reactive_activation_without_target": {
            "local_E_at_dormant": list(easy.snapshots["dormant"].E()),
            "local_E_at_active": list(easy.snapshots["active"].E()),
            "control_reachable_ignoring_stock":
                list(easy.reachable_states_ignoring_stock("dormant")),
            "construct_from_other_element":
                easy.shortest_construction("dormant", (1,), 0),
        },
        "reactive_activation_requires_target": {
            "local_E_at_dormant": list(blocked.snapshots["dormant"].E()),
            "local_E_at_active": list(blocked.snapshots["active"].E()),
            "control_reachable_ignoring_stock":
                list(blocked.reachable_states_ignoring_stock("dormant")),
            "construct_from_other_element":
                blocked.shortest_construction("dormant", (1,), 0),
        },
        "all_two_element_operation_switches": two_element_transition_census(),
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output")
    args = parser.parse_args()
    result = json.dumps(report(), ensure_ascii=False, indent=2) + "\n"
    if args.output:
        with open(args.output, "w", encoding="utf-8") as f:
            f.write(result)
    else:
        print(result, end="")


if __name__ == "__main__":
    main()
