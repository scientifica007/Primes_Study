#!/usr/bin/env python3
"""Match all minimal six-element E-empty nongroup monoids to GAP Smallsemi 0.7.2.

Cross-reference with a *pinned, third-party exported catalogue*, not with
our own Python/GAP enumeration. This script does not need GAP itself:
the upstream file is an export of all 15973 order-six representatives,
one per isomorphism/anti-isomorphism class.

Data provenance:
  nasqret/semibase-order6, commit
    6f75ceacff8f54d0db1f0ab286c05f0f5301f90d
  research/order6/catalogue.json, exported from GAP Smallsemi 0.7.2.
  Expected SHA-256 (pinned by source repository's check_catalogue.py):
    944f356c42b8e703988f5684cd81b650f99cc0ccd1ef1d7fc6e900f2c95f287c

Usage (run from repository root):
  python3 experiments/match_smallsemi_catalogue.py \
      --catalogue /path/to/catalogue.json --output /tmp/linked.json
  python3 experiments/match_smallsemi_catalogue.py --download \
      --output /tmp/linked.json
"""
from __future__ import annotations

import argparse
import hashlib
import itertools
import json
from pathlib import Path
from urllib.request import urlopen

ROOT = Path(__file__).resolve().parents[1]
UPSTREAM_REPO = "nasqret/semibase-order6"
UPSTREAM_COMMIT = "6f75ceacff8f54d0db1f0ab286c05f0f5301f90d"
UPSTREAM_PATH = "research/order6/catalogue.json"
UPSTREAM_URL = (
    f"https://raw.githubusercontent.com/{UPSTREAM_REPO}/"
    f"{UPSTREAM_COMMIT}/{UPSTREAM_PATH}"
)
EXPECTED_SHA256 = "944f356c42b8e703988f5684cd81b650f99cc0ccd1ef1d7fc6e900f2c95f287c"

# Independent of the group-action classifier's restricted automorphism search:
# test ALL 6! bijections, without assuming where the identity is located.
ALL_BIJECTIONS = tuple(itertools.permutations(range(6)))


def tables_to_flat(table: list[list[int]], base: int) -> tuple[int, ...]:
    if len(table) != 6 or any(len(row) != 6 for row in table):
        raise ValueError("Every table must be 6x6")
    flat = tuple(x-base for row in table for x in row)
    if any(x not in range(6) for x in flat):
        raise ValueError("An entry is outside the six-element carrier")
    return flat


def opposite(t: tuple[int, ...]) -> tuple[int, ...]:
    return tuple(t[b*6+a] for a in range(6) for b in range(6))


def isomorphism(a: tuple[int, ...], b: tuple[int, ...]) -> tuple[int, ...] | None:
    """Return explicit map a -> b, or None; no intrinsic-block shortcut."""
    for p in ALL_BIJECTIONS:
        if all(p[a[i*6+j]] == b[p[i]*6+p[j]]
               for i in range(6) for j in range(6)):
            return p
    return None


def identity(t: tuple[int, ...]) -> int | None:
    xs = [e for e in range(6)
          if all(t[e*6+a] == a and t[a*6+e] == a for a in range(6))]
    if len(xs) > 1:
        raise AssertionError("A semigroup cannot have two identities")
    return xs[0] if xs else None


def unit_set(t: tuple[int, ...], e: int) -> tuple[int, ...]:
    return tuple(a for a in range(6)
                 if any(t[a*6+b] == e and t[b*6+a] == e for b in range(6)))


def no_nongenerable_elements(t: tuple[int, ...]) -> bool:
    return all(any(t[a*6+b] == x
                   for a in range(6) if a != x
                   for b in range(6) if b != x)
               for x in range(6))


def catalogue_details(path: Path) -> tuple[dict, str]:
    content = path.read_bytes()
    checksum = hashlib.sha256(content).hexdigest()
    if checksum != EXPECTED_SHA256:
        raise ValueError(
            f"Upstream catalogue SHA-256 mismatch: got {checksum}; "
            f"expected {EXPECTED_SHA256}. Refuse unverified data."
        )
    data = json.loads(content)
    if data.get("source", {}).get("package") != "GAP Smallsemi":
        raise ValueError("Wrong catalogued package")
    if data["source"]["version"] != "0.7.2":
        raise ValueError("Only tested with Smallsemi version 0.7.2")
    records = data.get("semigroups", ())
    if len(records) != 15973:
        raise ValueError(f"Expected 15973 class records, got {len(records)}")
    if {tuple(rec["smallsemi_id"]) for rec in records} != {
        (6, i) for i in range(1, 15974)
    }:
        raise ValueError("Incomplete or duplicate Smallsemi IDs")
    return data, checksum


