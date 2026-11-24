# Two-sided target orbits and matching-based statistical omission
24 November 2026. Internal mathematical development, not externally refereed or formally verified. Historical priority unresolved. No new T numbers; main untouched. Continuation of the [unit-orbit and density note](P03-small-sink-unit-orbits-density-2026-11-24.md), with the balancing data from the [composite-modulus note](P03-joint-statistics-constraints-2026-11-24.md).

## 1. Result and scope

In the same labelled multiplication-query model D*, with prescribed rank r, full irredundant generating-set size enumerator H and ordinary generating counts g_r,...,g_(r+L), the previous shared-target construction's leading lower coefficient 1/(8S) improves to 1/(4S), for any fixed balancing modulus S=UV with U,V>=2. This is an asymptotic deterministic lower bound along an infinite sequence, not a claim of a universal lower bound at each finite n. The exact deterministic and bounded-error expected randomized costs for the new promised family are m-b+1 and (1-2ε)(m+1)/(b+1), respectively, with m=pq and b the number of missing (equivalently present) layers in either promise case. In particular at L=0 the best established interval for the global deterministic limsup coefficient is now [1/16,5/16]. The general upper coefficient has not been improved here.

Separately, we prove a support-sensitive matching criterion for omitting representatives in the statistical decision algorithm. It handles overlapping possible witness classes rather than assuming their supports are disjoint.

## 2. Split target sizes

Fix two disjoint lists of labels with sizes having equal count b, equal product P and equal power sums for j in J_L={1<=j<=L: j=1 or j even}. Only the first list contains singleton labels. Let every size s_l divide S. Choose a factorization S=UV with U,V>=2. Each s_l admits s_l=u_l v_l with u_l|U and v_l|V: for example take u_l=gcd(U,s_l), v_l=s_l/u_l, and compare prime valuations. Put D=sum_l s_l.

Use the cyclic unit group G=C_g, where g=lcm(U,V) except take g=4 if lcm(U,V)=2. In particular U,V divide g and g>=3. Let p,q>=1 and m=pq>=b. All cyclic indices are taken modulo their indicated modulus. The disjoint carrier is
- G;
- A={a_(c,i): c in C_U, 1<=i<=p};
- B={b_(j,d): 1<=j<=q, d in C_V};
- T_l={t_(l,c,d): c in C_(u_l), d in C_(v_l)} for each label;
- an absorbing element z.
K is the union of all target layers and z. Thus a=Up+Vq, |K|=D+1, n=Up+Vq+g+D+1.

