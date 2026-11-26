"use client";

import { ArrowRight, Mail, User } from "lucide-react";
import { useRouter } from "next/navigation";

import { registerUser } from "@/app/actions";
import { PendingButton } from "@/components/feedback/pending-button";
import { AuthField } from "./auth-field";
import { AuthForm, validateEmail } from "./auth-form";
import { PasswordInput } from "./password-input";

const failureMessage = "Não foi possível criar sua conta. Tente novamente.";

function validate(values: FormData) {
  const errors: Record<string, string> = {};
  const name = String(values.get("name") ?? "").trim();
  const emailError = validateEmail(String(values.get("email") ?? "").trim());
  const password = String(values.get("password") ?? "");
  const confirmation = String(values.get("confirmation") ?? "");

  if (!name) errors.name = "Informe seu nome.";
  else if (name.length > 80) errors.name = "O nome deve ter no máximo 80 caracteres.";

  if (emailError) errors.email = emailError;

  if (!password) errors.password = "Informe uma senha.";
  else if (password.length < 8) errors.password = "A senha deve ter pelo menos 8 caracteres.";
  else if (new TextEncoder().encode(password).length > 72) {
    errors.password = "A senha excede o limite aceito. Use até 72 bytes.";
  }

  if (!confirmation) errors.confirmation = "Confirme sua senha.";
  else if (confirmation !== password) errors.confirmation = "As senhas não correspondem.";

  return errors;
}

export function RegisterForm() {
  const router = useRouter();

  async function send(values: FormData) {
    const data = new FormData();
    for (const field of ["name", "email", "password"]) {
      data.set(field, String(values.get(field)));
    }

    const result = await registerUser(data);
    if ("error" in result) return result.error;
    if (!result.success) return failureMessage;

    router.replace("/login?cadastro=sucesso");
    return null;
  }

  return (
    <AuthForm validate={validate} send={send} failureMessage={failureMessage}>
      {({ ready, pending, errors }) => (
        <>
          <AuthField
            id="register-name"
            name={ready ? "name" : undefined}
            label="Nome"
            icon={User}
            autoComplete="name"
            placeholder="Seu nome completo"
            maxLength={80}
            required
            error={errors.name}
          />
          <AuthField
            id="register-email"
            name={ready ? "email" : undefined}
            label="E-mail"
            icon={Mail}
            type="email"
            autoComplete="email"
            placeholder="seu@email.com"
            maxLength={254}
            required
            error={errors.email}
          />
          <PasswordInput
            id="register-password"
            name={ready ? "password" : undefined}
            label="Senha"
            autoComplete="new-password"
            placeholder="Crie uma senha"
            minLength={8}
            required
            hint="Use pelo menos 8 caracteres."
            error={errors.password}
          />
          <PasswordInput
            id="register-confirmation"
            name={ready ? "confirmation" : undefined}
            label="Confirmar senha"
            visibilityLabel="confirmação de senha"
            autoComplete="new-password"
            placeholder="Repita sua senha"
            required
            error={errors.confirmation}
          />
          <PendingButton type="submit" className="w-full" disabled={!ready} pending={pending} pendingLabel="Criando conta...">
            Criar conta <ArrowRight aria-hidden="true" />
          </PendingButton>
        </>
      )}
    </AuthForm>
  );
}
