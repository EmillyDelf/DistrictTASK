"use client";

import { Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { AuthField, type AuthFieldProps } from "./auth-field";

type PasswordInputProps = Omit<AuthFieldProps, "icon" | "type" | "action"> & {
  visibilityLabel?: string;
};

export function PasswordInput({ visibilityLabel = "senha", ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const Icon = visible ? EyeOff : Eye;

  return (
    <AuthField
      {...props}
      type={visible ? "text" : "password"}
      icon={Lock}
      action={
        <Button
          type="button"
          size="icon"
          variant="ghost"
          aria-controls={props.id}
          aria-label={`${visible ? "Ocultar" : "Mostrar"} ${visibilityLabel}`}
          aria-pressed={visible}
          className="absolute end-0 top-1/2 -translate-y-1/2 text-muted-foreground"
          onClick={() => setVisible((value) => !value)}
        >
          <Icon aria-hidden="true" />
        </Button>
      }
    />
  );
}
