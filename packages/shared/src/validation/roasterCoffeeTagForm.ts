import type { RoasterCoffeeBeanType, RoasterCoffeeTagInsert } from '@funcup/types';

export type RoasterCoffeeTagFormStrings = {
  roaster_short_name: string;
  img_coffee_label: string;
  bean_origin_country: string;
  bean_origin_farm: string;
  bean_origin_tradename: string;
  bean_origin_region: string;
  bean_type: RoasterCoffeeBeanType | '';
  bean_varietal_main: string;
  bean_varietal_extra: string;
  bean_origin_height: string;
  bean_processing: string;
  bean_roast_date: string;
  bean_roast_level: string;
  brew_method: string;
};

/** Matches `YYYY-MM-DD` (same as getTodayIso / date input). */
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function isReasonableUrl(s: string): boolean {
  const t = s.trim();
  if (t.length < 8) return false;
  try {
    const u = new URL(t);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

export function validateRoasterCoffeeTagForm(
  f: RoasterCoffeeTagFormStrings
): Record<string, string> {
  const e: Record<string, string> = {};
  const name = f.roaster_short_name.trim();
  if (!name) e.roaster_short_name = 'Wymagane';
  else if (name.length > 64) e.roaster_short_name = 'Max 64 znaków';

  const img = f.img_coffee_label.trim();
  if (!img) e.img_coffee_label = 'Wymagane';
  else if (img.length > 2048) e.img_coffee_label = 'Max 2048 znaków';
  else if (!isReasonableUrl(img)) e.img_coffee_label = 'Podaj poprawny URL (https://…)';

  if (!f.bean_origin_country.trim()) e.bean_origin_country = 'Wybierz kraj';

  const farm = f.bean_origin_farm.trim();
  if (!farm) e.bean_origin_farm = 'Wymagane';
  else if (farm.length > 96) e.bean_origin_farm = 'Max 96 znaków';

  const trade = f.bean_origin_tradename.trim();
  if (!trade) e.bean_origin_tradename = 'Wymagane';
  else if (trade.length > 48) e.bean_origin_tradename = 'Max 48 znaków';

  const region = f.bean_origin_region.trim();
  if (!region) e.bean_origin_region = 'Wymagane';
  else if (region.length > 96) e.bean_origin_region = 'Max 96 znaków';

  if (f.bean_type !== 'arabica' && f.bean_type !== 'robusta') e.bean_type = 'Wybierz gatunek';

  const vm = f.bean_varietal_main.trim();
  if (!vm) e.bean_varietal_main = 'Wymagane';
  else if (vm.length > 48) e.bean_varietal_main = 'Max 48 znaków';

  const ve = f.bean_varietal_extra.trim();
  if (ve.length > 48) e.bean_varietal_extra = 'Max 48 znaków';

  const hRaw = f.bean_origin_height.trim();
  if (!hRaw) e.bean_origin_height = 'Wymagane';
  else if (!/^\d{1,4}$/.test(hRaw)) e.bean_origin_height = 'Liczba naturalna, max 4 cyfry';
  else {
    const h = Number(hRaw);
    if (!Number.isInteger(h) || h > 3000) e.bean_origin_height = 'Wartość 0–3000';
  }

  if (!f.bean_processing.trim()) e.bean_processing = 'Wybierz obróbkę';
  if (!f.bean_roast_date.trim()) e.bean_roast_date = 'Wymagane';
  else if (!ISO_DATE.test(f.bean_roast_date.trim()))
    e.bean_roast_date = 'Format RRRR-MM-DD';
  if (!f.bean_roast_level.trim()) e.bean_roast_level = 'Wybierz stopień wypału';
  if (!f.brew_method.trim()) e.brew_method = 'Wybierz przeznaczenie';

  return e;
}

export function formToInsert(f: RoasterCoffeeTagFormStrings): RoasterCoffeeTagInsert | null {
  const err = validateRoasterCoffeeTagForm(f);
  if (Object.keys(err).length > 0) return null;
  return {
    roaster_short_name: f.roaster_short_name.trim(),
    img_coffee_label: f.img_coffee_label.trim(),
    bean_origin_country: f.bean_origin_country.trim(),
    bean_origin_farm: f.bean_origin_farm.trim(),
    bean_origin_tradename: f.bean_origin_tradename.trim(),
    bean_origin_region: f.bean_origin_region.trim(),
    bean_type: f.bean_type as RoasterCoffeeBeanType,
    bean_varietal_main: f.bean_varietal_main.trim(),
    bean_varietal_extra: f.bean_varietal_extra.trim(),
    bean_origin_height: Number(f.bean_origin_height.trim()),
    bean_processing: f.bean_processing.trim(),
    bean_roast_date: f.bean_roast_date.trim(),
    bean_roast_level: f.bean_roast_level.trim(),
    brew_method: f.brew_method.trim(),
  };
}
