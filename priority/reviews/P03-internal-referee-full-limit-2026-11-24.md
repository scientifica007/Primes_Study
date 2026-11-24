# Internal adversarial review of the sharp coefficient, weaker metadata, and full-limit extension
24 November 2026. Review of [sharp coefficient](P03-sharp-statistical-coefficient-one-sixteenth-2026-11-24.md), not an independent external referee report. Main untouched; no new T numbers. Historical priority unresolved.

## 1. Verdict and scope

Rechecked the actual dependency chain, not the entire P03 archive. No fatal defect found. The original limsup theorem survives this internal review. Two strengthening results:
1. The upper bound uses only the labelled Rees quotient and map, all products with a factor in K, labelled principal left and right ideals, and r and g_r (or r and H). Other D* data can be omitted or derived. The matching lower family has even the stronger D* fixed.
2. The limsup can be replaced by the ordinary limit across ALL sufficiently large integer orders, not merely the subsequence 4k+14. This follows from an odd-order padding construction that preserves the verdict and all prescribed L=0 statistics.

Write D_0(n) for worst-case deterministic optimal emptiness cost at order n in the stated model. For n>=23 let delta=n mod 2. Then
\[
 \left\lfloor (n-14-\delta)^2/16\right\rfloor-1-\delta
 \le D_0(n)\le n^2/16+O(n^{5/3}).
\]
Consequently lim D_0(n)/n²=1/16. This holds for adaptive/nonadaptive deterministic emptiness and cardinality, in both the original and reduced metadata model. No exact finite-n formula or randomized/full-labelled-E/L>=1 sharpness claim.

## 2. Adversarial dependency checklist

A. Definition E versus generation: t is dispensable iff M\{t} generates M by positive words, iff some xy=t has x,y !=t. Forward implication: in a shortest positive word for t with all letters different from t, take first prefix reaching t; its previous prefix and last letter are different from t. Reverse implication immediate. Therefore E is the intersection of all generating subsets. No empty word for identity allowed.

B. Class-local factorization: any word yielding a member of J uses only letters in J or strictly above J, by ideal monotonicity. Conversely descend the finite J-poset. Thus the local ordinary and inclusion-minimal enumerators multiply, and the global indispensable set is the union of local intersections. No assumption of a total J-order. In a nonregular J-class, products of two members fall strictly below J. Every member is obtainable from a given member by left/right multipliers strictly above J (or omitted identity); any hit from above implies full local generation. First-entry characterization follows by examining a binary multiplication tree. Hence each nonregular class contributes 1 or |C|w to H, and either (1+w)^|C| or (1+w)^|C|-1 to G. Reference: [general ideal factorization](P03-general-ideal-statistics-2026-11-24.md).

C. Regular interior class invariance: for a word with zero quotient value, its two translations on K are determined by known compositions. If z in K has same translations as an idempotent e in K, z²=ze=e²=e. If t regular in K, choose an idempotent e in its J-class with et=t (take inverse in K). Any z in K with same translations as t then has ez=t. If local generators yield all of J in one table, words for e and t, followed by this correction, yield t in all other tables. Exterior classes use the labelled nonzero quotient outputs. The proof does not claim that all individual word values or the subset of J generated from above are invariant. This is an important distinction; the earlier nonnull counterexample does not refute the actual theorem.

D. Arithmetic: with fixed contribution r_*, leading g^*_(r_*), and missing class count b and size product P, r=r_*+b and g_r=g^*_(r_*)P. H has leading coefficient equal to g_r because every minimum-cardinality generating set is inclusion-minimal. Thus r and g_r suffice. Remove fixed missing-class contributions if desired. For each size u, 1_{u=1}=1-Omega(u)+max(0,Omega(u)-1); sum over missing classes. No assumption that prime factors are distinct. No need to recover which singleton is absent. This makes all composite statuses sufficient for cardinality/emptiness. No inference that composite statuses alone determine the labelled E.

