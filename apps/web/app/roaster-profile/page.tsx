'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { useRoasterProfile } from '@/src/hooks/useRoasterProfile';
import {
  emptyRoasterProfileFormValues,
  isProfileComplete,
  profileToFormValues,
  type RoasterProfileFormValues,
} from '@/src/lib/roasterProfile';
import { supabaseBrowser } from '@/src/lib/supabase/browserClient';

import { roasterProfileStyles } from './roaster-profile.styles';

type Mode = 'create' | 'view' | 'edit';
type FormErrors = Partial<Record<keyof RoasterProfileFormValues, string>>;

const REQUIRED_FIELDS: Array<keyof RoasterProfileFormValues> = [
  'company_name',
  'roaster_short_name',
  'street',
  'building_number',
  'postal_code',
  'city',
  'regon',
  'nip',
];

function trimForm(values: RoasterProfileFormValues): RoasterProfileFormValues {
  return {
    company_name: values.company_name.trim(),
    roaster_short_name: values.roaster_short_name.trim(),
    street: values.street.trim(),
    building_number: values.building_number.trim(),
    apartment_number: values.apartment_number.trim(),
    postal_code: values.postal_code.trim(),
    city: values.city.trim(),
    regon: values.regon.trim(),
    nip: values.nip.trim(),
  };
}

function validateForm(values: RoasterProfileFormValues): FormErrors {
  const v = trimForm(values);
  const errors: FormErrors = {};

  REQUIRED_FIELDS.forEach((field) => {
    if (!v[field]) errors[field] = 'Pole wymagane.';
  });

  if (v.regon && !/^\d+$/.test(v.regon)) {
    errors.regon = 'REGON musi zawierać wyłącznie cyfry.';
  }
  if (v.nip && !/^\d+$/.test(v.nip)) {
    errors.nip = 'NIP musi zawierać wyłącznie cyfry.';
  }
  if (v.postal_code && !/^\d{2}-\d{3}$/.test(v.postal_code)) {
    errors.postal_code = 'Kod pocztowy musi mieć format NN-NNN.';
  }

  return errors;
}

function formatAddress(values: {
  street: string | null;
  building_number: string | null;
  apartment_number: string | null;
  postal_code: string | null;
  city: string | null;
}): string {
  const line1 = [values.street, values.building_number].filter(Boolean).join(' ');
  const apt = values.apartment_number ? `/${values.apartment_number}` : '';
  const line2 = [values.postal_code, values.city].filter(Boolean).join(' ');
  return `${line1}${apt}, ${line2}`.trim().replace(/^,\s*/, '');
}

