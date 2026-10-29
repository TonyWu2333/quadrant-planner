import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import { AddTaskSheet } from './src/components/AddTaskSheet';
import { QuadrantCard } from './src/components/QuadrantCard';
import { QuadrantScreen } from './src/components/QuadrantScreen';
import { haptic } from './src/haptics';
import { QUADRANTS, type QuadrantId } from './src/quadrants';
import { useTheme } from './src/theme';
import { useTasks } from './src/useTasks';

const WEEKDAYS = '日一二三四五六';

function todayLabel() {
  const d = new Date();
  return `${d.getMonth() + 1}月${d.getDate()}日 · 星期${WEEKDAYS[d.getDay()]}`;
}

function Home() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { tasks, loaded, ...actions } = useTasks();
  const [openQuadrant, setOpenQuadrant] = useState<QuadrantId | null>(null);
  const [adding, setAdding] = useState(false);

  const total = tasks.length;
  const done = tasks.filter((t) => t.done).length;
  const progress = total ? done / total : 0;

  const rows = [QUADRANTS.slice(0, 2), QUADRANTS.slice(2)];

  return (
    <View style={[styles.screen, { backgroundColor: theme.background, paddingTop: insets.top + 12 }]}>
      <StatusBar style={theme.dark ? 'light' : 'dark'} />

      <View style={styles.header}>
        <Text style={[styles.date, { color: theme.textSecondary }]}>{todayLabel()}</Text>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: theme.text }]}>四象限</Text>
          <Text style={[styles.summary, { color: theme.textSecondary }]}>
            {total === 0 ? '还没有任务' : `已完成 ${done} / ${total}`}
          </Text>
        </View>
        <View style={[styles.track, { backgroundColor: theme.surfaceMuted }]}>
          <View style={[styles.fill, { width: `${progress * 100}%`, backgroundColor: theme.text }]} />
        </View>
      </View>

      {loaded && (
        <Animated.View entering={FadeIn.duration(250)} style={styles.grid}>
          {rows.map((row, i) => (
            <View key={i} style={styles.row}>
              {row.map((q) => (
                <QuadrantCard
                  key={q.id}
                  quadrant={q}
                  tasks={tasks.filter((t) => t.quadrant === q.id)}
                  onPress={() => {
                    haptic.tap();
                    setOpenQuadrant(q.id);
                  }}
                />
              ))}
            </View>
          ))}
        </Animated.View>
      )}

      <View style={{ height: insets.bottom + 96 }} />

      <Pressable
        onPress={() => {
          haptic.tap();
          setAdding(true);
        }}
        style={({ pressed }) => [
          styles.fab,
          {
            bottom: insets.bottom + 20,
            backgroundColor: theme.inverse,
            transform: [{ scale: pressed ? 0.94 : 1 }],
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel="新建任务"
      >
        <Ionicons name="add" size={30} color={theme.onInverse} />
      </Pressable>

      <AddTaskSheet
        visible={adding}
        initialQuadrant="do"
        onClose={() => setAdding(false)}
        onAdd={actions.add}
      />

      <QuadrantScreen
        quadrantId={openQuadrant}
        tasks={tasks}
        actions={actions}
        onClose={() => setOpenQuadrant(null)}
      />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <Home />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 18,
  },
  date: {
    fontSize: 14,
    fontWeight: '500',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  summary: {
    fontSize: 14,
    fontWeight: '500',
    fontVariant: ['tabular-nums'],
  },
  track: {
    height: 4,
    borderRadius: 2,
    marginTop: 14,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 2,
  },
  grid: {
    flex: 1,
    paddingHorizontal: 14,
    gap: 12,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  fab: {
    position: 'absolute',
    alignSelf: 'center',
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.22,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
});
