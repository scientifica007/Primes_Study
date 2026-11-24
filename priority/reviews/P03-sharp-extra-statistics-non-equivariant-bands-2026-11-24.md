# P03: sharp coefficients with one, two and three extra generating coefficients
24 November 2026. Scientific-priority track only; no new T numbering, no main changes. Internal mathematical proof, not an externally refereed paper or historical priority certificate.

## 1. Main theorem and scope

Under the reduced side data D_red (and also the stronger D*) in the current manuscript, additionally supply the ordinary generating-set coefficients g_(r+j), 1<=j<=L. For each of exact deterministic emptiness and cardinality, adaptive or nonadaptive, the worst-case cost satisfies
\[
\lim_{n\to\infty}D_1(n)/n^2=1/24,\qquad
\lim_{n\to\infty}D_2(n)/n^2=\lim_{n\to\infty}D_3(n)/n^2=1/32.
\]
The lower bounds remain valid if the entire inclusion-minimal generating-set size enumerator H is additionally supplied. The L=0 result is unchanged. No sharp coefficient is asserted for L>=4, randomized algorithms, or labelled recovery of the whole E.

The previous [arithmetic threshold note](P03-arithmetic-statistical-thresholds-2026-11-24.md) and manuscript v1.7 proved the upper bound n²/(4s_L)+O_L(n^(5/3)) with s_1=6 and s_2=s_3=8. The new construction removes the divisibility constraint of the cyclic-unit action construction by making the unit action trivial and requiring row AND column coverage in the rectangular bands. Earlier rank/count formulas based on transitive unit actions must NOT be reused. This is the substantive improvement.

## 2. General non-equivariant rectangular-band construction

