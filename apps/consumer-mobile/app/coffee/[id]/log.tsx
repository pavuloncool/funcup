import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { enqueuePendingTasting, logTasting } from '@funcup/shared';
import NetInfo from '@react-native-community/netinfo';

import { BrewMethodPicker } from '../../../src/coffee/tasting/BrewMethodPicker';
import { FlavorNoteSelector } from '../../../src/coffee/tasting/FlavorNoteSelector';
import { RatingInput } from '../../../src/coffee/tasting/RatingInput';
import { offlineQueueStorage } from '../../../src/services/offlineQueueStorage';
import { supabase } from '../../../src/services/supabaseClient';
import { getPendingTastings } from '@funcup/shared';

export default function TastingLogScreen() {
  const params = useLocalSearchParams<{ id?: string; batchId?: string }>();
  const batchId =
    typeof params.batchId === 'string' && params.batchId.length > 0 ? params.batchId : params.id;
  const demoReputationScore = 24;
  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [ratingInput, setRatingInput] = useState('4');
  const [status, setStatus] = useState<string | null>(null);

  const refreshPendingCount = async () => {
    const pending = await getPendingTastings(offlineQueueStorage);
    setPendingCount(pending.length);
  };

  useEffect(() => {
    void refreshPendingCount();
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(Boolean(state.isConnected && state.isInternetReachable !== false));
      void refreshPendingCount();
    });
    return () => unsubscribe();
  }, []);

  const onSubmit = async () => {
    const parsedRating = Number(ratingInput);
    if (!batchId) {
      setStatus('Missing batch id');
      return;
    }
    if (!Number.isFinite(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      setStatus('Rating must be between 1 and 5');
      return;
    }

    const netState = await NetInfo.fetch();
    const online = Boolean(netState.isConnected && netState.isInternetReachable !== false);

    if (!online) {
      await enqueuePendingTasting(offlineQueueStorage, {
        batchId,
        rating: parsedRating,
      });
      await refreshPendingCount();
      setStatus('Queued offline. It will sync after reconnect.');
      return;
    }

    try {
      await logTasting(supabase, {
        batchId,
        rating: parsedRating,
      });
      setStatus('Synced immediately.');
    } catch {
      await enqueuePendingTasting(offlineQueueStorage, {
        batchId,
        rating: parsedRating,
      });
      await refreshPendingCount();
      setStatus('Network issue. Queued offline for retry.');
    }
  };

  return (
    <View style={{ flex: 1, padding: 24, gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: '600' }}>Tasting Log</Text>
      <Text>Batch id: {batchId ?? '(missing)'}</Text>
      <Text style={{ color: isOnline ? '#166534' : '#b91c1c' }}>
        {isOnline ? 'Online' : 'Offline'} | Pending queue: {pendingCount}
      </Text>

      <RatingInput />
      <BrewMethodPicker />
      <FlavorNoteSelector reputationScore={demoReputationScore} />

      <View style={{ gap: 8 }}>
        <Text style={{ fontSize: 16, fontWeight: '600' }}>Quick rating submit</Text>
        <TextInput
          value={ratingInput}
          onChangeText={setRatingInput}
          keyboardType="numeric"
          placeholder="1-5"
          style={{
            borderWidth: 1,
            borderColor: '#d1d5db',
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 10,
          }}
        />
        <Pressable
          onPress={() => {
            void onSubmit();
          }}
          style={{
            backgroundColor: '#111827',
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 10,
          }}
        >
          <Text style={{ color: '#ffffff', fontWeight: '600' }}>Save tasting</Text>
        </Pressable>
        {status ? <Text style={{ color: '#374151' }}>{status}</Text> : null}
      </View>
    </View>
  );
}

