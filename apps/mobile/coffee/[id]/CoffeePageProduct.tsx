import { Text, View } from 'react-native';

export function CoffeePageProduct(props: {
  coffeeName?: string;
  variety?: string | null;
  processingMethod?: string | null;
  producerNotes?: string | null;
  roasterName?: string | null;
}) {
  return (
    <View style={{ paddingVertical: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: '600' }}>Product</Text>
      <Text style={{ fontSize: 16, fontWeight: '600' }}>{props.coffeeName ?? 'Coffee'}</Text>
      {props.roasterName ? <Text style={{ color: '#4b5563' }}>{props.roasterName}</Text> : null}
      {[props.variety, props.processingMethod].filter(Boolean).length > 0 ? (
        <Text style={{ color: '#6b7280', marginTop: 4 }}>
          {[props.variety, props.processingMethod].filter(Boolean).join(' · ')}
        </Text>
      ) : null}
      {props.producerNotes ? (
        <Text style={{ marginTop: 8, lineHeight: 22 }}>{props.producerNotes}</Text>
      ) : null}
    </View>
  );
}

