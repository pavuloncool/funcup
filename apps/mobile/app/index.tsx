import { Redirect } from 'expo-router';

/**
 * Expo: pierwotny AnimatedSplash jest w apps/frontend (Vite) i apps/web (Next) z assetami SVG.
 * Tu proste przekierowanie do shellu — bez duplikacji animacji opartej o canvas/DOM.
 */
export default function Index() {
  return <Redirect href="/home" />;
}
