import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useDiscoverRoasters, useFollowRoaster } from '@funcup/shared';

import { useViewerUserId } from '../../hooks/useViewerUserId';
import { supabase } from '../../services/supabaseClient';

export function DiscoverRoastersTab() {
  const { userId, isLoading: userLoading } = useViewerUserId();
  const roastersQuery = useDiscoverRoasters({ supabase, userId, limit: 8 });
  const followMutation = useFollowRoaster({ supabase, userId });

  if (roastersQuery.isLoading || userLoading) {
    return <Text>Loading roasters...</Text>;
  }

  if (roastersQuery.isError) {
    return <Text>Could not load roasters right now.</Text>;
  }

  if (!roastersQuery.data || roastersQuery.data.length === 0) {
    return <Text>No roasters discovered yet.</Text>;
  }

  return (
    <View style={{ gap: 10 }}>
      {roastersQuery.data.map((roaster) => (
        <View
          key={roaster.id}
          style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, gap: 6 }}
        >
          <Text style={{ fontSize: 16, fontWeight: '600' }}>{roaster.name}</Text>
          <Text>
            {[roaster.city, roaster.country].filter(Boolean).join(', ') || 'Location unavailable'}
          </Text>
          <Text>{roaster.description ?? 'No roaster story yet.'}</Text>
          <Pressable
            onPress={() =>
              followMutation.mutate({ roasterId: roaster.id, follow: !roaster.isFollowed })
            }
            disabled={!userId || followMutation.isPending}
            style={{
              borderWidth: 1,
              borderColor: '#111827',
              borderRadius: 8,
              paddingHorizontal: 10,
              paddingVertical: 8,
              backgroundColor: roaster.isFollowed ? '#111827' : '#ffffff',
            }}
          >
            <Text style={{ color: roaster.isFollowed ? '#ffffff' : '#111827', fontWeight: '600' }}>
              {roaster.isFollowed ? 'Following' : 'Follow'}
            </Text>
          </Pressable>
          <Link href={{ pathname: '/roaster/[id]', params: { id: roaster.id } }}>Open profile</Link>
        </View>
      ))}
    </View>
  );
}
