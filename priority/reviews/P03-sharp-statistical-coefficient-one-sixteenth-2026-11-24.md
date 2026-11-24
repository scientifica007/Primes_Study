# Sharp statistical query coefficient 1/16 at L=0
24 November 2026. Continuation of [minimal-J regular localization](P03-composite-regular-localization-one-twelfth-2026-11-24.md) and [two-sided lower construction](P03-two-sided-target-orbits-matching-2026-11-24.md). Internal mathematical result; no external referee or formal proof verification. No new T numbers or main modification. Historical priority unresolved.

## 1. Main theorem

Use exactly the finite labelled monoid model D*, positive-word generation, designated nonempty proper ideal K, group of units G, A=M\(G union K), n=|M|, a_reg=|A_reg|. The compatible family is nonempty, with common supplied metadata, possibly restricted by statistics. Computation (including enumerating compatible tables) is free; only multiplication-cell queries count.

For a selected collection of d ambiguous nonregular interior J-classes of sizes at least an integer s>=1, their presence statuses can be recovered nonadaptively in at most
\[
 D_s\le\frac{(a_{\rm reg}+sd)^2}{4s}+dB^2+\frac{2a_{\rm reg}^2}{B}
\]
queries for every integer B>=2. Since the selected classes are disjoint subsets of K, sd<=|K|, hence a_reg+sd<=n. With B=max(2,ceil(n^(1/3))), the uniform bound is n²/(4s)+O(n^(5/3)) for fixed s. This is a size-restricted recovery theorem without generating statistics.

With the known rank and H or g_r, the composite-only arithmetic inference requires only ambiguous classes of composite sizes, so take s=4. It follows that
\[
 D_{\rm det}\le n^2/16+O(n^{5/3}).
\]
This determines emptiness and cardinality of E (not necessarily its complete labelled set). It holds for every L>=0 of T56, since only L=0 statistics are used. In conjunction with the existing lower construction, the global worst-case deterministic limsup coefficient at L=0 is EXACTLY 1/16. No assertion of equality at every finite n, of a limit rather than limsup, or of sharpness for L>=1. This upper bound uses statistical side information; without it the earlier 2/9 bound remains valid (and the present theorem gives 1/4 by taking s=1). This is an asymptotic optimality theorem within the stated information model, not a general bound for arbitrary presentations of monoids.

## 2. Reduction to a graph of ambient J-classes

Use the prior localization/size-domination theorem: for each selected ambiguous C choose c in C and exterior regular idempotents e,f with minimal ambient J in its left/right stabilizers. A witness of c exists in R(e)×L(f) iff C is present. Retain cells that can report c in some compatible table. Every retained cell (x,y) has |L(x)| |R(y)|>=|C|>=s. Query one representative of each distinct pair (L(x),R(y)), taking the union across selected targets; their output J-class is invariant across each Cartesian product of such classes. This determines all chosen class statuses. All these selections depend only on supplied data.

As in the one-twelfth note, split the retained query pairs:
- Pay at most dB² for the selected rectangles whose two sides R(e),L(f) are smaller than B.
- Pay at most 2a_reg²/B for pairs having |L(x)|>=B or |R(y)|>=B (at most a_reg/B classes of either kind, paired with at most a_reg other classes).
- The remaining pairs lie in X×Y, X×Z, Z×Y, with X regular elements having |R|>=B, |L|<B; Y having |L|>=B, |R|<B; Z having both <B. They are disjoint unions of J-classes. Any pair retained in the last step can be paid once there, regardless of overlaps in the first two categories.

The new step is to preserve the individual J-classes rather than combine their masses immediately. For each exterior regular J-class J_i, let
\[
 N_i=|J_i|,\quad l_i=|\mathcal L(x)|,\quad r_i=|\mathcal R(x)|,\quad h_i=|\mathcal H(x)|\quad(x\in J_i).
\]
By Green's lemma these numbers are independent of x in J_i and N_i=l_i r_i/h_i. In particular N_i<=l_i r_i. The number of distinct pairs of L-classes from J_i and R-classes from J_j is (N_i/l_i)(N_j/r_j).

