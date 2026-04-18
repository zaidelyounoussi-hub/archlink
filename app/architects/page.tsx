import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { ArchitectCard } from "@/components/ui/ArchitectCard";
import { SearchFilters } from "@/components/ui/SearchFilters";

export const revalidate = 60;

export default async function ArchitectsPage({
  searchParams,
}: {
  searchParams: { q?: string; specialty?: string; location?: string; available?: string };
}) {
  const where: any = {
    user: { role: "ARCHITECT" },
  };

  if (searchParams.q) {
    where.OR = [
      { user: { name: { contains: searchParams.q } } },
      { bio: { contains: searchParams.q } },
      { specialty: { contains: searchParams.q } },
    ];
  }
  if (searchParams.specialty) {
    where.specialty = { contains: searchParams.specialty };
  }
  if (searchParams.location) {
    where.location = { contains: searchParams.location };
  }
  if (searchParams.available === "true") {
    where.available = true;
  }

  const profiles = await prisma.architectProfile.findMany({
    where,
    include: {
      user: {
        include: {
          reviewsReceived: { select: { rating: true } },
        },
      },
      portfolio: { take: 1 },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <Navbar />
      <main className="pt-16">
        <div className="py-14 px-6 lg:px-12 bg-[var(--ink)]">
          <div className="max-w-7xl mx-auto">
            <p className="text-xs tracking-[0.3em] uppercase text-[var(--terracotta)] mb-4">Discover</p>
            <h1 className="display text-6xl text-[var(--cream)] mb-6">Find your architect.</h1>
            <p className="text-[var(--stone)] max-w-xl">
              Browse {profiles.length} verified professionals across every architectural specialty.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
          <SearchFilters />

          {profiles.length === 0 ? (
            <div className="text-center py-24">
              <p className="display text-4xl text-[var(--stone)] mb-4">No results found.</p>
              <p className="text-sm text-[var(--stone)]">Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
              {profiles.map((profile) => {
                const reviews = profile.user.reviewsReceived;
                const avgRating =
                  reviews.length > 0
                    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                    : null;

                return (
                  <ArchitectCard
                    key={profile.id}
                    profile={profile}
                    avgRating={avgRating}
                    reviewCount={reviews.length}
                  />
                );
              })}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
