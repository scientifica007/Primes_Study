# Two-sided dependency sinks and reverse-cell charging
24/11/2026. Internal mathematical note following [the dependency upper bound](P03-dependency-upper-bound-2026-11-24.md). No external review, formal verification, or priority claim. No new T number or modification to main.

## 1. Setting
Use the identical finite labelled monoid model D*: fixed unit data, labelled principal ideals, internal tables of proper principal ideals, designated proper nonempty ideal K, its table, Rees quotient and quotient map, and all actions on K. Additional generating statistics (including those in T56) can be fixed. Computation is free. Write A=M\(G∪K), a=|A|, and F for the nonempty compatible family. All products whose output is outside K are known, and the property E∩(M\K)=∅ is known. For the emptiness problem, stop with a negative answer if an exterior element is indispensable, or if any element is indispensable throughout F. If no ambiguous target remains, stop positively. In the remaining case take U to consist of all cells (x,y) in A×A with an output equal to an ambiguous target t∈K in at least one compatible table. Every such cell is variable and has distinct coordinates, so |U|≤N=a(a−1). Recovering its value for all cells suffices to decide emptiness. The argument also applies to an arbitrary subset of ambiguous targets if no exterior element is indispensable. All references to dependency graphs here mean graphs of ordered product cells, not of semigroup elements.

## 2. Full two-sided witness-induced graph
Each x∈A has a known factorization x=uv with u,v≠x, because exterior E is empty. Neither factor lies in K. Include every edge from cell (x,y)∈U obtained by every such factorization of x:
- if vy∈K, (x,y)→(v,y), with output map L_u on K;
- if vy∉K, w=vy is known, and (x,y)→(u,w) with identity output map.
And include every analogous right-factor edge for y=rs, r,s≠y:
- if xr∈K, (x,y)→(x,r), with output map R_s on K;
- otherwise w=xr is known and (x,y)→(w,s), with identity output map.
These equations hold in all compatible tables by associativity. Every destination is variable, different from the source, and lies in U: for a possible output t, the nontrivial translation map sending z∈K to t forces z=t, because its outside multiplier is not t and t is indispensable in some compatible table. The identity-map case is immediate. The left-induced edges always change the first coordinate; the right-induced edges always change the second coordinate. 
This finite graph has no loops and no singleton sink strongly connected component (SCC). Query one representative in each sink SCC, then recover all cells by following dependency paths backwards (edge points from dependent to provider). Every vertex reaches a sink SCC and its chosen representative. The graph includes all one-step witness-induced dependencies, not literally all possible consequences of arbitrary associativity equations or of the promise. Adding valid unary functional edges could improve the algorithm. Let s be the number of sink SCCs of size exactly two and h the number of other sink SCCs. Cost ≤s+h. Not asserted optimal.

## 3. Two-cell sink geometry
**Lemma 1.** If a sink SCC consists of (x,y),(x',y'), then x≠x', y≠y', and x R x', y L y' in Green's notation. Moreover every nonself factorization x=uv has u=x', and every nonself factorization y=rs has s=y'. The reverse statements hold for x',y'.
**Proof.** Since the component is closed under both types of edges, the unique other vertex must differ in both coordinates. A left-induced edge with vy∈K would preserve the second coordinate, impossible. Thus all factorizations give u=x', vy=y', and hence x=x'v. Interchanging the vertices yields x'=xv' for a nonself factorization of x'. Therefore x R x'. The symmetric argument for y gives y=r y', y'=r' y, and y L y'. □

**Lemma 2.** Let X be the set of first coordinates of all two-cell sink SCCs and Y the set of second coordinates. Then X∩Y=∅.
**Proof.** Suppose x lies in X∩Y. From a two-cell sink where x is a second coordinate, Lemma 1 gives a nonself factorization x=uv with v L x. Since v∈Mx, say v=d x, for any cell (x,y) in a two-cell sink where x is the first coordinate, xy∈K implies vy=d(xy)∈K. But Lemma 1 forbids a left-induced edge preserving the second coordinate, contradiction. □
Each two-cell sink accounts for two distinct ordered pairs in X×Y, so
\[
2s\le |X||Y|\le\lfloor a^2/4\rfloor,\qquad s\le\lfloor a^2/8\rfloor.
\]
As |U|≥2s+3h, cost ≤ floor((|U|+floor(a²/8))/3). In particular the leading universal upper coefficient improves from 1/2 to 3/8. Combine with the earlier floor(|U|/2) bound and the union-of-witness-rectangles estimate |U|≤min(N,c floor(a²/4)).

