import type { ReactNode } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type StateSkeletonProps = {
  children?: ReactNode;
  className?: string;
};

export function StateSkeleton({ children, className }: StateSkeletonProps) {
  return (
    <div aria-hidden="true" className={cn("space-y-3 rounded-lg border bg-card p-4 sm:p-6", className)}>
      <div className="space-y-3">
        {children ?? <><Skeleton className="h-5 w-2/5" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-3/4" /></>}
      </div>
    </div>
  );
}
