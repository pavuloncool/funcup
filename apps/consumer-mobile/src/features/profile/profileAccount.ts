import type { SupabaseClient, User } from '@supabase/supabase-js';

export type AvatarOption = {
  id: string;
  icon: string;
  color: string;
  label: string;
};

export const AVATAR_OPTIONS: AvatarOption[] = [
  { id: 'sprout', icon: 'leaf-outline', color: '#16a34a', label: 'Sprout' },
  { id: 'sun', icon: 'sunny-outline', color: '#f59e0b', label: 'Sunny' },
  { id: 'bean', icon: 'cafe-outline', color: '#b45309', label: 'Bean' },
  { id: 'wave', icon: 'water-outline', color: '#0ea5e9', label: 'Wave' },
  { id: 'moon', icon: 'moon-outline', color: '#7c3aed', label: 'Moon' },
  { id: 'spark', icon: 'sparkles-outline', color: '#db2777', label: 'Spark' },
];

export const DEFAULT_AVATAR = AVATAR_OPTIONS[0];

type UserRow = {
  display_name: string | null;
  avatar_url: string | null;
};

type ProfileMetadata = {
  display_name?: unknown;
  avatar_url?: unknown;
  profile_completed?: unknown;
};

export type EditableProfile = {
  userId: string;
  displayName: string;
  email: string;
  avatarUrl: string;
  profileCompleted: boolean;
};

function isRecord(input: unknown): input is Record<string, unknown> {
  return Boolean(input) && typeof input === 'object' && !Array.isArray(input);
}

function getMetadata(user: User | null): ProfileMetadata {
  if (!user || !isRecord(user.user_metadata)) {
    return {};
  }

  return user.user_metadata as ProfileMetadata;
}

export function isProfileCompleted(user: User | null): boolean {
  const metadata = getMetadata(user);
  if (typeof metadata.profile_completed === 'boolean') {
    return metadata.profile_completed;
  }

  // Backward compatibility for users created before this flag existed.
  return true;
}

export function serializeAvatar(option: AvatarOption): string {
  return `avatar:${option.id}:${option.icon}:${option.color}`;
}

export function resolveAvatarOption(avatarUrl: string | null | undefined): AvatarOption {
  if (!avatarUrl || !avatarUrl.startsWith('avatar:')) {
    return DEFAULT_AVATAR;
  }

  const [, id] = avatarUrl.split(':');
  const option = AVATAR_OPTIONS.find((item) => item.id === id);
  return option ?? DEFAULT_AVATAR;
}

export async function loadEditableProfile(
  supabase: SupabaseClient
): Promise<EditableProfile> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error(userError?.message ?? 'Brak aktywnej sesji.');
  }

  const metadata = getMetadata(user);

  const { data: row, error: rowError } = await supabase
    .from('users')
    .select('display_name,avatar_url')
    .eq('id', user.id)
    .maybeSingle<UserRow>();

  if (rowError) {
    throw new Error(rowError.message);
  }

  const metadataDisplayName = typeof metadata.display_name === 'string' ? metadata.display_name : null;
  const metadataAvatar = typeof metadata.avatar_url === 'string' ? metadata.avatar_url : null;

  return {
    userId: user.id,
    displayName: row?.display_name ?? metadataDisplayName ?? '',
    email: user.email ?? '',
    avatarUrl: row?.avatar_url ?? metadataAvatar ?? serializeAvatar(DEFAULT_AVATAR),
    profileCompleted: isProfileCompleted(user),
  };
}

export async function saveEditableProfile(params: {
  supabase: SupabaseClient;
  userId: string;
  displayName: string;
  avatarUrl: string;
  markCompleted?: boolean;
}): Promise<void> {
  const trimmedName = params.displayName.trim();

  const usersTable = params.supabase.from('users') as unknown as {
    update: (value: { display_name: string; avatar_url: string }) => { eq: (column: string, value: string) => Promise<{ error: Error | null }> };
  };

  const { error: rowError } = await usersTable
    .update({
      display_name: trimmedName,
      avatar_url: params.avatarUrl,
    })
    .eq('id', params.userId);

  if (rowError) {
    throw new Error(rowError.message);
  }

  const { error: authError } = await params.supabase.auth.updateUser({
    data: {
      display_name: trimmedName,
      avatar_url: params.avatarUrl,
      ...(params.markCompleted ? { profile_completed: true } : {}),
    },
  });

  if (authError) {
    throw new Error(authError.message);
  }
}

export async function requestEmailChange(params: {
  supabase: SupabaseClient;
  nextEmail: string;
}): Promise<{ simulated: boolean }> {
  const { error } = await params.supabase.auth.updateUser({
    email: params.nextEmail,
  });

  if (!error) {
    return { simulated: false };
  }

  if (__DEV__) {
    return { simulated: true };
  }

  throw new Error(error.message);
}

export async function changePasswordWithReauth(params: {
  supabase: SupabaseClient;
  email: string;
  currentPassword: string;
  newPassword: string;
}): Promise<void> {
  // Prefer "change password with current password" in a single auth call.
  // This avoids an explicit sign-in with the old password, which can prevent iOS
  // from updating stored credentials in Password AutoFill.
  const { error: updateError } = await params.supabase.auth.updateUser({
    password: params.newPassword,
    // `current_password` is supported by Supabase Auth even if older supabase-js types don't expose it.
    ...(params.currentPassword ? ({ current_password: params.currentPassword } as Record<string, string>) : {}),
  } as never);

  if (updateError) {
    throw new Error(updateError.message || 'Nie udało się zmienić hasła.');
  }

  // Re-authenticate with the new password so iOS password manager can detect updated credentials.
  const { error: refreshSignInError } = await params.supabase.auth.signInWithPassword({
    email: params.email,
    password: params.newPassword,
  });

  if (refreshSignInError) {
    throw new Error(refreshSignInError.message);
  }
}
