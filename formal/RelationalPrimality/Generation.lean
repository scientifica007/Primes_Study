import RelationalPrimality.Operations
import Mathlib.Data.Finset.Card
import Mathlib.Data.Fintype.Basic

set_option autoImplicit false
set_option warningAsError true

namespace RelationalPrimality
universe u v

variable {S : Type u} {I : Type v}
variable (arity : I → Nat)
variable (F : (i : I) → (Fin (arity i + 1) → S) → S)

/-- A fixed term operation, obtained from projections and finite positive-arity composition. -/
inductive TermOperation (n : Nat) : ((Fin (n+1) → S) → S) → Prop
  | projection (j : Fin (n+1)) : TermOperation n (fun a => a j)
  | compose (i : I) (H : Fin (arity i + 1) → (Fin (n+1) → S) → S) :
      (∀ j, TermOperation n (H j)) →
      TermOperation n (fun a => F i (fun j => H j a))

theorem term_is_derived (n : Nat) (H : (Fin (n+1) → S) → S)
    (h : TermOperation arity F n H) : Derived arity F n H := by
  induction h with
  | projection j =>
      intro a
      exact Generated.seed (a j) ⟨j, rfl⟩
  | compose i K _ ih =>
      intro a
      exact Generated.step i (fun j => K j a) (fun j => ih j a)

theorem T13_fixed (n : Nat) (H : (Fin (n+1) → S) → S)
    (h : TermOperation arity F n H) (x : S) :
    (EFamily arity F x ∧ EOp n H x) ↔ EFamily arity F x :=
  T13 arity F n H (term_is_derived arity F n H h) x

def Generates (B : Set S) : Prop := ∀ y : S, Generated arity F B y

theorem generated_mono {A B : Set S} (hAB : A ⊆ B)
    {y : S} (hy : Generated arity F A y) : Generated arity F B y := by
  induction hy with
  | seed z hz => exact Generated.seed z (hAB hz)
  | step i a _ ih => exact Generated.step i a ih

theorem generates_mono {A B : Set S} (hAB : A ⊆ B)
    (hA : Generates arity F A) : Generates arity F B :=
  fun y => generated_mono arity F hAB (hA y)

/-- If one can generate x without x, all other elements are already available. -/
theorem generates_complement_iff (x : S) :
    Generates arity F {y | y ≠ x} ↔ Generated arity F {y | y ≠ x} x := by
  constructor
  · intro h
    exact h x
  · intro h y
    by_cases he : y = x
    · subst y
      exact h
    · exact Generated.seed y he

/-- Logical component of T53 in the more general positive-arity model. -/
theorem T53_core (x : S) :
    EFamily arity F x ↔ ¬ Generates arity F {y | y ≠ x} := by
  rw [generates_complement_iff arity F x]
  exact T12 arity F x

/-- E is the intersection of all generating sets, even on infinite carriers. -/
theorem E_iff_all_generating (x : S) :
    EFamily arity F x ↔ ∀ B : Set S, Generates arity F B → x ∈ B := by
  classical
  constructor
  · intro h B hB
    by_contra hn
    have hsub : B ⊆ {y | y ≠ x} := by
      intro y hy he
      exact hn (by simpa [he] using hy)
    exact (T53_core arity F x).mp h (generates_mono arity F hsub hB)
  · intro h
    apply (T53_core arity F x).mpr
    intro hg
    have hx := h {y | y ≠ x} hg
    exact hx rfl

/-- An inclusion-minimal finite generating set, not necessarily of minimum cardinality. -/
def IrredundantFin (A : Finset S) : Prop :=
  Generates arity F (↑A : Set S) ∧
    ∀ B : Finset S, B ⊂ A → ¬ Generates arity F (↑B : Set S)

/-- Every finite generating set contains an inclusion-minimal generating subset. -/
theorem finite_refinement (A : Finset S) (hA : Generates arity F (↑A : Set S)) :
    ∃ B : Finset S, B ⊆ A ∧ IrredundantFin arity F B := by
  classical
  revert hA
  refine Finset.strongInductionOn A ?_
  intro A ih
  intro hA
  by_cases hs : ∃ B : Finset S, B ⊂ A ∧ Generates arity F (↑B : Set S)
  · obtain ⟨B, hBA, hB⟩ := hs
    obtain ⟨C, hCB, hC⟩ := ih B hBA hB
    exact ⟨C, hCB.trans hBA.subset, hC⟩
  · refine ⟨A, (fun _ h => h), hA, ?_⟩
    intro B hBA hB
    exact hs ⟨B, hBA, hB⟩

/-- Finite-carrier version of the intersection characterization for irredundant generators. -/
theorem E_iff_all_irredundant_finite [Fintype S] (x : S) :
    EFamily arity F x ↔ ∀ A : Finset S, IrredundantFin arity F A → x ∈ A := by
  classical
  constructor
  · intro h A hA
    exact (E_iff_all_generating arity F x).mp h (↑A : Set S) hA.1
  · intro h
    apply (T53_core arity F x).mpr
    intro hg
    have hA : Generates arity F (↑(Finset.univ.erase x) : Set S) := by
      apply generates_mono arity F (A := {y | y ≠ x}) _ hg
      intro y hy
      change y ∈ Finset.univ.erase x
      exact Finset.mem_erase.mpr ⟨hy, Finset.mem_univ y⟩
    obtain ⟨B, hB, hirr⟩ := finite_refinement arity F (Finset.univ.erase x) hA
    exact (Finset.not_mem_erase x Finset.univ) (hB (h B hirr))

#print axioms term_is_derived
#print axioms T13_fixed
#print axioms generated_mono
#print axioms generates_mono
#print axioms generates_complement_iff
#print axioms T53_core
#print axioms E_iff_all_generating
#print axioms finite_refinement
#print axioms E_iff_all_irredundant_finite

end RelationalPrimality
