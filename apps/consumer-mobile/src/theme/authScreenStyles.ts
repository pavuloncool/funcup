import { StyleSheet } from 'react-native';

/** Shared auth / form shell styles (from login screen). */
export const authScreenStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#e9e9e9',
  },
  screen: {
    flex: 1,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topSection: {
    width: '100%',
    maxWidth: 312,
    marginTop: 140,
    alignItems: 'center',
  },
  socialButton: {
    width: '100%',
    height: 44,
    borderWidth: 1,
    borderColor: '#1f1f1f',
    borderRadius: 5,
    backgroundColor: '#f3f3f3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    gap: 10,
  },
  googleIconWrap: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIconText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4285f4',
  },
  appleIcon: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111111',
  },
  socialButtonText: {
    fontSize: 30 / 2,
    color: '#171717',
    fontWeight: '500',
  },
  separatorRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#bcbcbc',
  },
  separatorText: {
    marginHorizontal: 12,
    fontSize: 32 / 2,
    color: '#181818',
  },
  input: {
    width: '100%',
    height: 42,
    borderWidth: 2,
    borderColor: '#2a2a2a',
    borderRadius: 10,
    backgroundColor: '#f3f3f3',
    paddingHorizontal: 12,
    marginBottom: 18,
  },
  loginAction: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  loginActionText: {
    fontSize: 46 / 2,
    fontWeight: '800',
    color: '#090909',
  },
  registerPrompt: {
    marginBottom: 88,
    fontSize: 27 / 2,
    color: '#212121',
  },
  registerLink: {
    color: '#111111',
    fontWeight: '700',
  },
});
