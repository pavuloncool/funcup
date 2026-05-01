import { StyleSheet } from 'react-native';
import { AppPanel, AppScreen, AppText } from '../../../src/components/ui/primitives';
import { visualSystemTokens } from '@funcup/shared';

export default function HubIndexScreen() {
  return (
    <AppScreen>
      <AppPanel style={styles.root} padded={false}>
        <AppPanel style={styles.headerWrap} padded={false}>
          <AppText variant="h2" weight="700" style={styles.screenTitle}>
            My Coffee House
          </AppText>
        </AppPanel>
        <AppPanel style={styles.emptyWrap}>
          <AppText variant="hero" weight="700" tone="secondary" style={styles.emptyTitle}>
            Fancy a fun cup?
          </AppText>
          <AppText variant="body" tone="secondary" style={styles.emptyText}>
            Scan your first Coffee using the QR scanner below.
          </AppText>
        </AppPanel>
      </AppPanel>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  headerWrap: { width: '100%', paddingHorizontal: 20, paddingTop: 10 },
  screenTitle: { alignSelf: 'flex-start' },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, gap: 10 },
  emptyTitle: { textAlign: 'center' },
  emptyText: { textAlign: 'center', lineHeight: 26, maxWidth: 360, color: visualSystemTokens.colors.textSecondary },
});
