import type { SerializedTask, TaskPriority, TaskStatus } from "@/types/task";

import { calendarTimestamp, dueCalendarDay } from "./date-utils";

export type TaskOrder = "recent" | "oldest" | "due" | "priority";

export type TaskFilters = {
  search: string;
  status: TaskStatus | "all";
  priority: TaskPriority | "all";
};

export const emptyTaskFilters: TaskFilters = { search: "", status: "all", priority: "all" };

const priorityRank: Record<TaskPriority, number> = { alta: 0, média: 1, baixa: 2 };

function normalizeSearch(text: string) {
  return text.trim().toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");
}

export function hasTaskFilters({ search, status, priority }: TaskFilters) {
  return normalizeSearch(search) !== "" || status !== "all" || priority !== "all";
}

function compareText(a: string, b: string) {
  return a < b ? -1 : Number(a > b);
}

function compareDue(a: string | null, b: string | null) {
  if (a === b) return 0;
  if (a === null) return 1;
  if (b === null) return -1;
  return calendarTimestamp(a) - calendarTimestamp(b);
}

export function filterTasks(tasks: readonly SerializedTask[], filters: TaskFilters) {
  const term = normalizeSearch(filters.search);
  return tasks.filter((task) =>
    (filters.status === "all" || task.status === filters.status) &&
    (filters.priority === "all" || task.priority === filters.priority) &&
    (!term || normalizeSearch(task.title).includes(term))
  );
}

export function orderTasks(tasks: readonly SerializedTask[], order: TaskOrder) {
  return [...tasks].sort((a, b) => {
    const recent = Date.parse(b.createdAt) - Date.parse(a.createdAt);
    const tie = compareText(a.id, b.id);
    switch (order) {
      case "oldest": return -recent || tie;
      case "due": return compareDue(dueCalendarDay(a.dueDate), dueCalendarDay(b.dueDate)) || recent || tie;
      case "priority": return priorityRank[a.priority] - priorityRank[b.priority] || recent || tie;
      case "recent": return recent || tie;
    }
  });
}
