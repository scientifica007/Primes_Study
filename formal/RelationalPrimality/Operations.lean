import RelationalPrimality.Foundations

set_option autoImplicit false
set_option warningAsError true

namespace RelationalPrimality
universe u v

def EOp {S : Type u} (n : Nat) (F : (Fin (n+1) → S) → S) (x : S) : Prop :=
  ∀ a, (∀ j, a j ≠ x) → F a ≠ x

def EFamily {S : Type u} {I : Type v} (arity : I → Nat)
    (F : (i : I) → (Fin (arity i + 1) → S) → S) (x : S) : Prop :=
  ∀ i, EOp (arity i) (F i) x

/-- T11: pointwise form of intersection of the individual E sets. -/
theorem T11 {S : Type u} {I : Type v} (arity : I → Nat)
    (F : (i : I) → (Fin (arity i + 1) → S) → S) (x : S) :
    EFamily arity F x ↔ ∀ i, EOp (arity i) (F i) x := by
  rfl

/-- Finite derivations from a set of seeds; operations have positive finite arity. -/
inductive Generated {S : Type u} {I : Type v} (arity : I → Nat)
    (F : (i : I) → (Fin (arity i + 1) → S) → S) (B : Set S) : S → Prop
  | seed (y : S) : y ∈ B → Generated arity F B y
  | step (i : I) (a : Fin (arity i + 1) → S) :
      (∀ j, Generated arity F B (a j)) → Generated arity F B (F i a)

theorem generated_avoids {S : Type u} {I : Type v} (arity : I → Nat)
    (F : (i : I) → (Fin (arity i + 1) → S) → S) (x : S) (B : Set S)
    (h : EFamily arity F x) (hB : ∀ y ∈ B, y ≠ x)
    (y : S) (hy : Generated arity F B y) : y ≠ x := by
  induction hy with
  | seed z hz => exact hB z hz
  | step i a _ ih => exact h i a ih

/-- T12: direct nonproduction iff no finite derivation from all other elements. -/
theorem T12 {S : Type u} {I : Type v} (arity : I → Nat)
    (F : (i : I) → (Fin (arity i + 1) → S) → S) (x : S) :
    EFamily arity F x ↔ ¬ Generated arity F {y | y ≠ x} x := by
  constructor
  · intro h hg
    exact generated_avoids arity F x {y | y ≠ x} h (fun _ hz => hz) x hg rfl
  · intro h i a ha he
    apply h
    rw [← he]
    exact Generated.step i a (fun j => Generated.seed (a j) (ha j))

/-- A derived operation has a finite derivation from its arguments, with no new constants.
    This hypothesis is implied by any fixed term over the original operations. -/
def Derived {S : Type u} {I : Type v} (arity : I → Nat)
    (F : (i : I) → (Fin (arity i + 1) → S) → S)
    (n : Nat) (H : (Fin (n+1) → S) → S) : Prop :=
  ∀ a, Generated arity F {y | ∃ j, a j = y} (H a)

/-- T13: adding a derived operation preserves E, pointwise. -/
theorem T13 {S : Type u} {I : Type v} (arity : I → Nat)
    (F : (i : I) → (Fin (arity i + 1) → S) → S)
    (n : Nat) (H : (Fin (n+1) → S) → S)
    (hH : Derived arity F n H) (x : S) :
    (EFamily arity F x ∧ EOp n H x) ↔ EFamily arity F x := by
  constructor
  · exact And.left
  · intro h
    refine ⟨h, ?_⟩
    intro a ha
    apply generated_avoids arity F x {y | ∃ j, a j = y} h
    · intro y hy
      obtain ⟨j, hj⟩ := hy
      rw [← hj]
      exact ha j
    · exact hH a

#print axioms T11
#print axioms T12
#print axioms T13
end RelationalPrimality
