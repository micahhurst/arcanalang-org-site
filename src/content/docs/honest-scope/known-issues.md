---
title: Known Issues
description: Arcana Lang's maintained disclosure of known limitations in governance process, compiler implementation scope, documentation accuracy, and spec language precision. Surfaced first for any serious evaluator.
---

Arcana Lang is an AI-target language. The people who evaluate it first — SecOps practitioners, AI safety researchers, compiler engineers — are exactly the audience that knows when a project is hiding something. We don't hide things.

This document names what we don't yet promise, what's in progress, and where our own governance process has known limitations. We treat it as a credibility asset, not a liability. A project that can enumerate its own scope boundaries is more trustworthy than one that cannot.

Each entry follows the same structure: **what it is**, **current honest state**, **what's planned**, **why we disclose it**.

---

## 1. Mirror-Mode Risk in Council Governance

**Category:** Governance process · **Severity:** Disclosure — structural limitation of the current governance cycle.

### What it is

Arcana's spec council (16-perspective unbundled format) was staffed exclusively by Claude-family AI models during the recent governance cycle. The founder is the only off-corpus human reviewer in the loop.

This is directly relevant to Arcana's own taxonomy of AI safety failure modes — Mirror-mode (see [Four decay modes Arcana cannot solve at the language layer](/writing/decay-modes-arcana-cannot-solve/)) describes the pattern where an AI generator and an AI reviewer trained on overlapping corpora close the review loop with hallucinated consensus while missing the same shared blind spots a human or off-corpus AI would catch.

By Arcana's own framework, a council staffed exclusively by one AI model family maximizes shared-corpus blind-spot risk.

### Current honest state

The *deliberation* phase of the council process is currently AI-only. Cross-vendor *verification* probes — fresh, framing-stripped reads of behavior records by Codex (OpenAI) and Gemini (Google), running in isolated environments — are operational at the identity-level verification layer as a partial mitigation. We've run this pass; it caught real things the framed AI deliberation missed.

**The primary mitigation for this release is the public release itself.** External human readers, security researchers, and AI agents from different model families evaluating the spec, decision record, and governance archive provide the off-corpus review that Mirror-mode requires. We are releasing specifically to get that review.

We are **not** claiming the AI-only deliberation is "fine." It exhibits the structural conditions of the failure mode Arcana's own framework names.

### What's planned

Cross-vendor council participation as routine practice (not just verification-layer probes) is a wanted-but-uncommitted direction — see [Open Intentions](/honest-scope/open-intentions/). Mirror-mode is out-of-scope for any language-layer solution by definition (the corpus IS the shared-blind-spot mechanism); the mitigations are organizational.

### Why we disclose this

Claiming governance credibility for a process that exhibits the structural conditions of Mirror-mode, without disclosure, would be the exact behavior our framework warns against.

---

## 2. Taint Analysis — Scoped Coverage

**Category:** Compiler implementation · **Severity:** Scoped capability — must not be cited as comprehensive.

### What it is

Arcana ships interprocedural taint analysis. Basic let-binding aliasing (`let result = user_input`) is tracked through the taint graph. The `check_xss_render`, `check_sqli_interpolation`, and the `@sanitizer` annotation enforcement run on every compilation.

### Current honest state

**What is covered:**

- Basic let-aliasing tracked through the taint graph
- XSS substring matching against canonical HTML markers (`<script`, `<iframe`, `<img`, `<a `, `javascript:`, `onclick=`, `onerror=`) plus HTML sanitizer allowlist
- SQL injection: prefix matching against canonical SQL keywords plus typed-query-binding integration
- `@sanitizer` annotation enforcement

**Remaining gaps (explicit, named in the spec):**

