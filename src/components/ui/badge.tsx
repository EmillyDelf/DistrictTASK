import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center gap-1 whitespace-nowrap rounded-sm border border-transparent px-2 py-0.5 text-label-md [&>svg]:size-3.5",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        outline: "border-border text-foreground",
        destructive: "border-danger-foreground bg-danger-surface text-danger-foreground",
        "priority-low": "bg-priority-low text-priority-low-foreground",
        "priority-medium": "bg-priority-medium text-priority-medium-foreground",
        "priority-high": "bg-priority-high text-priority-high-foreground",
        "status-pending": "border-border bg-status-pending text-status-pending-foreground",
        "status-complete": "bg-status-complete text-status-complete-foreground",
      },
    },
    defaultVariants: { variant: "secondary" },
  },
);

export function Badge({ asChild, className, variant, ...props }: ComponentProps<"span"> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Component = asChild ? Slot : "span";
  return <Component data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />;
}
