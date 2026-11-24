# Shared-target construction: improved bounds for emptiness with prescribed statistics
24/11/2026. Internal research note continuing [extremal extension freedom](P03-extension-freedom-extremal-2026-11-24.md) and manuscript v0.6. Not externally refereed, not formally verified, no historical priority claim. No new T numbers or changes to main.

## 1. Result and scope
For each fixed L≥0, the previous orthogonal-component construction can be replaced by one shared rectangular product region, while preserving all the strengthened metadata D* of v0.6 and the prescribed generating statistics r,h,g_r,...,g_(r+L). The actual values of those statistics and the carrier need not equal those of the old construction; they are constant within each new promise family. In particular E is empty in one case and nonempty in the other.
Let s_i be the C size parameters (with multiplicity) from the reduced balancing polynomial of v0.6, S=max s_i=2^d, D=sum s_i, and b=C/2. For p,q≥1 with m=2pq≥b, the order and exact deterministic query cost for the three tasks are
\[
n=2Sp+2q+4S+D+1,\quad r=2+p+q+b,\quad D_{\rm query}=m-b+1.
\]
The optimal worst-case expected randomized query cost at per-input error 0≤ε<1/2 is
\[
\overline R_\varepsilon=(1-2\varepsilon)\frac{m+1}{b+1}.
\]
These exact values concern the explicit promise family, not arbitrary monoids with the same type of side information.

