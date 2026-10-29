import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';

import { haptic } from '../haptics';
import { useTheme } from '../theme';
import type { Task } from '../useTasks';
import { Checkbox } from './Checkbox';

type Props = {
  task: Task;
  color: string;
  onToggle: () => void;
  onMore: () => void;
};

export function TaskRow({ task, color, onToggle, onMore }: Props) {
  const theme = useTheme();
  const openMenu = () => {
    haptic.tap();
    onMore();
  };

  return (
    <Animated.View
      entering={FadeIn.duration(220)}
      exiting={FadeOut.duration(160)}
      layout={LinearTransition.springify().damping(20)}
      style={[styles.row, { backgroundColor: theme.surface }]}
    >
      <Checkbox checked={task.done} color={color} onToggle={onToggle} />
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
  more: {
    padding: 4,
  },
});