E. Exterior transport: if C is ambiguous, choose a missing table and a present table with xy=c first entry. Fixed labelled ideals give xr=c=ly with r,l in C, as any strictly higher factor would contradict missing status. All these products are known. If pc in C and px in K, then either px strictly above C (fixed first entry (px)y, impossible), or px in C ((px)r=pc, violating nonregularity). So px is exterior, and the dual argument holds. This proves direct witnesses for every d=pcq in C. It does not require a common table with ALL ambiguous classes absent, nor K null. See [transport](P03-nonuniform-common-witness-barrier-2026-11-24.md).

F. Minimal-J stabilizers: for fixed c, P_c,Q_c are known submonoids disjoint from K. Stability from xr=c and r J c gives r L c, hence uc=r and (xu)c=c with xu nonunit. Similarly vy belongs to Q_c. Choose nonunit idempotents e,f in minimal ambient J-classes in the respective stabilizers, using idempotent powers. Minimal means no strictly lower class, not least class. Then exu in P_c gives exu J e, ex R e by finite stability; similarly yf L f. (ex)(yf)=c. The witnesses are exterior and regular. The choices depend only on metadata, not responses. For d L c choose p,q with pc=d, qd=c; qpxu in P_c forces px J x, hence px L x. The resulting injection gives |L(x)|>=|L(c)|, dual on right. Green's lemma yields |L(c)||R(c)|=|C||H(c)|. No use of equality between ambient Green classes and stabilizer ideals. See [localization](P03-composite-regular-localization-one-twelfth-2026-11-24.md).

G. Representative queries: the output J-class is constant on each L(x)×R(y) by mutual divisibility of coordinates. Even if canonical representative does not belong to the chosen localization rectangle, it reports C iff the represented pair does. Retaining only cells that can produce the fixed c in some compatible table is legal because computation on the known fibre is free. One target has one chosen pair of ambient J-classes, not one query. Distinct target supports may overlap arbitrarily.

H. Threshold and graph: rectangles with both sides <B cost <=dB²; pairs having a first L-class or second R-class >=B cost <=2a_reg²/B; the remaining pairs live in X×Y, X×Z, Z×Y, with no edges within groups. The number of graph edges is <=d because each target chooses one ambient J-pair. Per-edge upper count is N_iN_j/(l_i r_j). Mass concentration in X and then Y only increases the relaxed quadratic function, holding fixed dimensions/edges. It need not preserve a realizable monoid or N<=lr for X,Y; that inequality is used only for Z, whose masses never change. If x→y absent, bipartite count immediate. Otherwise the factored inequality (l-s/rho)(r-s/lambda)>=0 and lambda rho>=s give sN/(lambda r)+sN/(l rho)<=N+s. Charge one distinct selected target per doubly incident Z vertex, because their incoming edges are distinct, and a target supplies at most one edge. Final product bound (a_reg+sd)²/(4s). No double-counting needed. sd<=|K| gives upper n²/(4s)+O(n^(5/3)) for fixed s. The proof is algebraic; synthetic graph checks do not establish realizability. No defect found.

I. Lower family: full associativity verified by the rectangular-band overwrite laws, null K and commuting unit translations; all labelled principal ideals fixed by target actions independently of labels W. Proper principal ideal tables omit AB; the quotient and K-products are fixed. Necessity/sufficiency of generating choices follow by closure of complements of obligatory columns, rows, missing target layers and group generators. The promised missing patterns (1,4) and (2,2) have equal count and product; positive-word group generation requires a generator of C4. All inclusion-minimal choices consist of one of two unit generators, one representative per A column/B row, one per absent layer. E-empty iff singleton present. Adversarial zero transcript until at most one free position remains gives the lower query cost even with strong D*. No reliance on full fibre equality, only inclusion of promise. Fresh independent generation-set enumeration below confirms the smallest balanced example. See [split construction](P03-two-sided-target-orbits-matching-2026-11-24.md).

