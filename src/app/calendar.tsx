import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppState } from '../AppState';
import { TaskRow } from '../components/TaskRow';
import { fromKey, longLabel, monthGrid, todayKey, toKey, WEEK_HEADER, type DateKey } from '../dates';
import { haptic } from '../haptics';
import { QUADRANTS } from '../quadrants';
import { useTheme } from '../theme';
import type { Task } from '../useTasks';

const MAX_DOTS = 3;

export default function CalendarScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { tasks, actions, calendarDate: selected, setCalendarDate, setMenuTaskId } = useAppState();
  const [month, setMonth] = useState(() => {
    const d = fromKey(selected);
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const today = todayKey();
  // Explicit 7-cell rows: percentage widths can round to a 6-per-row wrap on Android.
  const days = monthGrid(month);
  const weeks = Array.from({ length: 6 }, (_, i) => days.slice(i * 7, i * 7 + 7));

  const byDay = useMemo(() => {
    const map = new Map<DateKey, Task[]>();
    for (const t of tasks) {
      if (!t.date) continue;
      map.set(t.date, [...(map.get(t.date) ?? []), t]);
    }
    return map;
  }, [tasks]);

  const dayTasks = [...(byDay.get(selected) ?? [])].sort(
    (a, b) => Number(a.done) - Number(b.done) || QUADRANTS.findIndex((q) => q.id === a.quadrant) - QUADRANTS.findIndex((q) => q.id === b.quadrant),
  );
  const openCount = dayTasks.filter((t) => !t.done).length;

  const shiftMonth = (delta: number) => {
    haptic.select();
    setMonth((m) => new Date(m.getFullYear(), m.getMonth() + delta, 1));
  };

  const select = (key: DateKey) => {
    if (key !== selected) haptic.select();
    setCalendarDate(key);
    const d = fromKey(key);
    if (d.getMonth() !== month.getMonth() || d.getFullYear() !== month.getFullYear()) {
      setMonth(new Date(d.getFullYear(), d.getMonth(), 1));
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.background, paddingTop: insets.top + 12 }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.year, { color: theme.textSecondary }]}>{month.getFullYear()}年</Text>
          <Text style={[styles.title, { color: theme.text }]}>{month.getMonth() + 1}月</Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable
            onPress={() => select(today)}
            style={[styles.todayButton, { backgroundColor: theme.surfaceMuted }]}
            hitSlop={6}
          >
            <Text style={[styles.todayText, { color: theme.text }]}>今天</Text>
          </Pressable>
          <Pressable
            onPress={() => shiftMonth(-1)}
            style={[styles.navButton, { backgroundColor: theme.surfaceMuted }]}
            hitSlop={6}
            accessibilityLabel="上个月"
          >
            <Ionicons name="chevron-back" size={18} color={theme.text} />
          </Pressable>
          <Pressable
            onPress={() => shiftMonth(1)}
            style={[styles.navButton, { backgroundColor: theme.surfaceMuted }]}
            hitSlop={6}
            accessibilityLabel="下个月"
          >
            <Ionicons name="chevron-forward" size={18} color={theme.text} />
          </Pressable>
        </View>
      </View>

      <View style={[styles.calendar, { backgroundColor: theme.surface }]}>
        <View style={styles.week}>
          {WEEK_HEADER.map((w, i) => (
            <Text
              key={w}
              style={[styles.weekday, { color: i >= 5 ? theme.textTertiary : theme.textSecondary }]}
            >
              {w}
            </Text>
          ))}
        </View>
        {weeks.map((week, w) => (
          <View key={w} style={styles.weekRow}>
            {week.map((d) => {
              const key = toKey(d);
              const inMonth = d.getMonth() === month.getMonth();
              const isSelected = key === selected;
              const isToday = key === today;
              const list = byDay.get(key) ?? [];
              const openColors = QUADRANTS.filter((q) => list.some((t) => !t.done && t.quadrant === q.id)).map(
                (q) => q.color,
              );
              const dots = openColors.length ? openColors : list.length ? [theme.textTertiary] : [];

              return (
                <Pressable key={key} style={styles.cell} onPress={() => select(key)}>
                  <View
                    style={[
                      styles.dayCircle,
                      isSelected && { backgroundColor: theme.inverse },
                      !isSelected && isToday && { borderWidth: 1.5, borderColor: theme.text },
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        {
                          color: isSelected
                            ? theme.onInverse
                            : inMonth
                              ? theme.text
                              : theme.textTertiary,
                          fontWeight: isSelected || isToday ? '700' : '500',
                          opacity: inMonth || isSelected ? 1 : 0.5,
                        },
                      ]}
                    >
                      {d.getDate()}
                    </Text>
                  </View>
                  <View style={styles.dots}>
                    {dots.slice(0, MAX_DOTS).map((c, i) => (
                      <View key={i} style={[styles.dot, { backgroundColor: c, opacity: inMonth ? 1 : 0.5 }]} />
                    ))}
                  </View>
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>

      <View style={styles.dayHeader}>
        <Text style={[styles.dayTitle, { color: theme.text }]}>
          {selected === today ? '今天' : longLabel(selected)}
        </Text>
        <Text style={[styles.dayCount, { color: theme.textSecondary }]}>
          {dayTasks.length === 0 ? '' : openCount === 0 ? '全部完成' : `${openCount} 项待办`}
        </Text>
      </View>

      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {dayTasks.length === 0 ? (
          <View style={styles.empty}>
            <Text style={[styles.emptyTitle, { color: theme.textSecondary }]}>这天还没有安排</Text>
            <Text style={[styles.emptyText, { color: theme.textTertiary }]}>点下方 + 添加到这一天</Text>
          </View>
        ) : (
          dayTasks.map((t) => (
            <TaskRow
              key={t.id}
              task={t}
              meta="quadrant"
              onToggle={() => actions.toggle(t.id)}
              onMore={() => setMenuTaskId(t.id)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  year: {
    fontSize: 14,
    fontWeight: '500',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginTop: 4,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  todayButton: {
    height: 34,
    paddingHorizontal: 14,
    borderRadius: 17,
    justifyContent: 'center',
  },
  todayText: {
    fontSize: 14,
    fontWeight: '600',
  },
  navButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendar: {
    marginHorizontal: 14,
    borderRadius: 24,
    paddingHorizontal: 6,
    paddingTop: 12,
    paddingBottom: 6,
  },
  week: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  weekday: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
  },
  weekRow: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 3,
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    fontSize: 15,
    fontVariant: ['tabular-nums'],
  },
  dots: {
    flexDirection: 'row',
    gap: 3,
    height: 5,
    marginTop: 3,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  dayCount: {
    fontSize: 13,
    fontWeight: '500',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 14,
    paddingBottom: 40,
    gap: 8,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 24,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 13,
    marginTop: 4,
  },
});
