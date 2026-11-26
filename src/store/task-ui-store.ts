import { createStore } from "zustand/vanilla";

import { emptyTaskFilters, type TaskFilters, type TaskOrder } from "@/lib/task-utils";

export type TaskDialog =
  | { kind: "create"; opener: "heading" | "empty" }
  | { kind: "edit" | "delete"; taskId: string };

type TaskUiState = TaskFilters & {
  order: TaskOrder;
  filtersOpen: boolean;
  setSearch: (search: string) => void;
  setStatus: (status: TaskFilters["status"]) => void;
  setPriority: (priority: TaskFilters["priority"]) => void;
  setOrder: (order: TaskOrder) => void;
  setFiltersOpen: (filtersOpen: boolean) => void;
  clearFilters: () => void;
  dialog: TaskDialog | null;
  pending: ReadonlyMap<string, symbol>;
  creationUnconfirmed: boolean;
  sessionExpired: boolean;
  openDialog: (dialog: TaskDialog) => void;
  closeDialog: (dialog: TaskDialog) => void;
  beginMutation: (key: string) => symbol | undefined;
  finishMutation: (key: string, token: symbol) => void;
  markCreationUnconfirmed: () => void;
  expireSession: () => void;
  discardState: () => void;
};

export function createTaskUiStore() {
  return createStore<TaskUiState>()((set, get) => ({
    ...emptyTaskFilters,
    order: "recent",
    filtersOpen: false,
    setSearch: (search) => set({ search }),
    setStatus: (status) => set({ status }),
    setPriority: (priority) => set({ priority }),
    setOrder: (order) => set({ order }),
    setFiltersOpen: (filtersOpen) => set({ filtersOpen }),
    clearFilters: () => set(emptyTaskFilters),
    dialog: null,
    pending: new Map(),
    creationUnconfirmed: false,
    sessionExpired: false,
    openDialog: (dialog) => {
      const state = get();
      const key = dialog.kind === "create" ? "create" : dialog.taskId;
      if (!state.dialog && !state.filtersOpen && !state.sessionExpired && !state.pending.has(key)) set({ dialog });
    },
    closeDialog: (dialog) => {
      if (get().dialog === dialog) set({ dialog: null });
    },
    beginMutation: (key) => {
      const { pending, sessionExpired, creationUnconfirmed } = get();
      if (sessionExpired || pending.has(key) || (key === "create" && creationUnconfirmed)) return;
      const token = Symbol();
      set({ pending: new Map(pending).set(key, token) });
      return token;
    },
    finishMutation: (key, token) => {
      const { pending } = get();
      if (pending.get(key) !== token) return;
      const next = new Map(pending);
      next.delete(key);
      set({ pending: next });
    },
    markCreationUnconfirmed: () => set({ creationUnconfirmed: true }),
    expireSession: () => set({ ...emptyTaskFilters, order: "recent", filtersOpen: false, dialog: null, pending: new Map(), creationUnconfirmed: false, sessionExpired: true }),
    discardState: () => set({ ...emptyTaskFilters, order: "recent", filtersOpen: false, dialog: null, pending: new Map(), creationUnconfirmed: false }),
  }));
}
