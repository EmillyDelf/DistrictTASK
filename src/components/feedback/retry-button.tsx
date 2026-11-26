"use client";

import { RefreshCw } from "lucide-react";
import { useEffect, useRef, useTransition } from "react";

import { PendingButton } from "./pending-button";

export function RetryButton({ retry, action, pendingLabel = "Tentando novamente..." }: {
  retry: () => void;
  action?: string;
  pendingLabel?: string;
}) {
  const [pending, startTransition] = useTransition();
  const running = useRef(false);

  useEffect(() => {
    if (!pending) running.current = false;
  }, [pending]);

  function tryAgain() {
    if (running.current) return;
    running.current = true;
    startTransition(retry);
  }

  const button = (
    <PendingButton type={action ? "submit" : "button"} variant="outline" pending={pending} pendingLabel={pendingLabel} onClick={action ? undefined : tryAgain}>
      <RefreshCw aria-hidden="true" /> Tentar novamente
    </PendingButton>
  );

  return action ? (
    <form method="get" action={action} onSubmit={(event) => {
      event.preventDefault();
      tryAgain();
    }}>
      {button}
    </form>
  ) : button;
}
