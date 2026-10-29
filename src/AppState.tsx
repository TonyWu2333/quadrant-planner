import { createContext, useContext, useState, type ReactNode } from 'react';

import { todayKey, type DateKey } from './dates';
import type { QuadrantId } from './quadrants';
import { useTasks, type Task, type TaskActions } from './useTasks';

export type AddRequest = { quadrant: QuadrantId; date?: DateKey };

type AppState = {
  tasks: Task[];
  loaded: boolean;
  actions: TaskActions;
  /** Day selected on the calendar tab; new tasks created there land on it. */
  calendarDate: DateKey;
  setCalendarDate: (date: DateKey) => void;
  /** Open overlays, rendered once in the root layout above both tabs. */
  addRequest: AddRequest | null;
  openAdd: (request: AddRequest) => void;
  closeAdd: () => void;
  openQuadrant: QuadrantId | null;
  setOpenQuadrant: (id: QuadrantId | null) => void;
  /** Task whose "⋯" menu is open. */
  menuTaskId: string | null;
  setMenuTaskId: (id: string | null) => void;
};

const Context = createContext<AppState | null>(null);

/** One task store shared by the matrix and the calendar, so both always agree. */
export function AppStateProvider({ children }: { children: ReactNode }) {
  const { tasks, loaded, actions } = useTasks();
  const [calendarDate, setCalendarDate] = useState(todayKey);
  const [addRequest, setAddRequest] = useState<AddRequest | null>(null);
  const [openQuadrant, setOpenQuadrant] = useState<QuadrantId | null>(null);
  const [menuTaskId, setMenuTaskId] = useState<string | null>(null);

  return (
    <Context.Provider
      value={{
        tasks,
        loaded,
        actions,
        calendarDate,
        setCalendarDate,
        addRequest,
        openAdd: setAddRequest,
        closeAdd: () => setAddRequest(null),
        openQuadrant,
        setOpenQuadrant,
        menuTaskId,
        setMenuTaskId,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useAppState() {
  const state = useContext(Context);
  if (!state) throw new Error('useAppState must be used inside AppStateProvider');
  return state;
}
