import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { isProfileCompleted } from '../../src/features/profile/profileAccount';
import { supabase } from '../../src/services/supabaseClient';
import { authScreenStyles as styles } from '../../src/theme/authScreenStyles';
import { AppButton, AppInput, AppScreen } from '../../src/components/ui/primitives';

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onRegister = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Wpisz email i hasło.');
      return;
    }
    if (password.length < 6) {
      setError('Hasło musi mieć min. 6 znaków.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Hasła nie są takie same.');
      return;
    }

    setLoading(true);
    setError(null);
    setInfo(null);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          profile_completed: false,
        },
      },
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    if (data.session?.access_token) {
      const postRegisterPath = isProfileCompleted(data.user) ? '/(tabs)/hub' : '/(auth)/complete-profile';
      router.replace(postRegisterPath);
      return;
    }

    setInfo('Konto utworzone. Sprawdź email i potwierdź rejestrację, potem zaloguj się.');
  };

  return (
    <AppScreen>
      <View style={styles.screen}>
        <View style={styles.topSection}>
          <View style={styles.separatorRow}>
            <View style={styles.separatorLine} />
            <Text style={styles.separatorText}>Rejestracja</Text>
            <View style={styles.separatorLine} />
          </View>

          <Text style={styles.fieldLabel}>Email</Text>
          <AppInput
            style={styles.input}
            placeholder="name@example.com"
            accessibilityLabel="Adres email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            textContentType="emailAddress"
            autoComplete="email"
            returnKeyType="next"
          />

          <Text style={styles.fieldLabel}>Hasło</Text>
          <AppInput
            style={styles.input}
            placeholder="Minimum 6 znaków"
            accessibilityLabel="Hasło"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            textContentType="newPassword"
            autoComplete="new-password"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
          />
          
          <Text style={styles.fieldLabel}>Powtórz hasło</Text>
          <AppInput
            style={styles.input}
            placeholder="Powtórz hasło"
            accessibilityLabel="Powtórz hasło"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            textContentType="newPassword"
            autoComplete="new-password"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={() => void onRegister()}
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          {info ? <Text style={styles.infoText}>{info}</Text> : null}

          <AppButton label={loading ? 'Tworzenie…' : 'Załóż konto'} onPress={() => void onRegister()} />
        </View>

        <Text style={styles.registerPrompt}>
          Masz konto?{' '}
          <Link href="/(auth)/login-form" style={styles.registerLink}>
            Zaloguj.
          </Link>
        </Text>
      </View>
    </AppScreen>
  );
}
