"use client";

import { OperationError } from "@/components/feedback/operation-error";

export default function AppError({ retry }: { retry: () => void }) {
  return <OperationError retry={retry} />;
}
