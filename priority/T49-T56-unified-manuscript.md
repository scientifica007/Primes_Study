# Quadratic multiplication-query complexity with prescribed generating-set statistics

**Working manuscript v0.6 — 24 November 2026.** Internal draft in the scientific-priority branch. Authorship and contributions remain to be confirmed. Neither submitted nor externally refereed. Historical novelty unresolved. Revised following an internal adversarial review (not independent peer review). This manuscript consolidates T49–T56 and includes the reduced balancing construction of the second priority round.

## Abstract
For a finite monoid \(M\), let \(\mathcal I(M)\) be the set of elements belonging to every generating set under nonempty-word generation. We study exact decisions concerning \(\mathcal I(M)\) when a labelled multiplication oracle is provided together with side information. For every fixed nonnegative integer \(L\), we construct families of monoids with identical labelled principal ideals, Green preorders, principal factors, within-class multiplication, unit-group actions, regular elements, idempotents, generating rank \(r\), the complete size distribution of inclusion-minimal generating sets, and the numbers of generating sets of sizes \(r,\ldots,r+L\). Nevertheless the deterministic worst-case query complexity of deciding whether \(\mathcal I(M)\) is empty is quadratic in the order along an infinite sequence of orders. On the promised families we also determine the exact bounded-error randomized worst-case expected cost. The construction encodes independent Boolean matrices in cross-class products and balances the generating-set enumerators of different promise cases. The result concerns specified side information, not full generating-set incidence or all generating-set counts. Section 9 strengthens the promise by prescribing an ideal, its complete Rees quotient, all actions on the ideal, and the multiplication within each proper principal ideal, and doubles the independent-bit count without increasing the carrier size.

## 1. Definitions and model
All semigroup words are finite and nonempty. In particular the known monoid identity is not a nullary operation. Write
\[
\mathcal I(M)=\{x:\ \forall a,b\in M,\ ab=x\Longrightarrow a=x\text{ or }b=x\}.
\]
The singleton complement of \(x\) is closed iff \(x\in\mathcal I(M)\); thus \(\mathcal I(M)\) is the intersection of all generating sets and, in the finite case, of all inclusion-minimal generating sets. Equal factors are permitted. Let \(g_j\) and \(h_j\) count, respectively, all generating subsets and inclusion-minimal generating subsets of cardinality \(j\). Let \(r\) be the least generating cardinality. 

The oracle returns \(ab\) at unit cost for a supplied ordered pair. The labelled carrier, identity, promise, and stated auxiliary information are free; all other computations are free. We distinguish deterministic worst-case queries from worst-case expected queries of a randomized algorithm whose error is at most \(\varepsilon<1/2\) on each promised input. A scan of the \((n-1)^2\) entries not involving the identity suffices for all three tasks: emptiness, specified-element membership, and output of the whole set. We make no claim about running time under other representations or about quantum complexity.

The structural metadata \(\mathscr D\) consists of the labelled unit group and both actions on the carrier, all principal left, right and two-sided ideals, labelled principal factors, the products within each Green \(\mathcal J\)-class, and the sets of idempotent and regular elements.

**Main result (informal).** Fix \(L\ge0\) and \(0\le\varepsilon<1/2\). On an infinite sequence of orders \(n\), there are promised labelled monoid families with the same \(\mathscr D,r,(h_j)_j,(g_r,\ldots,g_{r+L})\) on which emptiness of \(\mathcal I\), designated-element membership and recovery of \(\mathcal I\) have deterministic query cost \(m=pq\) and optimal randomized worst-case expected cost \((1-2\varepsilon)(3m+1)/4\). Here \(p=q\) gives \(m=\Theta(n^2)\) for fixed \(L\). The exact cost is a promise-family statement, not an exact formula for arbitrary monoids. Section 9 replaces (m=pq) by (m=2pq) on a larger promised family at the same order and with stronger side information.

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


## 9. Ideal-extension interpretation and parity-refined construction

