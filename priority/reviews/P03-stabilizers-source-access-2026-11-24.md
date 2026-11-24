# P03 — Stabilizer literature and source-access protocol

24 November 2026. Internal scientific-priority investigation. No external referee report, no main modification, no T numbering.

## 1. User-approved source-access procedure

If an important reference cannot be obtained, identify its precise title, author, DOI, known access links, and the part needed, and ask the project owner to supply the PDF. If a necessary figure, table, or mathematical passage cannot be rendered/read, identify the PDF page(s) and ask for screenshots or another copy. Do not treat a search snippet, abstract or failed access as a full-text comparison. A failed fetch is not evidence of a paywall. Keep working on available evidence when possible.

## 2. Verified evidence from this session

Actual search queries:
- "Green classes ruled by regular ones" Pin
- "Semigroups with idempotent stabilizers and applications to automata theory" pdf
- "Green classes ruled by regular ones" pdf Pin safe secure
- "10.1142/S0218196791000195" "stabilizer"

### Pin (2026): abstract only — owner assistance requested

J.-E. Pin, Green classes ruled by regular ones, Semigroup Forum (2026), DOI [10.1007/s00233-026-10636-4](https://doi.org/10.1007/s00233-026-10636-4). The [ResearchGate record](https://www.researchgate.net/publication/405026631_Green_classes_ruled_by_regular_ones) returned the abstract, with May 2026 and the DOI. The DOI open was inaccessible; the [Springer page](https://link.springer.com/article/10.1007/s00233-026-10636-4) returned a fetch timeout; the author's [abstract page](https://www.liafa.univ-paris-diderot.fr/~jep/Resumes/Secure.html) returned cache miss. No full paper obtained. Owner asked to supply PDF via the established [Drive reference folder](https://drive.google.com/drive/folders/1sWBWoBIoqkhQFrPuUiJlz0T9VCuJFW7Q) or upload to chat.

The retrieved abstract uses "ruled by regular ones" in a specific global sense: singleton regular Green classes force all classes of that relation to be singleton. It reports the property for finite, compact and group-bound semigroups, and introduces safe/secure classes of semigroups. This is not the same statement as localizing first-entry witnesses for a nonregular class at regular exterior factors with a quantitative one-sided class-size domination. It is a relevant lead, not evidence that such localization is new or already known. Full proofs and references are essential before deciding.

### Le Saëc–Pin–Weil (1991): author manuscript retrieved

B. Le Saëc, J.-E. Pin, P. Weil, Semigroups with idempotent stabilizers and applications to automata theory, International Journal of Algebra and Computation 1 (1991), 291–314, [DOI 10.1142/S0218196791000195](https://doi.org/10.1142/S0218196791000195). Metadata from the author's [publication list](https://www.labri.fr/perso/weil/publications/) item 13 and EBSCO record; the ResearchGate record labels the date 2012, so use the author's 1991 bibliography rather than the aggregator's date. Clicking the case-sensitive link /Perso/~weil/publications/13.pdf failed. The alternate [author PDF](https://www.labri.fr/perso/weil/publications/13.pdf) succeeded: 24 pages, 1320 extracted lines, manuscript titled Finite semigroups whose stabilizers are idempotent semigroups, same authors and abstract. Distinguish manuscript page numbering from published journal pages. Owner was initially asked for both papers and then explicitly told that the 1991 copy is no longer required.

Inspected abstract and introduction (PDF pp.1–3, lines 0–102); definition of Stab(s) and Green relations, Proposition 2.1–2.2 (pp.3–5, lines 103–187); Theorem 4.3 and remark, Proposition 4.4–4.5 (pp.8–10, lines 409–556), and Theorem 4.9 and related passage (p.11, lines 587–645). These are selected excerpts, not a claim of full-paper review. Screenshot of zero-based page 2 (printed manuscript p.3) succeeded and was visually inspected, confirming the opening of Section 2 and the definition of the right stabilizer. Screenshot requests for indices 0,1,8 returned cache misses. Text of the relevant statements was available and readable; no figure is currently needed for the comparison. If visual confirmation is required, ask for manuscript pp.1,2,9. No new numerical experiment performed in this session.

Theorem 1.1, manuscript p.2, constructs a finite cover of every finite semigroup whose right stabilizers are left regular bands (idempotent, R-trivial). Theorem 4.3, p.8, gives the construction's sufficient parameter condition and identifies those stabilizers; Proposition 4.5, p.10, proves optimality in the relevant lattice of band varieties. Proposition 2.1(3), p.4, states the classical finite Green stability implications used in our proof, and (4) states the translation bijection. Thus the stabilization mechanism and Green tools have established antecedents. The paper studies covers and structural identities, not a multiplication-table query budget on a fixed labelled monoid with a supplied ideal and generating statistics.

## 3. Scope of the distinction

P03 localizes a witness xy=c in the original monoid, using minimal ambient J-class nonunit idempotents e,f of the left/right stabilizers of c, to (ex)(yf)=c. Its extra conditions include a nonregular target, the known K products, the absence of the direct metadata-only tests, and side ideals admitting witnesses in the target class. In the inspected 1991 passages there is no statement of the resulting rectangle, quantitative size bounds or the sharp query coefficient. This is a bounded comparison with inspected passages, not a whole-paper no-match claim.

A cover alone does not preserve the indispensable-element predicate under positive-word generation: the surjective homomorphism C4 -> C2 gives E(C4)=empty and E(C2)={nonidentity}. Both groups have trivial right stabilizers. This elementary example is outside the designated proper ideal model; it merely disproves automatic preservation of E under arbitrary covers. It does not rule out some stronger specially constructed cover preserving P03 data. Thus the cover theorem cannot be used by itself as a transfer of the exact query bound.

## 4. Status and evidence discipline

P03 remains PARTIAL_OVERLAP; no priority clearance for the localization lemma. Pin 2026 is BLOCKED_FULL_TEXT, not NO_MATCH. Le Saëc–Pin–Weil is PARTIAL_TEXT_REVIEW. This session verified the above sources through actual tool returns. Historical reports of external searches without available source returns should be treated as leads, not verified searches; the Chang Drive full-text retrieval is independently supported. Earlier literature claims outside this session must be checked against the original sources rather than relying on a previous narrative. No alteration of the sharp theorem or prior experiments. Next: obtain Pin's full text from the owner, then compare exact hypotheses, statements and proof of the finite case, including any local size inequalities or stabilizer arguments.
