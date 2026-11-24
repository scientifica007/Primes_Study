# Sharp Multiplication-Table Query Complexity for Indispensable Elements in Finite Monoids

**Research manuscript, version 1.10 — 24 November 2026**

Relational Primality research project. Draft for mathematical review; author list, affiliations and contribution statement to be confirmed before public submission. Not externally refereed.

## Abstract

Let $M$ be a finite labelled monoid of order $n$. An element is indispensable if it belongs to every subset generating $M$ by nonempty products. We study the deterministic multiplication-table query complexity of deciding whether indispensable elements exist and of counting them. The supplied side data consist of a designated nonempty proper ideal, its labelled Rees quotient, every product involving the ideal, all labelled principal left and right ideals, and the rank and number of minimum-cardinality generating subsets. Computation on these data is unrestricted. We prove that the worst-case query complexities of both tasks, adaptive and nonadaptive, are $n^2/16+o(n^2)$. The upper bound combines an invariant local generating-set decomposition with a prime-factor-count identity, regular localization of witnesses for nonregular Green classes, and a weighted graph inequality that accounts for the interior target classes. The lower bound uses two rectangular bands and a null ideal with target class sizes $1,4,2,2$. Two promised families have identical side data and complete inclusion-minimal generating-set size enumerators but opposite emptiness verdicts. A padding construction yields lower bounds at every sufficiently large order. More generally we give an upper bound for recovering the presence statuses of selected nonregular classes of prescribed minimum size. When one, two or three further ordinary generating-set coefficients are supplied, a non-equivariant rectangular-band construction gives matching sharp leading coefficients 1/24, 1/32 and 1/32 respectively (Section 8). For every fixed number of additional coefficients, the cardinality problem has sharp leading coefficient $1/(4s_L)$, where $s_L$ is a finite arithmetic collision threshold (Section 9). The emptiness problem is distinguished from cardinality for the remaining open levels.

**Keywords:** finite monoids; indispensable generators; Green relations; multiplication-table oracle; generating-set enumerators; deterministic query complexity.

## 1. Introduction and model

Generating subsets of finite semigroups are commonly studied through Green's relations, principal factors and maximal subsemigroups; see Howie [1], Gray [2], and Donoven, Mitchell and Wilson [3]. Indispensability is the classical notion of irreducibility in universal algebra: see Schmid [8, Section 3, Fact 3.1], Bergman and Slutzki [9, Proposition 3.8], and Lipparini [10, Section 2]. We use the binary reduct, without a nullary identity symbol. Bergman and Slutzki [9, Proposition 3.9] study the space complexity of testing this predicate for a designated element given the complete operation tables. Here we ask an information question rather than a running-time or space question. A multiplication table is not given in full, but certain structural and generating-set information is supplied. How many additional entries must be learned to decide whether the intersection of all generating subsets is empty?

The Cayley semigroup membership problem [4] takes the entire table as input and measures computational complexity. Chang [5, Corollary 24, p. 157] establishes quadratic-order hardness of even approximate Cayley-table recovery in finite commutative aperiodic monoids. His Section 4 construction places independent unknown outputs in unordered pairs of high labels, with products of three nonidentity elements collapsing to a fixed label. The operation-table oracle and the independent-information lower-bound method thus have clear precedents. Our task instead concerns an exact emptiness predicate and a counting predicate with explicitly specified side data. The distinction is substantive: every finite aperiodic monoid has a trivial unit group, hence its identity belongs to every positive-word generating subset (a product equal to the identity can contain only units). Thus Chang's aperiodic promise has a constant nonempty verdict for our decision task. The full-text [source comparison](../reviews/P03-Chang-2014-full-text-comparison-2026-11-24.md) also gives an anchored specialization of his construction with fixed labelled principal ideals and generating statistics, quadratic exact table-learning cost, and zero-query recovery of the entire indispensable set. It illustrates that a table-recovery lower bound does not imply our balanced decision lower bound. Zumbrägel, Maze and Rosenthal [6, Definition 3 and Lemma 6] already formalize operation learning as decision trees on a supplied family of possible operations. Their trees distinguish every possible table, whereas ours need distinguish only different predicate values. The [comparison with their work](../reviews/P03-Zumbragel-Maze-Rosenthal-2008-comparison-2026-11-24.md) proves a separate elementary contrast: even the stronger metadata and complete generating-set enumerators permit exact table learning to have worst-case leading coefficient one, while the sharp decision/count coefficient here is 1/16. It also describes a generator-column reconstruction bound from the known quotient, a specialization of classical generator-based recovery. Ergün et al. [7, Section 4.4, Theorems 53–54 of the author manuscript] also establish quadratic-order lower bounds for exact algebraic property decision, using unexamined table blocks. The present problem differs in the associative promise on both verdicts and in the fixed structural and statistical side data. The [related source comparison](../reviews/P03-spot-checkers-irreducibles-priority-2026-11-24.md) additionally distinguishes exact decision from distance-gap testing on our balanced lower-bound family. The ideal-extension viewpoint is classical: Grillet and Petrich [11, Definition 1.1 and Theorem 1.2, pp. 494–495] give the canonical homomorphism into the translational hull, and their Theorem 4.1 reconstructs extensions of weakly reductive ideals. We allow non-weakly-reductive ideals and study the information needed for generating statistics and predicates rather than reconstructing all entries. These distinctions delimit the result; the present manuscript makes no assertion of historical priority over all existing oracle models.

Let $M$ denote the labelled carrier as well as a compatible monoid structure on it. Let $\langle S\rangle$ be the set of products of **positive** length over $S\subseteq M$; thus $\langle\varnothing\rangle=\varnothing$. In particular, the identity is not supplied as a free generator. Define
$$
E(M)=\bigcap_{\langle S\rangle=M}S,\qquad
r(M)=\min_{\langle S\rangle=M}|S|,
$$
and let $g_j(M)$ be the number of generating subsets of cardinality $j$. Let $H_M(w)=\sum_j h_jw^j$ count inclusion-minimal generating subsets by size. We have $h_r=g_r>0$; the terms “minimum-cardinality” and “inclusion-minimal” are not interchangeable in general.

The **reduced side data** are:

1. A labelled carrier of size $n$, with a designated nonempty proper ideal $K$.
2. The full labelled Rees quotient $M/K$ with the quotient map, collapsing precisely $K$ to its zero.
3. Every product having at least one factor in $K$.
4. The labelled sets $Mx$ and $xM$ for every $x\in M$.
5. The integers $r$ and $g_r$.

We promise these data arise from at least one associative monoid. A query specifies an ordered pair $(x,y)$ and returns the label of $xy$. Only queries are charged; all computation on supplied data and replies, including exhaustive enumeration of compatible tables, is free. A nonadaptive algorithm fixes its queries before receiving replies.

We also consider the stronger side data obtained by including the entire polynomial $H_M$, all labelled two-sided principal ideals, unit actions, regularity and idempotence data, and the multiplication tables restricted to every proper principal ideal. The stronger data may only decrease the optimal query cost. The polynomial $H_M$ supplies $r$ and $g_r$, even if they are not separately given.

Write $D_{\rm dec}(n)$ and $D_{\rm count}(n)$ for the worst-case optimal deterministic query costs, over all consistent side-data fibres of order $n$, of deciding $E(M)=\varnothing$ and finding $|E(M)|$, respectively. Superscript $\mathrm{na}$ denotes nonadaptive cost. A fibre is the finite family of all monoid tables compatible with the supplied information.

**Theorem 1 (sharp leading coefficient).** For either the reduced or the stronger side-data model, each of the four quantities
$$
D_{\rm dec}(n),\quad D_{\rm count}(n),\quad
D_{\rm dec}^{\rm na}(n),\quad D_{\rm count}^{\rm na}(n)
$$
is $n^2/16+o(n^2)$. More precisely, for $n\ge23$ and $\delta=n\bmod 2$, each is bounded below by
$$
\left\lfloor\frac{(n-14-\delta)^2}{16}\right\rfloor-1-\delta
$$
and above by $n^2/16+O(n^{5/3})$, with a uniform implied constant.

The theorem determines the ordinary limit along all sufficiently large integer orders. It does not determine the exact optimum at each finite order, the optimal cost for recovering the labelled set $E(M)$, or randomized query complexity.

## 2. Algebraic preliminaries

For $x,y\in M$, write $x\mathrel{\mathcal L}y$ if $Mx=My$, $x\mathrel{\mathcal R}y$ if $xM=yM$, and $x\mathrel{\mathcal J}y$ if $MxM=MyM$. Put $\mathcal H=\mathcal L\cap\mathcal R$ and write $J_x$ for the $\mathcal J$-class of $x$. The order $J_x\le J_y$ means $MxM\subseteq MyM$. Strict inequality is denoted by $<$.