The construction belongs to the classical theory of ideal extensions. In particular, Grillet and Petrich (1968, introduction, Definition 1.1 and Theorem 1.2) describe multiplication in an extension in terms of its ideal, Rees quotient, actions on the ideal, and the additional data usually described by a ramification function. Renshaw and Warhurst (2024, §1) recall the distinction between weakly reductive semigroups and those with interchangeable elements (elements having identical left and right translations on the semigroup). We do not claim novelty for these concepts.

Let \(K=\{t,z\}\) in Section 2. All products within \(K\) equal \(z\); in particular \(t\) and \(z\) induce identical translations on \(K\). The labelled Rees quotient \(M/K\), multiplication in \(K\), and all products \(ax,xa\) for \(a\in M,x\in K\) are independent of \(W\). This is precisely where the reconstruction ambiguity lies. For contrast, if an ideal \(K\) is weakly reductive, these three pieces of labelled data determine the whole extension: a product outside \(K\) is determined by the quotient, and a product inside \(K\) is determined uniquely by its left and right translations, which are the composites of the given translations. This elementary consequence of classical extension theory explains why the chosen ideal, rather than the ambient monoid, is not weakly reductive.

**Proposition 9.1 (exact basic extension fibre).** Fix the labelled carrier and the above three pieces of extension data of Section 2. There are exactly \(2^{2pq}\) associative multiplication tables compatible with them. They are obtained by replacing the Boolean matrix \(W\) by bits \(W_{ij,\delta}\) for \(\delta\in C_2\) and setting
\[
a_{i,u}b_{j,v}=
\begin{cases}
t & W_{ij,u+v}=1,\\
z & W_{ij,u+v}=0
\end{cases}
\]
with addition in \(C_2\). All other products remain as in Section 2.

