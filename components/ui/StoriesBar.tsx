"use client";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { X, Plus, ImagePlus, Loader2 } from "lucide-react";

const COLORS = ["#891D1A", "#210706", "#5E657B", "#2D4A3E", "#4A2D5A", "#1A3A5A", "#5A3A1A"];

function Avatar({ image, name, size }: { image?: string | null; name?: string | null; size: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", overflow: "hidden", background: "var(--cream)", border: "2px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      {image ? <img src={image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: size * 0.35 }}>{name?.[0]?.toUpperCase() ?? "?"}</span>}
    </div>
  );
}

function StoryCard({ group, onClick, scale = 1 }: { group: any; onClick: () => void; scale?: number }) {
  const story = group.stories[0];
  return (
    <div onClick={onClick} style={{
      width: 340 * scale, height: "90vh", maxHeight: 700 * scale,
      borderRadius: 16, overflow: "hidden", cursor: "pointer",
      background: story?.bgColor || "#891D1A", position: "relative",
      flexShrink: 0, opacity: scale < 1 ? 0.6 : 1,
      transition: "all 0.3s ease",
    }}>
      {story?.imageUrl && <img src={story.imageUrl} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />}
      {story?.text && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <p style={{ color: story.textColor || "#fff", fontSize: 18 * scale, fontFamily: "Cormorant Garamond, serif", textAlign: "center", textShadow: "0 2px 8px rgba(0,0,0,0.5)", margin: 0 }}>{story.text}</p>
        </div>
      )}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 16px", background: "linear-gradient(transparent, rgba(0,0,0,0.5))" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Avatar image={group.user.image} name={group.user.name} size={32} />
          <p style={{ color: "white", fontSize: 13, fontWeight: 600, margin: 0 }}>{group.user.name}</p>
        </div>
      </div>
    </div>
  );
}

