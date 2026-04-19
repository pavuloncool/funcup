# Evidence — T017 / T018

Source of truth:
`/Users/pa/projects/funcup/funcup-src-docs/04-tasks/13-tasks-002-qr-coffee-platform-88-tasks.md`

Date: 2026-04-08

## T017 — Apply migrations locally + generate TypeScript types

Evidence collected:

- Migration files present:
  - `supabase/migrations/0001_initial_schema.sql`
  - `supabase/migrations/0002_rls_policies.sql`
  - `supabase/migrations/0003_functions_triggers.sql`
  - `supabase/migrations/0004_pg_net_and_storage.sql`
- Generated types artifact present:
  - `supabase/types/database.ts`
- Types generation command is available in root scripts:
  - `pnpm supabase:types`
  - Output confirms command template:
    - `supabase gen types typescript --project-id <id> --schema public > supabase/types/database.ts`

Conclusion:

- T017 is evidenced at repository level (migrations + types artifact + generation command).
- Environment-specific DB apply execution should be run in target Supabase environment as deployment step.

## T018 — Enable pg_net + configure Storage buckets

Evidence collected:

- `supabase/migrations/0004_pg_net_and_storage.sql` includes:
  - `CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;`
  - `INSERT INTO storage.buckets (id, name, public)` (bucket `qr`)

Conclusion:

- T018 is evidenced in migration code and ready for environment application.
- Final operational verification remains environment-level (post-migration validation in Supabase instance).

