import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useFollowRoaster } from '@funcup/shared';

import { useViewerUserId } from '../../../src/hooks/useViewerUserId';
import { supabase } from '../../../src/services/supabaseClient';
import { AppButton, AppScrollScreen, AppText } from '../../../src/components/ui/primitives';

type RoasterProfileData = {
  id: string;
  name: string;
  country: string | null;
  city: string | null;
  description: string | null;
  website: string | null;
  isFollowed: boolean;
};

async function fetchRoasterProfile(params: {
  roasterId: string;
  userId: string | null;
}): Promise<RoasterProfileData | null> {
  const { data: roasterData, error } = await supabase
    .from('roasters')
    .select('id,name,country,city,description,website')
    .eq('id', params.roasterId)
    .maybeSingle();
  if (error) throw error;
  const data = roasterData as
    | {
        id: string;
        name: string;
        country: string | null;
        city: string | null;
        description: string | null;
        website: string | null;
      }
    | null;
  if (!data) return null;

  let isFollowed = false;
  if (params.userId) {
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('following_roaster_ids')
      .eq('id', params.userId)
      .maybeSingle();
    if (userError) throw userError;
    const ids = (userData as { following_roaster_ids?: string[] } | null)?.following_roaster_ids ?? [];
    isFollowed = ids.includes(params.roasterId);
  }

  return {
    id: data.id,
    name: data.name,
    country: data.country,
    city: data.city,
    description: data.description,
    website: data.website,
    isFollowed,
  };
}

export default function RoasterProfileScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const { userId, isLoading: userLoading } = useViewerUserId();
  const followMutation = useFollowRoaster({ supabase, userId });
  const roasterId = params.id ?? '';

  const roasterQuery = useQuery({
    queryKey: ['roasterProfile', roasterId, userId ?? null],
    enabled: Boolean(roasterId) && !userLoading,
    queryFn: () => fetchRoasterProfile({ roasterId, userId }),
  });

  if (!roasterId) {
    return (
      <AppScrollScreen contentContainerStyle={styles.page}>
        <AppText>Missing roaster id.</AppText>
      </AppScrollScreen>
    );
  }

  if (roasterQuery.isLoading || userLoading) {
    return (
      <AppScrollScreen contentContainerStyle={styles.page}>
        <AppText>Loading roaster profile...</AppText>
      </AppScrollScreen>
    );
  }

  if (roasterQuery.isError) {
    return (
      <AppScrollScreen contentContainerStyle={styles.page}>
        <AppText>Could not load roaster profile.</AppText>
      </AppScrollScreen>
    );
  }

  if (!roasterQuery.data) {
    return (
      <AppScrollScreen contentContainerStyle={styles.page}>
        <AppText>Roaster not found.</AppText>
      </AppScrollScreen>
    );
  }

  const roaster = roasterQuery.data;
  const isFollowed = followMutation.isPending
    ? !roaster.isFollowed
    : roaster.isFollowed;

  return (
    <AppScrollScreen contentContainerStyle={styles.page}>
      <AppText variant="h1" weight="700">{roaster.name}</AppText>
      <AppText>{[roaster.city, roaster.country].filter(Boolean).join(', ') || 'Location unavailable'}</AppText>
      <AppText>{roaster.description ?? 'No description yet.'}</AppText>
      <AppText>{roaster.website ?? 'No website'}</AppText>

      <View style={styles.actionWrap}>
        <AppButton
          onPress={() => followMutation.mutate({ roasterId: roaster.id, follow: !roaster.isFollowed })}
          disabled={!userId || followMutation.isPending}
          variant={isFollowed ? 'primary' : 'secondary'}
          label={isFollowed ? 'Following' : 'Follow Roaster'}
        />
      </View>
    </AppScrollScreen>
  );
}

const styles = StyleSheet.create({
  page: { padding: 20, gap: 12 },
  actionWrap: { paddingTop: 8 },
});
