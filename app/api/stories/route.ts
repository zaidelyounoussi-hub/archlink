import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const myId = session ? (session.user as any).id : null;
  const now = new Date();

  const stories = await prisma.story.findMany({
    where: { expiresAt: { gt: now } },
    include: {
      author: { select: { id: true, name: true, image: true } },
      views: { select: { userId: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // Group by author
  const grouped: Record<string, any> = {};
  for (const story of stories) {
    if (!grouped[story.authorId]) {
      grouped[story.authorId] = {
        user: story.author,
        stories: [],
        allSeen: true,
      };
    }
    const seen = story.views.some((v: any) => v.userId === myId);
    if (!seen) grouped[story.authorId].allSeen = false;
    grouped[story.authorId].stories.push({ ...story, seen });
  }

  const result = Object.values(grouped);

  // My story always first
  if (myId) {
    result.sort((a: any, b: any) => {
      if (a.user.id === myId) return -1;
      if (b.user.id === myId) return 1;
      if (a.allSeen !== b.allSeen) return a.allSeen ? 1 : -1;
      return 0;
    });
  }

  return NextResponse.json(result);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { imageUrl, text, textColor, bgColor } = await req.json();
  if (!imageUrl && !text) return NextResponse.json({ error: "Content required" }, { status: 400 });

  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const story = await prisma.story.create({
    data: {
      authorId: (session.user as any).id,
      imageUrl,
      text,
      textColor: textColor ?? "#FFFFFF",
      bgColor: bgColor ?? "#891D1A",
      expiresAt,
    },
    include: { author: { select: { id: true, name: true, image: true } } },
  });

  return NextResponse.json(story);
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await prisma.story.deleteMany({
    where: { id, authorId: (session.user as any).id },
  });

  return NextResponse.json({ ok: true });
}
