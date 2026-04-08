import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '../src/styles/global.css';
import { useOfflineTastingSync } from '../src/hooks/useOfflineTastingSync';

const queryClient = new QueryClient();

function OfflineSyncBootstrap() {
  useOfflineTastingSync();
  return null;
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <OfflineSyncBootstrap />
      <Stack screenOptions={{ headerShown: true }}>
        <Stack.Screen name="index" options={{ title: 'funcup' }} />
      </Stack>
    </QueryClientProvider>
  );
}

