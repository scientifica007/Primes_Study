# Divisor-closed stabilizers, terminal witness compression, and coefficient 59/250
24 November 2026. Internal continuation of [stabilizer witness localization](P03-stabilizer-witness-localization-quarter-bound-2026-11-24.md). No new T numbers, main modification, external referee or formal theorem prover. Historical priority unresolved.

## 1. Setting and results
Retain precisely D*, the nonempty compatible family (possibly restricted by T56 statistics), n=|M|, A=M\(G union K), a=|A|, a_reg, and c ambiguous singleton targets of the preceding note. For the emptiness decision, first stop if any exterior element is indispensable or if a fixed indispensable element exists. All following compression results requiring nonself exterior factorizations are conditional on the remaining case. They also recover the full E in that case, but the new uniform coefficient is asserted for emptiness (not full E recovery when exterior E is nonempty).

We prove:
1. For each ambiguous t, the two known stabilizers P_t and Q_t are divisor-closed and P_t intersect Q_t = G.
2. If xy=t and x=uv with both u,v nonunits, then vy=t; dually y=rs with both nonunits implies xr=t.
3. A finite directed graph on orbits of exterior L-classes under right unit action, and its dual on R-classes, gives terminal blocks of size >=2. For a localized class-pair fixed under the balanced unit action, all class pairs of its two selected terminal blocks preserve the t-witness implication. For nonfixed pairs a single representative per balanced orbit suffices.
4. Combining these compressions with the preceding localization and 5/16 graph bounds, an exact finite rational subdivision certificate proves
\[
 D_{\rm det}(M;D^*,\text{statistics})\le \frac{59}{250}n^2+4c
\]
for emptiness. Thus the global limsup upper coefficient is at most 59/250=0.236, without requiring the statistics. In particular at L=0 the interval is [1/16,59/250], ratio 3.776. The bound is not claimed sharp; the target 1/8 remains open. The proof of the coefficient uses an explicit reproducible computer-assisted inequality certificate, not a purely symbolic optimization. All new structural lemmas and the reduction to the inequality are proved analytically. Use the minimum with the previous finite bounds and actual localized query counts.

## 2. Stabilizers: divisor closure and disjointness
Recall from the preceding note that an ambiguous t is in K, nonregular, and has singleton J-class. P_t={u:ut=t} and Q_t={v:tv=t} are known submonoids disjoint from K, containing G, and every possible witness xy=t with x,y distinct from t has x in P_t, y in Q_t and both in A. Choose minimal nonempty right and left ideals I=eP_t and J'=Q_t f of the nonunit parts of these stabilizers, with e,f idempotent. The preceding localization lemma identifies them with ambient R(e), L(f), and every witness transfers to (ex)(yf)=t there.

If uv in P_t then u(vt)=t, hence vt J t by two-sided ideal monotonicity. Singleton J_t gives vt=t and then ut=t. Thus u,v in P_t. Dual for Q_t. This is divisor closure in the ambient monoid, not just within A.

Suppose p in P_t intersect Q_t is a nonunit. Then epP_t is a nonempty right ideal inside eP_t and hence equals it, so e belongs to MpM. Dually Q_t pf=Q_t f gives f in MpM. Thus the entire localized rectangle I×J' has both coordinates in the proper principal ideal MpM, whose multiplication is supplied. Localization would make the status of t fixed over the family, a contradiction. Hence P_t intersect Q_t=G. In particular its nonunit parts are disjoint. This stronger conclusion uses the supplied proper principal ideal tables, not merely the known actions on K.

## 3. Stripping nonunit factors and terminal blocks

Suppose xy=t is a nonself witness in some compatible table and x=uv with u,v nonunits. Since x outside K, u,v outside K, and divisor closure gives u,v in P_t. If vy is outside K, then it is a nonunit and u(vy)=t is a nonself witness, so vy in Q_t. Divisor closure gives v in Q_t, contradicting P_t intersect Q_t=G. Therefore vy in K. The known product u(vy)=t would be a fixed nonself witness in all compatible tables unless vy=t. Thus vy=t. The dual argument proves xr=t if y=rs with both r,s nonunits. All these factorization equalities outside K are supplied by the quotient. We need only the implication in the witness direction; do not assume equality of unknown multiplication values for all targets. Any query that reports an ambiguous t at exterior coordinates is itself a genuine witness.

