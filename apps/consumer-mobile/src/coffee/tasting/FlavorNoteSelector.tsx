import { getFlavorNotesForReputation } from '@funcup/shared';
import { StyleSheet, View } from 'react-native';
import { AppChip, AppPanel, AppText } from '../../components/ui/primitives';

export function FlavorNoteSelector(props: { reputationScore?: number }) {
  const visibleNotes = getFlavorNotesForReputation(props.reputationScore ?? 0);

  return (
    <AppPanel style={styles.section}>
      <AppText variant="body" weight="600">Flavor notes</AppText>
      <AppText tone="secondary">Visible notes: {visibleNotes.length}</AppText>
      <View style={styles.list}>
        {visibleNotes.map((note) => (
          <AppChip key={note.name} label={note.label} />
        ))}
      </View>
    </AppPanel>
  );
}

const styles = StyleSheet.create({
  section: { paddingVertical: 12 },
  list: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
});
