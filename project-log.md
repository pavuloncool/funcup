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
- Phase 009 (Polish, T081-T088): SIGN-OFF PASS.

## 2) Najwazniejsze rezultaty do konca Phase 009 (Polish)

- Mobile: `RootErrorBoundary`, stany loading (skeleton), empty/error (Journal, Hub discovery, Learn), Coffee Page oparta o `useCoffeePage` / `scan_qr`, deep link `apps/mobile/q/[hash].tsx` (par z web `/q/{hash}`), `eas.json` (profil production), Android intent filter dla `funcup` / host `q`.
- Shared: typ `ScanQrResponse`; discovery (`fetchDiscoverCoffees`) przez `qr_codes` + hash do skanera; tasting log przyjmuje `batchId` z batcha z `scan_qr`.
- Web: `next.config.ts` — `images.remotePatterns` dla Supabase storage; `/q/[hash]` — `role="alert"` / `role="status"` (a11y).
- Regresja US2 i build: patrz sekcja 3 ponizej.

## 3) Jakosc i testy (evidence Phase 009 sign-off, 2026-04-10)

- Quality gate (monorepo): **PASS**
  - `pnpm -C packages/shared test` -> PASS (19 testow)
  - `pnpm -C packages/shared typecheck` -> PASS
  - `pnpm -C apps/mobile typecheck` -> PASS
- US2 regression (wymaga lokalnego Supabase dla funkcji Edge oraz `.env.local` w `apps/web` dla testow API):
  - `pnpm -C apps/web test:generate-qr` -> PASS
  - `pnpm -C apps/web test:e2e` -> PASS przy `WEB_BASE_URL=http://127.0.0.1:3000` i procesie `next dev -p 3000` (scenariusz dashboardu nie laczy sie, jesli serwer nie slucha na tym adresie)
- Hardening / baseline wydajnosci web: `pnpm -C apps/web build` -> PASS

## 4) Artefakty zarzadcze zaktualizowane w tej fazie

- `PHASE009_HANDOFF.md` (sign-off sekcja 11)
- `DEFINTION_OF_READY_PHASE009.md`
- `funcup-src-docs/04-tasks/13-tasks-002-qr-coffee-platform-88-tasks.md`
- `README.md`
- `project-log.md`

## 5) Status techniczny repo

- MVP roadmap (88 taskow, US1-US6 + Polish): **zamkniety** — Phase 009 ma formalny SIGN-OFF PASS.
- Testy Playwright wymagajace UI web: uruchamiac z dzialajacym `next dev` na porcie zgodnym z `WEB_BASE_URL`.
- Kolejne release’y: konfiguracja EAS (`eas build --profile production`), ewentualne universal links / domena produkcyjna.

## 6) Nastepne kroki (propozycja)

1. Pierwszy production build mobile: `eas build --profile production` (po `eas login` / powiazaniu projektu).
2. Utrzymywanie regresji US2 przy zmianach web i Edge Functions.
3. Rozszerzenia poza MVP wedlug backlogu produktowego.
