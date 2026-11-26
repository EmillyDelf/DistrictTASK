import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="mx-auto flex w-full max-w-2xl flex-col items-center gap-4 text-center" aria-labelledby="landing-title">
      <h1 id="landing-title" className="page-title text-balance">Organize suas tarefas. Simplifique sua rotina.</h1>
      <p className="max-w-xl text-pretty text-body-md text-muted-foreground">
        Gerencie suas atividades, acompanhe seus prazos e mantenha o foco no que realmente importa com o District Task.
      </p>
      <div className="mt-2 flex w-full flex-col justify-center gap-3 sm:flex-row">
        <Button asChild size="lg">
          <Link href="/register">Começar agora <ArrowRight aria-hidden="true" /></Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/login">Já tenho uma conta</Link>
        </Button>
      </div>
    </section>
  );
}
