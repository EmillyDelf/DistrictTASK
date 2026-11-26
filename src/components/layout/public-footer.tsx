import { BrandLogo } from "@/components/brand/brand-logo";

export function PublicFooter() {
  return (
    <footer className="border-t border-divider bg-surface pb-[env(safe-area-inset-bottom)]">
      <div className="content-container flex flex-wrap items-center justify-center gap-x-6 gap-y-2 py-4 text-center sm:justify-between sm:text-start">
        <BrandLogo alt="" size="sm" />
        <p className="text-body-sm text-muted-foreground">District Task — Organização pessoal de tarefas.</p>
      </div>
    </footer>
  );
}
