# Threshold witness compression and composite-only statistical inference
24 November 2026. Internal continuation of [terminal witness compression](P03-terminal-witness-compression-2026-11-24.md) and [general-ideal statistics](P03-general-ideal-statistics-2026-11-24.md). No new T numbers; main untouched. No external referee or formal theorem prover. Historical priority unresolved.

## 1. Main results and scope

Use exactly the labelled finite monoid query model D* and nonempty compatible family F of the preceding notes. Positive-word generation, computation free. Put n=|M|, A=M\(G union K), a=|A|, and c=number of ambiguous indispensable targets. For emptiness, stop if a fixed indispensable element is known, in particular if any exterior element is indispensable. In the remaining case the singleton localization, divisor-closed stabilizer, stripping and terminal-block lemmas from the two preceding notes apply.

**Theorem A (symbolic upper bound).** For every integer B>=2, the deterministic emptiness cost satisfies
\[
D_{\rm det}\le \frac29 n^2+c B^2+\frac{7n^2}{B}.
\]
Taking B=max(2,ceil(n^(1/3))) proves a uniform O(n^(5/3)) remainder and global limsup upper coefficient 2/9, with or without generating statistics. Use the minimum with previous finite bounds. At L=0 retain the established lower coefficient 1/16. Hence [1/16,2/9], ratio 32/9, improves [1/16,59/250]. This coefficient is proved by a symbolic inequality, not interval subdivision, numerical optimization, or finite table enumeration. It is for emptiness, not arbitrary full E recovery when exterior E is nonempty. It is not claimed sharp or a bound <=1/8.

**Theorem B (composite-only inference).** Under the prescribed rank and g_r (or H), the number of missing singleton nonregular classes is determined by the missing composite-size nonregular classes alone, after subtracting fixed class contributions. It admits a nonnegative weighted stopping rule, including a sound maximum-weight matching bound on not-yet-observed composite witnesses. No general sub-2/9 coefficient is derived from this arithmetic reduction. The linear statistic reduction is a special explicit use of the earlier row-space framework, not an independent novelty claim for linear algebra.

## 2. One-fixed-side compression

For each ambiguous singleton t choose the localized rectangle R(e)×L(f) as in the localization note. Compress by L-first/R-second class pairs. Recall the terminal first blocks (orbits of L-classes under right units, followed by a DAG of stripping moves), and the dual terminal second blocks. Each terminal block contains at least two exterior elements when exterior E is empty.

If L(f) is singleton, then every left unit fixes f itself. From a witness xf=t, any first-block move, including selection of its phase by balanced unit actions and stripping nonunit factors, preserves a witness with second factor f. After the chosen first-block path, every element of its terminal first block can be used with f. Thus one can query a fixed representative of each terminal block reached by the possible first factors. This costs at most floor(a/2), and also one may use the uncompressed class-pair count of the original rectangle if smaller. Dually if R(e) is singleton the second factor can move independently, holding e fixed. This is valid without requiring the moving coordinate initially fixed by units. The preceding fixed-fixed lemma remains the method when both class coordinates are fixed, but neither localized side is singleton.

## 3. Size threshold and exterior types

In this section B is the integer threshold, not the right stabilizer or a set of target supports. Write r(x)=|R(x)|, l(x)=|L(x)|. By Green's lemma the following are disjoint unions of exterior J-classes, and are invariant under unit actions. Lowercase variables denote cardinalities, not normalized until indicated:
- X_L (x): regular, l=1, r>=B;
- X_S (u): regular, l=1, 2<=r<B;
- Y_L (y): regular, r=1, l>=B;
- Y_S (v): regular, r=1, 2<=l<B;
- P (p): regular, r>=B, 2<=l<B;
- Q (q): regular, l>=B, 2<=r<B;
- Z (z): regular, 2<=r,l<B;
- W (w): remaining exterior elements (nonregular, both singleton, or both sizes >=B).
Then a=x+u+y+v+p+q+z+w. The letters L and S in subscripts here indicate large/small side, not Green L.

