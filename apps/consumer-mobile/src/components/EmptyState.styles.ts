import { StyleSheet } from 'react-native';

export const emptyStateStyles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 16,
    gap: 8,
  },
  icon: { marginBottom: 4 },
  title: { fontSize: 17, fontWeight: '700', color: '#111827', textAlign: 'center' },
  description: { fontSize: 15, color: '#6b7280', textAlign: 'center', lineHeight: 22 },
  footer: { marginTop: 8, width: '100%', alignItems: 'center' },
});
