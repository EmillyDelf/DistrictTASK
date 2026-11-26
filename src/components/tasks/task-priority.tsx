import { ArrowDown, ArrowUp, Minus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { TaskPriority as Priority } from "@/types/task";

const priorities = {
  baixa: { label: "Baixa", icon: ArrowDown, variant: "priority-low" },
  média: { label: "Média", icon: Minus, variant: "priority-medium" },
  alta: { label: "Alta", icon: ArrowUp, variant: "priority-high" },
} as const satisfies Record<Priority, { label: string; icon: typeof ArrowUp; variant: string }>;

export function TaskPriority({ priority, className }: { priority: Priority; className?: string }) {
  const { label, icon: Icon, variant } = priorities[priority];
  return <Badge variant={variant} className={className}><Icon aria-hidden="true" strokeWidth={1.75} />{label}</Badge>;
}
