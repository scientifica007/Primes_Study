# P03: linear Z-edge sweep charge and improved unrestricted decision bound
24 November 2026. Internal mathematical development based on v1.13 at 0e2bba9a54db7da71594a47b4c6a73b8d08d5838. Scientific-priority branch only. No T numbers or changes to main.

## 1. Result and exact scope

Let k=|K| and m=|M\(K union G)|. For L=4,5 and every integer B>=132, the following metadata-dependent nonadaptive decision upper bound holds:
\[
D_L(n;\mathrm{metadata})\le
m^2(1/40+5/(18B)+1/B^2)+mk(B-1)/20. \tag{A}
\]
In particular
\[
1/40\le\liminf D_L(n)/n^2\le\limsup D_L(n)/n^2
\le(1-1/15000)^2/36<1/36=\lim C_L(n)/n^2.
\]
The new explicit guaranteed gap from 1/36 is more than 13000 times the v1.13 guaranteed gap, but remains small in absolute terms. The general sharp coefficient and ordinary decision limit remain unresolved. On k=o(n) the new remainder is O(n^(3/2) sqrt(k)) rather than O(n^(5/3) k^(1/3)) from the previous bound, by choosing B on the order of sqrt(n/k). The lower bound is inherited from the fixed-layer 2x5 construction. No new lower bound or cardinality improvement. Both structural models and deterministic adaptivity regimes are covered.

## 2. Internal review of dependencies

Read the v1.13 manuscript sections 2–5, 8–12 and the generator-sweep, degenerate-block, cardinality and grouped-exit reports. The half-class generator lemma uses SCC seeds, not a bound on generator rank. Its use in a sweep is sound because an exterior word representing x can be prepended to a localized witness right factor y until first K-entry: if the first entry were strictly above target C, the subsequent first entry into C would use a supplied K-factor product, excluded by preprocessing. Transport to the chosen c and right localization makes the new right factor a right multiple of the original first-entry right factor, so its ambient J-class is at least the canonical right endpoint. Monotonicity also gives the opposite inequality for the suffix of the word. Unit letters never enter K from outside. The dual holds. This is a presence-detection sweep, not a table reconstruction or recovery of every individual witness. Every queried pair reporting C is a genuine first-entry witness. No invalidation of Theorem 14 was found in this targeted review; it is not independent external refereeing.

## 3. Two plans and a weighted target budget

Pretest the fixed indispensable contribution; if nonempty, return immediately. Otherwise the exterior is E-free. Use P8 and P9 from Sections 9–12, including all unresolved targets of size >=10 in both. Each target has precisely one canonical ordered endpoint pair. For an edge e of the union, let w_e=1 if both plans use it, 1/2 if just one does, and t_e be the total size of distinct selected targets assigned to it. Then 10 w_e<=t_e: a single-plan edge has at least one target of size >=8, a common edge either serves a target of size >=10 or distinct targets of sizes 8 and 9. Distinct edges have disjoint target sets. Consequently sum_e w_e<=k/10. This is an amortized target charge for the average of two sufficient plans, not a count of edges in a single plan.

Partition ALL regular exterior nonunits by Green dimensions into X (r>=B,l<B), Y (l>=B,r<B), Z (both <B), and W (both >=B). Write X,Y,Z,W for their masses and R=m-X-Y, so W<=R. Use m rather than n since neither K nor units are needed as oracle factors or nonunit generator classes.

## 4. High-dimension and Z sweep replacement

For every target of either plan with first endpoint l_i>=B or second endpoint r_j>=B, use the dual left or ordinary right sweep of Theorem 14 for that endpoint. If both conditions hold choose either; paying all such endpoints is a valid upper bound. Pay the union as common preprocessing of both plans. By the half-class lemma,
\[
\sigma_L\le(X+R)/2+Y/B,\quad
\sigma_R\le(Y+R)/2+X/B,\quad \sigma_L,\sigma_R\le m/2.
\]
Sum the left sweeps over the at most (Y+W)/B left class representatives and right sweeps over at most (X+W)/B right class representatives:
\[
H\le [(Y+W)(Y+R)+(X+W)(X+R)]/(2B)
+[(Y+W)X+(X+W)Y]/B^2.
\]
Also H<=m^2/B by the global half-class bounds. Using W<=R and X+Y+R=m, the first numerator is <=m^2+R^2-2XY and the second <=m^2/2 (since 2XY+R(X+Y)<=m(X+Y)-(X+Y)^2/2<=m^2/2). Thus
\[
H\le (m^2+R^2-2XY)/(2B)+m^2/(2B^2). \tag{B}
\]

For any remaining edge incident to Z, choose one Z endpoint and replace the canonical block by its sweep, for whichever plan(s) originally contained that edge. All targets assigned to that edge are detected simultaneously, since the sweep detects every surviving target with that canonical endpoint. If both endpoints are in Z choose one; this includes Z-to-Z edges, with no assumption of distinct endpoints. For a Z vertex J, N_J/r_J<=l_J<=B-1 and N_J/l_J<=r_J<=B-1 by Green incidence. The replacement therefore costs <=m(B-1)/2 per edge, with no dependence on the number of targets on that edge. The two-plan average charge is
\[
Q_Z\le m(B-1)\sum_e w_e/2\le mk(B-1)/20. \tag{C}
\]
Importantly, this sweep is included in just the original plan for single-plan edges, not forced into both. Overlaps between sweeps, high-endpoint queries and remaining canonical representatives can only reduce the actual query union. All positions and plan choices are metadata-defined. Additional detected targets may be ignored. No adaptive tracing of a witness is required.

## 5. Main X-to-Y edges and combined charge

