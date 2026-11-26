import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "form-control selection:bg-primary selection:text-primary-foreground file:me-2 file:border-0 file:bg-transparent file:text-label-lg file:text-foreground",
        className
      )}
      {...props}
    />
  )
}

export { Input }
