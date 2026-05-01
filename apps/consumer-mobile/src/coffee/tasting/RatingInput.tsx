import { AppPanel, AppText } from '../../components/ui/primitives';
import { StyleSheet } from 'react-native';

export function RatingInput() {
  return (
    <AppPanel style={styles.section}>
      <AppText variant="body" weight="600">Rating</AppText>
      <AppText>Rating input placeholder.</AppText>
    </AppPanel>
  );
}

const styles = StyleSheet.create({
  section: { paddingVertical: 12 },
});
