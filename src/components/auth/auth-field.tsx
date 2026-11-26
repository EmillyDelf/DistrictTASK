import type { LucideIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

import { FieldMessage } from "@/components/ui/field-message";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type AuthFieldProps = ComponentProps<typeof Input> & {
  id: string;
  label: string;
  icon: LucideIcon;
  error?: string;
  hint?: string;
  action?: ReactNode;
};

export function AuthField({ id, label, icon: Icon, error, hint, action, className, ...inputProps }: AuthFieldProps) {
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ");

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}{inputProps.required && <span aria-hidden="true" className="text-destructive-text"> *</span>}</Label>
      <div className="relative">
        <Icon aria-hidden="true" className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          {...inputProps}
          id={id}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={describedBy || undefined}
          className={cn("ps-10", action && "pe-12", className)}
        />
        {action}
      </div>
      {hint && <FieldMessage id={`${id}-hint`}>{hint}</FieldMessage>}
      {error && <FieldMessage id={`${id}-error`} error>{error}</FieldMessage>}
    </div>
  );
}
