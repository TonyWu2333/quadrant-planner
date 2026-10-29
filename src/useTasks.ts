import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

import type { QuadrantId } from './quadrants';

export type Task = {
  id: string;
  title: string;
  quadrant: QuadrantId;
  done: boolean;
  createdAt: number;
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

  const add = useCallback((title: string, quadrant: QuadrantId) => {
    const now = Date.now();
    setTasks((prev) => [...prev, { id: `${now}`, title, quadrant, done: false, createdAt: now }]);
  }, []);

  const toggle = useCallback(
    (id: string) => setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))),
    [],
  );

  const move = useCallback(
    (id: string, quadrant: QuadrantId) =>
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, quadrant } : t))),
    [],
  );

  const remove = useCallback((id: string) => setTasks((prev) => prev.filter((t) => t.id !== id)), []);

  const clearDone = useCallback(
    (quadrant: QuadrantId) => setTasks((prev) => prev.filter((t) => !(t.quadrant === quadrant && t.done))),
    [],
  );

  return { tasks, loaded, add, toggle, move, remove, clearDone };
}

export type TaskActions = Omit<ReturnType<typeof useTasks>, 'tasks' | 'loaded'>;