Define the first-coordinate blocks as orbits of L-classes of A under right G action (equivalently unions of L-classes in each orbit). Right multiplication by a unit is a bijection preserving L-equivalence and J-class; the blocks partition A. The second-coordinate blocks are the dual orbits of R-classes under left G. In the first graph draw an arrow B->B' whenever x=uv is a known nonself factorization (u,v!=x), both factors nonunits, x in B and v in B' distinct from B. By x<=_L v and finite stability, a distinct destination block implies strict increase in J. This is a DAG. The second graph uses the first factor of a nonself factorization and is also a DAG. Choose a fixed path from each block to a sink block, depending only on the metadata; call such sinks terminal blocks. All vertices in the terminal blocks are exterior, but need not be regular.

Each terminal block has at least two elements, assuming no exterior indispensable element. Indeed if the first block of x is a singleton, then its L-class is singleton and right units fix x. Choose x=uv with both factors !=x. If v is a unit then u=xv^{-1}=x, impossible; if v is a nonunit and u is a unit then v=u^{-1}x L x, so v=x, impossible; if both are nonunits there is an arrow to a different block. Thus singleton blocks are not terminal. Dual for the second graph. This explicitly covers decompositions involving a unit on either side.

For a cell whose product is t, replacing the first factor within its L-class and the second within its R-class preserves t, by mutual divisibility of the products and singleton J_t. Balanced unit moves (x,y)->(xg,g^{-1}y) preserve the full product. The stripping lemma realizes arrows in either graph without changing the other coordinate, after selecting the required representative x or y in the current class. These are legitimate witness implications, not necessarily full-value recovery functions.

**Fixed-pair lemma.** Let L(x) be fixed by the right unit action, and R(y) by the left action. If xy=t, choose any terminal first and second blocks reached by the selected graph paths. Then every pair of elements from these two terminal blocks has product t. Proof: follow the first path using class changes and balanced unit moves to select the required source for each arrow. Every balanced move keeps the second coordinate within its original R-class, so after this path every phase (L-class and representative) of the terminal first block can be reached with the second coordinate still in the original R-class. Return the latter to any desired representative there. Next fix a path for the second coordinate, with specific class changes, units and stripping moves; the balanced unit moves on this path act on the first coordinate by a known composite unit, hence permute its terminal block. For any desired final first element, start this second path at its inverse image under that permutation. Select the final second element by class changes and a final unit move, included in the composite. All steps preserve a t-witness. The terminal paths and unit phases are available from D*, independent of actual responses. This argument justifies independent choice of representatives for fixed-fixed pairs; for general nonfixed source pairs the analogous independence is NOT asserted.

## 4. Counting the saving on pure types

Use the previous localization: one rectangle R(e)×L(f) for each t; compress L-first/R-second class pairs. Use alpha,beta,c_X,c_Y,c_0,c_B as in the preceding note. For h=max(alpha,beta)>=1, the uncompressed upper bound is alpha beta + c h. For h=0 the decision costs <=c and is trivial for the leading estimate.

Partition A into four disjoint sets:
- X: regular exterior elements with |L|=1, |R|>=2; x=|X|.
- Y: regular exterior elements with |R|=1, |L|>=2; y=|Y|.
- Z: regular exterior elements with |L|=|R|=2; z=|Z|.
- W: all remaining exterior elements, w=a-x-y-z. This includes nonregular elements, and regular elements of every other shape.
These sets are unions of ambient J-classes by Green's lemma and are invariant under unit actions. X contributes x to alpha and zero to beta; Y contributes y to beta; Z contributes z/2 to each. Remaining contributions alpha_W,beta_W are each <=w/2, and their sum is <=5w/6: if both class sizes >=2 but not both 2 then reciprocal sum <=1/2+1/3, and other uncounted shapes contribute zero. Hence
\[
 \alpha=x+z/2+\alpha_W,\quad \beta=y+z/2+\beta_W,\quad
 \alpha_W+\beta_W\le 5w/6.
\]

For all large-large localized rectangles, the pairs of classes are contained in the alpha by beta class-pair region. In Z×Z the total region has z²/4 class pairs. Any one localized rectangle contributing there has both side sizes two, so at most four cells; over c targets at most 4c such class pairs need querying. Replace the charge z²/4 by 4c (even when 4c is larger; the bound remains valid).

