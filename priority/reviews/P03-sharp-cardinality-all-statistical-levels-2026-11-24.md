# P03: sharp cardinality complexity for every fixed statistical level; decision remains separate
24 November 2026. Internal mathematical development on the scientific-priority branch. No new T numbers, no main modification, no external refereeing or historical priority certification. No new external literature search in this round; the proof uses the established manuscript and the previous arithmetic and rectangular constructions. Pin 2026 remains pending author copy.

## 1. Result
Distinguish exact deterministic cardinality cost C_L(n) from emptiness cost D_L(n). For each fixed L>=0 let s_L be the least maximum part of a singleton-changing arithmetic collision with equal length, product and moments j=1 or positive even j<=L, as defined in the v1.7 arithmetic note. Then
\[
\lim_{n\to\infty} C_L(n)/n^2=1/(4s_L)
\]
for either structural side-data model and adaptive or nonadaptive algorithms. This also holds if the entire inclusion-minimal generating-set size enumerator H is supplied. The upper bound is already proved in v1.7 and applies to both tasks. The missing lower bound for cardinality follows by allowing a degenerate one-row band. For decision the same lower proof does not apply: both promised tables have nonempty E. No claim of a strict complexity separation in worst-case decision versus counting; only different current sharpness results. At L=0,1,2,3 both are sharp. At L>=4 the decision coefficients remain unresolved (for the previously scanned levels). 

## 2. Construction and proof
Fix L, set V=s_L and U=1. By the definition and existence proof of s_L there are two disjoint size multisets S+, S- supported in 1,...,V, with identical b=length, P=product and all required moments, and with a positive number d of ones in S+ and none in S-. Indeed the positive and negative parts of a rational kernel vector scaled to integers and signed with positive first coordinate have this property. Both have b>=2. Fix labelled target layers for all parts (repeated sizes use separate labels). Use the multiplication of the v1.8 non-equivariant construction with A=[1]×[p], a right-zero band, B=[q]×[V], units C3 acting trivially outside the group, each layer T_l=[1]×[s_l], and maps alpha_l constant, beta_l:[V]->[s_l] surjective. K is the disjoint union of all layers and the absorbing zero z. Choose p>=2,q>=V, pq>=b. The seven potentially nonzero nonunit triple types, the unit action proof and the common principal ideal proof of Section 8 in v1.8 remain valid when U=1. All variable cells are in A×B; no proper principal two-sided ideal contains both factors. The stronger D* as well as D_red structural data are fixed.

A generating subset contains a generator of C3, every A cell, a row/column cover of B, and meets every absent target layer. Necessity of every A cell follows because the only nonunit type producing A is AA, whose output is its right argument; unit factors act trivially. Sufficiency follows by exactly the previous band argument and surjective layer actions. For each present layer one occupied W-position yields the whole layer as B's last coordinate ranges across [V]. For an absent layer a chosen target member multiplied on the right by B yields its entire layer. BA yields z. Thus the fixed exterior enumerators F,H_fix have a common factor w^p from A and the rank is 1+p+q+b. The same formulas apply:
\[
G=F(w)(1+w)^{D-p_1}\prod_{\ell\in Z}((1+w)^{s_\ell}-1),\qquad H=H_{\rm fix}(w)P w^b.
\]
Here D=|K| and Z is the absent list. The existing moment equivalence ensures equality of r, g_r,...,g_(r+L), and H is identical. All B cells are dispensable because q,V>=2; all group elements are dispensable (C3); zero is dispensable; an absent layer of size>1 contributes no indispensable element. Therefore
\[
E=A\cup\bigcup_{\ell\in Z,\ s_\ell=1} T_\ell .
\]
The two promises (present labels exactly S+ or exactly S-, every required label at least once) give cardinalities p and p+d, though both have nonempty E.

A query is fixed or decodes one array position W_ij. For m=pq free positions, an all-zero transcript on <=m-b positions permits both promises by filling the remaining positions with the b required distinct labels. Thus m-b+1 queries are necessary in the worst case for exact cardinality, and sufficient on the promise (first nonzero answer identifies the present list). This applies to adaptive algorithms; the upper promise strategy is nonadaptive. With fixed layer lists let c=|K|+3. Then n=p+Vq+c. For every sufficiently large integer n choose q=floor((n-c)/(2V)), p=n-c-Vq. Both satisfy the size conditions, and
\[
pq=(n-c)^2/(4V)-O_L(1).
\]
No padding is required, since the coefficient of p is one. So C_L(n)>=n²/(4s_L)-O_L(n). The v1.7 nonadaptive count upper bound C_L(n)<=n²/(4s_L)+O_L(n^(5/3)) yields the limit. This is an exact characterization by the arithmetic threshold for every fixed L; no uniform-in-L finite-order lower estimate is asserted. In particular no claim for sequences L(n) increasing, or randomized complexity, or recovering the labelled set in arbitrary fibres.

