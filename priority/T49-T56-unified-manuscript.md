# Quadratic multiplication-query complexity with prescribed generating-set statistics

**Working manuscript v0.5 — 24 November 2026.** Internal draft in the scientific-priority branch. Authorship and contributions remain to be confirmed. Neither submitted nor externally refereed. Historical novelty unresolved. Revised following an internal adversarial review (not independent peer review). This manuscript consolidates T49–T56 and includes the reduced balancing construction of the second priority round.

## Abstract
For a finite monoid \(M\), let \(\mathcal I(M)\) be the set of elements belonging to every generating set under nonempty-word generation. We study exact decisions concerning \(\mathcal I(M)\) when a labelled multiplication oracle is provided together with side information. For every fixed nonnegative integer \(L\), we construct families of monoids with identical labelled principal ideals, Green preorders, principal factors, within-class multiplication, unit-group actions, regular elements, idempotents, generating rank \(r\), the complete size distribution of inclusion-minimal generating sets, and the numbers of generating sets of sizes \(r,\ldots,r+L\). Nevertheless the deterministic worst-case query complexity of deciding whether \(\mathcal I(M)\) is empty is quadratic in the order along an infinite sequence of orders. On the promised families we also determine the exact bounded-error randomized worst-case expected cost. The construction encodes independent Boolean matrices in cross-class products and balances the generating-set enumerators of different promise cases. The result concerns specified side information, not full generating-set incidence or all generating-set counts.

## 1. Definitions and model
All semigroup words are finite and nonempty. In particular the known monoid identity is not a nullary operation. Write
\[
\mathcal I(M)=\{x:\ \forall a,b\in M,\ ab=x\Longrightarrow a=x\text{ or }b=x\}.
\]
The singleton complement of \(x\) is closed iff \(x\in\mathcal I(M)\); thus \(\mathcal I(M)\) is the intersection of all generating sets and, in the finite case, of all inclusion-minimal generating sets. Equal factors are permitted. Let \(g_j\) and \(h_j\) count, respectively, all generating subsets and inclusion-minimal generating subsets of cardinality \(j\). Let \(r\) be the least generating cardinality. 

The oracle returns \(ab\) at unit cost for a supplied ordered pair. The labelled carrier, identity, promise, and stated auxiliary information are free; all other computations are free. We distinguish deterministic worst-case queries from worst-case expected queries of a randomized algorithm whose error is at most \(\varepsilon<1/2\) on each promised input. A scan of the \((n-1)^2\) entries not involving the identity suffices for all three tasks: emptiness, specified-element membership, and output of the whole set. We make no claim about running time under other representations or about quantum complexity.

The structural metadata \(\mathscr D\) consists of the labelled unit group and both actions on the carrier, all principal left, right and two-sided ideals, labelled principal factors, the products within each Green \(\mathcal J\)-class, and the sets of idempotent and regular elements.

**Main result (informal).** Fix \(L\ge0\) and \(0\le\varepsilon<1/2\). On an infinite sequence of orders \(n\), there are promised labelled monoid families with the same \(\mathscr D,r,(h_j)_j,(g_r,\ldots,g_{r+L})\) on which emptiness of \(\mathcal I\), designated-element membership and recovery of \(\mathcal I\) have deterministic query cost \(m=pq\) and optimal randomized worst-case expected cost \((1-2\varepsilon)(3m+1)/4\). Here \(p=q\) gives \(m=\Theta(n^2)\) for fixed \(L\). The exact cost is a promise-family statement, not an exact formula for arbitrary monoids.

The metadata is deliberately specified as side information: the question is what it determines and what additional multiplication queries are necessary, not whether computing that information from scratch is cheap. A lower bound even when it is free is stronger than one in the oracle-only model. It does not imply that such metadata is normally available in applications.

