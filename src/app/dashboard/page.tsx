import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import SignOutButton from "@/components/SignOutButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, ListTodo } from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) redirect("/login");

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-3xl space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-800">
              District Task
            </p>
            <h1 className="mt-2 text-3xl font-bold text-gray-950">
              Olá, {session.user.name ?? "usuário"}.
            </h1>
          </div>
          <SignOutButton />
        </header>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListTodo className="h-5 w-5 text-red-800" />
              Seu espaço de tarefas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-4">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-red-800" />
              <p>
                Sua conta está autenticada. A base está preparada para receber
                o gerenciamento individual de tarefas nas próximas etapas.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
