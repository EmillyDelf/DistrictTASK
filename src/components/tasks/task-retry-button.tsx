"use client";

import { useRouter } from "next/navigation";

import { RetryButton } from "@/components/feedback/retry-button";

export function TaskRetryButton() {
  const router = useRouter();
  return <RetryButton action="/dashboard" retry={() => router.refresh()} pendingLabel="Buscando tarefas..." />;
}
