import { getTasks } from "@/app/actions/task-actions";
import { StatePanel } from "@/components/feedback/state-panel";
import { DashboardHeading } from "@/components/tasks/dashboard-heading";
import { TaskDashboard } from "@/components/tasks/task-dashboard";
import { TaskDialogs } from "@/components/tasks/task-dialogs";
import { TaskRetryButton } from "@/components/tasks/task-retry-button";
import { TaskSummary } from "@/components/tasks/task-summary";
import { requireDashboardUser } from "@/lib/dashboard-session";

export default async function DashboardPage() {
  const { name } = await requireDashboardUser();
  const result = await getTasks();
  const tasks = "success" in result ? result.tasks : undefined;

  return (
    <main className="content-container flex min-w-0 flex-col gap-5 py-6 pb-24 sm:gap-6 sm:py-8 sm:pb-24">
      <DashboardHeading name={name} canCreate={!!tasks} />
      <TaskSummary tasks={tasks} />
      {tasks ? <TaskDashboard tasks={tasks} /> : (
        <StatePanel
          variant="error"
          heading="h2"
          title="Não foi possível carregar suas tarefas"
          description="Tente buscar a lista novamente para conferir o estado das suas tarefas."
          action={<TaskRetryButton />}
        />
      )}
      <TaskDialogs tasks={tasks ?? []} />
    </main>
  );
}