function StoryViewer({ groups, startIdx, onClose, onSeen }: { groups: any[]; startIdx: number; onClose: () => void; onSeen: (id: string) => void }) {
  const [groupIdx, setGroupIdx] = useState(startIdx);
  const [storyIdx, setStoryIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<any>(null);
  const DURATION = 5000;

  const group = groups[groupIdx];
  const story = group?.stories[storyIdx];

  useEffect(() => {
    if (!story) return;
    fetch("/api/stories/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ storyId: story.id }),
    }).then(() => onSeen(group.user.id));

    setProgress(0);
    const start = Date.now();
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      const pct = ((Date.now() - start) / DURATION) * 100;
      if (pct >= 100) {
        clearInterval(intervalRef.current);
        goNext();
      } else setProgress(pct);
    }, 50);
    return () => clearInterval(intervalRef.current);
  }, [groupIdx, storyIdx]);

  const goNext = () => {
    if (storyIdx < group.stories.length - 1) { setStoryIdx(i => i + 1); }
    else if (groupIdx < groups.length - 1) { setGroupIdx(i => i + 1); setStoryIdx(0); }
    else onClose();
  };

  const goPrev = () => {
    if (storyIdx > 0) { setStoryIdx(i => i - 1); }
    else if (groupIdx > 0) { setGroupIdx(i => i - 1); setStoryIdx(0); }
  };

  const prevGroup = groupIdx > 0 ? groups[groupIdx - 1] : null;
  const nextGroup = groupIdx < groups.length - 1 ? groups[groupIdx + 1] : null;

  if (!story) return null;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.97)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>

      {/* Prev story preview */}
      <div style={{ position: "absolute", left: "calc(50% - 520px)", top: "50%", transform: "translateY(-50%)", opacity: prevGroup ? 1 : 0, pointerEvents: prevGroup ? "auto" : "none" }}>
        {prevGroup && <StoryCard group={prevGroup} onClick={(e: any) => { e.stopPropagation(); setGroupIdx(i => i - 1); setStoryIdx(0); }} scale={0.75} />}
      </div>

      {/* Main story */}
      <div style={{ width: 360, height: "90vh", maxHeight: 720, borderRadius: 16, overflow: "hidden", position: "relative", flexShrink: 0, background: story.bgColor || "#891D1A" }} onClick={e => e.stopPropagation()}>

        {/* Image */}
        {story.imageUrl && <img src={story.imageUrl} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />}

        {/* Text */}
        {story.text && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: 28, zIndex: 2 }}>
            <p style={{ color: story.textColor || "#fff", fontSize: 24, fontFamily: "Cormorant Garamond, serif", textAlign: "center", textShadow: "0 2px 12px rgba(0,0,0,0.6)", margin: 0, lineHeight: 1.4 }}>{story.text}</p>
          </div>
        )}

        {/* Progress bars */}
        <div style={{ position: "absolute", top: 12, left: 12, right: 12, display: "flex", gap: 4, zIndex: 10 }}>
          {group.stories.map((_: any, i: number) => (
            <div key={i} style={{ flex: 1, height: 3, background: "rgba(255,255,255,0.35)", borderRadius: 2, overflow: "hidden" }}>
              <div style={{ height: "100%", background: "white", width: i < storyIdx ? "100%" : i === storyIdx ? progress + "%" : "0%", transition: "width 0.05s linear", borderRadius: 2 }} />
            </div>
          ))}
        </div>

        {/* Header */}
        <div style={{ position: "absolute", top: 24, left: 12, right: 12, display: "flex", alignItems: "center", gap: 10, zIndex: 10 }}>
          <Avatar image={group.user.image} name={group.user.name} size={38} />
          <div>
            <p style={{ color: "white", fontSize: 14, fontWeight: 600, margin: 0 }}>{group.user.name}</p>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, margin: 0 }}>{Math.round((new Date(story.expiresAt).getTime() - Date.now()) / 3600000)}h remaining</p>
          </div>
          <button onClick={(e) => { e.stopPropagation(); onClose(); }} style={{ marginLeft: "auto", background: "rgba(0,0,0,0.3)", border: "none", borderRadius: "50%", width: 32, height: 32, color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 20 }}>
            <X size={16} />
          </button>
        </div>

        {/* Navigation tap zones */}
        <div style={{ position: "absolute", inset: 0, display: "flex", zIndex: 5 }}>
          <div style={{ flex: 1 }} onClick={goPrev} />
          <div style={{ flex: 1 }} onClick={goNext} />
        </div>
      </div>

      {/* Next story preview */}
      <div style={{ position: "absolute", right: "calc(50% - 520px)", top: "50%", transform: "translateY(-50%)", opacity: nextGroup ? 1 : 0, pointerEvents: nextGroup ? "auto" : "none" }}>
        {nextGroup && <StoryCard group={nextGroup} onClick={(e: any) => { e.stopPropagation(); setGroupIdx(i => i + 1); setStoryIdx(0); }} scale={0.75} />}
      </div>

      {/* Arrow buttons */}
      {prevGroup && (
        <button onClick={e => { e.stopPropagation(); setGroupIdx(i => i - 1); setStoryIdx(0); }} style={{ position: "absolute", left: "calc(50% - 240px)", top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "50%", width: 44, height: 44, color: "white", cursor: "pointer", fontSize: 22, zIndex: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
      )}
      {nextGroup && (
        <button onClick={e => { e.stopPropagation(); setGroupIdx(i => i + 1); setStoryIdx(0); }} style={{ position: "absolute", right: "calc(50% - 240px)", top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "50%", width: 44, height: 44, color: "white", cursor: "pointer", fontSize: 22, zIndex: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
      )}
    </div>
  );
}

function CreateStoryModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [bgColor, setBgColor] = useState(COLORS[0]);
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [uploading, setUploading] = useState(false);
  const [posting, setPosting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
    if ((!text.trim() && !imageUrl) || posting) return;
    setPosting(true);
    await fetch("/api/stories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, imageUrl, bgColor, textColor }),
    });
    onCreated();
    onClose();
    setPosting(false);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
      <div style={{ background: "var(--card)", width: "100%", maxWidth: 440, borderRadius: 12, overflow: "hidden" }} onClick={e => e.stopPropagation()}>
        <div style={{ height: 240, background: bgColor, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {imagePreview && <img src={imagePreview} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />}
          {text && <p style={{ color: textColor, fontSize: 22, fontFamily: "Cormorant Garamond, serif", textAlign: "center", padding: 20, position: "relative", zIndex: 1, textShadow: "0 2px 8px rgba(0,0,0,0.5)", margin: 0 }}>{text}</p>}
          {!text && !imagePreview && <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>Story preview</p>}
          <button onClick={(e) => { e.stopPropagation(); onClose(); }} style={{ position: "absolute", top: 10, right: 10, background: "rgba(0,0,0,0.4)", border: "none", borderRadius: "50%", width: 30, height: 30, color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
            <X size={14} />
          </button>
        </div>
        <div style={{ padding: 20 }}>
          <textarea placeholder="Add text to your story..." value={text} onChange={e => setText(e.target.value)}
            style={{ width: "100%", minHeight: 70, padding: "10px 12px", border: "1px solid var(--border)", background: "var(--cream)", color: "var(--ink)", fontFamily: "DM Sans, sans-serif", fontSize: 14, resize: "none", boxSizing: "border-box", marginBottom: 14 }} />
          <p style={{ fontSize: 11, color: "var(--stone)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.1em" }}>Background</p>
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            {COLORS.map(c => (
              <button key={c} onClick={() => setBgColor(c)} style={{ width: 28, height: 28, borderRadius: "50%", background: c, border: bgColor === c ? "3px solid var(--terracotta)" : "2px solid transparent", cursor: "pointer" }} />
            ))}
          </div>
          <p style={{ fontSize: 11, color: "var(--stone)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.1em" }}>Text Color</p>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {["#FFFFFF", "#F1E6D2", "#891D1A", "#210706"].map(c => (
              <button key={c} onClick={() => setTextColor(c)} style={{ width: 28, height: 28, borderRadius: "50%", background: c, border: textColor === c ? "3px solid var(--terracotta)" : "2px solid var(--border)", cursor: "pointer" }} />
            ))}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px", border: "1px solid var(--border)", background: "transparent", color: "var(--stone)", cursor: "pointer", fontSize: 13 }}>
              {uploading ? <Loader2 size={15} /> : <ImagePlus size={15} />} {uploading ? "Uploading..." : "Add Image"}
            </button>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImage} />
            <button onClick={submit} disabled={posting || (!text.trim() && !imageUrl)} style={{ flex: 1, padding: "10px", background: "var(--ink)", color: "var(--cream)", border: "none", cursor: "pointer", fontSize: 13, opacity: posting || (!text.trim() && !imageUrl) ? 0.5 : 1 }}>
              {posting ? "Posting..." : "Share Story"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function StoriesBar({ userId }: { userId?: string } = {}) {
  const { data: session } = useSession();
  const [groups, setGroups] = useState<any[]>([]);
  const [viewing, setViewing] = useState<number | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); loadStories(); }, []);

  const loadStories = async () => {
    const res = await fetch("/api/stories");
    if (res.ok) setGroups(await res.json());
  };

  const markSeen = (authorId: string) => {
    setGroups(prev => prev.map(g =>
      g.user.id === authorId ? { ...g, allSeen: true, stories: g.stories.map((s: any) => ({ ...s, seen: true })) } : g
    ));
  };

  if (!mounted) return null;

  const myId = (session?.user as any)?.id;
  const myGroup = groups.find(g => g.user.id === myId);
  const myGroupIdx = groups.findIndex(g => g.user.id === myId);
  const displayGroups = userId ? groups.filter(g => g.user.id === userId) : groups;
  const otherGroups = displayGroups.filter(g => g.user.id !== myId);

  return (
    <>
      <div style={{ display: "flex", gap: 12, overflowX: "auto", padding: "16px 0", marginBottom: 8, scrollbarWidth: "none" }}>
        {!userId && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0 }}>
            <div style={{ position: "relative", width: 64, height: 64 }}>
              <div onClick={() => myGroup ? setViewing(myGroupIdx) : setShowCreate(true)} style={{ width: 64, height: 64, borderRadius: "50%", cursor: "pointer", padding: myGroup ? 2 : 0, background: myGroup ? (myGroup.allSeen ? "#9ca3af" : "linear-gradient(135deg, #891D1A, #C0413E)") : "transparent", border: myGroup ? "none" : "2px dashed var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: myGroup ? 56 : 60, height: myGroup ? 56 : 60, borderRadius: "50%", border: myGroup ? "2px solid var(--cream)" : "none", overflow: "hidden" }}>
                  <Avatar image={session?.user?.image} name={session?.user?.name} size={myGroup ? 56 : 60} />
                </div>
              </div>
              <button onClick={(e) => { e.stopPropagation(); setShowCreate(true); }} style={{ position: "absolute", bottom: 0, right: 0, width: 22, height: 22, borderRadius: "50%", background: "var(--terracotta)", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid var(--cream)", cursor: "pointer", zIndex: 5 }}>
                <Plus size={12} color="white" />
              </button>
            </div>
            <p style={{ fontSize: 11, color: "var(--stone)", margin: 0, whiteSpace: "nowrap" }}>Your Story</p>
          </div>
        )}

        {otherGroups.map((group) => {
          const actualIdx = groups.findIndex(g => g.user.id === group.user.id);
          const allSeen = group.allSeen;
          return (
            <div key={group.user.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0, cursor: "pointer" }} onClick={() => setViewing(actualIdx)}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", padding: 2, background: allSeen ? "#9ca3af" : "linear-gradient(135deg, #891D1A, #C0413E)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", border: "2px solid var(--cream)", overflow: "hidden" }}>
                  <Avatar image={group.user.image} name={group.user.name} size={56} />
                </div>
              </div>
              <p style={{ fontSize: 11, color: allSeen ? "var(--stone)" : "var(--ink)", margin: 0, whiteSpace: "nowrap", maxWidth: 64, overflow: "hidden", textOverflow: "ellipsis" }}>
                {group.user.name?.split(" ")[0]}
              </p>
            </div>
          );
        })}
      </div>

      {viewing !== null && (
        <StoryViewer
          groups={groups}
          startIdx={viewing}
          onClose={() => { setViewing(null); loadStories(); }}
          onSeen={markSeen}
        />
      )}

      {showCreate && (
        <CreateStoryModal onClose={() => setShowCreate(false)} onCreated={loadStories} />
      )}
    </>
  );
}
