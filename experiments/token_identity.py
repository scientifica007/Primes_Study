#!/usr/bin/env python3
"""Study 07 independent individual-token identity model (T0).

Explicit conventions, not a new definition of the owner's hypothesis:
  - a *type* is a nonempty string (e.g. X);
  - a *token* has an opaque unique integer identity and a type;
  - a *quantity* is the count of tokens of each type;
  - a transition consumes selected tokens and creates output tokens.
  - "fresh": all output tokens receive new IDs;
  - "retain_matching": same-type consumed tokens may retain their IDs.

Physical persistence of identity cannot be inferred merely from chosen IDs.
A special identity policy is therefore essential to individual-token claims.

Usage:
  python3 experiments/token_identity.py
  python3 experiments/token_identity.py --output results/token_identity.json
"""

from __future__ import annotations

import argparse
import json
from collections import Counter
from dataclasses import dataclass
from itertools import combinations, product


@dataclass(frozen=True, order=True)
class Token:
    uid: int
    kind: str

    def __post_init__(self):
        if type(self.uid) is not int or self.uid < 0:
            raise ValueError("Token identity must be a nonnegative integer")
        if not isinstance(self.kind, str) or not self.kind:
            raise ValueError("Type must be a nonempty string")

    def to_dict(self):
        return {"uid": self.uid, "type": self.kind}


@dataclass(frozen=True)
class TokenRule:
    pre: tuple[str, ...]
    post: tuple[str, ...]

    def __post_init__(self):
        if any(not isinstance(x, str) or not x for x in self.pre + self.post):
            raise ValueError("Every type label must be nonempty")

    def to_dict(self):
        return {"pre": list(self.pre), "post": list(self.post)}


@dataclass(frozen=True)
class TokenState:
    tokens: tuple[Token, ...]
    next_uid: int

    def __post_init__(self):
        ids = [token.uid for token in self.tokens]
        if len(ids) != len(set(ids)):
            raise ValueError("Token identities must be unique")
        if type(self.next_uid) is not int or self.next_uid < 0:
            raise ValueError("Invalid next token identity")
        if ids and self.next_uid <= max(ids):
            raise ValueError("Next token identity must exceed every previous ID")

    def counts(self) -> dict[str, int]:
        return dict(sorted(Counter(token.kind for token in self.tokens).items()))

    def kinds(self) -> frozenset[str]:
        return frozenset(token.kind for token in self.tokens)

    def to_dict(self):
        return {
            "tokens": [token.to_dict() for token in self.tokens],
            "next_uid": self.next_uid,
            "counts": self.counts(),
        }


@dataclass(frozen=True)
class TokenTransition:
    rule: TokenRule
    consumed_ids: tuple[int, ...]
    outputs: tuple[Token, ...]
    new_ids: tuple[int, ...]
    retained_ids: tuple[int, ...]
    after: TokenState
    policy: str

    def to_dict(self):
        return {
            "rule": self.rule.to_dict(),
            "consumed_ids": list(self.consumed_ids),
            "produced_tokens": [token.to_dict() for token in self.outputs],
            "new_ids": list(self.new_ids),
            "retained_ids": list(self.retained_ids),
            "after": self.after.to_dict(),
            "policy": self.policy,
        }


def fire(
    state: TokenState,
    rule: TokenRule,
    selected_ids: tuple[int, ...],
    policy: str = "retain_matching",
) -> TokenTransition:
    """Consume exactly the requested individual tokens and emit outputs.

    All same-type consumed tokens are candidate identities under
    retain_matching, each eligible at most once. No token may be selected
    twice; two copies of X require two distinct X token IDs.
    """
    if policy not in ("fresh", "retain_matching"):
        raise ValueError("Unknown identity policy")
    if len(selected_ids) != len(set(selected_ids)):
        raise ValueError("A token cannot be consumed twice")
    indexed = {token.uid: token for token in state.tokens}
    if not set(selected_ids) <= set(indexed):
        raise ValueError("A selected token does not exist")
    selected = tuple(indexed[uid] for uid in selected_ids)
    if Counter(token.kind for token in selected) != Counter(rule.pre):
        raise ValueError("Selected tokens do not satisfy reactant multiplicities")

    remaining = tuple(t for t in state.tokens if t.uid not in selected_ids)
    available = {kind: sorted(t.uid for t in selected if t.kind == kind)
                 for kind in set(token.kind for token in selected)}
    outputs = []
    new_ids = []
    retained_ids = []
    next_uid = state.next_uid

    for kind in rule.post:
        reuse = available.get(kind, [])
        if policy == "retain_matching" and reuse:
            uid = reuse.pop(0)
            retained_ids.append(uid)
        else:
            uid = next_uid
            next_uid += 1
            new_ids.append(uid)
        outputs.append(Token(uid, kind))

    after = TokenState(tuple(sorted(remaining + tuple(outputs))), next_uid)
    return TokenTransition(
        rule=rule,
        consumed_ids=selected_ids,
        outputs=tuple(outputs),
        new_ids=tuple(new_ids),
        retained_ids=tuple(retained_ids),
        after=after,
        policy=policy,
    )


def logical_profile(before: TokenState, transition: TokenTransition, target: str):
    """Three distinct propositions; never call them equivalent."""
    after = transition.after
    old = before.counts().get(target, 0)
    new = after.counts().get(target, 0)
    return {
        "target_type": target,
        "kind_absent_then_present": old == 0 and new > 0,
        "new_individual_of_kind": any(
            token.kind == target and token.uid in transition.new_ids
            for token in transition.outputs
        ),
        "quantity_grew": new > old,
        "before_quantity": old,
        "after_quantity": new,
    }


