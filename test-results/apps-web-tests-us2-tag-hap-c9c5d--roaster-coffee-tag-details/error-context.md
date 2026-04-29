# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apps/web/tests/us2-tag-happy-path.e2e.spec.ts >> US2 tag happy path: /q/{hash} resolves roaster coffee tag details
- Location: apps/web/tests/us2-tag-happy-path.e2e.spec.ts:7:5

# Error details

```
Error: Missing env: one of [SUPABASE_ANON_KEY, NEXT_PUBLIC_SUPABASE_ANON_KEY]
```

# Test source

```ts
  1   | import { APIRequestContext, expect } from '@playwright/test';
  2   | import { randomUUID } from 'node:crypto';
  3   | 
  4   | export type TestActor = {
  5   |   email: string;
  6   |   password: string;
  7   |   userId: string;
  8   |   accessToken: string;
  9   |   roasterId: string;
  10  |   roasterName: string;
  11  | };
  12  | 
  13  | function mustGetEnv(...names: string[]): string {
  14  |   for (const name of names) {
  15  |     const value = process.env[name];
  16  |     if (value) return value;
  17  |   }
> 18  |   throw new Error(`Missing env: one of [${names.join(', ')}]`);
      |         ^ Error: Missing env: one of [SUPABASE_ANON_KEY, NEXT_PUBLIC_SUPABASE_ANON_KEY]
  19  | }
  20  | 
  21  | export function supabaseEnv() {
  22  |   return {
  23  |     url:
  24  |       process.env.SUPABASE_URL ??
  25  |       process.env.NEXT_PUBLIC_SUPABASE_URL ??
  26  |       'http://127.0.0.1:54321',
  27  |     anonKey: mustGetEnv('SUPABASE_ANON_KEY', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  28  |     serviceRoleKey: mustGetEnv('SUPABASE_SERVICE_ROLE_KEY'),
  29  |   };
  30  | }
  31  | 
  32  | async function createUser(
  33  |   request: APIRequestContext,
  34  |   email: string,
  35  |   password: string,
  36  |   serviceRoleKey: string,
  37  |   supabaseUrl: string
  38  | ) {
  39  |   const response = await request.post(`${supabaseUrl}/auth/v1/admin/users`, {
  40  |     headers: {
  41  |       apikey: serviceRoleKey,
  42  |       Authorization: `Bearer ${serviceRoleKey}`,
  43  |       'Content-Type': 'application/json',
  44  |     },
  45  |     data: {
  46  |       email,
  47  |       password,
  48  |       email_confirm: true,
  49  |       user_metadata: { display_name: email.split('@')[0] },
  50  |     },
  51  |   });
  52  |   expect(response.ok()).toBeTruthy();
  53  |   const body = (await response.json()) as { id: string };
  54  |   return body.id;
  55  | }
  56  | 
  57  | async function signIn(
  58  |   request: APIRequestContext,
  59  |   email: string,
  60  |   password: string,
  61  |   anonKey: string,
  62  |   supabaseUrl: string
  63  | ) {
  64  |   const response = await request.post(
  65  |     `${supabaseUrl}/auth/v1/token?grant_type=password`,
  66  |     {
  67  |       headers: {
  68  |         apikey: anonKey,
  69  |         'Content-Type': 'application/json',
  70  |       },
  71  |       data: { email, password },
  72  |     }
  73  |   );
  74  |   expect(response.ok()).toBeTruthy();
  75  |   const body = (await response.json()) as { access_token: string };
  76  |   return body.access_token;
  77  | }
  78  | 
  79  | async function createRoaster(
  80  |   request: APIRequestContext,
  81  |   userId: string,
  82  |   roasterName: string,
  83  |   serviceRoleKey: string,
  84  |   supabaseUrl: string
  85  | ) {
  86  |   const response = await request.post(`${supabaseUrl}/rest/v1/roasters?select=id`, {
  87  |     headers: {
  88  |       apikey: serviceRoleKey,
  89  |       Authorization: `Bearer ${serviceRoleKey}`,
  90  |       'Content-Type': 'application/json',
  91  |       Prefer: 'return=representation',
  92  |     },
  93  |     data: {
  94  |       user_id: userId,
  95  |       name: roasterName,
  96  |       verification_status: 'verified',
  97  |     },
  98  |   });
  99  |   expect(response.ok()).toBeTruthy();
  100 |   const body = (await response.json()) as Array<{ id: string }>;
  101 |   return body[0].id;
  102 | }
  103 | 
  104 | export async function provisionVerifiedRoaster(
  105 |   request: APIRequestContext,
  106 |   label: string
  107 | ): Promise<TestActor> {
  108 |   const { url, anonKey, serviceRoleKey } = supabaseEnv();
  109 |   const seed = label.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  110 |   const email = `phase4-${seed}-${Date.now()}@example.com`;
  111 |   const password = `Phase4!${randomUUID().slice(0, 8)}`;
  112 | 
  113 |   const userId = await createUser(request, email, password, serviceRoleKey, url);
  114 |   const accessToken = await signIn(request, email, password, anonKey, url);
  115 |   const roasterName = `Phase4 ${label}`;
  116 |   const roasterId = await createRoaster(request, userId, roasterName, serviceRoleKey, url);
  117 | 
  118 |   return { email, password, userId, accessToken, roasterId, roasterName };
```