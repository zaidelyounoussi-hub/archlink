"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { Heart, MessageCircle, Send, X, ChevronDown, ImagePlus, Loader2, MoreHorizontal, Pencil, Trash2, Check, Bookmark } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

const POST_TYPES = [
  { value: "update", label: "General Update" },
  { value: "project", label: "Project Showcase" },
  { value: "question", label: "Question" },
  { value: "tip", label: "Tip & Advice" },
];

const AV = ({ image, name, size }: { image?: string | null; name?: string | null; size: number }) => (
  <div style={{ width: size, height: size, minWidth: size, maxWidth: size, borderRadius: "50%", overflow: "hidden", border: "2px solid var(--border)", background: "var(--cream)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, flexGrow: 0 }}>
    {image
      ? <img src={image} alt="" style={{ width: size, height: size, objectFit: "cover", display: "block" }} />
      : <span style={{ fontSize: size * 0.35, fontFamily: "Cormorant Garamond, serif", lineHeight: 1 }}>{name?.[0]?.toUpperCase() ?? "?"}</span>
    }
  </div>
);

function PostCard({ post, currentUserId, onDelete, onEdit }: { post: any; currentUserId: string; onDelete: (id: string) => void; onEdit: (post: any) => void }) {
  const router = useRouter();
  const [liked, setLiked] = useState(post.likes.some((l: any) => l.userId === currentUserId));
  const [likeCount, setLikeCount] = useState(post._count.likes);
  const [commentCount] = useState(post._count.comments);
  const [saved, setSaved] = useState(!!(post.savedBy && post.savedBy.length > 0));
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [editType, setEditType] = useState(post.type);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const typeInfo = POST_TYPES.find(t => t.value === post.type) || POST_TYPES[0];
  const isOwner = post.author.id === currentUserId;
  const authorAvatar = post.authorAvatar ?? post.author?.image ?? null;

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

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Delete this post permanently?")) return;
    setDeleting(true);
    await fetch("/api/posts/" + post.id, { method: "DELETE" });
    onDelete(post.id);
  };

  const handleSaveEdit = async () => {
    if (!editContent.trim()) return;
    setSaving(true);
    const res = await fetch("/api/posts/" + post.id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: editContent, type: editType }),
    });
    const updated = await res.json();
    onEdit({ ...updated, authorAvatar });
    setEditing(false);
    setSaving(false);
  };

  return (
    <div className={"card overflow-hidden post-card " + (deleting ? "opacity-50 pointer-events-none" : "")}>
      <div className="p-5">
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
          <div onClick={e => e.stopPropagation()}>
            <Link href={post.author.role === "ARCHITECT" ? "/architects/" + post.author.id : "#"}>
              <AV image={authorAvatar} name={post.author.name} size={42} />
            </Link>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span onClick={e => e.stopPropagation()}>
                <Link href={post.author.role === "ARCHITECT" ? "/architects/" + post.author.id : "#"} className="font-medium text-sm hover:text-[var(--terracotta)] transition-colors">
                  {post.author.name}
                </Link>
              </span>
              <span className="text-[10px] tracking-wider uppercase px-2 py-0.5 bg-[var(--cream)] text-[var(--stone)] border border-[var(--border)]">
                {post.author.role === "ARCHITECT" ? "Architect" : "Client"}
              </span>
              {post.updatedAt !== post.createdAt && <span className="text-[10px] text-[var(--stone)] italic">edited</span>}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
              <span className="text-xs text-[var(--stone)]">{" \u00B7 "}</span>
              <span className="text-xs text-[var(--stone)]">{" \u00B7 "}</span>
              <span className="text-xs text-[var(--stone)]">{" \u00B7 "}</span>
            </div>
          </div>
          {isOwner && (
            <div style={{ position: "relative" }} onClick={e => e.stopPropagation()}>
              <button onClick={() => setMenuOpen(!menuOpen)} className="text-[var(--stone)] hover:text-[var(--ink)] p-1">
                <MoreHorizontal size={18} />
              </button>
              {menuOpen && (
                <div style={{ position: "absolute", right: 0, top: "100%", marginTop: 4, width: 140, background: "var(--card)", border: "1px solid var(--border)", zIndex: 50, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                  <button onClick={() => { setEditing(true); setMenuOpen(false); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-[var(--cream)] text-left">
                    <Pencil size={14} /> Edit
                  </button>
                  <button onClick={handleDelete} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-red-50 text-red-500 text-left">
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {editing ? (
          <div className="space-y-3">
            <textarea className="input min-h-[90px] resize-none text-sm w-full" value={editContent} onChange={e => setEditContent(e.target.value)} autoFocus />
            <div className="flex flex-wrap gap-2">
              {POST_TYPES.map(t => (
                <button key={t.value} type="button" onClick={() => setEditType(t.value)}
                  className={"px-3 py-1.5 text-xs border transition-all " + (editType === t.value ? "bg-[var(--ink)] text-[var(--cream)] border-[var(--ink)]" : "bg-white border-[var(--border)] text-[var(--stone)]")}>
                  {t.label}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={handleSaveEdit} disabled={saving} className="btn-primary text-xs flex items-center gap-1.5">
                <Check size={13} /> {saving ? "Saving..." : "Save"}
              </button>
              <button onClick={() => { setEditing(false); setEditContent(post.content); }} className="btn-outline text-xs flex items-center gap-1.5">
                <X size={13} /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <div onClick={() => router.push("/posts/" + post.id)} style={{ cursor: "pointer" }}>
            <p className="text-sm leading-relaxed whitespace-pre-line">{post.content}</p>
            {post.imageUrl && (
              <div style={{ marginTop: 12, overflow: "hidden", border: "1px solid var(--border)" }}>
                <img src={post.imageUrl} alt="" style={{ width: "100%", maxHeight: 500, objectFit: "cover", display: "block" }} />
              </div>
            )}
          </div>
        )}
      </div>

      {!editing && (
        <div style={{ padding: "10px 20px", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 4 }}>
          <button onClick={toggleLike} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, background: "none", border: "none", cursor: "pointer", color: liked ? "#e53e3e" : "var(--stone)", padding: "4px 8px", borderRadius: 4 }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--cream)")}
            onMouseLeave={e => (e.currentTarget.style.background = "none")}>
            <Heart size={16} style={{ fill: liked ? "#e53e3e" : "none", color: liked ? "#e53e3e" : "var(--stone)" }} />
            {likeCount} {likeCount === 1 ? "Like" : "Likes"}
          </button>

          <button onClick={() => router.push("/posts/" + post.id)} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, background: "none", border: "none", cursor: "pointer", color: "var(--stone)", padding: "4px 8px", borderRadius: 4 }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--cream)")}
            onMouseLeave={e => (e.currentTarget.style.background = "none")}>
            <MessageCircle size={16} />
            {commentCount} {commentCount === 1 ? "Comment" : "Comments"}
          </button>

          <button onClick={toggleSave} title={saved ? "Remove from saved" : "Save post"} style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, fontSize: 13, background: "none", border: "none", cursor: "pointer", color: saved ? "#891D1A" : "var(--stone)", padding: "4px 8px", borderRadius: 4 }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--cream)")}
            onMouseLeave={e => (e.currentTarget.style.background = "none")}>
            <Bookmark size={16} style={{ fill: saved ? "#891D1A" : "none", color: saved ? "#891D1A" : "var(--stone)" }} />
            {saved ? "Saved" : "Save"}
          </button>
        </div>
      )}
    </div>
  );
}

function CreatePost({ onPost, userAvatar, userName }: { onPost: (p: any) => void; userAvatar: string | null; userName: string | null }) {
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [type, setType] = useState("update");
  const [posting, setPosting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImagePick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { alert("Max file size is 10MB"); return; }
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload-post", { method: "POST", body: fd });
    const data = await res.json();
    if (res.ok) { setImageUrl(data.url); } else { alert("Upload failed"); setImagePreview(null); }
    setUploading(false);
  };

  const submit = async () => {
    if (!content.trim() || posting || uploading) return;
    setPosting(true);
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, imageUrl, type }),
    });
    const post = await res.json();
    post.authorAvatar = userAvatar;
    onPost(post);
    setContent("");
    setImageUrl(null);
    setImagePreview(null);
    setType("update");
    setPosting(false);
  };

  return (
    <div className="card p-5 mb-6">
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flexShrink: 0 }}><AV image={userAvatar} name={userName} size={42} /></div>
        <div style={{ flex: 1, minWidth: 0 }} className="space-y-3">
          <textarea className="input min-h-[80px] resize-none text-sm" placeholder="Share a project, ask a question, or post an update..." value={content} onChange={e => setContent(e.target.value)} />
          <div className="flex flex-wrap gap-2">
            {POST_TYPES.map(t => (
              <button key={t.value} type="button" onClick={() => setType(t.value)}
                className={"px-3 py-1.5 text-xs border transition-all " + (type === t.value ? "bg-[var(--ink)] text-[var(--cream)] border-[var(--ink)]" : "bg-white border-[var(--border)] text-[var(--stone)] hover:border-[var(--ink)]")}>
                {t.label}
              </button>
            ))}
          </div>
          {imagePreview && (
            <div style={{ position: "relative" }}>
              <img src={imagePreview} alt="" style={{ width: "100%", maxHeight: 240, objectFit: "cover", display: "block", border: "1px solid var(--border)" }} />
              {uploading
                ? <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <Loader2 size={20} className="text-white animate-spin" />
                    <span style={{ color: "white", fontSize: 14 }}>Uploading...</span>
                  </div>
                : <button onClick={() => { setImageUrl(null); setImagePreview(null); }} style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.6)", color: "white", borderRadius: "50%", padding: 4, border: "none", cursor: "pointer", display: "flex" }}>
                    <X size={14} />
                  </button>
              }
            </div>
          )}
          <div className="flex items-center justify-between">
            <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="flex items-center gap-1.5 text-xs text-[var(--stone)] hover:text-[var(--terracotta)] transition-colors disabled:opacity-50">
              <ImagePlus size={15} /> {uploading ? "Uploading..." : "Add Photo"}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImagePick} />
            <button onClick={submit} disabled={posting || !content.trim() || uploading} className="btn-primary text-xs disabled:opacity-50 flex items-center gap-2">
              <Send size={13} /> {posting ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Feed({ hideCreatePost, newPost }: { hideCreatePost?: boolean; newPost?: any } = {}) {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<any[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const currentUserId = (session?.user as any)?.id ?? "";
  const userName = session?.user?.name ?? null;

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!currentUserId) return;
    fetch("/api/architects/" + currentUserId + "/info")
      .then(r => r.json())
      .then(d => { if (d.image) setUserAvatar(d.image); })
      .catch(() => setUserAvatar(session?.user?.image ?? null));
  }, [currentUserId]);

  const loadPosts = useCallback(async (cur: string | null = null) => {
    setLoading(true);
    const url = "/api/posts" + (cur ? "?cursor=" + cur : "");
    const res = await fetch(url);
    const data = await res.json();
    setPosts(prev => cur ? [...prev, ...data.posts] : data.posts);
    setCursor(data.nextCursor);
    setHasMore(!!data.nextCursor);
    setLoading(false);
  }, []);

  useEffect(() => { loadPosts(); }, [loadPosts]);

  if (!mounted) return null;

  const handleDelete = (id: string) => setPosts(prev => prev.filter(p => p.id !== id));
  const handleEdit = (updated: any) => setPosts(prev => prev.map(p => p.id === updated.id ? { ...updated, authorAvatar: p.authorAvatar } : p));

  return (
    <div>
      {!hideCreatePost && <CreatePost onPost={p => setPosts(prev => [p, ...prev])} userAvatar={userAvatar} userName={userName} />}

      {loading && posts.length === 0 && (
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="card p-5 animate-pulse">
              <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 42, height: 42, borderRadius: "50%", background: "var(--border)", flexShrink: 0 }} />
                <div style={{ flex: 1 }} className="space-y-2">
                  <div className="h-3 bg-[var(--border)] rounded w-1/3" />
                  <div className="h-2 bg-[var(--border)] rounded w-1/4" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-[var(--border)] rounded" />
                <div className="h-3 bg-[var(--border)] rounded w-5/6" />
              </div>
            </div>
          ))}
        </div>
      )}

      {posts.length === 0 && !loading && (
        <div className="text-center py-20">
          <p className="display text-4xl text-[var(--stone)] mb-3">No posts yet</p>
          <p className="text-sm text-[var(--stone)]">Be the first to share something!</p>
        </div>
      )}

      <div className="space-y-4">
        {posts.map(post => (
          <PostCard key={post.id} post={post} currentUserId={currentUserId} onDelete={handleDelete} onEdit={handleEdit} />
        ))}
      </div>

      {hasMore && (
        <button onClick={() => loadPosts(cursor)} disabled={loading} className="w-full mt-6 py-3 border border-[var(--border)] text-sm text-[var(--stone)] hover:border-[var(--ink)] transition-all flex items-center justify-center gap-2 disabled:opacity-50">
          <ChevronDown size={16} /> {loading ? "Loading..." : "Load more"}
        </button>
      )}
    </div>
  );
}
