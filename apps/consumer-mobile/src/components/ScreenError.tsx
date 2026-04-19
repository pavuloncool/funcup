import { Pressable, StyleSheet, Text, View } from 'react-native';

export function ScreenError(props: {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
}) {
  const title = props.title ?? 'Could not load';
  return (
    <View style={styles.wrap} accessibilityRole="alert">
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{props.message}</Text>
      {props.onRetry ? (
        <Pressable
          onPress={props.onRetry}
          style={styles.button}
          accessibilityRole="button"
          accessibilityLabel={props.retryLabel ?? 'Retry loading this screen'}
        >
          <Text style={styles.buttonLabel}>{props.retryLabel ?? 'Retry'}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    padding: 20,
    gap: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fecaca',
    backgroundColor: '#fef2f2',
  },
  title: { fontSize: 17, fontWeight: '700', color: '#991b1b' },
  body: { fontSize: 15, color: '#7f1d1d' },
  button: {
    alignSelf: 'flex-start',
    marginTop: 4,
    backgroundColor: '#991b1b',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  buttonLabel: { color: '#ffffff', fontWeight: '600' },
});