All remaining original edges are X->Y. Let b,d be the Y masses with r=9,1, and C,A the X masses with l=9,1. As in Theorem 14, the right sweep option (all assigned targets with right endpoint in b, common in both plans) bounds average remaining cost by
\[
Q_{\rm main}\le XY/10-2Xb/45+Rb/18+Cd/90+bY/(9B).
\]
The dual is XY/10-2YC/45+RC/18+Ab/90+CX/(9B). If Xb>=YC and R<=3X/5, use Cd<=YC<=Xb and obtain Q_main<=XY/10+Y^2/(9B); if Xb<YC and R<=3Y/5 obtain the dual. In the complementary cases use the raw average XY/9; from m>8X/5+Y or m>X+8Y/5 obtain Q_main<=5m^2/288. If X=0 or Y=0 there is no main edge.

For either sweep case combine (B) with Q_main, set alpha=1/10-1/B, beta=1/(9B), F=alpha^2/[4(alpha-beta)]. Completing the square gives alpha XY+beta Y^2<=F(X+Y)^2 (and dually). Since B>=132, alpha>beta, F>=alpha/4>=1/(2B), and m^2-(m-R)^2>=R^2. Therefore
\[
H+Q_{\rm main}\le [F+1/(2B)+1/(2B^2)]m^2
\le (1/40+5/(18B)+1/B^2)m^2,
\]
where F=(alpha+beta+beta^2/(alpha-beta))/4 and beta^2/[4(alpha-beta)]<=1/(2B^2). In the raw fallback H<=m^2/B and 5/288+1/B<=1/40 for B>=132. The zero-main case is immediate from the same crude H bound. Adding (C), then selecting the cheaper complete nonadaptive plan, proves (A). No assumption on k/n was used.

## 6. Density and finite-size consequences

Choose B=max(132,ceil(sqrt(n/k))) on k=o(n), k>=1. This gives D<=m^2/40+O(n^(3/2)sqrt(k)); for bounded k this is O(n^(3/2)) remainder. Combining (A) with the previous uniform refined surcharge bound (n-k/2)^2/36+O(n^(5/3)), split at epsilon=1/7500. If k/n<=epsilon, take B=208 and m<=n. The resulting coefficient is
\[
1/40+5/(18*208)+1/208^2+207/(20*7500)
=0.02773858399079553\ldots
<(1-1/15000)^2/36=0.027774074197530862\ldots .
\]
Otherwise the previous refined surcharge bound supplies the latter coefficient plus o(1), uniformly. This improves the explicit strict gap to about 3.70358e-6 (previously about 2.77778e-10). The relative gap improvement is >13000, not a 13000-fold reduction in query cost.

For a sequence k/n->rho, the upper coefficient is bounded by the minimum of (1-rho/2)^2/36 and the infimum over integer B>=132 of
\[
(1-\rho)^2(1/40+5/(18B)+1/B^2)+\rho(1-\rho)(B-1)/20,
\]
using m<=n-k. The old refined bound already implies an upper coefficient <=1/40 if rho>=2(1-sqrt(9/10)) (approximately 0.1026334). This is an upper bound, not a matching lower bound at any prescribed positive density. The remaining obstruction is the intermediate positive-density regime: B large makes the Z sweep charge linear in B but still positive, while B small leaves a nonvanishing high-dimension charge. The new proof does not establish a universal 1/40 or disprove it.

## 7. Executed exact audit and limitations

[L4-linear-Z-sweep-audit.js](../experiments/L4-linear-Z-sweep-audit.js), actually run with Node locally before saving. Git blob hash of the executed script: a3fb0391c7b60e1fd80dcab9ab047a065d7321a7. For B=132,208,1000, X,Y in 0..18, R in 0..12, b,C all admissible, W=R (monotone worst for high charge), d=Y-b,A=X-C (worst for the corresponding main terms), checked the selected right/left/fallback inequalities and combined bound in exact safe-integer arithmetic after scaling by 360 B^2. 1,407,900 configurations: 429,024 right, 408,435 left, 555,660 fallback, 14,781 zero-main. 256 target-mass charge checks and 3,361 Green-size checks; explicit gap comparison and >13000 improvement verified using BigInt. PASS. Synthetic mass configurations need not come from monoids. This run did not enumerate new monoids, rerun the inherited sweep harness, implement full balanced fibres, or certify the proof in Lean. The new inequality is proved algebraically, not inferred from numerical checks.

## 8. Priority evidence and next study

Status PARTIAL_OVERLAP remains. Targeted web search on 24 November used the literal queries "semigroup monoid multiplication table query complexity \"generating\" \"decision\" oracle Green relations" and "finite semigroups query complexity indispensable generators multiplication oracle Green classes stabilizer". Search-result excerpts returned Computing finite semigroups (https://doi.org/10.1016/j.jsc.2018.01.002) on subsemigroup computation via Green relations and groups, and On the Complexity of the Cayley Semigroup Membership Problem (https://doi.org/10.4230/LIPIcs.CCC.2018.25) on membership with a supplied table. Only result snippets examined; no full texts, images, theorem-level comparison or priority verdict from these results. The v1.11 source-evidence correction controls all inherited claims. The new contribution is an amortized sweep/target-mass bound within our specific model, not a new general Green-theoretic theorem. No new reference copy or image required for this internal step.

Next test whether the mass of Z endpoints can be allocated to the X/Y roles with a charge against the distinct target budget, retaining the negative -2XY cross-term. Alternatively use all six sufficient size-coordinate plans and derive a weighted graph estimate that does not pay the complete Z sweep for every edge. Search for a realizable positive-density lower construction in parallel only if a structural obstruction is identified. The current theorem does not close the coefficient gap.
