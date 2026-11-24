# Three generating sets recover the indispensable elements of every finite semigroup

**Research manuscript, draft v0.1 — 24 November 2026.** Authorship, affiliations and contribution statement to be confirmed by the project owner. Internal proof audit only; not submitted, externally refereed, or certified historically new.

## Abstract

Let S be a nonempty finite semigroup and let D(S) consist of the elements that belong to every semigroup generating set of S. Equivalently, x belongs to D(S) if every factorization x=ab has x as a factor. We prove that D(S) is the intersection of at most three inclusion-minimal generating sets of S. The bound is sharp, as witnessed by the Klein four-group. In particular, the minimum cardinality of an intersection of up to three inclusion-minimal generating sets determines the number of indispensable elements. The proof uses Green's relations, the Rees representation of regular principal factors, and elementary generation arguments in finite groups. It does not require the classification of maximal subsemigroups.

## 1. Definitions and main theorem

We write <A> for the set of all nonempty products of members of A, with <∅>=∅. All generating sets refer to semigroup generation, including when S has an identity. A generating set is inclusion-minimal if no proper subset generates S. We use D for the indispensable set (called E in the project); E often denotes idempotents in semigroup literature.

For every x∈S,
\[
x\in D(S)\iff \langle S\setminus\{x\}\rangle\ne S
\iff(\forall a,b\in S)(ab=x\Rightarrow a=x\ \text{or}\ b=x).
\]
The second equivalence follows because the complement is closed exactly when it has no such factorization. In particular D(S) is the intersection of all generating sets and, by finiteness, of all inclusion-minimal generating sets. The underlying notion of irreducible elements in universal algebra is established (Schmid [1], Berman and Bordalo [2]); it is not a new definition claimed here.

**Theorem.** Let S be a nonempty finite semigroup. There exist three inclusion-minimal generating sets A_1,A_2,A_3 of S, not necessarily distinct, such that
\[
A_1\cap A_2\cap A_3=D(S).
\]
Three is best possible.

## 2. Localizing generation

Use the usual Green relations R,L,J,H. The order of J-classes is induced by inclusion of principal two-sided ideals in S^1, where S^1 includes an identity for the purposes of defining ideals only. For each J-class J let U_J be the union of classes strictly above J. For any X⊆S,
\[
\langle X\rangle=S\ \Longleftrightarrow\
J\subseteq\langle U_J\cup(X\cap J)\rangle\quad\text{for every }J.
\tag{1}
\]
Indeed, every factor of a word representing an element of J lies in J or above it. Conversely, descending induction on the finite J-poset gives all of S. Call A⊆J locally generating if J⊆<U_J∪A>. Every locally generating set contains D(S)∩J: apply (1) to A∪(S\J), which generates S. The reverse follows by testing J\{x} for x∉D(S), again using (1).

Thus it suffices to choose three locally generating subsets of each J whose intersection is D(S)∩J. Uniting choices across classes yields three generating sets with intersection D(S). Deleting redundant elements from each preserves that intersection.

We use the standard stability fact that x J xy implies x R xy, and y J xy implies y L xy, and the Rees representation of regular principal factors (see Howie [3] or [4, §1]). These facts apply in all finite semigroups.

## 3. Local constructions

### 3.1 Nonregular classes

If J is nonregular, no product of two elements of J stays in J. This follows from the null principal factor theorem, or stability. If x,y∈J, write y=axb with a,b∈S^1. Each nonformal factor a,b lies strictly above J: their classes cannot be lower or incomparable by ideal monotonicity, and a factor in J would force a product of two members of J to stay in J. Thus every x∈J generates all J in the presence of U_J (formal identities can be omitted). If <U_J> meets J then it contains J and choose ∅ three times. Otherwise every singleton locally generates. Choose two distinct singletons when |J|≥2, or the same singleton when |J|=1. These intersections are exactly D(S)∩J by (1).

### 3.2 Regular classes with trivial structure group

Write the principal factor as a regular Rees 0-matrix semigroup over the trivial group, so the nonzero elements are pairs (i,λ) and
\[
(i,\lambda)(j,\mu)=(i,\mu)
\quad\text{if }p_{\lambda j}\ne0,
\]
with all other products below J in S. The support matrix has no zero row or column.