**Proof.** The quotient fixes each product whose result is outside \(K\); the specified actions fix all products with a factor in \(K\). The only remaining products are \(AB\) and \(BA\), which must take values in \(K\). Since \(A\) is right-zero and \(ta'=za'=z\) for \(a'\in A\), associativity gives \(ba'=b(aa')=(ba)a'=z\) for all \(b\in B\), \(a,a'\in A\). For a unit \(g\) reducing to \(1\) modulo 2, the equality \((a_{i,u}g)b_{j,v}=a_{i,u}(gb_{j,v})\) imposes \(w(i,u+1,j,v)=w(i,u,j,v+1)\). Thus the value depends only on \(i,j,u+v\). Conversely every choice of these bits works: the pure nonunit triples in Section 2 have the same values, with \(AAB\) and \(ABB\) selecting the identical ordered pair of actual elements under both bracketings; the middle unit associativity identity follows from parity invariance, and the outer unit identities follow from the trivial left action on \(A\), trivial right action on \(B\), and fixed \(t,z\). This covers all triples. The identity is unchanged. Different bit arrays give different labelled tables. The original construction is the subfamily with \(W_{ij,0}=W_{ij,1}\). No assertion that all the resulting tables are pairwise nonisomorphic is made. \(\square\)

The principal ideals and other metadata of Section 2 are unchanged, since the fixed products \(at=t,tb=t,ba=z\) already ensure the stated ideals. Moreover the multiplication within every proper principal left, right or two-sided ideal is fixed: each is contained in \(A\cup K\), \(B\cup K\), or \(K\). No such ideal contains both \(A\)- and \(B\)-elements. The set \(\mathcal I\) is \(\{t\}\) exactly when all \(2pq\) bits vanish. A bit now determines two table entries. Hence the exact deterministic cost is \(2pq\) and the optimal randomized worst-case expected cost is \((1-2\varepsilon)2pq\), by Section 2.

**Theorem 9.2 (strengthened balanced family).** For every fixed \(L\ge0\), the family of Sections 4–5 may be constructed on the same labelled carrier, retaining all the original matching structural and generating-set statistics, with the following additional common data:
* the complete multiplication of the designated ideal \(K=\{\omega\}\sqcup\bigsqcup_i(\{t_i,z_i\}\times C_{s_i})\);
* the complete labelled Rees quotient \(N/K\), with the quotient map, and every product \(ax,xa\) for \(a\in N,x\in K\);
* the complete multiplication within each proper principal left, right and two-sided ideal.

With these data supplied, the deterministic worst-case query cost on the new promise family for emptiness, designated-element membership or recovery of \(\mathcal I\) is exactly \(2pq\). The optimal randomized worst-case expected query cost for per-input error at most \(\varepsilon<1/2\) is
\[
(1-2\varepsilon)\frac{6pq+1}{4}.
\]

**Proof.** Use Proposition 9.1 in each component before taking its direct product with \(C_{s_i}\). All zero/nonzero cases and the generation-block characterization of Section 4 are unchanged: the unit actions supply every representative of each obligatory block, so one nonzero bit suffices to produce the \(t\)-layer, whereas an all-zero array requires a generator there. The rank, \(h\), and ordinary enumerator formulas, and hence the balancing argument, remain valid. The order \(n\) is unchanged. Each variable product lies in \(K\) and has fixed cyclic coordinate, choosing \(t_i\) or \(z_i\). The multiplication within \(K\), the quotient, and all actions on \(K\) therefore coincide. All nonunit principal ideals are contained in one component (with the common absorbing element adjoined); by the explicit ideals of Section 2 lifted to the cyclic factors, none contains both an \(A\)- and a \(B\)-element in that component. Their internal multiplication is consequently fixed. The entire lattices of ideals as collections of labelled subsets also coincide, because each ideal is a union of principal ideals. In particular all products of elements from comparable \(\mathcal J\)-classes may also be given: both elements belong to the higher element's principal two-sided ideal when it is proper, and unit products are already supplied otherwise. This does not grant the multiplication within every proper nonprincipal ideal, or the ramification function itself. Each variable query reads one of \(2pq\) independent bits (each controls \(2s_i^2\) cells); the two complementary zero-array patterns are as before. Section 6 applies with \(m=2pq\), proving both exact costs. \(\square\)

For \(p=q=k\) this improves the deterministic lower bound to \(2k^2\) on the same order sequence \(n=4Dk+2D+4\cdot2^d+1\); it is not a claim of the best possible constant over all monoids.

All inclusion-minimal generating sets in the balanced family have size \(r\), so these monoids are *ubiquitous* in the terminology of Jonušas and Troscheit (2019). That property is established in the literature and is not itself a candidate contribution. The candidate is the joint preservation of the specified extension data and generating counts in a family with varying indispensability. The exact historical priority of the strengthened result remains unresolved.

Additional references:
- P. A. Grillet and M. Petrich, Ideal extensions of semigroups, *Pacific Journal of Mathematics* 26 (1968), 493–508, https://msp.org/pjm/1968/26-3/pjm-v26-n3-p09-s.pdf.
- J. Renshaw and W. Warhurst, Semilattices of stratified extensions, *Semigroup Forum* 108 (2024), 690–706, https://doi.org/10.1007/s00233-024-10447-5.
- J. Jonušas and S. Troscheit, Random ubiquitous transformation semigroups, *Semigroup Forum* 99 (2019), 655–678, https://doi.org/10.1007/s00233-018-09992-7.

Reproducibility: [parity-extension audit](experiments/t56-parity-extension-audit.js) checks 292 basic and 210 balanced labelled tables (including all triples, labelled ideals, the additional extension data, indispensable elements, obligatory-block complements and explicit generating witnesses). These finite checks do not replace the proofs. See the [construction priority report](reviews/P03-ideal-extension-priority-2026-11-24.md) for the literature coverage and limits. Section 9 is an internal extension of the draft, not a peer-reviewed or formally verified result.


## Related extremal note (24 November 2026)

The [extension-freedom research note](reviews/P03-extension-freedom-extremal-2026-11-24.md) distinguishes raw fibre cardinality from query complexity. It gives an asymptotically sharp leading-order bound for raw extension capacity, and proves a sharp deterministic upper bound for designated-element membership under labelled extension and principal-ideal metadata. The latter sharpness example does not preserve rank or change emptiness; it therefore does not establish an optimal constant for Theorem 9.2. This is separate, internally checked work with unresolved historical priority.


## Related shared-target construction (24 November 2026)

The [shared-target research note](reviews/P03-shared-target-extremal-2026-11-24.md) proves a stronger family with a single shared product rectangle, retaining the prescribed statistics and strengthened ideal-extension metadata. For size parameters S=max(s_i), D=sum(s_i), b=C/2, it has n=2Sp+2q+4S+D+1, exact deterministic cost 2pq-b+1 and optimal randomized worst-case expected cost (1-2ε)(2pq+1)/(b+1). At L=0 the deterministic leading coefficient improves from 1/648 to 1/32 on the respective order sequences. The global optimum is still open. This is a separate internally checked result with historical priority unresolved.


## Related dependency-graph upper bound (24 November 2026)

The [dependency-graph research note](reviews/P03-dependency-upper-bound-2026-11-24.md) proves a universal deterministic upper bound of floor(a(a−1)/2) for emptiness under the same strengthened metadata, where a counts nonunits outside the designated ideal. For c ambiguous targets, the bound is half the size of their union of possible witness cells, at most floor(min(a(a−1), c floor(a²/4))/2). For a single target with no indispensable elements outside the ideal, floor(a²/8) is sharp along a sequence in the parity-refined T49 family without prescribed rank. It does not resolve the optimal coefficient under the full fixed-statistic promise. Separate internal proof and finite checks; priority unresolved.


## Related two-sided dependency refinement (24 November 2026)

The [two-sided dependency research note](reviews/P03-two-sided-scc-upper-bound-2026-11-24.md) proves that two-cell sink SCCs have disjoint sets of first and second coordinates, and that each reversed cell of such a sink, if relevant, lies in an SCC of size at least four. Charging reverse cells yields the universal deterministic upper bound floor((a(a−1)+floor(a²/16))/3), with leading coefficient 17/48, under the same metadata including the prescribed statistics. Two-cell sinks still occur in the balanced family, even with all exact unary functional dependencies. The optimal global coefficient remains open. This is separate internal mathematical work, not historically certified or externally reviewed.


## Related joint-statistics and composite-modulus refinement (24 November 2026)

The [joint-statistics research note](reviews/P03-joint-statistics-constraints-2026-11-24.md) proves a necessary-and-sufficient moment signature of generating counts in the null-ideal setting, zero-query recovery criteria for the number of missing singleton classes, and a joint query/inference rule using integer-matrix column bases. It generalizes shared targets to sizes dividing any common modulus S and computes the least such balancing modulus for L=0..10. The leading lower coefficient at L=6 improves from 1/512 to 1/192, while L=0 remains 1/32. These conditional results do not improve the general 17/48 upper bound, and their historical priority and external verification remain open.


## Related general-ideal statistic factorization (24 November 2026)

The [general-ideal research note](reviews/P03-general-ideal-statistics-2026-11-24.md) removes the null-ideal hypothesis from the joint-statistics result: the labelled local generating families of regular J-classes are fixed by the quotient and actions on the ideal. Recover idempotents by squaring representatives of their bitranslations, then recover regular elements using those idempotents. The ordinary and minimal enumerator factorization, exact moment signature, and zero-query support-size criteria extend to arbitrary designated ideals under D*. Class-witness dependency graphs can also be combined with joint count inference. No better universal coefficient than 17/48 is established in this note. Four nonnull-ideal tables are exhaustively checked on 65536 generating-subset candidates; external review and priority remain unresolved.


## Related one-third bound and joint-statistic omission (24 November 2026)

The [one-third research note](reviews/P03-one-third-joint-sink-bound-2026-11-24.md) strengthens the deterministic universal upper bound in D* to floor(a(a−1)/3) using the geometry of all three charged coordinate blocks of two-cell sinks. With the prescribed statistics, d=1+|J_L| additional sink queries may be omitted (clipped at zero), by equal-cardinality multiset uniqueness under product and moment constraints. The leading coefficient for fixed L is 1/3, not a claim of optimality; L=0 retains the 1/32 lower coefficient along an infinite sequence. Internal proof and reproducible checks, not external review or certified historical priority.


## Related Green-saturated three-cell refinement (24 November 2026)

The [three-cell Green-saturation note](reviews/P03-three-cell-green-sink-bound-2026-11-24.md) adds reversible known translations between L-equivalent row coordinates and R-equivalent column coordinates. All two- and three-cell sink SCCs in the augmented graph lie in a common oriented rectangle X×Y with disjoint X,Y, giving the universal geometric bound floor((a(a−1)+floor(a²/4))/4), and the same statistical omission of d=1+|J_L| applies. The leading upper coefficient is now 5/16. An explicit 98-table balanced family for L=0 contains genuine three-cell sinks even after augmentation and under arbitrary exact unary dependencies. The lower coefficient 1/32 remains; global optimality, historical priority and external verification are unresolved. The original manuscript version remains v0.6; this is a linked independent development, not a fully integrated proof.


## Related exact small-sink unit orbits and graph-density obstruction (24 November 2026)

The [unit-orbit and density note](reviews/P03-small-sink-unit-orbits-density-2026-11-24.md) classifies all two- and three-cell sinks in the Green-saturated graph as balanced unit orbits, with both projections injective. The middle transfer factor must be a unit, since otherwise the supplied proper principal ideal table would already determine the product. Disjoint orbit-size classes give a weighted charging bound and conditional leading coefficient 1/4 when no two-cell sink occurs. A balanced family at L=0 has a=4m+22, n=4m²+2m+47 and q=5m²−2m+6, so 5/16 is sharp for graph counts relative to a even with prescribed statistics, but the actual deterministic decision cost of that family is exactly two. The global coefficient relative to n remains between 1/32 and 5/16, with priority and external verification unresolved. This is a linked independent development, not yet an integrated revision of manuscript v0.6.


## Related two-sided target-orbit construction and matching omission (24 November 2026)

The [two-sided target-orbit and matching note](reviews/P03-two-sided-target-orbits-matching-2026-11-24.md) replaces the internal parity and one-sided target expansion of the preceding shared rectangle with two outer actions: for S=UV, U,V≥2, each target size splits into divisors of U and V. The new monoids have order Up+Vq+g+D+1, pq independent label positions, exact deterministic decision cost pq−b+1, and optimal bounded-error expected randomized cost (1−2ε)(pq+1)/(b+1) on the balanced promise. Taking Up=Vq doubles the fixed-L leading lower coefficient to 1/(4S), in particular 1/16 at L=0. The global deterministic limsup interval is now [1/16,5/16] for L=0. The same note gives a sufficient matching criterion for joint omission of sink representatives based on the possible class labels and competing present-class sets. The corrected executable audit covers 1320 tables, with exact finite decision-tree costs in three L=0 cases, plus a separate abstract matching audit. This is an independently linked development, not a fully integrated revision of manuscript v0.6; historical priority and external verification remain open.


## Related stabilizer witness localization and universal quarter bound (24 November 2026)

The [stabilizer-localization note](reviews/P03-stabilizer-witness-localization-quarter-bound-2026-11-24.md) proves that for each ambiguous indispensable element t the two fixed stabilizer submonoids P_t={u:ut=t} and Q_t={v:tv=t} avoid K. Their minimal nonunit right and left ideals are ambient Green R(e) and L(f) classes of idempotents. Every nonself witness xy=t transfers to (ex)(yf)=t in that fixed rectangle of regular exterior factors. Counting the distinct L-first/R-second class pairs across the selected rectangles, with a separate budget for singleton sides, gives the deterministic bound floor((a_reg+c)^2/4) for full E recovery, where c counts ambiguous singleton targets and a_reg counts regular exterior nonunits. In particular emptiness costs at most floor((n−4)^2/4) for n≥4, and zero at smaller orders; this does not require generating statistics. The L=0 global limsup interval is now [1/16,1/4]. The old 5/16 graph-count obstruction in a remains valid and the new coefficient is not asserted sharp. The executed audit covers 148 labelled tables and 868 witness transfers, including a nonnull ideal and nonregular exterior elements. Historical priority and external verification remain open; this is a linked independent development, not yet an integrated revision of v0.6.
