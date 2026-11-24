import RelationalPrimality.IntersectionDepth

set_option autoImplicit false
set_option warningAsError true

namespace RelationalPrimality
universe u v
variable {S : Type u} {I : Type v}
variable (arity : I → Nat)
variable (F : (i : I) → (Fin (arity i + 1) → S) → S)

def ColourComplement {d : Nat} (D : Finset S) (c : S → Fin d) (k : Fin d) : Set S :=
  {y | y ∉ D ∨ c y ≠ k}

theorem witnesses_outside_basis (A : Finset S) (hA : IrredundantFin arity F A)
    (x : S) (hxA : x ∈ A) (hxE : ¬ EFamily arity F x) :
    ∃ (i : I) (a : Fin (arity i + 1) → S),
      F i a = x ∧ (∀ j, a j ≠ x) ∧ ∃ j, a j ∉ A := by
  classical
  have hw : ∃ (i : I) (a : Fin (arity i + 1) → S),
      F i a = x ∧ (∀ j, a j ≠ x) := by
    by_contra hn
    apply hxE
    intro i a ha he
    exact hn ⟨i, a, he, ha⟩
  obtain ⟨i, a, he, ha⟩ := hw
  refine ⟨i, a, he, ha, ?_⟩
  by_contra hn
  push_neg at hn
  have hx : Generated arity F (↑(A.erase x) : Set S) x := by
    have hg : Generated arity F (↑(A.erase x) : Set S) (F i a) :=
      Generated.step i a (fun j => Generated.seed (a j) (Finset.mem_erase.mpr ⟨ha j, hn j⟩))
    rw [he] at hg
    exact hg
  have hgen : Generates arity F (↑(A.erase x) : Set S) := by
    intro y
    apply generated_substitute arity F (A := (↑A : Set S)) _ (hA.1 y)
    intro z hz
    by_cases hzx : z = x
    · subst z
      exact hx
    · exact Generated.seed z (Finset.mem_erase.mpr ⟨hzx, hz⟩)
  exact hA.2 (A.erase x) (Finset.erase_ssubset hxA) hgen

/-- Greedy colouring with recovery, using induction on the finite deleted set.
    Each new vertex chooses a colour absent from its old in-set arguments.
    Recovery of that vertex precedes the already certified recovery of the old set. -/
