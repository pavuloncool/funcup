import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { visualSystemTokens } from '@funcup/shared';

import { isProfileCompleted } from '../../src/features/profile/profileAccount';
import { AppScreen } from '../../src/components/ui/primitives';
import { supabase } from '../../src/services/supabaseClient';

export default function LoginScreen() {
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;

      if (data.session?.access_token) {
        const { data: userData } = await supabase.auth.getUser();
        if (!mounted) return;
        const postLoginPath = isProfileCompleted(userData.user) ? '/(tabs)/hub' : '/(auth)/complete-profile';
        router.replace(postLoginPath);
        return;
      }

      router.replace('/(auth)/login-form');
    };

    void bootstrap();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      if (session?.access_token) {
        const postLoginPath = isProfileCompleted(session.user) ? '/(tabs)/hub' : '/(auth)/complete-profile';
        router.replace(postLoginPath);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  return (
    <AppScreen style={styles.root}>
      <ActivityIndicator size="large" color={visualSystemTokens.colors.accentPrimary} />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: visualSystemTokens.colors.canvas, alignItems: 'center', justifyContent: 'center' },
});
