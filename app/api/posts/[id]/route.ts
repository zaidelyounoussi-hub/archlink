export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const post = await prisma.post.findUnique({ where: { id: params.id } });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (post.authorId !== (session.user as any).id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await prisma.post.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const post = await prisma.post.findUnique({ where: { id: params.id } });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (post.authorId !== (session.user as any).id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { content, type, archived } = await req.json();

  const updated = await prisma.post.update({
    where: { id: params.id },
    data: {
      ...(content !== undefined ? { content: content.trim() } : {}),
      ...(type !== undefined ? { type } : {}),
      ...(archived !== undefined ? { archived } : {}),
    },
    include: {
      author: { select: { id: true, name: true, image: true, role: true, architectProfile: { select: { specialty: true } } } },
      likes: { select: { userId: true } },
      comments: { take: 3, orderBy: { createdAt: "desc" }, include: { author: { select: { id: true, name: true, image: true } } } },
      _count: { select: { likes: true, comments: true } },
    },
  });

  return NextResponse.json(updated);
}