import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Text, View } from 'react-native';

function DotIcon(props: { active: boolean; label: string }) {
  return (
    <View style={{
      width: props.active ? 26 : 22,
      height: props.active ? 26 : 22,
      borderRadius: 999,
      borderWidth: 2,
      borderColor: props.active ? '#2563eb' : '#9ca3af',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: props.active ? '#dbeafe' : 'transparent',
    }}>
      <Text style={{ fontSize: 11, color: props.active ? '#2563eb' : '#9ca3af' }}>{props.label}</Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#8c8c8c',
        tabBarStyle: { height: 84, paddingBottom: 10, paddingTop: 8 },
      }}
    >
      <Tabs.Screen
        name="hub/index"
        options={{
          title: 'Coffee Station',
          tabBarIcon: ({ focused }) => <DotIcon active={focused} label="CS" />,
        }}
      />
      <Tabs.Screen
        name="hub/scan"
        options={{
          title: 'Scan Coffee',
          tabBarIcon: () => (
            <View
              style={{
                width: 84,
                height: 84,
                borderRadius: 50,
                marginTop: -58,
                backgroundColor: '#2563eb',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 4,
                borderColor: '#ececec',
              }}
            >
              <Ionicons name="qr-code-outline" size={28} color="#fff" />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="journal/index"
        options={{
          title: 'Coffee Log',
          tabBarIcon: ({ focused }) => <DotIcon active={focused} label="L" />,
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }) => <DotIcon active={focused} label="S" />,
        }}
      />
    </Tabs>
  );
}
