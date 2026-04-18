import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { AccountPage } from "@/components/ui/AccountPage";
import { ClientOnly } from "@/components/ui/ClientOnly";

export default async function MyAccountPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const userId = (session.user as any).id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      architectProfile: true,
      clientProfile: true,
      posts: {
        orderBy: { createdAt: "desc" },
        include: {
          likes: { select: { userId: true } },
          comments: { select: { id: true } },
          _count: { select: { likes: true, comments: true } },
        },
      },
      sentConnections: {
        include: { receiver: { select: { id: true, name: true, image: true, role: true } } },
      },
      receivedConnections: {
        include: { sender: { select: { id: true, name: true, image: true, role: true } } },
      },
    },
  });

  if (!user) redirect("/login");

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-[var(--cream)]">
        <div className="bg-[var(--ink)] py-12 px-6 lg:px-12">
          <div className="max-w-4xl mx-auto">
            <p className="text-xs tracking-[0.3em] uppercase text-[var(--terracotta)] mb-2">My Account</p>
            <h1 className="display text-5xl text-[var(--cream)]">{user.name}</h1>
            <p className="text-[var(--stone)] mt-1 capitalize">{(user.role as string).toLowerCase()}</p>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-6 py-10">
          <ClientOnly>
            <AccountPage user={user} />
          </ClientOnly>
        </div>
      </main>
    </>
  );
}