We use the following standard finite-semigroup facts (see [1], Chapter 2).

- Stability: if $xy\mathrel{\mathcal J}x$, then $xy\mathrel{\mathcal R}x$; if $xy\mathrel{\mathcal J}y$, then $xy\mathrel{\mathcal L}y$.
- In a finite monoid, $\mathcal D=\mathcal J$. Each such class has a rectangular array of $\mathcal H$-classes of equal cardinality. In particular, for $x\in J$,
  $$|\mathcal L(x)|\,|\mathcal R(x)|=|J|\,|\mathcal H(x)|.$$
  The sizes of the three kinds of classes are constant throughout $J$.
- Regularity ($xux=x$ for some $u$) is constant on each $\mathcal J$-class. A regular class contains an idempotent, and each element of a nonregular class has no product with another member that stays in that class.

For clarity, the last product assertion follows directly from stability: if $a,b,t=ab$ belong to one class, then $t\mathrel{\mathcal R}a$ and $t\mathrel{\mathcal L}b$, so $a=tu$ and $b=vt$ for some $u,v$, giving $t=tuvt$. Stability itself follows from finiteness: if $a\mathrel{\mathcal J}ab$, write $a=pabq$, iterate $a=p^ka(bq)^k$, and choose $k$ so that $p^k$ is idempotent. This gives $p^ka=a$ and hence $a=a(bq)^k\in abM$. The dual argument proves the other direction. The class-size identity is the usual consequence of Green's lemma.

Let $G$ be the unit group, $A=M\setminus(G\cup K)$ and $A_{\rm reg}$ the regular elements in $A$. Set $a=|A_{\rm reg}|$. The supplied one-sided ideals determine the two-sided ideals by $MxM=\bigcup_{y\in Mx}yM$, and thus determine all the Green classes. Units are exactly the elements $x$ with $xM=M$, by finiteness. For $x\notin K$, regularity can be tested in the quotient: a nonzero value equal to the image of $x$ in an equation $xux=x$ lifts uniquely to $x$. For $x\in K$ every product needed for that test is supplied. Thus all the data used below are available in the reduced model.

**Lemma 2 (classical two-factor characterization; cf. [8,9,10]).** An element $t$ is outside $E(M)$ if and only if $xy=t$ for some $x,y\ne t$.

*Proof.* The complement $M\setminus\{t\}$ generates $M$ if and only if it generates $t$. The displayed factorization suffices. Conversely, take a shortest positive word over the complement with value $t$. Its length is at least two and its penultimate prefix has value different from $t$, yielding the desired factorization. $\square$

## 3. The arithmetic reduction

For a $\mathcal J$-class $J$, put $U_J=\{x:J_x>J\}$ and define the local generating family
$$
\mathcal F_J=\{S\subseteq J:J\subseteq\langle U_J\cup S\rangle\}.
$$

**Lemma 3 (local factorization and invariant part).** A subset $S$ generates $M$ exactly when $S\cap J\in\mathcal F_J$ for every $J$. Each local family for a class outside $K$, or for a regular class inside $K$, is determined by the reduced structural data alone.

*Proof.* A word evaluating into $J$ can use only letters of class at least $J$, by ideal monotonicity. This proves necessity. For sufficiency, descend the finite partially ordered set of classes: all elements of $U_J$ have already been generated, and the local condition generates $J$. Consequently the local generating enumerators multiply, and inclusion-minimal global generating sets are exactly unions of inclusion-minimal local choices.

For $J$ outside $K$, any word yielding an element of $J$ has nonzero quotient value, which determines its actual value. Thus the local family is fixed.

For $J\subseteq K$ regular, define the two translations of $x$ on $K$ by $L_x(k)=xk$ and $R_x(k)=kx$. Both are supplied for every label. The pair $\tau(x)=(L_x,R_x)$ is multiplicative when pairs are composed by
$$
(L,R)(L',R')=(L\circ L',R'\circ R).
$$
Therefore both the quotient value and the translations of a word are independent of the compatible table. If $z,e\in K$ have the same translations and $e^2=e$, then $z^2=ze=e^2=e$. For any $t\in J$, choose an idempotent $e\in J$ with $et=t$: if $tut=t$, take $e=tu\in K$, which is idempotent and $\mathcal J$-equivalent to $t$. If $z\in K$ has the translations of $t$, then $ez=et=t$.

Suppose a local subset generates all of $J$ in one compatible table. For each $t\in J$, choose words for $t$ and for such an $e$. In any other table, the words evaluate in $K$ with the same translations. Square the word for $e$, obtaining $e$, and multiply by the word for $t$, obtaining $t$. This proves invariance of the full local family, not invariance of individual word values. $\square$

The following nonregular-class dichotomy is classical: Donoven, Mitchell and Wilson [3, Lemma 3.2, Proposition 3.3 and Corollary 3.4], specializing their generating set to the entire semigroup, give the maximal-subsemigroup criterion for the absence of generation from above. We recall the local counting consequence for clarity, not as a separate novelty claim.

A nonregular class $C$ is called **missing** if $\langle U_C\rangle\cap C=\varnothing$, and **present** otherwise. Any one member of $C$ generates all of $C$ relative to $U_C$: for $c,d\in C$, write $d=pcq$; the multipliers belong to strictly higher classes (or are omitted identities), since no product of two members of $C$ stays in $C$. Consequently a present class imposes no restriction on a local generating subset, whereas a missing class requires a nonempty local subset. Equivalently, presence means there is a **first-entry witness** $xy\in C$ with $J_x,J_y>C$. In a word over $U_C$ with value in $C$, take the first node in a binary multiplication tree having value in $C$; all its descendants have class at least $C$, so its two children lie strictly above $C$.

Let $\mathcal Z$ be the set of missing nonregular classes inside $K$. The ordinary local generating-set enumerator of such a class of size $u$ is $(1+w)^u-1$ when missing, and $(1+w)^u$ when present. Its inclusion-minimal enumerator is $uw$ when missing and $1$ when present. Let $r_*$ be the least degree of the product of the ordinary local enumerators for the fixed part in Lemma 3 and $g_*$ its leading nonzero coefficient. Both are computable without queries by enumerating local subsets, using the signature test described below. Let $E_*$ denote the union of the intersections of the local families of this fixed part. The preceding characterization gives
$$
b=|\mathcal Z|=r-r_*,
\qquad
P=\prod_{C\in\mathcal Z}|C|=g_r/g_*,
\qquad
|E(M)|=|E_*|+\#\{C\in\mathcal Z:|C|=1\}.
\tag{1}
$$
Empty products equal one. Every class whose missing status is fixed can be accounted for in preprocessing; alternatively retain its known contribution in the following calculation.

Let $\Omega(u)$ be the number of prime factors of $u$, counted with multiplicity, with $\Omega(1)=0$. For positive integers $u$,
$$
\mathbf 1_{\{u=1\}}=1-\Omega(u)+\max(0,\Omega(u)-1).
$$
Summing over $\mathcal Z$ yields
$$
m_1=b-\Omega(P)+\sum_{C\in\mathcal Z}\max(0,\Omega(|C|)-1).
\tag{2}
$$
The summand vanishes at one and at every prime size. Thus **knowing the presence statuses of the ambiguous composite-size classes suffices to recover the cardinality of $E(M)$**. Here a class is ambiguous if it is missing in one compatible table and present in another. It is not necessary to identify the individual missing singleton labels. In particular, only classes of size at least four need to be queried for the counting and decision tasks.


**Direct signature test (no table enumeration).** Form the known image of the homomorphism $x\mapsto(q(x),\tau(x))$, where $q$ is the quotient map. There are at most $n$ image elements, and their product is computable from the quotient and composition of translations. For a regular interior class $J$ and $S\subseteq J$, generate the signatures of $U_J\cup S$. The subset $S$ is locally generating exactly when the signature closure contains $(0,\tau(t))$ for every $t\in J$. Indeed for each $t$ choose $e\in J$ idempotent with $et=t$; the word for the signature of $e$ squares to $e$, and the word for the signature of $t$ multiplied on the left by $e$ gives $t$. Exterior classes use the known nonzero quotient labels. Thus the fixed local families can be computed without enumerating compatible tables, although enumerating their subsets can still be exponential.

## 4. Exterior transport and localization

