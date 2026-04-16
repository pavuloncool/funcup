import { Link } from 'expo-router';
import { Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authScreenStyles as styles } from '../../src/theme/authScreenStyles';

export default function LoginFormScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <View style={styles.topSection}>
          <Pressable style={styles.socialButton} accessibilityRole="button">
            <View style={styles.googleIconWrap}>
              <Text style={styles.googleIconText}>G</Text>
            </View>
            <Text style={styles.socialButtonText}>Logowanie z Google</Text>
          </Pressable>

          <Pressable style={styles.socialButton} accessibilityRole="button">
            <Text style={styles.appleIcon}>A</Text>
            <Text style={styles.socialButtonText}>Logowanie z Apple</Text>
          </Pressable>

          <View style={styles.separatorRow}>
            <View style={styles.separatorLine} />
            <Text style={styles.separatorText}>lub</Text>
            <View style={styles.separatorLine} />
          </View>

          <TextInput
            style={styles.input}
            placeholder=""
            accessibilityLabel="Pole logowania"
            autoCapitalize="none"
          />

          <Pressable style={styles.loginAction} accessibilityRole="button">
            <Text style={styles.loginActionText}>Zaloguj</Text>
          </Pressable>
        </View>

        <Text style={styles.registerPrompt}>
          Nie masz konta?{' '}
          <Link href="/(auth)/register" style={styles.registerLink}>
            Zarejestruj.
          </Link>
        </Text>
      </View>
    </SafeAreaView>
  );
}