If both index sets have at least two members, there are two nonzero entries (λ_0,i_0) and (λ_1,i_1) in distinct rows and columns. This follows by picking entries in distinct columns; if they have the same row, choose an entry in another row, which differs in column from at least one of them. For k=0,1 let
\[
B_k=(\{i_k\}\times\Lambda)\cup(I\times\{\lambda_k\}).
\]
Each B_k generates J internally, by multiplying (i,λ_k) and (i_k,λ). Their intersection is T={(i_0,λ_1),(i_1,λ_0)}, whose members have different R- and L-classes. Set B_2=J\(T\D(S)). Every removed z∉D(S) has a factorization ab=z with neither factor z. Both factors lie in J∪U_J. The other member of T cannot be either factor, by stability and its differing R- and L-classes. Hence a,b∈U_J∪B_2 and B_2 locally generates. Since D(S)∩J⊆B_0∩B_1=T, the three-way intersection is D(S)∩J.

If one index set is a singleton, the internal product on J is a left- or right-zero product. Let B=<U_J>∩J. In a directed graph on J, place arrows x→ux and x→xu for u∈U_J whenever the result is in J. The elements generated in J from U_J∪A are exactly the vertices reachable from B∪A. Indeed, in a binary evaluation tree with final value in J, each intermediate value lies in J or above; a node with both children in J returns one child, one with both above and result in J belongs to B, and a mixed node follows an arrow. Conversely every such arrow is a multiplication. In the condensation of the graph, choose one representative from each source strongly connected component of the subgraph not reachable from B. These are precisely the inclusion-minimal local choices. Two such choices can use distinct representatives wherever a component has size greater than one. Their intersection consists exactly of the mandatory singleton representatives, hence equals D(S)∩J by (1). Repeat one choice to obtain three. This includes a singleton regular class.

### 3.3 Regular classes with nontrivial structure group

We first give a direct Rees generation lemma. Let J be represented by triples (i,g,λ) with structure group G and regular sandwich matrix P. Suppose A meets every H-class of J, and <A> contains one entire group H-class K=(i_0,G,λ_0), where p_(λ_0,i_0) is nonzero. Then <A> contains J. To see this, choose a∈A∩(i,G,λ_0) and b∈A∩(i_0,G,λ). For h ranging over K, ahb ranges over all (i,G,λ), since the middle coordinate has the form g_a p_(λ_0,i_0) g_h p_(λ_0,i_0) g_b, a bijective translate of G. Every intermediate product is in J. This proves the lemma without classifying maximal subsemigroups.

**Group fact.** A finite group G of order at least three has three nonempty semigroup generating sets with empty intersection. Choose an inclusion-minimal generating set X. If X={g}, then G is cyclic, g^(-1)≠g, and the singleton {g^(-1)} generates; repeat either choice. Otherwise |X|≥2 and the identity is not in X. For a∈X put X_a={a}∪{ax:x∈X\{a}}. It generates G since a^(-1) is a positive power of a. Moreover X∩X_a={a}: an equality ax=y∈X would either force a or x to be the identity, or make y redundant. Choosing distinct a,b∈X gives X∩X_a∩X_b=∅.

If |G|≥3, choose such a triple of generating sets in K. In every other H-class choose three nonempty subsets with empty intersection (two different singletons, with repetition, suffice). Unite the choices with the group choices in K to get three subsets of J. Each meets every H-class and generates K, hence generates J by the direct lemma. Their intersection is empty, so D(S)∩J=∅.

If |G|=2 and there is more than one H-class, regularity of P guarantees two distinct group H-classes K_1,K_2. In each H-class split its two elements between two subsets B_1,B_2, choosing the nonidentity of K_i in B_i for i=1,2. Both subsets meet every H-class and generate one entire group H-class by powers of its nonidentity. They generate J by the lemma and are disjoint. Repeat either one.

Finally, if |G|=2 and J itself is a group with identity e and nonidentity g, test ∅ first: if it locally generates, choose it three times. Otherwise {g} always locally generates. If {e} also locally generates, choose the two disjoint singletons; if not, {g} is mandatory and choose it three times. These three elementary cases exhaust the local options and give the required intersection. (No stronger characterization of this case is needed.)

