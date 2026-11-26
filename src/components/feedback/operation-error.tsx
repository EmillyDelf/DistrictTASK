"use client";

import { RetryButton } from "./retry-button";
import { StatePanel } from "./state-panel";

export function OperationError({ retry }: { retry: () => void }) {
  return (
    <main className="content-container py-8 sm:py-12">
      <StatePanel
        variant="error"
        heading="h1"
        title="Algo deu errado"
        description="Não foi possível concluir esta operação. Tente novamente."
        action={<RetryButton retry={retry} />}
      />
    </main>
  );
}
