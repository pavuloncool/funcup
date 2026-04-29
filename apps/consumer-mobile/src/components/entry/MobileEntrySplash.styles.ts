import { StyleSheet } from 'react-native';

export const mobileEntrySplashStyles = StyleSheet.create({
  fill: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  white: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  hit: {
    minWidth: 160,
    minHeight: 160,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  wordmark: {
    marginTop: 16,
    fontSize: 28,
    letterSpacing: 1.2,
    color: '#1a1a1a',
    fontWeight: '400',
  },
  confettiFlash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26,26,26,0.12)',
  },
  particleHost: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
  },
  beanWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