For large-large localized rectangles (both side sizes >=2, regardless of B), the class pairs use first L-classes from regular elements with r>=2 and second R-classes from regular elements with l>=2. Divide the counts into A_L,A_S according to r>=B or 2<=r<B, and B_L,B_S by the dual rule. The large-large rectangles with both sides <B can be paid individually together with all other rectangles having both sides <B, at total cost <=c B². The remaining large-large rectangles use only the regions A_L×B_L, A_L×B_S and A_S×B_L. Define approximate class counts
\[
 A_0=x+p/2,\quad B_0=y+q/2,\quad C_0=u+z/2,\quad D_0=v+z/2.
\]
Counting each L-class by 1/l per element and each R-class by 1/r, gives
\[
 A_L\le A_0+a/B,\quad B_L\le B_0+a/B,\quad
 A_S\le C_0+a/B,\quad B_S\le D_0+a/B.
\]
Indeed W's regular both-large classes contribute at most w/B to each large count; P contributes at most p/B to the small second count and Q at most q/B to the small first count. Other types contribute only as stated or zero. All actual and approximate counts are <=a, so each product is bounded by the corresponding approximate product plus 2a²/B, using one factor at a time and the bound a. Total error for the three regions <=6a²/B.

If one side is singleton and the other is >=B, Section 2 bounds that target cost by min(A_L,a/2) or min(B_L,a/2). If both sides <B, it was already paid in cB². Hence the remaining singleton-side cost is at most
\[
 c\min(\max(A_0,B_0),a/2)+ca/B.
\]
No assertion of disjoint query sets for different targets is needed; counting a union by a sum is safe.

## 4. Saving on the pure oriented regions

The pure oriented region included in the three large-large regions is
\[
 (X_L\times Y_L)\cup(X_L\times Y_S)\cup(X_S\times Y_L),
\]
with k=xy+xv+uy cells (first L-class and second R-class singleton). It is a union of balanced-unit orbits. The subset needed by the chosen localized rectangles, with possible t witnesses, is also invariant under balanced moves: R(e) and L(f) are stable under the respective unit actions, and balanced moves preserve products. Count nonfixed pairs by at most half their number. Let U be the number of fixed-fixed candidate pairs; U<=k. Let b,d be the counts of all right-unit-fixed elements in X_L union X_S, and all left-unit-fixed elements in Y_L union Y_S. Then U<=bd. All these b first singleton blocks and d second singleton blocks are nonterminal. There are at most (a-b)/2 terminal first blocks and (a-d)/2 terminal second blocks.

The fixed-fixed lemma gives the choice of querying those U pairs directly, or querying one canonical pair for each combination of their reached terminal blocks. Cost for that region is therefore at most
\[
 (k-U)/2+\min\{U,(a-b)(a-d)/4\}.
\]
Here (a-b)(a-d)<= (a-sqrt(bd))² <=(a-sqrt(U))², using b,d<=a. If U<=a²/9, the last minimum is bounded by U, giving (k+U)/2; if U>=a²/9, use (a-sqrt(U))²/4 and note the resulting expression is decreasing in U (derivative -1/4-a/(4sqrt(U))). Together with U<=k the cost is bounded by
\[
 k-\tfrac12(k-a²/9)_+.
\]
The argument is the earlier saving with the small-small pure rectangle removed; no overlapping region is subtracted twice. Queries transported outside this region are counted at their destination, with duplicates only lowering the cost. Every positive report is an actual exterior witness.

Combining Sections 2–4 yields
\[
D_{\rm det}\le
 A_0B_0+A_0D_0+C_0B_0
 +c\min(\max(A_0,B_0),a/2)
 -\tfrac12(k-a²/9)_+
 +c B²+7n²/B .
\]
The last error dominates 6a²/B+ca/B because a,c<=n. All preceding operations are on known metadata and possible witness supports; actual queries determine which targets are present.

## 5. Symbolic maximization: coefficient 2/9

