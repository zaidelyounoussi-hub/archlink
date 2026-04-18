"use client";
import { useState, useEffect, useRef } from "react";
import { Bell, Check, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import Link from "next/link";

const TYPE_ICONS: Record<string, string> = {
  message: "ðŸ’¬",
  like: "â¤ï¸",
  comment: "ðŸ’­",
  connection: "ðŸ¤",
};

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unread, setUnread] = useState(0);
  const [responding, setResponding] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const load = async () => {
    const res = await fetch("/api/notifications");
    if (!res.ok) return;
    const data = await res.json();
    setNotifications(data.notifications);
    setUnread(data.unreadCount);
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markAllRead = async () => {
    await fetch("/api/notifications/read-all", { method: "PATCH" });
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnread(0);
  };

  const handleOpen = () => {
    setOpen(!open);
    if (!open && unread > 0) setTimeout(markAllRead, 2000);
  };

  const handleClick = (n: any) => {
    if (n.type === "connection") return;
    setOpen(false);
    if (n.link) router.push(n.link);
  };

  const handleConnection = async (n: any, status: "accepted" | "declined") => {
    setResponding(n.id);
    const connsRes = await fetch("/api/connections");
    const conns = await connsRes.json();
    const conn = conns.find((c: any) =>
      c.status === "pending" &&
      (c.sender?.name === n.actorName || c.id === n.connectionId)
    );
    if (conn) {
      await fetch("/api/connections/" + conn.id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
    }
    setResponding(null);
    await load();
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={handleOpen} style={{ position: "relative", background: "none", border: "none", cursor: "pointer", padding: 6, color: "var(--stone)", display: "flex", alignItems: "center" }}>
        <Bell size={20} />
        {unread > 0 && (
          <span style={{ position: "absolute", top: 0, right: 0, background: "#891D1A", color: "white", borderRadius: "50%", width: 16, height: 16, fontSize: 9, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600 }}>
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", width: 380, background: "var(--card)", border: "1px solid #DDD0BC", boxShadow: "0 8px 32px rgba(33,7,6,0.12)", zIndex: 200, maxHeight: 520, display: "flex", flexDirection: "column" }}>

          <div style={{ padding: "14px 18px", borderBottom: "1px solid #DDD0BC", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 18, color: "var(--ink)" }}>Notifications</span>
            {unread > 0 && (
              <button onClick={markAllRead} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "#891D1A" }}>
                Mark all read
              </button>
            )}
          </div>

          <div style={{ overflowY: "auto", flex: 1 }}>
            {notifications.length === 0 && (
              <div style={{ padding: 40, textAlign: "center", color: "var(--stone)" }}>
                <Bell size={28} style={{ margin: "0 auto 10px", opacity: 0.3, display: "block" }} />
                <p style={{ fontSize: 13 }}>No notifications yet</p>
              </div>
            )}

            {notifications.map(n => (
              <div key={n.id}
                onClick={() => handleClick(n)}
                style={{
                  padding: "14px 18px",
                  borderBottom: "1px solid #F1E6D2",
                  background: n.read ? "white" : "#FDF8F2",
                  borderLeft: n.read ? "3px solid transparent" : "3px solid #891D1A",
                  cursor: n.type === "connection" ? "default" : "pointer",
                }}
              >
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ width: 40, height: 40, minWidth: 40, borderRadius: "50%", overflow: "hidden", background: "var(--cream)", border: "1px solid #DDD0BC", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                    {n.actorImage
                      ? <img src={n.actorImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <span>{TYPE_ICONS[n.type] ?? "ðŸ””"}</span>
                    }
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                      <p style={{ fontSize: 12, fontWeight: 600, color: "var(--ink)", margin: 0, lineHeight: 1.4 }}>{n.title}</p>
                      {!n.read && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#891D1A", flexShrink: 0, marginTop: 3 }} />}
                    </div>
                    <p style={{ fontSize: 12, color: "var(--stone)", margin: "3px 0 4px", lineHeight: 1.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {n.body}
                    </p>
                    <p style={{ fontSize: 10, color: "#AAA", margin: 0 }}>
                      {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                    </p>

                    {/* Connection: show buttons only if not yet responded */}
                    {n.type === "connection" && !n.responded && (
                      <div style={{ display: "flex", gap: 8, marginTop: 10 }} onClick={e => e.stopPropagation()}>
                        <button
                          disabled={responding === n.id}
                          onClick={() => handleConnection(n, "accepted")}
                          style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 16px", background: "var(--ink)", color: "var(--cream)", border: "none", cursor: "pointer", fontSize: 11, opacity: responding === n.id ? 0.6 : 1 }}
                        >
                          <Check size={12} /> {responding === n.id ? "..." : "Accept"}
                        </button>
                        <button
                          disabled={responding === n.id}
                          onClick={() => handleConnection(n, "declined")}
                          style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 16px", background: "transparent", color: "var(--stone)", border: "1px solid #DDD0BC", cursor: "pointer", fontSize: 11, opacity: responding === n.id ? 0.6 : 1 }}
                        >
                          <X size={12} /> Decline
                        </button>
                      </div>
                    )}

                    {/* Show result â€” persisted in database */}
                    {n.type === "connection" && n.responded === "accepted" && (
                      <div style={{ marginTop: 10, padding: "10px 14px", background: "var(--cream)", borderLeft: "3px solid #5E657B", display: "flex", alignItems: "center", gap: 10 }}>
                        <Check size={14} style={{ color: "var(--sage)", flexShrink: 0 }} />
                        <div>
                          <p style={{ fontSize: 12, fontWeight: 600, color: "var(--ink)", margin: 0 }}>You are now connected!</p>
                          <p style={{ fontSize: 11, color: "var(--stone)", margin: "2px 0 0" }}>You and {n.actorName} are friends on ArchLink.</p>
                        </div>
                      </div>
                    )}

                    {n.type === "connection" && n.responded === "declined" && (
                      <div style={{ marginTop: 10, padding: "8px 12px", background: "var(--card)", border: "1px solid #DDD0BC", display: "flex", alignItems: "center", gap: 8 }}>
                        <X size={13} style={{ color: "var(--stone)" }} />
                        <p style={{ fontSize: 11, color: "var(--stone)", margin: 0 }}>Request declined</p>
                      </div>
                    )}

                    {n.type !== "connection" && n.link && (
                      <p style={{ fontSize: 10, color: "#891D1A", marginTop: 4 }}>Tap to open â†’</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: "10px 18px", borderTop: "1px solid #DDD0BC", textAlign: "center" }}>
            <Link href="/notifications" onClick={() => setOpen(false)} style={{ fontSize: 11, color: "#891D1A", textDecoration: "none" }}>
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
