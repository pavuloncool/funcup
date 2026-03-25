# Contract: Edge Function `update_coffee_stats`

**Function**: `update_coffee_stats`
**Runtime**: Supabase Edge Function (Deno)
**Invoked by**: PostgreSQL trigger on `coffee_logs` INSERT (via `pg_net.http_post`)

---

## Purpose

Recalculates aggregated statistics for a batch after a new tasting is submitted. Also triggers sensory reputation recalculation for the consumer. Ensures `coffee_stats` reflects new tastings within 5 minutes (SC-008) — in practice, within seconds.

---

## Request

```
POST https://{project}.supabase.co/functions/v1/update_coffee_stats
Content-Type: application/json
Authorization: Bearer {service_role_key}   # internal — never exposed to clients
```

**Body**:
```typescript
{
  batch_id: string;   // UUID of the batch whose stats need recalculation
  user_id: string;    // UUID of the consumer who just logged the tasting
}
```

**Auth**: Service role only. This function is never called directly from client apps.

---

## Response — 200 OK

```typescript
{
  updated: true;
  batch_id: string;
  stats: {
    total_count: number;
    avg_rating: number;
    rating_distribution: { "1": number; "2": number; "3": number; "4": number; "5": number };
    top_flavor_notes: Array<{ id: string; name: string; label: string; category: string; count: number }>;
    updated_at: string;   // ISO 8601 timestamp
  };
  reputation_updated: boolean;   // true if user's sensory_level changed
  new_sensory_level: "beginner" | "advanced" | "expert" | null;  // null if unchanged
}
```

---

## Response — 400 Bad Request

```typescript
{ error: "invalid_input"; message: "batch_id and user_id are required." }
```

---

## Response — 500 Internal Server Error

```typescript
{ error: "aggregation_failed"; message: string }
```

On failure, the trigger retries via `pg_net` up to 3 times (exponential backoff). Stats may be temporarily stale but will self-heal on the next tasting.

---

## Side Effects

### 1. Recalculate `coffee_stats`

```sql
-- Executed as a parameterised query inside the Edge Function
INSERT INTO coffee_stats (batch_id, total_count, avg_rating, rating_distribution, top_flavor_notes, updated_at)
SELECT
  $1 AS batch_id,
  COUNT(*) AS total_count,
  ROUND(AVG(rating)::numeric, 2) AS avg_rating,
  jsonb_build_object(
    '1', COUNT(*) FILTER (WHERE rating = 1),
    '2', COUNT(*) FILTER (WHERE rating = 2),
    '3', COUNT(*) FILTER (WHERE rating = 3),
    '4', COUNT(*) FILTER (WHERE rating = 4),
    '5', COUNT(*) FILTER (WHERE rating = 5)
  ) AS rating_distribution,
  (
    SELECT jsonb_agg(row_to_json(t))
    FROM (
      SELECT fn.id, fn.name, fn.label, fn.category, COUNT(*) AS count
      FROM tasting_notes tn
      JOIN flavor_notes fn ON fn.id = tn.flavor_note_id
      JOIN coffee_logs cl ON cl.id = tn.coffee_log_id
      WHERE cl.batch_id = $1
      GROUP BY fn.id, fn.name, fn.label, fn.category
      ORDER BY count DESC
      LIMIT 10
    ) t
  ) AS top_flavor_notes,
  now() AS updated_at
FROM coffee_logs
WHERE batch_id = $1
ON CONFLICT (batch_id) DO UPDATE SET
  total_count = EXCLUDED.total_count,
  avg_rating = EXCLUDED.avg_rating,
  rating_distribution = EXCLUDED.rating_distribution,
  top_flavor_notes = EXCLUDED.top_flavor_notes,
  updated_at = EXCLUDED.updated_at;
```

### 2. Recalculate user sensory reputation

Calls PostgreSQL function `recalculate_user_reputation(user_id uuid)`:

```sql
-- Scoring rules (see research.md §4)
-- Returns new sensory_level if it changed, else NULL
SELECT recalculate_user_reputation($1);
```

The DB function computes the point score, determines the new level, and UPDATEs `users.sensory_level` if it changed. No notification is sent to the user (spec FR-008, US-4 AC-2).

---

## Trigger Definition

```sql
-- In supabase/migrations/0002_rls_policies.sql (or a dedicated migration)
CREATE OR REPLACE FUNCTION notify_update_coffee_stats()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  PERFORM pg_net.http_post(
    url := current_setting('app.edge_function_base_url') || '/update_coffee_stats',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.service_role_key')
    ),
    body := jsonb_build_object(
      'batch_id', NEW.batch_id::text,
      'user_id', NEW.user_id::text
    )
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER after_coffee_log_insert
AFTER INSERT ON coffee_logs
FOR EACH ROW EXECUTE FUNCTION notify_update_coffee_stats();
```

**Prerequisite**: `pg_net` extension must be enabled in the Supabase project.

---

## Implementation Notes

- Function runs with `service_role` JWT — bypasses RLS for aggregate reads.
- `app.edge_function_base_url` and `app.service_role_key` are set via Supabase project settings (database config), not embedded in migration SQL.
- Idempotent: calling multiple times with the same `batch_id` simply recalculates from current data — no double-counting.
