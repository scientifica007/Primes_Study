import Mathlib.Data.Set.Basic

set_option autoImplicit false
set_option warningAsError true

namespace RelationalPrimality

/-- Operational binary model A0. No algebraic laws or distinguished elements. -/
def E {S : Type*} (F : S → S → S) (x : S) : Prop :=
  ∀ a b : S, a ≠ x → b ≠ x → F a b ≠ x

def ClosedUnder {S : Type*} (F : S → S → S) (A : Set S) : Prop :=
  ∀ a b : S, a ∈ A → b ∈ A → F a b ∈ A

/-- T01: the complement of the target is closed exactly when it satisfies E. -/
theorem T01 {S : Type*} (F : S → S → S) (x : S) :
    E F x ↔ ClosedUnder F {y | y ≠ x} := by
  rfl

/-- T02: every element satisfies E iff the binary operation is conservative. -/
theorem T02 {S : Type*} (F : S → S → S) :
    (∀ x : S, E F x) ↔ (∀ a b : S, F a b = a ∨ F a b = b) := by
  constructor
  · intro h a b
    by_cases ha : F a b = a
    · exact Or.inl ha
    · by_cases hb : F a b = b
      · exact Or.inr hb
      · exact False.elim (h (F a b) a b (Ne.symm ha) (Ne.symm hb) rfl)
  · intro h x a b ha hb hab
    rcases h a b with h1 | h2
    · exact ha (h1.symm.trans hab)
    · exact hb (h2.symm.trans hab)

#print axioms T01
#print axioms T02

end RelationalPrimality
