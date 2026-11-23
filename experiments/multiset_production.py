#!/usr/bin/env python3
"""Study 07: distinguish species, individual tokens and finite quantities.

This is an explicitly labelled multiset/stoichiometric extension. The
user's exact original principle remains unchanged in docs/00.

Python 3.11+, no third-party dependencies.
  python3 experiments/multiset_production.py
  python3 experiments/multiset_production.py --output results/multiset_production.json
"""
from __future__ import annotations

import argparse
import json
from collections import deque
from dataclasses import dataclass
from itertools import product
from math import comb
from typing import Iterable


@dataclass(frozen=True)
class Reaction:
    pre: tuple[int, ...]
    post: tuple[int, ...]

    def __post_init__(self):
        if len(self.pre) != len(self.post) or not self.pre:
            raise ValueError("pre and post must have equal, positive lengths")
        if any(not isinstance(v, int) or v < 0 for v in (*self.pre, *self.post)):
            raise ValueError("All stoichiometric coefficients must be nonnegative integers")

    def enabled(self, marking: tuple[int, ...]) -> bool:
        if len(marking) != len(self.pre):
            raise ValueError("Marking has incompatible species count")
        return all(current >= required for current, required in zip(marking, self.pre))

    def fire(self, marking: tuple[int, ...]) -> tuple[int, ...]:
        if not self.enabled(marking):
            raise ValueError("Reaction is not enabled at this marking")
        return tuple(m - a + b for m, a, b in zip(marking, self.pre, self.post))

    def type_external(self, target: int, nonempty_inputs: bool = False) -> bool:
        """Potential fresh appearance: no input of target type, positive target output."""
        if not 0 <= target < len(self.pre):
            raise ValueError("Invalid target index")
        return (self.pre[target] == 0 and self.post[target] > 0
                and (not nonempty_inputs or sum(self.pre) > 0))

    def net_gain(self, target: int) -> bool:
        return self.post[target] > self.pre[target]

    def self_dependent_gain(self, target: int) -> bool:
        return self.pre[target] > 0 and self.net_gain(target)

    def delta(self) -> tuple[int, ...]:
        return tuple(b - a for a, b in zip(self.pre, self.post))

    def as_dict(self):
        return {"pre": list(self.pre), "post": list(self.post)}


def all_reactions(species: int, maximum_coefficient: int):
    if species < 1 or maximum_coefficient < 0:
        raise ValueError("species >=1, max coefficient >=0")
    for pre in product(range(maximum_coefficient + 1), repeat=species):
        for post in product(range(maximum_coefficient + 1), repeat=species):
            yield Reaction(pre, post)


