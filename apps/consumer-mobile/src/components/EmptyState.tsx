import { type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function EmptyState(props: {
  title: string;
  description?: string;
  icon?: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <View style={styles.wrap} accessibilityRole="text" accessibilityLabel={`${props.title}. ${props.description ?? ''}`}>
      {props.icon ? <View style={styles.icon}>{props.icon}</View> : null}
      <Text style={styles.title}>{props.title}</Text>
      {props.description ? <Text style={styles.description}>{props.description}</Text> : null}
      {props.footer ? <View style={styles.footer}>{props.footer}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 16,
    gap: 8,
  },
  icon: { marginBottom: 4 },
  title: { fontSize: 17, fontWeight: '700', color: '#111827', textAlign: 'center' },
  description: { fontSize: 15, color: '#6b7280', textAlign: 'center', lineHeight: 22 },
  footer: { marginTop: 8, width: '100%', alignItems: 'center' },
});
