# funcup Devlog

**Feature:** `002-qr-coffee-platform`  
**Started:** 2026-04-08

---

## 2026-04-08 — Phase 1 + Phase 2 Complete (T001–T024)

### Summary
Completed foundational setup and core infrastructure for the QR-driven specialty coffee platform MVP.

### Phase 1: Setup (T001–T012) — Completed

| Date | Task | Description |
|------|------|-------------|
| 2026-04-08 | T001 | Initialized monorepo with Turborepo: apps/frontend, packages/{shared,types,utils,tsconfig,eslint-config,ui,logger} |
| 2026-04-08 | T002 | Set up shared packages structure with typecheck scripts |
| 2026-04-08 | T003 | Configured ESLint + Prettier with TypeScript support |
| 2026-04-08 | T004 | Set up Husky with pre-commit (lint + build) and commit-msg validation |
| 2026-04-08 | T005 | Created GitHub Actions CI/CD: Lint → Build → Test pipeline |
| 2026-04-08 | T006 | Created .env.example template for Supabase config |
| 2026-04-08 | T007 | Initialized Supabase project (config.json) |
| 2026-04-08 | T008 | Created database migrations: 13 tables, 5 enums, triggers, seeds |
| 2026-04-08 | T009 | Configured Storybook with react-vite + addons (a11y, docs, vitest) |
| 2026-04-08 | T010 | Set up Vitest testing framework with jsdom |
| 2026-04-08 | T011 | Created design system: @funcup/ui (Button, Card, Input, Badge) + theme |
| 2026-04-08 | T012 | Set up @funcup/logger with levels and captureError |

### Phase 2: Foundational (T013–T024) — Completed

| Date | Task | Description |
|------|------|-------------|
| 2026-04-08 | T013 | Data model v3: 13 tables (users, roasters, origins, coffees, roast_batches, qr_codes, brew_methods, flavor_notes, coffee_logs, tasting_notes, reviews, review_votes, coffee_stats) |
| 2026-04-08 | T014 | PostgreSQL schema: 0001_initial_schema.sql with FK, constraints, triggers |
| 2026-04-08 | T015 | RLS policies: 0002_rls_policies.sql — all tables protected |
| 2026-04-08 | T016 | Supabase Auth: auth-config.json (providers: email, google, apple) |
| 2026-04-08 | T017 | Auth endpoints: Edge Functions for sign-up, sign-in, sign-out, update-profile |
| 2026-04-08 | T018 | User profile: users table extends auth.users, auto-creation trigger |
| 2026-04-08 | T019 | API routes: supabase/functions/{auth,coffee,roaster}/ structure |
| 2026-04-08 | T020 | Shared types: @funcup/types with 16 TypeScript interfaces |
| 2026-04-08 | T021 | i18n: @funcup/i18n with en.ts, pl.ts locales |
| 2026-04-08 | T022 | Base UI: @funcup/ui components (Button, Card, Input, Badge) |
| 2026-04-08 | T023 | Routing: react-router-dom with 6 pages (Home, Scan, Coffee, Hub, Profile, AuthCallback) |
| 2026-04-08 | T024 | Error boundaries: ErrorBoundary.tsx with retry UI |

### Key Decisions

- **Monorepo structure:** Turborepo with apps/ + packages/ workspaces
- **Tech stack:** TypeScript 5.x strict, Vite, React 18, Supabase
- **Frontend-only MVP:** Web app (not mobile) for Phase 1-2; mobile planned for Phase 3+
- **AnimatedSplash:** Fingerprint + coffee bean entry animation preserved (spec FR-012)

### Architecture Decisions Recorded (ADRs)

| ADR | Title | Related Tasks |
|-----|-------|---------------|
| ADR-001 | Monorepo with Turborepo | T001, T002 |
| ADR-002 | PostgreSQL with Supabase | T007, T008, T014, T015 |
| ADR-003 | Frontend Tech Stack | T011, T022, T023 |
| ADR-004 | 13-Table Data Model | T013, T014 |
| ADR-005 | RLS as Security Layer | T015 |
| ADR-006 | Design System (@funcup/ui) | T011, T022 |
| ADR-007 | i18n with Manual Translations | T021 |
| ADR-008 | React Error Boundaries | T024 |
| ADR-009 | Animated Splash (Tap to Bean) | T022 (AnimatedSplash.jsx) |
| ADR-010 | Edge Functions for Auth | T016, T017, T019 |

### Verification

```
✅ npm run build   — successful
✅ npm run lint    — passing
```

### Next Steps
- Phase 3: US1 — QR Scan + Log (T025–T042)
- Phase 4: US2 — Coffee Hub (T043–T060)
- Phase 5: US3 — Reputation System (T061–T080)

---

*Auto-generated after Phase 1-2 completion*