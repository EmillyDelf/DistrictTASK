
"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

import {
  LogIn,
  Mail,
  Lock,
  AlertCircle,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirect: false,
      });

      if (res?.error) {
        const errorCode = res.error;

        if (errorCode === "RATE_LIMITED_EMAIL") {
          setError(
            "Acesso temporariamente bloqueado por excesso de tentativas. Tente novamente em 15 minutos."
          );
        } else if (errorCode === "RATE_LIMITED_IP") {
          setError(
            "Muitas tentativas de acesso foram realizadas. Seu IP está temporariamente bloqueado. Tente novamente em 15 minutos."
          );
        } else {
          setError("E-mail ou senha inválidos.");
        }

        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Não foi possível entrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <LogIn className="h-6 w-6 text-blue-600" />
            </div>
          </div>

          <CardTitle className="text-2xl">
            Entrar
          </CardTitle>

          <CardDescription>
            Entre com suas credenciais para acessar sua conta
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />

              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />

              <Input
                name="email"
                type="email"
                placeholder="Email"
                required
                className="pl-10"
                disabled={loading}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />

              <Input
                name="password"
                type="password"
                placeholder="Senha"
                required
                className="pl-10"
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              <LogIn className="mr-2 h-4 w-4" />

              {loading ? "Verificando..." : "Login"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            Não tem conta?{" "}
            <Link
              href="/register"
              className="text-blue-600 hover:underline"
            >
              Registre-se
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
