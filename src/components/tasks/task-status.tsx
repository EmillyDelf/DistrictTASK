import { CircleCheck, Clock3 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { TaskStatus as Status } from "@/types/task";

const statuses = {
  pendente: { label: "Pendente", icon: Clock3, variant: "status-pending" },
  completa: { label: "Concluída", icon: CircleCheck, variant: "status-complete" },
} as const satisfies Record<Status, { label: string; icon: typeof Clock3; variant: string }>;

export function TaskStatus({ status, className }: { status: Status; className?: string }) {
  const { label, icon: Icon, variant } = statuses[status];
  return <Badge variant={variant} className={className}><Icon aria-hidden="true" strokeWidth={1.75} />{label}</Badge>;
}
