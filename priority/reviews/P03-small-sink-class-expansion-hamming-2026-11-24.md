# Small-sink class expansion, sharp Hamming separation, and a barrier to uniform independent slots
24 November 2026. Internal continuation of the [threshold/composite inference note](P03-threshold-compression-composite-statistics-2026-11-24.md), [small-sink classification](P03-small-sink-unit-orbits-density-2026-11-24.md), and [two-sided lower construction](P03-two-sided-target-orbits-matching-2026-11-24.md). No new T numbers; main untouched. No external referee or formal proof certificate. Historical priority unresolved.

## 1. Scope and principal results

Use the same finite labelled monoid model D*, positive-word generation, designated proper nonempty ideal K, group of units G, A=M\(G union K), a=|A|, and compatible multiplication tables on the same labelled set. For all statements involving small sinks assume no indispensable exterior element, i.e. E outside K is empty. This is forced for any pair with opposite E-emptiness verdicts by the common metadata. No null-ideal assumption.

For two compatible tables define their Hamming distance
\[
\Delta(M_0,M_1)=|\{(x,y):x\cdot_0 y\ne x\cdot_1 y\}|.
\]
The difference set D lies in A×A, since all other cells and all nonzero quotient outputs are known.

Main results:
- When a nonregular interior J-class becomes present, at least two first-entry cells must change; if its size is >1, at least four must change. Both universal constants are sharp in the structural model without fixing generating statistics.
- A small sink of size k=2 or 3 reports a two-sided unit-fixed element. If its output is t in a newly present class C, then the set of first-entry cells of C has cardinality >= k max(|L(t)|,|R(t)|). Nonsingleton classes can have small sinks; they cannot have all their first-entry cells confined to one such sink.
- With opposite verdicts and fixed T56 statistics, let J_L={j:1<=j<=L, j=1 or j even}. Then
\[
\Delta(M_0,M_1)\ge4(2+|J_L|).
\]
At L=0 the lower distance 8 is exactly attained, even with the full H and g_r prescribed. This is a sharp universal separation in table-cell distance, NOT a new query lower coefficient, NOT a claim about the smallest possible order of a balanced pair, and not a statement that each individual pair attains the bound.
- A specified uniform independent-slot construction method cannot exceed the leading lower coefficient 1/16. Nonuniform slots and collectively constrained changes are not ruled out. The global L=0 query interval remains [1/16,2/9]; 1/8 was not achieved.

## 2. First-entry support and small-sink expansion

A nonregular J-class C is called missing if no product of two strictly J-higher elements belongs to it. This agrees with relative generation from above (see the [general-ideal statistics note](P03-general-ideal-statistics-2026-11-24.md)). Fix compatible tables M0 and M1 with C missing in M0 and present in M1. Then C is inside K because the outside quotient determines all exterior-class witnesses. Define
\[
 D_C=\{(x,y)\in A^2:x\cdot_1 y\in C,\ J_x>C,\ J_y>C\}.
\]
Every first-entry product for C in M1 has both factors in A: otherwise its value is supplied by D*, contradicting absence in M0 (a unit factor cannot produce a first-entry hit from strictly higher classes). Thus D_C is nonempty and contained in D. It equals the relevant class-witness vertex set for C when restricting the compatible family to these two tables. Equivalently it is closed under the full two-sided nonself-factorization dependencies and reversible Green saturation: a known translation on K cannot first enter C from two strictly higher factors in a table where C is missing. The detailed closure proof is in the general-ideal note. Every vertex has a nonloop outgoing dependency, since every exterior element admits a known nonself factorization. Hence D_C contains a sink SCC of size at least two.

If a sink S has size k=2 or 3, invoke the exact classification established in the small-sink note. It is a balanced unit orbit S={(x_i,y_i):i=1,...,k}; both projections are injective, first coordinates have singleton L-classes, second coordinates singleton R-classes, and their two projection sets are disjoint (first coordinates have nonsingleton R, second nonsingleton L). All products in S equal the same t in M1. For every g in G, gx_i=x_i and y_i g=y_i by their singleton classes, hence
\[
gt=t=tg.
\]
In particular if a nonsingleton C is a single orbit under the two independent outer unit actions then it cannot be reported by a two- or three-cell sink. More generally every SCC of the Green-saturated graph containing a cell with output t contains cells reporting all of GtG, because left multiplication of the first coordinate and right multiplication of the second by units preserve their L- and R-classes respectively. A balanced orbit commutes with these two outer actions, so if its size is k then that SCC contains at least k|GtG| cells (disjoint balanced orbits for distinct output values). This last statement also holds for larger SCCs.

