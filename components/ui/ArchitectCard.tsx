// components/ui/ArchitectCard.tsx
import Link from "next/link";
import { MapPin, Star, Briefcase } from "lucide-react";

interface Props {
  profile: any;
  avgRating: number | null;
  reviewCount: number;
}

export function ArchitectCard({ profile, avgRating, reviewCount }: Props) {
  const user = profile.user;

  return (
    <Link
      href={`/architects/${user.id}`}
      className="card group hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col"
    >
      {/* Top color accent */}
      <div className="h-1 w-full bg-[var(--terracotta)] opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="p-7 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start gap-4 mb-5">
          <div className="w-14 h-14 rounded-full bg-[var(--cream)] flex items-center justify-center text-2xl shrink-0 border border-[var(--border)]">
            {user.image ? (
              <img src={user.image} alt="" className="w-full h-full rounded-full object-cover" />
            ) : (
              <span>{user.name?.[0] ?? "A"}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-[var(--ink)] truncate">{user.name}</h3>
            {profile.specialty && (
              <p className="text-sm text-[var(--stone)] truncate">{profile.specialty}</p>
            )}
            {profile.location && (
              <p className="text-xs text-[var(--stone)] flex items-center gap-1 mt-1">
                <MapPin size={11} /> {profile.location}
              </p>
            )}
          </div>
          {profile.available && (
            <span className="text-[10px] tracking-wider uppercase bg-[var(--sage)]/10 text-[var(--sage)] px-2 py-0.5 shrink-0">
              Available
            </span>
          )}
        </div>

        {/* Bio */}
        {profile.bio && (
          <p className="text-sm text-[var(--stone)] leading-relaxed mb-5 line-clamp-3 flex-1">
            {profile.bio}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-[var(--border)] mt-auto">
          <div className="flex items-center gap-3 text-xs text-[var(--stone)]">
            {profile.yearsExp && (
              <span className="flex items-center gap-1">
                <Briefcase size={11} /> {profile.yearsExp} yrs
              </span>
            )}
            {profile.priceRange && (
              <span className="text-[var(--terracotta)] font-medium">{profile.priceRange}</span>
            )}
          </div>

          {avgRating !== null && (
            <div className="flex items-center gap-1">
              <Star size={13} className="star-filled fill-current" />
              <span className="text-sm font-medium">{avgRating.toFixed(1)}</span>
              <span className="text-xs text-[var(--stone)]">({reviewCount})</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
