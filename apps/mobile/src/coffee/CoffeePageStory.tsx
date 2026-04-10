import { Text, View } from 'react-native';

export function CoffeePageStory(props: { roasterStory?: string | null }) {
  return (
    <View style={{ paddingVertical: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: '600' }}>Story</Text>
      <Text style={{ lineHeight: 22 }}>
        {props.roasterStory?.trim() ? props.roasterStory : 'No roaster story for this batch yet.'}
      </Text>
    </View>
  );
}

