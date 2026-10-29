import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { addDays, relativeLabel, todayKey, type DateKey } from '../dates';
import { haptic } from '../haptics';
import { useTheme } from '../theme';

type Props = {
  value: DateKey | undefined;
  onChange: (date: DateKey | undefined) => void;
  color: string;
};

/** Quick date choices: none, today, tomorrow, plus the current value if it's another day. */
export function DateChips({ value, onChange, color }: Props) {
  const theme = useTheme();
  const today = todayKey();
  const tomorrow = addDays(today, 1);

  const options: { key: DateKey | undefined; label: string }[] = [
    { key: undefined, label: '不设日期' },
    { key: today, label: '今天' },
    { key: tomorrow, label: '明天' },
  ];
  if (value && value !== today && value !== tomorrow) {
    options.push({ key: value, label: relativeLabel(value) });
  }

  return (
    <View style={styles.row}>
      {options.map((o) => {
        const selected = o.key === value;
        return (
          <Pressable
            key={o.label}
            onPress={() => {
              if (!selected) haptic.select();
              onChange(o.key);
            }}
            style={[
              styles.chip,
              selected
                ? { backgroundColor: color, borderColor: color }
                : { borderColor: theme.border },
            ]}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
          >
            {o.key && (
              <Ionicons
                name="calendar-clear-outline"
                size={13}
                color={selected ? '#FFFFFF' : theme.textTertiary}
              />
            )}
            <Text style={[styles.label, { color: selected ? '#FFFFFF' : theme.textSecondary }]}>
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    height: 34,
    paddingHorizontal: 14,
    borderRadius: 17,
    borderWidth: 1.5,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
});
