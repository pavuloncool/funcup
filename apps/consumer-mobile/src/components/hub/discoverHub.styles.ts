import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native';
import { visualSystemTokens } from '@funcup/shared';

export const discoverHubStyles = StyleSheet.create({
  list: { gap: 10 },
  card: {
    borderWidth: 1,
    borderColor: visualSystemTokens.colors.borderSubtle,
    borderRadius: 10,
    padding: 12,
    gap: 6,
    backgroundColor: visualSystemTokens.colors.surfaceElevated,
  },
  title: { fontSize: 16, fontWeight: '600', color: visualSystemTokens.colors.textPrimary },
});

export function followPressableStyle(isFollowed: boolean): ViewStyle {
  return {
    borderWidth: 1,
    borderColor: visualSystemTokens.colors.borderStrong,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: isFollowed ? visualSystemTokens.colors.accentPrimary : visualSystemTokens.colors.surfaceElevated,
  };
}

export function followLabelStyle(isFollowed: boolean): TextStyle {
  return { color: isFollowed ? visualSystemTokens.colors.textOnPrimary : visualSystemTokens.colors.textPrimary, fontWeight: '600' };
}