For each (i,j) choose W_ij either zero (meaning z) or a target label. The nonunit multiplication rules are
- a_(c,i) a_(c',i')=a_(c,i');
- b_(j,d) b_(j',d')=b_(j,d');
- a_(c,i) b_(j,d)=z if W_ij=0, otherwise t_(W_ij,c mod u_l,d mod v_l), with l=W_ij;
- a_(c,i) t_(l,c',d')=t_(l,c mod u_l,d');
- t_(l,c',d') b_(j,d)=t_(l,c',d mod v_l).
Every other nonunit product is z; in particular K is a null ideal. In addition to the cyclic group law on G, a unit k acts on the left by adding k to the first cyclic coordinate of A and T, and trivially on B; it acts on the right by adding k to the last cyclic coordinate of B and T, and trivially on A. Both actions fix z.

This differs essentially from the preceding shared-target construction: all p columns and all q rows are shared across layers, but the outer coordinates of the target are supplied by both factors. No additional inner parity coordinate is required.

## 3. Associativity and fixed side information

The within-band products are rectangular band laws. For triples of nonunits, the only type strings that can give a nonzero product under either bracketing are AAA, BBB, AAB, ABB, AAT, ATB, TBB. AAA/BBB follow the band law. AAB selects the column of the second A, the row of the first A, and the coordinates of B; the label W is the same under both bracketings. ABB is its dual. AAT and TBB overwrite the same first or last target coordinate, respectively. ATB overwrites independent coordinates. All other type strings give z on both sides; z is absorbing. The unit actions are commuting left/right actions of the group. The three mixed associativity identities (kx)y=k(xy), (xk)y=x(ky), (xy)k=x(yk) follow by inspection: for AA/BB the middle shifted coordinate is discarded; for AB both middle actions are trivial and outer shifts translate the corresponding target coordinates; for AT and TB a middle shifted coordinate is overwritten, and the remaining outer coordinates shift consistently. The zero product cases preserve types and zero labels. These facts cover triples with zero, one, two, or three units. The group identity is the monoid identity.

Principal ideals are fixed independently of W. A right ideal of a_(c,i) contains its A row, z and for each target layer all t_(l,c mod u_l,d'); its left ideal contains its A column and z. A B left ideal contains its B column, z and for each layer all t_(l,c',d mod v_l); its right ideal contains its B row and z. The two-sided ideals of A and B consist respectively of all A or all B together with K. A target has the left ideal given by its fixed last coordinate in its layer plus z, the right ideal by its fixed first coordinate plus z, and two-sided ideal its entire layer plus z. The principal ideal of z is {z}; those of units are the entire carrier. Thus the Green relations and orders are fixed, all proper principal internal tables omit the only potentially variable region A×B, and the quotient M/K, unit data, products involving K, idempotents and regular elements are fixed. Principal factors are fixed by the same descriptions. All nonzero targets are nonregular since T·M·T={z}; every band element and z is idempotent and units are regular.

In fact under these labelled side data the only possible free entries are the labels W: the intersection of the prescribed principal right ideal of a_(c,i) and left ideal of b_(j,d) restricts their product to z or the indicated t_(l,c mod u_l,d mod v_l). Left and right unit translations force the same label throughout each U×V rectangle with fixed i,j. Conversely every label array is associative as above. For the lower-bound argument it suffices to use the promised subfamily, without requiring exact characterization of the statistics-restricted full fibre at arbitrary L.

## 4. Generation, invariants and the two cases

Promise: one of the two disjoint lists of labels is entirely absent, and each label in the other list occurs at least once in W; zero entries are unrestricted. Both cases realizable for m>=b. A generating subset must generate G, meet each A column, each B row and each absent T_l. Necessity follows since nonunits cannot generate units, and the complements of the indicated obligatory blocks are closed. Sufficiency: the units and a representative of each A column or B row generate that entire column or row; W produces a member of each present layer, and independently applied left/right units generate all of that layer. One member of an absent layer suffices for the same reason. BA produces z. No empty words or free identity are needed: positive words in a generating subset of the finite group produce its identity. These observations also characterize inclusion-minimal generating sets.

Let G_G(w), H_G(w) denote the ordinary and inclusion-minimal generating enumerators of the cyclic unit group. If Z is the absent list, the exact formulas are
\[
r=1+p+q+b,\quad
H(w)=H_G(w)U^p V^q P w^{p+q+b},
\]
\[
G(w)=G_G(w)((1+w)^U-1)^p((1+w)^V-1)^q(1+w)^{D+1}
\prod_{l\in Z}\left(1-(1+w)^{-s_l}\right).
\]
H_G need not be concentrated in degree one when g is not a prime power. It is a common factor. The balancing signature from the previous notes implies equality of the ordinary coefficients g_r,...,g_(r+L) and all H coefficients, not equality of the full G. This also follows directly by formal expansion of the normalized factors. The prescribed rank and all D* data therefore agree across both promise cases.

There are at least two distinct generators of a cyclic group of order >=3 (1 and -1), so no unit is indispensable. Every element of A or B has a nonself factorization using a nontrivial translating unit and a different element of its block; nonsingleton targets have such a factorization on at least one side. z is dispensable by BA. A singleton target is indispensable exactly when absent. Thus E is empty in precisely the case where the list containing singletons is present. Its only other possible value is the entire set of those singleton labels.

## 5. Exact query cost, coefficient and graph obstruction

Any query in A×B reveals exactly one W_ij (read off the target label or zero); fixed queries reveal no information. A deterministic scan until the first nonzero entry decides which of the disjoint label lists is present. At most m-b+1 distinct entries are required. An all-zero transcript of at most m-b distinct entries admits a completion in either case by placing each of the b required labels in a distinct unqueried entry. This proves exact worst-case cost m-b+1, including when m=b. It applies to emptiness, recovering E, counting its elements and membership of a designated ambiguous singleton on this promise. The same randomized argument already proved in [shared-target Section 5](P03-shared-target-extremal-2026-11-24.md#5-exact-query-costs) applies verbatim: uniformly random search, worst-case expected (m+1)/(b+1), with guessing of total probability 2ε. For the matching lower bound take uniform case and uniform b marked positions with a random bijection of active labels to marks; before a hit, case probabilities remain equal. A deterministic zero path stopped after d queries has miss probability S_d, success at most 1-S_d/2 and expected cost at least (1-S_d)(m+1)/(b+1). Averaging over algorithm coins proves exact bounded-error expected cost (1-2ε)(m+1)/(b+1) for 0<=ε<1/2.

All original and Green-saturation dependency edges on relevant AB cells stay within the fixed i,j rectangle: a nonself factorization of a band element either translates the outer coordinate by a unit or uses its band law, and the induced provider remains in that rectangle. The left Green class of A is the column and the right Green class of B is the row, so saturation connects every U×V rectangle. All target classes are ambiguous on the promise and every position can carry any label; thus the graph has exactly m sinks of size UV. This is also a genuine obstruction to any method selecting an inexpensive target size group solely from its witness support: every nonempty target group has all m sink representatives as potential witnesses.

Take p=Vt,q=Ut (t->infinity), so n=2St+g+D+1 and m=St^2. Equivalently on that sequence
\[
D_{\rm det}=\frac{(n-g-D-1)^2}{4S}-b+1.
\]
The leading coefficient is 1/(4S); AM-GM gives pq<=(Up+Vq)^2/(4UV), so this coefficient is best possible in this particular rectangular parameterization for fixed S. It is not proved optimal over all monoid constructions. Since a balancing modulus with nonzero singleton coefficient cannot be prime (only sizes 1 and S, count and product fix their multiplicities), the composite moduli previously established all admit this splitting. The previous modulus scan is reused, not re-run or newly claimed minimal.

For L=0 choose S=4, U=V=2, lists (1,4) and (2,2), b=2, D=9, g=4. Then n=2p+2q+14, r=p+q+3, h_r=g_r=2^(p+q+3), all other h_j zero. In particular p=q=k>=2 gives n=4k+14, deterministic cost k^2-1, limiting coefficient 1/16. At L=0 the common statistics force exactly the two stated absent patterns in the full D* fibre as well (count two and product four). The generic global upper bound 5/16 is unchanged. The ratio of leading global bounds drops from 10 to 5.

| L | previously established S | preceding shared-target coefficient | new lower coefficient |
|---|---:|---:|---:|
|0|4|1/32|1/16|
|1|8|1/64|1/32|
|2,3|12|1/96|1/48|
|4,5,6,7|24|1/192|1/96|
|8,9|36|1/288|1/144|
|10|48|1/384|1/192|

These are fixed-L asymptotics. Additive constants may be enormous for some balancing vectors. Only L=0,1,2 are freshly instantiated computationally below.

## 6. A support-sensitive matching criterion for query omission

For an arbitrary compatible family in the established D* model use the joint class-witness graph of all ambiguous nonregular J-classes of K. By the preceding class-propagation theorem a class is present iff some sink representative outputs a member of it. Here present means reachable by a first entry from strictly higher classes. Fixed classes and any fixed indispensable elements can be treated before this stage. Let I index sink representatives, B_i be the set of ambiguous classes that representative i can report over the family, and F be the family of possible present-class sets. All are computable by exhaustive enumeration, permitted in the information-query model. Alternatively use a sound overapproximation to F and B_i (may be weaker). Associate to each P in F the decision e(P), namely whether E is empty, as determined by the singleton classes missing and fixed contributions.

Theorem: let O be a proposed set of omitted representative indices. For every P,P' in F of opposite verdicts, form two bipartite graphs, with left vertices P\P' and P'\P respectively, right vertices O, and edges (C,i) when C belongs to B_i. If for every such pair at least one graph fails to have a matching covering all of its left vertices, querying I\O suffices to decide emptiness.

Proof: if two compatible tables of opposite verdicts had equal queried replies, every class in P\P' must be reported by some omitted representative, since no queried reply can report it (it never occurs in the other table). Choose one such representative for each distinct class. Each representative reports at most one class, so these choices are an injection and yield a matching. Apply the same argument independently to P'\P. This contradicts the stated condition. Thus all compatible tables with the observed replies have the same verdict; compute it by enumeration. The two matchings need not be disjoint from each other, since they refer to alternative tables. This is a sufficient condition, not a general necessity: known functional constraints, full output values or adaptive queries can distinguish cases even when both matchings exist.

Corollary: if there are opposite-verdict patterns, put
\[
\delta=\min_{e(P)\ne e(P')} |P\setminus P'|.
\]
All P have the same cardinality under prescribed rank, so the two differences have equal size. Any set of at most δ-1 omitted reps meets the condition. The previous moment uniqueness lemma gives δ>=d+1 where d=1+|J_L|, because otherwise the cancelled size multisets agree and cannot change singleton count. The new criterion can omit more when actual patterns or supports are constrained. If no opposite-verdict pair exists, zero queries suffice. More generally enumerate O to maximize its size under the matching certificate; this is a finite optimization, not a polynomial-time claim. Hall's marriage theorem gives an equivalent obstruction by deficient neighbourhoods.

In the new shared rectangle all B_i are the full set of 2b labels; the two promised present sets are disjoint of size b. The matching criterion yields exactly m-b+1, which is optimal by Section 5. At L=0 this also proves sharpness of the prior uniform one-representative statistical omission on these graphs. In the prior dense construction, the size-four auxiliary layer occurs in the E-empty case and not the E-nonempty case; all its possible witnesses are two auxiliary representatives, so querying both and omitting the rest makes the corresponding difference impossible to match. The prior exact-two algorithm follows. No new general upper coefficient below 5/16 has been proved here.

## 7. Executed checks and limitations

[two-sided-target-orbit-audit.js](../experiments/two-sided-target-orbit-audit.js), executed in this session. After noticing that sample rotations at m=b originally permuted labels and positions together and repeated arrays, corrected generation to rotate positions alone and added a distinct-array assertion; reran the corrected version successfully. Counts below refer to that run, not the preliminary run.

| L | U,V | p,q | n | distinct tables | associativity triples | sinks × size | exact decision-tree cost checked |
|---|---|---|---:|---:|---:|---|---:|
|0|2,2|1,2|20|4|32000|2×4|1|
|0|2,2|2,2|22|100|1064800|4×4|3|
|0|2,2|2,3|24|1204|16644096|6×4|5|
|1|2,4|2,3|57|6|1111158|6×8|not enumerated|
|2|3,4|8,4|269|6|116790654|32×12|not enumerated|

Total 1320 distinct tables across these five cases and 135642708 associativity triples in the corrected run. L=0 arrays exhaust the promise; L=1,2 are samples. The script checks identity, principal ideals and their internal tables, fixed actions/quotient, regularity/idempotence, direct E membership, exact integer moment signatures and polynomial factors (exhaustive unit-group subsets; not enumeration of all subsets of M), dependency functions and exact SCC rectangles, and exhaustive finite minimax decision trees for the three small L=0 cases. For L=2 use the previously documented signed vector (6,-21,10,15,-11,1) on sizes (1,2,3,4,6,12). No GAP, Lean, CI or full enumeration of arbitrary monoids.

[class-matching-omission-audit.js](../experiments/class-matching-omission-audit.js), separately executed: enumerates 343 abstract support systems of three labels and three representatives (all nonempty support subsets), retaining arrays with exactly two present labels; checked all 1420 certified omission choices against explicit possible equal-reply collisions. Also two abstract examples recover five queries for six shared representatives with two disjoint present labels per case, and two queries for a synthetic dense support example. These are finite abstract checks, not exhaustive semigroup enumeration and not independent external review. Analytic statements do not depend on the tests.

## 8. Priority, assessment and next work

Actual additional web queries: "semigroup ideal extensions rectangular bands null ideal Rees quotient translational hull Grillet Petrich"; "semigroup multiplication query complexity generating sets rectangular band monoid oracle lower bound". Search-result excerpts identify classical ideal extensions in Grillet and Petrich, Ideal extensions of semigroups (1968), https://msp.org/pjm/1968/26-3/pjm-v26-n3-p09-s.pdf ; Semilattices of stratified extensions (https://link.springer.com/article/10.1007/s00233-024-10447-5); and the rectangular-band translational hull in On the Syntactic Monoids Associated with a Class of Synchronized Codes (https://pmc.ncbi.nlm.nih.gov/articles/PMC3886586/). The quantum semigroup product problem (https://arxiv.org/abs/2609.39974) concerns input-letter queries with the table supplied, a different model. These were excerpt-level searches, not a new full-text/PDF review or a MathSciNet/zbMATH search. Rectangular bands, group actions, ideal extensions, Hall matching and decision-tree search arguments are classical; no priority claim for these tools. No matching lower coefficient with the exact prescribed side information was identified in this limited search. P03 remains PARTIAL_OVERLAP; historical novelty unresolved.

The main progress is the actual lower coefficient improvement by a factor of two and a support-sensitive joint omission theorem. An optimal upper bound, or even a general coefficient <=1/4, is still open. Next: seek a universal upper bound using the sizes of the principal-ideal intersections, class-support incidence, and n=a+|G|+|K| rather than only graph density in a; distinguish the shared-support obstruction from dense but arithmetically easy instances. Also investigate whether the new rectangular lower construction can be compressed beyond UV without losing fixed statistics or exterior dispensability. Do not merge or submit without authorization.
