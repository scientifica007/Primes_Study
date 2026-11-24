# General ideal factorization: invariant regular-class generating families
24/11/2026. Internal mathematical development continuing [joint-statistics constraints](P03-joint-statistics-constraints-2026-11-24.md). No new T numbers, no main modification, no external refereeing or formal proof certificate. Historical priority unresolved.

## 1. Statement and data
Let M be a finite labelled monoid with a designated nonempty proper ideal K. In the model D* we know the full labelled Rees quotient M/K with quotient map, every product with at least one factor in K, all labelled principal ideals (hence Green J-classes and their order), unit actions and proper principal ideal tables. As before generation is by nonempty words. Let F be a nonempty family of compatible associative tables, possibly restricted by prescribed generating statistics. Computation is free.

**Theorem.** For every regular J-class J of M, the entire labelled family
\[
\mathcal L_J=\{X\subseteq J:J\subseteq\langle U_J\cup X\rangle\},\qquad U_J=\{x:J_x>J\},
\]
is determined by D*, without multiplication queries. The same holds for every class outside K. Therefore all variation in the local generating families is confined to nonregular classes inside K, and each such class contributes either an unrestricted choice or a compulsory nonempty choice. No nullity hypothesis on K is needed.
This theorem concerns generation of the entire class; the set of individual elements generated from above need NOT be invariant.

## 2. Word bitranslations and recovery of regular classes
For a fixed element x define L_x(k)=xk and R_x(k)=kx for k∈K. All these maps are given. Put τ(x)=(L_x,R_x), with multiplication of pairs (L,R)(L',R')=(L∘L', R'∘R). Associativity makes τ a homomorphism into the finite monoid of pairs of transformations of K. This homomorphism and the quotient homomorphism are common labelled data. In particular the two images of any nonempty word are determined by its letters, independently of the compatible table. When the quotient value is nonzero, the word's value itself is known. When it is zero, the value lies in K and its two translations are known.
If e∈K is idempotent and z∈K has τ(z)=τ(e), then
\[
z^2=ze=e^2=e,
\]
using first R_z=R_e and then L_z=L_e on K. Thus a word whose bitranslation is τ(e) and quotient value zero produces e on squaring, in every compatible table. In fact the quotient-zero restriction can be dropped for this assertion when the word value z is outside K only if additional information guarantees it lies in K; retain the restriction in our algorithm.
For a regular J⊂K and t∈J there is an idempotent e∈J with et=t. Explicitly choose an inverse b∈K of t: if tct=t, take b=ctc∈K, and e=tb, so et=t, e²=e, and e J t. If z∈K with τ(z)=τ(t), then ez=et=t.
Now assume that X is locally generating in one compatible table M1. For each e,t∈J choose positive words over U_J∪X yielding e and t in M1. In M2 their evaluations lie in K with the same translations. Squaring the word for e produces e in M2. Multiplying e by the word for t produces t in M2. Therefore X is locally generating in M2, and symmetry proves invariance.
Equivalently the following is a direct zero-query algorithm, not merely an enumeration of compatible tables. In the direct product of the known quotient and transformation-pair monoids, generate the subsemigroup of the images (quotient(x),τ(x)) of U_J∪X. Then X belongs to L_J iff this subsemigroup contains (0,τ(t)) for every t∈J. Necessity is immediate; sufficiency uses the preceding idempotent recovery argument, since e∈J also has its signature present. For J outside K, generation of its elements is decided from nonzero quotient outputs alone. All these computations can be large, and no polynomial-time claim is made.
If K is regular, classical weak reductivity already implies every unknown product is fixed. The result here allows K to be genuinely nonregular and nonnull.

