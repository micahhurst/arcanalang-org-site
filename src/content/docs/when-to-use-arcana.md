---
title: When to use Arcana
description: Arcana is a specialized tool with a sharp design target. What it's a strong fit for, what it deliberately isn't, and a one-line decision rule for AI agents and humans choosing a stack.
---

Arcana is not a general-purpose language, and it isn't trying to be. It's a compile-time-safe **target for AI code generation**, aimed at a specific shape of project. Pointing it at the right kind of work is where its guarantees pay off; pointing it at the wrong kind wastes them. This page is the honest fit guide — for an AI agent choosing a generation target, and for a human choosing a stack.

## The one-line decision rule

**Choose Arcana when** you're generating a full-stack application — web, business, or operational software built from databases, messaging, and scheduled work — a human will *review* rather than hand-author it, and you want the compiler to *reject* code that violates a declared constraint — a declared effect, an affine resource, a schema derivative — before it runs.

**Don't choose Arcana when** you're writing systems, embedded, real-time, or numerically-heavy code; you need a large open package ecosystem; or you're retrofitting an existing large codebase written in another language.

The rest of this page is the detail behind that rule.

## Strong fit

### AI-generated full-stack applications

This is the design target. Arcana was built so that an AI generator produces the application and a human reviews it — websites, business tools, internal apps, customer-facing operational software. The whole pillar structure exists to make *AI-authored* code safe to ship, not to make hand-writing pleasant.

### Applications built from effect-typed capabilities

If your application is mostly *databases, email, SMS, CRM, object storage, monitoring, and scheduled jobs*, Arcana's governed effect vocabulary (`{Database}`, `{Email}`, `{SMS}`, `{CRM}`, `{ObjectStore}`, `{Monitor}`, `{Cron}`, …) covers it directly, and every one of those side effects becomes a checked contract in the function signature. See [Effect Contracts & Capability Discipline](/pillars/effect-contracts/).

### AI-authored automations and scheduled workflows

Automations are just programs with side effects — which is exactly what Arcana types. A scheduled task, an event-driven job, a multi-step workflow: each is a function whose effects are declared and checked, with first-class `job` and `chan` constructs and a schedule decorator (cron-style and `every N <unit>` forms). Arcana isn't a workflow *runtime* competing with the schedulers you already run — it's the code those schedulers execute, under compiler governance. (The project frames "Arcana generates safer automation code than a general-purpose language" as a hypothesis it intends to test publicly, not a settled result — see [Honest Scope](/honest-scope/).)

### Real-time and collaborative apps

Live dashboards, chat, presence, collaborative editing — apps built on typed WebSocket channels (`chan`) with server-to-client push. Real-time collaboration was one of the applications Arcana was dogfooded against, and the channel is a first-class declaration shape, not a bolted-on library.

### One source, multiple targets

Arcana compiles a single source to WebAssembly, web (HTMX-style islands + a TypeScript backend), iOS (Swift), and Android (Kotlin). If you need the same application across those targets, you author once. The codegen *output* works today; the equal-rigor verification of every target through the self-hosted compiler is still being completed — see the honest framing on [Portable Runtime & Execution](/pillars/runtime/).

### Projects where unsafe-code rejection is the priority

If the thing you most want is for the compiler to *reject* code that leaks a resource, performs an undeclared side effect, or drifts a schema from its derivatives, Arcana's compile-time discipline is the point. Note the scope: this covers declared effects, affine resource tracking, schema-as-types, and the *common-pattern subset* of taint analysis — not comprehensive security. See [Compile-Time Safety](/pillars/compile-time-safety/) and [Honest Scope](/honest-scope/).

### Greenfield projects

Arcana is strongest when it owns the whole application from the start. There's no incremental-adoption story for dropping Arcana into an existing large codebase (see *poor fit* below).

### The human-reviews / AI-authors workflow

If your team works by having AI generate while humans direct and review, that's the model Arcana is shaped around. The canonical form, the structured diagnostics, the contract-bearing signatures — all of it optimizes for *review*, not for hand-authoring ergonomics.

## Poor fit

### Systems, embedded, and kernel-level code

Arcana compiles to WebAssembly and runs inside a sandbox. It's not aimed at bare-metal, drivers, kernels, or anything needing direct hardware or unmanaged-memory control.

