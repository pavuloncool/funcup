import { getFlavorNotesForReputation } from '@funcup/shared';
import { Text, View } from 'react-native';

export function FlavorNoteSelector(props: { reputationScore?: number }) {
  const visibleNotes = getFlavorNotesForReputation(props.reputationScore ?? 0);

  return (
    <View style={{ paddingVertical: 12 }}>
      <Text style={{ fontSize: 16, fontWeight: '600' }}>Flavor notes</Text>
      <Text style={{ color: '#4b5563' }}>Visible notes: {visibleNotes.length}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
        {visibleNotes.map((note) => (
          <View
            key={note.name}
            style={{
              borderWidth: 1,
              borderColor: '#d1d5db',
              borderRadius: 999,
              paddingHorizontal: 10,
              paddingVertical: 4,
            }}
          >
            <Text>{note.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

