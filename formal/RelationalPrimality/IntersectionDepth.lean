import RelationalPrimality.Counting
import Mathlib

set_option autoImplicit false
set_option warningAsError true

namespace RelationalPrimality
universe u v
variable {S : Type u} {I : Type v}
variable (arity : I → Nat)
variable (F : (i : I) → (Fin (arity i + 1) → S) → S)

/-- Substitution of finite derivations for seeds. -/
theorem generated_substitute {A B : Set S}
    (hAB : ∀ y ∈ A, Generated arity F B y) {x : S}
    (hx : Generated arity F A x) : Generated arity F B x := by
  induction hx with
  | seed y hy => exact hAB y hy
  | step i a _ ih => exact Generated.step i a ih

/-- Every derivation has a finite support in its set of seeds. -/
theorem generated_finite_support (B : Set S) (x : S)
    (hx : Generated arity F B x) :
    ∃ C : Finset S, (↑C : Set S) ⊆ B ∧ Generated arity F (↑C : Set S) x := by
  classical
  induction hx with
  | seed y hy =>
      refine ⟨{y}, ?_, Generated.seed y (by simp)⟩
      intro z hz
      have he : z = y := by simpa using hz
      simpa [he] using hy
  | step i a _ ih =>
      choose K hKB hK using ih
      let C : Finset S := Finset.univ.biUnion K
      refine ⟨C, ?_, ?_⟩
      · intro z hz
        have hz' : z ∈ Finset.univ.biUnion K := hz
        obtain ⟨j, _, hj⟩ := Finset.mem_biUnion.mp hz'
        exact hKB j hj
      · apply Generated.step i a
        intro j
        apply generated_mono arity F (A := (↑(K j) : Set S)) _ (hK j)
        intro z hz
        change z ∈ Finset.univ.biUnion K
        exact Finset.mem_biUnion.mpr ⟨j, Finset.mem_univ j, hz⟩

/-- A finitely generated algebra has a finite generating subset in every generating set. -/
theorem finite_generating_subset (A : Finset S)
    (hA : Generates arity F (↑A : Set S))
    (B : Set S) (hB : Generates arity F B) :
    ∃ C : Finset S, (↑C : Set S) ⊆ B ∧ Generates arity F (↑C : Set S) := by
  classical
  have hs : ∀ a : A, ∃ C : Finset S, (↑C : Set S) ⊆ B ∧
      Generated arity F (↑C : Set S) (a : S) :=
    fun a => generated_finite_support arity F B a (hB a)
  choose K hKB hK using hs
  let C : Finset S := A.attach.biUnion K
  refine ⟨C, ?_, ?_⟩
  · intro y hy
    have hy' : y ∈ A.attach.biUnion K := hy
    obtain ⟨j, _, hj⟩ := Finset.mem_biUnion.mp hy'
    exact hKB j hj
  · intro x
    apply generated_substitute arity F (A := (↑A : Set S)) _ (hA x)
    intro y hy
    let a : A := ⟨y, hy⟩
    apply generated_mono arity F (A := (↑(K a) : Set S)) _ (hK a)
    intro z hz
    change z ∈ A.attach.biUnion K
    exact Finset.mem_biUnion.mpr ⟨a, by simp, hz⟩

theorem fg_refinement (A : Finset S)
    (hA : Generates arity F (↑A : Set S))
    (B : Set S) (hB : Generates arity F B) :
    ∃ C : Finset S, (↑C : Set S) ⊆ B ∧ IrredundantFin arity F C := by
  obtain ⟨D, hDB, hD⟩ := finite_generating_subset arity F A hA B hB
  obtain ⟨C, hCD, hC⟩ := finite_refinement arity F D hD
  exact ⟨C, fun _ hy => hDB (hCD hy), hC⟩

/-- On a finitely generated carrier the intersection of all finite irredundant bases is E. -/
theorem E_iff_all_irredundant_fg (A : Finset S)
    (hA : Generates arity F (↑A : Set S)) (x : S) :
    EFamily arity F x ↔ ∀ C : Finset S, IrredundantFin arity F C → x ∈ C := by
  classical
  constructor
  · intro h C hC
    exact (E_iff_all_generating arity F x).mp h (↑C : Set S) hC.1
  · intro h
    apply (T53_core arity F x).mpr
    intro hg
    obtain ⟨C, hCB, hC⟩ := fg_refinement arity F A hA {y | y ≠ x} hg
    exact (hCB (h C hC)) rfl

