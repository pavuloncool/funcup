import { Stack } from 'expo-router';
import '../src/styles/global.css';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="index" options={{ title: 'funcup' }} />
    </Stack>
  );
}