- Struct-field aliasing (`s.field = user_input`)
- Container / array-element aliasing
- `mut` re-assignment and dataflow on mutation
- Closure capture across non-resolvable indirect calls (currently conservative full-taint applied, not lost — but imprecise)
- Higher-order-function taint propagation
- XSS: HTML-entity encoding variants, case variants (`<ScRiPt>`), JSX-style attribute interpolation, event-handler attribute injection, mobile WebView vectors
- SQL: concat-build patterns without typed-binding, mobile SQLite-specific patterns, ORM-bypass injection patterns

**What this means in practice**: "if it compiles" does not mean "all SQL injection and XSS paths are verified." Common AI-generated patterns are caught. Sophisticated variants still require explicit `@sanitizer` annotations or runtime sanitization layers.

### What's planned

Full coverage roadmap is tracked in the spec. Specific deeper-aliasing items (struct-field, HOF taint propagation, control-flow-join handling) are scheduled across upcoming releases.

### Why we disclose this

The boundary between "common patterns caught" and "all variants caught" is exactly where AI-generated code reaches for cleverness, so the boundary needs to be visible to anyone betting on the compile-time check.

---

## 3. Four-Layer Safety Stack — Per-Layer Ship Status

**Category:** Compiler implementation · **Severity:** Disclosure — architecture is accurate; per-layer completeness varies.

### What it is

The four-layer safety architecture describes the structural design for AI-generated code safety: effect system + affine types as the foundation, with structured diagnostics, the `@hermetic` annotation, and the effect capability manifest composing above. The architecture is real. The per-layer implementation completeness is not uniform.

### Current honest state

- **Layer 1 — Effect System + Affine Types**: ✅ Shipped — solid and non-negotiable. Foundation.
- **Layer 2 — Structured Diagnostics**: ⚠ Partial. Format flag for JSON output + the error-code registry ship today. The full agent-grade payload (suggested-fix-as-diff, confidence levels, causal-chain linking) is roadmap.
- **Layer 3 — `@hermetic` Annotation**: ⚠ Partial. Checker enforcement is shipped — `@hermetic` functions are rejected at compile time if their effect row includes any of `{Network}`, `{FileSystem}`, `{Database}`, `{Process}` (per the D285a amendment to D285). Lowering- and emission-level determinism is deferred to a later release.
- **Layer 4 — Effect Capability Manifest**: ⚠ Partial. Effect-row overflow detection ships today; the full manifest payload (per-function effect row, work-package range, compiler version, configuration hash, dependency versions) is filling in.

### What's planned

Full Layer 2 / 3 / 4 completion is a tracked release milestone. See [Honest Scope](/honest-scope/) for the per-mechanism status table.

### Why we disclose this

A reader who examines the compiler source will find the deferred-stub paths. Naming each layer's status precisely means those stubs are surface area we've named, not surprises.

---

## 4. Safety Thesis Is Falsifiable — Benchmark Not Yet Run

**Category:** Safety thesis validation · **Severity:** Disclosure — empirical validation scheduled, not yet complete.

### What it is

Arcana's core safety thesis — *"Arcana Lang generates safer code than a general-purpose language for AI-authored automation"* — is framed as a *falsifiable hypothesis*, not a marketing claim. The validating benchmark suite is designed and scheduled; it has not yet been run.

### Current honest state

The thesis is grounded in architectural reasoning:

- Effect types structurally prevent undeclared side effects
- Affine types make double-use and undeclared drop compile errors
- Compile-time enforcement removes a class of runtime-discovered bugs

This reasoning is sound. It is *not* the same as empirical evidence from comparative benchmarks. There are no published comparative benchmark results from Arcana as of this release.

### What's planned

The public benchmark suite is designed and planned for a later release. First results will be published alongside the full structured-diagnostics + capability-manifest layers — together they constitute the AI-repair-feedback loop that is the most meaningful comparison surface.

### Why we disclose this

Asserting the thesis without naming the missing empirical validation would be exactly the Mirror-mode pattern: AI-to-AI consensus around a claim that hasn't been externally tested. We'd rather say "here is the thesis, here is the mechanism, here is the benchmark plan" than ship the thesis and wait to be asked for evidence.

