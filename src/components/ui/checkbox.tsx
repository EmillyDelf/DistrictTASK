"use client";

import { Check, Minus } from "lucide-react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export function Checkbox({ className, ...props }: ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn("control-focus group/checkbox peer grid size-11 shrink-0 place-items-center rounded-control transition-colors duration-150 hover:bg-hover motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-50", className)}
      {...props}
    >
      <span className="grid size-5 place-items-center rounded-sm border border-input bg-card group-data-[state=checked]/checkbox:border-primary group-data-[state=checked]/checkbox:bg-primary group-data-[state=indeterminate]/checkbox:border-primary group-data-[state=indeterminate]/checkbox:bg-primary">
        <CheckboxPrimitive.Indicator className="text-primary-foreground">
          <Check className="size-3.5 group-data-[state=indeterminate]/checkbox:hidden" aria-hidden="true" />
          <Minus className="hidden size-3.5 group-data-[state=indeterminate]/checkbox:block" aria-hidden="true" />
        </CheckboxPrimitive.Indicator>
      </span>
    </CheckboxPrimitive.Root>
  );
}
