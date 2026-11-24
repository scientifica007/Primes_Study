# Stabilizer witness localization and a universal one-quarter query bound
24 November 2026. Internal mathematical development continuing the [two-sided target-orbit and matching note](P03-two-sided-target-orbits-matching-2026-11-24.md). Historical priority unresolved; no external referee or formal proof certificate. No new T numbers; main untouched.

## 1. Model, statement, and distinctions

Use the same finite labelled monoid multiplication-oracle model D*: designated nonempty proper ideal K, quotient M/K and its map, all products with a factor in K, labelled principal left/right/two-sided ideals, unit actions and internal tables of proper principal ideals. Let G be the unit group, A=M\(G union K), a=|A|, and let A_reg consist of the regular elements of A, a_reg=|A_reg|. We allow any nonempty compatible family F, with or without T56 statistics. Computation on the family is free; this is not a running-time claim. Generation uses nonempty words.

Call t ambiguous when it belongs to E in some compatible table and not in another; let c be the number of ambiguous elements. The prior results imply that all ambiguous elements are nonregular singleton J-classes in K, so c<=|K|-1. We reprove the necessary facts below. E outside K and the nonambiguous contributions can be decided with zero queries by compatible-table enumeration. The theorem here determines the FULL labelled set E, and hence also emptiness and cardinality.

**Theorem.** The whole set E(M) can be recovered using at most
\[
\left\lfloor\frac{(a_{\rm reg}+c)^2}{4}\right\rfloor
\]
multiplication queries. For c=0 no queries are needed. There is an explicit finer bound in terms of Green class counts and chosen local witness rectangles (Section 4). In particular for emptiness, since |G|<=2 forces E nonempty, all nontrivial cases satisfy |G|>=3, and the cost is at most floor((n-4)^2/4) for n>=4; for n<4 it is zero. For the full E task the corresponding uniform bound is floor((n-2)^2/4) (n>=2). In either case the coefficient in terms of n is 1/4. For any fixed L, the bound applies when the T56 statistics are supplied, because these only restrict F.

This is a new universal upper bound in terms of n, NOT an unconditional a^2/4 bound and NOT a smaller universal count of sink SCCs in the old graph. In particular the sharp 5/16 sink-count obstruction in terms of a from the [unit-orbit note](P03-small-sink-unit-orbits-density-2026-11-24.md) is unaffected. Combine this new algorithm with previous applicable query bounds by taking their minimum. No new lower bound is claimed. At L=0 the global deterministic limsup coefficient in n is now in [1/16,1/4]. We do not assert the existence of a limit or sharpness of the new upper coefficient.

## 2. Ambiguous elements and their fixed stabilizers

Fix an ambiguous t. Choose compatible tables M0 with t indispensable and M1 with a nonself witness xy=t. The witness must have x,y in A: products involving K or units are supplied, and products with result outside K are supplied. The latter also implies t lies in K. The two-sided translations on K of the product xy are determined by x and y and their supplied actions. In M0 put z=xy, so z is in K and differs from t. Then z and t have the same left and right translations on K. In particular z^2=t^2; if t were idempotent this would contradict indispensability in M0. If t were regular, choose b with tbt=t and e=tb in K. Then e is idempotent, e!=t, et=t and ez=t by equality of right translations on K, again impossible in M0. Thus t is nonregular. If some z'!=t were J-equivalent to t, write t=u z' v. In a finite monoid a nonregular J-class has no product of two of its members remaining in it. Hence neither u nor v can be in that J-class; if u z'=t use this two-factor witness, otherwise use (u z')v. This contradicts indispensability. Thus the J-class is {t}. These arguments agree with the earlier general-ideal analysis; no new claim for those known steps.

For every possible witness xy=t the fixed principal ideals give t in xM and in My even in M0. Since x,y differ from t, indispensability in M0 forces xt=t and ty=t. Those products are supplied and hold in every table.

Define the fixed stabilizer submonoids
\[
P_t=\{u\in M:ut=t\},\qquad Q_t=\{v\in M:tv=t\}.
\]
They contain the identity (indeed all units since J_t is singleton), and are closed by associativity. Neither meets K. To see this, suppose p in K with pt=t. Since t is not idempotent, p!=t. In M1, (px)y=t and px is a supplied member of K. If px=t, the fixed product px itself is a nonself witness in M0. Otherwise (px)y is a fixed nonself witness in M0. Both contradict indispensability there. The proof for Q_t is dual. This uses ambiguity and the existence of a witness, not merely t being nonregular.

Consequently P_t and Q_t are fully known labelled monoids: all their internal products stay outside K and are given by the quotient. They each contain a nonunit (x or y). The subsets of nonunits are ideals of these submonoids, since in a finite monoid a product that is a unit has both factors units.

## 3. Localization in regular exterior Green classes