We prove the leading part of the last inequality is <=2n²/9 throughout the relaxed nonnegative parameter domain. Normalize all size variables by n in this section, so a<=1 and c<=1-a. Replace c by 1-a (the coefficient is nonnegative). The quantity is
\[
 H=A_0B_0+A_0D_0+C_0B_0+(1-a)\min(\max(A_0,B_0),a/2)
      -\tfrac12(k-a²/9)_+.
\]

First transfer all mass p to x and q to y, and w to z. These replacements do not decrease H:
- p->x increases A_0 by p/2 and k by p(y+v); the raw products increase by (p/2)(B_0+D_0)>=p(y+v)/2. The positive-part penalty increases by at most p(y+v)/2, and the c term does not decrease.
- q->y is dual, with current values after the first transfer.
- w->z increases C_0,D_0, keeps k and a fixed.
Thus take p=q=w=0, and write x+u+y+v+z=a. By symmetry assume x>=y. Move the mass u to v: this does not decrease k=xy+xv+uy, and the function k-(k-a²/9)_+/2 is nondecreasing. The other term (x+y)z/2 is unchanged. Hence take u=0. For fixed x,z,a, k=x(a-x-z) is independent of y, and increasing y increases the z term without changing the capped c term (y<=x). Choose y=min(x,a-x-z). If y=x and z<a-2x, increase z to a-2x, reducing v accordingly. Then k+xz=x(a-x) stays fixed, and the penalty decreases. In all cases we can take v=0, so x+y+z=a.

If a=0 the leading part is zero. Otherwise put U=x/a,V=y/a (distinct from threshold B), with 0<=V<=U, U+V<=1. The relaxed expression is bounded by
\[
 a² f(U,V)+a(1-a)\min(U,1/2),
\quad
 f(U,V)=\tfrac12(U+V-U²-V²)-\tfrac12(UV-1/9)_+.
\]

**Lemma 1:** f<=2/9. Put s=U+V and t=UV<=s²/4. If t<=1/9 and s<=2/3 then f=(s-s²+2t)/2<=s/2-s²/4<=2/9. If t<=1/9 and s>=2/3 then f<=(s-s²)/2+1/9<=2/9 (decreasing on that interval). If t>=1/9 then s>=2/3 and f=(s-s²+t+1/9)/2<=s/2-3s²/8+1/18<=2/9 (decreasing for s>=2/3). All equalities are feasible in the relaxation at U=V=1/3.

**Lemma 2:** for U>=4/9 and h=min(U,1/2), f<=h-9h²/8. For U in [4/9,1/2], use (UV-1/9)_+>=UV-1/9, then maximize the resulting concave quadratic in V over the real line. This yields
\[
 f\le \frac{13}{72}+\frac{U}{4}-\frac{3U²}{8}.
\]
Subtracting this bound from U-9U²/8 gives 3U(1-U)/4-13/72>=1/216>0, since U(1-U) is nondecreasing up to 1/2 and the lower endpoint gives 5/27-13/72=1/216. For U>=1/2, the function f is nonincreasing in U holding V fixed (both its unsubtracted quadratic term and the negative penalty are nonincreasing), so apply the case U=1/2.

If U<=4/9, Lemma 1 gives a² f+a(1-a)min(U,1/2)<= (2/9)(2a-a²)<=2/9. Otherwise Lemma 2 gives
\[
 a² f+a(1-a)h\le ah-\tfrac98(ah)^2
 =\tfrac29-\tfrac98(ah-4/9)^2\le\tfrac29.
\]
This proves Theorem A entirely symbolically. No optimization code is needed for the inequality. The relaxation attains 2/9 at a=1,U=V=1/3, which does NOT imply any monoid attains it. Taking B=max(2,ceil(n^(1/3))) makes cB²+7n²/B=O(n^(5/3)). The remainder can be large for small n; minimize with previous finite bounds. The asymptotic improvement over 59/250 is 31/531=5.838... percent. At fixed L the upper coefficient is 2/9; at L=0 the lower remains 1/16.

