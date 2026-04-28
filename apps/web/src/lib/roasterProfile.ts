export type RoasterProfile = {
  id: string;
  user_id: string;
  company_name: string | null;
  roaster_short_name: string | null;
  street: string | null;
  building_number: string | null;
  apartment_number: string | null;
  postal_code: string | null;
  city: string | null;
  regon: string | null;
  nip: string | null;
  subscription_status: string | null;
};

export type RoasterProfileFormValues = {
  company_name: string;
  roaster_short_name: string;
  street: string;
  building_number: string;
  apartment_number: string;
  postal_code: string;
  city: string;
  regon: string;
  nip: string;
};

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

export function emptyRoasterProfileFormValues(): RoasterProfileFormValues {
  return {
    company_name: '',
    roaster_short_name: '',
    street: '',
    building_number: '',
    apartment_number: '',
    postal_code: '',
    city: '',
    regon: '',
    nip: '',
  };
}

function isNonEmpty(value: string | null | undefined): boolean {
  return Boolean(value && value.trim());
}

export function isProfileComplete(profile: Partial<RoasterProfile> | null | undefined): boolean {
  if (!profile) return false;

  return REQUIRED_FIELDS.every((field) => {
    const value = profile[field as keyof RoasterProfile];
    return typeof value === 'string' ? isNonEmpty(value) : false;
  });
}

function normalizeNullableString(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

export function normalizeRoasterProfileRow(row: unknown): RoasterProfile | null {
  if (!row || typeof row !== 'object') return null;
  const value = row as Record<string, unknown>;

  if (typeof value.id !== 'string' || typeof value.user_id !== 'string') {
    return null;
  }

  return {
    id: value.id,
    user_id: value.user_id,
    company_name: normalizeNullableString(value.company_name),
    roaster_short_name: normalizeNullableString(value.roaster_short_name),
    street: normalizeNullableString(value.street),
    building_number: normalizeNullableString(value.building_number),
    apartment_number: normalizeNullableString(value.apartment_number),
    postal_code: normalizeNullableString(value.postal_code),
    city: normalizeNullableString(value.city),
    regon: normalizeNullableString(value.regon),
    nip: normalizeNullableString(value.nip),
    subscription_status: normalizeNullableString(value.subscription_status),
  };
}

export function profileToFormValues(profile: RoasterProfile): RoasterProfileFormValues {
  return {
    company_name: profile.company_name ?? '',
    roaster_short_name: profile.roaster_short_name ?? '',
    street: profile.street ?? '',
    building_number: profile.building_number ?? '',
    apartment_number: profile.apartment_number ?? '',
    postal_code: profile.postal_code ?? '',
    city: profile.city ?? '',
    regon: profile.regon ?? '',
    nip: profile.nip ?? '',
  };
}