## 3. Reduced side data theorem

Define D_red as labelled carrier, labelled proper nonempty ideal K, full labelled Rees quotient and quotient map, all products with a factor in K, and labelled principal left and right ideals. Supply r and g_r, or r and H. All these data are included in D*.

The two-sided principal ideal MxM is the union of principal right ideals yM for y in Mx. Thus J-order, L/R/J/H classes and their sizes are known. Units are exactly x with xM=M in a finite monoid (a right inverse implies invertibility). Regularity of x outside K follows from the nonzero quotient: an inner inverse equation xux=x is equivalent to the corresponding equation with nonzero quotient output. For x in K it can be checked with all supplied K-products. Idempotence likewise follows from the quotient for exterior elements and known multiplication for K. These facts do not require the separate unit-action metadata (indeed nonzero unit actions follow from quotient, others supplied via K).

Steps A–H use just D_red. The proof does not query or inspect internal multiplication tables of proper principal ideals. This is a genuine removal of a side-data assumption for the upper theorem, not a claim that all such tables are derivable. The original lower family has common stronger D* and thus common D_red. Therefore the same sharp coefficient holds for this reduced model. No claim for omission of labelled principal ideals or K-actions. Computational preprocessing may still be exponential.

## 4. All integer orders: ordinary limit

For even n use U=V=2, G=C4 and p,q with n=2(p+q)+14, p=floor((n-14)/4), q=ceil((n-14)/4). For sufficiently large n, p,q>=1 and pq>=2. The promised cost pq-1 and common statistics are as above.

For odd n augment the target palette of the same split construction by one extra singleton t_* (u_*=v_*=1). Its K-actions use the same formula as the existing singleton; internally K remains null. Force one designated array position (say (1,1)) to have label t_*, and require that the remaining positions contain exactly the two labels of one original promise list, each at least once, or absorbing-zero entries. This restriction is known as a promise. Since the split construction proof applies to every palette whose layer sizes divide 4, the added singleton changes neither associativity nor independence of side metadata. It is always present, hence adds no obligatory generator and no indispensable element. The two missing patterns remain identical to the original. With fixed p,q, r=1+p+q+2, h_r=g_r=2^(p+q+3), other H coefficients zero; labels in the fixed slot are identical across both verdicts. Thus n=2(p+q)+15 and exact promised cost pq-2: there are pq-1 free positions and two required labels, and the all-zero transcript of at most pq-3 free queries admits either verdict. Scan free positions to attain this cost. Fixed slot queries do not help. For odd n>=23, choose p=floor((n-15)/4), q=ceil((n-15)/4), so pq>=3. The lower cost can be rewritten as the displayed floor formula with delta=n mod 2. Since it is n²/16-O(n), squeezing with the uniform upper proves the ordinary limit. Cardinality and nonadaptive deterministic tasks share it by containment and the earlier nonadaptive upper.

This extension replaces the earlier carefully qualified limsup-only statement; it is not a correction of an invalid previous theorem, but an additional construction.

## 5. Fresh independent code and actual results

[Independent C++ enumerator](../experiments/independent-generation-enumerator-audit.cpp) written anew, compiled and run with g++ -O3 -std=c++17. It computes subset closures by adding a letter to the already closed smaller subset, saturating all left/right products with newly discovered elements until no change; it does not use Green-based generating formulas. It enumerates every nonempty subset of 5 labelled order-20 tables, including the all-zero baseline, and counts minimum-cardinality and inclusion-minimal generating subsets by explicit deletion tests. It also verifies the equivalence defining E, all labelled ideals, fixed metadata, regularity/idempotence and associativity. Exact output:
| W | rank | g_r | H | |E| |
|---|---:|---:|---|---:|
| -1,-1 |8|256|256 w^8|1|
| 0,1 |6|64|64 w^6|0|
| 1,0 |6|64|64 w^6|0|
| 2,3 |6|64|64 w^6|1|
| 3,2 |6|64|64 w^6|1|