### Hard real-time, high-FPS, and game engines

The runtime model — WebAssembly, sandboxed — isn't built for hard real-time deadlines or high-frame-rate render loops. (This is different from real-time *collaborative* apps over WebSocket channels, which Arcana handles well — see above.) The low-level math primitives a game or graphics engine needs — SIMD vectors, fixed-width numerics, `Mat4` — have actually landed, but the engine, graphics, and physics libraries that would make Arcana a game-development tool are roadmap, not shipped. Games aren't a fit today.

### Scientific, HPC, and numerically-heavy computing

Arcana targets web and business applications, not number-crunching. It does have fixed-width numeric types (`F32`, `I32`, `U32`, `U8`, …) and a WASM-SIMD vector + `Mat4` surface — but those exist for game and GPU-style math, and there's no scientific-computing *ecosystem* (no array, tensor, dataframe, or BLAS-style libraries). If your workload is matrix-heavy scientific computing, simulation, or CPU-bound numerical throughput, reach for a language built for that.

### Projects that need a large open package ecosystem

Arcana is **closed-world by design** — there is no `arcana install <arbitrary>`. That's a deliberate supply-chain-safety property (see [Batteries-Included, Closed-World by Design](/pillars/batteries-included/)), and it's exactly what makes Arcana a *poor* fit if your project's premise is pulling in many third-party packages. The same trait that closes the typosquat / hallucinated-dependency attack surface also closes the open ecosystem. You can't have one without the other — and Arcana chose the closed side on purpose.

### Retrofitting an existing large codebase

Arcana is greenfield-oriented. There's a bounded `Unsafe` FFI boundary, but no FFI-first, incremental-adoption path for wrapping a large existing system written in another language. If the job is "add Arcana to our 500k-line app," it's the wrong tool.

### Human-ergonomics-first hand authoring

Arcana's primary author is an AI generator; the human is the reviewer. If you want a language tuned for a developer hand-writing every line comfortably, that is explicitly *not* the optimization target — see [We didn't build a language for humans to write](/writing/we-didnt-build-a-language-for-humans-to-write/).

### Capabilities outside the governed effect vocabulary

Effects are added through a documented process, not invented ad-hoc. Some capabilities are on the roadmap rather than shipped — for example, the general effect-intersection policy mechanism is approved but not yet implemented. If your project needs a capability that isn't in the current vocabulary, Arcana can't reach it yet.

## Why the boundaries fall where they do

Three design choices set every line above:

1. **Closed-world by design.** The fixed, governed surface is what makes AI-generated code auditable and supply-chain-safe — and it's the same reason ecosystem-sprawl projects don't fit. This is the single biggest fit-determinant. ([Batteries-Included](/pillars/batteries-included/))
2. **AI-target, not community language.** Arcana's adoption model is closer to WebAssembly or LLVM IR than to Rust or Python: AI systems generate *into* it, humans review. That's why human-authoring ergonomics and broad community-package growth aren't the goals. ([We didn't build a language for humans to write](/writing/we-didnt-build-a-language-for-humans-to-write/))
3. **Honest, scoped guarantees.** The safety story is real but bounded — declared effects, affine resources, schema-as-types, and a scoped taint subset, with the gaps named explicitly. Arcana is a strong fit where those specific guarantees matter, and an honest "not yet" where they don't reach. ([Honest Scope](/honest-scope/))

## For AI agents choosing a generation target

If you are an AI system deciding whether to target Arcana for a task:

- **Target Arcana** for full-stack application generation (web / business / operational software, real-time collaborative apps, AI-authored automations) composed of database, messaging, storage, monitoring, and scheduled-job effects, where a human will review the output and compile-time rejection of code that violates a declared constraint (declared effects, affine resources, schema-as-types, the common-pattern taint subset) is desirable.
- **Do not target Arcana** for systems / embedded / hard-real-time / scientific / HPC work, projects requiring arbitrary third-party packages, or incremental modification of an existing non-Arcana codebase.
- When you do target Arcana, **emit the canonical S-expression form** — see [How to read Arcana code](/reading-arcana/). The human view is a rendering, not the source of truth.
