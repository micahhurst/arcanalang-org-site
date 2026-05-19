---
title: Honest Scope
description: The canonical per-mechanism status — what's shipped, what's partial, what's roadmap, what's deliberately out-of-scope. Read this before evaluating Arcana's safety claims.
---

This is the canonical per-mechanism status table for Arcana's safety claims — what's shipped, what's partial, what's roadmap, what's deliberately out-of-scope. **We surface it first because a serious evaluator should not have to read source code to find the bounds of our claims.**

Arcana's compile-time guarantees are real and specific. They are also *bounded* — and the bounds are documented here, in one place. The same principle Arcana applies to AI-generated code applies to its own claims: enumerate the bounds, check at the boundary, refuse to admit drift.

## Per-mechanism status

Each mechanism named on the pillar pages carries a status here. Statuses use four tags:

- **Shipped** — implemented, verified, safe to cite without further qualification.
- **Shipped, scoped** — implemented with explicit coverage gaps named in the spec; safe to cite *if* the scope is named.
- **Partial** — implemented in a load-bearing form but not at the full shape the design specifies; cite with the partial-shape hedge.
- **Approved, not yet implemented** — design ratified for a later release; do not cite as a current capability.

### [Compile-Time Safety](/pillars/compile-time-safety/)

| Mechanism | Status | Notes |
|---|---|---|
| Effect system | Shipped | Closed admission-controlled vocabulary; effects propagate via contagion. |
| Affine resource types | Shipped | Scoped to Arcana-typed code paths; does not extend across `Unsafe` FFI boundaries or to native resources owned by the host. |
| Refinement types | Shipped, scoped | Constructor subset shipped; general predicate refinement is roadmap. |
| Compile-time taint / data-flow | Shipped, scoped | Common AI-generated injection patterns caught; sophisticated variants require explicit `@sanitizer` annotations or runtime sanitization. Gap list named in WP-34 §7.1. |
| Schema-as-types | Shipped | One declaration generates type + SQL + validation. |
| Effect intersection / policy (D219) | Approved, not yet implemented | Targeted for a later release. |

### [Effect Contracts & Capability Discipline](/pillars/effect-contracts/)

| Mechanism | Status | Notes |
|---|---|---|
| Admission-controlled effect vocabulary | Shipped | Effects added, retired, or rejected through documented process. |
| Effect contagion | Shipped | Effects propagate from callee to caller signature. |
| Structured diagnostics — format | Shipped | Error codes follow `E####: message — expected X, found Y at location`; format flag for JSON output is real. |
| Structured diagnostics — full agent-grade payload | Approved, not yet implemented | Suggested-fix-as-diff, confidence levels, causal-chain linking — later release. |
| Capability manifest — overflow detection | Shipped | Effect-row size enforcement at compile time. |
| Capability manifest — full content | Partial | Effect row per exported function, work-package range, compiler version, configuration hash, dependency versions are progressively filling in. |
| `@hermetic` annotation — checker enforcement | Shipped | Compiler rejects `@hermetic` function whose effect row includes any of `{Network}`, `{FileSystem}`, `{Database}`, `{Process}` (per D285a amendment to D285). |
| `@hermetic` annotation — codegen / emission determinism | Approved, not yet implemented | Lowering-level and emission-level determinism deferred. |

### [Batteries-Included, Closed-World by Design](/pillars/batteries-included/)

| Mechanism | Status | Notes |
|---|---|---|
| First-class effect capabilities | Shipped | `{Email}`, `{SMS}`, `{CRM}`, `{Network}`, `{Database}`, `{ObjectStore(read/write)}`, `{Monitor}`, `{FileSystem}`, `{Time}`, `{Random}`, `{Env}`, `{Render}`, platform `{iOS}/{Android}`. Specific effect-coverage nuances live in the spec. |
| Closed-world stdlib | Shipped | Curated standard library; no arbitrary package-pull surface. |
| Modules as first-class language constructs | Approved, not yet implemented | Folio (blog/CMS), marketplace primitives are later-release. |
| `Unsafe` escape hatch | Shipped | Opt-in, explicit, compiler-warned at every use site; the closed-world property holds for the safe surface, not as an absolute constraint. |

### [Portable Runtime & Execution](/pillars/runtime/)

