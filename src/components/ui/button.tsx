import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "control-focus inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-control text-label-lg transition-colors duration-150 ease-out motion-reduce:transition-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive-hover active:bg-destructive-active",
        outline:
          "border border-input bg-card text-card-foreground hover:bg-hover active:bg-active",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-active active:bg-active",
        ghost:
          "text-foreground hover:bg-hover active:bg-active",
        link: "text-primary-text underline-offset-4 hover:underline active:underline",
      },
      size: {
        default: "min-h-11 px-4 py-2",
        sm: "min-h-11 gap-1.5 px-3 text-label-md",
        lg: "min-h-12 px-6 py-2",
        icon: "size-11",
        "icon-sm": "size-11 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
