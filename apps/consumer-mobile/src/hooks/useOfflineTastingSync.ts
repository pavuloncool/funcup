import { useEffect, useMemo, useState } from 'react';

import { flushPendingTastings, getPendingTastings } from '@funcup/shared';
import NetInfo from '@react-native-community/netinfo';
import { onlineManager } from '@tanstack/react-query';

import { offlineQueueStorage } from '../services/offlineQueueStorage';
import { supabase } from '../services/supabaseClient';

export function useOfflineTastingSync() {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);

  const refreshPendingCount = useMemo(
    () => async () => {
      const pending = await getPendingTastings(offlineQueueStorage);
      setPendingCount(pending.length);
    },
    []
  );

  useEffect(() => {
    void refreshPendingCount();
  }, [refreshPendingCount]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const online = Boolean(state.isConnected && state.isInternetReachable !== false);
      setIsOnline(online);
      onlineManager.setOnline(online);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isOnline) return;

    let stopped = false;
    const flush = async () => {
      if (stopped) return;
      await flushPendingTastings({
        storage: offlineQueueStorage,
        supabase,
      });
      await refreshPendingCount();
    };

    void flush();
    const id = setInterval(() => {
      void flush();
    }, 30_000);

    return () => {
      stopped = true;
      clearInterval(id);
    };
  }, [isOnline, refreshPendingCount]);

  return { isOnline, pendingCount, refreshPendingCount };
}
