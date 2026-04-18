export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  await prisma.notification.deleteMany({
    where: { type: "connection" },
  });
  return NextResponse.json({ success: true, message: "Old connection notifications cleared" });
}