import { Link } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';

import { DiscoverCoffeesTab } from '../../src/components/hub/DiscoverCoffeesTab';
import { LearnCoffeeTab } from '../../src/components/hub/LearnCoffeeTab';
import { DiscoverRoastersTab } from '../../src/components/hub/DiscoverRoastersTab';

type TabKey = 'coffees' | 'roasters' | 'learn';

export default function HubIndexScreen() {
  const [activeTab, setActiveTab] = useState<TabKey>('coffees');
  const { height } = useWindowDimensions();
  const scanCtaMinHeight = useMemo(() => Math.max(280, Math.floor(height * 0.4)), [height]);

  return (
    <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
      <Text style={{ fontSize: 28, fontWeight: '700' }}>Coffee Hub</Text>
      <Text>Discover coffees and roasters, then jump straight into scan flow.</Text>

      <View
        style={{
          minHeight: scanCtaMinHeight,
          backgroundColor: '#111827',
          borderRadius: 16,
          padding: 20,
          justifyContent: 'space-between',
          gap: 10,
        }}
      >
        <View style={{ gap: 8 }}>
          <Text style={{ color: '#ffffff', fontSize: 24, fontWeight: '700' }}>Scan Coffee</Text>
          <Text style={{ color: '#d1d5db', fontSize: 16 }}>
            Your fastest path to tasting notes is scanning QR and opening the Coffee Page.
          </Text>
        </View>
        <View
          style={{
            backgroundColor: '#f59e0b',
            borderRadius: 12,
            paddingVertical: 14,
            paddingHorizontal: 16,
          }}
        >
          <Link href="/(tabs)/hub/scan" style={{ color: '#111827', fontWeight: '700' }}>
            Open Scanner
          </Link>
        </View>
      </View>

      <View style={{ gap: 8 }}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TabButton
            label="Discover Coffees"
            active={activeTab === 'coffees'}
            onPress={() => setActiveTab('coffees')}
          />
          <TabButton
            label="Roasters"
            active={activeTab === 'roasters'}
            onPress={() => setActiveTab('roasters')}
          />
          <TabButton label="Learn" active={activeTab === 'learn'} onPress={() => setActiveTab('learn')} />
        </View>

        <View style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 12 }}>
          {activeTab === 'coffees' ? <DiscoverCoffeesTab /> : null}
          {activeTab === 'roasters' ? <DiscoverRoastersTab /> : null}
          {activeTab === 'learn' ? <LearnCoffeeTab /> : null}
        </View>
      </View>
    </ScrollView>
  );
}

function TabButton(props: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={props.onPress}
      accessibilityRole="tab"
      accessibilityState={{ selected: props.active }}
      accessibilityLabel={props.label}
      style={{
        borderWidth: 1,
        borderColor: props.active ? '#111827' : '#d1d5db',
        backgroundColor: props.active ? '#111827' : '#ffffff',
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 8,
      }}
    >
      <Text style={{ color: props.active ? '#ffffff' : '#111827', fontWeight: '600' }}>{props.label}</Text>
    </Pressable>
  );
}