## 2. A Boolean-matrix monoid (T49)
For positive \(p,q\), let \(W\) be a Boolean \(p\times q\) matrix. Use disjoint sets \(G=C_4\), \(A=\{a_{i,u}:i=1,\ldots,p,\ u\in C_2\}\), \(B=\{b_{j,v}:j=1,\ldots,q,\ v\in C_2\}\), and \(\{t,z\}\). The units act by
\[
ga_{i,u}=a_{i,u},\ a_{i,u}g=a_{i,u+\bar g},\quad
gb_{j,v}=b_{j,v+\bar g},\ b_{j,v}g=b_{j,v}.
\]
They fix \(t,z\); \(\bar g\) is reduction modulo 2. Use the group operation on \(G\). On nonunits define:

| | \(a'\in A\) | \(b'\in B\) | \(t\) | \(z\) |
|---|---|---|---|---|
| \(a\in A\) | \(a'\) | \(w(a,b')\) | \(t\) | \(z\) |
| \(b\in B\) | \(z\) | \(b\) | \(z\) | \(z\) |
| \(t\) | \(z\) | \(t\) | \(z\) | \(z\) |
| \(z\) | \(z\) | \(z\) | \(z\) | \(z\) |

Here \(w(a_{i,u},b_{j,v})=t\) iff \(W_{ij}=1\), and otherwise equals \(z\). This is associative: pure \(A\) and \(B\) triples obey right- and left-zero multiplication; mixed triples \(AAB,ABB\) select the same \(A,B\) pair under either bracketing, and the other mixed types give \(z\). Among triples with exactly one \(t\), precisely \(AAt,AtB,tBB\) give \(t\), the rest \(z\); with two or more occurrences of \(t\) the result is \(z\). The two commuting unit actions satisfy \((gx)y=g(xy),(xg)y=x(gy),(xy)g=x(yg)\), by translation invariance of \(w\) and the table. The group identity is global, and the nonunits form an ideal \(I_W\).

The principal ideals are independent of \(W\):
| element | right ideal | left ideal | two-sided ideal |
|---|---|---|---|
| unit | \(M_W\) | \(M_W\) | \(M_W\) |
| \(a\in A\) | \(A\cup\{t,z\}\) | \(\{a,z\}\) | \(A\cup\{t,z\}\) |
| \(b\in B\) | \(\{b,z\}\) | \(B\cup\{t,z\}\) | \(B\cup\{t,z\}\) |
| \(t\) | \(\{t,z\}\) | \(\{t,z\}\) | \(\{t,z\}\) |
| \(z\) | \(\{z\}\) | \(\{z\}\) | \(\{z\}\) |

Consequently the five \(\mathcal J\)-classes and all their principal factors are fixed, since the within-class products are fixed. The idempotents are the group identity, \(A\cup B\), and \(z\); the regular elements are all except \(t\). Units have alternative factorizations within the group, elements of \(A,B\) by the nontrivial translations, and \(z=tt\). Thus
\[
\mathcal I(M_W)=\{t\}\ \text{if }W=0,\qquad
\mathcal I(M_W)=\varnothing\ \text{otherwise}.
\]
The order is \(2(p+q)+6\). Each bit occupies four distinct cells of the table; all other entries are fixed. Even with \(\mathscr D\), the exact deterministic complexity is \(m=pq\): on the zero transcript any unqueried block could contain a 1. For randomized algorithms couple the all-zero input and each one-bit input with shared coins; the probability of visiting that bit block on the zero input is at least \(1-2\varepsilon\). Summation gives the expected lower bound \((1-2\varepsilon)m\), attained by running the exact search with probability \(1-2\varepsilon\) and each constant answer with probability \(\varepsilon\). This exact expectation statement is confined to the T49 promise. The rank here is \(p+q+1+\mathbf1_{W=0}\), so this construction does not grant rank as side information.

