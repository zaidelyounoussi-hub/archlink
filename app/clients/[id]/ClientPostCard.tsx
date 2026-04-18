"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, MessageCircle, Bookmark } from "lucide-react";
import { useSession } from "next-auth/react";

export function ClientPostCard({ post, currentUserId }: { post: any; currentUserId: string }) {
  const router = useRouter();
  const [liked, setLiked] = useState(post.likes?.some((l: any) => l.userId === currentUserId) ?? false);
  const [likeCount, setLikeCount] = useState(post._count.likes);
  const [saved, setSaved] = useState(post.savedBy?.some((s: any) => s.userId === currentUserId) ?? false);

  const toggleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(!liked);
    setLikeCount((c: number) => liked ? c - 1 : c + 1);
    await fetch("/api/posts/" + post.id + "/like", { method: "POST" });
  };

  const toggleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setSaved(!saved);
    await fetch("/api/posts/" + post.id + "/save", { method: "POST" });
  };

  return (
    <div className="card overflow-hidden">
      <div className="p-5 cursor-pointer" onClick={() => router.push("/posts/" + post.id)}>
        <p className="text-sm leading-relaxed">{post.content}</p>
        {post.imageUrl && (
          <img src={post.imageUrl} alt="" className="mt-3 w-full max-h-64 object-cover border border-[var(--border)]" />
        )}
      </div>
      <div style={{ padding: "10px 20px", borderTop: "1px solid #DDD0BC", display: "flex", alignItems: "center", gap: 4 }}>
        <button onClick={toggleLike} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, background: "none", border: "none", cursor: "pointer", color: liked ? "#e53e3e" : "#7A6A6A", padding: "4px 8px", borderRadius: 4 }}
          onMouseEnter={e => (e.currentTarget.style.background = "#F1E6D2")}
          onMouseLeave={e => (e.currentTarget.style.background = "none")}>
          <Heart size={16} style={{ fill: liked ? "#e53e3e" : "none", color: liked ? "#e53e3e" : "#7A6A6A" }} />
          {likeCount} {likeCount === 1 ? "Like" : "Likes"}
        </button>

        <button onClick={() => router.push("/posts/" + post.id)} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, background: "none", border: "none", cursor: "pointer", color: "#7A6A6A", padding: "4px 8px", borderRadius: 4 }}
          onMouseEnter={e => (e.currentTarget.style.background = "#F1E6D2")}
          onMouseLeave={e => (e.currentTarget.style.background = "none")}>
          <MessageCircle size={16} />
          {post._count.comments} {post._count.comments === 1 ? "Comment" : "Comments"}
        </button>

        <button onClick={toggleSave} style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, fontSize: 13, background: "none", border: "none", cursor: "pointer", color: saved ? "#891D1A" : "#7A6A6A", padding: "4px 8px", borderRadius: 4 }}
          onMouseEnter={e => (e.currentTarget.style.background = "#F1E6D2")}
          onMouseLeave={e => (e.currentTarget.style.background = "none")}>
          <Bookmark size={16} style={{ fill: saved ? "#891D1A" : "none", color: saved ? "#891D1A" : "#7A6A6A" }} />
          {saved ? "Saved" : "Save"}
        </button>
      </div>
    </div>
  );
}
