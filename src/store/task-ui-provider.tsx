"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useStore } from "zustand";

import { Feedback } from "@/components/feedback/feedback";
import { createTaskUiStore } from "./task-ui-store";

type Store = ReturnType<typeof createTaskUiStore>;
type State = ReturnType<Store["getState"]>;

const TaskUiContext = createContext<Store | null>(null);

export function TaskUiProvider({ children }: { children: ReactNode }) {
  const [store] = useState(createTaskUiStore);
  const sessionExpired = useStore(store, (state) => state.sessionExpired);
  useEffect(() => () => store.getState().discardState(), [store]);

  return (
    <TaskUiContext.Provider value={store}>
      {sessionExpired ? (
        <main className="content-container py-8">
          <Feedback variant="warning">Sua sessão terminou. Entre novamente para continuar.</Feedback>
        </main>
      ) : children}
    </TaskUiContext.Provider>
  );
}

export function useTaskUiStore() {
  const store = useContext(TaskUiContext);
  if (!store) throw new Error("TaskUiProvider é necessário para usar o estado das tarefas.");
  return store;
}

export function useTaskUi<T>(selector: (state: State) => T) {
  return useStore(useTaskUiStore(), selector);
}
