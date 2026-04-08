# funcup — Project Log

Data aktualizacji: 2026-04-08

## Cel dokumentu

Ten log opisuje wykonane prace w repozytorium `funcup` od momentu startu projektu do obecnego stanu, z naciskiem na zgodność z roadmapą `13-tasks-002-qr-coffee-platform-88-tasks.md`.

## 1) Start projektu i baza architektoniczna

- Utworzono monorepo z podziałem na `apps/*` oraz `packages/*`.
- Utrzymano konfigurację Turborepo (`turbo.json`) jako mechanizm orkiestracji tasków.
- Zorganizowano strukturę dokumentacji produktowo-technicznej w `funcup-src-docs` oraz `specs`.

## 2) Audyt zgodności z source of truth (Phase 1–3)

- Przeprowadzono audyt stanu repo względem dokumentu:
  `funcup-src-docs/04-tasks/13-tasks-002-qr-coffee-platform-88-tasks.md`.
- Zweryfikowano rozbieżności dla zakresu MVP (T001–T042), z trybem oceny strict-paths.
- Potwierdzono, że część implementacji istniała funkcjonalnie, ale nie w ścieżkach wymaganych przez tasks.

## 3) Prace wyrównujące Phase 1 (T001–T012)

- Dodano `pnpm-workspace.yaml` i przełączono root `packageManager` na pnpm.
- Dostosowano reguły jakości:
  - uzupełniono ESLint o `@typescript-eslint/no-explicit-any: "error"`.
- Odtworzono wymagane aplikacje:
  - `apps/mobile` (Expo 52 + Expo Router),
  - `apps/web` (Next.js 15 App Router).
- Dodano konfiguracje stylowania:
  - mobile: NativeWind + Tailwind,
  - web: Tailwind + PostCSS + Framer Motion dependency.
- Dodano per-app `.env.example` dla mobile i web.

## 4) Prace wyrównujące Phase 2 (T013–T024)

- Uzupełniono brakujące migracje i seed:
  - `supabase/migrations/0003_functions_triggers.sql`,
  - `supabase/migrations/0004_pg_net_and_storage.sql`,
  - `supabase/seed.sql`.
- Dodano artefakt typów DB:
  - `supabase/types/database.ts`.
- Dodano warstwę shared:
  - `packages/shared/src/services/supabaseClientFactory.ts`,
  - constants: flavor notes, brew methods, reputation thresholds.
- Dodano klientów Supabase:
  - mobile: `apps/mobile/src/services/supabaseClient.ts`,
  - web: browser + server clients w `apps/web/src/lib/supabase/*`.
- Uzupełniono brakujące layouty wymagane przez zadania.

## 5) Prace wyrównujące Phase 3 (T025–T042)

- Dodano wymagane ścieżki edge functions:
  - `supabase/functions/scan_qr/index.ts`,
  - `supabase/functions/update_coffee_stats/index.ts`.
- Dodano shared hooks/services:
  - `packages/shared/src/hooks/useCoffeePage.ts`,
  - `packages/shared/src/hooks/useJournal.ts`,
  - `packages/shared/src/services/tastingService.ts`.
- Odtworzono wymagane ekrany i komponenty mobile zgodne z tasks paths:
  - auth (`login`, `register`),
  - scan,
  - coffee page + sekcje + komponenty logowania tastingu,
  - journal entry screen.

## 6) Stabilizacja instalacji zależności (pnpm)

### Problem

`pnpm install` kończył się błędami `EPERM` podczas wypakowywania paczek zawierających ukryte katalogi/plikowe artefakty (`.vscode`, `.claude`) w `node_modules`.

### Diagnoza i działania

- Potwierdzono, że środowisko miało restrykcje operacji na części ukrytych ścieżek.
- Zidentyfikowano problematyczne paczki tranzytywne:
  - `xmlbuilder@15.1.x` (zawiera `package/.vscode/launch.json`),
  - `resolve@2.0.0-next.6` (zawiera `package/.claude/settings.local.json`).
- Dodano obejścia w `package.json` (pnpm overrides):
  - `xmlbuilder` przypięty do `15.0.0`,
  - `resolve` przypięty do `1.22.10`.
- Utrzymano `.npmrc` z `package-import-method=copy` dla stabilniejszego importu pakietów.

### Efekt

- `pnpm install` kończy się sukcesem (exit code 0).
- Repo ma działający punkt wejścia do dalszego developmentu.

## 7) Artefakty zarządcze i jakościowe

- Dodano checklistę audytową:
  - `AUDIT_PHASE1_3_CHECKLIST.md` (PASS/FAIL per T001–T042, strict-paths).
- Dodano checklistę gotowości sprintu:
  - `DEFINITION_OF_READY_NEXT_SPRINT.md`.

## 8) Aktualny status projektu (na dziś)

- Projekt jest development-ready (możliwa kontynuacja prac sprintowych).
- Projekt nie jest jeszcze production-ready:
  - część ekranów/komponentów to placeholdery pod dalszą implementację,
  - wymagane są kolejne fazy (Phase 4+), testy integracyjne i hardening.

## 9) Rekomendowane kolejne kroki

1. Wejście w backlog Phase 4 (US2 — Roaster Publishes QR).
2. Domknięcie jakości:
   - `pnpm lint`,
   - `pnpm test`,
   - smoke test mobile + web.
3. Aktualizacja statusów w dokumentach tasks i audit checklist po każdym zamkniętym tasku.
4. Stopniowe zastępowanie placeholderów pełną logiką biznesową.

