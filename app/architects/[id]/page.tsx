export const dynamic = "force-dynamic";
// app/architects/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { MapPin, Globe, Phone, Briefcase, Star, CheckCircle } from "lucide-react";
import { ContactButton } from "@/components/ui/ContactButton";
import { ConnectButton } from "@/components/ui/ConnectButton";import { ReviewForm } from "@/components/ui/ReviewForm";
import { StarRating } from "@/components/ui/StarRating";

export default async function ArchitectProfilePage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  const user = await prisma.user.findUnique({
    where: { id: params.id, role: "ARCHITECT" },
    include: {
      architectProfile: {
        include: { portfolio: true },
      },
      reviewsReceived: {
        include: { author: { select: { name: true, image: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user || !user.architectProfile) return notFound();

  const profile = user.architectProfile;
  const reviews = user.reviewsReceived;
  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : null;

  const services = profile.services ? JSON.parse(profile.services) : [];

  const alreadyReviewed = session
    ? reviews.some((r) => r.authorId === (session.user as any).id)
    : false;

  const isOwn = session ? (session.user as any).id === user.id : false;

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
                  user.name?.[0] ?? "A"
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="display text-5xl text-[var(--cream)]">{user.name}</h1>
                  {profile.available && (
                    <span className="text-[10px] tracking-widest uppercase bg-[var(--sage)]/20 text-[var(--sage)] px-2 py-1">
                      Available
                    </span>
                  )}
                </div>
                {profile.specialty && (
                  <p className="text-[var(--stone)] mb-3">{profile.specialty}</p>
                )}
                <div className="flex flex-wrap gap-5 text-sm text-[var(--stone)]">
                  {profile.location && (
                    <span className="flex items-center gap-1.5"><MapPin size={14} />{profile.location}</span>
                  )}
                  {profile.yearsExp && (
                    <span className="flex items-center gap-1.5"><Briefcase size={14} />{profile.yearsExp} years experience</span>
                  )}
                  {profile.website && (
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-[var(--terracotta)] transition-colors">
                      <Globe size={14} />Website
                    </a>
                  )}
                  {profile.phone && (
                    <span className="flex items-center gap-1.5"><Phone size={14} />{profile.phone}</span>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-3">
                {avgRating !== null && (
                  <div className="flex items-center gap-2">
                    <StarRating rating={Math.round(avgRating)} readonly size={18} />
                    <span className="text-[var(--cream)] font-medium">{avgRating.toFixed(1)}</span>
                    <span className="text-[var(--stone)] text-sm">({reviews.length})</span>
                  </div>
                )}
                {profile.priceRange && (
                  <p className="text-[var(--terracotta)] font-medium">{profile.priceRange}</p>
                )}
                {!isOwn && (
  <div className="flex gap-2 flex-wrap">
    <ConnectButton targetId={user.id} />
    <ContactButton recipientId={user.id} recipientName={user.name ?? "Architect"} />
  </div>
)}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-14 grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main */}
          <div className="lg:col-span-2 space-y-12">
            {/* About */}
            {profile.bio && (
              <section>
                <h2 className="display text-3xl mb-5">About</h2>
                <p className="text-[var(--stone)] leading-relaxed whitespace-pre-line">{profile.bio}</p>
              </section>
            )}

            {/* Portfolio */}
            {profile.portfolio.length > 0 && (
              <section>
                <h2 className="display text-3xl mb-6">Portfolio</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {profile.portfolio.map((item: any) => (
                    <div key={item.id} className="card overflow-hidden group">
                      {item.imageUrl && (
                        <div className="h-48 overflow-hidden">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="p-5">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium">{item.title}</h3>
                          {item.year && <span className="text-xs text-[var(--stone)]">{item.year}</span>}
                        </div>
                        {item.description && (
                          <p className="text-sm text-[var(--stone)] mt-2 leading-relaxed">{item.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Reviews */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="display text-3xl">Reviews</h2>
                {avgRating && (
                  <div className="flex items-center gap-2">
                    <StarRating rating={Math.round(avgRating)} readonly size={16} />
                    <span className="text-sm text-[var(--stone)]">{avgRating.toFixed(1)} avg</span>
                  </div>
                )}
              </div>

              {reviews.length === 0 && (
                <p className="text-[var(--stone)] text-sm">No reviews yet.</p>
              )}

              <div className="space-y-5 mb-10">
                {reviews.map((review) => (
                  <div key={review.id} className="card p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-full bg-[var(--cream)] border border-[var(--border)] overflow-hidden flex items-center justify-center text-sm">
                        {review.author.image ? (
                          <img src={review.author.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          review.author.name?.[0] ?? "U"
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{review.author.name}</p>
                        <StarRating rating={review.rating} readonly size={13} />
                      </div>
                      <span className="ml-auto text-xs text-[var(--stone)]">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="text-sm text-[var(--stone)] leading-relaxed">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>

              {session && !isOwn && !alreadyReviewed && (
                <ReviewForm subjectId={user.id} />
              )}
              {alreadyReviewed && (
                <p className="text-sm text-[var(--stone)] flex items-center gap-2">
                  <CheckCircle size={15} className="text-[var(--sage)]" /> You've already reviewed this architect.
                </p>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {services.length > 0 && (
              <div className="card p-6">
                <h3 className="display text-2xl mb-4">Services</h3>
                <ul className="space-y-2">
                  {services.map((s: string) => (
                    <li key={s} className="flex items-center gap-2 text-sm text-[var(--stone)]">
                      <div className="w-1.5 h-1.5 bg-[var(--terracotta)] rounded-full" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {profile.licenseNo && (
              <div className="card p-6">
                <h3 className="display text-2xl mb-3">Credentials</h3>
                <p className="text-sm text-[var(--stone)]">License No.</p>
                <p className="text-sm font-medium mt-1">{profile.licenseNo}</p>
              </div>
            )}

            {!isOwn && (
              <div className="card p-6">
                <h3 className="display text-2xl mb-3">Get in touch</h3>
                <p className="text-sm text-[var(--stone)] mb-4">
                  Ready to discuss your project? Send a direct message.
                </p>
                <ContactButton recipientId={user.id} recipientName={user.name ?? "Architect"} fullWidth />
              </div>
            )}
          </aside>
        </div>
      </main>
    </>
  );
}
