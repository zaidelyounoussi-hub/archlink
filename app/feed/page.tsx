"use client";
import { StoriesBar } from "@/components/ui/StoriesBar";
import { ClientOnly } from "@/components/ui/ClientOnly";
import { Navbar } from "@/components/layout/Navbar";
import { Feed } from "@/components/ui/Feed";
import { useSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { X, Send, ImagePlus, Loader2 } from "lucide-react";

const AV = ({ image, name, size }: { image?: string | null; name?: string | null; size: number }) => (
  <div style={{ width: size, height: size, minWidth: size, borderRadius: "50%", overflow: "hidden", border: "2px solid var(--border)", background: "var(--cream)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    {image ? <img src={image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: size * 0.38, fontFamily: "Cormorant Garamond, serif" }}>{name?.[0]?.toUpperCase() ?? "?"}</span>}
  </div>
);

const POST_TYPES = [
  { value: "update", label: "General Update" },
  { value: "project", label: "Project Showcase" },
  { value: "question", label: "Question" },
  { value: "tip", label: "Tip & Advice" },
];

function CreatePostModal({ onClose, onPost, userAvatar, userName }: { onClose: () => void; onPost: (p: any) => void; userAvatar: string | null; userName: string | null }) {
  const [content, setContent] = useState("");
  const [type, setType] = useState("update");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImagePick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload-post", { method: "POST", body: fd });
    const data = await res.json();
    if (res.ok) setImageUrl(data.url);
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
    onClose();
    setPosting(false);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(33,7,6,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
      <div style={{ background: "var(--card)", width: "100%", maxWidth: 540, padding: 28, position: "relative" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <AV image={userAvatar} name={userName} size={42} />
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", margin: 0 }}>{userName}</p>
              <p style={{ fontSize: 11, color: "var(--stone)", margin: 0 }}>Share with everyone</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--stone)" }}>
            <X size={20} />
          </button>
        </div>

        <textarea
          autoFocus
          className="input"
          placeholder="Share a project, ask a question, or post an update..."
          value={content}
          onChange={e => setContent(e.target.value)}
          style={{ minHeight: 120, resize: "none", marginBottom: 16, width: "100%", boxSizing: "border-box" }}
        />

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
          {POST_TYPES.map(t => (
            <button key={t.value} type="button" onClick={() => setType(t.value)}
              style={{ padding: "6px 14px", fontSize: 11, border: "1px solid", cursor: "pointer", background: type === t.value ? "var(--ink)" : "white", color: type === t.value ? "var(--cream)" : "var(--stone)", borderColor: type === t.value ? "var(--ink)" : "var(--border)" }}>
              {t.label}
            </button>
          ))}
        </div>

        {imagePreview && (
          <div style={{ position: "relative", marginBottom: 16 }}>
            <img src={imagePreview} alt="" style={{ width: "100%", maxHeight: 200, objectFit: "cover", display: "block", border: "1px solid var(--border)" }} />
            {uploading && (
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Loader2 size={24} color="white" style={{ animation: "spin 1s linear infinite" }} />
              </div>
            )}
            {!uploading && (
              <button onClick={() => { setImageUrl(null); setImagePreview(null); }} style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.6)", color: "white", border: "none", borderRadius: "50%", width: 28, height: 28, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <X size={14} />
              </button>
            )}
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "var(--stone)" }}>
            <ImagePlus size={16} /> Add Photo
          </button>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImagePick} />
          <button onClick={submit} disabled={posting || !content.trim() || uploading} className="btn-primary" style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 6, opacity: posting || !content.trim() ? 0.5 : 1 }}>
            <Send size={13} /> {posting ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SuggestedPerson({ person, currentUserId }: { person: any; currentUserId: string }) {
  const [status, setStatus] = useState<"none" | "sent">("none");

  const handleConnect = async () => {
    if (status !== "none") return;
    setStatus("sent");
    const res = await fetch("/api/connections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiverId: person.id }),
    });
    if (!res.ok) setStatus("none");
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid #F9F6F0" }}>
      <Link href={person.role === "ARCHITECT" ? "/architects/" + person.id : "#"} style={{ flexShrink: 0 }}>
        <AV image={person.image} name={person.name} size={44} />
      </Link>
      <div style={{ flex: 1, minWidth: 0 }}>
        <Link href={person.role === "ARCHITECT" ? "/architects/" + person.id : "#"} style={{ textDecoration: "none" }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{person.name}</p>
        </Link>
        <p style={{ fontSize: 11, color: "var(--stone)", margin: "1px 0 0" }}>
          {person.architectProfile?.specialty ?? (person.role === "ARCHITECT" ? "Architect" : "Client")}
        </p>
      </div>
      <button onClick={handleConnect} disabled={status !== "none"} style={{ background: "none", border: "none", cursor: status === "none" ? "pointer" : "default", fontSize: 12, fontWeight: 600, color: status === "none" ? "#891D1A" : "var(--stone)", padding: 0, flexShrink: 0 }}>
        {status === "none" ? "Connect" : "Pending"}
      </button>
    </div>
  );
}

export default function FeedPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [suggested, setSuggested] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    if (status === "unauthenticated") router.push("/login");
  }, [status]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/suggestions").then(r => r.json()).then(data => setSuggested(data.users ?? [])).catch(() => {});
  }, [status]);

  if (!mounted || status === "loading") return null;

  const currentUserId = (session?.user as any)?.id ?? "";
  const userAvatar = session?.user?.image ?? null;
  const userName = session?.user?.name ?? null;

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 64, minHeight: "100vh", background: "var(--cream)" }}>
        <div style={{ maxWidth: 1050, margin: "0 auto", padding: "28px 16px", display: "grid", gridTemplateColumns: "1fr 300px", gap: 28, alignItems: "start" }}>

          {/* LEFT - Stories + Feed */}
