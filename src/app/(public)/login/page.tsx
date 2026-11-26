import type { Metadata } from "next";
import Link from "next/link";

import { AuthCard } from "@/components/auth/auth-card";
import { AuthLayout } from "@/components/auth/auth-layout";
import { LoginForm } from "@/components/auth/login-form";
import { Feedback } from "@/components/feedback/feedback";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Entrar | District Task" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ cadastro?: string | string[] }>;
}) {
  const { cadastro } = await searchParams;

  return (
    <AuthLayout page="login">
      <AuthCard
        title="Bem-vindo de volta!"
        description="Entre na sua conta para acessar suas tarefas."
        footer={
          <>
            <span>Ainda não tem uma conta?</span>
            <Button asChild variant="link" size="sm" className="px-1">
              <Link href="/register">Criar conta</Link>
            </Button>
          </>
        }
      >
        {cadastro === "sucesso" && (
          <Feedback variant="success" className="mb-4">Conta criada com sucesso! Entre para continuar.</Feedback>
        )}
        <LoginForm />
      </AuthCard>
    </AuthLayout>
  );
}
