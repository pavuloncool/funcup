import { StyleSheet, Text, View } from 'react-native';

export default function HubIndexScreen() {
  return (
    <View style={styles.root}>
      {/* <View style={styles.topBar}>
        <Text style={styles.logo}>funcup</Text>
        <View style={styles.actions}>
          <View style={styles.avatarRing}>
            <View style={styles.avatarCore} />
          </View>
        </View>
      </View>*/}

      <View style={styles.emptyWrap}>
        <Text style={styles.emptyTitle}>Nie masz żadnych skanów</Text>
        <Text style={styles.emptyText}>Utwórz nowy skan z aparatu lub zaimportowanych zdjęć.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#ececec' },
  topBar: {
    height: 72,
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#d4d4d4',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: { fontSize: 28, fontWeight: '700', color: '#0ea5a4' },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  search: { fontSize: 32, color: '#737373' },
  avatarRing: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: '#1d4ed8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarCore: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#22d3ee' },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, gap: 10 },
  emptyIcon: { fontSize: 84, opacity: 0.4 },
  emptyTitle: { fontSize: 42, color: '#5a5a5a', fontWeight: '600', textAlign: 'center' },
  emptyText: { fontSize: 18, color: '#6b7280', textAlign: 'center', lineHeight: 26 },
});
