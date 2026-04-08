-- Seed data (T016)
-- Minimal-but-complete seed for Phase 1–3 demo flows.

BEGIN;

-- Brew methods (10)
INSERT INTO public.brew_methods (name, sort_order) VALUES
  ('V60', 10),
  ('Chemex', 20),
  ('Aeropress', 30),
  ('French Press', 40),
  ('Espresso', 50),
  ('Moka Pot', 60),
  ('Kalita Wave', 70),
  ('Cold Brew', 80),
  ('Cupping', 90),
  ('Other', 100)
ON CONFLICT (name) DO NOTHING;

-- Flavor notes (36)
INSERT INTO public.flavor_notes (name, label, category, sort_order) VALUES
  ('citrus', 'Citrus', 'fruit', 10),
  ('lemon', 'Lemon', 'fruit', 11),
  ('orange', 'Orange', 'fruit', 12),
  ('bergamot', 'Bergamot', 'fruit', 13),
  ('apple', 'Apple', 'fruit', 14),
  ('pear', 'Pear', 'fruit', 15),
  ('stone_fruit', 'Stone fruit', 'fruit', 16),
  ('peach', 'Peach', 'fruit', 17),
  ('berry', 'Berry', 'fruit', 18),
  ('strawberry', 'Strawberry', 'fruit', 19),
  ('blueberry', 'Blueberry', 'fruit', 20),
  ('tropical', 'Tropical', 'fruit', 21),
  ('pineapple', 'Pineapple', 'fruit', 22),
  ('mango', 'Mango', 'fruit', 23),

  ('chocolate', 'Chocolate', 'sweet', 30),
  ('cocoa', 'Cocoa', 'sweet', 31),
  ('caramel', 'Caramel', 'sweet', 32),
  ('toffee', 'Toffee', 'sweet', 33),
  ('honey', 'Honey', 'sweet', 34),
  ('brown_sugar', 'Brown sugar', 'sweet', 35),
  ('vanilla', 'Vanilla', 'sweet', 36),

  ('floral', 'Floral', 'floral', 40),
  ('jasmine', 'Jasmine', 'floral', 41),
  ('rose', 'Rose', 'floral', 42),

  ('nutty', 'Nutty', 'nut', 50),
  ('almond', 'Almond', 'nut', 51),
  ('hazelnut', 'Hazelnut', 'nut', 52),

  ('spice', 'Spice', 'spice', 60),
  ('cinnamon', 'Cinnamon', 'spice', 61),
  ('clove', 'Clove', 'spice', 62),

  ('tea_like', 'Tea-like', 'other', 70),
  ('clean', 'Clean', 'other', 71),
  ('juicy', 'Juicy', 'other', 72),
  ('bright', 'Bright', 'other', 73),
  ('balanced', 'Balanced', 'other', 74),
  ('heavy_body', 'Heavy body', 'other', 75)
ON CONFLICT (name) DO NOTHING;

-- Seed one verified roaster + one active coffee + one batch (for scan QR demo)
DO $$
DECLARE
  v_roaster_id uuid;
  v_origin_id uuid;
  v_coffee_id uuid;
  v_batch_id uuid;
BEGIN
  -- Create a placeholder auth user reference (for local dev only).
  -- In real environments, auth.users is managed by Supabase Auth.
  -- We keep this seed best-effort; it won't fail if auth schema doesn't allow inserts.
  BEGIN
    INSERT INTO auth.users (id, email)
    VALUES ('00000000-0000-0000-0000-000000000001', 'roaster@example.com')
    ON CONFLICT DO NOTHING;
  EXCEPTION WHEN OTHERS THEN
    -- ignore
  END;

  INSERT INTO public.roasters (user_id, name, country, city, verification_status)
  VALUES ('00000000-0000-0000-0000-000000000001', 'Demo Roaster', 'PL', 'Warsaw', 'verified')
  ON CONFLICT (user_id) DO UPDATE SET verification_status = 'verified'
  RETURNING id INTO v_roaster_id;

  INSERT INTO public.origins (country, region, farm, altitude_min, altitude_max, producer)
  VALUES ('Ethiopia', 'Yirgacheffe', 'Demo Farm', 1800, 2200, 'Demo Producer')
  RETURNING id INTO v_origin_id;

  INSERT INTO public.coffees (roaster_id, origin_id, name, variety, processing_method, producer_notes, status)
  VALUES (v_roaster_id, v_origin_id, 'Demo Coffee', 'Heirloom', 'washed', 'Seeded coffee for Phase 3 QR scan.', 'active')
  RETURNING id INTO v_coffee_id;

  INSERT INTO public.roast_batches (coffee_id, roast_date, lot_number, status, brewing_notes, roaster_story)
  VALUES (v_coffee_id, now()::date, 'LOT-0001', 'active', 'Try 1:16 ratio.', 'Seed batch for demo.')
  RETURNING id INTO v_batch_id;

  -- Create a QR code entry (hash is UUID string) pointing to the batch
  INSERT INTO public.qr_codes (batch_id, hash, qr_url, svg_storage_path, png_storage_path)
  VALUES (v_batch_id, '11111111-1111-1111-1111-111111111111', 'https://funcup.app/q/11111111-1111-1111-1111-111111111111', 'qr/demo/qr.svg', 'qr/demo/qr.png')
  ON CONFLICT (batch_id) DO NOTHING;
END $$;

COMMIT;

