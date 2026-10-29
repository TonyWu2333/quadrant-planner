import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { haptic } from '../haptics';
import { QUADRANTS, type QuadrantId } from '../quadrants';
import { useTheme, withAlpha } from '../theme';
import type { Task } from '../useTasks';
import { Sheet } from './Sheet';

type Props = {
  task: Task | null;
  onClose: () => void;
  onMove: (id: string, quadrant: QuadrantId) => void;
  onRemove: (id: string) => void;
};

export function TaskActionsSheet({ task, onClose, onMove, onRemove }: Props) {
  const theme = useTheme();

  return (
    <Sheet visible={task !== null} onClose={onClose}>
      {task && (
        <>
          <Text style={[styles.task, { color: theme.text }]} numberOfLines={2}>
            {task.title}
          </Text>

          <Text style={[styles.label, { color: theme.textSecondary }]}>移动到</Text>
          <View style={[styles.group, { backgroundColor: theme.surfaceMuted }]}>
            {QUADRANTS.map((q, i) => {
              const current = q.id === task.quadrant;
              return (
                <Pressable
                  key={q.id}
                  disabled={current}
                  onPress={() => {
                    haptic.select();
                    onMove(task.id, q.id);
                    onClose();
                  }}
                  style={({ pressed }) => [
                    styles.item,
                    i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.border },
                    pressed && { backgroundColor: withAlpha(q.color, theme.tintAlpha) },
                  ]}
                >
                  <View style={[styles.icon, { backgroundColor: q.color }]}>
                    <Ionicons name={q.icon} size={14} color="#FFFFFF" />
                  </View>
                  <Text style={[styles.itemTitle, { color: theme.text }]}>{q.title}</Text>
                  <Text style={[styles.itemAction, { color: theme.textTertiary }]}>
                    {current ? '当前' : q.action}
                  </Text>
                  {current && <Ionicons name="checkmark" size={18} color={q.color} />}
                </Pressable>
              );
            })}
          </View>

          <Pressable
            onPress={() => {
              haptic.warn();
              onRemove(task.id);
              onClose();
            }}
            style={({ pressed }) => [
              styles.delete,
              { backgroundColor: withAlpha(theme.danger, pressed ? 0.2 : 0.1) },
            ]}
          >
            <Ionicons name="trash-outline" size={18} color={theme.danger} />
            <Text style={[styles.deleteText, { color: theme.danger }]}>删除任务</Text>
          </Pressable>
        </>
      )}
    </Sheet>
  );
}

const styles = StyleSheet.create({
  task: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  group: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  icon: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  itemAction: {
    fontSize: 13,
  },
  delete: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 50,
    borderRadius: 16,
    marginTop: 16,
  },
  deleteText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
