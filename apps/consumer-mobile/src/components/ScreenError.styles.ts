import { StyleSheet } from 'react-native';

export const screenErrorStyles = StyleSheet.create({
  wrap: {
    padding: 20,
    gap: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fecaca',
    backgroundColor: '#fef2f2',
  },
  title: { fontSize: 17, fontWeight: '700', color: '#991b1b' },
  body: { fontSize: 15, color: '#7f1d1d' },
  button: {
    alignSelf: 'flex-start',
    marginTop: 4,
    backgroundColor: '#991b1b',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  buttonLabel: { color: '#ffffff', fontWeight: '600' },
});
