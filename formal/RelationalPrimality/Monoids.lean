import RelationalPrimality.Foundations
import Mathlib.Algebra.Group.Units.Basic

set_option autoImplicit false
set_option warningAsError true

namespace RelationalPrimality

/-- T06: all units fix an externally nonproduced nonunit on both sides. -/
theorem T06 {M : Type*} [Monoid M] (x : M) (hx : ¬ IsUnit x)
    (h : E (fun a b : M => a * b) x) (u : Mˣ) :
    (u : M) * x = x ∧ x * (u : M) = x := by
  have hu : (u : M) ≠ x := by
    intro he
    apply hx
    exact ⟨u, he⟩
  constructor
  · by_contra hn
    have hv : (↑(u⁻¹) : M) * x ≠ x := by
      intro he
      apply hn
      have hh := congrArg (fun z : M => (u : M) * z) he
      simpa [← mul_assoc] using hh.symm
    exact h (u : M) ((↑(u⁻¹) : M) * x) hu hv (by simp [← mul_assoc])
  · by_contra hn
    have hv : x * (↑(u⁻¹) : M) ≠ x := by
      intro he
      apply hn
      have hh := congrArg (fun z : M => z * (u : M)) he
      simpa [mul_assoc] using hh.symm
    exact h (x * (↑(u⁻¹) : M)) (u : M) hv hu (by simp [mul_assoc])

#print axioms T06
end RelationalPrimality
