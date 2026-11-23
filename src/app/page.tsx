import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-gray-900 text-white">
      <h1 className="text-4xl font-bold">District Task</h1>
      <div className="flex gap-4">
        <Link href="/login" className="rounded bg-blue-600 px-6 py-3 font-bold hover:bg-blue-700">
          Entrar
        </Link>
        <Link href="/register" className="rounded border border-white px-6 py-3 font-bold hover:bg-white hover:text-black">
          Criar Conta
        </Link>
      </div>
    </div>
  );
}
