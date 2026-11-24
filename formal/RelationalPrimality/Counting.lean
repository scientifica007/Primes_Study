import RelationalPrimality.Generation
import Mathlib.Data.Finset.Powerset
import Mathlib.Algebra.BigOperators.Group.List.Basic
import Mathlib.Tactic

set_option autoImplicit false
set_option warningAsError true

namespace RelationalPrimality
universe u v

section Counting
variable {S : Type u} {I : Type v} [Fintype S]
variable (arity : I → Nat)
variable (F : (i : I) → (Fin (arity i + 1) → S) → S)

noncomputable def essentialFinset : Finset S := by
  classical
  exact Finset.univ.filter (EFamily arity F)

noncomputable def generatorSetsOfSize (k : Nat) : Finset (Finset S) := by
  classical
  exact (Finset.univ.powersetCard k).filter (fun A => Generates arity F (↑A : Set S))

omit [Fintype S] in
theorem erase_univ_generates_iff (x : S) :
    Generates arity F {y | y ≠ x} ↔ ¬ EFamily arity F x := by
  classical
  constructor
  · intro hg he
    exact (T53_core arity F x).mp he hg
  · intro he
    by_contra hg
    exact he ((T53_core arity F x).mpr hg)

/-- Counting component of T53 for all finite positive-arity algebras. -/
theorem T53_count (hn : 2 ≤ Fintype.card S) :
    (essentialFinset arity F).card =
      Fintype.card S - (generatorSetsOfSize arity F (Fintype.card S - 1)).card := by
  classical
  let U : Finset S := Finset.univ
  let N := U.filter (fun x => ¬ EFamily arity F x)
  let G := generatorSetsOfSize arity F (Fintype.card S - 1)
  have hgen (x : S) :
      Generates arity F (↑(U.erase x) : Set S) ↔ ¬ EFamily arity F x := by
    have hset : (↑(U.erase x) : Set S) = {y | y ≠ x} := by
      ext y
      simp [U]
    rw [hset]
    exact erase_univ_generates_iff arity F x
  have hcard : N.card = G.card := by
    apply Finset.card_bij (fun x _ => U.erase x)
    · intro x hx
      have hx' := (Finset.mem_filter.mp hx).2
      change U.erase x ∈ generatorSetsOfSize arity F (Fintype.card S - 1)
      unfold generatorSetsOfSize
      apply Finset.mem_filter.mpr
      refine ⟨Finset.mem_powersetCard.mpr ⟨Finset.erase_subset x U, ?_⟩, (hgen x).mpr hx'⟩
      rw [Finset.card_erase_of_mem (by simp [U])]
      change Fintype.card S - 1 = Fintype.card S - 1
      rfl
    · intro x _ y _ hxy
      by_contra hne
      have hy : y ∈ U.erase x := Finset.mem_erase.mpr ⟨Ne.symm hne, by simp [U]⟩
      rw [hxy] at hy
      exact (Finset.not_mem_erase y U) hy
    · intro B hB
      have hB' : B ∈ generatorSetsOfSize arity F (Fintype.card S - 1) := hB
      unfold generatorSetsOfSize at hB'
      obtain ⟨hsize, hg⟩ := Finset.mem_filter.mp hB'
      have hc := (Finset.mem_powersetCard.mp hsize).2
      have hx : ∃ x : S, x ∉ B := by
        by_contra h
        have he : B = U := by
          ext x
          have hx : x ∈ B := by
            by_contra hh
            exact h ⟨x, hh⟩
          simp [U, hx]
        have hu : U.card = Fintype.card S := rfl
        rw [he, hu] at hc
        omega
      obtain ⟨x, hx⟩ := hx
      have hsub : B ⊆ U.erase x := by
        intro y hy
        apply Finset.mem_erase.mpr
        refine ⟨?_, by simp [U]⟩
        intro he
        exact hx (he ▸ hy)
      have hEq : B = U.erase x := by
        apply Finset.eq_of_subset_of_card_le hsub
        rw [Finset.card_erase_of_mem (by simp [U]), hc]
        change Fintype.card S - 1 ≤ Fintype.card S - 1
        exact le_rfl
      have hg' : Generates arity F (↑(U.erase x) : Set S) := by
        rw [← hEq]
        exact hg
      refine ⟨x, Finset.mem_filter.mpr ⟨by simp [U], (hgen x).mp hg'⟩, hEq.symm⟩
  have hsplit := Finset.filter_card_add_filter_neg_card_eq_card (s := U) (EFamily arity F)
  change (essentialFinset arity F).card + N.card = Fintype.card S at hsplit
  change (essentialFinset arity F).card = Fintype.card S - G.card
  omega

