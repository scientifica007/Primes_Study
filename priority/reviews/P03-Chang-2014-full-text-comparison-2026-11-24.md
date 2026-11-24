# Full-text comparison with Chang (2014): table recovery versus indispensable-element decision
24 November 2026. Scientific-priority track P03. Internal source comparison and new elementary separation argument; not external refereeing or a comprehensive novelty certification. No main modification, no new T numbers.

## 1. Verified source and method

Ching-Lueh Chang, “Hardness of learning loops, monoids, and semirings,” Discrete Applied Mathematics 162 (2014), 149–158, DOI [10.1016/j.dam.2013.08.012](https://doi.org/10.1016/j.dam.2013.08.012). The paper was available online on 8 September 2013. The user's [Drive copy](https://drive.google.com/file/d/1hmVtEjk9GeLJJi9_dRNNaWT_0obkW1gS/view?usp=drivesdk) was accessed through the connected Drive reader. Its text extraction contains the title page, all ten printed pages 149–158, and the complete reference list; 36,936 characters returned. The page labels, definitions, equation numbers, lemmas and corollaries below were checked in that text. This is a full extracted-text review, not a visual PDF-render audit; some mathematical glyphs are imperfect in extraction, so no inference relies on ambiguous glyphs. The full PDF is not copied to GitHub. The public [publisher record](https://www.sciencedirect.com/science/article/pii/S0166218X13003533) was also retrieved in this round via actual web search. Two actual search queries: “Ching Lueh Chang Hardness of learning loops monoids semirings 2014 pdf 10.1016/j.dam.2013.08.012” and “Zumbrägel Maze Rosenthal Efficient recovering operation tables black box groups rings 2008 semigroups query complexity”. The second located the [arXiv abstract 0805.0514](https://arxiv.org/abs/0805.0514) for Chang's reference [15]; that paper has not been fully reviewed here. No claim that previous undocumented searches were actually executed. No MathSciNet/zbMATH exhaustive search.

## 2. Page-by-page reading ledger

Printed page | Material examined | Relevance
---|---|---
149 | Abstract and introduction: black-box operation learning; approximate recovery; abelian groups, loops and semirings | Prior oracle model and quadratic-hardness motivation
150 | Definitions 1–6; group recovery Theorem 7; crossed product Fact 8 | Classical notions and related group reconstruction
151 | Yao principle Fact 9; critical sets and Theorem 10; random-permutation loop construction Eq. (1), Table 1 | Independent information in table blocks; distinct output objective and nonassociative structure
152 | Lemmas 11–16: abelian-loop axioms and inverse-query simulation; start of Lemma 17 | Algebraic validity and randomized lower bound; no Green localization
153 | Lemma 17 continued, Eqs. (7)–(9), expected fraction of errors from unseen blocks | Distributional indistinguishability, not fixed-statistics opposite verdicts
154 | Theorem 18; start of Section 4; independent target choices, Eqs. (10)–(11); Lemma 19 | Main monoid construction; directly relevant precedent
155 | Table 2; Lemmas 20–22 establish multiplication and distributivity | Explicit associative commutative semiring; all nonidentity additive triples collapse
156 | Theorem 23, Eqs. (14)–(19): expected error in both recovered tables | Randomized subquadratic queries cannot recover a positive expected fraction
157 | End of Theorem 23; Corollary 24 for commutative aperiodic monoids; appendix Fact 25 and Lemma 26 | Main monoid consequence; group generation for full-table recovery
158 | End of Theorem 7 proof; references 1–15 | O(n log n) group table learning; further leads

## 3. What is already established by Chang

Theorem 18 treats finite abelian loops, permitting multiplication and inverse queries. Theorem 23 treats finite commutative semirings, permitting queries to either operation. Corollary 24 restricts to the additive commutative aperiodic monoid of the semiring construction. For every randomized algorithm with worst-case query bound o(n²), a family of these monoids exists on which the expected fraction of correctly recovered table entries is o(1). Thus even approximate table recovery in this class can require quadratic order. This is a direct precedent for quadratic multiplication-table query hardness, and P03 must not claim priority for that broad phenomenon, for operation-table oracles, or for the independent-block adversary principle. Chang does not state a sharp coefficient 1/16 for deciding E or recovering its cardinality under our supplied metadata. His lower bound concerns an even stronger *recovery* task but does not logically transfer to our predicate.

Section 4, Eq. (10), uses carrier {0,...,n−1}, m=floor(sqrt n), identity 0, low target set K={2,...,m}, and high labels V={m+1,...,n−1}. For nonzero arguments the sum is 2 except for distinct high labels, where an independent value from K is assigned per unordered pair. The two semiring operations share these random values. Every additive product of three nonidentity elements is 2; this establishes associativity regardless of the choices. This construction is not the P03 split rectangular-band construction. The latter uses two bands with regular exterior elements, cyclic unit group C4 and target Green classes of sizes 1,4,2,2. Both exploit local table uncertainty compatible with the algebraic laws. That methodological overlap is real and must be acknowledged.

## 4. A rigorous separation from the P03 decision problem

The generation convention throughout P03 is positive-length words, with no free identity. In a finite monoid, xy=e implies both factors are units. Indeed x has a right inverse and hence is invertible in a finite monoid. In an aperiodic monoid, any unit g satisfying g^k=g^(k+1) must equal e by cancellation in the unit group. Thus every finite aperiodic monoid has e in E(M). On the promised aperiodic class the decision E=empty is identically false, so requires zero queries, irrespective of table-learning hardness. This applies to Chang's Corollary 24. It would not be the same argument under a free-empty-word generation convention.

There is also a cardinality separation. Every finite commutative aperiodic monoid is J-trivial: if x J y, then y=xv and x=yu for some u,v (commutativity combines two-sided multipliers). Hence x=x(vu)^k for all k>=1. Choose k with v^k=v^(k+1). Then y=xv=x(vu)^kv=x(vu)^k=x by commutativity. With singleton J-classes the class-local generation criterion of the P03 manuscript reduces to an independent compulsory or optional choice for each label, so E is the unique inclusion-minimal generating set and r=|E|. One may also prove this directly by descending the J-order: every dispensable element has a factorization with both factors strictly above it. Thus in the commutative aperiodic class, the P03 counting task is zero-query when rank is supplied. This is an elementary deduction from classical properties, not a historical novelty claim.

For the particular additive table of Chang, E can be read from the full labelled principal ideals even without rank. The labels 0,1 and all of V are indispensable. Label 2 is dispensable by 1+1=2. Each c in K with c>2 is dispensable exactly when c occurs as an output of a distinct high pair; this is equivalent to c belonging to xM for some x in V. No other nonself witness can produce c. Thus the exact labelled set E is fixed by the supplied one-sided ideals in this family. Consequently even the full-labelled recovery of E in Chang's family does not imply full-table recovery.

## 5. Anchored adaptation of Chang's construction (our deduction)

To make the non-implication explicit inside a *common* P03 fibre, adapt Eq. (10) for n>=9 so m>=3. Pick distinct high labels a,b in V and let U=V\{a,b}. Keep identity and all fixed products from Eq. (10). For distinct high pairs impose:
- a+b=3; a+x=2 and b+x=3 for x in U.
- For each unordered pair of distinct members of U, independently choose the product 2 or 3.
All high diagonal entries are 2. All remaining nonidentity products are 2.

Associativity holds because all nonidentity triples equal 2. This is a commutative aperiodic monoid with K a nonempty proper ideal. Every high principal ideal is exactly {x,2,3}; every low principal ideal of c>2 is {c,2}; that of 1 is {1,2}; that of 2 is {2}; the identity's is M. These sets are fixed, as are the quotient, K-factor products, unit actions, regularity/idempotence, and all proper principal-ideal internal tables (no proper principal ideal contains two distinct high labels). The label 3 is always a first-entry output, because a+b=3. Every generating set must include all labels other than 2,3, and those labels suffice to generate both 2 and 3. Thus all tables share E=M\{2,3}, r=n−2, g_r=1, H(w)=w^(n−2), and the full ordinary generating enumerator w^(n−2)(1+w)^2.

Let h=|V|=n−m−1. The promised family has 2^binom(h−2,2) distinct tables. Every query outside the free unordered pairs has a fixed answer, and each query to a free pair learns its one independent bit. A deterministic exact table-learning algorithm must query each free unordered pair, even with all the stronger P03 metadata and full generating enumerator: if it omits one, flip the corresponding bit to obtain an indistinguishable compatible table. Querying all of them suffices on this subfamily. Its exact promised learning cost is
\[
\binom{h-2}{2}=\binom{n-\lfloor\sqrt n\rfloor-3}{2}
=\tfrac12 n^2-O(n^{3/2}).
\]
At the same time, deciding emptiness, computing cardinality and recovering the labelled E all cost zero on the subfamily. In fact the known labelled ideals for this family, together with quotient and K-actions, already determine E for any compatible table even if not promised to be one of the binary arrays. The identity is known, the quotient fixes that no product of nonunits can produce an exterior nonzero value here, and the ideal descriptions force the existence of high-pair outputs 3 while excluding c>3. This is not a claim of optimality for general table learning under our metadata, nor a result quoted from Chang. It is a new explanatory specialization of his construction, with no independent historical priority asserted. It demonstrates concretely why a table-recovery lower bound cannot substitute for the balanced decision lower bound.

## 6. Actual verification of the anchored specialization

[Audit script](../experiments/chang-learning-separation-audit.js) executed as JavaScript in this round, then archived. It checks associativity, identity, commutativity, aperiodicity, labelled principal ideals, common quotient and K-actions, fixed proper-principal products, unique inclusion-minimal generating set, and that a flip of a free bit changes exactly its two transposed cells. For n=9 it independently classifies all subsets by closure (including the empty subset).

n | free unordered pairs | tables tested | associativity triples | rank and E size
---|---:|---:|---:|---:
9 | 3 | 8 | 5832 | 7
10 | 6 | 64 | 64000 | 8
11 | 10 | 1024 | 1362944 | 9
16 | 36 | 38 | 155648 | 14

Totals: 1134 tables, 1,588,424 associativity triples, 1134 metadata checks, 4096 full subset classifications. PASS. At n=16 the test set consists of all-zero/all-one patterns and all single-bit flips, not all 2^36 possibilities. The proof, not the samples, gives the general separation. No formal certification or external review.

## 7. Comparison and priority verdict

Aspect | Chang 2014 | P03 manuscript
---|---|---
Oracle | operation entry, sometimes inverse or second operation | one multiplication entry
Target | complete/approximate table recovery | exact E emptiness/cardinality
Algorithms | randomized lower bounds, deterministic group recovery | exact deterministic adaptive and nonadaptive optimum
Monoid lower-bound class | commutative aperiodic | noncommutative split bands with nontrivial units and balanced targets
Supplied structural data | carrier; some proof advice or operation components | quotient, K actions, labelled ideals, rank/count, possibly stronger metadata
Information strategy | independent random choices hidden in unqueried pairs | balanced opposite-verdict completions with equal supplied statistics
Result | subquadratic queries give o(1) expected recovered fraction | D(n)/n² -> 1/16 in stated model

**Verdict relative to this specific paper:** partial overlap in oracle and lower-bound methodology; no matching theorem or reduction to the P03 sharp coefficient found in its full extracted text. The commutative aperiodic case even has zero decision/count cost in our convention with rank supplied. This is stronger evidence of distinction than merely comparing abstracts. It is NOT proof of general historical priority; a different paper might contain the relevant theorem or equivalent result.

Update the manuscript introduction to credit Chang's Corollary 24 explicitly and distinguish tasks by the aperiodic identity argument. Replace the earlier access limitation in its reference [5] with the actual full-text review. Do not claim all other bibliographic records in earlier rounds are newly verified. Keep P03 PARTIAL_OVERLAP pending further search.

Next priority: Chang's reference [15], Zumbrägel, Maze, Rosenthal, “Efficient recovering of operation tables of black box groups and rings,” ISIT 2008, pp. 639–643, accessible via [arXiv:0805.0514](https://arxiv.org/abs/0805.0514), located in the actual web search this round. Also investigate property testing (Chang's reference [8], Ergün et al., “Spot-checkers,” 2000) and query complexity with given generators/structural side data. These are leads, not claims of completed full-text comparison. No merge or submission authorized.
