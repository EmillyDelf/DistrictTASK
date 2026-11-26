"use client";

import { Trash2 } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";

import { deleteTask } from "@/app/actions/task-actions";
import { Feedback } from "@/components/feedback/feedback";
import { PendingButton } from "@/components/feedback/pending-button";
import {
  AlertDialog, AlertDialogBody, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { isTaskId } from "@/lib/task-validation";
import { useTaskUi, useTaskUiStore } from "@/store/task-ui-provider";
import type { TaskDialog } from "@/store/task-ui-store";
import type { SerializedTask } from "@/types/task";
import { useTaskMutation } from "./use-task-mutation";

export function DeleteTaskDialog({
  dialog, task, restoreFocus,
}: {
  dialog: Exclude<TaskDialog, { kind: "create" }>;
  task?: SerializedTask;
  restoreFocus: (event: Event, deleted: boolean) => void;
}) {
  const [baseline] = useState(task);
  const [message, setMessage] = useState("");
  const deleted = useRef(false);
  const id = dialog.taskId;
  const pending = useTaskUi((state) => state.pending.has(id));
  const store = useTaskUiStore();
  const mutate = useTaskMutation();
  const unavailable = !baseline || !isTaskId(id) || baseline.updatedAt !== task?.updatedAt;

  function confirm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (unavailable || store.getState().pending.has(id)) return;
    setMessage("");
    void mutate({
      key: id, dialog, send: () => deleteTask(id),
      success: "Tarefa excluída com sucesso!", failure: "Não foi possível excluir a tarefa.", onError: setMessage,
      onSuccess: () => { deleted.current = true; },
    });
  }

  return (
    <AlertDialog open onOpenChange={(open) => {
      if (!open && !store.getState().pending.has(id)) store.getState().closeDialog(dialog);
    }}>
      <AlertDialogContent
        onCloseAutoFocus={(event) => restoreFocus(event, deleted.current)}
        onEscapeKeyDown={(event) => { if (store.getState().pending.has(id)) event.preventDefault(); }}
      >
        <AlertDialogHeader className="flex items-center gap-3 pe-4 sm:pe-6">
          <span className="grid size-10 shrink-0 place-items-center rounded-control bg-danger-surface text-danger-foreground">
            <Trash2 aria-hidden="true" className="size-5" />
          </span>
          <AlertDialogTitle>Excluir tarefa?</AlertDialogTitle>
        </AlertDialogHeader>
        <form method="post" onSubmit={confirm} className="flex min-h-0 flex-col">
          <AlertDialogBody>
            <AlertDialogDescription className="wrap-anywhere">
              Tem certeza de que deseja excluir a tarefa <strong>&apos;{baseline?.title}&apos;</strong>? Esta ação não poderá ser desfeita.
            </AlertDialogDescription>
            {unavailable && !pending ? (
              <Feedback variant="warning">A tarefa mudou ou não está disponível. Feche a confirmação e confira a lista.</Feedback>
            ) : message && <Feedback variant="error">{message}</Feedback>}
          </AlertDialogBody>
          <AlertDialogFooter className="grid grid-cols-2 sm:flex">
            <AlertDialogCancel type="button" disabled={pending}>Cancelar</AlertDialogCancel>
            <PendingButton type="submit" variant="destructive" pending={pending} pendingLabel="Excluindo..." disabled={unavailable}>
              Excluir tarefa
            </PendingButton>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
