---
# yaml-language-server: $schema=schemas/page.schema.json
Object type:
    - Page
Backlinks:
    - funcup-the-first-structured-feedback-loop-4-co.md
Creation date: "2026-03-25T21:05:00Z"
Created by:
    - Pa Koolig
Emoji: ✅
id: bafyreigiwlf3jaba2v6dg3szq45tqbmfad756kzb3ck2dhw4hx5l2sgazu
---
# 13 Tasks — 002-qr-coffee-platform (88 tasks)   
## Status   
Wygenerowane: 2026-03-25 \| Branch: `main` \| Constitution Check: **9/9 PASS**   
Source of truth: `.specify/features/002-qr-coffee-platform/tasks.md`   
 --- 
## Podsumowanie   
|      Faza |                     User Story |            Taski |
|:----------|:-------------------------------|:-----------------|
|   Phase 1 |               Setup (Monorepo) |   T001–T012 (12) |
|   Phase 2 |                   Foundational |   T013–T024 (12) |
|   Phase 3 |          US1 — QR Scan + Log 🎯 |   T025–T042 (18) |
|   Phase 4 |     US2 — Roaster Publishes QR |   T043–T053 (11) |
|   Phase 5 |   US3 — Coffee Hub + Discovery |   T054–T063 (10) |
|   Phase 6 |       US4 — Sensory Reputation |    T064–T068 (5) |
|   Phase 7 |          US5 — Offline Tasting |    T069–T074 (6) |
|   Phase 8 |        US6 — Roaster Analytics |    T075–T080 (6) |
|   Phase 9 |                         Polish |    T081–T088 (8) |
| **Total** |                                |     **88 tasks** |

 --- 
## MVP Scope (rekomendacja Spec Kit)   
Phases 1–3 only (T001–T042) — 42 tasks.   
Dostarcza north star flow end-to-end: consumer scans QR → Coffee Page → tasting log → journal.   
Demonstratable bez roaster web app (seed data wystarczy).   
 --- 
## Phase 1: Setup (T001–T012)   
- [ ] T001 Initialize pnpm workspaces monorepo   
- [ ] T002 Configure Turborepo   
- [ ] T003 [P] Initialize `apps/mobile` (Expo SDK 52)   
- [ ] T004 [P] Initialize `apps/web` (Next.js 15 App Router)   
- [ ] T005 [P] Initialize `packages/shared`   
- [ ] T006 Install Expo Router in `apps/mobile`   
- [ ] T007 [P] Install NativeWind 4 + Tailwind CSS 3 in mobile   
- [ ] T008 [P] Configure Tailwind CSS 3 + Framer Motion 11 in web   
- [ ] T009 [P] Configure ESLint + Prettier (no-explicit-any: error)   
- [ ] T010 [P] Install all mobile dependencies   
- [ ] T011 [P] Install all web dependencies   
- [ ] T012 [P] Create `.env.example` files   
 --- 
## Phase 2: Foundational (T013–T024)   
⚠️ CRITICAL: No user story work can begin until this phase is complete.   
- [ ] T013 Write `supabase/migrations/0001\_initial\_schema.sql` — 13 tables + enums   
- [ ] T014 Write `supabase/migrations/0002\_rls\_policies.sql` — RLS on all 13 tables   
- [ ] T015 Write `supabase/migrations/0003\_functions\_triggers.sql` — updated\_at, handle\_new\_user, recalculate\_user\_reputation, notify\_update\_coffee\_stats   
- [ ] T016 Write `supabase/seed.sql` — 36 flavor\_notes, 10 brew\_methods, test roaster + coffee + batch   
- [ ] T017 Apply migrations locally + generate TypeScript types   
- [ ] T018 [P] Enable pg\_net + configure Storage buckets   
- [ ] T019 [P] Create `packages/shared/src/services/supabaseClientFactory.ts`   
- [ ] T020 Create `apps/mobile/src/services/supabaseClient.ts`   
- [ ] T021 [P] Create Supabase server + browser clients for web   
- [ ] T022 [P] Create shared constants (flavorNotes, brewMethods, reputationThresholds)   
- [ ] T022b [P] Resolve follows architecture — `uuid[]` for MVP, junction table post-MVP   
- [ ] T023 Create `apps/mobile/src/app/\_layout.tsx` (root layout)   
- [ ] T024 [P] Create auth + tabs layouts (mobile + web)   
 --- 
## Phase 3: US1 — QR Scan + Tasting Log 🎯 (T025–T042)   
- [ ] T025 [P] Implement `supabase/functions/scan\_qr/index.ts` (p95 < 500ms)   
- [ ] T026 Implement `supabase/functions/update\_coffee\_stats/index.ts`   
- [ ] T027 [P] Create `apps/mobile/(auth)/login.tsx` (email + Google + Apple)   
- [ ] T028 [P] Create `apps/mobile/(auth)/register.tsx`   
- [ ] T029 Create `apps/mobile/(tabs)/hub/scan.tsx` (QR Scanner)   
- [ ] T030 Create `packages/shared/src/hooks/useCoffeePage.ts`   
- [ ] T031 Create `apps/mobile/coffee/[id]/index.tsx` (Coffee Page — 4 sections)   
- [ ] T032 [P] CoffeePageProduct.tsx   
- [ ] T033 [P] CoffeePageBrewing.tsx   
- [ ] T034 [P] CoffeePageStory.tsx   
- [ ] T035 [P] CoffeePageCommunity.tsx   
- [ ] T036 [P] FlavorNoteSelector.tsx   
- [ ] T037 [P] RatingInput.tsx   
- [ ] T038 [P] BrewMethodPicker.tsx   
- [ ] T039 Create `apps/mobile/coffee/[id]/log.tsx` (Tasting Log screen)   
- [ ] T040 Create `packages/shared/src/services/tastingService.ts`   
- [ ] T041 Create `apps/mobile/(tabs)/journal/index.tsx`   
- [ ] T042 Create `packages/shared/src/hooks/useJournal.ts`   
 --- 