In P_t choose a minimal nonempty right ideal I_t contained in its nonunits, and in Q_t a minimal nonempty left ideal J'_t contained in its nonunits. Both can be found without queries: minimize the size of pP_t over nonunit p, and of Q_t q over nonunit q. This gives minimal nonempty one-sided ideals under inclusion. A finite nonempty one-sided ideal is a subsemigroup and contains an idempotent, so choose e in I_t and f in J'_t with e^2=e and f^2=f. Minimality yields eP_t=I_t, Q_t f=J'_t, and for every u in I_t, v in J'_t, uP_t=I_t and Q_t v=J'_t.

**Lemma (ambient Green classes).** I_t=R_M(e) and J'_t=L_M(f).
For u in I_t, uP_t=eP_t implies u R_M e. Conversely if u R_M e, then uM=eM contains t because et=t. In M0, u is outside K and distinct from t, so indispensability forces ut=t. Thus u in P_t; also u=e w for some w, hence eu=u. Consequently u lies in eP_t=I_t. The dual argument proves the L-class equality. All these classes consist of regular exterior nonunits: e and f are idempotents, and if u R e then e=u v, u=e w imply u v u=e u=u; dually for the L-class. Their sizes and memberships are supplied. No additional regularity assumption on K or on A is imposed.

**Localization theorem.** For each compatible table,
\[
t\notin E(M)\quad\Longleftrightarrow\quad
\exists x'\in R_M(e),\,y'\in L_M(f): x'y'=t.
\]
Indeed any nonself witness xy=t has x in P_t and y in Q_t. Hence ex in eP_t=I_t and yf in Q_t f=J'_t, and
\[
(ex)(yf)=e(xy)f=etf=t.
\]
Conversely any localized witness has both factors outside K and is a nonself witness. The transfer itself is known because the stabilizer multiplications are supplied. Thus one fixed rectangle per ambiguous t suffices. The rectangle is chosen from the metadata and ambiguity set, not from the unknown actual table. In particular all ambiguous singleton targets can be tested using only products of regular exterior nonunits, even when witnesses involving nonregular factors exist. The localization theorem does not say that every cell in the rectangle is a possible witness; impossible cells can be removed by enumeration.

For each t one can choose the minimum-cost pair of such minimal ideals, or any pair for the bound. Our proof uses minimal one-sided ideals of the stabilizers, not an assumed common minimal ideal of M. No appeal to Green stability within the submonoids is required.

## 4. Global counting without assuming disjoint supports

Two cells with L-equivalent first coordinates and R-equivalent second coordinates have mutually J-equivalent outputs, by associativity and the mutual divisibilities of coordinates. For example x'=u x and x=v x' imply x'y=u(xy), xy=v(x'y), and similarly for y R y'. Therefore if either output is the ambiguous singleton t, so is the other. The truth of each singleton-target predicate is constant on the entire rectangle L_M(x) × R_M(y). One query from such a rectangle suffices for all selected cells and all singleton target tests within it. This argument needs only the singleton-class observation, not recovery of full output values. Known products, or cells that cannot be witnesses, may be skipped.

Define
\[
\alpha=\#\{L\text{-classes in }A_{\rm reg}\text{ with }|R(x)|\ge2\},\qquad
\beta=\#\{R\text{-classes in }A_{\rm reg}\text{ with }|L(y)|\ge2\}.
\]
The definitions are well-defined by Green's lemma: within each J=D class all R-class sizes agree and all L-class sizes agree. The exterior regular set is a union of full Green classes. Counting each L-class by 1/|L(x)| per element, and each R-class by 1/|R(x)| per element, gives
\[
\alpha+\beta=\sum_{x\in A_{\rm reg}}\left(
\frac{\mathbf1_{|R(x)|\ge2}}{|L(x)|}
+\frac{\mathbf1_{|L(x)|\ge2}}{|R(x)|}\right)\le a_{\rm reg}.
\]
Each summand is at most 1: if both classes have size at least two, both reciprocal terms are at most 1/2; if just one is nonsingleton, the contribution is 1; if neither, it is 0.

For each localized rectangle R(e) × L(f), classify its shape. Let c_X count those with |R(e)|>=2 and |L(f)|=1, c_Y those with |R(e)|=1 and |L(f)|>=2, c_0 those with both sizes 1, and c_B those with both sizes >=2. Their sum is c. All c_B rectangles jointly use at most alpha*beta distinct L-first/R-second class pairs, regardless of overlap. Each c_X target needs at most alpha class-pair queries (the second coordinate is fixed), each c_Y at most beta, each c_0 at most one. Reusing a query whenever a class pair repeats gives
\[
D_{\rm loc}\le \alpha\beta+c_X\alpha+c_Y\beta+c_0.
\]
If c_B=0 the first term can be dropped. More precisely one can compute the exact union of needed class pairs; that union is the cost of the nonadaptive procedure before further inference. It is not necessarily optimal.

If max(alpha,beta)>=1, put h=max(alpha,beta), l=min(alpha,beta). The last displayed bound is at most h(l+c) <= (h+l+c)^2/4 <= (a_reg+c)^2/4, by the arithmetic-geometric mean inequality. If alpha=beta=0, every localized rectangle is a singleton, so D_loc<=c; for c>0 there is at least one regular exterior witness pair with distinct factors (diagonal entries are fixed), hence a_reg>=2, and c <= (a_reg+c)^2/4. If c=0 stop immediately. Integrality gives the claimed bound.