theorem greedy_recovery (d : Nat) (hd : 0 < d)
    (hb : ∀ i, arity i + 1 ≤ d) (D : Finset S)
    (hw : ∀ x ∈ D, ∃ (i : I) (a : Fin (arity i + 1) → S),
      F i a = x ∧ (∀ j, a j ≠ x) ∧ ∃ j, a j ∉ D) :
    ∃ c : S → Fin d, ∀ k : Fin d, Generates arity F (ColourComplement D c k) := by
  classical
  revert hw
  induction D using Finset.induction_on with
  | empty =>
      intro _
      refine ⟨fun _ => ⟨0, hd⟩, ?_⟩
      intro k y
      exact Generated.seed y (Or.inl (by simp))
  | @insert x D hx ih =>
      intro hw
      have hwD : ∀ y ∈ D, ∃ (i : I) (a : Fin (arity i + 1) → S),
          F i a = y ∧ (∀ j, a j ≠ y) ∧ ∃ j, a j ∉ D := by
        intro y hy
        obtain ⟨i, a, he, ha, j, hj⟩ := hw y (Finset.mem_insert_of_mem hy)
        exact ⟨i, a, he, ha, j, fun h => hj (Finset.mem_insert_of_mem h)⟩
      obtain ⟨c, hc⟩ := ih hwD
      obtain ⟨i, a, he, ha, j0, hj0⟩ := hw x (Finset.mem_insert_self x D)
      let J : Finset (Fin (arity i + 1)) := Finset.univ.filter (fun j => a j ∈ D)
      let Bad : Finset (Fin d) := J.image (fun j => c (a j))
      have hsub : J ⊆ Finset.univ.erase j0 := by
        intro j hj
        have hmem : a j ∈ D := (Finset.mem_filter.mp hj).2
        apply Finset.mem_erase.mpr
        refine ⟨?_, Finset.mem_univ j⟩
        intro hh
        subst j
        exact hj0 (Finset.mem_insert_of_mem hmem)
      have hJ : J.card ≤ arity i := by
        have hle := Finset.card_le_card hsub
        simpa using hle
      have hBad : Bad.card < (Finset.univ : Finset (Fin d)).card := by
        have hle : Bad.card ≤ J.card := Finset.card_image_le
        simp only [Finset.card_univ, Fintype.card_fin]
        have hbi := hb i
        omega
      obtain ⟨k0, _, hk0⟩ := Finset.exists_mem_not_mem_of_card_lt_card hBad
      let c' : S → Fin d := fun y => if y = x then k0 else c y
      refine ⟨c', ?_⟩
      intro k
      have hxrec : Generated arity F (ColourComplement (insert x D) c' k) x := by
        by_cases hk : k = k0
        · subst k
          have hargs : ∀ j, Generated arity F (ColourComplement (insert x D) c' k0) (a j) := by
            intro j
            apply Generated.seed
            change a j ∉ insert x D ∨ c' (a j) ≠ k0
            by_cases hm : a j ∈ D
            · right
              have hne : c (a j) ≠ k0 := by
                intro hh
                apply hk0
                exact Finset.mem_image.mpr ⟨j, Finset.mem_filter.mpr ⟨Finset.mem_univ j, hm⟩, hh⟩
              simpa [c', ha j] using hne
            · left
              simp [ha j, hm]
          have hstep : Generated arity F (ColourComplement (insert x D) c' k0) (F i a) :=
            Generated.step i a hargs
          rw [he] at hstep
          exact hstep
        · apply Generated.seed
          right
          simpa [c'] using Ne.symm hk
      intro y
      apply generated_substitute arity F (A := ColourComplement D c k) _ (hc k y)
      intro z hz
      by_cases hzx : z = x
      · subst z
        exact hxrec
      · apply Generated.seed
        change z ∉ D ∨ c z ≠ k at hz
        change z ∉ insert x D ∨ c' z ≠ k
        rcases hz with hn | hn
        · left
          simp [hzx, hn]
        · right
          simpa [c', hzx] using hn

theorem T77_arity_bound (d : Nat) (hd : 0 < d)
    (hb : ∀ i, arity i + 1 ≤ d) (A : Finset S)
    (hA : IrredundantFin arity F A) : DepthCertificate arity F (d + 1) := by
  classical
  let D := nonessentialPart arity F A
  have hw : ∀ x ∈ D, ∃ (i : I) (a : Fin (arity i + 1) → S),
      F i a = x ∧ (∀ j, a j ≠ x) ∧ ∃ j, a j ∉ D := by
    intro x hx
    have hx' : x ∈ A ∧ ¬ EFamily arity F x := by
      have hm : x ∈ nonessentialPart arity F A := hx
      unfold nonessentialPart at hm
      exact Finset.mem_filter.mp hm
    obtain ⟨i, a, he, ha, j, hj⟩ := witnesses_outside_basis arity F A hA x hx'.1 hx'.2
    refine ⟨i, a, he, ha, j, ?_⟩
    intro hm
    apply hj
    change a j ∈ nonessentialPart arity F A at hm
    unfold nonessentialPart at hm
    exact (Finset.mem_filter.mp hm).1
  obtain ⟨c, hc⟩ := greedy_recovery arity F d hd hb D hw
  have href : ∀ k : Fin d, ∃ C : Finset S,
      (↑C : Set S) ⊆ ColourComplement D c k ∧ IrredundantFin arity F C :=
    fun k => fg_refinement arity F A hA.1 _ (hc k)
  choose K hsub hK using href
  let H : Finset (Finset S) := insert A (Finset.univ.image K)
  have hirr : ∀ C ∈ H, IrredundantFin arity F C := by
    intro C hC
    change C ∈ insert A (Finset.univ.image K) at hC
    rcases Finset.mem_insert.mp hC with he | hm
    · simpa [he] using hA
    · obtain ⟨k, _, he⟩ := Finset.mem_image.mp hm
      rw [← he]
      exact hK k
  refine ⟨H, ⟨A, by simp [H]⟩, ?_, hirr, ?_⟩
  · have hi : H.card ≤ (Finset.univ.image K).card + 1 := Finset.card_insert_le _ _
    have hc' : (Finset.univ.image K).card ≤ d := by
      simpa using (Finset.card_image_le (s := (Finset.univ : Finset (Fin d))) (f := K))
    omega
  · intro x
    constructor
    · intro hx
      by_contra hn
      have hxA : x ∈ A := hx A (by simp [H])
      have hxD : x ∈ D := by
        change x ∈ nonessentialPart arity F A
        unfold nonessentialPart
        exact Finset.mem_filter.mpr ⟨hxA, hn⟩
      have hk : K (c x) ∈ H := by
        change K (c x) ∈ insert A (Finset.univ.image K)
        exact Finset.mem_insert_of_mem (Finset.mem_image.mpr ⟨c x, by simp, rfl⟩)
      have hh : x ∉ D ∨ c x ≠ c x := hsub (c x) (hx (K (c x)) hk)
      exact hh.elim (fun h => h hxD) (fun h => h rfl)
    · intro hx C hC
      exact (E_iff_all_generating arity F x).mp hx (↑C : Set S) (hirr C hC).1

theorem depth_mono {k l : Nat} (hkl : k ≤ l) (h : DepthCertificate arity F k) :
    DepthCertificate arity F l := by
  obtain ⟨H, hn, hc, hi, he⟩ := h
  exact ⟨H, hn, hc.trans hkl, hi, he⟩

/-- A finite generating set of minimum cardinality exists under finite generation. -/
theorem exists_minimal_generators (A : Finset S) (hA : Generates arity F (↑A : Set S)) :
    ∃ B : Finset S, Generates arity F (↑B : Set S) ∧
      ∀ C : Finset S, Generates arity F (↑C : Set S) → B.card ≤ C.card := by
  classical
  let p : Nat → Prop := fun n => ∃ C : Finset S, Generates arity F (↑C : Set S) ∧ C.card = n
  have hp : ∃ n, p n := ⟨A.card, A, hA, rfl⟩
  obtain ⟨B, hB, hcard⟩ := Nat.find_spec hp
  refine ⟨B, hB, ?_⟩
  intro C hC
  rw [hcard]
  exact Nat.find_min' hp (show p C.card from ⟨C, hC, rfl⟩)

/-- T77, with the least generating-set cardinality represented by a minimal-cardinality B.
    The cardinal of essentialPart is the cardinal of E by essentialPart_exact. -/
theorem T77 (d : Nat) (hd : 0 < d) (hb : ∀ i, arity i + 1 ≤ d)
    (A : Finset S) (hA : Generates arity F (↑A : Set S)) :
    ∃ B : Finset S, Generates arity F (↑B : Set S) ∧
      (∀ C : Finset S, Generates arity F (↑C : Set S) → B.card ≤ C.card) ∧
      DepthCertificate arity F (min (d + 1) (B.card - (essentialPart arity F B).card + 1)) := by
  obtain ⟨B, hB, hmin⟩ := exists_minimal_generators arity F A hA
  have hirr : IrredundantFin arity F B := by
    refine ⟨hB, ?_⟩
    intro C hCB hC
    have hlt := Finset.card_lt_card hCB
    exact (Nat.not_le_of_lt hlt) (hmin C hC)
  refine ⟨B, hB, hmin, ?_⟩
  by_cases hle : d + 1 ≤ B.card - (essentialPart arity F B).card + 1
  · rw [min_eq_left hle]
    exact T77_arity_bound arity F d hd hb B hirr
  · rw [min_eq_right (Nat.le_of_not_ge hle)]
    exact T77_rank_bound arity F B hirr

#print axioms witnesses_outside_basis
#print axioms greedy_recovery
#print axioms T77_arity_bound
#print axioms depth_mono
#print axioms exists_minimal_generators
#print axioms T77
end RelationalPrimality
