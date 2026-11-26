import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { DashboardPreview } from "@/components/landing/dashboard-preview";
import { FeatureHighlights } from "@/components/landing/feature-highlights";
import { Hero } from "@/components/landing/hero";
import { PublicHeader } from "@/components/layout/public-header";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/dashboard");

  return (
    <>
      <PublicHeader page="home" />
      <main className="content-container flex flex-1 flex-col gap-10 py-8 sm:gap-12 sm:py-10">
        <Hero />
        <DashboardPreview />
        <FeatureHighlights />
      </main>
    </>
  );
}
