export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { storyId } = await req.json();
  if (!storyId) return NextResponse.json({ error: "Missing storyId" }, { status: 400 });

  await prisma.storyView.upsert({
    where: { storyId_userId: { storyId, userId: (session.user as any).id } },
    create: { storyId, userId: (session.user as any).id },
    update: {},
  });

  return NextResponse.json({ ok: true });
}
