import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Platform } from 'react-native';
import { RootErrorBoundary } from '../src/components/RootErrorBoundary';
import { useOfflineTastingSync } from '../src/hooks/useOfflineTastingSync';

const queryClient = new QueryClient();

function OfflineSyncBootstrap() {
  useOfflineTastingSync();
  return null;
}

export default function RootLayout() {
  return (
    <RootErrorBoundary>
      <QueryClientProvider client={queryClient}>
        {Platform.OS !== 'web' ? <OfflineSyncBootstrap /> : null}
        <Stack screenOptions={{ headerShown: true }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="test-select-user" options={{ title: 'Wybór roli' }} />
          <Stack.Screen name="roaster-add-coffee" options={{ title: 'Tag kawy' }} />
          <Stack.Screen name="home" options={{ title: 'funcup' }} />
        </Stack>
      </QueryClientProvider>
    </RootErrorBoundary>
  );
}

