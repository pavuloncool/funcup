import { getReputationLevel, getReputationLevelLabel } from '@funcup/shared';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  AVATAR_OPTIONS,
  changePasswordWithReauth,
  loadEditableProfile,
  requestEmailChange,
  resolveAvatarOption,
  saveEditableProfile,
  serializeAvatar,
} from '../../../src/features/profile/profileAccount';
import { supabase } from '../../../src/services/supabaseClient';

function isValidEmail(email: string): boolean {
  return /.+@.+\..+/.test(email);
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const demoReputationScore = 24;
  const reputationLevel = getReputationLevel(demoReputationScore);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);

  const [userId, setUserId] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [originalEmail, setOriginalEmail] = useState('');
  const [avatarValue, setAvatarValue] = useState(serializeAvatar(AVATAR_OPTIONS[0]));

  const [editMode, setEditMode] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

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

  const onSaveProfile = async () => {
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
      } else {
        setInfo('Dane profilu zapisane.');
      }

      setEditMode(false);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Nie udało się zapisać profilu.');
    } finally {
      setSaving(false);
    }
  };

  const onChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setError('Wypełnij wszystkie pola zmiany hasła.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Nowe hasło musi mieć min. 6 znaków.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError('Nowe hasła nie są takie same.');
      return;
    }

    if (currentPassword === newPassword) {
      setError('Nowe hasło musi być inne niż aktualne.');
      return;
    }

    setPasswordSaving(true);
    setError(null);
    setInfo(null);

    try {
      await changePasswordWithReauth({
        supabase,
        email: originalEmail,
        currentPassword,
        newPassword,
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setInfo('Hasło zostało zmienione.');
    } catch (passwordError) {
      setError(passwordError instanceof Error ? passwordError.message : 'Nie udało się zmienić hasła.');
    } finally {
      setPasswordSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={local.safeArea}>
        <View style={local.centered}>
          <Text>Ładowanie profilu…</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={local.safeArea}>
      <ScrollView contentContainerStyle={[local.content, { paddingBottom: 96 + insets.bottom }]}>
        <Text style={local.title}>Settings</Text>

        <View style={local.card}>
          <View style={local.headerRow}>
            <View style={[local.avatarCircle, { backgroundColor: selectedAvatar.color }]}>
              <Ionicons name={selectedAvatar.icon as never} size={26} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={local.name}>{displayName || 'Użytkownik'}</Text>
              <Text style={local.muted}>{email || 'Brak email'}</Text>
            </View>
          </View>

          <Pressable style={local.editButton} onPress={() => setEditMode((prev) => !prev)}>
            <Text style={local.editButtonText}>{editMode ? 'Zamknij edycję' : 'Edit profile settings'}</Text>
          </Pressable>
        </View>

        <View style={local.card}>
          <Text style={local.sectionTitle}>Sensory reputation</Text>
          <Text style={local.repLabel}>{getReputationLevelLabel(reputationLevel)}</Text>
          <Text style={local.muted}>Score: {demoReputationScore}</Text>
        </View>

        {editMode ? (
          <View style={local.card}>
            <Text style={local.sectionTitle}>Edycja profilu</Text>
            <TextInput
              style={local.input}
              placeholder="Nazwa użytkownika"
              value={displayName}
              onChangeText={setDisplayName}
              autoCapitalize="words"
            />
            <TextInput
              style={local.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
            />

            <Text style={local.subSectionLabel}>Avatar</Text>
            <View style={local.avatarGrid}>
              {AVATAR_OPTIONS.map((option) => {
                const selected = option.id === selectedAvatar.id;
                return (
                  <Pressable
                    key={option.id}
                    style={[local.avatarItem, selected && local.avatarItemSelected]}
                    onPress={() => setAvatarValue(serializeAvatar(option))}
                    accessibilityRole="button"
                    accessibilityLabel={`Avatar ${option.label}`}
                  >
                    <View style={[local.smallAvatarCircle, { backgroundColor: option.color }]}>
                      <Ionicons name={option.icon as never} size={22} color="#fff" />
                    </View>
                    <Text style={local.avatarLabel}>{option.label}</Text>
                  </Pressable>
                );
              })}
            </View>

            <Pressable
              style={[local.primaryButton, saving && local.disabledAction]}
              onPress={() => void onSaveProfile()}
              disabled={saving}
            >
              <Text style={local.primaryButtonText}>{saving ? 'Zapisywanie…' : 'Zapisz profil'}</Text>
            </Pressable>

            <View style={local.divider} />
            <Text style={local.sectionTitle}>Zmiana hasła</Text>
            <Text style={local.fieldLabel}>Aktualne hasło</Text>
            <TextInput
              style={local.input}
              placeholder="Aktualne hasło"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
              textContentType="password"
              autoComplete="current-password"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />
            <Text style={local.fieldLabel}>Nowe hasło</Text>
            <TextInput
              style={local.input}
              placeholder="Nowe hasło"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              textContentType="newPassword"
              autoComplete="new-password"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />
            <Text style={local.fieldLabel}>Powtórz nowe hasło</Text>
            <TextInput
              style={local.input}
              placeholder="Powtórz nowe hasło"
              value={confirmNewPassword}
              onChangeText={setConfirmNewPassword}
              secureTextEntry
              textContentType="newPassword"
              autoComplete="new-password"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={() => void onChangePassword()}
            />
            <Pressable
              style={[local.secondaryButton, passwordSaving && local.disabledAction]}
              onPress={() => void onChangePassword()}
              disabled={passwordSaving}
            >
              <Text style={local.secondaryButtonText}>{passwordSaving ? 'Zmiana hasła…' : 'Zmień hasło'}</Text>
            </Pressable>
          </View>
        ) : null}

        {error ? <Text style={local.errorText}>{error}</Text> : null}
        {info ? <Text style={local.infoText}>{info}</Text> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const local = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 20,
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  card: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 14,
    gap: 8,
    backgroundColor: '#ffffff',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  muted: {
    color: '#4b5563',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  repLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  editButton: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#2563eb',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 10,
  },
  editButtonText: {
    color: '#1d4ed8',
    fontWeight: '700',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#ffffff',
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },
  subSectionLabel: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 10,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  avatarItem: {
    width: '31%',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingVertical: 9,
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#f9fafb',
  },
  avatarItemSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  smallAvatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
  },
  primaryButton: {
    marginTop: 8,
    backgroundColor: '#1d4ed8',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 12,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#2563eb',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 6,
  },
  secondaryButtonText: {
    color: '#1d4ed8',
    fontWeight: '700',
  },
  disabledAction: {
    opacity: 0.6,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
  },
  infoText: {
    color: '#059669',
    fontSize: 14,
  },
});
