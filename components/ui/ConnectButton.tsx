"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { UserPlus, UserCheck, Clock } from "lucide-react";

export function ConnectButton({ targetId }: { targetId: string }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [status, setStatus] = useState<"none" | "pending" | "accepted" | "sent">("none");
  const [connId, setConnId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!session) return;
    fetch("/api/connections").then(r => r.json()).then((conns: any[]) => {
      const userId = (session.user as any).id;
      const conn = conns.find(c =>
        (c.senderId === userId && c.receiverId === targetId) ||
        (c.senderId === targetId && c.receiverId === userId)
      );
      if (conn) {
        setConnId(conn.id);
        if (conn.status === "accepted") setStatus("accepted");
        else if (conn.senderId === userId) setStatus("sent");
        else setStatus("pending");
      }
    });
  }, [session, targetId]);

  if (!mounted) return null;

  const handleConnect = async () => {
    if (!session) { router.push("/login"); return; }
    setLoading(true);
    const res = await fetch("/api/connections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiverId: targetId }),
    });
    const data = await res.json();
    if (res.ok) { setConnId(data.id); setStatus("sent"); }
    setLoading(false);
  };

  const handleRemove = async () => {
    if (!connId) return;
    setLoading(true);
    await fetch("/api/connections/" + connId, { method: "DELETE" });
    setStatus("none");
    setConnId(null);
    setLoading(false);
  };

  const base: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: "8px 18px", fontSize: 12, fontFamily: "DM Sans, sans-serif",
    letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer",
    transition: "all 0.2s", border: "1px solid", whiteSpace: "nowrap",
  };

  if (status === "accepted") return (
    <button onClick={handleRemove} disabled={loading} style={{ ...base, background: "transparent", color: "#5E657B", borderColor: "#5E657B" }}>
      <UserCheck size={14} /> Connected
    </button>
  );

  if (status === "sent") return (
    <button onClick={handleRemove} disabled={loading} style={{ ...base, background: "transparent", color: "#F1E6D2", borderColor: "#7A6A6A" }}>
      <Clock size={14} /> Pending
    </button>
  );

  if (status === "pending") return (
    <div style={{ display: "flex", gap: 8 }}>
      <button
        onClick={() => fetch("/api/connections/" + connId, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "accepted" }) }).then(() => setStatus("accepted"))}
        style={{ ...base, background: "#5E657B", color: "white", borderColor: "#5E657B" }}>
        Accept
      </button>
      <button onClick={handleRemove} style={{ ...base, background: "transparent", color: "#F1E6D2", borderColor: "#7A6A6A" }}>
        Decline
      </button>
    </div>
  );

  return (
    <button onClick={handleConnect} disabled={loading}
      style={{ ...base, background: "transparent", color: "#F1E6D2", borderColor: "#F1E6D2" }}
      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#891D1A"; (e.currentTarget as HTMLButtonElement).style.borderColor = "#891D1A"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.borderColor = "#F1E6D2"; }}
    >
      <UserPlus size={14} /> {loading ? "..." : "Connect"}
    </button>
  );
}