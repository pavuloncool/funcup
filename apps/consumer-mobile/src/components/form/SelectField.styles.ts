import { StyleSheet } from 'react-native';

export const selectFieldStyles = StyleSheet.create({
  wrap: {
    width: '100%',
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 6,
  },
  trigger: {
    minHeight: 44,
    borderWidth: 2,
    borderColor: '#2a2a2a',
    borderRadius: 10,
    backgroundColor: '#f3f3f3',
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  triggerText: {
    fontSize: 15,
    color: '#090909',
  },
  triggerPlaceholder: {
    fontSize: 15,
    color: '#666666',
  },
  modalRoot: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  backdropFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheetWrap: {
    flex: 1,
    justifyContent: 'center',
    maxHeight: '100%',
  },
  sheet: {
    maxHeight: 360,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#1f1f1f',
    overflow: 'hidden',
  },
  optionRow: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#cccccc',
  },
  optionText: {
    fontSize: 16,
    color: '#111111',
  },
});