5,242,875 nonempty subset closures; 40,000 associativity triples; PASS. Labels 0,1 are singleton/size4, 2,3 size2 layers, -1 absorbing zero. This is independent implementation, not independent human review. Empty set excluded by positive-word convention.

[All-orders padding audit](../experiments/all-orders-padding-audit.js) independently enumerates all promise arrays for p,q,pad=(1,2,0),(2,2,0),(2,2,1),(2,3,1); verifies actual table associativity, all labelled principal ideals, fixed products and quotient, E and the missing count/product; exact minimax decision-tree recursion on label arrays.
| n | tables | exact promised cost |
|---:|---:|---:|
|20|4|1|
|22|100|3|
|23|24|2|
|25|360|4|
Total 488 tables, 7,013,808 associativity triples, PASS. The odd-order H formula is analytic; no exhaustive generation-subset enumeration for odd orders claimed. No GAP/Lean/CI. No all-monoid enumeration. The earlier sharp-graph audit's lack of realized double-role examples remains a limitation, not a logical gap.

## 6. Verified reference ledger and integrity correction

This turn actually executed four fast search records and two slow search records via web search. The following indexed records were retrieved and checked for their stated scope (no full PDFs analyzed):
- Robert D. Gray, [The minimal number of generators of a finite semigroup](https://arxiv.org/abs/1307.8280), [university publication record](https://research-portal.uea.ac.uk/en/publications/the-minimal-number-of-generators-of-a-finite-semigroup/), 2014, Semigroup Forum 89. Rank computation, not the specific missing-table query model.
- Donoven, Mitchell, Wilson, [Computing maximal subsemigroups of a finite semigroup](https://research-repository.st-andrews.ac.uk/handle/10023/17072), 2018. Algorithms from Green structure and subgroup information; relevant to local generation/class decomposition.
- East and Higgins, [Green's relations and stability for subsemigroups](https://arxiv.org/abs/1906.02313). Inheritance and stability of Green relations, classical tools.
- Lukas Fleischer, [The Cayley Semigroup Membership Problem](https://www.theoryofcomputing.org/articles/v018a008/), 2022 (preliminary 2018 DOI 10.4230/LIPIcs.CCC.2018.25). Given a table and subset, test membership. Different complexity measure.
- [Computing finite semigroups](https://doi.org/10.1016/j.jsc.2018.01.002), DOI and title verified; computes semigroups from generating representations and Green structure.
- [Hardness of learning loops, monoids, and semirings](https://www.sciencedirect.com/science/article/pii/S0166218X13003533). A particularly relevant neighboring oracle-table learning problem; full-table recovery rather than the decision with supplied metadata/statistics. Requires full-text comparison before priority claim.
- Lee and Santha, [The quantum query complexity of the semigroup product problem](https://arxiv.org/abs/2609.39974), abstract dated 30 Sep 2026. Table given, queries to word letters, not table-cell queries.

The retrieved indexed results do not establish priority of the new theorem; no full-text review or specialized bibliographic database query was carried out. Earlier notes, including the immediately preceding sharp-coefficient note, claimed specific prior web searches whose execution is not established by the accessible tool record. Those claims are not verified and must not be represented as executed research or absence-of-match evidence. This ledger supersedes such assertions for these seven sources. This is an explicit correction, not a retrospective claim that previously stated searches did occur. P03 historical priority remains PARTIAL_OVERLAP, with a close oracle-learning literature lead to examine.

## 7. Referee-style recommendation

Internal mathematical verdict: retain the coefficient theorem; strengthen to ordinary limit and reduced metadata as above. External status: not yet submission-ready. Prepare a self-contained manuscript with exact model, proofs A–I, all-order extension, reproducible code, and distinguish rank from inclusion-minimal cardinality; avoid claiming running-time complexity or historical novelty. Seek external independent review. No merge or submission authorized.