This completes the local constructions. Applying (1) and deleting redundant generators proves the theorem.

## 4. Sharpness and consequences

The Klein four-group has exactly three inclusion-minimal generating sets, namely the pairs of distinct nonidentity elements. The intersection of any two is nonempty, whereas that of all three is empty. Thus the bound cannot be reduced.

If H is the family of all inclusion-minimal generating sets,
\[
|D(S)|=\min_{A,B,C\in\mathcal H}|A\cap B\cap C|.
\]
Repetitions are permitted (equivalently, use intersections of one, two, or three distinct members). Thus anonymous intersection cardinalities through order three determine |D|; they need not identify individual elements. No claim is made that arbitrary triples work, that all three sets have minimum cardinality, or that obtaining them from a multiplication oracle is cheap.

Equivalently, S\D admits a weak three-colouring of the hypergraph whose edges are the nonsingleton complements of maximal proper closed subsets. Indeed, assign each element outside D to a generating set omitting it; no such complement can be monochromatic, since a generating set cannot be contained in a proper closed subset. The converse follows by taking complements of colour classes and shrinking. This is a consequence, not an extra assumption.

## 5. Context and limitations

The maximal-subsemigroup classification of Graham, Graham and Rhodes [5], restated by Donoven, Mitchell and Wilson [4, Proposition 1.4], motivated the initial proof. The direct Rees argument in §3.3 replaces the use of that classification. It is consistent with the established theory of generating sets of completely 0-simple semigroups [6]. This manuscript makes no claim to a new notion of indispensable/irreducible element or a new version of Green/Rees theory. A targeted priority search did not identify an explicit statement of the three-generator-set theorem, but that is not proof of novelty. External specialist review is required.

The finite and associative hypotheses are essential to the proof. No result about arbitrary infinite semigroups or arbitrary nonassociative operations is claimed. Verification with finite tables is supplementary evidence, not the proof.

## References

1. J. Schmid, Houston Journal of Mathematics (1999), Fact 3.1, p. 409. [Accessible copy](https://citeseerx.ist.psu.edu/document?doi=9d7ec08426729e2b97d6978c59a2802b837ec3bb&repid=rep1&type=pdf). Full bibliographic fields to be verified before submission.
2. J. Berman and G. H. Bordalo, Irreducible elements and uniquely generated algebras, Discrete Mathematics 245 (2002), 63–79. https://doi.org/10.1016/S0012-365X(01)00364-8.
3. J. M. Howie, Fundamentals of Semigroup Theory, Oxford University Press, 1995, Chs. 2–3.
4. C. R. Donoven, J. D. Mitchell and W. A. Wilson, Computing maximal subsemigroups of a finite semigroup, Journal of Algebra 505 (2018), 559–596. https://doi.org/10.1016/j.jalgebra.2018.01.044; https://arxiv.org/abs/1606.05583.
5. R. L. Graham, N. Graham and J. Rhodes, Maximal subsemigroups of finite semigroups, Journal of Combinatorial Theory 4 (1968), 203–209. https://www.sciencedirect.com/science/article/pii/S0021980068800018.
6. R. Gray and N. Ruškuc, Generating sets of completely 0-simple semigroups, Communications in Algebra (2005). Bibliographic details to be checked against journal metadata before submission.

**Reproducibility:** [Study 18](../docs/28-experiment-18-triple-intersection-theorem.md), [Study 19 audit](../docs/29-study-19-triple-intersection-referee-audit.md), [GAP Smallsemi independent census](../experiments/verify_triple_intersection_smallsemi.g). The numerical corpus is not used to infer the theorem.

## Addendum: exact depth classification (Study 20)
A subsequent proof classifies depth three exactly by the existence of a whole group J-class isomorphic to the Klein four-group on which all higher elements that multiply its identity into the class act trivially. All other regular non-group classes admit two local choices with intersection equal to the indispensable part. See [Study 20](../docs/30-experiment-20-intersection-depth-classification.md). This stronger result is not yet integrated into the audited v0.1 theorem; it needs its own independent priority and proof audit.
