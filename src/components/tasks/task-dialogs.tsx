"use client";

import { useTaskUi } from "@/store/task-ui-provider";
import type { SerializedTask } from "@/types/task";
import { DeleteTaskDialog } from "./delete-task-dialog";
import { TaskForm } from "./task-form";

export function TaskDialogs({ tasks }: { tasks: readonly SerializedTask[] }) {
  const dialog = useTaskUi((state) => state.dialog);
  if (!dialog) return null;

  const task = dialog.kind === "create" ? undefined : tasks.find(({ id }) => id === dialog.taskId);

  function focusVisible(elements: HTMLElement[]) {
    const target = elements.find((element) => element.getClientRects().length !== 0 && !element.matches(":disabled"));
    target?.focus();
    return !!target;
  }

  const restoreFocus = (event: Event, deleted = false) => {
    event.preventDefault();
    if (dialog.kind === "create") {
      if (focusVisible(Array.from(document.querySelectorAll<HTMLElement>(`[data-task-create="${dialog.opener}"]`)))) return;
    } else if (!deleted) {
      const row = document.querySelector(`[data-task-id="${CSS.escape(dialog.taskId)}"]`);
      if (row && focusVisible(Array.from(row.querySelectorAll<HTMLElement>(`[data-task-open="${dialog.kind}"], [data-task-open="menu"]`)))) return;
    }
    const fallback = document.querySelector<HTMLElement>("[data-task-search]") ??
      document.querySelector<HTMLElement>("[data-task-create='heading']");
    fallback?.focus();
  };

  return dialog.kind === "delete"
    ? <DeleteTaskDialog dialog={dialog} task={task} restoreFocus={restoreFocus} />
    : <TaskForm dialog={dialog} task={task} restoreFocus={restoreFocus} />;
}
