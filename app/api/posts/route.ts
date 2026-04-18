export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = session ? (session.user as any).id : null;
  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor");
  const take = 10;

  const posts = await prisma.post.findMany({
    take,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    where: { archived: false },
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { id: true, name: true, image: true, role: true, architectProfile: { select: { specialty: true } } } },
      likes: { select: { userId: true } },
      comments: { take: 3, orderBy: { createdAt: "desc" }, include: { author: { select: { id: true, name: true, image: true } } } },
      savedBy: userId ? { where: { userId }, select: { userId: true } } : false,
      _count: { select: { likes: true, comments: true } },
    },
  });

  const nextCursor = posts.length === take ? posts[posts.length - 1].id : null;
  return NextResponse.json({ posts, nextCursor });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { content, imageUrl, type } = await req.json();
  if (!content?.trim()) return NextResponse.json({ error: "Content required" }, { status: 400 });

  const dbUser = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
    select: { id: true, name: true, image: true, role: true, architectProfile: { select: { specialty: true } } },
  });

  const post = await prisma.post.create({
    data: { authorId: (session.user as any).id, content: content.trim(), imageUrl: imageUrl || null, type: type || "update" },
    include: {
      author: { select: { id: true, name: true, image: true, role: true, architectProfile: { select: { specialty: true } } } },
      likes: { select: { userId: true } },
      comments: { take: 3, include: { author: { select: { id: true, name: true, image: true } } } },
      savedBy: { select: { userId: true } },
      _count: { select: { likes: true, comments: true } },
    },
  });

  const safePost = { ...post, author: { ...post.author, image: dbUser?.image ?? post.author.image ?? null } };
  return NextResponse.json(safePost);
}