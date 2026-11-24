# Extension freedom and sharp designated-element query bounds
24/11/2026. Internal mathematical research note in the scientific-priority branch; not externally reviewed, not formally verified, no priority claim. Starting point: manuscript v0.6, commit 0eff17f5d9513a672ddbb5af86ad437a260a671f. No new T numbers assigned and no main modification.

## Model
A finite labelled monoid M of size n, with identity and a designated nonempty proper ideal K of size k, is promised. The metadata D* consists of the labelled unit group/actions, all labelled principal left/right/two-sided ideals, the product tables within all proper principal ideals, and the complete labelled Rees quotient M/K, quotient map, table of K, and every product with a factor in K. Idempotents, regular elements, and original Green metadata may additionally be supplied. Optional generating statistics only shrink the set of compatible tables. Computation is free; one query returns one product. Generation is by nonempty words.

Write G for the unit group and A=M\(G∪K), a=|A|. A proper ideal contains no unit. Let F(D*) denote the nonempty set of compatible labelled associative tables. We distinguish the log2 cardinality of this fibre from query complexity of any one property. No assertion about ordinary running time.

## A. Universal fibre bounds
All products with a factor in K or G are known. For x,y outside those sets, if their quotient product is nonzero its lift is unique. If it is zero the possible outcomes lie in K. A further restriction follows from the known principal ideals: xy belongs to xM∩My. For a compatible table define translations on K by L_x(u)=xu, R_x(u)=ux. Then L_(xy)=L_x∘L_y and R_(xy)=R_y∘R_x. Thus for an uncertain cell the candidate set
\[
B_{xy}=\{z\in K\cap xM\cap My: L_z=L_x\circ L_y,\ R_z=R_y\circ R_x\}
\]
is computable from D*. Only cells with x,y∈A and quotient product zero need be considered. If J_x and J_y are comparable then both are in the higher element's principal two-sided ideal, which is proper, so that cell is known. In particular diagonal cells are known. Let U be the remaining ordered pairs. Consequently
\[
|\mathcal F(D^*)|\le\prod_{(x,y)\in U}|B_{xy}|
\le k^{a(a-1)}.
\]
The factors need not be independent. If K is weakly reductive every nonempty candidate set is a singleton and the entire extension is fixed. This translation observation is classical; the counting inequality is immediate. It is not an exact universal count.

## B. Raw information capacity: asymptotically sharp leading order
For integers a≥k≥2 take X={x_0,...,x_(a-1)}, K={z_0,...,z_(k-1)} and an identity 1. On the nonunits all products involving K equal z_0. For x_i x_j, reserve the k cyclic diagonals j-i≡d (mod a), 0≤d<k, assigning output z_d; all remaining cells choose independently any member of K. All triples of nonunits collapse to z_0, so associativity holds. Every row and column meets all K. The principal ideals of x_i are all {x_i}∪K, those of z_j are {z_j,z_0}, and those of 1 are all M. The square x_i²=z_0 is fixed. Hence every proper principal ideal's internal product, quotient, K and actions on it, unit data, Green data, idempotents {1,z_0} and regular elements {1,z_0} are fixed. 
The set E={1}∪X is fixed (nonempty words); every generating set must contain it, and it generates all K by the reserved diagonals. Thus the entire labelled generating family, not just the statistics, is constant: r=a+1, h_r=1, h_j=0 for j≠r, and g_j=binom(k,j-r) for r≤j≤n (zero otherwise).
There are exactly k^{a(a-k)} distinct labelled tables in this explicit subfamily (not a count of isomorphism classes and not a claim of equality for the entire D* fibre). For fixed k, the lower and upper exponents differ by a(k−1). In particular k=2 allows a(a−2) independent bits, asymptotically a². 
Let C_n be the maximum log2 fibre size over all D* for n-element monoids. For each sufficiently large n choose k=floor(n/ln n), a=n-k-1. Then k≥2 and a≥k, a/n→1, (a-k)/n→1, log2 k/log2 n→1. Therefore
\[
\lim_{n\to\infty}\frac{C_n}{n^2\log_2 n}=1.
\]
Upper bound follows already from n^{n²} total binary tables, or A. This is a leading-order maximum, not a finite-n exact formula or an exact subleading asymptotic. It remains true if the full labelled family of generating sets is included in the metadata: construction B already fixes that family. In contrast the E decision here is trivial from the common metadata, so raw fibre size does not give an E query lower bound.