def checked_example(
    state: TokenState,
    rule: TokenRule,
    selected_ids: tuple[int, ...],
    target: str,
    policy: str,
):
    t = fire(state, rule, selected_ids, policy)
    return {
        "before": state.to_dict(),
        "transition": t.to_dict(),
        "profile": logical_profile(state, t, target),
    }


def construct_report() -> dict:
    x = TokenState((Token(0, "X"),), 1)
    a = TokenState((Token(0, "A"),), 1)
    ax = TokenState((Token(0, "A"), Token(1, "X")), 2)
    one_to_one = TokenRule(("X",), ("X",))
    one_to_two = TokenRule(("X",), ("X", "X"))
    source = TokenRule(("A",), ("A", "X"))
    catalytic = TokenRule(("A", "X"), ("X", "X"))
    cases = {
        "X_to_X_fresh": checked_example(x, one_to_one, (0,), "X", "fresh"),
        "X_to_X_retain": checked_example(x, one_to_one, (0,), "X", "retain_matching"),
        "X_to_2X_fresh": checked_example(x, one_to_two, (0,), "X", "fresh"),
        "X_to_2X_retain": checked_example(x, one_to_two, (0,), "X", "retain_matching"),
        "A_to_A_plus_X_fresh_type_emergence": checked_example(
            a, source, (0,), "X", "retain_matching"),
        "A_plus_X_to_2X_quantity_gain_without_type_emergence": checked_example(
            ax, catalytic, (0, 1), "X", "retain_matching"),
    }
    assert cases["X_to_X_fresh"]["profile"] == {
        "target_type": "X",
        "kind_absent_then_present": False,
        "new_individual_of_kind": True,
        "quantity_grew": False,
        "before_quantity": 1,
        "after_quantity": 1,
    }
    assert not cases["X_to_X_retain"]["profile"]["new_individual_of_kind"]
    assert cases["A_to_A_plus_X_fresh_type_emergence"]["profile"]["kind_absent_then_present"]
    return {
        "model": "T0: individual token identities with explicitly different persistence conventions",
        "original_hypothesis_modified": False,
        "all_examples": cases,
        "summary": {
            "fresh_X_to_X": "New individual ID, equal quantity, no first type appearance",
            "retain_X_to_X": "No new individual ID, equal quantity, no first type appearance",
            "X_to_2X": "Quantity increases and individual offspring appear but type already existed",
            "A_to_A_plus_X": "Previously absent type X first appears",
            "identity_convention": "Token IDs are modelling choices, not physical persistence facts",
        },
    }


def exhaustive_projection_check() -> dict:
    """Exhaust all small enabled single steps, comparing token quantities.

    Two kinds, 0..2 copies of each; pre/post multisets of length <= 2.
    Test every eligible selection of individual input tokens, with both
    identity policies. Quantity projection must equal the stoichiometric
    rule without relying on identity implementation.
    """
    kinds = ("A", "X")
    multi = [()]
    for length in (1, 2):
        multi.extend(tuple(c) for c in combinations_with_replacement(kinds, length))
    count = 0
    examples_with_new_individual_and_unchanged_quantity = 0
    for na, nx in product(range(3), repeat=2):
        ts = tuple(Token(i, "A" if i < na else "X") for i in range(na + nx))
        before = TokenState(ts, len(ts))
        for pre in multi:
            for post in multi:
                rule = TokenRule(pre, post)
                for size in range(len(pre), len(pre)+1):
                    for selected in combinations(tuple(t.uid for t in ts), size):
                        if Counter(t.kind for t in ts if t.uid in selected) != Counter(pre):
                            continue
                        for policy in ("fresh", "retain_matching"):
                            transition = fire(before, rule, selected, policy)
                            expected = {
                                k: before.counts().get(k, 0)
                                - pre.count(k) + post.count(k)
                                for k in kinds
                            }
                            actual = transition.after.counts()
                            if any(expected[k] != actual.get(k, 0) for k in kinds):
                                raise AssertionError((before, rule, transition))
                            new_set = set(transition.new_ids)
                            if new_set & {t.uid for t in before.tokens}:
                                raise AssertionError("New identity collided with existing identity")
                            if policy == "retain_matching" and not (
                                set(transition.retained_ids)
                                <= set(transition.consumed_ids)
                            ):
                                raise AssertionError("A retained identity was not an input")
                            if (set(transition.new_ids)
                                    and actual.get("X", 0) == before.counts().get("X", 0)
                                    and any(t.kind == "X" and t.uid in new_set
                                            for t in transition.outputs)):
                                examples_with_new_individual_and_unchanged_quantity += 1
                            count += 1
    return {
        "verified_enabled_token_transitions": count,
        "witnesses_new_individual_without_quantity_gain": examples_with_new_individual_and_unchanged_quantity,
        "stoichiometric_projection_verified": True,
        "unique_ids_verified": True,
    }


def combinations_with_replacement(items, length):
    """Stand-alone combinatorial enumeration for independence from chemistry module."""
    if length == 0:
        yield ()
    else:
        yield from __import__("itertools").combinations_with_replacement(items, length)


def report():
    return {
        **construct_report(),
        "exhaustive_projection": exhaustive_projection_check(),
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output")
    args = parser.parse_args()
    content = json.dumps(report(), ensure_ascii=False, indent=2) + "\n"
    if args.output:
        with open(args.output, "w", encoding="utf-8") as f:
            f.write(content)
    else:
        print(content, end="")


if __name__ == "__main__":
    main()