def exact_counts(species: int, maximum_coefficient: int) -> dict:
    """Closed count of reactions by their relationship to one target species."""
    n, k = species, maximum_coefficient
    if n < 1 or k < 0:
        raise ValueError("Invalid species count or coefficient bound")
    all_count = (k + 1) ** (2 * n)
    type_ext = k * (k + 1) ** (2 * n - 2)
    spontaneous_ext = k * (k + 1) ** (n - 1)
    ext_with_other_reactants = type_ext - spontaneous_ext
    self_gain = (k * (k - 1) // 2) * (k + 1) ** (2 * (n - 1))
    net_growth = (k * (k + 1) // 2) * (k + 1) ** (2 * (n - 1))
    return {
        "species_count": n,
        "max_coefficient": k,
        "number_of_all_reactions": all_count,
        "type_external_including_spontaneous": type_ext,
        "type_external_with_nonempty_input": ext_with_other_reactants,
        "type_external_with_empty_input": spontaneous_ext,
        "self_dependent_net_growth": self_gain,
        "all_net_growth": net_growth,
    }


def brute_counts(species: int, maximum_coefficient: int) -> dict:
    if (maximum_coefficient + 1) ** (2 * species) > 100000:
        raise ValueError("Direct census is limited to 100000 reactions")
    counts = {
        "type_external_including_spontaneous": 0,
        "type_external_with_nonempty_input": 0,
        "type_external_with_empty_input": 0,
        "self_dependent_net_growth": 0,
        "all_net_growth": 0,
    }
    for r in all_reactions(species, maximum_coefficient):
        if r.type_external(0):
            counts["type_external_including_spontaneous"] += 1
            if sum(r.pre):
                counts["type_external_with_nonempty_input"] += 1
            else:
                counts["type_external_with_empty_input"] += 1
        if r.self_dependent_gain(0):
            counts["self_dependent_net_growth"] += 1
        if r.net_gain(0):
            counts["all_net_growth"] += 1
    return {
        "species_count": species,
        "max_coefficient": maximum_coefficient,
        "number_of_all_reactions": (maximum_coefficient + 1) ** (2 * species),
        **counts,
    }


def conservation_check(reactions: Iterable[Reaction], weights: tuple[int, ...]):
    """Check strictly positive linear conservation: w·pre = w·post."""
    reactions = tuple(reactions)
    if not weights or any(w <= 0 for w in weights):
        raise ValueError("Conservation weights must be strictly positive integers")
    for reaction in reactions:
        if len(weights) != len(reaction.pre):
            raise ValueError("Weights and reaction dimension differ")
    return all(
        sum(w * a for w, a in zip(weights, r.pre))
        == sum(w * b for w, b in zip(weights, r.post))
        for r in reactions
    )


def shortest_threshold(
    initial: tuple[int, ...],
    reactions: tuple[Reaction, ...],
    target: int,
    threshold: int,
    *,
    mass_weights: tuple[int, ...] | None = None,
    max_total: int = 50,
) -> dict:
    """BFS for production of >=threshold items of species target.

    With verified strictly positive conservation weights search is EXACT
    and finite. Otherwise max_total is a mere search limit: a negative
    result is 'unknown_cutoff' if any transition would exceed that bound.
    """
    if not initial or any(v < 0 or not isinstance(v, int) for v in initial):
        raise ValueError("Initial marking must have nonnegative integer components")
    if not 0 <= target < len(initial) or threshold < 1:
        raise ValueError("Invalid target or threshold")
    if any(len(r.pre) != len(initial) for r in reactions):
        raise ValueError("Reaction dimensions differ from marking")
    if sum(initial) > max_total and mass_weights is None:
        raise ValueError("Initial marking exceeds unverified search bound")

    if mass_weights is not None:
        if len(mass_weights) != len(initial) or not conservation_check(reactions, mass_weights):
            raise ValueError("Proposed weights are not a positive conservation invariant")
        initial_mass = sum(w * v for w, v in zip(mass_weights, initial))
    else:
        initial_mass = None

    if initial[target] >= threshold:
        return {"status": "already_present", "minimal_steps": 0,
                "trace": [], "visited_markings": 1}
    queue = deque([(initial, ())])
    seen = {initial}
    cutoff = False
    while queue:
        marking, path = queue.popleft()
        for i, reaction in enumerate(reactions):
            if not reaction.enabled(marking):
                continue
            nxt = reaction.fire(marking)
            if mass_weights is not None:
                assert sum(w * v for w, v in zip(mass_weights, nxt)) == initial_mass
            elif sum(nxt) > max_total:
                cutoff = True
                continue
            next_path = path + ({
                "reaction_index": i,
                "before": list(marking),
                "after": list(nxt),
            },)
            if nxt[target] >= threshold:
                return {"status": "reachable", "minimal_steps": len(next_path),
                        "trace": list(next_path), "visited_markings": len(seen)}
            if nxt not in seen:
                seen.add(nxt)
                queue.append((nxt, next_path))
    return {
        "status": "unknown_cutoff" if cutoff else "unreachable_exhaustive",
        "minimal_steps": None,
        "trace": [],
        "visited_markings": len(seen),
    }


def examples() -> dict:
    # The component order is (A, X).
    source = Reaction((1, 0), (1, 1))  # A -> A+X, fresh X from none
    autocatalytic = Reaction((0, 1), (0, 2))  # X -> 2X
    critical = Reaction((0, 2), (0, 3))  # 2X -> 3X
    finite_gain = Reaction((1, 1), (0, 2))  # A+X -> 2X
    missing_input = Reaction((1, 1, 0), (0, 0, 1))  # A+B -> X

    # Source-reaction exists but A absent: existence != reachability.
    return {
        "source_A_to_A_plus_X": {
            "reaction": source.as_dict(),
            "from_A": shortest_threshold((1, 0), (source,), 1, 1),
            "without_A": shortest_threshold((0, 0), (source,), 1, 1),
        },
        "self_replication_X_to_2X": {
            "reaction": autocatalytic.as_dict(),
            "from_zero": shortest_threshold((0, 0), (autocatalytic,), 1, 1),
            "from_one_reach_three": shortest_threshold((0, 1), (autocatalytic,), 1, 3),
        },
        "threshold_2X_to_3X": {
            "reaction": critical.as_dict(),
            "from_one_reach_three": shortest_threshold((0, 1), (critical,), 1, 3),
            "from_two_reach_four": shortest_threshold((0, 2), (critical,), 1, 4),
        },
        "conserved_conversion_A_plus_X_to_2X": {
            "reaction": finite_gain.as_dict(),
            "positive_weights": [1, 1],
            "conservation_verified": conservation_check((finite_gain,), (1, 1)),
            "from_A2_X1_reach_X3": shortest_threshold(
                (2, 1), (finite_gain,), 1, 3, mass_weights=(1, 1)),
            "from_A2_X1_reach_X4": shortest_threshold(
                (2, 1), (finite_gain,), 1, 4, mass_weights=(1, 1)),
        },
        "reachable_requires_reactants": {
            "reaction": {"pre": [1, 1, 0], "post": [0, 0, 1]},
            "type_external_X": missing_input.type_external(2, True),
            "from_A_without_B": shortest_threshold(
                (1, 0, 0), (missing_input,), 2, 1),
            "from_A_and_B": shortest_threshold(
                (1, 1, 0), (missing_input,), 2, 1),
        },
        "identity_interpretations": {
            "type": "X->2X is not de-novo generation of the type X",
            "copy": "unique output token IDs can be minted from another X token; this is an explicit token convention",
            "quantity": "X->2X increases count by one, but cannot fire with zero X",
            "quantity_object": "in (N0,+), 3 can be generated as 1+2; 1 and 0 cannot be generated from pairs different from the target",
        },
    }


def report() -> dict:
    cases = []
    for n, k in ((1, 3), (2, 2), (2, 3), (3, 2)):
        analytical, enumerated = exact_counts(n, k), brute_counts(n, k)
        assert analytical == enumerated
        cases.append({**analytical, "checked_by_direct_enumeration": True})
    return {
        "extension_not_a_redefinition": True,
        "semantics": "stoichiometric nonnegative integer vectors, optional repeated firing",
        "counting_experiments": cases,
        "specific_reaction_examples": examples(),
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output")
    args = parser.parse_args()
    payload = json.dumps(report(), ensure_ascii=False, indent=2) + "\n"
    if args.output:
        with open(args.output, "w", encoding="utf-8") as f:
            f.write(payload)
    else:
        print(payload, end="")


if __name__ == "__main__":
    main()