## C. Sharp universal designated-element upper bound
**Proposition.** Given D* and target t, one can decide membership t∈E(M) with at most floor(a²/4) multiplication queries. If k=1 or t∉K, zero queries suffice. For n≥5, the worst-case deterministic cost over all such metadata and targets is exactly floor((n−3)²/4). This last maximum does not require identical rank or generating statistics, nor a change in emptiness.
**Proof.** If k=1 every product is fixed by the quotient and given actions. If t∉K, every product equalling t is known from the nonzero quotient outputs or the known entries, so membership is determined.
Otherwise enumerate all compatible tables (free computation). If no table has t indispensable, output no. If all do, output yes. In the remaining case fix one compatible table M0 with t indispensable. Let x,y be a pair for which a compatible table M1 has xy=t with x,y≠t, while the entry is not already known. Necessarily x,y∈A. The common principal ideals give t∈xM0 and t∈M0 y. Because t is indispensable in M0, the witnesses in those ideals must be xt=t and ty=t. These products, having a factor in K, hold throughout the fibre. Define P={x∈A:xt=t}, Q={x∈A:tx=t}. Thus x∈P,y∈Q.
In M0, xy=z∈K, z≠t; the common translations on K force L_z=L_t and R_z=R_t, by associativity in M0 and M1. Hence z²=t². If t²=t then z²=t in M0 with z≠t, contradiction. Therefore t²≠t. In M1, if y∈P then (xy)t=t² but x(yt)=xt=t, impossible. Similarly if x∈Q then t(xy)=t² but (tx)y=ty=t. So any possible new witness lies in (P\Q)×(Q\P). These two sets are disjoint subsets of A; their sizes have product ≤floor(a²/4). Query these ordered pairs (known cells may be skipped). If any equals t, it is a witness against indispensability; otherwise no compatible actual table can have such a witness. This proves the upper bound. For ambiguous cases k≥2 and at least one unit exists, so a≤n−3. Square brackets here denote floor, not an asymptotic statement.
**Sharpness.** For p,q≥1 let M={1}∪A∪B∪{t,z}, |A|=p, |B|=q, K={t,z}. This is Section 2 of v0.6 with the trivial unit group and singleton A/B blocks: A is right-zero, B left-zero, AB is an arbitrary Boolean p×q array choosing t or z, BA=z, at=t and tb=t, all remaining products of nonunits z. Identity obvious. Associativity follows by exactly the nonunit triple check of Section 2; no action constraints. All principal ideals as there, quotient and K actions, idempotents and regular elements and proper principal ideal multiplications are fixed. E={1}∪A∪B, with t added iff the array is zero. All pq entries must be queried on the all-zero input; otherwise a single-bit array remains consistent with the transcript. The cost pq attains floor((n−3)²/4) for p=floor((n−3)/2), q=ceil((n−3)/2). The rank is p+q+1+1_(W=0), so this is not a lower bound attaining the universal upper bound with rank granted. Nor does E ever become empty here. These distinctions are essential. For this family only, the optimal expected randomized cost is (1−2ε)pq by the ordinary OR argument. No assertion of the optimal randomized universal bound.

