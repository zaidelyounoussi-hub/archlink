import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import Link from "next/link";
import { Search, MessageSquare, Star, ArrowRight } from "lucide-react";
import { ClientOnly } from "@/components/ui/ClientOnly";

export default async function ClientDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if ((session.user as any).role !== "CLIENT") redirect("/dashboard/architect");

  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
    include: {
      clientProfile: true,
      receivedMessages: { where: { read: false }, select: { id: true } },
      reviewsGiven: { select: { id: true } },
    },
  });

  if (!user) redirect("/login");

  const recentArchitects = await prisma.architectProfile.findMany({
    where: { available: true },
    take: 3,
    include: { user: { include: { reviewsReceived: { select: { rating: true } } } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-[var(--cream)]">
        <div className="bg-[var(--ink)] py-16 px-6 lg:px-12">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-[var(--terracotta)] mb-2">Client Dashboard</p>
              <h1 className="display text-5xl text-[var(--cream)]">Hello, {user.name?.split(" ")[0]}.</h1>
              <p className="text-[var(--stone)] mt-2">Find the perfect architect for your next project.</p>
            </div>
            <Link href="/architects" className="btn-primary flex items-center gap-2 self-start md:self-auto">
              <Search size={15} /> Browse Architects <ArrowRight size={15} />
            </Link>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 space-y-10">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Link href="/messages" className="card p-6 hover:shadow-md transition-shadow">
              <div className="text-[var(--terracotta)] mb-3"><MessageSquare size={20} /></div>
              <p className="display text-4xl mb-1">{user.receivedMessages.length}</p>
              <p className="text-xs text-[var(--stone)]">Unread Messages</p>
            </Link>
            <div className="card p-6">
              <div className="text-[var(--terracotta)] mb-3"><Star size={20} /></div>
              <p className="display text-4xl mb-1">{user.reviewsGiven.length}</p>
              <p className="text-xs text-[var(--stone)]">Reviews Given</p>
            </div>
            <Link href="/architects" className="card p-6 hover:shadow-md transition-shadow">
              <div className="text-[var(--terracotta)] mb-3"><Search size={20} /></div>
              <p className="display text-4xl mb-1">2,400+</p>
              <p className="text-xs text-[var(--stone)]">Architects Available</p>
            </Link>
          </div>

          <div className="card p-8">
            <h2 className="display text-3xl mb-6">Your Project Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-xs tracking-widest uppercase text-[var(--stone)] mb-1">Location</p>
                <p className="font-medium">{user.clientProfile?.location || "Not set"}</p>
              </div>
              <div>
                <p className="text-xs tracking-widest uppercase text-[var(--stone)] mb-1">Project Type</p>
                <p className="font-medium">{user.clientProfile?.projectType || "Not set"}</p>
              </div>
              <div>
                <p className="text-xs tracking-widest uppercase text-[var(--stone)] mb-1">Budget</p>
                <p className="font-medium">{user.clientProfile?.budget || "Not set"}</p>
              </div>
              {user.clientProfile?.bio && (
                <div className="md:col-span-3 pt-4 border-t border-[var(--border)]">
                  <p className="text-xs tracking-widest uppercase text-[var(--stone)] mb-2">About Your Project</p>
                  <p className="text-sm text-[var(--stone)] leading-relaxed">{user.clientProfile.bio}</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="display text-3xl">Available Architects</h2>
              <Link href="/architects" className="text-xs text-[var(--terracotta)] hover:underline flex items-center gap-1">
                View all <ArrowRight size={12} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {recentArchitects.map((profile) => {
                const reviews = profile.user.reviewsReceived;
                const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : null;
                return (
                  <Link key={profile.id} href={"/architects/" + profile.userId} className="card p-6 hover:shadow-md transition-shadow group">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-[var(--cream)] border border-[var(--border)] flex items-center justify-center text-lg overflow-hidden">
                        {profile.user.image ? <img src={profile.user.image} className="w-full h-full rounded-full object-cover" alt="" /> : profile.user.name?.[0]}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{profile.user.name}</p>
                        <p className="text-xs text-[var(--stone)]">{profile.specialty}</p>
                      </div>
                    </div>
                    {avg !== null && (
                      <div className="flex items-center gap-1 mb-3">
                        <Star size={12} className="star-filled fill-current" />
                        <span className="text-xs font-medium">{avg.toFixed(1)}</span>
                        <span className="text-xs text-[var(--stone)]">({reviews.length})</span>
                      </div>
                    )}
                    <p className="text-xs text-[var(--stone)] line-clamp-2 mb-3">{profile.bio}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[var(--terracotta)] font-medium">{profile.priceRange}</span>
                      <span className="text-xs text-[var(--stone)] group-hover:text-[var(--terracotta)] transition-colors flex items-center gap-1">View <ArrowRight size={11} /></span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="card p-10 bg-[var(--ink)] border-0 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="display text-4xl text-[var(--cream)] mb-2">Ready to start your project?</h2>
              <p className="text-[var(--stone)] text-sm">Browse our full network of verified architects.</p>
            </div>
            <Link href="/architects" className="btn-primary flex items-center gap-2 shrink-0">
              Find an Architect <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}