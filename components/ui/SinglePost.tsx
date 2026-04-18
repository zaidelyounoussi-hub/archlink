"use client";
import { useState } from "react";
import { Heart, MessageCircle, Send, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

const POST_TYPES: Record<string, string> = {
  update: "General Update",
  project: "Project Showcase",
  question: "Question",
  tip: "Tip & Advice",
};

const AV = ({ image, name, size }: { image?: string | null; name?: string | null; size: number }) => (
  <div style={{ width: size, height: size, minWidth: size, maxWidth: size, borderRadius: "50%", overflow: "hidden", border: "2px solid #DDD0BC", background: "#F1E6D2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    {image
      ? <img src={image} alt="" style={{ width: size, height: size, objectFit: "cover", display: "block" }} />
      : <span style={{ fontSize: size * 0.35, fontFamily: "Cormorant Garamond, serif" }}>{name?.[0]?.toUpperCase() ?? "?"}</span>
    }
  </div>
);

export function SinglePost({ post, currentUserId }: { post: any; currentUserId: string }) {
  const router = useRouter();
  const [liked, setLiked] = useState(post.likes.some((l: any) => l.userId === currentUserId));
  const [likeCount, setLikeCount] = useState(post._count.likes);
  const [comments, setComments] = useState(post.comments || []);
  const [commentInput, setCommentInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const toggleLike = async () => {
    setLiked(!liked);
    setLikeCount((c: number) => liked ? c - 1 : c + 1);
    await fetch("/api/posts/" + post.id + "/like", { method: "POST" });
  };

  const submitComment = async () => {
    if (!commentInput.trim() || submitting) return;
    setSubmitting(true);
    const res = await fetch("/api/posts/" + post.id + "/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: commentInput }),
    });
    const newComment = await res.json();
    setComments((prev: any[]) => [...prev, newComment]);
    setCommentInput("");
    setSubmitting(false);
  };

  return (
    <div className="space-y-4">
      {/* Back button */}
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-[var(--stone)] hover:text-[var(--ink)] transition-colors mb-2">
        <ArrowLeft size={15} /> Back
      </button>

      {/* Post card */}
      <div className="card overflow-hidden">
        <div className="p-6">
          {/* Author */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 20 }}>
            <Link href={post.author.role === "ARCHITECT" ? "/architects/" + post.author.id : "#"} style={{ flexShrink: 0 }}>
              <AV image={post.author.image} name={post.author.name} size={48} />
            </Link>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <Link href={post.author.role === "ARCHITECT" ? "/architects/" + post.author.id : "#"} className="font-medium hover:text-[var(--terracotta)] transition-colors">
                  {post.author.name}
                </Link>
                <span className="text-[10px] tracking-wider uppercase px-2 py-0.5 bg-[var(--cream)] text-[var(--stone)] border border-[var(--border)]">
                  {post.author.role === "ARCHITECT" ? (post.author.architectProfile?.specialty || "Architect") : "Client"}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-[var(--stone)]">{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                <span className="text-xs text-[var(--stone)]">-</span>
                <span className="text-xs text-[var(--stone)]">{POST_TYPES[post.type] || post.type}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <p className="text-base leading-relaxed whitespace-pre-line mb-4">{post.content}</p>

          {/* Image */}
          {post.imageUrl && (
            <div style={{ overflow: "hidden", border: "1px solid #DDD0BC", marginBottom: 16 }}>
              <img src={post.imageUrl} alt="Post" style={{ width: "100%", objectFit: "cover", display: "block" }} />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-6 pt-4 border-t border-[var(--border)]">
            <button onClick={toggleLike} className={"flex items-center gap-2 text-sm transition-colors " + (liked ? "text-red-500" : "text-[var(--stone)] hover:text-red-500")}>
              <Heart size={18} className={liked ? "fill-current" : ""} />
              <span>{likeCount} {likeCount === 1 ? "like" : "likes"}</span>
            </button>
            <div className="flex items-center gap-2 text-sm text-[var(--stone)]">
              <MessageCircle size={18} />
              <span>{comments.length} {comments.length === 1 ? "comment" : "comments"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comments section */}
      <div className="card p-6">
        <h2 className="display text-2xl mb-6">Comments</h2>

        {comments.length === 0 && (
          <p className="text-sm text-[var(--stone)] mb-6">No comments yet. Be the first!</p>
        )}

        <div className="space-y-5 mb-6">
          {comments.map((c: any) => (
            <div key={c.id} style={{ display: "flex", gap: 12 }}>
              <AV image={c.author.image} name={c.author.name} size={36} />
              <div className="flex-1">
                <div className="bg-[var(--cream)] px-4 py-3">
                  <p className="text-sm font-medium mb-1">{c.author.name}</p>
                  <p className="text-sm leading-relaxed">{c.content}</p>
                </div>
                <p className="text-[10px] text-[var(--stone)] mt-1.5">
                  {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Comment input */}
        {currentUserId ? (
          <div className="flex gap-3 pt-4 border-t border-[var(--border)]">
            <input
              className="input flex-1"
              placeholder="Write a comment..."
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitComment()}
            />
            <button onClick={submitComment} disabled={submitting || !commentInput.trim()} className="btn-primary px-4 disabled:opacity-50 flex items-center gap-2">
              <Send size={14} /> Post
            </button>
          </div>
        ) : (
          <p className="text-sm text-[var(--stone)] pt-4 border-t border-[var(--border)]">
            <Link href="/login" className="text-[var(--terracotta)] hover:underline">Sign in</Link> to leave a comment.
          </p>
        )}
      </div>
    </div>
  );
}