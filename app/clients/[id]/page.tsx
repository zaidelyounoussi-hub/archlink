export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { MapPin, Briefcase } from "lucide-react";
import { ContactButton } from "@/components/ui/ContactButton";
import { ConnectButton } from "@/components/ui/ConnectButton";
import { ClientOnly } from "@/components/ui/ClientOnly";
import { ClientPostCard } from "./ClientPostCard";

export default async function ClientProfilePage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  const user = await prisma.user.findUnique({
    where: { id: params.id, role: "CLIENT" },
    include: {
      clientProfile: true,
      posts: {
        where: { archived: false },
        orderBy: { createdAt: "desc" },
        take: 6,
        include: {
          _count: { select: { likes: true, comments: true } },
          likes: { select: { userId: true } },
          savedBy: { select: { userId: true } },
        },
      },
    },
  });

  if (!user || !user.clientProfile) return notFound();

  const profile = user.clientProfile;
  const isOwn = session ? (session.user as any).id === user.id : false;
  const currentUserId = session ? (session.user as any).id : "";

  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Header banner */}
        <div className="bg-[var(--ink)] px-6 lg:px-12 pt-16 pb-0">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-8 pb-10 border-b border-white/10">
              <div className="w-24 h-24 rounded-full border-4 border-[var(--terracotta)] overflow-hidden bg-[var(--cream)] flex items-center justify-center text-4xl shrink-0">
                {user.image ? (
                  <img src={user.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  user.name?.[0] ?? "C"
                )}
              </div>
              <div className="flex-1">
                <h1 className="display text-5xl text-[var(--cream)] mb-1">{user.name}</h1>
                <p className="text-[var(--stone)] mb-3">Client</p>
                <div className="flex flex-wrap gap-5 text-sm text-[var(--stone)]">
                  {profile.location && (
                    <span className="flex items-center gap-1.5"><MapPin size={14} />{profile.location}</span>
                  )}
                  {profile.projectType && (
                    <span className="flex items-center gap-1.5"><Briefcase size={14} />{profile.projectType}</span>
                  )}
                </div>
              </div>
              {!isOwn && session && (
                <div className="flex gap-2 flex-wrap">
                  <ConnectButton targetId={user.id} />
                  <ContactButton recipientId={user.id} recipientName={user.name ?? "Client"} />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-14 grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main */}
          <div className="lg:col-span-2 space-y-12">
            {profile.bio && (
              <section>
                <h2 className="display text-3xl mb-5">About</h2>
                <p className="text-[var(--stone)] leading-relaxed whitespace-pre-line">{profile.bio}</p>
              </section>
            )}

            {user.posts.length > 0 && (
              <section>
                <h2 className="display text-3xl mb-6">Recent Posts</h2>
                <div className="space-y-4">
                  <ClientOnly>
                    {user.posts.map((post: any) => (
                      <ClientPostCard key={post.id} post={post} currentUserId={currentUserId} />
                    ))}
                  </ClientOnly>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {(profile.projectType || profile.budget) && (
              <div className="card p-6">
                <h3 className="display text-2xl mb-4">Project Info</h3>
                {profile.projectType && (
                  <div className="mb-3">
                    <p className="text-xs text-[var(--stone)] uppercase tracking-wider mb-1">Project Type</p>
                    <p className="text-sm font-medium">{profile.projectType}</p>
                  </div>
                )}
                {profile.budget && (
                  <div>
                    <p className="text-xs text-[var(--stone)] uppercase tracking-wider mb-1">Budget</p>
                    <p className="text-sm font-medium">{profile.budget}</p>
                  </div>
                )}
              </div>
            )}

            {!isOwn && session && (
              <div className="card p-6">
                <h3 className="display text-2xl mb-3">Get in touch</h3>
                <p className="text-sm text-[var(--stone)] mb-4">Send a direct message to this client.</p>
                <ContactButton recipientId={user.id} recipientName={user.name ?? "Client"} fullWidth />
              </div>
            )}
          </aside>
        </div>
      </main>
    </>
  );
}
