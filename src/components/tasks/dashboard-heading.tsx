import { NewTaskButton } from "./new-task-button";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardHeading({ name, loading = false, canCreate = true }: { name?: string | null; loading?: boolean; canCreate?: boolean }) {
  const firstName = name?.trim().split(/\s+/u)[0];

  return (
    <section aria-labelledby="task-page-title" className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0 space-y-1">
        {loading ? <Skeleton className="h-5 w-24" /> : (
          <p className="wrap-anywhere text-label-lg text-muted-foreground">{firstName ? `Olá, ${firstName}!` : "Olá!"}</p>
        )}
        <h1 id="task-page-title" className="page-title">Minhas tarefas</h1>
        <p className="text-body-md text-muted-foreground">Organize suas atividades e acompanhe seu progresso.</p>
      </div>
      {loading ? <Skeleton className="h-11 w-full sm:w-34" /> : canCreate && <NewTaskButton />}
    </section>
  );
}
