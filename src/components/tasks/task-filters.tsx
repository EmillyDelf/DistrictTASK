"use client";

import { useId } from "react";

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { TaskFilters, TaskOrder } from "@/lib/task-utils";
import { useTaskUi } from "@/store/task-ui-provider";

const statuses = [
  { value: "all", label: "Todas" },
  { value: "pendente", label: "Pendentes" },
  { value: "completa", label: "Concluídas" },
] as const;

const priorities: Record<TaskFilters["priority"], string> = {
  all: "Todas",
  baixa: "Baixa",
  média: "Média",
  alta: "Alta",
};

const orders: Record<TaskOrder, string> = {
  recent: "Mais recentes",
  oldest: "Mais antigas",
  due: "Prazo",
  priority: "Prioridade",
};

export function TaskStatusFilter() {
  const status = useTaskUi((state) => state.status);
  const setStatus = useTaskUi((state) => state.setStatus);
  const name = useId();

  return (
    <fieldset className="flex min-w-0 gap-0.5 rounded-control border bg-secondary p-1">
      <legend className="sr-only">Filtrar por status</legend>
      {statuses.map(({ value, label }) => (
        <label key={value} className="min-w-0 flex-1 cursor-pointer">
          <input
            type="radio"
            name={name}
            value={value}
            checked={status === value}
            onChange={() => setStatus(value)}
            className="peer sr-only"
          />
          <span className="flex min-h-11 items-center justify-center rounded-sm px-2 text-label-md text-muted-foreground transition-colors hover:text-foreground peer-checked:bg-card peer-checked:text-foreground peer-checked:shadow-xs peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring sm:px-3 motion-reduce:transition-none">
            {label}
          </span>
        </label>
      ))}
    </fieldset>
  );
}

export function TaskPriorityFilter({ mobile = false }: { mobile?: boolean }) {
  const priority = useTaskUi((state) => state.priority);
  const setPriority = useTaskUi((state) => state.setPriority);
  const id = useId();

  return (
    <div className={mobile ? "space-y-1.5" : "w-44"}>
      <Label htmlFor={id} className={mobile ? "" : "sr-only"}>Filtrar por prioridade</Label>
      <Select value={priority} onValueChange={(value) => setPriority(value as TaskFilters["priority"])}>
        <SelectTrigger id={id}>
          <SelectValue>{mobile ? priorities[priority] : `Prioridade · ${priorities[priority]}`}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {Object.entries(priorities).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}

export function TaskOrderSelect({ mobile = false }: { mobile?: boolean }) {
  const order = useTaskUi((state) => state.order);
  const setOrder = useTaskUi((state) => state.setOrder);
  const id = useId();

  return (
    <div className={mobile ? "space-y-1.5" : "w-52"}>
      <Label htmlFor={id} className={mobile ? "" : "sr-only"}>Ordenar tarefas</Label>
      <Select value={order} onValueChange={(value) => setOrder(value as TaskOrder)}>
        <SelectTrigger id={id}>
          <SelectValue>{mobile ? orders[order] : `Ordem · ${orders[order]}`}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {Object.entries(orders).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}
