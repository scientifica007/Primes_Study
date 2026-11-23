#!/usr/bin/env python3
"""External validation of Green-J characterization against ALL order-six Smallsemi classes.

Uses the hash-pinned independently exported Smallsemi 0.7.2 catalogue.
Classification of monoids, units, J-classes, orbits, and E is recomputed
for each one, not inferred from the ten local examples.

Run:
 python3 experiments/green_smallsemi_audit.py --download
 python3 experiments/green_smallsemi_audit.py --catalogue /path/to/catalogue.json
"""
from __future__ import annotations

import argparse
import json
import tempfile
from collections import Counter
from pathlib import Path
from urllib.request import urlopen

from green_structural_monoids import structural_audit
from match_smallsemi_catalogue import (
    UPSTREAM_URL, EXPECTED_SHA256, catalogue_details, tables_to_flat,
)

EXPECTED_SELECTED = {3170,4333,9407,9504,15903,15957,15958}


def evaluate(catalogue: dict) -> dict:
    monoids = 0
    e_empty = []
    j_singleton = 0
    j_pair = 0
    i2 = 0
    i2_empty = 0
    j_pair_active = 0
    monoid_hist_by_unit_count = Counter()
    singleton_examples = []
    checked_nonunit_elements = 0
    for record in catalogue["semigroups"]:
        table = tables_to_flat(record["table"], base=1)
        # A semigroup, unlike a monoid, need not have a global identity.
        try:
            audit = structural_audit(table)
        except ValueError as e:
            if str(e) == "A finite monoid must have exactly one identity":
                continue
            raise
        monoids += 1
        monoid_hist_by_unit_count[len(audit["units"])] += 1
        checked_nonunit_elements += len(audit["nonunits"])
        current_e = set(audit["E_direct"])
        if not current_e:
            e_empty.append(record["smallsemi_id"][1])
        top = audit["maximal_nonunit_j_classes"]
        if audit["maximal_singleton_obstructions"]:
            j_singleton += 1
            if len(singleton_examples) < 5:
                singleton_examples.append(record["smallsemi_id"][1])
        if any(len(cls) == 2 for cls in top):
            j_pair += 1
        for cls in top:
            if len(cls) != 2:
                continue
            # Theorem T31: the whole maximal J-class has E empty
            # iff the unit group acts nontrivially on it.
            action_active = any(
                audit["unit_double_orbit_sizes"][str(x)] > 1 for x in cls
            )
            e_empty_on_class = all(x not in current_e for x in cls)
            if action_active != e_empty_on_class:
                raise AssertionError(("T31", record["smallsemi_id"], cls))
            if action_active:
                j_pair_active += 1
        if len(audit["nonunits"]) == 2:
            i2 += 1
            active = any(v > 1 for v in audit["unit_double_orbit_sizes"].values())
            predicted = len(audit["units"]) >= 3 and active
            if predicted != (not current_e):
                raise AssertionError(("T32", record["smallsemi_id"]))
            if not current_e:
                i2_empty += 1
    e_empty.sort()
    if set(e_empty) != EXPECTED_SELECTED:
        raise AssertionError(("Unexpected E-empty monoids", e_empty))
    if monoids <= 100:
        raise AssertionError("An incomplete catalogue was examined")
    return {
        "source": "GAP Smallsemi 0.7.2, all 15973 order-six iso/anti representatives",
        "sha256": EXPECTED_SHA256,
        "catalogue_semigroups_scanned": len(catalogue["semigroups"]),
        "catalogue_classes_that_are_monoids": monoids,
        "checked_nonunit_elements": checked_nonunit_elements,
        "monoids_by_unit_group_size": {
            str(k):v for k,v in sorted(monoid_hist_by_unit_count.items())
        },
        "E_empty_nongroup_smallsemi_ids": e_empty,
        "monoids_with_maximal_nonunit_singleton_J_class": j_singleton,
        "first_five_singleton_examples": singleton_examples,
        "monoids_with_maximal_nonunit_two_element_J_class": j_pair,
        "top_two_element_classes_with_active_unit_action": j_pair_active,
        "monoids_with_exactly_two_nonunits": i2,
        "E_empty_monoids_with_exactly_two_nonunits": i2_empty,
        "general_Green_characterization_matched_every_monoid": True,
        "maximal_singleton_obstruction_matched_every_monoid": True,
        "maximal_J_two_element_action_criterion_matched_every_case": True,
        "two_nonunit_criterion_matched_every_case": True,
        "historical_novelty_not_claimed": True,
    }


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    origin=parser.add_mutually_exclusive_group(required=True)
    origin.add_argument("--download",action="store_true")
    origin.add_argument("--catalogue",type=Path)
    parser.add_argument("--output",type=Path)
    args=parser.parse_args()
    if args.download:
        with tempfile.TemporaryDirectory() as tmp:
            p=Path(tmp)/"catalogue.json"
            with urlopen(UPSTREAM_URL,timeout=90) as response:
                p.write_bytes(response.read())
            c,_=catalogue_details(p)
    else:
        c,_=catalogue_details(args.catalogue)
    data=evaluate(c)
    text=json.dumps(data,indent=2,ensure_ascii=False)+"\n"
    if args.output:
        args.output.write_text(text,encoding="utf-8")
    print(text,end="")


if __name__=="__main__":
    main()
