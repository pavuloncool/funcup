import type { RoasterCoffeeTagFormStrings } from '../src/validation/roasterCoffeeTagForm';
import { Link, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SelectField, type SelectOption } from '../src/components/form/SelectField';
import { getResolvedSupabasePublicOrigin, supabase } from '../src/services/supabaseClient';
import { authScreenStyles } from '../src/theme/authScreenStyles';
import { formToInsert, validateRoasterCoffeeTagForm } from '../src/validation/roasterCoffeeTagForm';

const ORIGIN_COUNTRIES: SelectOption[] = [
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

const BEAN_TYPES: SelectOption[] = [
  { value: 'arabica', label: 'Arabica' },
  { value: 'robusta', label: 'Robusta' },
];

const PROCESSING: SelectOption[] = [
  { value: 'washed', label: 'Myta (washed)' },
  { value: 'natural', label: 'Naturalna' },
  { value: 'honey', label: 'Honey' },
  { value: 'anaerobic', label: 'Anaerobic' },
  { value: 'wet-hulled', label: 'Wet-hulled' },
];

const ROAST_LEVEL: SelectOption[] = [
  { value: 'light', label: 'Jasny' },
  { value: 'medium', label: 'Średni' },
  { value: 'dark', label: 'Ciemny' },
];

const BREW_METHOD: SelectOption[] = [
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

export default function RoasterAddCoffeeScreen() {
  const router = useRouter();
  const [form, setForm] = useState<RoasterCoffeeTagFormStrings>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState<SaveFeedback | null>(null);

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
      // Database placeholder types do not yet infer Insert for all tables; row matches migration + `RoasterCoffeeTagInsert`.
      const { data, error } = await supabase
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
    <SafeAreaView style={authScreenStyles.safeArea}>
      <ScrollView
        contentContainerStyle={local.scroll}
        keyboardShouldPersistTaps="handled"
        accessibilityLabel="Formularz roaster coffee tag"
      >
        <Text style={local.h1}>Dodaj tag kawy</Text>
        <Link href="/test-select-user" style={local.backLink}>
          Wróć do wyboru roli
        </Link>

        {saveFeedback?.kind === 'success' ? (
          <View style={local.feedbackOk} accessibilityLiveRegion="polite">
            <Text style={local.feedbackOkTitle}>Zapisano w tej samej bazie co Studio (127.0.0.1:54323)</Text>
            <Text style={local.feedbackBody}>
              Roaster: {saveFeedback.roaster_short_name}
              {'\n'}
              ID: {saveFeedback.id}
              {'\n'}
              W Studio: Table Editor → schema <Text style={local.mono}>public</Text> → tabela{' '}
              <Text style={local.mono}>roaster_coffee_tags</Text>. Odśwież stronę (⌘R). Szukaj po kolumnie{' '}
              <Text style={local.mono}>roaster_short_name</Text> albo po tym ID.
            </Text>
            <Pressable
              style={local.feedbackBtn}
              onPress={() => router.replace('/test-select-user')}
              accessibilityRole="button"
              accessibilityLabel="Wróć do wyboru roli po zapisie"
            >
              <Text style={local.feedbackBtnText}>Wróć do wyboru roli</Text>
            </Pressable>
          </View>
        ) : null}

        {saveFeedback?.kind === 'error' ? (
          <View style={local.feedbackErr} accessibilityLiveRegion="assertive">
            <Text style={local.feedbackErrTitle}>Błąd zapisu</Text>
            <Text style={local.feedbackBody}>{saveFeedback.message}</Text>
          </View>
        ) : null}

        <FieldLabel text="Nazwa roastera (skrót)" />
        <TextInput
          style={authScreenStyles.input}
          value={form.roaster_short_name}
          onChangeText={(t) => setField('roaster_short_name', t)}
          maxLength={64}
          placeholder="np. Bean Lab"
          accessibilityLabel="Nazwa roastera"
        />
        <Err msg={errors.roaster_short_name} />

        <FieldLabel text="URL zdjęcia etykiety / opakowania" />
        <TextInput
          style={authScreenStyles.input}
          value={form.img_coffee_label}
          onChangeText={(t) => setField('img_coffee_label', t)}
          placeholder="https://…"
          autoCapitalize="none"
          accessibilityLabel="URL zdjęcia etykiety"
        />
        <Err msg={errors.img_coffee_label} />

        <SelectField
          label="Kraj pochodzenia ziarna"
          value={form.bean_origin_country}
          options={ORIGIN_COUNTRIES}
          onChange={(v) => setField('bean_origin_country', v)}
          testID="select-bean-origin-country"
        />
        <Err msg={errors.bean_origin_country} />

        <FieldLabel text="Nazwa farmy" />
        <TextInput
          style={authScreenStyles.input}
          value={form.bean_origin_farm}
          onChangeText={(t) => setField('bean_origin_farm', t)}
          maxLength={96}
          accessibilityLabel="Nazwa farmy"
        />
        <Err msg={errors.bean_origin_farm} />

        <FieldLabel text="Nazwa handlowa ziarna" />
        <TextInput
          style={authScreenStyles.input}
          value={form.bean_origin_tradename}
          onChangeText={(t) => setField('bean_origin_tradename', t)}
          maxLength={48}
          accessibilityLabel="Nazwa handlowa ziarna"
        />
        <Err msg={errors.bean_origin_tradename} />

        <FieldLabel text="Region uprawy" />
        <TextInput
          style={authScreenStyles.input}
          value={form.bean_origin_region}
          onChangeText={(t) => setField('bean_origin_region', t)}
          maxLength={96}
          accessibilityLabel="Region uprawy"
        />
        <Err msg={errors.bean_origin_region} />

        <SelectField
          label="Gatunek kawy"
          value={form.bean_type}
          options={BEAN_TYPES}
          onChange={(v) => setField('bean_type', v as RoasterCoffeeTagFormStrings['bean_type'])}
        />
        <Err msg={errors.bean_type} />

        <FieldLabel text="Odmiana dominująca" />
        <TextInput
          style={authScreenStyles.input}
          value={form.bean_varietal_main}
          onChangeText={(t) => setField('bean_varietal_main', t)}
          maxLength={48}
          accessibilityLabel="Odmiana dominująca"
        />
        <Err msg={errors.bean_varietal_main} />

        <FieldLabel text="Odmiany dodatkowe (opcjonalnie)" />
        <TextInput
          style={authScreenStyles.input}
          value={form.bean_varietal_extra}
          onChangeText={(t) => setField('bean_varietal_extra', t)}
          maxLength={48}
          accessibilityLabel="Odmiany dodatkowe"
        />
        <Err msg={errors.bean_varietal_extra} />

        <FieldLabel text="Wysokość uprawy (m n.p.m.)" />
        <TextInput
          style={authScreenStyles.input}
          value={form.bean_origin_height}
          onChangeText={(t) => setField('bean_origin_height', t.replace(/\D/g, '').slice(0, 4))}
          keyboardType="number-pad"
          placeholder="np. 1800"
          accessibilityLabel="Wysokość uprawy"
        />
        <Err msg={errors.bean_origin_height} />

        <SelectField
          label="Obróbka ziarna"
          value={form.bean_processing}
          options={PROCESSING}
          onChange={(v) => setField('bean_processing', v)}
        />
        <Err msg={errors.bean_processing} />

        <FieldLabel text="Data wypału (RRRR-MM-DD)" />
        <View style={local.row}>
          <TextInput
            style={[authScreenStyles.input, local.dateInput]}
            value={form.bean_roast_date}
            onChangeText={(t) => setField('bean_roast_date', t)}
            placeholder={getTodayIso()}
            autoCapitalize="none"
            accessibilityLabel="Data wypału"
          />
          <Pressable
            style={local.todayBtn}
            onPress={() => setField('bean_roast_date', getTodayIso())}
            accessibilityRole="button"
            accessibilityLabel="Ustaw dzisiejszą datę"
          >
            <Text style={local.todayBtnText}>Dziś</Text>
          </Pressable>
        </View>
        <Err msg={errors.bean_roast_date} />

        <SelectField
          label="Stopień wypału"
          value={form.bean_roast_level}
          options={ROAST_LEVEL}
          onChange={(v) => setField('bean_roast_level', v)}
        />
        <Err msg={errors.bean_roast_level} />

        <SelectField
          label="Przeznaczenie / parzenie"
          value={form.brew_method}
          options={BREW_METHOD}
          onChange={(v) => setField('brew_method', v)}
        />
        <Err msg={errors.brew_method} />

        <Pressable
          testID="btn-save-coffee-tag"
          style={[authScreenStyles.socialButton, local.saveBtn]}
          onPress={onSave}
          disabled={saving}
          accessibilityRole="button"
          accessibilityLabel="Zapisz tag kawy"
        >
          {saving ? (
            <ActivityIndicator color="#111" />
          ) : (
            <Text style={authScreenStyles.socialButtonText}>Zapisz w Supabase</Text>
          )}
        </Pressable>

        {__DEV__ ? (
          <Text style={local.devHint} accessibilityLabel="Adres API Supabase w trybie deweloperskim">
            API: {getResolvedSupabasePublicOrigin()} — musi być 127.0.0.1:54321, żeby rekord pojawił się w lokalnym Studio
            (127.0.0.1:54323). Po zmianie .env.local: zatrzymaj Expo i uruchom ponownie z czyszczeniem cache (expo start -c).
          </Text>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function FieldLabel({ text }: { text: string }) {
  return <Text style={local.fieldLabel}>{text}</Text>;
}

function Err({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <Text style={local.err}>{msg}</Text>;
}

const local = StyleSheet.create({
  scroll: {
    paddingHorizontal: 16,
    paddingBottom: 48,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  h1: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111',
    marginTop: 8,
    marginBottom: 8,
  },
  backLink: {
    fontSize: 14,
    color: '#111',
    fontWeight: '600',
    textDecorationLine: 'underline',
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 6,
    alignSelf: 'stretch',
  },
  err: {
    color: '#b00020',
    fontSize: 12,
    marginBottom: 8,
    marginTop: -10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 18,
  },
  dateInput: {
    flex: 1,
    marginBottom: 0,
  },
  todayBtn: {
    height: 42,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#2a2a2a',
    justifyContent: 'center',
    backgroundColor: '#e0e0e0',
  },
  todayBtnText: {
    fontWeight: '700',
    color: '#111',
  },
  saveBtn: {
    marginTop: 8,
    marginBottom: 24,
  },
  devHint: {
    marginTop: 16,
    fontSize: 11,
    lineHeight: 16,
    color: '#555',
  },
  feedbackOk: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#1a7f37',
    backgroundColor: '#e8f5e9',
  },
  feedbackOkTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0d3b16',
    marginBottom: 8,
  },
  feedbackErr: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#b00020',
    backgroundColor: '#ffebee',
  },
  feedbackErrTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#7f1010',
    marginBottom: 8,
  },
  feedbackBody: {
    fontSize: 13,
    lineHeight: 18,
    color: '#1a1a1a',
  },
  mono: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#111',
  },
  feedbackBtn: {
    marginTop: 12,
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#111',
  },
  feedbackBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