| Mechanism | Status | Notes |
|---|---|---|
| WebAssembly compilation | Shipped | Verified end-to-end through the self-hosted path. |
| Spin runtime sandbox | Shipped | Canonical recommendation per the security-debate decision. Other Wasmtime-compatible runtimes supported. |
| Host runtime utilities — implementation language | Rust | The `arcana-runtime` (wasmtime + SQLite embedding core) and `arcana-serve` (HTTP shim) crates are Rust. Customer-facing surface is the Arcana program; Rust is the host-shim implementation. |
| Multi-target codegen — output | Shipped | Web (HTMX islands + TS backend), iOS Swift, Android Kotlin. Most recent sub-version line closed remaining mobile emitter bugs. |
| Multi-target codegen — implementation language | Arcana (self-hosted) | All four codegen backends are pure Arcana. **WASM-GC** is `src/wasm.arcana` (~7.6k LOC), authoritative since v1.7.0 per D373 Phase 3 / WP-43 phase3-routing-flip — migrated *from* the Rust shim path (`gc_codegen.rs` ~1.2k LOC + `postprocessor.rs` ~6.5k LOC) over the v1.6.x sprint cycle. **TypeScript / Swift / Kotlin** emitters are pure Arcana: ~16.5k LOC across `ts_codegen.arcana`, `swift_codegen.arcana`, `kotlin_codegen.arcana`, RPC-client scaffolding (`emit_swift_rpc`, `emit_kotlin_rpc`), `mobile_common`, and `xcodegen`. Rust is confined to the verification harness and host-shim layer. |
| WASM-GC Rust shim — retirement status | Deprecated; emergency-rollback only | `gc_codegen.rs` + `postprocessor.rs` are `#[deprecated(since = "1.7.0")]` and reachable only via the `--emit-shim` flag, which itself is now a no-op alias (sunset banner emits when invoked). Full deletion was scheduled v1.7.1; slipped to a later sub-version. Disclosed here rather than removed silently. |
| Multi-target codegen — verification-harness parity | Partial | Cross-target verification through the self-hosted compiler is in phased migration. See [Self-Hosting & Determinism](/pillars/self-hosting/). |
| RPC cross-boundary type safety | Approved, not yet implemented | HTTP+JSON RPC shipped; full client/server type-safety propagation is later-release. |

### [Self-Hosting & Determinism](/pillars/self-hosting/)

| Mechanism | Status | Notes |
|---|---|---|
| Compiler self-hosting | Shipped | `stage1=stage2` byte-identical verification. |
| OCaml bootstrap | Archived | Preserved for reference; not the active compiler. |
| Language core verification via self-hosted path | Shipped | Type system, WASM codegen end-to-end. |
| Verification-harness — implementation language | Rust (current) | The harness that runs `stage1=stage2` and the WASM-GC execution checks is presently a ~33k-LOC Rust toolchain (`tests/verify-selfhost`, `tests/verify-exec`, `arcana-str-ops/fuzz`). Migrating the harness into Arcana itself is the journey work below. |
| Verification-harness parity across all targets | Partial / in-progress | Multi-sub-version migration; will not complete inside the current minor line. |

### [Governance & Honest Scope](/pillars/governance-honest-scope/)

| Mechanism | Status | Notes |
|---|---|---|
| Marketing-claims ledger (A-class / R-class) | Shipped | See [Claims Ledger](/governance/claims-ledger/). |
| Decision provenance (D-numbered record) | Shipped | Searchable, citable, durable. |
| 16-perspective council process | Shipped | Documented in `COUNCIL-PROCESS.md`. |
| Non-promises (N-numbered record) | Shipped | Surfaced inline on the pillar pages; the N-numbered record itself publishes alongside the v1.x complete release. |
| Open Intentions (Not Commitments) | Shipped | See [Open Intentions](/honest-scope/open-intentions/). |
| Mirror-mode self-disclosure | Shipped | Current council process is AI-only; this is named explicitly. |
| `KNOWN-ISSUES.md` published with release | Shipped | See [Known Issues](/honest-scope/known-issues/). |
| Verifiable release discipline (re-executable evidence at gate) | Partial / in-progress | Multi-mechanism `make release-gate` shipped; full re-executable-evidence layer is roadmap. |

## On formal external security review

The current Arcana council process is staffed by AI from a single model family. **There is no formal external security review in place.** By Arcana's own taxonomy this exhibits Mirror-mode risk (named in [Governance & Honest Scope](/pillars/governance-honest-scope/)).

Our safety claims are deliberately hedged today — qualifying their scope, their gaps, and where they don't apply. Those qualifiers stay until a formal external security review independently confirms that broader claims are defensible. We are not committing to when, or whether, such a review will take place — only that the hedges stay until then.

## Planned ≠ committed

Many statuses above use the words **approved** or **roadmap**. These are *intent*, not *commitment*. Planning artifacts may be changed, deferred, or removed during further planning or implementation if the work turns out differently than expected. Treat anything labeled "approved," "later release," "roadmap," or "partial" as *current intent*, not a guarantee.

The only commitments are what is *shipped* and what we explicitly will *not* do (the non-promises, surfaced inline on the pillar pages). Everything else is provisional.

## Where the rest of the story lives

- [Open Intentions](/honest-scope/open-intentions/) — what we want, do not yet have, and explicitly do not promise.
- Non-promises (what Arcana deliberately will not do) — surfaced inline on the pillar pages; the N-numbered record publishes alongside the v1.x complete release.
- [Known Issues](/honest-scope/known-issues/) — the at-release-time disclosure of current process and implementation limitations.
- [Claims Ledger](/governance/claims-ledger/) — the A-class approved / R-class rejected ledger that the pre-tag grep enforces.
