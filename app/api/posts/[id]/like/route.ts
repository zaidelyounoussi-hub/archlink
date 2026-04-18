export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createNotification } from "@/lib/notifications";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;
  const postId = params.id;

  const existing = await prisma.like.findUnique({ where: { userId_postId: { userId, postId } } });

  if (existing) {
    await prisma.like.delete({ where: { userId_postId: { userId, postId } } });
    return NextResponse.json({ liked: false });
  } else {
    await prisma.like.create({ data: { userId, postId } });

    const post = await prisma.post.findUnique({ where: { id: postId }, select: { authorId: true, content: true } });
    const liker = await prisma.user.findUnique({ where: { id: userId }, select: { name: true, image: true } });

    if (post && post.authorId !== userId) {
      await createNotification({
        userId: post.authorId,
        type: "like",
        title: (liker?.name ?? "Someone") + " liked your post",
        body: post.content.slice(0, 80) + (post.content.length > 80 ? "..." : ""),
        link: "/posts/" + postId,
        actorName: liker?.name ?? undefined,
        actorImage: liker?.image ?? undefined,
      });
    }

    return NextResponse.json({ liked: true });
  }
}