<div>
  <ClientOnly><StoriesBar /></ClientOnly>
  <Feed hideCreatePost newPost={posts[0]} />
</div>

          {/* RIGHT - Suggested */}
          <div style={{ position: "sticky", top: 84 }}>
            <div style={{ background: "var(--card)", border: "1px solid var(--border)", padding: "16px 20px", marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "var(--stone)", margin: 0 }}>Suggested for you</p>
                <Link href="/architects" style={{ fontSize: 12, fontWeight: 700, color: "var(--ink)", textDecoration: "none" }}>See all</Link>
              </div>
              {suggested.map(person => (
                <SuggestedPerson key={person.id} person={person} currentUserId={currentUserId} />
              ))}
              {suggested.length === 0 && (
                <div style={{ padding: "12px 0" }}>
                  {[1,2,3,4].map(i => (
                    <div key={i} style={{ display: "flex", gap: 10, marginBottom: 12, opacity: 0.3 }}>
                      <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--border)", flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ height: 10, background: "var(--border)", borderRadius: 4, marginBottom: 6, width: "60%" }} />
                        <div style={{ height: 8, background: "var(--border)", borderRadius: 4, width: "40%" }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ padding: "0 4px" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 8px", marginBottom: 6 }}>
                {[["About", "/"], ["Messages", "/messages"], ["Saved", "/saved"], ["Notifications", "/notifications"], ["Browse", "/architects"]].map(([l, h]) => (
                  <Link key={l} href={h} style={{ fontSize: 11, color: "#AAA", textDecoration: "none" }}>{l}</Link>
                ))}
              </div>
              <p style={{ fontSize: 11, color: "#BBB", margin: 0 }}>ArchLink 2025 All rights reserved</p>
            </div>
          </div>
        </div>
      </main>

      {/* Floating create post button */}
      <button
        onClick={() => setShowModal(true)}
        style={{
          position: "fixed", bottom: 32, right: 32, zIndex: 50,
          width: 60, height: 60, borderRadius: "50%",
          background: "#C47A3A", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 20px rgba(33,7,6,0.3)",
          transition: "transform 0.2s",
          padding: 0,
        }}
        onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.1)"}
        onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"}
      >
        <svg width="28" height="28" viewBox="0 0 100 100" fill="none">
          <path d="M25 85 L25 50 Q25 20 50 20 Q75 20 75 50 L75 85" stroke="#6B3A2A" strokeWidth="12" strokeLinecap="round" fill="none"/>
        </svg>
        <span style={{ position: "absolute", bottom: -2, right: -2, width: 20, height: 20, background: "#891D1A", borderRadius: "50%", color: "white", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1, border: "2px solid #F1E6D2", fontWeight: 400 }}>+</span>
      </button>

      {/* Create post modal */}
      {showModal && (
        <CreatePostModal
          onClose={() => setShowModal(false)}
          onPost={(post) => { setPosts([post]); setShowModal(false); }}
          userAvatar={userAvatar}
          userName={userName}
        />
      )}
    </>
  );
}
