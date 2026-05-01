import { Tabs } from 'expo-router';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { appShellRules } from '@funcup/shared';
import { TabCentralScanFab, TabDotIcon, tabBarScreenOptions } from '../../src/components/ui/AppTabBar';
import { useAuth } from '../../src/auth';

export default function TabsLayout() {
  const router = useRouter();
  const { status } = useAuth();

  useEffect(() => {
    if (status === 'unauthenticated' || status === 'locked') {
      router.replace('/(auth)/login');
    }
  }, [router, status]);

  if (status === 'bootstrapping') {
    return null;
  }

  return (
    <Tabs
      screenOptions={tabBarScreenOptions}
    >
      <Tabs.Screen
        name="hub/index"
        options={{
          title: 'Coffee Station',
          tabBarIcon: ({ focused }) => <TabDotIcon active={focused} label="CS" />,
        }}
      />
      <Tabs.Screen
        name="scan/scan"
        options={{
          title: appShellRules.centralActionLabel,
          tabBarIcon: () => <TabCentralScanFab />,
        }}
      />
      <Tabs.Screen
        name="journal/index"
        options={{
          title: 'Coffee Log',
          tabBarIcon: ({ focused }) => <TabDotIcon active={focused} label="L" />,
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }) => <TabDotIcon active={focused} label="S" />,
        }}
      />
    </Tabs>
  );
}
