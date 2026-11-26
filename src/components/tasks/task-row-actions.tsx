"use client";

import { Ellipsis, Pencil, Trash2 } from "lucide-react";
import { useRef } from "react";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { isTaskId } from "@/lib/task-validation";
import { useTaskUi } from "@/store/task-ui-provider";

export function TaskRowActions({ taskId, mobile = false }: { taskId: string; mobile?: boolean }) {
  const openedDialog = useRef(false);
  const openDialog = useTaskUi((state) => state.openDialog);
  const pending = useTaskUi((state) => state.pending.has(taskId));
  const disabled = pending || !isTaskId(taskId);

  if (mobile) {
    return (
      <DropdownMenu onOpenChange={(open) => { if (open) openedDialog.current = false; }}>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="ghost" size="icon" disabled={disabled} data-task-open="menu" aria-label="Ações da tarefa" className="absolute end-2 top-2 md:hidden">
            <Ellipsis aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" onCloseAutoFocus={(event) => {
          if (openedDialog.current) event.preventDefault();
        }}>
          <DropdownMenuItem onSelect={() => {
            openedDialog.current = true;
            openDialog({ kind: "edit", taskId });
          }}><Pencil aria-hidden="true" /> Editar tarefa</DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onSelect={() => {
            openedDialog.current = true;
            openDialog({ kind: "delete", taskId });
          }}><Trash2 aria-hidden="true" /> Excluir tarefa</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="hidden items-center md:flex">
      <Button type="button" variant="ghost" size="icon" disabled={disabled} data-task-open="edit" aria-label="Editar tarefa" onClick={() => openDialog({ kind: "edit", taskId })}>
        <Pencil aria-hidden="true" />
      </Button>
      <Button type="button" variant="ghost" size="icon" disabled={disabled} data-task-open="delete" aria-label="Excluir tarefa" className="text-destructive-text" onClick={() => openDialog({ kind: "delete", taskId })}>
        <Trash2 aria-hidden="true" />
      </Button>
    </div>
  );
}
