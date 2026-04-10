import { Text, View } from 'react-native';

export function CoffeePageBrewing(props: { brewingNotes?: string | null }) {
  return (
    <View style={{ paddingVertical: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: '600' }}>Brewing</Text>
      <Text style={{ lineHeight: 22 }}>
        {props.brewingNotes?.trim() ? props.brewingNotes : 'No brewing notes for this batch yet.'}
      </Text>
    </View>
  );
}

