import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { ArchitectEditForm } from "@/components/ui/ArchitectEditForm";

export default async function ArchitectEditPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if ((session.user as any).role !== "ARCHITECT") redirect("/profile/edit/client");

  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
    include: { architectProfile: { include: { portfolio: true } } },
  });
  if (!user) redirect("/login");

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-[var(--cream)]">
        <div className="bg-[var(--ink)] py-12 px-6 lg:px-12">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs tracking-[0.3em] uppercase text-[var(--terracotta)] mb-2">Settings</p>
            <h1 className="display text-5xl text-[var(--cream)]">Edit Profile</h1>
            <p className="text-[var(--stone)] mt-2 text-sm">Update your public profile information.</p>
          </div>
        </div>
        <div className="max-w-3xl mx-auto px-6 py-12">
          <ArchitectEditForm user={user} />
        </div>
      </main>
    </>
  );
}