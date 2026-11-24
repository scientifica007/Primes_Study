# Minimal-J stabilizer localization for nonsingleton classes and the statistical one-twelfth bound
24 November 2026. Continuation of [exterior transport](P03-nonuniform-common-witness-barrier-2026-11-24.md), [singleton localization](P03-stabilizer-witness-localization-quarter-bound-2026-11-24.md), and [composite-only statistical inference](P03-threshold-compression-composite-statistics-2026-11-24.md). No new T numbers; main untouched. Internal proofs, not formally certified or externally refereed. Historical priority unresolved.

## 1. Setting and new result

Retain D*, the same finite labelled monoid M, nonempty proper ideal K, units G, A=M\(G union K), and a nonempty compatible family F (possibly restricted by generating statistics). Positive-word generation. Computation on known information, even enumeration of F, is free: only multiplication queries are counted. Set n=|M| and a_reg=number of regular elements in A.

Call an interior nonregular J-class C ambiguous if it is missing in one compatible table and present in another. Missing means no first-entry product of two strictly J-higher elements lands in C; equivalently it is not generated from above. All class membership and orders are fixed by the supplied principal ideals.

**Theorem A (regular localization and size domination).** For any ambiguous C and any c in C there are known exterior nonunit idempotents e,f such that in every compatible table
\[
 C\text{ present}\ \Longleftrightarrow\ \exists x\in\mathcal R(e),\,y\in\mathcal L(f):xy=c.
\]
These ambient Green classes consist of regular exterior elements. The choice can be made so that every witness in this rectangle with output c satisfies
\[
 |\mathcal L(x)|\ge|\mathcal L(c)|,\qquad
 |\mathcal R(y)|\ge|\mathcal R(c)|,
\]
and hence
\[
 |\mathcal L(x)|\,|\mathcal R(y)|\ge |C|\,|\mathcal H(c)|\ge|C|.
\]
No exterior dispensability, null ideal or prescribed generating statistics is needed for Theorem A. In particular this is a genuine nonsingleton extension of the earlier localization (the ambient equality of stabilizer minimal ideals with Green classes need not be assumed or proved for nonsingletons).

**Theorem B (size-restricted recovery).** For a selected collection of d ambiguous classes of sizes >=s, with s>=1 an integer, their labelled presence statuses can be recovered nonadaptively using at most
\[
 \frac{a_{\rm reg}^2}{3s}+dB^2+\frac{2a_{\rm reg}^2}{B}
\]
queries for every integer B>=2. The statement holds without generating statistics. It is not necessarily optimal at small n; actual unions of representative class pairs may be much smaller.

**Theorem C (statistical emptiness).** Given rank and H or g_r as in T56, let d count ambiguous classes of composite size. Then for every integer B>=2,
\[
 D_{\rm det}\le \frac{a_{\rm reg}^2}{12}+dB^2+\frac{2a_{\rm reg}^2}{B}.
\]
Since d<=|K|/4 and a_reg<=n, choosing B=max(2,ceil(n^(1/3))) proves
\[
 D_{\rm det}\le n^2/12+O(n^{5/3}).
\]
This uniform asymptotic upper coefficient 1/12 applies to every fixed L>=0 of the T56 model (indeed uses only L=0 information); it also recovers the cardinality of E, accounting for all fixed local contributions. At L=0 the established lower coefficient remains 1/16, so the limsup interval becomes [1/16,1/12], ratio 4/3. The exploratory upper target 1/8 is exceeded. The earlier 2/9 bound remains valid without statistical side information; we do not assert 1/12 without it. No improvement to the lower coefficient or sharpness of the new upper bound is claimed. This round changes from lower-construction attempts to an upper-bound argument prompted by the preceding exterior-transport theorem.

## 2. Stabilizers of a specified class member

Choose c in C. Set P_c={u:uc=c}, Q_c={v:cv=c}. These are known subsets because c in K, contain the identity, and are submonoids by associativity. They need not contain every unit. In some present table choose a first-entry witness xy=c: existence for every c follows from the preceding exterior-transport theorem. That theorem says pc in C implies px in A, and cq in C implies yq in A. Hence neither P_c nor Q_c meets K; a multiplier in K would put the transported coordinate in K. Their internal multiplication is supplied by the quotient.

