# Exterior transport, nonuniform common-witness slots, and size-weighted separation
24 November 2026. Continuation of [class expansion and Hamming separation](P03-small-sink-class-expansion-hamming-2026-11-24.md). Internal proofs; no new T numbers, main changes, external referee or formal verification.

## 1. Results and scope

Retain D*, the labelled compatible tables, G, the designated nonempty proper ideal K, A=M\(G union K), a=|A|, n=|M|, positive-word generation, and free computation. A nonregular interior class C is missing when there is no first-entry product from two strictly J-higher elements. First-entry products for a class that is missing in another compatible table must have both factors in A (all products involving K or units and all nonzero quotient outputs are supplied).

New results:
1. Every member of a newly present nonregular interior J-class is itself a first-entry output of two exterior factors. More strongly, outer multipliers carrying a witness output within that class never force the corresponding exterior coordinate products into K. This strengthens the earlier expansion proof and rules out its previously considered inside-K branch.
2. The 1/16 barrier for uniform independent slots extends to nonuniform independent slots with a common first-entry witness cell for a fixed singleton t and a fixed nonsingleton C. No uniform singleton filling, regularity of the witness factors, or bounded size of C is assumed. This is a restricted construction obstruction, not a global query upper bound.
3. A new nonuniform balanced family realizes exactly two singleton witness cells and ten composite witness cells in each slot, with one-query label readability. It has exact deterministic promised cost 2pq−1 and best leading coefficient 1/40, so does not improve the earlier 1/16 global lower bound.
4. Size-weighted Hamming distance now obeys a stronger class charge max(4,|C|) for nonsingletons, and exact bounded integer enumeration certifies distance >=17 at L=1, >=29 at L=2,3, >=31 at L=4,5. These are not claimed sharp. L=0 sharp distance 8 unchanged. Global query interval at L=0 remains [1/16,2/9].

## 2. Exterior transport theorem

Fix compatible M0 with C missing and M1 with C present. Let xy=c in C be any first-entry witness in M1. Here x,y are exterior nonunits and J_x,J_y>C. Because the labelled right ideal xM is identical in both tables, in M0 there exists r with xr=c. Necessarily J_r>=C; if J_r>C this would be a first-entry witness in M0, impossible. Hence r in C. Since r in K, xr=c holds in all tables. Dually there is l in C with ly=c in every table. In particular
\[
 c\in xC\cap Cy
\]
with these two subsets determined by supplied actions. This statement concerns each possible first-entry output, not arbitrary xy in K.

Let p be any multiplier with pc in C. In M1 put w=px. Associativity gives wy=pc in C, so J_w>=C. If w in K and J_w>C, the product wy is supplied and gives a forbidden first-entry product in M0. If w in C, then wr=(px)r=p(xr)=pc belongs to C, contrary to nonregularity of C (no product of two C-members stays in C). Both impossible. Thus w lies outside K and is a nonunit because x is a nonunit. Hence w in A, its value is supplied by the quotient, and (w,y) is a first-entry witness of pc. Dually, if cq in C then yq is in A and x(yq)=cq. This also shows such p or q cannot belong to K.

Now for any d in C, there exist p,q with d=pcq (J-equivalence). By ideal monotonicity both pc and cq belong to C. By the result just proved px,yq belong to A, and
\[
 (px)(yq)=d.
\]
Both factors are strictly J-higher than C because C is inside K and the products land in C. Thus all d in C have first-entry witnesses. In particular the set D_C of first-entry cells in M1 has size >=|C|. Combined with the earlier nonself-dependency lower bounds (which assume exterior E empty), this gives
\[
 |D_C|\ge 2 \ (|C|=1),\qquad
 |D_C|\ge\max(4,|C|) \ (|C|>1).
\]
All cells of D_C change between M0 and M1, since C was missing. The coverage theorem itself does not require exterior E empty, nor a null ideal. For a small balanced sink S of size k=2 or 3 reporting c, each v in L(c) has k witnesses (px_i,y_i), and each v in R(c) has k witnesses (x_i,y_i q). These are distinct because projections are injective, and disjoint for distinct v by their outputs. This gives the previous k max(|L(c)|,|R(c)|) expansion without an inside-K case.

## 3. Nonuniform common-witness slot barrier

