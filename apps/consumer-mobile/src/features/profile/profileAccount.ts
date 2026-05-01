import type { SupabaseClient, User } from '@supabase/supabase-js';

import {
  DEFAULT_AVATAR_SEED,
  resolveAvatarSeedOption,
  serializeAvatarOption,
} from './avatar/avatarFactory';

type UserRow = {
  display_name: string | null;
  avatar_url: string | null;
  favorite_brew_method_id?: string | null;
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
  favoriteBrewMethodId: string | null;
  favoriteFlavorNoteIds: string[];
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

export const serializeAvatar = serializeAvatarOption;
export const resolveAvatarOption = resolveAvatarSeedOption;

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

  const { row } = await loadUsersRow(supabase, user.id);

  const metadataDisplayName = typeof metadata.display_name === 'string' ? metadata.display_name : null;
  const metadataAvatar = typeof metadata.avatar_url === 'string' ? metadata.avatar_url : null;

  const favoriteRows = await loadFavoriteFlavorNoteRows(supabase, user.id);

  return {
    userId: user.id,
    displayName: row?.display_name ?? metadataDisplayName ?? '',
    email: user.email ?? '',
    avatarUrl: row?.avatar_url ?? metadataAvatar ?? serializeAvatar(DEFAULT_AVATAR_SEED),
    favoriteBrewMethodId: row?.favorite_brew_method_id ?? null,
    favoriteFlavorNoteIds: (favoriteRows ?? []).map((item) => item.flavor_note_id),
    profileCompleted: isProfileCompleted(user),
  };
}

export async function saveEditableProfile(params: {
  supabase: SupabaseClient;
  userId: string;
  displayName: string;
  avatarUrl: string;
  favoriteBrewMethodId?: string | null;
  favoriteFlavorNoteIds?: string[];
  markCompleted?: boolean;
}): Promise<void> {
  const trimmedName = params.displayName.trim();

  const updatePayload: {
    display_name: string;
    avatar_url: string;
    favorite_brew_method_id?: string | null;
  } = {
    display_name: trimmedName,
    avatar_url: params.avatarUrl,
  };

  if (params.favoriteBrewMethodId !== undefined) {
    updatePayload.favorite_brew_method_id = params.favoriteBrewMethodId;
  }

  await saveUsersRow(params.supabase, params.userId, updatePayload);

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

  if (params.favoriteFlavorNoteIds !== undefined) {
    const { error: deleteError } = await params.supabase
      .from('user_favorite_flavor_notes')
      .delete()
      .eq('user_id', params.userId);

    if (deleteError) {
      if (!isMissingFavoriteNotesRelation(deleteError)) {
        throw new Error(deleteError.message);
      }
      return;
    }

    if (params.favoriteFlavorNoteIds.length > 0) {
      const { error: insertError } = await params.supabase
        .from('user_favorite_flavor_notes')
        .insert(
          params.favoriteFlavorNoteIds.map((flavorNoteId) => ({
            user_id: params.userId,
            flavor_note_id: flavorNoteId,
          }))
        );

      if (insertError && !isMissingFavoriteNotesRelation(insertError)) {
        throw new Error(insertError.message);
      }
    }
  }
}

type QueryErrorLike = {
  message?: string;
  code?: string;
};

async function loadUsersRow(supabase: SupabaseClient, userId: string): Promise<{ row: UserRow | null }> {
  const withFavorite = await supabase
    .from('users')
    .select('display_name,avatar_url,favorite_brew_method_id')
    .eq('id', userId)
    .maybeSingle<UserRow>();

  if (!withFavorite.error) {
    return { row: withFavorite.data };
  }

  if (!isMissingFavoriteBrewMethodColumn(withFavorite.error)) {
    throw new Error(withFavorite.error.message);
  }

  const fallback = await supabase
    .from('users')
    .select('display_name,avatar_url')
    .eq('id', userId)
    .maybeSingle<Pick<UserRow, 'display_name' | 'avatar_url'>>();

  if (fallback.error) {
    throw new Error(fallback.error.message);
  }

  return {
    row: fallback.data
      ? {
          ...fallback.data,
          favorite_brew_method_id: null,
        }
      : null,
  };
}

async function loadFavoriteFlavorNoteRows(supabase: SupabaseClient, userId: string): Promise<Array<{ flavor_note_id: string }>> {
  const { data, error } = await supabase
    .from('user_favorite_flavor_notes')
    .select('flavor_note_id')
    .eq('user_id', userId)
    .returns<Array<{ flavor_note_id: string }>>();

  if (!error) {
    return data ?? [];
  }

  if (isMissingFavoriteNotesRelation(error)) {
    return [];
  }

  throw new Error(error.message);
}

async function saveUsersRow(
  supabase: SupabaseClient,
  userId: string,
  payload: { display_name: string; avatar_url: string; favorite_brew_method_id?: string | null }
): Promise<void> {
  const { error } = await supabase
    .from('users')
    .update(payload)
    .eq('id', userId);

  if (!error) {
    return;
  }

  if (!('favorite_brew_method_id' in payload)) {
    throw new Error(error.message);
  }

  if (!isMissingFavoriteBrewMethodColumn(error)) {
    throw new Error(error.message);
  }

  const fallbackPayload: { display_name: string; avatar_url: string } = {
    display_name: payload.display_name,
    avatar_url: payload.avatar_url,
  };

  const fallback = await supabase
    .from('users')
    .update(fallbackPayload)
    .eq('id', userId);

  if (fallback.error) {
    throw new Error(fallback.error.message);
  }
}

function isMissingFavoriteBrewMethodColumn(error: QueryErrorLike): boolean {
  const message = String(error.message ?? '').toLowerCase();
  const code = String(error.code ?? '').toLowerCase();
  return (
    (message.includes('favorite_brew_method_id') || message.includes('favourite_brew_method_id')) &&
    (message.includes('does not exist') || code === '42703' || code === 'pgrst204')
  );
}

function isMissingFavoriteNotesRelation(error: QueryErrorLike): boolean {
  const message = String(error.message ?? '').toLowerCase();
  const code = String(error.code ?? '').toLowerCase();
  return (
    (message.includes('user_favorite_flavor_notes') || message.includes('flavor_note_id')) &&
    (message.includes('does not exist') || code === '42p01' || code === 'pgrst205' || code === 'pgrst204')
  );
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
