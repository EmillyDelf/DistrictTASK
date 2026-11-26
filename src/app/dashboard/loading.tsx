import { StateSkeleton } from "@/components/feedback/state-skeleton";
import { DashboardHeading } from "@/components/tasks/dashboard-heading";
import { TaskSummary } from "@/components/tasks/task-summary";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <div role="status" className="sr-only">Carregando suas tarefas...</div>
      <main className="content-container flex flex-col gap-5 py-6 pb-24 sm:gap-6 sm:py-8 sm:pb-24" aria-busy="true">
        <DashboardHeading loading />
        <TaskSummary loading />
        <div aria-hidden="true" className="flex flex-wrap gap-3">
          <Skeleton className="h-11 w-full lg:min-w-52 lg:flex-1" />
          <Skeleton className="h-12 w-44 min-[390px]:w-56" />
          <Skeleton className="h-12 w-22 md:w-44" />
          <Skeleton className="hidden h-12 w-52 md:block" />
        </div>
        <StateSkeleton className="space-y-0 p-0 sm:p-0 [&>div]:space-y-0">
          <div className="hidden grid-cols-[minmax(0,1fr)_5rem_7.5rem_11.5rem] gap-3 rounded-t-lg border-b border-divider bg-secondary px-5 py-3 md:grid lg:grid-cols-[minmax(0,1fr)_7rem_9.5rem_12rem]">
            {["Tarefa", "Prioridade", "Prazo", "Status e ações"].map((label) => (
              <span key={label} className="text-label-md text-muted-foreground first:ps-11">{label}</span>
            ))}
          </div>
          {[0, 1, 2].map((row) => (
            <div key={row} className="flex flex-col gap-2 border-b border-divider p-3 last:border-b-0 sm:px-5 md:grid md:grid-cols-[minmax(0,1fr)_5rem_7.5rem_11.5rem] md:items-start md:gap-3 md:py-4 lg:grid-cols-[minmax(0,1fr)_7rem_9.5rem_12rem]">
              <div className="flex items-start gap-3">
                <Skeleton className="m-2 size-5 shrink-0" />
                <div className="min-w-0 flex-1 space-y-2 pt-1">
                  <Skeleton className="h-5 w-3/5" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
              </div>
              <div className="flex flex-wrap gap-2 ps-11 md:contents">
                <Skeleton className="h-5 w-14 md:mt-2" />
                <Skeleton className="h-5 w-16 md:mt-2" />
                <Skeleton className="h-5 w-18 md:mt-2" />
              </div>
            </div>
          ))}
        </StateSkeleton>
      </main>
    </>
  );
}