Assume one common structural baseline M_* where a fixed singleton t and a fixed nonregular nonsingleton C inside K are both missing. All tables considered have common D*, and exterior E empty. Let B_1,...,B_m be pairwise disjoint slots (sets of ordered cells). Each slot has an isolated t activation T_i and an isolated C activation V_i, differing from baseline only on that slot; these activations need not fix generating statistics. Require only that for each slot some cell is a first-entry witness for t in T_i and for C in V_i (same coordinates, possibly different C output across slots). No assumption that every slot cell is a t witness. This shared-witness condition is stronger than merely having a readable ancillary label in the slot. Use the known stabilizers of t from the preceding notes:
\[
 P=P_t\setminus G,\quad Q=Q_t\setminus G,\quad R=A\setminus(P\cup Q),
 \qquad p=|P|,\ q=|Q|,\ r=|R|.
\]
They partition A because P_t,Q_t avoid K and intersect in G. Every t witness lies in P×Q. Write m_L for slots whose isolated t activation has >=4 first-entry t witnesses, and m_S for those with 2 or 3. By disjoint slots and the preceding two-cell lower bound,
\[
4m_L+2m_S\le pq.
\]

For each small slot start at a common witness cell. The full witness-induced graph with Green saturation uses known nonself factorizations and quotient branches, independent of actual table. Both first-entry sets (for t in T_i and C in V_i) are closed under its dependencies, by the earlier class closure proof. Follow a path in the t-witness set to a sink SCC. All visited cells remain C witnesses in V_i. This sink has k=2 or 3, hence is an exact balanced unit orbit with injective projections by the previous small-sink classification. Denote it S={(x_j,y_j):1<=j<=k}. Its output in T_i is t, and all outputs in V_i equal a single c in C. (There may be one additional t witness outside S when k=2.) Both x_j in P and y_j in Q.

Because finite D=J and Green class sizes are constant of each type within a J-class, at least one of the two choices |L(c)|>=2 or |R(c)|>=2 holds throughout the fixed nonsingleton C. Choose that orientation once for all slots. Assume L for the proof; R is dual. Choose v!=c in L(c), multiplier u with uc=v. The exterior transport theorem gives ux_j in A and (ux_j)y_j=v in V_i. Thus k distinct new first-entry cells belong to B_i and are disjoint from S (different output in V_i). These coordinates ux_j are fixed across all tables by the quotient. If ut=t, in T_i each new cell also gives t, by associativity and xt=t. Together with S this would give at least 2k>=4 t witnesses, contradicting the small-slot definition. Hence ut!=t and (ux_j)t=u(x_j t)=ut!=t, so ux_j not in P. Nor can ux_j belong to Q: y_j in Q and Q_t is a submonoid disjoint from K, while the product in V_i lies in C subset K. Therefore all k translated cells lie in R×Q. Across distinct small slots these cells are disjoint. This proves 2m_S<=rq. Consequently
\[
4m=4m_L+4m_S\le pq+rq=q(a-q)\le a^2/4.
\]
In the right-oriented case the bound is p(a-p), identical maximum. In particular
\[
 \boxed{m\le\lfloor a^2/16\rfloor.}
\]
If the chosen Green side has size h>=2 throughout C, using all h−1 alternative outputs in that side gives the stronger side budget 2(h−1)m_S<=rq (or pr). The same argument applies to each alternative output independently, because all new cells for distinct outputs are distinct. No size bound on K or C is used.

Thus for any independent-slot scheme satisfying these common-witness hypotheses, if one designated query reads each label and the labels determine the table, the leading query coefficient of that scheme cannot exceed 1/16. The old uniform split construction is a sharp example of the bound on the number of slots in terms of a (and asymptotically on decision coefficient in n). The result also applies to nonuniform filling and to slots with several labels if a fixed nonsingleton label and a fixed singleton label share a witness for every slot. It does NOT cover independent slots with disjoint witness supports or merely ancillary read cells, different choices of singleton/compound target per slot, or global correlated changes with no isolated activations. The global 1/8 question remains open.

## 4. Explicit nonuniform balanced construction (existence, not improvement)

Let G=C4, integers p,q>=1, and target sizes s_l=(1,4,2,2) with disjoint layers T_l={t_(l,c):c mod s_l}; label 0 here denotes the singleton layer (use label −1 for absorbing-zero output). K is the union of T_l and absorbing zero z, null internally. Exterior bands:
- upper U={u_(i,d):1<=i<=p,d in C2}, right-zero;
- lower A'={a_(c,i,d):c in C4,1<=i<=p,d in C2}, rectangular band;
- B={b_(j,e):1<=j<=q,e in C2}, left-zero.
For x in U or A', define c(x)=0 for upper, otherwise its row c; (i(x),d(x)) its column. Product of two such elements is the second element if both upper, otherwise a_(c(x),i(y),d(y)). This is a two-level semilattice of rectangular bands with upper-to-lower projection u_(i,d)->a_(0,i,d). B products pick the first element.

