import { BrandLogo } from "@/components/brand/brand-logo";

const creditLinkClass = "control-focus inline-block rounded-sm font-medium underline decoration-current/50 underline-offset-4 hover:text-primary-text focus-visible:text-primary-text";

export function PublicFooter() {
  return (
    <footer className="border-t border-divider bg-surface pb-[env(safe-area-inset-bottom)]">
      <div className="content-container flex flex-col items-center gap-3 py-4 text-center sm:flex-row sm:justify-between sm:gap-6 sm:text-end">
        <BrandLogo alt="" size="sm" />
        <div className="flex flex-col gap-1 font-sans text-body-sm text-muted-foreground">
          <p>© 2026 District Task. Todos os direitos reservados.</p>
          <p>
            Desenvolvido por{" "}
            <a className={creditLinkClass} href="https://github.com/JohnHarrison-br" target="_blank" rel="noopener noreferrer">
              @JohnHarrison-br
            </a>{" "}
            e{" "}
            <a className={creditLinkClass} href="https://github.com/EmillyDelf" target="_blank" rel="noopener noreferrer">
              @EmillyDelf
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