Define a simple directed graph on the J-classes in the three groups X,Y,Z. Add edge i->j exactly if at least one remaining query pair in J_i×J_j is selected. Every edge is from X to Y, X to Z or Z to Y. It satisfies l_i r_j>=s. Importantly, a selected target C produces only ONE ordered pair (J_e,J_f) of ambient J-classes, because every coordinate of its chosen localization rectangle remains in that pair. So the number of distinct edges is <=d, regardless of overlap or the number of query representatives per edge. This is the target-resource constraint missing from the previous three-region estimate.

The remaining query count Q is at most
\[
 F=\sum_{i\to j}\frac{N_i N_j}{l_i r_j}.
\]
This is an upper relaxation: some class-pairs on an edge need not be possible witnesses.

## 3. Weighted three-region lemma with target resources

For any three disjoint finite vertex sets X,Y,Z, with masses N_i>=0, positive dimensions l_i,r_i and N_i<=l_i r_i for vertices in Z, let E be a directed edge set contained in X×Y union X×Z union Z×Y, with l_i r_j>=s on each edge. Then
\[
 \boxed{\sum_{i\to j}\frac{N_i N_j}{l_i r_j}\le
 \frac{(\sum_i N_i+s|E|)^2}{4s}.}
\]
No assumption of realization as a semigroup is used in this lemma.

Proof. Keep all dimensions and edges fixed. Holding the Y,Z masses fixed, F is a linear function of the X masses, since there are no edges within X. Transfer the total X mass to a single vertex x with largest linear coefficient. This cannot decrease F. Next transfer all Y mass to a single y with largest coefficient after the first transfer. Again F does not decrease. These are algebraic relaxations, not operations that change a monoid or preserve actual Green-size identities on X/Y. The Z masses are unchanged, so N_i<=l_i r_i remains valid where used. If either group is empty, interpret its mass as zero. Let U,V be the concentrated masses.

If x->y is absent (including an empty group), each remaining edge has one endpoint in Z, one in {x,y}, and weight <=1/s. Thus F<= (U+V) sum_Z N_i/s <= (sum N_i)^2/(4s). This covers all such cases.

Otherwise put lambda=l_x, rho=r_y, so lambda rho>=s. For a Z vertex i write l=l_i,r=r_i,N=N_i. If it is incident to neither remaining edge, omit it. If just one of x->i or i->y is present, its contribution is at most N max(U,V)/s.

If both edges are present, then lambda r>=s and l rho>=s. By expanding a nonnegative product,
\[
 (l-s/\rho)(r-s/\lambda)\ge0,
\]
and since s²/(lambda rho)<=s, we obtain
\[
 s(l/\lambda+r/\rho)\le lr+s .
\]
Consequently
\[
 \frac{sN}{\lambda r}+\frac{sN}{l\rho}\le N+s .
\]
Indeed multiply the preceding inequality by N/(lr), and use N<=lr. Thus the two-edge contribution satisfies
\[
 N\left(\frac{U}{\lambda r}+\frac{V}{l\rho}\right)
 \le\frac{(N+s)\max(U,V)}s.
\]
We have added s resource units for each doubly incident Z vertex. These vertices are distinct and each uses an incoming edge distinct from those for all other such vertices. Therefore their number is <=|E|. In the actual model one can charge a distinct selected target for each such vertex, whose size is at least s. It is not necessary that different edges have disjoint cell supports; the graph has distinct endpoint pairs, and a target contributes only one pair.

Let W be the sum of Z masses with this surcharge on doubly incident vertices. Then U+V+W<=sum N_i+s|E|. Also the edge x->y contributes <=UV/s. So
\[
 F\le (UV+W\max(U,V))/s
 = \max(U,V)(\min(U,V)+W)/s
 \le (U+V+W)^2/(4s).
\]
The last inequality is the elementary product bound for nonnegative summands. This proves the lemma. No numerical maximization, discretization, or assumption of equal dimensions is required. Notice that the earlier triangle bound 1/(3s) failed to use the number of targets; the surcharge makes the effective optimization bipartite.

