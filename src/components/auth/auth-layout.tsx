import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { PublicHeader } from "@/components/layout/public-header";

export function AuthLayout({ page, children }: { page: "login" | "register"; children: ReactNode }) {
  return (
    <>
      <PublicHeader page={page} />
      <main className="content-container flex flex-1 flex-col items-center justify-center py-6 sm:py-10">
        <div className="w-full max-w-md space-y-2">
          <Link href="/" className="control-focus inline-flex min-h-11 items-center gap-2 rounded-control text-label-md text-muted-foreground hover:text-foreground">
            <ArrowLeft aria-hidden="true" className="size-4" />
            Voltar para o início
          </Link>
          {children}
        </div>
      </main>
    </>
  );
}
