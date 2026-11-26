import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative grid w-full min-w-0 grid-cols-[0_minmax(0,1fr)] items-start gap-y-1 rounded-control border px-4 py-3 text-body-md has-[>svg]:grid-cols-[1rem_minmax(0,1fr)] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-0.5",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        info: "border-border bg-secondary text-secondary-foreground",
        success: "border-success-foreground bg-success-surface text-success-foreground",
        warning: "border-warning-foreground bg-warning-surface text-warning-foreground",
        destructive: "border-danger-foreground bg-danger-surface text-danger-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role={variant === "destructive" || variant === "warning" ? "alert" : "status"}
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 min-w-0 text-title-md break-words",
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "col-start-2 min-w-0 text-body-md break-words",
        className
      )}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription }
