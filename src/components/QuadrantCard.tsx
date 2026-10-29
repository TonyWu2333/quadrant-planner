import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import type { Quadrant } from '../quadrants';
import { useTheme, withAlpha } from '../theme';
import type { Task } from '../useTasks';

const PREVIEW_LIMIT = 4;

type Props = {
  quadrant: Quadrant;
  tasks: Task[];
  onPress: () => void;
};

export function QuadrantCard({ quadrant, tasks, onPress }: Props) {
  const theme = useTheme();
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const open = tasks.filter((t) => !t.done);
  const doneCount = tasks.length - open.length;
  const preview = open.slice(0, PREVIEW_LIMIT);
  const hidden = open.length - preview.length;

  return (
    <Animated.View style={[styles.wrap, animatedStyle]}>
      <Pressable
        onPress={onPress}
        onPressIn={() => scale.set(withSpring(0.97, { damping: 18, stiffness: 320 }))}
        onPressOut={() => scale.set(withSpring(1, { damping: 14, stiffness: 260 }))}
        style={[
          styles.card,
          {
            backgroundColor: theme.surface,
            borderColor: withAlpha(quadrant.color, theme.dark ? 0.28 : 0.16),
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel={`${quadrant.title}，${open.length} 项待办`}
      >
        <View style={[styles.wash, { backgroundColor: withAlpha(quadrant.color, theme.tintAlpha) }]} />

        <View style={styles.header}>
          <View style={[styles.icon, { backgroundColor: quadrant.color }]}>
            <Ionicons name={quadrant.icon} size={16} color="#FFFFFF" />
          </View>
          <Text style={[styles.count, { color: open.length ? theme.text : theme.textTertiary }]}>
            {open.length}
          </Text>
        </View>

        <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
          {quadrant.title}
        </Text>
        <Text style={[styles.action, { color: quadrant.color }]}>{quadrant.action}</Text>

        <View style={styles.preview}>
          {preview.map((t) => (
            <View key={t.id} style={styles.previewRow}>
              <View style={[styles.dot, { backgroundColor: quadrant.color }]} />
              <Text style={[styles.previewText, { color: theme.textSecondary }]} numberOfLines={1}>
                {t.title}
              </Text>
            </View>
          ))}
          {hidden > 0 && (
            <Text style={[styles.more, { color: theme.textTertiary }]}>还有 {hidden} 项</Text>
          )}
          {open.length === 0 && (
            <Text style={[styles.empty, { color: theme.textTertiary }]}>
              {doneCount > 0 ? `已全部完成 · ${doneCount}` : '暂无任务'}
            </Text>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
  },
  card: {
    flex: 1,
    borderRadius: 24,
    borderWidth: 1,
    padding: 16,
    overflow: 'hidden',
  },
  wash: {
    ...StyleSheet.absoluteFill,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  count: {
    fontSize: 28,
    lineHeight: 32,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  action: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  preview: {
    flex: 1,
    marginTop: 12,
    gap: 7,
    overflow: 'hidden',
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  previewText: {
    flex: 1,
    fontSize: 13,
  },
  more: {
    fontSize: 12,
    marginLeft: 13,
  },
  empty: {
    fontSize: 13,
  },
});