For the disjoint X×Y subregion, the first L-class and second R-class are singleton. Let b be the number of elements of X fixed by every right unit, d the number of elements of Y fixed by every left unit. The union of the large-large localized rectangles' possible class pairs is invariant under balanced unit moves: R(e) stable under right units, L(f) under left units, t-product unchanged. Nonfixed pairs in X×Y can be charged at most (xy-bd)/2 queries, since each orbit has >=2 distinct pairs. Fixed pairs number at most bd. Alternatively the fixed-pair lemma maps each fixed source coordinate into a selected terminal block. All b fixed singleton L-blocks in X are nonterminal and disjoint from all terminal first blocks, each of which has >=2 elements. Thus there are at most (a-b)/2 terminal first blocks, and at most (a-d)/2 terminal second blocks. Query a canonical pair for each combination of blocks reached by the selected fixed pairs. This suffices for every witness implication, and can introduce no false report of a t-witness (coordinates remain outside K). The alternative fixed-pair cost is at most (a-b)(a-d)/4. Take the minimum with direct queries. No assumption of disjoint support for different targets or rectangles.

So the saving relative to the xy charge is at least
\[
 xy/2+bd/2-\min\{bd,(a-b)(a-d)/4\}.
\]
Write u=bd. By b+d>=2sqrt(u), (a-b)(a-d)/4 <= (a-sqrt(u))²/4. For 0<=u<=a²/9 the latter is >=u, so the lower estimate for saving is (xy-u)/2. For u>=a²/9 it is xy/2+u/4+a sqrt(u)/2-a²/4, increasing in u. Also u<=xy. Thus the saving is at least max(0,xy-a²/9)/2. This establishes
\[
 D_{\rm det}\le h(\ell+c)-z^2/4+4c
                 -\tfrac12(xy-a^2/9)_+,\qquad \ell=\min(\alpha,\beta).
\]
The algorithm may query fewer cells than this charge; it suffices to recover all ambiguous singleton statuses in the nontrivial emptiness case. It treats small-side rectangles by the previous c h budget without claiming the extra compression for them. Even if the fixed-pair algorithm's selected queries overlap other regions, counting a union by their sum is valid.

## 5. Exact coefficient certificate

Normalize x,y,z,w,a by n in the following equations only; a=x+y+z+w<=1. Also c/n<=1-a. The expression alpha beta+c max(alpha,beta) is monotone in each nonnegative alpha,beta,c. In bounding it we can enlarge the normalized remaining contributions to have sum 5w/6 while each <=w/2, hence each >=w/3. Enlarge c/n to 1-a. Now T=(alpha+beta+c)/n is at most (and in this relaxation equals) 1-w/6. The larger normalized class count H satisfies H>=H_min=max(x,y)+z/2+w/3. Since H(T-H)=T²/4-(H-T/2)², it is bounded above by T²/4-(H_min-T/2)_+². Consequently define
\[
 F(x,y,z,w)=\frac{(1-w/6)^2}{4}
 -\big(\max(x,y)+z/2+w/3-(1-w/6)/2\big)_+^2
 -z^2/4-\tfrac12(xy-a^2/9)_+.
\]
The earlier 5/16 bound in a still applies, so
\[
 D_{\rm det}\le n^2\min\{5a^2/16,F(x,y,z,w)\}+4c
\]
with a normalized only in this display. The h=0 case D<=c is separately covered by the final bound.

**Certified inequality:** throughout the closed simplex x,y,z,w>=0, x+y+z+w<=1,
\[
 \min\{5a^2/16,F\}\le59/250.
\]
We supply a finite exact-arithmetic coverage proof in [terminal-compression-coefficient-certificate.js](../experiments/terminal-compression-coefficient-certificate.js). This is not a mesh sample or an approximate global optimizer. Let N=65536 and a box have lower and upper corners l,u in integer coordinates scaled by N. If sum(l)>N the box misses the simplex. Otherwise let A_hi=min(N,sum(u)). Then throughout that box intersected with the simplex the graph bound is <=5 A_hi²/(16N²). An upper bound for F, with denominator 144N², has integer numerator
\[
 (6N-l_w)^2
 -[12\max(l_x,l_y)+6l_z+5l_w-6N]_+^2
 -36l_z^2-8[9l_x l_y-A_{\rm hi}^2]_+.
\]
This follows from taking a maximum of the positive term and minima of each nonnegative subtracted term; all interval endpoint inequalities use nonnegative coordinates. A box is certified if either bound <=59/250 by cross multiplication. Otherwise bisect its widest coordinate at the integer midpoint (first coordinate wins ties). The initial box [0,N]^4 covers the simplex; the two closed children cover each parent; no uncertified box is discarded. The script aborts rather than asserting a result if an unresolved unit-width box is reached. BigInt exact arithmetic throughout the inequalities.

