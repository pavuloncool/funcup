import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  AVATAR_OPTIONS,
  loadEditableProfile,
  requestEmailChange,
  resolveAvatarOption,
  saveEditableProfile,
  serializeAvatar,
} from '../../src/features/profile/profileAccount';
import { supabase } from '../../src/services/supabaseClient';
import { authScreenStyles as styles } from '../../src/theme/authScreenStyles';

function isValidEmail(email: string): boolean {
  return /.+@.+\..+/.test(email);
}

export default function CompleteProfileScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [userId, setUserId] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [originalEmail, setOriginalEmail] = useState('');
  const [avatarValue, setAvatarValue] = useState(serializeAvatar(AVATAR_OPTIONS[0]));

  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const selectedAvatar = useMemo(() => resolveAvatarOption(avatarValue), [avatarValue]);

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      try {
        const profile = await loadEditableProfile(supabase);
        if (!mounted) return;

        setUserId(profile.userId);
        setDisplayName(profile.displayName);
        setEmail(profile.email);
        setOriginalEmail(profile.email);
        setAvatarValue(profile.avatarUrl);
      } catch (bootstrapError) {
        if (!mounted) return;
        setError(bootstrapError instanceof Error ? bootstrapError.message : 'Nie udało się załadować profilu.');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void bootstrap();

    return () => {
      mounted = false;
    };
  }, []);

  const onSave = async () => {
    const trimmedName = displayName.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName) {
      setError('Podaj nazwę użytkownika.');
      return;
    }

    if (!trimmedEmail || !isValidEmail(trimmedEmail)) {
      setError('Podaj poprawny adres email.');
      return;
    }

    setSaving(true);
    setError(null);
    setInfo(null);

    try {
      await saveEditableProfile({
        supabase,
        userId,
        displayName: trimmedName,
        avatarUrl: avatarValue,
        markCompleted: true,
      });

      if (trimmedEmail !== originalEmail.toLowerCase()) {
        const result = await requestEmailChange({
          supabase,
          nextEmail: trimmedEmail,
        });

        if (result.simulated) {
          setInfo('Wersja developerska: zasymulowano potwierdzenie zmiany email.');
        } else {
          setInfo('Wysłaliśmy link potwierdzający zmianę email na nowy adres.');
        }
      }

      router.replace('/(tabs)/profile');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Nie udało się zapisać profilu.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.screen}>
          <View style={[styles.topSection, local.center]}>
            <Text>Ładowanie profilu…</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <ScrollView
          style={local.scroll}
          contentContainerStyle={local.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topSection}>
          <View style={styles.separatorRow}>
            <View style={styles.separatorLine} />
            <Text style={styles.separatorText}>Uzupełnij profil</Text>
            <View style={styles.separatorLine} />
          </View>

          <Text style={styles.fieldLabel}>Nazwa użytkownika *</Text>
          <TextInput
            style={styles.input}
            placeholder="Np. Jan Kowalski"
            value={displayName}
            onChangeText={setDisplayName}
            autoCapitalize="words"
          />

          <Text style={styles.fieldLabel}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="name@example.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
          />

          <Text style={styles.fieldLabel}>Avatar</Text>
          <View style={local.avatarGrid}>
            {AVATAR_OPTIONS.map((option) => {
              const selected = option.id === selectedAvatar.id;
              return (
                <Pressable
                  key={option.id}
                  onPress={() => setAvatarValue(serializeAvatar(option))}
                  style={[local.avatarItem, selected && local.avatarItemSelected]}
                  accessibilityRole="button"
                  accessibilityLabel={`Avatar ${option.label}`}
                >
                  <View style={[local.avatarCircle, { backgroundColor: option.color }]}>
                    <Ionicons name={option.icon as never} size={24} color="#fff" />
                  </View>
                  <Text style={local.avatarLabel}>{option.label}</Text>
                </Pressable>
              );
            })}
          </View>

          {error ? <Text style={local.errorText}>{error}</Text> : null}
          {info ? <Text style={local.infoText}>{info}</Text> : null}

          <Pressable
            style={[styles.loginAction, local.primaryAction, saving && local.disabledAction]}
            accessibilityRole="button"
            onPress={() => void onSave()}
            disabled={saving}
          >
            <Text style={styles.loginActionText}>{saving ? 'Zapisywanie…' : 'Zapisz i przejdź do profilu'}</Text>
          </Pressable>
        </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const local = StyleSheet.create({
  scroll: {
    width: '100%',
  },
  content: {
    paddingBottom: 24,
  },
  center: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 18,
  },
  avatarItem: {
    width: '31%',
    borderWidth: 1,
    borderColor: '#c9ced6',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ffffff',
  },
  avatarItemSelected: {
    borderColor: '#111827',
    backgroundColor: '#ffffff',
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLabel: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
  },
  primaryAction: {
    marginTop: 8,
  },
  disabledAction: {
    opacity: 0.6,
  },
  errorText: {
    width: '100%',
    color: '#dc2626',
    marginBottom: 8,
  },
  infoText: {
    width: '100%',
    color: '#059669',
    marginBottom: 8,
  },
});
