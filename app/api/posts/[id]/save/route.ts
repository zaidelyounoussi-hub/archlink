import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;
  const postId = params.id;

  const existing = await prisma.savedPost.findUnique({
    where: { userId_postId: { userId, postId } },
  });

  if (existing) {
    await prisma.savedPost.delete({ where: { userId_postId: { userId, postId } } });
    return NextResponse.json({ saved: false });
  } else {
    await prisma.savedPost.create({ data: { userId, postId } });
    return NextResponse.json({ saved: true });
  }
}