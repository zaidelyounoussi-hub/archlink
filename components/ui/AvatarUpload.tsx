"use client";
import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { Camera, Loader2, X, Check } from "lucide-react";

interface Props {
  currentImage?: string | null;
  name?: string | null;
  size?: "sm" | "lg";
}

export function AvatarUpload({ currentImage, name, size = "lg" }: Props) {
  const { update } = useSession();
  const [image, setImage] = useState(currentImage);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const dim = size === "lg" ? "w-24 h-24" : "w-14 h-14";
  const textSize = size === "lg" ? "text-3xl" : "text-lg";
  const iconSize = size === "lg" ? 18 : 13;

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError("Max file size is 5MB"); return; }
    setError("");
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const confirmUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", selectedFile);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (res.ok) {
      setImage(data.url);
      setPreview(null);
      setSelectedFile(null);
      await update({ image: data.url });
      window.location.reload();
    } else {
      setError(data.error || "Upload failed");
      setUploading(false);
    }
  };

  const cancelPreview = () => {
    setPreview(null);
    setSelectedFile(null);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Avatar circle */}
      <div className={"relative group " + dim}>
        <div className="rounded-full overflow-hidden border-4 border-[var(--terracotta)] w-full h-full flex items-center justify-center bg-[var(--cream)]">
          {preview ? (
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          ) : image ? (
            <img src={image} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <span className={"display font-medium " + textSize}>{name?.[0]?.toUpperCase() ?? "?"}</span>
          )}
        </div>
        {!preview && !uploading && (
          <div
            className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
            onClick={() => inputRef.current?.click()}
          >
            <Camera size={iconSize} className="text-white" />
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
            <Loader2 size={iconSize} className="text-white animate-spin" />
          </div>
        )}
      </div>

      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

      {/* Preview confirmation */}
      {preview && !uploading && (
        <div className="flex flex-col items-center gap-2">
          <p className="text-xs text-[var(--stone)] text-center">Use this photo?</p>
          <div className="flex gap-2">
            <button
              onClick={confirmUpload}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--ink)] text-[var(--cream)] text-xs hover:bg-[var(--terracotta)] transition-colors"
            >
              <Check size={13} /> Confirm
            </button>
            <button
              onClick={cancelPreview}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-[var(--border)] text-xs hover:border-[var(--ink)] transition-colors"
            >
              <X size={13} /> Cancel
            </button>
          </div>
        </div>
      )}

      {!preview && !uploading && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="text-xs text-[var(--terracotta)] hover:underline"
        >
          {image ? "Change photo" : "Add photo"}
        </button>
      )}

      {uploading && <p className="text-xs text-[var(--stone)]">Uploading...</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}