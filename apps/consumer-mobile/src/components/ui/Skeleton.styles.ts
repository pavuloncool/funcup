import { StyleSheet } from 'react-native';
import { visualSystemTokens } from '@funcup/shared';

export const skeletonStyles = StyleSheet.create({
  page: { padding: 24, gap: 16 },
  section: { gap: 10, paddingVertical: 8 },
  list: { gap: 12 },
  card: {
    borderWidth: 1,
    borderColor: visualSystemTokens.colors.borderSubtle,
    borderRadius: 10,
    padding: 12,
    gap: 8,
    backgroundColor: visualSystemTokens.colors.surface,
  },
  block: {
    borderRadius: 6,
    backgroundColor: visualSystemTokens.colors.borderSubtle,
  },
});