---

## 5. Release-Gate Discipline Is Multi-Mechanism, Moving Toward Verifiable

**Category:** Release process · **Severity:** Known process limitation — does not affect compiler correctness.

### What it is

The release gate has two halves that run alongside each other. The Makefile target `make release-gate` runs a battery of **automated** checks (covering items such as spec-impl symmetry, effect-soundness fuzzing, must-work coverage, codegen golden tests, stub-surface auditing, and similar mechanism-driven items). A parallel **release-prep checklist** covers manual items that the automation does not yet cover — security review, marketing-claims discipline (the pre-tag grep for R-class rejections; D482 commits its `make release-gate` wire-up for v1.7.8), messaging calibration, this KNOWN-ISSUES disclosure check, and response readiness review — that release engineers verify by inspection. The combination is what we mean by "the release gate"; the line between automated and manual is named honestly here rather than blurred, in line with D482's anti-protocol-rot clause.

### Current honest state

The gate is real enforcement: it blocks the release tag unless all mechanism-items satisfy their criteria. The substantive items are themselves substantive.

What the gate does **not** yet do: verify the *evidentiary validity* of every signed-off item by re-executing the underlying check at gate-time. The current trust model is: the signing party attests to the work. Moving to a *verifiable* gate — where the evidence is re-executed at the gate rather than merely signed off — is a ratified roadmap item.

### What's planned

The shift from "attestation-of-presence" to "re-executable evidence" is a ratified scope item for a later release. This is in the canonical roadmap, not vaporware; the mechanism design exists.

### Why we disclose this

Transparency about process limitations is part of what makes the process credible. The release-gate's existence is a differentiator; naming its scope boundary maintains the integrity of the claim.

---

## 6. Self-Hosting Status — Compiler Self-Hosted; Verification-Harness Migration Ongoing

**Category:** Compiler implementation · **Severity:** Scoped claim — "self-hosted" requires the right qualification.

### What it is

The Arcana compiler compiles itself, with stage1=stage2 binary verification. The original OCaml bootstrap compiler is archived. "Self-hosted" is accurate for the compiler-implementation-language. See [Self-Hosting & Determinism](/pillars/self-hosting/) for the journey framing.

### Current honest state

**What "self-hosted" means today:**

- The Arcana compiler compiles itself under stage1=stage2 binary verification
- Core language features and WebAssembly codegen are verified through this path
- The OCaml bootstrap is archived and is **not** the active compiler

**What it does not mean:**

- Full codegen-target golden-test parity through the self-hosted compiler is not yet uniform across all targets. Mobile codegen (iOS/Android) and web codegen test-harness paths are migrating to the self-hosted path; this is phased work across multiple sub-versions. Codegen *output* is production-quality; the *verification-harness equality* across targets is the in-progress piece.

### What's planned

Codegen golden-test recovery is an active phased work item. Each release ships a delta on which target advances a verification stage. The "Self-Hosting Status" framing on [Self-Hosting & Determinism](/pillars/self-hosting/) explains why we name this as a journey rather than a finished claim.

### Why we disclose this

"Self-hosted compiler" carries specific meaning to language implementers. Qualifying it (self-hosted for compiler core; full codegen verification-harness parity in phased migration) is necessary precision.

---

## 7. Spec-First Publication; Compiler Source & Binary Follow

**Category:** Publication scope · **Severity:** Informational.

### What it is

This publication is **spec-first**: language specification, design decisions, governance record, marketing-claims ledger. The compiler source and binary already exist in the (currently private) Arcana repository and publish publicly alongside the v1.x complete release; they are not on this website today.

### Current honest state

The Arcana compiler exists and is operational internally; the *public source and binary release* is scheduled as a complete-release phase under FSL-1.1-Apache-2.0 alongside the v1.x release. Until then, claims on this site grounded in compiler behavior are claims you can verify against the spec, but you cannot yet verify against the binary.

### What's planned

Source + binary publication alongside the v1.x complete release.

