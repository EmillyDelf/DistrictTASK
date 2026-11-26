import type { ReactNode } from "react";

import { PublicFooter } from "@/components/layout/public-footer";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      {children}
      <PublicFooter />
    </div>
  );
}
