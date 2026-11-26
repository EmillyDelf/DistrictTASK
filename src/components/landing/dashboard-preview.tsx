import { CalendarDays, CircleCheck, ClipboardList, Clock3 } from "lucide-react";

import { TaskPriority } from "@/components/tasks/task-priority";
import { TaskStatus } from "@/components/tasks/task-status";
import { Card, CardContent } from "@/components/ui/card";
import type { TaskPriority as Priority, TaskStatus as Status } from "@/types/task";

const tasks = [
  { title: "Planejar a semana", priority: "alta", date: "25 nov", isoDate: "2026-11-25", status: "pendente" },
  { title: "Revisar anotações", priority: "média", date: "27 nov", isoDate: "2026-11-27", status: "pendente" },
  { title: "Organizar materiais", priority: "baixa", date: "24 nov", isoDate: "2026-11-24", status: "completa" },
] as const satisfies ReadonlyArray<{ title: string; priority: Priority; date: string; isoDate: string; status: Status }>;

const indicators = [
  { label: "Total", value: tasks.length, icon: ClipboardList },
  { label: "Pendentes", value: tasks.filter((task) => task.status === "pendente").length, icon: Clock3 },
  { label: "Concluídas", value: tasks.filter((task) => task.status === "completa").length, icon: CircleCheck },
];

export function DashboardPreview() {
  return (
    <section aria-labelledby="preview-title">
      <Card className="gap-0 overflow-hidden p-0 sm:gap-0 sm:p-0">
        <div className="flex items-center gap-2 border-b border-divider bg-secondary px-4 py-3 sm:px-6">
          <ClipboardList aria-hidden="true" className="size-4 text-muted-foreground" />
          <h2 id="preview-title" className="text-label-lg">Prévia do District Task</h2>
        </div>
        <CardContent className="space-y-4 bg-background p-3 sm:p-6">
          <div className="space-y-1">
            <h3 className="text-title-lg">Minhas tarefas</h3>
            <p className="text-body-sm text-muted-foreground">Demonstração com dados fictícios.</p>
          </div>
          <dl className="grid grid-cols-3 gap-2 sm:gap-4">
            {indicators.map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex min-w-0 flex-col gap-1 rounded-lg border bg-card p-2 sm:px-4 sm:py-3">
                <dt className="flex items-center gap-2 text-label-md text-muted-foreground">
                  <Icon className="hidden size-4 sm:block" aria-hidden="true" />
                  {label}
                </dt>
                <dd className="number-text text-headline-md">{value}</dd>
              </div>
            ))}
          </dl>
          <ul className="overflow-hidden rounded-lg border bg-card">
            {tasks.map(({ title, priority, date, isoDate, status }) => (
              <li key={title} className="grid gap-2 border-b border-divider p-3 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-4">
                <span className="text-label-lg">{title}</span>
                <div className="flex flex-wrap items-center gap-2 sm:grid sm:grid-cols-[4.75rem_4.75rem_6.25rem]">
                  <TaskPriority priority={priority} className="justify-self-start" />
                  <time dateTime={isoDate} className="date-text inline-flex items-center gap-1.5 text-body-sm text-muted-foreground">
                    <CalendarDays className="size-3.5" aria-hidden="true" />
                    {date}
                  </time>
                  <TaskStatus status={status} className="justify-self-start" />
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}
