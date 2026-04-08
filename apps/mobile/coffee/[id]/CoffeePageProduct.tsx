import { Text, View } from 'react-native';

export function CoffeePageProduct(props: { coffeeName?: string }) {
  return (
    <View style={{ paddingVertical: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: '600' }}>Product</Text>
      <Text>{props.coffeeName ?? 'Coffee'}</Text>
    </View>
  );
}

