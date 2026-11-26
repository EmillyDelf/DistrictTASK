import type { ReactNode } from "react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";

export function AuthCard({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <Card className="gap-5 p-5 sm:gap-5 sm:p-8">
      <CardHeader className="gap-1 px-0 sm:px-0">
        <h1 className="text-headline-md">{title}</h1>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="px-0 sm:px-0">{children}</CardContent>
      <CardFooter className="justify-center gap-x-1 gap-y-0 border-t border-divider px-0 pt-1 text-center text-body-sm text-muted-foreground sm:px-0 sm:pt-1">
        {footer}
      </CardFooter>
    </Card>
  );
}
