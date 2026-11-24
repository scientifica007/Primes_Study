# P03: grouped exits and strict separation of decision from counting at L=4,5
24 November 2026. Internal mathematical research; no external review, main changes, or T numbers. No new source-retrieval or priority claim in this round. This note builds on the v1.10 local compression and v1.11 size-domination proof.

## 1. Result
Write D_L for exact deterministic emptiness decision and C_L for exact cardinality, under D_red or D*. The new result is
\[
1/40\le\liminf D_L(n)/n^2\le\limsup D_L(n)/n^2
\le\gamma<1/36=\lim C_L(n)/n^2,\quad L=4,5.
\]
This covers adaptive and nonadaptive deterministic algorithms separately. One explicit (very conservative) choice is
\[
\gamma=(1-2^{-32})^2/36.
\]
A stronger bound holds on sequences with |K|=o(n): the constructed decision algorithm costs at most (5/189+o(1))n². The universal optimum remains unknown; the tiny explicit strict gap is not claimed to be a good estimate of it. The lower bound 1/40 and sharp count coefficient 1/36 are inherited from v1.8 and v1.9, not new lower bounds here.

## 2. Grouped exits: simultaneous target presence

Suppose there is no indispensable element outside K (otherwise emptiness is decided from the supplied data). Fix a regular exterior J-class J and let Y be one representative per R-class in J, q=|Y|. Let X be a union of any regular exterior nonunit J-classes I of singleton L-classes and |I|>=2, of total size P. Each I is a right-zero band. The targets under consideration are any collection of nonregular interior classes surviving the v1.4 pretests with canonical left endpoint in X and canonical right endpoint J. X may include additional classes not assigned to any target.

For each x in X use the v1.10 factorization x=a_x t_x, where a_x differs from x in J(x) and t_x is strictly above J(x). It exists by exterior dispensability; all such factorizations can be found from the quotient. For clarity: choose a nonself product x=uv. Stability would imply v=x if v J x, since L(x) is singleton. Thus J_v>J_x. With e in J(x) different from x, ex=x and e u v=x, so eu J x. If eu!=x take a_x=eu,t_x=v. Otherwise u is strictly above J(x) (if u were in J(x), eu=u would imply u=x), and take a_x=e,t_x=u. Unit factors may be preferred but are not required.

Build a directed functional graph on X×Y, using only the nonzero quotient to classify t_xy. For every vertex (x,y):
- if t_xy is exterior in J, link to (a_x, representative_R(t_xy)). Associativity and the Green class-pair identity give equality of output J-classes;
- if t_xy is exterior strictly below J, discard it as irrelevant to all assigned targets, by the v1.10 right-localization argument: if a_x(t_xy) is a first-entry witness for C, transport to the chosen member of C, then localize the right coordinate into J; that coordinate is a right multiple of t_xy, contradicting strict descent;
- if t_xy is in K and t_x belongs to X, link to (t_x,y) within the union;
- if t_xy is in K and t_x is outside X, use an exit query at (representative_L(t_x),y).

For the last two cases, if the original output belongs to an assigned C, so does t_xy: it cannot be strictly below or incomparable to C by monotonicity, and a strictly higher K output would give a known first-entry witness a_x(t_xy), excluded by the pretests. The reverse implication is not needed. Each query reporting C is a genuine first-entry witness since both coordinates are exterior. All internal edges change the first coordinate, so cycles have at least two vertices. Thus query one vertex per cycle and all distinct exits; discarded vertices cannot carry a target witness. Forward propagation for each target proves that this detects every assigned target's presence, simultaneously. Since distinct exits use at least one source vertex each, cycles use at least two disjoint vertices, and the number of exit positions is at most hq, where h counts distinct L-classes of selected nonunit factors t_x outside X, the cost is
\[
\kappa\le\min(Pq,(P+h)q/2).
\]
The first alternative is to query all union vertices. All choices use structural metadata; nonadaptive. The dual holds for singleton R endpoints. No independence assumptions between blocks; even upward internal edges need only forward witness implication, not equality. Enlarging X allows sharing factors across classes and across assigned targets.

## 3. Refined surcharge: a large ideal precludes saturation

