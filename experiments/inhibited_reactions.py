#!/usr/bin/env python3
"""Study 06: guards (inhibitors), optional consumption, and production.

The owner's original hypothesis is NOT redefined here. This program
explicitly studies a guarded, partial-interaction extension with finite
universe U and states B subset U.

A reaction r=(R,I,P) is enabled iff R subset B and I intersects B is empty.
Sequential nondeterministic semantics: execute one enabled reaction per
step, with reusable inputs B'=B union P (persistent) or consumptive inputs
B'=(B-R) union P (consuming). Reactions may be repeated and resources in
B have Boolean presence, not multiplicities.

The experiment includes an exhaustive 152-rule census over U={0,1,2}.
It also checks minimality with positive reactants, and the counterexample
with an empty-reactant/spontaneous reaction on two entities.

Usage:
 python3 experiments/inhibited_reactions.py
 python3 experiments/inhibited_reactions.py --output results/inhibited_reactions.json
"""
from __future__ import annotations
import argparse
import json
from collections import Counter, deque
from dataclasses import dataclass
from itertools import combinations
from math import comb
from typing import FrozenSet, Iterable

EntitySet = FrozenSet[int]


def powerset(elements: Iterable[int]) -> tuple[EntitySet, ...]:
    items = tuple(sorted(elements))
    return tuple(
        frozenset(c)
        for k in range(len(items) + 1)
        for c in combinations(items, k)
    )


@dataclass(frozen=True)
class Reaction:
    reactants: EntitySet
    inhibitors: EntitySet
    products: EntitySet

    def __post_init__(self) -> None:
        if self.reactants & self.inhibitors:
            raise ValueError("A reactant cannot also inhibit the same reaction")

    def enabled(self, stock: EntitySet) -> bool:
        return self.reactants <= stock and not (self.inhibitors & stock)

    def execute(self, stock: EntitySet, consuming: bool) -> EntitySet:
        if not self.enabled(stock):
            raise ValueError("Attempted to execute a disabled reaction")
        return (stock - self.reactants if consuming else stock) | self.products

    def to_dict(self) -> dict:
        return {
            "reactants": sorted(self.reactants),
            "inhibitors": sorted(self.inhibitors),
            "products": sorted(self.products),
        }


def shortest_production(
    universe: EntitySet,
    reactions: tuple[Reaction, ...],
    seeds: EntitySet,
    target: int,
    consuming: bool = False,
) -> dict:
    """Shortest sequential path producing target from target-free seeds.

    BFS explores stock subsets (at most 2^|U|); allows self-loops but
    does not re-enqueue previously seen stocks.
    """
    if target not in universe or not seeds <= universe:
        raise ValueError("The target and seeds must belong to the universe")
    if target in seeds:
        raise ValueError("Production from inputs different from target requires x-free seeds")
    for reaction in reactions:
        if not (reaction.reactants | reaction.inhibitors | reaction.products) <= universe:
            raise ValueError("All reaction symbols must belong to universe")

    queue = deque([(seeds, ())])
    visited = {seeds}
    while queue:
        stock, path = queue.popleft()
        for number, reaction in enumerate(reactions):
            if reaction.enabled(stock):
                new_stock = reaction.execute(stock, consuming)
                step = {
                    "reaction_index": number,
                    "before": sorted(stock),
                    "after": sorted(new_stock),
                }
                next_path = path + (step,)
                if target in new_stock:
                    return {
                        "reachable": True,
                        "minimal_steps": len(next_path),
                        "trace": list(next_path),
                    }
                if new_stock not in visited:
                    visited.add(new_stock)
                    queue.append((new_stock, next_path))
    return {
        "reachable": False,
        "minimal_steps": None,
        "trace": [],
        "explored_stocks": len(visited),
    }


def all_reactions(universe: EntitySet, require_reactant: bool = True):
    """All reaction triples (R,I,P) with R∩I=∅, P arbitrary."""
    for reactants in powerset(universe):
        if require_reactant and not reactants:
            continue
        for inhibitors in powerset(universe - reactants):
            for products in powerset(universe):
                yield Reaction(reactants, inhibitors, products)


def one_rule_monotonicity_census(
    universe_size: int, consuming: bool, require_reactant: bool = True
) -> dict:
    """Count all (rule, target, B strictly contained in C) stock pairs."""
    if not 1 <= universe_size <= 3:
        raise ValueError("Exhaustive census limited to n=1,2,3")
    universe = frozenset(range(universe_size))
    counts = Counter()
    first_counterexample = None
    rules = tuple(all_reactions(universe, require_reactant))
    for reaction in rules:
        for target in sorted(universe):
            stocks = powerset(universe - {target})
            for smaller in stocks:
                for larger in stocks:
                    if not smaller < larger:
                        continue
                    counts["all_comparisons"] += 1
                    label = ("inhibited" if reaction.inhibitors else "positive_only")
                    counts[label + "_comparisons"] += 1
                    yes_from_small = shortest_production(
                        universe, (reaction,), smaller, target, consuming
                    )["reachable"]
                    yes_from_large = shortest_production(
                        universe, (reaction,), larger, target, consuming
                    )["reachable"]
                    if yes_from_small and not yes_from_large:
                        counts["monotonicity_failures"] += 1
                        counts[label + "_failures"] += 1
                        if first_counterexample is None:
                            first_counterexample = {
                                "reaction": reaction.to_dict(),
                                "target": target,
                                "small_stock": sorted(smaller),
                                "large_stock": sorted(larger),
                            }
    return {
        "universe_size": universe_size,
        "consuming": consuming,
        "nonempty_reactants_required": require_reactant,
        "reaction_count": len(rules),
        "comparison_counts": {
            key: counts[key]
            for key in (
                "all_comparisons", "positive_only_comparisons",
                "inhibited_comparisons", "monotonicity_failures",
                "positive_only_failures", "inhibited_failures",
            )
        },
        "first_counterexample": first_counterexample,
    }



