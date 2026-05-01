import { StyleSheet } from 'react-native';
import { visualSystemTokens } from '@funcup/shared';

export const screenErrorStyles = StyleSheet.create({
  wrap: {
    padding: 20,
    gap: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: visualSystemTokens.colors.danger,
    backgroundColor: visualSystemTokens.colors.surfaceMuted,
  },
  title: { fontSize: 17, fontWeight: '700', color: visualSystemTokens.colors.danger },
  body: { fontSize: 15, color: visualSystemTokens.colors.textSecondary },
  button: {
    alignSelf: 'flex-start',
    marginTop: 4,
    backgroundColor: visualSystemTokens.colors.danger,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  buttonLabel: { color: visualSystemTokens.colors.textOnPrimary, fontWeight: '600' },
});
