"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTaskUi } from "@/store/task-ui-provider";

export function NewTaskButton({ first = false }: { first?: boolean }) {
  const openDialog = useTaskUi((state) => state.openDialog);
  const pending = useTaskUi((state) => state.pending.has("create"));
  const opener = first ? "empty" : "heading";
  return (
    <Button
      type="button"
      disabled={pending}
      data-task-create={opener}
      className={first ? undefined : "w-full sm:w-auto"}
      onClick={() => openDialog({ kind: "create", opener })}
    >
      <Plus aria-hidden="true" /> {first ? "Criar primeira tarefa" : "Nova tarefa"}
    </Button>
  );
}
