---
title: Self-Hosting & Determinism
description: A journey, stated honestly. The compiler compiles itself with stage1=stage2 verification; the OCaml bootstrap is archived. Codegen output is production-quality for current targets. The verification-harness migration across targets is in progress and explicitly phased.
---

:::tip[Where to start]
**Recommended prior reading**: any of the technical pillars ([Compile-Time Safety](/pillars/compile-time-safety/) is the most directly relevant). This page is meta — it's about how the compiler that produces those safety guarantees is itself implemented + verified. Unfamiliar terms? See the [Glossary](/glossary/).
:::

**The Arcana compiler compiles itself.** With `stage1=stage2` byte-identical verification. The OCaml bootstrap is archived. WebAssembly codegen is verified end-to-end through the self-hosted path; the equal-verification migration across mobile and other targets is phased and in progress.

Both halves are real — *output is current; verification-path parity is migrating* — and conflating them would be exactly the corpus drift Arcana's marketing-claims discipline exists to prevent. So this page draws the line precisely, and frames the whole as a journey rather than a finished claim.

## What's accomplished

- **The Arcana compiler compiles itself.** With `stage1=stage2` binary verification: the compiler-built-with-bootstrap and the compiler-built-with-self produce byte-identical output on the verification suite. This has been the case since the v0.5+ self-hosting transition; the canonical reference point is the verification harness in the project's compiler sources.
- **The OCaml bootstrap compiler is archived.** The original implementation in OCaml is preserved as historical reference but is no longer the active compiler. The active compiler is Arcana, written in Arcana.
- **An Arcana-native WASM-GC code-emission path exists in `src/wasm.arcana`** (~7.6k LOC). A separate Rust shim implementation (`gc_codegen.rs` + `postprocessor.rs` in the verify-selfhost crate, ~7.8k LOC combined) also lives in the repo. Both implementations are present today; routing between them is a harness-level concern with active work-package effort. The honest framing is "two implementations exist in-repo" rather than "the migration is complete" — the latter would overstate what's grounded in tagged history.
- **The language core is verified through the self-hosted path.** The core type-system mechanisms ([Compile-Time Safety](/pillars/compile-time-safety/)) are checked end-to-end via the self-hosted compiler.
- **Codegen output is production-quality for current targets.** The most recent sub-version line closed the remaining mobile codegen emitter bugs (iOS Swift and Android Kotlin emitters reached zero open defects in their respective verification suites). If you are generating code into Arcana for these targets, the output is reliable.

The compiler runs in production, emits what it claims to emit, and verifies its output through `stage1=stage2` byte-identical comparison.

## What's in progress

**The verification-harness migration.** Bringing every codegen target through the self-hosted compiler with **equal rigor** — same per-target verification suite, same golden-file fixtures, same end-to-end check at every release — is a multi-sub-version migration phased across the current release line and successive releases. It will not complete inside the current minor line.

Honestly named: **the verification harness is currently a Rust toolchain.** A roughly 33,000-line Rust crate (`tests/verify-selfhost`) is the wasmtime-backed harness that runs the `stage1=stage2` byte-identical check and the WASM-GC execution checks Arcana relies on. The companion `tests/verify-exec` crate (~900 lines) is the wasmtime host for compiled WASM-GC modules, and a small cargo-fuzz crate fuzzes the string-table ABI. *That* is the "legacy infrastructure" the migration is moving away from — moving the harness logic into Arcana itself, run by the self-hosted compiler, is the journey work.

What this means concretely:

- For the WebAssembly target, the verification path is fully self-hosted from the *compiler* side. The *harness* that drives the check is still Rust.
- For mobile and other targets, parts of the verification harness still use legacy infrastructure as the migration proceeds. The *output* is checked; the *equal-verification path across targets* is what's being equalized, and the harness implementation language is moving from Rust to Arcana as part of that work.
- The migration is explicit and phased rather than ambient — every release has a published delta on which target moves a verification stage forward.

We're explicit about this so a reader doesn't infer that "journey" means "the codegen is unreliable." The codegen output is checked today; the verification *path* is what's still being made equal across targets.

## `@hermetic` determinism (an in-progress contract)

The `@hermetic` annotation marks a function as effect-bounded for the purposes of determinism — same inputs should produce same outputs, reproducible test runs, idempotent automation, safe retry.

Current state, precisely:

- **Checker enforcement is shipped.** A function annotated `@hermetic` is rejected by the compiler if its effect row includes any of the denied effects `{Network}`, `{FileSystem}`, `{Database}`, `{Process}` (per the D285a amendment to D285). The compile-time contract is real.
- **Codegen-level / emission-level determinism is deferred.** The lowering and emission stages do not yet produce a binary that *additionally* guarantees determinism beyond what the checker rejects. The contract is checker-enforced, not codegen-enforced.

The honest phrasing: `@hermetic` is a checker contract today. Read it as "the compiler refuses to compile a function that reaches denied effects," not as "this binary is guaranteed deterministic at the machine level."

## Why we frame this as a journey

Two reasons:

1. **It's true.** The migration is in flight, and progress will be tracked publicly once the Arcana repository publishes publicly alongside the v1.x complete release. Pretending otherwise would itself violate Arcana's marketing-claims discipline.
2. **The framing prevents a common misread.** "Self-hosted compiler" is a phrase with strong connotations (Rust, Zig — fully verified through the language's own toolchain end-to-end). Without the journey framing, a reader could over-infer that level of completion. With the journey framing, we name what's done (a lot, more than most languages at this stage) and what's not (the across-target verification-path equalization).

The reader who comes back in six months finds a project that delivered against its own stated timeline, not one that redefined what it had said.

## Where to look for the canonical state

- The verification suite — the canonical source of which targets have which verification stages migrated — publishes publicly alongside the v1.x complete release.
- [Honest Scope](/honest-scope/) carries the per-mechanism status — including this pillar's `@hermetic` checker-vs-codegen distinction — in one place.
- The decisions log (which names the specific decisions phasing the harness migration) publishes publicly alongside the v1.x complete release.

## What this pillar gives every other pillar

- **[Compile-Time Safety](/pillars/compile-time-safety/)** is implemented *in Arcana itself* — the compile-time guarantees are produced by a compiler that's subject to those same guarantees. The dogfooding is structural.
- **[Portable Runtime & Execution](/pillars/runtime/)** depends on the verified codegen output described here. That pillar's "the codegen works for current targets" is *grounded by* this pillar's "stage1=stage2 byte-identical verification."
- **[Governance & Honest Scope](/pillars/governance-honest-scope/)** is honest *because* of pages like this one. The journey framing here is what makes the project's trust mechanisms credible.
