"use client";

import { useMemo, useRef } from "react";

import { StatePanel } from "@/components/feedback/state-panel";
import { Button } from "@/components/ui/button";
import { filterTasks, orderTasks } from "@/lib/task-utils";
import { useTaskUi } from "@/store/task-ui-provider";
import type { SerializedTask } from "@/types/task";
import { NewTaskButton } from "./new-task-button";
import { TaskList } from "./task-list";
import { TaskToolbar } from "./task-toolbar";

export function TaskDashboard({ tasks }: { tasks: readonly SerializedTask[] }) {
  const search = useTaskUi((state) => state.search);
  const status = useTaskUi((state) => state.status);
  const priority = useTaskUi((state) => state.priority);
  const order = useTaskUi((state) => state.order);
  const clearFilters = useTaskUi((state) => state.clearFilters);
  const searchRef = useRef<HTMLInputElement>(null);
  const visible = useMemo(
    () => orderTasks(filterTasks(tasks, { search, status, priority }), order),
    [tasks, search, status, priority, order],
  );

  return (
    <>
      <TaskToolbar searchRef={searchRef} />
      <section aria-labelledby="task-list-title">
        <h2 id="task-list-title" className="sr-only">Lista de tarefas</h2>
        <p role="status" className="sr-only">
          {visible.length === 1 ? "1 tarefa exibida." : `${visible.length} tarefas exibidas.`}
        </p>
        {tasks.length === 0 ? (
          <StatePanel
            title="Nenhuma tarefa ainda"
            description="Comece a organizar suas atividades adicionando sua primeira tarefa."
            action={<NewTaskButton first />}
          />
        ) : visible.length === 0 ? (
          <StatePanel
            variant="no-results"
            title="Nenhuma tarefa encontrada"
            description="Nenhuma tarefa corresponde à sua busca ou aos filtros selecionados."
            action={
              <Button type="button" variant="outline" onClick={() => {
                clearFilters();
                searchRef.current?.focus();
              }}>Limpar filtros</Button>
            }
          />
        ) : (
          <TaskList tasks={visible} />
        )}
      </section>
    </>
  );
}