## 4. Reverse-cell charging: stronger universal bound
**Lemma 3.** For every cell (x,y) of a two-cell sink C={(x,y),(x',y')}, its reversed cell (y,x), if in U, belongs to an SCC containing the four distinct cells
\[
(y,x),\quad(y',x),\quad(y,x'),\quad(y',x').
\]
In particular its SCC cannot be a two- or three-cell sink. 
**Proof.** By Lemma 1 choose nonself factorizations x=x'v, x'=xv', y=r y', y'=r' y. The Green relations give y'=r'y and x'=xv', so if yx∈K, each of the four products lies in K by the ideal property. For the reverse cell (y,x), use the known decomposition y=r y' to obtain an edge to (y',x), since y'x∈K; the reverse edge comes from y'=r'y. The decomposition x=x'v gives an edge to (y,x') since yx'∈K; its reverse comes from x'=xv'. The same relations with the other coordinate changed connect the fourth cell to both of its neighbours. All these edges are in the graph, as closure of U under dependencies was proved in section 2. Thus the four cells belong to one SCC, whether or not that SCC is a sink. □

Let V be the union of the 2s cells in two-cell sinks. Their reversals are 2s distinct ordered pairs in A×A off the diagonal. They cannot lie in any two-cell sink, by Lemma 2 (or Lemma 3), or a three-cell sink. Define the unused-cell budget
\[
W=N-2s-3h.
\]
Every pair not in a sink contributes one to W (including pairs outside U), and each larger sink of size l≥3 contributes l−3. A reverse pair outside all sinks contributes one. A sink containing a reverse pair has l≥4, so l−3≥l/4, and therefore contributes at least one quarter per reverse pair therein. Thus W≥2s/4=s/2. It follows that
\[
3(s+h)=N-W+s\le N+s/2\le N+a^2/16.
\]
Accounting for integrality gives the final bound
\[
D_{\mathrm{query}}\le
\left\lfloor\frac{a(a-1)+\lfloor a^2/16\rfloor}{3}\right\rfloor.
\]
This is at most (17/48)a², and the leading coefficient is 17/48 ≈0.3541667 rather than 1/2. This is an upper bound, not a sharpness assertion. It is valid with prescribed statistics as the family F is then restricted accordingly. It is also valid using the upper bound a≤n−5 in nontrivial emptiness cases as explained in the previous note; for a=0 or 1 the formula is zero. 
One can take the minimum of this reverse-charged bound, the bound using |U| and s from section 3, the previous half-cell bound, and the actual number of sink SCCs. No claim that the reverse-charged bound is best. For L=0, previous shared-target construction has leading lower coefficient 1/32 along its size sequence, and this upper bound gives a ratio 34/3≈11.33. The optimum remains open.

## 5. Obstruction to universal minimum sink size three, even with statistics fixed
The parity-refined T54 family (v0.6) with p=q=1, s=(1,2,2,4), exactly one of complementary patterns of two zero matrices, has two independent parity positions in each component (m=2). In the unique singleton component the four relevant cells come in two pairs of equal parity, each of size two. Its t is the only ambiguous target; E is either empty or {t}. Its rank and full h are fixed as in T54. Each pair is a closed two-cell SCC of the graph: the fixed unit action transfers the parity between the factors, giving the two-way edges. No other relevant cell determines its value: in the promise case where the singleton component is active, fix the other parity bit to 1, vary the chosen bit freely, and keep all other components fixed. The same argument shows no cell outside that pair anywhere in the table determines its value by a single-valued function over the whole promised family (all cells outside its bit block stay fixed in this variation). Consequently even adding all possible exact unary functional dependencies cannot remove these two-cell sinks. This refutes a universal minimum sink size ≥3 under fixed rank and h; the same reasoning applies to the s=1 components in the reduced T56 construction for each fixed L, using m≥2 and keeping another bit nonzero in the same component. If a target in such a component is ambiguous, the two cells of its parity pair remain exactly a two-cell sink among all exact unary functional dependencies. Does not refute a better global bound or an adaptive algorithm using joint information. 
For p=q=1 at L=0, the statistics-balanced family has 18 tables (two patterns, 3 nonzero choices for each active matrix). This example is a consequence of previous constructions, not a new kind of monoid.

## 6. Verification
[Executable JS](../experiments/full-dependency-scc-audit.js), actually executed in this turn, checks all nonself left/right witness-induced edges on finite explicit families, their output functions on each table, SCCs, two-cell disjoint projections, reverse-cell lemma and recovery from the chosen sink representatives. It also checks all unary dependencies among the relevant cells of the 18-table balanced example. The additional bidirectional family takes the parity T49 family with a second target u in K, B×A constantly u or z (one shared bit), B u=u,u A=u, all other new nonunit products z, units fix u. Both directions can vary; checks all associativity triples in these additional families. Nonself decompositions from the original table are used; every product outside K is invariant by construction. Earlier checks of the base and balanced metadata are not rerun exhaustively here. 
| Family | tables | |U| | sink sizes (multiplicity) | queries by this graph |
|---|---:|---:|---|---:|
| parity 1×1 | 4 | 4 | 2 (2) | 2 |
| parity 1×2 | 16 | 8 | 2 (4) | 4 |
| parity 2×1 | 16 | 8 | 2 (4) | 4 |
| parity 2×2 | 256 | 16 | 2 (8) | 8 |
| opposite rectangular bands | 256 | 32 | 4 (8) | 8 |
| balanced T54 | 18 | 4 | 2 (2) | 2 |
| bidirectional 1×1 | 8 | 8 | 2 (2), 4 (1) | 3 |
| bidirectional 1×2 | 32 | 16 | 2 (4), 4 (2) | 6 |
| bidirectional 2×2 | 512 | 32 | 2 (8), 4 (4) | 12 |
Total 1118 tables, all asserted checks passed. In the last three families respectively 4,8,16 reverse pairs are in U and in four-cell sinks. The graph is not the full graph of all exact unary dependencies, and queries are not optimal in general (the reverse constant bit is globally shared, though the witness-induced graph need not capture that). No GAP/Lean/CI. Finite checks supplement, do not establish, the general lemmas.

## 7. Priority scope
Actual web queries in this turn:
- semigroup multiplication oracle query complexity reconstruct operation table Green relations ideal extension dependency
- semigroup balanced product tensor product acts equivalence relation associativity pairs ideal extensions ramification
- semigroup query complexity indispensable generators multiplication table principal ideals upper bound
Inspected indexed excerpts for Computing finite semigroups (https://doi.org/10.1016/j.jsc.2018.01.002), Cayley semigroup membership (https://arxiv.org/abs/1802.00659), the general theory of balanced tensor products of acts (e.g. Tensor product of partial acts, https://www.researchgate.net/publication/365807383_Tensor_product_of_partial_acts) and the semigroup product problem (https://arxiv.org/abs/2609.39974, different model, table given). The balancing relation ((as,b),(a,sb)) is classical; neither this nor SCC algorithms nor Green relations are claimed new. No exact matching extremal bound emerged in this limited search, but this is not a systematic historical audit or a NO_MATCH_YET claim beyond this scope. No full texts or PDF analysed in this round, no direct specialized database access. 
Next: exploit rank/count constraints via joint rather than unary dependencies; investigate whether the four-cell reverse SCCs can be charged more strongly or reduced by nonlocal relations; seek improved lower constructions. Preserve the distinction between the fixed-statistic problem and the one-target upper bound; no external submission.
