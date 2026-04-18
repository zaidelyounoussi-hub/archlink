export const dynamic = "force-dynamic";
"use client";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Bell, MessageSquare, Heart, MessageCircle, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

const TYPE_CONFIG: Record<string, { icon: any; color: string; label: string }> = {
  message: { icon: MessageSquare, color: "#5E657B", label: "Message" },
  like: { icon: Heart, color: "#891D1A", label: "Like" },
  comment: { icon: MessageCircle, color: "#891D1A", label: "Comment" },
  connection: { icon: Users, color: "#5E657B", label: "Connection" },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/notifications")
      .then(r => r.json())
      .then(data => { setNotifications(data.notifications); setLoading(false); });
    fetch("/api/notifications/read-all", { method: "PATCH" });
  }, []);

  const filtered = filter === "all" ? notifications : notifications.filter(n => n.type === filter);

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-[var(--cream)]">
        <div className="bg-[var(--ink)] py-12 px-6 lg:px-12">
          <div className="max-w-2xl mx-auto">
            <p className="text-xs tracking-[0.3em] uppercase text-[var(--terracotta)] mb-2">Activity</p>
            <h1 className="display text-5xl text-[var(--cream)]">Notifications</h1>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-6 py-10">
          {/* Filter tabs */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {[
              { key: "all", label: "All" },
              { key: "message", label: "Messages" },
              { key: "like", label: "Likes" },
              { key: "comment", label: "Comments" },
              { key: "connection", label: "Connections" },
            ].map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)}
                className={"px-4 py-1.5 text-xs border transition-all " + (filter === f.key ? "bg-[var(--ink)] text-[var(--cream)] border-[var(--ink)]" : "bg-white border-[var(--border)] text-[var(--stone)] hover:border-[var(--ink)]")}>
                {f.label}
              </button>
            ))}
          </div>

          {loading && (
            <div className="space-y-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="card p-4 animate-pulse flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--border)]" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-[var(--border)] rounded w-1/3" />
                    <div className="h-2 bg-[var(--border)] rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="text-center py-20">
              <Bell size={40} className="mx-auto mb-4 text-[var(--stone)] opacity-30" />
              <p className="display text-3xl text-[var(--stone)] mb-2">No notifications</p>
              <p className="text-sm text-[var(--stone)]">When someone messages, likes, or comments â€” it will appear here.</p>
            </div>
          )}

          <div className="space-y-2">
            {filtered.map(n => {
              const config = TYPE_CONFIG[n.type] ?? { icon: Bell, color: "#7A6A6A", label: "Notification" };
              const Icon = config.icon;
              return (
                <div key={n.id} className={"card overflow-hidden " + (!n.read ? "border-l-2 border-[var(--terracotta)]" : "")}>
                  <div className="p-4 flex items-start gap-4">
                    {/* Avatar */}
                    <div style={{ width: 44, height: 44, minWidth: 44, borderRadius: "50%", overflow: "hidden", background: "#F1E6D2", border: "1px solid #DDD0BC", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {n.actorImage
                        ? <img src={n.actorImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : <Icon size={18} style={{ color: config.color }} />
                      }
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium text-[var(--ink)]">{n.title}</p>
                          <p className="text-sm text-[var(--stone)] mt-0.5 leading-relaxed">{n.body}</p>
                          <p className="text-xs text-[var(--stone)] mt-1.5 opacity-60">
                            {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                        <span className="text-[10px] tracking-wider uppercase px-2 py-0.5 border border-[var(--border)] text-[var(--stone)] shrink-0">
                          {config.label}
                        </span>
                      </div>
                      {n.link && (
                        <Link href={n.link} className="inline-flex items-center gap-1 mt-2 text-xs text-[var(--terracotta)] hover:underline">
                          View â†’
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
}