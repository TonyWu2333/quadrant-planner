import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';

import { relativeLabel, todayKey } from '../dates';
import { haptic } from '../haptics';
import { quadrantById } from '../quadrants';
import { useTheme } from '../theme';
import type { Task } from '../useTasks';
import { Checkbox } from './Checkbox';

type Props = {
  task: Task;
  onToggle: () => void;
  onMore: () => void;
  /** What to show under the title: the scheduled day (matrix) or the quadrant (calendar). */
  meta: 'date' | 'quadrant';
};

export function TaskRow({ task, onToggle, onMore, meta }: Props) {
  const theme = useTheme();
  const quadrant = quadrantById(task.quadrant);
  const openMenu = () => {
    haptic.tap();
    onMore();
  };

  let metaText: string | null = null;
  let metaColor = theme.textTertiary;
  if (meta === 'quadrant') {
    metaText = quadrant.title;
    metaColor = quadrant.color;
  } else if (task.date) {
    const overdue = !task.done && task.date < todayKey();
    metaText = overdue ? `已过期 · ${relativeLabel(task.date)}` : relativeLabel(task.date);
    if (overdue) metaColor = theme.danger;
  }

  return (
    <Animated.View
      entering={FadeIn.duration(220)}
      exiting={FadeOut.duration(160)}
      layout={LinearTransition.springify().damping(20)}
      style={[styles.row, { backgroundColor: theme.surface }]}
    >
      <Checkbox checked={task.done} color={quadrant.color} onToggle={onToggle} />
      <Pressable style={styles.body} onPress={onToggle} onLongPress={openMenu} delayLongPress={350}>
        <Text
          style={[
            styles.title,
            { color: task.done ? theme.textTertiary : theme.text },
            task.done && styles.done,
          ]}
        >
          {task.title}
        </Text>
        {metaText && (
          <View style={styles.meta}>
            {meta === 'quadrant' ? (
              <View style={[styles.dot, { backgroundColor: quadrant.color }]} />
            ) : (
              <Ionicons name="calendar-clear-outline" size={12} color={metaColor} />
            )}
            <Text style={[styles.metaText, { color: metaColor }]}>{metaText}</Text>
          </View>
        )}
      </Pressable>
      <Pressable onPress={openMenu} hitSlop={10} style={styles.more} accessibilityLabel="更多操作">
        <Ionicons name="ellipsis-horizontal" size={18} color={theme.textTertiary} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    paddingLeft: 16,
    paddingRight: 12,
    borderRadius: 16,
  },
  body: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    lineHeight: 22,
  },
  done: {
    textDecorationLine: 'line-through',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 3,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '500',
  },
  more: {
    padding: 4,
  },
});
