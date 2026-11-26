import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export function FieldMessage({ className, error, ...props }: ComponentProps<"p"> & { error?: boolean }) {
  return (
    <p
      data-slot="field-message"
      role={error ? "alert" : undefined}
      className={cn("text-body-sm", error ? "text-destructive-text" : "text-muted-foreground", className)}
      {...props}
    />
  );
}
