import { CircleCheck, CircleX, Info, TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const variants = {
  info: { icon: Info, alert: "info" },
  success: { icon: CircleCheck, alert: "success" },
  warning: { icon: TriangleAlert, alert: "warning" },
  error: { icon: CircleX, alert: "destructive" },
} as const;

type FeedbackProps = {
  variant?: keyof typeof variants;
  title?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function Feedback({ variant = "info", title, children, className }: FeedbackProps) {
  const { icon: Icon, alert } = variants[variant];
  return (
    <Alert variant={alert} className={className}>
      <Icon aria-hidden="true" strokeWidth={1.75} />
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
}