## Phase 4: US2 — Roaster Publishes QR (T043–T053)   
- [ ] T043 Implement `supabase/functions/generate\_qr/index.ts`   
- [ ] T044 [P] `apps/web/app/(auth)/login/page.tsx`   
- [ ] T045 [P] `apps/web/app/(auth)/register/page.tsx`   
- [ ] T046 [P] `apps/web/app/(auth)/pending/page.tsx`   
- [ ] T047 `apps/web/app/dashboard/coffees/new/page.tsx`   
- [ ] T048 `apps/web/app/dashboard/coffees/[id]/page.tsx`   
- [ ] T049 `apps/web/app/dashboard/coffees/[id]/batches/new/page.tsx`   
- [ ] T050 `apps/web/app/dashboard/coffees/[id]/batches/[batchId]/page.tsx`   
- [ ] T051 `apps/web/app/dashboard/coffees/page.tsx` (coffee list)   
- [ ] T052 [P] QRDownloadButton component (PNG + SVG)   
- [ ] T053 [P] useRoasterCoffees + useCreateBatch hooks   
 --- 
## Phase 5: US3 — Coffee Hub + Discovery (T054–T063)   
- [ ] T054 `apps/mobile/(tabs)/hub/index.tsx` (Coffee Hub — 4 sections)   
- [ ] T054b [P] Scan Coffee visually dominant (min 40% screen, primary CTA per Founding Philosophy)   
- [ ] T055 [P] DiscoverCoffees tab component   
- [ ] T056 [P] DiscoverRoasters tab component   
- [ ] T057 RoasterProfile screen   
- [ ] T058 [P] useDiscoverCoffees hook   
- [ ] T059 [P] useDiscoverRoasters hook   
- [ ] T060 useFollowRoaster hook + follow action   
- [ ] T061 [P] LearnCoffee tab component   
- [ ] T062 LearnArticle screen   
- [ ] T063 MDX article content (3 seed articles)   
 --- 
## Phase 6: US4 — Sensory Reputation (T064–T068)   
- [ ] T064 Expose reputation level in user profile screen   
- [ ] T065 Expand flavor note selector per reputation level (silent)   
- [ ] T066 Expert label in Community section (subtle)   
- [ ] T067 Integration test: reputation advances silently   
- [ ] T068 Guard: no progress bar, no unlock message, no notification   
 --- 
## Phase 7: US5 — Offline Tasting (T069–T074)   
- [ ] T069 MMKV offline queue implementation   
- [ ] T070 NetInfo connectivity listener   
- [ ] T071 Offline-aware useCoffeePage (staleTime: Infinity)   
- [ ] T072 Sync on reconnect — flush queue to tastingService   
- [ ] T073 Conflict resolution (last-write-wins for ratings)   
- [ ] T074 Integration test: airplane mode → queue → sync within 30s   
 --- 
## Phase 8: US6 — Roaster Analytics (T075–T080)   
- [ ] T075 `apps/web/dashboard/analytics/[batchId]/page.tsx`   
- [ ] T076 AnalyticsSummary component (total tastings, avg rating, distribution)   
- [ ] T077 TopFlavorNotes component   
- [ ] T078 BrewMethodFilter component   
- [ ] T079 useRoasterAnalytics hook   
- [ ] T080 Integration test: 5 mock tastings → stats correct → filter works   
 --- 
## Phase 9: Polish (T081–T088)   
- [ ] T081 Error boundary + global error states (mobile)   
- [ ] T082 Loading skeletons for Coffee Page + Hub   
- [ ] T083 Empty states for Journal + Discovery   
- [ ] T084 Deep link handling (web: `/q/{hash}` → mobile: funcup://q/{hash})   
- [ ] T085 Accessibility audit (mobile + web)   
- [ ] T086 Performance audit (JS bundle size, image optimization)   
- [ ] T087 EAS Build configuration (production profile)   
- [ ] T088 Final QA checklist   
 --- 
## Independent Test Criteria per Story   
| Story |                                                                   Co weryfikować |
|:------|:---------------------------------------------------------------------------------|
|   US1 |                 Seeded QR → Coffee Page 4 sections → tasting log → journal entry |
|   US2 |         Web login → create coffee → create batch → QR downloaded → hash resolves |
|   US3 |               5 seeded coffees browsable, roaster profile + follow, MDX articles |
|   US4 |           Test account tastings advance level silently; Expert label w Community |
|   US5 |                   Airplane mode → cached page → tasting queued → sync within 30s |
|   US6 |                    5 mock tastings → stats displayed → brew method filter działa |