def evaluate(catalogue: dict, project: dict) -> dict:
    selected = []
    for rec in catalogue["semigroups"]:
        t = tables_to_flat(rec["table"], 1)
        e = identity(t)
        if e is None:
            continue
        u = unit_set(t, e)
        if len(u) == 6 or not no_nongenerable_elements(t):
            continue
        selected.append((rec, t, len(u)))
    if len(selected) != 7:
        raise AssertionError(
            f"Catalogue filter produced {len(selected)}, expected 7. "
            "Do not assign catalogue IDs until the discrepancy is resolved."
        )

    project_reps = [
        row for section in project["unit_group_decomposition"]
        for row in section["representatives"]
    ]
    if len(project_reps) != 10:
        raise AssertionError("The archived classification has not got 10 representatives")

    links = []
    matched_ids = set()
    directions_by_id = {}
    for index, row in enumerate(project_reps, 1):
        t = tables_to_flat(row["table"], 0)
        if identity(t) is None or not no_nongenerable_elements(t):
            raise AssertionError("Invalid local class representative")
        matches = []
        for rec, candidate, size_u in selected:
            if size_u != row["unit_order"]:
                continue
            direct = isomorphism(t, candidate)
            reverse = isomorphism(opposite(t), candidate)
            if direct is not None or reverse is not None:
                matches.append((rec, direct, reverse))
        if len(matches) != 1:
            raise AssertionError(
                f"Local class {index}: expected one Smallsemi catalogue "
                f"equivalence class, got {len(matches)}"
            )
        rec, direct, reverse = matches[0]
        sid = rec["smallsemi_id"]
        key = sid[1]
        matched_ids.add(key)
        direction = ("both" if direct is not None and reverse is not None
                     else "direct" if direct is not None else "opposite")
        links.append({
            "local_class": index,
            "unit_group": row["unit_group"],
            "unit_order": row["unit_order"],
            "ideal_order": row["ideal_order"],
            "unit_action": row["unit_action"],
            "ideal_multiplication": row["ideal_multiplication"],
            "smallsemi_id": sid,
            "reference_catalogue_self_dual": rec["self_dual"],
            "orientation": direction,
            "direct_isomorphism_zero_based": list(direct) if direct else None,
            "opposite_isomorphism_zero_based": list(reverse) if reverse else None,
        })
        directions_by_id.setdefault(key, []).append(direction)

    if matched_ids != {rec["smallsemi_id"][1] for rec, _, _ in selected}:
        raise AssertionError("The 10 local classes do not exhaust the 7 catalogue classes")
    if len(set(x["local_class"] for x in links)) != 10:
        raise AssertionError("Not every local class matched")

    multiplicities = sorted(len(v) for v in directions_by_id.values())
    if multiplicities != [1,1,1,1,2,2,2]:
        raise AssertionError(
            f"Unexpected opposite-pair pattern for the 7 classes: {multiplicities}"
        )
    for rec, _, _ in selected:
        matches = directions_by_id[rec["smallsemi_id"][1]]
        if len(matches) == 2 and sorted(matches) != ["direct", "opposite"]:
            raise AssertionError(f"Expected opposite pair, got {matches}")
        if len(matches) == 1 and matches[0] != "both":
            # This occurs only if reference table is self-dual but our chosen
            # representative orientation does not permit both. Isomorphism
            # should then also exist for opposite, so raise.
            raise AssertionError(f"Self-dual representative mismatch: {matches}")
        if bool(rec["self_dual"]) != (len(matches) == 1):
            raise AssertionError("Mismatch with independent self-duality field")

    return {
        "study": "T28 external exact Smallsemi catalogue mapping",
        "catalogue_source": {
            "project": UPSTREAM_REPO,
            "pinned_commit": UPSTREAM_COMMIT,
            "path": UPSTREAM_PATH,
            "smallsemi_version": "0.7.2",
            "sha256": EXPECTED_SHA256,
            "catalogue_classes_order_6_up_to_isomorphism_or_anti": 15973,
        },
        "selection_criterion": "monoid, non-group, E-empty for every element",
        "catalogue_classes_selected": 7,
        "local_isomorphism_classes_matched": 10,
        "smallsemi_ids_sorted": [[6, i] for i in sorted(matched_ids)],
        "selection_by_units": {
            group: sorted({rec["smallsemi_id"][1]
                           for rec, _, m in selected
                           if any(l["smallsemi_id"] == rec["smallsemi_id"]
                                  and l["unit_group"] == group for l in links)})
            for group in ("C3", "C4", "V4")
        },
        "matches": links,
        "caveat": (
            "Catalogued semigroups and their IDs are pre-existing objects. "
            "Matching T28 does not establish novelty of the E-based selection."
        ),
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    source = parser.add_mutually_exclusive_group(required=True)
    source.add_argument("--catalogue", type=Path)
    source.add_argument("--download", action="store_true")
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()

    if args.download:
        # Only immutable commit URL, with a cryptographic content check.
        with urlopen(UPSTREAM_URL, timeout=120) as response:
            raw = response.read()
        import tempfile
        with tempfile.TemporaryDirectory(prefix="smallsemi_match_") as tmp:
            p = Path(tmp) / "catalogue.json"
            p.write_bytes(raw)
            catalogue, checksum = catalogue_details(p)
    else:
        catalogue, checksum = catalogue_details(args.catalogue)

    project = json.loads((ROOT / "results" / "minimal_monoids_order6.json").read_text(
        encoding="utf-8"
    ))
    result = evaluate(catalogue, project)
    result["catalogue_source"]["verified_download_checksum"] = checksum
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(
        json.dumps(result, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8"
    )
    print(f"VERIFIED SMALLSEMI 0.7.2, SHA256={checksum}")
    print(f"SELECTED IDS {result['smallsemi_ids_sorted']}")
    print("MATCHED 10 local classes against exactly 7 catalogued classes.")
    for item in result["matches"]:
        print(f"CLASS_{item['local_class']:02d} "
              f"{item['unit_group']} {item['unit_action']} "
              f"=> Smallsemi {item['smallsemi_id']} ({item['orientation']})")


if __name__ == "__main__":
    main()
