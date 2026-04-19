'use client';

import {
  formToInsert,
  type RoasterCoffeeTagFormStrings,
  validateRoasterCoffeeTagForm,
} from '@funcup/shared';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

import { supabaseBrowser } from '@/src/lib/supabase/browserClient';
import { getResolvedSupabasePublicOrigin } from '@/src/lib/supabasePublicOrigin';
import { authScreenStyles } from '@/src/theme/authScreenStyles';

const ORIGIN_COUNTRIES: { value: string; label: string }[] = [
  { value: 'Nicaragua', label: 'Nikaragua' },
  { value: 'Ethiopia', label: 'Etiopia' },
  { value: 'Colombia', label: 'Kolumbia' },
  { value: 'Kenya', label: 'Kenia' },
  { value: 'Brazil', label: 'Brazylia' },
  { value: 'Guatemala', label: 'Gwatemala' },
  { value: 'Costa Rica', label: 'Kostaryka' },
  { value: 'Indonesia', label: 'Indonezja' },
  { value: 'Rwanda', label: 'Rwanda' },
];

const BEAN_TYPES = [
  { value: 'arabica', label: 'Arabica' },
  { value: 'robusta', label: 'Robusta' },
];

const PROCESSING = [
  { value: 'washed', label: 'Myta (washed)' },
  { value: 'natural', label: 'Naturalna' },
  { value: 'honey', label: 'Honey' },
  { value: 'anaerobic', label: 'Anaerobic' },
  { value: 'wet-hulled', label: 'Wet-hulled' },
];

const ROAST_LEVEL = [
  { value: 'light', label: 'Jasny' },
  { value: 'medium', label: 'Średni' },
  { value: 'dark', label: 'Ciemny' },
];

const BREW_METHOD = [
  { value: 'espresso', label: 'Espresso' },
  { value: 'filter', label: 'Filtr' },
  { value: 'french_press', label: 'French press' },
  { value: 'other', label: 'Inne' },
];

const initialForm = (): RoasterCoffeeTagFormStrings => ({
  roaster_short_name: '',
  img_coffee_label: '',
  bean_origin_country: '',
  bean_origin_farm: '',
  bean_origin_tradename: '',
  bean_origin_region: '',
  bean_type: '',
  bean_varietal_main: '',
  bean_varietal_extra: '',
  bean_origin_height: '',
  bean_processing: '',
  bean_roast_date: '',
  bean_roast_level: '',
  brew_method: '',
});

const getTodayIso = (): string => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

type SaveFeedback =
  | { kind: 'success'; id: string; roaster_short_name: string }
  | { kind: 'error'; message: string };