In the original Lemma 6 concentration proof, each doubly incident Z vertex requires TWO distinct edges (x,z) and (z,y). No such edge serves another doubly incident Z vertex. Thus the surcharge s per double vertex is at most s|F|/2 rather than s|F|. The same proof yields
\[
\sum_{ij\in F}N_iN_j/(l_i r_j)\le(\sum_i N_i+s|F|/2)^2/(4s)
\]
under the original hypotheses. Apply Theorem 7 with s=9 to the sufficient plan for sizes 9 and >=10 at L=4,5; the omitted rectangles and large L/R classes cost O(n^(5/3)) as before. With a the number of exterior regular nonunits, d selected targets, 9d<=|K|, the remaining mass plus surcharge is at most a+9d/2<=n-|K|/2. Therefore
\[
D_L(n;\mathrm{metadata})\le (n-|K|/2)^2/36+O(n^{5/3}).
\]
This bound is uniform in metadata and valid for count as well; the small-ideal improvement next uses exterior dispensability. In particular any sequence saturating 1/36 must have |K|/n tending to zero.

## 4. Small-ideal algorithm: partition all exterior regular elements

Use the two sufficient plans for sizes 8 or 9 together with all sizes >=10 (v1.9-1.10). Pretests and E_* are computed from supplied data. Early return for nonempty E_*. Let B be an integer >9. Pay at most 2n²/B queries for all canonical pairs with first L-size or second R-size at least B, since there are at most n/B classes of each large type. Partition ALL regular exterior nonunits by their dimensions into X (r>=B,l<B), Y (l>=B,r<B), Z (both below B), and both-large (already excluded as endpoints). These are sets of ambient J-classes; denote their total element masses by X,Y as well, and put R=n-X-Y (including other exterior elements, K, units and Z).

The number of distinct edges for both plans is <= |K|/8; assign each edge a distinct target of size >=8. So the mass of Z vertices that are endpoints of any edge is at most 2(|K|/8)B², because each has N_i<=l_i r_i<B². Every canonical edge has l_i r_j>=8. Pay for all remaining edges incident to Z at cost at most (2n/8) times that Z mass, hence at most |K| n B²/16. This counts edges in both directions and may overcount; harmless. These two preprocessing sets of queries are common to both alternatives. All remaining original edges go from X to Y.

Partition X by L-size and Y by R-size. Write A=mass of X with l=1, C=mass of X with l=9, b=mass of Y with r=9, d=mass of Y with r=1. Thus A+C<=X and b+d<=Y. The only remaining common blocks with area<10 are degenerate (1,9) and (9,1), as proved in v1.10. Enlarge them to the full rectangles A×b and C×d in terms of element masses. All other edges cost at most (X Y-A b-C d)/10 in the average of the two sufficient plans, since a single-plan edge has half weight and area>=8, and a common edge there has area>=10. This is an upper estimate even when some class pairs are not edges at all.

For the first rectangle use Section 2 with union of ALL classes in A (each has size>=B, regular right-zero), and each right endpoint in b. All exit factors outside A have at most (X-A)+R+n/B distinct L-classes: those in X outside A or the leftover mass R can be charged by elements, and those in Y have L-size>=B, hence at most n/B classes in total. Units never yield K on multiplication by an exterior element, so cannot be exits. The total number of right R-class representatives in b is b/9. Thus the total sufficient query count for this rectangle is at most
\[
\frac b9\min(A,(X+R+n/B)/2).
\]
Count it once in each plan (both together serve all assigned targets in the rectangle). The dual rectangle costs at most
\[
\frac C9\min(d,(Y+R+n/B)/2).
\]
The union of query positions can only reduce these upper costs, even if an exit coincides with another planned query. This bound does NOT require exit factors for different right endpoints to be distinct: the same global count of possible exit L-classes applies to each, and the costs sum linearly over disjoint sets of right R-classes. The two rectangles are disjoint as pairs of endpoint classes; factors can be shared without invalidating the upper estimate.

## 5. Numerical estimate

