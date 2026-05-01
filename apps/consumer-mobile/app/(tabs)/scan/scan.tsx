import { parseFuncupQrScanPayload } from '@funcup/shared';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Link, router } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
import { AppButton, AppInput, AppScreen, AppText } from '../../../src/components/ui/primitives';
import { visualSystemTokens } from '@funcup/shared';

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
      <AppScreen style={styles.centered}>
        <ActivityIndicator size="large" />
        <AppText tone="secondary">Sprawdzanie dostępu do kamery…</AppText>
      </AppScreen>
    );
  }

  if (!permission.granted) {
    return (
      <AppScreen style={styles.pad}>
        <AppText variant="h2" weight="700">Dostęp do kamery</AppText>
        <AppText tone="secondary" style={styles.body}>
          Aby skanować kody QR z opakowań kawy, zezwól aplikacji na użycie aparatu.
        </AppText>
        <AppButton label="Zezwól na kamerę" onPress={() => void requestPermission()} />
        <Link href="/(tabs)/hub" style={styles.link}>
          Wróć do Coffee Hub
        </Link>
      </AppScreen>
    );
  }

  return (
    <AppScreen style={styles.root}>
      <View style={styles.header}>
        <AppText variant="h2" weight="700">Skanuj kod</AppText>
        <AppText tone="secondary" style={styles.body}>
          Wskaż aparatem kod QR z etykiety. Link w kodzie musi wskazywać na stronę funcup w formacie
          /q/…
        </AppText>
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
          <AppText tone="danger">{parseError}</AppText>
          <AppButton label="Skanuj ponownie" onPress={handleRetry} />
        </View>
      ) : null}

      {__DEV__ ? (
        <View style={styles.devBox}>
          <AppText variant="caption" tone="muted">Dev: wklej URL lub hash</AppText>
          <AppInput
            value={devInput}
            onChangeText={setDevInput}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="https://…/q/… lub funcup://q/…"
          />
          <AppButton label="Otwórz" variant="secondary" onPress={submitDevInput} />
        </View>
      ) : null}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { padding: 20, paddingBottom: 12, gap: 8 },
  body: { lineHeight: 22 },
  link: { fontSize: 15, color: visualSystemTokens.colors.accentPrimary, fontWeight: '700', marginTop: 4 },
  cameraBox: { flex: 1, marginHorizontal: 16, marginBottom: 16, borderRadius: 16, overflow: 'hidden' },
  errorBox: { padding: 16, gap: 12, backgroundColor: visualSystemTokens.colors.surfaceMuted },
  pad: { flex: 1, padding: 24, gap: 12, justifyContent: 'center' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  devBox: { padding: 16, gap: 8, borderTopWidth: 1, borderTopColor: visualSystemTokens.colors.borderSubtle },
});
