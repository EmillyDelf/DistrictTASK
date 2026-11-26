import type { Metadata } from "next";
import Link from "next/link";

import { AuthCard } from "@/components/auth/auth-card";
import { AuthLayout } from "@/components/auth/auth-layout";
import { RegisterForm } from "@/components/auth/register-form";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Criar conta | District Task" };

export default function RegisterPage() {
  return (
    <AuthLayout page="register">
      <AuthCard
        title="Crie sua conta"
        description="Comece a organizar suas atividades com o District Task."
        footer={
          <>
            <span>Já tem uma conta?</span>
            <Button asChild variant="link" size="sm" className="px-1">
              <Link href="/login">Entrar</Link>
            </Button>
          </>
        }
      >
        <RegisterForm />
      </AuthCard>
    </AuthLayout>
  );
}