Fix an ambiguous nonregular class $C\subseteq K$. All its first-entry witnesses in any compatible table have both factors in $A$. Indeed, a witness involving $K$ would have a supplied product and contradict missing status in another table. A unit factor cannot take a strictly higher class into $C$. A witness lies strictly above $C$ in each coordinate.

**Lemma 4 (exterior transport).** If $xy=c\in C$ is a first-entry witness in a compatible table, then there are $r,l\in C$ with $xr=c=ly$ in every compatible table. If $pc\in C$, then $px\in A$ and $(px)y=pc$. Dually, $cq\in C$ implies $yq\in A$ and $x(yq)=cq$. Every $d\in C$ is a first-entry output in every table in which $C$ is present.

*Proof.* In a table where $C$ is missing, the fixed labelled right ideal $xM$ contains $c$, so $xr=c$ there. By ideal monotonicity $J_r\ge C$. Strict inequality would contradict missing status, so $r\in C\subseteq K$, making the product known. The argument for $l$ is dual.

Now let $pc\in C$. The product $(px)y=pc$ implies $J_{px}\ge C$. If $px\in K$ and $J_{px}>C$, the product $(px)y$ is supplied and would be a first-entry witness in the missing table (the class order is fixed). If $px\in C$, the equality $(px)r=pc\in C$ contradicts nonregularity. Thus $px\notin K$, and it is not a unit because $x$ is not a unit. The dual proof applies on the right. For arbitrary $d\in C$ write $d=pcq$. By ideal monotonicity both $pc,cq\in C$, and $(px)(yq)=d$ with both factors in $A$. They are strictly above $C$ because they are exterior and their product lies in $C$. $\square$

For a specified member $c\in C$ define the stabilizers
$$
P_c=\{u:uc=c\},\qquad Q_c=\{v:cv=c\}.
$$
These are fixed submonoids. They avoid $K$ by Lemma 4: a multiplier from $K$ stabilizing $c$ would put the transported exterior coordinate in $K$. All their internal products are supplied by the nonzero quotient values.

For each witness $xy=c$, take $r,l$ as in Lemma 4. Since $xr=c$ and $r\mathrel{\mathcal J}c$, stability gives $r\mathrel{\mathcal L}c$. Hence there exists $u$ with $uc=r$, so $xu\in P_c$ is a nonunit. Dually $l\mathrel{\mathcal R}c$ gives $v$ with $cv=l$, so $vy\in Q_c$ is a nonunit. Therefore both stabilizers contain nonunits.

Choose a nonunit idempotent $e\in P_c$ whose ambient $\mathcal J$-class is minimal among the nonunit members of $P_c$. Such a choice exists: take a member of a minimal class and an idempotent positive power of it, which remains in the submonoid and cannot drop to a strictly lower class. Choose $f\in Q_c$ dually. These choices are made from supplied data; minimality does not assert the existence of a least class.

**Lemma 5 (regular localization and size domination).** In every compatible table, $C$ is present if and only if some $x\in\mathcal R(e)$ and $y\in\mathcal L(f)$ satisfy $xy=c$. These Green classes are subsets of $A_{\rm reg}$. Moreover, for every such localized witness,
$$
|\mathcal L(x)|\ge|\mathcal L(c)|,\qquad
|\mathcal R(y)|\ge|\mathcal R(c)|,
\tag{3}
$$
so $|\mathcal L(x)|\,|\mathcal R(y)|\ge|C|$.

*Proof.* If $C$ is present, Lemma 4 supplies a witness $xy=c$. With $u,v$ as above, $exu\in P_c$ is nonunit, because $(exu)c=ec=c$. The inequalities $J_{exu}\le J_{ex}\le J_e$ and minimality imply equality throughout. Stability applied to $ex$ gives $ex\mathrel{\mathcal R}e$. Similarly $yf\mathrel{\mathcal L}f$. Then $(ex)(yf)=ecf=c$. The classes of exterior idempotents consist of regular exterior nonunits, so the reverse implication holds.

For a localized witness $xy=c$, take $u$ as above. For each $d\in\mathcal L(c)$ choose $p,q$ with $pc=d$ and $qd=c$. Then $(qpxu)c=c$, so $qpxu$ is a nonunit of $P_c$. Since
$$
J_{qpxu}\le J_{px}\le J_x=J_e,
$$
minimality implies $px\mathrel{\mathcal J}x$, and stability gives $px\mathrel{\mathcal L}x$. The chosen elements $px$ are distinct for distinct $d$ because $(px)y=d$. This gives an injection of $\mathcal L(c)$ into $\mathcal L(x)$. The dual argument gives the second inequality. The class-size identity in Section 2 gives their product at least $|C|\,|\mathcal H(c)|\ge|C|$. $\square$

## 5. The weighted graph bound

**Lemma 6 (three-region inequality).** Let $X,Y,Z$ be disjoint finite sets of vertices with nonnegative masses $N_i$ and positive dimensions $l_i,r_i$. Assume $N_i\le l_ir_i$ for $i\in Z$. Let $\mathcal E$ be a set of directed edges contained in
$$
(X\times Y)\cup(X\times Z)\cup(Z\times Y).
$$
For every edge $i\to j$ require $l_i r_j\ge s>0$. Then
$$
\sum_{i\to j\in\mathcal E}\frac{N_iN_j}{l_i r_j}
\le \frac{\left(\sum_iN_i+s|\mathcal E|\right)^2}{4s}.
\tag{4}
$$

*Proof.* Fix edges and dimensions. The expression on the left is linear in the masses on $X$ when other masses are held fixed. Concentrate the entire $X$ mass $U$ at a vertex $x$ of maximum linear coefficient. Then concentrate the entire $Y$ mass $V$ at a vertex $y$ in the same way with the new $X$ masses fixed. These changes do not decrease the expression. They are numerical relaxations, not changes to an algebraic structure. Masses in $Z$ are unchanged. If either group is empty, its mass is zero.

If the edge $x\to y$ is absent, the remaining expression is bounded by $(U+V)\sum_{i\in Z}N_i/s$, which is at most $(\sum_iN_i)^2/(4s)$.

Otherwise put $\lambda=l_x$ and $\rho=r_y$, so $\lambda\rho\ge s$. A vertex in $Z$ incident to just one of $x\to i$ or $i\to y$ contributes at most $N_i\max(U,V)/s$. For a vertex incident to both, write its parameters as $N,l,r$. The inequalities $\lambda r\ge s$ and $l\rho\ge s$ give
$$
(l-s/\rho)(r-s/\lambda)\ge0,
$$
hence $s(l/\lambda+r/\rho)\le lr+s^2/(\lambda\rho)\le lr+s$. Multiplying by $N/(lr)$ and using $N\le lr$ yields
$$
\frac{sN}{\lambda r}+\frac{sN}{l\rho}\le N+s.
$$
Its combined contribution is therefore at most $(N+s)\max(U,V)/s$. Assign $s$ additional units of mass to each such doubly incident vertex. Their number is at most $|\mathcal E|$, since their incoming edges are distinct. Let $W$ denote the sum of the masses of incident $Z$ vertices with these additions. Then $U+V+W\le\sum_i N_i+s|\mathcal E|$ and the concentrated expression is at most
$$
\frac{UV+W\max(U,V)}s
=\frac{\max(U,V)(\min(U,V)+W)}s
\le\frac{(U+V+W)^2}{4s}.
$$
This proves (4). $\square$

**Theorem 7 (size-restricted class recovery).** Under the reduced structural data, without requiring generating statistics, the presence statuses of any selected $d$ ambiguous nonregular interior classes of size at least $s$ can be recovered nonadaptively using at most
$$
\frac{(a+sd)^2}{4s}+dB^2+\frac{2a^2}{B}
\tag{5}
$$
queries, for every integer $B\ge2$, where $a=|A_{\rm reg}|$ and $s\ge1$ is an integer.

*Proof.* Choose one member $c$ of each selected class and its fixed rectangle $\mathcal R(e)\times\mathcal L(f)$ from Lemma 5. Retain only cells that report $c$ in some compatible table. This is permitted by free computation, and guarantees the size inequality (3) on all retained cells. The output $\mathcal J$-class is constant on each Cartesian product $\mathcal L(x)\times\mathcal R(y)$ in any table: mutual left divisibility of the first coordinates, and mutual right divisibility of the second coordinates, imply mutual two-sided divisibility of the products. Thus one query per distinct such class pair suffices, taking the union across all selected rectangles. A response in $C$ anywhere in a retained pair is a genuine first-entry witness. Conversely the localization ensures some retained pair reports $C$ if $C$ is present. All representatives can be fixed in advance.