## 3. L=4,5 example
Use U=1,V=9 and the signed vector on sizes 1,...,9:
(5,-26,36,-8,0,-18,0,20,-9).
The two lists are five ones, 36 threes, 20 eights, versus 26 twos, eight fours, 18 sixes, nine nines. Common b=61, P=2^60 3^36, p1=273, p2=1609, p4=84841. D=547, c=550. Consequently n=p+9q+550 and counts are p and p+5. For all large n the matching leading coefficient is 1/36. The previous nondegenerate rectangle 2×5 still gives the decision lower coefficient 1/40, and the previous general upper coefficient 1/36. The degenerate construction cannot settle decision because A is nonempty and indispensable in every table.

## 4. Alternative query selection for decision and cardinality
The count/prime-valuation/moment matrix on sizes 1,...,9 for L=4 (also L=5, since no new independent odd moment is supplied) has rank 8 and rational kernel spanned by the vector above. After determining missing multiplicities for all sizes >=10 and subtracting their contributions, the residual linear system has the same kernel. The singleton coordinate is uniquely fixed if the missing multiplicity of any one size in {2,3,4,6,8,9} is known; sizes 5 and 7 alone do not help in the unrestricted rational system. This does not require a different generating polynomial or extra statistics. In the known structural data, let Q_k be the union of canonical query representatives for unresolved classes of size k, and Q_large the corresponding union for sizes >=10. Each Q_k is sufficient to obtain that size's missing count (including classes whose status is determined without queries). For a fixed instance choose k minimizing |Q_large union Q_k| over those six sizes, skipping supplied products. This is a nonadaptive selection by metadata. One can also use the fixed known exterior contribution E_* to decide immediate nonemptiness. This is an instance-dependent improvement over always querying sizes >=9, not a universal coefficient smaller than 1/36. The exact rank and deletion checks are archived in [L4-single-coordinate-inference-audit.js](../experiments/L4-single-coordinate-inference-audit.js), executed 8 coordinate-deletion tests, PASS.

## 5. Actual verification
[one-row-counting-sharpness-audit.js](../experiments/one-row-counting-sharpness-audit.js) written and executed before saving. Two tables for each of L=0,1,4. Checks: common labelled principal left/right ideals, quotient, all non-AB products, identity, idempotence, E by nonself products, equality of low ordinary coefficients by exact BigInt convolution, and sampled full-monoid subset generation. B cover enumerator is obtained by inclusion-exclusion over rows and columns, not enumeration of 2^(qV) subsets. Full H matching follows from the analytical formula, not a separate enumeration in this audit.
| L | n | p,q,V | rank | two counts | promised cost |
|---|---:|---|---:|---|---:|
|0|31|2,4,4|9|2,3|7|
|1|66|2,6,6|13|2,3|9|
|4|638|7,9,9|78|7,12|3|
Totals: 6 tables, 634,574 exhaustive associativity triples for orders 31 and 66, 2,000,000 deterministic sampled triples for the two order-638 tables, 6 metadata comparisons, 8 coefficient equalities, 142 subset closure tests, 8,704 zero-transcript masks (orders 31 and 66 only). PASS. No exhaustive associativity enumeration of order 638, no exhaustive full-monoid subset enumeration, no formal certification. The proof covers all W arrays and orders independently of these tests. The audit does not compute the complete stronger proper-principal internal data separately: it checks the invariant non-AB entries and labelled ideals, and the proof shows that no proper principal two-sided ideal contains an AB pair.

## 6. Current bounds and priority
For every fixed L, C_L has sharp coefficient 1/(4s_L). For the emptiness decision keep the bounds 1/(4a_L) <= liminf <= limsup <= 1/(4s_L), with matching limits at L<=3; a_L remains the least successful area in the nondegenerate two-band construction. This explicitly supersedes the unqualified statement in v1.8 that all later coefficients remain open. It does not assert that decision is strictly easier in worst-case asymptotic order. The priority status remains PARTIAL_OVERLAP, and no new literature evidence is claimed this round. Next focus on decision after excluding fixed exterior indispensable elements, and assess whether arithmetic choices and cross-block dependencies can lower the decision upper bound. No external submission.
