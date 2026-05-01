import { StyleSheet } from 'react-native';
import { visualSystemTokens } from '@funcup/shared';

export const emptyStateStyles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 16,
    gap: 8,
  },
  icon: { marginBottom: 4 },
  title: { fontSize: 17, fontWeight: '700', color: visualSystemTokens.colors.textPrimary, textAlign: 'center' },
  description: { fontSize: 15, color: visualSystemTokens.colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  footer: { marginTop: 8, width: '100%', alignItems: 'center' },
});
