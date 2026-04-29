import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native';

export const discoverHubStyles = StyleSheet.create({
  list: { gap: 10 },
  card: {
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 10,
    padding: 12,
    gap: 6,
  },
  title: { fontSize: 16, fontWeight: '600' },
});

export function followPressableStyle(isFollowed: boolean): ViewStyle {
  return {
    borderWidth: 1,
    borderColor: '#111827',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: isFollowed ? '#111827' : '#ffffff',
  };
}

export function followLabelStyle(isFollowed: boolean): TextStyle {
  return { color: isFollowed ? '#ffffff' : '#111827', fontWeight: '600' };
}