Also the missing-table principal ideals give known x r=c=l y with r,l in C. Since x r=c and r J c, finite stability gives r L c, so there is u with u c=r. Thus x u belongs to P_c. It is a nonunit (because x is a nonunit). Dually choose v with c v=l, so v y belongs to Q_c and is a nonunit. This reasoning applies to every possible witness xy=c in any compatible table; all the equalities involving c,r,l are fixed. Therefore each stabilizer has a nonunit.

Choose e idempotent in P_c, nonunit, whose ambient J-class is minimal among the nonunits of P_c under the ambient J-order. Such a choice exists: choose an element of minimal J-class in the nonunit part and take an idempotent positive power (powers remain nonunits in the submonoid and lie weakly below the chosen class). Dually choose f in Q_c. Both choices use only supplied information. In what follows minimal means no strictly lower ambient J-class within that stabilizer; no least class or total order is assumed.

## 3. Localization and Green-size domination

For any witness xy=c and u,v as in Section 2,
\[
 (exu)c=e(xr)=ec=c,\qquad c(vyf)=(ly)f=cf=c.
\]
So exu belongs to the nonunit part of P_c and vyf to that of Q_c. Since exu<=_R ex<=_R e, minimality forces exu J e; finite stability gives exu R e and hence ex R e. Similarly yf L f. Associativity gives
\[
 (ex)(yf)=ecf=c.
\]
Since e,f are regular idempotents outside K, the ambient R(e), L(f) consist of regular exterior nonunits. A hit c in this rectangle is a first-entry witness (the exterior factors are strictly above C), giving the reverse implication. This proves localization for each c.

For size domination let x in R(e), y in L(f) with xy=c. Again choose u with (xu)c=c. For any d in L(c) there are multipliers p,q with pc=d, qd=c. Then
\[
 (qpxu)c=qpc=c,
\]
so qpxu belongs to the nonunit part of P_c. Because J_(qpxu)<=J_(px)<=J_x=J_e, minimality of J_e forces equality. In particular px J x, and px<=_L x, so px L x by finite stability. Moreover (px)y=pc=d. As d runs over L(c), these elements px in L(x) are distinct (their products with y are distinct). Hence |L(x)|>=|L(c)|. Dual reasoning gives |R(y)|>=|R(c)|. By the rectangular array of H-classes in a finite D=J-class and Green's lemma, |L(c)| |R(c)|=|C| |H(c)|. This proves the product domination for every localized c-witness. It is not asserted for an arbitrary unlocalized witness; the minimal-J choice is essential to the argument.

Additional observation: if a nonunit p lies in P_c intersect Q_c then ep belongs to P_c and lies weakly J-below e and p; minimality implies e J ep and e lies in MpM. Similarly pf shows f in MpM. The entire localized rectangle then has both coordinates in the proper principal ideal MpM, whose table is supplied, contradicting ambiguity. Thus P_c and Q_c have no common nonunit. More generally no proper principal ideal contains both e and f, by localization. No equality P_c intersect Q_c=G is claimed for nonsingletons, since units need not fix c. These extra statements are not needed in the counting proof.

## 4. Nonadaptive class-pair queries

For each selected ambiguous class C choose one c in it and one minimal-J pair e,f. Inside R(e)×L(f), retain just those cells that can report the specified c in at least one table of the compatible family. This filtering is legal using free compatible-table enumeration; it uses no unknown actual responses. If one retained cell is a witness, all cells with L-equivalent first coordinate and R-equivalent second coordinate have J-equivalent outputs (each output divides the other by associativity). Thus one query for each pair of ambient classes (L(x),R(y)) suffices: the reply need not be c itself, but its J-class is C exactly when the represented cell reports a member of C. Every positive report of C at exterior coordinates is a genuine first entry. If C is present, at least one retained representative reports C by localization. Hence query the union over all selected targets, counting a pair only once. This reconstructs all selected labelled statuses and can reuse the same representative for different C. No independence or disjointness of target supports assumed.

For every retained class pair the product of its coordinate class sizes is >=s by Section 3. This remains true throughout the pair's Cartesian product L(x)×R(y), since these sizes are fixed. Its charge can be distributed evenly across all cells in that Cartesian product, with per-cell weight 1/(|L(x)| |R(y)|)<=1/s. Distinct class pairs have disjoint Cartesian products in A_reg². All coordinates of such products are regular by Green's lemma.

