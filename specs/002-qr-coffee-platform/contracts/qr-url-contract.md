# Contract: QR URL

**Date**: 2026-03-25

---

## URL Pattern

```
https://funcup.app/q/{qr_hash}
```

| Component | Value |
|-----------|-------|
| Scheme | `https` |
| Host | `funcup.app` |
| Path prefix | `/q/` |
| `{qr_hash}` | UUID v4, lowercase, hyphenated (e.g., `550e8400-e29b-41d4-a716-446655440000`) |

---

## Invariants

1. **Permanent**: The `qr_hash` for a given batch is generated once and never changes (FR-016). Editing the coffee profile, brewing notes, or story does NOT change the QR.
2. **Batch-bound**: The hash resolves to exactly one `roast_batches` row. It does not resolve to a coffee directly — a coffee may have multiple batches with different QR codes.
3. **Scan-agnostic**: The URL is a plain HTTPS URL readable by any QR scanner app, camera, or browser — no funcup app required to resolve the URL.
4. **Public**: No authentication required to visit `https://funcup.app/q/{hash}`. Coffee pages are publicly readable (FR-011).

---

## Resolution Flow

### Web (Next.js)

```
GET https://funcup.app/q/{hash}
  → Next.js middleware catches /q/* routes
  → Calls scan_qr Edge Function: POST /functions/v1/scan_qr { hash }
  → 200: redirect to /coffee/{coffee_id}?batch={batch_id}
  → 404: render /q/not-found page
  → archived: redirect to /coffee/{coffee_id}?batch={batch_id}&archived=true
```

### Mobile (Expo)

```
Camera detects QR → extracts URL "https://funcup.app/q/{hash}"
  → App intercepts via expo-linking deep link scheme OR
    strips hash from URL and calls scan_qr directly
  → Navigate to coffee/:id screen with { batchId } param
  → Success: render Coffee Page
  → not_found: show "coffee isn't in the system" state (US-1 AC-5)
  → archived: show coffee page with "batch no longer active" notice (US-1 AC-3)
```

---

## Deep Link Configuration (Expo)

```json
// app.json
{
  "expo": {
    "scheme": "funcup",
    "intentFilters": [
      {
        "action": "VIEW",
        "data": [{ "scheme": "https", "host": "funcup.app", "pathPrefix": "/q/" }],
        "category": ["BROWSABLE", "DEFAULT"]
      }
    ]
  }
}
```

This enables Android App Links and iOS Universal Links — the OS routes `https://funcup.app/q/*` directly to the funcup app when installed.

---

## Error States

| Condition | HTTP | Client behaviour |
|-----------|------|-----------------|
| Hash not found in `qr_codes` | 404 | "This coffee isn't in funcup yet" + share option (US-1 AC-5) |
| Batch archived | 200 (with `archived: true`) | Coffee page with "This batch is no longer active" banner (US-1 AC-3) |
| Malformed hash (not UUID v4) | 400 | "Can't read this code" + manual search option (spec edge case 1) |
| Network error (offline, no cache) | — | "No connection" state; retry button |
