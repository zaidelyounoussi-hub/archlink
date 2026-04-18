export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;

  const saved = await prisma.savedPost.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      post: {
        include: {
          author: { select: { id: true, name: true, image: true, role: true, architectProfile: { select: { specialty: true } } } },
          likes: { select: { userId: true } },
          _count: { select: { likes: true, comments: true } },
        },
      },
    },
  });

  return NextResponse.json(saved.map(s => s.post));
}