## D. Relation to the strengthened T56
The basic parity-refined fibre in v0.6 has exactly 2^(2pq) labelled compatible tables for its specified extension data; p=q gives ~n²/8 independent bits. Section B shows that this is not a universal upper bound on raw extension freedom. Section C gives a sharp universal designated-element bound, and applies as an upper bound also when more statistics are supplied. But the examples attaining it do not preserve rank when t changes; the stronger T56 promise has different requirements. For emptiness E=∅ the unknown witnesses for multiple candidate targets could occupy distinct pairs. No claim that the designated-element bound applies to emptiness of E without additional conditions. The exact asymptotic constant for that problem with all T56 statistics remains open in the project.
One possible direction is to exploit the disjoint sets P\Q,Q\P simultaneously for every ambiguous t, while keeping the fixed-rank and enumerator balance. The impossibility of changing E while fixing all g is still T53; the raw-capacity example is consistent with this.

## E. Priority check
Actual web searches 24/11/2026:
- Kleitman Rothschild Spencer number semigroups order n 3 nilpotent asymptotic n squared log n
- enumeration 3 nilpotent semigroups labelled multiplication arbitrary function square zero Distler Mitchell
- semigroup ideal extensions fixed principal ideals number of semigroups nilpotent enumeration generating sets
- semigroup ideal extension interchangeable elements ramification function weakly reductive semigroup Grillet Petrich
- semigroup indispensable irreducible elements principal ideals maximal subsemigroup query complexity multiplication table
Opened https://arxiv.org/html/2411.00466v2, §1, especially lines describing the classical N(X,K,m) construction and unique minimal generating set. Other results inspected by snippets/abstracts only; no new PDF read and no MathSciNet/zbMATH access. 
- A. Distler and J. D. Mitchell, The number of nilpotent semigroups of degree 3, Electronic J. Combin. 19(2) (2012), P51, https://arxiv.org/abs/1201.3529. Classical freedom of arbitrary X×X→K when all triples collapse. 
- I. Dolinka, D. G. FitzGerald, J. D. Mitchell, Semirigidity and the enumeration of nilpotent semigroups of index three, preprint v2 27 Oct 2025, https://arxiv.org/abs/2411.00466. §1 gives same construction and unique generating set. Their discussion warns that the assertion that almost all semigroups are 3-nilpotent is not established; our proof does not require it.
- D. Kleitman, B. Rothschild, J. Spencer, The number of semigroups of order n (1976), bibliographic/secondary comparison only. Not relying on any stronger asymptotic proportion claim.
- P. A. Grillet and M. Petrich 1968, Ideal extensions of semigroups, https://msp.org/pjm/1968/26-3/pjm-v26-n3-p09-s.pdf; earlier review, and current snippets; translation and ramification theory known.
- Renshaw–Warhurst 2024, https://doi.org/10.1007/s00233-024-10447-5; previous review and current snippet. Weak reductivity/interchangeability known.
Verdict: A and classical nilpotent construction KNOWN tools; B is a short refinement using reserved cyclic diagonals to fix labelled ideals and generating incidence, not a strong standalone originality claim. C exact bound in the specified side-information query model NO_MATCH_YET in this narrow search, not historical priority. The sharpness construction is a simplification of project T49 and not an asserted new type of semigroup. Further searches specifically on extremal query counts, translation-equivalent outputs and indispensable elements are necessary.

## F. Reproducibility
[JavaScript finite audit](../experiments/extension-freedom-extremal-audit.js), executed in this turn.
- Sharpness family p,q=(1,1),(1,2),(2,2),(2,3),(3,3): all arrays, counts 2,4,16,64,512 (598).
- Raw family (a,k)=(3,2),(4,2),(4,3),(5,4): all free assignments, counts 8,256,81,1024 (1369).
All 1967 tables passed associativity, direct E test, equality of labelled principal ideals, proper principal ideal products, K actions and quotient, regularity/idempotent data. Identity fixed by construction. Raw generation witness checked by first row covering K. These checks do not enumerate every compatible table of a general fibre and do not prove the universal upper bound; the analytic proofs do. No GAP/CI/Lean run. 
