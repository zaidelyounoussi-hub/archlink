"use client";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Bookmark, Heart, MessageCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

const POST_TYPES: Record<string, string> = {
  update: "General Update", project: "Project Showcase",
  question: "Question", tip: "Tip & Advice",
};

const AV = ({ image, name, size }: { image?: string | null; name?: string | null; size: number }) => (
  <div style={{ width: size, height: size, minWidth: size, borderRadius: "50%", overflow: "hidden", border: "2px solid #DDD0BC", background: "#F1E6D2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    {image ? <img src={image} alt="" style={{ width: size, height: size, objectFit: "cover" }} /> : <span style={{ fontSize: size * 0.35, fontFamily: "Cormorant Garamond, serif" }}>{name?.[0]?.toUpperCase() ?? "?"}</span>}
  </div>
);

export default function SavedPostsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (status === "unauthenticated") router.push("/login");
  }, [status]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/saved-posts")
      .then(r => r.json())
      .then(data => { setPosts(data); setLoading(false); });
  }, [status]);

  const unsave = async (postId: string) => {
    await fetch("/api/posts/" + postId + "/save", { method: "POST" });
    setPosts(prev => prev.filter(p => p.id !== postId));
  };

  if (!mounted || status === "loading") return null;

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-[var(--cream)]">
        <div className="bg-[var(--ink)] py-10 px-6 lg:px-12">
          <div className="max-w-2xl mx-auto">
            <p className="text-xs tracking-[0.3em] uppercase text-[var(--terracotta)] mb-2">Collection</p>
            <h1 className="display text-5xl text-[var(--cream)]">Saved Posts</h1>
            <p className="text-[var(--stone)] mt-2 text-sm">Posts you have bookmarked for later.</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-6 py-10">
          {loading && (
            <div className="space-y-4">
              {[1,2,3].map(i => (
                <div key={i} className="card p-5 animate-pulse">
                  <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#DDD0BC" }} />
                    <div style={{ flex: 1 }} className="space-y-2">
                      <div className="h-3 bg-[var(--border)] rounded w-1/3" />
                      <div className="h-2 bg-[var(--border)] rounded w-1/4" />
                    </div>
                  </div>
                  <div className="h-3 bg-[var(--border)] rounded mb-2" />
                  <div className="h-3 bg-[var(--border)] rounded w-3/4" />
                </div>
              ))}
            </div>
          )}

          {!loading && posts.length === 0 && (
            <div className="text-center py-20">
              <Bookmark size={44} className="mx-auto mb-4 text-[var(--stone)] opacity-30" />
              <p className="display text-4xl text-[var(--stone)] mb-3">No saved posts</p>
              <p className="text-sm text-[var(--stone)] mb-6">Save posts from the feed to read them later.</p>
              <Link href="/feed" className="btn-primary inline-flex items-center gap-2">
                Browse Feed <ArrowRight size={14} />
              </Link>
            </div>
          )}

          <div className="space-y-4">
            {posts.map(post => (
              <div key={post.id} className="card overflow-hidden">
                <div className="p-5">
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
                    <Link href={post.author.role === "ARCHITECT" ? "/architects/" + post.author.id : "#"}>
                      <AV image={post.author.image} name={post.author.name} size={40} />
                    </Link>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Link href={post.author.role === "ARCHITECT" ? "/architects/" + post.author.id : "#"} className="font-medium text-sm hover:text-[var(--terracotta)] transition-colors">
                          {post.author.name}
                        </Link>
                        <span className="text-[10px] tracking-wider uppercase px-2 py-0.5 bg-[var(--cream)] text-[var(--stone)] border border-[var(--border)]">
                          {post.author.role === "ARCHITECT" ? "Architect" : "Client"}
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: 6, marginTop: 2, alignItems: "center" }}>
                        <span className="text-xs text-[var(--stone)]">{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                        <span className="text-xs text-[var(--stone)]">·</span>
                        <span className="text-xs text-[var(--stone)]">{POST_TYPES[post.type] || post.type}</span>
                      </div>
                    </div>
                    {/* Unsave button */}
                    <button onClick={() => unsave(post.id)} title="Remove from saved" className="text-[var(--terracotta)] hover:opacity-70 transition-opacity p-1">
                      <Bookmark size={18} className="fill-current" />
                    </button>
                  </div>

                  <Link href={"/posts/" + post.id}>
                    <p className="text-sm leading-relaxed whitespace-pre-line hover:text-[var(--terracotta)] transition-colors">{post.content}</p>
                    {post.imageUrl && (
                      <div style={{ marginTop: 12, overflow: "hidden", border: "1px solid #DDD0BC" }}>
                        <img src={post.imageUrl} alt="" style={{ width: "100%", maxHeight: 300, objectFit: "cover", display: "block" }} />
                      </div>
                    )}
                  </Link>
                </div>

                <div className="px-5 py-3 flex items-center gap-5 border-t border-[var(--border)]">
                  <span className="flex items-center gap-1.5 text-sm text-[var(--stone)]">
                    <Heart size={15} /> {post._count.likes}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-[var(--stone)]">
                    <MessageCircle size={15} /> {post._count.comments}
                  </span>
                  <Link href={"/posts/" + post.id} className="ml-auto text-xs text-[var(--terracotta)] hover:underline flex items-center gap-1">
                    View post <ArrowRight size={11} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}