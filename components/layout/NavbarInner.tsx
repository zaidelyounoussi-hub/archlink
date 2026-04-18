"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Menu, X, MessageSquare, User, LogOut, ChevronDown, Pencil, Rss, CircleUser, Bookmark } from "lucide-react";
import dynamic from "next/dynamic";
const LanguageSwitcher = dynamic(() => import("@/components/ui/LanguageSwitcher").then(m => ({ default: m.LanguageSwitcher })), { ssr: false });
const ThemeToggle = dynamic(() => import("@/components/ui/ThemeToggle").then(m => ({ default: m.ThemeToggle })), { ssr: false });
import { NotificationBell } from "@/components/ui/NotificationBell";

export default function NavbarInner() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/");

  const role = (session?.user as any)?.role;
  const dashboardLink = role === "ARCHITECT" ? "/dashboard/architect" : "/dashboard/client";
  const homeLink = session ? "/feed" : "/";
  const editProfileLink = role === "ARCHITECT" ? "/profile/edit/architect" : "/profile/edit/client";
  const userImage = session?.user?.image;
  const userName = session?.user?.name;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--cream)]/90 backdrop-blur-sm border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
        <Link href={homeLink ?? "/"} style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <img src="/logo.png" alt="ArchLink" className="logo-img" style={{ width: 38, height: 38, objectFit: "contain" }} />
          <span className="display text-2xl text-[var(--ink)]">ArchLink</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/architects" className="text-sm transition-colors flex items-center gap-1.5" style={{ color: isActive("/architects") ? "var(--ink)" : "var(--stone)", fontWeight: isActive("/architects") ? 700 : 400 }}>
            Browse
          </Link>
          {session ? (
            <>
              <Link href="/feed" className="text-sm transition-colors flex items-center gap-1.5" style={{ color: isActive("/feed") ? "var(--ink)" : "var(--stone)", fontWeight: isActive("/feed") ? 700 : 400 }}>
                <Rss size={15} /> Feed
              </Link>
              <Link href="/messages" className="text-sm transition-colors flex items-center gap-1.5" style={{ color: isActive("/messages") ? "var(--ink)" : "var(--stone)", fontWeight: isActive("/messages") ? 700 : 400 }}>
                <MessageSquare size={15} /> Messages
              </Link>
              <LanguageSwitcher />
              <ThemeToggle />
              <NotificationBell />
              <div className="relative">
                <button onClick={() => setDropOpen(!dropOpen)} className="flex items-center gap-2 text-sm text-[var(--stone)] hover:text-[var(--ink)] transition-colors">
                  {userImage ? (
                    <img src={userImage} alt="" className="w-7 h-7 rounded-full object-cover border-2 border-[var(--terracotta)]" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[var(--terracotta)] flex items-center justify-center text-white text-xs">
                      {userName?.[0]?.toUpperCase() ?? "U"}
                    </div>
                  )}
                  <span>{userName?.split(" ")[0]}</span>
                  <ChevronDown size={14} />
                </button>
                {dropOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 card py-1 shadow-lg z-50">
                    <div className="px-4 py-3 border-b border-[var(--border)]">
                      <p className="text-sm font-medium truncate">{userName}</p>
                      <p className="text-xs text-[var(--stone)] capitalize">{role?.toLowerCase()}</p>
                    </div>
                    <Link href={dashboardLink} className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-[var(--cream)] transition-colors" onClick={() => setDropOpen(false)}>
                      <User size={15} /> Dashboard
                    </Link>
                    <Link href="/account" className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-[var(--cream)] transition-colors" onClick={() => setDropOpen(false)}>
                      <CircleUser size={15} /> My Account
                    </Link>
                    <Link href={editProfileLink} className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-[var(--cream)] transition-colors" onClick={() => setDropOpen(false)}>
                      <Pencil size={15} /> Edit Profile
                    </Link>
                    <Link href="/saved" className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-[var(--cream)] transition-colors" onClick={() => setDropOpen(false)}>
                      <Bookmark size={15} /> Saved Posts
                    </Link>
                    <div className="border-t border-[var(--border)] mt-1">
                      <button onClick={() => { signOut({ callbackUrl: "/" }); setDropOpen(false); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-[var(--cream)] transition-colors text-left text-[var(--stone)]">
                        <LogOut size={15} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-[var(--stone)] hover:text-[var(--ink)] transition-colors">Sign In</Link>
              <Link href="/signup" className="btn-primary text-xs">Get Started</Link>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-[var(--border)] bg-[var(--cream)] px-6 py-6 space-y-4">
          <Link href="/architects" className="block text-sm py-2" style={{ fontWeight: isActive("/architects") ? 700 : 400 }} onClick={() => setOpen(false)}>Browse Architects</Link>
          {session ? (
            <>
              <div className="flex items-center gap-3 py-2 border-b border-[var(--border)]">
                {userImage ? (
                  <img src={userImage} alt="" className="w-9 h-9 rounded-full object-cover border-2 border-[var(--terracotta)]" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[var(--terracotta)] flex items-center justify-center text-white text-sm">
                    {userName?.[0]?.toUpperCase() ?? "U"}
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium">{userName}</p>
                  <p className="text-xs text-[var(--stone)] capitalize">{role?.toLowerCase()}</p>
                </div>
              </div>
              <Link href="/feed" className="block text-sm py-2" style={{ fontWeight: isActive("/feed") ? 700 : 400 }} onClick={() => setOpen(false)}>Feed</Link>
              <Link href="/messages" className="block text-sm py-2" style={{ fontWeight: isActive("/messages") ? 700 : 400 }} onClick={() => setOpen(false)}>Messages</Link>
              <Link href={dashboardLink} className="block text-sm py-2" onClick={() => setOpen(false)}>Dashboard</Link>
              <Link href={editProfileLink} className="block text-sm py-2" onClick={() => setOpen(false)}>Edit Profile</Link>
              <div className="py-2"><ThemeToggle /></div>
              <button onClick={() => signOut({ callbackUrl: "/" })} className="block text-sm py-2 text-[var(--stone)]">Sign Out</button>
            </>
          ) : (
            <>
              <Link href="/login" className="block text-sm py-2" onClick={() => setOpen(false)}>Sign In</Link>
              <Link href="/signup" className="block btn-primary text-center text-xs" onClick={() => setOpen(false)}>Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