## 5. Threshold count: three disjoint regions

Fix integer B>=2. Partition the union of selected class pairs for an upper estimate as follows (a pair counted more than once only weakens the estimate).
1. Pay for every rectangle R(e)×L(f) with both side sizes <B directly, costing <=dB² class-pair queries.
2. Of the remaining pairs, charge those for which |L(x)|>=B or |R(y)|>=B. There are at most a_reg/B L-classes of the first type and at most a_reg/B R-classes of the second. Each can be paired with at most a_reg opposite classes, so charge <=2a_reg²/B.
3. All remaining pairs have |L(x)|<B, |R(y)|<B, and at least one of |R(x)|>=B or |L(y)|>=B, because the selected rectangle was not small-small and the R/L sizes are constant across the relevant J-class.

Define disjoint sets of regular exterior elements:
\[
 X=\{x:|R(x)|\ge B,\ |L(x)|<B\},
\quad Y=\{x:|L(x)|\ge B,\ |R(x)|<B\},
\quad Z=\{x:|L(x)|<B,\ |R(x)|<B\}.
\]
The both-large elements are not needed in part 3. These sets are unions of Green J-classes. The Cartesian product of each remaining pair lies entirely in
\[
 (X\times Y)\ \cup\ (X\times Z)\ \cup\ (Z\times Y).
\]
In particular the pair's entire charge can be accounted for using only cells in these three disjoint regions. Write x=|X|, y=|Y|, z=|Z|. By the per-cell charge bound, the number of remaining pairs is <=(xy+xz+zy)/s. The elementary inequality
\[
 xy+xz+zy\le (x+y+z)^2/3\le a_{\rm reg}^2/3
\]
follows from the sum of squared differences. Together with parts 1 and 2 this proves Theorem B. This is a purely symbolic bound, not an interval or optimization certificate. It includes rectangles with a singleton side, unlike the earlier threshold bound which charged those separately.

## 6. Exploiting prescribed statistics

Use the previously proved general-ideal enumerator factorization and composite-only identity. The fixed regular and exterior local generating families determine their contributions to E and rank/enumerators. Subtract fixed missing-class contributions from b and P (count/product derived from rank and g_r or H). With Z_miss the remaining missing classes, define Omega(s) as number of prime factors counted with multiplicity, and w(s)=max(0,Omega(s)-1). Then
\[
 m_1=b-\Omega(P)+\sum_{C\in Z_{\rm miss}}w(|C|),
\]
where m_1 is the number of ambiguous missing singleton classes. Only composite sizes contribute nonzero weight; each such size is >=4. It follows from Theorem B with s=4 that the full set of composite statuses, hence m_1 and |E| and emptiness, can be determined within Theorem C's cost. This argument uses no condition about isolated activations or independent slots, and works in the original full compatible fibre. It needs no assumption of exterior E empty, though emptiness can terminate immediately if a fixed indispensable element exists. For |E| add the known fixed contributions (not their labels among ambiguous singleton classes; this is cardinality, not full labelled E recovery).

For fixed L define C_L as the limsup of the worst-case deterministic query complexity divided by n² over allowed orders and D*/statistic fibres. For L=0 use prior 1/16 lower construction. Upper is 1/12. Ratio 4/3; relative reduction of the old 2/9 upper is 5/8=62.5%. This compares coefficients, not pointwise finite-n costs. For other L the prior lower coefficients remain in force (not a universal lower 1/16 for all L). More generally if all ambiguous composite classes have size >=s0, one may use 1/(3s0) instead of 1/12 and d<=|K|/s0. For instance with no ambiguous size-four classes, s0>=6 (or d=0, giving zero queries), so the leading upper coefficient for that restricted case is 1/18. This points to size-four targets as necessary for attaining the known global L=0 lower coefficient in families without other expensive mechanisms. No claim of sufficient conditions for attaining the lower coefficient.

Finite bound: B=max(2,ceil(n^(1/3))) gives dB²+2a_reg²/B=O(n^(5/3)) uniformly; one may choose an instance-specific threshold minimizing the explicit expression and also take the minimum with all previous algorithms and actual union sizes. No claim of polynomial-time preprocessing, optimality of the nonadaptive strategy, or smaller lower coefficient.

## 7. Executed audit