export default function RoasterAddCoffeePage() {
  const router = useRouter();
  const [form, setForm] = useState<RoasterCoffeeTagFormStrings>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState<SaveFeedback | null>(null);

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'http://127.0.0.1:54321';

  const setField = useCallback(
    <K extends keyof RoasterCoffeeTagFormStrings>(key: K, value: RoasterCoffeeTagFormStrings[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const onSave = useCallback(async () => {
    const v = validateRoasterCoffeeTagForm(form);
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    const row = formToInsert(form);
    if (!row) return;

    setSaveFeedback(null);
    setSaving(true);
    try {
      const { data, error } = await supabaseBrowser
        .from('roaster_coffee_tags')
        .insert(row as never)
        .select('id, roaster_short_name')
        .single();
      if (error) {
        setSaveFeedback({ kind: 'error', message: error.message });
        return;
      }
      const saved = data as { id: string; roaster_short_name: string };
      setSaveFeedback({
        kind: 'success',
        id: saved.id,
        roaster_short_name: saved.roaster_short_name,
      });
    } finally {
      setSaving(false);
    }
  }, [form]);

  return (
    <div className={`${authScreenStyles.page} pb-12`}>
      <div className="mx-auto w-full max-w-[480px] px-4 pt-2">
        <h1 className="mb-2 mt-2 text-[22px] font-bold text-[#111]">Dodaj tag kawy</h1>
        <Link href="/role" className="mb-5 inline-block text-sm font-semibold text-[#111] underline">
          Wróć do wyboru roli
        </Link>

        {saveFeedback?.kind === 'success' ? (
          <div
            className="mb-4 rounded-[10px] border-2 border-[#1a7f37] bg-[#e8f5e9] p-3"
            role="status"
            aria-live="polite"
          >
            <p className="mb-2 text-sm font-bold text-[#0d3b16]">
              Zapisano w tej samej bazie co Studio (127.0.0.1:54323)
            </p>
            <p className="text-[13px] leading-relaxed text-[#1a1a1a]">
              Roaster: {saveFeedback.roaster_short_name}
              <br />
              ID: {saveFeedback.id}
              <br />
              W Studio: Table Editor → schema <code className="font-mono text-xs">public</code> → tabela{' '}
              <code className="font-mono text-xs">roaster_coffee_tags</code>. Odśwież stronę (⌘R). Szukaj po kolumnie{' '}
              <code className="font-mono text-xs">roaster_short_name</code> albo po tym ID.
            </p>
            <button
              type="button"
              className="mt-3 rounded-lg bg-[#111] px-3.5 py-2 text-sm font-semibold text-white"
              onClick={() => router.replace('/role')}
            >
              Wróć do wyboru roli
            </button>
          </div>
        ) : null}

        {saveFeedback?.kind === 'error' ? (
          <div
            className="mb-4 rounded-[10px] border-2 border-[#b00020] bg-[#ffebee] p-3"
            role="alert"
            aria-live="assertive"
          >
            <p className="mb-2 text-sm font-bold text-[#7f1010]">Błąd zapisu</p>
            <p className="text-[13px] leading-relaxed text-[#1a1a1a]">{saveFeedback.message}</p>
          </div>
        ) : null}

        <FieldLabel text="Nazwa roastera (skrót)" />
        <input
          className={authScreenStyles.input}
          value={form.roaster_short_name}
          onChange={(e) => setField('roaster_short_name', e.target.value)}
          maxLength={64}
          placeholder="np. Bean Lab"
          aria-label="Nazwa roastera"
        />
        <Err msg={errors.roaster_short_name} />

        <FieldLabel text="URL zdjęcia etykiety / opakowania" />
        <input
          className={authScreenStyles.input}
          value={form.img_coffee_label}
          onChange={(e) => setField('img_coffee_label', e.target.value)}
          placeholder="https://…"
          autoCapitalize="off"
          aria-label="URL zdjęcia etykiety"
        />
        <Err msg={errors.img_coffee_label} />

        <FieldLabel text="Kraj pochodzenia ziarna" />
        <select
          className={authScreenStyles.input}
          value={form.bean_origin_country}
          onChange={(e) => setField('bean_origin_country', e.target.value)}
          data-testid="select-bean-origin-country"
          aria-label="Kraj pochodzenia ziarna"
        >
          <option value="">— wybierz —</option>
          {ORIGIN_COUNTRIES.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <Err msg={errors.bean_origin_country} />

        <FieldLabel text="Nazwa farmy" />
        <input
          className={authScreenStyles.input}
          value={form.bean_origin_farm}
          onChange={(e) => setField('bean_origin_farm', e.target.value)}
          maxLength={96}
          aria-label="Nazwa farmy"
        />
        <Err msg={errors.bean_origin_farm} />

        <FieldLabel text="Nazwa handlowa ziarna" />
        <input
          className={authScreenStyles.input}
          value={form.bean_origin_tradename}
          onChange={(e) => setField('bean_origin_tradename', e.target.value)}
          maxLength={48}
          aria-label="Nazwa handlowa ziarna"
        />
        <Err msg={errors.bean_origin_tradename} />

        <FieldLabel text="Region uprawy" />
        <input
          className={authScreenStyles.input}
          value={form.bean_origin_region}
          onChange={(e) => setField('bean_origin_region', e.target.value)}
          maxLength={96}
          aria-label="Region uprawy"
        />
        <Err msg={errors.bean_origin_region} />

        <FieldLabel text="Gatunek kawy" />
        <select
          className={authScreenStyles.input}
          value={form.bean_type}
          onChange={(e) =>
            setField('bean_type', e.target.value as RoasterCoffeeTagFormStrings['bean_type'])
          }
          aria-label="Gatunek kawy"
        >
          <option value="">— wybierz —</option>
          {BEAN_TYPES.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <Err msg={errors.bean_type} />

        <FieldLabel text="Odmiana dominująca" />
        <input
          className={authScreenStyles.input}
          value={form.bean_varietal_main}
          onChange={(e) => setField('bean_varietal_main', e.target.value)}
          maxLength={48}
          aria-label="Odmiana dominująca"
        />
        <Err msg={errors.bean_varietal_main} />

        <FieldLabel text="Odmiany dodatkowe (opcjonalnie)" />
        <input
          className={authScreenStyles.input}
          value={form.bean_varietal_extra}
          onChange={(e) => setField('bean_varietal_extra', e.target.value)}
          maxLength={48}
          aria-label="Odmiany dodatkowe"
        />
        <Err msg={errors.bean_varietal_extra} />

        <FieldLabel text="Wysokość uprawy (m n.p.m.)" />
        <input
          className={authScreenStyles.input}
          value={form.bean_origin_height}
          onChange={(e) => setField('bean_origin_height', e.target.value.replace(/\D/g, '').slice(0, 4))}
          inputMode="numeric"
          placeholder="np. 1800"
          aria-label="Wysokość uprawy"
        />
        <Err msg={errors.bean_origin_height} />

        <FieldLabel text="Obróbka ziarna" />
        <select
          className={authScreenStyles.input}
          value={form.bean_processing}
          onChange={(e) => setField('bean_processing', e.target.value)}
          aria-label="Obróbka ziarna"
        >
          <option value="">— wybierz —</option>
          {PROCESSING.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <Err msg={errors.bean_processing} />

        <FieldLabel text="Data wypału (RRRR-MM-DD)" />
        <div className="mb-[18px] flex items-center gap-2">
          <input
            className={`${authScreenStyles.input} mb-0 flex-1`}
            value={form.bean_roast_date}
            onChange={(e) => setField('bean_roast_date', e.target.value)}
            placeholder={getTodayIso()}
            autoCapitalize="off"
            aria-label="Data wypału"
          />
          <button
            type="button"
            className="flex h-[42px] shrink-0 items-center justify-center rounded-[10px] border-2 border-[#2a2a2a] bg-[#e0e0e0] px-3.5 font-bold text-[#111]"
            onClick={() => setField('bean_roast_date', getTodayIso())}
          >
            Dziś
          </button>
        </div>
        <Err msg={errors.bean_roast_date} />

        <FieldLabel text="Stopień wypału" />
        <select
          className={authScreenStyles.input}
          value={form.bean_roast_level}
          onChange={(e) => setField('bean_roast_level', e.target.value)}
          aria-label="Stopień wypału"
        >
          <option value="">— wybierz —</option>
          {ROAST_LEVEL.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <Err msg={errors.bean_roast_level} />

        <FieldLabel text="Przeznaczenie / parzenie" />
        <select
          className={authScreenStyles.input}
          value={form.brew_method}
          onChange={(e) => setField('brew_method', e.target.value)}
          aria-label="Przeznaczenie"
        >
          <option value="">— wybierz —</option>
          {BREW_METHOD.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <Err msg={errors.brew_method} />

        <button
          type="button"
          data-testid="btn-save-coffee-tag"
          className={`${authScreenStyles.socialButton} mt-2 mb-6 w-full max-w-[480px]`}
          onClick={onSave}
          disabled={saving}
        >
          {saving ? (
            <span className="text-[#111]">…</span>
          ) : (
            <span className={authScreenStyles.socialButtonText}>Zapisz w Supabase</span>
          )}
        </button>

        {process.env.NODE_ENV === 'development' ? (
          <p className="mt-4 text-[11px] leading-relaxed text-[#555]" aria-label="Adres API Supabase w trybie deweloperskim">
            API: {getResolvedSupabasePublicOrigin(supabaseUrl)} — musi być 127.0.0.1:54321, żeby rekord pojawił się w lokalnym
            Studio (127.0.0.1:54323). Po zmianie .env.local: zrestartuj Next.
          </p>
        ) : null}
      </div>
    </div>
  );
}

function FieldLabel({ text }: { text: string }) {
  return <p className={authScreenStyles.fieldLabel}>{text}</p>;
}

function Err({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className={authScreenStyles.err}>{msg}</p>;
}
