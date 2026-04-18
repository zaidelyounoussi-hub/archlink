"use client";
import dynamic from "next/dynamic";

const NavbarInner = dynamic(() => import("./NavbarInner"), { ssr: false });

export function Navbar() {
  return <NavbarInner />;
}