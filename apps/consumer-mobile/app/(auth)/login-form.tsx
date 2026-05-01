import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { authScreenStyles as styles } from '../../src/theme/authScreenStyles';
import { AppButton, AppInput, AppScreen } from '../../src/components/ui/primitives';
import { isProfileCompleted } from '../../src/features/profile/profileAccount';
import { supabase } from '../../src/services/supabaseClient';

export default function LoginFormScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Wpisz email i hasło.');
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    const postLoginPath = isProfileCompleted(data.user) ? '/(tabs)/hub' : '/(auth)/complete-profile';
    router.replace(postLoginPath);
  };

  return (
    <AppScreen>
      <View style={styles.screen}>
        <View style={styles.topSection}>
          <View style={styles.separatorRow}>
            <View style={styles.separatorLine} />
            <Text style={styles.separatorText}>Logowanie</Text>
            <View style={styles.separatorLine} />
          </View>

          <Text style={styles.fieldLabel}>Email</Text>
          <AppInput
            style={styles.input}
            placeholder="Email"
            accessibilityLabel="Email"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            textContentType="emailAddress"
            autoComplete="email"
            returnKeyType="next"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.fieldLabel}>Hasło</Text>
          <AppInput
            style={styles.input}
            placeholder="Hasło"
            accessibilityLabel="Hasło"
            secureTextEntry
            textContentType="password"
            autoComplete="current-password"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={() => void onLogin()}
            value={password}
            onChangeText={setPassword}
          />

          <AppButton label={loading ? 'Logowanie…' : 'Zaloguj'} onPress={() => void onLogin()} />

          <Link href="/(auth)/forgot-password" style={styles.registerLink}>
            Nie pamiętasz hasła?
          </Link>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

        </View>

        <Text style={styles.registerPrompt}>
          Nie masz konta?{' '}
          <Link href="/(auth)/register" style={styles.registerLink}>
            Zarejestruj.
          </Link>
        </Text>
      </View>
    </AppScreen>
  );
}