Since a_reg+c<=n-|G|-1-(a-a_reg), use |G|>=1 for recovery of E. For emptiness only, if G is trivial the identity is indispensable, and if |G|=2 its nonidentity element is indispensable; nonunit factors cannot produce units. These cases need zero queries. Otherwise |G|>=3, giving the n-4 bound. A one-element K determines the table; small n cases cause no exception. The numerical bound requires no equality of rank or enumerators. With those statistics supplied, first restrict F and use the same method, or combine with prior SCC/statistical bounds. There is no proof here that d further queries can always be omitted from this particular localized strategy: its output predicates concern singleton targets only, whereas the earlier moment omission argument uses all ambiguous nonregular classes.

## 5. Executed computational checks

[stabilizer-witness-localization-audit.js](../experiments/stabilizer-witness-localization-audit.js) was executed as JavaScript in this session and saved verbatim. It checks full associativity, equality of labelled ideals (including one-sided), internal tables of proper principal ideals, unit/ideal products, quotient, regularity and idempotence, then identifies all ambiguous elements by direct E computation across each family. It tests closure and exclusion of K for both stabilizers, equality of the selected minimal one-sided ideals with ambient Green classes, regularity of their elements, every actual witness transfer (ex,yf), localized equivalence, reconstruction of the complete E set from shared L/R class-pair queries, and the refined and general numerical bounds.

| Family | n | Tables | a | a_reg | c | Raw possible witness cells (union) | Localized possible cells (union) | Selected class-pair queries |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| hierarchy 1x1 |10|4|4|4|1|4|4|4|
| hierarchy 2x3 |16|4|10|10|1|24|4|4|
| hierarchy 5x6, four exterior nonregular duplicates |32|4|26|22|1|168|4|4|
| mixed blocks X1,X2,Y3,Y1 |32|14|7|7|12|34|23|23|
| four blocks X2,X2,Y2,Y2 |33|18|8|8|12|48|28|28|
| balanced two-sided L=0, p=q=2 |22|100|8|8|1|16|4|4|
| nonnull Rees duplicate |14|4|4|4|1|4|4|4|

148 tables, 2,332,850 associativity triples, and 868 actual witness transfers checked, PASS. The hierarchy is a direct product of right-/left-zero parity bands with finite chains under minimum for each side, the AB mask depends only on parity and not level; bottom stabilizer ideals have two elements each. For the third hierarchy test, add four nonregular exterior duplicates in two parity pairs projecting to the two upper-level A elements, with right unit action shifting parity, all other nonunit products evaluated by projection, and left units acting trivially on the duplicates. This makes the localization away from nonregular factors explicit. The two mixed-block families include large/large, large/singleton, singleton/large, and singleton/singleton rectangle choices. The balanced and nonnull families are earlier constructions tested here against the new theorem. The test on the balanced family exhausts its 100 promised arrays; other explicit families use the mask lists in the script, not an exhaustive search of every possible monoid. The 168-to-4 cell reduction is for the union of witness candidates; four class-pair queries suffice, but their optimality is not asserted (balanced unit actions can further reduce the cost). No GAP, Lean or GitHub CI was run. Numerical tests supplement, not replace, the general proof.

## 6. Priority and limits

Actual additional web queries: "finite semigroup minimal ideal stabilizer submonoid Green R L stability multiplication oracle indispensable generators query complexity"; "semigroup stabilizer submonoid Green relations minimal ideal finite semigroup right ideal stabilizer"; "semigroup multiplication table oracle query complexity generators Chang monoids Green relations ideal extensions". Inspected indexed excerpts, including:
- On residual finiteness of monoids, their Schützenberger groups and associated actions, https://doi.org/10.1016/j.jalgebra.2014.02.025 (stabilizer submonoids, Green classes and their actions);
- Semigroups whose right ideals are finitely generated, https://www.cambridge.org/core/journals/proceedings-of-the-edinburgh-mathematical-society/article/semigroups-whose-right-ideals-are-finitely-generated/112D2967022C2988DE83BC18CF48F153 (principal ideals and Green classes);
- Computing finite semigroups, https://doi.org/10.1016/j.jsc.2018.01.002 (algorithmic uses of Green structure).
Stabilizers, minimal one-sided ideals, idempotent existence in finite subsemigroups, Green's lemma and AM-GM are classical. These excerpts do not establish the exact localization theorem for ambiguous indispensable elements under this side information, nor the resulting query coefficient. No new full-text/PDF analysis, no specialized database coverage, no historical priority conclusion. P03 remains PARTIAL_OVERLAP.

The improvement is unconditional in n, not in a. The new upper bound can be loose for instances with few targets or large unit orbits. One can use the minimum of this bound and the earlier 5/16 graph bound in a. The lower construction at L=0 remains 1/16. Next investigate compression of the localized rectangles by balanced unit orbits and target-preserving transfers from nonself factorizations, and how statistical inference can avoid complete singleton recovery; in particular try for a coefficient below 1/4, without assuming the localized class-pair procedure is optimal. No automatic merge or submission.
