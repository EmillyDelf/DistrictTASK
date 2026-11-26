import Link from "next/link";

import { BrandLogo } from "@/components/brand/brand-logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PublicPage = "home" | "login" | "register";

export function PublicHeader({ page }: { page: PublicPage }) {
  const home = page === "home";

  return (
    <header className="sticky top-0 z-20 border-b border-divider bg-surface pt-[env(safe-area-inset-top)]">
      <div className={cn("content-container flex min-h-16 items-center justify-between gap-2 sm:min-h-[4.5rem]", home && "max-[374px]:grid max-[374px]:grid-cols-[1fr_auto] max-[374px]:gap-y-0 max-[374px]:py-1")}>
        <Link href="/" aria-label="District Task — Página inicial" aria-current={home ? "page" : undefined} className="control-focus inline-flex min-h-11 shrink-0 items-center justify-self-start rounded-control">
          <BrandLogo alt="" />
        </Link>
        <div className={cn("flex items-center gap-1 sm:gap-4", home && "max-[374px]:contents")}>
          <ThemeToggle />
          <nav aria-label="Navegação principal" className={cn("flex items-center gap-1 sm:gap-2", home && "max-[374px]:col-span-2 max-[374px]:justify-end")}>
            {page !== "login" && (
              <Button asChild size="sm" variant="ghost" className="px-2 sm:px-3">
                <Link href="/login">Entrar</Link>
              </Button>
            )}
            {page !== "register" && (
              <Button asChild size="sm" variant={home ? "default" : "outline"} className="px-2 sm:px-3">
                <Link href="/register">Criar conta</Link>
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