## 2. Carrier and multiplication
Let G=C4×C_S, and use the disjoint sets
A={a_(i,u,c): 1≤i≤p,u∈C2,c∈C_S},
B={b_(j,v):1≤j≤q,v∈C2},
T_l={t_(l,c):c∈C_(s_l)} for l=1,...,C, and {ω}. The designated ideal K consists of all T_l and ω.
Choose an array W_(i,j,δ) with m=2pq positions, δ∈C2, each taking a value 0 or a layer label l. Write bar g for the first unit coordinate modulo 2, and h for the second coordinate in C_S. Units act by:
\[
(g,h)a_{i,u,c}=a_{i,u,c+h},\quad a_{i,u,c}(g,h)=a_{i,u+\bar g,c},
\]
\[
(g,h)b_{j,v}=b_{j,v+\bar g},\quad b_{j,v}(g,h)=b_{j,v},
\]
\[
(g,h)t_{l,c}=t_{l,c+h\bmod s_l},\quad t_{l,c}(g,h)=t_{l,c}.
\]
All units fix ω. Use the group law on G; ω is absorbing. For nonunits the only products not identically ω are
\[
a_{i,u,c}a_{i',u',c'}=a_{i',u',c},\quad b_{j,v}b_{j',v'}=b_{j,v},
\]
\[
a_{i,u,c}b_{j,v}=
\begin{cases}\omega&W_{i,j,u+v}=0\\t_{l,c\bmod s_l}&W_{i,j,u+v}=l,\end{cases}
\]
\[
a_{i,u,c}t_{l,c'}=t_{l,c\bmod s_l},\quad t_{l,c}b_{j,v}=t_{l,c}.
\]
In particular A is a rectangular band, B a left-zero band, K a null semigroup, BA=ω, and K²={ω}.

Associativity: pure A and pure B triples follow their band laws. Among mixed nonunit triples the only possibly nonzero types (where nonzero means not ω) are AAB, ABB, AAT, ATB, TBB, and the pure types; AAB selects the row c of the first A and the column (i',u') of the second A, so both bracketings select the same label W and row; ABB selects the same pair. AAT/ATB/TBB preserve the first A row or the original T element as appropriate. All other triples give ω in both bracketings (also when a product is already ω). Unit left/right actions commute and are group actions. For (g x)y=g(xy), the A row and T cyclic index translate by the second coordinate, while the left-zero B action translates its parity; for (xy)g=x(yg), the right-zero column in A translates by the first coordinate, and all B/T outputs have trivial right action. For (xg)y=x(gy), AA and BB follow the band laws, AT forgets the old T coordinate and uses the unchanged row of A, TB ignores B, AB uses u+v mod 2, preserved by exchanging the unit translation. All zero products remain zero. This proves the three mixed identities, and hence associativity. The identity of G is a global identity, and no nonunit product yields a unit.

## 3. Structural data
Writing A_c for an entire row of A, A^col_(i,u) for its column, and T(c)={t_(l,c mod s_l): all l}, the right, left, and two-sided principal ideals are:
- a_(i,u,c): A_c∪T(c)∪{ω}; A^col_(i,u)∪{ω}; A∪(all T_l)∪{ω}.
- b_(j,v): {b_(j,v),ω}; B∪(all T_l)∪{ω}; B∪(all T_l)∪{ω}.
- t_(l,c): {t_(l,c),ω}; T_l∪{ω}; T_l∪{ω}.
- ω: singleton in each case; units: whole carrier.
In particular the ideals are independent of W because AT and TB are fixed, and all products into T from AB are already in those ideals. All proper principal ideals omit at least one of A,B, so their internal multiplication is fixed. The quotient by K and every product with a factor in K are fixed. Idempotents are identity, A,B,ω; regular elements are G,A,B,ω (no t is regular: t x t=ω for all x). Unit data, Green relations, principal factors, and within-class multiplication coincide. Every varying cell is in A×B and determines exactly one W position, independently of the row c; each position controls 2S cells. No claim of classification of the entire extension fibre.

## 4. Promise, generation and statistics
The two complementary sets Z_+,Z_- of b layer labels are selected by positive/negative coefficients of the reduced balancing polynomial
\[
\widetilde Q_L(X)=(X-1)^2\prod_{j\in J_L}(2^j-X),\quad J_L=\{1\le j\le L:j=1\text{ or }j\text{ even}\}.
\]
For each exponent i with nonzero coefficient a_i use |a_i| distinct layer labels of size s=2^i. The promise: absent layer labels are precisely one of Z_+,Z_-, and every label in the complementary set appears at least once in W; 0 is unrestricted. Both cases are realizable because m≥b. As before the two sets have the same count b, product of s's, and required power sums; only Z_+ contains singleton layers (a_0>0). 
A generating set must generate G, meet every A block (fixed i, all u,c), every B block (fixed j, all v), and every absent T_l. The complement of each obligatory block is closed (any product reaching an A/B block needs a factor in that block; a product reaching absent T_l must have a T_l factor). These requirements suffice: the units generate all members of each selected block, then all present T_l by AB and the units, and ω by BA. Nonempty words are used; the identity is generated by powers of a unit generator. The group G requires two generators, and has 3S² inclusion-minimal generating sets, as in v0.6 (d≥2). Thus all inclusion-minimal generating sets have size r, and
\[
h_r=3S^2(2S)^p2^q\prod_{l\in Z}s_l,\quad h_j=0\ (j\ne r).
\]
Every other element is dispensable: units admit alternative factorizations; A/B move under parity translation; non-singleton T_l move under left cyclic translations; ω arises from BA. A singleton T_l is indispensable iff l absent. Therefore E consists of absent singleton layers, and E empty iff Z=Z_-.
Writing U for the ordinary group generating enumerator and R_s(z)=1-(1+z)^(-s), the full ordinary generating polynomial is
\[
U(z)((1+z)^{2S}-1)^p((1+z)^2-1)^q(1+z)^{D+1}\prod_{l\in Z}R_{s_l}(z).
\]
All factors outside the last product are common. The last product agrees through degree b+L (use v0.6 formal-series lemma); the common factor starts at degree 2+p+q. Thus g_r,...,g_(r+L) agree. Full g cannot agree by T53. A supplied labelled generating set may leak the case, not included in side information.

## 5. Exact query costs
All variable queries reveal one of m entries W, including which label appears, and no other entry; fixed queries are simulable. The first nonzero response identifies the promise case because the active label sets are disjoint. A deterministic scan of m-b+1 different entries guarantees a nonzero response (each of the b distinct active labels occurs). Conversely after at most m-b distinct queries on the all-zero transcript there remain at least b unqueried positions, so both cases can be completed by assigning the b required labels bijectively to b of them, zeros elsewhere. This proves exact cost m-b+1 for emptiness, any designated singleton layer's membership, and recovery of E.
Randomized upper bound: scan a uniformly random permutation until the first nonzero. For an array with u≥b nonzero cells, expected first position is (m+1)/(u+1) by symmetry of the u+1 gaps among unmarked positions; worst case u=b. Run this zero-error algorithm with probability 1-2ε, otherwise guess either case uniformly. 
Lower bound: choose the cases equiprobably, then b marked positions uniformly without replacement and a uniformly random bijection of the b active labels to the positions. Fix the coins of an algorithm (finite expected cost ensures almost-sure termination on the finite support); suppress fixed/repeated queries. Let d be the number of distinct queries on the hypothetical zero path, truncated at m-b+1 or earlier stopping. A path shorter than that is compatible with both cases. Let H be the first mark in a permutation extending the fixed zero path, and S_d=P(H>d). Then the probability of reaching a hit along that path is 1-S_d. On a miss when d<m-b+1, the conditional case distribution is still uniform (the mark positions were independent of the case), so success ≤1-S_d/2. When d=m-b+1, S_d=0, giving the same bound. The cost is at least E[min(H,d)]. As E[H]=(m+1)/(b+1) and E[H-d|H>d]=(m-d+1)/(b+1) whenever the conditioning event is nonempty,
\[
E[\min(H,d)]=(m+1)/(b+1)-S_d(m-d+1)/(b+1)
\ge (1-S_d)(m+1)/(b+1).
\]
For S_d=0 the equality is interpreted without conditioning. Average over coins: success≥1-ε forces E[1-S_d]≥1-2ε; maximum expected cost is at least the average, giving the matching bound. This is an elementary search argument, no novelty claim for the Boolean/multilabel subproblem. Applies to all three tasks because E has precisely two known possible values.

## 6. Constants and open extremal problem
Choose q=Sp. Then n=4Sp+4S+D+1 and m=2Sp²; on this sequence
\[
D_{\rm query}=\frac{(n-4S-D-1)^2}{8S}-b+1.
\]
The former parity-refined orthogonal construction gives coefficient 1/(8D²) (p=q), whereas the shared construction gives 1/(8S). For L=0, s=(1,2,2,4), S=4,D=9,b=2: new n=16p+26, exact cost 8p²−1=(n−26)²/32−1; previous n=36p+35, cost 2p²=(n−35)²/648. Ratio of leading coefficients D²/S=81/4=20.25. Not a ratio at every finite n; different sequences.
For general fixed L the ratio is D²/S. The improvement is not merely in the search algorithm: large A/B regions are shared by all layers. More generally the proof works for any two complementary size multisets with the balancing conditions and a common power-of-two S divisible by their sizes.
Universal upper bound with D*: only pairs of distinct nonunit elements outside K, from incomparable J-classes and whose quotient product is zero, need queries; at most a(a−1), a=n−|G|−|K|. The sharp a²/4 bound in the preceding note applies to a single designated element, not automatically to the union of possible witnesses for several targets. The global optimum for emptiness with fixed statistics remains open; for L=0 the leading lower coefficient along the constructed sequence is 1/32 and a universal upper coefficient is 1. No claim that these are the optimal constants. Future work: reduce the row/column orbit cost, study whether the union of target witness rectangles admits a stronger general upper bound, and investigate balancing with smaller max s.

## 7. Tests and prior art
[Executable JavaScript audit](../experiments/shared-target-oracle-audit.js), actually executed in this turn: L=0, p,q=(1,1),(1,2),(2,1),(2,2); counts 4,100,100,112=316 labelled tables. First three exhaustive over promised arrays; last all arrays with exactly one occurrence of each active label. Orders 36,38,44,46; ranks 6,7,7,8; h_r=3072,6144,24576,49152. Direct associativity for every triple, identity, E, labelled left/right/two-sided ideals, idempotents/regularity, proper principal ideal tables, unit actions, quotient and K products, obligatory-block closure and explicit generating witnesses; formula for h compared within each promise (not exhaustive generating-subset enumeration). All passed. No rerun CI/GAP/Lean; randomized proof analytic, no claimed DP test in this round. No table experiments for L>0.
Actual web searches this round:
- semigroup ideal extension rectangular band null ideal ramification function Grillet Petrich
- finite semigroup generating sets same rank generating set enumeration ideal extensions indistinguishable
- randomized query complexity search multiple marked items expected first success without replacement decision tree
Results/snippets: Grillet–Petrich 1968 (prior reviewed), Renshaw–Warhurst 2024 https://link.springer.com/article/10.1007/s00233-024-10447-5, Jonušas–Troscheit https://link.springer.com/article/10.1007/s00233-018-09992-7, Gray on minimal generators, and standard randomized linear search material. No new full-text analysis or specialized database search this round. The underlying ideal-extension framework, rectangular bands, power-sum balance and random search are known tools. No exact matching shared-target construction with the full side information and generating statistics surfaced in this very limited search. Status NO_MATCH_YET, not confirmed historical priority; this round is mathematical development, not an exhaustive literature investigation.
