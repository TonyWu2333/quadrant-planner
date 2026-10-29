import { Ionicons } from '@expo/vector-icons';
import { usePathname } from 'expo-router';
import { TabTrigger, type TabTriggerSlotProps } from 'expo-router/ui';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppState } from '../AppState';
import { haptic } from '../haptics';
import { useTheme } from '../theme';

type IconName = ComponentProps<typeof Ionicons>['name'];

/** Bottom bar: matrix tab, a central "+" for new tasks, calendar tab. */
export function TabBar() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const { openAdd, calendarDate } = useAppState();

  const add = () => {
    haptic.tap();
    // From the calendar, the new task lands on the selected day.
    openAdd(pathname === '/calendar' ? { quadrant: 'do', date: calendarDate } : { quadrant: 'do' });
  };

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
          paddingBottom: Math.max(insets.bottom, 8),
        },
      ]}
    >
      <TabTrigger name="index" asChild>
        <TabButton icon="grid" label="四象限" />
      </TabTrigger>

      <Pressable
        onPress={add}
        style={({ pressed }) => [
          styles.add,
          { backgroundColor: theme.inverse, transform: [{ scale: pressed ? 0.94 : 1 }] },
        ]}
        accessibilityRole="button"
        accessibilityLabel="新建任务"
      >
        <Ionicons name="add" size={30} color={theme.onInverse} />
      </Pressable>

      <TabTrigger name="calendar" asChild>
        <TabButton icon="calendar" label="日历" />
      </TabTrigger>
    </View>
  );
}

// Only onPress/isFocused are needed from the trigger slot.
function TabButton({
  icon,
  label,
  isFocused,
  onPress,
}: TabTriggerSlotProps & { icon: IconName; label: string }) {
  const theme = useTheme();
  const color = isFocused ? theme.text : theme.textTertiary;
  return (
    <Pressable
      onPress={(e) => {
        if (!isFocused) haptic.select();
        onPress?.(e);
      }}
      style={styles.tab}
      accessibilityRole="tab"
      accessibilityState={{ selected: isFocused }}
    >
      <Ionicons name={isFocused ? icon : (`${icon}-outline` as IconName)} size={24} color={color} />
      <Text style={[styles.tabLabel, { color }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
    paddingVertical: 4,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  add: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -28,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
});