Choose m=2pq independent labels W_(i,j,k) in {-1,0,1,2,3}, k in C2. For x in U or A' and y=b_(j,e), let l=W_(i(x),j,d(x)+e mod 2). Their product is z if l=-1 or l=0 and x is lower. Otherwise it is t_(l,c(x) mod s_l). Fixed products x t_(l,c') are z if l=0 and x lower, otherwise t_(l,c(x) mod s_l). All t b=t for t in targets and b in B. Other nonunit products are z. Unit right actions shift d on U,A'; left unit actions shift e on B; all other actions trivial, including both on K. Group multiplication as usual.

Associativity: the only nonzero triple types, using A''=U union A', are A''A''A'', BBB, A''A''B, A''BB, A''A''T, A''TB and TBB. The first two satisfy their band laws. In A''A''B the slot selects the last A'' column and the B index/phase, with row of first A'' and singleton permitted iff both A'' are upper. This exactly matches acting successively on a target; singleton zero is absorbing. A''BB uses left-zero B and the identity right action on T. A''A''T has the same row and singleton rule; A''TB and TBB follow from identity right actions. All other nonunit triple types yield z in both bracketings. The unit actions commute, respect these products, and the middle shifts in A''B agree by the parity sum. The remaining mixed identities follow because a shifted discarded middle coordinate has no effect and target actions ignore phase. Thus all arrays are associative.

Principal ideals fixed independently of W: for upper x, its right ideal contains all U, lower row 0, all t_(l,0), z; its left ideal contains x and its entire lower column, z. For lower x, its right ideal is its lower row, nonsingleton t_(l,c(x) mod s_l) (all three l>0), z; its left ideal is its lower column and z. B right ideal is itself and z, left ideal all B and all T and z. The singleton has left/right ideals itself plus z; nonsingleton target left ideal entire layer plus z and right ideal itself plus z. Two-sided ideals follow: upper contains U, A', K; lower contains A', nonsingleton layers and z; B contains B,K; targets contain their layer and z. None of the proper principal ideals contains both A'' and B. Hence all labelled principal ideals, proper principal tables, unit actions, K actions, quotient, idempotence and regularity are fixed. Every exterior element is dispensable by a parity-shifting unit, and zero by BA. All nonzero targets are nonregular. All four target layers missing on the all−1 baseline. A layer is present iff its label occurs, and every member is then generated by the fixed lower row actions (or the singleton itself).

Each slot has exactly ten cells: two upper×B and eight lower×B, with common i,j and parity. Isolated singleton activation changes exactly its two upper cells, leaving lower cells at zero. Isolated nonsingleton activation changes all ten. The upper cells are common witnesses; reading one upper cell determines the label even for the singleton, and all other entries are functions of the array. The translated cells in the barrier proof lie in lower×B, outside the singleton's left stabilizer. Thus this is a valid nonuniform scheme, not merely a diagram of desired slots.

Use balanced promise: exactly both labels in one of the lists (singleton, size4) or (size2, size2) occur, all other positions −1. The missing class count is 2 and product 4. Exterior generating set requires a group generator, one upper element for each i, one B element for each j, and one lower element for each nonzero row c=1,2,3; these conditions are necessary because no other letters can supply the indicated row/column/orbit, and sufficient by the band laws, unit shifts, and projection to lower row zero. All inclusion-minimal choices have that form. Hence r_0=p+q+4, r=p+q+6, h_r=g_r=2^(1+p+q)(2p)^3·4, all other h_j=0. This counts choices in the two missing layers as product 4. The general local enumerator theorem also implies common statistics at L=0 directly. E is empty iff the singleton label is present. The promise can be used as a subfamily without claiming a full-fibre classification.

Every cell query reveals at most one slot label, and every slot label can be read exactly by one upper-cell query. A zero transcript on at most m−2 slots admits both cases by placing the two required distinct labels in two unqueried slots. Scan until a nonzero label (or until remaining positions force the verdict); exact deterministic worst-case cost m−1. Lower-row queries may conceal the singleton but never provide more information than the full label. Order and optimal leading coefficient within this construction:
\[
 n=10p+2q+14,\quad m=2pq\le(n-14)^2/40.
\]
Equality along q=5p, p->infinity, so cost coefficient 1/40. This is worse than the old 1/16. This construction establishes that the relaxed scheme is realizable but not that it improves the best global lower bound.

## 5. Size-weighted Hamming improvement

