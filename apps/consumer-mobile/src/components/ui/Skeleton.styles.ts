import { StyleSheet } from 'react-native';

export const skeletonStyles = StyleSheet.create({
  page: { padding: 24, gap: 16 },
  section: { gap: 10, paddingVertical: 8 },
  list: { gap: 12 },
  card: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 12,
    gap: 8,
    backgroundColor: '#fafafa',
  },
  block: {
    borderRadius: 6,
    backgroundColor: '#e5e7eb',
  },
});
