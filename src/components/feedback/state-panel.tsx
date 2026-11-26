import { ClipboardList, SearchX, TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const states = {
  empty: { icon: ClipboardList, className: "bg-secondary text-muted-foreground" },
  "no-results": { icon: SearchX, className: "bg-secondary text-muted-foreground" },
  error: { icon: TriangleAlert, className: "bg-danger-surface text-danger-foreground" },
};

type StatePanelProps = {
  variant?: keyof typeof states;
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
  heading?: "h1" | "h2" | "h3";
};

export function StatePanel({ variant = "empty", title, description, icon, action, className, heading: Heading = "h3" }: StatePanelProps) {
  const state = states[variant];
  const Icon = state.icon;
  return (
    <div
      data-slot="state-panel"
      role={variant === "error" ? "alert" : undefined}
      className={cn("flex min-w-0 flex-col items-center gap-3 rounded-lg border bg-card px-4 py-10 text-center sm:px-6", className)}
    >
      <span aria-hidden="true" className={cn("grid size-12 place-items-center rounded-md", state.className)}>
        {icon ?? <Icon className="size-5" strokeWidth={1.75} />}
      </span>
      <div className="max-w-md space-y-1">
        <Heading className={Heading === "h1" ? "page-title" : "text-title-lg"}>{title}</Heading>
        {description && <div className="text-body-md text-muted-foreground">{description}</div>}
      </div>
      {action && <div className="mt-1 flex max-w-full flex-wrap justify-center gap-2">{action}</div>}
    </div>
  );
}
