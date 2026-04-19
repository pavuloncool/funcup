import * as Linking from 'expo-linking';
import { Link, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authScreenStyles } from '../src/theme/authScreenStyles';

const ROASTER_WEB_BASE =
  process.env.EXPO_PUBLIC_ROASTER_WEB_URL?.replace(/\/$/, '') ?? 'http://localhost:3000';

export default function TestSelectUserScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={authScreenStyles.safeArea}>
      <View style={authScreenStyles.screen}>
        <View style={[authScreenStyles.topSection, local.topTight]}>
          <Text style={local.title} accessibilityRole="header">
            funcup
          </Text>
          <Text style={local.subtitle}>Wybierz ścieżkę (makieta)</Text>

          <Pressable
            testID="btn-add-coffee"
            style={authScreenStyles.socialButton}
            accessibilityRole="button"
            accessibilityLabel="Roaster"
            onPress={() => {
              void Linking.openURL(`${ROASTER_WEB_BASE}/tag`);
            }}
          >
            <Text style={authScreenStyles.socialButtonText}>Roaster</Text>
          </Pressable>

          <Pressable
            testID="btn-scan-coffee"
            style={authScreenStyles.socialButton}
            accessibilityRole="button"
            accessibilityLabel="Consumer"
            onPress={() => router.push('/(tabs)/hub/scan')}
          >
            <Text style={authScreenStyles.socialButtonText}>Consumer</Text>
          </Pressable>

          <View style={local.footer}>
            <Link href="/(auth)/login-form" style={authScreenStyles.registerLink}>
              Ekran logowania (opcjonalnie)
            </Link>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const local = StyleSheet.create({
  topTight: {
    marginTop: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#111',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#444',
    marginBottom: 28,
    textAlign: 'center',
  },
  footer: {
    marginTop: 24,
    marginBottom: 48,
  },
});
