import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { haptic } from '../haptics';
import { quadrantById, type QuadrantId } from '../quadrants';
import { useTheme, withAlpha } from '../theme';
import { useKeyboardHeight } from '../useKeyboardHeight';
import type { Task, TaskActions } from '../useTasks';
import { TaskActionsSheet } from './TaskActionsSheet';
import { TaskRow } from './TaskRow';

type Props = {
  quadrantId: QuadrantId | null;
  tasks: Task[];
  actions: TaskActions;
  onClose: () => void;
};

export function QuadrantScreen({ quadrantId, tasks, actions, onClose }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const keyboardHeight = useKeyboardHeight();
  const [draft, setDraft] = useState('');
  const [menuTask, setMenuTask] = useState<Task | null>(null);
  const [showDone, setShowDone] = useState(true);

  // The Modal is hidden when quadrantId is null, so the fallback is never seen.
  const quadrant = quadrantById(quadrantId ?? 'do');

  const mine = tasks.filter((t) => t.quadrant === quadrant.id);
  const open = mine.filter((t) => !t.done);
  const done = mine.filter((t) => t.done);

  const submit = () => {
    const title = draft.trim();
    if (!title) return;
    haptic.success();
    actions.add(title, quadrant.id);
    setDraft('');
  };

  const close = () => {
    setDraft('');
    onClose();
  };

  // The task menu is drawn inside this Modal, so back closes it first.
  const handleBack = () => (menuTask ? setMenuTask(null) : close());

  const renderRow = (t: Task) => (
    <TaskRow
      key={t.id}
      task={t}
      color={quadrant.color}
      onToggle={() => actions.toggle(t.id)}
      onMore={() => setMenuTask(t)}
    />
  );

  return (
    <Modal
      visible={quadrantId !== null}
      animationType="none"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={handleBack}
    >
      <View
        style={[
          styles.screen,
          { backgroundColor: theme.background, paddingTop: insets.top + 8, paddingBottom: keyboardHeight },
        ]}
      >
        <View style={styles.topBar}>
          <Pressable
            onPress={close}
            hitSlop={8}
            style={[styles.close, { backgroundColor: theme.surfaceMuted }]}
            accessibilityLabel="返回"
          >
            <Ionicons name="chevron-down" size={22} color={theme.text} />
          </Pressable>
          {done.length > 0 && (
            <Pressable
              onPress={() => {
                haptic.warn();
                actions.clearDone(quadrant.id);
              }}
              hitSlop={8}
            >
              <Text style={[styles.clear, { color: theme.textSecondary }]}>清除已完成</Text>
            </Pressable>
          )}
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.hero}>
            <View style={[styles.heroIcon, { backgroundColor: quadrant.color }]}>
              <Ionicons name={quadrant.icon} size={22} color="#FFFFFF" />
            </View>
            <Text style={[styles.title, { color: theme.text }]}>{quadrant.title}</Text>
            <Text style={[styles.action, { color: quadrant.color }]}>{quadrant.action}</Text>
            <Text style={[styles.description, { color: theme.textSecondary }]}>
              {quadrant.description}
            </Text>
          </View>

          {mine.length === 0 ? (
            <View style={styles.empty}>
              <View style={[styles.emptyIcon, { backgroundColor: withAlpha(quadrant.color, theme.tintAlpha) }]}>
                <Ionicons name={quadrant.icon} size={30} color={quadrant.color} />
              </View>
              <Text style={[styles.emptyTitle, { color: theme.text }]}>这里还没有任务</Text>
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                在下方输入，直接添加到「{quadrant.title}」
              </Text>
            </View>
          ) : (
            <>
              <Text style={[styles.section, { color: theme.textSecondary }]}>
                待办 · {open.length}
              </Text>
              <View style={styles.list}>
                {open.map(renderRow)}
                {open.length === 0 && (
                  <Text style={[styles.allDone, { color: theme.textTertiary }]}>都做完了，干得漂亮</Text>
                )}
              </View>

              {done.length > 0 && (
                <Animated.View layout={LinearTransition}>
                  <Pressable
                    onPress={() => setShowDone((v) => !v)}
                    style={styles.sectionToggle}
                    hitSlop={6}
                  >
                    <Text style={[styles.section, styles.sectionInline, { color: theme.textSecondary }]}>
                      已完成 · {done.length}
                    </Text>
                    <Ionicons
                      name={showDone ? 'chevron-up' : 'chevron-down'}
                      size={14}
                      color={theme.textSecondary}
                    />
                  </Pressable>
                  {showDone && <View style={styles.list}>{done.map(renderRow)}</View>}
                </Animated.View>
              )}
            </>
          )}
        </ScrollView>

        <View
          style={[
            styles.composer,
            {
              backgroundColor: theme.background,
              borderTopColor: theme.border,
              paddingBottom: keyboardHeight ? 12 : Math.max(insets.bottom, 12) + 4,
            },
          ]}
        >
          <TextInput
            value={draft}
            onChangeText={setDraft}
            onSubmitEditing={submit}
            submitBehavior="submit"
            returnKeyType="done"
            placeholder={`添加到「${quadrant.title}」`}
            placeholderTextColor={theme.textTertiary}
            selectionColor={quadrant.color}
            style={[styles.input, { color: theme.text, backgroundColor: theme.surface }]}
          />
          <Pressable
            onPress={submit}
            disabled={!draft.trim()}
            style={[styles.send, { backgroundColor: quadrant.color, opacity: draft.trim() ? 1 : 0.35 }]}
            accessibilityLabel="添加"
          >
            <Ionicons name="arrow-up" size={22} color="#FFFFFF" />
          </Pressable>
        </View>

        <TaskActionsSheet
          task={menuTask}
          onClose={() => setMenuTask(null)}
          onMove={actions.move}
          onRemove={actions.remove}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 44,
  },
  close: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clear: {
    fontSize: 14,
    fontWeight: '600',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  hero: {
    paddingHorizontal: 4,
    paddingTop: 12,
    paddingBottom: 20,
  },
  heroIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  action: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 4,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
  section: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 4,
    marginBottom: 10,
  },
  sectionInline: {
    marginBottom: 0,
  },
  sectionToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 22,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  list: {
    gap: 8,
  },
  allDone: {
    fontSize: 14,
    marginLeft: 4,
    paddingVertical: 8,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 48,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  emptyText: {
    fontSize: 14,
    marginTop: 6,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  input: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 18,
    fontSize: 16,
  },
  send: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
