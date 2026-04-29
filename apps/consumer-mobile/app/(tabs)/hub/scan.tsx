import { parseFuncupQrScanPayload } from '@funcup/shared';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Link, router } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from 'react-native';

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  const [devInput, setDevInput] = useState('');

  const handleBarcodeScanned = useCallback(
    ({ data }: { data: string }) => {
      if (scanned) return;
      setScanned(true);
      setParseError(null);
      const hash = parseFuncupQrScanPayload(data);
      if (hash) {
        router.replace({ pathname: '/q/[hash]', params: { hash } });
        return;
      }
      setParseError(
        'Nie rozpoznano kodu funcup. Zeskanuj kod z aplikacji palarni (adres zakończony na /q/…).'
      );
    },
    [scanned]
  );

  const handleRetry = useCallback(() => {
    setScanned(false);
    setParseError(null);
  }, []);

  const submitDevInput = useCallback(() => {
    const hash = parseFuncupQrScanPayload(devInput);
    if (hash) {
      router.replace({ pathname: '/q/[hash]', params: { hash } });
      return;
    }
    setParseError('Wklejono niepoprawny URL lub hash.');
  }, [devInput]);

  if (!permission) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.muted}>Sprawdzanie dostępu do kamery…</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.pad}>
        <Text style={styles.title}>Dostęp do kamery</Text>
        <Text style={styles.body}>
          Aby skanować kody QR z opakowań kawy, zezwól aplikacji na użycie aparatu.
        </Text>
        <Pressable style={styles.primaryBtn} onPress={() => void requestPermission()}>
          <Text style={styles.primaryBtnText}>Zezwól na kamerę</Text>
        </Pressable>
        <Link href="/(tabs)/hub" style={styles.link}>
          Wróć do Coffee Hub
        </Link>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>Skanuj kod</Text>
        <Text style={styles.body}>
          Wskaż aparatem kod QR z etykiety. Link w kodzie musi wskazywać na stronę funcup w formacie
          /q/…
        </Text>
        <Link href="/(tabs)/hub" style={styles.link}>
          Wróć do Coffee Hub
        </Link>
      </View>

      <View style={styles.cameraBox}>
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        />
      </View>

      {parseError ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{parseError}</Text>
          <Pressable style={styles.primaryBtn} onPress={handleRetry}>
            <Text style={styles.primaryBtnText}>Skanuj ponownie</Text>
          </Pressable>
        </View>
      ) : null}

      {__DEV__ ? (
        <View style={styles.devBox}>
          <Text style={styles.devLabel}>Dev: wklej URL lub hash</Text>
          <TextInput
            value={devInput}
            onChangeText={setDevInput}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="https://…/q/… lub funcup://q/…"
            style={styles.input}
          />
          <Pressable style={styles.secondaryBtn} onPress={submitDevInput}>
            <Text style={styles.secondaryBtnText}>Otwórz</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#111827' },
  header: { padding: 20, paddingBottom: 12, gap: 8 },
  title: { fontSize: 22, fontWeight: '700', color: '#fff' },
  body: { fontSize: 15, color: '#d1d5db', lineHeight: 22 },
  link: { fontSize: 15, color: '#f59e0b', fontWeight: '600', marginTop: 4 },
  cameraBox: { flex: 1, marginHorizontal: 16, marginBottom: 16, borderRadius: 16, overflow: 'hidden' },
  errorBox: { padding: 16, gap: 12, backgroundColor: '#1f2937' },
  errorText: { color: '#fecaca', fontSize: 14 },
  primaryBtn: {
    backgroundColor: '#f59e0b',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  primaryBtnText: { color: '#111827', fontWeight: '700', fontSize: 16 },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: '#6b7280',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryBtnText: { color: '#e5e7eb', fontWeight: '600' },
  pad: { flex: 1, padding: 24, gap: 12, justifyContent: 'center', backgroundColor: '#111827' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12, backgroundColor: '#111827' },
  muted: { color: '#9ca3af' },
  devBox: { padding: 16, gap: 8, borderTopWidth: 1, borderTopColor: '#374151' },
  devLabel: { fontSize: 12, color: '#9ca3af' },
  input: {
    borderWidth: 1,
    borderColor: '#4b5563',
    borderRadius: 8,
    padding: 12,
    color: '#f9fafb',
    backgroundColor: '#1f2937',
  },
});
