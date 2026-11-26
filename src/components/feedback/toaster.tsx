"use client";

import { CircleCheck, CircleX, Info, TriangleAlert } from "lucide-react";
import { Toaster as Sonner } from "sonner";

import { LoadingSpinner } from "./loading-spinner";

export function Toaster() {
  return (
    <Sonner
      className="district-toaster"
      containerAriaLabel="Notificações"
      position="bottom-right"
      richColors
      visibleToasts={3}
      closeButton
      offset={{ bottom: "max(1.5rem, env(safe-area-inset-bottom))", right: "max(1.5rem, env(safe-area-inset-right))" }}
      mobileOffset={{ bottom: "max(1rem, env(safe-area-inset-bottom))", left: "max(1rem, env(safe-area-inset-left))", right: "max(1rem, env(safe-area-inset-right))" }}
      toastOptions={{ closeButtonAriaLabel: "Fechar notificação" }}
      icons={{
        success: <CircleCheck aria-hidden="true" />,
        error: <CircleX aria-hidden="true" />,
        warning: <TriangleAlert aria-hidden="true" />,
        info: <Info aria-hidden="true" />,
        loading: <LoadingSpinner decorative />,
      }}
    />
  );
}
