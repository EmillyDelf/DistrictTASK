"use client";

import { ArrowRight, Mail } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import { PendingButton } from "@/components/feedback/pending-button";
import { AuthField } from "./auth-field";
import { AuthForm, validateEmail } from "./auth-form";
import { PasswordInput } from "./password-input";

const failureMessage = "Não foi possível entrar. Tente novamente.";
const messages: ReadonlyMap<string, string> = new Map([
  ["RATE_LIMITED_EMAIL", "Acesso temporariamente bloqueado por excesso de tentativas. Tente novamente em 15 minutos."],
  ["RATE_LIMITED_IP", "Muitas tentativas de acesso foram realizadas. Seu IP está temporariamente bloqueado. Tente novamente em 15 minutos."],
  ["CredentialsSignin", "E-mail ou senha inválidos."],
]);

function validate(values: FormData) {
  const errors: Record<string, string> = {};
  const emailError = validateEmail(String(values.get("email") ?? "").trim());
  if (emailError) errors.email = emailError;
  if (!values.get("password")) errors.password = "Informe sua senha.";
  return errors;
}

export function LoginForm() {
  const router = useRouter();

  async function send(values: FormData) {
    const response = await signIn("credentials", {
      email: String(values.get("email")).trim(),
      password: String(values.get("password")),
      redirect: false,
      callbackUrl: "/dashboard",
    });

    if (response?.error) return messages.get(response.error) ?? failureMessage;
    if (!response?.ok || !response.url) return failureMessage;

    router.replace("/dashboard");
    router.refresh();
    return null;
  }

  return (
    <AuthForm validate={validate} send={send} failureMessage="Não foi possível conectar. Tente novamente.">
      {({ ready, pending, errors }) => (
        <>
          <AuthField
            id="login-email"
            name={ready ? "email" : undefined}
            label="E-mail"
            icon={Mail}
            type="email"
            autoComplete="email"
            placeholder="seu@email.com"
            required
            error={errors.email}
          />
          <PasswordInput
            id="login-password"
            name={ready ? "password" : undefined}
            label="Senha"
            autoComplete="current-password"
            placeholder="Digite sua senha"
            required
            error={errors.password}
          />
          <PendingButton type="submit" className="w-full" disabled={!ready} pending={pending} pendingLabel="Entrando...">
            Entrar <ArrowRight aria-hidden="true" />
          </PendingButton>
        </>
      )}
    </AuthForm>
  );
}