## 4. Finite and asymptotic upper bounds

Apply the lemma to Section 2. Sum_i N_i<=a_reg and |E|<=d. Thus Q<=(a_reg+sd)^2/(4s). Adding the two discarded categories gives the main finite bound. Since sd<=|K|, a_reg+sd<=n. For fixed s, d<=n/s and B of cube-root order give a uniform O(n^(5/3)) remainder. Use the minimum of this estimate, the older bound a_reg²/(3s)+dB²+2a_reg²/B, and actual representative counts for finite instances.

For rank and g_r or H, the previous identity
\[
 m_1=b-\Omega(P)+\sum_{C\ {\rm missing}}\max(0,\Omega(|C|)-1)
\]
determines missing singleton multiplicity solely from statuses of composite-size ambiguous classes after fixed contributions have been removed. Every such class has size >=4. Taking s=4 gives D_det<=n²/16+O(n^(5/3)). Also |E| is recoverable by adding known fixed indispensable contributions. This is a nonadaptive algorithm; thus adaptive algorithms cannot have a worse optimum. No assumption of exterior E empty is needed for localization or the weighted count. For the decision task a known fixed indispensable element permits immediate termination.

If the smallest ambiguous composite size is >=s0, the same theorem gives the sharper restricted coefficient 1/(4s0); if none exists, zero queries. E.g. without ambiguous size-four classes, s0>=6 and the upper coefficient is 1/24, improving the previous 1/18. This does not yet optimize the weight choice for L>=1.

## 5. Matching lower coefficient at L=0

Recall the [split construction](P03-two-sided-target-orbits-matching-2026-11-24.md): U=V=2, p=q=k, unit group C4, two exterior bands of sizes 2k each, four nonregular target layers of sizes 1,4,2,2 and absorbing zero. The order is n_k=4k+14. In its unbalanced structural fibre, a k×k label array controls the AB products, each label constant over the corresponding 2×2 rectangle with appropriate target coordinates. For the balanced promise, exactly two distinct labels of one of the two lists (1,4) or (2,2) occur; other entries may be zero. The two missing patterns have count 2 and product 4. Common metadata D* and rank r=2k+3, H concentrated in degree r with h_r=g_r=2^(2k+3) hold by the preceding construction proof. E is empty exactly when the singleton layer occurs.

Each query reveals at most one label; reading a chosen cell of its rectangle reveals that label. A zero transcript on at most k²−2 distinct positions admits either promise case by placing its two labels at two unqueried positions. Conversely k²−1 position queries necessarily find a nonzero label, whose list decides the answer. Thus exact promised cost k²−1 (k>=2). This adversarial argument remains valid for the larger compatible fibre because the promised inputs belong to it. Therefore, writing D_0(n) for the worst-case optimal deterministic decision cost over allowed D*/L=0 fibres of order n,
\[
 \limsup_{n\to\infty} D_0(n)/n^2
 \ge \lim_{k\to\infty}\frac{k^2-1}{(4k+14)^2}=\frac1{16}.
\]
The uniform upper gives the opposite inequality. Consequently
\[
 \boxed{C_0:=\limsup_{n\to\infty}D_0(n)/n^2=1/16.}
\]
This is the exact leading limsup coefficient, not a finite-n equality or a proof that the ordinary limit exists. Since the upper algorithm recovers cardinality as well, and cardinality recovery implies emptiness, the same sharp coefficient holds for deterministic cardinality recovery in the L=0 model. It holds also for nonadaptive deterministic decision/cardinality because the upper algorithm is nonadaptive and the lower applies even adaptively. No corresponding randomized, quantum, full labelled E, or L>=1 sharpness claim.