## 3. Orthogonal components and fixed rank (T50–T52)
For two matrices \(W,V\), exactly one nonzero, form \(C_{12}\sqcup I_W\sqcup(I_V\times C_3)\sqcup\{\omega\}\). Use the quotient of the unit group onto \(C_4\) in the first component and the isomorphism onto \(C_4\times C_3\) in the second. Products between components equal the absorbing \(\omega\). Within each component use the preceding multiplication or its direct product with \(C_3\). Each union with the units is associative by the homomorphism defining its actions; mixed triples crossing components give \(\omega\). Thus this is a monoid, of order \(8(p+q)+21\), with fixed \(\mathscr D\). Principal ideals in the components are the previous ideals, with the cyclic coordinate where applicable, plus \(\omega\). The nontrivial extra cyclic action makes every element of the second component dispensable; \(\mathcal I\) is \(\{t_W\}\) iff \(W=0\), and empty otherwise. The same unit generator generates all units. Each of the \(p+q\) original blocks in each component needs a representative, and precisely one of the two \(t\)-layers needs an additional representative (the zero matrix component). These conditions suffice by the unit actions and the \(A\times B\) products. The rank is therefore \(2(p+q)+2\), independent of the promise case. The adversary in Section 6 applies to this two-component case.

## 4. General balanced family (T54–T56)
Let \(P=p+q\). Choose a finite indexed multiset of positive powers of 2, \(s_i=2^{e_i}\), \(0\le e_i\le d\), with two nonempty complementary index sets \(Z_+,Z_-\). Use common units \(G=C_4\times C_{2^d}\), where \(d\ge2\), and set
\[
N=G\sqcup\bigsqcup_{i=1}^{C}(I_{W_i}\times C_{s_i})\sqcup\{\omega\}.
\]
The quotient maps of \(G\) onto \(C_4\times C_{s_i}\) give the actions; other products are as in Section 3. The promise is that the set \(Z\) of zero matrices equals \(Z_+\) or \(Z_-\), with all remaining matrices arbitrary nonzero. The order is
\[
n=4\cdot2^d+2(P+1)D+1,\qquad D=\sum_i s_i.
\]
Associativity and constancy of \(\mathscr D\) follow by the component argument: ideals are lifted by the surjective actions and enlarged by the common absorbing element. Regularity in each component is equivalent to regularity of the original nonunit, and idempotence requires also cyclic coordinate zero. Products from outside a component cannot create one of its elements except via units. Each element with \(s_i>1\) has an alternative factorization using \((0,1)\in G\). Consequently the indispensable elements are exactly the \(t\)'s of the zero-matrix components with \(s_i=1\).

For generating subsets the following conditions are necessary and sufficient:
* their intersection with \(G\) generates \(G\);
* they contain at least one representative of each of the \(P\) blocks \(A_j\times C_{s_i}\) or \(B_j\times C_{s_i}\) in every component;
* they meet the \(t\)-layer of each component \(i\in Z\).

Necessity follows because no product reaching one of these obligatory blocks can avoid a factor in it (and nonunits never produce units). For sufficiency, the generated units act transitively on each required block; a nonzero matrix produces its \(t\)-layer, \(BA\) produces the \(z\)-layer, and cross-component products produce \(\omega\). The units produce the identity by a positive word. An inclusion-minimal generating set therefore consists of a minimal generating subset of the units and one representative per obligatory block, with nothing else.

A subset of \(G\) generates iff its reduction modulo 2 spans \(\mathbb F_2^2\). In fact a pair of independent reductions lifts to an invertible two-column matrix over \(\mathbb Z/2^d\mathbb Z\), after lifting the first coordinates from \(\mathbb Z/4\mathbb Z\); projection then proves generation. Every inclusion-minimal generating set of \(G\) is such a pair. Each reduction has \(2^d\) lifts and there are 6 ordered bases, hence \(3\cdot2^{2d}\) unordered pairs. If \(b=|Z|\),
\[
r=2+CP+b,\qquad
h_r=3\cdot2^{2d}\Big(\prod_i2s_i\Big)^P\prod_{i\in Z}s_i,\quad h_j=0\ (j\ne r).
\]
In particular equality of the number and product of the selected sizes suffices to preserve \(r,h\). For \(s=(1,2,2,4)\), take \(Z_+=\{1,4\},Z_-=\{2,3\}\) in the indexing of that list; this gives T54–T55.

