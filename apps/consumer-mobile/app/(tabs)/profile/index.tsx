import { getReputationLevel, getReputationLevelLabel, visualSystemTokens } from '@funcup/shared';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppButton, AppCard, AppInput, AppScreen, AppScrollScreen, AppText } from '../../../src/components/ui/primitives';

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

const { colors, spacing, radius } = visualSystemTokens;

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
      <AppScreen>
        <View style={local.centered}>
          <AppText>Ładowanie profilu…</AppText>
        </View>
      </AppScreen>
    );
  }

  return (
    <AppScrollScreen contentContainerStyle={[local.content, { paddingBottom: 96 + insets.bottom }]}>
        <AppText variant="h1" weight="700">Settings</AppText>

        <AppCard>
          <View style={local.headerRow}>
            <View style={[local.avatarCircle, { backgroundColor: selectedAvatar.color }]}>
              <Ionicons name={selectedAvatar.icon as never} size={26} color={colors.textOnPrimary} />
            </View>
            <View style={local.headerTextWrap}>
              <AppText variant="h3" weight="700">{displayName || 'Użytkownik'}</AppText>
              <AppText tone="secondary">{email || 'Brak email'}</AppText>
            </View>
          </View>

          <AppButton
            label={editMode ? 'Zamknij edycję' : 'Edit profile settings'}
            variant="secondary"
            onPress={() => setEditMode((prev) => !prev)}
          />
        </AppCard>

        <AppCard>
          <AppText variant="body" weight="600">Sensory reputation</AppText>
          <AppText variant="h2" weight="700">{getReputationLevelLabel(reputationLevel)}</AppText>
          <AppText tone="secondary">Score: {demoReputationScore}</AppText>
        </AppCard>

        {editMode ? (
          <AppCard>
            <AppText variant="body" weight="600">Edycja profilu</AppText>
            <AppInput
              style={local.input}
              placeholder="Nazwa użytkownika"
              value={displayName}
              onChangeText={setDisplayName}
              autoCapitalize="words"
            />
            <AppInput
              style={local.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
            />

            <AppText variant="bodySm" weight="600" style={local.subSectionLabel}>Avatar</AppText>
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
                      <Ionicons name={option.icon as never} size={22} color={colors.textOnPrimary} />
                    </View>
                    <AppText variant="caption" weight="600" tone="secondary">{option.label}</AppText>
                  </Pressable>
                );
              })}
            </View>

            <AppButton label={saving ? 'Zapisywanie…' : 'Zapisz profil'} onPress={() => void onSaveProfile()} disabled={saving} />

            <View style={local.divider} />
            <AppText variant="body" weight="600">Zmiana hasła</AppText>
            <AppText variant="bodySm" weight="600">Aktualne hasło</AppText>
            <AppInput
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
            <AppText variant="bodySm" weight="600">Nowe hasło</AppText>
            <AppInput
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
            <AppText variant="bodySm" weight="600">Powtórz nowe hasło</AppText>
            <AppInput
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
            <AppButton
              label={passwordSaving ? 'Zmiana hasła…' : 'Zmień hasło'}
              variant="secondary"
              onPress={() => void onChangePassword()}
              disabled={passwordSaving}
            />
          </AppCard>
        ) : null}

        {error ? <AppText tone="danger">{error}</AppText> : null}
        {info ? <AppText tone="success">{info}</AppText> : null}
    </AppScrollScreen>
  );
}

const local = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerTextWrap: {
    flex: 1,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    marginBottom: spacing.xxs,
  },
  subSectionLabel: {
    marginTop: spacing.xxs,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderSubtle,
    marginVertical: spacing.xs,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  avatarItem: {
    width: '31%',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: radius.sm,
    paddingVertical: spacing.xs,
    alignItems: 'center',
    gap: spacing.xxs + 1,
    backgroundColor: colors.surface,
  },
  avatarItemSelected: {
    borderColor: colors.accentPrimary,
    backgroundColor: colors.surfaceMuted,
  },
  smallAvatarCircle: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
