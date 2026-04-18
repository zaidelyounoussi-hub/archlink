export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createNotification } from "@/lib/notifications";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const comments = await prisma.comment.findMany({
    where: { postId: params.id },
    orderBy: { createdAt: "asc" },
    include: { author: { select: { id: true, name: true, image: true } } },
  });
  return NextResponse.json(comments);
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { content } = await req.json();
  if (!content?.trim()) return NextResponse.json({ error: "Content required" }, { status: 400 });

  const authorId = (session.user as any).id;

  const comment = await prisma.comment.create({
    data: { authorId, postId: params.id, content: content.trim() },
    include: { author: { select: { id: true, name: true, image: true } } },
  });

  const post = await prisma.post.findUnique({ where: { id: params.id }, select: { authorId: true, content: true } });
  const commenter = await prisma.user.findUnique({ where: { id: authorId }, select: { name: true, image: true } });

  if (post && post.authorId !== authorId) {
    await createNotification({
      userId: post.authorId,
      type: "comment",
      title: (commenter?.name ?? "Someone") + " commented on your post",
      body: content.trim().slice(0, 80) + (content.length > 80 ? "..." : ""),
      link: "/posts/" + params.id,
      actorName: commenter?.name ?? undefined,
      actorImage: commenter?.image ?? undefined,
    });
  }

  return NextResponse.json(comment);
}