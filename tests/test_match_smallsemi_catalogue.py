"""Independent unit tests for the exact catalogue matching algorithm."""
import json
import sys
import unittest
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/"experiments"))
from match_smallsemi_catalogue import (  # noqa: E402
    isomorphism, opposite, identity, unit_set,
    no_nongenerable_elements, tables_to_flat, EXPECTED_SHA256
)


class MatchSmallsemiTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        data=json.loads((ROOT/"results"/"minimal_monoids_order6.json").read_text(encoding="utf-8"))
        cls.examples=[
            (row, tables_to_flat(row["table"], 0))
            for section in data["unit_group_decomposition"]
            for row in section["representatives"]
        ]

    def test_source_checksum_pinned(self):
        self.assertEqual(EXPECTED_SHA256, "944f356c42b8e703988f5684cd81b650f99cc0ccd1ef1d7fc6e900f2c95f287c")

    def test_every_local_monoid_satisfies_filter(self):
        self.assertEqual(len(self.examples),10)
        for row,table in self.examples:
            with self.subTest(group=row["unit_group"],action=row["unit_action"]):
                e=identity(table)
                self.assertIsNotNone(e)
                self.assertFalse(len(unit_set(table,e))==6)
                self.assertTrue(no_nongenerable_elements(table))
                self.assertEqual(len(unit_set(table,e)),row["unit_order"])

    def test_any_bijection_with_identity_in_nonzero_position(self):
        _,table=self.examples[0]
        perm=(4,1,2,3,0,5)
        inverse=[0]*6
        for i,j in enumerate(perm):
            inverse[j]=i
        relabel=tuple(perm[table[inverse[a]*6+inverse[b]]]
                      for a in range(6) for b in range(6))
        self.assertEqual(identity(relabel),4)
        self.assertEqual(isomorphism(table,relabel),perm)

    def test_opposite_is_always_a_monoid_and_E_unchanged(self):
        for _,tab in self.examples:
            op=opposite(tab)
            self.assertIsNotNone(identity(op))
            self.assertTrue(no_nongenerable_elements(op))
            self.assertEqual(opposite(op),tab)

    def test_all_ten_have_exactly_seven_opposite_classes(self):
        rep_list=[table for _,table in self.examples]
        groups=[]
        for t in rep_list:
            if not any(isomorphism(t,u) is not None or
                       isomorphism(opposite(t),u) is not None for u in groups):
                groups.append(t)
        self.assertEqual(len(groups),7)

    def test_table_base_conversion_guards(self):
        _, t=self.examples[0]
        self.assertEqual(tables_to_flat([[v+1 for v in t[i*6:(i+1)*6]]
                                         for i in range(6)],1),t)
        with self.assertRaises(ValueError):
            tables_to_flat([[8]*6 for _ in range(6)],1)


if __name__=="__main__":
    unittest.main()