## 6. Composite-only arithmetic inference and weighted stopping

From the general-ideal factorization, after known fixed missing statuses have been subtracted, let Z be the set of missing ambiguous nonregular interior J-classes. Given rank and g_r (or H), the count b=|Z| and product P=prod_{C in Z}|C| are known. A missing singleton contributes one to E and a missing nonsingleton contributes zero. Let m_1 be the number of missing singleton classes (fixed indispensable contributions treated first).

Use the classical completely additive prime-factor counting function Omega(s), with multiplicities, Omega(1)=0 and Omega(product)=sum Omega. Thus
\[
 \Omega(P)=\sum_{C\in Z}\Omega(|C|).
\]
For s>1 define w(s)=Omega(s)-1, and set w(1)=0. The weight is nonnegative, zero for primes and strictly positive for composite sizes. Then
\[
 \boxed{m_1=b-\Omega(P)+\sum_{C\in Z}w(|C|).}
\]
In particular no singleton or prime-size class status is needed to compute m_1 if the statuses of all ambiguous composite-size classes are known. This uses rank and g_r alone, hence works for all L, not only L=0. If the right-hand side is inconsistent with the known range [0,c], the assumed statistics and family are inconsistent. For fixed contributions, subtract their count and product before applying the formula (or include them in the sum and subtract fixed singleton count at the end).

Let W be the sum of weights over all ambiguous composite classes (not just the missing ones). Put H=W+b-Omega(P). If R is the set of present composite classes, then
\[
 m_1=H-\sum_{C\in R}w(|C|).
\]
Here H>=0 in any nonempty compatible family. A class is present iff at least one first-entry product of two strictly higher classes lands in it. Use the earlier joint class-witness SCC theorem restricted to composite-size ambiguous classes. One representative of every sink suffices; every class that is present is reported by at least one representative. No assumption of disjoint supports among composite or singleton classes. For composite-only inference, the following adaptive algorithm is valid:
- query representatives and count each distinct reported composite class only once; let S denote the observed weight;
- if S=H, then m_1=0 and stop with empty E (after fixed contributions excluded);
- for unqueried representatives, form the bipartite support graph to unseen composite classes, weighting each such class by w(|C|). Let U_max be the maximum total weight of a matching. Each additional distinct present class must be reported by a distinct remaining representative. Thus total final present weight <=S+U_max. If S+U_max<H, then m_1>0 and stop with nonempty E;
- otherwise continue; after all representatives queried U_max=0, so one of the tests must decide.
If H=0, no query is necessary. Upper matching bound may overapproximate feasible joint labels; that only weakens the stopping rule. Supports can be computed by enumeration (free in this model). This is a sufficient stopping criterion, not an optimal adaptive decision-tree theorem.

Hybrid with localization: any queried exterior cell can mark the reported composite class present if it is an ambiguous nonregular class, since exterior factors are strictly above it. Run the composite inference and singleton localization tests with a shared transcript, counting common cells once; a singleton found missing decides nonemptiness and all singleton targets found present decide emptiness. The composite matching test uses the still-unqueried composite representatives, removing already observed composite labels. The algorithm can select the cheaper complete strategy in advance, and opportunistically use the other inference along the transcript. It cannot be claimed to be strictly better on every instance. In particular the full shared-support lower construction can force all size groups to have the same representative support. We do not assert any automatic subtraction of d from the new threshold bound.

Example L=0 balancing (1,4) vs (2,2): b=2,P=4,Omega(P)=2, W=1,H=1; m_1 is exactly the indicator that the size-four class is missing. Two cases distinguished using only the size-four witnesses, potentially much cheaper than testing singletons. In the fully shared lower construction no improvement follows. In the dense graph obstruction from earlier notes this reproduces the two-query auxiliary-layer algorithm. More generally a nonnegative weighting can be chosen using prior moment/valuation equations: replace Omega(s) by a known rational linear combination F(s) of prime valuations and differences s^j-1 (for supplied moments), with F(1)=0 and F(s)>=1 on nonsingleton available sizes. Then use w(s)=F(s)-1 for s>1, w(1)=0; the same identity and weighted certificates hold with sum F over missing classes known. This is a way to annihilate costly size groups while keeping nonnegative weights, within the earlier linear-inference framework. No polynomial-time optimizer or universal numerical gain from this choice is proved.