## 6. Verification executed in this round

[sharp-statistical-coefficient-audit.js](../experiments/sharp-statistical-coefficient-audit.js) extends the previous localization audit. Actual run:
- Same 148 explicit tables in 11 families, 2,261,000 associativity triples, 17,824 localization transfers, 7,692 Green-size inequalities, 148 status/cardinality reconstructions.
- 355 new graph/finite-bound checks (thresholds as available, five size thresholds s=1,2,4,6,8), six retained graph-edge occurrences. These small monoid families do NOT exercise a doubly incident Z vertex after concentration (zero such charges).
- Independent abstract audit: 119,465 eligible dimension quadruples with 1<=l,r,lambda,rho<=12 and s in {1,2,4,6,8,9,12}, checking the factored inequality exactly at N=lr. 10,000 deterministic pseudorandom abstract graphs, 11,098 double-role charges after concentration, exact BigInt common-denominator objective comparisons and resource inequalities. All PASS. These graphs are a combinatorial relaxation, not claimed realizable by actual monoids.
- The proof is symbolic; no inference of universal truth from these samples. No new exhaustive enumeration of arbitrary monoids or generating subsets. No GAP/Lean/CI or independent referee. The very sparse graph-edge test on the small monoids is disclosed rather than treated as strong empirical coverage of the new step.

## 7. Literature and record integrity

Actual web searches in THIS round (three broad fast queries and two targeted slow queries):
- finite semigroup multiplication table oracle query complexity indispensable generators fixed generating rank;
- finite semigroup Green relations stability Green lemma regular J class cardinality;
- weighted graph quadratic optimization Motzkin Straus theorem weighted triangle;
- semigroup multiplication table oracle query complexity rank generating sets indispensable elements finite monoids;
- semigroup multiplication table partial information query complexity minimal generators semigroup generation.

Consulted indexed abstracts/excerpts, not full PDFs: Robert D. Gray, [The minimal number of generators of a finite semigroup](https://doi.org/10.1007/s00233-013-9521-8), Semigroup Forum 89 (2014), 135–154; [On the Complexity of the Cayley Semigroup Membership Problem](https://doi.org/10.4230/LIPIcs.CCC.2018.25), supplied-table membership; Lee and Santha, [The quantum query complexity of the semigroup product problem](https://arxiv.org/abs/2609.39974), 30 September 2026, queries word letters with known table; [On standard quadratic programs with exact and inexact doubly nonnegative relaxations](https://doi.org/10.1007/s10107-020-01611-0), related standard quadratic programming and clique methods. Indexed Green-stability references also surfaced, including East–Higgins. Linear concentration within an independent set is a classical optimization technique (related to Motzkin–Straus), not claimed new. The particular Green-dimension inequality with target-resource surcharge and matching oracle coefficient are the internal deductions here. No exact match located in this limited search. No specialized MathSciNet/zbMATH review, no full-text analysis, no historical priority claim.

Integrity qualification: prior P03 notes contain assertions that web searches were executed, with specific references. The accessible execution record for several earlier rounds does not verify those assertions. They must be treated as unverified bibliographic leads, NOT completed searches or evidence of absence of prior work. This round's actual search results establish only the limited scope just stated. This qualification applies to the historical-priority record, not to the actual saved mathematical proofs or executed JavaScript audits. Before external circulation, consolidate a source-by-source verified literature ledger. P03 remains PARTIAL_OVERLAP; mathematical sharpness is distinct from historical novelty.

Next: do not keep trying to lower the L=0 deterministic coefficient under the unchanged assumptions; the matching bound is proved internally. Prioritize adversarial independent proof review of the whole dependency chain (regular-class invariance, exterior transport, minimal-J localization, composite inference, weighted graph bound and lower construction), consolidation into a self-contained manuscript, and verified literature comparison. Further mathematical directions include finite-size sharp bounds, stronger L>=1 statistics, randomized complexity, and less generous side data. Do not merge or submit without authorization.
