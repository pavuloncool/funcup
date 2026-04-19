import { describe, expect, it } from 'vitest';

import {
  clientFormValuesToInsert,
  getTodayIsoDateString,
  MAX_COFFEE_LABEL_BYTES,
  roasterCoffeeTagClientFormSchema,
} from './roasterCoffeeTagForm';

function tomorrowIso(): string {
  const t = new Date();
  t.setDate(t.getDate() + 1);
  const y = t.getFullYear();
  const m = String(t.getMonth() + 1).padStart(2, '0');
  const d = String(t.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function tinyPng(): File {
  const b = new Uint8Array([137, 80, 78, 71]);
  return new File([b], 'label.png', { type: 'image/png' });
}

function baseValid() {
  return {
    roaster_short_name: 'Bean Lab',
    coffeeLabelFile: tinyPng(),
    bean_origin_country: 'Ethiopia',
    bean_origin_farm: 'Farm',
    bean_origin_tradename: 'Trade',
    bean_origin_region: 'Sidamo',
    bean_type: 'arabica' as const,
    bean_varietal_main: 'Heirloom',
    bean_varietal_extra: '',
    bean_origin_height: '1800',
    bean_processing: 'washed',
    bean_roast_date: getTodayIsoDateString(),
    bean_roast_level: 'light',
    brew_method: 'filter',
  };
}

describe('roasterCoffeeTagClientFormSchema', () => {
  it('accepts valid payload', () => {
    const r = roasterCoffeeTagClientFormSchema.safeParse(baseValid());
    expect(r.success).toBe(true);
    if (r.success) {
      const row = clientFormValuesToInsert(r.data, 'https://example.com/x.png');
      expect(row.img_coffee_label).toBe('https://example.com/x.png');
      expect(row.bean_origin_height).toBe(1800);
    }
  });

  it('rejects future roast date', () => {
    const r = roasterCoffeeTagClientFormSchema.safeParse({
      ...baseValid(),
      bean_roast_date: tomorrowIso(),
    });
    expect(r.success).toBe(false);
    if (!r.success) {
      const msg = r.error.flatten().fieldErrors.bean_roast_date?.join(' ');
      expect(msg).toContain('przyszłości');
    }
  });

  it('rejects file larger than 512 KB', () => {
    const big = new Uint8Array(MAX_COFFEE_LABEL_BYTES + 1);
    const file = new File([big], 'big.png', { type: 'image/png' });
    const r = roasterCoffeeTagClientFormSchema.safeParse({
      ...baseValid(),
      coffeeLabelFile: file,
    });
    expect(r.success).toBe(false);
  });

  it('rejects invalid MIME', () => {
    const file = new File([new Uint8Array([1, 2, 3])], 'x.gif', { type: 'image/gif' });
    const r = roasterCoffeeTagClientFormSchema.safeParse({
      ...baseValid(),
      coffeeLabelFile: file,
    });
    expect(r.success).toBe(false);
  });

  it('rejects missing file', () => {
    const r = roasterCoffeeTagClientFormSchema.safeParse({
      ...baseValid(),
      coffeeLabelFile: undefined,
    });
    expect(r.success).toBe(false);
  });
});

describe('clientFormValuesToInsert', () => {
  it('throws when URL empty', () => {
    const v = roasterCoffeeTagClientFormSchema.safeParse(baseValid());
    expect(v.success).toBe(true);
    if (v.success) {
      expect(() => clientFormValuesToInsert(v.data, '   ')).toThrow(/Image upload failed/);
    }
  });
});