end Counting

section Words
variable {M : Type u} [Monoid M]

def binaryArity (_ : Unit) : Nat := 1

def binaryMul (_ : Unit) (a : Fin (binaryArity () + 1) → M) : M :=
  a 0 * a 1

def PositiveWord (B : Set M) (x : M) : Prop :=
  ∃ l : List M, l ≠ [] ∧ (∀ y ∈ l, y ∈ B) ∧ l.prod = x

theorem binary_E_iff (x : M) :
    EFamily binaryArity (binaryMul : (i : Unit) → (Fin (binaryArity i + 1) → M) → M) x
      ↔ E (fun a b : M => a * b) x := by
  constructor
  · intro h a b ha hb
    let t : Fin 2 → M := ![a,b]
    have ht : ∀ j, t j ≠ x := by
      intro j
      fin_cases j
      · exact ha
      · exact hb
    exact h () t ht
  · intro h i a ha
    exact h (a 0) (a 1) (ha 0) (ha 1)

theorem binary_generated_iff_word (B : Set M) (x : M) :
    Generated binaryArity (binaryMul : (i : Unit) → (Fin (binaryArity i + 1) → M) → M) B x
      ↔ PositiveWord B x := by
  constructor
  · intro h
    induction h with
    | seed y hy =>
        exact ⟨[y], by simp, by simpa, by simp⟩
    | step i a _ ih =>
        obtain ⟨l, hl, hB, hp⟩ := ih 0
        obtain ⟨k, hk, hC, hq⟩ := ih 1
        refine ⟨l ++ k, ?_, ?_, ?_⟩
        · simp [hl]
        · intro y hy
          rcases List.mem_append.mp hy with hy | hy
          · exact hB y hy
          · exact hC y hy
        · simp [List.prod_append, hp, hq, binaryMul]
  · rintro ⟨l, hl, hB, hp⟩
    have aux : ∀ k : List M, k ≠ [] → (∀ y ∈ k, y ∈ B) →
        Generated binaryArity (binaryMul : (i : Unit) → (Fin (binaryArity i + 1) → M) → M) B k.prod := by
      intro k
      induction k with
      | nil => simp
      | cons a t ih =>
          intro _ ht
          have ha : a ∈ B := ht a (by simp)
          by_cases he : t = []
          · subst t
            simpa using (Generated.seed (arity := binaryArity) (F := binaryMul) a ha)
          · have htail := ih he (fun y hy => ht y (by simp [hy]))
            let args : Fin 2 → M := ![a,t.prod]
            have hargs : ∀ j, Generated binaryArity (binaryMul : (i : Unit) → (Fin (binaryArity i + 1) → M) → M) B (args j) := by
              intro j
              fin_cases j
              · exact Generated.seed a ha
              · exact htail
            have hstep : Generated binaryArity (binaryMul : (i : Unit) → (Fin (binaryArity i + 1) → M) → M) B (binaryMul () args) :=
              Generated.step (arity := binaryArity) (F := binaryMul) (B := B) () args hargs
            simpa [binaryMul, args] using hstep
    rw [← hp]
    exact aux l hl hB

end Words

#print axioms erase_univ_generates_iff
#print axioms T53_count
#print axioms binary_E_iff
#print axioms binary_generated_iff_word
end RelationalPrimality