export default function RoasterProfilePage() {
  const router = useRouter();
  const { loading, userId, profile, exists, complete, error: loadError, refresh } = useRoasterProfile();

  const [mode, setMode] = useState<Mode>('create');
  const [form, setForm] = useState<RoasterProfileFormValues>(emptyRoasterProfileFormValues());
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!userId) {
      router.replace('/login?next=/roaster-profile');
      return;
    }

    if (!exists || !profile) {
      setMode('create');
      setForm(emptyRoasterProfileFormValues());
      return;
    }

    setMode('view');
    setForm(profileToFormValues(profile));
  }, [exists, loading, profile, router, userId]);

  const address = useMemo(() => {
    if (!profile) return '—';
    const formatted = formatAddress(profile);
    return formatted || '—';
  }, [profile]);

  async function handleSave() {
    if (!userId) return;

    setSubmitError(null);
    const nextErrors = validateForm(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const values = trimForm(form);
    setSaving(true);

    const payload = {
      user_id: userId,
      name: values.company_name,
      company_name: values.company_name,
      roaster_short_name: values.roaster_short_name,
      street: values.street,
      building_number: values.building_number,
      apartment_number: values.apartment_number || null,
      postal_code: values.postal_code,
      city: values.city,
      regon: values.regon,
      nip: values.nip,
    };

    if (mode === 'create') {
      const { error } = await supabaseBrowser.from('roasters').insert(payload as never);
      if (error) {
        setSubmitError(error.message);
        setSaving(false);
        return;
      }
    } else {
      const { error } = await supabaseBrowser.from('roasters').update(payload as never).eq('user_id', userId);
      if (error) {
        setSubmitError(error.message);
        setSaving(false);
        return;
      }
    }

    await refresh();
    setSaving(false);
    setMode('view');

    if (isProfileComplete(values)) {
      router.replace('/roaster-hub');
    }
  }

  function startEdit() {
    if (!profile) return;
    setForm(profileToFormValues(profile));
    setErrors({});
    setSubmitError(null);
    setMode('edit');
  }

  function cancelEdit() {
    if (!profile) return;
    setForm(profileToFormValues(profile));
    setErrors({});
    setSubmitError(null);
    setMode('view');
  }

  if (loading) {
    return (
      <div className={roasterProfileStyles.pageWithPad}>
        <div className={roasterProfileStyles.narrowContent}>
          <p className={roasterProfileStyles.mutedSmall}>Ładowanie profilu palarni…</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className={roasterProfileStyles.pageWithPad}>
        <div className={roasterProfileStyles.narrowContent}>
          <p className={roasterProfileStyles.errorSmall}>Błąd ładowania: {loadError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={roasterProfileStyles.pageWithPad}>
      <div className={roasterProfileStyles.narrowContentMain}>
        <h1 className={roasterProfileStyles.pageTitle}>Profil palarni</h1>
        <Link href="/roaster-hub" className={roasterProfileStyles.backToHub}>
          Wróć do Roaster Hub
        </Link>

        {mode === 'view' && profile ? (
          <div className={roasterProfileStyles.viewCard}>
            <p className={roasterProfileStyles.viewModeHint}>Tryb podglądu</p>
            <dl className={roasterProfileStyles.dlRoot}>
              <div>
                <dt className={roasterProfileStyles.dlTerm}>Nazwa firmy</dt>
                <dd>{profile.company_name ?? '—'}</dd>
              </div>
              <div>
                <dt className={roasterProfileStyles.dlTerm}>Nazwa skrócona</dt>
                <dd>{profile.roaster_short_name ?? '—'}</dd>
              </div>
              <div>
                <dt className={roasterProfileStyles.dlTerm}>Adres</dt>
                <dd>{address}</dd>
              </div>
              <div>
                <dt className={roasterProfileStyles.dlTerm}>REGON</dt>
                <dd>{profile.regon ?? '—'}</dd>
              </div>
              <div>
                <dt className={roasterProfileStyles.dlTerm}>NIP</dt>
                <dd>{profile.nip ?? '—'}</dd>
              </div>
              <div>
                <dt className={roasterProfileStyles.dlTerm}>Subskrypcja</dt>
                <dd>{profile.subscription_status ?? 'placeholder'}</dd>
              </div>
            </dl>

            {!complete ? (
              <p className={roasterProfileStyles.incompleteBanner}>
                Profil niekompletny. Uzupełnij wszystkie wymagane pola, aby odblokować roaster hub.
              </p>
            ) : null}

            <button
              type="button"
              className={roasterProfileStyles.editCta}
              onClick={startEdit}
            >
              <span className={roasterProfileStyles.ctaText}>Edytuj dane</span>
            </button>
          </div>
        ) : (
          <form
            className={roasterProfileStyles.formCard}
            onSubmit={(event) => {
              event.preventDefault();
              void handleSave();
            }}
          >
            <p className={roasterProfileStyles.formIntro}>{mode === 'create' ? 'Utwórz profil palarni' : 'Edytuj profil palarni'}</p>

            <Field
              label="Zarejestrowana nazwa firmy"
              value={form.company_name}
              onChange={(value) => setForm((prev) => ({ ...prev, company_name: value }))}
              error={errors.company_name}
              required
            />
            <Field
              label="Nazwa skrócona palarni"
              value={form.roaster_short_name}
              onChange={(value) => setForm((prev) => ({ ...prev, roaster_short_name: value }))}
              error={errors.roaster_short_name}
              required
            />
            <Field
              label="Ulica"
              value={form.street}
              onChange={(value) => setForm((prev) => ({ ...prev, street: value }))}
              error={errors.street}
              required
            />
            <Field
              label="Numer budynku"
              value={form.building_number}
              onChange={(value) => setForm((prev) => ({ ...prev, building_number: value }))}
              error={errors.building_number}
              required
            />
            <Field
              label="Numer lokalu (opcjonalnie)"
              value={form.apartment_number}
              onChange={(value) => setForm((prev) => ({ ...prev, apartment_number: value }))}
              error={errors.apartment_number}
            />
            <Field
              label="Kod pocztowy"
              value={form.postal_code}
              onChange={(value) => setForm((prev) => ({ ...prev, postal_code: value }))}
              error={errors.postal_code}
              placeholder="00-000"
              required
            />
            <Field
              label="Miasto"
              value={form.city}
              onChange={(value) => setForm((prev) => ({ ...prev, city: value }))}
              error={errors.city}
              required
            />
            <Field
              label="REGON"
              value={form.regon}
              onChange={(value) => setForm((prev) => ({ ...prev, regon: value }))}
              error={errors.regon}
              required
            />
            <Field
              label="NIP"
              value={form.nip}
              onChange={(value) => setForm((prev) => ({ ...prev, nip: value }))}
              error={errors.nip}
              required
            />

            {submitError ? <p className={roasterProfileStyles.submitError}>{submitError}</p> : null}

            <button
              type="submit"
              className={roasterProfileStyles.saveCta}
              disabled={saving}
            >
              <span className={roasterProfileStyles.ctaText}>{saving ? 'Zapisywanie…' : 'Zapisz dane'}</span>
            </button>

            {mode === 'edit' ? (
              <button
                type="button"
                className={roasterProfileStyles.cancelButton}
                onClick={cancelEdit}
              >
                Anuluj
              </button>
            ) : null}
          </form>
        )}
      </div>
    </div>
  );
}

function Field(props: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
}) {
  const { label, value, onChange, error, placeholder, required } = props;

  return (
    <div className={roasterProfileStyles.fieldWrap}>
      <p className={roasterProfileStyles.fieldLabel}>
        {label}
        {required ? ' *' : ''}
      </p>
      <input
        className={roasterProfileStyles.fieldInput}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
      {error ? <p className={roasterProfileStyles.fieldError}>{error}</p> : null}
    </div>
  );
}
