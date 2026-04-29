import { StyleSheet } from 'react-native';

export const rootErrorBoundaryStyles = StyleSheet.create({
  center: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fafafa',
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 20,
    backgroundColor: '#ffffff',
    gap: 12,
  },
  title: { fontSize: 20, fontWeight: '700', color: '#111827' },
  body: { fontSize: 15, color: '#4b5563' },
  button: {
    alignSelf: 'flex-start',
    backgroundColor: '#111827',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonLabel: { color: '#ffffff', fontWeight: '600', fontSize: 16 },
});