noncomputable def essentialPart (A : Finset S) : Finset S := by
  classical
  exact A.filter (EFamily arity F)

noncomputable def nonessentialPart (A : Finset S) : Finset S := by
  classical
  exact A.filter (fun x => ¬ EFamily arity F x)

theorem essentialPart_exact (A : Finset S)
    (hA : Generates arity F (↑A : Set S)) (x : S) :
    x ∈ essentialPart arity F A ↔ EFamily arity F x := by
  classical
  unfold essentialPart
  rw [Finset.mem_filter]
  exact ⟨And.right, fun h => ⟨(E_iff_all_generating arity F x).mp h (↑A : Set S) hA, h⟩⟩

/-- A positive finite certificate of intersection depth; no assumption of a finite carrier. -/
def DepthCertificate (k : Nat) : Prop :=
  ∃ H : Finset (Finset S), H.Nonempty ∧ H.card ≤ k ∧
    (∀ C ∈ H, IrredundantFin arity F C) ∧
    ∀ x : S, (∀ C ∈ H, x ∈ C) ↔ EFamily arity F x

theorem T77_rank_bound (A : Finset S) (hA : IrredundantFin arity F A) :
    DepthCertificate arity F (A.card - (essentialPart arity F A).card + 1) := by
  classical
  let D := nonessentialPart arity F A
  have hd (x : D) : ∃ C : Finset S, IrredundantFin arity F C ∧ (x : S) ∉ C := by
    have hx : ¬ EFamily arity F (x : S) := by
      have hm : (x : S) ∈ nonessentialPart arity F A := x.property
      unfold nonessentialPart at hm
      exact (Finset.mem_filter.mp hm).2
    have hg : Generates arity F {y | y ≠ (x : S)} := by
      by_contra hn
      exact hx ((T53_core arity F (x : S)).mpr hn)
    obtain ⟨C, hCB, hC⟩ := fg_refinement arity F A hA.1 _ hg
    exact ⟨C, hC, fun h => (hCB h) rfl⟩
  choose K hK havoid using hd
  let H : Finset (Finset S) := insert A (D.attach.image K)
  refine ⟨H, ⟨A, by simp [H]⟩, ?_, ?_, ?_⟩
  · have hcard : (D.attach.image K).card ≤ D.card := by
      simpa using (Finset.card_image_le (s := D.attach) (f := K))
    have hsplit := Finset.filter_card_add_filter_neg_card_eq_card (s := A) (EFamily arity F)
    change (essentialPart arity F A).card + D.card = A.card at hsplit
    have hi : H.card ≤ (D.attach.image K).card + 1 := Finset.card_insert_le _ _
    omega
  · intro C hC
    change C ∈ insert A (D.attach.image K) at hC
    rcases Finset.mem_insert.mp hC with he | hm
    · simpa [he] using hA
    · obtain ⟨x, _, he⟩ := Finset.mem_image.mp hm
      rw [← he]
      exact hK x
  · intro x
    constructor
    · intro hx
      by_contra hn
      have hxA : x ∈ A := hx A (by simp [H])
      have hxD : x ∈ D := by
        change x ∈ nonessentialPart arity F A
        unfold nonessentialPart
        exact Finset.mem_filter.mpr ⟨hxA, hn⟩
      let y : D := ⟨x, hxD⟩
      have hmem : K y ∈ H := by
        change K y ∈ insert A (D.attach.image K)
        exact Finset.mem_insert_of_mem (Finset.mem_image.mpr ⟨y, by simp, rfl⟩)
      exact havoid y (hx (K y) hmem)
    · intro hx C hC
      have hirr : IrredundantFin arity F C := by
        change C ∈ insert A (D.attach.image K) at hC
        rcases Finset.mem_insert.mp hC with he | hm
        · simpa [he] using hA
        · obtain ⟨y, _, he⟩ := Finset.mem_image.mp hm
          rw [← he]
          exact hK y
      exact (E_iff_all_generating arity F x).mp hx (↑C : Set S) hirr.1

#print axioms generated_substitute
#print axioms generated_finite_support
#print axioms finite_generating_subset
#print axioms fg_refinement
#print axioms E_iff_all_irredundant_fg
#print axioms essentialPart_exact
#print axioms T77_rank_bound
end RelationalPrimality