Fix U,V>=2 and p>=U,q>=V. Let G=C3 with identity e, A={[c,i]: c in [U], i in [p]}, B={[j,d]: j in [q], d in [V]}, and disjoint layers T_l=[u_l]×[v_l], where 1<=u_l<=U,1<=v_l<=V. Include absorbing z and K=union T_l plus z. Use arbitrary surjective maps alpha_l:[U]->[u_l], beta_l:[V]->[v_l]. They are maps of sets, not group homomorphisms. The test code uses zero-based remainders solely as surjections, not as homomorphisms. Each g in G acts trivially on all nonunits on both sides; multiply within G by its group law. Nonunit products other than the following are z:
\[
 a_{c,i}a_{c',i'}=a_{c,i'},\quad b_{j,d}b_{j',d'}=b_{j,d'},
\]
\[
 a_{c,i}b_{j,d}=t_{\ell,\alpha_\ell(c),\beta_\ell(d)}
 \quad\text{if }W_{ij}=\ell;\qquad
 a_{c,i}b_{j,d}=z\quad\text{if }W_{ij}=-1,
\]
\[
 a_{c,i}t_{\ell,c',d'}=t_{\ell,\alpha_\ell(c),d'},\quad
 t_{\ell,c',d'}b_{j,d}=t_{\ell,c',\beta_\ell(d)}.
\]
Here W is an arbitrary p-by-q array of labels or -1. All products inside K are z.

**Associativity.** For triples of nonunits not containing z, the only type strings capable of nonzero output are AAA, BBB, AAB, ABB, AAT, ATB and TBB, in either bracketing. AAA and BBB are rectangular band laws. For AAB both use the column of the second A, the row of B, and the surviving coordinates from the first A and B, with the same alpha,beta evaluations. ABB is the dual. AAT and TBB overwrite the same target coordinate in either bracketing; ATB overwrites two independent coordinates. All other type strings evaluate to z both ways. With one or more unit factors, the group action is trivial outside G and the group law is associative inside G; hence all remaining triples associate. The identity is e. No condition u_l divides U or v_l divides V is needed.

**Common structural data.** For a_{c,i}, its right ideal is its A row, the sets of target elements with first coordinate alpha_l(c) in every layer, and z; its left ideal is its A column and z. For b_{j,d}, its left ideal is its B column, all target elements with last coordinate beta_l(d), and z; its right ideal is its B row and z. For each target, its principal left/right ideals fix respectively its last/first coordinate within its layer and contain z, by surjectivity. The two-sided principal ideals of A and B are A union K and B union K, those of targets are T_l union {z}, those of z and of units are {z} and M respectively. Thus the nonzero targets are exactly separate nonregular J-classes of sizes u_l v_l (no target is regular, because T_l M T_l={z}); units, bands and z are regular. All these descriptions are independent of W. The only variable entries are A×B, and no proper principal two-sided ideal contains both factors. Therefore the quotient, K-factor products, all labelled ideals, unit actions, idempotents, regularity, and all proper principal-ideal internal tables are common. This proves identical D_red structural data and D* structural data, without equivariance.

## 3. Exact generating-subset characterization

A subset generates M by positive words iff:
- its G part generates G (equivalently contains one of the two nonidentity units);
- its A part meets every row AND every column of A;
- its B part meets every row AND every column of B;
- it meets each layer T_l whose label does not occur in W.

Necessity: only unit letters generate units; products yielding A (respectively B) have only A (B) and units as letters and the bands preserve the first row and last column; absence of a target label prevents a first-entry product from outside that layer. Sufficiency: band row/column cover generates each band by taking products of chosen representatives. A present target layer is entirely obtained from a W-position by surjectivity of alpha,beta; each absent layer can be generated from any one of its members by the A-left and B-right actions; z=ba for any a in A,b in B.

Since both dimensions of each band are >=2, no exterior element is indispensable: omit any one band cell and all rows and columns remain covered, and each unit can be omitted from a generating set of C3. The zero is generated by BA. For absent layers size>1 a different representative suffices; present layers need none. Consequently E consists exactly of the members of absent singleton layers.

Let F(w) and H_fix(w) enumerate, respectively, all generating subsets and inclusion-minimal generating subsets of the fixed exterior G,A,B, using the displayed conditions. For the bands these are polynomials for row/column covers and inclusion-minimal covers. They are independent of W; not all inclusion-minimal covers need have minimum cardinality. Let D=|K|, Z be the absent layers, b=|Z|, P=product_(l in Z) s_l, p_j=sum_(l in Z)s_l^j, s_l=|T_l|. Then
\[
G_M(w)=F(w)(1+w)^{D-p_1}\prod_{\ell\in Z}((1+w)^{s_\ell}-1),\qquad
H_M(w)=H_{\rm fix}(w)P w^b.
\]
For p>=U,q>=V, r=1+p+q+b. The leading exterior coefficient is 2 times the number of surjections [p]->[U] times the number of surjections [q]->[V], since a minimum cover chooses one cell per column of A and one per row of B. This replaces the previous power-of-two unit-action formula. Proof does not require computing the full exterior polynomials.

Thus b,P and the prescribed moments determine the matching low coefficients as in v1.7. For L<=3 this can also be seen directly: write x=log(1+w) and factor
\[
\prod_{\ell\in Z}(1-e^{-s_\ell x})=P x^b\prod_{\ell\in Z}\frac{1-e^{-s_\ell x}}{s_\ell x}.
\]
The logarithm of the normalized last factor is -p_1 x/2+p_2 x²/24+O(x⁴) (zero cubic term). This follows from the Taylor series at zero, or log(sinh(sx/2)/(sx/2)). The known factor F(w)(1+w)^D is common. Equal b,P,p1 imply equal r,g_r,g_(r+1) and full H; also equal p2 yields equal coefficients through g_(r+3). This argument is independent of the finite audit.

## 4. Matching promises and all-order limits

Let two disjoint lists of labelled layers have size multisets S+ and S- of equal length b, equal product, and equal prescribed moments, with S+ containing ones and S- having no ones. In each of the two promises exactly the labels of one list appear in W, each at least once, and all other free positions have -1. The absent list is the other one. The displayed formulas give identical r, all prescribed ordinary coefficients and full H, while E is empty in one case and nonempty in the other. Distinct labels remain distinct even if their layer sizes coincide. The common structural data proof applies.

Every new query either gives a fixed answer or reads one free W position, from which its label is uniquely decoded. For m free positions with m>=b, an all-zero transcript on at most m-b positions admits both completions by placing the b required labels on the remaining positions. Hence at least m-b+1 distinct positions must be queried in the deterministic worst case, even with all common side data. Conversely querying any m-b+1 positions reveals a nonzero label and its list, determining E emptiness and cardinality on the promise. The exact promised cost is m-b+1, adaptive and nonadaptive.

**L=1.** U=2,V=3. Take S+=(1,3,4,4), S-=(2,2,2,6). Common b=4,p1=12,P=48. Shape choices (1,1),(1,3),(2,2),(2,2),(1,2),(1,2),(1,2),(2,3). D=25 and n=2p+3q+28. For all sufficiently large n, choose q within bounded distance of (n-28)/6 with q congruent to n-28 modulo 2, then p=(n-28-3q)/2. Both are positive and meet p>=2,q>=3. Hence pq=n²/24-O(n), more precisely (n-28)²/24-O(1), and m=pq. Lower D1>=pq-3. Combined with the existing upper D1<=n²/24+O(n^(5/3)), this gives the ordinary limit 1/24.

**L=2,3.** U=2,V=4. Take S+=(1,3,3,3,4,4,8), S-=(2,2,2,2,6,6,6). Common b=7,p1=26,P=3456,p2=124. Shapes include (1,1),(1,3),(1,4),(2,4),(1,2),(2,3), all feasible. D=53 and base order n=2p+4q+56. For odd order add one singleton layer and fix W_(1,1) to its label in both cases; it is always present and leaves the missing-size lists unchanged. Write delta=n mod 2, n=2p+4q+56+delta, m=pq-delta. Choose q within bounded distance of (n-56-delta)/8 and p=(n-56-delta-4q)/2; both meet the required size inequalities eventually. Then pq=(n-56-delta)²/32-O(1) and the lower cost is pq-delta-6. Combined with the existing upper at s2=s3=8 gives ordinary limit 1/32 for both L. Padding introduces a common freely optional factor in the ordinary enumerator, not an extra obligatory generator.

Since the lower bound for emptiness holds with stronger side data, it transfers to reduced data and to counting. Since the upper bound for counting is nonadaptive, it applies to all four quantities. This proves the stated three matching limits.

## 5. General rectangle area and further lower bounds

Let a_L be the smallest U V (U,V>=2) such that the arithmetic count/prime-valuation/moment matrix has a rational kernel vector with nonzero singleton coordinate on sizes in {u v:1<=u<=U,1<=v<=V}. Scale to a signed integer vector and choose its sign so the first coordinate is positive; its positive and negative parts give the two balanced lists. This exactly characterizes the possible size multisets in this particular non-equivariant two-band scheme, not all monoid constructions. Clearly s_L<=a_L. Existence follows from the old power-of-two collision, using a sufficiently large rectangle.

For fixed L and one such rectangle, n=Up+Vq+constant. For all sufficiently large n, add delta fixed-present singleton layers, delta the residue modulo gcd(U,V) of n minus the constant (0<=delta<gcd(U,V)), reserve delta distinct slots, and choose a solution p,q with Up,Vq each within O_{U,V}(1) of half the remaining order. The solution exists by the elementary linear Diophantine equation: q ranges over a residue class modulo U/gcd(U,V); choose q nearest the balanced value. Thus D_L>=n²/(4a_L)-O_L(n) for every sufficiently large n. The additive constant can be extremely large due to the number and total sizes of the layers. This is an asymptotic bound, not a practical finite-order construction at those huge L.

Exact scan: [rectangular-statistical-area-audit.js](../experiments/rectangular-statistical-area-audit.js) restricts the previous exact integer matrix to the multiplication-table size set and enumerates increasing area, every factor pair U,V>=2 up to the first success. 77 rank/kernel equivalence checks, all pass. The output gives certificates with nonzero singleton coordinate, and exclusion of all smaller rectangle areas, for L=0,...,12. Results:
| L | s_L from prior exact audit | a_L new | upper | lower |
|---|---:|---:|---:|---:|
|0|4|4|1/16|1/16|
|1|6|6|1/24|1/24|
|2,3|8|8|1/32|1/32|
|4,5|9|10|1/36|1/40|
|6,7|10|12|1/40|1/48|
|8,9|12|14|1/48|1/56|
|10,11|14|15|1/56|1/60|
|12|15|18|1/60|1/72|

At L>=4 the interval is not closed. In particular a_L>s_L is an obstruction for this specific rectangle geometry, not a proof that either endpoint is the universal optimum. For L=4,5 the explicit size coefficient vector on (1,2,3,4,5,6,8,10) is (7,-33,36,4,5,-36,22,-5), b=74 and U=2,V=5. No table instantiated for L>=4 in this round; the lower bound follows analytically from the general construction and exact arithmetic certificates. The finite scan does not establish any formula for a_L beyond L=12.

## 6. Actual monoid verification

[non-equivariant-balanced-bands-audit.js](../experiments/non-equivariant-balanced-bands-audit.js) was executed before saving. Four cases:
|L|U,V|p,q|n|tables|r|g_r|g_(r+1)|g_(r+2)|g_(r+3)|promised cost|
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|
|1|2,3|2,3|41|14|10|1152|32256|-|-|3|
|1|2,3|3,3|43|20|11|3456|96768|-|-|6|
|3|2,4|2,4|76|18|14|331776|19243008|530233344|9344249856|2|
|3|2,4|2,4|77|16|14|331776|19574784|549476352|9874483200|1|

Totals: 68 tables, 17,761,130 associativity triples, 68 metadata comparisons, 132,208 exhaustive subsets of individual rectangular bands, 6,930 sampled full-monoid subset closure comparisons, 12 matching coefficient checks, 960 zero-transcript masks. PASS. The code computes full band cover and minimal-cover polynomials by exhaustive subset enumeration in these small bands; then multiplies exact BigInt polynomial factors. Full H is compared across opposite promises. The monoid tables are sampled rotations and dense patterns, not all W arrays; the full monoid generating subsets are sampled, not exhaustively enumerated. Zero-transcript masks verify both completions where at least b positions remain, not enumeration of randomized strategies. All-order limits and associativity for arbitrary W follow from proof, not samples. No external referee, Lean/GAP formal certification or CI claimed.

## 7. Priority evidence and limitations

Actually executed web searches this round: "semigroup two rectangular bands null ideal extension arbitrary surjections multiplication semigroup rectangular band"; "semigroup generating sets rectangular band row column cover minimal generating sets rank"; '"partitions with equal products" equal sum square Kelly'. Retrieved [Cherubini, Howie and Piochi, Rank and Status in Semigroup Theory](https://www.mate.polimi.it/wp-content/themes/mymate/send_new.php?file=553-P&tipo=1), PDF extracted 812 lines, title page and Theorem 5.1 on manuscript p.13 (lines 528–539). It records the classical rectangular-band multiplication and rank max of the side dimensions, ascribed to its earlier reference [5]. The row/column generation criterion follows immediately from that law; our exact cover polynomial and use of trivial unit action are established in the proof, not quoted as a novel classical rank theorem. Screenshot request for page index 12 failed with cache miss; text is sufficient and no image assistance needed now. Search also returned related null-extension and equal-product works (only search excerpts; not full comparisons). No matching sharp P03 L=1,2,3 theorem found in these limited results, but not an exhaustive priority search. Pin 2026 remains pending author copy; no new request to buy or claim of sent correspondence. Historical priority remains PARTIAL_OVERLAP. Next: examine whether the gap s_L<a_L for L>=4 can be bridged by a different geometry or a stronger upper bound, and review the proofs independently before public submission.
