import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { ArchitectDashboard } from "@/components/ui/ArchitectDashboard";
import { ClientOnly } from "@/components/ui/ClientOnly";

export default async function ArchitectDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if ((session.user as any).role !== "ARCHITECT") redirect("/dashboard/client");

  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
    include: {
      architectProfile: { include: { portfolio: true } },
      receivedMessages: { where: { read: false }, select: { id: true } },
      reviewsReceived: { select: { rating: true } },
    },
  });

  if (!user) redirect("/login");

  return (
    <>
      <Navbar />
      <main className="pt-16">
        <div className="bg-[var(--ink)] py-12 px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <p className="text-xs tracking-[0.3em] uppercase text-[var(--terracotta)] mb-2">Architect Dashboard</p>
            <h1 className="display text-5xl text-[var(--cream)]">Welcome back, {user.name?.split(" ")[0]}.</h1>
            <p className="text-[var(--stone)] mt-2 text-sm">Manage your profile, portfolio, and client connections.</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
          <ClientOnly>
            <ArchitectDashboard user={user} />
          </ClientOnly>
        </div>
      </main>
    </>
  );
}