[composite-regular-localization-audit.js](../experiments/composite-regular-localization-audit.js) was derived from the previous class-expansion audit, executed in this session and saved. Tests identity, all associativity triples, labelled principal ideals, proper principal internal tables, quotient, all K/unit products, regularity/idempotence. For each ambiguous class and each of its elements, builds known P_c and Q_c, tests submonoid closure, no common nonunit, absence of common proper principal ideal containing e,f, and all pairs of minimal-J idempotents in these stabilizers. Tests localization for every first-entry c-witness, class-size domination, class-size identity, representative reconstruction for every table and selected class, and exact integer threshold budget inequalities for B=2..8 as available. Computes the singleton count by the Omega identity on composite-size classes (the script selects all sizes >=4, which are composite in these particular families; any extra prime-size class would have zero weight). No claim of exhaustive generating-set enumeration. Counts:
- 11 explicit families, 148 tables, 2,261,000 associativity triples.
- 31 ambiguous class instances across families, 12 of size >=4; 174 stabilizer constructions (two per class member).
- 17,824 witness transfers across all choices, 7,692 size checks on localized possible c cells, 8 nonregular witness occurrences for the chosen canonical member/choice in the clone family.
- 71 threshold checks, 148 complete class-status and singleton-count reconstructions. PASS.

| family | order | raw possible canonical-member witness cells (union) | localized possible cells | all class-pair queries | selected size>=4 queries |
|---|---:|---:|---:|---:|---:|
| split L=0 p=1,q=2 |20|8|2|2|2|
| split L=0 p=q=2 |22|16|4|4|4|
| split L=1 p=2,q=3 |57|36|6|6|5|
| hierarchy k=2,s=4 |21|8|4|4|4|
| direct product split with C2 |40|16|4|2|2|
| hierarchy k=2,s=4 with exterior nonregular clones |23|12|4|4|4|

Other tested families are the earlier hierarchy k=2,s=1 or 2; k=3,s=2; parity k=2,3. The direct product with C2 of the order-20 split family has a nonnull K (the old absorbing zero times C2 forms a subgroup), nonregular classes of doubled sizes and common metadata. The clone family inflates the upper parity orbit of hierarchy k=2,s=4 by two extra exterior copies: for nonunit/nonunit products use the original projection, and unit actions preserve the copy orbit. Associativity follows from equivariance and projection, and is exhaustively checked. These copies are nonregular but can participate in witnesses. Thus examples cover both nonnull ideals and nonregular exterior factors, although not all monoids. No GAP/Lean/CI or external review. The bound itself is proved symbolically, not inferred from these tests.

## 8. Actual reference search and limitations

Searches executed in this turn: finite semigroup Green relations stability/cardinality; finite semigroup multiplication-table oracle query complexity for generating sets; ideal extensions and first-entry products; targeted East–Higgins title and oracle-query search. Consulted indexed abstracts/excerpts of James East and Peter M. Higgins, [Green's relations and stability for subsemigroups](https://arxiv.org/abs/1906.02313) (2019 preprint, Semigroup Forum 2020), [Computing finite semigroups](https://doi.org/10.1016/j.jsc.2018.01.002), [On the Complexity of the Cayley Semigroup Membership Problem](https://doi.org/10.4230/LIPIcs.CCC.2018.25), and Lee–Santha [The quantum query complexity of the semigroup product problem](https://arxiv.org/abs/2609.39974) (30 September 2026). The last two give the table and concern respectively membership complexity or queries to word letters; neither is this missing-table-cell oracle with generating statistics. Green stability, Green's lemma, and Omega are classical. No exact match for the minimal-J localization/size domination or the statistical 1/12 upper bound identified in these limited results. No full PDF analyzed or specialized bibliographic database review performed. Earlier records of literature searches are not independently verified by this turn. The historical-priority status remains PARTIAL_OVERLAP, not a novelty certification.

Next: concentrate on whether 1/16 is the actual global leading coefficient at L=0. The gap is now only a factor 4/3. The three-region bound relaxes actual compatibility of Green class dimensions and class selection, charging X×Y, X×Z and Z×Y simultaneously. Explore whether the size-four class structure and the number/total size of interior targets prohibit saturating all three regions. Alternatively search for globally coupled constructions exceeding 1/16. No claim of a matching upper bound yet. No merge or submission without authorization.
