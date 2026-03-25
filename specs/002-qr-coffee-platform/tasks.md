# Tasks: funcup — QR-Driven Specialty Coffee Discovery Platform

**Input**: Design documents from `/specs/002-qr-coffee-platform/`
**Branch**: `002-qr-coffee-platform`
**Prerequisites**: plan.md ✅ spec.md ✅ research.md ✅ data-model.md ✅ contracts/ ✅ quickstart.md ✅

**Tests**: Not requested — no test tasks generated.

**Organization**: Tasks grouped by user story (US1–US6) to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no blocking dependency)
- **[Story]**: Which user story this task belongs to (US1–US6 per spec.md)
- No story label = Setup or Foundational phase task

## Path Conventions (from plan.md)

```
apps/mobile/src/          — Expo consumer app
apps/web/                 — Next.js roaster web app
packages/shared/src/      — Shared types, hooks, services, constants
supabase/migrations/      — Versioned SQL migrations
supabase/functions/       — Edge Functions (Deno runtime)
supabase/seed.sql         — Taxonomy + test fixture data
```

---

## Phase 1: Setup (Monorepo Infrastructure)

**Purpose**: Initialize the Turborepo monorepo and all three packages from scratch.

- [ ] T001 Initialize pnpm workspaces monorepo — create `pnpm-workspace.yaml` (packages: apps/*, packages/*), root `package.json`, `.npmrc` (shamefully-hoist=true) at repo root
- [ ] T002 Configure Turborepo — create `turbo.json` at repo root with pipeline: build (dependsOn: ^build), typecheck (dependsOn: ^typecheck), lint, dev (cache: false, persistent: true)
- [ ] T003 [P] Initialize `apps/mobile` — bootstrap Expo SDK 52 managed workflow with TypeScript template; configure `apps/mobile/app.json` with name "funcup", slug "funcup", scheme "funcup", Universal Links intentFilters for `https://funcup.app/q/*` per contracts/qr-url-contract.md
- [ ] T004 [P] Initialize `apps/web` — bootstrap Next.js 15 App Router with TypeScript strict (`npx create-next-app apps/web --typescript --app --tailwind`); verify `"strict": true` in `apps/web/tsconfig.json`
- [ ] T005 [P] Initialize `packages/shared` — create `packages/shared/package.json` (name: @funcup/shared), `packages/shared/tsconfig.json` with `"strict": true`, and directory structure: `src/types/`, `src/services/`, `src/hooks/`, `src/constants/`
- [ ] T006 Install Expo Router in `apps/mobile` — add `expo-router` package; set `main: "expo-router/entry"` in `apps/mobile/package.json`; configure Metro bundler for monorepo in `apps/mobile/metro.config.js`
- [ ] T007 [P] Install and configure NativeWind 4 + Tailwind CSS 3 in `apps/mobile` — `apps/mobile/tailwind.config.js`, `apps/mobile/babel.config.js` (NativeWind babel plugin), `apps/mobile/global.css`
- [ ] T008 [P] Configure Tailwind CSS 3 in `apps/web` — verify `apps/web/tailwind.config.ts` content paths include `app/**`, `components/**`; configure Framer Motion 11 install
- [ ] T009 [P] Configure ESLint + Prettier with `typescript-eslint` (no `any` rule: `@typescript-eslint/no-explicit-any: error`) in all three packages; shared `.eslintrc.json` + `.prettierrc` at repo root
- [ ] T010 [P] Install all mobile dependencies in `apps/mobile`: `@supabase/supabase-js`, `expo-secure-store`, `expo-auth-session`, `expo-apple-authentication`, `expo-linking`, `@react-native-community/netinfo`, `react-native-mmkv`, `react-native-reanimated@3`, `@tanstack/react-query@5`, `expo-camera`, `expo-image`, `@expo/mdx`
- [ ] T011 [P] Install all web dependencies in `apps/web`: `@supabase/supabase-js`, `@supabase/ssr`, `framer-motion@11`, `@tanstack/react-query@5`, `next/image` (built-in); install `qrcode` + `resvg-js` as devDependencies (Edge Function deps, bundled separately)
- [ ] T012 [P] Create `.env.example` files — `apps/mobile/.env.example` (`EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`), `apps/web/.env.example` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` with comment: server-side only, never expose to client)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: DB schema, RLS, triggers, TypeScript types, Supabase clients, app navigation shells. Must be complete before any user story.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T013 Write `supabase/migrations/0001_initial_schema.sql` — CREATE TYPE enums: `sensory_level ('beginner','advanced','expert')`, `coffee_status ('draft','active','archived')`, `batch_status ('active','archived')`, `processing_method ('washed','natural','honey','anaerobic','wet-hulled','other')`, `verification_status ('pending','verified','revoked')`; CREATE TABLE for all 13 tables (users, roasters, origins, coffees, roast_batches, qr_codes, coffee_logs, tasting_notes, reviews, review_votes, brew_methods, flavor_notes, coffee_stats) with exact column types, CHECK constraints, FOREIGN KEYS, DEFAULT values per `specs/002-qr-coffee-platform/data-model.md`
- [ ] T014 Write `supabase/migrations/0002_rls_policies.sql` — ALTER TABLE ... ENABLE ROW LEVEL SECURITY on all 13 tables; implement every policy listed in `specs/002-qr-coffee-platform/contracts/rls-policies.md` (SELECT/INSERT/UPDATE/DELETE per table); configure Storage bucket policies for roasters/, coffees/, users/, qr/ buckets
- [ ] T015 Write `supabase/migrations/0003_functions_triggers.sql` — (a) `set_updated_at()` function + BEFORE UPDATE trigger on every table with `updated_at`; (b) `handle_new_user()` function + AFTER INSERT ON `auth.users` trigger to INSERT row into `public.users`; (c) `recalculate_user_reputation(user_id uuid)` stub function that reads coffee_logs+tasting_notes+reviews for user, computes score (1pt/tasting, +2 if ≥3 flavor tags, +1 if review ≥50 chars, +10 per vocabulary milestone at 10/20/30 unique tags), updates `users.sensory_level` — levels: beginner 0–29, advanced 30–99, expert 100+; (d) `notify_update_coffee_stats()` function + AFTER INSERT ON `coffee_logs` trigger calling `pg_net.http_post` to `update_coffee_stats` Edge Function URL with `{batch_id, user_id}` per `contracts/edge-function-update-coffee-stats.md`
- [ ] T016 Write `supabase/seed.sql` — INSERT 36 `flavor_notes` rows (name, label, category, sort_order) from `packages/shared/src/constants/flavorNotes.ts` taxonomy (6 categories: fruity/floral/sweet/nutty/spice/savory); INSERT 10 `brew_methods` (V60, AeroPress, Espresso, French Press, Chemex, Moka Pot, Cold Brew, Siphon, Pour Over, Other); INSERT test roaster (Kochere Roasters, verified) + origin + coffee (Kochere Natural, active) + roast_batch (Lot KN-001) for US1 independent test
- [ ] T017 Apply migrations locally — run `supabase start`, `supabase db push`, `supabase db seed`; generate TypeScript types: `supabase gen types typescript --local > packages/shared/src/types/database.types.ts`; verify types file is non-empty and all 13 tables are present
- [ ] T018 [P] Enable `pg_net` extension — add `CREATE EXTENSION IF NOT EXISTS pg_net;` to `supabase/migrations/0001_initial_schema.sql` (top of file, before CREATE TABLE); configure Supabase Storage buckets in Supabase dashboard or via `supabase/migrations/0004_storage_buckets.sql`
- [ ] T019 [P] Create `packages/shared/src/services/supabaseClientFactory.ts` — generic `createSupabaseClient(url, anonKey, storage?)` factory returning typed `SupabaseClient<Database>` using generated types from `database.types.ts`
- [ ] T020 Create `apps/mobile/src/services/supabaseClient.ts` — instantiate Supabase client via factory with `expo-secure-store` as session AsyncStorage adapter; export typed singleton
- [ ] T021 [P] Create `apps/web/lib/supabase/server.ts` (`createServerClient` using `@supabase/ssr` with Next.js `cookies()`) + `apps/web/lib/supabase/client.ts` (`createBrowserClient`); both typed with `Database` from packages/shared
- [ ] T022 [P] Create shared constants — `packages/shared/src/constants/flavorNotes.ts` (36 tags with id slug, label, category), `packages/shared/src/constants/brewMethods.ts` (10 brew methods), `packages/shared/src/constants/reputationThresholds.ts` (scoring rules + level thresholds per research.md §4)
- [ ] T022b [P] Resolve follows architecture — `users.following_roaster_ids uuid[]` column is used for MVP (no junction table); add to migration T013 as `following_roaster_ids uuid[] NOT NULL DEFAULT '{}'`; post-MVP: migrate to junction table `user_roaster_follows(user_id, roaster_id, followed_at)`; document decision in `specs/002-qr-coffee-platform/research.md` under §11
- [ ] T023 Create `apps/mobile/src/app/_layout.tsx` — root Expo Router layout: `SafeAreaProvider`, `QueryClientProvider` (TanStack Query v5 with 5-min staleTime default), Supabase `SessionContextProvider`; define slot routing for `(auth)` + `(tabs)` groups; redirect unauthenticated users from `(tabs)` to `/(auth)/login`
- [ ] T024 [P] Create `apps/mobile/src/app/(auth)/_layout.tsx` (redirect to `/(tabs)/hub` if session exists) + `apps/mobile/src/app/(tabs)/_layout.tsx` (bottom tab navigator: Hub icon → `hub/`, Journal icon → `journal/`, Profile icon → `profile/`); create `apps/web/app/layout.tsx` (root with SessionProvider + QueryClientProvider) + `apps/web/app/(auth)/layout.tsx` + `apps/web/app/dashboard/layout.tsx` (redirect to login if no session, check verified roaster status)

**Checkpoint**: Migrations applied, types generated, Supabase clients initialized, nav shells in place — user story implementation can begin.

---

## Phase 3: User Story 1 — Consumer Scans QR and Logs a Tasting (Priority: P1) 🎯 MVP

**Goal**: Full flow from QR scan → Coffee Page → tasting log → journal entry.

**Independent Test**: Seed data (T016) provides one verified roaster + active coffee + batch. Consumer creates account, scans test QR, verifies Coffee Page loads with all 4 sections, logs a tasting with rating + flavor notes + brew method + optional review, confirms entry appears in Journal.

- [ ] T025 [P] [US1] Implement `supabase/functions/scan_qr/index.ts` — parse `{ hash: string }` from request body; join `qr_codes → roast_batches → coffees → origins + roasters`, LEFT JOIN `coffee_stats`; return full typed payload per `contracts/edge-function-scan-qr.md`; handle 404 (hash not in `qr_codes`), 400 (invalid UUID), 200+archived (`batch.status='archived'`); use service role client for read (public data); p95 target < 500 ms
- [ ] T026 [US1] Implement `supabase/functions/update_coffee_stats/index.ts` — verify service role Authorization header; run aggregation SQL (COUNT, AVG, rating distribution JSONB, top 10 flavor notes by frequency) against `coffee_logs + tasting_notes + flavor_notes` for `batch_id`; UPSERT `coffee_stats` row; call `recalculate_user_reputation(user_id)` DB function; return typed response per `contracts/edge-function-update-coffee-stats.md`
- [ ] T027 [P] [US1] Create `apps/mobile/src/app/(auth)/login.tsx` — email/password `supabase.auth.signInWithPassword()` form; "Continue with Google" button using `expo-auth-session` PKCE flow with Supabase Google provider; "Continue with Apple" button using `expo-apple-authentication` → `supabase.auth.signInWithIdToken({ provider: 'apple' })`; on success navigate to `/(tabs)/hub`
- [ ] T028 [P] [US1] Create `apps/mobile/src/app/(auth)/register.tsx` — display_name + email + password form; same OAuth buttons as login; on success: creates auth account, `handle_new_user` trigger auto-creates `users` row, navigate to `/(tabs)/hub`
- [ ] T029 [US1] Create `apps/mobile/src/app/(tabs)/hub/scan.tsx` (QR Scanner screen) — `expo-camera` with `useCameraPermissions`; `Camera` component with `barCodeScannerSettings={{ barCodeTypes: ['qr'] }}`; `onBarcodeScanned` extracts `{qr_hash}` from URL `https://funcup.app/q/{hash}`; calls `scan_qr` Edge Function; on success navigate to `/coffee/[coffee_id]` with `batchId` param; show error state for `not_found` (US-1 AC-5) + `invalid_hash`
- [ ] T030 [US1] Create `packages/shared/src/hooks/useCoffeePage.ts` — TanStack Query `useQuery` keyed by `batchId`; calls `scan_qr` Edge Function via `supabaseClient.functions.invoke('scan_qr', { body: { hash } })`; maps response to `CoffeePageViewModel` type; `staleTime: Infinity`, `gcTime: 7 * 24 * 60 * 60 * 1000` for offline cache (used in US5)
- [ ] T031 [US1] Create `apps/mobile/src/app/coffee/[id]/index.tsx` (Coffee Page) — four-section layout: Product, Brewing, Story, Community tabs or vertical scroll sections; renders `CoffeePageProduct`, `CoffeePageBrewing`, `CoffeePageStory`, `CoffeePageCommunity` components; "Log Tasting" CTA at bottom (requires auth — redirect to login if unauthenticated, per FR-011); show archived notice banner if `response.archived === true` (US-1 AC-3)
- [ ] T032 [P] [US1] Create `apps/mobile/src/components/coffee/CoffeePageProduct.tsx` — renders: coffee name, origin country/region/farm, variety, processing method, altitude range (m), roast date formatted, lot number; all in coffee domain language (no generic labels), NativeWind styles
- [ ] T033 [P] [US1] Create `apps/mobile/src/components/coffee/CoffeePageBrewing.tsx` — renders roaster's `brewing_notes` in formatted markdown-like view; empty state if null
- [ ] T034 [P] [US1] Create `apps/mobile/src/components/coffee/CoffeePageStory.tsx` — renders `roaster_story` text + roaster name, city, country, logo (via `expo-image` from Supabase Storage URL); empty state if null
- [ ] T035 [P] [US1] Create `apps/mobile/src/components/coffee/CoffeePageCommunity.tsx` — shows `coffee_stats` (avg rating, total count, top flavor note tags); lists reviews from `coffee_logs` for this batch (query: `reviews JOIN coffee_logs JOIN users` — show only `review.body` + `user.sensory_level` label, NO username/avatar per FR-018); sorted by sensory_level (Expert first)
- [ ] T036 [P] [US1] Create `apps/mobile/src/components/tasting/FlavorNoteSelector.tsx` — renders 36 flavor note tags from `flavorNotes` constants, grouped by 6 categories in horizontal scroll rows; multi-select toggle with active/inactive visual state (NativeWind); `onChange(selectedIds: string[])` callback
- [ ] T037 [P] [US1] Create `apps/mobile/src/components/tasting/RatingInput.tsx` — 1–5 interactive selector (coffee cup or star icons); Reanimated `withSpring` scale animation on selection ≤ 400ms; `onChange(rating: 1|2|3|4|5)` callback
- [ ] T038 [P] [US1] Create `apps/mobile/src/components/tasting/BrewMethodPicker.tsx` — horizontal scroll list of brew methods from `brewMethods` constants; single-select; `onChange(brewMethodId: string)` callback
- [ ] T039 [US1] Create `apps/mobile/src/app/coffee/[id]/log.tsx` (Tasting Log Form screen) — assembles `RatingInput` + `FlavorNoteSelector` (required: at least 1 tag) + `BrewMethodPicker` (required) + optional brew time `TextInput` (seconds) + optional review `TextInput` (multiline, max 2000 chars); validates before submit; calls `useTastingLog` mutation; on success navigate back to `coffee/[id]` with success toast; form is scroll-safe on small screens
- [ ] T040 [US1] Create `packages/shared/src/hooks/useTastingLog.ts` — TanStack Query `useMutation`; on mutate: (1) INSERT `coffee_logs` row, (2) batch INSERT `tasting_notes` rows (one per selected `flavor_note_id`), (3) optional INSERT `reviews` row if review text present; returns `{ isPending, isOffline, error }`; on network error: defers to offline queue (wired in US5/T070)
- [ ] T041 [US1] Create `apps/mobile/src/app/(tabs)/journal/index.tsx` (Journal screen) — authenticated-only; lists user's `coffee_logs` with JOIN on `roast_batches + coffees + tasting_notes + brew_methods`; sorted by `logged_at DESC`; shows coffee name, roaster, rating, brew method, flavor note chips; filter controls (rating 1–5, brew method); "pending sync" badge on entries where `synced_at IS NULL` (populated in US5); tap entry to view detail
- [ ] T042 [US1] Create `packages/shared/src/hooks/useJournal.ts` — TanStack Query `useQuery` for authenticated user's `coffee_logs` with full joins; accepts `{ ratingFilter?: number, brewMethodId?: string }` params; invalidated after `useTastingLog` mutation succeeds

**Checkpoint**: US1 fully functional — QR scan → Coffee Page (4 sections) → tasting log → journal. Independently testable with seeded data.

---

## Phase 4: User Story 2 — Roaster Publishes a Coffee and Generates a Batch QR (Priority: P2)

**Goal**: Verified roaster creates coffee → creates batch → downloads PNG + SVG QR. Roaster auth + verification flow included.

**Independent Test**: Log in as test roaster (seeded, verified). Create a new coffee with all required fields. Create a batch. Verify QR is generated and PNG/SVG download links appear. Confirm `https://funcup.app/q/{hash}` resolves to the correct coffee page.

- [ ] T043 [US2] Implement `supabase/functions/generate_qr/index.ts` — verify JWT (`auth.uid()`) + validate roaster ownership via SQL join (`roast_batches → coffees → roasters WHERE roasters.user_id = auth.uid()`) + check `verification_status = 'verified'`; generate UUID v4 hash via `crypto.randomUUID()`; generate SVG with `qrcode` npm pkg (error correction H, 4-module quiet zone, URL = `https://funcup.app/q/{hash}`); rasterize to PNG 1024×1024 via `resvg-js` WASM; upload both to Supabase Storage `qr/{batch_id}/qr.svg` + `qr/{batch_id}/qr.png`; INSERT `qr_codes` row; return signed URLs (1h expiry) per `contracts/edge-function-generate-qr.md`; idempotent: if QR exists, return existing with fresh signed URLs
- [ ] T044 [P] [US2] Create `apps/web/app/(auth)/login/page.tsx` — email/password sign in + "Continue with Google" OAuth (Supabase Auth Google provider redirect); redirect to `/dashboard` on session; client component
- [ ] T045 [P] [US2] Create `apps/web/app/(auth)/register/page.tsx` — roaster registration: display name, business name (roasters.name), country, city, website; on submit: creates Supabase auth account + INSERT `roasters` row (`verification_status: 'pending'`); redirect to `/pending`
- [ ] T046 [P] [US2] Create `apps/web/app/(auth)/pending/page.tsx` — "Awaiting verification" static page explaining manual review process; polls `roasters.verification_status` every 10 s via `useEffect` + Supabase `realtime` subscription; auto-redirects to `/dashboard` when status becomes `'verified'`
- [ ] T047 [US2] Create `apps/web/app/dashboard/page.tsx` — authenticated roaster overview: total active coffees count, total batches, most recent batch with QR status; quick-action links to `/coffees` + `/analytics`; server component with `createServerClient`
- [ ] T048 [US2] Create `apps/web/app/coffees/page.tsx` — list of roaster's coffees (all statuses) with name, origin country, processing method, status badge; "New Coffee" button → `/coffees/new`; "Edit" + "Archive" actions per row; empty state with onboarding guidance
- [ ] T049 [US2] Create `apps/web/app/coffees/new/page.tsx` + `apps/web/app/coffees/[id]/edit/page.tsx` — unified coffee form (client component): name (required), origin country/region/farm/altitude min/max/producer (creates/updates `origins` row), variety, processing_method (select), producer_notes (textarea), cover image upload to Supabase Storage `coffees/{id}/cover.jpg`; "Save as Draft" + "Publish" (publish validates all required fields + sets `status='active'`); uses Supabase server actions (Next.js) for INSERT/UPDATE
- [ ] T050 [US2] Create `apps/web/app/batches/[coffeeId]/page.tsx` — list of batches for a coffee with roast_date, lot_number, status, "QR Ready" / "Generate QR" indicator; "New Batch" button; link to analytics per batch
- [ ] T051 [US2] Create `apps/web/app/batches/[coffeeId]/new/page.tsx` — batch creation form: roast_date (date picker), lot_number (text), brewing_notes (textarea), roaster_story (textarea); on submit: INSERT `roast_batches` → call `generate_qr` Edge Function → on success render `QRDownloadButton` with signed URLs; error handling for non-verified roaster
- [ ] T052 [P] [US2] Create `apps/web/components/QRDownloadButton.tsx` — receives `svgSignedUrl` + `pngSignedUrl` props; renders "Download SVG" + "Download PNG" `<a download>` links; on click calls `generate_qr` again (idempotent) to get fresh signed URLs if current ones are near expiry (check `generatedAt` + 55 min threshold); Framer Motion fade-in on appear
- [ ] T053 [US2] Create `packages/shared/src/hooks/useRoasterCoffees.ts` + `packages/shared/src/hooks/useRoasterBatches.ts` — TanStack Query hooks for roaster's coffees list + batches list per coffeeId; invalidate on mutation (create/edit/archive)

**Checkpoint**: Verified roaster can publish a coffee and download a printable QR code. QR resolves via scan_qr Edge Function. US1 + US2 independently functional.

---

## Phase 5: User Story 3 — Coffee Hub and Discovery (Priority: P3)

**Goal**: Consumer browses Coffee Hub (Scan CTA + Discover Coffees + Discover Roasters + Learn Coffee), follows a roaster.

**Independent Test**: Seeded DB with 5 active coffees from 3 verified roasters. Browse Discover Coffees (sorted by newest/most-rated), browse Discover Roasters, view a roaster profile, tap Follow, browse Learn Coffee articles — no QR scan required.

- [ ] T054 [US3] Create `apps/mobile/src/app/(tabs)/hub/index.tsx` (Coffee Hub screen) — four sections rendered vertically: (1) Scan Coffee — large CTA button (visually dominant per FR-006) with coffee-bean icon → navigates to `hub/scan`; (2) DiscoverCoffees component; (3) DiscoverRoasters component; (4) LearnCoffee component; scroll-based layout
- [ ] T054b [P] [US3] Make "Scan Coffee" visually dominant in Coffee Hub — in `apps/mobile/src/app/(tabs)/hub/index.tsx`, the Scan Coffee button/card MUST occupy the top 40% of the screen minimum, use primary brand color, and be the first interactive element per FR-006 and Founding Philosophy ("every feature exists to serve one purpose: to log an unrepeatable coffee experience")
- [ ] T055 [P] [US3] Create `apps/mobile/src/components/hub/DiscoverCoffees.tsx` — horizontal or vertical list of active coffees using `useDiscoverCoffees` hook; each card: coffee name, roaster name, origin country, avg_rating (from `coffee_stats`), cover image; sort toggle (Newest / Most Rated); tap navigates to `/coffee/[id]` (passing `latestBatchId`)
- [ ] T056 [P] [US3] Create `apps/mobile/src/components/hub/DiscoverRoasters.tsx` — list of verified roasters using `useDiscoverRoasters` hook; each card: roaster name, city, country, logo; tap navigates to `/roaster/[id]`
- [ ] T057 [US3] Create `apps/mobile/src/app/roaster/[id]/index.tsx` (Roaster Profile screen) — roaster name, city, country, description, logo; list of their active coffees (tapping goes to coffee page); Follow/Unfollow button wired to `useFollowRoaster`; follower count NOT shown (no social count in MVP)
- [ ] T058 [P] [US3] Create `packages/shared/src/hooks/useDiscoverCoffees.ts` — paginated TanStack Query for `coffees WHERE status='active'` with JOIN on `roasters + coffee_stats`; `sortBy: 'newest' | 'most_rated'` param; 20 items per page
- [ ] T059 [P] [US3] Create `packages/shared/src/hooks/useDiscoverRoasters.ts` — paginated TanStack Query for `roasters WHERE verification_status='verified'`; 20 items per page
- [ ] T060 [US3] Create `packages/shared/src/hooks/useFollowRoaster.ts` — TanStack Query mutation that updates `users.following_roaster_ids` array via Supabase `UPDATE users SET following_roaster_ids = array_append(following_roaster_ids, $roasterId)`; toggle (follow/unfollow); invalidates `useUserProfile` cache; used in Roaster Profile + discovery feed (FR-007)
- [ ] T061 [P] [US3] Create `apps/mobile/src/components/hub/LearnCoffee.tsx` — list of article titles + short descriptions from `apps/mobile/content/learn/` MDX frontmatter; tap navigates to `hub/learn/[slug]`
- [ ] T062 [P] [US3] Create `apps/mobile/src/app/(tabs)/hub/learn/[slug].tsx` — renders MDX article via `@expo/mdx`; styled with NativeWind; scroll view with header (article title)
- [ ] T063 [US3] Write 4 MDX articles in `apps/mobile/content/learn/` — `origins-101.mdx`, `processing-methods.mdx`, `brew-guide-v60.mdx`, `how-to-taste-coffee.mdx`; each 200–400 words; frontmatter: `title`, `description`, `readingTime`; warm, knowledgeable brand voice per Principle I; no generic filler

**Checkpoint**: Coffee Hub fully browsable. Consumer can discover coffees, explore roaster profiles, follow roasters, and read educational content — no QR required.

---

## Phase 6: User Story 4 — Sensory Reputation (Priority: P4)

**Goal**: Sensory level (Beginner → Advanced → Expert) advances silently based on tasting quality; visible on profile and subtly in Community section.

**Independent Test**: Test account with series of varied tasting entries. Verify sensory_level advances without notification. Verify Expert label appears subtly in CoffeePageCommunity. No progress bar visible anywhere.

- [ ] T064 [US4] Verify and harden `recalculate_user_reputation(user_id)` DB function in `supabase/migrations/0003_functions_triggers.sql` (update migration or add `0005_reputation_algorithm.sql`) — full scoring implementation: COUNT(coffee_logs) × 1 + COUNT(logs with ≥3 tasting_notes tags) × 2 + COUNT(reviews with LENGTH(body) ≥ 50) × 1 + vocabulary milestones (array_length of DISTINCT flavor_note_ids across all logs: +10 each at 10/20/30); UPDATE `users.sensory_level` only if new level differs from current; function is idempotent + returns new level or NULL if unchanged
- [ ] T065 [US4] Confirm `update_coffee_stats` Edge Function (T026) calls `recalculate_user_reputation` and includes `reputation_updated` + `new_sensory_level` in response — no client notification triggered, level update is silent (FR-008, US-4 AC-2)
- [ ] T066 [P] [US4] Create `apps/mobile/src/app/(tabs)/profile/index.tsx` (Profile screen) — shows: user avatar (`expo-image` from `users.avatar_url`), display_name (editable), sensory_level label ("Beginner" / "Advanced" / "Expert") with NO progress bar, score, or unlock message per FR-008; recent tasting entries (last 5, tapping navigates to journal); avatar upload to Supabase Storage `users/{id}/avatar.jpg`
- [ ] T067 [P] [US4] Create `packages/shared/src/hooks/useUserProfile.ts` — TanStack Query for authenticated user's `users` row (display_name, avatar_url, sensory_level, following_roaster_ids); mutation for updating display_name + avatar_url
- [ ] T068 [P] [US4] Update `apps/mobile/src/components/coffee/CoffeePageCommunity.tsx` — add sensory_level label to each review entry (subtle text label: "Expert" / "Advanced" / "Beginner"); Expert reviews visually distinguished (e.g., different text weight or subtle badge) but NOT hidden, gated, or ranked separately from non-expert reviews; no progress indicator shown

**Checkpoint**: Reputation system active. Level advances silently. Profile shows level. Community section shows level labels without gates or counters.

---

## Phase 7: User Story 5 — Offline Tasting (Priority: P5)

**Goal**: Consumer can view a cached coffee page and log a tasting with no network; entry syncs automatically on reconnect within 30 s.

**Independent Test**: Device in airplane mode with one previously loaded coffee page cached. Log a tasting. Restore connection. Verify sync within 30 s and pending indicator disappears.

- [ ] T069 [US5] Create `apps/mobile/src/services/offlineStorage.ts` — typed MMKV instance; define `PendingTasting` type `{ localId: string; batchId: string; payload: CoffeeLogInsert; createdAt: string; retryCount: number }`; functions: `enqueueTasting(t)`, `dequeueTasting(localId)`, `getPendingTastings()`, `getPendingCount()`; enforce 50-entry cap: if count ≥ 50 show user notification (do NOT discard oldest — preserve per spec edge case)
- [ ] T070 [US5] Create `apps/mobile/src/services/offlineSyncManager.ts` — `NetInfo.addEventListener` for `isConnected` changes; on reconnect: call `getPendingTastings()`, iterate in `createdAt` order, submit each via Supabase `coffee_logs + tasting_notes + reviews` inserts, on success call `dequeueTasting(localId)` + invalidate `useJournal` cache; on failure increment `retryCount` (max 3, then log warning); within 30 s of reconnect target (SC-005)
- [ ] T071 [US5] Update `packages/shared/src/hooks/useTastingLog.ts` (from T040) — on Supabase network error, call `enqueueTasting(payload)` instead of throwing; return `{ isQueued: true }` so Journal can show pending badge; on successful online submit set `synced_at = now()` in the DB row
- [ ] T072 [US5] Confirm `packages/shared/src/hooks/useCoffeePage.ts` (from T030) is configured with `staleTime: Infinity` + `gcTime: 7 days`; integrate `@tanstack/query-persist-client-core` + MMKV persister (`@tanstack/query-mmkv-persister`) in `apps/mobile/src/app/_layout.tsx` so TanStack Query cache survives app restarts (full offline coffee page read)
- [ ] T073 [P] [US5] Create `apps/mobile/src/components/OfflineBanner.tsx` — `NetInfo`-aware banner: slides down via `Reanimated withTiming` (≤ 400ms) when `isConnected === false`; shows "No connection — cached content available"; slides back up on reconnect; `prefers-reduced-motion` aware
- [ ] T074 [P] [US5] Update `apps/mobile/src/app/(tabs)/journal/index.tsx` (from T041) — merge local MMKV pending tastings into displayed list (shown with "pending sync" badge); call `getPendingTastings()` and prepend to query results; badges disappear when `offlineSyncManager` confirms sync

**Checkpoint**: Full offline flow works. Cached coffee pages readable, tasting logs queued, auto-synced on reconnect within 30 s.

---

## Phase 8: User Story 6 — Roaster Reads Consumer Feedback and Analytics (Priority: P6)

**Goal**: Verified roaster views aggregated, anonymised consumer feedback per batch: avg rating, distribution, top flavor notes, filtered reviews.

**Independent Test**: Roaster account with 3 coffees, each batch having 5+ tasting entries from seed/mock data. Verify stats display correctly. Apply brew method filter — verify stats update. Check no consumer identifiers are visible.

- [ ] T075 [US6] Create `apps/web/app/analytics/[batchId]/page.tsx` (Analytics page) — server component: fetches `roast_batches + coffees` for header, `coffee_stats` for summary stats, reviews with `users.sensory_level` (no user identifier); renders `RatingDistribution`, `FlavorNoteFrequency`, `ReviewList`, `BrewMethodFilter`; redirect if roaster does not own this batch
- [ ] T076 [P] [US6] Create `apps/web/components/analytics/RatingDistribution.tsx` — 5-bar horizontal bar chart using inline SVG: bars for ratings 1–5, each bar width proportional to count; shows count + percentage per bar; Framer Motion stagger animation on mount (≤ 400ms); total count + avg rating in header
- [ ] T077 [P] [US6] Create `apps/web/components/analytics/FlavorNoteFrequency.tsx` — ranked list of `top_flavor_notes` from `coffee_stats.top_flavor_notes` JSONB; each row: tag label, count, horizontal frequency bar (CSS width %); Framer Motion stagger entry animation
- [ ] T078 [P] [US6] Create `apps/web/components/analytics/ReviewList.tsx` — renders `reviews.body` for the batch; fully anonymised: NO consumer username, display_name, avatar, or user_id exposed; shows `users.sensory_level` label per review; empty state per FR-018 AC-3
- [ ] T079 [US6] Create `apps/web/components/analytics/BrewMethodFilter.tsx` — button group populated from `brew_methods`; on select: refetches `coffee_logs COUNT + AVG` filtered by `brew_method_id`; updates `RatingDistribution` + `ReviewList` stats in real time (client-side filter via TanStack Query refetch with param); "All Methods" default state
- [ ] T080 [US6] Create `packages/shared/src/hooks/useBatchAnalytics.ts` — TanStack Query `useQuery` for `coffee_stats` + optional filtered `coffee_logs` aggregate + `reviews` list for a `batchId` + optional `brewMethodId` filter; separate queries for filtered stats vs. global stats so global stats remain cached when filter changes

**Checkpoint**: Roaster analytics fully functional. Aggregated feedback visible per batch, filter by brew method works, consumer identities fully anonymised.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Animation compliance, accessibility, production hygiene, constitution enforcement.

- [ ] T081 [P] Implement `prefers-reduced-motion` guards — wrap all Reanimated animations in `apps/mobile` with `useReducedMotion()` hook check (suppress decorative animations when true); wrap all Framer Motion animations in `apps/web` with `useReducedMotion()` from `framer-motion`; per Principle V
- [ ] T082 [P] Audit all animations for ≤ 400ms constraint — review every `withTiming`, `withSpring`, `transition` in `apps/mobile` + `apps/web`; ensure no animation exceeds 400ms duration; update any violators; verify skip/interrupt mechanism exists for longer sequences per Principle V
- [ ] T083 [P] Create production logger utility — `apps/mobile/src/services/logger.ts` + `apps/web/lib/logger.ts`; each exports `log()`, `warn()`, `error()` that are no-ops when `process.env.NODE_ENV === 'production'`; replace all `console.log` calls across both apps with logger per constitution no-console rule
- [ ] T084 [P] Validate Coffee Page public access end-to-end — confirm `apps/mobile/src/app/coffee/[id]/index.tsx` renders without auth (anon key passed to `scan_qr`); confirm "Log Tasting" CTA redirects unauthenticated user to login with `returnUrl=/coffee/[id]` param; confirm RLS SELECT policies allow anon reads on coffees/roast_batches/origins/roasters/coffee_stats per FR-011
- [ ] T085 [P] Validate archived batch notice — confirm `scan_qr` returns `{ archived: true }` for `batch.status='archived'`; confirm `apps/mobile/src/app/coffee/[id]/index.tsx` shows visible "This batch is no longer active" banner while still displaying full coffee profile per US-1 AC-3
- [ ] T086 [P] Validate QR hash immutability — confirm `qr_codes` UPDATE RLS policy prevents any client from changing `hash` or `qr_url`; confirm `generate_qr` idempotency (call twice for same batch → same hash returned); verify coffee data updates don't regenerate QR per US-2 AC-4 + FR-016
- [ ] T087 Run quickstart.md validation — follow every step in `specs/002-qr-coffee-platform/quickstart.md` on a clean local environment; verify: migrations apply cleanly, seed runs, types generate, both apps start, full QR flow completes (§5), offline flow completes (§6); fix any blockers found; update quickstart.md if any step is incorrect
- [ ] T088 [P] Deploy Edge Functions to remote Supabase project — `supabase functions deploy scan_qr`, `supabase functions deploy generate_qr`, `supabase functions deploy update_coffee_stats`; run integration smoke test: call `scan_qr` with seeded hash on remote URL; verify response matches contract

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 completion — **BLOCKS all user stories**
- **US1 (Phase 3)**: Depends on Phase 2 — no dependency on US2–US6
- **US2 (Phase 4)**: Depends on Phase 2 — no dependency on US1 (uses seeded batch)
- **US3 (Phase 5)**: Depends on Phase 2 + US1 Coffee Page screen (T031) for navigation target
- **US4 (Phase 6)**: Depends on Phase 2 + US1 tasting log (T040) for scoring data
- **US5 (Phase 7)**: Depends on Phase 2 + US1 tasting log (T040, T041, T042) + `useCoffeePage` (T030)
- **US6 (Phase 8)**: Depends on Phase 2 + US1 tasting data (T039–T042) + US2 batch creation (T051)
- **Polish (Phase 9)**: Depends on all desired user stories being complete

### User Story Dependencies

| Story | Can start after | Integrates with |
|-------|----------------|-----------------|
| US1 (P1) | Phase 2 complete | None — standalone MVP |
| US2 (P2) | Phase 2 complete | None — uses seeded batch for test |
| US3 (P3) | Phase 2 + T031 (Coffee Page screen) | Navigates to US1 Coffee Page |
| US4 (P4) | Phase 2 + T040 (useTastingLog) | Reads US1 tasting data; updates profile (T066) adds to T035 |
| US5 (P5) | Phase 2 + T030 + T040–T042 | Wraps US1 log flow with offline layer |
| US6 (P6) | Phase 2 + US1 data + US2 batches | Reads US1 tastings, US2 batches |

### Within Each User Story

- Edge Functions before screens that call them
- Shared hooks (packages/shared) before screens that use them
- Component atoms before composite screens
- Story complete and independently testable before starting next priority

---

## Parallel Opportunities

### Phase 1 — all [P] tasks run in parallel after T001+T002

```
T003 (init mobile) ‖ T004 (init web) ‖ T005 (init shared)
T007 (NativeWind)  ‖ T008 (Tailwind web) ‖ T009 (ESLint)
T010 (mobile deps) ‖ T011 (web deps) ‖ T012 (.env.example)
```

### Phase 2 — after T013+T014+T015+T016+T017

```
T018 (Storage buckets) ‖ T019 (client factory) ‖ T022 (constants)
T020 (mobile client)   ‖ T021 (web clients)
T023 (mobile layout)   ‖ T024 (auth layouts)
```

### US1 — after T025+T026

```
T027 (login) ‖ T028 (register)
T032 (Product component) ‖ T033 (Brewing) ‖ T034 (Story) ‖ T035 (Community)
T036 (FlavorNoteSelector) ‖ T037 (RatingInput) ‖ T038 (BrewMethodPicker)
```

### US2 — after T043

```
T044 (web login) ‖ T045 (web register) ‖ T046 (pending page)
T052 (QRDownloadButton) ‖ T053 (hooks)
```

### US3 — after T054

```
T055 (DiscoverCoffees) ‖ T056 (DiscoverRoasters) ‖ T061 (LearnCoffee)
T058 (useDiscoverCoffees) ‖ T059 (useDiscoverRoasters)
T062 (learn article screen) ‖ T063 (MDX content)
```

---

## Implementation Strategy

### MVP First (US1 Only — Phases 1–3)

1. Complete Phase 1: Setup (T001–T012)
2. Complete Phase 2: Foundational (T013–T024) — **critical, blocks everything**
3. Complete Phase 3: US1 (T025–T042)
4. **STOP and VALIDATE**: Run US1 independent test with seeded data
5. Ship / demo: QR scan → Coffee Page → tasting log → journal

### Incremental Delivery

- Foundation (P1+P2) → Add US1 → **Deploy (MVP)**
- Add US2 → Roasters can publish QR codes → **Deploy**
- Add US3 → Discovery + Hub + Learn → **Deploy**
- Add US4 → Silent reputation system → **Deploy**
- Add US5 → Offline support → **Deploy**
- Add US6 → Roaster analytics → **Deploy (full MVP)**
- Polish phase → Production hardening

### Parallel Team Strategy

After Phase 2 completes:
- **Mobile developer A**: US1 (scan + coffee page + tasting log)
- **Mobile developer B**: US3 (hub + discovery + learn content)
- **Web developer**: US2 (roaster dashboard + QR generation)

US4, US5, US6 can follow in parallel once respective dependencies are met.

---

## Notes

- No test tasks generated — not requested in spec.md
- `[P]` = different files, no blocking dependency on in-progress tasks
- `[Story]` label maps every implementation task to its user story for traceability
- Each user story phase delivers a complete, independently testable increment
- Constitution gates: all 9 pass (see plan.md) — no special compliance tasks needed
- Entry animation (FR-012, Principle IX) is **protected** — zero tasks touch it
- Commit after each logical group; include Co-Authored-By footer
- Supabase-generated types in `packages/shared/src/types/database.types.ts` are the only canonical entity definitions — do NOT write hand-crafted interfaces that duplicate them
