import { createHash } from "node:crypto";
import type { ReactNode } from "react";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { requireDashboardUser } from "@/lib/dashboard-session";
import { TaskUiProvider } from "@/store/task-ui-provider";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const { id, name } = await requireDashboardUser();
  const key = createHash("sha256").update(id).digest("hex");

  return (
    <TaskUiProvider key={key}>
      <DashboardHeader name={name} />
      {children}
    </TaskUiProvider>
  );
}