Actual executed certificate: 75,237 nodes, 37,618 splits, 26,681 leaves certified by F, 10,938 by the graph bound, no outside leaves, minimum child width 128 scaled units. The leaves count is 37,619=37,618+1; stack exhausted, PASS. Independently ran the same recurrence in Python integer arithmetic in the research session before the JavaScript certificate; same node/leaf counts at 59/250. The saved executable is the JS certificate. No approximate optimization is used as proof. This proves the asserted rational upper coefficient by a computer-assisted inequality argument. It does not find the optimum of the relaxation.

Return to unnormalized a,c: since c<=n, 4c/n² tends to zero uniformly as n increases. Therefore the limsup coefficient is <=59/250. At L=0 retain the lower 1/16; ratio (59/250)/(1/16)=3.776. The previous 1/4 bound may be better at finite n due to the additive term; always minimize. The new proof relies on the preceding 5/16 bound and localization theorem; no claim of independent formal certification of those earlier proofs.

## 6. Actual structural audit

[terminal-witness-compression-audit.js](../experiments/terminal-witness-compression-audit.js) extends the preceding audit. Tests 164 tables in eight explicit families, all 2,426,162 associativity triples and fixed metadata checked. One mixed-block family of 14 tables has known indispensable exterior elements: it is correctly excluded from terminal-compression tests (zero-query emptiness). The remaining 150 tables are tested for the new algorithm, 5,920 divisor-closure tests (per family reference table), 15,552 stripping implications, 464 independent terminal phase pairs, 52 terminal blocks counted across family graphs, 196 selected-cell compression implications, 1,088 witness-localization transfers, and complete E reconstruction after querying the union. PASS. These are finite families, not all monoids. The audit implements the fixed-pair and balanced orbit compression also for small-side rectangles; the general bound above deliberately uses the older budget for those.

| Family | tables | order | previous selected class pairs | compressed queries |
|---|---:|---:|---:|---:|
| fixed bottom / moving upper |16|18|4|4|
| hierarchy 1x1 |4|10|4|2|
| hierarchy 2x3 |4|16|4|2|
| hierarchy 5x6 + duplicates |4|32|4|2|
| mixed blocks |14|32|not tested|0 decision (exterior E)|
| four blocks |18|33|28|16|
| balanced two-sided L=0 |100|22|4|4|
| nonnull ideal |4|14|4|2|

The new fixed-bottom example has G=C4, two right-zero A layers and two left-zero B layers, each bottom of size 2 and each upper of size 4. Each upper parity orbit maps to one bottom element; lower layer has trivial unit action, upper has parity action. A products select the second factor, B the first, projected to the bottom whenever either input is bottom. AB labels depend only on the two bottom projections via any of 16 Boolean masks; BA=0, K={t,0} null, At=t=tB, all other nonunit cross products zero. This is associative by the semilattice band projection identities and the same AB compatibility, checked exhaustively. Bottom coordinates have nonself factorizations via upper providers despite being unit-fixed. Terminal blocks are upper pairs. All 16 masks tested, explicitly exercising the fixed-pair lemma. The four compressed queries are not claimed fewer than the four localized ones or optimal for every metadata restriction. No T56 statistics are fixed in this particular example. No GAP/Lean/CI run, no exhaustive enumeration of arbitrary monoids.

## 7. Priority and limitations
Actual web queries in this round: "finite semigroup Green relations stabilizer submonoids divisor closed submonoid minimal right ideal"; "semigroup multiplication table oracle query complexity indispensable generators finite monoid". Indexed excerpts of [Factorization theory in commutative monoids](https://doi.org/10.1007/s00233-019-10079-0) establish standard divisor-closed terminology in a different setting; [Semigroups whose right ideals are finitely generated](https://www.cambridge.org/core/journals/proceedings-of-the-edinburgh-mathematical-society/article/semigroups-whose-right-ideals-are-finitely-generated/112D2967022C2988DE83BC18CF48F153) discusses principal ideals and Green congruences; [On the Complexity of the Cayley Semigroup Membership Problem](https://doi.org/10.4230/LIPIcs.CCC.2018.25) studies membership with a supplied multiplication table, not this oracle decision model. No matching terminal compression or coefficient found in these limited indexed excerpts. No new full-text/PDF review or specialized bibliographic database search. Earlier notes record other searches; their execution is not independently verified by the current session, and this note does not retrospectively certify their search claims. Standard tools (Green stability, divisor closure, orbit actions, interval bounding) are not claimed novel. P03 remains PARTIAL_OVERLAP.

Next: try to strengthen the pure-type saving and the charge on mixed/small-side rectangles, or exploit statistical inference rather than recover every singleton. The explicit coefficient certificate isolates the remaining quantitative loss; it does not prove that 1/8 is achievable or that 59/250 is sharp. Do not merge or submit without authorization.
