import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createNotification } from "@/lib/notifications";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;
  const { searchParams } = new URL(req.url);
  const otherId = searchParams.get("with");

  if (otherId) {
    const messages = await prisma.message.findMany({
      where: { OR: [{ senderId: userId, receiverId: otherId }, { senderId: otherId, receiverId: userId }] },
      orderBy: { createdAt: "asc" },
      include: { sender: { select: { id: true, name: true, image: true } } },
    });
    await prisma.message.updateMany({
      where: { senderId: otherId, receiverId: userId, read: false },
      data: { read: true },
    });
    return NextResponse.json(messages);
  }

  const sent = await prisma.message.findMany({
    where: { senderId: userId },
    orderBy: { createdAt: "desc" },
    include: { receiver: { select: { id: true, name: true, image: true, role: true } } },
    distinct: ["receiverId"],
  });
  const received = await prisma.message.findMany({
    where: { receiverId: userId },
    orderBy: { createdAt: "desc" },
    include: { sender: { select: { id: true, name: true, image: true, role: true } } },
    distinct: ["senderId"],
  });

  const map = new Map<string, any>();
  for (const m of sent) {
    const other = m.receiver;
    if (!map.has(other.id)) map.set(other.id, { user: other, lastMessage: m, unread: 0 });
  }
  for (const m of received) {
    const other = m.sender;
    if (!map.has(other.id)) {
      const unread = await prisma.message.count({ where: { senderId: other.id, receiverId: userId, read: false } });
      map.set(other.id, { user: other, lastMessage: m, unread });
    }
  }

  return NextResponse.json(Array.from(map.values()));
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { receiverId, content } = await req.json();
  const senderId = (session.user as any).id;

  if (!receiverId || !content?.trim()) return NextResponse.json({ error: "Missing fields." }, { status: 400 });

  const sender = await prisma.user.findUnique({
    where: { id: senderId },
    select: { name: true, image: true },
  });

  const message = await prisma.message.create({
    data: { senderId, receiverId, content: content.trim() },
    include: { sender: { select: { id: true, name: true, image: true } } },
  });

  // Notification links directly to the conversation with the sender
  await createNotification({
    userId: receiverId,
    type: "message",
    title: "New message from " + (sender?.name ?? "someone"),
    body: content.trim().slice(0, 80) + (content.length > 80 ? "..." : ""),
    link: "/messages?to=" + senderId,
    actorName: sender?.name ?? undefined,
    actorImage: sender?.image ?? undefined,
  });

  return NextResponse.json(message);
}