import "server-only";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { cache } from "react";

import { authOptions } from "@/lib/auth";

export const requireDashboardUser = cache(async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  return { id: session.user.id, name: session.user.name?.trim() || null };
});
