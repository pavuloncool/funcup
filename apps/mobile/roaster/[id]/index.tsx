import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useFollowRoaster } from '@funcup/shared';

import { useViewerUserId } from '../../src/hooks/useViewerUserId';
import { supabase } from '../../src/services/supabaseClient';

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
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text>Missing roaster id.</Text>
      </ScrollView>
    );
  }

  if (roasterQuery.isLoading || userLoading) {
    return (
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text>Loading roaster profile...</Text>
      </ScrollView>
    );
  }

  if (roasterQuery.isError) {
    return (
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text>Could not load roaster profile.</Text>
      </ScrollView>
    );
  }

  if (!roasterQuery.data) {
    return (
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text>Roaster not found.</Text>
      </ScrollView>
    );
  }

  const roaster = roasterQuery.data;
  const isFollowed = followMutation.isPending
    ? !roaster.isFollowed
    : roaster.isFollowed;

  return (
    <ScrollView contentContainerStyle={{ padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 28, fontWeight: '700' }}>{roaster.name}</Text>
      <Text>{[roaster.city, roaster.country].filter(Boolean).join(', ') || 'Location unavailable'}</Text>
      <Text>{roaster.description ?? 'No description yet.'}</Text>
      <Text>{roaster.website ?? 'No website'}</Text>

      <View style={{ paddingTop: 8 }}>
        <Pressable
          onPress={() =>
            followMutation.mutate({ roasterId: roaster.id, follow: !roaster.isFollowed })
          }
          disabled={!userId || followMutation.isPending}
          style={{
            borderWidth: 1,
            borderColor: '#111827',
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 10,
            backgroundColor: isFollowed ? '#111827' : '#ffffff',
          }}
        >
          <Text style={{ color: isFollowed ? '#ffffff' : '#111827', fontWeight: '700' }}>
            {isFollowed ? 'Following' : 'Follow Roaster'}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
