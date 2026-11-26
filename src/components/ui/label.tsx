"use client";

import { Label as LabelPrimitive } from "radix-ui";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export function Label({ className, children, required, ...props }: ComponentProps<typeof LabelPrimitive.Root> & { required?: boolean }) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn("inline-flex items-center gap-1 text-label-lg peer-disabled:opacity-50", className)}
      {...props}
    >
      {children}
      {required && <span aria-hidden="true" className="text-destructive-text">*</span>}
    </LabelPrimitive.Root>
  );
}
