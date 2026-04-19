'use client';

import {
  assertCoffeeLabelFileSize,
  clientFormValuesToInsert,
  getTodayIsoDateString,
  roasterCoffeeTagClientFormSchema,
  type RoasterCoffeeTagClientFormInput,
  type RoasterCoffeeTagClientFormValues,
} from '@funcup/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { CalendarDays } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FilePond, registerPlugin } from 'react-filepond';

import { Calendar } from '@/src/components/ui/calendar';
import { Button } from '@/src/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/src/components/ui/popover';
import { supabaseBrowser } from '@/src/lib/supabase/browserClient';
import { uploadCoffeeLabelToSupabase } from '@/src/lib/uploadCoffeeLabel';
import { getResolvedSupabasePublicOrigin } from '@/src/lib/supabasePublicOrigin';
import { cn } from '@/src/lib/utils';
import { authScreenStyles } from '@/src/theme/authScreenStyles';

import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';

import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

registerPlugin(FilePondPluginFileValidateType, FilePondPluginFileValidateSize, FilePondPluginImagePreview);

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

function parseLocalIsoDate(iso: string): Date | undefined {
  const t = iso.trim();
  if (!t || !/^\d{4}-\d{2}-\d{2}$/.test(t)) return undefined;
  const [y, m, d] = t.split('-').map(Number);
  return new Date(y, m - 1, d);
}

