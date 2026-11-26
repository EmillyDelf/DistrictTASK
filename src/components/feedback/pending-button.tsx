import type { ComponentProps, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "./loading-spinner";

type PendingButtonProps = Omit<ComponentProps<typeof Button>, "asChild"> & {
  pending?: boolean;
  pendingLabel?: ReactNode;
};

export function PendingButton({ children, pending = false, pendingLabel = "Carregando…", disabled, ...props }: PendingButtonProps) {
  return (
    <Button {...props} disabled={disabled || pending} aria-busy={pending || undefined} data-pending={pending || undefined}>
      {pending ? <><LoadingSpinner decorative />{pendingLabel}</> : children}
    </Button>
  );
}