First pay at most $dB^2$ for rectangles with both side sizes smaller than $B$. Next pay at most $2a^2/B$ for pairs whose first $\mathcal L$-class or second $\mathcal R$-class has size at least $B$. Indeed there are at most $a/B$ classes of each large type, each paired with at most $a$ classes of the other kind. Counts may overestimate the union, which is harmless.

The remaining pairs have first $\mathcal L$-size and second $\mathcal R$-size below $B$, with either first $\mathcal R$-size or second $\mathcal L$-size at least $B$. Partition the relevant regular exterior $\mathcal J$-classes into three groups:
- $X$: $\mathcal R$-size at least $B$, $\mathcal L$-size below $B$;
- $Y$: $\mathcal L$-size at least $B$, $\mathcal R$-size below $B$;
- $Z$: both sizes below $B$.

Both-large classes cannot occur in the remaining pairs. For an individual class $J_i$ write $N_i=|J_i|$, $l_i=|\mathcal L(x)|$, $r_i=|\mathcal R(x)|$ for $x\in J_i$. Then $N_i\le l_i r_i$. Form an edge $i\to j$ if some remaining pair belongs to $J_i\times J_j$. Edges lie in the three regions of Lemma 6, and $l_i r_j\ge s$ by (3). The number of class pairs in each edge region is at most $(N_i/l_i)(N_j/r_j)$. Crucially, each selected target contributes at most one edge: its chosen rectangle belongs to a single ordered pair of ambient $\mathcal J$-classes. Thus $|\mathcal E|\le d$, irrespective of overlaps among target supports.

Lemma 6 with $\sum_i N_i\le a$ bounds the number of remaining pairs by $(a+sd)^2/(4s)$. Adding the two initial costs proves (5). $\square$

Since $sd\le|K|$, the selected classes being disjoint subsets of $K$, we have $a+sd\le n$. For fixed $s$, choosing $B=\max(2,\lceil n^{1/3}\rceil)$ gives the uniform bound
$$
D_s\le \frac{n^2}{4s}+O(n^{5/3}).
\tag{6}
$$
Applying (6) at $s=4$ to the ambiguous composite-size classes and then using (1)–(2) proves the nonadaptive upper bound for counting and hence for decision in Theorem 1. If no such classes are ambiguous, no queries are needed. The upper bound is informational, not a claim of polynomial-time preprocessing.

### A direct metadata-only implementation of the selected-class bound

The proof of Theorem 7 used compatible-table enumeration to decide ambiguity and retain potentially witnessing cells. Neither is necessary. The following alternative works for any selected nonregular classes, not necessarily known to be ambiguous, using only supplied data.

First, for $C\subseteq K$ declare presence if any pair strictly above $C$ with a factor in $K$ has its known product in $C$. Also declare presence if for some $t\in C$ and $x$ strictly above $C$, $t\in xM$ but no $r\in C$ satisfies $xr=t$; or dually $t\in My$ but no $l\in C$ satisfies $ly=t$. Indeed the principal ideal guarantees a factor and ideal monotonicity forces that factor to lie strictly above $C$ when equality is excluded. These tests use only known products. If neither test succeeds, every possible first-entry witness has exterior nonunit coordinates, and the equalities $xr=t=ly$ with $r,l\in C$ used in Lemma 4 follow from the second test's failure, without any missing compatible table. The transport proof is unchanged: a transported coordinate in $K$ would either supply a known first-entry witness (excluded by the first test) or produce a product of two members of a nonregular class within that class (impossible).

Fix $c\in C$. If either stabilizer $P_c,Q_c$ intersects $K$ or lacks a nonunit, declare absence, because the proof of Lemma 5's stabilizer existence (using the preceding transport) would otherwise contradict that condition. Else choose the minimal-class idempotents $e,f$ exactly as in Lemma 5. Retain every pair $x\in\mathcal R(e),y\in\mathcal L(f)$ satisfying $c\in xM\cap My$. A present class has a localized witness in this rectangle, and each representative response in $C$ is a first-entry witness. To see the size domination for **all retained pairs**, take $r\in C$ with $xr=c$ by failure of the second test. Write $r=uc$ using stability. For $d\in\mathcal L(c)$ take $p,q$ with $pc=d$ and $qd=c$. Then $qpxu$ lies in the nonunit stabilizer, so minimality and stability give $px\mathrel{\mathcal L}x$. The injection now follows from $(px)r=d$ rather than $(px)y=d$. The dual proves the other size bound. Thus (3) holds for every retained pair without testing whether any compatible table actually has $xy=c$. Query the same one-representative-per-$\mathcal L\times\mathcal R$-pair union as in Theorem 7. All the counting in (5) applies unchanged, with $d$ counting the selected classes. In particular select all composite-size nonregular interior classes, apply (2), and obtain the same coefficient $1/16$.

This variant makes query planning polynomial in explicit structural data by bounded loops over labelled elements and classes. Combined with the direct signature test in Section 3, the upper algorithm no longer requires enumeration of compatible tables at any stage. This does not assert polynomial-time computation of generating-set counts. See the [proof and source comparison](../reviews/P03-ideal-extensions-metadata-only-localization-2026-11-24.md) and [executed audit](../experiments/metadata-only-localization-audit.js).

**Canonical class-pair plan.** The least ambient J-class met by a finite stabilizer submonoid is unique: the product of all its elements lies below each in ambient J-order, and an idempotent power remains in that least class. In the surviving case of the direct algorithm these classes are regular exterior nonunit classes. For $x\mathrel{\mathcal R}e$ and $y\mathrel{\mathcal L}f$, the conditions $c\in xM$ and $c\in My$ are automatic, since $ec=c=cf$. Finite Green incidence implies that the rectangle represents every L-class of $J_e$ paired with every R-class of $J_f$. Thus, with one edge for each distinct ordered endpoint class pair $(i,j)$, the unpruned number of representatives is exactly $\sum_{(i,j)}N_iN_j/(l_ir_j)$, with no dependence on the chosen idempotents in those least classes. Supplied products can be skipped. This is the cost of the specified plan, not an instance-optimality theorem. The existing weighted estimate still applies. See the [kernel and relative-generation comparison](../reviews/P03-stabilizer-kernels-relative-generation-2026-11-24.md) for a proof of the kernel observation, targeted literature reads, and executed audit.

### Additional statistics: upper bounds beyond the sharp L=0 model

