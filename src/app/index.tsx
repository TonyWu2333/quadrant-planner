import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppState } from '../AppState';
import { QuadrantCard } from '../components/QuadrantCard';
import { longLabel, todayKey } from '../dates';
import { haptic } from '../haptics';
import { QUADRANTS } from '../quadrants';
import { useTheme } from '../theme';

export default function MatrixScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { tasks, loaded, setOpenQuadrant } = useAppState();

  const total = tasks.length;
  const done = tasks.filter((t) => t.done).length;
  const progress = total ? done / total : 0;

  const rows = [QUADRANTS.slice(0, 2), QUADRANTS.slice(2)];

  return (
    <View style={[styles.screen, { backgroundColor: theme.background, paddingTop: insets.top + 12 }]}>
      <View style={styles.header}>
        <Text style={[styles.date, { color: theme.textSecondary }]}>{longLabel(todayKey())}</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    // Clears the tab bar's raised "+" button.
    paddingBottom: 40,
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
});
