import { StyleSheet, View } from 'react-native';

function Block(props: { height: number; width?: number | `${number}%` | 'auto' }) {
  return (
    <View
      style={[
        styles.block,
        { height: props.height, width: props.width ?? '100%' },
      ]}
      accessibilityRole="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    />
  );
}

export function CoffeePageSkeleton() {
  return (
    <View style={styles.page} accessibilityRole="progressbar" accessibilityLabel="Loading coffee details">
      <Block height={28} width="60%" />
      <Block height={16} width="40%" />
      <View style={styles.section}>
        <Block height={20} width="30%" />
        <Block height={14} />
        <Block height={14} width="85%" />
      </View>
      <View style={styles.section}>
        <Block height={20} width="35%" />
        <Block height={14} />
        <Block height={14} width="90%" />
      </View>
      <View style={styles.section}>
        <Block height={20} width="28%" />
        <Block height={14} width="70%" />
      </View>
      <View style={styles.section}>
        <Block height={20} width="40%" />
        <Block height={14} />
      </View>
    </View>
  );
}

export function DiscoverListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <View style={styles.list} accessibilityRole="progressbar" accessibilityLabel="Loading list">
      {Array.from({ length: rows }).map((_, i) => (
        <View key={i} style={styles.card}>
          <Block height={18} width="55%" />
          <Block height={14} width="80%" />
          <Block height={14} width="45%" />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { padding: 24, gap: 16 },
  section: { gap: 10, paddingVertical: 8 },
  list: { gap: 12 },
  card: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 12,
    gap: 8,
    backgroundColor: '#fafafa',
  },
  block: {
    borderRadius: 6,
    backgroundColor: '#e5e7eb',
  },
});