**Expansion lemma.** With the small sink S as above,
\[
 |D_C|\ge k\,|\mathcal L(t)|,\qquad |D_C|\ge k\,|\mathcal R(t)|.
\]
Proof of the first inequality. For each v in L(t), choose p with p t=v in M1. Such p is strictly J-higher than C, since a product of two members of a nonregular J-class cannot stay in it; p=1 is allowed. For every i, (p x_i)y_i=v. Because the x_i belong to one right unit orbit, all p x_i are in K or all are outside K.

If outside K, p x_i is nonunit and strictly J-higher than C, so record the k distinct cells (p x_i,y_i) in D_C; their second coordinates are the distinct y_i, and all report v.

If inside K, each p x_i is J-above or equal to C by ideal monotonicity. Strictly above is impossible: the fixed product (p x_i)y_i would be a supplied first-entry witness for C in M0. Consequently p x_i belongs to C. The products p x_i themselves are first-entry witnesses in M1. They cannot involve a factor in K or a unit, because then they would be supplied. Record the k distinct cells (p,x_i) in D_C. They have second coordinates among the distinct x_i.

The recorded k-cell sets for different v are pairwise disjoint. In the first case equality of cells would force equality of their output v. In the second case equality of cells forces the same p and same x_i, hence the same v=p t; alternatively recover v by multiplying the reported value by the matching y_i. The two cases cannot overlap, because the second-coordinate sets of S are disjoint from its first-coordinate sets. For v=t choose p=1 to recover S itself. This proves the first inequality; the second is dual. No assumption that every element of C is a first-entry output at one cell is made.

By finiteness D=J for Green's relations (here D denotes the Green relation, not the difference set), so a nonsingleton C has max(|L(t)|,|R(t)|)>=2. If the selected sink has size >=4, |D_C|>=4 immediately. Otherwise the expansion lemma gives |D_C|>=2k>=4. This proves the four-cell claim. If C singleton the preceding nonloop argument gives >=2. The parity construction with G=C4 and two exterior factors per side attains two changed cells for the singleton, without fixed rank. The two-sided U=V=2 shared-target construction with a size-two layer activated at one position attains four first-entry cells. This also occurs in the balanced family: each of the two size-two layers can be present at exactly one position.

## 3. Weighted separation between opposite verdicts

For any pair, let Z_i be its missing nonregular interior classes (including singleton classes), and fix all other contributions to the generating enumerators as established in the general-ideal note. With E outside K empty, for each direction the class sets D_C for C in Z_0\Z_1 are disjoint subsets of D (their M1 outputs belong to distinct classes), giving
\[
\Delta(M_0,M_1)\ge
 2|\{C\in Z_0\setminus Z_1:|C|=1\}|
 +4|\{C\in Z_0\setminus Z_1:|C|>1\}|.
\]
The reverse-direction bound also holds and can be maximized with this one, not added (the same cell may change from one class to another). This is a general labelled pairwise bound, not a count of independent slots.

