import Link from "next/link";

import { BrandLogo } from "@/components/brand/brand-logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { AccountMenu } from "./account-menu";

export function DashboardHeader({ name }: { name: string | null }) {
  const parts = name?.split(/\s+/u) ?? [];
  const initials = [parts[0], parts.length > 1 ? parts.at(-1) : undefined]
    .map((part) => part ? Array.from(part)[0].toLocaleUpperCase("pt-BR") : "")
    .join("") || "U";

  return (
    <header className="sticky top-0 z-20 border-b border-divider bg-surface pt-[env(safe-area-inset-top)]">
      <div className="content-container flex min-h-16 items-center justify-between gap-3 sm:min-h-[4.5rem]">
        <div className="flex items-center gap-5">
          <Link href="/dashboard" aria-label="District Task — Minhas tarefas" className="control-focus inline-flex min-h-11 items-center rounded-control">
            <BrandLogo alt="" />
          </Link>
          <nav className="hidden self-stretch sm:flex" aria-label="Navegação do dashboard">
            <Link href="/dashboard" aria-current="page" className="control-focus inline-flex min-h-11 items-center border-b-2 border-primary px-1 text-label-lg text-primary-text">
              Minhas tarefas
            </Link>
          </nav>
        </div>
        <div className="flex min-w-0 items-center gap-2 sm:gap-3 lg:gap-4">
          <ThemeToggle />
          <AccountMenu name={name ?? "Usuário"} initials={initials} />
        </div>
      </div>
    </header>
  );
}
