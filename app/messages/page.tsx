"use client";
import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Send, MessageSquare } from "lucide-react";
import { formatDistanceToNow, differenceInMinutes } from "date-fns";
import Link from "next/link";

interface User { id: string; name: string | null; image: string | null; role?: string; }
interface Message { id: string; senderId: string; content: string; createdAt: string; sender: User; }
interface Conversation { user: User; lastMessage: any; unread: number; }

function OnlineBadge({ userId }: { userId: string }) {
  const [lastSeen, setLastSeen] = useState<Date | null>(null);

  useEffect(() => {
    const fetchPresence = async () => {
      const res = await fetch("/api/presence?userId=" + userId);
      if (res.ok) {
        const data = await res.json();
        setLastSeen(data.lastSeenAt ? new Date(data.lastSeenAt) : null);
      }
    };
    fetchPresence();
    const interval = setInterval(fetchPresence, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  const isOnline = lastSeen && differenceInMinutes(new Date(), lastSeen) < 2;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <span style={{
        width: 8, height: 8, borderRadius: "50%",
        background: isOnline ? "#22c55e" : "#9ca3af",
        display: "inline-block", flexShrink: 0,
      }} />
      <span style={{ fontSize: 11, color: "#9ca3af" }}>
        {isOnline ? "Online" : lastSeen ? "Last seen " + formatDistanceToNow(lastSeen, { addSuffix: true }) : "Offline"}
      </span>
    </div>
  );
}

function Avatar({ user, size }: { user: User; size: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: "#F1E6D2", border: "1px solid #DDD0BC", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
      {user.image
        ? <img src={user.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        : <span style={{ fontSize: size * 0.35 }}>{user.name?.[0] ?? "U"}</span>}
    </div>
  );
}

export default function MessagesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useSearchParams();
  const toId = params.get("to");

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(toId);
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<any>(null);

  // Ping presence every 30s
  useEffect(() => {
    if (status !== "authenticated") return;
    const ping = () => fetch("/api/presence", { method: "POST" });
    ping();
    const interval = setInterval(ping, 30000);
    return () => clearInterval(interval);
  }, [status]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status]);

  const loadConversations = async () => {
    const res = await fetch("/api/messages");
    if (res.ok) setConversations(await res.json());
  };

  const loadMessages = async (userId: string) => {
    const res = await fetch(`/api/messages?with=${userId}`);
    if (res.ok) setMessages(await res.json());
  };

  useEffect(() => { loadConversations(); }, []);

  useEffect(() => {
    if (!activeId) return;
    const conv = conversations.find((c) => c.user.id === activeId);
    if (conv) setActiveUser({ ...conv.user, role: (conv.user as any).role ?? "ARCHITECT" });
    else if (toId) {
      fetch(`/api/architects/${toId}/info`).then(r => r.json()).then(d => setActiveUser({ ...d, role: d.role ?? "ARCHITECT" })).catch(() => {});
    }
    loadMessages(activeId);
    pollRef.current = setInterval(() => loadMessages(activeId), 3000);
    return () => clearInterval(pollRef.current);
  }, [activeId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || !activeId || sending) return;
    setSending(true);
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiverId: activeId, content: input }),
    });
    if (res.ok) {
      const msg = await res.json();
      setMessages((prev) => [...prev, msg]);
      setInput("");
      loadConversations();
    }
    setSending(false);
  };

  const myId = (session?.user as any)?.id;
  if (status === "loading") return null;

  return (
    <>
      <Navbar />
      <main className="pt-16 h-screen flex flex-col">
        <div className="flex flex-1 overflow-hidden max-w-7xl mx-auto w-full border-x border-[var(--border)]">

          {/* Sidebar */}
          <div className="w-80 shrink-0 border-r border-[var(--border)] flex flex-col bg-[var(--card)]">
            <div className="p-5 border-b border-[var(--border)]">
              <h2 className="display text-2xl">Messages</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 && (
                <div className="p-8 text-center text-sm text-[var(--stone)]">No conversations yet.</div>
              )}
              {conversations.map((conv) => (
                <button
                  key={conv.user.id}
                  onClick={() => setActiveId(conv.user.id)}
                  className={`w-full flex items-center gap-3 p-4 border-b border-[var(--border)] hover:bg-[var(--cream)] transition-colors text-left ${activeId === conv.user.id ? "bg-[var(--cream)]" : ""}`}
                >
                  <div style={{ position: "relative" }}>
                    <Avatar user={conv.user} size={40} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium truncate">{conv.user.name}</p>
                      {conv.unread > 0 && (
                        <span className="w-5 h-5 bg-[var(--terracotta)] text-white text-[10px] rounded-full flex items-center justify-center shrink-0">
                          {conv.unread}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[var(--stone)] truncate">{conv.lastMessage?.content}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {activeId ? (
              <>
                {/* Header — clickable name/photo + online status */}
                <div className="p-4 border-b border-[var(--border)] bg-[var(--card)] flex items-center gap-3">
                  {activeUser && (
                    <>
                      <Link href={activeUser.role === "ARCHITECT" ? "/architects/" + activeUser.id : "/clients/" + activeUser.id} style={{ textDecoration: "none", flexShrink: 0 }}>
                        <Avatar user={activeUser} size={36} />
                      </Link>
                      <div>
                        <Link href={activeUser.role === "ARCHITECT" ? "/architects/" + activeUser.id : "/clients/" + activeUser.id} style={{ textDecoration: "none" }}>
                          <p className="font-medium text-sm hover:text-[var(--terracotta)] transition-colors">{activeUser.name}</p>
                        </Link>
                        <OnlineBadge userId={activeUser.id} />
                      </div>
                    </>
                  )}
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[var(--cream)]">
                  {messages.map((msg) => {
                    const isMe = msg.senderId === myId;
                    return (
                      <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                        {!isMe && (
                          <Link href={activeUser?.role === "ARCHITECT" ? "/architects/" + msg.senderId : "/clients/" + msg.senderId} style={{ marginRight: 8, flexShrink: 0, textDecoration: "none" }}>
                            <Avatar user={msg.sender} size={28} />
                          </Link>
                        )}
                        <div className={`max-w-[70%] px-4 py-3 text-sm leading-relaxed ${isMe ? "bg-[var(--ink)] text-[var(--cream)]" : "bg-[var(--card)] border border-[var(--border)] text-[var(--ink)]"}`}>
                          <p>{msg.content}</p>
                          <p className={`text-[10px] mt-1.5 ${isMe ? "text-white/50" : "text-[var(--stone)]"}`}>
                            {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-[var(--border)] bg-[var(--card)] flex gap-3">
                  <input
                    className="input flex-1"
                    placeholder="Write a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
                  />
                  <button onClick={send} disabled={sending || !input.trim()} className="btn-primary flex items-center gap-2 disabled:opacity-50">
                    <Send size={15} /> Send
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-[var(--stone)]">
                <MessageSquare size={40} className="mb-4 opacity-30" />
                <p className="display text-3xl mb-2">No conversation selected</p>
                <p className="text-sm">Pick a conversation or browse architects to start one.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
