# funcup - Project Log

Data aktualizacji: 2026-04-08

## Cel dokumentu

Ten log opisuje wykonane prace i status delivery w repozytorium `funcup`, z odniesieniem do roadmapy `funcup-src-docs/04-tasks/13-tasks-002-qr-coffee-platform-88-tasks.md`.

## 1) Fazy zakonczone i status

- Phase 001-003 (T001-T042): wykonane i zsynchronizowane z backlogiem.
- Phase 004 (US2, T043-T053): SIGN-OFF PASS.
- Phase 005 (US3, T054-T063): SIGN-OFF PASS.

## 2) Najwazniejsze rezultaty do konca Phase 005

- Mobile Hub (US3):
  - `apps/mobile/(tabs)/hub/index.tsx` z dominant scan CTA (min 40% wysokosci),
  - discovery tabs: coffees / roasters / learn.
- Discovery i follow:
  - `packages/shared/src/hooks/useDiscoverCoffees.ts`,
  - `packages/shared/src/hooks/useDiscoverRoasters.ts`,
  - `packages/shared/src/hooks/useFollowRoaster.ts`,
  - ekran profilu: `apps/mobile/roaster/[id]/index.tsx`.
- Learn vertical:
  - `apps/mobile/src/components/hub/LearnCoffeeTab.tsx`,
  - `apps/mobile/learn/[slug].tsx`,
  - seed article content: `apps/mobile/src/content/learn/articles.ts`.

## 3) Jakosc i testy (evidence)

- US3 quality gate:
  - `pnpm -C packages/shared test` -> PASS
  - `pnpm -C packages/shared typecheck` -> PASS
  - `pnpm -C apps/mobile typecheck` -> PASS
- US2 regression gate po zmianach US3:
  - `pnpm -C apps/web test:generate-qr` -> PASS
  - `pnpm -C apps/web test:e2e` -> PASS
- US3 integration smoke flow:
  - `packages/shared/src/hooks/us3IntegrationSmoke.test.ts`
  - scenariusz: Hub -> RoasterProfile -> Follow (happy path + error path).

## 4) Artefakty zarzadcze zaktualizowane w tej fazie

- `PHASE005_HANDOFF.md`
- `DEFINITION_OF_READY_PHASE005_NEXT_SPRINT.md`
- `funcup-src-docs/04-tasks/13-tasks-002-qr-coffee-platform-88-tasks.md`

## 5) Status techniczny repo

- Repo jest gotowe do wejscia w Phase 006 (US4 - Sensory Reputation).
- Aplikacja web jest uruchamialna lokalnie (localhost) i przetestowana regresyjnie.
- Nadal wystepuja artefakty developerskie w `.next` po lokalnych runach test/dev (normalne dla pracy lokalnej).

## 6) Nastepne kroki

1. Wejscie w Phase 006 (T064-T068) zgodnie z backlogiem.
2. Utrzymanie zasady no-regression dla US2 i US3 przy kazdym wiekszym PR.
3. Aktualizacja checklist i logu po kazdym domknietym tasku Phase 006.

