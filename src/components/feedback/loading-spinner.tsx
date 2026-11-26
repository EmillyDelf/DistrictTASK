import { LoaderCircle } from "lucide-react";

import { cn } from "@/lib/utils";

type LoadingSpinnerProps = {
  label?: string;
  decorative?: boolean;
  className?: string;
};

export function LoadingSpinner({ label = "Carregando", decorative, className }: LoadingSpinnerProps) {
  return (
    <span className="inline-flex shrink-0" role={decorative ? undefined : "status"} aria-hidden={decorative || undefined}>
      <LoaderCircle aria-hidden="true" className={cn("size-4 animate-spin motion-reduce:animate-none", className)} />
      {!decorative && <span className="sr-only">{label}</span>}
    </span>
  );
}