## 7. Executed checks, not substitutes for proof

[threshold-composite-witness-audit.js](../experiments/threshold-composite-witness-audit.js) extends the preceding saved structural audit, executed anew in this session. Same eight explicit families, 164 labelled tables and 2,426,162 associativity triples, 14 known-exterior-nonempty tables excluded from compression, 150 eligible tables. 43 threshold choices (across families, B=2..8 when available); 1,324 threshold witness-transfer checks; 1,026 threshold/table E reconstructions; 16 one-fixed-side witness transfers; 150 composite arithmetic identities on the actual eligible tables (not all share statistics). All PASS. Includes class-count errors, pure-region saving, finite bounds and previous terminal audit tests. The numeric budget assertions in this structural script use a floating comparison tolerance, NOT the proof of the coefficient. The general bound is the symbolic proof in Section 5. Small instances are not evidence of tightness of 2/9.

| Family | previous localized pairs | threshold B=2 selected queries |
|---|---:|---:|
| fixed bottom/moving upper |4|4|
| hierarchy 1x1 |4|2|
| hierarchy 2x3 |4|2|
| hierarchy 5x6 + duplicates |4|2|
| mixed blocks |excluded|0 (exterior decision)|
| four blocks |28|16|
| balanced two-sided L=0 |4|4|
| nonnull ideal |4|2|

The threshold strategy intentionally pays small-small rectangles without extra orbit compression; for larger B its selected query count can increase. One should minimize actual applicable plans; the threshold is for an asymptotic proof, not a universal practical tuning optimum.

[composite-statistics-matching-audit.js](../experiments/composite-statistics-matching-audit.js), independently executed in this session: exact integer/BigInt identity verification on 4,096 subsets of 12 labelled classes, 498 signature groups, 162 groups with opposite singleton-emptiness outcomes. Then 3,504 abstract support systems (3,375 exhaustive systems of 3 reps/4 labels, 128 deterministic larger samples and one full-support system), 143,097 arrays, 200,059 distinct partial-transcript checks within opposite-verdict signature groups, 53,602 empty certificates and 37,202 nonempty certificates, including 57,756 certificates with multiple positive-weight labels available. All PASS. The matching maximum is computed exactly by finite exhaustive matching, not optimized. These are abstract support systems, not an enumeration of monoids. No GAP, Lean, CI or external reviewer.

## 8. Reference search and status

Actual web searches executed in this round:
- finite semigroup Green relations regular classes cardinalities Green lemma minimal ideals
- semigroup multiplication table oracle query complexity minimal generating sets finite monoids
- prime factor counting function big Omega completely additive arithmetic function

Inspected indexed excerpts from [Computing finite semigroups](https://doi.org/10.1016/j.jsc.2018.01.002) on Green's lemma and class structure, [On the Complexity of the Cayley Semigroup Membership Problem](https://doi.org/10.4230/LIPIcs.CCC.2018.25) on a different, supplied-table model, and [Prime Omega Function](https://mathworld.wolfram.com/PrimeOmegaFunction.html) on the standard additive arithmetic function. These sources support classical tools, not priority of the new claims. No PDF was opened or analyzed; only indexed excerpts consulted. No specialized database or independent literature review; no historical priority claim. Earlier rounds' search/execution records are not independently certified by this session. P03 remains PARTIAL_OVERLAP.

Next: use the weighted composite certificate to avoid expensive singleton searches on particular instances, try to obtain a uniform statistical gain below 2/9, and investigate whether the threshold relaxation can be tightened by actual realizability of the pure/medium class distributions. Lower coefficient 1/16 remains. The target 1/8 is open. Do not merge or submit without authorization.