Writing \(U(z)\) for the generating-subset enumerator of the unit group, the full ordinary enumerator is
\[
\sum_jg_jz^j=U(z)\prod_i((1+z)^{2s_i}-1)^P(1+z)^{2D+1}\prod_{i\in Z}R_{s_i}(z),
\qquad R_s(z)=1-(1+z)^{-s}.
\]
The negative powers are formal power series; the whole expression is polynomial. The common factor has lowest degree \(2+CP\).

## 5. Matching initial coefficients with fewer components
Fix \(L\ge0\). The original T56 balancing polynomial is
\[
Q_L(X)=(X-1)^2\prod_{j=1}^{L}(2^j-X).
\]
The following reduced version suffices:
\[
\widetilde Q_L(X)=(X-1)^2\prod_{j\in J_L}(2^j-X),\quad
J_L=\{j:1\le j\le L,\ j=1\text{ or }j\text{ even}\}.
\]
Set \(d=\deg\widetilde Q_L\), write \(\widetilde Q_L=\sum_{\ell=0}^d a_\ell X^\ell\), and create \(|a_\ell|\) indexed components of size parameter \(2^\ell\). Positive coefficients define \(Z_+\), negative coefficients \(Z_-\). There are nonempty groups of both signs by \(\widetilde Q_L(1)=0\), and \(a_0>0\); hence only the positive selection contains size parameter 1. From \(\widetilde Q_L(1)=\widetilde Q'_L(1)=0\), the number of zero components and the sums of their exponents coincide in both cases; in particular their size products coincide. From \(\widetilde Q_L(2^j)=0\) the power sums of their size parameters coincide for \(j\in J_L\).

**Formal-series lemma.** Suppose two finite multisets of positive integers have the same cardinality \(b\), product, and power sums of orders \(j\in J_L\). Then the products of \(R_s(z)\) agree modulo \(z^{b+L+1}\).

**Proof.** Make the invertible formal substitution \(x=\log(1+z)\) in \(\mathbb Q[[z]]\), so \(R_s(z)=1-e^{-sx}\). The identity
\[
R_s(z)=sx\,e^{-sx/2}H(sx),\qquad H(y)=\frac{\sinh(y/2)}{y/2}
\]
holds in formal series; \(H\) is even and has constant coefficient 1. The product of the \(R_s\)'s equals
\[
x^b\Big(\prod s\Big)\exp\left(-\frac{x}{2}\sum s+\sum\log H(sx)\right).
\]
The formal logarithm of \(H\) is even, so up to degree \(L\) only the first and positive even power sums can occur (and at \(L=0\) none are needed). The normalized products therefore coincide modulo \(x^{L+1}\). Multiplying by \(x^b\prod s\) and substituting back proves the assertion. \(\square\)

Thus \(g_r,\ldots,g_{r+L}\) coincide; the complete vector \(h\) and the rank coincide by the earlier calculation. The reduced polynomial gives the same theorem with fewer components whenever \(L\ge3\). No optimality claim for the size of the construction is made. The earlier proof by bounding the polynomial degree of the logarithmic coefficients remains valid for the original \(Q_L\).

## 6. Query complexity under the promise
**Theorem.** For each fixed \(L\ge0\), the family of Sections 4–5 has identical \(\mathscr D,r,(h_j)_j,(g_r,\ldots,g_{r+L})\), but \(\mathcal I\) is nonempty iff \(Z=Z_+\). The deterministic worst-case complexity for deciding emptiness, membership of a fixed \(t\) with \(s=1\), or computing the whole set is exactly \(m=pq\); the optimal randomized worst-case expected complexity at per-input error \(\varepsilon<1/2\) is exactly \((1-2\varepsilon)(3m+1)/4\).

**Proof.** A varying query reveals a single bit in one component, since each bit determines \(4s_i^2\) table cells and no other entry varies. A complete scan of one fixed matrix reveals the promise case in \(m\) queries and determines all three answers. Along the fictitious all-zero answer path before \(m\) distinct bit queries, every matrix still has an unqueried bit. Both cases can therefore be completed by placing a 1 in one unqueried position of each required nonzero matrix. A correct deterministic algorithm cannot stop before \(m\) queries on that path. Some valid input reaches the first \(m\)-th query, by compatibility of the preceding transcript.

For the randomized lower bound, select either promise case with probability \(1/2\) and independently place a single uniformly random 1 in each nonzero matrix. Every bit has marginal probability \(1/(2m)\) of being 1. Fix the internal coins, suppress redundant or constant queries, and let \(d_0\) be the number of distinct queries on the all-zero answer path truncated at \(m\) (or at earlier termination). All valid inputs terminate for almost every choice of coins if worst-case expected cost is finite. Before \(m\) distinct queries, both cases remain possible, so the truncated path is well defined even if the invalid zero input does not terminate.

Let \(s\) be success probability under the distribution for these fixed coins. If \(d_0<m\), then a hit before the zero-path stopping point has probability at most \(d_0/(2m)\). On the no-hit event the output is fixed and can be correct on at most \(1/2\) of all inputs, since the cases are equiprobable. Thus \(s\le 1/2+d_0/(2m)\); the same bound is trivial if \(d_0=m\). The \(j\)-th query of the truncated path is reached whenever no earlier queried bit is 1, which has probability at least \(1-(j-1)/(2m)\). Consequently, writing \(T\) for query count,
\[
\mathbb E[T]\ge d_0-\frac{d_0(d_0-1)}{4m}
\ge \frac{3m+1}{4}\frac{d_0}{m}.
\]
Averaging over the coins, per-input success at least \(1-\varepsilon\) implies \(\mathbb E[d_0/m]\ge 1-2\varepsilon\), so the worst-case expected cost is at least \((1-2\varepsilon)(3m+1)/4\).

For the matching zero-error algorithm, choose one fixed representative matrix from each of the two complementary index sets \(Z_+,Z_-\), then choose between those two matrices with probability \(1/2\). Query its \(m\) bits in a uniformly random order until a 1 is found or all bits have been read. Exactly one representative matrix is nonzero. The zero matrix costs \(m\); for the nonzero one, with \(u\ge1\) ones, the expected position of the first 1 is \((m+1)/(u+1)\le(m+1)/2\) (by symmetry of the \(u+1\) gaps among the unmarked positions). Either outcome determines the case and therefore all three outputs. The worst-case expectation is \((3m+1)/4\), attained when the nonzero matrices each have just one 1. With probability \(1-2\varepsilon\) run this algorithm; otherwise guess one of the two case outputs uniformly without queries. This has per-input error \(\varepsilon\) and attains the lower bound. The same argument applies to Section 3, with one matrix in each complementary set. \(\square\)

For \(p=q=k\), the order is \(n=4Dk+2D+4\cdot2^d+1\), and \(m=k^2\). For each fixed \(L\) this gives \(\Omega(n^2)\) on this sequence of orders; the general table-scan upper bound is \(O(n^2)\). The hidden constants depend on \(L\). In particular the construction does not assert a uniform lower bound when \(L\) grows with \(n\).

## 7. Limits and relation to existing work
Always \(g_{n-1}=n-|\mathcal I(M)|\) for \(n\ge2\). Consequently the full ordinary enumerator, unlike its initial coefficients, resolves emptiness. The complete incidence of minimal generating sets also determines \(\mathcal I\), and is not granted here. Nor do we grant a minimum generating set or full cross-class transition graphs. In T49 rank reveals the answer, whereas Sections 3–5 eliminate that distinguishing statistic.

The irreducible-element criterion is classical (Schmid 1999; Berman–Bordalo 2002; Bergman–Slutzki 2002). Bergman–Slutzki, Prop. 3.8–3.9, concerns the element criterion and space complexity with explicit tables, not this side-information query model. Chang (2014), Eq. (10), Lemma 19 and Cor. 24, gives closely related hidden-entry constructions for table recovery. The binary restriction in the project's prior audit [Study 22](../docs/22-chang-fulltext-priority-comparison.md) yields a quadratic designated-element query lower bound without structural metadata, but in that restriction the principal ideals distinguish the case and the indispensable set never becomes empty. We therefore make no claim to inventing hidden-entry or OR lower bounds. Dörn–Thierauf study oracle tests for other algebraic properties, including associativity and whether a monoid is a group. Donoven–Mitchell–Wilson (2018), Prop. 3.3 and Cor. 3.4, give the structural criterion for removing a nonregular class, with a generating set supplied in Algorithm 2. This addresses the algebraic issue but does not give the query lower bound under our specified metadata. Finkelstein (2014) studies rank computation from explicit tables; Fleischer (2018) studies Cayley semigroup membership for a supplied subset and multiplication table. Lucchini–Thakkar study minimum generating sets in finite groups. Equal power sums are classical (Prouhet–Tarry–Escott); formal-series manipulations, orthogonal sums, and direct products are standard tools. The specific simultaneous preservation of the enumerators and structural data while retaining a quadratic oracle obstruction is the candidate contribution. Historical priority remains open.

Selected references (standard tools and prior work; no novelty claim for the Boolean query subproblem):
- J. Schmid, Nongenerators, genuine generators and irreducibles, *Houston Journal of Mathematics* **25** (1999), 405–416. Section 3, Fact 3.1.
- P. Lipparini, Non-generators in extensions of infinitary algebras, *Reports on Mathematical Logic* **57** (2022), 31–43, https://doi.org/10.4467/20842589RM.22.002.16659.
- F. Ergün, S. Kannan, S. R. Kumar, R. Rubinfeld and M. Viswanathan, Spot-checkers, *J. Comput. System Sci.* **60** (2000), 717–751. Section 4.4, cited by Chang.
- C. Bergman and G. Slutzki, Computational complexity of generators and nongenerators in algebra, IJAC 12 (2002), 719–735, https://doi.org/10.1142/S0218196702001127.
- J. D. Berman and G. H. Bordalo, Irreducible elements and uniquely generated algebras, Discrete Math. 245 (2002), 63–79, https://doi.org/10.1016/S0012-365X(01)00364-8.
- C.-L. Chang, Hardness of learning loops, monoids, and semirings, Discrete Applied Mathematics 162 (2014), 149–158, https://doi.org/10.1016/j.dam.2013.08.012.
- C. R. Donoven, J. D. Mitchell, W. A. Wilson, Computing maximal subsemigroups of a finite semigroup, J. Algebra 505 (2018), 559–596, https://doi.org/10.1016/j.jalgebra.2018.01.044.
- J. Finkelstein, Computing rank of finite algebraic structures with limited nondeterminism, https://arxiv.org/abs/1406.0879.
- L. Fleischer, On the Complexity of the Cayley Semigroup Membership Problem, CCC 2018, https://doi.org/10.4230/LIPIcs.CCC.2018.25.
- S. Dörn, T. Thierauf, The Quantum Query Complexity of Algebraic Properties, https://image.informatik.htw-aalen.de/~thierauf/Papers/quant-algebra.pdf.
- A. Lucchini, D. Thakkar, The minimum generating set problem, https://arxiv.org/abs/2306.07633.
- The Prouhet Tarry Escott Problem: A Review, https://doi.org/10.3390/math7030227.
See the earlier manuscript [T49](../papers/T49-query-lower-bound.md) for detailed references to Schmid and Pasini and the previous comparisons, and [second-round audit](reviews/P03-round2-2026-11-24.md) for the actual coverage and limitations.

## 8. Reproducibility and status
The original computational checks and proofs are in [Study 13](../docs/20-experiment-13-fixed-green-oracle-bound.md), [Study 14](../docs/24-experiment-14-fixed-rank-oracle-bound.md), [Study 15](../docs/25-experiment-15-generator-statistics.md). The new coefficient check is [t56-reduced-balancing.js](experiments/t56-reduced-balancing.js), covering L=0..8 (exact arithmetic through L=4, modular thereafter), not exhaustive monoid tables at large sizes. The formal-series lemma is a proof, not an inference from these tests. See the [adversarial review](reviews/P03-adversarial-review-2026-11-24.md) for the exact expected-cost refinement and independent finite checks, including 70 labelled multiplication tables and 18 exact dynamic-programming checks of the decision problem. This remains a conventional mathematical draft, not a Lean-verified theorem, and requires independent specialist review before submission.