## 3. General factorization of generator enumerators
Recall the finite Green-class relative generation argument (T61/T69). A set X⊆M generates M iff for each J its intersection X∩J belongs to L_J. Necessity: every letter of a word producing a J element is in J or strictly above J. Sufficiency: descending induction in the finite J-poset. Inclusion-minimal global choices are exactly unions of inclusion-minimal local choices, by this equivalence.
For a nonregular J, a product of two J-elements cannot remain in J. If J meets the closure of U_J then that closure contains all J: each t in J is obtainable from a single member x of J by left/right multipliers in U_J (or omitted identities), since t=axb and the multipliers, when present, cannot be in J by nonregularity and cannot lie below J by ideal monotonicity. If no such initial hit occurs, any one member of J suffices and a generating set must meet J. Call J missing in the latter case. Equivalently a missing class has no product of two strictly higher elements in J (first entry into J in a binary evaluation tree). Thus its local ordinary enumerator is (1+w)^|J| if not missing and (1+w)^|J|−1 if missing; the respective inclusion-minimal enumerators are 1 and |J|w.
Take the known product of ordinary local enumerators over all exterior and regular interior classes as G_fix(w), and the corresponding product of inclusion-minimal enumerators as H_fix(w). Let D be the sum of sizes of nonregular J-classes inside K. The invariant known contribution is G_*(w)=G_fix(w)(1+w)^D, H_*(w)=H_fix(w), r_* = least degree of G_fix. With Z the set of missing nonregular interior classes, b=|Z|, P=product of |J| for J∈Z,
\[
r=r_*+b,\qquad H(w)=H_*(w)P w^b,\qquad
G(w)=G_*(w)\prod_{J\in Z}\bigl(1-(1+w)^{-|J|}\bigr).
\]
These formulas are exactly the generalization of the null-ideal formulas. The known polynomials here may be nontrivial even within K. Classes with fixed missing status can optionally be absorbed in the known factors (using their own local enumerators).
By the intersection definition of indispensability, for the invariant local families the contribution to E is their local intersection. Denote the union of these known contributions by E_*. A missing nonregular class contributes exactly its singleton member if it has size one, and otherwise none. Nonmissing classes contribute none. Therefore
\[
|E(M)|=|E_*|+m_1,
\]
where m_1 counts missing singleton nonregular classes inside K. If E_* is nonempty, the emptiness decision is immediate, although the cardinality may still be unknown.
The moment-signature proof of the preceding note carries over verbatim: divide by the known ordinary factor after its initial monomial, recover b from r−r_*, P from h_r / h^*_(r_*) (equivalently from g_r), normalize and substitute x=log(1+w). The formal logarithm has terms −p_1 x/2 and B_(2j) p_(2j) x^(2j)/(2j(2j)!), with nonzero even Bernoulli coefficients. Thus the statistics r,H,g_r,...,g_(r+L) are equivalent to the count b, product P and power sums for j=1 or positive even j≤L, for fixed structural data. H has no additional varying information. This is a general finite-monoid theorem in D*, not just null ideals.
All row-space, bounded-integer feasibility and support-size criteria in the previous note therefore extend. In particular with h distinct unresolved nonregular interior class sizes, h≤2+|J_L| suffices to recover |E| without oracle queries (h≤2 at L=0, h≥3 requires L≥max(1,2h−6)). Sharpness as a uniform support-size threshold persists because the null-ideal constructions are special cases. These are information-query statements; computing the known local polynomials can require exponential work.

## 4. Joint inference and class-witness dependency graph
The column-basis procedure in the preceding note now applies to arbitrary K: use the count, prime valuations of P, and prescribed moments. If rank is deficient, select a column basis containing the size-one column when present and ascertain missing multiplicities of sizes not in that basis. Solve the exact integer/rational system for the remaining counts; if singleton count alone is forced earlier, stop. Class status is decided from known products and possible first-entry cells from strictly higher factors. More generally optimize the selected set of sizes for the singleton coordinate, not necessarily a full column basis.
There is a further reduction in query cost using the dependency graphs of the preceding notes. Assume E outside K is empty; otherwise emptiness is immediate. Let C be any chosen collection of nonregular interior classes whose missing status is ambiguous over the compatible family. Define V_C as the set of ordered cells (x,y) with x,y∈M\(G∪K) which in some compatible table have xy∈J for a J∈C and J_x,J_y>J. All these cells are variable, since in another compatible table J is missing. Neither units, K factors nor comparable J-class pairs need queries. Use all two-sided witness-induced dependency edges, as in the preceding SCC note.
**Closure lemma.** This graph stays inside V_C. For a cell possibly hitting J from above, use x=uv with u,v≠x; both factors have class ≥J_x>J. If vy is outside K and equals the known w, then xy=uw and w must also be strictly above J (it is outside K and its class is ≥J). The dependent cell is another possible first-entry cell for J. If vy∈K, xy=L_u(vy). In a table where xy∈J, ideal monotonicity puts vy in J or above. If strictly above J, the known product u(vy) would hit J from two strictly higher elements in EVERY compatible table, contrary to the existence of a missing-J table. Thus vy∈J, and (v,y) is again a first-entry cell. The right-factor argument is symmetric. Each edge changes at least one coordinate, so there are no loops and every vertex has an outgoing edge.
Query one representative of every sink SCC, recover all relevant cell values by known functions, determine the selected class statuses, and solve the moment equations to infer the singleton count. This combines joint statistic inference with associative dependencies, even when the queried classes are not singletons. The geometry and reverse-cell charging proof for two-cell sinks uses only closure under both sets of witness-induced edges, so the count is bounded by
\[
\min\left\{
\left\lfloor|V_C|/2\right\rfloor,\ 
\left\lfloor (|V_C|+\lfloor a^2/8\rfloor)/3\right\rfloor,\ 
\left\lfloor(a(a-1)+\lfloor a^2/16\rfloor)/3\right\rfloor
\right\},
\]
where a counts nonunits outside K. The earlier target-rectangle bound a²/4 per target does not automatically extend to nonsingleton classes. Take the minimum over this and the direct singleton strategy. The actual graph cost may be smaller. No new universal coefficient strictly below 17/48 is proved: candidate output sets of different sizes may overlap in the same cells, and the integer constraints do not yet bound their union better. At L=0 the old lower coefficient 1/32 remains unchanged.