const defaultFormValues = (): RoasterCoffeeTagClientFormInput => ({
  roaster_short_name: '',
  coffeeLabelFile: undefined,
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

type SaveFeedback =
  | { kind: 'success'; id: string; roaster_short_name: string }
  | { kind: 'error'; message: string };

export default function RoasterAddCoffeePage() {
  const router = useRouter();
  const [saveFeedback, setSaveFeedback] = useState<SaveFeedback | null>(null);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'http://127.0.0.1:54321';

  const form = useForm<RoasterCoffeeTagClientFormInput, unknown, RoasterCoffeeTagClientFormValues>({
    resolver: zodResolver(roasterCoffeeTagClientFormSchema),
    defaultValues: defaultFormValues(),
    mode: 'onSubmit',
  });

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  const coffeeLabelFile = watch('coffeeLabelFile');

  const pondFiles = useMemo(() => {
    return coffeeLabelFile instanceof File ? [coffeeLabelFile] : [];
  }, [coffeeLabelFile]);

  const onSubmit = useCallback(
    async (values: RoasterCoffeeTagClientFormValues) => {
      setSaveFeedback(null);
      if (!(values.coffeeLabelFile instanceof File)) {
        throw new Error('Image upload failed');
      }
      assertCoffeeLabelFileSize(values.coffeeLabelFile);

      let coffeeLabelUrl: string;
      try {
        coffeeLabelUrl = await uploadCoffeeLabelToSupabase(
          supabaseBrowser,
          values.coffeeLabelFile,
          values.roaster_short_name
        );
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Upload nie powiódł się';
        setSaveFeedback({ kind: 'error', message });
        return;
      }

      if (!coffeeLabelUrl) {
        throw new Error('Image upload failed');
      }

      const row = clientFormValuesToInsert(values, coffeeLabelUrl);

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
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Błąd zapisu';
        setSaveFeedback({ kind: 'error', message });
      }
    },
    []
  );

  const setTodayRoastDate = useCallback(() => {
    setValue('bean_roast_date', getTodayIsoDateString(), { shouldValidate: true });
  }, [setValue]);

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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-0">
          <FieldLabel text="Nazwa roastera (skrót)" />
          <input
            className={authScreenStyles.input}
            {...register('roaster_short_name')}
            maxLength={64}
            placeholder="np. Bean Lab"
            aria-label="Nazwa roastera"
            autoComplete="organization"
          />
          <Err msg={errors.roaster_short_name?.message} />

          <FieldLabel text="Zdjęcie etykiety / opakowania" />
          <div className="mb-[18px]" data-testid="coffee-label-filepond">
            <Controller
              name="coffeeLabelFile"
              control={control}
              render={({ field: { onChange } }) => (
                <FilePond
                  files={pondFiles}
                  allowMultiple={false}
                  maxFiles={1}
                  instantUpload={false}
                  credits={false}
                  allowImagePreview
                  acceptedFileTypes={['image/jpeg', 'image/png', 'image/webp']}
                  maxFileSize="512KB"
                  labelIdle='Przeciągnij obraz lub <span class="filepond--label-action">wybierz</span>'
                  onupdatefiles={(items) => {
                    const f = items[0]?.file;
                    onChange(f instanceof File ? f : undefined);
                  }}
                />
              )}
            />
          </div>
          <Err msg={errors.coffeeLabelFile?.message} />

          <FieldLabel text="Kraj pochodzenia ziarna" />
          <select
            className={authScreenStyles.input}
            {...register('bean_origin_country')}
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
          <Err msg={errors.bean_origin_country?.message} />

          <FieldLabel text="Nazwa farmy" />
          <input
            className={authScreenStyles.input}
            {...register('bean_origin_farm')}
            maxLength={96}
            aria-label="Nazwa farmy"
          />
          <Err msg={errors.bean_origin_farm?.message} />

          <FieldLabel text="Nazwa handlowa ziarna" />
          <input
            className={authScreenStyles.input}
            {...register('bean_origin_tradename')}
            maxLength={48}
            aria-label="Nazwa handlowa ziarna"
          />
          <Err msg={errors.bean_origin_tradename?.message} />

          <FieldLabel text="Region uprawy" />
          <input
            className={authScreenStyles.input}
            {...register('bean_origin_region')}
            maxLength={96}
            aria-label="Region uprawy"
          />
          <Err msg={errors.bean_origin_region?.message} />

          <FieldLabel text="Gatunek kawy" />
          <select
            className={authScreenStyles.input}
            {...register('bean_type')}
            aria-label="Gatunek kawy"
          >
            <option value="">— wybierz —</option>
            {BEAN_TYPES.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <Err msg={errors.bean_type?.message} />

          <FieldLabel text="Odmiana dominująca" />
          <input
            className={authScreenStyles.input}
            {...register('bean_varietal_main')}
            maxLength={48}
            aria-label="Odmiana dominująca"
          />
          <Err msg={errors.bean_varietal_main?.message} />

          <FieldLabel text="Odmiany dodatkowe (opcjonalnie)" />
          <input
            className={authScreenStyles.input}
            {...register('bean_varietal_extra')}
            maxLength={48}
            aria-label="Odmiany dodatkowe"
          />
          <Err msg={errors.bean_varietal_extra?.message} />

          <FieldLabel text="Wysokość uprawy (m n.p.m.)" />
          <input
            className={authScreenStyles.input}
            {...register('bean_origin_height')}
            inputMode="numeric"
            placeholder="np. 1800"
            aria-label="Wysokość uprawy"
          />
          <Err msg={errors.bean_origin_height?.message} />

          <FieldLabel text="Obróbka ziarna" />
          <select
            className={authScreenStyles.input}
            {...register('bean_processing')}
            aria-label="Obróbka ziarna"
          >
            <option value="">— wybierz —</option>
            {PROCESSING.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <Err msg={errors.bean_processing?.message} />

          <FieldLabel text="Data wypału" />
          <div className="mb-[18px] flex flex-wrap items-center gap-2">
            <Controller
              name="bean_roast_date"
              control={control}
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      data-testid="date-picker-roast-trigger"
                      className={cn(
                        authScreenStyles.input,
                        'mb-0 flex h-[42px] flex-1 min-w-[200px] justify-between text-left font-normal'
                      )}
                      aria-label="Data wypału — otwórz kalendarz"
                    >
                      {field.value ? (
                        format(parseLocalIsoDate(field.value) ?? new Date(), 'd MMM yyyy', { locale: pl })
                      ) : (
                        <span className="text-[#888]">Wybierz datę</span>
                      )}
                      <CalendarDays className="h-4 w-4 shrink-0 opacity-60" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      locale={pl}
                      selected={parseLocalIsoDate(field.value)}
                      onSelect={(d) => {
                        field.onChange(d ? format(d, 'yyyy-MM-dd') : '');
                      }}
                      disabled={(date) => {
                        const t = new Date();
                        t.setHours(0, 0, 0, 0);
                        const x = new Date(date);
                        x.setHours(0, 0, 0, 0);
                        return x.getTime() > t.getTime();
                      }}
                      defaultMonth={parseLocalIsoDate(field.value) ?? new Date()}
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            <Button
              type="button"
              variant="outline"
              data-testid="btn-roast-date-today"
              className="h-[42px] shrink-0 rounded-[10px] border-2 border-[#2a2a2a] bg-[#e0e0e0] px-3.5 font-bold text-[#111] hover:bg-[#d5d5d5]"
              onClick={setTodayRoastDate}
            >
              Dziś
            </Button>
          </div>
          <Err msg={errors.bean_roast_date?.message} />

          <FieldLabel text="Stopień wypału" />
          <select
            className={authScreenStyles.input}
            {...register('bean_roast_level')}
            aria-label="Stopień wypału"
          >
            <option value="">— wybierz —</option>
            {ROAST_LEVEL.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <Err msg={errors.bean_roast_level?.message} />

          <FieldLabel text="Przeznaczenie / parzenie" />
          <select
            className={authScreenStyles.input}
            {...register('brew_method')}
            aria-label="Przeznaczenie"
          >
            <option value="">— wybierz —</option>
            {BREW_METHOD.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <Err msg={errors.brew_method?.message} />

          <button
            type="submit"
            data-testid="btn-save-coffee-tag"
            className={`${authScreenStyles.socialButton} mt-2 mb-6 w-full max-w-[480px]`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="text-[#111]">…</span>
            ) : (
              <span className={authScreenStyles.socialButtonText}>Zapisz w Supabase</span>
            )}
          </button>
        </form>

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
