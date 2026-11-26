import { CircleCheck, ClipboardList, Clock3 } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { SerializedTask } from "@/types/task";

const metrics = [
  { label: "Total de tarefas", icon: ClipboardList, accent: "bg-secondary", count: "" },
  { label: "Pendentes", icon: Clock3, accent: "bg-danger-surface text-danger-foreground", count: "text-danger-foreground" },
  { label: "Concluídas", icon: CircleCheck, accent: "bg-success-surface text-success-foreground", count: "text-success-foreground" },
];

export function TaskSummary({ tasks, loading }: { tasks?: readonly SerializedTask[]; loading?: boolean }) {
  const complete = tasks?.filter((task) => task.status === "completa").length ?? 0;
  const totals = tasks ? [tasks.length, tasks.length - complete, complete] : [];

  return (
    <dl aria-label="Resumo das tarefas" className="grid grid-cols-1 gap-2 min-[360px]:grid-cols-3 sm:gap-4">
      {metrics.map(({ label, icon: Icon, accent, count }, index) => (
        <div key={label} className="flex min-w-0 items-center justify-between gap-2 rounded-lg border bg-card px-3 py-3 min-[360px]:flex-col min-[360px]:items-start sm:flex-row sm:items-center sm:px-4">
          <dt className="flex min-w-0 items-center gap-2 text-label-md text-muted-foreground sm:text-label-lg">
            <span aria-hidden="true" className={cn("hidden size-9 shrink-0 place-items-center rounded-control sm:grid", accent)}>
              <Icon className="size-4" strokeWidth={1.75} />
            </span>
            {label}
          </dt>
          <dd className={cn("number-text text-headline-md", tasks && count)}>
            {loading ? <Skeleton className="h-6 w-10" /> : totals[index] ?? <span aria-label="Indisponível" title="Indisponível">—</span>}
          </dd>
        </div>
      ))}
    </dl>
  );
}
