import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

import type { DateKey } from './dates';
import type { QuadrantId } from './quadrants';

export type Task = {
  id: string;
  title: string;
  quadrant: QuadrantId;
  done: boolean;
  createdAt: number;
  /** Day the task is scheduled for; unscheduled tasks only live in the matrix. */
  date?: DateKey;
};

const STORAGE_KEY = 'quadrant-planner/tasks';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!raw) return;
        // Tasks saved by the first version have no createdAt.
        setTasks(JSON.parse(raw).map((t: Task) => ({ ...t, createdAt: t.createdAt ?? Number(t.id) })));
      })
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (loaded) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks, loaded]);

  const add = useCallback((title: string, quadrant: QuadrantId, date?: DateKey) => {
    const now = Date.now();
    setTasks((prev) => [...prev, { id: `${now}`, title, quadrant, done: false, createdAt: now, date }]);
  }, []);

  const update = useCallback(
    (id: string, patch: (t: Task) => Partial<Task>) =>
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch(t) } : t))),
    [],
  );

  const toggle = useCallback((id: string) => update(id, (t) => ({ done: !t.done })), [update]);

  const move = useCallback((id: string, quadrant: QuadrantId) => update(id, () => ({ quadrant })), [update]);

  const setDate = useCallback(
    (id: string, date: DateKey | undefined) => update(id, () => ({ date })),
    [update],
  );

  const remove = useCallback((id: string) => setTasks((prev) => prev.filter((t) => t.id !== id)), []);

  const clearDone = useCallback(
    (quadrant: QuadrantId) => setTasks((prev) => prev.filter((t) => !(t.quadrant === quadrant && t.done))),
    [],
  );

  return { tasks, loaded, actions: { add, toggle, move, setDate, remove, clearDone } };
}

export type TaskActions = ReturnType<typeof useTasks>['actions'];