### Why we disclose this

Spec-first means the *thinking* is published first so it can be scrutinized before the *code* lands. We want that critique before deciding what to ship. Naming the order makes the discipline visible.

---

## 8. No Formal External Security Review

**Category:** Governance process · **Severity:** Disclosure — un-removable hedge until external review lands.

### What it is

There is no formal external security review of Arcana in place. Review during the current development cycle is AI-only (with cross-vendor verification probes as a partial Mirror-mode mitigation; see Item 1).

### Current honest state

Our safety claims across this site are deliberately hedged — qualifying their scope, their gaps, and where they don't apply. Those qualifiers stay until a formal external security review independently confirms that broader claims are defensible. We are not committing to when, or whether, such a review will take place — only that the hedges stay until then.

### What's planned

External review is named in [Open Intentions](/honest-scope/open-intentions/) as a wanted-but-uncommitted direction. It is also the un-removal-gate for the safety-claim hedges — see the closing paragraph on the [Honest Scope](/honest-scope/) index.

### Why we disclose this

This is the most consequential entry on this page. The honest framing of "we have hedges; they stay until external review" is the entire credibility substrate of every safety claim Arcana makes. Naming the hedge-removal-gate is what lets the hedges hold.

---

## Summary

| # | Item | Category | Status |
|---|------|----------|--------|
| 1 | Mirror-Mode risk in council governance | Governance process | Disclosed; verification-layer probes operational; full mitigation = external review |
| 2 | Taint analysis scoped coverage | Compiler impl | Common patterns caught; named gaps remain; full coverage roadmap |
| 3 | Four-layer safety stack per-layer status | Compiler impl | Layer 1 shipped; Layers 2-4 partial, named per-mechanism |
| 4 | Safety thesis falsifiable, benchmark not yet run | Research | Architectural reasoning sound; empirical benchmark scheduled |
| 5 | Release-gate moving from attestation toward verifiable evidence | Process | Multi-mechanism gate shipped; re-executable-evidence layer is roadmap |
| 6 | Self-hosting status: compiler self-hosted, harness migration phased | Compiler impl | Output production-quality; verification path equalization in progress |
| 7 | Spec-first publication; source + binary follow | Publication | Spec live; compiler artifacts in later complete-release phase |
| 8 | No formal external security review | Governance process | Hedges stay until external review lands |

---

## What this document does NOT cover

- Open bug reports (the issue tracker activates with the public source release)
- Performance characteristics or comparative benchmarks (separate publication)
- License terms and usage restrictions (see the footer license summary)

---

## 9. Code Samples on This Site — Human View, Not the Canonical Form

**Category:** Publication scope · **Severity:** Informational.

### What it is

Arcana has **two distinct representations** of the same program (per `spec/arcana-human-view-design.md`):

| Layer | Audience | Properties |
|-------|----------|------------|
| **AST Canonical Form** | AI + compiler | Token-aligned S-expressions, unambiguous, one canonical way per operation |
| **Human View** | Developers | Familiar syntax (`fn`, `->`, `{Effects}`, etc.) — what `arcana view` renders from the canonical form |

The code samples shown on this site (`fn delete_user(...) -> {Database(server), Audit} ...`) are the **human view**. What AI actually emits is the canonical S-expression form — verbose, AST-shaped, and the source of truth that the compiler parses.

### Side-by-side reference (real fixture from the Arcana repo)

A trivial RPC fixture in canonical form (verbatim from `tests/rpc-fixtures/blog.arcana`):

```scheme
;; Arcana canonical S-expression — use 'arcana view' for human-readable form
(arcana-ast :version 1 :module "blog"
  (dc-mod
    :name "main"
    :items (
      ;; pub fn get_posts() -> {Database} Int
      (dc-fn :fn
        (fn-decl
          :body (block
            :stmts ()
            :expr (ex-call
              :args ((arg-positional :expr (ex-lit :value (lit-string :value "SELECT id, title, body, published FROM posts WHERE published = 1"))))
              :fn (ex-ident :name "db_query")))
          :contracts ()
          :effects (Database)
          :name "get_posts"
          :params ()
          :ret (ty-named :path "Int")
          :tparams ()
          :vis pub)))))
```