For opposite E verdicts with common T56 statistics, take Z_0 missing classes in the E-empty table and Z_1 in the E-nonempty table, cancel common classes. Left list A0 consists entirely of nonsingleton sizes; right list A1 contains at least one singleton, and the count, product and J_L moments agree. The first-entry sets for newly present classes in Z_0\Z_1 are disjoint subsets of the table difference. Section 2 strengthens the earlier 4-per-class separation to
\[
 \Delta\ge\sum_{s\in A0}\max(4,s).
\]
This holds with arbitrary K. L=0 retains sharp lower bound 8. For L>=1 the first moment fixes the sum of the two lists, so a cap T on the last sum of weights bounds both lists' total sum and length. A complete finite enumeration is possible: enumerate nondecreasing lists of integers >=2 of length at least two with sum of max(4,s)<=T. For each, enumerate nondecreasing lists of equal length starting with 1, maintaining the remaining sum and product, accepting only equality of the other prescribed moments. The supplied [arithmetic audit](../experiments/size-weighted-hamming-arithmetic-audit.js) uses exact integer products and moments (BigInt), integer sum bounds, and no arbitrary size cutoff besides the proven cost cap. Count>=2 follows already from count/product. Every potential collision below the cap is included; any arithmetic collision is only necessary, not sufficient, for actual realizability.

Actual execution:
| L | cost cap | left lists checked | matching pairs | guaranteed distance |
|---:|---:|---:|---:|---:|
|1|17|140|1|>=17|
|2|28|1824|0|>=29|
|4|30|2730|0|>=31|

At L=1 the sole collision within the cap is (2,2,9) vs (1,6,6), equal count 3, sum 13, product 36, cost 17. No compatible monoid pair at distance 17 is constructed, so sharpness is NOT asserted. At L=3 the moment set equals L=2; at L=5 equals L=4. For larger L all earlier guarantees persist by monotonicity; combine with the earlier 4(2+|J_L|) bound. These are computer-assisted finite arithmetic certificates, not symbolic minimizations or exhaustive enumeration of tables. They improve the guaranteed full-table error tolerance to 8,14,15 for L=1,2/3,4/5 respectively, assuming correct metadata and existence of a compatible table within the error radius. No new query coefficient follows.

## 6. Executed table audit

[nonuniform-common-witness-audit.js](../experiments/nonuniform-common-witness-audit.js) actually executed in this session. For p,q=(1,1),(1,2),(1,3),(2,1) all baseline/isolated activations and all balanced promise arrays enumerated. Checks associativity, labelled principal ideals, all fixed side information, regularity/idempotence, E, class presence, fixed intersection xC∩Cy, every applicable exterior transport, full direct coverage, disjoint slot supports and charged translated cells, exact missing count/product, and minimax decision trees on labels.

| p,q | n | m | baseline + isolated | balanced | exact cost |
|---|---:|---:|---:|---:|---:|
|1,1|26|2|9|4|1|
|1,2|28|4|17|100|3|
|1,3|30|6|25|1204|5|
|2,1|36|4|17|100|3|

Total 1,476 tables (1,408 balanced), 41,438,624 associativity triples, 1,088,320 outer transport checks, 2,880 present-class direct-coverage checks. All PASS. These counts are within these explicit families, not a new universal enumeration. The enumerator formula is proved analytically; the audit checks count/product signatures and reports derived r,h, not exhaustive generating subsets. K here is null; general-K validity follows from the analytic proof, not testing general nonnull ideals in this round. No GAP/Lean/CI or independent reviewer.

## 7. Reference verification and next step

Actual web search in this session: two fast queries on Green relations, principal ideals, semigroup extensions and multiplication-table generator-query lower bounds, followed by one targeted slow query on semigroup oracle query complexity. Indexed excerpts consulted: [Semigroups whose right ideals are finitely generated](https://www.cambridge.org/core/journals/proceedings-of-the-edinburgh-mathematical-society/article/semigroups-whose-right-ideals-are-finitely-generated/112D2967022C2988DE83BC18CF48F153), [Computing finite semigroups](https://doi.org/10.1016/j.jsc.2018.01.002), [On the Complexity of the Cayley Semigroup Membership Problem](https://doi.org/10.4230/LIPIcs.CCC.2018.25), and Lee–Santha [The quantum query complexity of the semigroup product problem](https://arxiv.org/abs/2609.39974), abstract dated 30 September 2026. The latter takes the multiplication table as given and queries input-word elements, unlike D*. Standard Green structure is classical. No direct match for the restricted barrier or size-weighted separation was found in these limited excerpts. No new PDF/full-text analysis or specialized database review. Earlier notes' claimed searches are not independently certified by this session. Historical priority remains unresolved (P03 PARTIAL_OVERLAP).

The most useful next lower-bound direction is no longer simply nonuniform common-witness filling: the theorem rules it out as a means of exceeding 1/16. Investigate global coupling (different alternatives supported on different cells, no isolated common-witness activations), or slot-dependent target labels with shared exterior resources and bounded K. Alternatively exploit the new exterior transport theorem for composite-size query algorithms. Do not claim 1/8, merge, or submit without authorization.
