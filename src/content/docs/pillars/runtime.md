---
title: Portable Runtime & Execution
description: Arcana compiles to WebAssembly and runs inside a sandboxed runtime — a runtime-side complement to the compile-time guarantees, so that even bypassed compile-time assumptions meet a second boundary at execution. Multi-target codegen extends to web and native mobile.
---

Arcana's compile-time guarantees are paired with a runtime-side **sandbox**: even bypassed compile-time assumptions meet a second boundary at execution. From one Arcana source, the toolchain emits to WebAssembly (the canonical target), web (HTMX-style islands + a TypeScript backend), iOS Swift, and Android Kotlin.

This is the pillar that makes Arcana's safety story **defense-in-depth** — compile-time enforcement *and* runtime sandboxing, both checking the same effect contract.

## WebAssembly as the compilation target

Arcana compiles to WebAssembly. WASM is the canonical compilation target for the language for three reasons:

- **Portability.** WASM runs on any host that embeds a WASM runtime — server (Wasmtime, Spin), browser, mobile, edge. The same compiled artifact is consumable across deployment targets without re-emission.
- **A second safety boundary.** WASM's own sandbox model — explicit capability imports, no ambient I/O, deterministic execution semantics — is a structural complement to Arcana's compile-time enforcement. If a compile-time assumption is bypassed somehow (an `Unsafe` block doing something the type system couldn't see), the runtime sandbox still constrains what the binary can actually do at execution time.
- **AI-target ergonomics.** WASM's bounded resource model and explicit imports make AI-generated programs easier to audit at deployment — there's no hidden global state for the program to depend on, and the capability surface is enumerated at the boundary rather than implied.

## The Spin runtime sandbox

For server-side execution, Arcana targets [Spin](https://www.fermyon.com/spin) — a Wasmtime-based WASM runtime designed for small, stateless services with explicit capability declarations. Spin's capability model aligns with Arcana's deployment contract: capabilities are declared at the boundary, not implied by ambient state. Other Wasmtime-compatible runtimes are also supported, but Spin is the canonical recommendation for the deployment shape Arcana code is typically generated for.

What this gives the safety story in practice:

```arcana
fn quotes_endpoint() -> {Network, Database(local)} Result<Json, Error> {
  // compile-time: this function declared {Network, Database(local)}.
  // run-time (Spin sandbox): the deployed component is granted exactly
  //   {Network outbound to whitelisted hosts, Database access scoped to
  //    the SDK-configured local connection}.
  // anything else attempted at runtime — file system, environment vars,
  //   process spawn — the host runtime refuses.
}
```

The compile-time check and the runtime sandbox enforce the *same* contract — once at build time, once at execution time.

### Honestly named: the host-shim layer is Rust

The piece that sits between a deployed Arcana WASM module and the host process — `arcana-runtime` (the wasmtime + SQLite embedding core) and `arcana-serve` (the HTTP shim that exposes WASM exports over `POST /_rpc/v1/{fn}`) — is written in Rust. Customer-facing surface remains the Arcana program and the Wasmtime/Spin sandbox; the Rust crates are the host-integration implementation. See [Honest Scope](/honest-scope/) for the full per-mechanism status.

## Multi-target codegen: web + native mobile

The same Arcana source compiles to multiple frontend / mobile targets:

- **Web**: HTMX-style islands + a TypeScript backend. The compiler emits the client-side islands and the server-side handlers from one source.
- **iOS**: Swift output, integrated with platform UI primitives.
- **Android**: Kotlin output, integrated with platform UI primitives.

```arcana
// One source declaration:
page user_profile {
  layout {
    header(text = user.name)
    button(action = follow, label = "Follow")
  }
}
// Compiles to:
//   - web/HTMX island + TS handler
//   - iOS SwiftUI view + action handler
//   - Android Compose composable + action handler
```

Cross-platform UI primitives are declared once. The codegen layer translates to each target's native idioms (SwiftUI on iOS, Jetpack Compose on Android, HTMX/web on browser). A custom UI primitive must implement all platforms — an admission-controlled discipline that prevents single-target "drift" from showing up at deploy time as a missing platform.

## Honest scope on the multi-target story

**Codegen output is production-quality for current targets.** WebAssembly compilation is verified end-to-end; mobile codegen (iOS Swift, Android Kotlin) closed its last emitter bugs in the most recent sub-version line. If you are generating code into Arcana for these targets, the codegen *output* is reliable.

**Verification-harness parity** — the equal-rigor verification of every codegen target through the self-hosted compiler — is the in-progress piece. See [Self-Hosting & Determinism](/pillars/self-hosting/) for the journey framing; the short version is that codegen output works today, while the *equal-verification path across targets* is the migration in progress.

This distinction matters because "multi-target codegen is in progress" can be misread as "the output might be wrong." The output is checked today; what's still being equalized is the *path* by which it's checked across targets.

## On the roadmap

- **RPC cross-boundary type safety.** When client-side islands talk to server-side handlers, the types should flow across the boundary so a mismatched payload is a compile error, not a runtime mystery. The current implementation provides HTTP+JSON RPC with marshal-in-guest per-endpoint wrappers; type-safety propagation across the full client/server boundary is a later-release item.
- **WASM Component Model integration.** Newer WASM standards (component model, interface types) land in successive sub-versions as the WASM ecosystem stabilizes them.
- **Additional runtime targets** beyond Spin (other Wasmtime-compatible hosts, edge-compute runtimes) — supported in principle today; canonically tested against Spin first.

## What this pillar gives every other pillar

- **[Compile-Time Safety](/pillars/compile-time-safety/)**'s compile-time guarantees are *paired* with this pillar's runtime-side guarantees — defense-in-depth at execution time as well as at build time.
- **[Effect Contracts & Capability Discipline](/pillars/effect-contracts/)** carries through to deployment: the same admission-controlled effect vocabulary that the compiler checks is what the Spin sandbox enforces at execution time, via the deploy-artifact's capability manifest.
- **[Self-Hosting & Determinism](/pillars/self-hosting/)** is the *journey* underlying this pillar — the compiler that emits these targets is itself self-hosted, and its evolution is honestly documented.