## 5. Explicit nonnull-ideal counterexample to a stronger invariance statement
Use G=C4, A={a_0,a_1} right-zero, B={b_0,b_1} left-zero, and K a five-element regular Rees 0-matrix semigroup R over the trivial group with 2×2 sandwich matrix
\[
P=\begin{pmatrix}1&1\\0&1\end{pmatrix}
\]
plus a duplicate d of t=(0,1). Inside K evaluate products via the projection d↦t into R; d is nonregular, t regular but not idempotent. Let e=(0,0), f=(1,1), so ef=t,fe=0. Nonunit products involving A/B and R are computed by replacing A by e, B by f. Set A d=d, d B=d; all other products involving d follow the projection rule. Keep A×A right-zero, B×B left-zero, BA=0. AB takes t or d according to either of two parity bits. Units act as in parity T49 (fix K). This gives four labelled tables on 14 elements; the script checks associativity exhaustively rather than relying on an unverified general claim about this example. They have common D*, including all labelled ideals and proper principal ideal tables. Both t and d occur in fixed ideals even when AB changes.
The regular class J=R\{0} contains four elements. When every AB output is d, no element of J is generated from U_J; when some output is t, exactly t is generated from U_J. Nevertheless the local generating family of J is identical in all four tables: it consists of all subsets containing (1,0). Its local ordinary polynomial is w(1+w)^3 and minimal polynomial w. The example refutes invariance of individual elements reached from above, while supporting invariance of full local generation. The regular indispensable element (1,0) is common, so E is never empty in this example; it is not a fixed-statistics lower bound for emptiness. If all AB outputs are t, d becomes missing and indispensable; otherwise d is not missing. 
This illustrates why the proof needs recovery of idempotents and then regular elements, rather than claiming every word evaluation is fixed.

## 6. Actual verification
[Executable JS](../experiments/nonnull-ideal-regular-invariance-audit.js), executed in this turn. Four tables, each n=14. Checked all 4×14³=10976 associativity triples, identity, equality of labelled left/right/two-sided ideals, unit actions, quotient, actions on K, internal tables of all proper principal ideals, idempotence and regularity. Computed all local generating families and tested the signature criterion for each regular interior class and local subset. The script compares available τ signatures from actual closure with the generating criterion; by homomorphism this is the same image closure computed directly from seed signatures. 
Exhaustively enumerated all 2^14=16384 subsets per table, total 65536 subset classifications. Computed both ordinary and inclusion-minimal enumerators directly (single-element deletion test), compared with the product of local polynomials. All checks passed. 
| parity array (decimal) | regular J elements reached from above | E size | r | h_r |
|---:|---|---:|---:|---:|
|0|none|1|4|8|
|1|t|1|4|8|
|2|t|1|4|8|
|3|t|2|5|8|
The first three share full ordinary and minimal enumerators; the fourth differs as predicted by the missing singleton. The SCC closure lemma of Section 4 is analytic in this round; no new computational test of the class-witness graph is claimed. No GAP/Lean/CI run.

## 7. Priority scope
Actual web searches on 24/11/2026:
- semigroup ideal extension interchangeable elements regular elements weakly reductive translational hull regular semigroup
- finite semigroup maximal subsemigroups regular J class generation higher J classes Donoven Mitchell Wilson
- semigroup generation local generating sets Green J classes nonregular maximal subsemigroups
Inspected indexed abstracts/excerpts, not new full-text PDF analyses:
- Encyclopedia of Mathematics, Extension of a semi-group, https://encyclopediaofmath.org/wiki/Extension_of_a_semi-group : common homomorphism to translational hull is classical.
- Renshaw and Warhurst, Semilattices of stratified extensions (2024), https://link.springer.com/article/10.1007/s00233-024-10447-5 : interchangeable elements and weak reductivity.
- Graham, Graham, Rhodes, Maximal subsemigroups of finite semigroups (1968), https://www.sciencedirect.com/science/article/pii/S0021980068800018 : localization in one J-class and nonregular class removal.
- Donoven, Mitchell, Wilson, Computing maximal subsemigroups of a finite semigroup (2018), https://www.sciencedirect.com/science/article/pii/S0021869318301236 : regular classes and maximal subsemigroups using Green/Rees structure (full text reviewed in earlier notes, not re-read here).
The translation homomorphism and class decomposition are known tools. The specific invariance of labelled local generating families under the stated extension metadata, consequent general moment equivalence and combined query algorithm are internal deductions. No exact match in this limited search, which does not certify novelty; no direct specialized database search. The evidence is not sufficient for a historical priority claim.
Next: use the general factorization to bound the geometry of selected class-witness regions quantitatively, exploit simultaneous counts in adaptive search, and try constructions balancing with lower orbit cost. Before publication, consolidate and independently audit the growing sequence of upper/lower bound notes.