Assume E(M0) is empty and E(M1) nonempty and the T56 statistics agree. The invariant regular/exterior contribution to E must be empty in both. Every singleton interior nonregular class is present in M0, and at least one is missing in M1. Thus Z_0\Z_1 contains only nonsingleton classes. The statistics fix the missing count b, product P and power sums for J_L. Removing common classes, let delta=|Z_0\Z_1|=|Z_1\Z_0|; the two remaining size multisets have equal product and the given moments, but only the second contains a singleton. The multiset uniqueness lemma of [one-third joint sink bound](P03-one-third-joint-sink-bound-2026-11-24.md) says that equal cardinality k<=1+|J_L|, equal product and these moments force equal multisets (proved there via sign changes and Descartes' rule). Hence delta>=2+|J_L|, and the disjoint class bound gives
\[
\Delta\ge4\delta\ge4(2+|J_L|).
\]
For L=0 only equality of count and product is needed: delta=1 would force the two differing sizes equal, contradicting the singleton difference. No use of further H coefficients is required beyond the information in r and g_r. More generally with equal rank alone delta>=1 gives distance >=4 for opposite verdicts.

**Sharpness at L=0.** Use the previous split construction U=V=2, p=1, q=2, G=C4, target sizes (1,4,2,2), with K including zero. Order n=20, rank r=6, h_6=g_6=64 and all other h_j=0. The two label positions contain respectively the two labels of (1,4) or the two labels of (2,2) in either order. Missing sizes (2,2) vs (1,4) have b=2,P=4. E is empty vs a singleton. The tables differ only at the two 2×2 product rectangles, exactly eight cells because labels are disjoint. All four such labelled tables were audited below. Therefore the universal minimum across compatible opposite-verdict pairs at L=0 is exactly 8. This establishes neither minimum possible n nor sharpness at L>=1. For L>=1 the displayed lower distance is not asserted optimal.

**Robustness corollary.** If D* and the statistics are correct, and an observed complete table (possibly nonassociative due to corruption) lies within Hamming distance e<=3 of a compatible table, all compatible tables within that radius give the same E-emptiness verdict at L=0. Otherwise triangle inequality would give opposite compatible tables at distance <=6, contrary to 8. Four errors cannot be tolerated universally: take a distance-eight sharp pair and make a midpoint by selecting four differing cells from each table, retaining common entries. This observed array is distance four from each true table, so the verdict is not determined. No assertion that the midpoint is associative; corruption can be arbitrary. At general L the distance lower bound gives guaranteed radius 2(2+|J_L|)-1, not necessarily sharp. Similarly at L=0 any seven erased cells of the complete table can be ignored if every other cell is known exactly and the side data hold. These are information-theoretic uniqueness statements, not efficient decoders or new asymptotic query coefficients.

## 4. A barrier for uniform independent-slot constructions

Formalize a restricted construction scheme. There is a common unbalanced structural family with exterior E empty, a baseline table M_* in which a designated singleton t and a designated nonsingleton nonregular class C are both missing, and m pairwise disjoint sets of cells B_i (slots). For each i there is a table activating t while differing from M_* only within B_i, and a table activating C while differing only within B_i. These isolated activations need not preserve the generating statistics: a balanced promised subfamily is chosen later. Assume the uniform singleton-fill property: in the singleton activation of slot i every cell in B_i reports t, and its two factors are strictly above t. All other entries remain baseline. These are explicit additional hypotheses, not claims about arbitrary semigroup extensions.

By the four-cell theorem every B_i has >=4 cells (from the isolated C activation). By the stabilizer-disjointness theorem for ambiguous singleton t in this structural family, all singleton witness cells belong to (P_t\G)×(Q_t\G), where P_t∩Q_t=G and both avoid K. Their total number is <=floor(a²/4). Uniform singleton-fill means every B_i lies in that region. Hence
\[
 4m\le\sum_i|B_i|\le \lfloor a²/4\rfloor,\qquad
 m\le\lfloor a²/16\rfloor.
\]
If additionally each slot label in the eventual promise is readable by one designated cell, and all unknown entries are determined by those labels (the intended shared-array construction), then querying the m labels decides the problem; this method cannot establish a larger leading lower coefficient than 1/16. The previous split U=V=2 construction meets these restrictions: in its unbalanced structural family any slot can independently be zero or any layer label, the singleton fills the whole 2×2 block, and the balanced promise has worst-case pq−1, n=2p+2q+14. At p=q growing, m/a²=1/16 exactly and the decision coefficient tends to 1/16. Thus the restriction is sharp. Do not confuse optimality within this scheme with the global optimal coefficient.

Without uniform singleton-fill, each slot must still contain >=2 singleton witness cells by Section 2. Since slots disjoint, these cells give m<=floor(a²/8). The nonsingleton activation still needs at least four cells in its slot, possibly different ones. If each label is read by one designated cell and all variation captured by labels, this relaxed scheme has at most 1/8 leading coefficient; existence of a construction approaching it is OPEN. The argument does not rule out nonuniform slots reaching 1/8, globally coupled patterns with no isolated activations, alternative label choices, or constructions outside this scheme. The distance-eight statement alone cannot imply a bound of 1/16 on all query lower constructions: a pair may differ on several slots.

## 5. Explicit obstruction to the stronger conjecture that small sinks report only singletons

Construct a hierarchy with G=C_g, g=k for k>=3 and g=4 for k=2. Let k be 2 or 3. Use upper right-zero band U=C_k, lower rectangular band A'=C_s×C_k, left-zero band B=C_k, target layer T=C_s and absorbing zero z. K=T union {z} is null. The carrier order is g+2k+sk+s+1. For x in U or A', define row c(x)=0 for U and its first coordinate for A'; define column d(x)=its U index or its second coordinate. For x,y in U union A', set xy=y if both in U, otherwise xy=(c(x),d(y)) in A'. This is the two-level strong semilattice of rectangular bands given by the projection U->(0,d) into A'. For b,b' in B use bb'=b. For a k-bit mask w set
\[
 x b_j=\begin{cases}t_{c(x)},& w_{d(x)+j\bmod k}=1,\\z,&\text{otherwise},\end{cases}
\]
for x in U union A', set x t_l=t_{c(x)}, t_l b_j=t_l. All other nonunit products are z. Units on the right shift the column of U,A', on the left shift B's index, and act trivially elsewhere (in particular on T from both sides). Unit group law as usual.

Associativity: the band law preserves the row of the first and column of the second factor; AB is compatible with this rule because its row comes from the first factor and its mask index from the last column and B index. The left-zero law of B makes ABB compatible with TB=T. AAT and ATB follow the constant-row left action and identity right action. All other nonunit type triples give zero unless contained entirely in the A/U or B bands; those are associative. The two middle unit shifts in AB agree by the parity/mod-k sum; band multiplication discards the shifted middle coordinate. All unit actions commute where required and the identity acts trivially. This proves the law for every mask.

All right ideals of U contain its whole upper band and the lower row 0, t_0 and z; those of lower x contain its lower row, t_{c(x)},z. Left ideals of U consist of the upper element and its lower column plus z; those of lower x consist of its lower column plus z. B left ideal is all B, all T and z, right ideal is its singleton plus z. Each t_l has all T and z in its left ideal, itself and z in its right ideal. Principal two-sided ideals follow: U's includes both bands U,A', all T and z; A' includes A',T,z; B includes B,T,z; T includes T,z. Hence all labelled principal ideals are fixed by mask, and proper principal tables contain no variable A/U×B cell. Quotient, unit actions, products involving K, regularity/idempotence fixed. Every exterior element dispensable by units (G has at least two generators as individual elements because g>=3 and cyclic), zero by BA. If s>=2, T is a nonsingleton nonregular J-class, generated within itself by fixed left row actions; it is missing exactly when the mask is all zero. E is empty in all masks for s>=2 (not an opposite-verdict balanced lower family). For s=1 only the zero mask has t indispensable.

At each activated mask index, U×B contains an exact k-cell balanced orbit with injective projections, a sink of the saturated graph. Upper coordinates have singleton L, B singleton R; their only nonself factorizations transfer units; lower factors cannot generate an upper factor. No nontrivial saturation edge leaves that orbit. The target output is t_0, fixed by units but not all left nonunit multipliers. Each activated index gives k first-entry cells in U×B and sk in A'×B, so total k(s+1) per active bit. Thus a small sink can report a nonsingleton class (including composite size 4), but further cells appear outside the sink; max(|L(t_0)|,|R(t_0)|)=s, and the expansion lower bound ks is respected. This is an explicit counterexample to a stronger but false assertion. It does not improve the lower coefficient.

## 6. Executed audit

[small-sink-class-expansion-distance-audit.js](../experiments/small-sink-class-expansion-distance-audit.js), executed in this session, then extended with plain parity singleton families and rerun. Final run:
- 140 labelled tables across nine explicit families; 1,956,332 associativity triples.
- All common labelled principal ideals, proper principal tables, unit/ideal products, quotient, idempotence/regularity and exterior dispensability checked. Missing statuses computed directly from first-entry products, E by alternative factorizations. In balanced examples compare exact count/product/moment signatures (BigInt); the known polynomial factorization implies equality of r,H,g_r...; no new exhaustive enumeration of generating subsets claimed.
- 258 present-class first-entry sets with an absent counterpart; exact SCCs by reachability, closure, small-sink classification, output constancy, unit-fixed outputs and expansion injections checked. 40 small sinks (20 reporting nonsingletons); 276 translated-cell injection checks. All PASS.
- 2,521 opposite-verdict table pairs; 2,508 have common statistic signatures. Exact weighted class distances and moment bounds checked on the latter. No violation.
- 28 balanced opposite-verdict pairs at Hamming distance exactly 8 (4 in order-20 family, 24 in order-22 family). This verifies the explicit sharp example, not universal proof by enumeration.

| Family | order | tables | min first-entry cells for singleton | min first-entry cells for nonsingleton | opposite pairs, min distance |
|---|---:|---:|---:|---:|---|
| split U=V=2,p=1,q=2,L=0 |20|4|4|4|4, 8|
| split U=V=2,p=q=2,L=0 |22|100|4|4|2500, 8|
| split U=2,V=4,p=2,q=3,L=1 (samples) |57|4|8|8|4, 48|
| hierarchy k=2,s=2 |15|4|—|6|none|
| hierarchy k=2,s=4 |21|4|—|10|none|
| hierarchy k=3,s=2 |18|8|—|9|none|
| hierarchy k=2,s=1 |12|4|4|—|3, 4 (not balanced)|
| plain parity k=2 |10|4|2|—|3, 2 (not balanced)|
| plain parity k=3 |11|8|3|—|7, 3 (not balanced)|

For the 2,500 opposite pairs at n=22, distances 8,12,16 have counts 24,528,1948. The L=1 samples are not exhaustive and do not establish its exact minimum. The hierarchy and plain parity masks are exhaustive within their stated constructions. The audit verifies analytic lemmas on explicit families, not all monoids. No GAP, Lean or GitHub CI. No errors observed in the final run.

## 7. Literature search and limits

Actual web searches in this session:
- finite semigroup Green lemma stability Green classes finite semigroup Donoven Mitchell Wilson maximal subsemigroups
- multiplication table oracle query complexity semigroup generating set Hamming distance finite semigroups
- Hamming distance between finite semigroup multiplication tables associative operations semigroups distance
- Hamming distance group multiplication tables Drápal minimum distance group tables

Consulted indexed excerpts of Drápal, [On distances of multiplication tables of groups](https://www.cambridge.org/core/books/abs/groups-st-andrews-1997-in-bath/on-distances-of-multiplication-tables-of-groups/760CD04B667B1A67CB1E169998576ED9), and [Hamming distances of groups and quasi-groups](https://www.sciencedirect.com/science/article/pii/S0012365X00002727). Hamming distances on labelled multiplication tables are established classical research, not novel here. Donoven, Mitchell, Wilson [Computing maximal subsemigroups of a finite semigroup](https://research-repository.st-andrews.ac.uk/handle/10023/17072) provides related Green-structural context; [On the Complexity of the Cayley Semigroup Membership Problem](https://doi.org/10.4230/LIPIcs.CCC.2018.25) concerns supplied-table membership. These searches did not identify the constrained opposite-emptiness separation or uniform-slot barrier in the inspected excerpts. No PDF or full-text review, no specialized database search; no historical priority claim. Prior sessions' search/execution records are not independently certified by this session. P03 remains PARTIAL_OVERLAP.

Next: abandon uniform singleton-fill for the next lower-construction attempt; investigate nonuniform slots with at least two singleton witness cells and at least four composite-entry cells, one readable label, and consistent fixed actions, or globally coupled configurations without isolated switches. If no improvement is obtained, study additional obstruction or resume statistical upper bounds. The goal 1/8 remains exploratory, global L=0 bounds unchanged. Do not merge or submit without authorization.
