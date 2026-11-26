import type { SerializedTask, TaskPriority, UpdateTaskInput } from "@/types/task";

import { calendarTimestamp, dueCalendarDay } from "./date-utils";

export const taskPriorities = { baixa: "Baixa", média: "Média", alta: "Alta" } satisfies Record<TaskPriority, string>;
export const taskTitleLimit = 120;
export const taskDescriptionLimit = 1000;

export type TaskFormValues = { title: string; description: string; priority: string; dueDate: string };
export type TaskField = keyof TaskFormValues;
export type TaskFieldErrors = Partial<Record<TaskField, string>>;

function isTaskPriority(value: string): value is TaskPriority {
  return Object.hasOwn(taskPriorities, value);
}

export function isTaskId(value: string) {
  return /^[a-f0-9]{24}$/i.test(value);
}

export function taskFormValues(task?: SerializedTask): TaskFormValues {
  return {
    title: task?.title ?? "",
    description: task?.description ?? "",
    priority: task?.priority ?? "média",
    dueDate: dueCalendarDay(task?.dueDate ?? null) ?? "",
  };
}

export function validateTaskForm(values: TaskFormValues, badDateInput = false, originalDueDate = "") {
  const title = values.title.trim();
  const description = values.description.trim();
  const priority = isTaskPriority(values.priority) ? values.priority : null;
  const dueDate = values.dueDate || null;
  const errors: TaskFieldErrors = {};

  if (!title) errors.title = "Informe o título da tarefa.";
  else if (title.length > taskTitleLimit) errors.title = "O título deve ter no máximo 120 caracteres.";
  if (description.length > taskDescriptionLimit) errors.description = "A descrição deve ter no máximo 1000 caracteres.";
  if (!priority) errors.priority = "Selecione uma prioridade válida.";

  if (badDateInput || (dueDate && dueDate !== originalDueDate && !isCalendarDate(dueDate))) {
    errors.dueDate = "Informe uma data válida.";
  }

  if (Object.keys(errors).length || !priority) return { errors } as const;
  return { value: { title, description, priority, dueDate } } as const;
}

function isCalendarDate(day: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || day.startsWith("0000")) return false;
  const timestamp = calendarTimestamp(day);
  return Number.isFinite(timestamp) && dueCalendarDay(new Date(timestamp).toISOString()) === day;
}

export function changedTaskFields(task: SerializedTask, value: NonNullable<ReturnType<typeof validateTaskForm>["value"]>) {
  const changes: Omit<UpdateTaskInput, "taskId"> = {};
  if (value.title !== task.title.trim()) changes.title = value.title;
  if (value.description !== (task.description ?? "").trim()) changes.description = value.description;
  if (value.priority !== task.priority) changes.priority = value.priority;
  if (value.dueDate !== dueCalendarDay(task.dueDate)) changes.dueDate = value.dueDate;
  return changes;
}
