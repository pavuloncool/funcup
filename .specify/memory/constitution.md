<!--
SYNC IMPACT REPORT
==================
Version change: (template) → 1.0.0
Modified principles: N/A (initial ratification from template)
Added sections:
  - Core Principles (I–VI)
  - Tech Stack & Platform Constraints
  - Development Workflow
  - Governance
Removed sections: N/A (template placeholders replaced)
Templates reviewed:
  - .specify/templates/plan-template.md       ✅ aligned — Constitution Check section present
  - .specify/templates/spec-template.md       ✅ aligned — no constitution-specific constraints needed
  - .specify/templates/tasks-template.md      ✅ aligned — phase structure compatible
  - .specify/templates/agent-file-template.md ✅ aligned — generic, no conflicts
  - .specify/templates/commands/              ✅ N/A — no commands directory found
Deferred TODOs: none
-->

# funcup Constitution

## Core Principles

### I. Mobile-First, Coffee-First

Every screen and interaction MUST be designed for a 375 px mobile viewport before
adapting to larger breakpoints. React Native (Expo) is the consumer product — used in coffee shops, stores, and homes.
Next.js is the roaster product — used by verified coffee roasters to manage product data
and read consumer feedback. Both share the same Supabase backend but serve entirely
different users.

Coffee domain language (origin, roast, tasting notes, brew method, rating) MUST be
consistent across all surfaces and components. No generic CRUD labels ("item", "entry",
"record") may appear in user-facing copy. Brand voice is warm, knowledgeable, and
sensory-rich.

**Rationale**: The app's identity is coffee. An interface that doesn't feel native to
coffee culture or that breaks on mobile undermines the core value proposition.

### II. Shared Data Contract

Supabase/PostgreSQL is the single source of truth for all data. All clients — Expo app
and Next.js web — MUST consume the same Supabase REST and Realtime APIs.

- Client-side data models MUST NOT contradict the DB schema.
- Supabase-generated TypeScript types (`supabase gen types typescript`) are the canonical
  entity definitions; hand-written duplicates are not permitted.
- Schema migrations MUST be versioned and checked into source control before any client
  code references a new column or table.

**Rationale**: Divergent data models between mobile and web create sync bugs that are
expensive to diagnose. One schema, one type source, two UIs.

### III. Dual-Product Architecture

funcup to dwa osobne produkty obsługiwane przez jeden backend:

- **iOS/Android (Expo)** — produkt konsumencki: skanowanie QR, ocenianie, odkrywanie
  kaw, historia tasting experience. Użytkownik korzysta wyłącznie na telefonie —
  w sklepie, w domu, w kawiarni.
- **Next.js web** — produkt dla palarni (roasters): zarządzanie danymi kaw,
  publikowanie produktów, odczyt feedbacku konsumentów. Roasters nigdy nie używają
  aplikacji mobilnej do zarządzania.

Obie powierzchnie współdzielą backend Supabase, ale ich UX, nawigacja i funkcje są
projektowane niezależnie. "Platform Parity" nie obowiązuje — funkcje nie muszą istnieć
na obu platformach jednocześnie.

Platform-specific code MUST be isolated: use `.native.tsx` / `.web.tsx` file extensions
or explicit `Platform.select()` calls. Shared business logic MUST live in
platform-agnostic modules (`/lib`, `/hooks`, `/services`).

**Rationale**: Rozdzielenie odbiorców na poziomie produktu eliminuje konflikty UX
i pozwala optymalizować każdą powierzchnię pod jej rzeczywistego użytkownika.

### IV. Offline-Aware UX

The Expo mobile app MUST degrade gracefully without a network connection:

- Discovery browsing of previously cached content MUST remain possible offline.
- Rating and note-taking inputs MUST queue locally and sync on reconnect.
- Optimistic updates are preferred over blocking loaders for all write operations.
- Sync conflicts MUST be resolved via server-side `updated_at` timestamps (last-write-wins
  for ratings; union for collections).

**Rationale**: Coffee shops often have spotty connectivity. An app that fails silently
or blocks on offline is not suitable for real-world café use.

### V. Animation with Intent

Framer Motion (web) and React Native Reanimated (mobile) animations MUST serve a
clear UX purpose: state feedback, spatial transition, or deliberate delight.

Rules:
- Every animation MUST complete in ≤ 400 ms or provide a skip/interrupt mechanism.
- Animations MUST target 60 fps on mid-range Android devices (Snapdragon 6xx class).
- Decorative animations MUST be suppressed when the OS `prefers-reduced-motion` setting
  is active.
- No animation library MUST be added solely for visual novelty; justify with UX need.

**Rationale**: The splash screen and brand experience set a high animation bar. Carrying
that quality through the app without impacting performance requires explicit constraints.

### VI. Type-Safe Across the Stack

TypeScript MUST be used in all new source files across Expo, Next.js, and any shared
packages. Existing JavaScript files MUST be migrated to TypeScript before a feature
that touches them is merged.

- `any` is banned except when wrapping a third-party library with no types; each
  exception MUST include an inline `// TODO: type this` comment.
- Strict mode (`"strict": true`) MUST be enabled in every `tsconfig.json`.
- API response shapes returned from Supabase MUST use generated types, not inline
  object literals.

**Rationale**: A cross-platform project with shared data models collapses quickly under
runtime type mismatches. TypeScript strictness is cheap insurance.

### VII. QR-First Interaction

