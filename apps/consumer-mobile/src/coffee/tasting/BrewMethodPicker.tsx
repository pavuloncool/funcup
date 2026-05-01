import { AppPanel, AppText } from '../../components/ui/primitives';
import { StyleSheet } from 'react-native';

export function BrewMethodPicker() {
  return (
    <AppPanel style={styles.section}>
      <AppText variant="body" weight="600">Brew method</AppText>
      <AppText>Picker placeholder.</AppText>
    </AppPanel>
  );
}

const styles = StyleSheet.create({
  section: { paddingVertical: 12 },
});