def analytic_single_rule_failure_count(n: int) -> int:
    """Closed-form count of (rule,x,B,C) with production loss B proper subset C.

    The rule must have >=1 reactant, R cap I empty; P arbitrary.
    This counts each labelled (rule,target,stock-pair) separately.
    """
    if n < 1:
        raise ValueError("Expected a nonempty universe")
    return n * (2 ** (n - 1)) * sum(
        comb(n - 1, b) * (2 ** b - 1)
        * (2 ** (2 * n - 1 - 2 * b) - 2 * 3 ** (n - 1 - b))
        for b in range(1, n - 1)
    )


def direct_single_rule_failure_count(n: int) -> dict:
    """Independent single-step counting; practical n<=4.

    For a single reaction targeting x absent from the seed, a reachable
    production occurs iff x belongs to P and the reaction is enabled
    already in that seed. Hence no BFS is needed for this census.
    """
    if not 1 <= n <= 4:
        raise ValueError("Independent direct count limited to n=1..4")
    universe = frozenset(range(n))
    count = 0
    comparisons = 0
    for reaction in all_reactions(universe, require_reactant=True):
        for x in sorted(universe):
            stocks = powerset(universe - {x})
            for smaller in stocks:
                for larger in stocks:
                    if smaller < larger:
                        comparisons += 1
                        if (x in reaction.products
                                and reaction.reactants <= smaller
                                and not (reaction.inhibitors & smaller)
                                and bool(reaction.inhibitors & larger)):
                            count += 1
    return {
        "universe_size": n,
        "comparisons": comparisons,
        "production_losses": count,
        "matches_closed_formula": count == analytic_single_rule_failure_count(n),
    }


def example_inhibition() -> dict:
    """a=0, i=1, x=2: presence of i blocks production of x."""
    U = frozenset({0, 1, 2})
    producer = Reaction(frozenset({0}), frozenset({1}), frozenset({2}))
    return {
        "legend": {"0": "a (reactant)", "1": "i (inhibitor)", "2": "x (target)"},
        "reaction": producer.to_dict(),
        "without_inhibitor": shortest_production(
            U, (producer,), frozenset({0}), 2),
        "with_inhibitor": shortest_production(
            U, (producer,), frozenset({0, 1}), 2),
    }


def example_restoration_by_consumption() -> dict:
    U = frozenset({0, 1, 2})
    producer = Reaction(frozenset({0}), frozenset({1}), frozenset({2}))
    cleanup = Reaction(frozenset({1}), frozenset(), frozenset())
    seed = frozenset({0, 1})
    return {
        "reaction_list": [producer.to_dict(), cleanup.to_dict()],
        "initial_stock": sorted(seed),
        "nonconsuming": shortest_production(
            U, (producer, cleanup), seed, 2, False),
        "consuming": shortest_production(
            U, (producer, cleanup), seed, 2, True),
    }


def example_spontaneous_two_entities() -> dict:
    U = frozenset({0, 1})
    spontaneous = Reaction(frozenset(), frozenset({1}), frozenset({0}))
    return {
        "reaction": spontaneous.to_dict(),
        "from_empty_stock": shortest_production(
            U, (spontaneous,), frozenset(), 0),
        "from_added_inhibitor": shortest_production(
            U, (spontaneous,), frozenset({1}), 0),
    }


def make_report() -> dict:
    census = []
    for n in (1, 2, 3):
        for consuming in (False, True):
            census.append(one_rule_monotonicity_census(n, consuming, True))
    spontaneous = one_rule_monotonicity_census(2, False, False)
    formula_cases = [direct_single_rule_failure_count(n) for n in range(1, 5)]
    assert all(case["matches_closed_formula"] for case in formula_cases)
    assert [row["reaction_count"] for row in census] == [2, 2, 20, 20, 152, 152]
    assert all(row["comparison_counts"]["positive_only_failures"] == 0
               for row in census)
    assert all(row["comparison_counts"]["monotonicity_failures"] == 0
               for row in census if row["universe_size"] < 3)
    assert all(row["comparison_counts"]["monotonicity_failures"] == 48
               for row in census if row["universe_size"] == 3)
    assert spontaneous["comparison_counts"]["monotonicity_failures"] == 8
    return {
        "model": "optional persistence or consumption, guarded sequential reactions",
        "original_law_unchanged": True,
        "smallest_inhibition_example": example_inhibition(),
        "consumption_restores_productivity": example_restoration_by_consumption(),
        "spontaneous_reaction_exception": example_spontaneous_two_entities(),
        "exhaustive_single_reaction_census_nonempty_reactants": census,
        "two_entity_census_with_empty_reactants": spontaneous,
        "exact_production_loss_formula_validation": formula_cases,
        "analytic_prediction_for_five_entities":
            analytic_single_rule_failure_count(5),
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output")
    args = parser.parse_args()
    data = json.dumps(make_report(), ensure_ascii=False, indent=2) + "\n"
    if args.output:
        with open(args.output, "w", encoding="utf-8") as handle:
            handle.write(data)
    else:
        print(data, end="")


if __name__ == "__main__":
    main()
