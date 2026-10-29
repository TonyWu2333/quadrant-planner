import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { haptic } from '../haptics';
import { QUADRANTS, type QuadrantId } from '../quadrants';
import { useTheme, withAlpha } from '../theme';

type Props = {
  value: QuadrantId;
  onChange: (id: QuadrantId) => void;
};

/** The 2×2 quadrant chooser used when creating a task. */
export function QuadrantPicker({ value, onChange }: Props) {
  const theme = useTheme();

  return (
    <View style={styles.grid}>
      {QUADRANTS.map((q) => {
        const selected = q.id === value;
        return (
          <Pressable
            key={q.id}
            onPress={() => {
              if (!selected) haptic.select();
              onChange(q.id);
            }}
            style={[
              styles.option,
              {
                borderColor: selected ? q.color : theme.border,
                backgroundColor: selected ? withAlpha(q.color, theme.tintAlpha) : 'transparent',
              },
            ]}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
          >
            <Ionicons name={q.icon} size={16} color={selected ? q.color : theme.textTertiary} />
            <View style={styles.label}>
              <Text style={[styles.title, { color: selected ? theme.text : theme.textSecondary }]}>
                {q.title}
              </Text>
              <Text style={[styles.action, { color: selected ? q.color : theme.textTertiary }]}>
                {q.action}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  option: {
    flexBasis: '47%',
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  label: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
  },
  action: {
    fontSize: 12,
    marginTop: 1,
  },
});
