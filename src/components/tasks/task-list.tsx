"use client";

import { CalendarDays } from "lucide-react";
import { useId, useState, useSyncExternalStore } from "react";
import { toast } from "sonner";

import { updateTask } from "@/app/actions/task-actions";
import { LoadingSpinner } from "@/components/feedback/loading-spinner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { describeDueDay, dueCalendarDay, localCalendarDay } from "@/lib/date-utils";
import { isTaskId } from "@/lib/task-validation";
import { cn } from "@/lib/utils";
import { useTaskUi } from "@/store/task-ui-provider";
import type { SerializedTask } from "@/types/task";
import { TaskPriority } from "./task-priority";
import { TaskRowActions } from "./task-row-actions";
import { TaskStatus } from "./task-status";
import { useTaskMutation } from "./use-task-mutation";

const desktopColumns = "md:grid-cols-[minmax(0,1fr)_5rem_7.5rem_11.5rem] lg:grid-cols-[minmax(0,1fr)_7rem_9.5rem_12rem]";

function getToday() {
  return localCalendarDay(new Date());
}

function subscribeToLocalDay(notify: () => void) {
  let timer: number;
  function update() {
    window.clearTimeout(timer);
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    timer = window.setTimeout(update, midnight.getTime() - now.getTime());
    notify();
  }
  update();
  window.addEventListener("focus", update);
  document.addEventListener("visibilitychange", update);
  return () => {
    window.clearTimeout(timer);
    window.removeEventListener("focus", update);
    document.removeEventListener("visibilitychange", update);
  };
}

function TaskDescription({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const id = useId();
  const long = text.length > 120;

  return (
    <>
      <p id={id} className={cn("mt-1 wrap-anywhere whitespace-pre-line text-body-sm text-muted-foreground", long && !expanded && "line-clamp-2")}>
        {text}
      </p>
      {long && (
        <Button
          type="button"
          variant="link"
          size="sm"
          aria-expanded={expanded}
          aria-controls={id}
          className="px-0"
          onClick={() => setExpanded((open) => !open)}
        >
          {expanded ? "Ver menos" : "Ver mais"}
        </Button>
      )}
    </>
  );
}

function TaskDeadline({ dueDate, status, today }: Pick<SerializedTask, "dueDate" | "status"> & { today: string | null }) {
  const day = dueCalendarDay(dueDate);
  const info = day ? describeDueDay(day, status, today) : null;
  return (
    <span className={cn("date-text inline-flex min-w-0 items-center gap-1.5", info?.overdue ? "text-destructive-text" : "text-muted-foreground")}>
      <CalendarDays aria-hidden="true" className="size-3.5 shrink-0" />
      {day && info ? <time dateTime={day}>{info.label}</time> : <span>Sem prazo</span>}
    </span>
  );
}

function TaskItem({ task, today }: { task: SerializedTask; today: string | null }) {
  const complete = task.status === "completa";
  const pending = useTaskUi((state) => state.pending.has(task.id));
  const mutate = useTaskMutation();

  function toggleStatus() {
    if (!isTaskId(task.id)) return;
    const failure = "Não foi possível atualizar o status da tarefa.";
    void mutate({
      key: task.id,
      send: () => updateTask({ taskId: task.id, status: complete ? "pendente" : "completa" }),
      success: complete ? "Tarefa reaberta!" : "Tarefa concluída!",
      failure,
      onError: (description) => toast.error(failure, { description: description === failure ? undefined : description }),
    });
  }

  return (
    <li data-task-id={task.id} aria-busy={pending || undefined} className={cn("relative flex min-w-0 flex-col gap-2 px-3 py-3 sm:px-5 md:grid md:items-start md:gap-3 md:py-4", desktopColumns)}>
      <div className="flex min-w-0 items-start gap-2 pe-11 md:pe-0">
        <div className="relative -mt-1.5 -ms-1.5 size-11 shrink-0">
          <Checkbox
            checked={complete}
            disabled={pending || !isTaskId(task.id)}
            aria-label={complete ? "Reabrir tarefa" : "Concluir tarefa"}
            onCheckedChange={toggleStatus}
            className={cn(pending && "invisible")}
          />
          {pending && <LoadingSpinner label="Atualizando tarefa" className="absolute inset-0 items-center justify-center" />}
        </div>
        <div className="min-w-0 pt-1">
          <h3 className={cn("wrap-anywhere text-title-md", complete && "text-muted-foreground line-through")}>{task.title}</h3>
          {task.description && <TaskDescription text={task.description} />}
        </div>
      </div>
      <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 ps-11 md:contents">
        <span className="min-w-0 md:pt-2"><TaskPriority priority={task.priority} /></span>
        <span className="min-w-0 md:pt-2"><TaskDeadline dueDate={task.dueDate} status={task.status} today={today} /></span>
        <div className="flex min-w-0 items-center justify-between gap-1">
          <TaskStatus status={task.status} />
          <TaskRowActions taskId={task.id} />
        </div>
      </div>
      <TaskRowActions taskId={task.id} mobile />
    </li>
  );
}

export function TaskList({ tasks }: { tasks: readonly SerializedTask[] }) {
  const today = useSyncExternalStore(subscribeToLocalDay, getToday, () => null);
  return (
    <div className="rounded-lg border bg-card">
      <div aria-hidden="true" className={cn("hidden gap-3 rounded-t-lg border-b border-divider bg-secondary px-5 py-3 text-label-md text-muted-foreground md:grid", desktopColumns)}>
        <span className="ps-11">Tarefa</span>
        <span>Prioridade</span>
        <span>Prazo</span>
        <span>Status e ações</span>
      </div>
      <ul role="list" className="divide-y divide-divider">
        {tasks.map((task) => <TaskItem key={task.id} task={task} today={today} />)}
      </ul>
    </div>
  );
}