Główna interakcja całej platformy to skanowanie QR kodu na opakowaniu kawy przez
aplikację mobilną. QR kod identyfikuje konkretną partię palenia (batch/lot)
i transformuje fizyczny produkt w cyfrowy obiekt w funcup.

Każda funkcja aplikacji mobilnej powinna być projektowana z perspektywy: "co dzieje
się przed, w trakcie i po skanowaniu?". Funkcje niezwiązane ze skanowaniem są
drugorzędne.

**Rationale**: QR scan to moment, w którym świat fizyczny łączy się z cyfrowym.
Ta interakcja definiuje markę i musi być traktowana jako punkt odniesienia dla
każdej decyzji projektowej w aplikacji mobilnej.

### VIII. Separation of Roles

Dane w systemie mają ściśle określone źródła:

- **Palarnie (roasters)** dostarczają dane produktowe: origin, farm, variety,
  processing, roast date, batch. Tylko zweryfikowane palarnie mogą tworzyć i edytować
  te pola.
- **Konsumenci** dostarczają dane sensoryczne: rating, tasting notes, brewing method,
  review. Konsumenci nie mogą modyfikować danych produktowych.
- **Platforma** agreguje i analizuje oba strumienie danych.

To rozdzielenie gwarantuje wiarygodność danych i jest nienaruszalne.

**Rationale**: Wiarygodność platformy opiera się na tym, że dane o kawie pochodzą od
jej twórcy, a dane smakowe — od rzeczywistych konsumentów. Mieszanie ról zniszczyłoby
zaufanie do obu.

### IX. Entry Interaction — Tap to Bean

Interakcja wejścia do aplikacji mobilnej jest zaprojektowana jako charakterystyczny gest
wizualny definiujący tożsamość marki. Składa się z dwóch etapów:

**MVP (zaimplementowane — NIE modyfikować):**
Biały ekran → pojawia się czarny odcisk palca → dotknięcie → konfetti → spod spodu
wyjeżdża ziarno kawy → ziarno rozpuszcza się w blur → wjeżdża główna strona aplikacji.
Ta animacja jest gotowa, zatwierdzona i stanowi obowiązujący splash screen MVP. Żaden
etap implementacji nie może jej modyfikować bez formalnej poprawki do constitution.

**Docelowa wizja (post-MVP):**
Użytkownik widzi ziarno kawy → dotknięcie → ziarno animuje się w odcisk palca → z punktu
dotyku wyrastają gałęzie drzewa kawowego → każda gałąź odsłania jeden obszar aplikacji.
Ta wersja zastąpi MVP po osiągnięciu stabilności produktu.

**Rationale**: Marka funcup definiuje się przez tę interakcję. Wersja MVP jest chroniona
przed przypadkowym nadpisaniem. Wersja docelowa jest kierunkiem rozwoju.

## Tech Stack & Platform Constraints

| Layer | Technology | Notes |
|-------|-----------|-------|
| Mobile | React Native (Expo SDK) | Managed workflow; EAS Build for distribution |
| Web | Next.js (App Router) | SSR for discovery/SEO; client components for interactive rating |
| Backend / DB | Supabase + PostgreSQL | Auth, Realtime, Storage, Edge Functions |
| Styling | Tailwind CSS (web) / NativeWind (mobile) | Shared token names where possible |
| Animation | Framer Motion (web) / Reanimated (mobile) | See Principle V |
| Language | TypeScript | See Principle VI |

Additional constraints:
- Supabase Row Level Security (RLS) MUST be enabled on all tables. No table MUST be
  publicly writable without RLS policies.
- Environment variables MUST follow the `NEXT_PUBLIC_` / `EXPO_PUBLIC_` prefix
  conventions; secrets MUST never be embedded in client bundles.
- Image assets for coffee content (photos, SVGs) MUST be served via Supabase Storage
  or a CDN, never bundled into the app binary.

## Development Workflow

- **Branching**: Feature branches off `main`; naming convention `###-feature-name`.
- **Spec-first**: Every non-trivial feature MUST have a spec (`/speckit.specify`) before
  implementation begins.
- **Constitution check**: Every implementation plan MUST include a Constitution Check
  gate verifying all six principles before Phase 0 research proceeds.
- **PR requirements**: PRs MUST include a platform parity note confirming the feature
  status on both Expo and Next.js (shipped / scheduled / N/A with justification).
- **Migrations**: Supabase migrations MUST be reviewed and applied to the dev branch
  before any client PR referencing that schema is merged.
- **No `console.log` in production**: Use a structured logger or remove debug output
  before merging to `main`.

## Governance

This constitution supersedes all informal conventions and takes precedence over any
conflicting guidance in individual spec or plan files.

**Amendment procedure**:
1. Open a PR with the proposed change to `.specify/memory/constitution.md`.
2. Bump `CONSTITUTION_VERSION` according to semantic rules (see header comment).
3. Update the Sync Impact Report comment at the top of this file.
4. Propagate changes to any affected templates under `.specify/templates/`.
5. PR description MUST explain the rationale and list impacted features.

**Versioning policy**:
- MAJOR: principle removal, redefinition, or backward-incompatible governance change.
- MINOR: new principle, section addition, or materially expanded guidance.
- PATCH: wording clarification, typo fix, non-semantic refinement.

**Compliance review**: Every sprint retrospective SHOULD include a brief check that
recent merged PRs adhered to all six principles. Violations MUST be logged as tech-debt
issues and addressed within two sprints.

**Version**: 1.3.0 | **Ratified**: 2026-03-25 | **Last Amended**: 2026-03-25