For X,Y>0 normalize a=A/X, c=C/X, beta=b/Y, delta=d/Y, so a+c<=1,beta+delta<=1. First ignore R+n/B in the minima. The averaged main cost divided by XY is bounded by
\[
1/10+\beta f(a)+c f(\delta),\qquad f(t)=\min(t/9,1/18)-t/10.
\]
For t<=1/2, f(t)=t/90; for t>=1/2 it decreases. Replacing a and delta by min(a,1/2),min(delta,1/2) cannot decrease their f-values and relaxes the upper bounds on c,beta. For a,delta<=1/2,
\[
\beta f(a)+c f(\delta)\le (a+\delta-2a\delta)/90\le1/180.
\]
The last expression is increasing separately up to 1/2 in this square. If X or Y is zero the original main cost is zero. Restoring R+n/B increases each minimum by at most (R+n/B)/2, so the main cost is bounded by
\[
19XY/180+(R+n/B)(b+C)/18
\le19(n-R)^2/720+(R+n/B)(n-R)/18.
\]
Writing t=R/n gives the quadratic (19+2t-21t²)/720 with maximum 5/189 at t=1/21. Including the two preprocessing costs yields a uniform metadata upper bound
\[
D_L(n;\mathrm{metadata})\le
\left(5/189+2/B+1/(18B)+(|K|/n) B^2/16\right)n^2.
\]
The cheaper of the two complete nonadaptive plans suffices; all overhead is included. If |K|=o(n), choose B tending to infinity slowly enough that (|K|/n)B² tends to zero, giving 5/189+o(1). No claim of sharpness for this small-ideal bound.

For a completely explicit global gap choose B=4096 and epsilon=2^(-31). If |K|/n<=epsilon, the bound is
\[
5/189+1/2048+1/2048+1/73728
=0.0274451523\ldots<1/36 .
\]
Otherwise Section 3 gives leading coefficient at most gamma=(1-epsilon/2)^2/36=(1-2^(-32))²/36. This is larger than the small-ideal bound and strictly smaller than 1/36. Hence the maximum of the two cases is at most gamma+o(1), uniformly. This establishes strict separation of worst-case asymptotic decision and cardinality coefficients, not different polynomial orders and not an ordinary limit for decision. Both problems remain quadratic by the previous lower bounds. The proof uses only known data to choose plans; the lower bound holds even adaptively with stronger data, so the strict statement holds in all four deterministic decision/count comparisons. No assertion for randomized algorithms or L>=6.

## 6. Executed verification and limitations

[Grouped audit](../experiments/L4-grouped-exit-strict-separation-audit.js) was executed before saving. Extends the earlier local-compression test harness (169 labelled identity-0 monoids of orders 2-4, 347 ideal instances; 148 structured tables; dual orientations; six special tables). New three tables of order 52 use an upper right-zero band H projecting twin pairs onto A, C4 units swapping twins in H on the right but acting trivially on A. Multiplication on H is right-zero, H A returns A's right factor, A H projects the right factor to A, and H×B uses projected A×B. The fixed target actions are the same as A. All associativity triples of these three tables are checked. For each, an enlarged union A and H has 24 vertices, 8 upward internal transitions, 8 cycle representative queries and zero exits. The original A block alone has 8 vertices; the example demonstrates the grouped mechanism, not a strict improvement over its original block.

Totals: 999 oriented table/ideal checks including repetitions, 311 eligible E-free exteriors, 61 grouped plans, 464 vertices, 196 planned queries (172 cycles and 24 distinct exits summed per group), 440 internal edges, 24 upward internal edges, 7 multi-class groups. Zero discarded-lower-exterior cases occurred, so that step relies on the analytical proof. Exact finite integer checks of the new numerical inequalities: 828100 mass configurations (X,Y up to 12, residual 0..3), plus the explicit rational coefficient comparison. All assertions PASS. These are not exhaustive monoid checks above order 4 or a full implementation of the two-plan arithmetic algorithm on large balanced families; the global theorem follows from the displayed proof, not extrapolation. The refined double-edge charge is a proof refinement, not a separately new graph simulation. The explicit gap is intentionally weak; next optimize it or prove the sharp decision coefficient. Source provenance remains governed by v1.11 correction, no new literature search or historical priority conclusion.