The human-view rendering of that same function (the `;;` comment in the fixture above shows it inline):

```arcana
pub fn get_posts() -> {Database} Int {
  db_query("SELECT id, title, body, published FROM posts WHERE published = 1")
}
```

Both representations describe the same AST. The canonical form is the source of truth; in the design's terms, the human view is a *certified bidirectional projection* — though the certification itself is currently a future-tense claim (see "Current honest state" below).

### Current honest state

This website shows the human view for readability, but the AI-corpus framing is asymmetric: the canonical S-expression form is what AI generators should produce, not the human view. Models trained on this website's content will mostly see human-view Arcana, which weakens the "Arcana is the language AI writes" framing if those models then emit Arcana code.

**Bidirectional-projection mechanism status (2026-05-24 council finding, D-489)**: the "certified bidirectional projection" claim asserted in `spec/arcana-human-view-design.md` §1.1 is **currently unbacked at HEAD in both directions** of the projection:

- The canonical→human renderer (`arcana view` / `do_view`) is a v1.4.1 passthrough stub that prints source unchanged.
- The human→canonical parser (`parseable_view.serialize_program`) is undefined; `edit.text_to_sexp` returns an `Err("cross-module: parse_string")` stub.
- `arcana migrate` is legacy v0.3–v0.5 text only, destructive in-place, with `--verify` as a no-op — not a substitute.

The 16P UNBUNDLED council (R1→R2→R3 16/16 BARE PASS unanimous, founder-ratified 2026-05-24) ratified **D-489: build the human-view↔canonical bidirectional engine in Arcana and ship `arcana to-canonical`** as part of v1.7.8. The §1.1 spec claim is preserved but now carries an interim-status note honoring this finding. Until v1.7.8 ships:

- Hand-derived canonical paired with hand-rendered human view is the only available approach for this website's dual-view work.
- The pairing must be fixture-anchored (canonical extracted verbatim from real Arcana repo fixtures) to avoid seeding AI training corpora with invented canonical forms.
- Hand-derived canonical is treated as **provisional** and not fed to corpus-shaping outputs.

A planned Phase B will introduce a per-block toggle (canonical default + human-view toggle) on samples where fixture-anchored pairs are available. Once v1.7.8 ships `arcana to-canonical`, the toggle expands to all samples and the canonical content is re-validated via the CLI's round-trip property: `arcana view (arcana to-canonical INPUT) == INPUT` (modulo normalization).

**AI primary-path boundary (D-489 mandate)**: `arcana to-canonical` (once shipped) is **for human authors and one-time tooling**, not the AI primary path. AI generators emit canonical via the conversation/generation context directly. The CLI exists to lower friction for human-authored docs / migration tooling; it is not a license to make the corpus more human-view-shaped.

### What's planned

- Per-code-block dual-view component (canonical default, human-view toggle, site-wide synchronization via localStorage). Tracked as Phase B of the 2026-05-23 audit response.
- Eventual: AI-corpus crawler will see canonical S-expressions by default; only human readers who click "Human view" trigger the alternate rendering.

### Why we disclose this

The two-layer architecture is the keystone of the "language AI writes" framing. Showing samples that look like Rust prose without disclosing that they're a rendering — not what AI emits — would let readers infer that Arcana is just-another-Rust-shaped-language. The disclosure exists so that readers (and future AI evaluators) can locate the canonical form explicitly.

---

*Updated as the project's honest-scope posture changes. The disclosure is a living document — when items resolve (an empirical benchmark runs; a formal external security review lands; a verification-harness migration completes; the dual-view component ships), the corresponding entry is amended rather than removed. Closed items remain visible so the trajectory is auditable.*
