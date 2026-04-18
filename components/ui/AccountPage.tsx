"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Heart, MessageCircle, Archive, ArchiveRestore, Trash2, UserX, Check, X, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

const AV = ({ image, name, size }: { image?: string | null; name?: string | null; size: number }) => (
  <div style={{ width: size, height: size, minWidth: size, maxWidth: size, borderRadius: "50%", overflow: "hidden", border: "2px solid #E2DDD6", background: "#F9F6F0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    {image ? <img src={image} alt="" style={{ width: size, height: size, objectFit: "cover", display: "block" }} /> : <span style={{ fontSize: size * 0.35, fontFamily: "Cormorant Garamond, serif" }}>{name?.[0]?.toUpperCase() ?? "?"}</span>}
  </div>
);

export function AccountPage({ user }: { user: any }) {
  const router = useRouter();
  const [tab, setTab] = useState<"posts" | "archived" | "connections">("posts");
  const [posts, setPosts] = useState(user.posts.filter((p: any) => !p.archived));
  const [archivedPosts, setArchivedPosts] = useState(user.posts.filter((p: any) => p.archived));
  const [connections, setConnections] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch("/api/connections").then(r => r.json()).then(setConnections).catch(() => {});
  }, []);

  if (!mounted) return null;

  const pending = connections.filter(c => c.receiverId === user.id && c.status === "pending");
  const accepted = connections.filter(c => c.status === "accepted");
  const sent = connections.filter(c => c.senderId === user.id && c.status === "pending");

  const archivePost = async (postId: string) => {
    await fetch("/api/posts/" + postId, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ archived: true }) });
    const post = posts.find((p: any) => p.id === postId);
    setPosts((prev: any[]) => prev.filter(p => p.id !== postId));
    setArchivedPosts((prev: any[]) => [{ ...post, archived: true }, ...prev]);
  };

  const unarchivePost = async (postId: string) => {
    await fetch("/api/posts/" + postId, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ archived: false }) });
    const post = archivedPosts.find((p: any) => p.id === postId);
    setArchivedPosts((prev: any[]) => prev.filter(p => p.id !== postId));
    setPosts((prev: any[]) => [{ ...post, archived: false }, ...prev]);
  };

  const deletePost = async (postId: string, archived: boolean) => {
    if (!confirm("Delete this post permanently?")) return;
    await fetch("/api/posts/" + postId, { method: "DELETE" });
    if (archived) setArchivedPosts((prev: any[]) => prev.filter(p => p.id !== postId));
    else setPosts((prev: any[]) => prev.filter(p => p.id !== postId));
  };

  const respondConnection = async (id: string, status: "accepted" | "declined") => {
    const res = await fetch("/api/connections/" + id, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    const updated = await res.json();
    setConnections(prev => prev.map(c => c.id === id ? updated : c));
  };

  const removeConnection = async (id: string) => {
    await fetch("/api/connections/" + id, { method: "DELETE" });
    setConnections(prev => prev.filter(c => c.id !== id));
  };

  const TABS = [
    { key: "posts", label: "My Posts", count: posts.length, badge: 0 },
    { key: "archived", label: "Archived", count: archivedPosts.length, badge: 0 },
    { key: "connections", label: "Connections", count: accepted.length, badge: pending.length },
  ];

  const DOT = " \u00B7 ";

  return (
    <div className="space-y-6">
      <div className="card p-6 flex items-center gap-5">
        <AV image={user.image} name={user.name} size={64} />
        <div className="flex-1">
          <h2 className="display text-3xl">{user.name}</h2>
          <p className="text-sm text-[var(--stone)] capitalize mt-0.5">
            {user.role.toLowerCase()}{DOT}{user.architectProfile?.location || user.clientProfile?.location || "Location not set"}
          </p>
          {user.architectProfile?.specialty && <p className="text-xs text-[var(--terracotta)] mt-1">{user.architectProfile.specialty}</p>}
        </div>
        <div className="flex gap-2">
          <Link href="/feed" className="btn-outline text-xs">Go to Feed</Link>
          <Link href="/profile/edit/architect" className="btn-primary text-xs">Edit Profile</Link>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Posts", value: posts.length },
          { label: "Connections", value: accepted.length },
          { label: "Archived", value: archivedPosts.length },
        ].map(s => (
          <div key={s.label} className="card p-4 text-center">
            <p className="display text-3xl">{s.value}</p>
            <p className="text-xs text-[var(--stone)] mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex border-b border-[var(--border)]">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key as any)}
            className={"px-5 py-3 text-sm transition-colors relative " + (tab === t.key ? "text-[var(--ink)] border-b-2 border-[var(--ink)]" : "text-[var(--stone)] hover:text-[var(--ink)]")}>
            {t.label}
            {t.badge > 0 ? (
              <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 bg-[var(--terracotta)] text-white text-[9px] rounded-full">{t.badge}</span>
            ) : t.count > 0 ? (
              <span className="ml-1.5 text-xs text-[var(--stone)]">({t.count})</span>
            ) : null}
          </button>
        ))}
      </div>

      {tab === "posts" && (
        <div className="space-y-4">
          {posts.length === 0 && (
            <div className="text-center py-16 text-[var(--stone)]">
              <p className="display text-3xl mb-2">No posts yet</p>
              <p className="text-sm">Share something on the <Link href="/feed" className="text-[var(--terracotta)] hover:underline">Feed</Link></p>
            </div>
          )}
          {posts.map((post: any) => (
            <div key={post.id} className="card p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-xs text-[var(--stone)] mb-2">{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}{DOT}{post.type}</p>
                  <p className="text-sm leading-relaxed">{post.content}</p>
                  {post.imageUrl && <img src={post.imageUrl} alt="" className="mt-3 rounded border border-[var(--border)] max-h-48 object-cover w-full" />}
                  <div className="flex items-center gap-4 mt-3 text-xs text-[var(--stone)]">
                    <span className="flex items-center gap-1"><Heart size={12} /> {post._count.likes}</span>
                    <span className="flex items-center gap-1"><MessageCircle size={12} /> {post._count.comments}</span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => archivePost(post.id)} title="Archive" className="p-2 text-[var(--stone)] hover:text-[var(--ink)] hover:bg-[var(--cream)] transition-colors rounded">
                    <Archive size={15} />
                  </button>
                  <button onClick={() => deletePost(post.id, false)} title="Delete" className="p-2 text-[var(--stone)] hover:text-red-500 hover:bg-red-50 transition-colors rounded">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "archived" && (
        <div className="space-y-4">
          {archivedPosts.length === 0 && (
            <div className="text-center py-16 text-[var(--stone)]">
              <p className="display text-3xl mb-2">No archived posts</p>
              <p className="text-sm">Archive posts to hide them from the feed without deleting them.</p>
            </div>
          )}
          {archivedPosts.map((post: any) => (
            <div key={post.id} className="card p-5 opacity-70">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] bg-[var(--border)] text-[var(--stone)] px-2 py-0.5 uppercase tracking-wider">Archived</span>
                    <span className="text-xs text-[var(--stone)]">{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                  </div>
                  <p className="text-sm leading-relaxed">{post.content}</p>
                  {post.imageUrl && <img src={post.imageUrl} alt="" className="mt-3 rounded border border-[var(--border)] max-h-48 object-cover w-full" />}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => unarchivePost(post.id)} title="Restore" className="p-2 text-[var(--stone)] hover:text-[var(--sage)] hover:bg-[var(--cream)] transition-colors rounded">
                    <ArchiveRestore size={15} />
                  </button>
                  <button onClick={() => deletePost(post.id, true)} title="Delete" className="p-2 text-[var(--stone)] hover:text-red-500 hover:bg-red-50 transition-colors rounded">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "connections" && (
        <div className="space-y-6">
          {pending.length > 0 && (
            <div>
              <h3 className="display text-2xl mb-4">Pending Requests <span className="text-[var(--terracotta)]">({pending.length})</span></h3>
              <div className="space-y-3">
                {pending.map((c: any) => (
                  <div key={c.id} className="card p-4 flex items-center gap-4">
                    <AV image={c.sender.image} name={c.sender.name} size={44} />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{c.sender.name}</p>
                      <p className="text-xs text-[var(--stone)] capitalize">{c.sender.role.toLowerCase()}</p>
                      <p className="text-xs text-[var(--stone)] mt-0.5">{formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => respondConnection(c.id, "accepted")} className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--ink)] text-[var(--cream)] text-xs hover:bg-[var(--terracotta)] transition-colors">
                        <Check size={13} /> Accept
                      </button>
                      <button onClick={() => respondConnection(c.id, "declined")} className="flex items-center gap-1.5 px-3 py-1.5 border border-[var(--border)] text-xs hover:border-red-300 hover:text-red-500 transition-colors">
                        <X size={13} /> Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sent.length > 0 && (
            <div>
              <h3 className="display text-2xl mb-4">Sent Requests ({sent.length})</h3>
              <div className="space-y-3">
                {sent.map((c: any) => (
                  <div key={c.id} className="card p-4 flex items-center gap-4">
                    <AV image={c.receiver.image} name={c.receiver.name} size={44} />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{c.receiver.name}</p>
                      <p className="text-xs text-[var(--stone)] capitalize">{c.receiver.role.toLowerCase()}</p>
                      <p className="text-xs text-[var(--stone)] mt-0.5">Pending{DOT}{formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}</p>
                    </div>
                    <button onClick={() => removeConnection(c.id)} className="text-xs text-[var(--stone)] hover:text-red-500 transition-colors px-3 py-1.5 border border-[var(--border)]">
                      Cancel
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="display text-2xl mb-4">My Network ({accepted.length})</h3>
            {accepted.length === 0 && (
              <div className="text-center py-12 text-[var(--stone)]">
                <Users size={36} className="mx-auto mb-3 opacity-30" />
                <p className="display text-2xl mb-2">No connections yet</p>
                <p className="text-sm">Browse <Link href="/architects" className="text-[var(--terracotta)] hover:underline">architects</Link> and send connection requests.</p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {accepted.map((c: any) => {
                const other = c.senderId === user.id ? c.receiver : c.sender;
                return (
                  <div key={c.id} className="card p-4 flex items-center gap-3">
                    <AV image={other.image} name={other.name} size={44} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{other.name}</p>
                      <p className="text-xs text-[var(--stone)] capitalize">{other.role.toLowerCase()}</p>
                    </div>
                    <div className="flex gap-2">
                      {other.role === "ARCHITECT" && (
                        <Link href={"/architects/" + other.id} className="text-xs text-[var(--terracotta)] hover:underline px-2">View</Link>
                      )}
                      <button onClick={() => removeConnection(c.id)} className="text-xs text-[var(--stone)] hover:text-red-500 transition-colors">
                        <UserX size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
