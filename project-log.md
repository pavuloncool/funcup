# funcup - Project Log

Data aktualizacji: 2026-04-10

## Cel dokumentu

Ten log opisuje wykonane prace i status delivery w repozytorium `funcup`, z odniesieniem do roadmapy `funcup-src-docs/04-tasks/13-tasks-002-qr-coffee-platform-88-tasks.md`.

## 1) Fazy zakonczone i status

- Phase 001-003 (T001-T042): wykonane i zsynchronizowane z backlogiem.
- Phase 004 (US2, T043-T053): SIGN-OFF PASS.
- Phase 005 (US3, T054-T063): SIGN-OFF PASS.
- Phase 006 (US4, T064-T068): SIGN-OFF PASS.
- Phase 007 (US5, T069-T074): SIGN-OFF PASS.
- Phase 008 (US6, T075-T080): SIGN-OFF PASS.

## 2) Najwazniejsze rezultaty do konca Phase 008

- Roaster Analytics (US6):
  - RLS: `supabase/migrations/0004_roaster_analytics_rls.sql` (odczyt `coffee_logs` / `tasting_notes` dla wlasciciela batcha).
  - Logika czysta: `packages/shared/src/analytics/roasterBatchAnalytics.ts` (agregaty, top flavor notes, filtr brew method).
  - Hook: `packages/shared/src/hooks/useRoasterAnalytics.ts` (published stats vs widok filtrowany).
  - Web: `apps/web/app/dashboard/analytics/[batchId]/page.tsx` + komponenty `AnalyticsSummary`, `TopFlavorNotes`, `BrewMethodFilter` w `apps/web/src/components/analytics/`.
  - Testy: `packages/shared/src/analytics/roasterBatchAnalytics.test.ts` (T080: 5 mock tastings, filtr).
- Regresja US2 (web): funkcja `generate_qr` — `supabase/config.toml` sekcja `[functions.generate_qr] verify_jwt = false` (Kong nie odrzuca user JWT); testy Playwright z naglowkiem `apikey`; skrypt `apps/web/scripts/sync-supabase-env-local.sh` + dokumentacja `.env.local`.

## 3) Jakosc i testy (evidence Phase 008 sign-off)

- US6 quality gate (uruchomione w CI/sandbox bez Dockera: **PASS**):
  - `pnpm -C packages/shared test` -> PASS (19 testow, m.in. `roasterBatchAnalytics.test.ts`)
  - `pnpm -C packages/shared typecheck` -> PASS
  - `pnpm -C apps/mobile typecheck` -> PASS
- US2 regression gate (wymaga **lokalnego** Supabase na `127.0.0.1:54321` oraz `SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` w `apps/web/.env.local`):
  - `pnpm -C apps/web test:generate-qr` -> PASS (potwierdzone na stacku z Dockerem)
  - `pnpm -C apps/web test:e2e` -> PASS (j.w.)

## 4) Artefakty zarzadcze zaktualizowane w tej fazie

- `PHASE008_HANDOFF.md` (sign-off)
- `PHASE009_HANDOFF.md`
- `DEFINTION_OF_READY_PHASE009.md`
- `funcup-src-docs/04-tasks/13-tasks-002-qr-coffee-platform-88-tasks.md`
- `README.md`
- `project-log.md`

## 5) Status techniczny repo

- Repo jest gotowe do wejscia w **Phase 009 (Polish, T081-T088)**.
- Aplikacja web i mobile kompiluja sie; testy wymagajace Supabase uruchamiac przy wlaczonym `supabase start`.

## 6) Nastepne kroki

1. Wejscie w Phase 009 zgodnie z `PHASE009_HANDOFF.md` i `DEFINTION_OF_READY_PHASE009.md`.
2. Utrzymanie regresji US2 przed finalnym sign-off Polish.
3. Domkniecie `T081-T088` i aktualizacja backlogu oraz logu.