Suppose the supplied statistics also include $g_{r+j}$ for $1\le j\le L$. This is a different (stronger) statistical input model; denote its decision/count costs by $D_L(n)$. If $F(w)=w^{r_*}(g_*+g_*'w+\cdots)$ is the fixed ordinary local factor, and $D$ is the total size of nonregular interior classes, write $p_1=\sum_{C\in\mathcal Z}|C|$. The coefficient ratio in
\[
G(w)=F(w)(1+w)^{D-p_1}\prod_{C\in\mathcal Z}((1+w)^{|C|}-1)
\]
is $g_{r+1}/g_r=g_*'/g_*+D-(p_1+b)/2$. Thus $p_1$ is known when $L\ge1$. Use the classical completely additive function $A(s)=\sum_p p\,v_p(s)$ (Alladi–Erdős [15]), with $A(1)=0$. For $s>1$, $s-A(s)$ vanishes exactly on primes and 4, and is positive otherwise. Consequently
\[
m_1=p_1-A(P)-\sum_{\substack{C\in\mathcal Z\\ |C|\ge6,\ |C|\text{ composite}}}(|C|-A(|C|)).
\]
Theorem 7 applied with $s=6$ gives $D_1(n)\le n^2/24+O(n^{5/3})$ for exact deterministic decision and cardinality, adaptive or nonadaptive. This is an upper bound, not a matching theorem.

More generally the previously established moment equivalence (proved in the [linked note](../reviews/P03-joint-statistics-constraints-2026-11-24.md)) recovers $b,P$ and the power sums with exponents $j=1$ or positive even $j\le L$. Define $s_L$ as the least maximum part of two positive-integer multisets having these same statistics but different multiplicity of 1. Equivalently it is the first $k$ where the count, prime-valuation and moment matrix on $1,\ldots,k$ has a rational kernel vector with nonzero first entry. Query classes of size at least $s_L$ and subtract their statistics; the remaining singleton multiplicity is determined by that matrix's row space. Therefore $D_L(n)\le n^2/(4s_L)+O_L(n^{5/3})$. Exact computations give $s_L=4,6,8,8,9,9,10,10,12,12,14,14,15$ for $L=0,\ldots,12$. A Vandermonde argument on the even moments gives $s_L\ge\lfloor L/2\rfloor+2$; in particular $D_{L(n)}(n)=o(n^2)$ for $L(n)\to\infty$, by monotonicity and the fixed-$L$ bounds. The minimum maximum part is not the minimum divisor modulus used in the matching lower-bound scheme. Matching coefficients for cardinality at all fixed levels, and for decision at L<=3, are established in Sections 8–9.

Compulsory generating blocks have classical precedents (Berman [16], Proposition 3.5), as do sum/product/length collisions (Cha et al. [17], citing Kelly) and inference from generating statistics (Lucchini [18], Section 3). The [arithmetic threshold report](../reviews/P03-arithmetic-statistical-thresholds-2026-11-24.md) gives the complete proof, source scope, and [executed exact audit](../experiments/statistical-threshold-arithmetic-audit.js).

## 6. Matching construction

Let $p,q$ be positive integers. Let $G=\mathbb Z/4\mathbb Z$ be a group of units (its identity is the group label $0_G$). Use a disjoint carrier consisting of $G$, two rectangular bands
$$
A_0=\{a_{c,i}:c\in\mathbb Z/2,\ 1\le i\le p\},\quad
B_0=\{b_{j,d}:1\le j\le q,\ d\in\mathbb Z/2\},
$$
and target layers $T_\ell=\{t_{\ell,c,d}:c\in\mathbb Z/u_\ell,\ d\in\mathbb Z/v_\ell\}$, with $(u_\ell,v_\ell)$ respectively
$$
(1,1),\ (2,2),\ (2,1),\ (1,2)
\quad(\ell=0,1,2,3).
$$
Include an absorbing zero $z$ distinct from $0_G$ and set $K=\bigcup_\ell T_\ell\cup\{z\}$. All products within $K$ are $z$. Let $W$ be a $p\times q$ array with entries in $\{-1,0,1,2,3\}$; $-1$ denotes the absorbing-zero label.

Besides the group law, define nonunit products by
$$
\begin{aligned}
a_{c,i}a_{c',i'}&=a_{c,i'},\\
b_{j,d}b_{j',d'}&=b_{j,d'},\\
a_{c,i}b_{j,d}&=
\begin{cases}z&W_{ij}=-1,\\
t_{\ell,c\bmod u_\ell,d\bmod v_\ell}&W_{ij}=\ell,
\end{cases}\\
a_{c,i}t_{\ell,c',d'}&=t_{\ell,c\bmod u_\ell,d'},\\
t_{\ell,c',d'}b_{j,d}&=t_{\ell,c',d\bmod v_\ell}.
\end{aligned}
\tag{7}
$$
All unlisted nonunit products are $z$. A group element $g$ acts on the left by adding $g$ modulo the relevant modulus to the first cyclic coordinate of $A_0$ and the targets, and acts trivially on $B_0$. On the right it adds $g$ to the last cyclic coordinate of $B_0$ and the targets, and acts trivially on $A_0$. Both actions fix $z$.

**Lemma 8 (associativity and common data).** Every label array gives a monoid, and all such monoids have the same reduced structural data and the same proper principal-ideal internal tables.

*Proof.* Write $T=\bigcup T_\ell$. For nonunit triples, the only type strings capable of a nonzero output under either bracketing are $AAA,BBB,AAB,ABB,AAT,ATB,TBB$, where $A,B$ denote $A_0,B_0$. The first two are rectangular band laws. For $AAB$ both bracketings use the array position from the second $A$ column and the $B$ row, with target coordinates from the first $A$ and $B$. For $ABB$ the position uses the $A$ column and first $B$ row, with target coordinates from $A$ and last $B$. For $AAT,TBB$ the same target coordinate is overwritten by either bracketing. For $ATB$ the two independent target coordinates are overwritten in either order. All other strings evaluate to $z$ in both bracketings; triples containing $z$ also do.

Group actions are commuting left and right actions because all moduli divide four. For one group factor, the identities $(gx)y=g(xy)$, $(xg)y=x(gy)$ and $(xy)g=x(yg)$ follow from (7): an outer shift acts on the corresponding surviving coordinate, while a middle shift either is trivial on both sides or is applied to a discarded coordinate. A zero output is preserved. The group law and action identities cover all remaining triples. The group identity acts identically on all labels. Thus the operation is associative and unital.

The principal right ideal of $a_{c,i}$ consists of its $A_0$ row, all targets with first coordinate $c\bmod u_\ell$ in each layer, and $z$. Its left ideal consists of its $A_0$ column and $z$. The principal left ideal of $b_{j,d}$ consists of its $B_0$ column, all targets with last coordinate $d\bmod v_\ell$ in each layer, and $z$; its right ideal consists of its $B_0$ row and $z$. A target's left ideal consists of the members of its own layer with its last coordinate fixed, and $z$; its right ideal fixes its first coordinate instead. These descriptions follow from the fixed target products, irrespective of whether a layer occurs in $W$. The two-sided ideals of $A_0,B_0$ are respectively $A_0\cup K,B_0\cup K$, those of targets are $T_\ell\cup\{z\}$, and that of $z$ is $\{z\}$. Unit ideals are the entire monoid. Every potentially varying cell belongs to $A_0\times B_0$, and no proper principal ideal contains both factors. The quotient, all products involving $K$, unit actions and labelled ideals are therefore fixed. The bands, units and $z$ are regular; all nonzero targets are nonregular because $T_\ell M T_\ell=\{z\}$. $\square$

**Lemma 9 (balanced promises).** Assume $pq\ge2$. Restrict the arrays to two cases: either exactly the labels $0,1$ occur among nonnegative entries, both at least once, or exactly the labels $2,3$ occur, both at least once. All arrays in the two cases have
$$
n=2(p+q)+14,\quad r=p+q+3,\quad
H_M(w)=2^{p+q+3}w^{p+q+3}.
\tag{8}
$$
The first case has $E(M)=\varnothing$; the second has $E(M)=T_0$.

*Proof.* A generating subset must generate the unit group, meet every column of $A_0$, every row of $B_0$, and every target layer absent from $W$. No nonunit product can yield a unit, and the complement of each indicated exterior block or absent layer is closed under products. Conversely a generator of the cyclic unit group and one member from each required block produce the whole block by unit actions. The array then produces each present target layer, and left and right unit actions generate all its members; a chosen member generates each absent layer by the same actions. The zero is generated by $B_0A_0$. Generation of $G$ requires one of its two generators of order four, even under the positive-word convention. These conditions characterize all inclusion-minimal sets: exactly one such generator, exactly one representative per exterior block, exactly one per absent target layer, and no extra labels. The two absent-layer size lists are $(2,2)$ and $(1,4)$, both with count two and product four. This yields (8), and $g_r=h_r$. The intersection of the inclusion-minimal sets is empty except for the member of the absent singleton in the second case. $\square$

**Lemma 10 (exact promised query cost).** The deterministic adaptive and nonadaptive emptiness and counting costs on this promise equal $pq-1$.

*Proof.* Each query is either fixed or reads exactly one array position, with the label recoverable from the returned element. If a transcript reveals absorbing-zero labels at at most $pq-2$ distinct positions, it is compatible with both cases by placing the two required labels in two unqueried positions. A deterministic procedure cannot terminate there. This lower bound applies also with the stronger side data, by Lemmas 8–9. Conversely query any $pq-1$ positions: at least one nonnegative label must occur, revealing the case. Its value also determines $|E|$ on the promise. $\square$

## 7. All orders and conclusion

For even $n$ choose $p+q=(n-14)/2$ and $p,q$ differing by at most one. Then $pq=\lfloor(n-14)^2/16\rfloor$. For odd $n$ add one extra singleton layer $T_*$ with the same fixed actions as $T_0$, and fix one designated array position to its label in both cases. Use the same two promises on all other positions. Lemma 8 remains valid by the same multiplication rules; the extra singleton is always present, so does not change either the required generator choices or $E$. The missing size lists remain $(2,2)$ and $(1,4)$. Now $n=2(p+q)+15$, there are $pq-1$ free positions, and their exact promised decision cost is $pq-2$ by the proof of Lemma 10. With $p,q$ balanced, the lower bound in Theorem 1 follows for every $n\ge23$.

For each task the lower bound is $n^2/16-O(n)$; the nonadaptive upper bound in (6) at $s=4$ is $n^2/16+O(n^{5/3})$. Counting is at least as difficult as deciding emptiness, and nonadaptive algorithms are no more powerful than adaptive ones. The bounds therefore squeeze all four costs in both side-data models to
$$
\lim_{n\to\infty}D(n)/n^2=1/16.
$$
This proves Theorem 1.

The argument also yields the restricted upper coefficient $1/(4s)$ when only ambiguous composite classes of size at least $s$ need to be tested, for example $1/24$ when there are no ambiguous classes of size four. No matching lower bound for such restrictions is asserted here. Further work includes less generous side data, finite-order bounds, randomized complexity, stronger generating-set statistics, and labelled recovery of $E$.

## 8. Sharp coefficients with additional generating statistics

**Theorem 11 (three further sharp limits).** In the model $D_L$ of Section 5, for either structural side-data model, and for each of deterministic exact decision and cardinality, adaptive or nonadaptive,
\[
\lim_{n\to\infty}D_1(n)/n^2=1/24,\qquad
\lim_{n\to\infty}D_2(n)/n^2=\lim_{n\to\infty}D_3(n)/n^2=1/32.
\]
The lower bounds also hold with the entire inclusion-minimal generating-set size enumerator supplied.

*Proof.* The upper bounds follow from Section 5 and the certified thresholds $s_1=6$, $s_2=s_3=8$. For the lower bounds use the multiplication rules (7) with $A=[U]\times[p]$, $B=[q]\times[V]$, arbitrary layer dimensions $u_\ell\le U,v_\ell\le V$, and arbitrary surjections $\alpha_\ell:[U]\to[u_\ell]$, $\beta_\ell:[V]\to[v_\ell]$ replacing the two modular-coordinate maps. Replace the unit group by $C_3$ acting trivially on all nonunits on both sides. The seven nonzero nonunit type strings in Lemma 8 have the same outputs in both bracketings, with the surjections simply replacing coordinate reduction. Triples involving units associate by the trivial actions and group law. Surjectivity suffices for the principal ideal descriptions in Lemma 8, with coordinates replaced by their images. Thus all structural data remain fixed for every $W$, including every proper principal-ideal internal table.

Generation now requires a generating subset of $C_3$, full row and column coverage of each band, and one member of every absent target layer. Necessity follows from the multiplication types and surviving row/column coordinates; sufficiency follows from the rectangular band law, surjectivity of the two fixed layer actions, and the fact that each present layer is generated by one occupied array position. The zero is generated by a $BA$ product. For $p\ge U\ge2$, $q\ge V\ge2$, the exterior rank is $1+p+q$. The leading exterior count is twice the product of the numbers of surjections $[p]\to[U]$ and $[q]\to[V]$. In particular the old unit-action counting formula is not used here. Let $F$ and $H_{\rm fix}$ be the common exterior ordinary and inclusion-minimal enumerators. If $Z$ is the set of absent layers, with sizes $s_\ell$, $D=|K|$, $b=|Z|$, $P=\prod_{\ell\in Z}s_\ell$, $p_j=\sum_{\ell\in Z}s_\ell^j$, then
\[
G_M(w)=F(w)(1+w)^{D-p_1}\prod_{\ell\in Z}((1+w)^{s_\ell}-1),\qquad
H_M(w)=H_{\rm fix}(w)Pw^b.
\]
Every band cell can be omitted while preserving row and column coverage, and every unit can be omitted from a generating set of $C_3$. Hence $E$ is exactly the union of absent singleton layers. Two disjoint lists of labelled target layers with equal $b,P$ and required moments give opposite-verdict promises when one absent list contains singletons and the other does not. Require every label of the complementary present list to occur at least once. With $m$ free positions an all-zero transcript on at most $m-b$ positions admits both completions, so the exact promised cost is $m-b+1$; querying that many positions also suffices.

For $L=1$, take $U=2,V=3$ and the two lists $(1,3,4,4)$, $(2,2,2,6)$. They have $b=4,p_1=12,P=48$ and every size has a feasible rectangular shape, including size four despite its not dividing six. The order is $n=2p+3q+28$. For all sufficiently large $n$, choose $q$ of the same parity as $n-28$ within bounded distance of $(n-28)/6$, and $p=(n-28-3q)/2$. Then $pq=(n-28)^2/24-O(1)$ and the lower cost is $pq-3$.

For $L=2,3$, take $U=2,V=4$, lists $(1,3,3,3,4,4,8)$ and $(2,2,2,2,6,6,6)$. They have $b=7,p_1=26,P=3456,p_2=124$; every size is feasible. Equal moments imply equal coefficients through $g_{r+3}$ by the earlier moment identity (the normalized logarithm has no cubic term). The order is $n=2p+4q+56+\delta$, $\delta=n\bmod2$, with one fixed-present singleton layer and one reserved position if $\delta=1$. Choose $q$ within bounded distance of $(n-56-\delta)/8$, $p=(n-56-\delta-4q)/2$. Then $pq=(n-56-\delta)^2/32-O(1)$ and the lower cost is $pq-\delta-6$. Thus the lower bounds hold at all sufficiently large orders and match the upper coefficients in all four deterministic tasks. $\square$

More generally let $a_L$ be the least rectangle area $UV$, $U,V\ge2$, supporting a singleton-changing arithmetic collision on sizes $\{uv:1\le u\le U,1\le v\le V\}$. The same proof with at most $\gcd(U,V)-1$ fixed-present singleton padding layers gives $D_L(n)\ge n^2/(4a_L)-O_L(n)$ for all sufficiently large $n$. Exact arithmetic gives $a_L=4,6,8,8,10,10,12,12,14,14,15,15,18$ for $L=0,\ldots,12$. These are optimal areas for this particular construction, not universal optimum coefficients. In particular $a_L=s_L$ for $L\le3$, whereas the later cases in the scan have $a_L>s_L$ and their universal decision coefficients remain open; Section 9 settles cardinality. The [full proof and source comparison](../reviews/P03-sharp-extra-statistics-non-equivariant-bands-2026-11-24.md) and two executed audits provide details. Rectangular-band rank is classical; see Cherubini, Howie and Piochi [19, Theorem 5.1]. No novelty claim is made for that rank formula.

## 9. A sharp cardinality limit at every fixed statistical level

Write $C_L(n)$ for the worst-case cost of exact cardinality, distinguishing it from emptiness decision $D_L(n)$. The upper bound in Section 5 applies to both. The lower proof below does not apply to emptiness.

**Theorem 12 (sharp cardinality for all fixed levels).** For every fixed nonnegative integer $L$, in either side-data model, for adaptive as well as nonadaptive deterministic algorithms,
\[
\lim_{n\to\infty}C_L(n)/n^2=1/(4s_L).
\]
The same conclusion holds if the full inclusion-minimal generating-set size enumerator is also supplied.

*Proof.* Set $V=s_L$, $U=1$. By definition of $s_L$ choose a singleton-changing arithmetic collision on sizes $1,\ldots,V$. Equivalently take an integer kernel vector with positive first coordinate and split its positive and negative parts into disjoint size multisets of common length $b$, product $P$ and prescribed moments. One list has $d>0$ ones and the other none. Such a vector exists for each fixed $L$ by the polynomial construction in the arithmetic note. Use the construction of Section 8 with this $U,V$, a separate labelled layer of shape $1\times s$ for each part, and the same trivial unit actions. The associativity and common-data proofs of Section 8 hold without change for $U=1$. A generating subset now necessarily contains every member of the right-zero band $A$: a product yielding such a member either has that member as its right $A$ argument or multiplies it by a unit acting trivially. The full generation criterion of Section 8 remains valid (row/column coverage of $A$ now means all of $A$). Its fixed enumerators have a factor $w^p$; the same absent-layer formulas apply. In particular the two complementary label promises have common $r$, prescribed ordinary coefficients and $H$.

For $p\ge2$, $q\ge V\ge2$, every member of $B$, every unit, and the zero can be omitted from some generating subset. Hence $E$ consists of all $p$ members of $A$ together with the absent singleton targets. The two promises have cardinalities $p$ and $p+d$, and both have nonempty $E$. The same zero-transcript argument gives the exact promised cardinality cost $pq-b+1$. Let $c=|K|+3$; then $n=p+Vq+c$. For every sufficiently large $n$, choose $q=\lfloor(n-c)/(2V)\rfloor$ and $p=n-c-Vq$. This requires no padding, and $pq=(n-c)^2/(4V)-O_L(1)$. Thus $C_L(n)\ge n^2/(4s_L)-O_L(n)$ at all sufficiently large orders. Together with the upper bound in Section 5 this proves the limit. $\square$

For example, $L=4,5$ has $s_L=9$ and signed size coefficients $(5,-26,36,-8,0,-18,0,20,-9)$ on $1,\ldots,9$. The two lists have $b=61$, $P=2^{60}3^{36}$, $p_1=273,p_2=1609,p_4=84841$. The one-row construction has order $p+9q+550$ and counts $p$ versus $p+5$. Thus the sharp cardinality coefficient is $1/36$, whereas decision still lies between $1/40$ and $1/36$. This is a distinction in currently proved sharpness results, not a proof that decision is strictly easier in worst-case asymptotics.

An optional instance-dependent query plan for $L=4,5$ is to determine missing counts of sizes at least 10, then choose the cheapest of the six size groups $2,3,4,6,8,9$. Indeed the arithmetic matrix on sizes $1,\ldots,9$ has rank 8 with kernel spanned by the above vector, so fixing any coordinate in those six groups fixes the singleton coordinate. Minimize the union of canonical blocks for the chosen size and the larger sizes, using the known data. This does not establish a smaller universal coefficient for decision. See the [proof and audit report](../reviews/P03-sharp-cardinality-all-statistical-levels-2026-11-24.md) and [one-row construction audit](../experiments/one-row-counting-sharpness-audit.js). This section uses fixed $L$; no uniform lower bound for growing $L(n)$ or randomized sharpness is asserted.

## 10. Decision at L=4,5: the degenerate-block obstruction

For $L=4,5$, the alternative size-coordinate inference in Section 9 permits two sufficient plans: query sizes at least ten and size eight, or query sizes at least ten and size nine. When the fixed indispensable contribution is nonempty, decide immediately; otherwise use the E-free exterior property. For each distinct canonical endpoint pair write $d_{ij}=l_i r_j$, $b_{ij}=N_iN_j/d_{ij}$. The average of the two plan costs charges a block once if it occurs in both, and half if it occurs in just one. Each used block has $d_{ij}\ge8$. A common block with $d_{ij}<10$ must serve both sizes eight and nine, so $d_{ij}=9$. Dimensions $(3,3)$ cannot dominate a size-eight target: its L- and R-class sizes would each be at most three with product eight times its H-size. Thus only common blocks of dimensions $(1,9)$ or $(9,1)$ can obstruct the target averaged rate $1/10$ per endpoint mass product.

For completeness, the weighted variant of Lemma 6 needed here is
\[
\sum_{i\to j\in F}w_{ij}N_iN_j/(l_i r_j)\le(\sum N_i+8|F|)^2/40,
\]
under the same three-region and Z-mass hypotheses, with $l_i r_j\ge8$, $0\le w_{ij}\le1$ and $10w_{ij}\le l_i r_j$. In the concentration proof, if the central edge is absent use the bound $(U+V)\sum_Z N_i/10$. Otherwise put $\lambda=l_x,\rho=r_y$ as before. For a doubly incident Z vertex set $a=10w_{xz}, b=10w_{zy}$. Then $(l-b/\rho)(r-a/\lambda)\ge0$ gives $aN/(\lambda r)+bN/(l\rho)\le N+ab/(\lambda\rho)\le N+16$. Charge eight to each distinct incident edge, so total surcharge is at most $8|F|$. The remainder of the proof is the same quadratic inequality with denominator ten. Apply the small-rectangle and large-class exclusions of Theorem 7 to the union of the two plans; these cost $O(n^{5/3})$. Every remaining edge has a distinct assigned target of size at least eight, so the mass plus edge charge is at most $n$.

Let $\kappa_{ij}\le b_{ij}$ be a metadata-computable sufficient query-plan size for the assigned targets of each common degenerate area-nine block. Query the same sufficient block plan in both alternatives, counting exits outside it if necessary. With weight $\kappa_{ij}/b_{ij}$ on those blocks, and full or half weights on other blocks as appropriate, clip weights of the degenerate common blocks to $9/10$ and charge the excess separately. Hence for the cheaper plan,
\[
D_L(n;\text{instance})\le n^2/40+\sum_{\text{common degenerate area-nine blocks}}(\kappa_{ij}-0.9b_{ij})_++O(n^{5/3}).
\]
The orbit action $(\mathcal L(x),\mathcal R(y))\mapsto(\mathcal L(xg),\mathcal R(g^{-1}y))$ of units preserves product J-class, so one representative per orbit suffices. These orbits are computable from the nonzero quotient. In particular, if each element of the singleton-L endpoint is moved by a right unit (or dually for singleton R), the number of orbits is at most $b_{ij}/2$.

**Restricted sharpness.** For the metadata-defined subclass in which every common degenerate area-nine block has orbit count at most $0.9b_{ij}$ (or a sufficient compressed plan meeting the same bound), the worst-case decision coefficient is $1/40$, for $L=4,5$ and both deterministic models of adaptivity and both side-data models. The upper follows above; the all-order $2\times5$ band lower family of Section 8 satisfies the condition vacuously. This is not an unrestricted sharpness claim.

The [detailed report](../reviews/P03-L4-decision-degenerate-blocks-2026-11-24.md) gives a further local compression based on nonself factorization of a right-zero endpoint $I$ when $l_I=1$, $|I|=p\ge2$. Each $x\in I$ admits $x=a_xt_x$ with $a_x\in I\setminus\{x\}$ and $t_x$ in a strictly higher class, all known from the quotient. Use dependencies within the block when $t_xy$ remains in the other endpoint class, discard lower exterior products that cannot hit an assigned target, and query exit pairs when $t_xy\in K$. For $q=N_J/r_J$ and $h$ distinct L-classes of chosen nonunit factors, this gives a simultaneous target-presence plan of at most $(pq+E_{\rm exit})/2\le(p+h)q/2$ queries, where $E_{\rm exit}$ is the number of distinct exits. The dual holds for singleton R. An upper-band example with trivial unit actions and no exterior indispensable elements shows the orbit condition is not automatic even with balanced statistics. The [executed audit](../experiments/L4-degenerate-block-compression-audit.js) checks the local algorithm and the weighted inequality. The unresolved step is to charge exits globally without counting higher elements multiple times, or otherwise control the residual. No general improvement over $1/36$ is claimed here.

## Appendix A. Reproducibility and limitations

The mathematical proofs above do not depend on computation. To check the smallest balanced construction directly, the archived [C++ enumerator](../experiments/independent-generation-enumerator-audit.cpp) computes the closure of every nonempty subset of five order-20 tables ($p=1,q=2$), including one unbalanced baseline, without relying on formulas for generating sets. Its exact repository blob (Git SHA-1 0be53a45f024cfc79cf2a27a5ea722fff416e709) was reproduced locally, compiled with the command below and actually executed on 24 November 2026.

~~~sh
g++ -O3 -std=c++17 independent-generation-enumerator-audit.cpp -o enumerator
./enumerator
~~~

| Array labels | Rank | Minimum-cardinality count | Inclusion-minimal enumerator | Indispensable count |
|---|---:|---:|---:|---:|
| -1,-1 | 8 | 256 | $256w^8$ | 1 |
| 0,1 | 6 | 64 | $64w^6$ | 0 |
| 1,0 | 6 | 64 | $64w^6$ | 0 |
| 2,3 | 6 | 64 | $64w^6$ | 1 |
| 3,2 | 6 | 64 | $64w^6$ | 1 |

The program reported PASS for 5,242,875 nonempty subset closures and 40,000 associativity triples, checking also the labelled ideals, the supplied products, regularity/idempotence and the characterization in Lemma 2.

Other repository scripts include [all-orders padding](../experiments/all-orders-padding-audit.js), [regular localization](../experiments/composite-regular-localization-audit.js) and [weighted graph inequality](../experiments/sharp-statistical-coefficient-audit.js). They are provided as reproducible supporting code, not required steps of the proof. Only the C++ run is newly confirmed by the local execution described above; the other programs were not rerun in this manuscript preparation. Synthetic weighted graphs need not arise from monoids, and small tested monoid families do not exercise every structural case. No exhaustive enumeration of all monoids, formal proof certification, or external independent refereeing is claimed.

## References

The following are background references and neighboring work, not a comprehensive priority survey. References and bibliographic details carried over from earlier drafts require independent verification against the source where the original retrieval evidence is unavailable. Directly supported in the available record are the Chang full-text Drive read [5] and the targeted author-manuscript reads of [12] in version 1.5. Pin [13] is an abstract-only lead; no full-text priority verdict is made.

1. J. M. Howie, *Fundamentals of Semigroup Theory*, Clarendon Press, Oxford, 1995, Chapter 2. [Publisher record](https://academic.oup.com/book/53985).
2. R. D. Gray, The minimal number of generators of a finite semigroup, *Semigroup Forum* **89** (2014), 135–154. [doi:10.1007/s00233-013-9521-8](https://doi.org/10.1007/s00233-013-9521-8).
3. C. R. Donoven, J. D. Mitchell and W. A. Wilson, Computing maximal subsemigroups of a finite semigroup, *Journal of Algebra* **505** (2018), 559–596. [doi:10.1016/j.jalgebra.2018.01.044](https://doi.org/10.1016/j.jalgebra.2018.01.044).
4. L. Fleischer, The Cayley Semigroup Membership Problem, *Theory of Computing* **18**, article 8 (2022), 1–18. [doi:10.4086/toc.2022.v018a008](https://doi.org/10.4086/toc.2022.v018a008).
5. C.-L. Chang, Hardness of learning loops, monoids, and semirings, *Discrete Applied Mathematics* **162** (2014), 149–158. [doi:10.1016/j.dam.2013.08.012](https://doi.org/10.1016/j.dam.2013.08.012). Full extracted text (printed pp. 149–158) reviewed from the supplied Drive copy on 24 November 2026; see the linked source comparison for page-level evidence and limitations.

6. J. Zumbrägel, G. Maze and J. Rosenthal, Efficient recovering of operation tables of black box groups and rings, *IEEE ISIT* (2008), 639–643. [doi:10.1109/ISIT.2008.4595064](https://doi.org/10.1109/ISIT.2008.4595064); [arXiv:0805.0514](https://arxiv.org/abs/0805.0514). Full five-page extracted text reviewed in version 1.2; page screenshot requests failed. See the comparison report.

7. F. Ergün, S. Kannan, S. R. Kumar, R. Rubinfeld and M. Viswanathan, Spot-Checkers, *Journal of Computer and System Sciences* **60** (2000), 717–751. [doi:10.1006/jcss.1999.1692](https://doi.org/10.1006/jcss.1999.1692); [author manuscript](https://www.cs.princeton.edu/courses/archive/spr04/cos598B/bib/ErgunKKRV.pdf), introduction and Section 4.4 reviewed.

8. J. Schmid, Nongenerators, genuine generators and irreducibles, *Houston Journal of Mathematics* **25** (1999), 405–416. [Author publication list](https://www.math.unibe.ch/ueber_uns/personen/prof_em_dr_schmid_juerg/index_ger.html); [text](https://citeseerx.ist.psu.edu/document?doi=9d7ec08426729e2b97d6978c59a2802b837ec3bb&repid=rep1&type=pdf), Section 3 reviewed.

9. C. Bergman and G. Slutzki, Computational Complexity of Generators and Nongenerators in Algebra, *International Journal of Algebra and Computation* **12** (2002), 719–735. [Author copy](https://faculty.sites.iastate.edu/cbergman/files/inline-files/frattini.pdf), Propositions 3.8–3.9 and related definitions reviewed.

10. P. Lipparini, Non-generators in extensions of infinitary algebras, *Reports on Mathematical Logic* **57** (2022), 31–43. [doi:10.4467/20842589RM.22.002.16659](https://doi.org/10.4467/20842589RM.22.002.16659), Section 2 and selected further passages reviewed.

11. P. A. Grillet and M. Petrich, Ideal extensions of semigroups, *Pacific Journal of Mathematics* **26** (1968), 493–508. [Publisher PDF](https://msp.org/pjm/1968/26-3/pjm-v26-n3-p09-s.pdf). Definition 1.1, Theorem 1.2 and Theorem 4.1 with related excerpts inspected in version 1.4; PDF screenshots failed.

12. B. Le Saëc, J.-E. Pin and P. Weil, Semigroups with idempotent stabilizers and applications to automata theory, *International Journal of Algebra and Computation* **1** (1991), 291–314. [doi:10.1142/S0218196791000195](https://doi.org/10.1142/S0218196791000195); [author manuscript](https://www.labri.fr/perso/weil/publications/13.pdf), Theorems 1.1 and 4.3, Proposition 2.1 and selected related passages reviewed. Their covering result imposes structural identities on stabilizers in a new semigroup, rather than localization of witnesses in the original monoid.

13. J.-E. Pin, Green classes ruled by regular ones, *Semigroup Forum* (2026). [doi:10.1007/s00233-026-10636-4](https://doi.org/10.1007/s00233-026-10636-4). Abstract-only lead; full text unavailable through attempted access. See the [stabilizer comparison and access record](../reviews/P03-stabilizers-source-access-2026-11-24.md).

14. A. J. Cain, R. Gray and N. Ruškuc, Green index in semigroups: Generators, presentations, and automatic structures, *Semigroup Forum* (2012). [doi:10.1007/s00233-012-9406-2](https://doi.org/10.1007/s00233-012-9406-2); [arXiv:0912.1266](https://arxiv.org/abs/0912.1266). Section 4, Theorems 1–2 and 4, targeted text review in v1.6.

15. K. Alladi and P. Erdős, On an additive arithmetic function, *Pacific Journal of Mathematics* **71** (1977), no. 2. [Publisher PDF](https://msp.org/pjm/1977/71-2/pjm-v71-n2-p01-s.pdf), introduction and opening of Section 2 reviewed.

16. J. Berman, Upper bounds on the sizes of finitely generated algebras. [Author PDF](https://www.math.uic.edu/~berman/upper-bounds.pdf), Section 3, including Proposition 3.5 and Definition 3.6, targeted review.

17. B. Cha et al., An Investigation on Partitions with Equal Products, [arXiv:1811.07451v1](https://arxiv.org/abs/1811.07451) (2018), abstract, introduction and references reviewed.

18. A. Lucchini, Generating hypergraphs of finite groups, *Ars Combinatoria* **161** (2024), 17–28. [Publisher PDF](https://combinatorialpress.com/article/ars/Volume%20161/generating-hypergraphs-of-finite-groups.pdf), Section 3 reviewed.

19. A. Cherubini, J. M. Howie and B. Piochi, Rank and Status in Semigroup Theory. [Author manuscript](https://www.mate.polimi.it/wp-content/themes/mymate/send_new.php?file=553-P&tipo=1), Theorem 5.1, p. 13, targeted text read in v1.8; screenshot failed. Classical rectangular-band rank.

## Editorial status

This is an internal standalone mathematical manuscript, not a submitted or accepted paper. Claims concern the stated query model, not unconditional computational complexity or novelty of the definition of indispensable elements. The scope of the reference review is limited to records and indexed summaries, except for the full extracted-text reviews of Chang [5] in version 1.1 and Zumbrägel–Maze–Rosenthal [6] in version 1.2. Version 1.3 includes verified targeted text reads of [3], [7–10], including exact lemma and proposition references, and selected passages of [2]. Screenshot attempts failed; no visual PDF audit is claimed. Version 1.4 includes actual targeted source reads of [11] and fresh verification of Definition 3 and Propositions 10 and 16 of [6], Propositions 3.8–3.9 of [9], Proposition 3.3 of [3], and Theorem 53 excerpts of [7]. These fresh checks do not establish the timing or execution of earlier undocumented searches. Earlier bibliographic and execution assertions not independently confirmed should not be treated as verified. Version 1.5 records actual targeted reads of [12] and a successful visual inspection of manuscript page 3, with other screenshot attempts failing, and an abstract-only read of [13]. The full-text comparison with [13] remains blocked pending a copy requested from the project owner. Version 1.6 freshly checks [12] Proposition 2.1 and Theorem 4.3 with related results, [2] relative rank and Graham–Houghton graphs, and [14] relative-generation results; Gray's PDF page index 2 was visually inspected, whereas screenshot requests for [12] and [14] failed in this round. [13] remains pending. Version 1.7 records targeted primary-text reads of [15–18], with only the cover of [15] visually displayed successfully; the other screenshot requests failed. The extra L>=1 bounds are separate from the sharp Theorem 1. Version 1.8 proves Theorem 11, matching the upper bounds for L=1,2,3 with the new non-equivariant construction. It records a targeted primary-text read of [19], not a comprehensive originality review. Version 1.9 establishes Theorem 12 for cardinality at every fixed L; the higher-level emptiness question remains open. No new external source retrieval is claimed in v1.9. Version 1.10 isolates the L=4,5 decision obstruction and proves restricted sharpness at 1/40 with a residual bound and local compression, not a general decision theorem. Only indexed literature excerpts were consulted in v1.10; no full-text comparison or historical priority claim. Previous draft statements about searches or source reads are historical claims, not independent retrieval evidence. Authorship, disclosure of AI assistance, independent proof review and a systematic literature comparison must be settled before public submission. The research history and exploratory notes are maintained separately; the manuscript does not rely on their numbering or on unverified literature-search execution claims.
