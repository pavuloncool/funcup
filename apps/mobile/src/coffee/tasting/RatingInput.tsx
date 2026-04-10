import { Text, View } from 'react-native';

export function RatingInput() {
  return (
    <View style={{ paddingVertical: 12 }}>
      <Text style={{ fontSize: 16, fontWeight: '600' }}>Rating</Text>
      <Text>Rating input placeholder.</Text>
    </View>
  );
}

