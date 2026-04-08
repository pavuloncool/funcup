import { MMKV } from 'react-native-mmkv';

import type { QueueStorage } from '@funcup/shared';

const storage = new MMKV({ id: 'funcup-offline-tasting' });

export const offlineQueueStorage: QueueStorage = {
  getItem(key) {
    const value = storage.getString(key);
    return value ?? null;
  },
  setItem(key, value) {
    storage.set(key, value);
  },
};
