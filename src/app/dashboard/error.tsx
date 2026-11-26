"use client";

import { OperationError } from "@/components/feedback/operation-error";

export default function DashboardError({ retry }: { retry: () => void }) {
  return <OperationError retry={retry} />;
}
